---
title: Block scaling in MXFP4 and NVFP4
description: How MXFP4 and NVFP4 multiply 4-bit E2M1 values by a shared block scale, and NVFP4 by a tensor scale too, to get the stored numbers.
date: 2026-11-05
canvas: left
sidebar: _series.md
---

# Block scaling in MXFP4 and NVFP4

These two FP4 formats allow scaling of chunks of numbers to increase the range of numbers they can represent. E.g. a 4-bit E2M1 value can only be one of $0, \pm 0.5, \pm 1, \pm 1.5, \pm 2, \pm 3, \pm 4, \pm 6$. That is too few to store a tensor directly. So a block of values shares one scale, and each value is multiplied by it.

Run the editor and play with the different options it creates. The global tensor scale is fixed at $0.125$ in the figure.

```python-editor collapsed
import math

SIGN, EXP, MAN, GRAY, BOX = '#7c3aed', '#b45309', '#115e59', '#3f3f46', '#a1a1aa'
SIDE = 0.5            # a bit's box
FULL = 4 * SIDE       # a value drawn in full bits
GAP = 0.2             # between a full value and the grey boxes
BOX_W, PITCH = 0.16, 0.22  # a grey box, and the step from one to the next
FORMATS = ['MXFP4', 'NVFP4']
BLOCK = [32, 16]
SCALE_NAME = ['E8M0', 'E4M3']
SCALE_FIELDS = [[(8, EXP)], [(1, SIGN), (4, EXP), (3, MAN)]]
VALUE_FIELDS = [(1, SIGN), (2, EXP), (1, MAN)]
TENSOR_SCALE = 0.125

def tex(value):
    """A number as LaTeX: 6.1e-05 becomes 6.1 × 10⁻⁵."""
    if math.isnan(value):
        return r'\text{NaN}'
    digits, _, power = f'{value:.8g}'.partition('e')
    return rf'{digits} \times 10^{{{int(power)}}}' if power else digits

def plain(value):
    return 'NaN' if math.isnan(value) else f'{value:.6g}'

def e2m1(b):
    s, e, m = int(b[0]), int(b[1:3], 2), int(b[3])
    size = m / 2 if e == 0 else (1 + m / 2) * 2 ** (e - 1)
    return -size if s else size

def e8m0(b):
    e = int(b, 2)
    return math.nan if e == 255 else 2.0 ** (e - 127)

def e4m3(b):
    s, e, m = int(b[0]), int(b[1:5], 2), int(b[5:], 2)
    if e == 15 and m == 7:
        return math.nan
    size = m / 8 * 2 ** -6 if e == 0 else (1 + m / 8) * 2 ** (e - 7)
    return -size if s else size

def scale_value(f, mx_bits, nv_bits):
    return e8m0(mx_bits) if int(f) == 0 else e4m3(nv_bits)

def join_bits(*bits):
    return ''.join(str(int(b)) for b in bits)

def plus(a, d):
    """`a + d`, where `a` is a number or a Scalar node."""
    return a + d if isinstance(a, (int, float)) else pie.lift(lambda a, d: a + d, pie.Scalar)(a, d)

def row_left(f):
    """The left end of format `f`'s row of values: the first in full bits, the grey boxes, the last in full bits."""
    return -(2 * FULL + 2 * GAP + (BLOCK[f] - 2) * PITCH - (PITCH - BOX_W)) / 2

def draw_bits(bits, fields, cx, y, side, font, shown=None):
    """Draws Text node `bits`, one box per bit, centered on x = `cx` (a number or a Scalar node) with its bottom at `y`.
    `fields`: (length, color) per field. `shown`: a Scalar node, 1 to draw the bits and 0 to hide them; None always draws them."""
    size = side if shown is None else pie.lift(lambda s: side * s, pie.Scalar)(shown)
    bit_at = pie.lift(lambda b, s, k: b[k] if s else '', pie.Text)
    width = sum(n for n, _ in fields) * side
    k = 0
    for length, color in fields:
        for _ in range(length):
            pie.rectangle(pie.point(plus(cx, k * side - width / 2), y, hidden=True), size, size, stroke=color)
            pie.text(bit_at(bits, 1 if shown is None else shown, k), plus(cx, (k + 0.5) * side - width / 2), y + side / 2, font, stroke=color)
            k += 1

def result_latex(f, v1, v2, mx_bits, nv_bits):
    """The formula of format `f`, then the first and the last stored numbers of the block."""
    f = int(f)
    scale = scale_value(f, mx_bits, nv_bits)
    pairs = ((1, v1), (BLOCK[f], v2))
    if f == 0:
        rows = [r'x_i &= v_i \times 2^{E - 127}']
        rows += [rf'x_{{{i}}} &= {tex(e2m1(v))} \times {tex(scale)} = {tex(e2m1(v) * scale)}' for i, v in pairs]
    else:
        rows = [r'x_i &= v_i \times s_{\text{block}} \times s_{\text{tensor}}']
        rows += [rf'x_{{{i}}} &= {tex(e2m1(v))} \times {tex(scale)} \times {tex(TENSOR_SCALE)} = {tex(e2m1(v) * scale * TENSOR_SCALE)}'
                 for i, v in pairs]
    return r'\begin{aligned}' + r' \\[0.4em] '.join(rows) + r'\end{aligned}'

pie.clear()
pie.scalar(0, out='gridOpacity')
fmt = pie.scalar(0, out='format')
values = [pie.scalar([0, 0, 1, 1], out='value1'), pie.scalar([1, 1, 0, 1], out='value2')]
scales = [pie.scalar([0, 1, 1, 1, 1, 1, 1, 0], out='mx_scale'), pie.scalar([0, 0, 1, 1, 1, 1, 0, 0], out='nv_scale')]
value_bits = [pie.lift(join_bits, pie.Text)(*[v[i] for i in range(4)]) for v in values]
scale_bits = [pie.lift(join_bits, pie.Text)(*[s[i] for i in range(8)]) for s in scales]
shown = [pie.lift(lambda f: 1 - int(f), pie.Scalar)(fmt), pie.lift(lambda f: int(f), pie.Scalar)(fmt)]

# Bottom row: the block's values. The first and the last in full bits, with their E2M1 value under them;
# a grey box for each value between them. The row is as long as the picked format's block.
first_cx = pie.lift(lambda f: row_left(int(f)) + FULL / 2, pie.Scalar)(fmt)
last_cx = pie.lift(lambda f: -row_left(int(f)) - FULL / 2, pie.Scalar)(fmt)
for bits, cx in zip(value_bits, (first_cx, last_cx)):
    draw_bits(bits, VALUE_FIELDS, cx, -2, SIDE, 15)
    pie.text(pie.lift(lambda b: plain(e2m1(b)), pie.Text)(bits), cx, -2.35, 14, stroke=GRAY)
box_x = pie.lift(lambda f, j: row_left(int(f)) + FULL + GAP + j * PITCH, pie.Scalar)
box_size = pie.lift(lambda f, j, size: size if j < BLOCK[int(f)] - 2 else 0, pie.Scalar)
for j in range(max(BLOCK) - 2):
    pie.rectangle(pie.point(box_x(fmt, j), -2, hidden=True), box_size(fmt, j, BOX_W), box_size(fmt, j, SIDE), fill=BOX, stroke=GRAY)
pie.text(pie.lift(lambda f: f'the {BLOCK[int(f)]} E2M1 values of a block', pie.Text)(fmt), 0, -1.1, 14, stroke=GRAY)

# Middle row: the block scale. Each format has its own bits; only the picked one is drawn.
for f in range(2):
    draw_bits(scale_bits[f], SCALE_FIELDS[f], 0, 0, 0.5, 15, shown[f])
block_label = lambda f, mx, nv: f'block scale ({SCALE_NAME[int(f)]}) = {plain(scale_value(f, mx, nv))}'
pie.text(pie.lift(block_label, pie.Text)(fmt, scale_bits[0], scale_bits[1]), 0, 0.85, 14, stroke=GRAY)

# NVFP4 only: a box around the block and its scale, one unit of the tensor, and smaller boxes for the units on either side
UNIT_LEFT, UNIT_BOTTOM, UNIT_TOP = row_left(1) - 0.2, -2.7, 1.15
OTHER_SIZES, OTHER_GAP = [(1.4, 2.4), (0.9, 1.6)], 0.3  # (width, height) of the boxes on each side, from the inside out
nv_size = pie.lift(lambda s, size: s * size, pie.Scalar)
pie.rectangle(pie.point(UNIT_LEFT, UNIT_BOTTOM, hidden=True), nv_size(shown[1], -2 * UNIT_LEFT), nv_size(shown[1], UNIT_TOP - UNIT_BOTTOM), stroke=GRAY)
inner = -UNIT_LEFT  # the distance from x = 0 to the inner edges of the next pair of boxes, less the gap
for w, h in OTHER_SIZES:
    bottom = (UNIT_BOTTOM + UNIT_TOP - h) / 2
    for x in (-inner - OTHER_GAP - w, inner + OTHER_GAP):
        pie.rectangle(pie.point(x, bottom, hidden=True), nv_size(shown[1], w), nv_size(shown[1], h), stroke=GRAY)
    inner += OTHER_GAP + w

# Top row, NVFP4 only: the tensor scale
pie.text(pie.lift(lambda f: f'tensor scale (FP32) = {TENSOR_SCALE:g}' if int(f) else '', pie.Text)(fmt), 0, 2.2, 14, stroke=GRAY)
# Lines from it to the unit's top corners. For MXFP4 both ends sit at the same point, so nothing shows.
nv_coord = pie.lift(lambda s, a, b: a if s else b, pie.Scalar)
for x in (UNIT_LEFT, -UNIT_LEFT):
    corner = pie.point(nv_coord(shown[1], x, 0), nv_coord(shown[1], UNIT_TOP, 2), hidden=True)
    pie.line(pie.point(0, 2, hidden=True), corner, stroke=GRAY)

pie.ui.radio(fmt, options=FORMATS, label='Format:')
pie.ui.checkboxes(values[0], options=['S', 'E₁', 'E₀', 'M'], label='First value:')
pie.ui.checkboxes(values[1], options=['S', 'E₁', 'E₀', 'M'], label='Last value:')
pie.ui.case_checkboxes(fmt, scales, options=[['E₇', 'E₆', 'E₅', 'E₄', 'E₃', 'E₂', 'E₁', 'E₀'],
                                             ['S', 'E₃', 'E₂', 'E₁', 'E₀', 'M₂', 'M₁', 'M₀']], label='Block scale:')
pie.ui.latex(pie.lift(result_latex, pie.Text)(fmt, value_bits[0], value_bits[1], scale_bits[0], scale_bits[1]))
```

<details>
<summary>Summary</summary>

| | MXFP4 | NVFP4 |
|---|---|---|
| Values | E2M1 | E2M1 |
| Values per block | $32$ | $16$ |
| Block scale | E8M0: $8$ exponent bits, no sign, no mantissa | FP8 E4M3: $1$ sign, $4$ exponent and $3$ mantissa bits |
| Tensor scale | none | one FP32 for the whole tensor |

The stored number $x_i$ is the value $v_i$ of 4-bit reprensetation times the scales:

$$\text{MXFP4: } x_i = v_i \times 2^{E - 127} \qquad \text{NVFP4: } x_i = v_i \times s_{\text{block}} \times s_{\text{tensor}}$$

</details>

---

## $16 \times 16$ blocks for weights

Nvidia added a special case for quantization of weight matrices in neural networks. When NVFP4 is used for training, one E4M3 scale is assigned to a $16 \times 16$ tile (as opposed to a row of $16$ numbers). 

The reason is the backward pass, which multiplies by $W^\top$. The $1 \times 16$ blocks of $W^\top$ are columns of $W$, so with $1 \times 16$ blocks a weight would get one scale going forward and another going back. A $16 \times 16$ tile is the same tile in $W$ and $W^\top$.

Run the editor to see the figure. The canvas shows a $32 \times 32$ weight matrix $W$. The weight $w_{3,5}$ is red. The block it shares a scale with is teal in the forward pass and purple in the backward pass.

```python-editor collapsed
GRAY, WEIGHT = '#3f3f46', '#dc2626'
HIGHLIGHT = ['#0d9488', '#7c3aed']  # the block of w: teal going forward, purple going back
HIGHLIGHT_NAME = ['Teal', 'Purple']
N, CELL = 32, 0.18
X0, Y1 = -N * CELL / 2, N * CELL / 2  # the left and the top edge of W
ROW, COL = 3, 5  # the weight the canvas follows
SHAPES = ['1×16', '16×16']
PASSES = ['Forward: W', 'Backward: Wᵀ']

def block(s, p):
    """The rows and the columns of W, each as (first, last), in the block of w for shape `s` and pass `p`."""
    tile_rows = (ROW // 16 * 16, ROW // 16 * 16 + 15)
    tile_cols = (COL // 16 * 16, COL // 16 * 16 + 15)
    if int(s) == 1:
        return tile_rows, tile_cols
    return ((ROW, ROW), tile_cols) if int(p) == 0 else (tile_rows, (COL, COL))

def block_rect(s, p, shown, k):
    """The block of w in pass `p` as a rectangle: k = 0, 1 the bottom-left corner, k = 2, 3 the width and the height.
    It has no size unless `p` is the pass `shown`."""
    (r0, r1), (c0, c1) = block(s, p)
    size = 1 if int(shown) == p else 0
    return [X0 + c0 * CELL, Y1 - (r1 + 1) * CELL, size * (c1 - c0 + 1) * CELL, size * (r1 - r0 + 1) * CELL][k]

def line_end(s, p, i, along, start):
    """Where grid line `i` ends. Every 16th line is drawn; the others only when the blocks run `along`
    the rows (0) or the columns (1) of W. A line that isn't drawn ends where it starts."""
    drawn = i % 16 == 0 or (int(s) == 0 and int(p) == along)
    return start + N * CELL if drawn else start

def grid_label(s, p):
    if int(s) == 1:
        return '16 × 16 tiles: the same in W and Wᵀ'
    return '1 × 16 blocks along the rows of W' if int(p) == 0 else '1 × 16 blocks along the rows of Wᵀ, the columns of W'

def tile_latex(s):
    """For both passes, the block of W that w shares a scale with, then whether the two are the same."""
    span = lambda a, b: f'{a}' if a == b else f'{a}..{b}'
    rows = []
    for p, name in ((0, r'\text{forward, } W'), (1, r'\text{backward, } W^\top')):
        (r0, r1), (c0, c1) = block(s, p)
        rows.append(rf'{name} &: w_{{{ROW},{COL}}} \text{{ shares a scale with }} W_{{{span(r0, r1)},\,{span(c0, c1)}}}')
    same = block(s, 0) == block(s, 1)
    rows.append(r'&\Rightarrow \text{' + ('the same block, the same scale' if same else 'different blocks, different scales') + '}')
    return r'\begin{aligned}' + r' \\[0.4em] '.join(rows) + r'\end{aligned}'

pie.clear()
pie.scalar(0, out='gridOpacity')
shape = pie.scalar(0, out='tile_shape')
pas = pie.scalar(0, out='tile_pass')

# The block of w first, then w, then the grid lines on top.
# One rectangle per pass, in its own color; only the one for the chosen pass has a size.
for p in (0, 1):
    rect = [pie.lift(block_rect, pie.Scalar)(shape, p, pas, k) for k in range(4)]
    pie.rectangle(pie.point(rect[0], rect[1], hidden=True), rect[2], rect[3], fill=HIGHLIGHT[p], stroke=HIGHLIGHT[p])
pie.rectangle(pie.point(X0 + COL * CELL, Y1 - (ROW + 1) * CELL, hidden=True), CELL, CELL, fill=WEIGHT, stroke=WEIGHT)
end = pie.lift(line_end, pie.Scalar)
for i in range(N + 1):
    y, x = Y1 - i * CELL, X0 + i * CELL
    pie.line(pie.point(X0, y, hidden=True), pie.point(end(shape, pas, i, 0, X0), y, hidden=True), stroke=GRAY)
    pie.line(pie.point(x, -Y1, hidden=True), pie.point(x, end(shape, pas, i, 1, -Y1), hidden=True), stroke=GRAY)
pie.text(pie.lift(grid_label, pie.Text)(shape, pas), 0, Y1 + 0.35, 14, stroke=GRAY)
legend = pie.lift(lambda p: f'Red: the weight w₃,₅. {HIGHLIGHT_NAME[int(p)]}: the block it shares a scale with.', pie.Text)
pie.text(legend(pas), 0, -Y1 - 0.35, 14, stroke=GRAY)

pie.ui.radio(shape, options=SHAPES, label='Block:')
pie.ui.radio(pas, options=PASSES, label='Pass:')
pie.ui.latex(pie.lift(tile_latex, pie.Text)(shape))
```

---

## Bits per value

A block scale is shared, so its bits are spread over the values of its block:

$$\text{bits per value} = \text{bits of a value} + \frac{\text{bits of the block scale}}{\text{values per block}}$$

| Format | Block | Bits per block | Bits per value |
|---|---|---:|---:|
| MXFP4 | $32$ values, E8M0 scale | $32 \times 4 + 8 = 136$ | $136 / 32 = 4.25$ |
| NVFP4 | $16$ values, E4M3 scale | $16 \times 4 + 8 = 72$ | $72 / 16 = 4.5$ |
| NVFP4, $16 \times 16$ tiles | $256$ values, E4M3 scale | $256 \times 4 + 8 = 1032$ | $1032 / 256 \approx 4.03$ |

NVFP4's FP32 tensor scale is shared by all $n$ values of a tensor, so it adds $32 / n$ bits per value. For a $4096 \times 4096$ weight matrix, $n \approx 1.7 \times 10^7$ and $32 / n \approx 1.9 \times 10^{-6}$ bits, too small to show in the tables.

<details>
<summary>Memory for a 7B-parameter model</summary>

For a model with $7 \times 10^9$ parameters, the memory is ($1$ GB $= 10^9$ bytes):

$$\text{memory} = \left(\frac{7 \times 10^9 \times \text{bits per value}}{8}\right) \text{ bytes}$$


| Format | Bits per value | Memory |
|---|---:|---:|
| BF16 | $16$ | $14$ GB |
| FP8 | $8$ | $7$ GB |
| MXFP4 | $4.25$ | $\approx 3.72$ GB |
| NVFP4 | $4.5$ | $\approx 3.94$ GB |
| NVFP4, $16 \times 16$ tiles | $\approx 4.03$ | $\approx 3.53$ GB |

Note how NVFP4 has an extra $0.25$ bits per value compared to MXFP4 for its finer scales. This is because it has twice the number of scales. 

</details>
