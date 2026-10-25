---
title: Linear operator
description: Matrix calculus starts with a small change in output for a small change in input. Linear operators, the product and chain rules, and worked examples.
canvas: left
---

# Linear operator

Let's start with the central idea of calculus: a small change in output $dy$ given a small change in input $dx$, for a function $y = f(x)$ where $x,y$ can be scalars or vectors: 

$$dy = f(x+dx) - f(x)$$

Canceling the higher order terms involving $dx$ leaves $dy$ as a linear function of $dx$. As an example, consider $Y = X^2 = XX$:

$$\begin{aligned} dY &= f(X+dX) - f(X) \\ &= (\textcolor{#1d4ed8}{X} + \textcolor{#be185d}{dX})(\textcolor{#1d4ed8}{X} + \textcolor{#be185d}{dX}) - \textcolor{#1d4ed8}{X^2} \\ &= \textcolor{#1d4ed8}{X^2} + \textcolor{#1d4ed8}{X}\textcolor{#be185d}{(dX)} + \textcolor{#be185d}{(dX)}\textcolor{#1d4ed8}{X} + \underbrace{\textcolor{#be185d}{(dX)}\textcolor{#be185d}{(dX)}}_{\text{higher order}} - \textcolor{#1d4ed8}{X^2} \\ &= \textcolor{#1d4ed8}{X}\textcolor{#be185d}{(dX)} + \textcolor{#be185d}{(dX)}\textcolor{#1d4ed8}{X} \\ &= \textcolor{#b45309}{X(dX) + (dX)X} \end{aligned}$$

The term $(dX)(dX)$ is dropped as higher order, and note $X(dX) \ne (dX)X$. Though not immediately obvious, $dY$ is a linear function of $dX$. For a fixed $dX$, $dY$ is also a (not necessarily linear) function of $X$.

---

## 0. Linear operator

> A linear operator is a linear map from one vector space to another vector space. 

It has a subtle difference from a function: a function can be a map from any set to any set, but here we constrain the input and outputs to be elements of a vector space. The most common example of a linear operator is a matrix (ref: [Matrix is a function](/la/3_mat_vec_mul)). In fact, any linear operator can be represented as a matrix. However it is often more efficient to write it in _the less obvious_ way (as in the above example). It will become clearer as we proceed.

For a (smooth) function $f: R^n \rightarrow R^m$, we can obtain a linear operator $L_f$ which is a function of $dX$ (a small change in input) and whose output is a function of $X$ (a small change in output $dY$ at the point $X$). 

```python-editor collapsed
pie.clear()
pie.scalar(50, out='unit')
pie.scalar(0, out='gridOpacity')
TEAL, GRAY = '#0d9488', '#71717a'
left_center = pie.point(-5, 0.5, out='left_center', hidden=True)
right_center = pie.point(5, 0.5, out='right_center', hidden=True)
pie.ellipse(left_center, 1.8, 3.8, 0, out='space_in', stroke=TEAL)
pie.ellipse(right_center, 1.8, 3.8, 0, out='space_out', stroke=TEAL)
pie.text('Rⁿ', -5.5, -4.1, 20, out='lab_rn', stroke=TEAL)
pie.text('Rᵐ', 4.5, -4.1, 20, out='lab_rm', stroke=TEAL)
```

```python-editor collapsed
f_arrow_a = pie.point(-3.2, 2.6, out='f_arrow_a', hidden=True)
f_arrow_b = pie.point(3.2, 2.6, out='f_arrow_b', hidden=True)
pie.annotate_arrow(f_arrow_a, f_arrow_b, 0, out='arrow_f', stroke=GRAY)
pie.text('x', -5.7, 2.9, 18, out='lab_x', stroke=GRAY)
pie.text('y', 5.3, 2.9, 18, out='lab_y', stroke=GRAY)
lab_f = pie.text('f', -0.2, 3.4, 18, out='lab_f', stroke=GRAY)
```

First, the original function $f$ carries a point $X$ in $R^n$ across to its image $y$ in $R^m$ (the grey layer).

```python-editor collapsed
lf_arrow_a = pie.point(-3.2, -1.6, out='lf_arrow_a', hidden=True)
lf_arrow_b = pie.point(3.2, -1.6, out='lf_arrow_b', hidden=True)
pie.annotate_arrow(lf_arrow_a, lf_arrow_b, 0, out='arrow_lf', stroke=TEAL)
induce_a = pie.point(0, 1.5, out='induce_a', hidden=True)
induce_b = pie.point(0, -0.5, out='induce_b', hidden=True)
pie.annotate_arrow(induce_a, induce_b, 0, out='arrow_induce', stroke=GRAY)
pie.text('dx', -6.1, -1.3, 18, out='lab_dx')
pie.text('dy', 5.3, -1.3, 18, out='lab_dy')
lab_lf = pie.text('Lf', -0.5, -2.1, 18, out='lab_lf', stroke=TEAL)
```

Then the linear operator $L_f$ sends the small change $dX$ to the corresponding change $dY$ (the teal layer), the map that $f$ induces at the point $X$.

$$\begin{aligned} f(X) &= X^2 \\ L_f[dX] &= X(dX) + (dX)X \end{aligned}$$

#### Verification using Python
```python
import torch

def square(X):
  return X @ X

def d_square(dX):
  def operator(X):
    return X @ dX + dX @ X
  return operator

X = torch.randn(1000,1000,dtype=torch.float64)
dX = torch.randn_like(X).mul(1e-8)

actual_dy = (X+dX)@(X+dX) - X@X
# The below line is the same as
# dy = X @ dX + dX @ X
dy = d_square(dX)(X)

torch.allclose(actual_dy, dy)

'''
Outputs:
True
'''
```

Note: $L_f[dX]$ is linear in $dX$ but may not be linear in $X$. For example:

$$\begin{aligned} f(X) &= X^3 \\ L_f[dX] &= f(X+dX) - f(X) \\ &= (\textcolor{#1d4ed8}{X}+\textcolor{#be185d}{dX})^3 - \textcolor{#1d4ed8}{X^3} \\ &= \textcolor{#b45309}{(dX)X^2 + X(dX)X + X^2(dX)} \end{aligned}$$

which is not linear in $X$.

---

## 1. Product rule and chain rule

Consider two (possibly vector-valued) functions along with their (differential) linear operators:

$$\begin{aligned} f(x+dx) &= f(x) + L_f[dx] \\ g(x+dx) &= g(x) + L_g[dx] \end{aligned}$$

Then for a function $h(x) = f(x) * g(x)$, we have:

$$\begin{aligned} dh &= h(x+dx) - h(x) \\ &= \big(f(x) + \textcolor{#be185d}{L_f[dx]}\big) * \big(g(x) + \textcolor{#047857}{L_g[dx]}\big) - f(x)*g(x) \\ &= \textcolor{#be185d}{L_f[dx]} * g(x) + f(x) * \textcolor{#047857}{L_g[dx]} + \underbrace{\textcolor{#be185d}{L_f[dx]} * \textcolor{#047857}{L_g[dx]}}_{\text{higher order}} \\ &= \textcolor{#b45309}{L_f[dx] * g(x) + f(x) * L_g[dx]} \end{aligned}$$

This is the product rule for vector valued functions (the last term is dropped as a higher order term).

Now consider another function $p(x) = f(g(x))$. Then we have:

$$\begin{aligned} dp &= p(x+dx) - p(x) \\ &= f(g(x+dx)) - f(g(x)) \\ &= f(g(x) + \underbrace{\textcolor{#047857}{L_g[dx]}}_{\textcolor{#047857}{dg}}) - f(g(x)) \\ &= L_f[\textcolor{#047857}{dg}] \\ &= \textcolor{#b45309}{L_f[\textcolor{#047857}{L_g[dx]}]} \end{aligned}$$

This is the chain rule for vector valued functions. Note that $L_g[dx]$ is evaluated at $x$ and $L_f[L_g[dx]]$ is evaluated at $g(x)$. This will become clear with an example below.

---

## 2. Some examples

Below are some interesting examples of differential linear operators. Note that $d(A^T) = (dA)^T$ for any matrix or vector $A$.

---

### 2.1. $f(x) = \lVert x \rVert^2$ where $x$ is a vector

This function calculates the squared norm of a vector. It can be re-written as $f(x) = \lVert x \rVert^2 = x^Tx$. Now we just use $df$ instead of $L_f$:

$$\begin{aligned} df &= f(x+dx) - f(x) \\ &= (\textcolor{#1d4ed8}{x}+\textcolor{#be185d}{dx})^T(\textcolor{#1d4ed8}{x}+\textcolor{#be185d}{dx}) - \textcolor{#1d4ed8}{x^Tx} \\ &= \textcolor{#1d4ed8}{x^Tx} + \textcolor{#be185d}{(dx)}^T\textcolor{#1d4ed8}{x} + \textcolor{#1d4ed8}{x}^T\textcolor{#be185d}{(dx)} + \underbrace{\textcolor{#be185d}{(dx)}^T\textcolor{#be185d}{(dx)}}_{\text{higher order}} - \textcolor{#1d4ed8}{x^Tx} \\ &= \textcolor{#be185d}{(dx)}^T\textcolor{#1d4ed8}{x} + \textcolor{#1d4ed8}{x}^T\textcolor{#be185d}{(dx)} \\ &= \textcolor{#1d4ed8}{x}^T\textcolor{#be185d}{(dx)} + \textcolor{#1d4ed8}{x}^T\textcolor{#be185d}{(dx)} \\ &= \textcolor{#b45309}{2x^Tdx} \end{aligned}$$

where we used the fact that $(dx)^Tx$ is a scalar and hence equals $x^Tdx$. Thus, if the change $dx$ is orthogonal to the vector $x$, then the change in output $dy$ is zero since $x^Tdx = 0$. This makes sense because this small change can be seen as a rotation of the vector $x$. The rotation does not change the length of $x$.

---

### 2.2. $f(X) = X^n$

$$df = \sum_{i=0}^{n-1} X^i(dX)X^{n-1-i}$$

We already saw this for the case of $f(X) = X^2$. To prove this, one can apply the product rule and use induction with the initial condition $df(X) = dX$. Assuming that it is true for $f(X) = X^{n-1}$, we have:

$$\begin{aligned} df &= d(XX^{n-1}) \\ &= (dX)X^{n-1} + X\,d(X^{n-1}) \\ &= (dX)X^{n-1} + X\sum_{i=0}^{n-2} X^i(dX)X^{n-2-i} \\ &= \underbrace{(dX)X^{n-1}}_{i=0 \text{ term}} + \underbrace{\sum_{i=1}^{n-1} X^i(dX)X^{n-1-i}}_{\text{shift } i \,\to\, i+1} \\ &= \textcolor{#b45309}{\sum_{i=0}^{n-1} X^i(dX)X^{n-1-i}} \end{aligned}$$

Note how it is similar to the case of $d(x^n) = nx^{n-1}$. However since matrix multiplication is not commutative, the order of $dX$ and $X$ is important.

---

### 2.3. $f(X) = X^{-1}$

One can use the identity $XX^{-1} = I$ and then apply the product rule to it:

$$\begin{aligned} d(XX^{-1}) &= d(I) \\ \underbrace{(dX)X^{-1}}_{d(X)\,X^{-1}} + \underbrace{X(dX^{-1})}_{X\,d(X^{-1})} &= 0 \\ X(dX^{-1}) &= -(dX)X^{-1} \\ dX^{-1} &= \textcolor{#b45309}{-X^{-1}(dX)X^{-1}} \end{aligned}$$

where the last line follows from left-multiplying both sides by $X^{-1}$.

---

### 2.4. $f(Q) = QQ^T$ where $Q$ is an orthonormal matrix

Using the property of orthonormal matrix, we have $Q^TQ = I$. We can use the fact that $d(Q^TQ) = d(I) = 0$.

$$\begin{aligned} d(Q^TQ) &= d(I) \\ \underbrace{(dQ)^TQ}_{= \,(Q^TdQ)^T} + Q^TdQ &= 0 \\ Q^TdQ &= -(Q^TdQ)^T \end{aligned}$$

Thus $Q^TdQ$ is negative of its transpose, which means $Q^TdQ$ is a skew-symmetric matrix. This insight is a motivation for key ideas behind Lie algebra, a quick introduction of which can be found [here](/series/rotations/lie_algebra).

---

## 3. Closing example

We end this part with an example of a chain rule for a matrix-valued function. We have:

$$\begin{aligned} g(X) &= X^2 \\ f(X) &= X^{-1} \\ h(X) &= f(g(X)) \\ dh &= L_f[\textcolor{#047857}{L_g[dX]}] \\ &= L_f[\textcolor{#047857}{\underbrace{X(dX) + (dX)X}_{dg}}] \\ &= \textcolor{#b45309}{-(X^2)^{-1}\big(X(dX) + (dX)X\big)(X^2)^{-1}} \end{aligned}$$

This can be numerically verified like so:

```python
import torch
x = torch.rand(1000,1000).double()
dx = torch.randn_like(x).mul(1e-8)

def square(x):
  return x @ x

def invert(x):
  return torch.linalg.inv(x)

def d_square(dx):
  def operator(x):
    return x @ dx + dx @ x
  return operator

def d_invert(dx):
  def operator(x):
    x_inv = torch.linalg.inv(x)
    return -x_inv @ dx @ x_inv
  return operator
```

Finally, we perturb the input by a small value and record the change in the output $dY$. Finally we calculate the change in output using the chain rule $df$.

```python
y = invert(square(x))
dy = invert(square(x+dx)) - y

g = square(x)
dg = d_square(dx)(x)
df = d_invert(dg)(g)
torch.allclose(df, dy)

'''
Outputs:
True
'''
```

---

[Gradient of a function →](/series/matrix_calculus/1_gradient)
