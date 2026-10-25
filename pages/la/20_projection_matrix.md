---
title: 20. Projection matrix
canvas: left
---

# 20. Projection matrix

<details>
<summary>Review</summary>

Markov matrices showed another payoff of eigendecomposition: repeatedly applying a transition matrix drives any starting distribution toward the steady state, the eigenvector of eigenvalue $1$. This chapter returns to a geometric question from the dot-product chapter and answers it in full generality.

</details>

Back when we learned about the dot product, we projected one vector onto another. Here we ask the more general question: what does it mean to project a vector onto a _space_ of vectors, and is there a single matrix that performs the projection? There is, and it is called the **projection matrix**.

---

## 20.1 Projection of a vector on another vector
Let's revisit the problem we encountered when we learned about the dot product: projection of a vector on another vector.

```python-editor collapsed
pie.clear()
pie.scalar(50, out='unit')
GRAY, TEAL, GOLD = '#71717a', '#0d9488', '#ca8a04'
pie.la_vec2d(4, 3, out='vvec', stroke=GRAY)
pie.text('v', 4.3, 3.4, 13, out='lblV', stroke=GRAY)
pie.la_vec2d(4, -2, out='qvec', stroke=TEAL)
pie.text('q', 4.3, -2.4, 13, out='lblQ', stroke=TEAL)
```

The figure shows the vector $v = [4, 3]$ and the vector $q = [4, -2]$. Now drop a perpendicular from the tip of $v$ onto the line of $q$: the projection of $v$ on $q$ is $[2, -1]$.

```python-editor collapsed
pie.line(pie.point(2, -1, out='cp1', hidden=True), pie.point(4, 3, out='cp2', hidden=True), out='conn', stroke=GRAY)
pie.la_vec2d(2, -1, out='proj', stroke=GOLD)
pie.text('v-proj', 1.6, -1.9, 13, out='lblP', stroke=GOLD)
```

Before we start out finding a solution, let's try to understand the problem in more detail. Note that we are not projecting $[4, 3]$ on the vector $[4, -2]$ in particular. We are projecting it on _any vector_ which has the same direction as $[4, -2]$. In other words we are projecting on all possible weighted sums of the vector $[4, -2]$.

---

## 20.2 Projection of a vector on a plane described by two vectors
Now let's say we want to find the projection of the vector $[a, b, c]$ on the 2-dimensional xy-plane. Note that this plane can be described by _any_ two independent vectors in that plane: $[1, 0]$ and $[0, 1]$, or $[2, 3]$ and $[-3, 1]$. Our xy-plane is in fact the set of all possible weighted sums of the two vectors. The projected vector (which is obvious in this case: $[a, b]$) does not depend on which elements are used to describe the _space_ in which we are projecting.

---

## 20.3 The idea of vector spaces
This gives us a slightly better picture of what exactly we are projecting a vector onto. The **vector space** of a set of vectors is the set of all possible weighted sums of those vectors. In other words, it is the set of all possible linear combinations of those vectors.

- The vector space of the vector $[a, b]$ is the set of all the points (or vectors) on the line $bx - ay = 0$. This is a one dimensional space. All vectors in this set have the form $[ka, kb]$ for some number $k$.
- The vector space of vectors $[a, b]$ and $[ca, cb]$, where $c$ is a number, is the same as the vector space of $[a, b]$. This is because any weighted sum of these two vectors also has the form $[ka, kb]$ for some number $k$.
- The vector space of two linearly independent vectors $\begin{bmatrix} \textcolor{#1d4ed8}{a_1} & \textcolor{#1d4ed8}{a_2} & \cdots & \textcolor{#1d4ed8}{a_n} \end{bmatrix}$ and $\begin{bmatrix} \textcolor{#be185d}{b_1} & \textcolor{#be185d}{b_2} & \cdots & \textcolor{#be185d}{b_n} \end{bmatrix}$ is a 2D space. These two vectors may have any dimensionality, but the set of all their weighted sums is a 2-dimensional plane (in the n-dimensional space).

---

### 20.3.1 Vector subspace
A vector subspace is a vector space which is a subset of another vector space.

- The vector space of $[a, b]$ is a vector subspace of the vector space of $[1, 0]$ and $[0, 1]$.
- The vector space of $[2, 3, -1]$ and $[0, 2, 1]$ is a 2-dimensional subspace of the 3-dimensional space that these vectors reside in.

---

### 20.3.2 We project a vector on a vector subspace
So when we talk about projecting a vector, we are actually projecting a vector on a subspace, not on a vector or a set of vectors. Let's say the vectors of this subspace are denoted as columns of a matrix $A$. Then we frame the problem as:

- Given an $n$-dimensional vector $v$ and a vector subspace of $n$-dimensional space whose vectors are given by a matrix $A$, what is the vector projected onto this subspace?

```python-editor collapsed
pie.clear()
pie.scalar(50, out='unit')
GRAY, TEAL, GOLD = '#71717a', '#0d9488', '#ca8a04'
pie.text('v', 4.3, 3.4, 13, out='lblV', stroke=GRAY)
pie.la_vec2d(4, 3, out='vvec', stroke=GRAY)
```

Let's redraw the earlier picture with this framing. Take the same vector $v = [4, 3]$, but instead of the single vector $q$, draw several weighted copies $kq$ of $q = [4, -2]$, members of the 1-dimensional vector space of $q$.

```python-editor collapsed
ks = [-1, -0.5, -0.25, 0.33, 0.67, 1]
pie.la_vec2d([4 * k for k in ks], [-2 * k for k in ks], out='fam', stroke=TEAL)
pie.text('kq for various k traces the 1-D subspace of q', -4.2, 3.2, 12, 3, -1, out='cap_subspace_box', stroke=TEAL)
```

The projection is unchanged: we are projecting $v$ on the whole subspace, and every description of that subspace gives the same answer.

```python-editor collapsed
pie.la_vec2d(2, -1, out='proj', stroke=GOLD)
pie.text('v-proj', 1.6, -1.9, 13, out='lblP', stroke=GOLD)
```

Note that this problem makes sense only if we are projecting a vector onto a subspace of the vector space the vector belongs to. If it is not a subspace, the projected vector is the vector itself.

- For example, the projection of the vector $[4, -2]$ onto the vector space of itself is the vector $[4, -2]$ itself.

---

## 20.4 Projection on a vector subspace
The projection of a vector $v$ on the vector space of a matrix $A$ is an element of the vector space of $A$. Let's call the original vector $v$ and the projected vector $\textcolor{#b45309}{v_{proj}}$. Note that $\textcolor{#b45309}{v_{proj}}$ can be expressed as a weighted sum of the column vectors of $A$. In other words, $\textcolor{#b45309}{v_{proj}} = Ax$ for some unknown vector $x$.

Once we find out what this vector $x$ is, we can calculate $\textcolor{#b45309}{v_{proj}}$ easily.

---

### 20.4.1 When is the projected vector zero?
When is the projection of a vector on a vector space zero? By zero, we mean the vector where each entry is $0$.

- For a subspace $A$ of dimension $1$, a vector $v$ has no projection (i.e. the projected vector is a zero vector) when it is perpendicular to every vector in that vector subspace.
- For a subspace $A$ of dimension $2$, a vector $v$ has no projection when it is perpendicular to each column vector of $A$. This is because if it is perpendicular to a set of vectors, it is also perpendicular to every linear combination of those vectors. E.g. the vector $\begin{bmatrix} 0 & 0 & 1 \end{bmatrix}$ is perpendicular to the subspace of $\begin{bmatrix} \textcolor{#1d4ed8}{1} & \textcolor{#1d4ed8}{0} & \textcolor{#1d4ed8}{0} \\ \textcolor{#be185d}{0} & \textcolor{#be185d}{1} & \textcolor{#be185d}{0} \end{bmatrix}$ or $\begin{bmatrix} \textcolor{#1d4ed8}{1} & \textcolor{#1d4ed8}{2} & \textcolor{#1d4ed8}{0} \\ \textcolor{#be185d}{-2} & \textcolor{#be185d}{1} & \textcolor{#be185d}{0} \end{bmatrix}$. The subspace of both these matrices is the xy-plane and the vector $\begin{bmatrix} 0 & 0 & 1 \end{bmatrix}$ is clearly perpendicular to it.

Let's see this on the canvas. Draw the vector space of $q = [4, -2]$ again, and the vector $n = [2, 4]$, which is perpendicular to $q$ since $\langle [2, 4], [4, -2] \rangle = 8 - 8 = 0$.

```python-editor collapsed
pie.clear()
pie.scalar(50, out='unit')
TEAL, GOLD = '#0d9488', '#ca8a04'
ks = [-1, -0.5, -0.25, 0.33, 0.67, 1]
pie.la_vec2d([4 * k for k in ks], [-2 * k for k in ks], out='fam', stroke=TEAL)
pie.la_vec2d(2, 4, out='nvec', stroke=GOLD)
pie.text('n', 2.3, 4.3, 13, out='lblN', stroke=GOLD)
```

Its projection on the subspace of $q$ is the zero vector, the single rose point at the origin.

```python-editor collapsed
ROSE = '#e11d48'
pie.point(0, 0, out='op', fill=ROSE)
pie.text('projection = 0', -1, -1.3, 12, out='opl_box', stroke=ROSE)
```

In general, a vector $v$ has a zero projection vector on the subspace of a matrix $A$ if $v$ is perpendicular to each column vector of $A$.

---

### 20.4.2 Vector as a sum of projected vector and normal vector
This simple insight allows us to write down the vector $v$ as a sum of two vectors:

$$v = \textcolor{#b45309}{v_{proj}} + \textcolor{#e11d48}{v_{normal}}$$

Here $\textcolor{#e11d48}{v_{normal}}$ is the component of $v$ that is perpendicular to all the column vectors of $A$, and $\textcolor{#b45309}{v_{proj}}$ is the component that is a part of the subspace of $A$.

For the projection of $v = [4, 3]$ on the 1-dimensional subspace of $A = [4, -2]$: draw the vector $v$ and the subspace vector $q$,

```python-editor collapsed
pie.clear()
pie.scalar(50, out='unit')
GRAY, TEAL, GOLD, ROSE = '#71717a', '#0d9488', '#ca8a04', '#e11d48'
pie.la_vec2d(4, 3, out='vvec', stroke=GRAY)
pie.text('v', 4.3, 3.4, 13, out='lblV', stroke=GRAY)
pie.la_vec2d(4, -2, out='qvec', stroke=TEAL)
pie.text('q', 4.3, -2.4, 13, out='lblQ', stroke=TEAL)
```

then split $v$ into $\textcolor{#b45309}{v_{proj}} = [2, -1]$ along the subspace and $\textcolor{#e11d48}{v_{normal}} = [2, 4]$ perpendicular to it, drawn tip-to-tail from $\textcolor{#b45309}{v_{proj}}$:

```python-editor collapsed
pie.la_vec2d(2, -1, out='pvec', stroke=GOLD)
pie.text('v-proj', 1.6, -1.9, 13, out='lblP', stroke=GOLD)
pie.la_vec2d(2, 4, 2, -1, out='nvec', stroke=ROSE)
pie.text('v-normal', 3.6, 1.3, 13, out='lblN', stroke=ROSE)
```

$$\begin{bmatrix} 4 \\ 3 \end{bmatrix} = \begin{bmatrix} \textcolor{#b45309}{2} \\ \textcolor{#b45309}{-1} \end{bmatrix} + \begin{bmatrix} \textcolor{#e11d48}{2} \\ \textcolor{#e11d48}{4} \end{bmatrix}$$

---

## 20.5 Understanding the matrix-vector product Aᵀv
Given an $m$-by-$n$ matrix $A = \begin{bmatrix} \vert & \vert & & \vert \\ \textcolor{#1d4ed8}{c_1} & \textcolor{#be185d}{c_2} & \cdots & \textcolor{#047857}{c_n} \\ \vert & \vert & & \vert \end{bmatrix}$ where each column vector is denoted as $c_i$, and an $m$-dimensional vector $v$, we can see that:

$$\begin{aligned}
A^Tv &= \begin{bmatrix} \text{—} & \textcolor{#1d4ed8}{c_1} & \text{—} \\ \text{—} & \textcolor{#be185d}{c_2} & \text{—} \\ & \vdots & \\ \text{—} & \textcolor{#047857}{c_n} & \text{—} \end{bmatrix} v \\
&= \underbrace{\begin{bmatrix} \langle \textcolor{#1d4ed8}{c_1}, v \rangle \\ \langle \textcolor{#be185d}{c_2}, v \rangle \\ \vdots \\ \langle \textcolor{#047857}{c_n}, v \rangle \end{bmatrix}}_{\text{each row dotted with } v}
\end{aligned}$$

Now, if the vector $v$ is perpendicular to all the column vectors $c_i$ of the matrix $A$, we have $\langle c_i, v \rangle = 0$ for all columns $i$.

In other words, $A^Tv = \begin{bmatrix} 0 \\ 0 \\ \vdots \\ 0 \end{bmatrix}$ if $v$ is perpendicular to the subspace of $A$.

---

## 20.6 The solution
Now let's apply this observation to $v = \textcolor{#b45309}{v_{proj}} + \textcolor{#e11d48}{v_{normal}}$. Since $\textcolor{#e11d48}{v_{normal}}$ is normal (aka perpendicular) to the subspace of the column vectors of $A$, we have $A^T\textcolor{#e11d48}{v_{normal}} = 0$, which gives us:

$$\begin{aligned}
A^Tv &= A^T(\textcolor{#b45309}{v_{proj}} + \textcolor{#e11d48}{v_{normal}}) \\
&= A^T\textcolor{#b45309}{v_{proj}} + \underbrace{A^T\textcolor{#e11d48}{v_{normal}}}_{=\, 0} \\
&= A^T\textcolor{#b45309}{v_{proj}}
\end{aligned}$$

But we saw earlier that $\textcolor{#b45309}{v_{proj}} = Ax$. This gives us:

$$\begin{aligned}
A^Tv &= A^T\textcolor{#b45309}{v_{proj}} \\
&= A^TAx
\end{aligned}$$

$$\implies x = (A^TA)^{-1}A^Tv$$

Thus the projected vector is:

$$\begin{aligned}
\textcolor{#b45309}{v_{proj}} &= Ax \\
&= \underbrace{\textcolor{#6d28d9}{A(A^TA)^{-1}A^T}}_{\text{projection matrix}}v
\end{aligned}$$

Note that $P = \textcolor{#6d28d9}{A(A^TA)^{-1}A^T}$ is also a matrix. We will call it the **projection matrix** of $A$.

Using the example of $v = \begin{bmatrix} 4 \\ 3 \end{bmatrix}$ and $A = \begin{bmatrix} 4 \\ -2 \end{bmatrix}$, we get the projection matrix $P = \frac{1}{20} \begin{bmatrix} 16 & -8 \\ -8 & 4 \end{bmatrix}$. Indeed, we can see that:

$$\begin{aligned}
Pv &= \frac{1}{20} \begin{bmatrix} 16 & -8 \\ -8 & 4 \end{bmatrix} \begin{bmatrix} 4 \\ 3 \end{bmatrix} \\
&= \begin{bmatrix} 2 \\ -1 \end{bmatrix} \\
&= \textcolor{#b45309}{v_{proj}}
\end{aligned}$$

---

## 20.7 Projection matrix is idempotent
A matrix $A$ is called **idempotent** if $A \cdot A = A$. In other words, $A$ is idempotent if $A^2 = A$, which also implies $A^n = A$. It is easy to see that the projection matrix $P$ is idempotent:

$$\begin{aligned}
P^2 &= \left( \textcolor{#6d28d9}{A(A^TA)^{-1}A^T} \right) \left( \textcolor{#6d28d9}{A(A^TA)^{-1}A^T} \right) \\
&= A (A^TA)^{-1} \underbrace{\textcolor{#0d9488}{(A^TA) (A^TA)^{-1}}}_{=\, I} A^T \\
&= A (A^TA)^{-1} A^T \\
&= \textcolor{#6d28d9}{A(A^TA)^{-1}A^T} \\
&= P
\end{aligned}$$

An example for $A = \begin{bmatrix} 4 \\ -2 \end{bmatrix}$:

$$\begin{aligned} P &= \begin{bmatrix} 4 \\ -2 \end{bmatrix} \left( \begin{bmatrix} 4 & -2 \end{bmatrix} \begin{bmatrix} 4 \\ -2 \end{bmatrix} \right)^{-1} \begin{bmatrix} 4 & -2 \end{bmatrix} \\ &= \frac{1}{20} \begin{bmatrix} 4 \\ -2 \end{bmatrix} \begin{bmatrix} 4 & -2 \end{bmatrix} \\ &= \frac{1}{20} \begin{bmatrix} 16 & -8 \\ -8 & 4 \end{bmatrix} \end{aligned}$$

and squaring it gives it back:

$$\begin{aligned}
P^2 &= \frac{1}{20} \begin{bmatrix} 16 & -8 \\ -8 & 4 \end{bmatrix} \cdot \frac{1}{20} \begin{bmatrix} 16 & -8 \\ -8 & 4 \end{bmatrix} \\
&= \frac{1}{20} \begin{bmatrix} 16 & -8 \\ -8 & 4 \end{bmatrix} \\
&= P
\end{aligned}$$

#### Why idempotence makes sense
If we take the projection of the projection of a vector $v$ on a subspace $A$, we get the same thing as the projection of $v$ on $A$: the projected vector already lives in the subspace, so projecting it again leaves it unchanged.

---

## 20.8 Projection matrix of 1-dimensional subspaces
Let's consider one interesting case: projecting a vector on a 1-dimensional vector space of $A$. Since $A$ describes a 1-dimensional space, it only contains one column. In other words, $A$ is just a vector. This means that

$$A^TA = \|A\|^2 \implies (A^TA)^{-1} = \frac{1}{\|A\|^2}$$

Thus the projection matrix of $A$ is:

$$\begin{aligned}
P &= \textcolor{#6d28d9}{A(A^TA)^{-1}A^T} \\
&= \frac{1}{\|A\|^2} AA^T
\end{aligned}$$

Now, if we assume that the vector $A$ has unit norm, then $A^TA = \|A\|^2 = 1$, in which case the projection matrix is simply $AA^T$.

In the interactive visual, we project vectors which are points on an ellipse onto a line (aka a 1D vector subspace). First place the points on an ellipse,

```python-editor collapsed
import math
import numpy as np

pie.clear()
pie.scalar(45, out='unit')
GRAY, TEAL, GOLD = '#71717a', '#0d9488', '#ca8a04'
# 20 points on an ellipse
angles = np.radians(np.arange(20) * 18)
ex = (2 * np.cos(angles) + 2.5 * np.sin(angles)).tolist()
ey = (-np.cos(angles) + 2 * np.sin(angles)).tolist()
pie.point(ex, ey, out='epts', fill=TEAL)
```

then draw the 1D subspace of the unit vector $u = [\cos\theta, \sin\theta]$, a line through the origin.

```python-editor collapsed
tdeg = pie.scalar(0, out='tdeg')
# k·u, where u is the unit vector at angle tdeg (in degrees)
along = pie.lift(lambda tdeg, k, axis: k * (math.cos(math.radians(tdeg)) if axis == 'x' else math.sin(math.radians(tdeg))), pie.Scalar)
pie.line(pie.point(along(tdeg, 4.5, 'x'), along(tdeg, 4.5, 'y'), out='pa', hidden=True),
         pie.point(along(tdeg, -4.5, 'x'), along(tdeg, -4.5, 'y'), out='pb', hidden=True), out='subline', stroke=GRAY)
pie.text(pie.lift(lambda tdeg: f'θ = {tdeg:.0f}°', pie.Text)(tdeg), 0, -5.8, 13, out='theta_box', stroke=GRAY)
```

Each point is sent to its projection $uu^T v$ on the line, dropping perpendicularly along the grey normal arrows.

```python-editor collapsed
# The projections uuᵀv of the ellipse points, one coordinate at a time
def projected(tdeg, axis):
    u = np.array([math.cos(math.radians(tdeg)), math.sin(math.radians(tdeg))])
    d = u[0] * np.array(ex) + u[1] * np.array(ey)
    return d * u[0] if axis == 'x' else d * u[1]

proj = pie.lift(projected, pie.Array[pie.Scalar])
projx, projy = proj(tdeg, 'x'), proj(tdeg, 'y')
minus = pie.lift(lambda p, e: np.array(p) - np.array(e), pie.Array[pie.Scalar])
pie.la_vec2d(minus(projx, ex), minus(projy, ey), ex, ey, out='norms', stroke=GRAY)
pie.point(projx, projy, out='ppts', fill=GOLD)
```

The live readout shows the projection matrix $uu^T$.

```python-editor collapsed
uu = pie.lift(lambda tdeg, i, j: (math.cos(math.radians(tdeg)), math.sin(math.radians(tdeg)))[i] * (math.cos(math.radians(tdeg)), math.sin(math.radians(tdeg)))[j], pie.Scalar)
pie.la_array_to_texts([[uu(tdeg, 0, 0), uu(tdeg, 0, 1)], [uu(tdeg, 1, 0), uu(tdeg, 1, 1)]], -4.4, 4.2, 1.2, 0.6, out='tb', stroke=GOLD)
pie.text('As the subspace rotates, every ellipse point slides along its normal onto the line: the whole map is one matrix, uuᵀ.', 2.2, 4.4, 12, 4, -1, out='sumBox', stroke=GRAY)
```

Now rotate the subspace and watch the projections and the matrix update together,

```python-editor collapsed
pie.translate_scalar_to(tdeg, 180, animate=True)
```

or rotate it back.

```python-editor collapsed
pie.translate_scalar_to(tdeg, 0, animate=True)
```

Here's how it is implemented in Python (elementary operations like matrix-matrix product and matrix-vector product are not shown):

```python
import math
angle = 0.4 # this could be any angle
# subspace matrix
matrix = [[math.cos(angle), math.sin(angle)]]
matrix_transpose = [[math.cos(angle)],[math.sin(angle)]]
projection_matrix = get_matrix_matrix_product(matrix, matrix_transpose)

input_vectors = [[1,2],[-3,2],[3,4]] # could be replaced by points on an ellipse
projected_vectors = get_matrix_matrix_product(projection_matrix, input_vectors)
```

Note that here we set the `subspace_vector` to be a unit vector of the form $a = [\cos\theta, \sin\theta]$ so that the projection matrix assumed the much simpler form $aa^T$.

In the next chapter we will encounter (unit) vector products of the form $uu^T$ again, in the context of symmetric matrices.

---

[← 19. Markov matrices](/la/19_markov_matrices)  ·  [21. Symmetric matrix-vector product →](/la/21_symmetric_matrix_vector_product)
