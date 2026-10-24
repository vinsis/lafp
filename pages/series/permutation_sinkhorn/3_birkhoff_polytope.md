---
title: Birkhoff polytope
---

# Birkhoff polytope

For `n` items, there are `n!` permutations possible. Each corresponding `n x n` permutation matrix can be seen as a `n²`-dimensional vector. The convex hull of all these `n!` vectors forms a polytope called the Birkhoff polytope.

Eg for `n=3`, the Birkhoff polytope has `3! = 6` points where each point is a `3 x 3` permutation matrix. There are two interesting properties of this polytope which we explore below.

---

## 0. Edges of Birkhoff polytope

There is an edge between two points only if they differ by one cyclic permutation. In other words, if a cyclic permutation `P` exists such that $A\textcolor{#0d9488}{P} = B$ for two permutations `A` and `B` then these points are connected. The remaining points are not connected because the line joining them lies in the face of the polytope. Let's illustrate this with an example.

The Birkhoff polytope for `n=5` has `5! = 120` vertices. Consider 4 of these vertices `A,B,C,D` corresponding to the permutations:

| Vertex | Permutation |
|--------|-------------|
| A | [1, 2, 3, 4, 5] |
| B | [3, 1, 2, 4, 5] |
| C | [1, 2, 3, 5, 4] |
| D | [3, 1, 2, 5, 4] |

The permutations `AB, AC, BD` and `CD` differ only by one cyclic permutation. Hence they are connected by an edge. The pairs `AD` and `BC` are the diagonals: they lie in the face of the polytope. Now we prove that `ABCD` is indeed a 2D plane.

We have a point mid-way between A and D:

$$\frac{\textcolor{#1d4ed8}{A}+\textcolor{#b45309}{D}}{2} = \textcolor{#0d9488}{0.5}\,\textcolor{#1d4ed8}{A} + \textcolor{#0d9488}{0.5}\,\textcolor{#b45309}{D}$$

and a point mid-way between B and C:

$$\frac{\textcolor{#be185d}{B}+\textcolor{#047857}{C}}{2} = \textcolor{#0d9488}{0.5}\,\textcolor{#be185d}{B} + \textcolor{#0d9488}{0.5}\,\textcolor{#047857}{C}$$

Note that both these points are the same doubly stochastic matrix:

$$\begin{bmatrix} 0.5 & 0.5 & 0 & 0 & 0 \\ 0 & 0.5 & 0.5 & 0 & 0 \\ 0.5 & 0 & 0.5 & 0 & 0 \\ 0 & 0 & 0 & 0.5 & 0.5 \\ 0 & 0 & 0 & 0.5 & 0.5 \end{bmatrix}$$

Thus `ABCD` forms a plane. We do not join `A` and `D` or `B` and `C` because the line joining them lies in the face of the polytope.

---

### 0.1. Faces of the polytope

The 2-faces of the polytope are either a triangle or a rectangle. If 3 permutations differ from each other by a single cyclic permutation then they form a triangle. All permutations for `n=3` differ by a single cyclic permutation. Hence all faces of the polytope for `n=3` are triangles.

We already saw an example of a rectangle in the previous section. If there is **another** permutation that differs from either of the 4 permutations `A,B,C,D`, it has to lie outside the plane. The reason is that the two directions in the plane correspond to specific cycles, and they span the entire plane.

---

## 1. Points inside the polytope

Another remarkable property about this polytope is that every point inside it is a non-negative matrix whose rows and columns sum to 1. Such a matrix is called a doubly stochastic matrix or bistochastic matrix. Note that any interior point can be expressed as a convex sum of the vertices. An example for `3 x 3` matrices is shown below:

#### Verification using Python

```python
import torch

# six vertices corresponding to the six permutations of three items
P1 = torch.eye(3)
P2 = torch.Tensor([[0,1,0],[1,0,0],[0,0,1]])
P3 = torch.Tensor([[0,0,1],[0,1,0],[1,0,0]])
P4 = torch.Tensor([[1,0,0],[0,0,1],[0,1,0]])
P5 = torch.Tensor([[0,0,1],[1,0,0],[0,1,0]])
P6 = torch.Tensor([[0,1,0],[0,0,1],[1,0,0]])

# pick a random point inside the polytope
P_full = torch.stack([P1, P2, P3, P4, P5, P6], dim=-1)  # (3,3,6)
x = torch.randn(6).softmax(dim=-1)                      #    (,6)
point = (P_full * x).sum(dim=-1)                        # (3,3,6) => (3,3)

# point is a doubly stochastic matrix
print(f'Row sums: {point.sum(dim=1)}')
print(f'Col sums: {point.sum(dim=0)}')

### Output: ###
Row sums: tensor([1., 1., 1.])
Col sums: tensor([1., 1., 1.])
```

This is also known as the Birkhoff-von Neumann theorem.

Doubly stochastic matrices have some interesting and useful properties which we will explore next.

---

[← Circulant matrices](/series/permutation_sinkhorn/2_circulant_matrix)  ·  [Doubly stochastic matrices →](/series/permutation_sinkhorn/4_doubly_stochastic_matrices)
