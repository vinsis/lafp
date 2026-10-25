---
title: Dimension reduction with SVD and the covariance matrix
description: Store n-dimensional data points with fewer dimensions by taking the SVD of the covariance matrix, worked through on a small dataset.
canvas: left
---

# 24. Dimension reduction

<details>
<summary>Review</summary>

The SVD chapter showed that any matrix rotates, scales, and rotates again, with the directions given by the eigenvectors of $MM^T$ and $M^TM$. The PSD chapter showed that any matrix of the form $AA^T$ is symmetric positive semi-definite, so its eigenvalues are non-negative and its eigenvectors are perpendicular to each other.

</details>

One of the more common applications of SVD is dimension reduction. It is used in an algorithm which allows storing $n$-dimensional points of a dataset as $m$-dimensional points where $m < n$. The key lies in figuring out what matrix to take the SVD of. But before we get into those details, let's start with the problem first as usual.

---

## 24.1 Understanding the problem
Let's say you are given a dataset of 20 items. Each item is a 2-dimensional point. Plot each item as a dot on the canvas.

```python-editor collapsed
import numpy as np

pie.clear()
pie.scalar(45, out='unit')
DOT, TEAL = '#3f3f46', '#0d9488'
XS = np.linspace(-2.5, 2.5, 20).tolist()
YS = [2.23, 2.28, 2.39, 2.49, 2.7, 2.9, 2.57, 2.8, 2.82, 2.93, 3.14, 2.87, 3.28, 3.06, 3.37, 3.28, 3.28, 3.44, 3.7, 3.67]
pts = pie.point(XS, YS, out='pts', fill=DOT)
pie.text('20 two-dimensional points, roughly on a line', 0, -3.5, 13, 4, -1, out='cap_box')
```

Here's how these points were generated:

```python
import numpy as np
xs = np.linspace(0, 5, 20) - 2.5
ys = 3 + 0.25 * xs + np.random.normal(0, 0.1, size=xs.shape)
```

You may have noticed that these points roughly lie in a straight line. Now picture this scenario: what if the points were arranged perfectly in a straight line (shown in teal)? How could we use this information?

```python-editor collapsed
pie.set_fill(pts, TEAL)
pie.translate_point_to(pts, XS, [3 + x / 4 for x in XS], animate=True)
```

- In this scenario, the first observation we make is that _even though the points are 2-dimensional, they lie in a 1-dimensional subspace_. A vector corresponding to this subspace has the same direction as the direction in which these points are arranged.
- In this 1-dimensional space, each point can be described by only one number. Thus we could save these 20 items by using only 20 numbers instead of 40 numbers (1 for the x-value and 1 for the y-value of each point).

Now, even though the points in our dataset are not arranged perfectly in a straight line, we can still _approximate_ the dataset by projecting the points on a straight line (aka a 1D subspace). By making this assumption, we can reduce the dimensionality of the points from 2 to 1. And we don't lose much information if this approximation is reasonable. This is the idea behind dimension reduction. In general:

> We can approximate a set of $n$-dimensional points by projecting it on an $m$-dimensional subspace where $m < n$. Then each point can be represented by an $m$-dimensional vector instead of an $n$-dimensional vector.

In general, we can represent the dataset by an $n$-by-$L$ matrix $D$ where each column is an $n$-dimensional point $u_i$ and there are $L$ such points in the dataset:

$$D = \begin{bmatrix} \vert & \vert & & \vert \\ u_1 & u_2 & \cdots & u_L \\ \vert & \vert & & \vert \end{bmatrix}$$

---

## 24.2 An idea for a solution
Now the question is: how do we find this subspace? In other words, how do we find the vectors that describe this subspace?

Clearly, we want to project each of these points on a subspace. In our case, this subspace is a 1D subspace. But which subspace is suitable for this? Let's visualize this for the possible 1D subspaces in the 2D plane. Draw a 1D subspace as a grey line through the origin alongside the dataset points.

```python-editor collapsed
import math
import numpy as np

pie.clear()
pie.scalar(45, out='unit')
DOT, TEAL, GRAY, LIGHT_GRAY = '#3f3f46', '#0d9488', '#71717a', '#d4d4d8'
XS = np.linspace(-2.5, 2.5, 20).tolist()
YS = [2.23, 2.28, 2.39, 2.49, 2.7, 2.9, 2.57, 2.8, 2.82, 2.93, 3.14, 2.87, 3.28, 3.06, 3.37, 3.28, 3.28, 3.44, 3.7, 3.67]
pts = pie.point(XS, YS, out='pts', fill=DOT)
tdeg = pie.scalar(90, out='tdeg')
# k·u, where u is the unit vector at angle tdeg (in degrees)
along = pie.lift(lambda tdeg, k, axis: k * (math.cos(math.radians(tdeg)) if axis == 'x' else math.sin(math.radians(tdeg))), pie.Scalar)
pie.line(pie.point(along(tdeg, 5, 'x'), along(tdeg, 5, 'y'), out='pA', hidden=True),
         pie.point(along(tdeg, -5, 'x'), along(tdeg, -5, 'y'), out='pB', hidden=True), out='sub', stroke=GRAY)
pie.text(pie.lift(lambda tdeg: f'θ = {tdeg:.1f}°', pie.Text)(tdeg), -5.5, 6.2, 14, out='readout_box')
```

Then project every point on this subspace: the teal points are the projections, and each faint line joins a point to its projection.

```python-editor collapsed
# The projections of the data points on the line at angle tdeg, one coordinate at a time
def projected(tdeg, axis):
    u = (math.cos(math.radians(tdeg)), math.sin(math.radians(tdeg)))
    d = u[0] * np.array(XS) + u[1] * np.array(YS)
    return d * (u[0] if axis == 'x' else u[1])

proj = pie.lift(projected, pie.Array[pie.Scalar])
ppts = pie.point(proj(tdeg, 'x'), proj(tdeg, 'y'), out='ppts', fill=TEAL)
pie.line(pts, ppts, out='nlines', stroke=LIGHT_GRAY)
pie.text('grey = candidate subspace; teal = projections', 5.0, -6.0, 12, 3.6, -1, out='note_box')
```

Now sweep the subspace through all possible directions and watch how the projections spread out or bunch up.

```python-editor collapsed
pie.translate_scalar_to(tdeg, -90, animate=True)
```

Finally align the subspace with the direction in which the points vary the most: this is where the projections stay most spread out and the joining lines are shortest, so the least information is lost.

```python-editor collapsed
pie.translate_scalar_to(tdeg, 15.2, animate=True)
```

As you may have noticed, the best 1D subspace for projecting the 2D points on is the one which aligns with the direction in which the points vary the most. This direction is roughly given by the vector $\begin{bmatrix} 4 & 1 \end{bmatrix}^T$. In general, here is the strategy for finding the optimal subspace:

- Find the direction $\textcolor{#1d4ed8}{v_1}$ in which the data varies the most. This becomes the first 1D subspace you want to project each $n$-dimensional point on.
- Find the direction $\textcolor{#be185d}{v_2}$ perpendicular to $v_1$ in which the data varies the most. This becomes the second 1D subspace on which you want to project each of your points.
- Find the direction $v_3$ perpendicular to both $v_1, v_2$ in which the data varies the most. This becomes the third 1D subspace to project each point on.
- ...
- Find the direction $\textcolor{#0d9488}{v_m}$ perpendicular to the directions $v_1, v_2, \ldots, v_{m-1}$ in which the data varies the most. This becomes the $m$-th 1D subspace to project each point on.

Note that each of these $m$ vectors $v_i$ is $n$-dimensional. Once you have the matrix of all $m$ such directions $P = \begin{bmatrix} \vert & \vert & & \vert \\ v_1 & v_2 & \cdots & v_m \\ \vert & \vert & & \vert \end{bmatrix}$, getting the projections on all of these subspaces is as easy as one matrix-matrix multiplication $P^TD$:

$$\underbrace{\begin{bmatrix} \text{—} & \textcolor{#1d4ed8}{v_1^T} & \text{—} \\ \text{—} & \textcolor{#be185d}{v_2^T} & \text{—} \\ & \vdots & \\ \text{—} & \textcolor{#0d9488}{v_m^T} & \text{—} \end{bmatrix}}_{P^T} \underbrace{\begin{bmatrix} \vert & \vert & & \vert \\ u_1 & u_2 & \cdots & u_L \\ \vert & \vert & & \vert \end{bmatrix}}_{D} = \begin{bmatrix} \textcolor{#1d4ed8}{\langle v_1, u_1 \rangle} & \textcolor{#1d4ed8}{\langle v_1, u_2 \rangle} & \cdots & \textcolor{#1d4ed8}{\langle v_1, u_L \rangle} \\ \textcolor{#be185d}{\langle v_2, u_1 \rangle} & \textcolor{#be185d}{\langle v_2, u_2 \rangle} & \cdots & \textcolor{#be185d}{\langle v_2, u_L \rangle} \\ \vdots & \vdots & \ddots & \vdots \\ \textcolor{#0d9488}{\langle v_m, u_1 \rangle} & \textcolor{#0d9488}{\langle v_m, u_2 \rangle} & \cdots & \textcolor{#0d9488}{\langle v_m, u_L \rangle} \end{bmatrix}$$

The $j$-th column of this matrix holds the projections of the point $u_j$ on the top $m$ subspaces in which the dataset varies the most. Also note that this new dataset matrix is now $m$-by-$L$ (as compared to $n$-by-$L$ before).

---

## 24.3 Covariance matrix
Now the question is: how can we find these directions $v_1, v_2, \ldots, v_m$? The answer lies in the covariance matrix. It is an $n$-by-$n$ matrix where the entry at the $i$-th row and $j$-th column, $C[i,j]$, is the covariance of the $i$-th and $j$-th dimensions of the features.

---

### 24.3.1 What is covariance?
Covariance is a function $\text{Cov}(\cdot,\cdot)$ that takes two random variables $\alpha, \beta$ as inputs. Its output is the [expected value](https://en.wikipedia.org/wiki/Expected_value) of $(\alpha - \text{mean of } \alpha)(\beta - \text{mean of } \beta)$. Roughly, it is a measure of:

- on average, how often $\alpha$ and $\beta$ are larger or smaller than their respective means at the same time
- on average, by what amount $\alpha$ and $\beta$ vary from their respective means at the same time.

Note that $\text{Cov}(\alpha,\alpha) = \text{Var}(\alpha)$ for any random variable $\alpha$, and $\text{Cov}(\alpha,\beta) = \text{Cov}(\beta,\alpha)$.

In our example, the points in the dataset are 2-dimensional. The two features are the x-coordinate and the y-coordinate of a point. The covariance matrix in this case looks like:

$$\begin{aligned}
C &= \begin{bmatrix} \text{Cov}(x,x) & \text{Cov}(x,y) \\ \text{Cov}(y,x) & \text{Cov}(y,y) \end{bmatrix} \\
&= \begin{bmatrix} \text{Var}(x) & \text{Cov}(x,y) \\ \text{Cov}(x,y) & \text{Var}(y) \end{bmatrix}
\end{aligned}$$

We can calculate these values from the dataset (with $L = 20$ points):

- $\text{Cov}(x,y) = \sum_{i=1}^{20} (x_i - x_{mean})(y_i - y_{mean}) \, / \, (20-1)$
- $\text{Cov}(x,x) = \sum_{i=1}^{20} (x_i - x_{mean})(x_i - x_{mean}) \, / \, (20-1)$
- $\text{Cov}(y,y) = \sum_{i=1}^{20} (y_i - y_{mean})(y_i - y_{mean}) \, / \, (20-1)$

Here $x_{mean} = \sum x_i / 20$ and $y_{mean} = \sum y_i / 20$.

However there is a much easier way to calculate the entire covariance matrix at once. First we need to center the dataset:

```python
D_mean = [column_vector - mean_vector for column_vector in D]
```

To be more precise, if we assign $u_{mean} = \begin{bmatrix} x_{mean} & y_{mean} \end{bmatrix}^T$, we have:

$$D_{mean} = \begin{bmatrix} \vert & \vert & & \vert \\ u_1 - u_{mean} & u_2 - u_{mean} & \cdots & u_L - u_{mean} \\ \vert & \vert & & \vert \end{bmatrix}$$

The actual code to do so using `numpy` is:

```python
D = np.stack([xs, ys], axis=-1).T
D_mean = D - D.mean(axis=-1, keepdims=True)
```

Let's see what centering does. Plot the original dataset once more,

```python-editor collapsed
import numpy as np

pie.clear()
pie.scalar(45, out='unit')
DOT, TEAL, GOLD = '#3f3f46', '#0d9488', '#ca8a04'
XS = np.linspace(-2.5, 2.5, 20)
YS = np.array([2.23, 2.28, 2.39, 2.49, 2.7, 2.9, 2.57, 2.8, 2.82, 2.93, 3.14, 2.87, 3.28, 3.06, 3.37, 3.28, 3.28, 3.44, 3.7, 3.67])
pie.point(XS.tolist(), YS.tolist(), out='pts', fill=DOT)
pie.text('original', 0, 4.3, 13, out='lbl_original_box', stroke=DOT)
```

then the centered points in teal: the same cloud, shifted so its mean sits at the origin.

```python-editor collapsed
pie.point((XS - XS.mean()).tolist(), (YS - YS.mean()).tolist(), out='cpts', fill=TEAL)
pie.text('centered', 0, -1.6, 13, out='lbl_centered_box', stroke=TEAL)
```

Once we have $D_{mean}$, the covariance matrix is $C = D_{mean}D_{mean}^T \, / \, (L-1)$, which for our dataset works out to $C = \begin{bmatrix} 2.42 & 0.65 \\ 0.65 & 0.19 \end{bmatrix}$. You can make sure that this is indeed equal to the matrix of $\text{Var}$ and $\text{Cov}$ entries above. To see that the covariance matrix has already captured the direction in which the features vary the most, draw the two columns of $C$ as arrows from the origin: both point along the tilt of the point cloud.

```python-editor collapsed
o = pie.point(0, 0, out='o', hidden=True)
pie.annotate_arrow(o, pie.point(2.42, 0.65, out='c1tip', hidden=True), out='arr1', stroke=GOLD)
pie.annotate_arrow(o, pie.point(0.65, 0.19, out='c2tip', hidden=True), out='arr2', stroke=GOLD)
pie.text('c₁', 2.68, 1.13, 13, out='lbl_c1_box', stroke=GOLD)
pie.text('c₂', 0.69, 0.83, 13, out='lbl_c2_box', stroke=GOLD)
```

---

## 24.4 Covariance matrix is symmetric positive semi-definite
Let's take a detour from the problem and talk about the covariance matrix a bit. This matrix is obviously symmetric. But it is also PSD: any matrix of the form $AA^T$ is symmetric PSD, and if $B$ is a symmetric PSD matrix then for any non-negative scalar $c$, the matrix $cB$ is also symmetric PSD. The covariance matrix $C = D_{mean}D_{mean}^T \, / \, (L-1)$ is exactly of this form.

Since the covariance matrix is PSD, its eigenvalues are all non-negative and its eigenvectors are all perpendicular to each other.

---

## 24.5 Complete solution
Now let's come back to the problem. Here comes the most useful insight:

- The eigenvector of $C$ corresponding to the largest eigenvalue is the direction in which the features vary the most: $\textcolor{#1d4ed8}{v_1}$.
- The eigenvector corresponding to the second largest eigenvalue is the direction perpendicular to $v_1$ in which the features vary the most: $\textcolor{#be185d}{v_2}$.
- ...
- The eigenvector corresponding to the $n$-th largest eigenvalue is the direction perpendicular to $v_1, v_2, \ldots, v_{n-1}$ in which the features vary the most: $\textcolor{#0d9488}{v_n}$.

In this example dataset, the covariance matrix is $C = \begin{bmatrix} 2.42 & 0.65 \\ 0.65 & 0.19 \end{bmatrix}$ and its unit eigenvectors are the columns of $\begin{bmatrix} 0.965 & -0.261 \\ 0.261 & 0.965 \end{bmatrix}$ with the corresponding eigenvalues $2.6$ and $0.014$.

Once we have found these vectors which correspond to the 1D subspaces with maximum variance, we can simply take the first $m$ of these vectors to create the matrix $P$ above and calculate the projections of the $n$-dimensional points on these $m$ subspaces. In our example, each point can be approximated by taking its dot product with the first eigenvector $\textcolor{#1d4ed8}{v_1} = \begin{bmatrix} 0.965 & 0.261 \end{bmatrix}^T$. These dot products look like:

$$\begin{bmatrix} -1.83 & -1.56 & -1.28 & -1.00 & \cdots & 2.80 & 3.13 & 3.37 \end{bmatrix}$$

This is the same dataset as we saw earlier but with its dimension reduced from 2 to 1.

In the visual below, we project the points on a 1D subspace, but this time we also show the subspaces corresponding to the eigenvectors of the covariance matrix. Draw the two eigenvector subspaces of the covariance matrix in rose.

```python-editor collapsed
import math
import numpy as np

pie.clear()
pie.scalar(45, out='unit')
DOT, TEAL, GRAY, LIGHT_GRAY, ROSE = '#3f3f46', '#0d9488', '#71717a', '#d4d4d8', '#e11d48'
XS = np.linspace(-2.5, 2.5, 20).tolist()
YS = [2.23, 2.28, 2.39, 2.49, 2.7, 2.9, 2.57, 2.8, 2.82, 2.93, 3.14, 2.87, 3.28, 3.06, 3.37, 3.28, 3.28, 3.44, 3.7, 3.67]
pts = pie.point(XS, YS, out='pts', fill=DOT)
pie.line(pie.point(4.83, 1.31, out='pe1a', hidden=True), pie.point(-4.83, -1.31, out='pe1b', hidden=True), out='eline1', stroke=ROSE)
pie.line(pie.point(-1.31, 4.83, out='pe2a', hidden=True), pie.point(1.31, -4.83, out='pe2b', hidden=True), out='eline2', stroke=ROSE)
pie.text('v₁ (λ=2.6)', 5.55, 1.51, 13, out='lbl_v1_box', stroke=ROSE)
pie.text('v₂ (λ=0.014)', -1.51, 5.55, 13, out='lbl_v2_box', stroke=ROSE)
```

Then project the points on a movable grey 1D subspace as before.

```python-editor collapsed
tdeg = pie.scalar(75, out='tdeg2')
# k·u, where u is the unit vector at angle tdeg (in degrees)
along = pie.lift(lambda tdeg, k, axis: k * (math.cos(math.radians(tdeg)) if axis == 'x' else math.sin(math.radians(tdeg))), pie.Scalar)
pie.line(pie.point(along(tdeg, 5, 'x'), along(tdeg, 5, 'y'), out='pA2', hidden=True),
         pie.point(along(tdeg, -5, 'x'), along(tdeg, -5, 'y'), out='pB2', hidden=True), out='sub2', stroke=GRAY)
# The projections of the data points on the line at angle tdeg, one coordinate at a time
def projected(tdeg, axis):
    u = (math.cos(math.radians(tdeg)), math.sin(math.radians(tdeg)))
    d = u[0] * np.array(XS) + u[1] * np.array(YS)
    return d * (u[0] if axis == 'x' else u[1])

proj = pie.lift(projected, pie.Array[pie.Scalar])
ppts = pie.point(proj(tdeg, 'x'), proj(tdeg, 'y'), out='ppts2', fill=TEAL)
pie.line(pts, ppts, out='nlines2', stroke=LIGHT_GRAY)
```

Now sweep the subspace around,

```python-editor collapsed
pie.translate_scalar_to(tdeg, -45, animate=True)
```

then align it with the first eigenvector: the best approximation is obtained when the input points are projected on the eigenvector with the largest eigenvalue.

```python-editor collapsed
pie.translate_scalar_to(tdeg, 15.2, animate=True)
```

The code for the entire process looks like:

```python
num_features = 10
num_points = 100
# this would be the actual dataset you want to reduce the dimensions of
D = np.random.normal(0, 1, size=(num_features, num_points))
D_mean = D - D.mean(axis=-1, keepdims=True)
C = (D_mean @ D_mean.T) / (D.shape[1] - 1)
U, _, _ = np.linalg.svd(C)
num_features_reduced = 5
D_reduced_dim = U[:, :num_features_reduced].T @ D_mean
```

Note the last line: the SVD of the (symmetric PSD) covariance matrix hands us its eigenvectors in $U$, sorted by decreasing eigenvalue, and one matrix multiplication projects the whole dataset on the top $m$ of them.

---

[← 23. SVD](/la/23_svd)  ·  [25. What next →](/la/25_what_next)
