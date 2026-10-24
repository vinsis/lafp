---
title: 2. Geometry of weighted sums
canvas: left
---

# 2. Geometry of weighted sums

<details>
<summary>Review</summary>

Weighted sum of numbers is pervasive across scientific fields. One can _generalize_ it to taking a weighted sum of arrays. An array is just an ordered list of numbers. One can get more insight out of it by giving it a geometry.

</details>

We will give _a_ geometry to an array of numbers, and start calling it a _vector_. We will also give a geometric meaning to the two basic operations we saw earlier
- scaling an array
- adding two arrays 

---

## 2.1 A vector is a point in space

Note that we interpret an array of length $n$ as a $n$-dimensional vector. We represent an array $[3,2]$ as the point one can reach by:
-   moving a distance of $3$ units along the x-axis, and then
-   moving a distance of $2$ units along the y-axis.

```python-editor collapsed
pie.clear()
p0 = pie.point(0, 0, out='p0', hidden=True)
a = pie.point(3, 0, out='a', hidden=True)
b = pie.point(3, 2, out='b', hidden=True)
pie.line(p0, a, out='line0')
pie.line(a, b, out='line1')
pie.la_vec2d(3, 2, out='vec0')
```

#### Extending the logic to longer arrays
The same logic applies to an array $[a,b,c]$ of length $3$

In this case one uses a $3$-dimensional space with $x$, $y$ and $z$ axes. The array can be seen as a point in $3$d space one can reach by:
- moving a distance $a$ along the $x$-axis, followed by
- moving a distance $b$ along the $y$-axis, followed by
- moving a distance $c$ along the $z$-axis.

---

## 2.2 A vector has a `length` and a `direction`
This visualization introduces two new properties which are intimately tied to vectors in a space:
1. How long the vector is
2. In what direction the vector points

> These properties become more obvious only after visualizing an array as a vector. This is a benefit of ascribing a geometry to a vector.

---

### 2.2.1 `length` of a vector represented by the array `[a,b,c,d]`
A repeated application of the Pythagoras theorem tells us that the length of a vector `[a,b,c,d,...]` is 

$$\text{length} = \sqrt{a^2 + b^2 + c^2 + d^2 + \text{...}}$$

We will use the word `norm` (`L2 norm` to be precise) to denote how long the vector is. A function to calculate the `norm` of a vector would look something like

```python
def norm(array):
    return sum(i**2 for i in array)**0.5
```

Eg This vector has norm of $\sqrt{3^2 + 2^2} \approx 3.6055$

```python-editor collapsed
pie.annotate_dim_line(b, p0, out='dim0')
```

---

### 2.2.2 `direction` of a vector represented by the array `[a,b,c,d]`

Specifying the direction of a vector in $2$-dimensional space is straightforward. For a vector `[x,y]`, we can use the angle of the vector from the x-axis, $\theta = \tan^{-1}(y / x)$ as a measure of direction. It can be shown as this infinite line. 

```python-editor collapsed
pie.line(pie.point(-30, -20, out='d', hidden=True), pie.point(30, 20, out='c', hidden=True), out='line2', stroke='#71717a')
```

But it gets complicated immediately as we move to a $3$-dimensional space. The idea of _direction_ is not tied to a single value like _angle from the x-axis_ anymore.

However we can answer the question: **how similar are the directions of two vectors represented by arrays `[a,b,c,d,...]` and `[p,q,r,s,...]`**? For this question to make sense, the number of elements in these arrays should be the same. We will discuss this problem and the elegance of its solution later on.

---

#### A note on representing a vector:
An array $[x_1, x_2, x_3, ..., x_n]$ when represented as a vector is shown with values stacked vertically like so:

$$\begin{bmatrix} x_1 \\ x_2 \\ x_3 \\ \vdots \\ x_n \end{bmatrix}$$

--- 

## 2.3 Scaling and addition

### 2.3.1 Scaling a vector 

Scaling a vector only changes its norm. It does not change its direction. E.g. given a vector $\begin{bmatrix} 3 \\ 2 \end{bmatrix}$ one can modify the scale and see how it changes its magnitude.

```python-editor collapsed
pie.clear()
scale = pie.scalar(1, out='scale')
v0 = pie.la_vec2d(3, 2, out='v0', hidden=True)
pie.la_scale_vec2d(v0, scale, out='v1')

# Text that shows a number, rounded to two decimals
def value_text(prefix, value):
    return f'{prefix}{round(value, 2):g}'

pie.text(pie.lift(value_text, pie.Text)('Scale: ', scale), -2, 2, 12, out='scale_label')
```

- Increase scale:

```python-editor collapsed
pie.translate_scalar_to(scale, 2, animate=True)
```

- Decrease scale:

```python-editor collapsed
pie.translate_scalar_to(scale, -2, animate=True)
```

- Set `scale = 0.5`:

```python-editor collapsed
pie.scalar(0.5, out='scale')
```

Feel free to try out other values of `scale` and th vector.

### 2.3.2 Adding two or more vectors

```python-editor collapsed
pie.clear()
GRAY = '#71717a'
a = pie.point(3, 2, out='a', hidden=True)
b = pie.point(-4, 3, out='b', hidden=True)
c = pie.point(-4, -4, out='c', hidden=True)
d = pie.point(3, -4, out='d', hidden=True)
pie.la_vec2d(3, 2, out='va', stroke=GRAY)
pie.la_vec2d(-4, 3, out='vb', stroke=GRAY)
pie.la_vec2d(-4, -4, out='vc', stroke=GRAY)
pie.la_vec2d(3, -4, out='vd', stroke=GRAY)
```

One can only add vectors with the same dimension. Adding two vectors can be seen geometrically as placing the second vector at the point where the first vector ends. Then the vector which joins the origin to the head of the second vector is the sum. This can be extended to more than two vectors.

Say you are given four vectors `va`, `vb`, `vc` and `vd`.

- The sum `va + vb` can be visualized like this.

```python-editor collapsed
m = pie.la_mat_from_points([a, b], out='m')
pie.la_weighted_sum(m, [1, 1], out='vOut')
```

- The sum `va + vb + vc` can be visualized like this.

```python-editor collapsed
m = pie.la_mat_from_points([a, b, c], out='m')
pie.la_weighted_sum(m, [1, 1, 1], out='vOut')
```

- Similarly the sum `va + vb + vc + vd` can be visualized like this.

```python-editor collapsed
m = pie.la_mat_from_points([a, b, c, d], out='m')
pie.la_weighted_sum(m, [1, 1, 1, 1], out='vOut')
```

### 2.3.3 Commutativity to symmetry
The order of vectors does not matter when adding them. In other words, addition is commutative: 

$$\text{add}(\textcolor{#1d4ed8}{v_1}, \textcolor{#be185d}{v_2}) = \text{add}(\textcolor{#be185d}{v_2}, \textcolor{#1d4ed8}{v_1})$$

```python-editor collapsed
pie.clear()
v1 = pie.la_vec2d(3, 2, out='v1', stroke='#1d4ed8')
v2 = pie.la_vec2d(-4, 3, out='v2', stroke='#be185d')
```

We can visualize this commutativity by adding two vectors $\textcolor{#1d4ed8}{v_1}$, $\textcolor{#be185d}{v_2}$ in different orders - $\textcolor{#1d4ed8}{v_1}$ then $\textcolor{#be185d}{v_2}$ or $\textcolor{#be185d}{v_2}$ then $\textcolor{#1d4ed8}{v_1}$. Note how the property of commutativity in algebra translates into the property of symmetry in geometry.

Given two vectors v1 $\begin{bmatrix} 3 \\ 2 \end{bmatrix}$ and v2 $\begin{bmatrix} -4 \\ 3 \end{bmatrix}$, we can add them up in two different ways:

-   $v_1 + v_2$
-   $v_2 + v_1$

```python-editor collapsed
pie.hide([v1, v2])
# The columns of m1 are v1, v2; the columns of m2 are v2, v1.
m1 = [[3, -4], [2, 3]]
m2 = [[-4, 3], [3, 2]]
pie.la_weighted_sum(m1, [1, 1], out='y1')
pie.la_weighted_sum(m2, [1, 1], out='y2')
```

Note the symmetry about the output vector. 

---

## 2.4 Combining scaling and addition

```python-editor collapsed
pie.clear()
pie.scalar(40, out='unit')
a = pie.point(3, 2, out='a', hidden=True)
b = pie.point(-2, 4, out='b', hidden=True)
c = pie.point(-3, -3, out='c', hidden=True)
m = pie.la_mat_from_points([a, b, c], out='m')
s1 = pie.scalar(1, out='s1')
s2 = pie.scalar(1, out='s2')
s3 = pie.scalar(1, out='s3')

# Text that shows a number, rounded to two decimals
def value_text(prefix, value):
    return f'{prefix}{round(value, 2):g}'

value_label = pie.lift(value_text, pie.Text)
pie.text(value_label('s1: ', s1), -7, 7, 12, out='box1', stroke='#1d4ed8')
pie.text(value_label('s2: ', s2), -7, 6, 12, out='box2', stroke='#be185d')
pie.text(value_label('s3: ', s3), -7, 5, 12, out='box3', stroke='#047857')
```

Now let us combine both operations we have seen so far - scaling _and_ adding vectors. Below we take the three vectors $\textcolor{#1d4ed8}{\begin{bmatrix} 3 \\ 2 \end{bmatrix}}$, $\textcolor{#be185d}{\begin{bmatrix} -2 \\ 4 \end{bmatrix}}$ and $\textcolor{#047857}{\begin{bmatrix} -3 \\ -3 \end{bmatrix}}$, scale each one, and add the scaled vectors together.

You cannot change the vectors themselves, but you _can_ change the scales $\textcolor{#1d4ed8}{s_1}$, $\textcolor{#be185d}{s_2}$ and $\textcolor{#047857}{s_3}$ that each vector is multiplied by:

$$\textcolor{#1d4ed8}{s_1} \textcolor{#1d4ed8}{\begin{bmatrix} 3 \\ 2 \end{bmatrix}} + \textcolor{#be185d}{s_2} \textcolor{#be185d}{\begin{bmatrix} -2 \\ 4 \end{bmatrix}} + \textcolor{#047857}{s_3} \textcolor{#047857}{\begin{bmatrix} -3 \\ -3 \end{bmatrix}}$$

Here is the scaled sum. Try tweaking the scales and watch how the scaled vectors are laid head-to-tail and their sum changes:

```python-editor collapsed
pie.la_weighted_sum(m, [s1, s2, s3], out='vOut')
```

- $\textcolor{#1d4ed8}{s_1}$: `2` increases it, `-1` decreases it, `1` resets it

```python-editor
pie.translate_scalar_to(s1, 2, animate=True)
```

- $\textcolor{#be185d}{s_2}$: `2` increases it, `-1` decreases it, `1` resets it

```python-editor
pie.translate_scalar_to(s2, 2, animate=True)
```

- $\textcolor{#047857}{s_3}$: `2` increases it, `-1` decreases it, `1` resets it

```python-editor
pie.translate_scalar_to(s3, 2, animate=True)
```

---

### 2.4.1 Matrix-vector multiplication is just scaling and adding vectors
By now this heading should feel obvious: a matrix-vector multiplication is just a sum of scaled vectors. The `vectors` are the `columns` of the matrix and the `scales` are the `elements of the vector`. In other words, the scaled sum above is exactly

$$\underbrace{\begin{bmatrix} \textcolor{#1d4ed8}{3} & \textcolor{#be185d}{-2} & \textcolor{#047857}{-3} \\ \textcolor{#1d4ed8}{2} & \textcolor{#be185d}{4} & \textcolor{#047857}{-3} \end{bmatrix} \begin{bmatrix} \textcolor{#1d4ed8}{s_1} \\ \textcolor{#be185d}{s_2} \\ \textcolor{#047857}{s_3} \end{bmatrix}}_{\text{matrix-vector product}} = \underbrace{\textcolor{#1d4ed8}{s_1} \textcolor{#1d4ed8}{\begin{bmatrix} 3 \\ 2 \end{bmatrix}} + \textcolor{#be185d}{s_2} \textcolor{#be185d}{\begin{bmatrix} -2 \\ 4 \end{bmatrix}} + \textcolor{#047857}{s_3} \textcolor{#047857}{\begin{bmatrix} -3 \\ -3 \end{bmatrix}}}_{\text{sum of scaled columns}}$$

So whenever you see a matrix-vector product, you should be able to _visualize_ it as scaling the columns of the matrix by the elements of the vector and adding the results.

### 2.4.2 A different point of view
In the next chapter, we will learn another way to look at matrix-vector multiplication.

---

[← 1. Weighted means](/la/1_weighted_means)  ·  [3. Matrix as a function →](/la/3_mat_vec_mul)
