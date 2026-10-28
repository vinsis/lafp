---
title: Birkhoff-von-Neumann algorithm
description: An algorithm that writes any doubly stochastic matrix as a convex sum of permutation matrices, based on counting its zeros, with an example.
canvas: left
sidebar: _series.md
---

# Birkhoff-von-Neumann algorithm

The Birkhoff-von Neumann theorem states that every doubly stochastic matrix can be written as a convex sum of permutation matrices. Here we look at the algorithm to find such a convex sum. The idea is focused on the number of zeros in the matrix.

---

## 0. Zeros in a doubly stochastic matrix

We start with a few observations:

1. Each permutation matrix has exactly one non-zero entry in each row and each column.
2. Number of zeros in a doubly stochastic matrix is maximum when it is a permutation matrix. In other words, a `n-by-n` doubly stochastic matrix cannot have fewer than `n` non-zero entries, which happens when the matrix is a permutation matrix.

```python-editor collapsed
import numpy as np

pie.clear()
pie.scalar(55, out='unit')
pie.scalar(0, out='gridOpacity')
TEAL, GRAY, AMBER = '#0d9488', '#71717a', '#b45309'

# The hexagon's vertices P1 ... P6; the odd ones are the even permutations
V = [(-2.1, 2.2), (-0.4546, 1.25), (-0.4546, -0.65), (-2.1, -1.6), (-3.7454, -0.65), (-3.7454, 1.25)]
corners = [pie.point(x, y, hidden=True) for x, y in V]
pie.polygon(corners, out='poly_0', fill='#f4f4f5', stroke='#a1a1aa')
pie.line(corners[0], corners[2], out='line_0', stroke=TEAL)
pie.line(corners[2], corners[4], out='line_1', stroke=TEAL)
pie.line(corners[4], corners[0], out='line_2', stroke=TEAL)
for i, (x, y) in enumerate(V, 1):
    pie.point(x, y, out=f'vert_p{i}', fill=TEAL if i % 2 else GRAY)

P1 = np.eye(3)
P3 = np.array([[0, 0, 1], [1, 0, 0], [0, 1, 0]], dtype=float)
P5 = np.array([[0, 1, 0], [0, 0, 1], [1, 0, 0]], dtype=float)
A, B, C = np.array(V[0]), np.array(V[2]), np.array(V[4])

# s from 0 to 3 walks the triangle a → b → c → a, one edge per unit of s
def along_triangle(s, a, b, c):
    seg1, seg2, seg3 = (min(max(s - k, 0), 1) for k in range(3))
    return a + seg1 * (b - a) + seg2 * (c - b) + seg3 * (a - c)

s = pie.scalar(0, out='s')
pie.lift(lambda s: along_triangle(s, A, B, C).tolist(), pie.Point)(s, out='moving_point', fill=AMBER)
mat = pie.lift(lambda s: along_triangle(s, P1, P3, P5), pie.Array[pie.Scalar])(s, out='mat')
pie.la_array_to_texts(mat, 1.1, 1.55, 0.9090909090909091, 0.4727272727272727, 16, out='arr_0', stroke=AMBER)

# vertex labels: (text, x, y, color)
labels = [('P1', -2.1, 2.65, TEAL), ('P2', -0.0648, 1.475, GRAY), ('P3', -0.0648, -0.875, TEAL),
          ('P4', -2.1, -2.05, GRAY), ('P5', -4.1352, -0.875, TEAL), ('P6', -4.1352, 1.475, GRAY)]
for k, (t, x, y, color) in enumerate(labels):
    pie.text(t, x, y, 16, out=f'tbox_{k}', stroke=color)
pie.text('M(t) = (1−t)·Pa + t·Pb', 2.463636363636364, 2.45, 15, out='tbox_6', stroke=AMBER)
pie.text('The even permutations P₁, P₃, P₅ form a triangle inscribed in the hexagon. Moving along an edge '
         'sweeps out a doubly stochastic matrix (1−t)·Pa + t·Pb, shown live on the right.',
         0, 4.5, 14, 7, -1, out='tbox_7')
tbox_8 = pie.text('Number of zeros: 6 at each vertex (a pure permutation matrix), only 3 along the interior of an edge.',
                  0, -3.6, 13, 7, -1, out='tbox_8', stroke=GRAY)
```

The six permutation matrices of a length-3 vector sit at the vertices of a hexagon, the Birkhoff polytope for $n=3$. Of these, $P_1$, $P_3$ and $P_5$ are the even permutations, singled out in teal, and they form a triangle inscribed in the hexagon.

An amber point starts at $P_1$, and a live $3\times 3$ readout on the right always shows exactly the matrix the point currently represents, initially $P_1$ itself, a pure permutation matrix with 6 zeros.

Each vertex is labeled, and moving along an edge sweeps out exactly $M(t) = (1-t)\cdot P_a + t\cdot P_b$, the convex combination of that edge's two endpoint permutation matrices.

Watch the zero count as the point moves along the triangle: 6 zeros at a vertex, a pure permutation matrix, dropping to only 3 zeros along the interior of an edge.

If we interpolate along the edge $P_1 \to P_3$, the amber point slides across the polytope and the matrix on the right morphs continuously from $P_1$ to $P_3$. Away from the two endpoints it is no longer a permutation matrix at all, and the number of zeros drops from 6 down to 3.

```python-editor collapsed
pie.translate_scalar_to(s, 1, animate=True)
```

Continuing, interpolating $P_3 \to P_5$ retraces the same pattern along the second edge of the triangle: 6 zeros at $P_3$, dropping to 3 in the interior, climbing back toward 6 as the point approaches $P_5$.

```python-editor collapsed
pie.translate_scalar_to(s, 2, animate=True)
```

Finally, closing the triangle $P_5 \to P_1$ completes the loop. Along every edge of the Birkhoff polytope the story repeats: the number of zeros in the resulting matrix stays high (6) exactly at the vertices, the permutation matrices, and drops to 3 along the interior of an edge.

```python-editor collapsed
pie.translate_scalar_to(s, 3, animate=True)
```

This forms the basis for the Birkhoff-von Neumann theorem, which states that every doubly stochastic matrix can be written as a convex sum of permutation matrices. The idea is to increase the number of zeros in the matrix gradually. We use induction on the number of zeros in the matrix to prove it while also generating a convex sum.

---

### 0.1. Outline of the proof

We begin with the following observation: in any doubly stochastic matrix of size `n x n`, one can always pick `n` non-zero entries such that each row and each column contains exactly one of these entries. Another way to say it is:

> For any doubly stochastic matrix `D`, there exists a permutation matrix `P` such that $P_{ij} \ne 0 \Rightarrow D_{ij} \ne 0$.

An example is shown below (taken from [Wikipedia](https://en.wikipedia.org/wiki/Doubly_stochastic_matrix#Proof_of_the_Birkhoff%E2%80%93von_Neumann_theorem)). The three boxed non-zero values correspond to the permutation matrix shown to their right:

$$\begin{bmatrix} 7/12 & 0 & \textcolor{#b45309}{\boxed{5/12}} \\ \textcolor{#b45309}{\boxed{2/12}} & 6/12 & 4/12 \\ 3/12 & \textcolor{#b45309}{\boxed{6/12}} & 3/12 \end{bmatrix} \qquad \begin{bmatrix} 0 & 0 & \textcolor{#b45309}{\boxed{1}} \\ \textcolor{#b45309}{\boxed{1}} & 0 & 0 \\ 0 & \textcolor{#b45309}{\boxed{1}} & 0 \end{bmatrix}$$

The proof of it comes from [Hall's Marriage Theorem](https://en.wikipedia.org/wiki/Hall%27s_marriage_theorem). One can create a bipartite graph where the rows form one set of vertices and the columns form the other set of vertices. An edge exists between a row and a column if the corresponding entry in the matrix is non-zero. It can be shown that there exists a perfect matching in this graph for a doubly stochastic matrix.

---

### 0.2. Example

The algorithm finds a matching that includes the smallest element of the matrix and its corresponding permutation matrix. Subtracting the permutation matrix scaled by the smallest element results in a new matrix with at least one more zero than the original matrix. This new matrix also has the same row and column sums, and is therefore a scaled doubly stochastic matrix. An example of this procedure for the above matrix is shown below:

$$\underbrace{\begin{bmatrix} 7/12 & 0 & \textcolor{#b45309}{\boxed{5/12}} \\ \underbrace{\textcolor{#b45309}{\boxed{2/12}}}_{{\text{smallest}}} & 6/12 & 4/12 \\ 3/12 & \textcolor{#b45309}{\boxed{6/12}} & 3/12 \end{bmatrix}}_{\textcolor{#e11d48}{\text{zeros: 1}}} - \textcolor{#b45309}{\frac{2}{12}}\begin{bmatrix} 0 & 0 & \boxed{1} \\ \boxed{1} & 0 & 0 \\ 0 & \boxed{1} & 0 \end{bmatrix} = \frac{10}{12}\underbrace{\begin{bmatrix} 7/10 & 0 & 3/10 \\ 0 & 6/10 & 4/10 \\ 3/10 & 4/10 & 3/10 \end{bmatrix}}_{\textcolor{#e11d48}{\text{zeros: 2}}}$$

Thus, we were able to express a doubly stochastic matrix as a sum of another (scaled) doubly stochastic matrix and a (scaled) permutation matrix. Using induction, we can show that continuing this process will eventually yield a convex sum of permutation matrices (how can you use induction to show that the sum of coefficients is 1?).

Now we look into how to convert (almost) any non-negative square matrix into a doubly stochastic matrix. This is where the Sinkhorn-Knopp algorithm comes into play.

---

[← Doubly stochastic matrices](/series/permutation_sinkhorn/4_doubly_stochastic_matrices)  ·  [Matrix scaling →](/series/permutation_sinkhorn/6_matrix_scaling)
