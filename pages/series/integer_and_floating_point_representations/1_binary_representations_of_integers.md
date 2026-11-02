---
title: Binary representations of integers
description: uint, two's complement, one's complement and biased integers seen as one formula, a dot product of bits and weights plus a bias.
canvas: left
---

# Binary representations of integers

Four representation types are illustrated here: `uint`, `two's complement`, `one's complement` and `biased representation`.

#### Abbreviations

| Shorthand | Meaning |
|---|---|
| **uint** | Unsigned integer |
| **2C** | Two's complement |
| **1C** | One's complement |
| **bias** | Biased binary representation |

A binary representation can be seen as a mapping from `n` bits to a decimal number:

$$\text{number} = \mathbf{b}\cdot\mathbf{w} + \textcolor{#b45309}{\boldsymbol{\text{bias}}} = \sum_{i=0}^{n-1} b_i\,w_i + \textcolor{#b45309}{\boldsymbol{\text{bias}}}$$

#### Weights and biases for each representation

| Encoding | Weights | Bias |
|---|---|---|
| `uint` | $1,2,\dots,\textcolor{#b45309}{\boldsymbol{+2^{n-1}}}$ | $0$ |
| `2C` | $1,2,\dots,\textcolor{#b45309}{\boldsymbol{-2^{n-1}}}$ | $0$ |
| `1C` | $1,2,\dots,\textcolor{#b45309}{\boldsymbol{-(2^{n-1}-1)}}$ | $0$ |
| `biased` | $1,2,\dots,\textcolor{#b45309}{\boldsymbol{+2^{n-1}}}$ | $\textcolor{#b45309}{\boldsymbol{-K}}$ |

### Representation

Run the editor, then change the representation, the bits and the bias to see how the numbers change. The ring on the canvas shows the number that each of the $8$ bit patterns maps to, and the circled one is the current bit pattern. You can drag the controls onto the canvas by their ⋮⋮ grip.

```python-editor collapsed
import math

GRAY, ACCENT = '#3f3f46', '#b45309'
NAMES = ['uint', '2C', '1C', 'bias']
TOP_WEIGHT = [4, -4, -3, 4]

def number(pattern, m, k):
    """The value of bit pattern 0..7 in representation `m`, with bias `k`."""
    b2, b1, b0 = pattern >> 2 & 1, pattern >> 1 & 1, pattern & 1
    return TOP_WEIGHT[m] * b2 + 2 * b1 + b0 - (k if NAMES[m] == 'bias' else 0)

def ring(i, radius):
    """Position `i` of 8 on a circle, clockwise from the top."""
    angle = math.radians(90 - 45 * i)
    return radius * math.cos(angle), radius * math.sin(angle)

def sum_latex(b2, b1, b0, m, k):
    b2, b1, b0, m, k = int(b2), int(b1), int(b0), int(m), int(k)
    bias = k if NAMES[m] == 'bias' else 0
    y = number(4 * b2 + 2 * b1 + b0, m, k)
    return rf'\textcolor{{{ACCENT}}}{{{TOP_WEIGHT[m]}}} \times {b2} + 2 \times {b1} + 1 \times {b0} - \textcolor{{{ACCENT}}}{{{bias}}} = {y}'

pie.clear()
pie.scalar(0, out='gridOpacity')
pie.scalar(60, out='unit')
mode = pie.scalar(0, out='mode')
K = pie.scalar(3, out='K')
bits = pie.scalar([0, 0, 0], out='bits')

value_text = pie.lift(lambda i, m, k: str(number(i, int(m), int(k))), pie.Text)
for i in range(8):
    x, y = ring(i, 2)
    pie.text(value_text(i, mode, K), x, y, 16, stroke=GRAY)
pie.text(pie.lift(lambda m: NAMES[int(m)], pie.Text)(mode), 0, 0, 18, stroke=ACCENT)

# The circle and the bits follow the current bit pattern around the ring
index = pie.lift(lambda b2, b1, b0: 4 * b2 + 2 * b1 + b0, pie.Scalar)(bits[0], bits[1], bits[2])
ring_x = pie.lift(lambda i, radius: ring(int(i), radius)[0], pie.Scalar)
ring_y = pie.lift(lambda i, radius: ring(int(i), radius)[1], pie.Scalar)
pie.circle(pie.point(ring_x(index, 2), ring_y(index, 2), hidden=True), 0.34, stroke=ACCENT)
bit_string = pie.lift(lambda b2, b1, b0: f'{int(b2)}{int(b1)}{int(b0)}', pie.Text)(bits[0], bits[1], bits[2])
pie.text(bit_string, ring_x(index, 2.9), ring_y(index, 2.9), 15, stroke=ACCENT)

pie.ui.radio(mode, options=NAMES, label='Representation:')
pie.ui.checkboxes(bits, options=['b₂', 'b₁', 'b₀'], label='Bits:')
pie.ui.slider(K, min=0, max=7, step=1, label='K:')
pie.ui.latex(pie.lift(sum_latex, pie.Text)(bits[0], bits[1], bits[2], mode, K))
```

**Note**: `bias` is $0$ for `uint`, `2C` and `1C`, so $K$ changes the numbers only in the `bias` representation.

---

## Unsigned integer

This is the simplest representation.

- Range: $0 \le x \le 2^n - 1$, so $0 \dots 7$ for $n=3$
- Every bit pattern maps to a different number
- The lexicographic ordering of bit strings is the same as numeric order, as the table at the end shows

---

## Two's complement

Sign of the top weight is flipped to $-2^{n-1}$. Other weights stay the same.

- Range: $-2^{n-1} \le x \le 2^{n-1}-1$, so $-4 \dots 3$ for $n=3$

This is the same ring as `uint`. This is because it changes half of the numbers by $(2^{n-1} - -2^{n-1}) = 2^n$. And $2^n \equiv 0$ in the ring $Z / 2^n Z$.

---

## One's complement

The top weight is $-(2^{n-1}-1)$. Negating a number is just flipping every bit.

- Range: $-(2^{n-1}-1) \le x \le 2^{n-1}-1$, so $-3 \dots 3$ for $n=3$
- The mapping is not injective: `000` and `111` both map to $0$.

### Connection between two's complement and one's complement

Since $2^n \equiv 0$ in the ring, we have:

$$-x = 2^n - x = \underbrace{\overbrace{2^n - 1}^{\text{all 1s}} - x}_{\text{one's complement}} + 1$$

This equation explains the well known relationship: to get the two's complement representation of a number, you can take the one's complement and add 1.

---

## Bias

Read the bits as a plain `uint`, then subtract a fixed constant $K$. Here $K=3$.

- Range: $-K \le x \le 2^n - 1 - K$, so $-3 \dots 4$ for $n=3$

Subtracting a constant does not reorder anything, so bigger bit pattern means bigger number. You can compare two biased numbers, signs and all, with an unsigned comparison of their bits. That is why float exponents are stored this way.

---

## Lexicographical ordering of bit strings vs their numeric values

| bits $\downarrow$ | `uint` $\downarrow$ | `2C` | `1C` | `bias` ($K=3$) $\downarrow$ |
|---|---|---|---|---|
| $\textcolor{#1d4ed8}{\texttt{000}}$ | $\textcolor{#1d4ed8}{0}$ | $\textcolor{#4d7c0f}{0}$ | $\textcolor{#15803d}{0}$ | $\textcolor{#1d4ed8}{-3}$ |
| $\textcolor{#0e7490}{\texttt{001}}$ | $\textcolor{#0e7490}{1}$ | $\textcolor{#a16207}{1}$ | $\textcolor{#a16207}{1}$ | $\textcolor{#0e7490}{-2}$ |
| $\textcolor{#0f766e}{\texttt{010}}$ | $\textcolor{#0f766e}{2}$ | $\textcolor{#b45309}{2}$ | $\textcolor{#b45309}{2}$ | $\textcolor{#0f766e}{-1}$ |
| $\textcolor{#15803d}{\texttt{011}}$ | $\textcolor{#15803d}{3}$ | $\textcolor{#b91c1c}{3}$ | $\textcolor{#b91c1c}{3}$ | $\textcolor{#15803d}{0}$ |
| $\textcolor{#4d7c0f}{\texttt{100}}$ | $\textcolor{#4d7c0f}{4}$ | $\textcolor{#1d4ed8}{-4}$ | $\textcolor{#1d4ed8}{-3}$ | $\textcolor{#4d7c0f}{1}$ |
| $\textcolor{#a16207}{\texttt{101}}$ | $\textcolor{#a16207}{5}$ | $\textcolor{#0e7490}{-3}$ | $\textcolor{#0e7490}{-2}$ | $\textcolor{#a16207}{2}$ |
| $\textcolor{#b45309}{\texttt{110}}$ | $\textcolor{#b45309}{6}$ | $\textcolor{#0f766e}{-2}$ | $\textcolor{#0f766e}{-1}$ | $\textcolor{#b45309}{3}$ |
| $\textcolor{#b91c1c}{\texttt{111}}$ | $\textcolor{#b91c1c}{7}$ | $\textcolor{#15803d}{-1}$ | $\textcolor{#15803d}{0}$ | $\textcolor{#b91c1c}{4}$ |

- Color coding: smallest $\textcolor{#1d4ed8}{\blacksquare}$ to largest $\textcolor{#b91c1c}{\blacksquare}$
