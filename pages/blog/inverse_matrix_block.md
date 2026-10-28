---
title: Inverse of a block of a matrix and Schur Complement
description: Given a matrix and its inverse, compute the inverse of a square block after removing k rows and columns, using the Schur complement.
---

# Inverse of a block of a matrix and Schur Complement

<div style="display: flex; justify-content: center; margin: 1.5rem 0;">
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<g>
<rect x="0" y="0" width="150" height="150" fill="rgb(217 119 6)" opacity="0.6"></rect>
<rect x="0" y="150" width="150" height="50" fill="#71717a" opacity="0.2"></rect>
<rect x="150" y="0" width="50" height="150" fill="#71717a" opacity="0.2"></rect>
<rect x="150" y="150" width="50" height="50" fill="rgb(13 148 136)" opacity="0.6"></rect>
</g>
<g>
<text transform="translate(75,75)" x="0" y="0" font-family="serif" font-style="italic" text-anchor="middle">(n-k,n-k)</text>
<text transform="translate(175,180)" x="0" y="0" font-family="serif" font-style="italic" text-anchor="middle">(k,k)</text>
</g>
</svg>
</div>

If the inverse of the entire $(n,n)$ matrix $M$ is known, we would like to calculate the inverse of the above block matrices in terms of blocks of $M^{-1}$.

A few weeks ago I [discussed the problem of](/blog/inverse_row_col_removed) calculating the inverse of a matrix after removing a row and a column. At that time I completely failed to realize I was staring at a well known matrix *associated with a square block of a matrix*. So in this article I will generalize the problem to removal of any number `k` of rows and columns removed.

---

## The General Problem

You are given an invertible n-by-n matrix $M$ and its inverse $M^{-1}$. Now let's say any `k` rows and `k` columns of the matrix $M$ are removed. Let's call this matrix $M_{n-k}$. We would like to calculate the inverse of this matrix $M_{n-k}$ *efficiently*.

Just like the previous case, the problem is trivial if you do not care about efficiency - you simply calculate the inverse of $M_{n-k}$. But because we already did the hard work of calculating $M^{-1}$, can we somehow make use of it? In other words, can we somehow manipulate $M^{-1}$ to calculate the inverse of $M_{n-k}$ in a way that is faster than calculating the inverse of the smaller matrix again?

---

## The Specific Problem

Let us first look into a specific case where the last `k` rows and columns are removed. Note that we can convert the general problem into this specific problem by making use of permutation matrices - [just the same way we did here](/blog/inverse_row_col_removed). Once we figure out how to solve this specific problem, by extension, we will have figured out how to solve it for any `k-` number of rows and columns removed.

---

## The Solution

### Solving the specific problem first

Consider the case in which the last `k` rows and columns are removed. Note that it is a `(n-k)`x`(n-k)` matrix. We can write the matrix in [block matrix](https://en.wikipedia.org/wiki/Block_matrix) form as:

$$M = \begin{bmatrix} A & B \\ C & D \end{bmatrix}$$

Note that:

- $A$ is a `(n-k)`x`(n-k)` matrix.
- $B$ is a `(n-k)`x`k` matrix.
- $C$ is a `k`x`(n-k)` matrix.
- $D$ is a `k`x`k` matrix.

Similarly, we can write $M^{-1}$ in the block matrix form as:

$$M^{-1} = \begin{bmatrix} P & Q \\ R & S \end{bmatrix}$$

Note that:

- $P$ is a `(n-k)`x`(n-k)` matrix.
- $Q$ is a `(n-k)`x`k` matrix.
- $R$ is a `k`x`(n-k)` matrix.
- $S$ is a `k`x`k` matrix.

Note that we would like to calculate the inverse of $A$.

Now let's do some elementary algebra:

$$MM^{-1} = M^{-1}M = I_{n} \Rightarrow \begin{bmatrix} A & B \\ C & D \end{bmatrix} \begin{bmatrix} P & Q \\ R & S \end{bmatrix} = I_n$$

$$\Rightarrow AP + BR = I_{n-k} \text{ and } AQ + BS = 0$$

$$\Rightarrow B = -AQS^{-1}$$

$$\Rightarrow AP - AQS^{-1}R = I_{n-k}$$

$$\Rightarrow A(P - QS^{-1}R) = I_{n-k} = AA^{-1}$$

$$\Rightarrow A^{-1} = P - QS^{-1}R$$

Note that $S$ needs to be invertible in order for the above equation to make sense.

The right hand side is the Schur Complement of $S$. Similarly we can show that $D^{-1} = S - RP^{-1}Q$. Here the right hand side is the Schur Complement of $P$.

In simple words, the inverse of top left block of a matrix is the Schur complement of the bottom right block of its inverse. Similarly, the inverse of bottom right block of a matrix is the Schur complement of the top left block of its inverse.

```python
import numpy as np

N = 5
K = 2
N_MINUS_K = N - K
matrix = np.random.randn(N,N)
top_left_block = matrix[:N_MINUS_K,:N_MINUS_K]
bottom_right_block = matrix[N_MINUS_K:,N_MINUS_K:]

inverse_matrix = np.linalg.inv(matrix)
P = inverse_matrix[:N_MINUS_K,:N_MINUS_K]
Q = inverse_matrix[:N_MINUS_K,N_MINUS_K:]
R = inverse_matrix[N_MINUS_K:,:N_MINUS_K]
S = inverse_matrix[N_MINUS_K:,N_MINUS_K:]

schur_complement_of_S = P - Q @ np.linalg.inv(S) @ R
assert np.all(np.isclose((top_left_block @ schur_complement_of_S), np.eye(N_MINUS_K)))
```

---

## Is it faster than just calculating the inverse again?

The answer is not that straight-forward anymore. To calculate the inverse of $n-k$ by $n-k$ matrix $A$, you need to calculate the inverse of $k$ by $k$ matrix $S$. Thus as long as $k < n/2$, using the method of Schur Complement will be faster but not otherwise. This is only considering the most expensive operation of calculating inverse.

---

## Solving the original problem

We want to calculate the inverse of a matrix from which any $k$ rows and $k$ columns have been removed. We just solved the problem when the last $k$ rows and columns are removed. Just like the article for removal of one row and one column, we can convert the original problem into the specific problem by using permutation matrices.

- Find permutation matrices $P_r, P_c$ such that removing `k` rows and `k` columns from $M$ is the same as removing the last `k` rows and columns from $P_rMP_c$.
- Since $M^{-1}$ is known, we have $(P_rMP_c)^{-1} = P_c^TM^{-1}P_r^T$.
- The Schur complement of the bottom right block $k\text{-by-}k$ matrix of $P_c^TM^{-1}P_r^T$ is the inverse of $M$ with `k` rows and `k` columns removed.

---

## Related articles:

- [Inverse of a matrix after a row-and-column removal](/blog/inverse_row_col_removed)
- [Read the e-book 📖](/la/0_intro) — to learn linear algebra from scratch through a series of visual essays.
