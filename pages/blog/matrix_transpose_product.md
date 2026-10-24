---
title: Relationship between AAᵀ and AᵀA
---

# Relationship between AAᵀ and AᵀA

We look into the relationship between eigenvalues and eigenvectors of `AAᵀ` and `AᵀA` for a real-valued matrix `A` of shape `(r x c)`. Without losing generality, we can assume that the matrix is wide i.e. `r < c`.

<div style="display: flex; justify-content: center; margin: 1.5rem 0;">
<svg width="230" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="15" width="90" height="60" fill="#2dd4bf" />
  <rect x="130" y="0" width="60" height="90" fill="#fbbf24" />
  <text x="55" y="55" font-size="22" text-anchor="middle" fill="#52525b" font-family="monospace">A</text>
  <text x="55" y="110" font-size="22" text-anchor="middle" fill="#27272a" font-family="monospace">(r,c)</text>
  <text x="160" y="55" font-size="22" text-anchor="middle" fill="#52525b" font-family="monospace">Aᵀ</text>
  <text x="160" y="110" font-size="22" text-anchor="middle" fill="#27272a" font-family="monospace">(c,r)</text>
  <rect x="10" y="190" width="60" height="60" fill="#2dd4bf" />
  <text x="40" y="225" font-size="22" text-anchor="middle" fill="#52525b" font-family="monospace">AAᵀ</text>
  <text x="40" y="285" font-size="22" text-anchor="middle" fill="#27272a" font-family="monospace">(r,r)</text>
  <rect x="130" y="170" width="90" height="90" fill="#fbbf24" />
  <text x="175" y="225" font-size="22" text-anchor="middle" fill="#52525b" font-family="monospace">AᵀA</text>
  <text x="175" y="285" font-size="22" text-anchor="middle" fill="#27272a" font-family="monospace">(c,c)</text>
</svg>
</div>

---

## 0. Singular value decompositions of matrices

We begin with writing down the SVD of `A`:

$$A = \underbrace{U}_{\textcolor{#b45309}{r \times r}} \ \underbrace{\Sigma}_{\textcolor{#b45309}{r \times c}} \ \underbrace{V^T}_{\textcolor{#b45309}{c \times c}}$$

Here $\Sigma$ is a concatenation of a diagonal matrix of $r$ singular values and a block of zeros:

$$\Sigma = [\ \underbrace{\sigma}_{\textcolor{#b45309}{r \times r \text{ (diagonal)}}} \ ; \ \underbrace{0}_{\textcolor{#b45309}{r \times (c-r) \text{ (zeros)}}} \ ]$$

Now we can write down the SVDs of the two matrix products in terms of the SVD of `A`:

$$AA^T = U \ \underbrace{\textcolor{#b45309}{\Sigma\Sigma^T}}_{\textcolor{#e11d48}{r\times r}} \ U^T$$

Similarly we have:

$$A^TA = V \ \underbrace{\textcolor{#b45309}{\Sigma^T\Sigma}}_{\textcolor{#e11d48}{c\times c}} \ V^T$$

It is important to understand what the matrices $\Sigma\Sigma^T$ and $\Sigma^T\Sigma$ look like:

$$\Sigma\Sigma^T = \underbrace{\sigma^2}_{\textcolor{#b45309}{r \times r}} \qquad\qquad \Sigma^T\Sigma = \underbrace{\begin{bmatrix} \sigma^2 & 0 \\ 0^T & 0^T0 \end{bmatrix}}_{\textcolor{#b45309}{c \times c}}$$

Now we are ready to draw some insights.

---

## 1. Relationship between eigenvalues

From the singular value decompositions above, the following insight becomes clear:

> The sets of non-zero eigenvalues of $AA^T$ and $A^TA$ are the same.

All these non-zero eigenvalues come from the diagonal matrix $\sigma^2$. Remember that $\Sigma = [\ \underbrace{\sigma}_{\textcolor{#b45309}{r \times r}} \ ; \ \underbrace{0}_{\textcolor{#b45309}{r \times c-r}} \ ]$.

---

## 2. Relationship between eigenvectors

This part is not immediately obvious. We start by asking: what does the matrix $A$ map the vector $v_i$ to? Here $v_i$ is the i-th column of $V$ i.e. it is the i-th eigenvector of $V$.

$$\begin{align} Av_i &= U \ \Sigma \ \underbrace{\textcolor{#b45309}{V^T v_i}}_{\textcolor{#b45309}{e_i}} \\ &= U \ \underbrace{\Sigma \ \textcolor{#b45309}{e_i}}_{\textcolor{#b45309}{\text{i-th column of } \Sigma}} \\ &= \textcolor{#b45309}{\sigma_i u_i} \ \text{if } i \lt r \ \text{else} \ \textcolor{#b45309}{0} \end{align}$$

> The matrix $A$ maps the first $r$ columns of $V$ to the first $r$ columns of $U$ scaled by the singular values and the remaining columns to the zero vector.
>
> $$v_i \rightarrow A \rightarrow \begin{cases} \sigma_i u_i, & 1 \le i \le r \\ 0, & r \lt i \le c \end{cases}$$

Now we can ask the same question for $A^T$: what does $A^T$ map the columns of $U$ to?

$$\begin{align} A^T u_i &= V \ \Sigma^T \ \underbrace{\textcolor{#b45309}{U^T u_i}}_{\textcolor{#b45309}{e_i}} \\ &= V \ \underbrace{\Sigma^T \ \textcolor{#b45309}{e_i}}_{\textcolor{#b45309}{\text{i-th column of } \Sigma^T}} \\ &= \textcolor{#b45309}{\sigma_i v_i} \end{align}$$

> The matrix $A^T$ maps the columns of $U$ to the columns of $V$ scaled by the singular values.
>
> $$u_i \rightarrow A^T \rightarrow \sigma_i v_i, \ 1 \le i \le r$$

---

## 3. Applications

A matrix $A \in R^{d \times n}$ can be seen as a table of `d-`dimensional features of `n` items. If `n` gets really large, the matrix $A^TA \in R^{n \times n}$ gets too large to perform operations like eigendecomposition, which are quite common in machine learning. In this case, the eigenvalues and eigenvectors of the large matrix can be calculated using $AA^T \in R^{d \times d}$ and using the relationships we just derived. For instance this is used in creating a dual form of sampling for determinantal point processes.

---

## Related articles:

- [Singular Value Decomposition](/la/23_svd)
- [Eigenvectors of symmetric matrices](/la/16_eigenvectors_symmetric_matrices)
- [Symmetric positive semi-definite matrices](/la/22_psd_matrices)
