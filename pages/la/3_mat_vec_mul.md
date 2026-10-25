---
title: A matrix as a function on vectors
description: See a matrix as a function that maps vectors to vectors, turning lines into lines and circles into ellipses, with interactive visuals.
canvas: left
---

# 3. Matrix as a function

<details>
<summary>Review</summary>

In the previous chapter we saw that a matrix-vector multiplication $y = Mx$ is nothing more than a weighted sum of the columns of the matrix $M$ - the columns are vectors, and the elements of $x$ are the weights.

</details>

We will adopt a new perspective of a matrix that offers insights which may not be obvious using the _weighted-sum-of-columns_ view.

---

## 3.1 Matrix is a function
Consider the matrix-vector product $y = Mx$. In this new perspective, you can consider a matrix $M$ as a _function_. The input of this function is the vector $x$ and the output is the vector $y$. This shift in perspective can also be expressed programmatically:

### 3.1.1 A _weighted-sum_ view of matrix-vector multiplication

```python
def matrix_vector_multiplication(matrix, x):
    y = add( scale(column, weight) for (column, weight) in zip(matrix, x) )
    return y
```

### 3.1.2 A _matrix-as-a-function_ view of matrix-vector multiplication

```python
def matrix(x):
    # you can think of matrix_columns as an internal state of this function
    y = add( scale(column, weight) for (column, weight) in zip(matrix_columns, x) )
    return y
```

### 3.1.3 Input type of this function
The function `matrix` takes as input a vector (array) `x` whose number of elements is equal to the number of columns in the matrix.

### 3.1.4 Output type of this function
The function `matrix` returns as output a vector (array) `y` whose number of elements is equal to the number of elements in each column of the matrix.

Another way of saying this is that a matrix of shape `(r,c)` where `r = number of rows` and `c = number of columns` takes as input a vector of shape `(c,1)` and returns as output a vector of shape `(r,1)`.

---

## 3.2 Expanding the perspective of matrix-as-a-function
Note that a vector is just a point in space. In our new perspective, an `r`-by-`c` matrix (a `row`-by-`column` matrix) maps the (input) point $x$ in a $c$-dimensional space to an (output) point $y$ in an $r$-dimensional space. 

> We want to study **how a matrix maps a set of points** from the input space, not just one point. 

Note that if the matrix is `2-by-2`, its input is a $2$-dimensional vector and its output is also a $2$-dimensional vector.

---

## 3.3 Some transformations done by a matrix
We will see how a matrix maps a set of points arranged in an orderly fashion. We will illustrate this using a `2-by-2` matrix, so that both the input space and the output space fit on the same 2D canvas.

### 3.3.1 Line → Line

```python-editor collapsed
pie.clear()
GRAY, GOLD = '#71717a', '#ca8a04'
a = pie.scalar(2, out='a')
b = pie.scalar(3, out='b')

# The point at x = t·a on the line x/a + y/b = 1
on_line = pie.lift(lambda a, b, t: (t * a, (1 - t) * b), pie.Point)
p = [on_line(a, b, t, out=f'p{k + 1}') for k, t in enumerate([2, 1, 0.5, 0, -1])]
pie.line(p[0], p[4], out='line_in', stroke=GRAY)
```

If the input points lie in a straight line, the output points also lie in a straight line. On the canvas we take five points on this grey line

$$\frac{x}{a} + \frac{y}{b} = 1$$

(where $a$ is the x-intercept and $b$ is the y-intercept), and feed each of them to the matrix

$$M = \begin{bmatrix} 0.5 & -0.5 \\ -0.8 & -1.0 \end{bmatrix}$$

```python-editor collapsed
m = [[0.5, -0.5], [-0.8, -1]]
m_in = pie.la_mat_from_points(p, out='m_in')
m_out = pie.la_matmul(m, m_in, out='m_out')
q_out = pie.la_mat_to_points(m_out, out='q_out')
pie.line(q_out[0], q_out[4], out='line_out', stroke=GOLD)

# Text that shows a number, rounded to two decimals
def value_text(prefix, value):
    return f'{prefix}{round(value, 2):g}'

value_label = pie.lift(value_text, pie.Text)
pie.text(value_label('x-intercept: ', a), -4, 4, 12, out='box_a')
pie.text(value_label('y-intercept: ', b), -4, 3, 12, out='box_b')
half = pie.lift(lambda v: 0.5 * v, pie.Scalar)
pie.text('Input collinear points', half(a), half(b), 12, out='box_in')
pie.text('Output points are also collinear', -1, -3, 12, out='box_out')
```

The five output points $Mx$ land on this gold line. Now modify the input line and watch the output points: no matter where the input line is, the output points continue to stay in a straight line.

- x-intercept $a$: `4` increases it, `1` decreases it, `2` resets it

```python-editor
pie.translate_scalar_to(a, 4, animate=True)
```

- y-intercept $b$: `5` increases it, `1` decreases it, `3` resets it

```python-editor
pie.translate_scalar_to(b, 5, animate=True)
```

#### Common way to explain this property
Instead of saying "a matrix maps a set of points in a straight line to another set of points in a straight line", we usually say **"a matrix maps a straight line to another straight line"**.

---

### 3.3.2 Parallel Lines → Parallel Lines: Scale equivariance

```python-editor collapsed
pie.clear()
pie.scalar(25, out='unit')
GRAY, GOLD = '#71717a', '#ca8a04'
s = pie.scalar(1, out='s')
dx = pie.scalar(0, out='dx')
dy = pie.scalar(0, out='dy')

# A corner (x, y) of the trapezium, scaled by s and then moved by (dx, dy)
corner = pie.lift(lambda s, dx, dy, x, y: (s * x + dx, s * y + dy), pie.Point)
a = corner(s, dx, dy, -2, 3, out='a', hidden=True)
b = corner(s, dx, dy, 3, 3, out='b', hidden=True)
c = corner(s, dx, dy, 5, -4, out='c', hidden=True)
d = corner(s, dx, dy, -4, -4, out='d', hidden=True)
pie.polyline([a, b, c, d, a], out='trap_in', stroke=GRAY)
```

Two (or more) parallel lines remain parallel even after being _transformed_ by a matrix. Changing the scale of an input point (and by extension a set of points like a line, a curve etc) also changes the scale of the output point by the same value. This is obvious algebraically: 

$$\underbrace{M(\underbrace{cx}_{\text{\textcolor{#be185d}{scale}}})}_{\text{\textcolor{#1d4ed8}{then transform}}} = \underbrace{c(\underbrace{Mx}_{\text{\textcolor{#1d4ed8}{transform}}})}_{\text{\textcolor{#be185d}{then scale}}}$$ 

where $c$ is a constant, $x$ is the input vector and $M$ is a matrix.

How the scale varies in the input space is the same as (or equal to) how the scale varies in the output space. We call this property `scale equivariance`.

This begs a few questions:
- Is the matrix transformation translation equivariant? In other words, does translating the input point by a certain value also translate the output point by the same value?
- What about rotation? Does rotating the input point by a certain angle also rotate the output point by the same angle?
- If two parallel lines remain parallel, does it mean the angle between two non-parallel lines also remains the same before and after a matrix transformation (for _any_ matrix)?

We can get the answers to these questions (all the answers are `no` by the way) and also visualize how parallel lines remain parallel by looking at how this grey trapezium is transformed.

```python-editor collapsed
m = [[0.8, -0.3], [-0.8, -0.6]]
m_in = pie.la_mat_from_points([a, b, c, d], out='m_in')
m_out = pie.la_matmul(m, m_in, out='m_out')
q = pie.la_mat_to_points(m_out, out='q_out')
pie.polyline([q[0], q[1], q[2], q[3], q[0]], out='trap_out', stroke=GOLD)
pie.text('Illustration showing the behavior of output in response to the input being translated for a fixed transform', 0, -8, 12, 8, -1, out='box_cap')
```

It is _transformed_ into this gold shape by the matrix

$$M = \begin{bmatrix} 0.8 & -0.3 \\ -0.8 & -0.6 \end{bmatrix}$$

Note how the parallel sides of the trapezium remain parallel in the output, for any scale and any translation of the input:

- scale the trapezium: `0.5` zooms out, `1.5` zooms in, `1` resets

```python-editor
pie.translate_scalar_to(s, 0.5, animate=True)
```

- translate it horizontally: `-4` moves it left, `4` moves it right, `0` resets

```python-editor
pie.translate_scalar_to(dx, -4, animate=True)
```

- translate it vertically: `-4` moves it down, `4` moves it up, `0` resets

```python-editor
pie.translate_scalar_to(dy, -4, animate=True)
```

Note that translating the input does not change the _shape_ of the output - it simply translates the output points too, but in a direction that is different from the direction of translation in the input space 

#### Question
Can you figure out what the directions of the translation of the output are when the input translates along x and y axes?

---

### 3.3.3 Circle → Ellipse

```python-editor collapsed
import numpy as np

pie.clear()
pie.scalar(150, out='unit')
GRAY = '#71717a'
p0 = pie.point(0, 0, out='p0', hidden=True)
r = pie.scalar(1, out='r')
pie.circle(p0, r, out='c_in', stroke=GRAY)

# n points evenly spaced on the circle of radius r
def circle_points(r, n):
    t = np.linspace(0, 2 * np.pi, n, endpoint=False)
    return np.stack([r * np.cos(t), r * np.sin(t)], axis=1)

pts_in = pie.lift(circle_points, pie.Array[pie.Point])(r, 30, out='pts_in')
```

If the input points lie on a circle, the output points lie on an ellipse. On the canvas, points on this grey circle are fed to the matrix

$$M = \begin{bmatrix} \textcolor{#1d4ed8}{m_{11}} & \textcolor{#be185d}{m_{12}} \\ \textcolor{#1d4ed8}{m_{21}} & \textcolor{#be185d}{m_{22}} \end{bmatrix} = \begin{bmatrix} \textcolor{#1d4ed8}{0.8} & \textcolor{#be185d}{-0.3} \\ \textcolor{#1d4ed8}{-0.8} & \textcolor{#be185d}{-0.6} \end{bmatrix}$$

```python-editor collapsed
m11 = pie.scalar(0.8, out='m11')
m12 = pie.scalar(-0.3, out='m12')
m21 = pie.scalar(-0.8, out='m21')
m22 = pie.scalar(-0.6, out='m22')
m = [[m11, m12], [m21, m22]]
m_in = pie.la_mat_from_points(pts_in, out='m_in')
m_out = pie.la_matmul(m, m_in, out='m_out')
q_out = pie.la_mat_to_points(m_out, out='q_out')
pie.line(p0, q_out, out='spokes')
pie.la_array_to_texts(m, -2, -1, 0.6, 0.4, out='mviz')
pie.la_mat_to_ellipse(m, p0, out='ellipse')
pie.text('input circle', 0, pie.lift(lambda r: r + 0.2, pie.Scalar)(r), 12, out='box_circle', stroke=GRAY)
pie.text('A matrix maps a circle to an ellipse', 1, -1.7, 12, out='box_ellipse')
```

and the output points trace out an ellipse.

The _shape_ of the ellipse depends only on the matrix, not on the radius of the circle. The radius of the circle only determines the _size_ of the ellipse. See for yourself:

- change the radius (the ellipse only changes its size, never its shape): `2` grows it, `0.4` shrinks it, `1` resets it

```python-editor
pie.translate_scalar_to(r, 2, animate=True)
```

- change the matrix (now the shape of the ellipse changes): tweak $\textcolor{#1d4ed8}{m_{11}}$ and $\textcolor{#be185d}{m_{12}}$; `0.8` and `-0.3` reset the matrix

```python-editor
pie.translate_scalar_to(m11, 0.2, animate=True)
pie.translate_scalar_to(m12, 0.9, animate=True)
```

We can describe this as — _"a matrix maps a circle to an ellipse"_. We will explore this property in detail later on.

---

### 3.3.4 Generalizing `Point → Point` to `Curve → Curve` and `Space → Space`
You may have noticed a pattern here - we began with saying that a matrix maps an input point to an output point. But soon we began to say that a matrix maps a curve (line, circle etc) to another curve. The matrix is still mapping points on that curve to points on another curve. But **we have _abstracted_ our view into thinking how a curve is mapped to another curve by a matrix**. We can generalize this to any area in a 2D plane or a volume in a 3D space (or a higher dimensional space) - we want to see how this area or volume is _transformed_ by a matrix, which provides some beautiful insights. Let us see some examples:

---

### 3.3.5 Convex Shape → Convex Shape

```python-editor collapsed
pie.clear()
pie.scalar(30, out='unit')
GRAY, GOLD = '#71717a', '#ca8a04'
a = pie.point(2, 0, out='a')
b = pie.point(4, 2, out='b')
c = pie.point(0, 6, out='c')
d = pie.point(-4, 2, out='d')
e = pie.point(-3, 0, out='e')
pie.polyline([a, b, c, d, e, a], out='poly_in', stroke=GRAY)
m11 = pie.scalar(0.8, out='m11')
m12 = pie.scalar(-0.3, out='m12')
m21 = pie.scalar(-0.5, out='m21')
m22 = pie.scalar(0.9, out='m22')
```

Any convex shape remains convex even after a matrix transformation.

A (non-rigorous?) definition of `convex shape`: a shape is convex if for any two points inside the shape, the entire line connecting those two points is also inside the shape.

On the canvas, this grey convex pentagon is transformed by the matrix

$$M = \begin{bmatrix} 0.8 & -0.3 \\ -0.5 & 0.9 \end{bmatrix}$$

```python-editor collapsed
pie.text('A matrix maps a convex set to another convex step', 6, 6, 14, 4, -1, out='box_title')
m = [[m11, m12], [m21, m22]]
m_in = pie.la_mat_from_points([a, b, c, d, e], out='m_in')
m_out = pie.la_matmul(m, m_in, out='m_out')
q = pie.la_mat_to_points(m_out, out='q_out')
pie.polyline([q[0], q[1], q[2], q[3], q[4], q[0]], out='poly_out', stroke=GOLD)
pie.la_array_to_texts(m, -7, 5, 2, 1, out='mviz')
pie.text('input (grey pentagon)', -8, 8, 12, out='box_poly_in', stroke=GRAY)
pie.text('output (gold pentagon)', -8, 7, 12, out='box_poly_out', stroke=GOLD)
```

into this gold polygon — which is also convex!

Try it out:
- **move a vertex** of the grey pentagon (as long as you keep the input convex, the output stays convex). This moves `c` up by 2; `-2` moves it back:

```python-editor
pie.translate_point_by(c, 0, 2, animate=True)
```

- change the matrix: tweak $m_{11}$ and $m_{21}$; `0.8` and `-0.5` reset the matrix

```python-editor
pie.translate_scalar_to(m11, -0.4, animate=True)
pie.translate_scalar_to(m21, 0.6, animate=True)
```

---

### 3.3.6 Mapping the entire input space!

```python-editor collapsed
pie.clear()
pie.scalar(30, out='unit')
GREEN, PINK, GRID = '#047857', '#be185d', '#a1a1aa'
# A label sits a little past the tip of its column
past_tip = pie.lift(lambda v: 1.2 * v, pie.Scalar)
m11 = pie.scalar(1, out='m11')
m12 = pie.scalar(0, out='m12')
m21 = pie.scalar(0, out='m21')
m22 = pie.scalar(1, out='m22')
m = [[m11, m12], [m21, m22]]
pie.la_grid_transform(m, out='grid', stroke=GRID)
pie.la_vec2d(m11, m21, out='e1', stroke=GREEN)
pie.la_vec2d(m12, m22, out='e2', stroke=PINK)
pie.la_array_to_texts(m, -7, -7, 2, 1, out='mviz')
pie.text('column 1', past_tip(m11), past_tip(m21), 12, out='box_e1', stroke=GREEN)
pie.text('column 2', past_tip(m12), past_tip(m22), 12, out='box_e2', stroke=PINK)
```

How does the entire 2D plane get transformed by a matrix? We can visualize this for a `2-by-2` matrix. Our input space is the standard cartesian plane with an x-axis, a y-axis and a grid of horizontal and vertical lines. The canvas shows how all these grid lines are transformed by the matrix

$$M = \begin{bmatrix} \textcolor{#047857}{m_{11}} & \textcolor{#be185d}{m_{12}} \\ \textcolor{#047857}{m_{21}} & \textcolor{#be185d}{m_{22}} \end{bmatrix}$$

which starts out as the identity matrix (so the transformed grid initially sits exactly on top of the input grid). 

Now deform the space and watch the two arrows track the columns of the matrix:

```python-editor collapsed
pie.translate_scalar_to(m11, 0.6, animate=True)
pie.translate_scalar_to(m21, 0.8, animate=True)
pie.translate_scalar_to(m12, -0.7, animate=True)
pie.translate_scalar_to(m22, 1.2, animate=True)
```

A couple of things to note here:
1. The vector $\begin{bmatrix} 1 \\ 0 \end{bmatrix}$ is mapped to the first column of the matrix — the $\textcolor{#047857}{\text{green}}$ arrow.
2. The vector $\begin{bmatrix} 0 \\ 1 \end{bmatrix}$ is mapped to the second column of the matrix — the $\textcolor{#be185d}{\text{pink}}$ arrow.

This also applies to a matrix of any shape `(m, n)`:
1. The vector $\begin{bmatrix} 1 \\ 0 \\ \vdots \\ 0 \end{bmatrix}$ is mapped to the first column of the matrix.
2. The vector $\begin{bmatrix} 0 \\ 1 \\ \vdots \\ 0 \end{bmatrix}$ is mapped to the second column of the matrix.
3. ... and so on: the vector $\begin{bmatrix} 0 \\ 0 \\ \vdots \\ 1 \end{bmatrix}$ is mapped to the $n$-th column of the matrix.

Back to the identity:

```python-editor collapsed
pie.scalar(1, out='m11')
pie.scalar(0, out='m12')
pie.scalar(0, out='m21')
pie.scalar(1, out='m22')
```

---

## 3.4 What happens if the two columns of a matrix point in the same direction?

```python-editor collapsed
pie.clear()
pie.scalar(40, out='unit')
GREEN, PINK, GRID = '#047857', '#be185d', '#a1a1aa'
# A label sits a little past the tip of its column
past_tip = pie.lift(lambda v: 1.2 * v, pie.Scalar)
m11 = pie.scalar(1, out='m11')
m12 = pie.scalar(0, out='m12')
m21 = pie.scalar(0, out='m21')
m22 = pie.scalar(1, out='m22')
m = [[m11, m12], [m21, m22]]
pie.la_grid_transform(m, out='grid', stroke=GRID)
pie.la_vec2d(m11, m21, out='e1', stroke=GREEN)
pie.la_vec2d(m12, m22, out='e2', stroke=PINK)
pie.la_array_to_texts(m, -6, -6, 1.5, 1, out='mviz')
pie.text('column 1', past_tip(m11), past_tip(m21), 12, out='box_e1', stroke=GREEN)
pie.text('column 2', past_tip(m12), past_tip(m22), 12, out='box_e2', stroke=PINK)
```

We will explore this question in detail in the next chapter. For now, let us just look at an example of a `2-by-2` matrix. The canvas again shows the transformed grid along with the two columns
- the first column $\textcolor{#047857}{\begin{bmatrix} 1 \\ 0 \end{bmatrix}}$ in green and 
- the second column $\textcolor{#be185d}{\begin{bmatrix} 0 \\ 1 \end{bmatrix}}$ in pink.

Look at what the transformed space looks like as the two columns of the matrix start pointing in similar directions. Squish the space: the green column rotates from $\textcolor{#047857}{\begin{bmatrix} 1 \\ 0 \end{bmatrix}}$ towards $\textcolor{#047857}{\begin{bmatrix} 0 \\ 1 \end{bmatrix}}$, i.e. towards the pink column, and the entire 2D grid gets _squished_ into (nearly) a single line.

```python-editor collapsed
pie.translate_scalar_to(m11, 0, animate=True)
pie.translate_scalar_to(m21, 1, animate=True)
```

Un-squish the space to get the identity matrix back.

```python-editor collapsed
pie.scalar(1, out='m11')
pie.scalar(0, out='m21')
```

In the next chapter we will study this _squishing_ in more detail.

---

[← 2. Geometry of weighted sums](/la/2_spacewalk)  ·  [4. Rank and reversibility →](/la/4_rank_and_reversibility)
