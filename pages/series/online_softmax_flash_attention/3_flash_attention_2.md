---
title: Kernel visualization: Flash Attention 2
description: How Flash Attention 2 puts Q on the outer loop, so each block of O is built in SRAM and written once, stepped through as tiles move between HBM and SRAM.
date: 2026-11-05
canvas: none
sidebar: _series.md
---

# Kernel visualization: Flash Attention 2

<details>
<summary>Prerequisites</summary>

- Knowledge of CUDA essentials
- How attention works
- [Online softmax](/series/online_softmax_flash_attention/1_online_softmax)

</details>

---

<details>
<summary>Overview of the algorithm</summary>

For a single query row $Q[k,:]$, stream the $N/b$ key/value tiles of width $b$. Carry a running max $\textcolor{#1d4ed8}{m_i}$, denominator $\textcolor{#047857}{d'_i}$, and output $\textcolor{#b45309}{o'_i}$:

$$
\begin{aligned}
& \textbf{for } i \leftarrow 1, \dots, N/b \; \textbf{do} \\[16pt]
& \qquad x_i \;\leftarrow\; Q[k,:] \, K^\top\!\bigl[:,\, (i{-}1)b : ib\bigr] \\[18pt]
& \qquad \underbrace{m_i^{(\mathrm{local})}}_{\text{max of this tile}} \;=\; \max_{j=1}^{b} \bigl(x_i[j]\bigr) \\[22pt]
& \qquad \textcolor{#1d4ed8}{m_i} \;\leftarrow\; \max\bigl(\textcolor{#1d4ed8}{m_{i-1}},\; m_i^{(\mathrm{local})}\bigr) \\[22pt]
& \qquad \textcolor{#047857}{d'_i} \;\leftarrow\; \underbrace{\textcolor{#047857}{d'_{i-1}} \, e^{\textcolor{#1d4ed8}{m_{i-1}} - \textcolor{#1d4ed8}{m_i}}}_{\text{rescale old denom}} \;+\; \underbrace{\sum_{j=1}^{b} e^{x_i[j] - \textcolor{#1d4ed8}{m_i}}}_{\text{new tile's contribution}} \\[28pt]
& \qquad \textcolor{#b45309}{o'_i} \;\leftarrow\; \textcolor{#b45309}{o'_{i-1}} \cdot \underbrace{\frac{\textcolor{#047857}{d'_{i-1}} \, e^{\textcolor{#1d4ed8}{m_{i-1}} - \textcolor{#1d4ed8}{m_i}}}{\textcolor{#047857}{d'_i}}}_{\text{rescale old output}} \;+\; \sum_{j=1}^{b} \underbrace{\frac{e^{x_i[j] - \textcolor{#1d4ed8}{m_i}}}{\textcolor{#047857}{d'_i}}}_{\text{softmax weight}} \, V\bigl[j + (i{-}1)b,\; :\bigr] \\[16pt]
& \textbf{end} \\[16pt]
& O[k,:] \;\leftarrow\; \textcolor{#b45309}{o'_{N/b}}
\end{aligned}
$$

Initial values: $\textcolor{#1d4ed8}{m_0} = -\infty$, $\textcolor{#047857}{d'_0} = 0$, $\textcolor{#b45309}{o'_0} = \mathbf{0}$. Only one tile of $K, V$ and the three carries live in fast memory at any time.

</details>

---

### Steps
One CUDA block is responsible for `Br` rows of Q from start to finish, so it begins by claiming its shared memory and working out which rows those are.

```python-editor collapsed
# Drawing helpers: memory slots in HBM and SRAM, and the actions the kernel below takes on them.
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

# ---- This page: where the slots are, and the kernel's actions on them ----

TILE = {'Q': ('#99f6e4', '#115e59'), 'K': ('#fecaca', '#b91c1c'), 'V': ('#f4f4f5', GRAY)}  # (fill, outline)
# The carries, in the hues of the equations: (outline, fill once one K, V tile is folded in, fill once both are)
CARRY = {'O': ('#b45309', '#fde68a', '#f59e0b'), 'l': ('#047857', '#a7f3d0', '#34d399'), 'm': ('#1d4ed8', '#bfdbfe', '#60a5fa')}
S_LINE, S_FILLS = '#7c3aed', ('#ddd6fe', '#a78bfa')  # Sij: each new Sij takes the other fill
STALE = '#71717a'  # values computed from the previous K, V tile

def hbm_tiles(name, x, w, font=14, kind=None):
    """Tiles 0 and 1 of matrix `name` in HBM."""
    fill, line = TILE[name] if name in TILE else ('none', CARRY[kind or name][0])
    return [Slot(f'{name}{n}', 'hbm', x, y, w, 1.2, data(f'{name}{n}', fill, line), font) for n, y in enumerate((3.625, 2.375))]

Q, K, V = hbm_tiles('Q', -2.925, 1.6), hbm_tiles('K', -1.125, 1.6), hbm_tiles('V', 0.675, 1.6)
O, L = hbm_tiles('O', 2.475, 1.6), hbm_tiles('L', 3.6, 0.25, 10, kind='l')

# The shared memory of a CUDA block
Qi = Slot('Qi', 'sram', -3.7, -3.0, 1.6, 1.2)
Kj = Slot('Kj', 'sram', -1.95, -3.0, 1.6, 1.2)
Sij = Slot('Sij', 'sram', -0.4, -3.0, 1.2, 1.2)
Sij.cells = [Slot(f'Sij[{r}][{c}]', 'sram', -0.85 + 0.3 * c, -2.55 - 0.3 * r, 0.3, 0.3, outline=False)
             for r in range(4) for c in range(4)]
Vj = Slot('Vj', 'sram', 1.15, -3.0, 1.6, 1.2)
mi = Slot('mi', 'sram', 2.225, -3.0, 0.25, 1.2, font=10, kind='m')
li = Slot('li', 'sram', 2.625, -3.0, 0.25, 1.2, font=10, kind='l')
Oi = Slot('Oi', 'sram', 3.7, -3.0, 1.6, 1.2, kind='O')
SRAM = [s for s in SLOTS if s.memory == 'sram']
SQUARES = [(-0.15, -0.35), (0.25, -0.35)]  # the squares of blocks 0 and 1 in the SRAM grid

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

def background():
    """What doesn't change: the names of HBM, SRAM and the matrices, and the SRAM grid of CUDA blocks."""
    pie.text('HBM', 0, 5, 14, stroke=INK)
    for label, x in (('Q', -2.925), ('K', -1.125), ('V', 0.675), ('O', 2.475), ('L', 3.6)):
        pie.text(label, x, 1.5, stroke=INK)
    pie.text('SRAM', 0, 0.6, 14, stroke=INK)
    for y in (0.05, -0.35):
        for x in (-0.55, -0.15, 0.25):
            rect(x, y, 0.3, 0.3, stroke=GRAY)
```

```python-editor collapsed
# The kernel: Q on the outer loop, one CUDA block per block of Q rows; K and V on the inner loop
new_figure()
Tr = Tc = 2  # blocks of Q rows; tiles of K and V

for i in range(Tr):  # the blocks run in parallel; the figure shows them one after another
    run_block(SQUARES[i], SRAM)
    step(f'visualize block {i}', 'visualize a single block' if i == 0 else 'visualize another block')
    move_data(Q[i], Qi)                            # Qi = Q[i]; Oi = 0; mi = -inf; li = 0
    step(f'block {i} · load Q{i}', f'load Q{i}')
    for j in range(Tc):
        loop = f'[KV loop: {j}]'
        move_data([K[j], V[j]], [Kj, Vj])          # Kj, Vj = K[j], V[j]
        stale(Sij, mi, li)                         # they still hold values from the previous tile
        step(f'block {i} · j = {j} · load K{j}, V{j}', f'{loop} load K{j}, V{j}')
        compute(Sij)                               # Sij = Qi @ Kj.T
        step(f'block {i} · j = {j} · fill Sij', f'{loop} fill Sij')
        update(mi, li, Oi)                         # mi, li, Oi = rescale, then add this tile
        step(f'block {i} · j = {j} · update mi, li and Oi', f'{loop} update mi, li and Oi')
    move_data([Oi, li], [O[i], L[i]])              # O[i], L[i] = Oi / li, mi + log(li)
    step(f'block {i} · write O{i}, L{i}', f'write O{i}, L{i}')

show_steps('fa2', background)
```

Run the two editors in order: the first defines the drawing and the actions on memory, the second is the kernel. Then pick a step. Drag the step list by its ⋮⋮ grip onto the canvas to keep it in view while you read.

<details>
<summary>Set up pointers and shared memory</summary>

```cpp
template<int Br, int Bc, int D>
__global__ void fa2(const float* Q, const float* K, const float* V,
                    float* O, float* L, int N, float scale) {
    int i = blockIdx.x, bh = blockIdx.y, tid = threadIdx.x;
    Q += bh*N*D; K += bh*N*D; V += bh*N*D; O += bh*N*D; L += bh*N;

    __shared__ float Qi[Br][D], Oi[Br][D], Kj[Bc][D], Vj[Bc][D];
    __shared__ float Sij[Br][Bc], mi[Br], li[Br];

    int Tc = (N+Bc-1)/Bc;
}
```

</details>

## Visualizing operations in a single block
Zoom in on one block: `Qi` is loaded once and stays for the whole run, and the carries start empty.
- `Qi = Q[i]; Oi = 0; mi = -inf; li = 0`

<details>
<summary>Cuda implementation</summary>

```cpp
// i = 0
for (int x = tid; x < Br*D; x += blockDim.x) {
    Qi[x/D][x%D] = Q[(0*Br + x/D)*D + x%D];
    Oi[x/D][x%D] = 0.f;
}
if (tid < Br) { mi[tid] = -INFINITY; li[tid] = 0.f; }
__syncthreads();
```

</details>

---

### **Iteration `j = 0`**
The first tile of K and V arrives, and the running max, the running sum and the output all move for the first time.
- `Kj, Vj = K[j], V[j]`

<details>
<summary>Cuda implementation</summary>

```cpp
// i = 0, j = 0
for (int x = tid; x < Bc*D; x += blockDim.x) {
    Kj[x/D][x%D] = K[(0*Bc + x/D)*D + x%D];
    Vj[x/D][x%D] = V[(0*Bc + x/D)*D + x%D];
}
__syncthreads();
```

</details>

- `Sij = Qi @ Kj.T`

<details>
<summary>Cuda implementation</summary>

```cpp
// i = 0, j = 0
for (int x = tid; x < Br*Bc; x += blockDim.x) {
    int r = x/Bc, c = x%Bc;
    float s = 0.f;
    for (int k = 0; k < D; k++) s += Qi[r][k]*Kj[c][k];
    Sij[r][c] = s*scale;
}
__syncthreads();
```

</details>

- `mi = max(mi, Sij.max(-1))`
- `li = rescale(li) + exp(Sij - mi).sum(-1)`
- `Oi = rescale(Oi) + softmax(Sij) @ Vj`

<details>
<summary>Cuda implementation</summary>

```cpp
// i = 0, j = 0
if (tid < Br) {
    float m_ij = -INFINITY;
    for (int c = 0; c < Bc; c++) m_ij = fmaxf(m_ij, Sij[tid][c]);
    float m_new = fmaxf(mi[tid], m_ij);
    float alpha = expf(mi[tid] - m_new);
    float lsum = 0.f;
    for (int c = 0; c < Bc; c++) {
        Sij[tid][c] = expf(Sij[tid][c] - m_new);
        lsum += Sij[tid][c];
    }
    li[tid] = alpha*li[tid] + lsum;
    for (int d = 0; d < D; d++) {
        float pv = 0.f;
        for (int c = 0; c < Bc; c++) pv += Sij[tid][c]*Vj[c][d];
        Oi[tid][d] = alpha*Oi[tid][d] + pv;
    }
    mi[tid] = m_new;
}
__syncthreads();
```

</details>

---

### **Iteration `j = 1`**
The second tile arrives, so everything held from the first tile is now stale and gets rescaled to the new max before this tile is added.
- `Kj, Vj = K[j], V[j]`

<details>
<summary>Cuda implementation</summary>

```cpp
// i = 0, j = 1
for (int x = tid; x < Bc*D; x += blockDim.x) {
    Kj[x/D][x%D] = K[(1*Bc + x/D)*D + x%D];
    Vj[x/D][x%D] = V[(1*Bc + x/D)*D + x%D];
}
__syncthreads();
```

</details>

- `Sij = Qi @ Kj.T`

<details>
<summary>Cuda implementation</summary>

```cpp
// i = 0, j = 1
for (int x = tid; x < Br*Bc; x += blockDim.x) {
    int r = x/Bc, c = x%Bc;
    float s = 0.f;
    for (int k = 0; k < D; k++) s += Qi[r][k]*Kj[c][k];
    Sij[r][c] = s*scale;
}
__syncthreads();
```

</details>

- `mi = max(mi, Sij.max(-1))`
- `li = rescale(li) + exp(Sij - mi).sum(-1)`
- `Oi = rescale(Oi) + softmax(Sij) @ Vj`

<details>
<summary>Cuda implementation</summary>

```cpp
// i = 0, j = 1
if (tid < Br) {
    float m_ij = -INFINITY;
    for (int c = 0; c < Bc; c++) m_ij = fmaxf(m_ij, Sij[tid][c]);
    float m_new = fmaxf(mi[tid], m_ij);
    float alpha = expf(mi[tid] - m_new);
    float lsum = 0.f;
    for (int c = 0; c < Bc; c++) {
        Sij[tid][c] = expf(Sij[tid][c] - m_new);
        lsum += Sij[tid][c];
    }
    li[tid] = alpha*li[tid] + lsum;
    for (int d = 0; d < D; d++) {
        float pv = 0.f;
        for (int c = 0; c < Bc; c++) pv += Sij[tid][c]*Vj[c][d];
        Oi[tid][d] = alpha*Oi[tid][d] + pv;
    }
    mi[tid] = m_new;
}
__syncthreads();
```

</details>

---

### Write the data back to HBM
The tiles are done, so only now is `Oi` divided by `li`, and `mi` and `li` leave together as the single array L.
- `O[i], L[i] = Oi/li, mi + log(li)`

<details>
<summary>Cuda implementation</summary>

```cpp
// i = 0
if (tid < Br) {
    for (int d = 0; d < D; d++) Oi[tid][d] /= li[tid];
    L[0*Br + tid] = mi[tid] + logf(li[tid]);
}
__syncthreads();
for (int x = tid; x < Br*D; x += blockDim.x)
    O[(0*Br + x/D)*D + x%D] = Oi[x/D][x%D];
```

</details>

---

## Same operations in another block
Every other block of Q runs these same steps, and because no block needs anything from another, they all run at the same time.

- `Qi = Q[i]; Oi = 0; mi = -inf; li = 0`
- `Kj, Vj = K[j], V[j]`
- `Sij = Qi @ Kj.T`
- `mi, li, Oi = ...`
- `Kj, Vj = K[j], V[j]`
- `Sij = Qi @ Kj.T`
- `mi, li, Oi = ...`
- `O[i], L[i] = Oi/li, mi + log(li)`

---

Counting trips across HBM:
- $Q$ is read once, and $O$ and $L$ are written once and never read back
- $K$ and $V$ are read twice, once per block of $Q$
  - Why is nothing carried back and forth now? $Q$ sits on the outer loop, so one block of $O$ is built from start to finish in SRAM. It is already the real answer by the time it is written, and $m$ and $l$ never have to make the trip.

Two smaller wins come with it. The division by $l$ happens once at write-back instead of on every step, and $m$ and $l$ leave as a single array $L = m + \log l$, which is what the backward pass needs.
