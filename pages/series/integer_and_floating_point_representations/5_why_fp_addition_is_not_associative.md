---
title: Why floating point addition isn't associative
description: Each floating point addition rounds its exact sum, so the order of additions can change the result. The three ways a sum loses bits, shown in FP8 E5M2.
date: 2026-11-05
canvas: none
sidebar: _series.md
---

# Why floating point addition isn't associative

Floating point addition is commutative: $a + b$ and $b + a$ but not associative: $(a + b) + c$ can differ from $a + (b + c)$. This article shows when it differs. 

All examples use FP8 E5M2:

| Format | Exponent bits | Mantissa bits | Largest float |
|---|---:|---:|---:|
| E5M2 | $5$ | $2$ | $1.11_2 \times 2^{15} = 57344$ |

<details>
<summary>The numbers in the examples below, in binary</summary>

As $1.M_2 \times 2^E$, with the mantissa $M$ in teal:

| Number | $1.M_2 \times 2^E$ |
|---:|---|
| $1$ | $1.\textcolor{#115e59}{00}_2 \times 2^{0}$ |
| $4$ | $1.\textcolor{#115e59}{00}_2 \times 2^{2}$ |
| $5$ | $1.\textcolor{#115e59}{01}_2 \times 2^{2}$ |
| $8$ | $1.\textcolor{#115e59}{00}_2 \times 2^{3}$ |
| $8192$ | $1.\textcolor{#115e59}{00}_2 \times 2^{13}$ |
| $57344$ | $1.\textcolor{#115e59}{11}_2 \times 2^{15}$ |

</details>

## Three ways a sum loses bits

Every addition rounds its exact sum to the nearest float, as [Adding two floating point numbers](/series/integer_and_floating_point_representations/4_adding_two_floats) shows step by step. There are three ways rounding changes a sum. Run the editor, then pick one.

```python-editor collapsed
WAYS_TEXT = [  # each way a sum loses bits, with an example
r'''**1. The smaller number is shifted.** As an example

$$8 + 1 = \textcolor{#be185d}{8}$$

$$\underbrace{(8 + 1)}_{\textcolor{#be185d}{8}} + 1 = \textcolor{#be185d}{8} \neq \textcolor{#115e59}{10} = 8 + \underbrace{(1 + 1)}_{2}$$''',
r'''**2. The sum gets an extra bit in front.**

$$5 + 4 = \textcolor{#be185d}{8}$$

$$\underbrace{(5 + 4)}_{\textcolor{#be185d}{8}} - 4 = \textcolor{#be185d}{4} \neq \textcolor{#115e59}{5} = 5 + \underbrace{(4 - 4)}_{0}$$''',
r'''**3. The sum is too large.** A sum above the largest float, $57344$ in E5M2, becomes infinity.

$$57344 + 8192 = \textcolor{#be185d}{\infty}$$

$$\underbrace{(57344 + 8192)}_{\textcolor{#be185d}{\infty}} - 8192 = \textcolor{#be185d}{\infty} \neq \textcolor{#115e59}{57344} = 57344 + \underbrace{(8192 - 8192)}_{0}$$''',
]

pie.clear()
# Its own id: the next editor's case is `case`
way = pie.scalar(0, out='way')
pie.ui.radio(way, options=['Case 1', 'Case 2', 'Case 3'])
pie.ui.markdown(way, sections=WAYS_TEXT)
```

## Illustrating the bit loss for each case

Run the editor, then pick a case.

```python-editor collapsed
import math
from fractions import Fraction

MAN, PAST = '#115e59', '#be185d'  # the mantissa; bits past the mantissa
M, E_MAX = 2, 15  # E5M2: the mantissa bits; the largest exponent
MAX = Fraction(7, 4) * 2 ** E_MAX  # the largest float, 1.11₂ × 2¹⁵ = 57344
EXTRA = 2  # columns past the mantissa
CASES = [  # name, a, b: the addition in each case that loses bits
    ('Case 1', 8, 1),  # the smaller number is shifted
    ('Case 2', 5, 4),  # the sum gets an extra bit in front
    ('Case 3', 57344, 8192),  # the sum is too large
]
CASE_TEXT = [  # what happens in each case, in CASES order
r'''**Why $8 + 1 = \textcolor{#be185d}{8}$**

$b = 1$ moves 3 places right to reach $a$'s exponent, and its $1$ lands past the mantissa. $a + b = 9$ is exactly halfway between the floats $8$ and $10$, so it rounds to $8$, the one whose last mantissa bit is $0$.''',
r'''**Why $5 + 4 = \textcolor{#be185d}{8}$**

$a = 5$ and $b = 4$ have the same exponent, so nothing is shifted. But $a + b = 9 = 10.01_2 \times 2^2$ has two bits before the point. Normalizing moves it one place right, to $1.001_2 \times 2^3$, and its last $1$ lands past the mantissa. $9$ is exactly halfway between $8$ and $10$, so it rounds to $8$.''',
r'''**Why $57344 + 8192 = \textcolor{#be185d}{\infty}$**

$a + b = 65536$ is above the largest float, $57344$, so it becomes $\infty$.''',
]

def paint(value, color):
    return rf'\textcolor{{{color}}}{{{value}}}'

# Put in column M of the header row: it ends at that column's middle, just left of the dashed line, and runs left
# over the empty header cells. It has no width, so it widens no column.
END_LABEL = rf'\mathllap{{\textcolor{{{MAN}}}{{\footnotesize \text{{end of the mantissa }} \rightarrow}}}}'

def plain(x):
    """`x` as LaTeX: its shortest decimal, or ∞."""
    return r'\infty' if x == math.inf else f'{float(x):.10g}'

def exponent_of(x):
    """The e with 2^e ≤ x < 2^(e + 1), for a positive Fraction x: the place of its leading 1."""
    e = x.numerator.bit_length() - x.denominator.bit_length()
    return e if Fraction(2) ** e <= x else e - 1

def lowest_place(x):
    """The place of the last 1 of a nonzero Fraction x whose denominator is a power of 2."""
    n = abs(x.numerator)
    return (n & -n).bit_length() - 1 - (x.denominator.bit_length() - 1)

def round_e5m2(x):
    """`x`, a Fraction or ∞, rounded to the nearest E5M2 float: halfway cases to an even last bit, ±∞ past the
    largest float. Ignores the smallest exponent: fine for the numbers here."""
    if x == 0 or x in (math.inf, -math.inf):
        return x
    x = Fraction(x)
    gap = Fraction(2) ** (exponent_of(abs(x)) - M)
    r = round(x / gap) * gap  # Fraction's round() sends halfway cases to the even integer
    return math.copysign(math.inf, r) if abs(r) > MAX else r

def common_exponent(*values):
    """The exponent two numbers are added at: the larger one's. ∞ and 0 don't count."""
    es = [exponent_of(abs(v)) for v in values if v != 0 and v != math.inf]
    return max(es) if es else 0

def rows(case):
    """The four rows of case `case`'s a + b, each (label, value, exponent it is written with, note), the label and
    note as LaTeX: a and b at the larger one's exponent; a + b before rounding and after rounding, each at its own."""
    _, a, b = CASES[int(case)]
    a, b = Fraction(a), Fraction(b)
    s = a + b
    r = round_e5m2(s)
    e = common_exponent(a, b)
    too_large = paint(rf'{plain(s)} > {plain(MAX)}\text{{, the largest float}}', PAST) if r == math.inf else ''
    return [
        (f'a = {plain(a)}', a, e, ''),
        (f'b = {plain(b)}', b, e, ''),
        (rf'a + b = {plain(s)}\text{{, before rounding}}', s, common_exponent(s), ''),
        (rf'a + b = {plain(r)}\text{{, after rounding}}', r, common_exponent(r), too_large),
    ]

def row_bits(case, i):
    """Row i's bits, {column: bit}: column c holds the bit of 2^(e - c). Columns 0 to M, and past them up to its last 1."""
    _, v, e, _ = rows(case)[i]
    if v == math.inf:
        return {}
    av = abs(v)
    last = M if v == 0 else max(M, e - lowest_place(av))
    return {c: str(math.floor(av / Fraction(2) ** (e - c)) % 2) for c in range(0, min(last, M + EXTRA) + 1)}

def bit_tex(bit, c):
    """The bit in column `c`, as LaTeX: the leading bit uncolored, the mantissa teal, past the mantissa rose.
    Column 0 also gets the binary point, right of the bit, without widening the column."""
    if bit == '':
        return ''
    tex = bit if c == 0 else paint(bit, MAN if c <= M else PAST)
    return tex + r'\mathrlap{.}' if c == 0 else tex

def case_latex(case):
    """Case `case`'s a + b, as a LaTeX array: one column per bit, columns 0 to M + EXTRA, so the binary point and
    the end of the mantissa (the dashed line) are at the same place in every row.
    a and b share the larger one's exponent, so a column holds the same power of 2 in both."""
    cols = range(M + EXTRA + 1)
    lines = [' & '.join(['', *(END_LABEL if c == M else '' for c in cols), '', ''])]
    for i, (label, v, e, note) in enumerate(rows(case)):
        label = rf'{{\small {label}}}'  # smaller than the bits, so the bits stand out
        if v == math.inf:  # no bits: ∞ in the middle of the columns
            cells, exponent = [paint(r'\infty', PAST) if c == (M + EXTRA) // 2 else '' for c in cols], ''
        else:
            bits = row_bits(case, i)
            cells, exponent = [bit_tex(bits.get(c, ''), c) for c in cols], rf'\times 2^{{{e}}}'
        # The line under the two numbers added, as on paper
        lines.append((r'\hline ' if i == 2 else '') + ' & '.join([label, *cells, exponent, note]))
    # Label, columns 0 to M, the end of the mantissa, columns M + 1 to M + EXTRA, the exponent, the note
    spec = 'r' + 'c' * (M + 1) + ':' + 'c' * EXTRA + 'll'
    # \arraystretch: 1.4 times the usual row height, so the rows don't crowd each other
    return rf'\def\arraystretch{{1.4}} \begin{{array}}{{{spec}}} ' + r' \\ '.join(lines) + r' \end{array}'

pie.clear()
case = pie.scalar(0, out='case')

pie.ui.radio(case, options=[name for name, *_ in CASES])
# Explicit ids, so no other editor's `pie.clear()` can give these UIs' ids to its own nodes
pie.ui.latex(pie.lift(case_latex, pie.Text)(case, out='case_tex'))
pie.ui.markdown(case, sections=CASE_TEXT)
```
