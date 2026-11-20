---
title: Broadcasting and einsum visualizer
description: See which input cells make each output cell for various broadcasting and einsum operations.
date: 2026-11-19
tags: #numpy #python
---

# Broadcasting and einsum visualizer

Run the cell below to create a list of examples you can try. Feel free to type out your own examples. 

<details>
<summary>Some examples you can try out</summary>

- `A * 10`
- `T * v`
- `A @ u`
- `np.einsum('i,i->', u, u)`
- `np.einsum('ii->', S)`
- `np.einsum('nd,de,ne->n', X, G, X)`
- `np.einsum('ij->j', A)`

</details>


```python-editor collapsed
import ast, json
from types import SimpleNamespace
import numpy as np

OPS = {ast.Add: '+', ast.Sub: '-', ast.Mult: '*', ast.Div: '/', ast.Pow: '**'}
SHOWN = {'+': '+', '-': '−', '*': '×', '/': '÷', '**': '^', '@': '@', ',': ','}
MATMUL = {(2, 2): 'ij,jk->ik', (2, 1): 'ij,j->i', (1, 2): 'j,jk->k', (1, 1): 'j,j->'}

def leaves(node):
    """The arrays an element-wise expression combines, and the operators between them, left to right."""
    if isinstance(node, ast.BinOp) and type(node.op) in OPS:
        left, left_ops = leaves(node.left)
        right, right_ops = leaves(node.right)
        return left + right, left_ops + [OPS[type(node.op)]] + right_ops
    return [node], []

def operands(expr):
    """How `expr` combines its arrays: `kind` ('broadcast' or 'einsum'), the symbols `seps` shown between them,
    einsum's subscripts `spec`, and the operands `ops` as (source, array) pairs."""
    node = ast.parse(expr.strip(), mode='eval').body
    if isinstance(node, ast.Call) and ast.unparse(node.func) == 'np.einsum':
        first = node.args[0] if node.args else None
        if not (isinstance(first, ast.Constant) and isinstance(first.value, str)):
            raise ValueError("np.einsum needs its subscripts first, e.g. np.einsum('ij,jk->ik', A, B)")
        a = SimpleNamespace(kind='einsum', spec=first.value, args=node.args[1:])
        a.seps = [','] * (len(a.args) - 1)
    elif isinstance(node, ast.BinOp) and isinstance(node.op, ast.MatMult):
        a = SimpleNamespace(kind='einsum', spec=None, args=[node.left, node.right], seps=['@'])
    elif isinstance(node, ast.BinOp) and type(node.op) in OPS:
        args, seps = leaves(node)
        a = SimpleNamespace(kind='broadcast', args=args, seps=seps)
    else:
        raise ValueError('use +, -, *, /, **, @ or np.einsum')
    a.ops = [(ast.unparse(n), np.asarray(eval(ast.unparse(n), dict(globals())))) for n in a.args]
    return a

def analyze(expr):
    """`operands(expr)`, plus the output `shape` and `result`; for einsum also the letters `ins`, `out` and
    each letter's `size`."""
    a = operands(expr)
    if a.kind == 'einsum':
        if a.spec is None:   # @ is einsum with these subscripts
            ndims = tuple(x.ndim for _, x in a.ops)
            if ndims not in MATMUL:
                raise ValueError('@ is shown for 1D and 2D arrays only; write it as np.einsum')
            a.spec = MATMUL[ndims]
        a.ins, a.out, a.size = einsum_letters(a.spec, a.ops)
        a.shape = tuple(a.size[l] for l in a.out)
    else:
        a.shape = broadcast_shape(a.ops)
    a.result = np.asarray(eval(expr, dict(globals())))
    return a

def einsum_letters(spec, ops):
    """The letters of each input and of the output, and each letter's size."""
    spec = spec.replace(' ', '')
    if '.' in spec:
        raise ValueError('... is not shown here; give every axis a letter')
    ins, arrow, out = spec.partition('->')
    ins = ins.split(',')
    if not arrow:   # no output given: numpy uses the letters that appear once, in alphabetical order
        used = ''.join(ins)
        out = ''.join(sorted(l for l in set(used) if used.count(l) == 1))
    if len(ins) != len(ops):
        raise ValueError(f'{len(ins)} subscripts for {len(ops)} arrays')
    size = {}
    for letters, (src, x) in zip(ins, ops):
        if len(letters) != x.ndim:
            raise ValueError(f"{src} has {x.ndim} axes, but '{letters}' names {len(letters)}")
        for axis, l in enumerate(letters):
            if size.setdefault(l, x.shape[axis]) != x.shape[axis]:
                raise ValueError(f'{l} has size {size[l]}, but {src} axis {axis} has size {x.shape[axis]}')
    for l in out:
        if l not in size:
            raise ValueError(f'{l} is in the output but in no input')
    return ins, out, size

def broadcast_shape(ops):
    """The output shape: the shapes lined up from the right. An axis of size 1, or a missing one, stretches."""
    n = max(x.ndim for _, x in ops)
    shape = []
    for d in range(n):
        sizes = {src: x.shape[d - n + x.ndim] for src, x in ops if d - n + x.ndim >= 0}
        big = {s for s in sizes.values() if s != 1}
        if len(big) > 1:
            told = ', '.join(f'{src} has {s}' for src, s in sizes.items())
            raise ValueError(f'axis {d - n} (counting from the right): {told}. Sizes must match, or one must be 1.')
        shape.append(big.pop() if big else 1)
    return tuple(shape)

def broadcast_index(x, shape, idx):
    """x's index for the output index `idx`. A stretched axis always reads 0."""
    n = len(shape)
    return tuple(0 if x.shape[a] == 1 and shape[n - x.ndim + a] > 1 else idx[n - x.ndim + a] for a in range(x.ndim))

def marks(a, idx):
    """For each operand, which of its cells make out at `idx`."""
    result = []
    for k, (_, x) in enumerate(a.ops):
        m = np.zeros(x.shape, bool)
        if a.kind == 'einsum':
            for pos in np.ndindex(x.shape):
                seen = dict(zip(a.out, idx))   # a letter takes one value everywhere it appears
                m[pos] = all(seen.setdefault(l, p) == p for l, p in zip(a.ins[k], pos))
        else:
            m[broadcast_index(x, a.shape, idx)] = True
        result.append(m)
    return result

def cell_index(cell, shape):
    """The index written in `cell`, e.g. '1,2', or the first cell if it isn't one of `shape`'s."""
    try:
        idx = tuple(int(s) for s in cell.split(',') if s.strip())
    except ValueError:
        idx = ()
    if len(idx) != len(shape) or not all(0 <= i < s for i, s in zip(idx, shape)):
        idx = (0,) * len(shape)
    return idx

def grid(name, x, marked, clickable=False):
    """One array for pie.ui.grids."""
    return {'name': f'{name} {x.shape}', 'values': np.round(x, 2).tolist(), 'marked': marked.tolist(),
            'clickable': clickable}

def inputs(a, marked):
    """The operands as grids, with the symbol that combines them in between."""
    items = []
    for k, ((src, x), m) in enumerate(zip(a.ops, marked)):
        if k:
            items.append({'text': SHOWN[a.seps[k - 1]]})
        items.append(grid(src, x, m))
    return items

def failed(expr, error):
    """The operands, unmarked, then the error in place of out. Only the error if the operands can't be found."""
    try:
        a = operands(expr)
    except Exception:
        return [{'error': str(error)}]
    return inputs(a, [np.zeros(x.shape, bool) for _, x in a.ops]) + [{'error': str(error)}]

def figure(expr, cell):
    """The operands and out as grids. The cells that make the chosen cell of out are marked."""
    try:
        a = analyze(expr)
    except Exception as e:
        return json.dumps(failed(expr, e))
    idx = cell_index(cell, a.result.shape)
    chosen = np.zeros(a.result.shape, bool)
    chosen[idx] = True
    items = inputs(a, marks(a, idx)) + [{'text': '→'}, grid('out', a.result, chosen, clickable=True)]
    return json.dumps(items)

u = np.array([1, 2, 3])
v = np.array([10, 20, 30, 40])
A = np.arange(6).reshape(2, 3)
B = np.arange(12).reshape(3, 4)
S = np.arange(9).reshape(3, 3)
T = np.arange(24).reshape(2, 3, 4)

# From machine learning, kept small: 4 samples of 3 features, 2 attention heads, 2 queries, 3 keys.
X = np.array([[1., 2, 3], [4, 6, 8], [2, 3, 1], [5, 0, 1]])   # data: a sample per row
Y = np.array([[0., 1, 0], [1, 1, 1]])                          # 2 more points
mu, sigma = X.mean(axis=0), X.std(axis=0)                     # each feature's mean and spread
m, s = X.mean(axis=1, keepdims=True), X.std(axis=1, keepdims=True)   # each sample's mean and spread
gamma, beta = np.array([1., 2, 0.5]), np.array([0., 1, -1])   # layer norm's gain and bias
W, b = np.arange(6.).reshape(3, 2) / 10, np.array([1., -1])   # a linear layer, 3 features in, 2 out
G = np.eye(3) + 0.5                                           # a metric, for x·Gx
Wb = np.arange(18.).reshape(2, 3, 3) / 10                     # a bilinear layer, 2 outputs
Q = np.arange(12.).reshape(2, 2, 3) / 10                      # queries: head, query, dim
K = np.arange(18.).reshape(2, 3, 3) / 10                      # keys: head, key, dim
P = np.full((2, 2, 3), 0.25) + np.eye(3)[:2] / 4              # attention weights: head, query, key
V = np.arange(18.).reshape(2, 3, 3) / 10                      # values: head, key, dim
Wo = np.arange(12.).reshape(2, 3, 2) / 10                     # output projection: head, dim, out

examples = [
    'u[:, None] + v', 
    'A + u', 
    'u + v',
    'A @ B', 
    "np.einsum('i,j->ij', u, v)", 
    "np.einsum('ij,jk->ik', A, B)",
    "np.einsum('bij,j->bi', T, v)", 
    "np.einsum('ii->i', S)", 
    '(X - m) / s * gamma + beta',
    '(X[:, None, :] - Y[None, :, :]) ** 2',
    "np.einsum('hqd,hkd->hqk', Q, K)",
    "np.einsum('hqk,hkd->hqd', P, V)",
    "np.einsum('hqd,hdo->qo', Q, Wo)",
]
expr = pie.text(examples[0], out='expr')
cell = pie.text('', out='cell')   # the chosen cell of out, e.g. '1,2'
pie.ui.dropdown(expr, options=examples, label='Examples')
pie.ui.textbox(expr, label='DIY')
pie.ui.grids(pie.lift(figure, pie.Text)(expr, cell), cell)
```
