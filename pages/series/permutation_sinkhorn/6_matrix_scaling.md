---
title: Matrix scaling
description: Sinkhorn's theorem that any positive matrix scales to a doubly stochastic one, proof of existence and uniqueness, and Sinkhorn iteration in Python.
canvas: left
sidebar: _series.md
---

# Matrix scaling

In the paper [A Relationship Between Arbitrary Positive Matrices and Doubly Stochastic Matrices](https://projecteuclid.org/journals/annals-of-mathematical-statistics/volume-35/issue-2/A-Relationship-Between-Arbitrary-Positive-Matrices-and-Doubly-Stochastic-Matrices/10.1214/aoms/1177703591.full), Richard Sinkhorn provided a proof of the following theorem:

> For any square matrix `A` with strictly positive entries, there exist diagonal matrices with positive entries `D₁` and `D₂` such that `D₁AD₂` is a doubly stochastic matrix.

Here we explore this statement and its generalizations.

---

## 0. Sinkhorn iteration

A not-so-obvious observation about the above statement is that we can arrive at such a matrix `D₁AD₂` by iteratively scaling the rows and columns of `A`:

#### Python implementation

```python
import torch
dim = 5

# matrix with strictly positive entries
matrix = torch.randn(dim, dim).exp()
print(f'Col sums of matrix: {matrix.sum(dim=0).half().tolist()}')
print(f'Row sums of matrix: {matrix.sum(dim=1).half().tolist()}')

for i in range(10):
    matrix /= matrix.sum(dim=1, keepdim=True)
    matrix /= matrix.sum(dim=0, keepdim=True)
    if i%3 == 0:
     print(f'Iteration {i}: \n\tRow sums: {matrix.sum(dim=1).half().tolist()},\n\tcol sums: {matrix.sum(dim=0).half().tolist()}')

##############
### Output ###
##############
Col sums of matrix: [10.890625, 13.4921875, 9.4296875, 9.0859375, 9.6953125]
Row sums of matrix: [12.9921875, 14.390625, 10.6953125, 8.2578125, 6.2578125]
Iteration 0:
	Row sums: [0.94140625, 1.009765625, 1.0732421875, 0.95556640625, 1.01953125],
	col sums: [1.0, 1.0, 1.0, 1.0, 1.0]
...
...
Iteration 9:
	Row sums: [1.0, 1.0, 1.0, 1.0, 1.0],
	col sums: [1.0, 1.0, 1.0, 1.0, 1.0]
```

Each step of row normalization is equivalent to left-multiplication by a diagonal matrix with positive entries. Each step of column normalization is equivalent to right-multiplication by a diagonal matrix with positive entries.

---

## 1. Proof of the above theorem

We start with the proof of uniqueness first. Then we provide proof of existence.

---

### 1.1. Uniqueness

We want to prove that if for a matrix `M` with strictly positive entries there exist two pairs of diagonal matrices `C₁`, `C₂` and `D₁`, `D₂` such that `C₁MC₂` and `D₁MD₂` are equal to doubly stochastic matrices `S₁` and `S₂`, then `C₁ = kD₁` and `C₂ = k⁻¹D₂` for some positive constant `k` and `S₁ = S₂`. In other words, there is a unique way to scale the rows and columns of `M` to obtain a doubly stochastic matrix.

Note that $S_1 = C_1MC_2$ and $S_2 = D_1MD_2$. Substituting the first into the second gives:

$$\begin{aligned}
S_2 &= D_1MD_2 \\
    &= D_1(C_1^{-1}S_1C_2^{-1})D_2 \\
    &= \underbrace{\textcolor{#e11d48}{D_1C_1^{-1}}}_{\textcolor{#e11d48}{A}} \, S_1 \, \underbrace{\textcolor{#b45309}{C_2^{-1}D_2}}_{\textcolor{#b45309}{B}} \\
    &= \textcolor{#e11d48}{A}S_1\textcolor{#b45309}{B}
\end{aligned}$$

To prove that $C_1, D_1$ and $C_2, D_2$ are equal up to a constant multiple, we simply need to prove that $A$ and $B$ are equal to the identity matrix up to a constant multiple. We use proof by contradiction by assuming that they are not.

We start with the observation that for any doubly stochastic matrix $S$, we have:

$$\underbrace{\langle \text{row/col of S}, \textcolor{#b45309}{v} \rangle}_{\textcolor{#b45309}{\text{convex sum of } v}} \in [v_{min}, v_{max}]$$

To see why this bound holds, picture a concrete doubly stochastic matrix $S_1$ and a vector $b = (1, 3, 5)$ whose entries we take a convex combination of.

```python-editor collapsed
pie.clear()
pie.scalar(38, out='unit')
pie.scalar(0, out='gridOpacity')
GRAY, PINK, AMBER, TEAL, VIOLET = '#71717a', '#be185d', '#b45309', '#0d9488', '#6d28d9'
# A doubly stochastic matrix: every row and every column sums to 1
S1 = [[0.5, 0.3, 0.2], [0.2, 0.5, 0.3], [0.3, 0.2, 0.5]]
B_MIN, B_MID, B_MAX = 1, 3, 5
pie.la_array_to_texts(S1, -5.7, 2.6, 1.3, 0.9, 14, out='s1_boxes')
pie.line(pie.point(-1, 0, out='axis_p1', hidden=True), pie.point(6.6, 0, out='axis_p2', hidden=True), out='axis', stroke=GRAY)
```

- Here is a doubly stochastic matrix $S_1$ with three rows and three columns, each row summing to 1.
- Next to it, draw a number line holding the values $b$'s entries can take.

- Mark $b$'s entries: $\textcolor{#be185d}{b_{min}=1}$, the middle entry, and $\textcolor{#b45309}{b_{max}=5}$.

```python-editor collapsed
pie.point(B_MIN, 0, out='bmin_pt', fill=PINK)
pie.point(B_MID, 0, out='bmid_pt')
pie.point(B_MAX, 0, out='bmax_pt', fill=AMBER)
```

- Drop guide lines at the $\textcolor{#be185d}{b_{min}}$ boundary and the $\textcolor{#b45309}{b_{max}}$ boundary.

```python-editor collapsed
pie.line(pie.point(B_MIN, -0.5, out='gmin_p1', hidden=True), pie.point(B_MIN, 0.5, out='gmin_p2', hidden=True), out='gmin_line', stroke=PINK)
pie.line(pie.point(B_MAX, -0.5, out='gmax_p1', hidden=True), pie.point(B_MAX, 0.5, out='gmax_p2', hidden=True), out='gmax_line', stroke=AMBER)
```

- Weighting the three points on the line by row $i$'s entries and summing them lands on the teal arrow, the convex combination $\text{row}_i \cdot b$.

```python-editor collapsed
# Columns are b's three points (b_k, 0); the weights are row 0 of S1
b_pts = [[B_MIN, B_MID, B_MAX], [0, 0, 0]]
pie.la_weighted_sum(b_pts, S1[0], out='row_dot_b', stroke=TEAL)
pie.text('S₁ (doubly stochastic)', -4.4, 3.5, 14, out='tbox_0')
```

- That confirms $S_1$ is doubly stochastic by construction.

- The weights used above are exactly row $i$ of $S_1$.

```python-editor collapsed
pie.text('row i', -7, 2.6, 14, out='tbox_1')
pie.rectangle(pie.point(-6.35, 2.15, out='row_frame_bl', hidden=True), 3.9, 0.9, out='row_frame', stroke=VIOLET)
```

- Reading off the boundaries: $b_{min}=1$, the entry $3$, and $b_{max}=5$.

```python-editor collapsed
pie.text('b_min = 1', B_MIN, 0.9, 14, out='tbox_2', stroke=PINK)
pie.text('3', B_MID, 0.9, 14, out='tbox_3')
pie.text('b_max = 5', B_MAX, 0.9, 14, out='tbox_4', stroke=AMBER)
pie.text('row·b = 2.4 ∈ [1, 5]', 2.4, -0.9, 14, out='tbox_5', stroke=TEAL)
pie.text("Taking the dot product of any row of a doubly stochastic matrix S with b gives a convex combination of b's entries - it always lands between b's smallest and largest values.", 0, -3.8, 14, 7, -1, out='tbox_6')
```

- The resulting dot product, row·b = 2.4, falls squarely inside $[1, 5]$.
- This is exactly the bound used above: the dot product of any row of a doubly stochastic matrix with $b$ is a convex combination of $b$'s entries, so it can never escape $[b_{min}, b_{max}]$.

Applying this to any row of $AS_1B$ gives us:

$$1 = \sum_{k} a_ib_kS_{1ik} = a_i \underbrace{\textcolor{#b45309}{\sum_{k} b_k S_{1ik}}}_{\textcolor{#b45309}{\in [b_{min}, b_{max}]}}$$

which implies $\textcolor{#e11d48}{a_i b_{min} \le 1 \ \forall i}$ and $\textcolor{#b45309}{a_i b_{max} \ge 1 \ \forall i}$. But this means that the column of $AS_1B$ corresponding to $b_{min}$ will have a sum `≤ 1` and the column corresponding to $b_{max}$ will have a sum `≥ 1`:

$$\textcolor{#e11d48}{\underbrace{\sum_{i} a_ib_{min}\text{col}_{1i}}_{\le \sum_{i}{\text{col}_{1i}} = 1}} \qquad \textcolor{#b45309}{\underbrace{\sum_{i} a_ib_{max}\text{col}_{2i}}_{\ge \sum_{i}{\text{col}_{2i}} = 1}}$$

Since the columns corresponding to min and max values of `B` cannot both sum to 1, this leads to the result that $a_ib_{min} = a_ib_{max} = 1 \Rightarrow B = cI$ for some constant $c$. Similar reasoning can be used to prove the same result for $A$.

The same squeeze argument pins down $B$ precisely. Since $\textcolor{#e11d48}{a_i b_{min} \le 1}$ and $\textcolor{#b45309}{1 \le a_i b_{max}}$ hold for every row $i$, each $a_i$ is trapped between $1/b_{max}$ and $1/b_{min}$.

```python-editor collapsed
pie.clear()
pie.scalar(70, out='unit')
pie.scalar(0, out='gridOpacity')
GRAY, PINK, AMBER, VIOLET = '#71717a', '#be185d', '#b45309', '#6d28d9'
# Where 1/b_max and 1/b_min sit on the number line y = 1
X_LO, X_HI = -1.85, 2.15
pie.line(pie.point(-3.35, 1, out='axis2_p1', hidden=True), pie.point(3.35, 1, out='axis2_p2', hidden=True), out='axis2', stroke=GRAY)
```

- Draw another number line, this time for the values $a_i$ can take.

- Mark the boundaries $1/b_{max}$ on the left and $1/b_{min}$ on the right.

```python-editor collapsed
pie.line(pie.point(X_LO, 0.5, out='amber_guide_p1', hidden=True), pie.point(X_LO, 1.5, out='amber_guide_p2', hidden=True), out='amber_guide', stroke=AMBER)
pie.line(pie.point(X_HI, 0.5, out='pink_guide_p1', hidden=True), pie.point(X_HI, 1.5, out='pink_guide_p2', hidden=True), out='pink_guide', stroke=PINK)
```

- Place a point at each boundary: amber at $1/b_{max}$ and pink at $1/b_{min}$.

```python-editor collapsed
pie.point(X_LO, 1, out='amber_pt', fill=AMBER)
pie.point(X_HI, 1, out='pink_pt', fill=PINK)
pie.point([-0.85, 0.15, 1.15], 1, out='a_pts', fill=VIOLET)
# Drawn right to left, so the bracket opens up towards the interval and its label sits below
pie.annotate_curly_bracket(pie.point(X_HI, 0.3, out='bracket_p2', hidden=True), pie.point(X_LO, 0.3, out='bracket_p1', hidden=True), '1/b_max ≤ a_i ≤ 1/b_min', out='brace_0')
```

- Every $a_i$ must land somewhere between them, purple points squeezed into the same narrow interval.
- The whole interval is exactly $[1/b_{max}, 1/b_{min}]$.

- With concrete numbers this reads $1/b_{max}=0.2$, $1/b_{min}=1.0$, and each $a_i$ trapped in between.

```python-editor collapsed
pie.text('1/b_max = 0.2', X_LO, 1.9, 14, out='tbox_0', stroke=AMBER)
pie.text('1/b_min = 1.0', X_HI, 1.9, 14, out='tbox_1', stroke=PINK)
pie.text('aᵢ', 0.15, 1.9, 14, out='tbox_2', stroke=VIOLET)
```

- Every row forces this squeeze, and since every column of $AS_1B$ must sum to exactly 1, it can only hold for all $i$ if $b_{min} = b_{max}$, forcing $B = cI$ (and symmetrically $A = c^{-1}I$).

```python-editor collapsed
pie.text('Every row forces a_i * b_min ≤ 1 ≤ a_i * b_max. Since every column of A·S₁·B must sum to exactly 1, this can only hold for all i if b_min = b_max - forcing B = cI (and symmetrically A = c⁻¹I).', 0, -2, 14, 6.4, -1, out='tbox_3')
```

---

### 1.2. Existence

Consider a matrix `A` whose columns have been scaled to sum to 1. Let the row sums of `A` be $\{r_1, \ldots, r_n\}$. Also let the minimum and maximum row sums of `A` be $r_{min}$ and $r_{max}$. We show that when the rows of this matrix are scaled, the column sums lie in the range $[r_{min}, r_{max}]$.

$$\begin{bmatrix} \ldots & a_{12} & \ldots \\ \ldots & a_{22} & \ldots \\ \ldots & a_{32} & \ldots \end{bmatrix} \xrightarrow{\text{row normalization}} \begin{bmatrix} \ldots & a_{12}/r_1 & \ldots \\ \ldots & a_{22}/r_2 & \ldots \\ \ldots & a_{32}/r_3 & \ldots \end{bmatrix}$$

In the example above since $\sum_i a_{i2} = 1$, the second column sum after row normalization is a convex sum of $\{1/r_1, \ldots, 1/r_n\}$. This is true for every column sum after row normalization. Thus the column sums $\{c_1, \ldots, c_n\}$ after row normalization are in the range $[r_{min}, r_{max}]$. More specifically, $\underbrace{\textcolor{#e11d48}{r_{min} \le c_{min}}}_{\text{time step t}} \le 1 \le \underbrace{\textcolor{#b45309}{c_{max} \le r_{max}}}_{\text{time step t}}$.

In the next time step, when the columns are scaled to sum to 1, the row sums will be convex sums of $\{c_1, \ldots, c_n\}$. More specifically, $\underbrace{\textcolor{#e11d48}{c_{min} \le r_{min}}}_{\text{time step t+1}} \le 1 \le \underbrace{\textcolor{#b45309}{r_{max} \le c_{max}}}_{\text{time step t+1}}$. This leads to the following insight:

> At each step of row/column scaling, the minimum of these sums increases and the maximum decreases. Since these sums are bounded, they must converge to a limit.

Since the average value of row/column sums is equal to 1 at each time step and does not change, the row/column sums must converge to 1 (this is not a rigorous proof but it can be made rigorous with some more work).

---

## 2. Generalization to rectangular matrices

The above idea of alternately scaling rows and columns to sum to 1 can be extended to rectangular matrices as well. The proof is similar to the square case. The main difference here is that since the number of rows is not equal to the number of columns, the row/column sums will not be equal to 1 at the end. However, the row/column sums will still converge to a limit.

One can also set the row/column sums to any other value, say $\alpha$, by scaling the rows and columns by $\alpha$ instead of 1. This is particularly useful when learning to map a probability distribution $P \in R^m$ to another probability distribution $Q \in R^n$ from samples such that it minimizes a given cost function.

#### Python implementation

```python
n_cols, n_rows = 10,4
matrix = torch.randn((n_rows, n_cols)).exp()

# source probability distribution
row_sums = torch.randn(n_rows,1).softmax(dim=0)

# target probability distribution
col_sums = torch.randn(1,n_cols).softmax(dim=1)

for index in range(100):
    matrix *= col_sums / matrix.sum(dim=0, keepdim=True)
    matrix *= row_sums / matrix.sum(dim=1, keepdim=True)
    row_sums_converged = torch.allclose(matrix.sum(dim=1, keepdim=True), row_sums)
    col_sums_converged = torch.allclose(matrix.sum(dim=0, keepdim=True), col_sums)
    if row_sums_converged and col_sums_converged:
        print(f'row and column sums converged at iteration {index}')
        break

##############
### Output ###
##############
row and column sums converged at iteration 7
```

This forms the basis of the Sinkhorn algorithm which we will look into next.

---

## 3. Generalization to non-negative matrices

One last note about matrix scaling. The above idea of alternately scaling rows and columns of a square matrix to sum to 1 can be extended to non-negative matrices as well. However, it only works for [indecomposable matrices](https://math.stackexchange.com/questions/259661/what-is-an-indecomposable-matrix).

Finally, it is time to look into Sinkhorn distance and the Sinkhorn algorithm.

---

[← Birkhoff-von-Neumann algorithm](/series/permutation_sinkhorn/5_birkhoff_von_neumann)  ·  [Sinkhorn distance →](/series/permutation_sinkhorn/7_sinkhorn)
