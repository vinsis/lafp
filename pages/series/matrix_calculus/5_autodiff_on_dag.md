---
title: Autodiff on a DAG
description: The chain rule on a computation graph, forward and reverse ways to compute gradients, and why full Jacobians are overkill for autodiff.
canvas: left
---

# Autodiff on a DAG

Here is the setup that we work with: a function is shown as a `(input, output)` edge. The Jacobian of this function is written on the edge itself:

$$x \in R^n \xrightarrow[{\textcolor{#b45309}{\text{Shape (m,n)}}}]{\textcolor{#b45309}{\partial y / \partial x}} y \in R^m$$

This representation is naturally extendable to a composition of functions $\textcolor{#e11d48}{z = g(y)}, y = f(x)$. Next we see how chain rule looks like on this graph.

---

## 0. Chain rule on a graph

Consider two cases. In the first case, we have a simple composition of functions $\textcolor{#e11d48}{z = g(y)}, y = f(x)$. The Jacobian wrt input is the product of Jacobians on each edge:

$$\underbrace{x}_{\in \ R^n} \xrightarrow[{\textcolor{#b45309}{\text{Shape (m,n)}}}]{\textcolor{#b45309}{J_y}} \underbrace{y}_{\in \ R^m} \xrightarrow[{\textcolor{#b45309}{\text{Shape (p,m)}}}]{\textcolor{#b45309}{J_z}} \underbrace{\textcolor{#e11d48}{z}}_{\textcolor{#e11d48}{\in \ R^p}}$$

$$\partial z / \partial x = \underbrace{J_z J_y}_{\textcolor{#b45309}{\text{Shape (p,n)}}}$$

Next we look at a DAG which has two inputs and one output. In this case, the Jacobian wrt input is the sum of Jacobians of each path:

$$\frac{dz}{dx} = (\underbrace{\frac{\partial z}{\partial y}}_{\textcolor{#b45309}{J_3}})(\underbrace{\frac{\partial y}{\partial x}}_{\textcolor{#b45309}{J_2}}) + \underbrace{\frac{\partial z}{\partial x}}_{\textcolor{#b45309}{J_1}}$$

The first path is $J_2 \rightarrow J_3$ and the second path is $J_1$. Written with shapes, $\partial z / \partial x = \underbrace{J_3 J_2}_{\textcolor{#b45309}{(p,n)}} + \underbrace{J_1}_{\textcolor{#b45309}{(p,n)}}$.

```python-editor collapsed
pie.clear()
pie.scalar(40, out='unit')
GRAY, AMBER, TEAL, PINK = '#71717a', '#b45309', '#0d9488', '#be185d'

# An arrow between two hidden points
def edge(name, a, b):
    pa = pie.point(a[0], a[1], out=f'{name}_a', hidden=True)
    pb = pie.point(b[0], b[1], out=f'{name}_b', hidden=True)
    return pie.annotate_arrow(pa, pb, 0, out=name, stroke=GRAY)

edge('e1', (-3.5, 1.5), (3.5, 1.5))
edge('e2', (-3.6, 1.2), (-0.5, -1.4))
edge('e3', (0.5, -1.4), (3.6, 1.2))

labels = [
    ('mj1', 'J₁', -0.2, 2.5, 16, AMBER), ('ms1', '(p,n)', -0.2, 1.9, 12, AMBER),
    ('mj2', 'J₂', -2.9, -0.15, 16, AMBER), ('ms2', '(m,n)', -2.9, -0.8, 12, AMBER),
    ('mj3', 'J₃', 2.9, -0.15, 16, AMBER), ('ms3', '(p,m)', 2.9, -0.8, 12, AMBER),
    ('mx', 'x', -4.15, 1.5, 18, TEAL), ('mz', 'z', 3.85, 1.5, 18, TEAL), ('my', 'y', -0.15, -1.9, 18, TEAL),
    ('mrx', '∈ Rⁿ', -4.3, 2.6, 14, PINK), ('mrz', '∈ Rᵖ', 3.7, 2.6, 14, PINK),
]
for name, value, x, y, size, color in labels:
    pie.text(value, x, y, size, 0, 0, out=name, stroke=color)
mry = pie.text('∈ Rᵐ', -0.4, -2.9, 14, 0, 0, out='mry', stroke=PINK)
```

Both the direct edge $J_1$ and the two-step path $J_2 \rightarrow J_3$ are visible in this triangular DAG.

This is all we need to fully define the chain rule on a graph. In the next example we combine both these cases.

---

### 0.1 Chain rule on a larger graph

```python-editor collapsed
pie.clear()
pie.scalar(40, out='unit')
GRAY, AMBER, TEAL, PINK = '#71717a', '#b45309', '#0d9488', '#be185d'

# An arrow between two hidden points
def edge(name, a, b):
    pa = pie.point(a[0], a[1], out=f'{name}_a', hidden=True)
    pb = pie.point(b[0], b[1], out=f'{name}_b', hidden=True)
    return pie.annotate_arrow(pa, pb, 0, out=name, stroke=GRAY)

edge('exz', (-4.0, 1.2), (0.45, 1.2))
edge('ezw', (1.55, 1.2), (4.05, 1.2))
edge('exy', (-4.15, 0.85), (-2.1, -1.15))
edge('eyz', (-1.4, -1.15), (0.5, 0.85))

labels = [
    ('mj1', 'J₁', -1.75, 2.5, 16, AMBER), ('ms1', '(p,n)', -1.75, 1.55, 12, AMBER),
    ('mj4', 'J₄', 2.75, 2.5, 16, AMBER), ('ms4', '(1,p)', 2.75, 1.55, 12, AMBER),
    ('mj2', 'J₂', -3.55, -0.3, 16, AMBER), ('ms2', '(m,n)', -3.55, -1.15, 12, AMBER),
    ('mj3', 'J₃', 0.4, 0, 16, AMBER), ('ms3', '(p,m)', 0.4, -0.75, 12, AMBER),
    ('mx', 'x', -4.5, 1.2, 18, TEAL), ('mz', 'z', 1.0, 1.2, 18, TEAL),
    ('mw', 'w', 4.5, 1.2, 18, TEAL), ('my', 'y', -1.75, -1.9, 18, TEAL),
    ('mrx', '∈ Rⁿ', -4.4, 2.5, 14, PINK), ('mrz', '∈ Rᵖ', 0.9, 2.5, 14, PINK), ('mrw', '∈ R', 4.4, 2.5, 14, PINK),
]
for name, value, x, y, size, color in labels:
    pie.text(value, x, y, size, 0, 0, out=name, stroke=color)
mry = pie.text('∈ Rᵐ', -1.9, -2.7, 14, 0, 0, out='mry', stroke=PINK)
```

Consider a DAG of a function $w = f(x), w \in R, x \in R^n$ with edges $x \xrightarrow{J_2} y$, $x \xrightarrow{J_1} z$, $y \xrightarrow{J_3} z$ and $z \xrightarrow{J_4} w$ (of shapes $(m,n), (p,n), (p,m), (1,p)$ respectively). 

Then:

$$\begin{aligned} \partial w / \partial x &= J_4(J_1 + J_3 J_2) \\ &= \underbrace{J_4J_1}_{\textcolor{#b45309}{\text{path 1}}} + \underbrace{J_4J_3J_2}_{\textcolor{#b45309}{\text{path 2}}} \end{aligned}$$

This leads to an insight about autodiff on a graph:

> Jacobian of `y` wrt `x` is the sum of all path-products from `x` to `y`.

A path product is the product of all Jacobians along a path.

---

### 0.2 Chain rule for variance

```python-editor collapsed
pie.clear()
GRAY, AMBER, TEAL, PINK = '#71717a', '#b45309', '#0d9488', '#be185d'

# An arrow between two hidden points
def edge(name, a, b):
    pa = pie.point(a[0], a[1], out=f'{name}_a', hidden=True)
    pb = pie.point(b[0], b[1], out=f'{name}_b', hidden=True)
    return pie.annotate_arrow(pa, pb, 0, out=name, stroke=GRAY)

edge('exmu', (-3.85, 1.05), (-1.95, 1.35))
edge('emuy', (-1.6, 1.1), (-1.6, -0.3))
edge('exy', (-3.9, 0.75), (-1.95, -0.55))
edge('eyn', (-1.1, -0.6), (0.9, -0.6))
edge('ens', (2.4, -0.6), (3.8, -0.6))

labels = [
    ('mj1', 'J₁', -2.9, 2.2, 16, AMBER), ('ms1', '(1,2)', -2.9, 1.6, 12, AMBER),
    ('mj2', 'J₂', -1.0, 0.6, 16, AMBER), ('ms2', '(2,1)', -1.0, -0.1, 12, AMBER),
    ('mj3', 'J₃', -3.15, -0.45, 16, AMBER), ('ms3', '(2,2)', -3.15, -1.1, 12, AMBER),
    ('mj4', 'J₄', 0.25, 0.35, 16, AMBER), ('ms4', '(1,2)', 0.25, -0.25, 12, AMBER),
    ('mj5', 'J₅', 3.1, 0.35, 16, AMBER), ('ms5', '(1,1)', 3.1, -0.25, 12, AMBER),
    ('mx', 'x', -4.25, 1.0, 18, TEAL), ('mmu', 'μ', -1.6, 1.5, 18, TEAL), ('my', 'y', -1.6, -0.7, 18, TEAL),
    ('mny', '‖y‖²', 1.6, -0.6, 18, TEAL), ('msig', 'σ²', 4.2, -0.6, 18, TEAL),
    ('mrx', '∈ R²', -4.3, 0.25, 14, PINK),
]
for name, value, x, y, size, color in labels:
    pie.text(value, x, y, size, 0, 0, out=name, stroke=color)
mry = pie.text('∈ R²', -1.7, -1.35, 14, 0, 0, out='mry', stroke=PINK)
```

Let's revisit the DAG of the variance function.

There are two paths from $x$ to $\sigma^2$: the direct edge $x \xrightarrow{J_1} \mu$ and the edges through $y$. We calculate the Jacobians along each path and add them up to get the Jacobian of $\sigma^2$ wrt $x$:


$$\begin{aligned} J_5 &= 1/2 \\ J_4 &= 2y^T \\ J_3 &= \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} \\ J_2 &= \begin{bmatrix} -1 \\ -1 \end{bmatrix} \\ J_1 &= \begin{bmatrix} 1/2 & 1/2 \end{bmatrix} \\ \partial \sigma^2 / \partial x &= J_5J_4J_2J_1 + J_5J_4J_3 \ \textcolor{#b45309}{\in R^{1 \times 2}} \\ &= y^T \begin{bmatrix} 1/2 & 1/2 \end{bmatrix} \begin{bmatrix} -1 \\ -1 \end{bmatrix} + y^T \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} \\ &= \frac{1}{2} x^T \begin{bmatrix} 1 & -1 \\ -1 & 1 \end{bmatrix} \end{aligned}$$

This is a linear-algebraic way of representing:

- the variance function $f(x_1, x_2) = \frac{1}{4}(x_1^2 + x_2^2) - \frac{1}{2}x_1x_2$
- the partial derivative wrt $x_1$ which is $\frac{1}{2}(x_1 - x_2)$
- the partial derivative wrt $x_2$ which is $\frac{1}{2}(x_2 - x_1)$

---

## 1. Two ways to calculate gradients

Consider multiplication of three matrices $J_1, J_2, J_3$ of shapes $(m,n), (p,m), (q,p)$. There are two ways to multiply them:

$$\underbrace{(\underset{\textcolor{#e11d48}{(q,p)}}{J_3} \ \underset{\textcolor{#e11d48}{(p,m)}}{J_2})\underset{\textcolor{#e11d48}{(m,n)}}{J_1}}_{\textcolor{#b45309}{qpm \ + \ qmn}}$$

This is backward differentiation, aka backpropagation.

$$\underbrace{\underset{\textcolor{#e11d48}{(q,p)}}{J_3}(\underset{\textcolor{#e11d48}{(p,m)}}{J_2} \ \underset{\textcolor{#e11d48}{(m,n)}}{J_1})}_{\textcolor{#b45309}{qpn \ + \ pmn}}$$

This is forward differentiation. One can think of them as Jacobians corresponding to functions $a \xrightarrow{J_1} b, b \xrightarrow{J_2} c, c \xrightarrow{J_3} d$. Their product is then the Jacobian corresponding to $a \in R^n \rightarrow d \in R^q$.

In most cases in scientific computing, the input dimension $n$ is large and the output dimension $q$ is small (mostly 1). In this case, the first way (multiplying from output towards input) is more efficient. In cases where the output dimension is large or comparable to the input dimension (eg when calculating Hessian), the second way (multiplying from input towards output) is more efficient.

---

## 2. Jacobians are an overkill for autodiff

This is something that is often skipped or just skimmed over in a lot of text on autodiff. While we assumed the existence of Jacobians to explain the ideas of differentiation on a graph, in practice it is neither cheap nor necessary to actually calculate and store the entire Jacobian matrix for each edge. Let's consider the following function to illustrate the issue:

$$\underbrace{x}_{\textcolor{#e11d48}{(n,n)}} \xrightarrow{J_1} \underbrace{y}_{\textcolor{#e11d48}{\ (=x^{-1})}} \xrightarrow{J_2} \underbrace{z}_{\textcolor{#e11d48}{\ (=\|y\|_F)}}$$

Here the Jacobian $J_1$ is of shape $(n^2,n^2)$ and Jacobian $J_2$ is of shape $(1,n^2)$. Let's try to calculate $\partial z / \partial x$ just by calculating and then multiplying the Jacobians. This is not efficient but we are doing it just to see why it is not efficient.

---

### 2.1 Calculating the Jacobians

We know that:

$$\begin{aligned} dy &= -x^{-1}(dx)x^{-1} \\ \Rightarrow \text{vec}(dy) &= \underbrace{((x^{-1})^T \otimes x^{-1})}_{\textcolor{#b45309}{J_1}} \text{vec}(dx) \end{aligned}$$

Similarly:

$$\begin{aligned} \nabla z_y &= \frac{y}{z} \\ \Rightarrow \textcolor{#b45309}{J_2} &= \frac{1}{z}(\text{vec}(y))^T \end{aligned}$$

Now that we have both the Jacobian matrices, we can calculate the product of them to get the Jacobian of $z$ wrt $x$. The product will be of shape $(1,n^2)$. It will need to be reshaped to a $(n,n)$ matrix. In the next part, we will implement it in a more efficient way.

#### Python implementation
```python
import torch

# perform backprop to calculate `x.grad`
x = torch.randn(100,100, requires_grad=True, dtype=torch.float64)
y = torch.linalg.inv(x)
z = torch.linalg.norm(y)
z.backward()

# calculate the Jacobians
x_inv = torch.linalg.inv(x).contiguous()
x_inv_t = torch.linalg.inv(x).t()
j1 = torch.kron(-x_inv_t, x_inv)

# need to transpose `y` first
# since pytorch uses row-major order
j2 = (y.t()/z).reshape(1,-1)

# calculate the jacobian and compare with actual gradient
j3 = (j2 @ j1).reshape(100,100).t()
assert torch.allclose(j3, x.grad)
```

---

[← Function is a DAG](/series/matrix_calculus/4_function_as_dag)  ·  [VJP and JVP →](/series/matrix_calculus/6_vjp_and_jvp)
