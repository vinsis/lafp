---
title: Rotation matrices
description: Derive the 2D rotation matrix, see why its columns are perpendicular unit vectors, and why the transpose of a rotation matrix is its inverse.
canvas: left
sidebar: _ebook.md
---

# 12. Rotations

<details>
<summary>Review</summary>

The transpose $M^T$ turns the rows of $M$ into columns and vice versa. It obeys $(AB)^T = B^T A^T$, and it lets us switch fluidly between the column view and the row view of a matrix-vector product. In this chapter that duality pays off: a rotation matrix is precisely one whose transpose is its inverse.

</details>

We saw a glimpse of this fact in the very first chapter, where we expressed the rotated coordinates of a point as a weighted sum of its input coordinates. That weighted sum _is_ a matrix. Now let's explore the rotation matrix in detail.

---

## 12.1 Rotation in two dimensions

### 12.1.1 The hard way
We can describe a point $P = [x, y]$ in **polar coordinates** as $[r\cos\theta,\; r\sin\theta]$, where $r$ is its distance from the origin and $\theta$ is the angle it makes with the x-axis. (See [polar coordinates](https://en.wikipedia.org/wiki/Polar_coordinate_system) if this is unfamiliar.)

We would like to rotate $P$ by an angle $\alpha$. The rotated point $Q$ simply gains that angle: $Q = [r\cos(\alpha + \theta),\; r\sin(\alpha + \theta)]$. Expanding with the angle-sum identities:

$$\begin{aligned} r\cos(\alpha + \theta) &= r\big(\textcolor{#1d4ed8}{\cos\alpha}\cos\theta - \textcolor{#be185d}{\sin\alpha}\sin\theta\big) \\ r\sin(\alpha + \theta) &= r\big(\textcolor{#1d4ed8}{\sin\alpha}\cos\theta + \textcolor{#be185d}{\cos\alpha}\sin\theta\big) \end{aligned}$$

Collecting the $r\cos\theta$ and $r\sin\theta$ terms, this is exactly a matrix acting on the original point:

$$\begin{bmatrix} \textcolor{#1d4ed8}{\cos\alpha} & \textcolor{#be185d}{-\sin\alpha} \\ \textcolor{#1d4ed8}{\sin\alpha} & \textcolor{#be185d}{\cos\alpha} \end{bmatrix} \begin{bmatrix} r\cos\theta \\ r\sin\theta \end{bmatrix} = \begin{bmatrix} r\cos(\alpha + \theta) \\ r\sin(\alpha + \theta) \end{bmatrix}$$

Geometrically the matrix is doing nothing more than **angle addition**: it keeps the radius $r$ and adds $\alpha$ to the angle.

```python-editor collapsed
import math

pie.clear()
pie.scalar(70, out='unit')
GRAY, BLUE, GOLD, TEAL, PINK = '#71717a', '#1d4ed8', '#ca8a04', '#0d9488', '#be185d'
p0 = pie.point(0, 0, out='p0', hidden=True)
r, theta = 2, 0.5
pie.circle(p0, r, out='circ', stroke=GRAY)
alpha = pie.scalar(0.7, out='alpha')
# P is at angle θ, and Q at angle θ + α, both at radius r
px, py = r * math.cos(theta), r * math.sin(theta)
on_circle = pie.lift(lambda alpha, radius, axis: radius * (math.cos(theta + alpha) if axis == 'x' else math.sin(theta + alpha)), pie.Scalar)
qx, qy = on_circle(alpha, r, 'x'), on_circle(alpha, r, 'y')
pie.la_vec2d(px, py, out='vP', stroke=BLUE)
pie.la_vec2d(qx, qy, out='vQ', stroke=GOLD)
xaxis = pie.line(p0, pie.point(r, 0, out='axp', hidden=True), out='xaxis', hidden=True)
lop = pie.line(p0, pie.point(px, py, out='Pp', hidden=True), out='lop', hidden=True)
loq = pie.line(p0, pie.point(qx, qy, out='Qp', hidden=True), out='loq', hidden=True)
pie.annotate_angle_mark(xaxis, lop, 'θ', out='arcT', stroke=TEAL)
pie.annotate_angle_mark(lop, loq, 'α', out='arcA', stroke=PINK)
pie.text('P', 1.15 * px, 1.15 * py, 14, out='labP', stroke=BLUE)
pie.text('Q', on_circle(alpha, 1.15 * r, 'x'), on_circle(alpha, 1.15 * r, 'y'), 14, out='labQ', stroke=GOLD)
```

Here the input point $P$ sits at angle $\theta$ on a circle of radius $r$, and its rotation $Q$ sits at angle $\theta + \alpha$ at the very same radius. Sweep the angle $\alpha$ and $Q$ glides along the circle while $r$ never changes.

```python-editor collapsed
pie.translate_scalar_to(alpha, 1.4, animate=True)
pie.text('Rotation keeps the radius r fixed and adds α to the angle: Q is simply P turned by α.', 0, 3.1, 12, 5, -1, out='sBox')
```

So the matrix on the left is the one that rotates any input vector by the angle $\alpha$. There is a much cleaner way to arrive at the same matrix, without any trigonometric grinding.

---

### 12.1.2 The easy way
This method comes from a single observation: multiplying a $2\times2$ matrix $M$ by a basis vector picks out a **column** of $M$.

$$\begin{bmatrix} \vert & \vert \\ \textcolor{#1d4ed8}{c_1} & \textcolor{#be185d}{c_2} \\ \vert & \vert \end{bmatrix} \begin{bmatrix} 1 \\ 0 \end{bmatrix} = \begin{bmatrix} \vert \\ \textcolor{#1d4ed8}{c_1} \\ \vert \end{bmatrix}, \qquad \begin{bmatrix} \vert & \vert \\ \textcolor{#1d4ed8}{c_1} & \textcolor{#be185d}{c_2} \\ \vert & \vert \end{bmatrix} \begin{bmatrix} 0 \\ 1 \end{bmatrix} = \begin{bmatrix} \vert \\ \textcolor{#be185d}{c_2} \\ \vert \end{bmatrix}$$

So once we know where the input $[1,0]$ should land, we know the **first column** of the matrix; and once we know where $[0,1]$ should land, we know the **second column**. For a rotation by $\alpha$ these landing spots are obvious from a picture: just rotate each basis vector by $\alpha$ and read off its tip.

```python-editor collapsed
import math

pie.clear()
pie.scalar(90, out='unit')
GRAY, BLUE, PINK = '#71717a', '#1d4ed8', '#be185d'
pie.circle(pie.point(0, 0, out='p0', hidden=True), 1, out='circ', stroke=GRAY)
alpha = pie.scalar(0.6, out='alpha')
ca = pie.lift(math.cos, pie.Scalar)(alpha)
sa = pie.lift(math.sin, pie.Scalar)(alpha)
nsa = pie.lift(lambda a: -math.sin(a), pie.Scalar)(alpha)
pie.la_vec2d(1, 0, out='e1', stroke=GRAY)
pie.la_vec2d(0, 1, out='e2', stroke=GRAY)
```

Draw a unit circle and the two input basis vectors $\textcolor{#71717a}{[1,0]}$ and $\textcolor{#71717a}{[0,1]}$ in grey. Their rotated images are the columns of the rotation matrix. Reveal the first column, where $[1,0]$ lands, which sits at $\textcolor{#1d4ed8}{(\cos\alpha,\; \sin\alpha)}$, and the second column, where $[0,1]$ lands, at $\textcolor{#be185d}{(-\sin\alpha,\; \cos\alpha)}$.

```python-editor collapsed
pie.la_vec2d(ca, sa, out='col1', stroke=BLUE)
pie.la_vec2d(nsa, ca, out='col2', stroke=PINK)
pie.la_array_to_texts([[ca, nsa], [sa, ca]], -2.9, -1.8, 0.95, 0.5, 13, out='rviz')
```

The two colored arrows are literally the columns of

$$R = \begin{bmatrix} \textcolor{#1d4ed8}{\cos\alpha} & \textcolor{#be185d}{-\sin\alpha} \\ \textcolor{#1d4ed8}{\sin\alpha} & \textcolor{#be185d}{\cos\alpha} \end{bmatrix}$$

shown as a live readout on the canvas. Sweep the angle $\alpha$ through a third of a turn and watch both columns glide around the circle while staying perpendicular,

```python-editor collapsed
pie.translate_scalar_to(alpha, 2.094, animate=True)
```

then sweep it back to zero, where the columns snap back to the plain identity matrix. No angle-sum identities required: the picture _is_ the derivation.

```python-editor collapsed
pie.translate_scalar_to(alpha, 0, animate=True)
```

---

## 12.2 Rotation in higher dimensions
What does rotation look like in higher dimensions? In three dimensions it already gets complicated, and in four or more we can say very little visually. But two facts hold for a rotation in **any** number of dimensions:

- The angle between two vectors does not change after rotation.
- The norm (length) of a vector does not change after rotation.

Everything else about rotation matrices follows from these two facts.

### 12.2.1 The columns of a rotation matrix are perpendicular
Consider an $n \times n$ rotation matrix $R$. Pick the two basis vectors $v_1 = [1, 0, \ldots, 0]$ and $v_2 = [0, 1, \ldots, 0]$. They are perpendicular, so $\langle v_1, v_2 \rangle = 0$.

Since rotation preserves angles, the rotated vectors are still perpendicular: $\langle Rv_1,\; Rv_2 \rangle = 0$. But $Rv_1$ is just the **first column** of $R$ and $Rv_2$ is the **second column** (by the same basis-vector trick as before). Therefore

$$\langle \text{column 1},\; \text{column 2} \rangle = 0.$$

The same argument applied to any pair of basis vectors shows that **every pair of columns of $R$ is perpendicular**.

```python-editor collapsed
import math

pie.clear()
pie.scalar(110, out='unit')
GRAY, BLUE, PINK = '#71717a', '#1d4ed8', '#be185d'
p0 = pie.point(0, 0, out='p0', hidden=True)
pie.circle(p0, 1, out='circ', stroke=GRAY)
beta = pie.scalar(0.6, out='beta')
cb = pie.lift(math.cos, pie.Scalar)(beta)
sb = pie.lift(math.sin, pie.Scalar)(beta)
nsb = pie.lift(lambda b: -math.sin(b), pie.Scalar)(beta)
c1 = pie.la_vec2d(cb, sb, out='c1', stroke=BLUE)
c2 = pie.la_vec2d(nsb, cb, out='c2', stroke=PINK)
pie.annotate_angle_mark(c1, c2, out='rmark')
```

The two columns of $R$ are drawn here: the first in blue and the second in pink, with the angle between them marked live. Rotate the whole frame and the mark holds at exactly $90°$ the entire way. The right angle between the columns is preserved because rotation preserves angles.

```python-editor collapsed
pie.translate_scalar_to(beta, 2.6, animate=True)
pie.text('Every pair of columns stays perpendicular under rotation, so the angle mark never leaves 90 degrees.', 0, 1.9, 12, 4.4, -1, out='sBox')
```

---

### 12.2.2 The columns of a rotation matrix have unit norm
Since rotation preserves length, and each basis vector $v_i$ has length $1$:

$$\begin{aligned}
\lVert \text{column } i \rVert &= \lVert R v_i \rVert & \text{(column } i \text{ is } Rv_i\text{)} \\
&= \lVert v_i \rVert & \text{(rotation preserves length)} \\
&= 1 & \text{(}v_i\text{ is a unit basis vector)}
\end{aligned}$$

So every column of a rotation matrix is a **unit vector**.

---

## 12.3 A beautiful property: $\textcolor{#0d9488}{R^T R = I = R R^T}$
We can fold the two facts above into a single statement about the columns $c_1, \ldots, c_n$ of $R$:

$$\langle c_i,\; c_j \rangle = \begin{cases} 1 & i = j \\ 0 & i \neq j \end{cases}$$

Now recall that the entries of $R^T R$ are exactly the dot products of the columns of $R$ (the rows of $R^T$ _are_ the columns of $R$). So:

$$\begin{aligned} R^T R &= \begin{bmatrix} \text{—} & c_1 & \text{—} \\ \text{—} & c_2 & \text{—} \\ & \vdots & \\ \text{—} & c_n & \text{—} \end{bmatrix} \begin{bmatrix} \vert & \vert & & \vert \\ c_1 & c_2 & \cdots & c_n \\ \vert & \vert & & \vert \end{bmatrix} \\ &= \begin{bmatrix} \langle c_1, c_1 \rangle & \langle c_1, c_2 \rangle & \cdots \\ \langle c_2, c_1 \rangle & \langle c_2, c_2 \rangle & \cdots \\ \vdots & \vdots & \ddots \end{bmatrix} \\ &= \begin{bmatrix} 1 & 0 & \cdots & 0 \\ 0 & 1 & \cdots & 0 \\ \vdots & \vdots & \ddots & \vdots \\ 0 & 0 & \cdots & 1 \end{bmatrix} \\ &= I \end{aligned}$$

Every diagonal entry is $\langle c_i, c_i \rangle = 1$ and every off-diagonal entry is $\langle c_i, c_j \rangle = 0$. So $R^T R = I$.

---

## 12.4 The transpose of a rotation matrix is its inverse
We just showed that $R^T R = I$. But the defining property of the inverse is $R^{-1} R = R R^{-1} = I$. Comparing the two gives

$$R^T = R^{-1}, \qquad \text{and therefore} \qquad R R^T = I.$$

The transpose of a rotation matrix is its inverse. This makes perfect geometric sense: the inverse of "rotate by $\alpha$" is "rotate by $-\alpha$", and you can check that flipping the sign of $\alpha$ in $R$ is the same as transposing it.

```python-editor collapsed
import math

pie.clear()
pie.scalar(90, out='unit')
GOLD = '#ca8a04'
vx, vy = 1.6, 1.1
v_in = pie.la_vec2d(vx, vy, out='vIn', stroke='currentColor')
beta = pie.scalar(0, out='beta')
# R v: v turned by beta
turned = pie.lift(lambda b, axis: math.cos(b) * vx - math.sin(b) * vy if axis == 'x' else math.sin(b) * vx + math.cos(b) * vy, pie.Scalar)
v_w = pie.la_vec2d(turned(beta, 'x'), turned(beta, 'y'), out='vW', stroke=GOLD)
pie.annotate_angle_mark(v_in, v_w, out='swept')
pie.text('R turns v by α; Rᵀ turns it back by −α. The composition returns every vector to itself, so RᵀR = I.', 0, 2.9, 12, 5, -1, out='sBox')
```

Start with a vector $v$. Apply $R$, a rotation by $\alpha$: $v$ swings to $Rv$ in gold, and the mark shows the angle it turned through.

```python-editor collapsed
pie.translate_scalar_to(beta, 1.1, animate=True)
```

Now apply the transpose $R^T$, a rotation by $-\alpha$: the gold arrow swings straight back onto $v$ and the swept angle closes to zero. Undoing $R$ with $R^T$ recovers the original vector, which is exactly what $R^T R = I$ means.

```python-editor collapsed
pie.translate_scalar_to(beta, 0, animate=True)
```

Because $R R^T = I$ as well, the exact same reasoning about columns applies to the **rows**:

> Just like the columns, the rows of a rotation matrix are mutually perpendicular unit vectors.

In the next chapter we will study **normal vectors**, meaning vectors perpendicular to a given surface or line, where this perpendicularity machinery and the dot product come together again.

---

[← 11. Matrix transpose](/la/11_matrix_transpose)  ·  [13. Normal vectors →](/la/13_normal_vectors)
