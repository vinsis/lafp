---
title: Key matrix derivatives
description: Derivatives of singular values, elementwise functions, softmax and row-wise vector functions, each checked in Python.
sidebar: _series.md
---

# Key matrix derivatives

## 0. $f(A) = \sigma_i(A)$, the `i-th` singular value of $A$

Assume all singular values are unique. The trick is to find a closed form equation for $\sigma_i(A)$ in terms of $A$. Calculating the gradient from that point is the easy part. Given the SVD, $A = UDV^T$, with $u_i, v_i$ as `i-th` columns of $U, V$ respectively, note that:

$$\begin{aligned} \sigma_i(A) &= u_i^TAv_i \\ &= u_i^TUDV^Tv_i \\ &= \underbrace{\textcolor{#e11d48}{u_i^TU}}_{\textcolor{#e11d48}{e_i^T}} D \underbrace{\textcolor{#e11d48}{V^Tv_i}}_{\textcolor{#e11d48}{e_i}} \\ &= e_i^T D e_i \\ &= \sigma_i(A) \end{aligned}$$

This gives us:

$$\begin{aligned} df &= u_i^T\,dA\,v_i \\ &= \text{tr}(u_i^T\,dA\,v_i) \ \textcolor{#71717a}{\text{(trace of a scalar)}} \\ &= \text{tr}(v_iu_i^T\,dA) \ \textcolor{#71717a}{\text{(cyclic property of trace)}} \\ &= \langle \underbrace{\textcolor{#b45309}{u_iv_i^T}}_{\textcolor{#b45309}{\nabla f}}, dA \rangle \end{aligned}$$

Thus 

> the gradient of $\sigma_i(A)$ is given by $\nabla f = u_iv_i^T$.

#### Verification using Python
```python
import torch
x = torch.randn(1000,1000).double()
dx = torch.randn_like(x).mul(1e-7)

u1,d1,v1 = torch.linalg.svd(x)
u2,d2,v2 = torch.linalg.svd(x+dx)

index = 0
df_true = d2[index] - d1[index]
df_pred = ((u1[:,index].view(-1,1) @ v1.t()[:,index].view(1,-1)) * dx).sum()

torch.allclose(df_true, df_pred)

'''
Outputs:
True
'''
```

---

## 1. Jacobian of elementwise functions

Jacobian of an elementwise function $f: R^n \rightarrow R^n$ is a diagonal matrix of shape $n \times n$. Eg consider the function $\sigma(x) = \frac{1}{1+e^{-x}}$. Its derivative is $\sigma'(x) = \sigma(x)(1 - \sigma(x))$. Applying it to each element of a vector we get:

$$\begin{aligned}
f\left(\begin{bmatrix} x_1 \\ x_2 \\ x_3 \end{bmatrix}\right) &= \begin{bmatrix} \textcolor{#1d4ed8}{\sigma(x_1)} \\ \textcolor{#be185d}{\sigma(x_2)} \\ \textcolor{#047857}{\sigma(x_3)} \end{bmatrix} \\[6pt]
\\
\nabla f &= \begin{bmatrix} \textcolor{#1d4ed8}{\sigma'(x_1)} & 0 & 0 \\ 0 & \textcolor{#be185d}{\sigma'(x_2)} & 0 \\ 0 & 0 & \textcolor{#047857}{\sigma'(x_3)} \end{bmatrix} \\[6pt]
\\
&= \begin{bmatrix} \textcolor{#1d4ed8}{\sigma(x_1)(1 - \sigma(x_1))} & 0 & 0 \\ 0 & \textcolor{#be185d}{\sigma(x_2)(1 - \sigma(x_2))} & 0 \\ 0 & 0 & \textcolor{#047857}{\sigma(x_3)(1 - \sigma(x_3))} \end{bmatrix}
\end{aligned}$$

Each diagonal entry $\textcolor{#1d4ed8}{\sigma'(x_1)}$, $\textcolor{#be185d}{\sigma'(x_2)}$, $\textcolor{#047857}{\sigma'(x_3)}$ only depends on its own input $x_i$, since $\sigma(x_i)$ does not depend on $x_j$ for $j \neq i$; that is exactly why every off-diagonal entry is $0$.

Practically it is easier to store the diagonal matrix as a vector.

---

## 2. Softmax function

The softmax function ($\text{softmax}: R^n \rightarrow R^n$) is defined as:

$$\text{softmax}(x) = \frac{e^x}{\sum_{i=1}^n e^{x_i}} := y$$

We calculate the partial derivative $\frac{\partial y_i}{\partial x_j}$ separately for the case $i = j$ (an output coordinate with respect to its own input) and $i \neq j$ (an output coordinate with respect to a different input):

$$\frac{\partial \ y_i}{\partial x_j} = \begin{cases} \textcolor{#1d4ed8}{y_i} - \textcolor{#be185d}{y_iy_j} = \textcolor{#1d4ed8}{y_i(1 - y_i)} & i = j \\ 0 - \textcolor{#be185d}{y_iy_j} = -\textcolor{#be185d}{y_iy_j} & i \neq j \end{cases}$$

This expression forms the entry $i,j$ of the Jacobian matrix. Collecting the $i = j$ entries into $\textcolor{#1d4ed8}{\text{diag}(y)}$ and the $-y_iy_j$ entries into $-\textcolor{#be185d}{yy^T}$, the Jacobian takes a succinct form:

$$\textcolor{#b45309}{\text{Jacobian}(y) = \textcolor{#1d4ed8}{\text{diag}(y)} - \textcolor{#be185d}{yy^T}}$$

---

## 3. Row-wise vector functions

This can be seen as an extension of the idea of elementwise functions. If a function $f: R^{\text{in}} \rightarrow R^{\text{out}}$ is applied to each row of a matrix of shape $(n, \text{in})$, the output is a matrix of shape $(n, \text{out})$. The Jacobian for each row is a matrix of shape $(\text{out}, \text{in})$ and there are $n$ of them.

$$\begin{bmatrix} \text{—} & \textcolor{#1d4ed8}{x_1^T} & \text{—} \\ \text{—} & \textcolor{#be185d}{x_2^T} & \text{—} \\ \text{—} & \textcolor{#047857}{x_3^T} & \text{—} \end{bmatrix} \quad \begin{aligned} &\xrightarrow{\ f\ } \textcolor{#1d4ed8}{y_1} \\ &\xrightarrow{\ f\ } \textcolor{#be185d}{y_2} \\ &\xrightarrow{\ f\ } \textcolor{#047857}{y_3} \end{aligned}$$

$f$ acts on each row of the matrix with shape $(n, \text{in})$.

Another point of view is that it can be seen as a function acting on the entire matrix. From that point of view, the Jacobian has a shape $(n \times \text{out}, n \times \text{in})$. Writing $\textcolor{#1d4ed8}{J_1} = \frac{\partial \textcolor{#1d4ed8}{y_1}}{\partial \textcolor{#1d4ed8}{x_1}}$, $\textcolor{#be185d}{J_2} = \frac{\partial \textcolor{#be185d}{y_2}}{\partial \textcolor{#be185d}{x_2}}$, $\textcolor{#047857}{J_3} = \frac{\partial \textcolor{#047857}{y_3}}{\partial \textcolor{#047857}{x_3}}$ for the per-row Jacobians, this whole-matrix Jacobian is:

$$\text{Jacobian} = \begin{bmatrix} \textcolor{#1d4ed8}{J_1} & 0 & 0 \\ 0 & \textcolor{#be185d}{J_2} & 0 \\ 0 & 0 & \textcolor{#047857}{J_3} \end{bmatrix}$$

Each $J_i$ has shape $(\text{out}, \text{in})$, one per row, and only $x_i$ affects $y_i$, so every off-diagonal block is $0$: exactly the same block-diagonal reasoning as the elementwise Jacobian in Section 1, just with matrix blocks in place of scalars.

<div style="display: flex; justify-content: center; margin: 1.5rem 0;">
<svg width="300" height="150" viewBox="0 0 300 150" xmlns="http://www.w3.org/2000/svg">
<defs>
<marker id="arrow_gray" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="5" markerHeight="5" orient="auto" fill="#3f3f46">
<path d="M 0 0 L 10 5 L 0 10 z" />
</marker>
</defs>
<g transform="translate(5, 5)">
<rect x="0" y="0" width="160" height="120" fill="#a1a1aa" />
<rect x="0" y="0" width="40" height="30" fill="#b45309" />
<rect x="40" y="30" width="40" height="30" fill="#b45309" />
<rect x="80" y="60" width="40" height="30" fill="#b45309" />
<rect x="120" y="90" width="40" height="30" fill="#b45309" />
</g>
<line x1="150" y1="110" x2="215" y2="110" stroke="#3f3f46" stroke-width="2" marker-end="url(#arrow_gray)" />
<text x="250" y="115" fill="currentColor" font-size="20" text-anchor="middle">(out, in)</text>
</svg>
</div>

The Jacobian is a block diagonal matrix, with $n$ blocks running down the diagonal and zeros everywhere else. Each block is the per-row Jacobian, of shape $(\text{out}, \text{in})$.

It is clear that storing the entire block diagonal matrix is a lot more expensive than storing the individual Jacobian matrices. This idea is explored later on in the article on [VJP and JVP](/series/matrix_calculus/6_vjp_and_jvp).

---

[← Jacobian of a function](/series/matrix_calculus/2_jacobian)  ·  [Function is a DAG →](/series/matrix_calculus/4_function_as_dag)
