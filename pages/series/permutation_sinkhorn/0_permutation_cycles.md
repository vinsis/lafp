---
title: Overview and permutation cycles
description: An overview of the series from permutations to Sinkhorn distances, starting with how to decompose a permutation into cycles.
canvas: left
---

# Overview and permutation cycles

For an elementary introduction to permutation matrices, check out [this blog post](/blog/permutation_matrices).

#### Overview
We start with understanding the behavior of eigenvalues and eigenvectors of permutation matrices. Then we study a geometrical object, a convex polytope, whose vertices are permutation matrices. Every point inside this polytope is a doubly stochastic matrix. This geometric view leads to the Birkhoff-von Neumann theorem, which characterizes the structure of doubly stochastic matrices. It also leads to the Sinkhorn-Knopp algorithm, which can be used to find a doubly stochastic matrix from a non-negative matrix. This finally leads us to the topic of matrix scaling and culminates in the Sinkhorn distance, a metric on the space of joint probability distributions.

The chain of ideas runs: permutation → permutation cycles → spectral properties → circulant matrix, then Birkhoff polytope → doubly stochastic matrix → Birkhoff-von Neumann, and finally matrix scaling → Sinkhorn distance.

To understand the topics in this series fully, start with viewing a permutation as a product of cycles.

---

## Permutation cycle decomposition

A permutation can be seen as a movement of an element $x$ from index $x_i$ to index $x_j$. One can then create a partition of indices $1, 2, \ldots, n$ such that the movement of each element is limited to the partition it belongs to. In other words, for any element $x$, both $x_i$ and $x_j$ are in the same partition. This partition is called a cycle.

```python-editor collapsed
pie.clear()
pie.scalar(50, out='unit')
BLUE, PINK, GRAY = '#1d4ed8', '#be185d', '#71717a'

# x and y of a point, so a label can follow it
px = pie.lift(lambda p: p[0], pie.Scalar)
py = pie.lift(lambda p: p[1], pie.Scalar)

# element: (x on top, x at the bottom, colour)
columns = {'a': (-4, -2, BLUE), 'b': (-2, 2, BLUE), 'c': (0, 4, PINK), 'd': (2, -4, BLUE), 'e': (4, 0, PINK)}
top, bot = {}, {}
for name, (x_top, x_bot, color) in columns.items():
    top[name] = pie.point(x_top, 2, out=f'top_{name}', hidden=True)
    bot[name] = pie.point(x_bot, -2, out=f'bot_{name}', hidden=True)
    pie.annotate_arrow(top[name], bot[name], 0.14, out=f'arr_{name}', stroke=GRAY)
    pie.text(name, px(top[name]), py(top[name]), 22, out=f'tlab_{name}', stroke=color)
    pie.text(name, px(bot[name]), py(bot[name]), 22, out=f'blab_{name}', stroke=color)
pie.text('[a b c d e]  →  [d a e b c]', 0, 3.4, 15, out='tbox_0')
```

The permutation $[\textcolor{#1d4ed8}{a},\textcolor{#1d4ed8}{b},\textcolor{#be185d}{c},\textcolor{#1d4ed8}{d},\textcolor{#be185d}{e}] \rightarrow [\textcolor{#1d4ed8}{d},\textcolor{#1d4ed8}{a},\textcolor{#be185d}{e},\textcolor{#1d4ed8}{b},\textcolor{#be185d}{c}]$ can be seen as two different permutations happening concurrently, one arrow per element carrying it from its old slot to its new one:

- $[\textcolor{#1d4ed8}{a},\textcolor{#1d4ed8}{b},\textcolor{#1d4ed8}{d}] \rightarrow [\textcolor{#1d4ed8}{d},\textcolor{#1d4ed8}{a},\textcolor{#1d4ed8}{b}]$ corresponding to the partition $(1, 2, 4)$.
- $[\textcolor{#be185d}{c},\textcolor{#be185d}{e}] \rightarrow [\textcolor{#be185d}{e},\textcolor{#be185d}{c}]$ corresponding to the partition $(3, 5)$.

```python-editor collapsed
# swap columns c and d on top, b and e at the bottom
pie.translate_point_by([top['c'], top['d'], bot['e'], bot['b']], [2, -2, 2, -2], [0, 0, 0, 0], animate=True)
div_top = pie.point(1, 2.9, out='div_top', hidden=True)
div_bot = pie.point(1, -2.9, out='div_bot', hidden=True)
divider = pie.line(div_top, div_bot, out='divider', stroke=GRAY)
```

Reordering the columns so that each cycle sits together makes the structure visible: a grey divider then splits the $3$-cycle on the left from the $2$-cycle on the right.

```python-editor collapsed
pie.text('3-cycle (a b d)', -2, -3.5, 14, out='tbox_1', stroke=BLUE)
pie.text('2-cycle (c e)', 3, -3.5, 14, out='tbox_2', stroke=PINK)
```

Subsequent applications of the same permutation will result in elements shuffling within their partitions in a cyclic manner. The order of each cycle is the number of elements in the partition (assuming no further decomposition is possible). For example, the cycle $(1, 2, 4)$ has order 3, meaning that it will take 3 applications of the permutation to return the elements to their original positions.

Now let's use it to calculate the eigenvalues and eigenvectors of a permutation matrix.

---

[Permutation spectra →](/series/permutation_sinkhorn/1_permutation_spectra)
