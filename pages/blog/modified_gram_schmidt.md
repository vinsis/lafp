---
title: Gram-Schmidt vs modified Gram-Schmidt
description: Classical and modified Gram-Schmidt compute the same S in A = QS, in a different order.
date: 2026-11-09
---

# Gram-Schmidt vs modified Gram-Schmidt

Gram-Schmidt orthogonalizes the columns of $A \in \mathbb{R}^{r \times c}$ to give an orthonormal matrix $Q \in \mathbb{R}^{r \times c}$. This relationship can be written as $A = QS$ where $S \in \mathbb{R}^{c \times c}$ is upper triangular. 

Both versions compute the same $S$, in a different order. Visualizing the order in which the entries of $S$ are calculated reveals the hidden "transpose" which makes one version more accurate. 

Write $a_j$ for column $j$ of $A$ and $q_j$ for column $j$ of $Q$. Column $j$ of $A = QS$ reads

$$a_j = \sum_{i \le j} S_{ij} \, q_i$$

so $S$ holds two kinds of entries:

- $\textcolor{#1d4ed8}{S_{ij}}$, $i < j$: how much of $q_i$ is in $a_j$.
- $\textcolor{#b45309}{S_{jj}}$: the length of what is left of $a_j$ after its parts along $q_1, \dots, q_{j-1}$ are removed. Call that leftover $v_j$. Then $q_j = v_j / \textcolor{#b45309}{S_{jj}}$.

```python-editor collapsed
GRAM_SCHMIDT = r'''
~~~python
def gram_schmidt(A):
    r, c = A.shape
    Q, S = np.zeros((r, c)), np.zeros((c, c))
    for j in range(c):                     # column by column
        v = A[:, j].copy()
        for i in range(j):
            S[i, j] = Q[:, i] @ A[:, j]    # project the original a_j
            v -= S[i, j] * Q[:, i]
        S[j, j] = np.linalg.norm(v)
        Q[:, j] = v / S[j, j]
    return Q, S
~~~
'''

MODIFIED_GRAM_SCHMIDT = r'''
~~~python
def modified_gram_schmidt(A):
    r, c = A.shape
    Q, S = np.zeros((r, c)), np.zeros((c, c))
    V = A.copy()
    for i in range(c):                     # row by row
        S[i, i] = np.linalg.norm(V[:, i])
        Q[:, i] = V[:, i] / S[i, i]
        for j in range(i + 1, c):
            S[i, j] = Q[:, i] @ V[:, j]    # project the updated v_j
            V[:, j] -= S[i, j] * Q[:, i]
    return Q, S
~~~
'''

algorithm = pie.scalar(0, out='algorithm')
pie.ui.radio(algorithm, options=['Gram-Schmidt', 'Modified Gram-Schmidt'])
pie.ui.markdown(algorithm, sections=[GRAM_SCHMIDT, MODIFIED_GRAM_SCHMIDT])
```

Below, both run on

$$A = \begin{bmatrix} 2 & 1 & 0 & 1 \\ 1 & 3 & 1 & 0 \\ 0 & 1 & 2 & 1 \\ 1 & 0 & 1 & 3 \\ 2 & 1 & 1 & 1 \end{bmatrix}$$

```python-editor collapsed
import numpy as np

A = np.array([[2, 1, 0, 1],
              [1, 3, 1, 0],
              [0, 1, 2, 1],
              [1, 0, 1, 3],
              [2, 1, 1, 1]], dtype=float)
r, c = A.shape

def gram_schmidt(A):
    Q, S, order = np.zeros((r, c)), np.zeros((c, c)), []
    for j in range(c):
        v = A[:, j].copy()
        for i in range(j):
            S[i, j] = Q[:, i] @ A[:, j]
            order.append((i, j))
            v -= S[i, j] * Q[:, i]
        S[j, j] = np.linalg.norm(v)
        order.append((j, j))
        Q[:, j] = v / S[j, j]
    return Q, S, order

def modified_gram_schmidt(A):
    Q, S, order = np.zeros((r, c)), np.zeros((c, c)), []
    V = A.copy()
    for i in range(c):
        S[i, i] = np.linalg.norm(V[:, i])
        order.append((i, i))
        Q[:, i] = V[:, i] / S[i, i]
        for j in range(i + 1, c):
            S[i, j] = Q[:, i] @ V[:, j]
            order.append((i, j))
            V[:, j] -= S[i, j] * Q[:, i]
    return Q, S, order

BLANK = '\\phantom{0.00}'

def bmatrix(rows):
    return '\\begin{bmatrix}' + ' \\\\ '.join(' & '.join(row) for row in rows) + '\\end{bmatrix}'

def QS(k, name, Q, S, order):
    """QS after the first k entries of S: q_j shows once S_jj is known, the k-th entry is boxed, the rest blank."""
    done = order[:int(k)]
    q = [[f'{Q[i, j]:.2f}' if (j, j) in done else BLANK for j in range(c)] for i in range(r)]
    s = [['0' if i > j else BLANK for j in range(c)] for i in range(c)]
    for i, j in done:
        cell = f"\\textcolor{{{'#b45309' if i == j else '#1d4ed8'}}}{{{S[i, j]:.2f}}}"
        s[i][j] = f'\\boxed{{{cell}}}' if (i, j) == done[-1] else cell
    return f'\\begin{{array}}{{l}} \\text{{{name}}} \\\\[8pt] {bmatrix(q)} {bmatrix(s)} \\end{{array}}'

k = pie.scalar(0, out='k')
pie.ui.slider(k, min=0, max=c * (c + 1) // 2, step=1, label='Step:')
pie.ui.latex(pie.lift(QS, pie.Text)(k, 'Gram-Schmidt', *gram_schmidt(A), out='gs'))
pie.ui.latex(pie.lift(QS, pie.Text)(k, 'Modified Gram-Schmidt', *modified_gram_schmidt(A), out='mgs'))
```

This can remind one of the difference between Flash Attention 1 and 2 - the same score matrix is calculated in different orders.