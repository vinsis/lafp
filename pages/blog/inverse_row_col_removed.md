---
title: Inverse of a matrix after a row-and-column removal
---

# Inverse of a matrix after a row-and-column removal

<div style="display: flex; justify-content: center; margin: 1.5rem 0;">
<svg width="400" height="160" viewBox="0 0 400 150" xmlns="http://www.w3.org/2000/svg">
<g transform="translate(0 150) scale(1 -1)">
<line x1="50" y1="120" x2="350" y2="120" stroke-width="2" stroke="rgb(100,100,100)"></line>
<line x1="350" y1="120" x2="350" y2="20" stroke-width="2" stroke="rgb(100,100,100)"></line>
<line x1="50" y1="120" x2="50" y2="20" stroke-width="2" stroke="rgb(100,100,100)"></line>
<line x1="50" y1="20" x2="350" y2="20" stroke-width="2" stroke="rgb(100,100,100)"></line>
<circle r="8" fill="rgb(100,100,100)">
<animateMotion dur="4" path="M50,120 L350,120 L350,20 M50,120 z" repeatCount="indefinite" />
</circle>
<circle r="8" fill="rgb(217 119 6)">
<animateMotion dur="2" path="M50,120 L50,20 L350,20 M50,120 z" repeatCount="indefinite" />
</circle>
</g>
<g>
<text transform="translate(86,20)" x="0" y="0" font-family="serif" font-style="italic" text-anchor="middle" fill="#27272a">Input: M or M_inverse</text>
<text transform="translate(335,150)" x="0" y="0" font-family="serif" font-style="italic" text-anchor="middle" fill="#27272a">Output: Inverse</text>
<text transform="translate(205,45)" x="0" y="0" font-family="serif" text-anchor="middle" font-size="smaller" fill="#27272a">Remove row-col, calculate inverse</text>
<text transform="translate(205,125)" x="0" y="0" font-family="serif" text-anchor="middle" font-size="smaller" fill="#27272a">Manipulate M_inverse, remove row-col</text>
</g>
</svg>
</div>

Is using the matrix inverse faster than calculating the inverse of the smaller matrix?

This is a generalization and a detailed explanation of a neat little trick I came across in the paper [Optimal Brain Compression](https://arxiv.org/abs/2208.11580). The solution uses the same approach as [this answer](https://stats.stackexchange.com/a/450186) but also extends it to a more general case. A Python implementation is also provided for both the cases.

---

## The Original Problem

You are given an invertible n-by-n matrix $M$ and its inverse $M^{-1}$. Now let's say the `i-th` row and `i-th` column of the matrix $M$ are removed. Let's call this matrix $M_{-i}$. We would like to calculate the inverse of this matrix $M_{-i}$ *efficiently*.

```python
import numpy as np

def remove_row(matrix: np.matrix, index: int):
    return np.delete(matrix, index, axis=0)

def remove_column(matrix: np.matrix, index: int):
    return np.delete(matrix, index, axis=1)

def remove_row_and_column(matrix: np.matrix, row_index: int, col_index: int):
    return remove_column(remove_row(matrix, row_index), col_index)
    
matrix = np.random.randn(5,5)
matrix_inverse = np.linalg.inv(matrix)

index = 3
smaller_matrix = remove_row_and_column(matrix, index, index)
```

If you do not care about efficiency, the problem is trivial - you simply calculate the inverse of $M_{-i}$. But because we also know $M^{-1}$, can we somehow make use of it? In other words, can we somehow manipulate $M^{-1}$ to calculate the inverse of $M_{-i}$, and if so, is it more efficient (or faster) compared to the trivial method?

```python
# a solution that is easy to come up with implement but inefficient:
smaller_matrix_inverse = np.linalg.inv(smaller_matrix)
```

```python
def computer_smaller_matrix_inverse_efficiently(matrix_inverse, index):
    # can we only use "matrix_inverse" alongwith the index of the row and column removed
    # to calculate the inverse of the smaller matrix?
    ...
```

### A more general problem

We can extend this idea to a case where the indices of the removed row and column are different - if the `i-th` row and `j-th` column of the matrix $M$ are removed, can we calculate the inverse of this `(n-1)`x`(n-1)` matrix by directly manipulating $M^{-1}$? We will explore this idea in a bit.

```python
row_index = 3
col_index = 1
smaller_matrix = remove_row_and_column(matrix, row_index, col_index)
```

```python
def computer_smaller_matrix_inverse_efficiently(matrix_inverse, row_index, col_index):
    # can we only use "matrix_inverse" alongwith the indices of the row and column removed
    # to calculate the inverse of the smaller matrix?
    ...
```

---

## The Solution

### Solving a specific problem first

Consider the case in which the last row and last column are removed. In other words, we want to calculate the inverse of $M_{-n}$. Note that it is a `(n-1)`x`(n-1)` matrix. We can write it in [block matrix](https://en.wikipedia.org/wiki/Block_matrix) form as:

$$M = \begin{bmatrix} A & b \\ c & d \end{bmatrix}$$

Note that:

- $A$ is a `(n-1)`x`(n-1)` matrix.
- $b$ is a `(n-1)`x`1` matrix (aka a column vector).
- $c$ is a `1`x`(n-1)` matrix (aka a row vector).
- $d$ is a `1`x`1` matrix (aka a scalar).

Similarly, we can write $M^{-1}$ in the block matrix form as:

$$M^{-1} = \begin{bmatrix} P & q \\ r & s \end{bmatrix}$$

Note that:

- $P$ is a `(n-1)`x`(n-1)` matrix.
- $q$ is a `(n-1)`x`1` matrix (aka a column vector).
- $r$ is a `1`x`(n-1)` matrix (aka a row vector).
- $s$ is a `1`x`1` matrix (aka a scalar).

Also note that $M_{-n}$ is actually equal to $A$. We would like to find $A^{-1}$ by manipulating $M^{-1}$.

Now let's do some elementary algebra:

$$MM^{-1} = M^{-1}M = I_{n} \Rightarrow \begin{bmatrix} A & b \\ c & d \end{bmatrix} \begin{bmatrix} P & q \\ r & s \end{bmatrix} = I_n$$

$$\Rightarrow AP + br = I_{n-1} \text{ and } Aq + bs = 0$$

$$\Rightarrow b = \frac{-1}{s} Aq$$

$$\Rightarrow AP + \frac{-1}{s} (Aq)r = AP - A \frac{1}{s} (qr) = I_{n-1}$$

$$\Rightarrow A(P - \frac{1}{s} qr) = I_{n-1} = AA^{-1}$$

$$\Rightarrow A^{-1} = P - \frac{1}{s} qr$$

Note that:

- $AP \text{, } qr \text{ and } br$ are `(n-1)`x`(n-1)` matrices.
- $Aq \text{ and } bs$ are `(n-1)`x`1` matrices (aka column vectors).

Now let's denote the `i-th` column of the matrix $M$ as $M_{:,i}$ and `j-th` row of the matrix as $M_{j,:}$. Then notice that $q$ is actually equal to $M_{:,n}$ with the last element missing. Similarly $r$ is actually equal to $M_{n,:}$ with the last element missing. Then we make the following series of observations:

- $qr$ is actually equal to the matrix $[(M^{-1})_{:,n} * (M^{-1})_{n,:}]$ with the last column and row missing.
- In other words, $qr = [(M^{-1})_{:,n} * (M^{-1})_{n,:}]_{-n}$.
- Similarly $P$ is the same as $M^{-1}$ with the last row and column missing: $P = (M^{-1})_{-n}$
- Finally we can write: $P - \frac{1}{s} qr = (M^{-1})_{-n} - \frac{1}{s}([(M^{-1})_{:,n} * (M^{-1})_{n,:}])_{-n} = (M^{-1} - \frac{1}{s}[(M^{-1})_{:,n} * (M^{-1})_{n,:}])_{-n}$

In simple words, the inverse of a matrix $M$ with the last row and column removed is equal to the inverse of $M$ minus the product of last column and last row divided by the last diagonal value of $M^{-1}$.

### Is it faster than just calculating the inverse again?

Well of course it is! Note that we already had access to $M^{-1}$. All we had to calculate was the product of the `n-dimensional` column vector with a `n-dimensional` row vector. Calculating this product has a complexity of $O(n^2)$. Calculating the inverse of a matrix has complexity $O(n^3)$.

### Solving the original problem

We want to calculate the inverse of $M_{-i}$ for any `i`. We just solved the problem when $i = n$. To solve for any `i`, we will deploy the following strategy:

- Swap the `i-th` and `n-th` columns. Similarly swap the `i-th` and `n-th` rows. Let's call this matrix $N$. This can be done using a [permutation matrix](https://en.wikipedia.org/wiki/Permutation_matrix) $P$. Note that $P$ is obtained by swapping the `i-th` and `n-th` columns of $I_n$. Thus $P$ is symmetric.

$$N = P^TMP \text{, } M_{-i} = N_{-n} \Rightarrow (M_{-i})^{-1} = (N_{-n})^{-1}$$

- It is easy to calculate $N^{-1}$ from $M^{-1}$ using the identity $P^{-1} = P^{T} = P$.

$$N^{-1} = PM^{-1}P \Rightarrow M^{-1} = PN^{-1}P$$

- Calculate the inverse of $N_{-n}$ by using $N^{-1}$ only. We know how to do this by now.

$$(N_{-n})^{-1} = (N^{-1})_{-n} - (\frac{1}{s}[(N^{-1})_{:,n} * (N^{-1})_{n,:}])_{-n} = (M_{-i})^{-1}$$

- Interpret the manipulation of $N^{-1}$ in terms of $M^{-1}$ since we know how they are connected:

$$(N^{-1})_{-n} = (M^{-1})_{-i}$$

$$(N^{-1})_{:,n} = (M^{-1})_{:,i}$$

$$(N^{-1})_{n,:} = (M^{-1})_{i,:}$$

- This gives us the answer:

$$(M_{-i})^{-1} = (M^{-1})_{-i} - \frac{1}{M_{ii}}([M^{-1}_{:,i} * M^{-1}_{i,:}])_{-i} = (M^{-1} - \frac{1}{M_{ii}}[M^{-1}_{:,i} * M^{-1}_{i,:}])_{-i}$$

- Here $M_{ii}$ is the `i-th` value of the diagonal of $M$.

```python
def calculate_smaller_matrix_inverse(matrix_inverse: np.matrix, index: int):
    '''
    a faster way to solve
    np.linalg.inv( remove_row_and_column(matrix, index, index) )
    '''
    to_subtract = matrix_inverse[:, index].reshape(-1,1) @ matrix_inverse[index, :].reshape(1,-1)
    to_subtract /= matrix_inverse[index, index]
    result = matrix_inverse - to_subtract
    return remove_row_and_column(result, index, index)
```

---

## Solution to a more general problem

Now that we know how to calculate $(M_{-i})^{-1}$, we can use the same approach to calculate the inverse of a matrix whose `i-th` row and `j-th` column have been removed. We use the notation $M_{-ij}$ to denote the matrix $M$ with `i-th` row and `j-th` column removed.

- Use a permutation matrix to swap rows `i` and `n`. Call this row permutation matrix $P_r$. Similarly use another permutation matrix to swap columns `j` and `n`. Call this column permutation matrix $P_c$.

$$N = P_rMP_c$$

- Note that this gives us $N_{-n} = M_{-ij}$. Next we establish the relationship between the inverse matrices $M^{-1}, N_{-1}$.

$$N^{-1} = P_c^TM^{-1}P_r^T \Rightarrow M^{-1} = P_cN^{-1}P_r$$

- The inverse of $M_{-ij}$ is equal to the inverse of $N_{-n}$. We know how to use $N^{-1}$ to get to $(N_{-n})^{-1}$:

$$(N_{-n})^{-1} = (N^{-1})_{-n} - (\frac{1}{N^{-1}_{nn}}[(N^{-1})_{:,n} * (N^{-1})_{n,:}])_{-n} = (M_{-ij})^{-1}$$

- Interpret the manipulation of $N^{-1}$ in terms of $M^{-1}$ since we know how they are connected:

$$(N^{-1})_{-n} = (M^{-1})_{-ji}$$

In other words, removal of the last row and column of $N^{-1}$ is equivalent to removal of `j-th` row and `i-th` column of $M^{-1}$.

$$(N^{-1})_{:,n} = (M^{-1})_{:,i}$$

$$(N^{-1})_{n,:} = (M^{-1})_{j,:}$$

Similarly, the last column of $N^{-1}$ is the same as the `i-th` column of $M^{-1}$ and the last row of $N^{-1}$ is the same as the `j-th` row of $M^{-1}$. Using similar logic, we can see that:

$$N^{-1}_{nn} = M^{-1}_{ji}$$

Thus the final solution is given as:

$$(M_{-ij})^{-1} = (M^{-1})_{-ji} - \frac{1}{M^{-1}_{ji}}([(M^{-1})_{:,i} * (M^{-1})_{j,:}])_{-ji}$$

$$\Rightarrow (M_{-ij})^{-1} = (M^{-1} - \frac{1}{M^{-1}_{ji}}[(M^{-1})_{:,i} * (M^{-1})_{j,:}])_{-ji}$$

```python
def calculate_smaller_matrix_inverse(matrix_inverse: np.matrix, row_index: int, col_index: int):
    '''
    a faster way to solve:
    np.linalg.inv( remove_row_and_column(matrix, row_index, col_index) )
    '''
    to_subtract = matrix_inverse[:, row_index].reshape(-1,1) @ matrix_inverse[col_index, :].reshape(1,-1)
    to_subtract /= matrix_inverse[col_index, row_index]
    result = matrix_inverse - to_subtract
    return remove_row_and_column(result, col_index, row_index)
```

---

## Related articles:

- [Inverse of a block of a matrix and Schur Complement](/blog/inverse_matrix_block)
- [Read the e-book 📖](/la) — to learn linear algebra from scratch through a series of visual essays.
