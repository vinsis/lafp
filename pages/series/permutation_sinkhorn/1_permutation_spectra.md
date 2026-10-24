---
title: Permutation spectra
canvas: left
---

# Permutation spectra

We use the permutation matrix corresponding to the following permutation, $\begin{bmatrix} \textcolor{#1d4ed8}{a} & \textcolor{#1d4ed8}{b} & \textcolor{#1d4ed8}{c} & \textcolor{#be185d}{d} & \textcolor{#be185d}{e} \end{bmatrix} \xrightarrow{P} \begin{bmatrix} \textcolor{#1d4ed8}{c} & \textcolor{#1d4ed8}{a} & \textcolor{#1d4ed8}{b} & \textcolor{#be185d}{e} & \textcolor{#be185d}{d} \end{bmatrix}$, as an example. Note that this permutation has one cycle of order 3 (the elements $\textcolor{#1d4ed8}{a, b, c}$) and one cycle of order 2 (the elements $\textcolor{#be185d}{d, e}$). The corresponding permutation matrix is:

$$P = \begin{bmatrix} 0 & 0 & 1 & 0 & 0 \\ 1 & 0 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 & 0 \\ 0 & 0 & 0 & 0 & 1 \\ 0 & 0 & 0 & 1 & 0 \end{bmatrix}$$

The spectrum of a permutation matrix is directly related to its cycles: the order-3 cycle contributes the cubic roots of unity $\textcolor{#1d4ed8}{[\lambda, \lambda^2, \lambda^3]}$ and the order-2 cycle contributes the square roots of unity $\textcolor{#be185d}{[\sigma, \sigma^2]}$.

```python-editor collapsed
pie.clear()
pie.scalar(52, out='unit')
BLUE, PINK, GRAY, TEXT = '#1d4ed8', '#be185d', '#71717a', '#27272a'
tbox_0 = pie.text('[1,2,3,4,5] → [2,4,5,1,3]', 0, 5, 14, out='tbox_0')

# a grey arrow from (x1, y1) to (x2, y2), with hidden end points
def flow_arrow(name, x1, y1, x2, y2):
    a = pie.point(x1, y1, out=f'{name}_a', hidden=True)
    b = pie.point(x2, y2, out=f'{name}_b', hidden=True)
    return pie.annotate_arrow(a, b, 0.08, out=name, stroke=GRAY)
```

The whole story of this section fits in one flow diagram. Start from the permutation $[1,2,3,4,5] \to [2,4,5,1,3]$ we want to understand.

```python-editor collapsed
pie.set_stroke(tbox_0, TEXT)
```

```python-editor collapsed
flow_arrow('arrow_0', 0, 4.45, -3.5, 2.3)
flow_arrow('arrow_1', 0, 4.45, 3.5, 2.3)
pie.text('(1→4→2)', -3.5, 1.7, 14, out='tbox_1', stroke=BLUE)
tbox_2 = pie.text('(3→5)', 3.5, 1.7, 14, out='tbox_2')
```

It decomposes into two disjoint cycles: the order-3 cycle $\textcolor{#1d4ed8}{(1\to4\to2)}$ and the order-2 cycle $\textcolor{#be185d}{(3\to5)}$.

```python-editor collapsed
pie.set_stroke(tbox_2, PINK)
```

```python-editor collapsed
flow_arrow('arrow_2', -3.5, 1.15, -3.5, -1.05)
flow_arrow('arrow_3', 3.5, 1.15, 3.5, -1.05)
pie.text('[λ, λ², λ³]', -3.5, -1.6, 14, out='tbox_3', stroke=BLUE)
tbox_4 = pie.text('[σ, σ²]', 3.5, -1.6, 14, out='tbox_4')
```

Each cycle contributes its roots of unity: the cubic roots $\textcolor{#1d4ed8}{[\lambda, \lambda^2, \lambda^3]}$ and the square roots $\textcolor{#be185d}{[\sigma, \sigma^2]}$.

```python-editor collapsed
pie.set_stroke(tbox_4, PINK)
```

```python-editor collapsed
flow_arrow('arrow_4', -3.5, -2.15, -3.5, -4.35)
flow_arrow('arrow_5', 3.5, -2.15, 3.5, -4.35)
pie.text('[λ, λ³, 0, λ², 0]', -3.5, -4.9, 14, out='tbox_5', stroke=BLUE)
tbox_6 = pie.text('[0, 0, σ, 0, σ²]', 3.5, -4.9, 14, out='tbox_6')
```

Finally each set of roots is placed at its cycle's indices with zeros elsewhere to give the eigenvector layouts: $\textcolor{#1d4ed8}{[\lambda, \lambda^3, 0, \lambda^2, 0]}$ and $\textcolor{#be185d}{[0, 0, \sigma, 0, \sigma^2]}$.

```python-editor collapsed
pie.set_stroke(tbox_6, PINK)
```

---

## 0. Finding the eigenvalues

Construct a vector $x = \begin{bmatrix} \textcolor{#1d4ed8}{a} & \textcolor{#1d4ed8}{b} & \textcolor{#1d4ed8}{c} & 0 & 0 \end{bmatrix}$. Now observe that $P^3x = x$:

$$\begin{bmatrix} \textcolor{#1d4ed8}{a} \\ \textcolor{#1d4ed8}{b} \\ \textcolor{#1d4ed8}{c} \\ 0 \\ 0 \end{bmatrix} \xrightarrow{P} \begin{bmatrix} \textcolor{#1d4ed8}{c} \\ \textcolor{#1d4ed8}{a} \\ \textcolor{#1d4ed8}{b} \\ 0 \\ 0 \end{bmatrix} \xrightarrow{P} \begin{bmatrix} \textcolor{#1d4ed8}{b} \\ \textcolor{#1d4ed8}{c} \\ \textcolor{#1d4ed8}{a} \\ 0 \\ 0 \end{bmatrix} \xrightarrow{P} \begin{bmatrix} \textcolor{#1d4ed8}{a} \\ \textcolor{#1d4ed8}{b} \\ \textcolor{#1d4ed8}{c} \\ 0 \\ 0 \end{bmatrix}$$

Thus the eigenvalues $\lambda$ of $P$ satisfy $P^3x = \lambda^3 x = x \Rightarrow \textcolor{#1d4ed8}{\lambda^3 = 1}$. Thus three of the eigenvalues are the cubic roots of unity.

Similarly, construct a vector $y = \begin{bmatrix} 0 & 0 & 0 & \textcolor{#be185d}{d} & \textcolor{#be185d}{e} \end{bmatrix}$. Now observe that $P^2y = y$:

$$\begin{bmatrix} 0 \\ 0 \\ 0 \\ \textcolor{#be185d}{d} \\ \textcolor{#be185d}{e} \end{bmatrix} \xrightarrow{P} \begin{bmatrix} 0 \\ 0 \\ 0 \\ \textcolor{#be185d}{e} \\ \textcolor{#be185d}{d} \end{bmatrix} \xrightarrow{P} \begin{bmatrix} 0 \\ 0 \\ 0 \\ \textcolor{#be185d}{d} \\ \textcolor{#be185d}{e} \end{bmatrix}$$

Thus the eigenvalues $\sigma$ of $P$ satisfy $P^2y = \sigma^2 y = y \Rightarrow \textcolor{#be185d}{\sigma^2 = 1}$. Thus the other two eigenvalues are the square roots of unity.

---

### 0.1. Generalizing the result

The above result generalizes to any permutation matrix.

> If a permutation matrix has a cycle of length $k$, then the eigenvalues of the permutation matrix are the $k$-th roots of unity.

For the matrix $P$ from the example above, the eigenvalues are the cubic roots of unity and the square roots of unity. This can also be verified programmatically:

#### Verification using Python

```python
import torch

P = torch.Tensor([
    [0,0,1,0,0],
    [1,0,0,0,0],
    [0,1,0,0,0],
    [0,0,0,0,1],
    [0,0,0,1,0]
])

eig = torch.linalg.eig(P)
print(eig.eigenvalues)

### Output: ###
tensor([-0.5000+0.8660j, -0.5000-0.8660j,  1.0000+0.0000j,  # cubic roots of unity
        1.0000+0.0000j, -1.0000+0.0000j])  # square roots of unity
```

---

## 1. Finding the eigenvectors

This part is pretty straightforward:

$$\begin{bmatrix} \textcolor{#1d4ed8}{a} \\ \textcolor{#1d4ed8}{b} \\ \textcolor{#1d4ed8}{c} \\ 0 \\ 0 \end{bmatrix} \xrightarrow{P} \begin{bmatrix} \textcolor{#1d4ed8}{c} \\ \textcolor{#1d4ed8}{a} \\ \textcolor{#1d4ed8}{b} \\ 0 \\ 0 \end{bmatrix} = \begin{bmatrix} \textcolor{#1d4ed8}{\lambda a} \\ \textcolor{#1d4ed8}{\lambda b} \\ \textcolor{#1d4ed8}{\lambda c} \\ 0 \\ 0 \end{bmatrix} \textcolor{#b45309}{\Rightarrow c = \lambda a, \ b = \lambda^2 a}$$

Thus the eigenvector corresponding to $\lambda$ is $\begin{bmatrix} \textcolor{#1d4ed8}{a} \\ \textcolor{#1d4ed8}{\lambda^2 a} \\ \textcolor{#1d4ed8}{\lambda a} \\ 0 \\ 0 \end{bmatrix} = \begin{bmatrix} \lambda \\ 1 \\ \lambda^2 \\ 0 \\ 0 \end{bmatrix}$ by setting $a = \lambda$ (it can be set to any non-zero complex number, and here $\lambda^3 = 1$). This can also be verified programmatically:

#### Verification using Python

```python
print(-eig.eigenvectors[:,0] * 1.73205)  # scaled by square root of 3 since the eigenvector is scaled down to norm 1

### Output: ###
tensor([-0.5000+0.8660j,  1.0000+0.0000j, -0.5000-0.8660j,  0.0000-0.0000j,
         0.0000-0.0000j])
```

The eigenvectors corresponding to the square roots of unity can be found in similar fashion. For instance, the eigenvector corresponding to the eigenvalue $-1$ is:

#### Verification using Python

```python
print(eig.eigenvectors[:,-1] * 1.41425)

### Output: ###
tensor([ 0.0000+0.j,  0.0000+0.j,  0.0000+0.j, -1.0000+0.j,  1.0000+0.j])
```

---

### 1.1. Generalizing the result

The above result generalizes to any permutation matrix.

> A cycle $i_1, i_2, ... i_k$ of length $k$ has the eigenvector with values $\lambda, \lambda^2, ... \lambda^k$ at those indices and zeros elsewhere corresponding to the eigenvalue $\lambda$.

What if the permutation only has one cycle? There is a particular class of permutation matrices with only one cycle which we will look into next.

---

[← Overview and permutation cycles](/series/permutation_sinkhorn/0_permutation_cycles)  ·  [Circulant matrices →](/series/permutation_sinkhorn/2_circulant_matrix)
