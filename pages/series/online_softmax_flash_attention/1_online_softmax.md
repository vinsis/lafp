---
title: Kernel visualization: online softmax
description: How online softmax finds the max and the denominator in one pass, derived step by step, with the naive and online kernels stepped through as tiles move between HBM and SRAM.
date: 2026-11-05
canvas: none
sidebar: _series.md
---

# Kernel visualization: online softmax

<details>
<summary>Overview of safe softmax</summary>

Softmax needs the maximum of a vector before it can compute any element of it:

$$\text{softmax}(x)_i = \frac{e^{x_i - m}}{\sum_j e^{x_j - m}}, \qquad m = \max_j x_j$$

Subtracting $m$ from each value makes the calculation stable (no overflows) without altering the output.

A naive implementation of a softmax kernel involves three passes across the HBM:
1. Read the entire sequence to calculate $m$.
2. Read the entire sequence to calculate the denominator $\sum_j d_j = e^{x_j - m}$.
3. Finally, calculate the output values.

</details>

## Online softmax

Online softmax fuses steps 1 and 2 (shown in the overview), thus requiring only two passes across the HBM. It uses the following formula:

$$\begin{aligned}
m_i &= \max(m_{i-1},\; x_i) \\[6pt]
d_i &= d_{i-1} \, e^{m_{i-1} - m_i} \;+\; e^{x_i - m_i}
\end{aligned}$$

with $m_0 = -\infty$ and $d_0 = 0$. Both $m$ and $d$ are updated on every element, so a single read of the sequence produces the final $m_N$ and $d_N$.

<details>
<summary>Derivation</summary>

Define $d_i$ as the denominator over the first $i$ elements, normalized against the maximum known so far:

$$d_i = \sum_{j=1}^{i} e^{x_j - m_i}$$

Split off the last term and rewrite the rest against $m_{i-1}$ instead of $m_i$:

$$\begin{aligned}
d_i &= \sum_{j=1}^{i-1} e^{x_j - m_i} \;+\; e^{x_i - m_i} \\[6pt]
    &= \sum_{j=1}^{i-1} e^{x_j - m_{i-1}} \, e^{m_{i-1} - m_i} \;+\; e^{x_i - m_i} \\[6pt]
    &= \Big( \sum_{j=1}^{i-1} e^{x_j - m_{i-1}} \Big) e^{m_{i-1} - m_i} \;+\; e^{x_i - m_i} \\[6pt]
    &= d_{i-1} \, e^{m_{i-1} - m_i} \;+\; e^{x_i - m_i}
\end{aligned}$$

The second line is the only step that does any work, and it is just $e^{x_j - m_i} = e^{x_j - m_{i-1}} e^{m_{i-1} - m_i}$. The factor $e^{m_{i-1} - m_i}$ does not depend on $j$, so it comes out of the sum, and what is left is exactly $d_{i-1}$.

When the maximum does not move, $m_i = m_{i-1}$ and the factor is $1$, so the update reduces to an ordinary running sum.

</details>

<details>
<summary>Tiled version</summary>

The hardware reads the sequence one tile (a contiguous chunk of numbers) at a time, so each update takes in a whole tile at once instead of a single element.

The tiled version of the same formula is:

$$\begin{aligned}
m_{\text{new}} &= \max(m_{\text{old}},\; \max_j \text{tile}_j) \\[6pt]
d_{\text{new}} &= \underbrace{d_{\text{old}} \, e^{m_{\text{old}} - m_{\text{new}}}}_{\text{correct the running sum}} \;+\; \underbrace{\sum_j e^{\text{tile}_j - m_{\text{new}}}}_{\text{add the new tile}}
\end{aligned}$$

Whenever the running maximum moves, every term already accumulated in $d$ was computed against the old maximum. Multiplying by $e^{m_{\text{old}} - m_{\text{new}}}$ fixes all of them at once, because $e^{x - m_{\text{old}}} \cdot e^{m_{\text{old}} - m_{\text{new}}} = e^{x - m_{\text{new}}}$. That single multiply is what removes the need for a separate pass to find $m$ first.

Step 3 cannot be fused: no output value can be written until $d$ is final, and $d$ is not final until the last element has been read.

</details>

---

## The naive version: three passes

Each of the three loops is a full trip over $x$. Pass 2 cannot start early, because every exponential it computes needs the final $m$.

- Pass 1: calculate the max $m$
  - read tile 0, update max
  - read tile 1, update max
- Pass 2: calculate the denominator $d$
  - read tile 0, update denominator sum
  - read tile 1, update denominator sum
- Pass 3: 
  - read tile 0, divide, write back to HBM
  - read tile 1, divide, write back to HBM

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

PANEL = '#c6d1d1'  # HBM and SRAM
X_FILL, X_LINE = '#99f6e4', '#115e59'  # the input x
Y_FILL, Y_LINE = '#fde68a', '#b45309'  # the output y
M_FILL, M_LINE = '#bfdbfe', '#1d4ed8'  # the running max m
D_FILL, D_LINE = '#a7f3d0', '#047857'  # the denominator d

x = [3, 1, 4, 2, 8, 5, 7, 6]  # one row of scores
N, B = len(x), 4  # values in the row; values per tile

X = [Slot(f'x[{e}]', 'hbm', -4.06 + 1.16 * e, 3.0, 1.02, 0.58, data(str(v), X_FILL, X_LINE), 12) for e, v in enumerate(x)]
Y = [Slot(f'y[{e}]', 'hbm', -4.06 + 1.16 * e, 2.35, 1.02, 0.58, data(line=Y_LINE), 12) for e in range(N)]
tile = [Slot(f'tile[{s}]', 'sram', -1.68 + 1.12 * s, -0.87, 1.02, 0.58, font=12, caption='') for s in range(B)]
M = Slot('m', 'sram', 0, -1.55, 2.6, 0.42, data('m = -inf', line=M_LINE), 12, caption='')
D = Slot('d', 'sram', 0, -2.15, 2.6, 0.42, data('d = 0', line=D_LINE), 12, caption='')
SRAM = [*tile, M, D]

def set_register(register, text):
    """Write a new value into register m or d."""
    change(register, label=text, fill=M_FILL if register is M else D_FILL)

def set_values(slots, values):
    """Write `values` into `slots`, e.g. the softmax outputs into the tile."""
    for s, v in zip(slots, values):
        change(s, label=f'{v:.2f}'.lstrip('0'), fill=Y_FILL, line=Y_LINE)

def count_transfers():
    f, s = transfers['fetches'], transfers['stores']
    return f'{f + s} transfers so far: {f} fetches and {s} stores.'

def background():
    """What doesn't change: HBM and SRAM, and their names."""
    rect(-5.37, 1.74, 10.74, 1.87, fill=PANEL, stroke=GRAY)
    pie.text('HBM  ·  x is read from here, y is written back here', 0, 4.06, 12, stroke=INK)
    pie.text('x', -5.79, 3.0, 13, stroke=INK)
    pie.text('y', -5.79, 2.35, 13, stroke=INK)
    rect(-2.59, -2.68, 5.18, 2.42, fill=PANEL, stroke=GRAY)
    pie.text(f'SRAM  ·  one tile of {B}', 0, 0.19, 12, stroke=INK)
```

```python-editor collapsed
# Safe softmax: three passes over x
new_figure(block=(None, SRAM), caption='the safe version, from the start.')

m = -math.inf  # pass 1: max over the whole row
for t in range(0, N, B):
    move_data(X[t:t + B], tile)
    step(f'pass 1 · tile {t // B} · read', 'pass 1 of 3: finds the max. d cannot move yet - no exponential can be taken without the final m.')
    m = max(m, *x[t:t + B])
    set_register(M, f'm = {m:g}')
    step(f'pass 1 · tile {t // B} · update max', f'tile {t // B} folded into m. d is still zero.')

d = 0.0  # pass 2: sum of exp(x - m)
for t in range(0, N, B):
    move_data(X[t:t + B], tile)
    step(f'pass 2 · tile {t // B} · read', f'pass 2 of 3: sums e^(x-{m:g}). The same {N} values, fetched a second time.')
    d += sum(math.exp(v - m) for v in x[t:t + B])
    set_register(D, f'd = {d:.4f}')
    step(f'pass 2 · tile {t // B} · update denominator sum', f'tile {t // B} folded into d, against the final m = {m:g}.')

for t in range(0, N, B):  # pass 3: normalize and write y
    move_data(X[t:t + B], tile)
    step(f'pass 3 · tile {t // B} · read', 'pass 3 of 3: divides by d and writes y. A third fetch of the same row.')
    set_values(tile, [math.exp(v - m) / d for v in x[t:t + B]])
    step(f'pass 3 · tile {t // B} · divide', f'tile {t // B} divided by d. m and d are read here, never written.')
    move_data(tile, Y[t:t + B])
    step(f'pass 3 · tile {t // B} · write back to HBM', count_transfers())

show_steps('naive', background, caption_at=(0, -3.4), caption_width=10, unit=45)
```

Run the two editors in order: the first defines the drawing and the actions on memory, the second is the kernel. Then pick a step. Drag the step list by its ⋮⋮ grip onto the canvas to keep it in view while you read.

---

## Online softmax: two passes

- Pass 1: 
  - read tile 0, update $m$ and $d$
  - read tile 1, update $m$ and $d$
- Pass 2: 
  - re-fetch tile 0, divide and write back to HBM
  - re-fetch tile 1, divide and write back to HBM

```python-editor collapsed
# Online softmax: two passes over x
new_figure(block=(None, SRAM), caption='the same row, the online version.')

m, d = -math.inf, 0.0
for t in range(0, N, B):  # pass 1: fold each tile into m and d in one read
    move_data(X[t:t + B], tile)
    step(f'pass 1 · tile {t // B} · read', f'pass 1, tile {t // B}.')
    m_old, m = m, max(m, *x[t:t + B])
    corrected = d * math.exp(m_old - m)  # correct the running sum
    set_register(M, f'm = {m:g}')
    set_register(D, f'd = {corrected:.4f}')
    step(f'pass 1 · tile {t // B} · correct d', f'the max moves from {m_old:g} to {m:g}. d was summed against {m_old:g}, '
         f'so one multiply corrects it: {d:.4f} x e^({m_old:g}-{m:g}) = {corrected:.4f}. Nothing is re-fetched.')
    d = corrected + sum(math.exp(v - m) for v in x[t:t + B])  # add the new tile
    set_register(D, f'd = {d:.4f}')
    step(f'pass 1 · tile {t // B} · add to d', f"add this tile's own terms to d: {corrected:.4f} + sum of e^(x-{m:g}) over the tile = {d:.4f}.")

for t in range(0, N, B):  # pass 2: write y = exp(x - m) / d with the final m and d
    move_data(X[t:t + B], tile)
    step(f'pass 2 · tile {t // B} · re-fetch', f'pass 2, tile {t // B}: a real re-fetch. This is the pass online softmax does not remove.')
    set_values(tile, [math.exp(v - m) / d for v in x[t:t + B]])
    move_data(tile, Y[t:t + B])
    step(f'pass 2 · tile {t // B} · divide and write back', count_transfers())

show_steps('online', background, caption_at=(0, -3.4), caption_width=10, unit=45)
```

Run the first editor of the previous section, then this one, and pick a step.

---

<details>
<summary>Naive safe softmax implementation</summary>

```cpp
// One block per row, blockDim.x == TILE lanes cooperating.
// Launch:  softmax_naive<<<rows, TILE>>>(X, Y, N);
__global__ void softmax_naive(const float* X, float* Y, int N) {
    int row  = blockIdx.x;
    int lane = threadIdx.x;              // 0 .. TILE-1
    const float* x = X + row * N;
    float*       y = Y + row * N;

    __shared__ float red[TILE];         // reduction scratch
    __shared__ float m_s, d_s;          // the row's m and d

    // pass 1: max over the whole row
    float m_local = -INFINITY;
    for (int i = lane; i < N; i += TILE) m_local = fmaxf(m_local, x[i]);
    red[lane] = m_local;
    __syncthreads();
    for (int s = TILE / 2; s > 0; s >>= 1) {
        if (lane < s) red[lane] = fmaxf(red[lane], red[lane + s]);
        __syncthreads();
    }
    if (lane == 0) m_s = red[0];
    __syncthreads();
    float m = m_s;

    // pass 2: sum of exp(x - m)
    float d_local = 0.0f;
    for (int i = lane; i < N; i += TILE) d_local += expf(x[i] - m);
    red[lane] = d_local;
    __syncthreads();
    for (int s = TILE / 2; s > 0; s >>= 1) {
        if (lane < s) red[lane] += red[lane + s];
        __syncthreads();
    }
    if (lane == 0) d_s = red[0];
    __syncthreads();
    float d = d_s;

    // pass 3: normalize and write y
    for (int i = lane; i < N; i += TILE)
        y[i] = expf(x[i] - m) / d;
}
```

</details>

<details>
<summary>Online softmax kernel implementation</summary>

```cpp
// One block per row, blockDim.x == TILE lanes cooperating.
// Launch:  softmax_online<<<rows, TILE>>>(X, Y, N);
__global__ void softmax_online(const float* X, float* Y, int N) {
    int row  = blockIdx.x;
    int lane = threadIdx.x;              // 0 .. TILE-1
    const float* x = X + row * N;
    float*       y = Y + row * N;

    __shared__ float tile[TILE];        // one tile in SRAM
    __shared__ float red[TILE];         // reduction scratch
    __shared__ float m_s, d_s;          // running m and d for the row

    if (lane == 0) { m_s = -INFINITY; d_s = 0.0f; }
    __syncthreads();

    // pass 1: fold each tile into m and d in one read
    for (int t = 0; t < N; t += TILE) {
        tile[lane] = x[t + lane];
        __syncthreads();

        // tile max via tree reduction
        red[lane] = tile[lane];
        __syncthreads();
        for (int s = TILE / 2; s > 0; s >>= 1) {
            if (lane < s) red[lane] = fmaxf(red[lane], red[lane + s]);
            __syncthreads();
        }
        float m_old = m_s;
        float m_new = fmaxf(m_old, red[0]);

        // tile sum of exp(x - m_new) via tree reduction
        red[lane] = expf(tile[lane] - m_new);
        __syncthreads();
        for (int s = TILE / 2; s > 0; s >>= 1) {
            if (lane < s) red[lane] += red[lane + s];
            __syncthreads();
        }

        if (lane == 0) {
            d_s = d_s * expf(m_old - m_new) + red[0];   // correct, then add
            m_s = m_new;
        }
        __syncthreads();
    }

    // pass 2: write y = exp(x - m) / d with the final m, d
    float m = m_s, d = d_s;
    for (int i = lane; i < N; i += TILE)
        y[i] = expf(x[i] - m) / d;
}
```

</details>
