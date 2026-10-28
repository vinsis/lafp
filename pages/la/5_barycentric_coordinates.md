---
title: Barycentric coordinates and the point-in-triangle test
description: Use barycentric coordinates and a matrix inverse to check whether a point lies inside a triangle, then extend the idea to polygons.
canvas: left
sidebar: _ebook.md
---

# 5. Barycentric coordinates

<details>
<summary>Review</summary>

A `2-by-2` matrix maps a point to a point, and a matrix-vector product is a weighted sum of the columns of the matrix. If the matrix has rank 2, its action can be reversed: the inverse matrix $M^{-1}$ sends every output point back to its input point.

</details>

In this chapter we use these tools to solve a concrete geometric problem - determining whether a point is inside or outside a triangle.

---

## 5.1 How to determine if a point is inside or outside a triangle?
Given a triangle on a 2d-plane with vertices `[x1,y1]`, `[x2,y2]` and `[x3,y3]`, and given a point `[x,y]`, how can you find out whether the point is inside or outside the triangle? Before we address how to solve this problem, think about how you would approach it for a minute or two.

This problem seemingly has no connection with linear algebra but, as we will see below, can be solved elegantly with the tools of linear algebra that we have learnt so far.

### 5.1.1 Let's start with an example

```python-editor collapsed
pie.clear()
pie.scalar(60, out='unit')
GRAY, GOLD = '#71717a', '#ca8a04'
pa = pie.point(3, 0, out='pa')
pb = pie.point(2, 3, out='pb')
pc = pie.point(-4, -2, out='pc')
pie.polyline([pa, pb, pc, pa], out='tri', stroke=GRAY)
pie.point(2, 1, out='p', fill=GOLD)
```

Let's say the vertices of the triangle are `[3,0]`, `[2,3]` and `[-4,-2]`. And we want to know whether or not the gold point `[2,1]` is inside the triangle.

We will also keep implementing a function to do the same as we make progress:

```python
def is_point_in_triangle(vertices, point):
    '''
    vertices: [[x1,y1],[x2,y2],[x3,y3]]
    point: [p,q]
    '''
    ...
```

---

## 5.2 Move (or translate) the triangle and the point to a better location

```python-editor collapsed
pie.clear()
pie.scalar(50, out='unit')
GRAY, GOLD, BLUE = '#71717a', '#ca8a04', '#1d4ed8'
olds = [pie.point(3, 0, out='pa'), pie.point(2, 3, out='pb'), pie.point(-4, -2, out='pc'), pie.point(2, 1, out='p', fill=GOLD)]
pie.polyline([olds[0], olds[1], olds[2], olds[0]], out='tri', stroke=GRAY)
```

The canvas shows the same triangle and point again. Now consider a second copy of the problem where one of the vertices of the triangle (`[3,0]`) lies on the origin, and everything else keeps its position relative to that vertex. Shift everything so that this vertex lands on the origin:

```python-editor collapsed
news = [pie.point(0, 0, out='qa'), pie.point(-1, 3, out='qb'), pie.point(-7, -2, out='qc'), pie.point(-1, 1, out='q', fill=GOLD)]
pie.polyline([news[0], news[1], news[2], news[0]], out='tri2', stroke=BLUE)
pie.annotate_arrow(olds, news, 0.1, out='shift_arrows')
```

These two problems are actually the same problem - every vertex and the point move by the same amount `[-3,0]`, so the position of the point relative to the vertices of the triangle is unchanged.

But it is easier to find the answer of the second problem, which is also the answer of the first problem. So we will now focus on how to solve the second problem: is the point `[-1,1]` inside the triangle with vertices `[0,0]`, `[-1,3]` and `[-7,-2]`?

### 5.2.1 How to go from problem on the left to problem on the right?
This is easy: if we want to move the vertex `[x1,y1]` to the origin, we subtract `[x1,y1]` from all three vertices and the point.

```python
def is_point_in_triangle(vertices, point):
    '''
    vertices: [[x1,y1],[x2,y2],[x3,y3]]
    point: [p,q]
    '''
    x1,y1 = vertices[0]
    x2,y2 = vertices[1]
    x3,y3 = vertices[2]
    shifted_vertices = [[x1-x1,y1-y1],[x2-x1,y2-y1],[x3-x1,y3-y1]]
    shifted_point = [point[0]-x1, point[1]-y1]
```

---

## 5.3 First change in viewpoint: look at sides of the triangle as vectors

```python-editor collapsed
pie.clear()
pie.scalar(50, out='unit')
GRAY, GOLD, BLUE, PINK = '#71717a', '#ca8a04', '#1d4ed8', '#be185d'
qa = pie.point(0, 0, out='qa')
qb = pie.point(-1, 3, out='qb')
qc = pie.point(-7, -2, out='qc')
pie.polyline([qa, qb, qc, qa], out='tri', stroke=GRAY)
pie.point(-1, 1, out='q', fill=GOLD)
pie.la_vec2d(-1, 3, out='vab', stroke=BLUE)
pie.la_vec2d(-7, -2, out='vac', stroke=PINK)
pie.text('A (0,0)', 0.4, -0.4, 12, out='box_a')
pie.text('B (-1,3)', -0.8, 3.5, 12, out='box_b')
pie.text('C (-7,-2)', -6, -2.6, 12, out='box_c')
pie.text('P (-1,1)', -0.6, 1.3, 12, out='box_p')
```

Let's name the vertices and the point first: `A = [0,0]`, `B = [-1,3]`, `C = [-7,-2]` and `P = [-1,1]`.

We want to look at the sides of the triangle `AB`, `AC` and the point `P` as vectors. The side `AB` can be seen as the blue vector $\textcolor{#1d4ed8}{\begin{bmatrix} -1 \\ 3 \end{bmatrix}}$ in the 2-dimensional space. Similarly `AC` can be seen as the pink vector $\textcolor{#be185d}{\begin{bmatrix} -7 \\ -2 \end{bmatrix}}$. The point `P` is the vector $\begin{bmatrix} -1 \\ 1 \end{bmatrix}$.

Next we would like to get to the point `P` by taking weighted sums of the vectors `AB` and `AC`.

---

### 5.3.1 Let's walk in the 2d space by taking weighted sums of these two vectors

```python-editor collapsed
import math

pie.clear()
pie.scalar(50, out='unit')
GRAY, GOLD, BLUE, PINK, AMBER = '#71717a', '#ca8a04', '#1d4ed8', '#be185d', '#b45309'
qa = pie.point(0, 0, out='qa')
qb = pie.point(-1, 3, out='qb')
qc = pie.point(-7, -2, out='qc')
pie.polyline([qa, qb, qc, qa], out='tri', stroke=GRAY)
pie.point(-1, 1, out='q', fill=GOLD)
pie.text('P (-1,1)', -0.6, 1.3, 12, out='box_p')
w1 = pie.scalar(0.2, out='w1')
w2 = pie.scalar(0.2, out='w2')

# The walk: w1·AB, then w2·AC from its tip. The output point is w1·AB + w2·AC.
def output(w1, w2):
    return (-1 * w1 - 7 * w2, 3 * w1 - 2 * w2)

step1 = pie.lift(lambda w1: (-1 * w1, 3 * w1), pie.Point)(w1, out='step1', hidden=True)
out_pt = pie.lift(output, pie.Point)(w1, w2, out='out_pt', hidden=True)
pie.annotate_arrow(qa, step1, out='arrow_ab', stroke=BLUE)
pie.annotate_arrow(step1, out_pt, out='arrow_ac', stroke=PINK)
pie.annotate_arrow(qa, out_pt, out='vsum', stroke=AMBER)

def readout(w1, w2, kind):
    x, y = output(w1, w2)
    if kind == 'weights':
        return f'w1 = {round(w1, 2):g}, w2 = {round(w2, 2):g}'
    if kind == 'output':
        return f'output point: ({round(x, 2):g}, {round(y, 2):g})'
    return f'distance to P: {round(math.hypot(x + 1, y - 1), 2):g}'

text = pie.lift(readout, pie.Text)
pie.text(text(w1, w2, 'weights'), 3.2, -2.6, 14, 4.4, -1, out='box_w')
pie.text(text(w1, w2, 'output'), 3.2, -3.7, 14, 4.4, -1, out='box_out')
pie.text(text(w1, w2, 'distance'), 3.2, -4.8, 14, 4.4, -1, out='box_dist')
```

Remember that this _walk_ can be represented algebraically as a matrix-vector multiplication where the matrix has the vectors `AB` and `AC` as its columns, and the vector is the weights for each column:

$$\begin{bmatrix} \textcolor{#1d4ed8}{-1} & \textcolor{#be185d}{-7} \\ \textcolor{#1d4ed8}{3} & \textcolor{#be185d}{-2} \end{bmatrix} \begin{bmatrix} \textcolor{#1d4ed8}{w_1} \\ \textcolor{#be185d}{w_2} \end{bmatrix} = \begin{bmatrix} x \\ y \end{bmatrix}$$

On the canvas, the blue arrow is $\textcolor{#1d4ed8}{w_1}$ times the vector `AB`, the pink arrow is $\textcolor{#be185d}{w_2}$ times the vector `AC` placed tip-to-tail, and the output arrow lands on the weighted sum.

We want to observe for what values of $w_1, w_2$ the output point lies inside the triangle. It is this insight that leads to the solution. Before we reveal the pattern for the weights, let's play with it a bit and get a feel for it:

- $\textcolor{#1d4ed8}{w_1}$: `0.1` increases it, `-0.1` decreases it

```python-editor
pie.translate_scalar_by(w1, 0.1, animate=True)
```

- $\textcolor{#be185d}{w_2}$: `0.1` increases it, `-0.1` decreases it

```python-editor
pie.translate_scalar_by(w2, 0.1, animate=True)
```

- reset both weights to `0.2`

```python-editor collapsed
pie.translate_scalar_to([w1, w2], [0.2, 0.2], animate=True)
```

Let's also write a function for matrix multiplication:

```python
def scale_vector(scale, vector):
    return [i*scale for i in vector]

def add_vectors(array_of_vectors):
    dimensionality = len(array_of_vectors[0])
    output = [0]*dimensionality
    for vector in array_of_vectors:
        output = [i+j for (i,j) in zip(output, vector)]
    return output

def matMul(columns_of_matrix, weights):
    scaled_columns = [scale_vector(scale, vector) 
        for (scale, vector) in zip(weights, columns_of_matrix)]
    return add_vectors(scaled_columns)
```

---

### 5.3.2 A glimpse of the solution
Here are some observations about the output point of the matrix multiplication above:

> The output point lies inside the triangle only when $w_1 \ge 0$, $w_2 \ge 0$ and $w_1 + w_2 \le 1$.

- When $w_1 = 0, w_2 = 0$, the input vector $\begin{bmatrix} 0 \\ 0 \end{bmatrix}$ gives as output the point `A` (which is at the origin).

```python-editor collapsed
pie.translate_scalar_to([w1, w2], [0, 0], animate=True)
```

- When $w_1 = 1, w_2 = 0$, the input vector $\begin{bmatrix} 1 \\ 0 \end{bmatrix}$ gives as output the point `B`.

```python-editor collapsed
pie.translate_scalar_to([w1, w2], [1, 0], animate=True)
```

- When $w_1 = 0, w_2 = 1$, the input vector $\begin{bmatrix} 0 \\ 1 \end{bmatrix}$ gives as output the point `C`.

```python-editor collapsed
pie.translate_scalar_to([w1, w2], [0, 1], animate=True)
```

Now the question is: if we want to find out whether the point $\begin{bmatrix} -1 \\ 1 \end{bmatrix}$ lies inside the triangle or not, we need to find out for which values of $w_1, w_2$ we have

$$\begin{bmatrix} -1 \\ 1 \end{bmatrix} = \begin{bmatrix} \textcolor{#1d4ed8}{-1} & \textcolor{#be185d}{-7} \\ \textcolor{#1d4ed8}{3} & \textcolor{#be185d}{-2} \end{bmatrix} \begin{bmatrix} \textcolor{#1d4ed8}{w_1} \\ \textcolor{#be185d}{w_2} \end{bmatrix}$$

---

## 5.4 The final solution
This brings us to the final solution. We know that the matrix $M = \begin{bmatrix} -1 & -7 \\ 3 & -2 \end{bmatrix}$ maps $\begin{bmatrix} w_1 \\ w_2 \end{bmatrix}$ to $\begin{bmatrix} x \\ y \end{bmatrix}$. Then the matrix that maps $\begin{bmatrix} x \\ y \end{bmatrix}$ back to $\begin{bmatrix} w_1 \\ w_2 \end{bmatrix}$ is the inverse of $M$.

We saw how to invert a `2-by-2` matrix in the last chapter. This is how a function to do so looks like:

```python
def get_inverse_of(matrix2d):
    x1,y1 = matrix2d[0]
    x2,y2 = matrix2d[1]
    scale = 1/(x1*y2 - x2*y1)
    return [[y2*scale, -y1*scale],[-x2*scale, x1*scale]]
```

Let's see what the inverse of this matrix is:

$$\begin{aligned}
M^{-1} &= \frac{1}{(-1)(-2) - (3)(-7)} \begin{bmatrix} -2 & 7 \\ -3 & -1 \end{bmatrix} \\
&= \frac{1}{23} \begin{bmatrix} -2 & 7 \\ -3 & -1 \end{bmatrix}
\end{aligned}$$

It is important to understand this part:

> Multiplying this inverse matrix $M^{-1}$ with a vector $\begin{bmatrix} x \\ y \end{bmatrix}$ gives us the weights $w_1, w_2$ for which the weighted sum of the vectors `AB` and `AC` equals $\begin{bmatrix} x \\ y \end{bmatrix}$.

Now if these weights follow these three rules, it means that the point $\begin{bmatrix} x \\ y \end{bmatrix}$ lies inside the triangle:

1. $w_1 \ge 0$
2. $w_2 \ge 0$
3. $w_1 + w_2 \le 1$

Let's write a function to check for these conditions:

```python
def weights_are_valid(w1,w2):
    return w1 >= 0 and w2 >= 0 and w1+w2 <= 1
```

Note that in this example we have

$$\begin{aligned}
M^{-1} \begin{bmatrix} -1 \\ 1 \end{bmatrix} &= \frac{1}{23} \begin{bmatrix} -2 & 7 \\ -3 & -1 \end{bmatrix} \begin{bmatrix} -1 \\ 1 \end{bmatrix} \\
&= \frac{1}{23} \begin{bmatrix} 9 \\ 2 \end{bmatrix} \\
&\approx \begin{bmatrix} 0.39 \\ 0.09 \end{bmatrix}
\end{aligned}$$

Thus $w_1 = 0.39$ and $w_2 = 0.09$. Since these values satisfy the three conditions above, the point `[-1,1]` indeed lies inside the triangle. You can verify this on the canvas: set the weights to the computed values and watch the output arrow land exactly on the gold point `P`.

```python-editor collapsed
pie.translate_scalar_to([w1, w2], [0.39, 0.09], animate=True)
```

Below is a full implementation of a function that takes as input vertices of a triangle and a point. It returns `True` if the point is inside the triangle and `False` otherwise.

```python
def is_point_in_triangle(vertices, point):
    '''
    vertices: [[x1,y1],[x2,y2],[x3,y3]]
    point: [p,q]
    '''
    x1,y1 = vertices[0]
    x2,y2 = vertices[1]
    x3,y3 = vertices[2]
    shifted_vertices = [[x1-x1,y1-y1],[x2-x1,y2-y1],[x3-x1,y3-y1]]
    shifted_point = [point[0]-x1, point[1]-y1]
    
    # create a matrix with sides AB and AC as vectors
    matrix = [shifted_vertices[1], shifted_vertices[2]]
    inverse_matrix = get_inverse_of(matrix)
    # get the weights needed to scale the vectors AB and AC
    w1, w2 = matMul(inverse_matrix, shifted_point)
    return weights_are_valid(w1,w2)
```

---

### 5.4.1 Extending the idea to polygons

```python-editor collapsed
pie.clear()
pie.scalar(60, out='unit')
GRAY, GOLD = '#71717a', '#ca8a04'
qa = pie.point(-1, -2, out='qa')
qb = pie.point(3, -2, out='qb')
qc = pie.point(4, 3, out='qc')
qd = pie.point(-3, 2, out='qd')
qe = pie.point(-4, 0, out='qe')
pie.polyline([qa, qb, qc, qd, qe, qa], out='pent', stroke=GRAY)
```

Once you figure out how to determine whether or not a point is inside a given triangle, you can easily extend this idea to polygons. All you need to do is to break down the polygon into a set of triangles. Then a given point is inside the polygon if it is inside any of these triangles.

For example, take the pentagon on the canvas with vertices `[-1,-2], [3,-2], [4,3], [-3,2], [-4,0]`. We can break it into three triangles by drawing diagonals from one vertex:

```python-editor collapsed
pie.line(qa, qc, out='d1', stroke=GOLD)
pie.line(qa, qd, out='d2', stroke=GOLD)
```

Now the question "is the point inside the pentagon?" becomes "is the point inside any of these three triangles?"

This is what a function to do so would look like:

```python
def is_point_in_polygon(vertices, point):
    triangles = decompose_polygon_into_triangles(vertices)
    for triangle in triangles:
        if is_point_in_triangle(triangle, point):
            return True
    return False
```

#### Fun questions
How will you implement the function `decompose_polygon_into_triangles`? Does the function work for all polygons? What if a polygon is not convex?

In the next chapter, we will look at what it means to multiply a matrix with another matrix.

---

[← 4. Rank and reversibility](/la/4_rank_and_reversibility)  ·  [6. Matrix-matrix multiplication →](/la/6_matrix_matrix_multiplication)
