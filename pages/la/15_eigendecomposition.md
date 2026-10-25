---
title: Eigendecomposition of a matrix
description: How a matrix with n distinct eigenvectors factors as VDV⁻¹, what that means geometrically, and how it makes powers of a matrix easy.
canvas: left
---

# 15. Eigendecomposition

<details>
<summary>Review</summary>

A matrix $M$ can have up to $n$ eigenvectors, the special directions along which it only stretches: $Mx = \lambda x$. We found them geometrically (the directions where the input-to-output segments lie flat) and algebraically (the values of $\lambda$ that make $M - \lambda I$ singular). When a matrix has $n$ _distinct_ eigenvalues, it has $n$ eigenvectors pointing in $n$ different directions. This chapter follows that lucky case to its beautiful conclusion.

</details>

In this chapter we focus on square ($n \times n$) matrices that have $n$ distinct eigenvalues and eigenvectors. There is an elegant relationship between such a matrix $M$ and the matrix $\textcolor{#1d4ed8}{V}$ whose columns are the $n$ eigenvectors of $M$. As usual we will use $2 \times 2$ matrices for the pictures.

---

## 15.1 The relation between $M$ and $V$
Consider a rank-$n$ matrix $M$ with $n$ unique eigenvectors $v_1, v_2, \ldots, v_n$ and corresponding eigenvalues $\lambda_1, \lambda_2, \ldots, \lambda_n$. Because no two eigenvectors share a direction, the matrix $\textcolor{#1d4ed8}{V}$ whose columns are these eigenvectors also has rank $n$:

$$V = \begin{bmatrix} \vert & \vert & & \vert \\ v_1 & v_2 & \cdots & v_n \\ \vert & \vert & & \vert \end{bmatrix}$$

We can navigate the entire $n$-dimensional space with weighted sums of the columns of either $M$ or $\textcolor{#1d4ed8}{V}$. How are the two matrices related? The relation is surprisingly easy to see. Multiply $M$ by $\textcolor{#1d4ed8}{V}$ one column at a time, and use $Mv_i = \lambda_i v_i$:

$$\begin{aligned}
M\textcolor{#1d4ed8}{V} &= M\begin{bmatrix} \vert & & \vert \\ \textcolor{#1d4ed8}{v_1} & \cdots & \textcolor{#1d4ed8}{v_n} \\ \vert & & \vert \end{bmatrix} \\
&= \begin{bmatrix} \vert & & \vert \\ M\textcolor{#1d4ed8}{v_1} & \cdots & M\textcolor{#1d4ed8}{v_n} \\ \vert & & \vert \end{bmatrix} \\ \\
&= \underbrace{\begin{bmatrix} \vert & & \vert \\ \textcolor{#be185d}{\lambda_1} \textcolor{#1d4ed8}{v_1} & \cdots & \textcolor{#be185d}{\lambda_n} \textcolor{#1d4ed8}{v_n} \\ \vert & & \vert \end{bmatrix}}_{Mv_i = \lambda_i v_i \text{ for each column}} \\ \\
&= \underbrace{\begin{bmatrix} \vert & & \vert \\ \textcolor{#1d4ed8}{v_1} & \cdots & \textcolor{#1d4ed8}{v_n} \\ \vert & & \vert \end{bmatrix} \begin{bmatrix} \textcolor{#be185d}{\lambda_1} & & \\ & \textcolor{#be185d}{\ddots} & \\ & & \textcolor{#be185d}{\lambda_n} \end{bmatrix}}_{\text{each column scaled by its own } \lambda_i} \\
&= \textcolor{#1d4ed8}{V}\textcolor{#be185d}{D}
\end{aligned}$$

That last matrix is just $\textcolor{#1d4ed8}{V}$ with each column scaled, which is exactly $\textcolor{#1d4ed8}{V}$ times a **diagonal** matrix $\textcolor{#be185d}{D}$ of the eigenvalues, where $\textcolor{#be185d}{D}$ has the eigenvalues on its diagonal and zeros everywhere else. Putting the two halves together and multiplying on the right by $\textcolor{#1d4ed8}{V}^{-1}$:

$$\begin{aligned} M\textcolor{#1d4ed8}{V} &= \textcolor{#1d4ed8}{V}\textcolor{#be185d}{D} \\ M &= \textcolor{#1d4ed8}{V}\textcolor{#be185d}{D}\textcolor{#1d4ed8}{V}^{-1} \end{aligned}$$

We just decomposed $M$ into a product of three matrices. This is the **eigendecomposition** of $M$.

---

## 15.2 But what does it even mean?
Let's understand $M = \textcolor{#1d4ed8}{V}\textcolor{#be185d}{D}\textcolor{#1d4ed8}{V}^{-1}$ by tracking what happens to a vector $x$ as it passes through $\textcolor{#1d4ed8}{V}^{-1}$, then $\textcolor{#be185d}{D}$, then $\textcolor{#1d4ed8}{V}$.

- **$y = \textcolor{#1d4ed8}{V}^{-1}x$** answers the question: by what amounts must the columns of $\textcolor{#1d4ed8}{V}$ be scaled and added up to reach $x$? So $y$ holds the coordinates of $x$ _in the eigenvector basis_. In particular, if $x = v_1$ then $\textcolor{#1d4ed8}{V}^{-1}x = [1, 0, \ldots, 0]^T$: one step along the first eigenvector, and none along the rest.
- **$z = \textcolor{#be185d}{D}y$** scales each coordinate $y_i$ by its eigenvalue $\lambda_i$:

$$\begin{aligned}
\textcolor{#be185d}{D}y &= \begin{bmatrix} \lambda_1 & & \\ & \ddots & \\ & & \lambda_n \end{bmatrix} \begin{bmatrix} y_1 \\ \vdots \\ y_n \end{bmatrix} \\
&= \begin{bmatrix} \lambda_1 y_1 \\ \vdots \\ \lambda_n y_n \end{bmatrix}
\end{aligned}$$

- **$\textcolor{#1d4ed8}{V}z$** takes those scaled coordinates and reassembles a vector from the columns of $\textcolor{#1d4ed8}{V}$.

So $\textcolor{#1d4ed8}{V}\textcolor{#be185d}{D}\textcolor{#1d4ed8}{V}^{-1}x$ is a three-step pipeline:

1. **Encode** $x$ in the _language_ of $\textcolor{#1d4ed8}{V}$: $\quad y = \textcolor{#1d4ed8}{V}^{-1}x$
2. **Scale** each coordinate by its eigenvalue: $\quad z = \textcolor{#be185d}{D}y$
3. **Decode** back into ordinary coordinates: $\quad Mx = \textcolor{#1d4ed8}{V}z$

Let's watch this happen for the matrix $A$ from the previous chapter, whose exact eigendecomposition is

$$A = \begin{bmatrix} 1.5 & 0.1 \\ 0.5 & 0.5 \end{bmatrix} = \underbrace{\begin{bmatrix} \textcolor{#1d4ed8}{0.90} & \textcolor{#1d4ed8}{-0.10} \\ \textcolor{#1d4ed8}{0.43} & \textcolor{#1d4ed8}{1.00} \end{bmatrix}}_{\textcolor{#1d4ed8}{V}} \underbrace{\begin{bmatrix} \textcolor{#be185d}{1.55} & 0 \\ 0 & \textcolor{#be185d}{0.45} \end{bmatrix}}_{\textcolor{#be185d}{D}} \underbrace{\begin{bmatrix} \textcolor{#1d4ed8}{1.06} & \textcolor{#1d4ed8}{0.10} \\ \textcolor{#1d4ed8}{-0.46} & \textcolor{#1d4ed8}{0.96} \end{bmatrix}}_{\textcolor{#1d4ed8}{V}^{-1}}$$

```python-editor collapsed
import numpy as np

pie.clear()
pie.scalar(70, out='unit')
GRAY, BLUE, AMBER, RED = '#71717a', '#2563eb', '#b45309', '#dc2626'
A = [1.5, 0.1, 0.5, 0.5]
V_INV = [1.0598, 0.1011, -0.4585, 0.9608]
D_V_INV = [1.6402, 0.1566, -0.2074, 0.4345]
as_matrix = lambda m: [m[:2], m[2:]]

# 18 points on the unit circle around (cx, 0), each mapped by the 2×2 matrix m (row-major)
def fan_points(m11, m12, m21, m22, cx, n=18):
    a = np.radians(np.arange(n) * 360 / n)
    return np.stack([cx + m11 * np.cos(a) + m12 * np.sin(a), m21 * np.cos(a) + m22 * np.sin(a)], axis=1)

fan = pie.lift(fan_points, pie.Array[pie.Point])
center_l = pie.point(-3.2, 0, out='pCenterL', hidden=True)
center_r = pie.point(3.2, 0, out='pCenterR', hidden=True)
pie.circle(center_l, 1, out='circL', stroke=GRAY)
pie.circle(center_r, 1, out='circR', stroke=GRAY)
```

The grey unit circle is our set of input vectors. First look at the ellipse that $M$ maps the circle to directly, in one shot.

```python-editor collapsed
mL = [pie.scalar(v, out=f'mL{k}') for k, v in enumerate([1, 0, 0, 1])]
pie.line(center_l, fan(*mL, -3.2, hidden=True), out='linesAL', stroke=BLUE)
pie.text('A', -3.2, 1.8, 12, 2, -1, out='boxA', stroke=BLUE)
pie.la_mat_to_ellipse(as_matrix(A), center_l, out='ellA', stroke=GRAY)
pie.translate_scalar_to(mL, A, animate=True)
```

Now let's rebuild that exact ellipse in three steps.

- Step 0: start with a circle: this is the mapping of the identity matrix

```python-editor collapsed
mR = [pie.scalar(v, out=f'mR{k}') for k, v in enumerate([1, 0, 0, 1])]
lines_r = pie.line(center_r, fan(*mR, 3.2, hidden=True), out='linesR', stroke=AMBER)
pie.text('V⁻¹x', 3.2, 1.8, 12, 2, -1, out='boxR', stroke=AMBER)
pie.la_mat_to_ellipse(as_matrix(V_INV), center_r, out='ellR', stroke=GRAY)
```

- Step 1: encode with $V^{-1}$: the circle is re-expressed in the eigenvector basis, tilting into a first ellipse.

```python-editor collapsed
pie.translate_scalar_to(mR, V_INV, animate=True)
```

- Step 2: scale with $D$: each eigen-coordinate is stretched by its eigenvalue, $1.55$ along one axis and $0.45$ along the other.

```python-editor collapsed
pie.text('D V⁻¹x', 3.2, 1.8, 12, 2, -1, out='boxR', stroke=RED)
pie.set_stroke(lines_r, RED)
pie.la_mat_to_ellipse(as_matrix(D_V_INV), center_r, out='ellR', stroke=GRAY)
pie.translate_scalar_to(mR, D_V_INV, animate=True)
```

- Step 3: decode with $V$: the scaled coordinates are reassembled, and the shape lands on an ellipse.

```python-editor collapsed
pie.text('V D V⁻¹x = Ax', 3.2, 1.8, 12, 2, -1, out='boxR', stroke=BLUE)
pie.set_stroke(lines_r, BLUE)
pie.la_mat_to_ellipse(as_matrix(A), center_r, out='ellR', stroke=GRAY)
pie.text("Encoding with V⁻¹, scaling by D, then decoding with V rebuilds M's exact ellipse: M = VDV⁻¹.", 0, -2.6, 12, 8, -1, out='boxSumA', stroke=GRAY)
pie.translate_scalar_to(mR, A, animate=True)
```

This final ellipse sits exactly where $M$'s ellipse was: encoding, scaling, then decoding reproduces $M$. That is the whole content of $M = \textcolor{#1d4ed8}{V}\textcolor{#be185d}{D}\textcolor{#1d4ed8}{V}^{-1}$.

---

## 15.3 Higher powers of a matrix
Why is $M = \textcolor{#1d4ed8}{V}\textcolor{#be185d}{D}\textcolor{#1d4ed8}{V}^{-1}$ useful? One especially neat application is computing high powers of $M$. Watch what happens when we multiply the decomposition by itself, and notice the inner $\textcolor{#1d4ed8}{V}^{-1}\textcolor{#1d4ed8}{V}$ cancelling to the identity:

$$\begin{aligned}
M^2 &= (\textcolor{#1d4ed8}{V}\textcolor{#be185d}{D}\textcolor{#1d4ed8}{V}^{-1})(\textcolor{#1d4ed8}{V}\textcolor{#be185d}{D}\textcolor{#1d4ed8}{V}^{-1}) \\
&= \textcolor{#1d4ed8}{V}\textcolor{#be185d}{D}\,\underbrace{\textcolor{#1d4ed8}{V}^{-1}\textcolor{#1d4ed8}{V}}_{I}\,\textcolor{#be185d}{D}\textcolor{#1d4ed8}{V}^{-1} \\
&= \textcolor{#1d4ed8}{V}\textcolor{#be185d}{D}^2\textcolor{#1d4ed8}{V}^{-1} \\[0.5em]
M^3 &= M^2 M \\
&= \textcolor{#1d4ed8}{V}\textcolor{#be185d}{D}^2\textcolor{#1d4ed8}{V}^{-1}\,\textcolor{#1d4ed8}{V}\textcolor{#be185d}{D}\textcolor{#1d4ed8}{V}^{-1} \\
&= \textcolor{#1d4ed8}{V}\textcolor{#be185d}{D}^3\textcolor{#1d4ed8}{V}^{-1} \\[0.5em]
&\;\;\vdots \\
M^n &= \textcolor{#1d4ed8}{V}\textcolor{#be185d}{D}^n\textcolor{#1d4ed8}{V}^{-1}
\end{aligned}$$

This is a huge shortcut, because $\textcolor{#be185d}{D}^n$ is trivial to compute. Since $\textcolor{#be185d}{D}$ is diagonal, raising it to the $n$-th power just raises each diagonal entry to the $n$-th power:

$$\textcolor{#be185d}{D}^n = \begin{bmatrix} \lambda_1^n & & \\ & \ddots & \\ & & \lambda_n^n \end{bmatrix}$$

We can cache $\textcolor{#1d4ed8}{V}$ and $\textcolor{#1d4ed8}{V}^{-1}$ once and reuse them, so the whole cost of $M^n$ collapses to $n$ scalar powers on the diagonal. Let's confirm this visually: squaring the eigenvalues should turn $M$'s ellipse into $M^2$'s ellipse.

```python-editor collapsed
import numpy as np

pie.clear()
pie.scalar(60, out='unit')
GRAY, BLUE, RED = '#71717a', '#2563eb', '#dc2626'
M = [1.5, 0.1, 0.5, 0.5]
M2 = [2.3, 0.2, 1.0, 0.3]
as_matrix = lambda m: [m[:2], m[2:]]

# 18 points on the unit circle around (cx, 0), each mapped by the 2×2 matrix m (row-major)
def fan_points(m11, m12, m21, m22, cx, n=18):
    a = np.radians(np.arange(n) * 360 / n)
    return np.stack([cx + m11 * np.cos(a) + m12 * np.sin(a), m21 * np.cos(a) + m22 * np.sin(a)], axis=1)

fan = pie.lift(fan_points, pie.Array[pie.Point])
center_l = pie.point(-3, 0, out='pCenterL2', hidden=True)
center_r = pie.point(3, 0, out='pCenterR2', hidden=True)
pie.circle(center_l, 1, out='circL2', stroke=GRAY)
pie.circle(center_r, 1, out='circR2', stroke=GRAY)
```

Here is the ellipse of $M$, with eigenvalues $1.55$ and $0.45$.

```python-editor collapsed
mL = [pie.scalar(v, out=f'mML{k}') for k, v in enumerate([1, 0, 0, 1])]
pie.line(center_l, fan(*mL, -3, hidden=True), out='linesM', stroke=BLUE)
pie.text('M', -3, 1.6, 12, 2, -1, out='boxM', stroke=BLUE)
pie.la_mat_to_ellipse(as_matrix(M), center_l, out='ellM', stroke=GRAY)
pie.translate_scalar_to(mL, M, animate=True)
```

Now reveal the ellipse of $M^2 = VD^2V^{-1}$, whose eigenvalues are $1.55^2 \approx 2.40$ and $0.45^2 \approx 0.20$: the direction that was already stretched grows even more, while the shrinking direction shrinks further. The eigenvectors (the axes of the ellipse) never move; only the eigenvalues change.

```python-editor collapsed
mR = [pie.scalar(v, out=f'mMR{k}') for k, v in enumerate(M)]
pie.line(center_r, fan(*mR, 3, hidden=True), out='linesM2', stroke=RED)
pie.text('M²', 3, 1.6, 12, 2, -1, out='boxM2', stroke=RED)
pie.la_mat_to_ellipse(as_matrix(M2), center_r, out='ellM2', stroke=GRAY)
pie.text("Squaring the eigenvalues (D²) stretches M's ellipse into M²'s: same axes, more extreme scaling.", 0, -2.2, 12, 8, -1, out='boxSumB', stroke=GRAY)
pie.translate_scalar_to(mR, M2, animate=True)
```

#### How would you get $M^2$ using $V$, $D$, and $V^{-1}$?
Multiply $\textcolor{#1d4ed8}{V}\textcolor{#be185d}{D}^2\textcolor{#1d4ed8}{V}^{-1}$, which is the same as running the step-1/step-2/step-3 pipeline from section 15.2 but scaling by $\textcolor{#be185d}{D}^2$ instead of $\textcolor{#be185d}{D}$ in the middle. Encoding and decoding are unchanged; only the stretch factors are squared.

We will see real applications of matrix powers, such as Fibonacci numbers and Markov chains, in the chapters ahead.

In the next chapter we look at **symmetric matrices**, whose eigenvectors turn out to be perpendicular to one another, making $\textcolor{#1d4ed8}{V}$ a rotation matrix and the decomposition even cleaner.

---

[← 14. Eigenvectors and eigenvalues](/la/14_eigenvectors_eigenvalues)  ·  [16. Eigenvectors of symmetric matrices →](/la/16_eigenvectors_symmetric_matrices)
