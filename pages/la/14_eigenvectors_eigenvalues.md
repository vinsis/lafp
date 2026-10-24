---
title: 14. Eigenvectors and eigenvalues
canvas: left
---

# 14. Eigenvectors and eigenvalues

<details>
<summary>Review</summary>

To keep a normal vector perpendicular after a transformation $M$, we transform it not by $M$ but by the inverse-transpose $(M^T)^{-1}$. The reason came from the dot product: $\langle Mp, Nq \rangle = p^T (M^T N) q$, which collapses to $\langle p, q \rangle$ exactly when $M^T N = I$. In this chapter we ask a different question about a matrix acting on a vector, and it opens a door to some of the most beautiful ideas in linear algebra.

</details>

What happens when the input vector points in the _same direction_ as the output vector for a given matrix? This simple question leads to a treasure trove of beautiful mathematical concepts.

---

## 14.1 Direction of input vector = direction of output vector
An $n \times n$ matrix $M$ can be seen as a function whose input vector $x$ and output vector $Mx$ are both $n$-dimensional.

If both the input and the output point in the **same direction**, it means the output $Mx$ is just a scaled copy of the input $x$. In other words,

$$M\textcolor{#0d9488}{x} = \textcolor{#6d28d9}{\lambda}\textcolor{#0d9488}{x}$$

where $\textcolor{#6d28d9}{\lambda}$ is a scalar number. The vector $\textcolor{#0d9488}{x}$ is called an **eigenvector** of $M$, and the number $\textcolor{#6d28d9}{\lambda}$ is called the **eigenvalue** belonging to that eigenvector.

Note that we only care about the _direction_ of the eigenvector $\textcolor{#0d9488}{x}$, not its length: if $\textcolor{#0d9488}{x}$ is an eigenvector, so is every vector pointing along the same line, and each of them is scaled by the same $\textcolor{#6d28d9}{\lambda}$.

---

### 14.1.1 Visualizing (eigen)vectors for 2-by-2 matrices
Before the algebra, let's build a non-rigorous intuition. We want to see the output vector for an input vector in _every possible direction_. For a 2-by-2 matrix, we can do this by watching how the points on a circle are transformed:

- Sample many points uniformly on a circle of fixed radius. Each point is an input vector.
- Compute the output vector $Mx$ for each input vector $x$.
- For each pair $(x,\, Mx)$, draw a line from the input point to the output point.

Where the output lands right on top of (or directly opposite) the input direction, we have found an eigenvector. Let's start with the matrix

$$A = \begin{bmatrix} 1.5 & 0.1 \\ 0.5 & 0.5 \end{bmatrix}$$

```python-editor collapsed
import math

pie.clear()
pie.scalar(70, out='unit')
GRAY, TEAL, GOLD, VIOLET = '#71717a', '#0d9488', '#ca8a04', '#6d28d9'
p0 = pie.point(0, 0, out='p0', hidden=True)
pie.circle(p0, 1, out='circ', stroke=GRAY)
A = [[1.5, 0.1], [0.5, 0.5]]
pie.la_mat_to_ellipse(A, p0, out='ellipseA', stroke=GRAY)
pie.la_array_to_texts(A, 3, 3, 0.8, 0.5, out='mviz')
```

The matrix maps every point on the circle to a point on an ellipse, each colored segment joins an input point to its output point.

```python-editor collapsed
pie.la_circle_transform2(A, 40, out='fan')
```

Notice that most segments are slanted: the output points in a _different_ direction than the input. But along a couple of special directions the segments lie flat against a radial line, meaning input and output are collinear there.

Reveal the two eigenvector directions as two lines through the origin.

```python-editor collapsed
pie.line(pie.point(1.53, 0.73, out='e1a', hidden=True), pie.point(-1.53, -0.73, out='e1b', hidden=True), out='eline1', stroke=VIOLET)
pie.line(pie.point(0.16, -1.69, out='e2a', hidden=True), pie.point(-0.16, 1.69, out='e2b', hidden=True), out='eline2', stroke=VIOLET)
pie.text('λ₁ ≈ 1.54', 1.9, 0.95, 12, out='lab1', stroke=VIOLET)
pie.text('λ₂ ≈ 0.45', 0.35, -2.1, 12, out='lab2', stroke=VIOLET)
```

Along each of these lines the transformation only stretches or shrinks: the eigenvalues are $\lambda \approx 1.54$ and $\lambda \approx 0.45$.

To make this concrete, draw a single input vector $\textcolor{#0d9488}{x}$ and its output $\textcolor{#ca8a04}{Ax}$.

```python-editor collapsed
# x is the unit vector at angle t; Ax is A times it
t = pie.scalar(0.445, out='t')
def input_output(t, k, which, axis):
    x, y = math.cos(t), math.sin(t)
    if which == 'out':
        x, y = A[0][0] * x + A[0][1] * y, A[1][0] * x + A[1][1] * y
    return k * (x if axis == 'x' else y)

coord = pie.lift(input_output, pie.Scalar)
pie.la_vec2d(coord(t, 1, 'in', 'x'), coord(t, 1, 'in', 'y'), out='invec', stroke=TEAL)
pie.la_vec2d(coord(t, 1, 'out', 'x'), coord(t, 1, 'out', 'y'), out='outvec', stroke=GOLD)
pie.text('x', coord(t, 1.2, 'in', 'x'), coord(t, 1.2, 'in', 'y'), 13, out='labx', stroke=TEAL)
pie.text('Ax', coord(t, 1.2, 'out', 'x'), coord(t, 1.2, 'out', 'y'), 13, out='labAx', stroke=GOLD)
pie.text('Along a violet eigenvector, Ax stays collinear with x. Everywhere else the output swings away.', -3.2, -2.2, 12, 2.8, -1, out='sumTxt', stroke=GRAY)
```

Right now the input sits on the first eigenvector, so the two arrows are collinear and $Ax$ is simply $x$ stretched by $\lambda \approx 1.54$. Sweep the input all the way around the circle and watch the gold output swing away from the teal input almost everywhere.

```python-editor collapsed
for k in range(1, 9):
    pie.translate_scalar_to(t, 0.445 + k * math.pi / 4, animate=True)
```

Line it up with the second eigenvector and the two arrows fall onto the same violet line again, this time with the output _shorter_ than the input ($\lambda \approx 0.45$).

```python-editor collapsed
pie.translate_scalar_to(t, -1.475 + 2 * math.pi, animate=True)
```

So $A$ has **two** eigenvectors. Not every matrix is so lucky.

---

Next take the **shear** matrix

$$B = \begin{bmatrix} 1 & 0 \\ 1 & 1 \end{bmatrix}$$

```python-editor collapsed
import math

pie.clear()
pie.scalar(70, out='unit')
GRAY, TEAL, GOLD, VIOLET = '#71717a', '#0d9488', '#ca8a04', '#6d28d9'
p0 = pie.point(0, 0, out='p0', hidden=True)
pie.circle(p0, 1, out='circ', stroke=GRAY)
B = [[1, 0], [1, 1]]
pie.la_mat_to_ellipse(B, p0, out='ellipseB', stroke=GRAY)
pie.la_array_to_texts(B, 3, 3, 0.8, 0.5, out='mviz')
pie.text('Shear: y grows by x, the y-axis stays put', -2, 2, 12, 2, -1, out='shear_txt', stroke=GRAY)
```

which maps the circle to a slanted ellipse.

```python-editor collapsed
pie.la_circle_transform2(B, 40, out='fanB')
```

This vertical shear pushes each point up by an amount equal to its $x$-coordinate, so the only direction that stays put is the y-axis (where $x = 0$). Reveal its single eigenvector, with eigenvalue $\lambda = 1$: every point on the y-axis maps exactly to itself.

```python-editor collapsed
pie.line(pie.point(0, 1.7, out='eb1', hidden=True), pie.point(0, -1.7, out='eb2', hidden=True), out='elineB', stroke=VIOLET)
pie.text('λ = 1', 0.45, 1.85, 12, out='lab_lambda_b', stroke=VIOLET)
```

Draw the input $\textcolor{#0d9488}{x}$ and its output $\textcolor{#ca8a04}{Bx}$: on the y-axis they coincide perfectly.

```python-editor collapsed
# x is the unit vector at angle t; Bx is B times it
t = pie.scalar(math.pi / 2, out='t')
def input_output(t, k, which, axis, shift=0):
    x, y = math.cos(t), math.sin(t)
    if which == 'out':
        x, y = B[0][0] * x + B[0][1] * y, B[1][0] * x + B[1][1] * y
    return k * x + shift if axis == 'x' else k * y

coord = pie.lift(input_output, pie.Scalar)
pie.la_vec2d(coord(t, 1, 'in', 'x'), coord(t, 1, 'in', 'y'), out='invecB', stroke=TEAL)
pie.la_vec2d(coord(t, 1, 'out', 'x'), coord(t, 1, 'out', 'y'), out='outvecB', stroke=GOLD)
pie.text('x', coord(t, 1.2, 'in', 'x', -0.35), coord(t, 1.2, 'in', 'y'), 13, out='lab_x_b', stroke=TEAL)
pie.text('Bx', coord(t, 1.2, 'out', 'x', 0.35), coord(t, 1.2, 'out', 'y'), 13, out='lab_bx_b', stroke=GOLD)
```

Sweep the input around and, apart from that one vertical direction, the output never lines up with the input again. So $B$ has exactly **one** eigenvector.

```python-editor collapsed
for k in range(1, 9):
    pie.translate_scalar_to(t, math.pi / 2 + k * math.pi / 4, animate=True)
```

---

Finally take a **scaled rotation**

$$C = 1.6 \begin{bmatrix} \cos 60^\circ & -\sin 60^\circ \\ \sin 60^\circ & \cos 60^\circ \end{bmatrix} = \begin{bmatrix} 0.8 & -1.39 \\ 1.39 & 0.8 \end{bmatrix}$$

```python-editor collapsed
import math

pie.clear()
pie.scalar(65, out='unit')
GRAY, TEAL, GOLD = '#71717a', '#0d9488', '#ca8a04'
p0 = pie.point(0, 0, out='p0', hidden=True)
pie.circle(p0, 1, out='circ', stroke=GRAY)
C = [[0.8, -1.386], [1.386, 0.8]]
pie.la_mat_to_ellipse(C, p0, out='ellipseC', stroke=GRAY)
pie.la_array_to_texts(C, 3, 3, 0.9, 0.5, out='mviz')
pie.text('Rotation: no real eigenvalues or eigenvectors', -3, 3, 12, 2, -1, out='rot_txt', stroke=GRAY)
```

which turns every input by $60^\circ$ while stretching it. Because a rotation moves _every_ direction, there is no direction left pointing where it started.

```python-editor collapsed
pie.la_circle_transform2(C, 40, out='fanC')
```

Draw the input $\textcolor{#0d9488}{x}$ and its output $\textcolor{#ca8a04}{Cx}$ and sweep the input all the way around: the gold output is _always_ turned away from the teal input by $60^\circ$.

```python-editor collapsed
# x is the unit vector at angle t; Cx is C times it
t = pie.scalar(0, out='t')
def input_output(t, k, which, axis):
    x, y = math.cos(t), math.sin(t)
    if which == 'out':
        x, y = C[0][0] * x + C[0][1] * y, C[1][0] * x + C[1][1] * y
    return k * (x if axis == 'x' else y)

coord = pie.lift(input_output, pie.Scalar)
pie.la_vec2d(coord(t, 1, 'in', 'x'), coord(t, 1, 'in', 'y'), out='invecC', stroke=TEAL)
pie.la_vec2d(coord(t, 1, 'out', 'x'), coord(t, 1, 'out', 'y'), out='outvecC', stroke=GOLD)
pie.text('x', coord(t, 1.2, 'in', 'x'), coord(t, 1.2, 'in', 'y'), 13, out='lab_x_c', stroke=TEAL)
pie.text('Cx', coord(t, 1.2, 'out', 'x'), coord(t, 1.2, 'out', 'y'), 13, out='lab_cx_c', stroke=GOLD)
for k in range(1, 9):
    pie.translate_scalar_to(t, k * math.pi / 4, animate=True)
pie.text('No direction survives a rotation: zero real eigenvectors.', -3.0, -3.5, 13, 2.6, -1, out='cap_box_c', stroke=GRAY)
```

There is no eigenvector to be found, so $C$ has **zero** (real) eigenvectors.

---

### 14.1.2 Maximum number of unique eigenvalues
In general, an $n \times n$ matrix can have **at most $n$** unique eigenvalues. So a 2-by-2 matrix can have at most two, and as the three examples above show, it may have two, one, or none. To see _why_ the ceiling is $n$, we need a little algebra.

---

## 14.2 The algebra of $Ax = \lambda x$
For any vector $v$ we can write $\textcolor{#6d28d9}{\lambda} v = \textcolor{#6d28d9}{\lambda} I v$, where $I$ is the identity matrix:

$$\begin{aligned}
\textcolor{#6d28d9}{\lambda} v &= \textcolor{#6d28d9}{\lambda} I v \\
&= \underbrace{\begin{bmatrix} \textcolor{#6d28d9}{\lambda} & 0 & \cdots & 0 \\ 0 & \textcolor{#6d28d9}{\lambda} & \cdots & 0 \\ \vdots & \vdots & \ddots & \vdots \\ 0 & 0 & \cdots & \textcolor{#6d28d9}{\lambda} \end{bmatrix}}_{\lambda I} v
\end{aligned}$$

Let's use this to solve $Mv = \textcolor{#6d28d9}{\lambda} v$ for a 2-by-2 matrix $M = \begin{bmatrix} a & b \\ c & d \end{bmatrix}$. Moving everything to one side:

$$\begin{aligned}
Mv &= \textcolor{#6d28d9}{\lambda} v \\
(M - \textcolor{#6d28d9}{\lambda} I)\, v &= 0 \\
\underbrace{\begin{bmatrix} a - \textcolor{#6d28d9}{\lambda} & b \\ c & d - \textcolor{#6d28d9}{\lambda} \end{bmatrix}}_{\text{must be singular}} v &= 0
\end{aligned}$$

Since $v$ is a **non-zero** vector, the matrix $\begin{bmatrix} a - \textcolor{#6d28d9}{\lambda} & b \\ c & d - \textcolor{#6d28d9}{\lambda} \end{bmatrix}$ must be **singular**. This means its column vectors point in the same direction. In other words, the vectors $\textcolor{#1d4ed8}{[a-\lambda,\; b]}$ and $\textcolor{#be185d}{[c,\; d-\lambda]}$ are parallel.

Two parallel vectors share the same perpendicular, so $\textcolor{#1d4ed8}{[a-\lambda,\; b]}$ must be perpendicular to $[d-\lambda,\; -c]$ (a vector perpendicular to $\textcolor{#be185d}{[c,\; d-\lambda]}$). Their dot product is therefore zero:

$$\begin{aligned}
(a-\textcolor{#6d28d9}{\lambda})(d-\textcolor{#6d28d9}{\lambda}) - bc &= 0 \\
\textcolor{#6d28d9}{\lambda}^2 - (a+d)\textcolor{#6d28d9}{\lambda} + (ad - bc) &= 0
\end{aligned}$$

This equation is **quadratic** in $\textcolor{#6d28d9}{\lambda}$, so it can have at most two solutions. That is exactly why a 2-by-2 matrix has at most two unique eigenvalues. In general, the analogous equation for an $n \times n$ matrix is a degree-$n$ polynomial, giving at most $n$ unique eigenvalues.

#### Why is $[-\alpha b,\; \alpha a]$ perpendicular to $[a, b]$?
Given a 2D vector $v = [a, b]$, the vector $w = [-\alpha b,\; \alpha a]$ (for any number $\alpha$) is perpendicular to it, because their dot product vanishes: $\langle v, w \rangle = -\alpha ab + \alpha ab = 0$. Rotating a vector by $90^\circ$ is exactly this swap-and-negate operation.

---

## 14.3 The (superficial) geometry of $Ax = \lambda x$
We just saw that if $\lambda$ is an eigenvalue of $M = \begin{bmatrix} a & b \\ c & d \end{bmatrix}$, then $M - \lambda I$ is a **singular** matrix. So:

- If $M$ has two unique eigenvalues, $M - \lambda I$ is singular for those two values of $\lambda$.
- If $M$ has one unique eigenvalue, it is singular for that one value.
- If $M$ has no eigenvalues, $M - \lambda I$ is never singular.

We have seen before that a singular 2-by-2 matrix collapses the entire 2D plane onto a 1D line. So let's watch $M - \lambda I$ as we vary $\lambda$, and look for the moments where the grid flattens into a line. Starting with our matrix $A$:

```python-editor collapsed
pie.clear()
pie.scalar(30, out='unit')
GRID = '#a1a1aa'
lam = pie.scalar(0, out='lam')
minus = pie.lift(lambda a, lam: a - lam, pie.Scalar)
m = [[minus(1.5, lam), 0.1], [0.5, minus(0.5, lam)]]
pie.la_grid_transform(m, out='grid', stroke=GRID)
pie.la_array_to_texts(m, 4, -4.5, 1.7, 0.9, 13, out='mviz')
pie.text(pie.lift(lambda lam: f'λ = {lam:.2f}', pie.Text)(lam), -7, -4.5, 15, out='lbox')
```

The transformed grid of $A - \lambda I$ starts at $\lambda = 0$, where it is just $A$ itself and the grid fills the plane. Slide $\lambda$ up and watch the grid squash flat **twice** on the way:

```python-editor collapsed
pie.translate_scalar_to(lam, 1.7, animate=True)
```

once near $\lambda \approx 0.45$

```python-editor collapsed
pie.translate_scalar_to(lam, 0.45, animate=True)
```

and again near $\lambda \approx 1.54$.

```python-editor collapsed
pie.translate_scalar_to(lam, 1.54, animate=True)
```

Each flattening is a value of $\lambda$ that makes $A - \lambda I$ singular, which is precisely an eigenvalue. Bring $\lambda$ back to zero to reset.

```python-editor collapsed
pie.translate_scalar_to(lam, 0, animate=True)
```

```python-editor collapsed
pie.clear()
pie.scalar(30, out='unit')
GRID = '#a1a1aa'
lam = pie.scalar(0, out='lam')
minus = pie.lift(lambda a, lam: a - lam, pie.Scalar)
m = [[minus(1, lam), 0], [1, minus(1, lam)]]
pie.la_grid_transform(m, out='grid', stroke=GRID)
pie.la_array_to_texts(m, 4, -4.5, 1.7, 0.9, 13, out='mviz')
pie.text(pie.lift(lambda lam: f'λ = {lam:.2f}', pie.Text)(lam), -7, -4.5, 15, out='lbox')
```

For the shear $B = \begin{bmatrix} 1 & 0 \\ 1 & 1 \end{bmatrix}$, the grid of $B - \lambda I$ flattens exactly **once**. Slide $\lambda$ toward one and the grid collapses precisely at $\lambda = 1$, its single eigenvalue,

```python-editor collapsed
pie.translate_scalar_to(lam, 1, animate=True)
```

then reset.

```python-editor collapsed
pie.translate_scalar_to(lam, 0, animate=True)
```

```python-editor collapsed
pie.clear()
pie.scalar(26, out='unit')
GRID = '#a1a1aa'
lam = pie.scalar(0, out='lam')
minus = pie.lift(lambda a, lam: a - lam, pie.Scalar)
m = [[minus(0.8, lam), -1.386], [1.386, minus(0.8, lam)]]
pie.la_grid_transform(m, out='grid', stroke=GRID)
pie.la_array_to_texts(m, 4.5, -5, 1.9, 0.95, 13, out='mviz')
pie.text(pie.lift(lambda lam: f'λ = {lam:.2f}', pie.Text)(lam), -8, -5, 15, out='lbox')
```

Finally the scaled rotation $C$, whose grid $C - \lambda I$ **never** flattens. Slide $\lambda$ across a wide range and the grid keeps its full 2D spread the entire time: the matrix is never singular, so $C$ has no real eigenvalues.

```python-editor collapsed
pie.translate_scalar_to(lam, 3, animate=True)
```

Reset.

```python-editor collapsed
pie.translate_scalar_to(lam, 0, animate=True)
```

---

## 14.4 Let's focus on the best case
Note that if two eigenvalues of a matrix are different, their eigenvectors point in different directions too. So when an $n \times n$ matrix has $n$ _unique_ eigenvalues, it also has $n$ eigenvectors pointing in $n$ different directions.

What if we use these eigenvectors as the **basis vectors** of a new coordinate system? That single idea unlocks eigendecomposition, and we will follow it in the next chapter.

In the next chapter we study **eigendecomposition**: using a full set of eigenvectors as a basis to factor a matrix into a diagonal core, where its action is nothing more than scaling along each eigen-direction.

---

[← 13. Normal vectors](/la/13_normal_vectors)  ·  [15. Eigendecomposition →](/la/15_eigendecomposition)
