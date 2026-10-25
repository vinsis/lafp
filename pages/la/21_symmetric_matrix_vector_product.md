---
title: Symmetric matrix-vector product as projections
description: Multiplying a vector by a symmetric matrix is a weighted sum of projections onto its eigenvectors, shown with the eigendecomposition and a visual.
canvas: left
---

# 21. Symmetric matrix-vector product

<details>
<summary>Review</summary>

The projection matrix chapter showed that for any unit vector $u$, the matrix $uu^T$ projects vectors onto the 1-dimensional subspace of $u$. This chapter combines that fact with the eigendecomposition of symmetric matrices to give a beautiful picture of what a symmetric matrix does to a vector.

</details>

Recall that an $n$-by-$n$ symmetric matrix has $n$ real eigenvalues and the corresponding eigenvectors are all perpendicular to each other. This observation provides an elegant insight into what happens when a symmetric matrix is multiplied with a vector.

Also recall the eigendecomposition of a matrix $M = VDV^{-1}$ where $V$ is the matrix of unit eigenvectors of $M$ and $D$ is a diagonal matrix where each diagonal element is an eigenvalue of $M$. If $M$ is symmetric, we have $V^{-1} = V^T$ which gives us $M = VDV^T$.

Finally, recall that for any unit vector $u$, the matrix $uu^T$ is the projection matrix corresponding to the subspace described by $u$. In other words, for any vector $v$, the projection of $v$ on the subspace given by $u$ is $(uu^T)v$.

Armed with this knowledge, we rewrite the symmetric matrix $M$ in a way that illuminates the relationship between projections and matrix-vector product.

---

## 21.1 Yet another point of view of matrix-matrix product
Here we will prove that:

$$\begin{bmatrix} \vert & \vert & & \vert \\ \textcolor{#1d4ed8}{u_1} & \textcolor{#be185d}{u_2} & \cdots & u_n \\ \vert & \vert & & \vert \end{bmatrix} \begin{bmatrix} \text{—} & \textcolor{#1d4ed8}{v_1^T} & \text{—} \\ \text{—} & \textcolor{#be185d}{v_2^T} & \text{—} \\ & \vdots & \\ \text{—} & v_n^T & \text{—} \end{bmatrix} = \underbrace{\textcolor{#1d4ed8}{u_1v_1^T}}_{\text{rank-1 term}} + \underbrace{\textcolor{#be185d}{u_2v_2^T}}_{\text{rank-1 term}} + \cdots + u_nv_n^T$$

But before we prove it, let's understand the problem clearly:

- The vectors $u_i, v_i$ are all column vectors. Thus $v_i^T$ is a row vector.
- This makes the product $u_iv_i^T$ an $n$-by-$n$ matrix.
- Thus the right hand side is a sum of $n$ matrices.

Now let's prove it.

---

### 21.1.1 The proof
We will prove it only for two dimensions to avoid messy sums. But the line of reasoning applies to vectors of any dimension.

Let's assume:

$$U = \begin{bmatrix} \vert & \vert \\ \textcolor{#1d4ed8}{u_1} & \textcolor{#be185d}{u_2} \\ \vert & \vert \end{bmatrix}, \quad V = \begin{bmatrix} \vert & \vert \\ \textcolor{#1d4ed8}{v_1} & \textcolor{#be185d}{v_2} \\ \vert & \vert \end{bmatrix} = \begin{bmatrix} \textcolor{#1d4ed8}{v_{1x}} & \textcolor{#be185d}{v_{2x}} \\ \textcolor{#1d4ed8}{v_{1y}} & \textcolor{#be185d}{v_{2y}} \end{bmatrix}$$

Then we have:

$$\begin{aligned} u_1v_1^T + u_2v_2^T &= \begin{bmatrix} \vert \\ \textcolor{#1d4ed8}{u_1} \\ \vert \end{bmatrix} \begin{bmatrix} \textcolor{#1d4ed8}{v_{1x}} & \textcolor{#1d4ed8}{v_{1y}} \end{bmatrix} + \begin{bmatrix} \vert \\ \textcolor{#be185d}{u_2} \\ \vert \end{bmatrix} \begin{bmatrix} \textcolor{#be185d}{v_{2x}} & \textcolor{#be185d}{v_{2y}} \end{bmatrix} \\ &= \begin{bmatrix} \vert & \vert \\ \textcolor{#1d4ed8}{v_{1x}}u_1 & \textcolor{#1d4ed8}{v_{1y}}u_1 \\ \vert & \vert \end{bmatrix} + \begin{bmatrix} \vert & \vert \\ \textcolor{#be185d}{v_{2x}}u_2 & \textcolor{#be185d}{v_{2y}}u_2 \\ \vert & \vert \end{bmatrix} \\ &= \begin{bmatrix} \vert & \vert \\ \textcolor{#1d4ed8}{v_{1x}}u_1 + \textcolor{#be185d}{v_{2x}}u_2 & \textcolor{#1d4ed8}{v_{1y}}u_1 + \textcolor{#be185d}{v_{2y}}u_2 \\ \vert & \vert \end{bmatrix} \\ &= \begin{bmatrix} \vert & \vert \\ U \cdot (\text{first column of } V^T) & U \cdot (\text{second column of } V^T) \\ \vert & \vert \end{bmatrix} \\ &= UV^T \end{aligned}$$

The proof for $u_1v_1^T + u_2v_2^T + \cdots + u_nv_n^T$ follows the same line of reasoning. It just includes many more sums. Now let's apply this to the eigendecomposition of a symmetric matrix $M$.

---

## 21.2 Revisiting the eigendecomposition of a symmetric matrix
We have $M = VDV^T$ where:

$$V = \begin{bmatrix} \vert & \vert & & \vert \\ v_1 & v_2 & \cdots & v_n \\ \vert & \vert & & \vert \end{bmatrix}, \quad D = \begin{bmatrix} d_1 & & & \\ & d_2 & & \\ & & \ddots & \\ & & & d_n \end{bmatrix}$$

Note that the column vectors of $V$ viz. $v_1, v_2, \ldots, v_n$ are all unit vectors. Then we have:

$$\begin{aligned}
M &= \begin{bmatrix} \vert & \vert & & \vert \\ \textcolor{#1d4ed8}{v_1} & \textcolor{#be185d}{v_2} & \cdots & v_n \\ \vert & \vert & & \vert \end{bmatrix} \begin{bmatrix} \textcolor{#1d4ed8}{d_1} & & & \\ & \textcolor{#be185d}{d_2} & & \\ & & \ddots & \\ & & & d_n \end{bmatrix} \begin{bmatrix} \text{—} & \textcolor{#1d4ed8}{v_1^T} & \text{—} \\ \text{—} & \textcolor{#be185d}{v_2^T} & \text{—} \\ & \vdots & \\ \text{—} & v_n^T & \text{—} \end{bmatrix} \\
&= \begin{bmatrix} \vert & \vert & & \vert \\ \textcolor{#1d4ed8}{d_1v_1} & \textcolor{#be185d}{d_2v_2} & \cdots & d_nv_n \\ \vert & \vert & & \vert \end{bmatrix} \begin{bmatrix} \text{—} & \textcolor{#1d4ed8}{v_1^T} & \text{—} \\ \text{—} & \textcolor{#be185d}{v_2^T} & \text{—} \\ & \vdots & \\ \text{—} & v_n^T & \text{—} \end{bmatrix} \\
&= \underbrace{\textcolor{#1d4ed8}{d_1(v_1v_1^T)}}_{\text{rank-1 projection}} + \underbrace{\textcolor{#be185d}{d_2(v_2v_2^T)}}_{\text{rank-1 projection}} + \cdots + d_n(v_nv_n^T)
\end{aligned}$$

Now recall that $vv^T$ is the projection matrix of the subspace of $v$. Thus we can rewrite the above expression as:

$$\begin{aligned}
M &= \textcolor{#1d4ed8}{d_1} \cdot (\text{projection matrix of } \textcolor{#1d4ed8}{v_1}) \\
&\quad + \textcolor{#be185d}{d_2} \cdot (\text{projection matrix of } \textcolor{#be185d}{v_2}) \\
&\quad + \cdots \\
&\quad + d_n \cdot (\text{projection matrix of } v_n)
\end{aligned}$$

---

## 21.3 Matrix-vector product in terms of projections
Given a vector $x$, we can write the matrix-vector product $Mx$ as:

$$\begin{aligned}
\textcolor{#e11d48}{Mx} &= \underbrace{d_1 \cdot \textcolor{#0d9488}{(\text{projection matrix of } v_1)}\textcolor{#e11d48}{x}}_{\text{scaled projection}} \\
&\quad + \cdots \\
&\quad + \underbrace{d_n \cdot \textcolor{#0d9488}{(\text{projection matrix of } v_n)}\textcolor{#e11d48}{x}}_{\text{scaled projection}}
\end{aligned}$$

In a less technical language, we can write it as:

$$\begin{aligned}
\textcolor{#e11d48}{Mx} &= \textcolor{#0d9488}{(\text{projection of } x \text{ on } v_1)} \text{ scaled by } d_1 \\
&\quad + \cdots \\
&\quad + \textcolor{#0d9488}{(\text{projection of } x \text{ on } v_n)} \text{ scaled by } d_n
\end{aligned}$$

Thus, the product of a symmetric matrix $M$ with a vector $x$ is the sum of projections of $x$ on the eigenvectors scaled by their respective eigenvalues.

---

## 21.4 A visualization of this phenomenon
We use the matrix $M = \begin{bmatrix} 1 & -1 \\ -1 & 0.6 \end{bmatrix}$ as an example here. This matrix has eigenvalues $\lambda_1 = -0.22$ and $\lambda_2 = 1.82$, and the corresponding unit eigenvectors are given by the columns of the matrix $V = \begin{bmatrix} 0.634 & -0.773 \\ 0.773 & 0.634 \end{bmatrix}$.

We can write this matrix as:

$$\begin{aligned}
\begin{bmatrix} 1 & -1 \\ -1 & 0.6 \end{bmatrix} &= \textcolor{#1d4ed8}{-0.22 \begin{bmatrix} 0.402 & 0.490 \\ 0.490 & 0.598 \end{bmatrix}} \\
&\quad + \textcolor{#be185d}{1.82 \begin{bmatrix} 0.598 & -0.490 \\ -0.490 & 0.402 \end{bmatrix}}
\end{aligned}$$

Let's see this decomposition act on a vector $x$ on the canvas. First draw the two 1-dimensional subspaces spanned by the eigenvectors $v_1$ and $v_2$ as grey lines, perpendicular to each other since $M$ is symmetric.

```python-editor collapsed
import math

pie.clear()
pie.scalar(75, out='unit')
GRAY, TEAL, GOLD, ROSE = '#71717a', '#0d9488', '#ca8a04', '#e11d48'
V1, V2 = (0.634, 0.773), (-0.773, 0.634)
LAM1, LAM2 = -0.22, 1.82
pie.line(pie.point(5 * V1[0], 5 * V1[1], out='pa1', hidden=True), pie.point(-5 * V1[0], -5 * V1[1], out='pb1', hidden=True), out='line1', stroke=GRAY)
pie.line(pie.point(5 * V2[0], 5 * V2[1], out='pa2', hidden=True), pie.point(-5 * V2[0], -5 * V2[1], out='pb2', hidden=True), out='line2', stroke=GRAY)
pie.text('v₁', 3.4, 4.3, 12, out='lblV1', stroke=GRAY)
pie.text('v₂', -4.3, 3.4, 12, out='lblV2', stroke=GRAY)
```

Then take an input vector $x$ of length $3$ shown in rose.

```python-editor collapsed
tdeg = pie.scalar(35, out='tdeg')
# x at angle tdeg (degrees), its projections on v₁ and v₂, those scaled by the eigenvalues, and Mx
def parts(tdeg, which, axis):
    x = (3 * math.cos(math.radians(tdeg)), 3 * math.sin(math.radians(tdeg)))
    d1, d2 = V1[0] * x[0] + V1[1] * x[1], V2[0] * x[0] + V2[1] * x[1]
    p1, p2 = (d1 * V1[0], d1 * V1[1]), (d2 * V2[0], d2 * V2[1])
    s1, s2 = (LAM1 * p1[0], LAM1 * p1[1]), (LAM2 * p2[0], LAM2 * p2[1])
    vec = {'x': x, 'p1': p1, 'p2': p2, 's1': s1, 's2': s2, 'mx': (s1[0] + s2[0], s1[1] + s2[1])}[which]
    return vec[0] if axis == 'x' else vec[1]

part = pie.lift(parts, pie.Scalar)
pie.la_vec2d(part(tdeg, 'x', 'x'), part(tdeg, 'x', 'y'), out='xvec', stroke=ROSE)
lbl_x = pie.text('x', 2.9, 1.9, 13, out='lblX', stroke=ROSE)
```

Now project $x$ on the two subspaces: the projections $(v_1v_1^T)x$ and $(v_2v_2^T)x$ are shown in teal.

```python-editor collapsed
pie.la_vec2d(part(tdeg, 'p1', 'x'), part(tdeg, 'p1', 'y'), out='proj1', stroke=TEAL)
pie.la_vec2d(part(tdeg, 'p2', 'x'), part(tdeg, 'p2', 'y'), out='proj2', stroke=TEAL)
lbl_p1 = pie.text('(v₁v₁ᵀ)x', 1.3, 2.7, 12, out='lblP1', stroke=TEAL)
lbl_p2 = pie.text('(v₂v₂ᵀ)x', 1.15, -0.72, 12, out='lblP2', stroke=TEAL)
```

Next, scale each projection by its eigenvalue and add the results tip-to-tail: the scaled projections $\lambda_1(v_1v_1^T)x$ and $\lambda_2(v_2v_2^T)x$ in gold.

```python-editor collapsed
s1x, s1y = part(tdeg, 's1', 'x'), part(tdeg, 's1', 'y')
pie.la_vec2d(s1x, s1y, out='scaled1', stroke=GOLD)
pie.la_vec2d(part(tdeg, 's2', 'x'), part(tdeg, 's2', 'y'), s1x, s1y, out='scaled2', stroke=GOLD)
lbl_s1 = pie.text('λ₁(v₁v₁ᵀ)x', -1.2, -0.4, 12, out='lblS1', stroke=GOLD)
lbl_s2 = pie.text('λ₂(v₂v₂ᵀ)x', 0, -1.65, 12, out='lblS2', stroke=GOLD)
```

Their sum is the output vector $Mx$, again in rose.

```python-editor collapsed
pie.la_vec2d(part(tdeg, 'mx', 'x'), part(tdeg, 'mx', 'y'), out='out', stroke=ROSE)
lbl_mx = pie.text('Mx', 1, -1.5, 13, out='lblMx', stroke=ROSE)
```

Note how the first projection barely shrinks and flips (since $\lambda_1 = -0.22$) while the second one stretches (since $\lambda_2 = 1.82$). The tip of $x$ moves along a circle of radius $3$, shown in grey, while the tip of $Mx$ stays on an ellipse, shown in grey too.

```python-editor collapsed
for label in [lbl_x, lbl_p1, lbl_p2, lbl_s1, lbl_s2, lbl_mx]:
    pie.hide(label)
porg = pie.point(0, 0, out='porg', hidden=True)
pie.circle(porg, 3, out='circ', stroke=GRAY)
pie.la_mat_to_ellipse([[3, -3], [-3, 1.8]], porg, out='ellipse', stroke=GRAY)
```

Now rotate the input vector $x$ through a full turn and watch the projections, their scaled copies and the output $Mx$ all update together.

```python-editor collapsed
pie.translate_scalar_to(tdeg, 35 + 360, animate=True)
```

You can also rotate it back.

```python-editor collapsed
pie.translate_scalar_to(tdeg, 35, animate=True)
```

- When $x$ lies on one of the subspaces, its projection on the other subspace vanishes, and $Mx = \lambda_i x$: the input is an eigenvector.
- Everywhere else, $Mx$ is a weighted mix of the two projections, weighted by the eigenvalues.

In the next chapter we will use this projection picture to understand a special family of symmetric matrices: positive semi-definite matrices.

---

[← 20. Projection matrix](/la/20_projection_matrix)  ·  [22. PSD matrices →](/la/22_psd_matrices)
