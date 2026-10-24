---
title: A new solution to GPTQ quantization algorithm
---

# A new solution to GPTQ quantization algorithm

$$\begin{bmatrix} \textcolor{#b45309}{x_{11}} & \textcolor{#b45309}{x_{12}} & x_{13} & x_{14} & x_{15} & x_{16} \\ \textcolor{#b45309}{x_{21}} & \textcolor{#b45309}{x_{22}} & x_{23} & x_{24} & x_{25} & x_{26} \\ \textcolor{#b45309}{x_{31}} & \textcolor{#b45309}{x_{32}} & x_{33} & x_{34} & x_{35} & x_{36} \\ \textcolor{#b45309}{x_{41}} & \textcolor{#b45309}{x_{42}} & x_{43} & x_{44} & x_{45} & x_{46} \end{bmatrix}$$

GPTQ quantizes each row in parallel, one weight ($w \rightarrow \textcolor{#b45309}{w_q}$) at a time; here the first two columns have already been quantized (shown in amber).

---

## 0. Introduction

The papers [Optimal Brain Compression](https://arxiv.org/abs/2208.11580) and [GPTQ](https://arxiv.org/abs/2210.17323) introduced a post-training quantization method that is one of the most popular quantization methods at the moment. The algorithm quantizes the rows of a matrix independently. In each row, a weight is quantized at a time and the remaining unquantized weights are modified to minimize the quantization error. The quantization error and the modified weights both have closed form solutions provided in the papers above. I have also provided a proof of these equations [here](https://github.com/TinyVolt/optimal-brain-compression?tab=readme-ov-file#deep-dive-into-key-ideas).

Here I will provide a novel way to approach the problem and come up with a different solution. It has an expression that is easier to comprehend and make sense of geometrically. Finally I will show that the solution is equivalent to the one provided in the papers above.

---

## 1. Problem setup

Let $W \in R^n$ be a vector of weights that needs to be quantized, and $dW$ be a perturbation of weights. Here the first weight has been quantized already $dW_0 = W_{0q} - W_0$ and we want to find out the perturbation for the remaining weights $dW_{1,2,...,n}$ that minimizes the quantization error (which is the mean squared error).

$$\begin{align} f(\textcolor{#b45309}{dW}) &= \|(W + \textcolor{#b45309}{dW})X - WX\|^2 \\ &= \cancel{J dW} + \frac{1}{2} \textcolor{#b45309}{dW^T} H \textcolor{#b45309}{dW} + \cancel{\mathcal{O}(dW^3)} \\ &= \frac{1}{2} \textcolor{#b45309}{dW^T} H \textcolor{#b45309}{dW} \end{align}$$

where $dW$ is:

$$\begin{bmatrix} \left. dW_0 \ \ \ \right\}{\text{constant}} \\ \left. \textcolor{#b45309}{dW_{1:n}} \ \right\}{\textcolor{#b45309}{\text{variables}}} \end{bmatrix}$$

We want to find how to modify the unquantized weights after the first weight has been quantized to minimize the error.

---

## 2. Solution

In the original proof, the already quantized weight is used as a constraint to form a Lagrangian. Here we will use a different approach. The first thing we do is break down the Hessian into its Cholesky decomposition: $H = LL^T$ which immediately gives us (ignoring the constant 0.5):

$$\begin{align} f(\textcolor{#b45309}{dW}) &= \| L^T \textcolor{#b45309}{dW} \|^2 \\ &= \| \underbrace{L_{:,0}^T \ dW_0}_{a} + \underbrace{L_{:,1:}^T}_{M} \ \underbrace{\textcolor{#b45309}{dW_{1:}}}_{\textcolor{#b45309}{x}} \|^2 \\ g(\textcolor{#b45309}{x}) &= \| \underbrace{a}_{\in R^n} + \underbrace{M}_{\in R^{n \times n-1}} \ \ \underbrace{\textcolor{#b45309}{x}}_{\textcolor{#b45309}{\in R^{n-1}}} \|^2 \end{align}$$

Thus we simplified the problem to find $x$ which minimizes the squared norm of a sum of vectors. I wrote about this problem and its solution [here](/blog/minimize_norm_of_vector_sum). Thus the solution to our problem is given by:

$$\textcolor{#b45309}{x} = \textcolor{#b45309}{dW_{1:}} = -(M^TM)^{-1} M^T a$$

In addition, we also get an insight into what the optimal weights do geometrically:

> The optimal weights $dW_{1:}$ negate the projection of $a$ onto the column space of $M$.

Next, let us express $M$ and $a$ in terms of $H$ and $dW$. Note that the `i`-th column of $M$ is `i+1`-th column of $L^T$ or the `i+1`-th row of $L$. In other words:

$$M = L_{:,1:}^T \Rightarrow M^T = L_{1:,:}$$

Thus, $M^TM$ is just the bottom right $n-1 \times n-1$ block of $H$

<div style="display: flex; justify-content: center; margin: 1.5rem 0;">
<svg width="340" height="180" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="10" width="10" height="10" fill="#c8c8c8" stroke="#646464" stroke-width="1" />
  <rect x="20" y="10" width="10" height="10" fill="#c8c8c8" stroke="#646464" stroke-width="1" />
  <rect x="30" y="10" width="10" height="10" fill="#c8c8c8" stroke="#646464" stroke-width="1" />
  <rect x="40" y="10" width="10" height="10" fill="#c8c8c8" stroke="#646464" stroke-width="1" />
  <rect x="50" y="10" width="10" height="10" fill="#c8c8c8" stroke="#646464" stroke-width="1" />
  <rect x="20" y="20" width="10" height="10" fill="#c8c8c8" stroke="#646464" stroke-width="1" />
  <rect x="30" y="20" width="10" height="10" fill="#c8c8c8" stroke="#646464" stroke-width="1" />
  <rect x="40" y="20" width="10" height="10" fill="#c8c8c8" stroke="#646464" stroke-width="1" />
  <rect x="50" y="20" width="10" height="10" fill="#c8c8c8" stroke="#646464" stroke-width="1" />
  <rect x="30" y="30" width="10" height="10" fill="#c8c8c8" stroke="#646464" stroke-width="1" />
  <rect x="40" y="30" width="10" height="10" fill="#c8c8c8" stroke="#646464" stroke-width="1" />
  <rect x="50" y="30" width="10" height="10" fill="#c8c8c8" stroke="#646464" stroke-width="1" />
  <rect x="40" y="40" width="10" height="10" fill="#c8c8c8" stroke="#646464" stroke-width="1" />
  <rect x="50" y="40" width="10" height="10" fill="#c8c8c8" stroke="#646464" stroke-width="1" />
  <rect x="50" y="50" width="10" height="10" fill="#c8c8c8" stroke="#646464" stroke-width="1" />
  <rect x="20" y="10" width="40" height="50" fill="#0d9488" stroke="#0d9488" stroke-width="1" opacity="0.4" />
  <text x="25" y="52" fill="#0d9488" font-size="8" font-family="sans-serif" text-anchor="middle" alignment-baseline="hanging">M</text>
</svg>
</div>

The grey squares are the upper triangular matrix $L^T$ and the teal block is $M$.

and the vector $M^Ta$ is:

$$\begin{bmatrix} \textcolor{#b45309}{l_{10}} & l_{11} & ... & 0 \\ \textcolor{#b45309}{l_{20}} & l_{21} & ... & 0 \\ ... & ... & ... & 0 \\ \textcolor{#b45309}{l_{n0}} & l_{n1} & ... & l_{nn} \end{bmatrix} \begin{bmatrix} dW_0l_{00} \\ 0 \\ ... \\ 0 \end{bmatrix} = \underbrace{dW_0}_{(w_{0q} - w_0)}l_{00} \begin{bmatrix} \textcolor{#b45309}{l_{10}} \\ \textcolor{#b45309}{l_{20}} \\ ... \\ \textcolor{#b45309}{l_{n0}} \end{bmatrix} = \textcolor{#b45309}{H_{1:,0}} \ dW_0$$

Finally, note that $H_{00} = l_{00}^2$

$$H = \begin{bmatrix} \underbrace{H_{0,0}}_{= l_{00}^2} & H_{1:,0}^T \\ \textcolor{#e11d48}{\underbrace{H_{1:,0}}_{= \frac{M^Ta}{dW_0}}} & \underbrace{\textcolor{#b45309}{H_{1:,1:}}}_{\textcolor{#b45309}{= M^TM}} \end{bmatrix}$$

We re-write the final expression as:

> $$dW_{1:} = -\textcolor{#b45309}{(H_{1:,1:})^{-1}} \textcolor{#e11d48}{H_{1:,0}} \ (w_{0q} - w_0)$$

---

## 3. Equivalence to the original solution

The original solution is given by:

$$dW_{1:} = \frac{(w_{0q} - w_0)}{(H^{-1})_{00}} \ (H^{-1})_{1:,0}$$

Note that in this expression, the matrix blocks come from $H^{-1}$ whereas in the expression above, the matrix blocks come from $H$. To connect these two, we express $H^{-1}$ in terms of $H$ using the Schur complement:

$$H^{-1} = \begin{bmatrix} \underbrace{S^{-1}}_{(H^{-1})_{00}} & ... \\ {} & {} \\ \underbrace{-\textcolor{#b45309}{(H_{1:,1:})^{-1}} \textcolor{#e11d48}{H_{1:,0}} \ S^{-1}}_{(H^{-1})_{1:,0}} & ... \end{bmatrix}$$

Substituting this into the expression above:

$$\frac{(H^{-1})_{1:,0}}{(H^{-1})_{00}} = -\textcolor{#b45309}{(H_{1:,1:})^{-1}} \textcolor{#e11d48}{H_{1:,0}}$$

This proves the equivalence. The exact value of $S$ does not matter here since it will be canceled out (assuming it is non-zero) but for sake of completion, $S = H_{00} - H_{01}H_{11}^{-1}H_{10}$.

---

## Related articles:

- [Minimization of squared norm of a vector sum](/blog/minimize_norm_of_vector_sum)
- [Inverse of a matrix after row and column removal](/blog/inverse_row_col_removed)
