---
title: Anatomy of a floating point number
description: How a floating point value is calculated from its bits, how inf and NaN are represented, what normal and subnormal modes are, and why they matter.
canvas: left
sidebar: _series.md
---

# Anatomy of a floating point number

A floating-point number has three components:

- a sign bit $\textcolor{#7c3aed}{S}$
- a biased exponent $\textcolor{#b45309}{E}$
- a mantissa $\textcolor{#115e59}{M}$

Bias ($B$) is set to $2^{\text{n} - 1} - 1$ where $n$ is the number of exponent bits ($5$ in this example).

The function that maps these bits to a decimal value is:

$$
n = (-1)^{\textcolor{#7c3aed}{S}} \times \begin{cases} 1.\textcolor{#115e59}{M} \times 2^{\textcolor{#b45309}{E} - B} & \text{if } \textcolor{#b45309}{E} \neq \text{all 0s} \quad (\text{normal}) \\ 0.\textcolor{#115e59}{M} \times 2^{1 - B} & \text{if } \textcolor{#b45309}{E} = \text{all 0s} \quad (\text{subnormal}) \end{cases}
$$

Run the editor below first: the other editors on this page use its functions. 

```python-editor collapsed
SIGN, EXP, MAN, GRAY = '#7c3aed', '#b45309', '#115e59', '#3f3f46'
SIDE = 0.5

def paint(value, color):
    return rf'\textcolor{{{color}}}{{{value}}}'

def tex(value):
    """A number as LaTeX: 6.1e-05 becomes 6.1 × 10⁻⁵."""
    digits, _, power = f'{value:.8g}'.partition('e')
    return rf'{digits} \times 10^{{{int(power)}}}' if power else digits

def decode(bits, special=True):
    """The mode, and the calculation of the value as LaTeX.
    `special`: an all-1s exponent means inf or NaN."""
    s, e, m = bits.split()
    sign, E, M = (-1) ** int(s), int(e, 2), int(m, 2) / 2 ** len(m)
    B = 2 ** (len(e) - 1) - 1
    if special and '0' not in e:
        return ('NaN', r'n = \text{NaN}') if M else ('infinity', rf'n = {"+-"[int(s)]}\infty')
    if E == 0:
        mode, significand, exponent = 'subnormal' if M else 'zero', M, '1'
    else:
        mode, significand, exponent = 'normal', 1 + M, paint(E, EXP)
    value = sign * significand * 2.0 ** ((E or 1) - B)
    return mode, rf'n = (-1)^{{{paint(s, SIGN)}}} \times {paint(significand, MAN)} \times 2^{{{exponent} - {B}}} = {tex(value)}'

def draw_bits(name, bits, lengths, caption, notes, special=True, calc=None):
    """Draws the Text node `bits`, e.g. '0 01001 0110000001'. Everything follows it.
    `notes`: the label under each of the three fields, or None for no bracket.
    `name` keeps this block's calculation apart from the other blocks'.
    `calc`: a Text node to show in place of the calculation from `decode`."""
    bit_at = pie.lift(lambda b, k: b.replace(' ', '')[k], pie.Text)
    x = -(sum(lengths) + 2) * SIDE / 2
    k = 0
    centers = []
    for length, color, note in zip(lengths, (SIGN, EXP, MAN), notes):
        start = x
        for _ in range(length):
            pie.rectangle(pie.point(x, 0, hidden=True), SIDE, SIDE, stroke=color)
            pie.text(bit_at(bits, k), x + SIDE / 2, SIDE / 2, 15, stroke=color)
            x, k = x + SIDE, k + 1
        centers.append((start + x) / 2)
        # From right to left, so that the bracket opens below the bits
        if note is not None:
            pie.annotate_curly_bracket(pie.point(x, -0.1, hidden=True), pie.point(start, -0.1, hidden=True), note, stroke=color)
        x += SIDE
    pie.text(caption, 0, 3.4, 14, 8, -1, stroke=GRAY)
    pie.text(pie.lift(lambda b: decode(b, special)[0], pie.Text)(bits), centers[1], 1, 15, stroke=EXP)
    if calc is None:
        calc = pie.lift(lambda b: decode(b, special)[1], pie.Text)(bits, out=f'{name}_calc')
    pie.ui.latex(calc)

def float_view(name, presets, caption, explain=None, sections=None):
    """`presets`: one (option, bits, sign note, exponent note, mantissa note) per case. A radio picks the case.
    `caption`: a string, or one string per case.
    `explain`: one LaTeX string per case, shown in place of the calculation.
    `sections`: one markdown string per case, shown below the calculation."""
    pie.clear()
    pie.scalar(0, out='gridOpacity')
    pick = pie.scalar(0, out=name)
    if len(presets) > 1:
        pie.ui.radio(pick, options=[p[0] for p in presets], label='Case:')
    chosen = lambda col: pie.lift(lambda i: presets[int(i)][col], pie.Text)(pick)
    notes = [chosen(c) if any(p[c] for p in presets) else None for c in (2, 3, 4)]
    if not isinstance(caption, str):
        captions = caption
        caption = pie.lift(lambda i: captions[int(i)], pie.Text)(pick)
    calc = None if explain is None else pie.lift(lambda i: explain[int(i)], pie.Text)(pick, out=f'{name}_calc')
    draw_bits(name, chosen(1), (1, 5, 10), caption, notes, calc=calc)
    if sections is not None:
        pie.ui.markdown(pick, sections=sections)

float_view('pick_parts', [
    ('', '0 01001 0110000001', 'sign S', 'exponent E', 'mantissa M'),
], 'Components of a floating point representation')
```

<details>
<summary>Fully working example</summary>

View the bit string $0010010110000001$ as:

$$\underbrace{\textcolor{#7c3aed}{0}}_{\text{sign}} \;|\; \underbrace{\textcolor{#b45309}{01001}}_{\text{exponent}} \;|\; \underbrace{\textcolor{#115e59}{0110000001}}_{\text{mantissa}}$$

- $\textcolor{#7c3aed}{S} = 0$
- $\textcolor{#b45309}{E} = 01001_2 = 9$
- $\textcolor{#115e59}{M} = 0110000001_2$
- $B = 2^{5-1} - 1 = 15$

$$
\begin{aligned}
n &= (-1)^0 \times 1.0110000001_2 \times 2^{9 - 15} \\
  &= 1.0110000001_2 \times 2^{-6} \\
  &= \left(1 + \tfrac{1}{4} + \tfrac{1}{8} + \tfrac{1}{1024}\right) \times 2^{-6} \\
  &= 1.3759765625 \times 2^{-6} \\
  &\approx 0.02149963
\end{aligned}
$$

</details>

---

## Normal and subnormal modes

FP representation has two modes, depending on the exponent bits. The way to calculate the decimal value is different for the two.

- **Normal**: the exponent $\textcolor{#b45309}{E}$ has at least one non-zero bit
- **Subnormal**: all exponent bits are $0$

Run the editor and switch between the two cases. You can drag the buttons onto the canvas by their ⋮⋮ grip.

```python-editor collapsed
float_view('pick_modes', [
    ('Normal', '0 01001 0110000001', '', 'at least one non-zero bit', ''),
    ('Subnormal', '0 00000 0110000001', '', 'all bits are 0', ''),
], 'FP representation has two modes: normal and subnormal, depending on the exponent bits. Normal mode is fast, subnormal is slow.')
```

**Note**: Evaluating a decimal under subnormal mode is slow and expensive.

---

## Handling `0`, `inf` and `NaN`

Run the editor and switch between the cases.

```python-editor collapsed
ZERO_CAPTION = 'A zero is represented by setting all mantissa and exponent bits to 0. The sign bit preserves the sign of underflow, thus distinguishing approaching zero from above and below.'
SPECIAL_CAPTION = 'Infinity and NaNs are represented by setting all exponent bits to 1. For infinity, all mantissa bits are 0. All other mantissa bits are mapped to NaN. Mantissa bits are preserved to decode and diagnose why the NaN was produced.'
ZERO_MD = r'''
#### Handling `0`

A zero is represented by setting all the mantissa and exponent bits to $0$, which the subnormal formula maps to $0$. This actually gives two zeros, one for each value of the sign bit: $+0$ and $-0$.
'''
INF_MD = r'''
#### Handling `inf`

Infinity is represented by setting all exponent bits to $1$ and all mantissa bits to $0$. The sign bit then chooses between `inf` and `-inf`.
'''
NAN_MD = r'''
#### Handling `NaN`

If the exponent is all $1$s but the mantissa has at least one non-zero bit, the value is $NaN$. Any such bit pattern in the mantissa works, which is why there are many distinct NaN encodings.
'''
float_view('pick_special', [
    ('+0', '0 00000 0000000000', '', 'all bits are 0', 'all bits are 0'),
    ('−0', '1 00000 0000000000', '', 'all bits are 0', 'all bits are 0'),
    ('+∞', '0 11111 0000000000', '', 'all bits are 1', 'all bits are 0'),
    ('−∞', '1 11111 0000000000', '', 'all bits are 1', 'all bits are 0'),
    ('NaN', '0 11111 1000000001', '', 'all bits are 1', 'at least one non-zero bit'),
], [ZERO_CAPTION] * 2 + [SPECIAL_CAPTION] * 3, sections=[ZERO_MD] * 2 + [INF_MD] * 2 + [NAN_MD])
```

---

## Min and max values

Since a FP with an all-$1$s exponent is either `inf` or `NaN`, the largest usable exponent is $11 \cdots 10$.

```python-editor collapsed
WHY = [
    r'''\begin{aligned}
    \textcolor{#b45309}{E} &= \textcolor{#b45309}{11110_2} = 30 \\[0.6em]
    1.\textcolor{#115e59}{M} &= 1.\textcolor{#115e59}{1111111111_2} = 2 - 2^{-10} \\[0.6em]
    n &= (2 - 2^{-10}) \times 2^{30 - 15} = 65504
    \end{aligned}''',
    r'''\begin{aligned}
    \textcolor{#b45309}{E} &= \textcolor{#b45309}{00001_2} = 1 \\[0.6em]
    1.\textcolor{#115e59}{M} &= 1.\textcolor{#115e59}{0000000000_2} = 1 \\[0.6em]
    n &= 1 \times 2^{1 - 15} = 2^{-14} \approx 6.10 \times 10^{-5}
    \end{aligned}''',
    r'''\begin{aligned}
    \textcolor{#b45309}{E} &= \textcolor{#b45309}{00000_2} = 0 \\[0.6em]
    0.\textcolor{#115e59}{M} &= 0.\textcolor{#115e59}{1111111111_2} = 1 - 2^{-10} \\[0.6em]
    n &= (1 - 2^{-10}) \times 2^{1 - 15} = (1 - 2^{-10}) \times 2^{-14} \approx 6.10 \times 10^{-5}
    \end{aligned}''',
    r'''\begin{aligned}
    \textcolor{#b45309}{E} &= \textcolor{#b45309}{00000_2} = 0 \\[0.6em]
    0.\textcolor{#115e59}{M} &= 0.\textcolor{#115e59}{0000000001_2} = 2^{-10} \\[0.6em]
    n &= 2^{-10} \times 2^{1 - 15} = 2^{-24} \approx 5.96 \times 10^{-8}
    \end{aligned}''',
]
float_view('pick_limits', [
    ('Max value', '0 11110 1111111111', '', 'all but last bit = 1', 'all bits = 1'),
    ('Min normal', '0 00001 0000000000', '', 'all but last bit = 0', 'all bits = 0'),
    ('Max subnormal', '0 00000 1111111111', '', 'all bits = 0', 'all bits = 1'),
    ('Min subnormal', '0 00000 0000000001', '', 'all bits = 0', 'all but last bit = 0'),
], 'Since all exponent bits = 1 represents ∞ or NaN, the largest finite value has a 0 as its last exponent bit. The smallest finite value simply flips the sign bit. The minimum values for the two modes also follow similar logic.', explain=WHY)
```

The negative counterparts are obtained by flipping the sign bit.

---

## Subnormals enable gradual underflow and lexicographic ordering

By interpreting the all-$0$s exponent as $0.M \times 2^{1 - B}$, the interval $[0,\ 2^{1 - B})$ is filled evenly with $2^{\text{mantissa bits}}$ values, and lexicographic order keeps matching numeric order all the way down to $0$.

The editor below uses a toy format with $2$ exponent bits and $2$ mantissa bits, so $B = 1$. Switch the rule for the all-$0$s exponent and watch the dots near $0$ on the canvas.

```python-editor collapsed
RULES = ['Subnormal', 'Flush to zero', 'Read as normal']
PATTERNS = [(e, m) for e in range(3) for m in range(4)]  # exponent 00 to 10, mantissa 00 to 11

def toy_value(e, m, rule):
    """The value of exponent bits `e` and mantissa bits `m` (2 each, B = 1) under `rule`."""
    if e == 0 and RULES[rule] == 'Subnormal':
        return m / 4 * 2 ** (1 - 1)
    if e == 0 and RULES[rule] == 'Flush to zero':
        return 0.0
    return (1 + m / 4) * 2 ** (e - 1)

def toy_formula(rule):
    """The value of a non-negative float under `rule`, by cases of the exponent."""
    E, M = paint('E', EXP), paint('M', MAN)
    zero_case = [rf'0.{M} \times 2^{{1 - B}}', '0', rf'1.{M} \times 2^{{0 - B}}'][int(rule)]
    return (rf'n = \begin{{cases}} 1.{M} \times 2^{{{E} - B}} & \text{{if }} {E} \neq \text{{all 0s}} \\'
            rf' {zero_case} & \text{{if }} {E} = \text{{all 0s}} \end{{cases}}')

def toy_x(value):
    return (value - 1.75) * 1.6

def toy_table(rule):
    """The first 5 bit patterns under `rule`, with each value's step from the row above."""
    rows, prev = [], None
    for e, m in PATTERNS[:5]:
        v = toy_value(e, m, int(rule))
        cells = [paint(0, SIGN) + r'\,' + paint(f'{e:02b}', EXP) + r'\,' + paint(f'{m:02b}', MAN),
                 tex(v), '' if prev is None else '+' + tex(v - prev)]
        # The last row is the first pattern whose exponent isn't all 0s
        cells.append(paint(r'\text{normal}', GRAY) if e else '')
        rows.append(' & '.join(cells))
        prev = v
    return (r'\begin{array}{cccl} \text{bits} & n & \text{step} & \\ \hline '
            + r' \\ '.join(rows[:-1]) + r' \\ \hdashline ' + rows[-1] + r' \end{array}')

UNDERFLOW_MD = [r'''
#### Subnormal: what floats do

An all-$0$s exponent means $0.M \times 2^{1-B}$. The values from $0$ to $1$ are $0.25$ apart, the same spacing as from $1$ to $2$. Each next bit pattern is the next larger value.
''', r'''
#### Flush to zero: counterexample

An all-$0$s exponent means $0$, whatever $M$ is. Four bit patterns mean $0$, and the next one jumps to $2^{1-B} = 1$. Nothing between $0$ and $1$ can be stored, so a result below $1$ drops straight to $0$.
''', r'''
#### Read as normal: counterexample

An all-$0$s exponent is read like any other: $1.M \times 2^{0-B}$. The order holds, but no bit pattern means $0$. The smallest value is $2^{-B} = 0.5$, and nothing in $[0,\ 0.5)$ can be stored.
''']

pie.clear()
pie.scalar(0, out='gridOpacity')
rule = pie.scalar(0, out='pick_underflow')
pie.line(pie.point(toy_x(0) - 0.3, 0, hidden=True), pie.point(toy_x(3.5) + 0.3, 0, hidden=True), stroke=GRAY)
for tick in range(4):
    pie.text(str(tick), toy_x(tick), -0.4, 14, stroke=GRAY)
dot_x = pie.lift(lambda r, e, m: toy_x(toy_value(int(e), int(m), int(r))), pie.Scalar)
# The all-0s exponent dots last, so they are drawn on top
for e, m in sorted(PATTERNS, key=lambda p: p[0] == 0):
    pie.point(dot_x(rule, e, m), 0, fill=EXP if e == 0 else GRAY)

pie.ui.radio(rule, options=RULES, label='All-0s exponent:')
pie.ui.latex(pie.lift(toy_formula, pie.Text)(rule))
pie.ui.latex(pie.lift(toy_table, pie.Text)(rule))
pie.ui.markdown(rule, sections=UNDERFLOW_MD)
```

Note the _gradual_ jump from minimum normal to maximum subnormal in the above example.

---

## Not all representations have `inf` and `NaN`

| Format         | Exponent | Mantissa | ±∞    | NaN   |
| :------------ | :------ | :------ | :---- | :---- |
| **FP32**       |    8     |    23    | Yes   | Yes   |
| **BF16**       |    8     |    7     | Yes   | Yes   |
| **FP16**       |    5     |    10    | Yes   | Yes   |
| **FP8 E4M3**   |    4     |    3     | **No** | Yes   |
| **FP8 E5M2**   |    5     |    2     | Yes   | Yes   |
| **FP4 E1M2**   |    1     |    2     | **No** | **No** |
| **NVFP4 E2M1** |    2     |    1     | **No** | **No** |

---

## Interactive `E2M1` bits

Tick the four bits of E2M1 yourself. Here bias is $B = 2^{2-1} - 1 = 1$. All-$1$s exponents are ordinary normal values, since this format has no `inf` or `NaN`.

- **Subnormal**: scale is $2^{1-B} = 2^0 = 1$, significand is $0.M$, and the value is $(-1)^S \times 0.M \times 2^{1-B}$
- **Normal**: scale is $2^{E-B}$, significand is $1.M$, and the value is $(-1)^S \times 1.M \times 2^{E-B}$

```python-editor collapsed
pie.clear()
pie.scalar(0, out='gridOpacity')
b = pie.scalar([0, 0, 0, 0], out='e2m1_bits')
pie.ui.checkboxes(b, options=['S', 'E₁', 'E₀', 'M'], label='Bits:')
bits = pie.lift(lambda s, e1, e0, m: f'{int(s)} {int(e1)}{int(e0)} {int(m)}', pie.Text)(b[0], b[1], b[2], b[3])
draw_bits('e2m1', bits, (1, 2, 1), 'NVFP4 E2M1: 1 sign bit, 2 exponent bits and 1 mantissa bit, so 16 values in all.', ('S', 'E', 'M'), special=False)
```
