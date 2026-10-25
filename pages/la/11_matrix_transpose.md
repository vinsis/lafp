---
title: 11. Matrix transpose
canvas: left
---

# 11. Matrix transpose

<details>
<summary>Review</summary>

The dot product $\langle p, q \rangle = \underbrace{\sum_i p_i q_i}_{\text{algebraic form}} = \underbrace{\lVert p \rVert \lVert q \rVert \cos\theta}_{\text{geometric form}}$ takes two vectors and returns a single number. It is zero exactly when the vectors are perpendicular, and it lurks inside every matrix-vector multiplication: each entry of $Mv$ is the dot product of a **row** of $M$ with $v$.

</details>

Transpose of a matrix $M$ is another matrix, denoted by $M'$ or $M^T$, such that the rows of $M^T$ are the columns of $M$:

$$M = \begin{bmatrix} \textcolor{#1d4ed8}{p_1} & \textcolor{#be185d}{q_1} \\ \textcolor{#1d4ed8}{p_2} & \textcolor{#be185d}{q_2} \\ \textcolor{#1d4ed8}{p_3} & \textcolor{#be185d}{q_3} \end{bmatrix}, \qquad M^T = \begin{bmatrix} \textcolor{#1d4ed8}{p_1} & \textcolor{#1d4ed8}{p_2} & \textcolor{#1d4ed8}{p_3} \\ \textcolor{#be185d}{q_1} & \textcolor{#be185d}{q_2} & \textcolor{#be185d}{q_3} \end{bmatrix}$$

Note that a vector can also be seen as a matrix with only one column. Thus we can define the transpose for a vector as well:

$$v = \begin{bmatrix} v_1 \\ v_2 \\ v_3 \end{bmatrix}, \qquad v^T = \begin{bmatrix} v_1 & v_2 & v_3 \end{bmatrix}$$

---

## 11.1 Matrix: array of columns or rows?
When you see a matrix, there are two ways you can look at it: an array of columns and an array of rows. So far we have been treating it as an array of columns only.

$$M = \begin{bmatrix} \textcolor{#1d4ed8}{p_1} & \textcolor{#be185d}{q_1} \\ \textcolor{#1d4ed8}{p_2} & \textcolor{#be185d}{q_2} \\ \textcolor{#1d4ed8}{p_3} & \textcolor{#be185d}{q_3} \end{bmatrix} = \begin{bmatrix} \vert & \vert \\ \textcolor{#1d4ed8}{c_1} & \textcolor{#be185d}{c_2} \\ \vert & \vert \end{bmatrix} \quad \text{or} \quad \begin{bmatrix} \text{—} & \textcolor{#1d4ed8}{r_1} & \text{—} \\ \text{—} & \textcolor{#be185d}{r_2} & \text{—} \\ \text{—} & \textcolor{#047857}{r_3} & \text{—} \end{bmatrix}$$

### 11.1.1 Matrix-vector multiplication from the POV of columns
Each of these perspectives provides a way to interpret matrix-vector multiplication. From the first perspective, you can imagine the columns of a matrix being scaled and added up:

$$\begin{aligned}
\begin{bmatrix} \textcolor{#1d4ed8}{p_1} & \textcolor{#be185d}{q_1} \\ \textcolor{#1d4ed8}{p_2} & \textcolor{#be185d}{q_2} \\ \textcolor{#1d4ed8}{p_3} & \textcolor{#be185d}{q_3} \end{bmatrix} \begin{bmatrix} \textcolor{#1d4ed8}{w_1} \\ \textcolor{#be185d}{w_2} \end{bmatrix}
&= \underbrace{\textcolor{#1d4ed8}{w_1} \begin{bmatrix} \textcolor{#1d4ed8}{p_1} \\ \textcolor{#1d4ed8}{p_2} \\ \textcolor{#1d4ed8}{p_3} \end{bmatrix} + \textcolor{#be185d}{w_2} \begin{bmatrix} \textcolor{#be185d}{q_1} \\ \textcolor{#be185d}{q_2} \\ \textcolor{#be185d}{q_3} \end{bmatrix}}_{\text{scale each column, then add}} \\
&= \begin{bmatrix} \textcolor{#1d4ed8}{w_1 p_1} + \textcolor{#be185d}{w_2 q_1} \\ \textcolor{#1d4ed8}{w_1 p_2} + \textcolor{#be185d}{w_2 q_2} \\ \textcolor{#1d4ed8}{w_1 p_3} + \textcolor{#be185d}{w_2 q_3} \end{bmatrix}
\end{aligned}$$

### 11.1.2 Matrix-vector multiplication from the POV of rows
From the second perspective, you can think of the rows of the matrix being fed to the dot product function along with the input vector:

$$\begin{bmatrix} \textcolor{#1d4ed8}{p_1} & \textcolor{#1d4ed8}{q_1} \\ \textcolor{#be185d}{p_2} & \textcolor{#be185d}{q_2} \\ \textcolor{#047857}{p_3} & \textcolor{#047857}{q_3} \end{bmatrix} \begin{bmatrix} w_1 \\ w_2 \end{bmatrix} = \begin{bmatrix} \textcolor{#1d4ed8}{\langle (p_1, q_1), (w_1, w_2) \rangle} \\ \textcolor{#be185d}{\langle (p_2, q_2), (w_1, w_2) \rangle} \\ \textcolor{#047857}{\langle (p_3, q_3), (w_1, w_2) \rangle} \end{bmatrix}$$

Note that the same matrix is colored by **columns** in the first equation and by **rows** in the second, the colors are there to visualize the two perspectives.

---

## 11.2 We have always been taking weighted sums of rows
Consider the matrix-matrix multiplication $v^T M$ where $v = \begin{bmatrix} v_1 & v_2 & v_3 \end{bmatrix}^T$ and $M$ is a `3-by-3` matrix. The first matrix is `1-by-3` and the second matrix is `3-by-3`.

- The first way is to view it as three dot products with the **columns** of `M`:

$$\begin{bmatrix} v_1 & v_2 & v_3 \end{bmatrix} \begin{bmatrix} \vert & \vert & \vert \\ \textcolor{#1d4ed8}{c_1} & \textcolor{#be185d}{c_2} & \textcolor{#047857}{c_3} \\ \vert & \vert & \vert \end{bmatrix} = \begin{bmatrix} \textcolor{#1d4ed8}{\langle v, c_1 \rangle} & \textcolor{#be185d}{\langle v, c_2 \rangle} & \textcolor{#047857}{\langle v, c_3 \rangle} \end{bmatrix}$$

- But note that the result is the same as the weighted sum of the **rows** of `M`, where the weights come from the vector `v`:

$$\begin{bmatrix} \textcolor{#1d4ed8}{v_1} & \textcolor{#be185d}{v_2} & \textcolor{#047857}{v_3} \end{bmatrix} \begin{bmatrix} \text{—} & \textcolor{#1d4ed8}{r_1} & \text{—} \\ \text{—} & \textcolor{#be185d}{r_2} & \text{—} \\ \text{—} & \textcolor{#047857}{r_3} & \text{—} \end{bmatrix} = \underbrace{\textcolor{#1d4ed8}{v_1 r_1} + \textcolor{#be185d}{v_2 r_2} + \textcolor{#047857}{v_3 r_3}}_{\text{weighted sum of rows}}$$

We started out with taking weighted sums of only the columns of a matrix. The property of weighted sums of the rows of a matrix emerges simply out of weighted sums of columns.

---

## 11.3 A useful property
This duality between a sum of weighted columns and a sum of weighted rows can be expressed in a very elegant identity:

$$(Ax)^T = x^T A^T$$

- On the left hand side, we take a weighted sum of columns and then convert the resulting column into a row.
- On the right hand side, we convert the columns into rows first and then take a weighted sum of those rows.

It is obvious that both lead to the same result. We can also extend this identity to matrix-matrix multiplication (since a matrix-matrix multiplication is just _many_ matrix-vector multiplications):

$$(AB)^T = B^T A^T$$

---

## 11.4 Three ways to interpret matrix-matrix multiplication
It is useful to be able to switch between these three points of view when looking at a matrix-matrix multiplication $AB$. Let the row vectors of $A$ be $a_1, a_2, \ldots, a_m$ and let the column vectors of $B$ be $b_1, b_2, \ldots, b_p$.

1. Product `AB` = a matrix of weighted sums of **columns of A**:

$$A \begin{bmatrix} \vert & \vert & & \vert \\ b_1 & b_2 & \cdots & b_p \\ \vert & \vert & & \vert \end{bmatrix} = \begin{bmatrix} \vert & \vert & & \vert \\ Ab_1 & Ab_2 & \cdots & Ab_p \\ \vert & \vert & & \vert \end{bmatrix}$$

2. Product `AB` = a matrix of weighted sums of **rows of B**:

$$\begin{bmatrix} \text{—} & a_1 & \text{—} \\ \text{—} & a_2 & \text{—} \\ & \vdots & \\ \text{—} & a_m & \text{—} \end{bmatrix} B = \begin{bmatrix} \text{—} & a_1 B & \text{—} \\ \text{—} & a_2 B & \text{—} \\ & \vdots & \\ \text{—} & a_m B & \text{—} \end{bmatrix}$$

3. Product `AB` = a matrix of **dot products** of rows of `A` with columns of `B`:

$$\begin{bmatrix} \text{—} & a_1 & \text{—} \\ \text{—} & a_2 & \text{—} \\ & \vdots & \\ \text{—} & a_m & \text{—} \end{bmatrix} \begin{bmatrix} \vert & \vert & & \vert \\ b_1 & b_2 & \cdots & b_p \\ \vert & \vert & & \vert \end{bmatrix} = \begin{bmatrix} \langle a_1, b_1 \rangle & \langle a_1, b_2 \rangle & \cdots & \langle a_1, b_p \rangle \\ \langle a_2, b_1 \rangle & \langle a_2, b_2 \rangle & \cdots & \langle a_2, b_p \rangle \\ \vdots & \vdots & \ddots & \vdots \\ \langle a_m, b_1 \rangle & \langle a_m, b_2 \rangle & \cdots & \langle a_m, b_p \rangle \end{bmatrix}$$

---

## 11.5 Visualizing the column space and row space
Let's visualize some transformations by a `2-by-2` matrix `M` again. This time, we want to focus on what the **rows** of `M` tell us about the transformation.

### 11.5.1 Making a case for visualizing the transformation of a circle
If we want to see how a vector $v$ is transformed by a matrix, it is sufficient to see how the unit vector $v_{unit}$ is transformed. This is because we can simply scale the output of $v_{unit}$ by the norm of $v$:

$$\begin{aligned}
Mv &= M(\underbrace{\lVert v \rVert v_{unit}}_{\text{scale first}}) \\
&= \underbrace{\lVert v \rVert}_{\text{pull the scale out}} M v_{unit}
\end{aligned}$$

Next, to fully understand the transformation by a matrix, we don't want just one unit vector. We would ideally like to view how _all_ the unit vectors are transformed. But the unit vectors are exactly the points on a **unit circle**. Thus, by understanding how the points on a circle are transformed by a matrix, we get a good idea of what that matrix is doing.

```python-editor collapsed
import math

pie.clear()
pie.scalar(110, out='unit')
GRAY, BLUE, PINK, TEAL = '#71717a', '#1d4ed8', '#be185d', '#0d9488'
p0 = pie.point(0, 0, out='p0', hidden=True)
circ = pie.circle(p0, 1, out='circ', stroke=GRAY)
```

We are given the matrix

$$M = \begin{bmatrix} \textcolor{#1d4ed8}{1.2} & \textcolor{#1d4ed8}{0.8} \\ \textcolor{#be185d}{0.8} & \textcolor{#be185d}{1.2} \end{bmatrix}$$

whose first row is colored $\textcolor{#1d4ed8}{\text{blue}}$ and second row $\textcolor{#be185d}{\text{pink}}$.

```python-editor collapsed
# M's rows are s1·(1.2, 0.8) and s2·(0.8, 1.2)
s1 = pie.scalar(1, out='s1')
s2 = pie.scalar(1, out='s2')
times = pie.lift(lambda s, v: s * v, pie.Scalar)
a, b, c, d = times(s1, 1.2), times(s1, 0.8), times(s2, 0.8), times(s2, 1.2)
m = [[a, b], [c, d]]
pie.la_array_to_texts(m, 1.2, -2, 0.8, 0.4, 15, out='mviz')
ellipse = pie.la_mat_to_ellipse(m, p0, out='ellipse', stroke=GRAY)
fan = pie.la_circle_transform2(m, 36, out='fan')
```

The matrix maps every point on the circle to a point on an ellipse - each colored segment joins an input point to its output point.

This is nothing new. What's interesting here is the relationship between the shape of the ellipse and the row vectors. 

- Let's draw the first row vector

```python-editor collapsed
pie.hide(fan)
rvec1 = pie.la_vec2d(a, b, out='rvec1', stroke=BLUE)
tb1 = pie.text('First row vector: 1.2 0.8', 2.25, 0.8, 12, out='tb1', stroke=BLUE)
```

- and the second row vector of `M` as arrows.

```python-editor collapsed
rvec2 = pie.la_vec2d(c, d, out='rvec2', stroke=PINK)
tb2 = pie.text('Second row vector: 0.8 1.2', 1, 1.6, 12, out='tb2', stroke=PINK)
```

Now pick an input vector on the circle and its output vector. 

```python-editor collapsed
deg = pie.scalar(60, out='deg')
ix = pie.lift(lambda deg: math.cos(math.radians(deg)), pie.Scalar)(deg)
iy = pie.lift(lambda deg: math.sin(math.radians(deg)), pie.Scalar)(deg)
# Each output coordinate is a row of M dotted with the input
row_dot = pie.lift(lambda p, q, x, y: p * x + q * y, pie.Scalar)
ox, oy = row_dot(a, b, ix, iy), row_dot(c, d, ix, iy)
pie.la_vec2d(ix, iy, out='vin')
pie.la_vec2d(ox, oy, out='vout')
pie.text('v', times(ix, 1.55), times(iy, 1.55), 14, out='lbl_vin', stroke=TEAL)
pie.text('Mv', times(ox, 1.15), times(oy, 1.15), 14, out='lbl_vout', stroke=TEAL)
```

---

## 11.6 Exploring connection between row vectors and output vector

Note that each output coordinate is a dot product with a row of `M`:

$$
\begin{aligned}
M v_{unit} &= \begin{bmatrix} \textcolor{#1d4ed8}{\langle \text{row 1}, \; v_{unit} \rangle} \\ \textcolor{#be185d}{\langle \text{row 2}, \; v_{unit} \rangle} \end{bmatrix} \\
&= \begin{bmatrix} \textcolor{#1d4ed8}{\text{signed projection of row 1 on } v_{unit}} \\ \textcolor{#be185d}{\text{signed projection of row 2 on } v_{unit}} \end{bmatrix}
\end{aligned}
$$

To visualize this, let's reduce the clutter. 

```python-editor collapsed
for node in [circ, ellipse, rvec2, tb2]:
    pie.hide(node)
```

### 11.6.1 First row-vector

We want to show that the (signed) projection of the first row vector on the input vector is equal to the x-coordinate of the output vector.

- Project the first row vector on the input vector.

```python-editor collapsed
# The projection of row 1 on v is ⟨row 1, v⟩·v, and ⟨row 1, v⟩ is the output's x
pie.la_vec2d(times(ox, ix), times(ox, iy), out='proj1', stroke=BLUE)
pie.line(pie.point(a, b, out='row1_tip', hidden=True), pie.point(times(ox, ix), times(ox, iy), out='proj1_tip', hidden=True), out='line1', stroke=GRAY)
```

- Calculate the length of this projection and draw a point on the x-axis at the same distance. Note that this distance is signed.

```python-editor collapsed
pie.circle(p0, pie.lift(abs, pie.Scalar)(ox), out='circ0', stroke=GRAY)
proj_point = pie.point(ox, 0, out='projPoint')
```

- This is exactly the x-coordinate of the output vector.

```python-editor collapsed
pie.line(pie.point(ox, oy, out='vout_tip', hidden=True), proj_point, out='line2', stroke=GRAY)
pie.annotate_dim_line(p0, proj_point, 'x', out='dim0')
```

You can try rotating the input vector and see this setup changes according. 

```python-editor collapsed
pie.translate_scalar_to(deg, 240, animate=True)
```

To reiterate, the signed projection of the first row vector is equal to the x-coordinate of the output vector. 

---

### 11.6.2 Second row-vector

We can show the same thing for the second row vector.

```python-editor collapsed
import math

pie.clear()
pie.scalar(110, out='unit')
GRAY, BLUE, PINK, TEAL = '#71717a', '#1d4ed8', '#be185d', '#0d9488'
p0 = pie.point(0, 0, out='p0', hidden=True)
# M's rows are s1·(1.2, 0.8) and s2·(0.8, 1.2)
s1 = pie.scalar(1, out='s1')
s2 = pie.scalar(1, out='s2')
times = pie.lift(lambda s, v: s * v, pie.Scalar)
a, b, c, d = times(s1, 1.2), times(s1, 0.8), times(s2, 0.8), times(s2, 1.2)
m = [[a, b], [c, d]]
pie.la_array_to_texts(m, 1.2, -2, 0.8, 0.4, 15, out='mviz')
pie.la_vec2d(c, d, out='rvec2', stroke=PINK)
pie.text('Second row vector: 0.8 1.2', 1, 1.6, 12, out='tb2', stroke=PINK)
deg = pie.scalar(60, out='deg')
ix = pie.lift(lambda deg: math.cos(math.radians(deg)), pie.Scalar)(deg)
iy = pie.lift(lambda deg: math.sin(math.radians(deg)), pie.Scalar)(deg)
# Each output coordinate is a row of M dotted with the input
row_dot = pie.lift(lambda p, q, x, y: p * x + q * y, pie.Scalar)
ox, oy = row_dot(a, b, ix, iy), row_dot(c, d, ix, iy)
pie.la_vec2d(ix, iy, out='vin')
pie.la_vec2d(ox, oy, out='vout')
pie.text('v', times(ix, 1.55), times(iy, 1.55), 14, out='lbl_vin', stroke=TEAL)
pie.text('Mv', times(ox, 1.15), times(oy, 1.15), 14, out='lbl_vout', stroke=TEAL)
```

- Project the second row vector on the input vector.

```python-editor collapsed
# The projection of row 2 on v is ⟨row 2, v⟩·v, and ⟨row 2, v⟩ is the output's y
pie.la_vec2d(times(oy, ix), times(oy, iy), out='proj2', stroke=PINK)
pie.line(pie.point(c, d, out='row2_tip', hidden=True), pie.point(times(oy, ix), times(oy, iy), out='proj2_tip', hidden=True), out='line3', stroke=GRAY)
```

- Calculate the length of this projection and draw a point on the y-axis at the same distance. Note that this distance is signed.

```python-editor collapsed
pie.circle(p0, pie.lift(abs, pie.Scalar)(oy), out='circ1', stroke=GRAY)
proj_point_y = pie.point(0, oy, out='projPointY')
```

- This is exactly the y-coordinate of the output vector.

```python-editor collapsed
pie.line(pie.point(ox, oy, out='vout_tip', hidden=True), proj_point_y, out='line4', stroke=GRAY)
pie.annotate_dim_line(p0, proj_point_y, 'y', out='dim1')
```

You can try rotating the input vector and see this setup changes accordingly. 

```python-editor collapsed
pie.translate_scalar_to(deg, 240, animate=True)
```

To reiterate, the signed projection of the second row vector is equal to the y-coordinate of the output vector. 

---

### 11.6.3 Row vector and ellipse bounds

```python-editor collapsed
import math

pie.clear()
pie.scalar(110, out='unit')
GRAY, BLUE, PINK, TEAL = '#71717a', '#1d4ed8', '#be185d', '#0d9488'
p0 = pie.point(0, 0, out='p0', hidden=True)
pie.circle(p0, 1, out='circ', stroke=GRAY)
# M's rows are s1·(1.2, 0.8) and s2·(0.8, 1.2)
s1 = pie.scalar(1, out='s1')
s2 = pie.scalar(1, out='s2')
times = pie.lift(lambda s, v: s * v, pie.Scalar)
a, b, c, d = times(s1, 1.2), times(s1, 0.8), times(s2, 0.8), times(s2, 1.2)
m = [[a, b], [c, d]]
pie.la_array_to_texts(m, 1.2, -2, 0.8, 0.4, 15, out='mviz')
pie.la_mat_to_ellipse(m, p0, out='ellipse', stroke=GRAY)
pie.text('output ellipse', -1.6, -1.9, 12, out='lbl_elp', stroke=GRAY)
pie.la_vec2d(a, b, out='rvec1', stroke=BLUE)
pie.la_vec2d(c, d, out='rvec2', stroke=PINK)
deg = pie.scalar(60, out='deg')
ix = pie.lift(lambda deg: math.cos(math.radians(deg)), pie.Scalar)(deg)
iy = pie.lift(lambda deg: math.sin(math.radians(deg)), pie.Scalar)(deg)
# Each output coordinate is a row of M dotted with the input
row_dot = pie.lift(lambda p, q, x, y: p * x + q * y, pie.Scalar)
ox, oy = row_dot(a, b, ix, iy), row_dot(c, d, ix, iy)
pie.la_vec2d(ix, iy, out='vin')
pie.la_vec2d(ox, oy, out='vout')
pie.text('v', times(ix, 1.55), times(iy, 1.55), 14, out='lbl_vin', stroke=TEAL)
pie.text('Mv', times(ox, 1.15), times(oy, 1.15), 14, out='lbl_vout', stroke=TEAL)
```

Let's look at the matrix multiplication again:
$$
\begin{aligned}
M v_{unit} &= \begin{bmatrix} \textcolor{#1d4ed8}{\langle \text{row 1}, \; v_{unit} \rangle} \\ \textcolor{#be185d}{\langle \text{row 2}, \; v_{unit} \rangle} \end{bmatrix} \\
&= \begin{bmatrix} \underbrace{\textcolor{#1d4ed8}{\text{signed projection of row 1 on } v_{unit}}}_{\textcolor{#1d4ed8}{\text{when is it maximized?}}} \\[1.5em] \underbrace{\textcolor{#be185d}{\text{signed projection of row 2 on } v_{unit}}}_{\textcolor{#be185d}{\text{when is it maximized?}}} \end{bmatrix}
\end{aligned}
$$

One can ask - what are the largest (or smallest) x- and y- coordinate values for the output vector? Since these values are the dot products of the row vectors with the input vector, **coordinate $i$ is maximized when the input vector aligns with the row vector $i$**.

One can indeed see this by aligning the input vector with the first row vector. Note how the output vector has the largest x-coordinate on the entire ellipse. 

```python-editor collapsed
pie.translate_scalar_to(deg, math.degrees(math.atan2(0.8, 1.2)), animate=True)
```

Similarly, by aligning the input vector with the second row vector, one gets the output vector whose y-coordinate is the largest on the entire ellipse. 

```python-editor collapsed
pie.translate_scalar_to(deg, math.degrees(math.atan2(1.2, 0.8)), animate=True)
```

#### What about the smallest x and y coordinates?
The same reasoning can be applied to get the smallest coordinates of the output vectors. This happens when the dot product is minimized - which happens when the two vectors point in exactly opposite directions.

This entire reasoning is applicable to matrix multiplication of any dimension, not just two.

In other words, 

> the output ellipse is bounded by a rectangle whose x-coordinates are `± norm of the first row` and whose y-coordinates are `± norm of the second row`. 

```python-editor collapsed
# The rectangle spans ±‖row 1‖ horizontally and ±‖row 2‖ vertically
norm = pie.lift(lambda p, q: math.hypot(p, q), pie.Scalar)
n1, n2 = norm(a, b), norm(c, d)
corner = pie.point(times(n1, -1), times(n2, -1), out='rect_corner', hidden=True)
pie.rectangle(corner, times(n1, 2), times(n2, 2), out='rect', stroke=GRAY)
pie.text("Bounding box half-widths equal the norms of M's rows.", 2, 2, 13, 1.7, -1, out='note3')
```

This is because the projection of a row on $v_{unit}$ can never exceed the row's own length.

To confirm, let's change the rows and watch the rectangle follow:

- Scale the first row up: the ellipse and its bounding rectangle stretch **horizontally** only.

```python-editor collapsed
pie.translate_scalar_to(s1, 1.7, animate=True)
```

- Bring it back.

```python-editor collapsed
pie.translate_scalar_to(s1, 1, animate=True)
```

- Scale the second row down: the ellipse flattens **vertically**.

```python-editor collapsed
pie.translate_scalar_to(s2, 0.6, animate=True)
```

- Restore it.

```python-editor collapsed
pie.translate_scalar_to(s2, 1, animate=True)
```

> So the **columns** of a matrix tell us where the basis vectors land, but the **rows** tell us how the output coordinates are extracted.

In the next chapter we will study **rotations**, the matrices whose rows and columns are unit vectors perpendicular to each other, for which the transpose plays an especially beautiful role.

---

[← 10. Dot product](/la/10_dot_product)  ·  [12. Rotations →](/la/12_rotations)
