---
title: Index arithmetic in matrices
description: Pick blocks, bands, triangles and other patterns of a matrix with arithmetic on the row index i and the column index j.
date: 2026-11-24
tags: #numpy #tensors #tool
toc: false
---

# Index arithmetic in matrices

Using basic arithmetic to select indices of a matrix allows selecting (or highlighting) elements in a way that is not possible with [numpy indexing](/tools/numpy_indexing).

Inside `[...]`, `i` and `j` are the row and column of each cell. One can image them as outputs of the operation `i, j = np.indices(A.shape)` in numpy. 

Change the `SIZE` value in the code below to change the size of each grid cell. You can also try changing the shapes of the matrices `A` and `B`. 


```python-editor collapsed
SIZE = 15

examples = [
    'A[i // 2 == j // 2]',
    'A[i <= j]',
    'A[abs(i - j) <= 1]',
    'A[(i < 2) | (j < 2)]',
    'A[(i + j) % 2 == 0]',
    'A[:, j[0] % 2 == 1]',
    'A[1:, 1:] @ B[1:]',
    'B.T[i == j], B[i > j]',
    'A[:3] @ B[:2]',
    'A[0 <= i - j <= 2]',
]
expr = pie.text(examples[0], out='expr')
pie.ui.dropdown(expr, options=examples, label='Example')
pie.ui.textbox(expr, label='DIY')
pie.ui.matrix_grid(expr, shapes={'A': [6, 6], 'B': [6, 4]}, size=SIZE)
```
