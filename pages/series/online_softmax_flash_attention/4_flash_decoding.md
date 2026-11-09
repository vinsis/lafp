---
title: Kernel visualization: Flash Decoding
description: Why Flash Attention leaves the GPU idle during decode, and how flash decoding splits the K/V sequence across blocks and merges the partial results, stepped through as tiles move between HBM and SRAM.
date: 2026-11-05
canvas: none
sidebar: _series.md
---

# Kernel visualization: Flash Decoding

Generating text with a transformer happens in two stages. First comes **prefill**, where the whole prompt goes through at once, so attention has hundreds or thousands of query rows to work on. Then comes **decode**, where tokens come out one at a time and each step has exactly one query row per head.

Flash Attention divides its work across query rows. That fits prefill well and decode badly, because in decode there is only one row to hand out. One thread block ends up walking the entire KV cache by itself while the rest of the GPU waits, and since every generated token reads that whole cache, this is where decode spends its time.

Flash decoding keeps the same math and changes what gets divided up: the K/V sequence instead of the query rows.

<details>
<summary>Overview of the algorithm</summary>

Standard FlashAttention parallelizes over query tiles (the outer $Q$ loop). At **decode time** there is only **one** query row per (batch, head), so that outer axis is width-1 — most of the GPU sits idle while a single thread block streams through the entire $K, V$ sequence.

**Flash decoding** fixes this by parallelizing over the $K, V$ sequence itself. Split $K, V$ along the sequence dimension into $\textcolor{#7c3aed}{n_{\text{splits}}}$ chunks and give each chunk to its own thread block. Each block runs FlashAttention's online softmax over its own slice and writes a *partial* $(O^{(s)}, m^{(s)}, \ell^{(s)})$. A second combine kernel merges them.

For a single query row $q$, per split $s \in \{0, \dots, n_{\text{splits}}{-}1\}$ covering $K, V$ indices in $[n_s, n_{s+1})$:

$$
\begin{aligned}
& \textbf{split } s:\\[8pt]
& \qquad m^{(s)} \;=\; \max_{j \in [n_s, n_{s+1})} \bigl(q \, K[j,:]^\top\bigr) \\[10pt]
& \qquad \ell^{(s)} \;=\; \sum_{j \in [n_s, n_{s+1})} e^{q K[j,:]^\top - m^{(s)}} \\[10pt]
& \qquad O^{(s)} \;=\; \sum_{j \in [n_s, n_{s+1})} e^{q K[j,:]^\top - m^{(s)}} \, V[j,:] \\[16pt]
& \textbf{combine:}\\[8pt]
& \qquad \textcolor{#1d4ed8}{m_g} \;=\; \max_s m^{(s)}, \qquad
       \textcolor{#047857}{\ell_g} \;=\; \sum_s e^{m^{(s)} - \textcolor{#1d4ed8}{m_g}}\, \ell^{(s)} \\[10pt]
& \qquad O \;=\; \frac{1}{\textcolor{#047857}{\ell_g}} \sum_s e^{m^{(s)} - \textcolor{#1d4ed8}{m_g}}\, O^{(s)}
\end{aligned}
$$

Each split stores $O^{(s)}$ **unnormalized** (no per-split $/\ell^{(s)}$ division) and the combine kernel applies a single global $/\ell_g$ at the end. The per-split weight $e^{m^{(s)} - m_g}$ rescales each unnormalized partial so its max aligns with $m_g$ — the same rescaling FlashAttention already does across inner tiles, lifted one level up across splits.

</details>

---

## Visualizing the steps in kernel
There are two kernels. The first launches one thread block per batch, head and split, so the splits run side by side; the second merges what they produce.

```python-editor collapsed
# Drawing helpers: memory slots in HBM and SRAM, and the actions the kernels below take on them.
# Each action is recorded into the current step; `show_steps` draws the steps.
import json
import math

INK, GRAY = '#27272a', '#3f3f46'  # text; outlines

SLOTS = []  # every slot, in drawing order: HBM first, so that data moving into SRAM passes over it

class Slot:
    """A place in HBM or SRAM that holds one tile, value or register, drawn as a w by h box centered at (x, y).
    `data`: what it holds at the start. `kind`: the palette its updates use. An SRAM slot is also drawn empty
    (`outline`), with `caption`, by default its name, under it."""
    def __init__(self, name, memory, x, y, w, h, data=None, font=14, kind=None, outline=None, caption=None):
        self.name, self.memory, self.x, self.y, self.w, self.h = name, memory, x, y, w, h
        self.initial, self.font, self.kind = data, font, kind
        self.outline = memory == 'sram' if outline is None else outline
        self.caption = name if caption is None else caption
        SLOTS.append(self)

def data(label='', fill='none', line=GRAY, level=0):
    """What a slot holds, as drawn: a label, a fill and an outline color. `level` counts its updates."""
    return dict(label=label, fill=fill, line=line, level=level)

def as_list(x):
    return list(x) if isinstance(x, (list, tuple)) else [x]

# ---- The actions ----

def new_figure(block=None, caption='Setup ready'):
    """Start recording. `block`: (square, slots) of the CUDA block SRAM shows from the start, or None."""
    global FRAMES, state, pending, block_now, transfers
    state = {s: s.initial for s in SLOTS}
    block_now, pending, transfers = block, {}, {'fetches': 0, 'stores': 0}
    FRAMES = [dict(label='start', caption=caption, events={}, state=dict(state), block=block)]

def content(slot):
    """What `slot` holds now, this step's actions included."""
    return pending[slot][2] if slot in pending else state[slot]

def move_data(src, dst):
    """Copy the data in `src` to `dst`, slots or lists of slots, e.g. a tile from HBM to SRAM. Data without a label
    takes the label `dst` had. One call is one transfer."""
    for a, b in zip(as_list(src), as_list(dst)):
        moved = dict(content(a))
        moved['label'] = moved['label'] or (content(b) or data())['label']
        pending[b] = ('move', a, moved, 0, 1)
    a, b = as_list(src)[0], as_list(dst)[0]
    if a.memory != b.memory:
        transfers['fetches' if a.memory == 'hbm' else 'stores'] += 1

def change(slots, one_by_one=False, **fields):
    """Change the data in `slots` in place: `fields` replace its label, fill, line or level.
    With `one_by_one`, the slots change one after another, e.g. the cells of a matrix."""
    slots = as_list(slots)
    for n, s in enumerate(slots):
        new = {**(content(s) or data()), **fields}
        pending[s] = ('change', None, new, n if one_by_one else 0, len(slots) if one_by_one else 1)

def run_block(square, slots):
    """From this step, SRAM shows the shared memory of the CUDA block at `square` of the SRAM grid: `slots`, empty."""
    global block_now
    block_now = (square, tuple(slots))
    for s in slots:
        state[s] = s.initial

def step(label, caption=None):
    """End a step. `label` names it in the step list; `caption`, by default `label`, is shown on the canvas."""
    for s, event in pending.items():
        state[s] = event[2]
    FRAMES.append(dict(label=label, caption=caption or label, events=dict(pending), state=dict(state), block=block_now))
    pending.clear()

# ---- Drawing: the whole figure is one Diagram node, and the step list changes it ----

def shown(s, frame):
    """Whether `frame` shows slot s: HBM always, SRAM while its CUDA block is the one shown."""
    return s.memory == 'hbm' or (frame['block'] is not None and s in frame['block'][1])

def item(x=0, y=0, w=0, h=0, fill='none', stroke='none', label='', font=12, wrap=0, line=False):
    """One shape of the diagram: a box with (x, y) its bottom-left corner, or a line from (x, y) to (x + w, y + h).
    A box of size 0 draws only its label."""
    return dict(x=round(x, 4), y=round(y, 4), w=round(w, 4), h=round(h, 4), fill=fill, stroke=stroke,
                label=label, font=font, wrap=wrap, line=line, color=INK)

ROLES = ('outline', 'under', 'top', 'ring', 'caption')  # each slot's items, in drawing order

def slot_items(s, k, phase):
    """Slot s's items at step k, by role: its empty outline and its caption, what it held before the step ('under'),
    what it holds ('top'), and a ring while it changes in place. `phase` is 'start', 'move' or 'end': how the step
    begins, where its moves go, and how it ends."""
    frame, items = FRAMES[k], dict.fromkeys(ROLES, item())
    if not shown(s, frame):
        return items
    bottom = s.y - s.h / 2

    def holding(d, cx=s.x, cy=s.y, h=s.h):
        return item(cx - s.w / 2, cy - s.h / 2, s.w, h, d['fill'], d['line'], d['label'], s.font) if d else item()

    if s.outline:
        items['outline'] = item(s.x - s.w / 2, bottom, s.w, s.h, stroke=GRAY)
        items['caption'] = item(s.x, bottom - 0.3, label=s.caption, font=min(s.font, 12))
    top, event = frame['state'][s], frame['events'].get(s)
    under = FRAMES[k - 1]['state'][s] if event else None
    if event is None or phase == 'end':
        items['top'] = holding(top)
    elif event[0] == 'move':  # the copy flies in over what the slot held
        start = (event[1].x, event[1].y) if phase == 'start' else (s.x, s.y)
        items['under'], items['top'] = holding(under), holding(top, *start)
    else:  # a change in place: the new data fills the slot from the bottom, under its new label
        old = holding(under) if under else item(s.x - s.w / 2, bottom, s.w, s.h)
        items['under'] = dict(old, label=top['label'], font=s.font)
        items['top'] = dict(holding(top, h=0 if phase == 'start' else s.h), label='')
    if event is not None and event[0] == 'change':
        items['ring'] = item(s.x - s.w / 2 - 0.06, bottom - 0.06, s.w + 0.12, s.h + 0.12, stroke=INK)
    return items

def zoom_ends(block, side):
    """The zoom line on `side` (0 left, 1 right) of `block`: from a bottom corner of its square in the SRAM grid
    to the top corner of its slots on that side."""
    (bx, by), slots = block
    edge = min(s.x - s.w / 2 for s in slots) if side == 0 else max(s.x + s.w / 2 for s in slots)
    return (bx + 0.3 * side, by), (edge, max(s.y + s.h / 2 for s in slots))

def zoom_items(k, phase):
    """The two zoom lines at step k. They grow when SRAM is first shown, and slide when the block shown changes."""
    now = FRAMES[k]['block']
    before = FRAMES[k - 1]['block'] if k else now
    lines = []
    for side in (0, 1):
        if now is None or now[0] is None:
            lines.append(item(line=True))
            continue
        start, end = zoom_ends(now, side)
        if phase == 'start' and (before is None or before[0] is None):
            end = start
        elif phase == 'start' and before != now:
            start, end = zoom_ends(before, side)
        lines.append(item(*start, end[0] - start[0], end[1] - start[1], stroke=GRAY, line=True))
    return lines

def rect(left, bottom, w, h, **colors):
    """A rectangle. Every argument but the colors can be a node."""
    return pie.rectangle(pie.point(left, bottom, hidden=True), w, h, **colors)

def show_steps(name, background, caption_at=(0, -5.6), caption_width=8, unit=50):
    """Draw the recorded steps as one Diagram node, with a step list that plays them."""
    pie.clear()
    pie.show_canvas('right')
    pie.scalar(0, out='gridOpacity')
    pie.scalar(unit, out='unit')
    background()
    squares = list(dict.fromkeys(f['block'][0] for f in FRAMES if f['block'] and f['block'][0]))

    def snapshot(k, phase):
        """Every item at step k: the filled square of the block shown, the zoom lines, each role of every slot, the caption."""
        block = FRAMES[k]['block']
        fills = [item(*q, 0.3, 0.3, GRAY, GRAY) if block and block[0] == q else item(*q) for q in squares]
        slots = [slot_items(s, k, phase) for s in SLOTS]
        caption = item(*caption_at, label=FRAMES[k]['caption'], wrap=caption_width)
        return fills + zoom_items(k, phase) + [items[role] for role in ROLES for items in slots] + [caption]

    def diff(a, b):
        """[index, changed fields] of each item that differs from `a` to `b`."""
        return [[i, {key: v for key, v in new.items() if old[key] != v}] for i, (old, new) in enumerate(zip(a, b)) if old != new]

    first_top = len(squares) + 2 + ROLES.index('top') * len(SLOTS)  # the index of the first slot's 'top' item
    steps, last = [dict(label=FRAMES[0]['label'])], snapshot(0, 'end')
    for k in range(1, len(FRAMES)):
        start, move, end = (snapshot(k, phase) for phase in ('start', 'move', 'end'))
        events = FRAMES[k]['events']
        stagger = [[first_top + i, events[s][3], events[s][4]] for i, s in enumerate(SLOTS) if s in events and events[s][4] > 1]
        steps.append(dict(label=FRAMES[k]['label'], start=diff(last, start), move=diff(start, move), end=diff(move, end), stagger=stagger))
        last = end
    figure = pie.diagram(json.dumps(snapshot(0, 'end')), out=f'{name}_figure')
    pie.ui.step_list(figure, steps=steps)

# ---- This page: where the slots are, and the kernels' actions on them ----

TILE = {'Q': ('#99f6e4', '#115e59'), 'K': ('#fecaca', '#b91c1c'), 'V': ('#f4f4f5', GRAY)}  # (fill, outline)
# The carries, in the hues of the equations: (outline, fill once one K, V tile is folded in, fill once both are)
CARRY = {'O': ('#b45309', '#fde68a', '#f59e0b'), 'l': ('#047857', '#a7f3d0', '#34d399'), 'm': ('#1d4ed8', '#bfdbfe', '#60a5fa')}
# The combine block's results: (outline, fill)
COMBINED = {'m': ('#1d4ed8', '#60a5fa'), 'l': ('#047857', '#34d399'), 'O': ('#115e59', '#2dd4bf')}
S_LINE, S_FILLS = '#7c3aed', ('#ddd6fe', '#a78bfa')  # Sij: each new Sij takes the other fill
STALE = '#71717a'  # values computed from the previous K, V tile

def tiles(name, x, ys, w, h, font=14, fill='none', line=GRAY):
    """Tiles 0, 1, … of `name` in HBM, one per y."""
    return [Slot(f'{name}{n}', 'hbm', x, y, w, h, data(f'{name}{n}', fill, line), font) for n, y in enumerate(ys)]

Q = Slot('Q', 'hbm', -4.05, 3.2, 1.6, 0.5, data('Q', *TILE['Q']))  # one query row per head
K = tiles('K', -2.25, (3.8, 3.4, 3.0, 2.6), 1.6, 0.35, 14, *TILE['K'])
V = tiles('V', -0.45, (3.8, 3.4, 3.0, 2.6), 1.6, 0.35, 14, *TILE['V'])
O_partial = tiles('O', 1.35, (3.475, 2.925), 1.6, 0.5, line=CARRY['O'][0])  # row s holds split s's partials
m_partial = tiles('m', 2.475, (3.475, 2.925), 0.25, 0.5, 10, line=CARRY['m'][0])
l_partial = tiles('l', 2.925, (3.475, 2.925), 0.25, 0.5, 10, line=CARRY['l'][0])
O = Slot('O', 'hbm', 4.05, 3.2, 1.6, 0.5, data('O', line=COMBINED['O'][0]))

# The shared memory of a split block
Qi = Slot('Qi', 'sram', -3.6, -2.0, 1.6, 0.5)
Kj = Slot('Kj', 'sram', -1.85, -2.0, 1.6, 0.35)
Sij = Slot('Sij', 'sram', -0.4, -2.0, 1.0, 0.5)
Sij.cells = [Slot(f'Sij[{c}]', 'sram', -0.775 + 0.25 * c, -2.0, 0.25, 0.5, outline=False) for c in range(4)]
Vj = Slot('Vj', 'sram', 1.05, -2.0, 1.6, 0.35)
mi = Slot('mi', 'sram', 2.125, -2.0, 0.25, 0.5, font=10, kind='m')
li = Slot('li', 'sram', 2.525, -2.0, 0.25, 0.5, font=10, kind='l')
Oi = Slot('Oi', 'sram', 3.6, -2.0, 1.6, 0.5, kind='O')
SPLIT_SRAM = [s for s in SLOTS if s.memory == 'sram']
# The combine block: m_global, l_global and the O accumulator, and the partials it reads, which pass through registers
m_g = Slot('m_g', 'sram', -1.075, -2.0, 0.25, 0.5, font=10, kind='m')
l_g = Slot('l_g', 'sram', -0.675, -2.0, 0.25, 0.5, font=10, kind='l')
acc = Slot('acc', 'sram', 0.4, -2.0, 1.6, 0.5, kind='O', caption='O')
m_read = [Slot(f'm_read{s}', 'sram', -1.075, y, 0.25, 0.5, font=10, outline=False) for s, y in enumerate((-3.0, -3.55))]
l_read = [Slot(f'l_read{s}', 'sram', -0.675, y, 0.25, 0.5, font=10, outline=False) for s, y in enumerate((-3.0, -3.55))]
O_read = [Slot(f'O_read{s}', 'sram', 0.4, y, 1.6, 0.5, outline=False) for s, y in enumerate((-3.0, -3.55))]
COMBINE_SRAM = [s for s in SLOTS if s.memory == 'sram' and s not in SPLIT_SRAM]
# The squares in the SRAM grid of split 0's block, split 1's block and the combine block
SQUARES, COMBINE_SQUARE = [(-0.15, -0.35), (0.25, -0.35)], (-0.55, 0.05)

def compute(S):
    """Compute matrix S, e.g. Sij = Qi @ Kj.T: its cells fill one after another."""
    level = (content(S.cells[0]) or data())['level'] + 1
    change(S.cells, one_by_one=True, fill=S_FILLS[level % 2], line=S_LINE, level=level)

def update(*carries):
    """The online softmax update of mi, li and Oi with one more K, V tile: each turns a shade darker."""
    for s in carries:
        level = (content(s) or data())['level'] + 1
        line, *shades = CARRY[s.kind]
        change(s, fill=shades[min(level, len(shades)) - 1], line=line, level=level)

def stale(*slots):
    """What `slots` hold now comes from the previous K, V tile: grey it. Empty slots stay empty."""
    for s in slots:
        held = [c for c in getattr(s, 'cells', [s]) if content(c)]
        if held:
            change(held, fill=STALE)

def reduce_into(s):
    """The combine block folds the partials it read into `s`: m_g, l_g or the O accumulator."""
    line, fill = COMBINED[s.kind]
    change(s, fill=fill, line=line)

def background():
    """What doesn't change: the names of HBM, SRAM and the arrays, and the SRAM grid of CUDA blocks."""
    pie.text('HBM', 0, 4.5, 14, stroke=INK)
    for label, x in (('Q', -4.05), ('K', -2.25), ('V', -0.45), ('O_partial', 1.35), ('O', 4.05)):
        pie.text(label, x, 2.125, stroke=INK)
    pie.text('SRAM', 0, 0.6, 14, stroke=INK)
    for y in (0.05, -0.35):
        for x in (-0.55, -0.15, 0.25):
            rect(x, y, 0.3, 0.3, stroke=GRAY)
```

```python-editor collapsed
# The split kernel: one CUDA block per split of K and V
new_figure()
n_splits = 2  # each split owns 2 tiles of K and V

for s in range(n_splits):  # the blocks run in parallel; the figure shows them one after another
    run_block(SQUARES[s], SPLIT_SRAM)
    step(f'visualize block for split {s}')
    move_data(Q, Qi)                                   # Qi = Q; Oi = 0; mi = -inf; li = 0
    step(f'split {s} · load Q', f'[Split {s}] load Q (init mi = -inf, li = 0, Oi = 0)')
    for j in range(2):
        n, tile = 2 * s + j, f'[Split {s}, tile j = {j}]'
        move_data([K[n], V[n]], [Kj, Vj])              # Kj, Vj = K[j], V[j]
        stale(Sij, mi, li)                             # they still hold values from the previous tile
        step(f'split {s} · j = {j} · load K{n}, V{n}', f'{tile} load K{n}, V{n}')
        compute(Sij)                                   # Sij = Qi @ Kj.T
        step(f'split {s} · j = {j} · fill Sij', f'{tile} fill Sij')
        update(mi, li, Oi)                             # mi, li, Oi = rescale, then add this tile; Oi stays unnormalized
        step(f'split {s} · j = {j} · update mi, li and Oi', f'{tile} update mi, li and Oi')
    move_data([Oi, li, mi], [O_partial[s], l_partial[s], m_partial[s]])
    step(f'split {s} · write partial {s}', f'[Split {s}] write O_partial[{s}], l_partial[{s}], m_partial[{s}]')

# The combine kernel: one CUDA block per (batch, head)
run_block(COMBINE_SQUARE, COMBINE_SRAM)
step('visualize combine block', 'visualize combine block (new kernel, new thread block)')
move_data(m_partial, m_read); reduce_into(m_g)       # m_global = max_s m_partial[s]
step('combine · compute m_global', '[Combine] load m_partial from HBM, compute m_g = max_s m_partial[s] (stored in shared memory)')
move_data(l_partial, l_read); reduce_into(l_g)       # l_global = sum_s exp(m_s - m_global) * l_s
step('combine · compute l_global', '[Combine] load l_partial from HBM, compute l_g = sum_s exp(m_s - m_g) l_s (stored in shared memory)')
move_data(O_partial, O_read); reduce_into(acc)       # acc = sum_s exp(m_s - m_global) * O_partial[s]
step('combine · accumulate O', '[Combine] load O_partial from HBM, accumulate weighted sum into O accumulator')
move_data(acc, O)                                    # O = acc / l_global
step('combine · write O', '[Combine] divide by l_g and write O back to HBM')

show_steps('fd', background, caption_at=(0, -5.05))
```

Run the two editors in order: the first defines the drawing and the actions on memory, the second runs both kernels. Then pick a step. Drag the step list by its ⋮⋮ grip onto the canvas to keep it in view while you read.

<details>
<summary>Split kernel: pointers and shared memory</summary>

```cpp
template<int Bc, int D, int S>  // S = split size along K/V
__global__ void fd_split(const float* Q, const float* K, const float* V,
                         float* O_partial, float* m_partial, float* l_partial,
                         int N, float scale, int n_splits) {
    int s = blockIdx.x, bh = blockIdx.y, tid = threadIdx.x;
    Q += bh*D;                          // 1 query row per head
    K += bh*N*D; V += bh*N*D;
    O_partial += (bh*n_splits + s)*D;
    m_partial += bh*n_splits + s;
    l_partial += bh*n_splits + s;

    int n_start = s*S, n_end = min(n_start + S, N);

    __shared__ float Qi[D], Kj[Bc][D], Vj[Bc][D], Sij[Bc];
    __shared__ float mi, li, Oi[D];
}
```

</details>

## Visualizing operations in a single block (split `s = 0`, K/V range `[0, S)`)
This block sees only its own slice of K and V, and runs the ordinary online softmax over it, so it never learns anything about the rest of the sequence.
- `Qi = Q; Oi = 0; mi = -inf; li = 0`

<details>
<summary>Cuda implementation</summary>

```cpp
// s = 0
for (int d = tid; d < D; d += blockDim.x) Qi[d] = Q[d];
for (int d = tid; d < D; d += blockDim.x) Oi[d] = 0.f;
if (tid == 0) { mi = -INFINITY; li = 0.f; }
__syncthreads();
```

</details>

---

### 0.0 **Inner tile `j = n_start`**
- `Kj, Vj = K[j], V[j]`

<details>
<summary>Cuda implementation</summary>

```cpp
// s = 0, j = n_start (= 0)
int j = n_start;
int cols = min(Bc, n_end - j);
for (int x = tid; x < cols*D; x += blockDim.x) {
    Kj[x/D][x%D] = K[(j + x/D)*D + x%D];
    Vj[x/D][x%D] = V[(j + x/D)*D + x%D];
}
__syncthreads();
```

</details>

- `Sij = Qi @ Kj.T`

<details>
<summary>Cuda implementation</summary>

```cpp
// s = 0, j = 0
for (int c = tid; c < cols; c += blockDim.x) {
    float s_ = 0.f;
    for (int k = 0; k < D; k++) s_ += Qi[k]*Kj[c][k];
    Sij[c] = s_*scale;
}
__syncthreads();
```

</details>

- `mi = max(mi, Sij.max(-1))`
- `li = alpha * li + exp(Sij - mi).sum(-1)`
- `Oi = alpha * Oi + softmax(Sij) @ Vj`

<details>
<summary>Cuda implementation</summary>

```cpp
// s = 0, j = 0 — one thread does the row-wise online softmax update
if (tid == 0) {
    float m_ij = -INFINITY;
    for (int c = 0; c < cols; c++) m_ij = fmaxf(m_ij, Sij[c]);
    float m_new = fmaxf(mi, m_ij);
    float alpha = expf(mi - m_new);
    float lsum = 0.f;
    for (int c = 0; c < cols; c++) { Sij[c] = expf(Sij[c] - m_new); lsum += Sij[c]; }
    li = alpha*li + lsum;
    mi = m_new;
    for (int d = 0; d < D; d++) {
        float pv = 0.f;
        for (int c = 0; c < cols; c++) pv += Sij[c]*Vj[c][d];
        Oi[d] = alpha*Oi[d] + pv;
    }
}
__syncthreads();
```

</details>

---

### 0.1 **Inner tile `j = n_start + Bc`**
- `Kj, Vj = K[j], V[j]`

<details>
<summary>Cuda implementation</summary>

```cpp
// s = 0, j = n_start + Bc
int j = n_start + Bc;
int cols = min(Bc, n_end - j);
for (int x = tid; x < cols*D; x += blockDim.x) {
    Kj[x/D][x%D] = K[(j + x/D)*D + x%D];
    Vj[x/D][x%D] = V[(j + x/D)*D + x%D];
}
__syncthreads();
```

</details>

- `Sij = Qi @ Kj.T`

<details>
<summary>Cuda implementation</summary>

```cpp
// s = 0, j = 1
for (int c = tid; c < cols; c += blockDim.x) {
    float s_ = 0.f;
    for (int k = 0; k < D; k++) s_ += Qi[k]*Kj[c][k];
    Sij[c] = s_*scale;
}
__syncthreads();
```

</details>

- `mi = max(mi, Sij.max(-1))`
- `li = alpha * li + exp(Sij - mi).sum(-1)`
- `Oi = alpha * Oi + softmax(Sij) @ Vj`

<details>
<summary>Cuda implementation</summary>

```cpp
// s = 0, j = 1
if (tid == 0) {
    float m_ij = -INFINITY;
    for (int c = 0; c < cols; c++) m_ij = fmaxf(m_ij, Sij[c]);
    float m_new = fmaxf(mi, m_ij);
    float alpha = expf(mi - m_new);
    float lsum = 0.f;
    for (int c = 0; c < cols; c++) { Sij[c] = expf(Sij[c] - m_new); lsum += Sij[c]; }
    li = alpha*li + lsum;
    mi = m_new;
    for (int d = 0; d < D; d++) {
        float pv = 0.f;
        for (int c = 0; c < cols; c++) pv += Sij[c]*Vj[c][d];
        Oi[d] = alpha*Oi[d] + pv;
    }
}
__syncthreads();
```

</details>

---

### 0. **Write partial**
Nothing is divided here. `Oi` is still a running total, and `mi` and `li` are what the next kernel needs to finish it, so all three are written out.
- `O_partial[0], l_partial[0], m_partial[0] = Oi, li, mi`

<details>
<summary>Cuda implementation</summary>

```cpp
// s = 0
for (int d = tid; d < D; d += blockDim.x) O_partial[d] = Oi[d];
if (tid == 0) { *m_partial = mi; *l_partial = li; }
```

</details>

---

## Same operations in another block (split `s = 1`, K/V range `[S, 2S)`, runs in parallel with split 0)

- `Qi = Q; Oi = 0; mi = -inf; li = 0`
- `Kj, Vj = K[j], V[j]` (`j = n_start`)
- `Sij = Qi @ Kj.T`
- `mi, li, Oi = ...`
- `Kj, Vj = K[j], V[j]` (`j = n_start + Bc`)
- `Sij = Qi @ Kj.T`
- `mi, li, Oi = ...`
- `O_partial[1], l_partial[1], m_partial[1] = Oi, li, mi`

Split 1 runs the identical kernel body as split 0 on its own SM, differing only in `blockIdx.x = 1`, so `n_start = S`.

---

## Combine kernel — one thread block per (batch, head)

After both split blocks finish, a second kernel merges their partials.

<details>
<summary>Note on the visualization.</summary>

In the steps below, the per-split `m_partial`, `l_partial`, and `O_partial` tiles are shown sliding from HBM into the combine block, which represents a real global-memory read. But the combine kernel does not store these tiles in shared memory: they flow through registers, and only the reduced scalars `m_global`, `l_global` (and the `acc` output) ever live in `__shared__`.

- `m_global = max_s m_partial[s]`

<details>
<summary>Cuda implementation</summary>

```cpp
template<int D>
__global__ void fd_combine(const float* O_partial, const float* m_partial,
                           const float* l_partial, float* O, int n_splits) {
    int bh = blockIdx.x, tid = threadIdx.x;
    O_partial += bh*n_splits*D;
    m_partial += bh*n_splits;
    l_partial += bh*n_splits;
    O += bh*D;

    __shared__ float m_global, l_global;

    if (tid == 0) {
        float m_g = -INFINITY;
        for (int s = 0; s < n_splits; s++) m_g = fmaxf(m_g, m_partial[s]);
        m_global = m_g;
    }
    __syncthreads();
```

</details>

- `l_global = sum_s exp(m_s - m_global) * l_s`

<details>
<summary>Cuda implementation</summary>

```cpp
    if (tid == 0) {
        float l_g = 0.f;
        for (int s = 0; s < n_splits; s++)
            l_g += expf(m_partial[s] - m_global) * l_partial[s];
        l_global = l_g;
    }
    __syncthreads();
```

</details>

- `acc = sum_s exp(m_s - m_global) * O_partial[s]`

<details>
<summary>Cuda implementation</summary>

```cpp
    __shared__ float acc[D];
    for (int d = tid; d < D; d += blockDim.x) {
        float a = 0.f;
        for (int s = 0; s < n_splits; s++) {
            float w = expf(m_partial[s] - m_global);
            a += w * O_partial[s*D + d];
        }
        acc[d] = a;
    }
    __syncthreads();
```

</details>

- `O = acc / l_global` (write back to HBM)

<details>
<summary>Cuda implementation</summary>

```cpp
    for (int d = tid; d < D; d += blockDim.x) {
        O[d] = acc[d] / l_global;
    }
}
```

</details>

</details>

---

In Flash Attention, one thread block read the whole KV cache by itself. In flash decoding, a few dozen blocks each read a different chunk of it. The chunks do not overlap and together they cover the sequence, so the number of bytes read from HBM is exactly the same in both cases.

The gain is in how fast those bytes arrive. A single block cannot ask for data quickly enough to use all of the GPU's memory bandwidth, so most of it goes unused while that block waits. A few dozen blocks asking at once can use it, and the same read finishes sooner.
