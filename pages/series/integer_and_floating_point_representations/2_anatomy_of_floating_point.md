---
title: Anatomy of a floating point number
description: How a floating point value is calculated from its bits, how inf and NaN are represented, what normal and subnormal modes are, and why they matter.
canvas: left
---

# Anatomy of a floating point number

A floating-point number has three components:

- a sign bit $\textcolor{#7c3aed}{S}$
- a biased exponent $\textcolor{#b45309}{E}$
- a mantissa $\textcolor{#115e59}{M}$

Bias ($B$) is set to $2^{\text{n} - 1} - 1$ where $n$ is the number of exponent bits ($5$ in this example).

Run the editor below first: the other editors on this page use its functions. It draws the $16$ bits of the example on the canvas.

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

def float_view(name, presets, caption, explain=None):
    """`presets`: one (option, bits, sign note, exponent note, mantissa note) per case. A radio picks the case.
    `explain`: one LaTeX string per case, shown in place of the calculation."""
    pie.clear()
    pie.scalar(0, out='gridOpacity')
    pick = pie.scalar(0, out=name)
    if len(presets) > 1:
        pie.ui.radio(pick, options=[p[0] for p in presets], label='Case:')
    chosen = lambda col: pie.lift(lambda i: presets[int(i)][col], pie.Text)(pick)
    notes = [chosen(c) if any(p[c] for p in presets) else None for c in (2, 3, 4)]
    calc = None if explain is None else pie.lift(lambda i: explain[int(i)], pie.Text)(pick, out=f'{name}_calc')
    draw_bits(name, chosen(1), (1, 5, 10), caption, notes, calc=calc)

float_view('pick_parts', [
    ('', '0 01001 0110000001', 'sign S', 'exponent E', 'mantissa M'),
], 'Components of a floating point representation')
```

The function that maps these bits to a decimal value is:

$$
n = (-1)^{\textcolor{#7c3aed}{S}} \times \begin{cases} 1.\textcolor{#115e59}{M} \times 2^{\textcolor{#b45309}{E} - B} & \text{if } \textcolor{#b45309}{E} \neq \text{all 0s} \quad (\text{normal}) \\ 0.\textcolor{#115e59}{M} \times 2^{1 - B} & \text{if } \textcolor{#b45309}{E} = \text{all 0s} \quad (\text{subnormal}) \end{cases}
$$

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

## Handling `0`

The normal formula never evaluates to $0$, because $1.M$ is at least $1$. A zero is represented by setting all the mantissa and exponent bits to $0$, which the subnormal formula maps to $0$. This actually gives two zeros, one for each value of the sign bit: $+0$ and $-0$.

```python-editor collapsed
float_view('pick_zero', [
    ('+0', '0 00000 0000000000', '', 'all bits are 0', 'all bits are 0'),
    ('−0', '1 00000 0000000000', '', 'all bits are 0', 'all bits are 0'),
], 'A zero is represented by setting all mantissa and exponent bits to 0. The sign bit preserves the sign of underflow, thus distinguishing approaching zero from above and below.')
```

---

## Handling `inf` and `NaN`

Infinity is represented by setting all exponent bits to $1$ and all mantissa bits to $0$. The sign bit then chooses between `inf` and `-inf`. If the exponent is all $1$s but the mantissa has at least one non-zero bit, the value is $NaN$. Any such bit pattern in the mantissa works, which is why there are many distinct NaN encodings.

```python-editor collapsed
float_view('pick_special', [
    ('+∞', '0 11111 0000000000', '', 'all bits are 1', 'all bits are 0'),
    ('−∞', '1 11111 0000000000', '', 'all bits are 1', 'all bits are 0'),
    ('NaN', '0 11111 1000000001', '', 'all bits are 1', 'at least one non-zero bit'),
], 'Infinity and NaNs are represented by setting all exponent bits to 1. For infinity, all mantissa bits are 0. All other mantissa bits are mapped to NaN. Mantissa bits are preserved to decode and diagnose why the NaN was produced.')
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

#### Subnormals enable gradual underflow and lexicographic ordering

For non-negative floats, the bit-pattern order matches the numeric order: incrementing the bits by 1 gives the next representable value. This holds because the exponent field sits to the left of the mantissa - bumping the mantissa past all $1$s carries into the exponent, exactly like bumping a decimal past $9$ carries into the next digit.

Subnormals are what keep this property alive near zero. Without them, the smallest positive normal is $2^{1 - B}$, and the next bit pattern below it (all $0$s in the exponent) would have to mean $0$: a jump from $2^{1 - B}$ straight down to $0$, breaking the "decrement bits by 1, get the next-smaller value" rule.

By interpreting the all-$0$s exponent as $0.M \times 2^{1 - B}$, the interval $[0,\ 2^{1 - B})$ is filled evenly with $2^{\text{mantissa bits}}$ values, and lexicographic order keeps matching numeric order all the way down to $0$.

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
