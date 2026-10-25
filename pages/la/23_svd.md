---
title: 23. SVD
canvas: left
---

# 23. SVD

<details>
<summary>Review</summary>

A symmetric matrix $S$ can be decomposed as $S = UDU^T$ where the columns of $U$ are its unit eigenvectors (all perpendicular to each other) and $D$ is a diagonal matrix of its eigenvalues. If $S$ is also positive semi-definite, the diagonal values of $D$ are all non-negative.

</details>

If you are in a field related to machine learning, this is the one thing you need to understand and take away from linear algebra in my opinion. Singular Value Decomposition (SVD) is a decomposition that works for a matrix of _any_ shape. The inspiration of SVD comes from a simple question:

> Can a matrix map a set of orthogonal vectors to a set of orthogonal vectors?

In this chapter, we will investigate this question, first for square matrices and then for matrices of any shape.

Here is the picture to keep in mind. Draw two unit input vectors, perpendicular to each other, shown in orange.

```python-editor collapsed
pie.clear()
pie.scalar(150, out='unit')
GRAY, ORANGE, VIOLET = '#71717a', '#ea580c', '#6d28d9'
pie.text('Perpendicular in, perpendicular out', 0, -0.3, 12, 2, -1, out='svd_tb', stroke=GRAY)
pie.la_vec2d(0.54, 0.84, out='in1', stroke=ORANGE)
pie.la_vec2d(-0.84, 0.54, out='in2', stroke=ORANGE)
```

Now draw the two output vectors, in violet: they have been rotated and their lengths have changed, but they _remain perpendicular to each other_. We want to know which matrices act like this.

```python-editor collapsed
pie.la_vec2d(-1.06, 1.06, out='o1', stroke=VIOLET)
pie.la_vec2d(0.59, 0.59, out='o2', stroke=VIOLET)
pie.text('v₁', 0.75, 1.15, 13, out='box_lbl_v1', stroke=ORANGE)
pie.text('v₂', -1.05, 0.70, 13, out='box_lbl_v2', stroke=ORANGE)
pie.text('o₁', -1.35, 1.35, 13, out='box_lbl_o1', stroke=VIOLET)
pie.text('o₂', 0.95, 0.40, 13, out='box_lbl_o2', stroke=VIOLET)
```

---

## 23.1 Let's understand the question first

### 23.1.1 Input
Let's start out with understanding what the input is. The input is a set of perpendicular unit vectors. In other words, the input is an $n$-by-$n$ matrix $V$ where each column $i$ is a unit vector $v_i$ and any pair of two vectors is perpendicular:

- $V = \begin{bmatrix} \vert & \vert & & \vert \\ v_1 & v_2 & \cdots & v_n \\ \vert & \vert & & \vert \end{bmatrix}$
- $\|v_i\| = 1$ for all $i$
- $\langle v_i, v_j \rangle = 0$ for all $i \ne j$

Note that since $V$ is a matrix whose columns are unit vectors that are all perpendicular to each other, we have $V^T = V^{-1}$.

---

### 23.1.2 Output
We wish the output to also be a set of vectors that are all perpendicular to each other. Now, in the most general case, the norms of these vectors can be anything. Let the norm of the first output vector $o_1$ be $d_1$, the norm of the second output vector $o_2$ be $d_2$ and so on. To be more precise:

- $O = \begin{bmatrix} \vert & \vert & & \vert \\ o_1 & o_2 & \cdots & o_n \\ \vert & \vert & & \vert \end{bmatrix}$
- $\|o_i\| = d_i$ for all $i$
- $\langle o_i, o_j \rangle = 0$ for all $i \ne j$

Note that we can write each vector $o_i$ as $o_i = d_i u_i$ where $d_i$ is the norm of $o_i$ and $u_i = \frac{o_i}{\|o_i\|} = \frac{o_i}{d_i}$ is a unit vector. Using this, we can rewrite $O$ as:

$$O = \underbrace{\begin{bmatrix} \vert & \vert & & \vert \\ u_1 & u_2 & \cdots & u_n \\ \vert & \vert & & \vert \end{bmatrix}}_{\text{directions}} \underbrace{\begin{bmatrix} d_1 & & & \\ & d_2 & & \\ & & \ddots & \\ & & & d_n \end{bmatrix}}_{\text{norms}} = UD$$

- where $U$ is a matrix of perpendicular unit vectors, so just like $V$ it satisfies $U^T = U^{-1}$
- and $D$ is a diagonal matrix.

For the picture above, the output pair is the product of a rotation and a diagonal scaling: $O = \begin{bmatrix} -0.71 & -0.71 \\ 0.71 & -0.71 \end{bmatrix} \begin{bmatrix} 1.5 & 0 \\ 0 & -0.84 \end{bmatrix}$. The left matrix $U$ holds the unit vectors pointing in the directions of the outputs, and the diagonal matrix $D$ scales them.

---

## 23.2 The complete equation
Now we would like to find a matrix $M$ that maps the column vectors of $V$ to the column vectors of $O = UD$. In other words, we want to find $M$ such that:

$$\begin{aligned}
MV &= O \\
&= UD
\end{aligned}$$

Multiplying both sides by $V^T$ on the right and remembering that $VV^T = I$ gives us:

$$\begin{aligned}
MV &= UD \\
MVV^T &= UDV^T \\
M\underbrace{VV^T}_{I} &= UDV^T \\
\\
M &= \textcolor{#be185d}{U}\textcolor{#0d9488}{D}\textcolor{#1d4ed8}{V^T}
\end{aligned}$$

Thus, if a matrix $M$ maps a set of perpendicular unit vectors $V$ to a set of perpendicular vectors given by $UD$ (you can interpret it as: a set of column vectors whose norms are the diagonal values of $D$ and whose directions are the unit column vectors of $U$), it can be represented as $M = UDV^T$. This decomposition of the matrix $M$ is called its Singular Value Decomposition (or SVD).

Thus, we can re-frame the question as:

> Given an $n$-by-$n$ matrix $M$, find $n$-by-$n$ matrices $U, D, V$ such that $M = UDV^T$ where $U$ and $V$ have unit column vectors which are perpendicular to each other, i.e. $VV^T = V^TV = UU^T = U^TU = I$, and $D$ is a diagonal matrix.

---

## 23.3 Uncovering the solution
Note that we already saw a similar decomposition earlier for a symmetric matrix $S$: $S = UDU^T$ where the columns of $U$ are unit eigenvectors of $S$ and the diagonal values of the diagonal matrix $D$ are the corresponding eigenvalues. In other words, for a symmetric matrix $S$, we have $U = V$.

We will use the following insight to find the SVD for a general $n$-by-$n$ matrix $M$:

> It is easy to calculate the SVD of a symmetric matrix $S$: one just needs to calculate the eigenvectors and eigenvalues of $S$.

---

### 23.3.1 Finding the matrices $U, V$
Given a matrix $M = UDV^T$, we note that:

$$\begin{aligned}
MM^T &= (\textcolor{#be185d}{U}\textcolor{#0d9488}{D}\textcolor{#1d4ed8}{V^T})(\textcolor{#1d4ed8}{V}\textcolor{#0d9488}{D^T}\textcolor{#be185d}{U^T}) \\
&= \textcolor{#be185d}{U}\textcolor{#0d9488}{D}\underbrace{(\textcolor{#1d4ed8}{V^T}\textcolor{#1d4ed8}{V})}_{I}\textcolor{#0d9488}{D^T}\textcolor{#be185d}{U^T} \\
\\
&= \textcolor{#be185d}{U}\textcolor{#0d9488}{D^2}\textcolor{#be185d}{U^T}
\end{aligned}$$

since $D^T = D$. Similarly:

$$\begin{aligned}
M^TM &= (\textcolor{#1d4ed8}{V}\textcolor{#0d9488}{D^T}\textcolor{#be185d}{U^T})(\textcolor{#be185d}{U}\textcolor{#0d9488}{D}\textcolor{#1d4ed8}{V^T}) \\
&= \textcolor{#1d4ed8}{V}\textcolor{#0d9488}{D}\underbrace{(\textcolor{#be185d}{U^T}\textcolor{#be185d}{U})}_{I}\textcolor{#0d9488}{D}\textcolor{#1d4ed8}{V^T} \\
\\
&= \textcolor{#1d4ed8}{V}\textcolor{#0d9488}{D^2}\textcolor{#1d4ed8}{V^T}
\end{aligned}$$

Note that the matrices $MM^T$ and $M^TM$ are $n$-by-$n$ symmetric positive semi-definite. Thus they have $n$ non-negative eigenvalues and eigenvectors that are perpendicular to each other. Some more observations we can make here:

- $\textcolor{#be185d}{U}\textcolor{#0d9488}{D^2}\textcolor{#be185d}{U^T}$ is the eigendecomposition of the symmetric PSD matrix $MM^T$. The columns of $\textcolor{#be185d}{U}$ are the unit eigenvectors of $MM^T$.
- $\textcolor{#1d4ed8}{V}\textcolor{#0d9488}{D^2}\textcolor{#1d4ed8}{V^T}$ is the eigendecomposition of the symmetric PSD matrix $M^TM$. The columns of $\textcolor{#1d4ed8}{V}$ are the unit eigenvectors of $M^TM$.
- Both matrices $MM^T$ and $M^TM$ share the same set of non-negative eigenvalues. These eigenvalues are given by the diagonal entries of the matrix $D^2$.

#### Question
Why do $MM^T$ and $M^TM$ have the same eigenvalues?

This is a special case of a general fact: for any two square matrices $A$ and $B$, the products $AB$ and $BA$ have the same eigenvalues. Indeed, if $ABx = \lambda x$ with $\lambda \ne 0$, then multiplying by $B$ on the left gives $BA(Bx) = \lambda (Bx)$, so $\lambda$ is also an eigenvalue of $BA$ (with eigenvector $Bx$). Apply this with $A = M$ and $B = M^T$.

---

### 23.3.2 Complete solution
Thus, given an $n$-by-$n$ matrix $M$, the SVD of $M$ is given by $M = UDV^T$ where:

- the columns of the $n$-by-$n$ matrix $U$ are the unit eigenvectors of $MM^T$
- the columns of the $n$-by-$n$ matrix $V$ are the unit eigenvectors of $M^TM$
- $D$ is an $n$-by-$n$ diagonal matrix whose values are the square roots of the eigenvalues of the symmetric PSD matrix $M^TM$ (or $MM^T$).

---

## 23.4 Interpreting the solution
Now let's try to understand what happens when the matrix $M$ is multiplied by a vector $x$. We can see that $Mx = \textcolor{#be185d}{U}\textcolor{#0d9488}{D}\textcolor{#1d4ed8}{V^T}x$. Thus we can interpret the matrix-vector product as a 3-step process:

1. $\textcolor{#1d4ed8}{V^Tx}$: since $V$ and $V^T$ are orthonormal matrices (because $VV^T = I$ and $V^{-1} = V^T$), the vector $x$ is first rotated or reflected by $V^T$.
2. $\textcolor{#0d9488}{D}(\textcolor{#1d4ed8}{V^Tx})$: since $D$ is a diagonal matrix whose entries are all non-negative, it stretches the dimensions of the vector. To be more precise, the $i$-th element of the vector gets multiplied by the $i$-th diagonal element of $D$.
3. $\textcolor{#be185d}{U}(\textcolor{#0d9488}{D}\textcolor{#1d4ed8}{V^Tx})$: since $U$ and $U^T$ are orthonormal matrices (because $UU^T = I$ and $U^{-1} = U^T$), the vector $DV^Tx$ is rotated or reflected by $U$.

This is the interpretation that SVD provides:

> A matrix $M$ first rotates or reflects a vector $x$, scales (or stretches) its dimensions, and rotates or reflects it again.

These transformations (rotations or reflections) are defined by the eigenvectors of the matrices $MM^T$ and $M^TM$, and the scaling values are the square roots of the (common) eigenvalues of both these matrices.

---

## 23.5 Visualizing SVD
Let's calculate the SVD of $M = \begin{bmatrix} 1 & 0 \\ 1 & 1 \end{bmatrix}$. The steps of the calculation look like:

- Calculate $MM^T = \begin{bmatrix} 1 & 1 \\ 1 & 2 \end{bmatrix}$ and $M^TM = \begin{bmatrix} 2 & 1 \\ 1 & 1 \end{bmatrix}$.
- Calculate the eigenvalues of $MM^T$ (or $M^TM$): the eigenvalues are $2.62$ and $0.38$.
- Create a diagonal matrix whose diagonal values are the square roots of the above eigenvalues: $\textcolor{#0d9488}{D} = \begin{bmatrix} 1.618 & 0 \\ 0 & 0.618 \end{bmatrix}$
- Calculate the unit eigenvectors of $MM^T$: $\textcolor{#be185d}{U} = \begin{bmatrix} 0.526 & -0.851 \\ 0.851 & 0.526 \end{bmatrix}$
- Calculate the unit eigenvectors of $M^TM$: $\textcolor{#1d4ed8}{V} = \begin{bmatrix} 0.851 & -0.526 \\ 0.526 & 0.851 \end{bmatrix}$

This gives us $M = \textcolor{#be185d}{U}\textcolor{#0d9488}{D}\textcolor{#1d4ed8}{V^T}$.

First let's see how this matrix transforms points on a circle. Draw the map of the unit circle under $M$.

```python-editor collapsed
import numpy as np

pie.clear()
pie.scalar(70, out='unit')
GRAY = '#71717a'
M = [1, 0, 1, 1]
# Rainbow colors for the 20 lines of a fan
FAN_COLORS = [f'oklch(0.55 0.14 {29 + 18 * k})' for k in range(20)]

# 20 points on the unit circle, each mapped by the 2×2 matrix m (row-major), around (cx, 0)
def fan_points(m11, m12, m21, m22, cx, n=20):
    a = np.radians(np.arange(n) * 360 / n)
    return np.stack([cx + m11 * np.cos(a) + m12 * np.sin(a), m21 * np.cos(a) + m22 * np.sin(a)], axis=1)

fan = pie.lift(fan_points, pie.Array[pie.Point])
cx = pie.scalar(0, out='cx')
center = pie.point(cx, 0, out='p_ellipse', hidden=True)
pie.la_mat_to_ellipse([M[:2], M[2:]], center, out='ellipse', stroke=GRAY)
fan_m = pie.line(center, fan(*M, cx, hidden=True), out='fan')
pie.set_stroke(fan_m, FAN_COLORS)
```

The longest and shortest output vectors have lengths $1.618$ and $0.618$, the diagonal values of $\textcolor{#0d9488}{D}$, and they point along the columns of $\textcolor{#be185d}{U}$.

Now let's move it aside and transform the circle into this ellipse step by step.

```python-editor collapsed
pie.translate_scalar_to(cx, -3, animate=True)
pie.text('M', -2.5, 2, 14, out='mLabel')
```

Now let's watch the 3-step process act on a single vector. 

- Start with a unit circle

```python-editor collapsed
V_T = np.array([[0.851, 0.526], [-0.526, 0.851]])
D = np.diag([1.618, 0.618])
U = np.array([[0.526, -0.851], [0.851, 0.526]])
# The current matrix, row-major. It starts as the identity.
S = [pie.scalar(v, out=f's{k}') for k, v in enumerate([1, 0, 0, 1])]
origin = pie.point(0, 0, out='origin', hidden=True)
pie.la_mat_to_ellipse([S[:2], S[2:]], origin, out='ellipse_s', stroke=GRAY)
fan_s = pie.line(origin, fan(*S, 0, hidden=True), out='fan_s')
pie.set_stroke(fan_s, FAN_COLORS)
pie.text('I', 0, 2, 14, out='label')
```

- Transform by $\textcolor{#1d4ed8}{V^T}$: it is a rotation

```python-editor collapsed
pie.text('Vᵀ', 0, 2, 14, out='label')
pie.translate_scalar_to(S, V_T.flatten().tolist(), animate=True)
```

- Transform by $\textcolor{#0d9488}{D}$: it scales the x and y-axes

```python-editor collapsed
pie.text('DVᵀ', 0, 2, 14, out='label')
pie.translate_scalar_to(S, (D @ V_T).flatten().tolist(), animate=True)
```

#### Connection with longest and shortest vectors
This step explains how the singular values are connected to the lengths of the longest and shortest vectors. This is the _only_ transform in SVD that changes the lengths of the vectors. It does so simply by scaling the axes. A vector along axis `i` is scaled by length $\sigma_i$.

- Transform by $\textcolor{#be185d}{U}$: another rotation

```python-editor collapsed
GOLD = '#ca8a04'
pie.text('UDVᵀ', 0, 2, 14, out='label')
pie.translate_scalar_to(S, (U @ D @ V_T).flatten().tolist(), animate=True)
pie.text('σ₁ = 1.618', 1.15, 1.377, 12, out='box_sigma1', stroke=GOLD)
pie.text('σ₂ = 0.618', -1.55, 0.325, 12, out='box_sigma2', stroke=GOLD)
pie.text("Longest/shortest output vectors point along U's columns", -1, -2.2, 13, 4, -1, out='box_cap_sigma')
```

---

## 23.6 SVD of non-square matrices
Now let's say you are given an $r$-by-$c$ matrix $M$. In other words, the matrix has $r$ rows and $c$ columns.

- This matrix takes as input a $c$-dimensional vector. In other words, the input space of this matrix is $c$-dimensional.
- This matrix gives as output an $r$-dimensional vector. In other words, the output space of this matrix is $r$-dimensional.

In this case, the input space can contain at most $c$ vectors that are all perpendicular to each other. Similarly the output space can contain at most $r$ vectors that are all perpendicular to each other. Then the question that we asked initially for square matrices takes the form:

> Can an $r$-by-$c$ matrix $M$ map a set of $c$ unit vectors (each vector being $c$-dimensional) perpendicular to each other to a set of $c$ vectors (each vector being $r$-dimensional) which also remain perpendicular to each other?

There are two scenarios here: $r > c$ and $r < c$. Let's address the above question in each of the scenarios.

---

### 23.6.1 When $r > c$
Let's assume $r = 3$ and $c = 2$. Such a matrix looks like $M = \begin{bmatrix} m_{11} & m_{12} \\ m_{21} & m_{22} \\ m_{31} & m_{32} \end{bmatrix}$. Note that this matrix has rank at most $2$. Thus its outputs can never span all of the 3-dimensional space.

We can show this at-most 2-dimensional output like so:

$$O = \textcolor{#be185d}{\begin{bmatrix} \vert & \vert & \vert \\ u_1 & u_2 & u_3 \\ \vert & \vert & \vert \end{bmatrix}} \textcolor{#0d9488}{\begin{bmatrix} d_1 & 0 \\ 0 & d_2 \\ 0 & 0 \end{bmatrix}}$$

Note how the third column of the left matrix is always ignored because the bottom row of the right matrix is all zeros. Let's name the left matrix $\textcolor{#be185d}{U}$. Again, $\textcolor{#be185d}{U}$ is a matrix whose columns are unit vectors all perpendicular to each other. In other words, $UU^T = U^TU = I$.

The input vectors to $M$ are the same as before: a $2$-by-$2$ matrix $\textcolor{#1d4ed8}{V}$ such that $VV^T = V^TV = I$. This gives us:

$$\begin{aligned}
MV &= \textcolor{#be185d}{U} \textcolor{#0d9488}{\begin{bmatrix} d_1 & 0 \\ 0 & d_2 \\ 0 & 0 \end{bmatrix}} \\
\\
\Rightarrow \, M &= \textcolor{#be185d}{U} \textcolor{#0d9488}{\begin{bmatrix} d_1 & 0 \\ 0 & d_2 \\ 0 & 0 \end{bmatrix}} \textcolor{#1d4ed8}{V^T}
\end{aligned}$$

- Just like the previous case, we have $MM^T = \textcolor{#be185d}{U}\textcolor{#0d9488}{D^2}\textcolor{#be185d}{U^T}$ and $M^TM = \textcolor{#1d4ed8}{V}\textcolor{#0d9488}{D^2}\textcolor{#1d4ed8}{V^T}$ where $\textcolor{#0d9488}{D} = \begin{bmatrix} d_1 & 0 \\ 0 & d_2 \end{bmatrix}$.
- The calculation of the matrices $U, D, V$ is the same as in the case of square matrices.

So the only difference compared to the case of square matrices is that when $r > c$, $r-c$ rows full of zeros are added to the bottom of the diagonal matrix $\textcolor{#0d9488}{D}$.

---

### 23.6.2 When $r < c$
Let's assume $r = 2$ and $c = 3$. Such a matrix looks like $M = \begin{bmatrix} m_{11} & m_{12} & m_{13} \\ m_{21} & m_{22} & m_{23} \end{bmatrix}$. Note that this matrix also has rank at most $2$. In this case the input is $3$ unit vectors perpendicular to each other, each vector being 3-dimensional. The output is $3$ vectors still perpendicular to each other, each vector being 2-dimensional. But how is this possible?

This is possible only if the third output vector is the zero vector. In other words, the output matrix looks like:

$$O = \begin{bmatrix} p_1 & q_1 & 0 \\ p_2 & q_2 & 0 \end{bmatrix}$$

where the vectors $\begin{bmatrix} p_1 & p_2 \end{bmatrix}^T$ and $\begin{bmatrix} q_1 & q_2 \end{bmatrix}^T$ are perpendicular to each other. This makes all three output vectors perpendicular to each other, because every vector is perpendicular to the vector of zeros: $\langle \text{any vector}, \text{vector of zeros} \rangle = 0$.

We can rewrite the output matrix $O$ as:

$$\begin{aligned}
O &= \textcolor{#be185d}{\begin{bmatrix} \vert & \vert \\ u_1 & u_2 \\ \vert & \vert \end{bmatrix}} \textcolor{#0d9488}{\begin{bmatrix} d_1 & 0 & 0 \\ 0 & d_2 & 0 \end{bmatrix}} \\
\\
&= \textcolor{#be185d}{U} \textcolor{#0d9488}{\begin{bmatrix} d_1 & 0 & 0 \\ 0 & d_2 & 0 \end{bmatrix}}
\end{aligned}$$

where the matrix $\textcolor{#be185d}{U}$ is an $r$-by-$r$ matrix such that $U^TU = UU^T = I$. Our input matrix is a $c$-by-$c$ matrix $\textcolor{#1d4ed8}{V}$ such that $VV^T = V^TV = I$. This gives us the SVD:

$$M = \textcolor{#be185d}{U} \textcolor{#0d9488}{\begin{bmatrix} d_1 & 0 & 0 \\ 0 & d_2 & 0 \end{bmatrix}} \textcolor{#1d4ed8}{V^T}$$

- Just like the previous case, we have $MM^T = \textcolor{#be185d}{U}\textcolor{#0d9488}{D^2}\textcolor{#be185d}{U^T}$ and $M^TM = \textcolor{#1d4ed8}{V}\textcolor{#0d9488}{D^2}\textcolor{#1d4ed8}{V^T}$ where $\textcolor{#0d9488}{D} = \begin{bmatrix} d_1 & 0 \\ 0 & d_2 \end{bmatrix}$.
- The calculation of the matrices $U, D, V$ is the same as in the case of square matrices.

So the only difference compared to the case of square matrices is that when $r < c$, $c-r$ columns full of zeros are added to the right of the diagonal matrix $\textcolor{#0d9488}{D}$.

SVD has applications in wide areas of mathematics and engineering. One of the more popular use cases is dimension reduction. Let's look into it next.

---

[← 22. PSD matrices](/la/22_psd_matrices)  ·  [24. Dimension reduction →](/la/24_dimension_reduction)
