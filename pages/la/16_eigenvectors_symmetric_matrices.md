---
title: 16. Eigenvectors of symmetric matrices
canvas: left
---

# 16. Eigenvectors of symmetric matrices

<details>
<summary>Review</summary>

When a matrix $M$ has a full set of eigenvectors, we can gather them as the columns of $V$ and factor $M = VDV^{-1}$, where $D$ is diagonal and holds the eigenvalues. The eigenvectors form a basis, and in that basis $M$ acts as pure scaling. This chapter looks at a family of matrices where this decomposition becomes especially clean.

</details>

A square $n \times n$ matrix $A$ is **symmetric** if it is its own transpose, $A = A^T$. A symmetric $n \times n$ matrix always has $n$ real eigenvalues, and the corresponding eigenvectors are all **perpendicular** to each other. This makes such a matrix simpler to work with, and it gives the matrix-vector product $Ax$ an especially elegant interpretation.

---

## 16.1 The eigenvalues of $A$ and $A^T$ are the same
First, note that $A$ and $A^T$ share the same eigenvalues. The eigenvalues of $A$ are the values of $\lambda$ for which $A - \lambda I$ becomes **singular**. But whenever $A - \lambda I$ is singular, $A^T - \lambda I$ is singular too, because a matrix and its transpose are singular together, and

$$\begin{aligned}
(A - \lambda I)^T &= A^T - \lambda I^T \\
&= A^T - \lambda I \qquad \text{(since } I^T = I\text{)}
\end{aligned}$$

So the two matrices go singular at exactly the same values of $\lambda$, which means they have identical eigenvalues.

Since the eigenvalues are the same, the number of independent eigenvectors is the same for $A$ and $A^T$ as well. This does _not_ mean the eigenvectors themselves are the same. It only means that the matrix whose columns are the eigenvectors of $A$ has the same rank as the matrix whose columns are the eigenvectors of $A^T$.

---

## 16.2 A symmetric matrix of rank $n$ has $n$ real eigenvalues
This proof leans on a little knowledge of imaginary numbers, so feel free to skip it and come back later. Let $\textcolor{#0d9488}{x}$ be an eigenvector of $A$ with eigenvalue $\textcolor{#b45309}{\lambda}$.

Earlier, when we said an eigenvalue "did not exist", what we really meant was that it was an imaginary number rather than a real one. Here we do not yet know whether $\textcolor{#b45309}{\lambda}$ is real. But we _do_ know that $A$ is symmetric, so $A^T = A$. Consider the squared length of $A\textcolor{#0d9488}{x}$ for an eigenvector $\textcolor{#0d9488}{x}$:

$$\begin{aligned}
\|A\textcolor{#0d9488}{x}\|^2 &= \langle A\textcolor{#0d9488}{x},\, A\textcolor{#0d9488}{x} \rangle \\
&= (\textcolor{#0d9488}{x}^T A^T)(A\textcolor{#0d9488}{x}) \\
&= \textcolor{#0d9488}{x}^T A (A\textcolor{#0d9488}{x}) & \text{since } A^T = A \\
&= \textcolor{#0d9488}{x}^T A (\textcolor{#b45309}{\lambda}\, \textcolor{#0d9488}{x}) & \text{since } A\textcolor{#0d9488}{x} = \textcolor{#b45309}{\lambda}\,\textcolor{#0d9488}{x} \\
&= \textcolor{#b45309}{\lambda}\, \textcolor{#0d9488}{x}^T (A\textcolor{#0d9488}{x}) \\
&= \textcolor{#b45309}{\lambda}\, \textcolor{#0d9488}{x}^T (\textcolor{#b45309}{\lambda}\, \textcolor{#0d9488}{x}) & \text{using } A\textcolor{#0d9488}{x} = \textcolor{#b45309}{\lambda}\,\textcolor{#0d9488}{x} \text{ again} \\
&= \textcolor{#b45309}{\lambda}^2 (\textcolor{#0d9488}{x}^T \textcolor{#0d9488}{x}) \\
&= \textcolor{#b45309}{\lambda}^2 \|\textcolor{#0d9488}{x}\|^2
\end{aligned}$$

Now $\|A\textcolor{#0d9488}{x}\|^2$ is a real, non-negative number, and so is $\|\textcolor{#0d9488}{x}\|^2$. For the equation to hold, $\textcolor{#b45309}{\lambda}^2$ must be real and non-negative, which forces $\textcolor{#b45309}{\lambda}$ itself to be **real**. This argument applies to _every_ eigenvalue of $A$, so every eigenvalue of a symmetric matrix is real.

---

## 16.3 A symmetric matrix of rank $n$ has $n$ perpendicular eigenvectors
Now that we know a rank-$n$ symmetric matrix $A$ has $n$ real eigenvalues, both $A$ and $A^T$ have $n$ independent eigenvectors. Here is why those eigenvectors turn out to be perpendicular:

- We can write $A = V\textcolor{#b45309}{D}V^{-1}$. It is safe to assume every column of $V$ has norm $1$, since an eigenvector only cares about direction, not length. This gives us the next line.
- Taking the transpose of both sides:

$$\begin{aligned}
A^T &= (V\textcolor{#b45309}{D}V^{-1})^T \\
&= (V^{-1})^T \textcolor{#b45309}{D}^T V^T & \text{(}(ABC)^T = C^TB^TA^T\text{)} \\
&= (V^{-1})^T \textcolor{#b45309}{D} V^T & \text{(}\textcolor{#b45309}{D}^T = \textcolor{#b45309}{D}\text{, since } \textcolor{#b45309}{D} \text{ is diagonal)}
\end{aligned}$$
- But $A = A^T$, so comparing the two factorizations gives $V^T = V^{-1}$. A matrix whose transpose equals its inverse is a **rotation matrix**.
- The columns of a rotation matrix are all perpendicular to one another. Since $V$ is a rotation matrix, its columns, which are the eigenvectors of $A$, are mutually perpendicular.

$$\begin{aligned}
A &= V\textcolor{#b45309}{D}V^{-1} \\
A^T &= (V^{-1})^T \textcolor{#b45309}{D} V^T \\
A = A^T &\implies \underbrace{V^T = V^{-1}}_{V \text{ is a rotation matrix}}
\end{aligned}$$

---

## 16.4 Let's visualize eigenvectors of symmetric matrices
Below we watch three different symmetric matrices transform points on a circle into points on an ellipse. As in the previous chapters, the grey unit circle holds the input vectors and the grey ellipse is its image under the matrix. The eigenvectors show up as two directions through the origin, drawn as violet lines. Because we only care about their direction, they are lines rather than single points.

The new thing to look for: for a symmetric matrix the two eigenvector lines always meet at a **right angle**. Sweeping the input vector by exactly $90^\circ$ carries it from one eigenvector straight onto the other.

Start with

$$A = \begin{bmatrix} 1.2 & 0.2 \\ 0.2 & 1.2 \end{bmatrix}$$

which is symmetric because the off-diagonal entries match.

```python-editor collapsed
import math

pie.clear()
pie.scalar(70, out='unit')
GRAY, TEAL, GOLD, VIOLET = '#71717a', '#0d9488', '#ca8a04', '#6d28d9'
p0 = pie.point(0, 0, out='p0', hidden=True)
pie.circle(p0, 1, out='circ', stroke=GRAY)
A = [[1.2, 0.2], [0.2, 1.2]]
```

The matrix maps every point on the circle to a point on an ellipse.

```python-editor collapsed
pie.la_mat_to_ellipse(A, p0, out='ellA', stroke=GRAY)
```

Reveal its two eigenvector directions.

```python-editor collapsed
e1a, e2a = pie.point(1.21, 1.21, out='e1a', hidden=True), pie.point(-1.21, 1.21, out='e2a', hidden=True)
pie.line(e1a, pie.point(-1.21, -1.21, out='e1b', hidden=True), out='eA1', stroke=VIOLET)
pie.line(e2a, pie.point(1.21, -1.21, out='e2b', hidden=True), out='eA2', stroke=VIOLET)
pie.text('λ₁ = 1.4', -1.45, -1.45, 13, out='labeA1', stroke=VIOLET)
pie.text('λ₂ = 1', 1.45, -1.45, 13, out='labeA2', stroke=VIOLET)
pie.annotate_angle_mark(pie.line(p0, e1a, out='rayA1', hidden=True), pie.line(p0, e2a, out='rayA2', hidden=True), out='angA')
```

They cross at $90^\circ$: the eigenvalues are $\textcolor{#b45309}{\lambda} = 1.4$ along $[1, 1]$ and $\textcolor{#b45309}{\lambda} = 1$ along $[-1, 1]$.

To see it in motion, draw a single input vector $\textcolor{#0d9488}{x}$ and its output $\textcolor{#ca8a04}{Ax}$.

```python-editor collapsed
# x is the unit vector at angle t; Ax is A times it
t = pie.scalar(0.785, out='t')
def input_output(t, k, which, axis):
    x, y = math.cos(t), math.sin(t)
    if which == 'out':
        x, y = A[0][0] * x + A[0][1] * y, A[1][0] * x + A[1][1] * y
    return k * (x if axis == 'x' else y)

coord = pie.lift(input_output, pie.Scalar)
pie.la_vec2d(coord(t, 1, 'in', 'x'), coord(t, 1, 'in', 'y'), out='invecA', stroke=TEAL)
pie.la_vec2d(coord(t, 1, 'out', 'x'), coord(t, 1, 'out', 'y'), out='outvecA', stroke=GOLD)
pie.text('x', coord(t, 1.2, 'in', 'x'), coord(t, 1.2, 'in', 'y'), 13, out='labInA', stroke=TEAL)
pie.text('Ax', coord(t, 1.2, 'out', 'x'), coord(t, 1.2, 'out', 'y'), 13, out='labOutA', stroke=GOLD)
pie.text('Symmetric A: two eigenvector directions meet at 90°. Both eigenvalues are positive, so A only stretches, never flips.', 0, 2.5, 13, 3, -1, out='sumBoxA')
```

The input starts on the first eigenvector, so the arrows are collinear and $Ax$ is just $x$ stretched by $1.4$. Sweep the input by $90^\circ$ and it lands exactly on the second eigenvector, where the two arrows line up again and the output is scaled by $1$.

```python-editor collapsed
pie.translate_scalar_to(t, 2.356, animate=True)
```

That the sweep needed a clean quarter-turn is the perpendicularity of the eigenvectors made visible. Its unit eigenvectors are $[0.71,\, 0.71]$ and $[-0.71,\, 0.71]$.

---

Next take

$$B = \begin{bmatrix} -0.8 & 1.2 \\ 1.2 & 1 \end{bmatrix}$$

which is again symmetric, but this time one eigenvalue is negative, so that direction gets flipped as well as scaled.

```python-editor collapsed
import math

pie.clear()
pie.scalar(65, out='unit')
GRAY, TEAL, GOLD, VIOLET = '#71717a', '#0d9488', '#ca8a04', '#6d28d9'
p0 = pie.point(0, 0, out='p0', hidden=True)
pie.circle(p0, 1, out='circ', stroke=GRAY)
B = [[-0.8, 1.2], [1.2, 1]]
pie.la_mat_to_ellipse(B, p0, out='ellB', stroke=GRAY)
```

Watch it map the circle to an ellipse and reveal its two perpendicular eigenvectors.

```python-editor collapsed
e1a, e2a = pie.point(0.76, 1.51, out='e1a', hidden=True), pie.point(-1.51, 0.76, out='e2a', hidden=True)
pie.line(e1a, pie.point(-0.76, -1.51, out='e1b', hidden=True), out='eB1', stroke=VIOLET)
pie.line(e2a, pie.point(1.51, -0.76, out='e2b', hidden=True), out='eB2', stroke=VIOLET)
pie.text('λ₁ = 1.6', -0.91, -1.81, 13, out='labeB1', stroke=VIOLET)
pie.text('λ₂ = -1.4', 1.81, -0.91, 13, out='labeB2', stroke=VIOLET)
pie.annotate_angle_mark(pie.line(p0, e1a, out='rayB1', hidden=True), pie.line(p0, e2a, out='rayB2', hidden=True), out='angB')
```

The eigenvalues are $\textcolor{#b45309}{\lambda} = 1.6$ along $[1, 2]$ and $\textcolor{#b45309}{\lambda} = -1.4$ along $[-2, 1]$.

Draw the input $\textcolor{#0d9488}{x}$ and its output $\textcolor{#ca8a04}{Bx}$: on the first eigenvector they point the same way, with the output stretched by $1.6$.

```python-editor collapsed
# x is the unit vector at angle t; Bx is B times it
t = pie.scalar(1.107, out='t')
def input_output(t, k, which, axis):
    x, y = math.cos(t), math.sin(t)
    if which == 'out':
        x, y = B[0][0] * x + B[0][1] * y, B[1][0] * x + B[1][1] * y
    return k * (x if axis == 'x' else y)

coord = pie.lift(input_output, pie.Scalar)
pie.la_vec2d(coord(t, 1, 'in', 'x'), coord(t, 1, 'in', 'y'), out='invecB', stroke=TEAL)
pie.la_vec2d(coord(t, 1, 'out', 'x'), coord(t, 1, 'out', 'y'), out='outvecB', stroke=GOLD)
pie.text('x', coord(t, 1.2, 'in', 'x'), coord(t, 1.2, 'in', 'y'), 13, out='labInB', stroke=TEAL)
pie.text('Bx', coord(t, 1.2, 'out', 'x'), coord(t, 1.2, 'out', 'y'), 13, out='labOutB', stroke=GOLD)
pie.text('Still perpendicular, even tilted. The negative eigenvalue λ₂ = -1.4 flips the gold output back along its own eigenvector line.', 0, 2.6, 13, 3.2, -1, out='sumBoxB')
```

Sweep the input by $90^\circ$ onto the second eigenvector, where the negative eigenvalue $-1.4$ makes the gold output point in the _opposite_ direction along the same violet line.

```python-editor collapsed
pie.translate_scalar_to(t, 2.678, animate=True)
```

Its unit eigenvectors are $[0.45,\, 0.89]$ and $[-0.89,\, 0.45]$.

---

Finally take

$$C = \begin{bmatrix} 1 & -1 \\ -1 & 0.6 \end{bmatrix}$$

whose eigenvector directions are tilted off the coordinate axes, but which are still perpendicular to each other because $C$ is symmetric.

```python-editor collapsed
import math

pie.clear()
pie.scalar(60, out='unit')
GRAY, TEAL, GOLD, VIOLET = '#71717a', '#0d9488', '#ca8a04', '#6d28d9'
p0 = pie.point(0, 0, out='p0', hidden=True)
pie.circle(p0, 1, out='circ', stroke=GRAY)
C = [[1, -1], [-1, 0.6]]
pie.la_mat_to_ellipse(C, p0, out='ellC', stroke=GRAY)
```

Map the circle to its ellipse and reveal the two eigenvector lines.

```python-editor collapsed
e1a, e2a = pie.point(-1.31, 1.07, out='e1a', hidden=True), pie.point(1.07, 1.31, out='e2a', hidden=True)
pie.line(e1a, pie.point(1.31, -1.07, out='e1b', hidden=True), out='eC1', stroke=VIOLET)
pie.line(e2a, pie.point(-1.07, -1.31, out='e2b', hidden=True), out='eC2', stroke=VIOLET)
pie.text('λ₁ = 1.82', 1.57, -1.28, 13, out='labeC1', stroke=VIOLET)
pie.text('λ₂ = -0.22', -1.28, -1.57, 13, out='labeC2', stroke=VIOLET)
pie.annotate_angle_mark(pie.line(p0, e1a, out='rayC1', hidden=True), pie.line(p0, e2a, out='rayC2', hidden=True), out='angC')
```

Even though neither direction is horizontal or vertical, they still meet at a right angle. The eigenvalues are $\textcolor{#b45309}{\lambda} = 1.82$ along $[-5, 4.1]$ and $\textcolor{#b45309}{\lambda} = -0.22$ along $[4.1, 5]$.

Draw the input $\textcolor{#0d9488}{x}$ and its output $\textcolor{#ca8a04}{Cx}$ starting on the first eigenvector, where the output is stretched by $1.82$.

```python-editor collapsed
# x is the unit vector at angle t; Cx is C times it
t = pie.scalar(2.454, out='t')
def input_output(t, k, which, axis):
    x, y = math.cos(t), math.sin(t)
    if which == 'out':
        x, y = C[0][0] * x + C[0][1] * y, C[1][0] * x + C[1][1] * y
    return k * (x if axis == 'x' else y)

coord = pie.lift(input_output, pie.Scalar)
pie.la_vec2d(coord(t, 1, 'in', 'x'), coord(t, 1, 'in', 'y'), out='invecC', stroke=TEAL)
pie.la_vec2d(coord(t, 1, 'out', 'x'), coord(t, 1, 'out', 'y'), out='outvecC', stroke=GOLD)
pie.text('x', coord(t, 1.2, 'in', 'x'), coord(t, 1.2, 'in', 'y'), 13, out='labInC', stroke=TEAL)
pie.text('Cx', coord(t, 1.2, 'out', 'x'), coord(t, 1.2, 'out', 'y'), 13, out='labOutC', stroke=GOLD)
pie.text('Off-axis eigenvectors, still exactly 90° apart. C stretches by λ₁ = 1.82 on one direction and shrinks-and-flips by λ₂ = -0.22 on the other.', 0, 2.7, 13, 3.4, -1, out='sumBoxC')
```

Sweep the input by $90^\circ$ onto the perpendicular eigenvector, where the small negative eigenvalue $-0.22$ shrinks the output and flips it around.

```python-editor collapsed
pie.translate_scalar_to(t, 0.884, animate=True)
```

Its unit eigenvectors are $[-0.77,\, 0.63]$ and $[0.63,\, 0.77]$.

In all three cases the two eigenvector directions were perpendicular. That is the defining geometric feature of a symmetric matrix, and the next chapter shows what it buys us.

---

### 16.4.1 Tracking the eigenvectors as a matrix becomes symmetric

And it really is the symmetry doing the work. To see the right angle switch on, take a matrix whose entries we can steer:

$$\begin{aligned}
M &= \begin{bmatrix} m_{11} & \textcolor{#e11d48}{m_{12}} \\ m_{21} & m_{22} \end{bmatrix} \\
  &= \begin{bmatrix} 1.2 & \textcolor{#e11d48}{0.2} \\ 0.8 & 0.6 \end{bmatrix}
\end{aligned}$$

which is not symmetric, since $\textcolor{#e11d48}{m_{12}} = 0.2$ while $m_{21} = 0.8$.

```python-editor collapsed
import math

pie.clear()
pie.scalar(60, out='unit')
GRAY, VIOLET = '#71717a', '#6d28d9'
pie.text('As a matrix converges to a symmetric matrix, its eigenvectors converge to being perpendicular', 0, 3, 14, 4, -1, out='txt')
p0 = pie.point(0, 0, out='p0', hidden=True)
pie.circle(p0, 1, out='circ', stroke=GRAY)
m11, m12, m21, m22 = 1.2, pie.scalar(0.2, out='m12'), 0.8, 0.6
m = [[m11, m12], [m21, m22]]
pie.la_array_to_texts(m, -0.5, -2.5, 1, 1, 14, out='mviz')
pie.la_mat_to_ellipse(m, p0, out='ellM', stroke=GRAY)

# The two eigenvectors of M, scaled to length 1.9. `which` is +1 or -1 (the larger or smaller
# eigenvalue) and `sign` picks one end of the line through the origin.
def eigen_end(m12, which, sign, axis):
    half_trace, half_diff = (m11 + m22) / 2, (m11 - m22) / 2
    lam = half_trace + which * math.sqrt(half_diff ** 2 + m12 * m21)
    vx, vy = m12, lam - m11
    k = sign * 1.9 / math.hypot(vx, vy)
    return k * (vx if axis == 'x' else vy)

end = pie.lift(eigen_end, pie.Scalar)
ends = {(w, s): pie.point(end(m12, w, s, 'x'), end(m12, w, s, 'y'), hidden=True) for w in (1, -1) for s in (1, -1)}
```

The matrix maps the circle to an ellipse as before. Reveal its two eigenvector directions:

```python-editor collapsed
pie.line(ends[(1, 1)], ends[(1, -1)], out='eM1', stroke=VIOLET)
pie.line(ends[(-1, 1)], ends[(-1, -1)], out='eM2', stroke=VIOLET)
pie.annotate_angle_mark(pie.line(p0, ends[(1, 1)], out='rayM1', hidden=True), pie.line(p0, ends[(-1, 1)], out='rayM2', hidden=True), out='angM')
```

With $\textcolor{#e11d48}{m_{12}} \ne m_{21}$ the angle between them is visibly not a right angle. Everything on the canvas is computed live from the four entries, so now drive $\textcolor{#e11d48}{m_{12}}$ up toward $m_{21}$.

```python-editor collapsed
pie.translate_scalar_to(m12, m21, animate=True)
```

As $\textcolor{#e11d48}{m_{12}}$ closes in on $m_{21}$ the ellipse re-shapes, both eigenvector lines swing, and at the moment $\textcolor{#e11d48}{m_{12}} = m_{21}$, when $M$ becomes symmetric, the marked angle lands on exactly $90^\circ$.

In the next chapter we study the **powers of a matrix**: raising $M$ to higher powers through its eigendecomposition, which turns out to be the engine behind Fibonacci numbers, Markov chains, and more.

---

[← 15. Eigendecomposition](/la/15_eigendecomposition)  ·  [17. Powers of a matrix →](/la/17_powers_of_a_matrix)
