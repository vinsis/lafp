---
title: Indexing numpy arrays
description: A visual tour of numpy indexing: integers, slices, index arrays, boolean masks, new axes and 3D arrays, with the picked elements colored.
date: 2026-11-09
tags: #numpy #python
toc: false
---

# Indexing numpy arrays

Different patterns of indexing and broadcasting of numpy tensors are shown. The selected elements are shown in $\textcolor{#e11d48}{\text{red}}$, along with the shape of the tensor.

```python-editor collapsed
import ast, re
import numpy as np

PICK = '#e11d48'   # the color of the picked elements
REST = '#71717a'   # the color of the other elements

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
        return rf'\textcolor{{{PICK if picked else REST}}}{{{v}}}'
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
    return (r'\large ' + tex(x, picked) + r'\quad\longrightarrow\quad' + tex(result)
            + r'\quad\text{shape ' + plain(str(result.shape)) + '}')

def show_picked(i, *exprs):
    """show_index of the index in topic i's text box."""
    return show_index(exprs[int(i)])

def tool(topics, out):
    """A dropdown of topics. Each topic shows a radio button per example, which puts it in the text box,
    and what the index in the text box picks. Type your own and press Enter."""
    examples = list(topics.values())
    topic = pie.scalar(0, out=out)
    boxes = [pie.text(exprs[0], out=f'{out}_{i}') for i, exprs in enumerate(examples)]
    pie.ui.dropdown(topic, options=list(topics), label="Topic")
    pie.ui.case_text_radio(topic, boxes, options=examples, label='Options')
    pie.ui.case_textbox(topic, boxes, label='DIY')
    pie.ui.latex(pie.lift(show_picked, pie.Text)(topic, *boxes))

a = np.arange(0, 100, 10)
M = np.arange(12).reshape(3, 4)
T = np.arange(24).reshape(2, 3, 4)

tool({
    '1D arrays': ['a[3]', 'a[-1]', 'a[2:7]', 'a[:3]', 'a[7:]', 'a[::3]', 'a[::-1]', 'a[8:100]', 'a[12]'],
    '2D arrays: rows, columns and blocks': ['M[1]', 'M[:, 2]', 'M[1, 2]', 'M[-1]', 'M[:2, :]', 'M[1:, 1:3]',
                                            'M[::2, ::2]', 'M[::-1, ::-1]'],
    'Keeping or adding an axis': ['M[:, 2]', 'M[:, 2:3]', 'M[:, [2]]', 'M[1]', 'M[1:2]', 'M[None]', 'M[:, None]',
                                  'M[:, :, None]'],
    'Index arrays': ['M[[2, 0]]', 'M[[0, 0, 1]]', 'M[:, [0, 3]]', 'M[[0, 1, 2], [1, 2, 3]]',
                     'M[np.ix_([0, 2], [1, 3])]', 'M[[0, 2], 1]'],
    'Boolean masks': ['M[M > 6]', 'M[M % 3 == 0]', 'M[(M > 2) & (M < 9)]', 'M[~(M % 2 == 0)]',
                      'M[M[:, 0] > 2]', 'M[:, M[0] % 2 == 1]', 'M[M > 100]'],
    '3D arrays': ['T[0]', 'T[:, 1]', 'T[:, :, -1]', 'T[..., 0]', 'T[1, :, 1:3]', 'T[:, [0, 2], 1]',
                  'T[[0, 1], :, 1]', 'T[T % 5 == 0]'],
    'Chaining': ['M[1][2]', 'M[:][2]', 'M[:, 2]', 'M[1:][0]', 'M.T[0]', 'M.reshape(4, 3)[0]', 'M.ravel()[5:]'],
}, out='topic')
```

---


<details>
<summary>Views and copies</summary>

A view is a new array that shares memory with the original, so changing one changes the other.

- An index made of slices, `None` and `...`, possibly mixed with integers, returns a view: so writing to it changes the array. 
- An integer on every axis returns a single number, not a view. 
- An index array or a boolean mask returns a copy. 
- Assigning through an index, e.g. `M[M > 6] = 0`, writes to the array in both cases.

</details>
