---
title: Butterfly and Monarch matrices
date: 2026-11-24
tags: #structured-matrix, #fft, #ml
---

# FFT, Butterfly and Monarch matrices

## FFT written recursive form
FFT can be written in recursive form as:

$$
F_N x =
\begin{bmatrix} I_{N/2} & \textcolor{#b45309}{D_{N/2}} \\ I_{N/2} & -\textcolor{#b45309}{D_{N/2}} \end{bmatrix}
\begin{bmatrix} \textcolor{#1d4ed8}{F_{N/2}} & 0 \\ 0 & \textcolor{#1d4ed8}{F_{N/2}} \end{bmatrix}
\begin{bmatrix} \textcolor{#047857}{x_{0::2}} \\ \textcolor{#7c3aed}{x_{1::2}} \end{bmatrix}
$$

where $\textcolor{#b45309}{D_{N/2}} = \operatorname{diag}(1, \textcolor{#b45309}{\omega_N}, \textcolor{#b45309}{\omega_N^2}, \dots, \textcolor{#b45309}{\omega_N^{N/2-1}})$ and $\textcolor{#b45309}{\omega_N} = e^{-2\pi i/N}$.

This can be further expanded into $log_2(n)$ factors as shown below. Use different values of $N$, just make sure it is a power of 2. 

```python-editor collapsed
N = 8                       # a power of 2
m = N.bit_length() - 1      # number of radix-2 splits

def bmatrix(rows):
    return r'\begin{bmatrix}' + r' \\ '.join(rows) + r'\end{bmatrix}'

def block_diag(blocks):
    """The blocks on the diagonal, 0 elsewhere."""
    n = len(blocks)
    if n == 1:
        return blocks[0]
    return bmatrix([' & '.join(b if r == c else '0' for c in range(n)) for r, b in enumerate(blocks)])

def butterfly_tex(L):
    """B_L = [I D; I -D], with I and D of size L/2."""
    h = L // 2
    if h == 1:
        return bmatrix(['1 & 1', '1 & -1'])
    return bmatrix([f'I_{{{h}}} & D_{{{h}}}', f'I_{{{h}}} & -D_{{{h}}}'])

def bit_rev(r, k):
    return int(f'{r:0{k}b}'[::-1], 2)

def recurrence(k, N):
    """F_N x after k splits: the butterfly stages, the FFTs left to do, and x reordered."""
    k = int(k)
    L = N >> k
    step = 2**k
    parts = [block_diag([butterfly_tex(N >> s)] * 2**s) for s in range(k)]
    if L > 1:
        parts.append(block_diag([f'F_{{{L}}}'] * step))
    if k == 0:
        parts.append('x')
    else:
        parts.append(bmatrix([f'x_{{{bit_rev(r, k)}}}' if L == 1 else f'x_{{{bit_rev(r, k)}::{step}}}'
                              for r in range(step)]))
    return rf'F_{{{N}}}\, x = ' + ' '.join(parts)

latex_splits = pie.scalar(1, out='latex_splits')
tex = pie.lift(recurrence, pie.Text)(latex_splits, N, out='fft_tex')
pie.ui.radio(latex_splits, options=[f'{k} splits' for k in range(m + 1)], label='splits')
pie.ui.latex(tex)
```

One can also add a permutation matrix at the end instead of shuffling the values of the input vector.

---

## Butterfly matrices

To enable fast matmuls, one can try to use the same sparsity pattern as the matrices shown above. The exact values are learnt using gradient descent. The sparsity and recurrent pattern is what matters:

```python-editor collapsed
N = 8                       # a power of 2
m = N.bit_length() - 1      # number of radix-2 splits

def rev(x, k):
    """x's lowest k bits, reversed, as an index expression."""
    return ' + '.join(f'({x}) // {2**b} % 2 * {2**(k - 1 - b)}' for b in range(k)) or '0'

def butterflies(L):
    """I ⊗ B_L: in each block of L, y[k] = e[k] + w^k o[k] and y[k + L/2] = e[k] - w^k o[k]."""
    return f'B[(i // {L} == j // {L}) & (i % {L // 2} == j % {L // 2})]'

def ffts(L):
    """I ⊗ F_L: an FFT of size L on each block of L."""
    return f'F[i // {L} == j // {L}]'

def shuffle(k, N):
    """Evens before odds, done k times. After all m splits, this is the bit reversal."""
    lo = N >> k
    return f'P[j == i % {lo} * {2**k} + {rev(f"i // {lo}", k)}]'

def factor(k, N):
    """F_N after k splits: F_N = B_N · (I ⊗ B_N/2) ⋯ · (I ⊗ F_N/2^k) · P."""
    k = int(k)
    parts = [butterflies(N >> s) for s in range(k)]
    if N >> k > 1:
        parts.append(ffts(N >> k))      # 1-point FFTs are the identity: left out
    if k > 0:
        parts.append(shuffle(k, N))
    return ', '.join(parts)

grid_splits = pie.scalar(1, out='grid_splits')
expr = pie.lift(factor, pie.Text)(grid_splits, N, out='fft_expr')
pie.ui.radio(grid_splits, options=[f'{k} splits' for k in range(m + 1)], label='splits')
pie.ui.matrix_grid(expr, shapes={'B': [N, N], 'F': [N, N], 'P': [N, N]}, colors={'P': '#0891b2'}, size=10, label=f'F{N} =')
```

Here the input is not shown and the permutation matrix is shown in cyan color while the butterfly factor matrices are shown in red. 

Even though one can calculate the vector product of a butterfly matrix in $O(N \log N)$, it actually runs slower than a dense matrix matmul on GPUs since it lies in the memory regime and not compute regime. To overcome this, authors came with a new class of structured matrices which are a superset of butterfly matrices and contain dense diagonal blocks which can make use of GPU kernels optimized for GEMM. 

<!--
### Building orthogonal matrices fast with butterfly matrices

```python-editor collapsed
from functools import reduce
import numpy as np

n = 8                         # a power of 2
L = n.bit_length() - 1        # log2(n) layers
rng = np.random.default_rng(0)
theta = rng.uniform(-np.pi, np.pi, size=(L, n // 2))   # n/2 angles per layer, n log2(n) / 2 in all

def givens(t):
    return np.array([[np.cos(t), -np.sin(t)],
                     [np.sin(t),  np.cos(t)]])

def pairs(stride):
    """The index pairs (a, a + stride) that one layer rotates."""
    return [(a, a + stride) for a in range(n) if a & stride == 0]

def layer(i):
    """B_i: n/2 Givens rotations, on the pairs at stride 2^(i-1)."""
    B_i = np.eye(n)
    for (a, b), t in zip(pairs(2 ** (i - 1)), theta[i - 1]):
        B_i[np.ix_([a, b], [a, b])] = givens(t)
    return B_i

# B = B_1 B_2 ⋯ B_L: a product of rotations, so B is orthogonal
B = reduce(np.matmul, [layer(i) for i in range(1, L + 1)])

def apply(x):
    """B x in O(n log n): B_L first, B_1 last, each a rotation of n/2 pairs of entries."""
    y = x.copy()
    for i in range(L, 0, -1):
        for (a, b), t in zip(pairs(2 ** (i - 1)), theta[i - 1]):
            y[a], y[b] = np.cos(t) * y[a] - np.sin(t) * y[b], np.sin(t) * y[a] + np.cos(t) * y[b]
    return y

x = rng.standard_normal(n)
print('B^T B = I:', np.allclose(B.T @ B, np.eye(n)))
print('apply(x) = B @ x:', np.allclose(apply(x), B @ x))

# Drawing: where each layer's rotations sit
strides = [2 ** (i - 1) for i in range(1, L + 1)]
layers = pie.text(', '.join(f'G[(i // {2 * s} == j // {2 * s}) & (i % {s} == j % {s})]' for s in strides), out='givens_layers')
pie.ui.matrix_grid(layers, shapes={'G': [n, n]}, size=10, label='B =')
```
-->

---

## Monarch matrices

They have the structure $M = PLP^TR$ where $L$ and $R$ are block-diagonal matrices, each with $\sqrt{N}$ dense blocks of size $\sqrt{N} \times \sqrt{N}$. $P$ is the permutation that reshapes a vector of length $N$ into a $\sqrt{N} \times \sqrt{N}$ grid, transposes it, and flattens it back. 

<details>
<summary>An example of permutation for N = 9</summary>

$$
\begin{bmatrix}
\textcolor{#b91c1c}{a_0} \\ \textcolor{#b91c1c}{a_1} \\ \textcolor{#b91c1c}{a_2} \\
\textcolor{#1d4ed8}{a_3} \\ \textcolor{#1d4ed8}{a_4} \\ \textcolor{#1d4ed8}{a_5} \\
\textcolor{#047857}{a_6} \\ \textcolor{#047857}{a_7} \\ \textcolor{#047857}{a_8}
\end{bmatrix}
\xrightarrow{\text{reshape}}
\begin{bmatrix}
\textcolor{#b91c1c}{a_0} & \textcolor{#b91c1c}{a_1} & \textcolor{#b91c1c}{a_2} \\
\textcolor{#1d4ed8}{a_3} & \textcolor{#1d4ed8}{a_4} & \textcolor{#1d4ed8}{a_5} \\
\textcolor{#047857}{a_6} & \textcolor{#047857}{a_7} & \textcolor{#047857}{a_8}
\end{bmatrix}
\xrightarrow{\text{transpose}}
\begin{bmatrix}
\textcolor{#b91c1c}{a_0} & \textcolor{#1d4ed8}{a_3} & \textcolor{#047857}{a_6} \\
\textcolor{#b91c1c}{a_1} & \textcolor{#1d4ed8}{a_4} & \textcolor{#047857}{a_7} \\
\textcolor{#b91c1c}{a_2} & \textcolor{#1d4ed8}{a_5} & \textcolor{#047857}{a_8}
\end{bmatrix}
\xrightarrow{\text{flatten}}
\begin{bmatrix}
\textcolor{#b91c1c}{a_0} \\ \textcolor{#1d4ed8}{a_3} \\ \textcolor{#047857}{a_6} \\
\textcolor{#b91c1c}{a_1} \\ \textcolor{#1d4ed8}{a_4} \\ \textcolor{#047857}{a_7} \\
\textcolor{#b91c1c}{a_2} \\ \textcolor{#1d4ed8}{a_5} \\ \textcolor{#047857}{a_8}
\end{bmatrix}
$$

</details>

For $N = 9$, $L$ and $R$ have three $3 \times 3$ blocks on their diagonals:

$$
L = \begin{bmatrix} L_1 & 0 & 0 \\ 0 & L_2 & 0 \\ 0 & 0 & L_3 \end{bmatrix}
$$

$$
R = \begin{bmatrix} R_1 & 0 & 0 \\ 0 & R_2 & 0 \\ 0 & 0 & R_3 \end{bmatrix}
$$

A key property of $M$ is that each $\sqrt{N} \times \sqrt{N}$ block of $P^TM$ is a (rank-one) outer product:

```python-editor collapsed
import numpy as np

m = 3          # block size
N = m * m      # 9

def block_diag(name):
    """N x N with blocks name1, name2, name3 on the diagonal. Entry (i, j) of block k is name{k}_{ij}."""
    A = np.full((N, N), '0', dtype=object)
    for k in range(m):
        for i in range(m):
            for j in range(m):
                A[k * m + i, k * m + j] = f'{name}{k + 1}_{{{i}{j}}}'
    return A

# P x: reshape x into an m x m grid, transpose it, flatten it back
perm = np.arange(N).reshape(m, m).T.flatten()
P = np.full((N, N), '0', dtype=object)
P[np.arange(N), perm] = '1'

def matmul(A, B):
    """A @ B on symbols: skip zero terms and factors of 1."""
    def entry(row, col):
        terms = [' '.join(f for f in (a, b) if f != '1') for a, b in zip(row, col) if a != '0' and b != '0']
        return ' + '.join(terms) or '0'
    return np.array([[entry(A[i], B[:, j]) for j in range(N)] for i in range(N)], dtype=object)

R = block_diag('r')
L = block_diag('l')
products = {
    'L': L,
    'P L': matmul(P, L),
    'R': R,
    'P^T R': matmul(P.T, R),
}
M = matmul(matmul(matmul(P, L), P.T), R)
products['M = P L P^T R'] = M
products['P^T M'] = matmul(P.T, M)   # rows regrouped: each 3 x 3 block is rank one

# Block (a, b) of P^T M: column b of L_{a+1}, outer row a of R_{b+1}
outer = np.array([[rf'l{a + 1}_{{:,{b}}} \otimes r{b + 1}_{{{a},:}}' for b in range(m)] for a in range(m)], dtype=object)

# Drawing
def bmatrix(A):
    return r'\begin{bmatrix}' + r' \\ '.join(' & '.join(row) for row in A) + r'\end{bmatrix}'

import re

COLORS = ['#c2410c', '#0f766e', '#a21caf']

def colored(tex):
    """Color lk_{ij} by its row i and rk_{ij} by its column j, so each block of P^T M shows as rank one."""
    def color(match):
        name, i, j = match.group(1), int(match.group(2)), int(match.group(3))
        return rf'\textcolor{{{COLORS[i if name == "l" else j]}}}{{{match.group(0)}}}'
    return re.sub(r'([lr])\d_\{(\d)(\d)\}', color, tex)

def section(name, A):
    tex = f'{name} = {colored(bmatrix(A))}'
    if name == 'P^T M':
        tex += ' = ' + bmatrix(outer)
    return f'$$\n{tex}\n$$'

product = pie.scalar(0, out='monarch_product')
pie.ui.radio(product, options=['L', 'PL', 'R', 'PᵀR', 'M = PLPᵀR', 'PᵀM'], label='product')
pie.ui.markdown(product, sections=[section(name, A) for name, A in products.items()])
```

---

### Projecting a dense matrix onto a monarch matrix

In the [original paper](https://arxiv.org/abs/2204.00595) the authors project a dense matrix onto a monarch matrix. To find the Monarch matrix nearest to a dense matrix $A$, compute $P^TA$, replace each $\sqrt{N} \times \sqrt{N}$ block with its best rank-one approximation (the top singular vectors from its SVD), and multiply the result by $P$.

Note that the block $(a, b)$ of $P^TM$ is the product of column $b$ of $L_{a+1}$ and row $a$ of $R_{b+1}$, so the top singular vectors of each block go straight into $L$ and $R$. The code never builds the rank-one blocks. The entire matrix `P @ L @ P.T @ R` is calculated at the end in one go. A Python implementation is shown below:

```python-editor
import numpy as np

def project(A):
    """The Monarch matrix M = P L P^T R nearest to the N x N matrix A (Frobenius norm), and its L and R."""
    N = A.shape[0]
    m = int(round(np.sqrt(N)))                      # block size
    assert A.shape == (N, N) and m * m == N, 'A must be N x N, with N a perfect square'

    perm = np.arange(N).reshape(m, m).T.flatten()
    P = np.eye(N)[perm]                             # P x = x[perm]: reshape, transpose, flatten
    B = P.T @ A

    L = np.zeros((N, N))
    R = np.zeros((N, N))
    for a in range(m):
        for b in range(m):
            block = B[a * m:(a + 1) * m, b * m:(b + 1) * m]
            U, s, Vt = np.linalg.svd(block)
            # best rank-one approximation of the block: (s[0] U[:, 0]) ⊗ Vt[0]
            L[a * m:(a + 1) * m, a * m + b] = s[0] * U[:, 0]    # column b of L_{a+1}
            R[b * m + a, b * m:(b + 1) * m] = Vt[0]             # row a of R_{b+1}
    return P @ L @ P.T @ R, L, R

rng = np.random.default_rng(0)
A = rng.standard_normal((9, 9))
M, L, R = project(A)
print('||A - M|| =', np.linalg.norm(A - M))
print('M is a Monarch matrix (projecting it again gives M):', np.allclose(project(M)[0], M))
```

A monarch matrix-vector product costs $O(N \sqrt N)$ - more than butterfly but less than a dense matrix. 