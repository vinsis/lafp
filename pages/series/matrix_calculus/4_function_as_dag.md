---
title: Function is a DAG
description: View a function as a directed acyclic graph (DAG) with Jacobians on its edges, the idea behind how autodiff systems compute gradients.
canvas: left
---

# Function is a DAG

Viewing a function as a directed acyclic graph is a powerful tool. It allows one to understand how autodiff systems are designed and used to compute gradients.

---

## 0. Simple examples

- DAG of $y = f(x)$: $\textcolor{#b45309}{x \longrightarrow y}$
- DAG of $\textcolor{#e11d48}{z = g(y)}, y = f(x)$: $\textcolor{#b45309}{x \longrightarrow y \longrightarrow z}$

Note that the we have left out _how_ the input is mapped to the output. The DAG only shows the structure of the function and how different variables are related to each other.

Consider a function that calculates the variance of $n$ variables $\sigma^2 = \frac{1}{n}\sum_{i=1}^n(\underbrace{x_i - \mu}_{\textcolor{#e11d48}{y_i}})^2$ where $\mu = \frac{1}{n}\sum_{i=1}^n x_i$.

```python-editor collapsed
pie.clear()
pie.scalar(40, out='unit')
GRAY, TEAL = '#71717a', '#0d9488'
# Edges of the DAG, as (tail, head)
EDGES = [
    ((-6.4, 1.3), (-2.3, 1.3)), ((-6.4, 1.0), (-4.5, 0.3)), ((-6.4, -1.0), (-4.5, -0.3)),
    ((-6.4, -1.3), (-2.3, -1.3)), ((-3.5, 0.3), (-2.3, 1.0)), ((-3.5, -0.3), (-2.3, -1.0)),
    ((-0.9, 1.0), (1.0, 0.4)), ((-0.9, -1.0), (1.0, -0.4)), ((3.2, 0), (4.8, 0)),
]
for k, (a, b) in enumerate(EDGES, start=1):
    tail = pie.point(a[0], a[1], out=f'a{k}a', hidden=True)
    head = pie.point(b[0], b[1], out=f'a{k}b', hidden=True)
    pie.annotate_arrow(tail, head, 0, out=f'e{k}', stroke=GRAY)
# Nodes of the DAG, as (label, id, x, y)
NODES = [
    ('x₁', 'nx1', -7.3, 1.1), ('x₂', 'nx2', -7.3, -1.3), ('μ', 'nmu', -4.1, -0.2),
    ('y₁', 'ny1', -1.7, 1.1), ('y₂', 'ny2', -1.7, -1.3), ('y₁²+y₂²', 'nsq', 2.0, -0.2), ('σ²', 'ns2', 5.1, -0.2),
]
for label, name, x, y in NODES:
    pie.text(label, x, y, 18, out=name, stroke=TEAL)
pie.text('A DAG of the variance function', 0, -2.9, 15, out='ncap', stroke=GRAY)
```

The DAG of the variance function connects each input $x_i$ both to the mean $\mu$ and (via $y_i = x_i - \mu$) to the sum of squares $y_1^2 + y_2^2$, which finally produces $\sigma^2$.

---

## 1. Mixing vectors and scalars

In the previous example, every node in the DAG of variance function was a scalar. We can consider a DAG where some of the nodes are vectors. This provides a more linear-algebraic view of the function. From this point of view, variance is a function $f: R^n \rightarrow R$.

```python-editor collapsed
pie.clear()
pie.scalar(40, out='unit')
GRAY, TEAL, PINK = '#71717a', '#0d9488', '#be185d'
# Edges of the DAG, as (tail, head)
EDGES = [
    ((-5.4, 1.5), (-3.1, 1.5)), ((-5.4, 1.2), (-3.0, -0.5)), ((-2.5, 1.1), (-2.5, -0.3)),
    ((-1.9, -0.8), (0.3, -0.8)), ((2.3, -0.8), (4.0, -0.8)),
]
for k, (a, b) in enumerate(EDGES, start=1):
    tail = pie.point(a[0], a[1], out=f'b{k}a', hidden=True)
    head = pie.point(b[0], b[1], out=f'b{k}b', hidden=True)
    pie.annotate_arrow(tail, head, 0, out=f'g{k}', stroke=GRAY)
# Nodes of the DAG, as (label, id, x, y)
NODES = [
    ('x', 'mx', -6.2, 1.3), ('μ', 'mmu', -2.6, 1.5), ('y', 'my', -2.6, -1.0),
    ('‖y‖²', 'mn', 1.0, -1.0), ('σ²', 'ms', 4.3, -1.0),
]
for label, name, x, y in NODES:
    pie.text(label, x, y, 18, out=name, stroke=TEAL)
pie.text('∈ R²', -6.2, 0.4, 14, out='mrx', stroke=PINK)
pie.text('∈ R²', -2.9, -1.9, 14, out='mry', stroke=PINK)
pie.text('Another DAG of the variance function', 0, 2.8, 15, out='mcap', stroke=GRAY)
```

Here $x, y$ are vectors while the rest are scalars, giving another DAG of the same variance function.

$$\begin{aligned} \mu &= \frac{1}{n}1^Tx \\ y &= \underbrace{x - \mu}_{\textcolor{#e11d48}{\text{elementwise subtraction}}} \\ \|y\|^2 &= y^Ty \\ \sigma^2 &= \frac{1}{n}\|y\|^2 \end{aligned}$$

Here $x, y$ are vectors while the rest are scalars.

---

## 2. Jacobians as edge representations

Each edge can be seen as a function $f: R^n \rightarrow R^m$ whose Jacobian is a matrix of shape $(m, n)$. We attach this Jacobian matrix to its corresponding edge.

$$x \in R^n \xrightarrow[{\textcolor{#b45309}{\text{Shape (m,n)}}}]{\textcolor{#b45309}{\partial y / \partial x}} y \in R^m$$

Next we will see how to use this setup to calculate the Jacobian of the function represented by the DAG.

---

[← Key matrix derivatives](/series/matrix_calculus/3_key_derivatives)  ·  [Autodiff on a DAG →](/series/matrix_calculus/5_autodiff_on_dag)
