---
title: Indexing numpy arrays
description: A visual tour of numpy indexing: integers, slices, index arrays, boolean masks, new axes and 3D arrays, with the picked elements colored.
date: 2026-11-09
tags: #numpy #python
toc: true
---

# Indexing numpy arrays

Different patterns of indexing and broadcasting of numpy tensors are shown. The selected elements are shown in $\textcolor{#e11d48}{\text{red}}$, along with the shape of the tensor.

```python-editor collapsed
import ast, re
import numpy as np

PICK = '#e11d48'   # the color of the picked elements

def plain(s):
    """s, safe to put inside \\text{...}."""
    return re.sub(r"[^A-Za-z0-9 .,:;()\[\]=<>'-]", ' ', s)

def tex(x, picked=None):
    """x as LaTeX: a number, a row (1D), a matrix (2D), or matrices side by side (3D and up)."""
    x = np.asarray(x)
    if picked is None:
        picked = np.ones(x.shape, bool)
    if x.ndim == 0:
        v = str(x.item())
        return rf'\textcolor{{{PICK}}}{{{v}}}' if picked else v
    if x.ndim == 1:
        return r'\begin{bmatrix}' + ' & '.join(map(tex, x, picked)) + r'\end{bmatrix}'
    if x.ndim == 2:
        rows = (' & '.join(map(tex, r, p)) for r, p in zip(x, picked))
        return r'\begin{bmatrix}' + r' \\ '.join(rows) + r'\end{bmatrix}'
    return r'\left[' + r'\;'.join(map(tex, x, picked)) + r'\right]'

def picked_by(expr):
    """The array `expr` starts from, and which of its elements `expr` picks.

    Indexes an array of positions (0, 1, 2, ...) shaped like the array instead of the array itself,
    so the result says which positions were picked."""
    tree = ast.parse(expr, mode='eval')
    parent, field = tree, 'body'
    while isinstance(getattr(parent, field), (ast.Subscript, ast.Attribute, ast.Call)):
        parent = getattr(parent, field)
        field = 'func' if isinstance(parent, ast.Call) else 'value'
    base = getattr(parent, field)
    if not isinstance(base, ast.Name):
        raise ValueError('start with an array name, e.g. M[...]')
    x = globals().get(base.id)
    if not isinstance(x, np.ndarray):
        raise ValueError(f'{base.id} is not an array')
    positions = np.arange(x.size).reshape(x.shape)
    setattr(parent, field, ast.copy_location(ast.Name('_positions', ast.Load()), base))
    flat = np.asarray(eval(compile(tree, '<index>', 'eval'), dict(globals(), _positions=positions)))
    picked = np.zeros(x.size, bool)
    picked[flat.ravel()] = True
    return x, picked.reshape(x.shape)

def show_index(expr):
    """The array with the elements `expr` picks colored, then the result and its shape."""
    try:
        x, picked = picked_by(expr)
        result = np.asarray(eval(expr, dict(globals())))
    except Exception as e:
        return r'\text{' + plain(f'{type(e).__name__}: {e}') + '}'
    return (tex(x, picked) + r'\quad\longrightarrow\quad' + tex(result)
            + r'\quad\text{shape ' + plain(str(result.shape)) + '}')

def examples(*exprs, out):
    """A radio button per index, which puts it in the text box. Type your own and press Enter."""
    box = pie.text(exprs[0], out=out)
    pie.ui.text_radio(box, options=list(exprs))
    pie.ui.textbox(box)
    pie.ui.latex(pie.lift(show_index, pie.Text)(box))
```

---

## 1D arrays

Pattern: `start:stop:step`. Any of the three can be left out. A negative step walks backwards.

```python-editor
a = np.arange(0, 100, 10)
examples('a[3]', 'a[-1]', 'a[2:7]', 'a[:3]', 'a[7:]', 'a[::3]', 'a[::-1]', 'a[8:100]', 'a[12]', out='ex_1d')
```

---

## 2D arrays: rows, columns and blocks

```python-editor
M = np.arange(12).reshape(3, 4)
examples('M[1]', 'M[:, 2]', 'M[1, 2]', 'M[-1]', 'M[:2, :]', 'M[1:, 1:3]', 'M[::2, ::2]', 'M[::-1, ::-1]', out='ex_2d')
```

---

## Keeping or adding an axis

An integer index removes its axis. A slice keeps it, even if it picks only one element. So `M[:, 2]` and `M[:, 2:3]` pick the same column, but the first is 1D and the second is a $3 \times 1$ matrix.

`None` (also called `np.newaxis`) adds a new axis of length 1 at its place.

```python-editor
examples('M[:, 2]', 'M[:, 2:3]', 'M[:, [2]]', 'M[1]', 'M[1:2]', 'M[None]', 'M[:, None]', 'M[:, :, None]', out='ex_axes')
```

---

## Index arrays

Two index arrays are paired up: `M[[0, 1, 2], [1, 2, 3]]` picks `M[0, 1]`, `M[1, 2]` and `M[2, 3]`, not a $3 \times 3$ block. For a block, use `np.ix_`, which picks every row in the first list with every column in the second.

```python-editor
examples('M[[2, 0]]', 'M[[0, 0, 1]]', 'M[:, [0, 3]]', 'M[[0, 1, 2], [1, 2, 3]]',
         'M[np.ix_([0, 2], [1, 3])]', 'M[[0, 2], 1]', out='ex_fancy')
```

---

## Boolean masks

A boolean array of the same shape picks the elements where it is `True`. The result is always 1D, in row-major order: row by row, left to right.

A boolean array along one axis picks rows or columns. Combine conditions with `&` (and), `|` (or) and `~` (not), with parentheses around each one: `&` binds tighter than `>`.

```python-editor
examples('M[M > 6]', 'M[M % 3 == 0]', 'M[(M > 2) & (M < 9)]', 'M[~(M % 2 == 0)]',
         'M[M[:, 0] > 2]', 'M[:, M[0] % 2 == 1]', 'M[M > 100]', out='ex_bool')
```

---

## 3D arrays

A 3D array is drawn as its 2D slices `T[0]`, `T[1]`, … side by side. Each index works like it does for 2D: one per axis. `...` (Ellipsis) stands for as many `:` as needed, so `T[..., 0]` is `T[:, :, 0]`.

One rule is surprising. When index arrays (or integers mixed with them) are split by a slice, their axes move to the front of the result. `T[:, [0, 2], 1]` has shape $(2, 2)$, as you'd expect. `T[[0, 1], :, 1]` has shape $(2, 3)$: the paired axis comes first, then the sliced one.

```python-editor
T = np.arange(24).reshape(2, 3, 4)
examples('T[0]', 'T[:, 1]', 'T[:, :, -1]', 'T[..., 0]', 'T[1, :, 1:3]', 'T[:, [0, 2], 1]',
         'T[[0, 1], :, 1]', 'T[T % 5 == 0]', out='ex_3d')
```

---

## Chaining

Each `[...]` indexes the result of the one before it. `M[1][2]` is `M[1, 2]`, but `M[:][2]` is not `M[:, 2]`: `M[:]` is all of `M`, and `[2]` then picks row 2. Methods such as `.T` and `.reshape` can sit in the chain too.

```python-editor
examples('M[1][2]', 'M[:][2]', 'M[:, 2]', 'M[1:][0]', 'M.T[0]', 'M.reshape(4, 3)[0]', 'M.ravel()[5:]', out='ex_chain')
```

---

## Views and copies

A view is a new array that shares memory with the original, so changing one changes the other.

- An index made of slices, `None` and `...`, possibly mixed with integers, returns a view: so writing to it changes the array. 
- An integer on every axis returns a single number, not a view. 
- An index array or a boolean mask returns a copy. 
- Assigning through an index, e.g. `M[M > 6] = 0`, writes to the array in both cases.
