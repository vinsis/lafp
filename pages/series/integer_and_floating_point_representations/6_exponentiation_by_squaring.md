---
title: Exponentiation by squaring
description: The binary digits of n say which squares of x multiply to x to the n, so x to the n takes about log2(n) multiplications instead of n − 1. Shown step by step, then used for Fibonacci numbers.
date: 2026-11-05
canvas: none
sidebar: _series.md
---

# Exponentiation by squaring

Finally a small trick similar to how Fibonacci numbers can be calculated efficiently. Computing $x^n$ by multiplying $x$ by itself takes $n - 1$ multiplications. A clever way is to use squaring to get there in about $\log_2 n$ steps instead.

---

## The bits of $n$ pick the powers

Any $n$ is a sum of powers of $2$, its binary digits, so $x^n$ is a product of those squares. For $n = 13 = 1101_2 = 8 + 4 + 1$:

$$x^{13} = x^{8} \cdot x^{4} \cdot x^{1}$$

```python-editor collapsed
NBITS = 6  # n from 1 to 63

def powers_latex(n):
    """n's binary digits, and x^n as the product of the squares they pick."""
    n = int(n)
    ks = [k for k in reversed(range(NBITS)) if n >> k & 1]
    return (rf'{n} = {n:b}_2 = ' + ' + '.join(str(2 ** k) for k in ks) + r' \qquad '
            + rf'x^{{{n}}} = ' + r' \cdot '.join(f'x^{{{2 ** k}}}' for k in ks))

pie.clear()
n = pie.scalar(13, out='pow_n')

pie.ui.slider(n, min=1, max=2 ** NBITS - 1, step=1, label='n:')
pie.ui.latex(pie.lift(powers_latex, pie.Text)(n, out='pow_tex'))
```

---

## The loop

The loop reads the bits of $n$ from the right. Note that `M` on pass $k$ is $x^{2^k}$. 

```python-editor
def power(x, n):
    result = 1
    M = x
    while n:
        if n & 1:
            result = result * M
        M = M * M
        n >>= 1
    return result

print(power(3, 13), 3 ** 13)
```

---

## Cost

Each bit of $n$ costs at most two multiplications, so the loop takes at most about $2 \log_2 n$, against $n - 1$.

| $n$ | Bits | $1$ bits | Loop: squarings + multiplications | Plain: $n - 1$ |
|---:|---:|---:|---:|---:|
| $13$ | $4$ | $3$ | $7$ | $12$ |
| $1{,}000$ | $10$ | $6$ | $16$ | $999$ |
| $10{,}000$ | $14$ | $5$ | $19$ | $9{,}999$ |
| $1{,}000{,}000$ | $20$ | $7$ | $27$ | $999{,}999$ |

The loop squares `M` once more than it needs to on its last pass. That is one wasted multiplication, kept here because it makes the loop shorter.

---

## Fibonacci numbers from matrix powers

The loop works for anything that can be multiplied, matrices included. Powers of $M = \begin{bmatrix} 1 & 1 \\ 1 & 0 \end{bmatrix}$ hold the Fibonacci numbers $F_0 = 0, F_1 = 1, F_2 = 1, F_3 = 2, \dots$:

$$M^n = \begin{bmatrix} F_{n+1} & F_n \\ F_n & F_{n-1} \end{bmatrix}$$

So $F_n$ takes about $2 \log_2 n$ matrix multiplications. Run the editor: it prints a few $F_n$ and the number of digits of $F_{10{,}000}$.

```python-editor
def matmul(A, B):
    return [[sum(a * b for a, b in zip(row, col)) for col in zip(*B)] for row in A]

def matpow(M, n):
    result = [[1, 0], [0, 1]]
    while n:
        if n & 1:
            result = matmul(result, M)
        M = matmul(M, M)
        n >>= 1
    return result

M = [[1, 1],
     [1, 0]]
for n in (10, 20, 50, 100):
    print(f'F({n}) =', matpow(M, n)[0][1])
f = matpow(M, 10_000)[0][1]
print(f'F(10000) has {len(str(f))} digits')
```
