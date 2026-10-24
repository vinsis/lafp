---
title: 2D rotations
canvas: left
---

# 2D rotations

Rotations in a 2D plane are mostly understood either through a matrix or through complex numbers.

> Rotations in 2D can be fully described by center and angle of rotation.

---

## 0. Matrix representation

```python-editor collapsed
import math

pie.clear()
pie.scalar(65, out='unit')
GRAY, BLUE, GOLD = '#71717a', '#1d4ed8', '#ca8a04'
p0 = pie.point(0, 0, out='p0', hidden=True)
rr = 2
pie.circle(p0, rr, out='circ', stroke=GRAY)
theta = 0.5
px, py = rr * math.cos(theta), rr * math.sin(theta)
alpha = pie.scalar(0, out='alpha')
# (x, y) turned by the angle a
turn_x = pie.lift(lambda a, x, y: math.cos(a) * x - math.sin(a) * y, pie.Scalar)
turn_y = pie.lift(lambda a, x, y: math.sin(a) * x + math.cos(a) * y, pie.Scalar)
qx, qy = turn_x(alpha, px, py), turn_y(alpha, px, py)
pie.la_vec2d(px, py, out='vP', stroke=BLUE)
pie.la_vec2d(qx, qy, out='vQ', stroke=GOLD)
```

A vector $\textcolor{#1d4ed8}{\begin{bmatrix} r\cos\theta & r\sin\theta \end{bmatrix}}$ when rotated by an angle $\textcolor{#0d9488}{\alpha}$ becomes $\textcolor{#be185d}{\begin{bmatrix} r\cos(\theta+\textcolor{#0d9488}{\alpha}) & r\sin(\theta+\textcolor{#0d9488}{\alpha}) \end{bmatrix}}$.

```python-editor collapsed
pie.translate_scalar_to(alpha, 1.2, animate=True)
```

Expanding with the angle-sum identities:

$$\begin{aligned}
r\cos(\theta+\textcolor{#0d9488}{\alpha}) &= r\cos\theta\cos\textcolor{#0d9488}{\alpha} - r\sin\theta\sin\textcolor{#0d9488}{\alpha} \\
r\sin(\theta+\textcolor{#0d9488}{\alpha}) &= r\sin\theta\cos\textcolor{#0d9488}{\alpha} + r\cos\theta\sin\textcolor{#0d9488}{\alpha}
\end{aligned}$$

which we can regroup as a matrix acting on the original vector:

$$\textcolor{#be185d}{\begin{bmatrix} r\cos(\theta+\alpha) \\ r\sin(\theta+\alpha) \end{bmatrix}} = \underbrace{\begin{bmatrix} \cos\textcolor{#0d9488}{\alpha} & -\sin\textcolor{#0d9488}{\alpha} \\ \sin\textcolor{#0d9488}{\alpha} & \cos\textcolor{#0d9488}{\alpha} \end{bmatrix}}_{\text{rotation matrix}} \textcolor{#1d4ed8}{\begin{bmatrix} r\cos\theta \\ r\sin\theta \end{bmatrix}}$$

This implies that the rotation matrix is $\begin{bmatrix} \cos\textcolor{#0d9488}{\alpha} & -\sin\textcolor{#0d9488}{\alpha} \\ \sin\textcolor{#0d9488}{\alpha} & \cos\textcolor{#0d9488}{\alpha} \end{bmatrix}$. Refer to [this article](/la/12_rotations) for two different ways to derive this matrix step-by-step.

---

## 1. Complex numbers

```python-editor collapsed
import math

pie.clear()
BLUE = '#1d4ed8'
deg = pie.scalar(30, out='deg')
# A complex number a + ib is drawn as the point (a, b); e^{iθ} = cos θ + i sin θ
ei_theta = pie.lift(lambda d: (math.cos(math.radians(d)), math.sin(math.radians(d))), pie.Point)(deg, out='ei_theta', fill=BLUE)
z0 = pie.point(3, 0, out='z0')
# (a + ib)(c + id) = (ac − bd) + i(ad + bc)
complex_mul = pie.lift(lambda w, z: (w[0] * z[0] - w[1] * z[1], w[0] * z[1] + w[1] * z[0]), pie.Point)
z1 = complex_mul(ei_theta, z0, out='z1')
```

A complex number $z = a + ib$ (where $i$ is the imaginary number i.e. $i^2 = -1$) can be thought of as an ordered tuple of two numbers `a` and `b`. This tuple `(a,b)` can be used to represent the point $\begin{bmatrix} a \\ b \end{bmatrix}$ in the 2D plane. Since we know how to multiply two complex numbers, and we know how to visualize a complex number as a 2D vector, we can visualize the multiplication of two 2D vectors.

$$(a + ib)(c + id) = \underbrace{(ac-bd)}_{\text{real part}} + i\underbrace{(ad+bc)}_{\text{imaginary part}}$$

Now consider a special class of imaginary numbers: $\textcolor{#0d9488}{z = \cos\theta + i\sin\theta}$. Multiplying this with any complex number $\textcolor{#1d4ed8}{x + iy}$ gives:

$$\textcolor{#0d9488}{(\cos\theta + i\sin\theta)}\textcolor{#1d4ed8}{(x + iy)} = \textcolor{#be185d}{(x\cos\theta - y\sin\theta) + i(x\sin\theta + y\cos\theta)}$$

Reading the real and imaginary parts as the coordinates of a vector, this is exactly a rotation matrix acting on the original vector:

$$\textcolor{#be185d}{\begin{bmatrix} x\cos\theta - y\sin\theta \\ x\sin\theta + y\cos\theta \end{bmatrix}} = \underbrace{\textcolor{#0d9488}{\begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}}}_{\text{rotation matrix}} \textcolor{#1d4ed8}{\begin{bmatrix} x \\ y \end{bmatrix}}$$

Therefore, to rotate any vector $\begin{bmatrix} x & y \end{bmatrix}$ by an angle $\theta$, we convert the vector into the corresponding complex number $x + iy$, multiply it by the complex number $\cos\theta + i\sin\theta$ and then convert the product (which is also a complex number) back to a vector. This is the reason why complex numbers are used to represent rotations in many applications.

Here $\textcolor{#0d9488}{z_0 = 3 + 0i}$ is itself a complex number. Multiplying it by $\textcolor{#0d9488}{e^{i\theta}}$ gives $z_1 = \textcolor{#0d9488}{e^{i\theta}} z_0$, the point $(3, 0)$ rotated by $\theta$.

---

## 1.1. Complex exponential

```python-editor collapsed
import math
import numpy as np

pie.clear()
pie.scalar(180, out='unit')
GRAY, BLUE, PINK, GOLD = '#71717a', '#1d4ed8', '#be185d', '#ca8a04'
p0 = pie.point(0, 0, out='p0', hidden=True)
pie.circle(p0, 1, out='ucirc', stroke=GRAY)
nterms = 10
theta = pie.scalar(0, out='theta')

# The terms (iθ)^k / k! of the series for e^{iθ}, k = 1..n
def series_terms(theta, n):
    k = np.arange(1, n + 1)
    return (1j * theta) ** k / np.cumprod(k).astype(float)

# Arrow k is term k, drawn from the sum of 1 and the terms before it
term_re = pie.lift(lambda t, n: series_terms(t, n).real, pie.Array[pie.Scalar])(theta, nterms)
term_im = pie.lift(lambda t, n: series_terms(t, n).imag, pie.Array[pie.Scalar])(theta, nterms)
tail_re = pie.lift(lambda t, n: 1 + (np.cumsum(series_terms(t, n)) - series_terms(t, n)).real, pie.Array[pie.Scalar])(theta, nterms)
tail_im = pie.lift(lambda t, n: (np.cumsum(series_terms(t, n)) - series_terms(t, n)).imag, pie.Array[pie.Scalar])(theta, nterms)
pie.la_vec2d(term_re, term_im, tail_re, tail_im, out='arrows', stroke=BLUE)
# The partial sums 1 + term 1 + ... + term k
partial_sums = lambda t, n: np.stack([1 + np.cumsum(series_terms(t, n)).real, np.cumsum(series_terms(t, n)).imag], axis=1)
pie.lift(partial_sums, pie.Array[pie.Point])(theta, nterms, out='tips', fill=PINK)
pie.point(1, 0, out='base', fill=PINK)
cx = pie.lift(math.cos, pie.Scalar)(theta)
cy = pie.lift(math.sin, pie.Scalar)(theta)
pie.la_vec2d(cx, cy, out='tgt', stroke=GOLD)
```

Here we show (not _prove_) visually that the complex number $\textcolor{#0d9488}{\cos\theta + i\sin\theta = e^{i\theta}}$. Note that $e^x = 1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + \ldots$

Substituting $x = i\theta$ gives $$e^{i\theta} = 1 + i\theta + \frac{(i\theta)^2}{2!} + \frac{(i\theta)^3}{3!} + \ldots$$

Let's map the sum of these terms to the complex plane (which is a 2D plane). As we include more and more terms, the sum approaches a point on the unit circle.

```python-editor collapsed
pie.scalar(1.234, out='theta')
```

This point is $\textcolor{#0d9488}{\cos\theta + i\sin\theta}$.

Thus, multiplying $\textcolor{#0d9488}{e^{i\theta}}$ to a complex number $\textcolor{#1d4ed8}{x + iy}$ is equivalent to rotating the vector $\textcolor{#1d4ed8}{\begin{bmatrix} x \\ y \end{bmatrix}}$ by an angle $\theta$.

---

## 1.2. Number of free variables

A 2D rotation matrix has **one** free variable. In other words, if we know just one entry of the matrix, we can calculate the rest of the entries. 

```python-editor collapsed
pie.clear()
theta = pie.scalar(30, out='theta')
pie.text(pie.lift(lambda v: f'theta = {round(v, 2):g}', pie.Text)(theta), -1.5, 0, 14, out='theta_label')
arrow_start = pie.point(-0.2, 0, out='arrow_start', hidden=True)
arrow_end = pie.point(0.6, 0, out='arrow_end', hidden=True)
pie.annotate_arrow(arrow_start, arrow_end, out='theta_arrow')
rot_matrix = pie.la_rotation_matrix(theta, out='rot_matrix')
```

Just from the angle, you can derive the entire rotation matrix.

```python-editor collapsed
pie.la_array_to_texts(rot_matrix, 1.2, 0.5, 1, 1, out='rot_matrix_boxes')
```

Modifying it updates the matrix as well.

```python-editor collapsed
pie.translate_scalar_to(theta, 35, animate=True)
```

It also aligns with the fact that the complex exponential $e^{i\theta}$ has one free variable $\theta$. The number of free variables for rotation in n-dimensional space will come in handy later in this series.

---

[← Rotation is linear](/series/rotations/0_intro)  ·  [3D rotation matrices →](/series/rotations/3d_rotation_matrices)
