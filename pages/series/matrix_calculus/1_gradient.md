---
title: Gradient of a function
canvas: left
---

# Gradient of a function

We start with functions whose output is a scalar. **The gradient is defined only for scalar-valued functions**; for vector-valued functions, it generalizes to the Jacobian.

---

## 0. What is a gradient?

Consider a scalar-valued function $f(\underbrace{x}_{\in R^n}) = \underbrace{y}_{\in R}$. Then a small change in output given a small change in input can be expressed as an inner product with the change in input $dx$:

$$\begin{aligned} \overbrace{L_f[dx]}^{\text{scalar}} &= \langle \ \overbrace{?}^{\in R^n} \ , dx \rangle \\ &= \textcolor{#b45309}{\langle \ \underbrace{\nabla f}_{grad(f)} \ , dx \rangle} \end{aligned}$$

This is because $L_f[dx]$ is a linear function of $dx$ and its output is a scalar. Note that this becomes possible only because the output is a scalar. $\nabla f$ is the gradient of $f$. It is a vector with the same dimension as the input vector $x$.

Conceptually, the gradient of a scalar-valued function is a vector whose components are the partial derivatives of the function with respect to each of the coordinates of the input vector.

$$\langle \underbrace{\textcolor{#b45309}{\begin{bmatrix} \partial f / \partial x_1 \\ \partial f / \partial x_2 \\ \vdots \\ \partial f / \partial x_n \end{bmatrix}}}_{\textcolor{#b45309}{\nabla f}}, \underbrace{\begin{bmatrix} dx_1 \\ dx_2 \\ \vdots \\ dx_n \end{bmatrix}}_{dx} \rangle = df$$

---

### 0.1 Gradient is perpendicular to the tangent plane

In the above expression, setting $df = 0$ gives us $\langle \nabla f, dx \rangle = 0$. Since the output does not change, the vector $dx$ lies in the tangent plane of the function $f$ at the point $x$. The gradient $\nabla f$ is perpendicular to the tangent plane.

For example, consider $f(x) = \|x\|$. Writing $f(x) = \sqrt{x^Tx}$ and using $d(x^Tx) = 2x^Tdx$, we get $df = \frac{x^Tdx}{\|x\|} = \langle \underbrace{\textcolor{#b45309}{x/\|x\|}}_{\textcolor{#b45309}{\nabla f}}, dx \rangle$. So the gradient of the norm is simply the unit vector in the direction of $x$.

Given a function $R^2 \to R$, one can draw its gradient at each point as a vector field, where each vector represents the gradient at that point:

```python-editor collapsed
pie.clear()
p0 = pie.point(0, 0, out='p0', hidden=True)
p = pie.point(3, 2, out='p')
dist = pie.distance(p, p0, out='dist')
```

- Vector field of $f(x) = \|x\|$.

```python-editor collapsed
import math

AMBER = '#b45309'
# The gradient x / ||x|| of f(x) = ||x|| at each grid point (except the origin),
# drawn as an arrow of length 0.8 starting at that point
LENGTH = 0.8
tails = [(gx, gy) for gx in range(-6, 7) for gy in range(-5, 6) if (gx, gy) != (0, 0)]
dxs = [LENGTH * gx / math.hypot(gx, gy) for gx, gy in tails]
dys = [LENGTH * gy / math.hypot(gx, gy) for gx, gy in tails]
pie.la_vec2d(dxs, dys, [float(gx) for gx, gy in tails], [float(gy) for gx, gy in tails], out='vf', stroke=AMBER)
```

Note how the gradient at each point is a unit vector that points in the same direction as the input point.

```python-editor collapsed
px = pie.lift(lambda q: q[0], pie.Scalar)(p)
py = pie.lift(lambda q: q[1], pie.Scalar)(p)
pie.la_vec2d(px, py, out='vp')
pie.circle(p0, dist, out='circ')
```

Since rotation does not change the magnitude of the vector, all these gradients are normal to the circle passing through this point.

---

## 1. Gradient and the inner product

The idea of inner product between two vectors can be extended to matrices. This allows us to use matrix identities to compute the gradient of a scalar-valued function. The inner product of two matrices $A$ and $B$ (of the same shape) is the sum of their elementwise products. It is also known as the Frobenius inner product and denoted by $\langle A, B \rangle_F$.

---

### 1.1 Frobenius inner product and Frobenius norm

The trace of a square matrix $M$, denoted by $\text{tr}(M)$, is the sum of its diagonal elements. It is connected to the Frobenius inner product like so:

$$\langle \ \underbrace{A,B}_{m,n} \ \rangle_F = \text{tr}(\underbrace{A^TB}_{n,n}) = \text{tr}(\underbrace{B^TA}_{n,n})$$

One can also extend the idea of the norm of a vector to the norm of a matrix. The Frobenius norm of a matrix $A$, denoted by $\|A\|_F$, is the square root of the Frobenius inner product of $A$ with itself.

$$\|A\|_F = \sqrt{\langle A,A \rangle_F} = \sqrt{\text{tr}(A^TA)}$$

---

## 2. Some useful identities

It is helpful to remember some identities that are useful in computing the gradient of a scalar-valued function.

---

### 2.1 Trace of a matrix

- Linear: $\text{tr}(pA + qB) = p\,\text{tr}(A) + q\,\text{tr}(B)$
- Invariant under transposition: $\text{tr}(A) = \text{tr}(A^T)$
- Commutative: $\text{tr}(AB) = \text{tr}(BA)$
- Invariant under circular shifts: $\text{tr}(ABC) = \text{tr}(CAB) = \text{tr}(BCA)$
- Invariant under similarity: $\text{tr}(P^{-1}AP) = \text{tr}(A)$
- And finally: $d(\text{tr}(A)) = \text{tr}(dA)$

---

### 2.2 Kronecker product

More details can be found in [this article](/blog/kronecker_product). Two key properties of the Kronecker product that will come in handy are:

- $vec(\ \underbrace{C}_{c_1,c_2} \overbrace{M}^{c_2,b_2} \underbrace{B^T}_{b_2,b_1} \ ) = \underbrace{(B \otimes C)}_{b_1c_1,b_2c_2} \overbrace{vec(M)}^{b_2c_2}$
- $\text{tr}(A \otimes B) = \text{tr}(A)\,\text{tr}(B)$

---

## 3. Examples

Note that all the functions below are scalar valued.

---

### 3.1 $f(A) = \|A\|_F$

The function can be rewritten as $f = \|A\|_F = \sqrt{\text{tr}(A^TA)}$. Then:

$$\begin{aligned} df &= f(A+dA) - f(A) \\ &= \frac{1}{2\|A\|}\,d(\text{tr}(A^TA)) \\ &= \frac{1}{2\|A\|}\,\text{tr}(d(A^TA)) \\ &= \frac{1}{2\|A\|}\,\text{tr}(A^TdA + dA^TA) \\ &= \frac{1}{2\|A\|}\,\text{tr}(A^TdA + A^TdA) \\ &= \frac{1}{2\|A\|}\,\text{tr}(2A^TdA) \\ &= \frac{1}{\|A\|}\,\text{tr}(A^TdA) \\ &= \langle \underbrace{\textcolor{#b45309}{\frac{A}{\|A\|}}}_{\textcolor{#b45309}{\nabla f}}, dA \rangle \end{aligned}$$

---

### 3.2 $f(A) = x^TAy$

Here we use the trick that the trace of a scalar is the scalar itself. Hence $\text{tr}(c) = c, c \in R$.

$$\begin{aligned} df &= f(A+dA) - f(A) \\ &= x^T\,dA\,y \\ &= \text{tr}(x^T\,dA\,y) \\ &= \text{tr}(yx^T\,dA) \\ &= \text{tr}((xy^T)^T\,dA) \\ &= \langle \underbrace{\textcolor{#b45309}{xy^T}}_{\textcolor{#b45309}{\nabla f}}, dA \rangle \end{aligned}$$

Note that using the Kronecker identity of the bilinear form, we could also write:

$$df = x^T\,dA\,y = \langle \underbrace{\textcolor{#b45309}{x\otimes y}}_{\textcolor{#b45309}{\text{vec}(\nabla f)}}, \text{vec}(dA) \rangle$$

Indeed one can verify that $\text{vec}(xy^T) = x\otimes y$.

---

### 3.3 $f(A) = \det(A)$

Assume that $A^{-1}$ exists. First we establish that $d(\det(I + dX)) = \text{tr}(dX)$ for a small perturbation $dX$.

$$\begin{aligned} \det(I + dX) &= \prod_i(1 + dX_{ii}) + \text{(higher order terms)} \\ &= 1 + \sum_i dX_{ii} + \text{(higher order terms)} \\ &= 1 + \sum_i dX_{ii} \\ &= 1 + \text{tr}(dX) \\ &= \det(I) + \text{tr}(dX) \end{aligned}$$

Next we perturb the matrix $A$ by a small amount $dA$ and rewrite it as $A+dA = A(I + A^{-1}dA)$.

$$\begin{aligned} d(\det(A + dA)) &= d(\det(A)\,\det(I + A^{-1}dA)) \\ &= \det(A)\,d(\det(I + A^{-1}dA)) \\ &= \det(A)\,\text{tr}(A^{-1}dA) \\ &= \text{tr}(\det(A)A^{-1}dA) \\ &= \text{tr}(\underbrace{\det(A)A^{-1}}_{= C_A^T}\,dA) \\ &= \langle \underbrace{\textcolor{#b45309}{C_A}}_{\textcolor{#b45309}{\nabla f}}, dA \rangle \end{aligned}$$

Here $C_A$ is the cofactor matrix of $A$. Thus, the gradient of determinant of a matrix is its cofactor matrix.

Next we will generalize the idea of a gradient to functions whose output is a vector.

---

[← Linear operator](/series/matrix_calculus/0_linear_operator)  ·  [Jacobian of a function →](/series/matrix_calculus/2_jacobian)
