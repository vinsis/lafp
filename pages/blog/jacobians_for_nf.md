---
title: Nice Jacobians for normalizing flows
---

# Nice Jacobians for normalizing flows

We cover some nice Jacobians used in various implementations of normalizing flows. Here "nice" means the determinant of these Jacobians is easy to calculate. The key paradigm of normalizing flows is learning a transformation of input data $y = f(x), x,y \in R^n$ such that the distribution of $y$ is a known probability distribution (usually Gaussian or uniform).

$$p(x) = p(y) \times \lvert \underbrace{\det(\overbrace{\partial y / \partial x}^{\text{Jacobian}}) \rvert}_{\textcolor{#b45309}{\text{easy to calculate}}}$$

We cover three main transformations the Jacobians of which are simply the product of the diagonal (possibly block) elements of the Jacobian.

---

## 1. Autoregressive transformations

This is arguably the simplest and most likely the earliest transformation used in normalizing flows. The Jacobian of an autoregressive transformation is a lower triangular matrix since $\textcolor{#b45309}{\partial y_i / \partial x_j = 0} \ \text{if} \ i \lt j$.

<div style="display: flex; justify-content: center; margin: 1.5rem 0;">
<svg width="160" height="160" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="30" height="30" fill="#a1a1aa" stroke="#52525b" />
  <rect x="30" y="0" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="60" y="0" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="90" y="0" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="120" y="0" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="0" y="30" width="30" height="30" fill="#a1a1aa" stroke="#52525b" />
  <rect x="30" y="30" width="30" height="30" fill="#a1a1aa" stroke="#52525b" />
  <rect x="60" y="30" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="90" y="30" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="120" y="30" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="0" y="60" width="30" height="30" fill="#a1a1aa" stroke="#52525b" />
  <rect x="30" y="60" width="30" height="30" fill="#a1a1aa" stroke="#52525b" />
  <rect x="60" y="60" width="30" height="30" fill="#a1a1aa" stroke="#52525b" />
  <rect x="90" y="60" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="120" y="60" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="0" y="90" width="30" height="30" fill="#a1a1aa" stroke="#52525b" />
  <rect x="30" y="90" width="30" height="30" fill="#a1a1aa" stroke="#52525b" />
  <rect x="60" y="90" width="30" height="30" fill="#a1a1aa" stroke="#52525b" />
  <rect x="90" y="90" width="30" height="30" fill="#a1a1aa" stroke="#52525b" />
  <rect x="120" y="90" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="0" y="120" width="30" height="30" fill="#a1a1aa" stroke="#52525b" />
  <rect x="30" y="120" width="30" height="30" fill="#a1a1aa" stroke="#52525b" />
  <rect x="60" y="120" width="30" height="30" fill="#a1a1aa" stroke="#52525b" />
  <rect x="90" y="120" width="30" height="30" fill="#a1a1aa" stroke="#52525b" />
  <rect x="120" y="120" width="30" height="30" fill="#a1a1aa" stroke="#52525b" />
</svg>
</div>

Jacobian of an autoregressive transformation is a lower triangular matrix.

The determinant of this Jacobian is the product of the diagonal elements, which is easy to calculate.

---

## 2. Affine transformations

The key idea here is to partition the vector $x \in R^n$ into two parts $x_A, x_B \in R^{n/2}$ of equal length. These two parts are transformed to $y_A, y_B \in R^{n/2}$ in the following way:

$$\begin{align} y_A &= x_A \\ y_B &= \overbrace{\textcolor{#b45309}{\gamma(x_A) \odot x_B}}^{\textcolor{#b45309}{\text{elementwise scaling}}} \underbrace{\textcolor{#e11d48}{\oplus \ \beta(x_A)}}_{\textcolor{#b45309}{\text{elementwise shifting}}} \end{align}$$

This leads to a Jacobian that is even sparser than a lower triangular matrix. The determinant of this Jacobian is the product of the scaling parameters (which is also the product of the diagonal elements).

<div style="display: flex; justify-content: center; margin: 1.5rem 0;">
<svg width="330" height="330" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="40" height="40" fill="#a1a1aa" stroke="#52525b" />
  <rect x="40" y="0" width="40" height="40" fill="none" stroke="#52525b" />
  <rect x="80" y="0" width="40" height="40" fill="none" stroke="#52525b" />
  <rect x="120" y="0" width="40" height="40" fill="none" stroke="#52525b" />
  <rect x="160" y="0" width="40" height="40" fill="none" stroke="#52525b" />
  <rect x="200" y="0" width="40" height="40" fill="none" stroke="#52525b" />
  <rect x="240" y="0" width="40" height="40" fill="none" stroke="#52525b" />
  <rect x="280" y="0" width="40" height="40" fill="none" stroke="#52525b" />
  <rect x="0" y="40" width="40" height="40" fill="none" stroke="#52525b" />
  <rect x="40" y="40" width="40" height="40" fill="#a1a1aa" stroke="#52525b" />
  <rect x="80" y="40" width="40" height="40" fill="none" stroke="#52525b" />
  <rect x="120" y="40" width="40" height="40" fill="none" stroke="#52525b" />
  <rect x="160" y="40" width="40" height="40" fill="none" stroke="#52525b" />
  <rect x="200" y="40" width="40" height="40" fill="none" stroke="#52525b" />
  <rect x="240" y="40" width="40" height="40" fill="none" stroke="#52525b" />
  <rect x="280" y="40" width="40" height="40" fill="none" stroke="#52525b" />
  <rect x="0" y="80" width="40" height="40" fill="none" stroke="#52525b" />
  <rect x="40" y="80" width="40" height="40" fill="none" stroke="#52525b" />
  <rect x="80" y="80" width="40" height="40" fill="#a1a1aa" stroke="#52525b" />
  <rect x="120" y="80" width="40" height="40" fill="none" stroke="#52525b" />
  <rect x="160" y="80" width="40" height="40" fill="none" stroke="#52525b" />
  <rect x="200" y="80" width="40" height="40" fill="none" stroke="#52525b" />
  <rect x="240" y="80" width="40" height="40" fill="none" stroke="#52525b" />
  <rect x="280" y="80" width="40" height="40" fill="none" stroke="#52525b" />
  <rect x="0" y="120" width="40" height="40" fill="none" stroke="#52525b" />
  <rect x="40" y="120" width="40" height="40" fill="none" stroke="#52525b" />
  <rect x="80" y="120" width="40" height="40" fill="none" stroke="#52525b" />
  <rect x="120" y="120" width="40" height="40" fill="#a1a1aa" stroke="#52525b" />
  <rect x="160" y="120" width="40" height="40" fill="none" stroke="#52525b" />
  <rect x="200" y="120" width="40" height="40" fill="none" stroke="#52525b" />
  <rect x="240" y="120" width="40" height="40" fill="none" stroke="#52525b" />
  <rect x="280" y="120" width="40" height="40" fill="none" stroke="#52525b" />
  <rect x="0" y="160" width="40" height="40" fill="#a1a1aa" stroke="#52525b" />
  <rect x="40" y="160" width="40" height="40" fill="#a1a1aa" stroke="#52525b" />
  <rect x="80" y="160" width="40" height="40" fill="#a1a1aa" stroke="#52525b" />
  <rect x="120" y="160" width="40" height="40" fill="#a1a1aa" stroke="#52525b" />
  <rect x="160" y="160" width="40" height="40" fill="#a1a1aa" stroke="#52525b" />
  <rect x="200" y="160" width="40" height="40" fill="none" stroke="#52525b" />
  <rect x="240" y="160" width="40" height="40" fill="none" stroke="#52525b" />
  <rect x="280" y="160" width="40" height="40" fill="none" stroke="#52525b" />
  <rect x="0" y="200" width="40" height="40" fill="#a1a1aa" stroke="#52525b" />
  <rect x="40" y="200" width="40" height="40" fill="#a1a1aa" stroke="#52525b" />
  <rect x="80" y="200" width="40" height="40" fill="#a1a1aa" stroke="#52525b" />
  <rect x="120" y="200" width="40" height="40" fill="#a1a1aa" stroke="#52525b" />
  <rect x="160" y="200" width="40" height="40" fill="none" stroke="#52525b" />
  <rect x="200" y="200" width="40" height="40" fill="#a1a1aa" stroke="#52525b" />
  <rect x="240" y="200" width="40" height="40" fill="none" stroke="#52525b" />
  <rect x="280" y="200" width="40" height="40" fill="none" stroke="#52525b" />
  <rect x="0" y="240" width="40" height="40" fill="#a1a1aa" stroke="#52525b" />
  <rect x="40" y="240" width="40" height="40" fill="#a1a1aa" stroke="#52525b" />
  <rect x="80" y="240" width="40" height="40" fill="#a1a1aa" stroke="#52525b" />
  <rect x="120" y="240" width="40" height="40" fill="#a1a1aa" stroke="#52525b" />
  <rect x="160" y="240" width="40" height="40" fill="none" stroke="#52525b" />
  <rect x="200" y="240" width="40" height="40" fill="none" stroke="#52525b" />
  <rect x="240" y="240" width="40" height="40" fill="#a1a1aa" stroke="#52525b" />
  <rect x="280" y="240" width="40" height="40" fill="none" stroke="#52525b" />
  <rect x="0" y="280" width="40" height="40" fill="#a1a1aa" stroke="#52525b" />
  <rect x="40" y="280" width="40" height="40" fill="#a1a1aa" stroke="#52525b" />
  <rect x="80" y="280" width="40" height="40" fill="#a1a1aa" stroke="#52525b" />
  <rect x="120" y="280" width="40" height="40" fill="#a1a1aa" stroke="#52525b" />
  <rect x="160" y="280" width="40" height="40" fill="none" stroke="#52525b" />
  <rect x="200" y="280" width="40" height="40" fill="none" stroke="#52525b" />
  <rect x="240" y="280" width="40" height="40" fill="none" stroke="#52525b" />
  <rect x="280" y="280" width="40" height="40" fill="#a1a1aa" stroke="#52525b" />
  <g fill="#27272a" font-size="20" text-anchor="middle" font-family="ui-sans-serif, system-ui">
    <text x="20" y="27">1</text>
    <text x="60" y="67">1</text>
    <text x="100" y="107">1</text>
    <text x="140" y="147">1</text>
    <text x="180" y="187">𝛾1</text>
    <text x="220" y="227">𝛾2</text>
    <text x="260" y="267">𝛾3</text>
    <text x="300" y="307">𝛾4</text>
  </g>
</svg>
</div>

Determinant of Jacobian is just the product of scaling parameters $\prod_i \gamma_i$.

This transformation was used in the paper [Density estimation using Real NVP](https://arxiv.org/abs/1605.08803). In order to make sure that the entire input space was covered by the transformation, the sets $x_A, x_B$ were switched in the next step (i.e $x_B$ was used to calculate the affine parameters to scale and shift $x_A$).

---

## 3. Channel-wise transformations

In this transformation, the input vector $x \in R^n$ is partitioned into $c$ channels of equal length $C_i \in R^{n/c}, i \in \{1, \dots, c\}$ and each channel is linearly transformed by multiplying with a matrix $W \in R^{(n/c) \times (n/c)}$.

$$\begin{array}{c} \underbrace{x_1, x_2}_{\textcolor{#b45309}{C_1}}, \ \underbrace{x_3, x_4}_{\textcolor{#e11d48}{C_2}}, \ \dots, \ \underbrace{x_{n-1}, x_n}_{\textcolor{#b45309}{C_c}} \\[1ex] \Big\downarrow {\scriptstyle \ \times W} \\[1ex] \underbrace{\textcolor{#b45309}{y_1, y_2}}_{{WC_1}}, \ \underbrace{\textcolor{#e11d48}{y_3, y_4}}_{{WC_2}}, \ \dots, \ \underbrace{\textcolor{#b45309}{y_{n-1}, y_n}}_{{WC_c}} \end{array}$$

Each channel $C_i \in R^2$ is linearly transformed by a matrix $W$.

The Jacobian of this transformation is a block diagonal matrix where each block is the $n/c \times n/c$ matrix $W$. In the example below, $x \in R^8$ is partitioned into four channels.

<div style="display: flex; justify-content: center; margin: 1.5rem 0;">
<svg width="240" height="240" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="30" height="30" fill="#a1a1aa" stroke="#52525b" />
  <rect x="30" y="0" width="30" height="30" fill="#a1a1aa" stroke="#52525b" />
  <rect x="60" y="0" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="90" y="0" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="120" y="0" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="150" y="0" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="180" y="0" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="210" y="0" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="0" y="30" width="30" height="30" fill="#a1a1aa" stroke="#52525b" />
  <rect x="30" y="30" width="30" height="30" fill="#a1a1aa" stroke="#52525b" />
  <rect x="60" y="30" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="90" y="30" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="120" y="30" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="150" y="30" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="180" y="30" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="210" y="30" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="0" y="60" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="30" y="60" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="60" y="60" width="30" height="30" fill="#a1a1aa" stroke="#52525b" />
  <rect x="90" y="60" width="30" height="30" fill="#a1a1aa" stroke="#52525b" />
  <rect x="120" y="60" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="150" y="60" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="180" y="60" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="210" y="60" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="0" y="90" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="30" y="90" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="60" y="90" width="30" height="30" fill="#a1a1aa" stroke="#52525b" />
  <rect x="90" y="90" width="30" height="30" fill="#a1a1aa" stroke="#52525b" />
  <rect x="120" y="90" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="150" y="90" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="180" y="90" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="210" y="90" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="0" y="120" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="30" y="120" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="60" y="120" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="90" y="120" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="120" y="120" width="30" height="30" fill="#a1a1aa" stroke="#52525b" />
  <rect x="150" y="120" width="30" height="30" fill="#a1a1aa" stroke="#52525b" />
  <rect x="180" y="120" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="210" y="120" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="0" y="150" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="30" y="150" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="60" y="150" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="90" y="150" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="120" y="150" width="30" height="30" fill="#a1a1aa" stroke="#52525b" />
  <rect x="150" y="150" width="30" height="30" fill="#a1a1aa" stroke="#52525b" />
  <rect x="180" y="150" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="210" y="150" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="0" y="180" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="30" y="180" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="60" y="180" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="90" y="180" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="120" y="180" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="150" y="180" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="180" y="180" width="30" height="30" fill="#a1a1aa" stroke="#52525b" />
  <rect x="210" y="180" width="30" height="30" fill="#a1a1aa" stroke="#52525b" />
  <rect x="0" y="210" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="30" y="210" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="60" y="210" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="90" y="210" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="120" y="210" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="150" y="210" width="30" height="30" fill="none" stroke="#52525b" />
  <rect x="180" y="210" width="30" height="30" fill="#a1a1aa" stroke="#52525b" />
  <rect x="210" y="210" width="30" height="30" fill="#a1a1aa" stroke="#52525b" />
  <g fill="#27272a" font-size="25" text-anchor="middle" font-family="ui-sans-serif, system-ui">
    <text x="30" y="37.5">W</text>
    <text x="90" y="97.5">W</text>
    <text x="150" y="157.5">W</text>
    <text x="210" y="217.5">W</text>
  </g>
</svg>
</div>

Determinant of Jacobian is $(\det(W))^{c}$.

This transformation was used in the paper [Glow: Generative Flow with Invertible 1x1 Convolutions](https://arxiv.org/abs/1807.03039). In that paper, the linear transformation was applied to each $x,y$ location of the input tensor of shape $c, h, w$. In this case, the number of "channels" is $h \times w$.

---

## Related articles:

- [A simpler derivation of continuous normalizing flows and its interpretation](/blog/continuous_normalizing_flow)
- [Jacobian of a vector-valued function](/series/matrix_calculus/2_jacobian)
