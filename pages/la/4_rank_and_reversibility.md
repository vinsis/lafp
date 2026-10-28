---
title: Matrix rank, linear independence and the inverse
description: What the rank of a matrix means, how it relates to linearly independent vectors, and when a matrix can be inverted, including the 2-by-2 inverse.
canvas: left
sidebar: _ebook.md
---

# 4. Rank and reversibility

<details>
<summary>Review</summary>

A matrix is a function: it maps an input point $x$ to an output point $y = Mx$. A `2-by-2` matrix maps lines to lines, circles to ellipses, convex shapes to convex shapes — and when its two columns point in the same direction, it _squishes_ the entire 2D plane into a line.

</details>

In this chapter we make that _squishing_ precise. We will meet the `rank` of a matrix, understand when a matrix's action can be _reversed_, and see why the two ideas are really one.

---

## 4.1 Unique values in an array
How can you find the number of unique values in an array of numbers? What if you have an array of vectors of a fixed dimension? Recall that a `vector` of dimension `d` is just an array of `d` numbers. This leads to the question: **how is uniqueness defined?**

### 4.1.1 Duplicate numbers: what makes two numbers unique?
The answer is obvious here: two numbers are unique if and only if they are not equal. In this case, the solution may look something like (without worrying about algorithmic complexity):

```python
def get_number_unique_elements(array):
    element_to_count_dict = {}
    for element in array:
        element_to_count_dict[element] = element_to_count_dict.get(element, 0) + 1
    return len(element_to_count_dict)
```

### 4.1.2 Duplicate vectors: what makes two vectors unique?

```python-editor collapsed
pie.clear()
pie.scalar(25, out='unit')
BLUE, PINK = '#1d4ed8', '#be185d'
pie.la_vec2d(6, 9, out='ua', stroke=BLUE)
pie.la_vec2d(2, 3, out='ub', stroke=BLUE)
pie.la_vec2d(2.5, 3, out='uc', stroke=PINK)
pie.text('(6, 9)', 6.83, 8.45, 12, out='lbl_ua', stroke=BLUE)
pie.text('(2, 3)', 4, 2.45, 12, out='lbl_ub', stroke=BLUE)
pie.text('(2.5, 3)', 0.9, 4.35, 12, out='lbl_uc', stroke=PINK)
```

> We can think of two vectors to be unique if and only if they point in different directions.

Note that this is not a definition of uniqueness of vectors. But it emphasizes the fact that **if two vectors point in the same direction, they are just scaled versions of each other - in that sense, they are not unique**.

Consider two arrays `[2,3]` and `[6,9]`. They point in the same direction so they are not considered unique. However `[2,3]` and `[2.5,3]` are considered unique.

```python-editor collapsed
pie.clear()
BLUE, PINK = '#1d4ed8', '#be185d'
pie.la_vec2d(2, 3, out='v1', stroke=BLUE)
pie.la_vec2d(-3, -4.5, out='v2', stroke=BLUE)
pie.la_vec2d(3, 4.5, out='v3', stroke=BLUE)
pie.la_vec2d(3, 2, out='v4', stroke=PINK)
pie.text('(2, 3)', 2.7, 3, 12, out='lbl_v1', stroke=BLUE)
pie.text('(-3, -4.5)', -3.83, -3.95, 12, out='lbl_v2', stroke=BLUE)
pie.text('(3, 4.5)', 3.5, 4.8, 12, out='lbl_v3', stroke=BLUE)
pie.text('(3, 2)', 3.55, 2, 12, out='lbl_v4', stroke=PINK)
```

Let's see how this looks visually: in the array of vectors `[[2,3],[-3,-4.5],[3,4.5],[3,2]]` shown on the canvas, these three blue vectors $\textcolor{#1d4ed8}{\begin{bmatrix} 2 \\ 3 \end{bmatrix}}$, $\textcolor{#1d4ed8}{\begin{bmatrix} -3 \\ -4.5 \end{bmatrix}}$, $\textcolor{#1d4ed8}{\begin{bmatrix} 3 \\ 4.5 \end{bmatrix}}$ are all scaled versions of each other, while this pink vector $\textcolor{#be185d}{\begin{bmatrix} 3 \\ 2 \end{bmatrix}}$ points in its own direction. So we only have two unique directions i.e. two _unique_ vectors.

---

## 4.2 What is the dimension of the space covered by weighted sums of vectors?
Here is a question which may seem unrelated to the previous question initially: given a list of vectors, what is the dimension, `r`, of the _space_ covered by weighted sums of the vectors?

We define a space as a collection of infinitely many points where each point is a possible output of a weighted sum of vectors. Given vectors $v_1, v_2, ..., v_n$, the set of points $c_1v_1 + c_2v_2 + ... + c_nv_n$ for all possible values of $c_1, c_2, ..., c_n$ is the space formed by all possible weighted sums of $v_1, v_2, ..., v_n$. Is `r` the same as the number of unique directions of the vectors being summed? Let's look at some _properties_ of this dimension `r` first:

### 4.2.1 It cannot be greater than the dimension of the vectors being added up

```python-editor collapsed
pie.clear()
GRAY, GOLD = '#71717a', '#ca8a04'
w = pie.scalar(0.5, out='w')
pie.line(pie.point(-6, -9, out='far1', hidden=True), pie.point(6, 9, out='far2', hidden=True), out='dir_line', stroke=GRAY)
v = pie.la_vec2d(2, 3, out='v')
pie.la_scale_vec2d(v, w, out='wv', stroke=GOLD)
pie.text('This line is the entire space covered by weighted sums of the vector: a 1-dimensional space, since the weighted sum can never leave the line', -2, -3, 12, 4, -1, out='box_cap')
```

This may seem like an obvious fact: you cannot get a 3-dimensional vector by adding two or more 2-dimensional vectors. Thus the dimensionality of the output space cannot be greater than two.

Can it be smaller than two? Absolutely! All weighted sums of a _single_ 2-dimensional vector just cover a line. E.g. the weighted sum of the vector $\begin{bmatrix} 2 \\ 3 \end{bmatrix}$ with a weight $w$ is the gold vector $\begin{bmatrix} 2w \\ 3w \end{bmatrix}$. As you change the value of $w$, its tip traces out different points of the grey line $3x - 2y = 0$ — a 1-dimensional space.

Change $w$: `1.5` increases it, `-1.5` decreases it, `0.5` resets it

```python-editor
pie.translate_scalar_to(w, 1.5, animate=True)
```

```python-editor collapsed
pie.clear()
pa = pie.point(2, 0, out='pa', hidden=True)
pb = pie.point(2, 3, out='pb', hidden=True)
pc = pie.point(-5, -2, out='pc', hidden=True)
pd = pie.point(-1, -1, out='pd', hidden=True)
pe = pie.point(-1, -3, out='pe', hidden=True)
m = pie.la_mat_from_points([pa, pb, pc, pd, pe], out='m')
pie.la_weighted_sum(m, [1, 1, 1, 1, 1], out='vsum')
pie.text('Five 2-d vectors added tip-to-tail: the sum arrow always stays in the 2-d plane, no matter how many vectors we add', 0, -5, 12, 6, -1, out='box_cap')
```

At the other end, here is a tip-to-tail sum of _five_ 2-dimensional vectors `[2,0], [2,3], [-5,-2], [-1,-1], [-1,-3]`, ending in the resultant sum. No matter how many 2-dimensional vectors we add, we still remain in the 2-d plane.

#### An observation
Even if we have `3` or more unique vectors (i.e. pointing in unique directions), each of dimension `2`, we can only cover the entire 2-dimensional space by taking their weighted sums. But this is something we can do with two vectors only (e.g. `[1,0]` and `[0,1]`).

---

### 4.2.2 It cannot be greater than the number of vectors being added up
This may not be obvious at first but it will start to make sense later: if you add `three` 100-dimensional vectors weighed (scaled) in all possible manners, you will get a space which is at most three dimensional. Let's consider some examples to understand:

1. The output space of weighted sums of `one` 3-dimensional vector is a one-dimensional space — a line in 3-dimensional space. This is easy to visualize - the space is basically just one direction - the direction of the input vector. There is no other unique direction in this space.
2. The output space of weighted sums of `two` 3-dimensional vectors which point in the same direction is a one-dimensional space - it is a line in 3-dimensional space. E.g. the sum of `w1 * [1,2,2]` and `w2 * [-2,-4,-4]` is `[c,2c,2c]` where `c = w1 - 2*w2`. There is only one unique direction in the output space — the direction of the two input vectors.
3. The output space of weighted sums of `two` unique 3-dimensional vectors is a two-dimensional space - it is a plane in 3-dimensions. For example, if you add vectors `w1 * [1,0,0]` and `w2 * [0,1,0]`, the output vector is the space `[w1, w2, 0]`. No matter how you add these two vectors, you can never get to a vector `[1,1,1]`.
4. Similarly if you take three vectors $v_1, v_2, v_3$ of any dimension `n > 3`, all possible weighted sums of these three vectors will form a 3-dimensional space.

---

## 4.3 Rank of a matrix
The `dimensionality of all possible weighted sums of vectors in an array` is a property of that array of vectors. Note that an array of vectors of the same dimension is nothing but a matrix. We call this property the **rank** of that matrix. For example, the array of vectors `[[2,3],[-3,-4.5],[3,4.5],[3,2]]` in the matrix form is:

```python-editor collapsed
pie.clear()
GRAY = '#71717a'
pie.la_vec2d(2, 3, out='v1')
pie.la_vec2d(-3, -4.5, out='v2')
pie.la_vec2d(3, 4.5, out='v3')
pie.la_vec2d(3, 2, out='v4')
pie.text('v₁', 1.5, 3.1, 14, out='lbl_v1', stroke=GRAY)
pie.text('v₂', -3, -3.95, 14, out='lbl_v2', stroke=GRAY)
pie.text('v₃', 3.3, 4.5, 14, out='lbl_v3', stroke=GRAY)
pie.text('v₄', 3.3, 2, 14, out='lbl_v4', stroke=GRAY)
```

$$\begin{bmatrix} 2 & -3 & 3 & 3 \\ 3 & -4.5 & 4.5 & 2 \end{bmatrix}$$

This matrix has rank 2 as we saw earlier.

Similarly the below matrices have rank 1:

$$\begin{bmatrix} 2 & -3 \\ 3 & -4.5 \end{bmatrix}, \quad \begin{bmatrix} 2 & -3 \\ 3 & -4.5 \\ 0 & 0 \end{bmatrix}, \quad \begin{bmatrix} -1 & 2 & 0.5 \\ -2 & 4 & 1 \\ 4 & -8 & -2 \end{bmatrix}$$

---

## 4.4 Linearly (in)dependent vectors
Given vectors $v_1, v_2, ..., v_n$, we want to find weights $w_1, w_2, ..., w_n$ such that the weighted sum $w_1v_1 + w_2v_2 + ... + w_nv_n = 0$. In other words:

$$\underbrace{\begin{bmatrix} v_1 & v_2 & \cdots & v_n \end{bmatrix}}_{\text{columns}} \underbrace{\begin{bmatrix} w_1 \\ w_2 \\ \vdots \\ w_n \end{bmatrix}}_{\text{weights}} = \underbrace{\begin{bmatrix} 0 \\ 0 \\ \vdots \\ 0 \end{bmatrix}}_{\text{zero vector}}$$

Note that we can always find at least one solution: setting all weights $w_1, w_2, ..., w_n$ to zero. This is called the _trivial_ solution.

- If this is the only solution for $w_1, w_2, ..., w_n$, the vectors $v_1, v_2, ..., v_n$ are said to be **linearly independent**.
- If there exists a non-trivial solution (i.e. at least one of the weights is non-zero), the vectors are said to be **linearly dependent**.

### 4.4.1 Why the word "dependent"?
Let's say $w_i \neq 0$. Then we can write the equation $w_1v_1 + w_2v_2 + ... + w_nv_n = 0$ as

$$\begin{aligned}
w_iv_i &= -\sum_{k \neq i}{w_kv_k} \\
v_i &= -\sum_{k \neq i}{\frac{w_k}{w_i}v_k} \quad \text{(dividing both sides by } w_i \text{)}
\end{aligned}$$

Thus the vector $v_i$ can be expressed as a weighted sum of the remaining vectors. We can think of the vector $v_i$ as not being _independent_ of the remaining vectors.

In this scenario, the space of weighted sums of all vectors except $v_i$ is the same as the space of weighted sums of all vectors. In other words, adding the vector $v_i$ does not increase the dimensionality of the space of all possible weighted sums.

But if the trivial solution is the only possible solution, it means that every vector $v_i$ is independent of the remaining vectors. In this case, the dimensionality of the space of all possible weighted sums of vectors $v_1, v_2, ..., v_{i-1}, v_{i+1}, ..., v_n$ is smaller than the dimensionality of the space of all possible weighted sums of vectors $v_1, v_2, ..., v_n$ by a value of 1.

### 4.4.2 Relationship between linear independence and rank of a matrix
Given a matrix whose columns are the vectors $v_1, v_2, ..., v_n$, the rank of the matrix is equal to the size of the largest subset `S` of the vectors $v_1, v_2, ..., v_n$ such that the vectors in `S` are linearly independent.

Consider the matrix

```python-editor collapsed
pie.clear()
GRAY = '#71717a'
pie.la_vec2d(2, 3, out='v1')
pie.la_vec2d(-3, -4.5, out='v2')
pie.la_vec2d(3, 2, out='v3')
pie.la_vec2d(1, 1, out='v4')
pie.text('v₁', 2.22, 3.33, 14, out='lbl_v1', stroke=GRAY)
pie.text('v₂', -3.22, -4.83, 14, out='lbl_v2', stroke=GRAY)
pie.text('v₃', 3.33, 2.22, 14, out='lbl_v3', stroke=GRAY)
pie.text('v₄', 1.28, 1.28, 14, out='lbl_v4', stroke=GRAY)
```

$$\begin{bmatrix} 2 & -3 & 3 & 1 \\ 3 & -4.5 & 2 & 1 \end{bmatrix}$$

The largest subset `S` of the column vectors of this matrix such that the columns of `S` are linearly independent can only contain two vectors. E.g. $\begin{bmatrix} 2 & 1 \\ 3 & 1 \end{bmatrix}$, $\begin{bmatrix} 3 & -3 \\ 2 & -4.5 \end{bmatrix}$ or $\begin{bmatrix} 2 & 3 \\ 3 & 2 \end{bmatrix}$.

Thus the rank of this matrix is 2.

---

## 4.5 Building a case for square matrices

```python-editor collapsed
pie.clear()
BLUE, PINK, GREEN = '#1d4ed8', '#be185d', '#047857'
pa = pie.point(4, 1, out='pa', hidden=True)
pb = pie.point(-2, 1, out='pb', hidden=True)
pc = pie.point(-1, -4, out='pc', hidden=True)
m = pie.la_mat_from_points([pa, pb, pc], out='m')
w1 = pie.scalar(0.8, out='w1')
w2 = pie.scalar(2, out='w2')
w3 = pie.scalar(1.3, out='w3')
pie.la_weighted_sum(m, [w1, w2, w3], out='vsum')
pie.text('0.8 × (4, 1)', 1.84, -0.57, 12, out='lbl_t1', stroke=BLUE)
pie.text('2 × (-2, 1)', 1.74, 2.87, 12, out='lbl_t2', stroke=PINK)
pie.text('1.3 × (-1, -4)', -2.61, 0.49, 12, out='lbl_t3', stroke=GREEN)
```

Consider the following weighted sum of three 2-dimensional vectors, shown tip-to-tail on the canvas along with the resultant sum:

$$\begin{bmatrix} \textcolor{#1d4ed8}{4} & \textcolor{#be185d}{-2} & \textcolor{#047857}{-1} \\ \textcolor{#1d4ed8}{1} & \textcolor{#be185d}{1} & \textcolor{#047857}{-4} \end{bmatrix} \begin{bmatrix} \textcolor{#1d4ed8}{0.8} \\ \textcolor{#be185d}{2} \\ \textcolor{#047857}{1.3} \end{bmatrix}$$

```python-editor collapsed
pie.clear()
BLUE, PINK = '#1d4ed8', '#be185d'
pa = pie.point(4, 1, out='pa', hidden=True)
pb = pie.point(-2, 1, out='pb', hidden=True)
pc = pie.point(-1, -4, out='pc', hidden=True)
m3 = pie.la_mat_from_points([pa, pb, pc], out='m3')
pie.la_weighted_sum(m3, [0.8, 2, 1.3], out='sum3', stroke=BLUE)
qa = pie.point(1, -2, out='qa', hidden=True)
qb = pie.point(-2, -1, out='qb', hidden=True)
m2 = pie.la_mat_from_points([qa, qb], out='m2')
pie.la_weighted_sum(m2, [0.54, 1.32], out='sum2', stroke=PINK)
pie.text('3-vector sum', -0.8, 3.7, 12, out='lbl_chain3', stroke=BLUE)
pie.text('2-vector sum', 1.6, -1.9, 12, out='lbl_chain2', stroke=PINK)
pie.text('both land here', -3.2, -3.3, 12, out='lbl_landing')
```

We can actually get to any point in the output space by using just two vectors. As long as the two vectors are unique (or in other words, as long as the `2-by-2` matrix has rank 2), we can get to any point in the 2d plane using just two vectors. For example, with the weights fixed at $(0.8, 2, 1.3)$, 
- the three-vector sum lands on the point $\begin{bmatrix} -2.1 \\ -2.4 \end{bmatrix}$
- and this two-vector sum reaches exactly the same point:

$$\begin{aligned}
\begin{bmatrix} 1 & -2 \\ -2 & -1 \end{bmatrix} \begin{bmatrix} 0.54 \\ 1.32 \end{bmatrix} &= \begin{bmatrix} -2.1 \\ -2.4 \end{bmatrix} \\
\begin{bmatrix} 4 & -2 & -1 \\ 1 & 1 & -4 \end{bmatrix} \begin{bmatrix} 0.8 \\ 2 \\ 1.3 \end{bmatrix} &= \begin{bmatrix} -2.1 \\ -2.4 \end{bmatrix}
\end{aligned}$$

#### The identity matrix works too
The identity matrix works too, with weights equal to the target coordinates: $\begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} -2.1 \\ -2.4 \end{bmatrix} = \begin{bmatrix} -2.1 \\ -2.4 \end{bmatrix}$

In other words, a weighted sum of three or more 2-dimensional vectors can also be represented as a weighted sum of two 2-dimensional vectors (which is a `2-by-2` matrix). Similarly any weighted sum of four or more 3-dimensional vectors can be represented by a weighted sum of three 3-dimensional vectors (which is a `3-by-3` matrix). In this sense, these `2-by-2` and `3-by-3` matrices seem to be "efficient". An `n-by-n` matrix contains just enough columns to scale-and-add to be able to reach any point in the n-dimensional space.

---

### 4.5.1 Input and output vectors of square matrices have the same dimensionality
If we consider the matrix as a function, an `n-by-n` matrix takes as input an n-dimensional vector and gives as output an n-dimensional vector. In other words, it maps a point in n-dimensional space to another point in n-dimensional space. For example, the matrix $\begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$ maps the point $\begin{bmatrix} 1 \\ 1 \end{bmatrix}$ to $\begin{bmatrix} 3 \\ 3 \end{bmatrix}$. **This allows us to draw the input and the output points in the same 2-dimensional plane**.

---

### 4.5.2 Drawing input and output points in the same plane

```python-editor collapsed
pie.clear()
p_in = pie.point(1, 1, out='p_in')
p_out = pie.point(3, 3, out='p_out')
pie.text('input point (1, 1)', 2.2, 0.6, 12, out='box_in')
pie.text('output point (3, 3)', 4.3, 2.6, 12, out='box_out')
pie.annotate_arrow(p_in, p_out, 0.1, out='fa0')
```

Since both the input and the output points lie in the same 2d plane, we can draw them in the same plane. We can draw an arrow from the input point to the output point to show the transformation by the matrix $\begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$.

```python-editor collapsed
import numpy as np

pie.clear()
BLUE, PINK, GRAY, GOLD = '#1d4ed8', '#be185d', '#71717a', '#ca8a04'
p0 = pie.point(0, 0, out='p0', hidden=True)
r = pie.scalar(2, out='r')
pie.circle(p0, r, out='circ', stroke=GRAY)

# n points evenly spaced on the circle of radius r
def circle_points(r, n):
    t = np.linspace(0, 2 * np.pi, n, endpoint=False)
    return np.stack([r * np.cos(t), r * np.sin(t)], axis=1)

pts_in = pie.lift(circle_points, pie.Array[pie.Point])(r, 40, out='pts_in', fill=BLUE)
m = [[2, 1], [1, 2]]
m_in = pie.la_mat_from_points(pts_in, out='m_in')
m_out = pie.la_matmul(m, m_in, out='m_out')
q_out = pie.la_mat_to_points(m_out, out='q_out', fill=PINK)
pie.text('M stretches the circle of radius 2 into an ellipse', 0, -5.5, 12, 6, -1, out='cap_ellipse')
pie.annotate_arrow(pts_in, q_out, 0.05, out='arrows', stroke=GOLD)
```

We can also do this for not just one but a set of input points. Here we sample points on a circle of radius $2$ and map each one through the matrix $\begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$. For each input point, we calculate the output point, and draw an arrow from each input point to its output point. The arrows show how the input points on the circle are mapped to points on an ellipse.

---

## 4.6 Transforming the output vector back into the input vector

```python-editor collapsed
pie.clear()
p_in = pie.point(1, 1, out='p_in')
p_out = pie.point(3, 3, out='p_out')
pie.annotate_curved_arrow(p_in, p_out, pie.point(3, 1, out='ctrl_m', hidden=True), 0.08, 'M', out='fwd_curve')
pie.annotate_curved_arrow(p_out, p_in, pie.point(1, 3, out='ctrl_q', hidden=True), 0.08, '?', out='back_curve')
```

We can ask the question: what matrix brings $\begin{bmatrix} 3 \\ 3 \end{bmatrix}$ back to $\begin{bmatrix} 1 \\ 1 \end{bmatrix}$?

Whatever this matrix is, it _inverts_ the action of the matrix $M = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$ (which sent the vector $\begin{bmatrix} 1 \\ 1 \end{bmatrix}$ to the vector $\begin{bmatrix} 3 \\ 3 \end{bmatrix}$). We call this matrix the inverse of matrix $M$ and write it as $M^{-1}$ (pronounced _M inverse_).

### 4.6.1 Matrix inverse is simply inverting the arrows

```python-editor collapsed
import numpy as np

pie.clear()
BLUE, PINK, TEAL, GOLD = '#1d4ed8', '#be185d', '#0d9488', '#ca8a04'
r = pie.scalar(2, out='r')

def circle_points(r, n):
    t = np.linspace(0, 2 * np.pi, n, endpoint=False)
    return np.stack([r * np.cos(t), r * np.sin(t)], axis=1)

pts_in = pie.lift(circle_points, pie.Array[pie.Point])(r, 40, out='pts_in', fill=BLUE)
m = [[2, 1], [1, 2]]
m_in = pie.la_mat_from_points(pts_in, out='m_in')
m_out = pie.la_matmul(m, m_in, out='m_out')
q_out = pie.la_mat_to_points(m_out, out='q_out', fill=PINK)
arrows = pie.annotate_arrow(pts_in, q_out, 0.05, out='arrows', stroke=GOLD)
back_arrows = pie.annotate_arrow(q_out, pts_in, 0.05, out='back_arrows', stroke=TEAL, hidden=True)
pie.text('M maps circle points to ellipse points; reversing every arrow gives the action of M⁻¹', 0, -5.5, 12, 6.5, -1, out='cap_inv')
```

If we use arrows from input points to output points to visualize these transformations, the effect of an inverse matrix can be seen as simply changing the direction of the arrows:

- Show the action of $M^{-1}$: the teal arrows point from the ellipse back to the circle - $M^{-1}$ maps each output point back to its input point.

```python-editor collapsed
pie.hide(arrows)
pie.show(back_arrows)
```

- Show the action of $M$: back to the gold arrows, mapping the circle to the ellipse.

```python-editor collapsed
pie.hide(back_arrows)
pie.show(arrows)
```

### 4.6.2 When is it possible?

```python-editor collapsed
import numpy as np

pie.clear()
BLUE, PINK, GRAY, GOLD, GRID = '#1d4ed8', '#be185d', '#71717a', '#ca8a04', '#a1a1aa'
p0 = pie.point(0, 0, out='p0', hidden=True)
m11 = pie.scalar(1.2, out='m11')
m12 = pie.scalar(0.6, out='m12')
m21 = pie.scalar(0.8, out='m21')
m22 = pie.scalar(0.4, out='m22')
m = [[m11, m12], [m21, m22]]
pie.la_grid_transform(m, out='grid', stroke=GRID)
r = pie.scalar(3, out='r')
pie.circle(p0, r, out='circ', stroke=GRAY)

def circle_points(r, n):
    t = np.linspace(0, 2 * np.pi, n, endpoint=False)
    return np.stack([r * np.cos(t), r * np.sin(t)], axis=1)

pts_in = pie.lift(circle_points, pie.Array[pie.Point])(r, 8, out='pts_in', fill=BLUE)
m_in = pie.la_mat_from_points(pts_in, out='m_in')
m_out = pie.la_matmul(m, m_in, out='m_out')
q_out = pie.la_mat_to_points(m_out, out='q_out', fill=PINK)
pie.la_array_to_texts(m, -5, -5, 2, 1, out='mviz')

# Text that shows a number, rounded to two decimals
def value_text(prefix, value, suffix):
    return f'{prefix}{round(value, 2):g}{suffix}'

rank_text = pie.lift(value_text, pie.Text)('m₂₂ = ', m22, ': rank 1 (plane squished onto a line) exactly when m₂₂ = 0.4')
pie.text(rank_text, -4, 5.5, 12, 4, -1, out='lbl_rank')
pie.annotate_arrow(pts_in, q_out, 0.05, out='squish_arrows', stroke=GOLD)
```

A function can have the same output for two different inputs. But it can never have two different outputs for the same input. Remember that a matrix is just a function.

Now, if a matrix sends two input points `p1` and `p2` to the same output point `q`, its inverse would have to send that output point `q` to both `p1` and `p2`. That is not possible since an input point cannot have two different output points. Thus the inverse does not exist.

Now comes the interesting part: if a `2-by-2` matrix has rank 2, it always maps two different input points to two different output points. But if it has rank 1, there exists a set of input points which are all mapped to the same output point.

In fact, a rank-one `2-by-2` matrix squishes the entire 2d plane into a line. The canvas shows the matrix

$$M = \begin{bmatrix} 1.2 & 0.6 \\ 0.8 & 0.4 \end{bmatrix}$$

whose second column is just $0.5$ times its first column — a rank-one matrix. The input points sampled on a circle all land on output points on a single line. Join each input point to its output point to see the squish in action — and note how the entire transformed grid collapses onto that same line.

- Make it rank 2: the second column stops being a multiple of the first, and the transformed grid spans the whole plane again.

```python-editor collapsed
pie.translate_scalar_to(m22, 1.5, animate=True)
```

- Back to rank 1: the plane collapses back onto the line.

```python-editor collapsed
pie.translate_scalar_to(m22, 0.4, animate=True)
```

Thus an inverse does not exist for a rank-one `2-by-2` matrix. In general, for an `n-by-n` matrix, an inverse exists if and only if the rank of that matrix is `n`. Also, an inverse can only exist for square matrices. The reason is the same — non-square matrices always map a set of points to a single point.

### 4.6.3 Inverse of a 2-by-2 matrix
The inverse of a matrix

$$\begin{aligned}
M &= \begin{bmatrix} a & c \\ b & d \end{bmatrix} \\
M^{-1} &= \frac{1}{ad-bc} \begin{bmatrix} d & -c \\ -b & a \end{bmatrix}
\end{aligned}$$

Thus the inverse of $\begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$ is $\frac{1}{3} \begin{bmatrix} 2 & -1 \\ -1 & 2 \end{bmatrix}$. You can verify that

$$\frac{1}{3} \begin{bmatrix} 2 & -1 \\ -1 & 2 \end{bmatrix} \begin{bmatrix} 3 \\ 3 \end{bmatrix} = \begin{bmatrix} 1 \\ 1 \end{bmatrix}$$

---

## 4.7 Another term for _weighted sums of vectors_
We have been and will be using the term `weighted sums of vectors` quite a lot here. This is to emphasize the fact that a matrix-vector product is just a weighted sum of the columns of the matrix. But in general, this action is more commonly described as `taking a linear combination of vectors`. We will use both these phrases interchangeably.

In the next chapter, we will use this knowledge of rank and inverse of a matrix to solve an interesting problem — determining whether a point is inside or outside a triangle.

---

[← 3. Matrix as a function](/la/3_mat_vec_mul)  ·  [5. Barycentric coordinates →](/la/5_barycentric_coordinates)
