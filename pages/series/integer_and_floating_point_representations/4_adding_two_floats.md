---
title: Adding two floating point numbers
description: How two floats are added, step by step: align the exponents, add the bits, normalize, round, with a made-up 3-bit mantissa.
canvas: left
---

# Adding two floating point numbers

This article goes through the four steps of FP addition: align, add, normalize and round. 

## Representing a normal positive FP $1.M \times 2^E$

To simplify, an FP is represented as $1.M \times 2^{E}$ and not $1.M \times 2^{E-B}$. The leading $1$ isn't stored, because every normal float has it. 

Run the editors and interact with the figures to understand each step. 

```python-editor collapsed
import math
import functools
from fractions import Fraction

MAN, PAST, GRAY = '#115e59', '#be185d', '#3f3f46'  # the mantissa; bits past the mantissa; the leading bit and the rest
SUPERSCRIPT = str.maketrans('-0123456789', '⁻⁰¹²³⁴⁵⁶⁷⁸⁹')
TOY_M, TOY_E, TOY_EXTRA = 3, 3, 6  # the made-up format's mantissa bits; a's exponent; columns past the mantissa
STEP_ROWS = {'align': 2, 'add': 3, 'normalize': 4, 'round': 5}  # how many rows each step shows
STEP_NAMES = list(STEP_ROWS)  # a step's index is its place here
ROW_Y = [2.0, 1.3, 0.2, -0.6, -1.4]  # the bottom of each row
UNIT = 62  # pixels per grid unit on the canvas: 1.25 × the default 50, so every figure is bigger

def sup(n):
    return str(n).translate(SUPERSCRIPT)

def plain(x):
    return f'{float(x):.10g}'

def paint(value, color):
    return rf'\textcolor{{{color}}}{{{value}}}'

def exponent_of(x):
    """The e with 2^e ≤ x < 2^(e + 1), for a positive Fraction x: the place of its leading 1."""
    e = x.numerator.bit_length() - x.denominator.bit_length()
    return e if Fraction(2) ** e <= x else e - 1

def to_fp(x, m):
    """Positive `x` rounded to the nearest float with `m` mantissa bits, exactly, as a Fraction. Halfway cases go to an even last bit."""
    x = Fraction(x)
    gap = Fraction(2) ** (exponent_of(x) - m)
    return round(x / gap) * gap  # Fraction's round() sends halfway cases to the even integer

def toy_value(m1, m2, m3, e):
    return (1 + int(m1) / 2 + int(m2) / 4 + int(m3) / 8) * 2.0 ** int(e)

def short(x):
    return f'{float(x):.5g}'

@functools.lru_cache(maxsize=256)
def addition(m, a, b, extra):
    """The rows of a + b with `m` mantissa bits, or None if a or b isn't positive. a and b are first rounded to floats.
    Row 0 is the larger of a and b; row 1 the smaller,
    its bits moved right to the larger one's exponent; row 2 the exact sum; row 3 the normalized sum; row 4 the rounded sum.
    Each row is (label, exponent, {column: bit}, more): column c holds the bit of 2^(exponent - c), so -1 is a carry,
    0 the leading bit, 1 to m the mantissa and m + 1 to m + extra the bits past it.
    `more` is true if 1s follow past the last column."""
    m, extra = int(m), int(extra)
    if a <= 0 or b <= 0:
        return None
    A, B = to_fp(a, m), to_fp(b, m)
    if A >= B:
        (big, big_name), (small, small_name) = (A, 'a'), (B, 'b')
    else:
        (big, big_name), (small, small_name) = (B, 'b'), (A, 'a')
    last = m + extra

    def row(label, x, e, first, stop):
        stop = min(stop, last)
        bits = {c: str(math.floor(x / Fraction(2) ** (e - c)) % 2) for c in range(first, stop + 1)}
        unit = Fraction(2) ** (e - stop)
        return label, e, bits, x != math.floor(x / unit) * unit

    E = exponent_of(big)
    d = E - exponent_of(small)
    s = big + small
    E2 = exponent_of(s)
    r = to_fp(s, m)
    E3 = exponent_of(r)
    rows = [
        row(f'{big_name} = {short(big)}', big, E, 0, m),
        row(f'{small_name} = {short(small)}', small, E, 0, d + m),
        row('a + b', s, E, 0 if E2 == E else -1, d + m),
        row('normalized', s, E2, 0, d + m + E2 - E),
        row('rounded', r, E3, 0, m),
    ]
    # The carry into column c: whether the columns right of it, added, reach 2^(E - c)
    L = d + m  # the last column of the exact sum
    unit = Fraction(2) ** (E - L)
    ia, ib = int(big / unit), int(small / unit)
    carries = {c: '1' for c in range(-1, min(L, last) + 1) if ((ia % 2 ** (L - c)) + (ib % 2 ** (L - c))) >> (L - c)}
    # The mantissa the rounded sum is stored with
    mantissa = ''.join(rows[4][2][c] for c in range(1, m + 1))
    return dict(rows=rows, carries=carries, m=m, d=d, E=E, E2=E2, E3=E3, s=s, r=r, big=big, small=small, big_name=big_name,
                small_name=small_name, mantissa=mantissa)

def add_cell(m, a, b, extra, i, c, part):
    """Row `i`'s bit in column `c`, if it is in `part`, else '': 0 the leading bit or a carry left of it,
    1 the mantissa, 2 past the mantissa."""
    data = addition(m, a, b, extra)
    if data is None:
        return ''
    bit = data['rows'][i][2].get(c, '')
    return bit if (0 if c <= 0 else 1 if c <= int(m) else 2) == part else ''

def add_carry(m, a, b, extra, c):
    data = addition(m, a, b, extra)
    return data['carries'].get(c, '') if data else ''

def add_row_label(m, a, b, extra, i):
    data = addition(m, a, b, extra)
    return data['rows'][i][0] if data else ''

def add_row_exponent(m, a, b, extra, i):
    data = addition(m, a, b, extra)
    if data is None:
        return ''
    _, e, _, more = data['rows'][i]
    return ('… ' if more else '') + f'× 2{sup(e)}'

def stored_text(m, a, b, extra):
    """The rounded sum's stored fields, for the canvas."""
    data = addition(m, a, b, extra)
    if data is None:
        return ''
    return f"stored: mantissa {data['mantissa']}, exponent {data['E3']}"

def stored_markdown(data):
    """The rounded sum's stored fields, as markdown."""
    return f"The sum is stored as mantissa $M = {data['mantissa']}$ and exponent $E = {data['E3']}$."

def step_markdown(step, m, a, b, extra):
    """What step `step`, its index in STEP_NAMES, does to a + b, with the numbers, as markdown."""
    step = STEP_NAMES[int(step)]
    data = addition(m, a, b, extra)
    if data is None:
        return 'Type a positive $a$ and $b$.'
    m, d, E, E2, s, r, small = data['m'], data['d'], data['E'], data['E2'], data['s'], data['r'], data['small_name']
    if step == 'align':
        if d == 0:
            lines = ['The exponents are equal, so nothing moves.']
        else:
            lines = [f"${small}$'s exponent is ${d}$ smaller. It goes up by ${d}$ to ${E}$, so ${small}$'s bits move ${d}$ places right. "
                     f"${min(d, m + 1)}$ of its ${m + 1}$ bits land past the mantissa, in rose: the float can't keep them, but the addition uses them."]
    elif step == 'add':
        lines = ['Add column by column, from the right. The small $1$s above the sum are carries.',
                 f'$a + b = {plain(s)}$ exactly.']
        if E2 > E:
            lines.append('The last carry made a new column left of the leading bit.')
    elif step == 'normalize':
        if E2 > E:
            lines = [f'The sum has two bits before the point, so it moves $1$ place right and its exponent goes up from ${E}$ to ${E2}$.']
        else:
            lines = ['The sum already starts with $1.$, so nothing moves.']
    else:
        gap = Fraction(2) ** (E2 - m)  # the value of the last mantissa place
        cut = s - math.floor(s / gap) * gap
        if cut == 0:
            lines = ['No bit past the mantissa is $1$, so nothing is rounded.']
        else:
            lines = [f'The bits past the mantissa are worth ${plain(cut)}$. Half of the last mantissa place is ${plain(gap / 2)}$.']
            if cut < gap / 2:
                lines.append('Less than half: round down, and drop them.')
            elif cut > gap / 2:
                lines.append('More than half: round up, and add $1$ to the last mantissa bit.')
            else:
                lines.append('Exactly half: round to the neighbor whose last mantissa bit is $0$.')
            if data['E3'] > E2:
                lines.append(f"Rounding up carried into the leading bit, so the sum is normalized again: exponent ${data['E3']}$.")
        lines.append(rf'$a + b = {plain(s)} \to {plain(r)}$')
        lines.append(stored_markdown(data))
    return '\n\n'.join(lines)

def if_row(f, i, rows, *args):
    """f(*args), or '' if row `i` isn't among the first `rows` rows, the ones the step shows."""
    return f(*args) if i < int(rows) else ''

def draw_addition(step, m, a, b, extra, side):
    """Draws the rows that step `step`, a Scalar node holding its index in STEP_NAMES, shows of a + b, one column per bit.
    `m`: the mantissa bits. Gray bits are the leading bit; teal bits the mantissa; rose bits are past the mantissa.
    Every row is drawn; the rows the step doesn't show have no text and boxes of no size."""
    n_cols = m + extra + 2  # columns -1 to m + extra
    x0 = -n_cols * side / 2 - 0.5
    col_x = lambda c: x0 + (c + 1) * side
    args = (m, a, b, extra)
    rows = pie.lift(lambda s: STEP_ROWS[STEP_NAMES[int(s)]], pie.Scalar)(step)
    shown = pie.lift(if_row, pie.Text)
    box = pie.lift(lambda i, rows: side if i < int(rows) else 0, pie.Scalar)  # a box's side, 0 in a row not shown
    for i in range(len(ROW_Y)):
        y = ROW_Y[i]
        box_side = box(i, rows)
        pie.text(shown(add_row_label, i, rows, *args, i), x0 - 1.1, y + side / 2, 16, stroke=GRAY)
        for c in range(-1, m + extra + 1):
            if c == -1 and i != 2:  # only the exact sum can carry into a new column
                continue
            pie.rectangle(pie.point(col_x(c), y, hidden=True), box_side, box_side, stroke=GRAY)
            for part, color in ((0, GRAY), (1, MAN), (2, PAST)):
                pie.text(shown(add_cell, i, rows, *args, i, c, part), col_x(c) + side / 2, y + side / 2, 18, stroke=color)
        # The binary point, in the leading bit's box, right of the bit
        pie.text(shown(lambda: '.', i, rows), col_x(0) + side * 0.78, y + side / 2, 18, stroke=GRAY)
        pie.text(shown(add_row_exponent, i, rows, *args, i), col_x(m + extra + 1) + 0.7, y + side / 2, 16, stroke=GRAY)
    # From the add step on: the line under the two numbers, and the carries above the sum, as on paper.
    # The line ends where it starts before then.
    line_end = pie.lift(lambda rows: col_x(m + extra + 1) if int(rows) > 2 else col_x(-1), pie.Scalar)(rows)
    pie.line(pie.point(col_x(-1), 1.2, hidden=True), pie.point(line_end, 1.2, hidden=True), stroke=GRAY)
    for c in range(-1, m + extra + 1):
        pie.text(shown(add_carry, 2, rows, *args, c), col_x(c) + side / 2, ROW_Y[2] + side + 0.15, 13, stroke=GRAY)
    # The end of the mantissa, after column m, down to the last row shown
    end_x = col_x(m + 1)
    end_bottom = pie.lift(lambda rows: ROW_Y[int(rows) - 1] - 0.15, pie.Scalar)(rows)
    pie.line(pie.point(end_x, end_bottom, hidden=True), pie.point(end_x, ROW_Y[0] + side + 0.2, hidden=True), stroke=MAN)
    pie.text('end of the mantissa', end_x, ROW_Y[0] + side + 0.45, 15, stroke=MAN)
    # The round step only: what is stored
    pie.text(shown(stored_text, 4, rows, *args), x0 + n_cols * side / 2, ROW_Y[4] - 0.45, 16, stroke=GRAY)

def float_latex(m1, m2, m3, e):
    m1, m2, m3, e = int(m1), int(m2), int(m3), int(e)
    bits = paint(f'{m1}{m2}{m3}', MAN)
    return (rf'1.{bits}_2 \times 2^{{{e}}} = \left(1 + \tfrac{{{m1}}}{{2}} + \tfrac{{{m2}}}{{4}} + \tfrac{{{m3}}}{{8}}\right)'
            rf' \times 2^{{{e}}} = {plain(toy_value(m1, m2, m3, e))}')

# One float of the made-up format: the leading 1, the point, the 3 mantissa bits, and its exponent
pie.clear()
pie.scalar(0, out='gridOpacity')
pie.scalar(UNIT, out='unit')
m_bits = pie.scalar([1, 0, 1], out='toy_m')
e = pie.scalar(3, out='toy_e')
SIDE1, X1 = 0.6, -1.6
pie.rectangle(pie.point(X1, 0, hidden=True), SIDE1, SIDE1, stroke=GRAY)
pie.text('1', X1 + SIDE1 / 2, SIDE1 / 2, 20, stroke=GRAY)
pie.text('leading 1: not stored', X1 + SIDE1 / 2, -0.4, 16, stroke=GRAY)
pie.text('.', X1 + SIDE1 * 0.78, SIDE1 / 2, 20, stroke=GRAY)  # the binary point, in the leading 1's box, right of the 1
bit_text = pie.lift(lambda bit: str(int(bit)), pie.Text)
for k in range(3):
    x = X1 + (k + 1) * SIDE1
    pie.rectangle(pie.point(x, 0, hidden=True), SIDE1, SIDE1, stroke=MAN)
    pie.text(bit_text(m_bits[k]), x + SIDE1 / 2, SIDE1 / 2, 20, stroke=MAN)
pie.text('mantissa M', X1 + 2.5 * SIDE1, SIDE1 + 0.35, 16, stroke=MAN)
value_text = pie.lift(lambda m1, m2, m3, e: f'× 2{sup(int(e))} = {plain(toy_value(m1, m2, m3, e))}', pie.Text)
pie.text(value_text(m_bits[0], m_bits[1], m_bits[2], e), X1 + 4 * SIDE1 + 1.3, SIDE1 / 2, 20, stroke=GRAY)

pie.ui.checkboxes(m_bits, options=['m₁', 'm₂', 'm₃'], label='M:')
pie.ui.slider(e, min=-2, max=4, step=1, label='E:')
pie.ui.latex(pie.lift(float_latex, pie.Text)(m_bits[0], m_bits[1], m_bits[2], e))
```

---

## The four steps

Run the editor, then pick a step. Tick $a$'s and $b$'s mantissa bits, and move $d$, how much smaller $b$'s exponent is. All four steps add the same $a$ and $b$.

```python-editor collapsed
STEP_TEXT = [  # what each step does, in STEP_NAMES order
r'''**1. Align.** To add, both numbers need the same exponent. The smaller number's exponent goes up to the larger one's, and to keep its value, its bits move right by the same number of places, $d$. Bits that move past the last mantissa place are drawn in rose. **The float can't keep them, but the addition still uses them.**''',
r'''**2. Add.** With the exponents equal, the bits add column by column, from right to left, as on paper.''',
r'''**3. Normalize.** Make sure the number is represented in the standard format $1.M \times 2^E$.''',
r'''**4. Round.** The float keeps only 3 mantissa bits, so the rose bits must go. What happens depends on them:

- **first rose bit is $0$**: less than half. Drop them.
- **first rose bit is $1$, and another $1$ follows**: more than half. Drop them and add $1$ to the last mantissa bit.
- **$1$ followed by only $0$s**: exactly half. Pick whichever of the two leaves the last mantissa bit $0$. This is called round half to even.

Adding $1$ can carry into the leading bit, as in $1.111 + 0.001 = 10.000$. Then the sum is normalized again. The last line on the canvas is what is stored: the mantissa, without the leading $1$, and the exponent. To see exactly half, untick every bit and set $d$ to $4$: $8 + 0.5$.''',
]

pie.clear()
pie.scalar(0, out='gridOpacity')
pie.scalar(UNIT, out='unit')
step = pie.scalar(0, out='toy_step')
ma = pie.scalar([1, 0, 1], out='toy_ma')
mb = pie.scalar([0, 1, 1], out='toy_mb')
d = pie.scalar(2, out='toy_d')
# a = 1.(ma) × 2³ and b = 1.(mb) × 2^(3 − d)
a = pie.lift(toy_value, pie.Scalar)(ma[0], ma[1], ma[2], TOY_E)
b = pie.lift(lambda m1, m2, m3, d: toy_value(m1, m2, m3, TOY_E - int(d)), pie.Scalar)(mb[0], mb[1], mb[2], d)
draw_addition(step, TOY_M, a, b, TOY_EXTRA, 0.5)
# d's value, above the row labels: the slider doesn't show it
x_labels = -(TOY_M + TOY_EXTRA + 2) * 0.5 / 2 - 0.5 - 1.1  # where draw_addition puts the row labels
pie.text(pie.lift(lambda d: f'd = {int(d)}', pie.Text)(d), x_labels, ROW_Y[0] + 0.5 + 0.45, 16, stroke=GRAY)

pie.ui.radio(step, options=['1. Align', '2. Add', '3. Normalize', '4. Round'], label='Step:')
pie.ui.markdown(step, sections=STEP_TEXT)
pie.ui.checkboxes(ma, options=['m₁', 'm₂', 'm₃'], label='a:')
pie.ui.checkboxes(mb, options=['m₁', 'm₂', 'm₃'], label='b:')
pie.ui.slider(d, min=0, max=TOY_EXTRA, step=1, label='d:')
pie.ui.markdown(pie.lift(step_markdown, pie.Text)(step, TOY_M, a, b, TOY_EXTRA))
```

**Note**: the rounding step loses information. This leads to a well known artifact of floating point representation: addition is not associative. Let's look at it next. 