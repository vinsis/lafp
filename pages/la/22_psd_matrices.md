---
title: 22. Positive symmetric definite matrices
canvas: left
---

# 22. Positive symmetric definite matrices

<details>
<summary>Review</summary>

Symmetric matrices are the _good_ kind of square matrices: they always have real eigenvalues and their eigenvectors are all perpendicular to each other. The previous chapter showed that multiplying a symmetric matrix with a vector amounts to projecting the vector on the eigenvectors and scaling each projection by its eigenvalue.

</details>

There is in fact an even better kind of symmetric matrix, a positive semi-definite matrix, in the sense that its eigenvalues are always non-negative.

---

## 22.1 Angle between the input and output vectors of a symmetric matrix
Consider a matrix-vector product $Mx$ for a symmetric matrix $M$ and a vector $x$. We are interested in examining the angle between the input vector $x$ and the output vector $Mx$.

- If the angle between $x$ and $Mx$ is less than or equal to 90°, the dot product $\langle x, Mx \rangle$ would be non-negative. In other words, $x^T(Mx) \ge 0$ or simply $x^TMx \ge 0$.
- If the angle between the input and output vectors is more than 90°, we have $x^TMx < 0$.

> A symmetric matrix $M$ for which we have $x^TMx \ge 0$ for _every_ $x$ is called a symmetric positive semi-definite matrix.

Let's see an example of a matrix that is symmetric but not positive semi-definite, and then an example of a positive semi-definite matrix.

First take $M_1 = \begin{bmatrix} 1.5 & -1.5 \\ -1.5 & -0.9 \end{bmatrix}$. 

- Draw the unit circle and its map under $M_1$.

```python-editor collapsed
import math

pie.clear()
pie.scalar(60, out='unit')
GRAY, ROSE, GOLD = '#71717a', '#e11d48', '#ca8a04'
M1 = [[1.5, -1.5], [-1.5, -0.9]]
p0 = pie.point(0, 0, out='p0', hidden=True)
pie.circle(p0, 1, out='circ', stroke=GRAY)
pie.la_mat_to_ellipse(M1, p0, out='elli', stroke=GRAY)
```

- Now pick one input vector $x$ on the circle shown in gold, and its output vector $M_1x$ in rose. 

```python-editor collapsed
tdeg = pie.scalar(0, out='tdega')
# x is the unit vector at tdeg degrees; Mx is M times it, and k scales either one
def input_output(tdeg, k, which, axis):
    x, y = math.cos(math.radians(tdeg)), math.sin(math.radians(tdeg))
    if which == 'out':
        x, y = M1[0][0] * x + M1[0][1] * y, M1[1][0] * x + M1[1][1] * y
    return k * (x if axis == 'x' else y)

coord = pie.lift(input_output, pie.Scalar)
pie.la_vec2d(coord(tdeg, 1, 'in', 'x'), coord(tdeg, 1, 'in', 'y'), out='xveca', stroke=GOLD)
pie.la_vec2d(coord(tdeg, 1, 'out', 'x'), coord(tdeg, 1, 'out', 'y'), out='yveca', stroke=ROSE)
pie.text('x', coord(tdeg, 1.2, 'in', 'x'), coord(tdeg, 1.2, 'in', 'y'), 14, out='labx_box_a', stroke=GOLD)
pie.text('M₁x', coord(tdeg, 1.12, 'out', 'x'), coord(tdeg, 1.12, 'out', 'y'), 14, out='laby_box_a', stroke=ROSE)
pie.text('Watch the readout: it goes negative once the angle between x and M₁x passes 90°, so M₁ is not PSD.', 3.6, -3.2, 12, 2.4, -1, out='capa_box', stroke=GRAY)
```

- Show a live readout of $x^TMx$ at the top left. 

```python-editor collapsed
def quadratic_form(tdeg):
    x, y = math.cos(math.radians(tdeg)), math.sin(math.radians(tdeg))
    q = x * (M1[0][0] * x + M1[0][1] * y) + y * (M1[1][0] * x + M1[1][1] * y)
    return f'xᵀMx = {q:.2f}'

pie.text(pie.lift(quadratic_form, pie.Text)(tdeg), -2.6, 2.8, 14, out='lbla', stroke=GRAY)
```

Now rotate the input vector through a full turn and watch the readout: $x^TMx$ dips below zero whenever the output swings more than 90° away from the input. So $M_1$ is _not_ positive semi-definite.

```python-editor collapsed
pie.translate_scalar_to(tdeg, 360, animate=True)
```

You can reset the input vector and replay.

```python-editor collapsed
pie.translate_scalar_to(tdeg, 0, animate=True)
```

---

Now take $M_2 = \begin{bmatrix} 1.22 & -0.43 \\ -0.43 & 1.865 \end{bmatrix}$. 

- Draw the unit circle and its map under $M_2$.

```python-editor collapsed
import math

pie.clear()
pie.scalar(60, out='unit')
GRAY, ROSE, GOLD = '#71717a', '#e11d48', '#ca8a04'
M2 = [[1.22, -0.43], [-0.43, 1.865]]
p0 = pie.point(0, 0, out='p0', hidden=True)
pie.circle(p0, 1, out='circ', stroke=GRAY)
pie.la_mat_to_ellipse(M2, p0, out='elli', stroke=GRAY)
```

- Then an input vector $x$ in gold and its output $M_2x$ in rose. 

```python-editor collapsed
tdeg = pie.scalar(0, out='tdegb')
# x is the unit vector at tdeg degrees; Mx is M times it, and k scales either one
def input_output(tdeg, k, which, axis):
    x, y = math.cos(math.radians(tdeg)), math.sin(math.radians(tdeg))
    if which == 'out':
        x, y = M2[0][0] * x + M2[0][1] * y, M2[1][0] * x + M2[1][1] * y
    return k * (x if axis == 'x' else y)

coord = pie.lift(input_output, pie.Scalar)
pie.la_vec2d(coord(tdeg, 1, 'in', 'x'), coord(tdeg, 1, 'in', 'y'), out='xvecb', stroke=GOLD)
pie.la_vec2d(coord(tdeg, 1, 'out', 'x'), coord(tdeg, 1, 'out', 'y'), out='yvecb', stroke=ROSE)
pie.text('x', coord(tdeg, 1.2, 'in', 'x'), coord(tdeg, 1.2, 'in', 'y'), 14, out='labx_box_b', stroke=GOLD)
pie.text('M₂x', coord(tdeg, 1.15, 'out', 'x'), coord(tdeg, 1.15, 'out', 'y'), 14, out='laby_box_b', stroke=ROSE)
```

- Show the live readout of $x^TMx$ again. 

```python-editor collapsed
def quadratic_form(tdeg):
    x, y = math.cos(math.radians(tdeg)), math.sin(math.radians(tdeg))
    q = x * (M2[0][0] * x + M2[0][1] * y) + y * (M2[1][0] * x + M2[1][1] * y)
    return f'xᵀMx = {q:.2f}'

pie.text(pie.lift(quadratic_form, pie.Text)(tdeg), -2.6, 2.8, 14, out='lblb', stroke=GRAY)
pie.text('Watch the readout: it stays positive at every angle between x and M₂x, so M₂ is PSD.', 3.6, -3.2, 12, 2.4, -1, out='capb_box', stroke=GRAY)
```

- Rotate the input vector through a full turn: this time $x^TMx$ stays positive no matter where $x$ points, so $M_2$ is positive semi-definite.

```python-editor collapsed
pie.translate_scalar_to(tdeg, 360, animate=True)
```

- Reset the input vector to replay.

```python-editor collapsed
pie.translate_scalar_to(tdeg, 0, animate=True)
```

---

## 22.2 Properties of symmetric PSD matrices
Just from one property, $x^TMx \ge 0$ for all $x$, we can deduce other properties of symmetric positive semi-definite (PSD) matrices.

---

### 22.2.1 All eigenvalues are non-negative
Since $M$ is symmetric, we know that its eigenvalues are real. Now for any eigenvalue $\lambda$ and its corresponding eigenvector $v$, we have:

$$\begin{aligned}
v^TMv &\ge 0 \\
\Rightarrow \, v^T(\underbrace{\lambda v}_{Mv}) &\ge 0 \\ \\
\Rightarrow \, \lambda \cdot \|v\|^2 &\ge 0
\end{aligned}$$

Since $\|v\|^2$ is always positive, we have $\lambda \ge 0$.

---

### 22.2.2 Sum of two symmetric PSD matrices is a symmetric PSD matrix
This also follows directly from the definition. Given two PSD matrices $A$ and $B$:

- $x^TAx \ge 0$ and $x^TBx \ge 0$, so $x^TAx + x^TBx \ge 0$
- which gives us $x^T(A+B)x \ge 0$

Thus, $A+B$ is also PSD.

---

### 22.2.3 Product of a symmetric PSD matrix and a non-negative scalar is a symmetric PSD matrix
Given a scalar $c \ge 0$ and a PSD matrix $M$, we have:

$$\begin{aligned}
c \cdot (x^TMx) &\ge 0 \\
\Rightarrow \, x^T(cM)x &\ge 0
\end{aligned}$$

In other words, $cM$ is also PSD.

---

### 22.2.4 $A^TA$ is a symmetric PSD matrix for any matrix $A$
This comes from the observation that:

$$\begin{aligned}
x^T(A^TA)x &= (x^TA^T)(Ax) \\
&= (\textcolor{#0d9488}{Ax})^T(\textcolor{#0d9488}{Ax}) \\
&= \underbrace{\|\textcolor{#0d9488}{Ax}\|^2}_{\text{squared norm}} \ge 0
\end{aligned}$$

#### Question
Does this also imply that for _any_ matrix $A$, the matrix $AA^T$ is PSD?

Yes. Apply the result above to the matrix $B = A^T$: the matrix $B^TB = (A^T)^TA^T = AA^T$ is PSD.

---

### 22.2.5 Diagonal elements of a symmetric PSD matrix are non-negative
To prove that the $i$-th diagonal element $M_{ii}$, the element in the $i$-th row and $i$-th column, is non-negative, we just choose a special vector $x$ whose $i$-th value is 1 and every other value is 0.

- We have $x = \begin{bmatrix} 0 & \cdots & 1 & 0 & \cdots \end{bmatrix}^T$. This gives us $Mx = i\text{-th column of } M$.
- This means that $x^TMx = x^T(i\text{-th column of } M) = M_{ii}$.
- Since $x^TMx \ge 0$, we have $M_{ii} \ge 0$.

---

## 22.3 Symmetric PSD matrices induce a partial order over matrices
We can compare (and thus order) real numbers (eg $5 > 2$) but there is no good way to compare matrices. PSD matrices provide a way to compare _some_ pairs of matrices $A$ and $B$.

> Given matrices $A$ and $B$, we say that $A \ge B$ if $A-B$ is a PSD matrix.

In other words, $A \ge B$ if $x^T(A-B)x \ge 0$ for all $x$.

---

## 22.4 Visualizing $x^TMx$
We can visualize how a matrix $M$ maps points on a circle to points on the real number line via the function $x^TMx$. To show this mapping, we draw a line from the input, a point on the circle, to the output, the point $(x^TMx, 0)$ on the x-axis.

First for the non-PSD matrix $M_1 = \begin{bmatrix} 1.5 & -1.5 \\ -1.5 & -0.9 \end{bmatrix}$: 

```python-editor collapsed
import math
import numpy as np

pie.clear()
pie.scalar(100, out='unit')
GRAY, ROSE = '#71717a', '#e11d48'
M1 = [[1.5, -1.5], [-1.5, -0.9]]
pie.circle(pie.point(0, 0, out='p0', hidden=True), 1, out='circ', stroke=GRAY)
# xᵀMx for each column (x, y) of points on the unit circle
def quadratic(m, x, y):
    return m[0][0] * x * x + (m[0][1] + m[1][0]) * x * y + m[1][1] * y * y
```

... draw a line from each point $x$ on the unit circle to the number $x^TM_1x$ on the real line. 

```python-editor collapsed
angles = np.radians(np.arange(50) * 360 / 50)
px, py = np.cos(angles), np.sin(angles)
q = quadratic(M1, px, py)
pie.la_vec2d((q - px).tolist(), (-py).tolist(), px.tolist(), py.tolist(), out='famc', stroke=GRAY)
```

Note how the lines land on both sides of the origin. 

To follow one pair, show the input vector $x$ and its output $x^TM_1x$ on the real line in rose.

```python-editor collapsed
tdeg = pie.scalar(40, out='tdegc')
cos_d = pie.lift(lambda d: math.cos(math.radians(d)), pie.Scalar)(tdeg)
sin_d = pie.lift(lambda d: math.sin(math.radians(d)), pie.Scalar)(tdeg)
pie.la_vec2d(cos_d, sin_d, out='xvc', stroke=ROSE)
pie.la_vec2d(pie.lift(lambda d: quadratic(M1, math.cos(math.radians(d)), math.sin(math.radians(d))), pie.Scalar)(tdeg), 0, out='qvc', stroke=ROSE)
pie.text('Each line sends a point x on the unit circle to the number xᵀM₁x on the real line. Lines landing left of the origin mean xᵀM₁x < 0, so M₁ is not PSD.', 0, -2, 12, 4, -1, out='sumboxc', stroke=GRAY)
```

Then rotate the input around the circle: the output arrow keeps crossing to the negative side of the real line, confirming that $x^TM_1x < 0$ for some inputs.

```python-editor collapsed
pie.translate_scalar_to(tdeg, 40 + 360, animate=True)
```

Reset to replay.

```python-editor collapsed
pie.translate_scalar_to(tdeg, 40, animate=True)
```

Now the same picture for the PSD matrix $M_2 = \begin{bmatrix} 1.22 & -0.43 \\ -0.43 & 1.865 \end{bmatrix}$: 

```python-editor collapsed
import math
import numpy as np

pie.clear()
pie.scalar(100, out='unit')
GRAY, ROSE = '#71717a', '#e11d48'
M2 = [[1.22, -0.43], [-0.43, 1.865]]
# xᵀMx for each column (x, y) of points on the unit circle
def quadratic(m, x, y):
    return m[0][0] * x * x + (m[0][1] + m[1][0]) * x * y + m[1][1] * y * y
```

... draw a line from each point $x$ on the unit circle to the number $x^TM_2x$ on the real line. 

```python-editor collapsed
angles = np.radians(np.arange(24) * 360 / 24)
px, py = np.cos(angles), np.sin(angles)
q = quadratic(M2, px, py)
pie.la_vec2d((q - px).tolist(), (-py).tolist(), px.tolist(), py.tolist(), out='famd', stroke=GRAY)
```

This time every line lands on the positive side. Show the input vector $x$ and its output $x^TM_2x$ in rose.

```python-editor collapsed
tdeg = pie.scalar(40, out='tdegd')
cos_d = pie.lift(lambda d: math.cos(math.radians(d)), pie.Scalar)(tdeg)
sin_d = pie.lift(lambda d: math.sin(math.radians(d)), pie.Scalar)(tdeg)
pie.la_vec2d(cos_d, sin_d, out='xvd', stroke=ROSE)
pie.la_vec2d(pie.lift(lambda d: quadratic(M2, math.cos(math.radians(d)), math.sin(math.radians(d))), pie.Scalar)(tdeg), 0, out='qvd', stroke=ROSE)
pie.text('Each line sends a point x on the unit circle to the number xᵀM₂x on the real line. Every line lands on the positive side, so M₂ is PSD.', 0, -2, 12, 4, -1, out='sumboxd', stroke=GRAY)
```

Rotate the input around the circle: the output arrow never leaves the positive real line, since $x^TM_2x > 0$ for every $x$.

```python-editor collapsed
pie.translate_scalar_to(tdeg, 40 + 360, animate=True)
```

Reset to replay.

```python-editor collapsed
pie.translate_scalar_to(tdeg, 40, animate=True)
```

---

## 22.5 Decomposition of a symmetric PSD matrix
The fact that the eigenvalues of a PSD matrix are all non-negative allows one to decompose a PSD matrix $M$ as $M = AA^T$ for some matrix $A$.

Since $M$ is symmetric, we can write it as $M = VDV^T$. Here, the columns of $V$ are (unit) eigenvectors of $M$ and the diagonal values of the diagonal matrix $D$ are (non-negative) eigenvalues of $M$. Since the diagonal values of $D$ are all non-negative, we can write $D = D^{1/2}D^{1/2}$ where $D^{1/2}$ is also a diagonal matrix such that the $i$-th diagonal value of $D^{1/2}$ is the square root of the $i$-th diagonal value of $D$.

Also note that since $D^{1/2}$ is a diagonal matrix, it is also symmetric. Thus $(D^{1/2})^T = D^{1/2}$. This gives us:

$$\begin{aligned}
M &= \textcolor{#1d4ed8}{V}D\textcolor{#be185d}{V^T} \\
&= \textcolor{#1d4ed8}{V}\textcolor{#1d4ed8}{D^{1/2}}\textcolor{#be185d}{D^{1/2}}\textcolor{#be185d}{V^T} \\
&= \textcolor{#1d4ed8}{V}\textcolor{#1d4ed8}{D^{1/2}}\textcolor{#be185d}{(D^{1/2})^T}\textcolor{#be185d}{V^T} \\
&= \underbrace{\textcolor{#1d4ed8}{(VD^{1/2})}}_{\textcolor{#1d4ed8}{A}}\underbrace{\textcolor{#be185d}{(VD^{1/2})^T}}_{\textcolor{#be185d}{A^T}}
\end{aligned}$$

Writing $\textcolor{#1d4ed8}{VD^{1/2}} = \textcolor{#1d4ed8}{A}$, we get $M = \textcolor{#1d4ed8}{A}\textcolor{#be185d}{A^T}$.

Note that here each column of $\textcolor{#1d4ed8}{A}$ is an eigenvector of $M$ scaled by the square root of its corresponding eigenvalue.

---

## 22.6 PSD matrices as analogues of positive numbers
A common way to introduce symmetric PSD matrices is to compare them with positive numbers: they are high-dimensional analogues of positive real numbers. I didn't want to start out using this analogy but the points below justify the comparison.

---

### 22.6.1 Product
Given a real number $c$ and a positive number $p$, the value $c \cdot p \cdot c$ is always non-negative. Similarly for any vector $x$ and a PSD matrix $M$, the dot product $\langle x, Mx \rangle$ is always non-negative.

---

### 22.6.2 Square roots
A square root exists for a positive number $p$. In other words, $p = c \cdot c$ for some real number $c$. Similarly we can write $M = AA^T$ for a PSD matrix $M$. The reverse is also true: the product of any number with itself is non-negative, $c \cdot c \ge 0$. Similarly for _any_ matrix $A$, the matrix $AA^T$ is always PSD.

---

### 22.6.3 Positive scalars become symmetric PSD matrices in higher dimensions
Variance of a random variable is always non-negative. In higher dimensions, the covariance matrix is always PSD. The diagonal values in a covariance matrix represent variances of the random variables in those corresponding dimensions.

---

## 22.7 Applications of symmetric PSD matrices
PSD matrices have a lot of applications in both pure and applied math. This is a rich area of math and this chapter only provides a basic introduction to symmetric positive semi-definite matrices.

---

### 22.7.1 Symmetric PSD matrices are everywhere
- The [Laplacian matrix](https://en.wikipedia.org/wiki/Laplacian_matrix) is a PSD matrix. It forms the basis of spectral geometry.
- As we mentioned earlier, the [covariance matrix](https://en.wikipedia.org/wiki/Covariance_matrix) is also PSD.
- In machine learning, the _kernel trick_ induces a similarity matrix over points in a dataset that is also PSD.

---

### 22.7.2 Optimization
There is a rich connection between convex optimization and PSD matrices. In fact, given a PSD matrix $A$, the Hessian of the multi-variable function $x^TAx$, where $x$ is the vector of variables of the function, is $A$ itself (up to a scale).

[Semi-definite programming](https://en.wikipedia.org/wiki/Semidefinite_programming) is an area of convex optimization where the properties of PSD matrices are used to optimize a linear function.

---

### 22.7.3 It defines a metric
_Roughly speaking_, a metric defined on a space (a set of points) is a function $d$ that takes two elements from that space and returns a non-negative number. The most common example of a metric is the notion of _distance_ that we use in our daily lives. A metric has these properties:

- $d(x,x) = 0$
- $d(x,y) > 0$ if $x \ne y$
- $d(x,z) \le d(x,y) + d(y,z)$

It is easy to define a metric using a (positive definite) matrix $M$: given two elements $u, v$ the metric is defined as $d(u,v) = (u-v)^TM(u-v)$.

---

[← 21. Symmetric matrix-vector product](/la/21_symmetric_matrix_vector_product)  ·  [23. SVD →](/la/23_svd)
