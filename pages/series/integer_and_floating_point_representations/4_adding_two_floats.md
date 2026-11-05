---
title: Adding two floating point numbers
description: How two floats are added, step by step: align the exponents, add the bits, normalize, round, with a made-up 3-bit mantissa.
date: 2026-11-05
canvas: none
sidebar: _series.md
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

MAN, PAST = '#115e59', '#be185d'  # the mantissa; bits past the mantissa
TOY_M, TOY_E, TOY_EXTRA = 3, 3, 6  # the made-up format's mantissa bits; a's exponent; columns past the mantissa
STEP_ROWS = {'align': 2, 'add': 3, 'normalize': 4, 'round': 5}  # how many rows each step shows
STEP_NAMES = list(STEP_ROWS)  # a step's index is its place here

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

def bit_tex(bit, c, m):
    """The bit in column `c`, as LaTeX: the leading bit or a carry left of it uncolored, the mantissa teal,
    past the mantissa rose. Column 0 also gets the binary point, right of the bit, without widening the column."""
    if bit == '':
        return ''
    tex = bit if c <= 0 else paint(bit, MAN if c <= m else PAST)
    return tex + r'\mathrlap{.}' if c == 0 else tex

def addition_latex(step, m, a, b, extra, d):
    """The rows that step `step`, its index in STEP_NAMES, shows of a + b, as a LaTeX array: one column per bit,
    columns -1 to m + extra as in `addition`. So the binary point and the end of the mantissa (the dashed line) are
    at the same place in every row. Rows 0 to 2 share the larger number's exponent, so a column holds the same
    power of 2 in each of them; the normalized and rounded rows use their own exponent."""
    data = addition(m, a, b, extra)
    if data is None:
        return r'\text{Type a positive } a \text{ and } b.'
    m, extra = int(m), int(extra)
    shown = STEP_ROWS[STEP_NAMES[int(step)]]
    cols = range(-1, m + extra + 1)

    def line(label, cells, more='', exponent=''):
        return ' & '.join([label, *cells, more, exponent])

    end_label = rf'\mathrlap{{\textcolor{{{MAN}}}{{\footnotesize \leftarrow \text{{ end of the mantissa}}}}}}'
    lines = [line(f'd = {int(d)}', [end_label if c == m + 1 else '' for c in cols])]
    for i, (label, e, bits, more) in enumerate(data['rows'][:shown]):
        if i == 2:  # the line under the two numbers, then the carries above the sum, as on paper
            lines.append(r'\hline ' + line('', [r'{\scriptstyle 1}' if c in data['carries'] else '' for c in cols]))
        lines.append(line(label if i < 3 else rf'\text{{{label}}}', [bit_tex(bits.get(c, ''), c, m) for c in cols],
                          r'\cdots' if more else '', rf'\times 2^{{{e}}}'))
    # Label, columns -1 to m, the end of the mantissa, columns m + 1 to m + extra, the dots, the exponent
    spec = 'r' + 'c' * (m + 2) + ':' + 'c' * extra + 'cl'
    table = rf'\begin{{array}}{{{spec}}} ' + r' \\ '.join(lines) + r' \end{array}'
    if shown < len(data['rows']):
        return table
    # The round step only: what is stored
    stored = rf"\text{{stored: mantissa }} {paint(data['mantissa'], MAN)} \text{{, exponent }} {data['E3']}"
    return rf'\begin{{array}}{{c}} {table} \\ {stored} \end{{array}}'

def bits_latex(m1, m2, m3, e):
    """One float of the made-up format: the leading 1, the point, the 3 mantissa bits, and its exponent and value."""
    m1, m2, m3, e = int(m1), int(m2), int(m3), int(e)
    bits = paint(rf'{m1}\,{m2}\,{m3}', MAN)
    mantissa = rf'\overbrace{{{bits}}}^{{\mathclap{{\textcolor{{{MAN}}}{{\text{{mantissa }} M}}}}}}'
    return rf'1.\,{mantissa} \times 2^{{{e}}} = {plain(toy_value(m1, m2, m3, e))}'

def float_latex(m1, m2, m3, e):
    m1, m2, m3, e = int(m1), int(m2), int(m3), int(e)
    bits = paint(f'{m1}{m2}{m3}', MAN)
    return (rf'1.{bits}_2 \times 2^{{{e}}} = \left(1 + \tfrac{{{m1}}}{{2}} + \tfrac{{{m2}}}{{4}} + \tfrac{{{m3}}}{{8}}\right)'
            rf' \times 2^{{{e}}} = {plain(toy_value(m1, m2, m3, e))}')

pie.clear()
m_bits = pie.scalar([1, 0, 1], out='toy_m')
e = pie.scalar(3, out='toy_e')

pie.ui.checkboxes(m_bits, options=['m₁', 'm₂', 'm₃'], label='M:')
pie.ui.slider(e, min=-2, max=4, step=1, label='E:')
# Explicit ids: `pie.clear()` in the next editor restarts the automatic ids, so its nodes would take these UIs' ids
pie.ui.latex(pie.lift(bits_latex, pie.Text)(m_bits[0], m_bits[1], m_bits[2], e, out='toy_bits_tex'))
pie.ui.latex(pie.lift(float_latex, pie.Text)(m_bits[0], m_bits[1], m_bits[2], e, out='toy_float_tex'))
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

Adding $1$ can carry into the leading bit, as in $1.111 + 0.001 = 10.000$. Then the sum is normalized again. The last line under the bits is what is stored: the mantissa, without the leading $1$, and the exponent. To see exactly half, untick every bit and set $d$ to $4$: $8 + 0.5$.''',
]

pie.clear()
step = pie.scalar(0, out='toy_step')
ma = pie.scalar([1, 0, 1], out='toy_ma')
mb = pie.scalar([0, 1, 1], out='toy_mb')
d = pie.scalar(2, out='toy_d')
# a = 1.(ma) × 2³ and b = 1.(mb) × 2^(3 − d)
a = pie.lift(toy_value, pie.Scalar)(ma[0], ma[1], ma[2], TOY_E)
b = pie.lift(lambda m1, m2, m3, d: toy_value(m1, m2, m3, TOY_E - int(d)), pie.Scalar)(mb[0], mb[1], mb[2], d)

pie.ui.radio(step, options=['1. Align', '2. Add', '3. Normalize', '4. Round'], label='Step:')
pie.ui.checkboxes(ma, options=['m₁', 'm₂', 'm₃'], label='a:')
pie.ui.checkboxes(mb, options=['m₁', 'm₂', 'm₃'], label='b:')
pie.ui.slider(d, min=0, max=TOY_EXTRA, step=1, label='d:')
# Explicit ids, so `pie.clear()` in the editor above can't give these UIs' ids to its own nodes
pie.ui.latex(pie.lift(addition_latex, pie.Text)(step, TOY_M, a, b, TOY_EXTRA, d, out='toy_add_tex'))
pie.ui.markdown(pie.lift(step_markdown, pie.Text)(step, TOY_M, a, b, TOY_EXTRA, out='toy_step_md'))
pie.ui.markdown(step, sections=STEP_TEXT)
```

**Note**: the rounding step loses information. This leads to a well known artifact of floating point representation: addition is not associative. Let's look at it next. 