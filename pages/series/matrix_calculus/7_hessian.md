---
title: Hessian and the bilinear form
description: Compute a full Jacobian matrix with batching, then the Hessian, why it is symmetric, its bilinear form, and how to calculate it in PyTorch.
canvas: left
---

# Hessian and the bilinear form

Hessian of a function is the Jacobian of the Jacobian of the function. A function $f(x): R^n \rightarrow R$ has a Jacobian $J_f$ of shape $(,n)$ which is a function of $x$. Thus one can imagine a mapping $x \rightarrow J_f := g(x): R^n \rightarrow R^n$. The Jacobian of $g$ will have a shape of $(n,n)$. This is the Hessian of the function $f$.

We start with calculation of the entire Jacobian matrix, something we have avoided so far.

---

## 0. Calculating the Jacobian matrix

We use the inverse function $f(A) = A^{-1}$ to calculate the Jacobian matrix. First let's calculate the Jacobian using PyTorch as a reference:

#### Python implementation

```python
import torch
from torch.autograd.functional import jacobian

def inverse(x):
    return torch.linalg.inv(x)

x = torch.randn(100,100)

j_x = jacobian(inverse, x)
```

Now remember the JVP of the inverse function:

$$\text{jvp}_f(x,\textcolor{#b45309}{v}) = -x^{-1}\textcolor{#b45309}{v}x^{-1}$$

This is the compressed (or reshaped) form of the vectorized form of the JVP. Now note that $\underbrace{Je_i}_{\text{jvp}(x, e_i)} = \text{i-th column of J}$. Using this trick, we can calculate the `i-th` column of the Jacobian matrix:

#### Verification using Python

```python
i = 1234
# construct a basis vector
basis_vector_i = torch.zeros(100,100)
row = i % 100
col = i // 100
basis_vector_i[row,col] = 1

jacobian_column_i = -y @ basis_vector_i @ y
# need to transpose since pytorch follows row-major order
# also need to transpose the indices of `j_x`
assert torch.allclose(jacobian_column_i, j_x[col, row].t())
```

One could then iterate over the columns to calculate the full Jacobian matrix.

---

### 0.1 Faster calculation by batching

A faster way to calculate the Jacobian matrix is to use batching and calculate $J[e_1, e_2, ..., e_n] = J\,I = J$ in one go.

#### Verification using Python

```python
eye = torch.eye(10000,10000).view(10000,100,100)
j_manual = -y.unsqueeze(0) @ eye @ y.unsqueeze(0)

# the first two dimensions of `j_x` seem to be arranged in column-major order
# `j_manual.view(100,100, ...)` reshapes in row-major order
# so we need to transpose the first two dimensions
j_manual = j_manual.view(100,100,100,100).transpose(0,1)

assert torch.allclose(j_manual, j_x.transpose(-1,-2))
```

---

### 0.2 Calculating rows vs columns

We used JVP to calculate each column of the Jacobian at a time. One could also calculate each row of the Jacobian at a time using the VJP since $e_i^TJ = \text{i-th row of Jacobian}$.

Remember that the VJP of the inverse function is:

$$\text{vjp}_f(x,\textcolor{#b45309}{v}) = -x^{-T}\textcolor{#b45309}{v}x^{-T}$$

One can then use the same procedure as above to calculate the rows of the Jacobian matrix (try it yourself).

---

## 1. Hessian matrix

Let $g(x) \in R^n$ be the gradient of $f(x): R^n \rightarrow R$. Consider the function $h(x): R^n \rightarrow R^n = f \rightarrow g$ written in matrix notation:

$$\begin{bmatrix} x_1 \\ x_2 \\ \vdots \\ x_n \end{bmatrix} \xrightarrow{h} \begin{bmatrix} g_1 \\ g_2 \\ \vdots \\ g_n \end{bmatrix} = \begin{bmatrix} \partial f / \partial x_1 \\ \partial f / \partial x_2 \\ \vdots \\ \partial f / \partial x_n \end{bmatrix}$$

The Jacobian of $h$ is the Hessian of $f$:

$$J_h = \underbrace{\begin{bmatrix} \partial g_1 / \partial x_1 & \partial g_1 / \partial x_2 & \cdots & \partial g_1 / \partial x_n \\ \partial g_2 / \partial x_1 & \partial g_2 / \partial x_2 & \cdots & \partial g_2 / \partial x_n \\ \vdots & \vdots & \ddots & \vdots \\ \partial g_n / \partial x_1 & \partial g_n / \partial x_2 & \cdots & \partial g_n / \partial x_n \end{bmatrix}}_{\textcolor{#b45309}{\text{Hessian of } f}}$$

We could expand each term $\partial g_i / \partial x_j = \partial^2 f / \partial x_j \partial x_i$ in the above matrix to get a more standard form.

---

### 1.1 Hessian is symmetric

There are two ways to look at it. First, the second derivative is symmetric:

$$\underbrace{\frac{\partial^2 f}{\partial \textcolor{#b45309}{x_j} \partial \textcolor{#e11d48}{x_i}}}_{{H_{ij}}} = \underbrace{\frac{\partial^2 f}{\partial \textcolor{#e11d48}{x_i} \partial \textcolor{#b45309}{x_j}}}_{{H_{ji}}}$$

Second, we can calculate how a change in $g$ affects a change in $f$:

$$\begin{aligned} dg &= g(x + \textcolor{#b45309}{dx_g}) - g(x) \\ \Rightarrow \underbrace{H(\textcolor{#b45309}{dx_g})}_{\in \textcolor{#b45309}{R^n}} &= g(x + \textcolor{#b45309}{dx_g}) - g(x) \\ \Rightarrow \underbrace{\textcolor{#e11d48}{dx_f^T}H(\textcolor{#b45309}{dx_g})}_{\in R} &= \underbrace{\langle \textcolor{#e11d48}{dx_f}, g(x + \textcolor{#b45309}{dx_g}) \rangle}_{\text{change in } f(x + \textcolor{#b45309}{dx_g})} - \underbrace{\langle \textcolor{#e11d48}{dx_f}, g(x) \rangle}_{\text{change in } f(x)} \\ &= f(x + \textcolor{#b45309}{dx_g} + \textcolor{#e11d48}{dx_f}) - f(x + \textcolor{#b45309}{dx_g}) - f(x + \textcolor{#e11d48}{dx_f}) + f(x) \\ &= \textcolor{#b45309}{dx_g^T}H(\textcolor{#e11d48}{dx_f}) \end{aligned}$$

But since a scalar is its own transpose, we get $H = H^T$.

---

### 1.2 Bilinear form

Now let's take a look at the LHS of the above expression:

$$\textcolor{#e11d48}{dx_f^T}H(\textcolor{#b45309}{dx_g}) = \begin{bmatrix} \cdots & dx_f^T & \cdots \end{bmatrix} \begin{bmatrix} \ & \vdots & \ \\ \cdots & H & \cdots \\ \ & \vdots & \ \end{bmatrix} \begin{bmatrix} \vdots \\ dx_g^T \\ \vdots \end{bmatrix}$$

The obvious interpretation of this value is that it is the change in (change in `f`) at two points $x$ and $x + \textcolor{#b45309}{dx_g}$. At each point you change the input by $\textcolor{#e11d48}{dx_f}$ and measure the change in output, say $df_1, df_2$. The bilinear form is the difference between the two: $df_1 - df_2$. Since $\textcolor{#b45309}{dx_g}, \textcolor{#e11d48}{dx_f}$ are interchangeable, we can swap them in the above argument, so the bilinear form can be seen as the difference $dy_2 - dy_1$.

```python-editor collapsed
pie.clear()
pie.scalar(40, out='unit')
AMBER, PINK, TEAL, GRAY, FAINT = '#b45309', '#be185d', '#0d9488', '#71717a', '#a1a1aa'

def arrow(name, a, b, color):
    p1 = pie.point(a[0], a[1], out=f'{name}_a', hidden=True)
    p2 = pie.point(b[0], b[1], out=f'{name}_b', hidden=True)
    return pie.annotate_arrow(p1, p2, 0, out=name, stroke=color)

# Left: apply dx_g first, then dx_f at each end
arrow('eLg', (-1.2, -1.5), (-1.2, 1.5), GRAY)
arrow('eLbf', (-1.2, -1.5), (-3.5, -0.6), GRAY)
arrow('eLbd', (-1.2, -1.5), (-3.5, -0.1), FAINT)
arrow('eLtf', (-1.2, 1.5), (-3.5, 2.4), GRAY)
arrow('eLtd', (-1.2, 1.5), (-3.5, 2.9), FAINT)
pie.text('dx_g', -2.0, 0, 20, out='mLdxg', stroke=AMBER)
pie.text('dx_f', -2.6, -1.85, 20, out='mLbf', stroke=PINK)
pie.text('dx_f', -2.7, 1.05, 20, out='mLtf', stroke=PINK)
pie.text('dy₁ {', -4.2, -0.35, 18, out='mLdy1')

# Right: apply dx_f first, then dx_g
arrow('eRg', (0.4, -1.6), (3.2, -1.6), GRAY)
arrow('eRlf', (0.4, -1.6), (0.4, 0.6), GRAY)
arrow('eRld', (0.4, -1.6), (-0.1, 1.0), FAINT)
arrow('eRrf', (3.2, -1.6), (3.2, 0.6), GRAY)
arrow('eRrd', (3.2, -1.6), (2.7, 1.0), FAINT)
pie.text('dx_g', 1.8, -2.3, 20, out='mRdxg', stroke=AMBER)
pie.text('dx_f', 1.25, 0.0, 20, out='mRlf', stroke=PINK)
pie.text('dx_f', 4.05, 0.0, 20, out='mRrf', stroke=PINK)
pie.text('dy₁', -0.3, 1.5, 18, out='mRdy1')
pie.text('dy₂', 2.4, 1.5, 18, out='mRdy2')

# Caption
pie.text('The bilinear form is the difference', 0, -3.1, 18, out='mCap', stroke=GRAY)
pie.text('dy₂', -0.55, -3.95, 18, out='mCdy2', stroke=TEAL)
pie.text('−', 0, -3.95, 18, out='mCminus', stroke=GRAY)
cdy1 = pie.text('dy₁', 0.55, -3.95, 18, out='mCdy1', stroke=TEAL)
pie.text('dy₂ {', -4.2, 2.65, 18, out='mLdy2')
```

First apply $\textcolor{#b45309}{dx_g}$, then measure the change $\textcolor{#e11d48}{dx_f}$ at each end: this gives $dy_1$ and $dy_2$.

Now swap the order, applying $\textcolor{#e11d48}{dx_f}$ first and then $\textcolor{#b45309}{dx_g}$: the bilinear form is the same difference $dy_2 - dy_1$.

Hessian is used in optimization by using second order approximation:

$$f(x + dx) = f(x) + \underbrace{\textcolor{#b45309}{\nabla f(x)^T}}_{\textcolor{#b45309}{\text{gradient}}} dx + \frac{1}{2} dx^T \underbrace{\textcolor{#b45309}{H}}_{\textcolor{#b45309}{\text{Hessian}}} dx$$

In machine learning, it is used in quantization of large models. Check out [optimal brain compression](https://github.com/TinyVolt/optimal-brain-compression) for more information.

---

## 2. Calculating a Hessian in PyTorch

Since Hessian is just the `grad` of the `grad` of a scalar-valued function, one can simply take the gradient of the gradient of a scalar-valued function. The only trick to be aware of is that one needs to be able to have a DAG for a function that maps the input to the gradient of the function. Once that is taken care of, the rest is standard PyTorch `autograd.grad` stuff.

In the example below, we calculate the Hessian of $f(x,y) = x^2y + \sin(x+y)$:

#### Verification using Python

```python
import torch
from torch.autograd import grad
from torch.autograd.functional import hessian

def f(x):
    return x[0]**2 * x[1] + torch.sin(x.sum())

x = torch.rand(2, requires_grad=True)
y = f(x)

# `create_graph=True` is important!
g = grad(y, x, create_graph=True)[0]
first_row_of_hessian = grad(g, x, grad_outputs=torch.Tensor([1,0]), retain_graph=True)[0]
second_row_of_hessian = grad(g, x, grad_outputs=torch.Tensor([0,1]))[0]

hessian_manual = torch.stack([first_row_of_hessian, second_row_of_hessian], dim=0)
hessian_torch = hessian(f, x)
assert torch.allclose(hessian_manual, hessian_torch)
```

One may have noticed that since we calculated each row of the Hessian at a time, we actually used the `vjp` function to calculate the gradient of the gradient of a scalar-valued function. Since the Hessian is a square matrix, it may be better to use the `jvp` function to calculate each _column_ of the Hessian at a time since it does not have any memory overhead. [JAX documentation](https://jax.readthedocs.io/en/latest/notebooks/autodiff_cookbook.html#jacobians-and-hessians-using-jacfwd-and-jacrev) provides more details on how and when to use the `jvp` and `vjp` functions.

---

[← VJP and JVP](/series/matrix_calculus/6_vjp_and_jvp)
