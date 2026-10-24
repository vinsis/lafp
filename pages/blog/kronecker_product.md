---
title: The Kronecker Product Visualized
---

# The Kronecker Product Visualized

The Kronecker product takes two matrices and produces a larger block matrix. This article visualizes the operation and explores some of its lesser-known properties.

| Matrix | # rows | # cols |
|:---:|:---:|:---:|
| $A$ | $r_A$ | $c_A$ |
| $B$ | $r_B$ | $c_B$ |
| $A \otimes B$ | $r_A r_B$ | $c_A c_B$ |

---

## 1. Definition of Kronecker product

The Kronecker product of two matrices $A \in R^{r_A \times c_A}$ and $B \in R^{\textcolor{#b45309}{r_B} \times \textcolor{#b45309}{c_B}}$ is a matrix denoted by $A \otimes B \in R^{r_A\textcolor{#b45309}{r_B} \times c_A\textcolor{#b45309}{c_B}}$ where each element $a_{ij}$ is replaced by a block matrix $a_{ij} * B$.

<div style="display: flex; justify-content: center; margin: 1.5rem 0;">
<svg width="260" height="170" viewBox="0 0 260 170" xmlns="http://www.w3.org/2000/svg">
<g fill="rgb(200,200,200)">
<path d="M15,5 L5,5 L5,80 L15,80" stroke="#27272a" stroke-width="1" fill="none">
  <animateTransform id="oneBracketExpand" begin="0s; oneBracketContract.end" attributeName="transform" type="scale" values="1 1;1 2;1 2" keyTimes="0; 0.25; 1" dur="3" additive="sum" fill="freeze" />
  <animateTransform begin="0s; oneBracketContract.end" attributeName="transform" type="translate" values="0 0;0 -2.5;0 -2.5" keyTimes="0; 0.25; 1" dur="3" additive="sum" fill="freeze" />
  <animateTransform id="oneBracketContract" begin="oneBracketExpand.end" attributeName="transform" type="scale" values="1 1;1 0.5;1 0.5" keyTimes="0; 0.25; 1" dur="3" additive="sum" />
  <animateTransform begin="oneBracketExpand.end" attributeName="transform" type="translate" values="0 0;0 2.5;0 2.5" keyTimes="0; 0.25; 1" dur="3" additive="sum" />
</path>
<path d="M60,5 L65,5 L65,80 L60,80" stroke="#27272a" stroke-width="1" fill="none">
  <animateTransform begin="0s; oneBracketContract.end" attributeName="transform" type="scale" values="1 1;1 2;1 2" keyTimes="0; 0.25; 1" dur="3" additive="sum" fill="freeze" />
  <animateTransform begin="0s; oneBracketContract.end" attributeName="transform" type="translate" values="0 0;155 -2.5;155 -2.5" keyTimes="0; 0.25; 1" dur="3" additive="sum" fill="freeze" />
  <animateTransform begin="oneBracketExpand.end" attributeName="transform" type="scale" values="1 1;1 0.5;1 0.5" keyTimes="0; 0.25; 1" dur="3" additive="sum" />
  <animateTransform begin="oneBracketExpand.end" attributeName="transform" type="translate" values="0 0;-155 2.5;-155 2.5" keyTimes="0; 0.25; 1" dur="3" additive="sum" />
</path>
<circle cx="17.5" cy="17.5" r="7.5" fill="rgb(217 119 6)">
  <animateMotion begin="0s; oneBracketContract.end" path="M0,0 L0,12.5" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" fill="freeze" />
  <animateMotion begin="oneBracketExpand.end" path="M0,12.5 L0,0" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" />
</circle>
<circle cx="52.5" cy="17.5" r="7.5" fill="rgb(100,100,100)">
  <animateMotion begin="0s; oneBracketContract.end" path="M0,0 L85,12.5" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" fill="freeze" />
  <animateMotion begin="oneBracketExpand.end" path="M85,12.5 L0,0" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" />
</circle>
<circle cx="17.5" cy="42.5" r="7.5" fill="rgb(225 29 72)">
  <animateMotion begin="0s; oneBracketContract.end" path="M0,0 L0,37.5" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" fill="freeze" />
  <animateMotion begin="oneBracketExpand.end" path="M0,37.5 L0,0" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" />
</circle>
<circle cx="52.5" cy="42.5" r="7.5" fill="rgb(13 148 136)">
  <animateMotion begin="0s; oneBracketContract.end" path="M0,0 L85,37.5" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" fill="freeze" />
  <animateMotion begin="oneBracketExpand.end" path="M85,37.5 L0,0" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" />
</circle>
<circle cx="17.5" cy="67.5" r="7.5" fill="rgb(101 163 13)">
  <animateMotion begin="0s; oneBracketContract.end" path="M0,0 L0,62.5" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" fill="freeze" />
  <animateMotion begin="oneBracketExpand.end" path="M0,62.5 L0,0" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" />
</circle>
<circle cx="52.5" cy="67.5" r="7.5" fill="rgb(124 58 237)">
  <animateMotion begin="0s; oneBracketContract.end" path="M0,0 L85,62.5" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" fill="freeze" />
  <animateMotion begin="oneBracketExpand.end" path="M85,62.5 L0,0" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" />
</circle>
<rect x="75" y="25" height="40" width="60" fill="rgb(13 148 136)" opacity="0.7">
  <animateMotion begin="0s; oneBracketContract.end" path="M0,0 L-40,-15" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" fill="freeze" />
  <animateMotion begin="oneBracketExpand.end" path="M-40,-15 L0,0" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" />
</rect>
<rect x="75" y="25" height="40" width="60" fill="rgb(13 148 136)" opacity="0.7">
  <animateMotion begin="0s; oneBracketContract.end" path="M0,0 L80,-15" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" fill="freeze" />
  <animateMotion begin="oneBracketExpand.end" path="M80,-15 L0,0" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" />
</rect>
<rect x="75" y="25" height="40" width="60" fill="rgb(13 148 136)" opacity="0.7">
  <animateMotion begin="0s; oneBracketContract.end" path="M0,0 L-40,35" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" fill="freeze" />
  <animateMotion begin="oneBracketExpand.end" path="M-40,35 L0,0" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" />
</rect>
<rect x="75" y="25" height="40" width="60" fill="rgb(13 148 136)" opacity="0.7">
  <animateMotion begin="0s; oneBracketContract.end" path="M0,0 L80,35" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" fill="freeze" />
  <animateMotion begin="oneBracketExpand.end" path="M80,35 L0,0" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" />
</rect>
<rect x="75" y="25" height="40" width="60" fill="rgb(13 148 136)" opacity="0.7">
  <animateMotion begin="0s; oneBracketContract.end" path="M0,0 L-40,85" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" fill="freeze" />
  <animateMotion begin="oneBracketExpand.end" path="M-40,85 L0,0" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" />
</rect>
<rect x="75" y="25" height="40" width="60" fill="rgb(13 148 136)" opacity="0.7">
  <animateMotion begin="0s; oneBracketContract.end" path="M0,0 L80,85" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" fill="freeze" />
  <animateMotion begin="oneBracketExpand.end" path="M80,85 L0,0" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" />
</rect>
</g>
</svg>
</div>

Kronecker product can be seen as replacing each element `c` of the left matrix with the right matrix scaled by the value `c`.

An example is shown below:

$$\begin{bmatrix} a_{11} & a_{12} & a_{13} \\ a_{21} & a_{22} & a_{23} \end{bmatrix} \otimes \begin{bmatrix} \textcolor{#b45309}{b_{11}} & \textcolor{#b45309}{b_{12}} \\ \textcolor{#b45309}{b_{21}} & \textcolor{#b45309}{b_{22}} \end{bmatrix} = \begin{bmatrix} a_{11}\textcolor{#b45309}{B} & a_{12}\textcolor{#b45309}{B} \\ a_{21}\textcolor{#b45309}{B} & a_{22}\textcolor{#b45309}{B} \end{bmatrix} = \begin{bmatrix} a_{11}\textcolor{#b45309}{b_{11}} & a_{11}\textcolor{#b45309}{b_{21}} & a_{12}\textcolor{#b45309}{b_{11}} & a_{12}\textcolor{#b45309}{b_{21}} & a_{13}\textcolor{#b45309}{b_{11}} & a_{13}\textcolor{#b45309}{b_{21}} \\ a_{11}\textcolor{#b45309}{b_{21}} & a_{11}\textcolor{#b45309}{b_{22}} & a_{12}\textcolor{#b45309}{b_{21}} & a_{12}\textcolor{#b45309}{b_{22}} & a_{13}\textcolor{#b45309}{b_{21}} & a_{13}\textcolor{#b45309}{b_{22}} \\ a_{21}\textcolor{#b45309}{b_{11}} & a_{21}\textcolor{#b45309}{b_{21}} & a_{22}\textcolor{#b45309}{b_{11}} & a_{22}\textcolor{#b45309}{b_{21}} & a_{23}\textcolor{#b45309}{b_{11}} & a_{23}\textcolor{#b45309}{b_{21}} \\ a_{21}\textcolor{#b45309}{b_{21}} & a_{21}\textcolor{#b45309}{b_{22}} & a_{22}\textcolor{#b45309}{b_{21}} & a_{22}\textcolor{#b45309}{b_{22}} & a_{23}\textcolor{#b45309}{b_{21}} & a_{23}\textcolor{#b45309}{b_{22}} \end{bmatrix}$$

---

## 2. Kronecker product of two vectors

Perhaps the most common Kronecker product of two vectors is the outer product - this is the product of a column vector of length $m$ with a row vector of length $n$. The outer product has the shape $(m,n)$. Kronecker product of two column vectors is a column vector whose length is the product of individual column vectors. Similarly the Kronecker product of two row vectors is a row vector.

$$\begin{bmatrix} a_0 \\ a_1 \\ a_2 \end{bmatrix} \otimes \begin{bmatrix} \textcolor{#b45309}{b_0} & \textcolor{#b45309}{b_1} & \textcolor{#b45309}{b_2} \end{bmatrix} = \begin{bmatrix} a_0 [\textcolor{#b45309}{b_0},\textcolor{#b45309}{b_1},\textcolor{#b45309}{b_2}] \\ a_1 [\textcolor{#b45309}{b_0},\textcolor{#b45309}{b_1},\textcolor{#b45309}{b_2}] \\ a_2 [\textcolor{#b45309}{b_0},\textcolor{#b45309}{b_1},\textcolor{#b45309}{b_2}] \end{bmatrix} = \begin{bmatrix} a_0\textcolor{#b45309}{b_0} & a_0\textcolor{#b45309}{b_1} & a_0\textcolor{#b45309}{b_2} \\ a_1\textcolor{#b45309}{b_0} & a_1\textcolor{#b45309}{b_1} & a_1\textcolor{#b45309}{b_2} \\ a_2\textcolor{#b45309}{b_0} & a_2\textcolor{#b45309}{b_1} & a_2\textcolor{#b45309}{b_2} \end{bmatrix}$$

### 2.1 Some lesser known properties of Kronecker product of two vectors

### 2.1.1 Kronecker product of two unit vectors is a unit vector

> $$||u \otimes v||^2 = ||u||^2||v||^2$$

Since $u \otimes v$ is a matrix, you can view it as a vector by stacking its columns vertically. In other words, the norm of $u \otimes v$ is the product of norms of $u$ and $v$. Note that this is true even for products of matrices - you just need to view the matrix as a vector.

### 2.1.2 Kronecker product of two probability distributions is a probability distribution

$$\underbrace{\begin{bmatrix} a_0\textcolor{#b45309}{b_0} & a_0\textcolor{#b45309}{b_1} & a_0\textcolor{#b45309}{b_2} \\ a_1\textcolor{#b45309}{b_0} & a_1\textcolor{#b45309}{b_1} & a_1\textcolor{#b45309}{b_2} \\ a_2\textcolor{#b45309}{b_0} & a_2\textcolor{#b45309}{b_1} & a_2\textcolor{#b45309}{b_2} \end{bmatrix}}_{{\text{joint probability distribution of}} \ a \ {\text{and}} \ \textcolor{#b45309}{b}}$$

If $u$ and $v$ are two (independent) probability distributions, their Kronecker product (viewed as a vector) is a (joint) probability distribution. More generally, Kronecker product of two stochastic matrices is itself a stochastic matrix. If these input matrices have steady states, the steady state of the output matrix is the Kronecker product of the steady states of the input matrices.

### 2.1.3 Connection with products of two polynomials

Given two polynomials $p(x) = p_0 + p_1x + ... + p_mx^m$ and $q(x) = q_0 + q_1x + ... + q_nx^n$, their product is $p(x)q(x) = s_0 + s_1x + ... + s_{m+n}x^{m+n}$ where $s_i$ is the sum of $i\text{-th}$ diagonal of the product

$$\begin{bmatrix} p_0 \\ p_1 \\ ... \\ p_m \end{bmatrix} \otimes \begin{bmatrix} q_0 & q_1 & ... & q_n \end{bmatrix}$$

For instance $(a + bx + cx^2)(p + qx + rx^2 + sx^3) = s_0 + s_1x + s_2x^2 + s_3x^3 + s_4x^4 + s_5x^5$ where $s_i$ is the sum of entries along the $i\text{-th}$ diagonal of the matrix $\begin{bmatrix} a \\ b \\ c \end{bmatrix} \otimes \begin{bmatrix} p & q & r & s \end{bmatrix}$:

<div style="display: flex; justify-content: center; margin: 1.5rem 0;">
<svg width="260" height="180" viewBox="0 0 260 180" xmlns="http://www.w3.org/2000/svg">
<g>
<rect x="30" y="30" width="170" height="120" fill="rgb(200,200,200)"></rect>
<line x1="5" y1="95" x2="95" y2="5" stroke="rgb(217 119 6)" stroke-dasharray="5 5 5" />
<line x1="5" y1="140" x2="140" y2="5" stroke="rgb(217 119 6)" stroke-dasharray="5 5 5" />
<line x1="5" y1="185" x2="185" y2="5" stroke="rgb(217 119 6)" stroke-dasharray="5 5 5" />
<line x1="5" y1="230" x2="230" y2="5" stroke="rgb(217 119 6)" stroke-dasharray="5 5 5" />
<line x1="5" y1="275" x2="275" y2="5" stroke="rgb(217 119 6)" stroke-dasharray="5 5 5" />
<line x1="5" y1="320" x2="320" y2="5" stroke="rgb(217 119 6)" stroke-dasharray="5 5 5" />
<text x="50" y="50" text-anchor="middle" font-size="20" stroke="rgb(100,100,100)" fill="rgb(100,100,100)">ap</text>
<text x="95" y="50" text-anchor="middle" font-size="20" stroke="rgb(100,100,100)" fill="rgb(100,100,100)">aq</text>
<text x="140" y="50" text-anchor="middle" font-size="20" stroke="rgb(100,100,100)" fill="rgb(100,100,100)">ar</text>
<text x="185" y="50" text-anchor="middle" font-size="20" stroke="rgb(100,100,100)" fill="rgb(100,100,100)">as</text>
<text x="50" y="95" text-anchor="middle" font-size="20" stroke="rgb(100,100,100)" fill="rgb(100,100,100)">bp</text>
<text x="95" y="95" text-anchor="middle" font-size="20" stroke="rgb(100,100,100)" fill="rgb(100,100,100)">bq</text>
<text x="140" y="95" text-anchor="middle" font-size="20" stroke="rgb(100,100,100)" fill="rgb(100,100,100)">br</text>
<text x="185" y="95" text-anchor="middle" font-size="20" stroke="rgb(100,100,100)" fill="rgb(100,100,100)">bs</text>
<text x="50" y="140" text-anchor="middle" font-size="20" stroke="rgb(100,100,100)" fill="rgb(100,100,100)">cp</text>
<text x="95" y="140" text-anchor="middle" font-size="20" stroke="rgb(100,100,100)" fill="rgb(100,100,100)">cq</text>
<text x="140" y="140" text-anchor="middle" font-size="20" stroke="rgb(100,100,100)" fill="rgb(100,100,100)">cr</text>
<text x="185" y="140" text-anchor="middle" font-size="20" stroke="rgb(100,100,100)" fill="rgb(100,100,100)">cs</text>
<text x="95" y="15" text-anchor="middle" font-size="20" stroke="rgb(217 119 6)" fill="rgb(217 119 6)">s0</text>
<text x="140" y="15" text-anchor="middle" font-size="20" stroke="rgb(217 119 6)" fill="rgb(217 119 6)">s1</text>
<text x="185" y="15" text-anchor="middle" font-size="20" stroke="rgb(217 119 6)" fill="rgb(217 119 6)">s2</text>
<text x="230" y="15" text-anchor="middle" font-size="20" stroke="rgb(217 119 6)" fill="rgb(217 119 6)">s3</text>
<text x="230" y="60" text-anchor="middle" font-size="20" stroke="rgb(217 119 6)" fill="rgb(217 119 6)">s4</text>
<text x="230" y="105" text-anchor="middle" font-size="20" stroke="rgb(217 119 6)" fill="rgb(217 119 6)">s5</text>
</g>
</svg>
</div>

The product of polynomials $a + bx + cx^2$ and $p + qx + rx^2 + sx^3$.

---

## 3. Bilinear form and Kronecker product: the most important takeaway

Note that we need to view a matrix as a vector (conventionally formed by stacking columns vertically) in order to interpret some properties of this product. This change in view is actually very helpful in solving equations of the form $AX + XB = C$. The insight lies in viewing a bilinear form as a dot product.

Given column vectors $b$ and $c$ and a matrix $M$, the bilinear form $c^TMb$ can be seen as a dot product between $b \otimes c$ and $vec(M)$ which is a vector formed by stacking columns of $M$.

<div style="display: flex; justify-content: center; margin: 1.5rem 0;">
<svg width="260" height="140" viewBox="0 0 260 140" xmlns="http://www.w3.org/2000/svg">
<g>
<path d="M15,5 L5,5 L5,30 L15,30" stroke="#27272a" stroke-width="1" fill="none"></path>
<path d="M55,5 L65,5 L65,30 L55,30" stroke="#27272a" stroke-width="1" fill="none">
  <animateTransform begin="0s; twoContract.end" id="twoExpand" attributeName="transform" type="translate" values="0 0;110 0;110 0" keyTimes="0; 0.25; 1" dur="5" fill="freeze"/>
  <animateTransform begin="twoExpand.end" id="twoContract" attributeName="transform" type="translate" values="110 0; 0 0;0 0" keyTimes="0; 0.25; 1" dur="5" fill="freeze"/>
</path>
<path d="M80,5 L70,5 L70,65 L80,65" stroke="#27272a" stroke-width="1" fill="none">
  <animateTransform begin="0s; twoContract.end" attributeName="transform" type="translate" values="0 0;110 -5;110 -5" keyTimes="0; 0.25; 1" dur="5" fill="freeze" additive="sum" />
  <animateTransform begin="0s; twoContract.end" attributeName="transform" type="scale" values="1 1;1 2;1 2" keyTimes="0; 0.25; 1" dur="5" fill="freeze" additive="sum" />
  <animateTransform begin="twoExpand.end" attributeName="transform" type="translate" values="0 0;-110 2.5;-110 2.5" keyTimes="0; 0.25; 1" dur="5" additive="sum"/>
  <animateTransform begin="twoExpand.end" attributeName="transform" type="scale" values="1 1;1 0.5;1 0.5" keyTimes="0; 0.25; 1" dur="5" additive="sum" />
</path>
<path d="M110,5 L120,5 L120,65 L110,65" stroke="#27272a" stroke-width="1" fill="none">
  <animateTransform begin="0s; twoContract.end" attributeName="transform" type="translate" values="0 0;85 -5;85 -5" keyTimes="0; 0.25; 1" dur="5" fill="freeze" additive="sum" />
  <animateTransform begin="0s; twoContract.end" attributeName="transform" type="scale" values="1 1;1 2;1 2" keyTimes="0; 0.25; 1" dur="5" fill="freeze" additive="sum" />
  <animateTransform begin="twoExpand.end" attributeName="transform" type="translate" values="0 0;-85 2.5;-85 2.5" keyTimes="0; 0.25; 1" dur="5" additive="sum" />
  <animateTransform begin="twoExpand.end" attributeName="transform" type="scale" values="1 1;1 0.5;1 0.5" keyTimes="0; 0.25; 1" dur="5" additive="sum" />
</path>
<path d="M140,10 L130,10 L130,60 L140,60" stroke="#27272a" stroke-width="1" fill="none">
  <animate begin="0s; twoContract.end" attributeName="stroke-opacity" values="1;0;0" dur="5" keyTimes="0; 0.25; 1" fill="freeze" />
  <animate begin="twoExpand.end" attributeName="stroke-opacity" values="0;1;1" dur="5" keyTimes="0; 0.25; 1" fill="freeze" />
</path>
<path d="M145,10 L155,10 L155,60 L145,60" stroke="#27272a" stroke-width="1" fill="none">
  <animate begin="0s; twoContract.end" attributeName="stroke-opacity" values="1;0;0" dur="5" keyTimes="0; 0.25; 1" fill="freeze" />
  <animate begin="twoExpand.end" attributeName="stroke-opacity" values="0;1;1" dur="5" keyTimes="0; 0.25; 1" fill="freeze" />
</path>
<rect x="10" y="10" width="50" height="15" fill="rgb(217 119 6)">
  <animateTransform begin="0s; twoContract.end" attributeName="transform" type="translate" dur="5" fill="freeze" values="0 0;20 0;20 0" keyTimes="0; 0.25; 1" />
  <animateTransform begin="twoExpand.end" attributeName="transform" type="translate" dur="5" fill="freeze" values="20 0;0 0;0 0" keyTimes="0; 0.25; 1" />
</rect>
<rect x="10" y="10" width="50" height="15" fill="rgb(217 119 6)">
  <animateTransform begin="0s; twoContract.end" attributeName="transform" type="translate" dur="5" fill="freeze" values="0 0;110 0;110 0" keyTimes="0; 0.25; 1" />
  <animateTransform begin="twoExpand.end" attributeName="transform" type="translate" dur="5" fill="freeze" values="110 0;0 0;0 0" keyTimes="0; 0.25; 1" />
</rect>
<rect x="75" y="10" width="15" height="50" fill="rgb(100,100,100)">
  <animateTransform begin="0s; twoContract.end" attributeName="transform" type="translate" dur="5" fill="freeze" values="0 0;110 0;110 0" keyTimes="0; 0.25; 1" />
  <animateTransform begin="twoExpand.end" attributeName="transform" type="translate" dur="5" values="110 0;0 0;0 0" keyTimes="0; 0.25; 1" />
</rect>
<rect x="100" y="10" width="15" height="50" fill="rgb(225 29 72)">
  <animateTransform begin="0s; twoContract.end" attributeName="transform" type="translate" dur="5" fill="freeze" values="0 0;85 60;85 60" keyTimes="0; 0.25; 1" />
  <animateTransform begin="twoExpand.end" attributeName="transform" type="translate" dur="5" values="85 60;0 0;0 0" keyTimes="0; 0.25; 1" />
</rect>
<circle cx="142.5" cy="22.5" r="7.5" fill="rgb(13 148 136)">
  <animateTransform begin="0s; twoContract.end" attributeName="transform" type="translate" dur="5" fill="freeze" values="0 0;-125 -5;-125 -5" keyTimes="0; 0.25; 1" />
  <animateTransform begin="twoExpand.end" attributeName="transform" type="translate" dur="5" values="-125 -5;0 0;0 0" keyTimes="0; 0.25; 1" />
</circle>
<circle cx="142.5" cy="47.5" r="7.5" fill="rgb(124 58 237)">
  <animateTransform begin="0s; twoContract.end" attributeName="transform" type="translate" dur="5" fill="freeze" values="0 0;-35 -30;-35 -30" keyTimes="0; 0.25; 1" />
  <animateTransform begin="twoExpand.end" attributeName="transform" type="translate" dur="5" values="-35 -30;0 0;0 0" keyTimes="0; 0.25; 1" />
</circle>
</g>
</svg>
</div>

The bilinear form $c^TMb$ can be seen as a dot product $(b^T \otimes c^T) \cdot vec(M) = (b \otimes c)^T \cdot vec(M)$.

### 3.1 Extending to products of the form $CXB^T$

This idea can be extended to products of the form $CMB^T$. We have:

$$vec(CMB^T) = (B \otimes C) \cdot vec(M)$$

This is useful when writing linear operators as matrix-vector products in Matrix calculus. Eg

$$dM^2 = (dM)M + M(dM) = I(dM)M + M(dM)I \Rightarrow vec(dM^2) = (M^T \otimes I + I \otimes M)vec(dM)$$

where $I$ is the identity matrix of the appropriate shape. This gives us:

$$\nabla M^2 = M^T \otimes I + I \otimes M$$

Similarly the [Sylvester equation](https://en.wikipedia.org/wiki/Sylvester_equation) $AX + XB = C$ can be solved like so:

$$C = AX + XB = AXI + IXB \Rightarrow vec(C) = (I \otimes A + B^T \otimes I)vec(X)$$

---

## 4. Kronecker product preserves many properties of the matrices

It was mentioned earlier that if the input matrices are stochastic, their Kronecker product is also stochastic. Similarly, if the input matrices have a norm of 1, so does their Kronecker product. Similarly, if the input matrices are permutation matrices, their Kronecker product is also a permutation matrix. If the input matrices are unitary, so is their Kronecker product. For a complete list, check out the [Wikipedia article](https://en.wikipedia.org/wiki/Kronecker_product).

---

## 5. An unconventional application of Kronecker product

A while ago I came across a small but amusing problem - how to visualize the attention value of each image patch. To provide some context, a Vision Transformer (ViT) divides an image into non-overlapping patches. For example, an image of dimensions `224x224` is divided into `7x7` patches, each patch of dimension `32x32`. Each patch is then converted into a vector and fed to transformer layers. We can extract the attention values from the last transformer layer. These attention values (each value is between 0 and 1) form a `7x7` grid, with each value corresponding to a `32x32` patch in the image. We can overlay these values on top of an image by multiplying each patch with the corresponding value. An example is shown below.

<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem; margin: 1.5rem 0;">
<img src="/blog/plane.jpg" width="224" height="224" alt="A plane" />
<img src="/blog/plane_grid.jpg" width="224" height="224" alt="The plane divided into a 7x7 grid" />
</div>

An image is divided into 7x7 patches. Each patch is assigned a probability by the attention layer.

The Kronecker product of the `7x7` attention matrix with a matrix of 1s of shape `32x32` gives the desired matrix which, when multiplied elementwise to the input image, gives the final overlaid image.

$$\begin{bmatrix} a_{00} & a_{01} & a_{02} & a_{03} & a_{04} & a_{05} & a_{06} \\ a_{10} & a_{11} & a_{12} & a_{13} & a_{14} & a_{15} & a_{16} \\ a_{20} & a_{21} & a_{22} & a_{23} & a_{24} & a_{25} & a_{26} \\ a_{30} & a_{31} & a_{32} & a_{33} & a_{34} & a_{35} & a_{36} \\ a_{40} & a_{41} & a_{42} & a_{43} & a_{44} & a_{45} & a_{46} \\ a_{50} & a_{51} & a_{52} & a_{53} & a_{54} & a_{55} & a_{56} \\ a_{60} & a_{61} & a_{62} & a_{63} & a_{64} & a_{65} & a_{66} \end{bmatrix} \otimes [1] = \begin{bmatrix} a_{00}.[1] & a_{01}.[1] & a_{02}.[1] & a_{03}.[1] & a_{04}.[1] & a_{05}.[1] & a_{06}.[1] \\ a_{10}.[1] & a_{11}.[1] & a_{12}.[1] & a_{13}.[1] & a_{14}.[1] & a_{15}.[1] & a_{16}.[1] \\ a_{20}.[1] & a_{21}.[1] & a_{22}.[1] & a_{23}.[1] & a_{24}.[1] & a_{25}.[1] & a_{26}.[1] \\ a_{30}.[1] & a_{31}.[1] & a_{32}.[1] & a_{33}.[1] & a_{34}.[1] & a_{35}.[1] & a_{36}.[1] \\ a_{40}.[1] & a_{41}.[1] & a_{42}.[1] & a_{43}.[1] & a_{44}.[1] & a_{45}.[1] & a_{46}.[1] \\ a_{50}.[1] & a_{51}.[1] & a_{52}.[1] & a_{53}.[1] & a_{54}.[1] & a_{55}.[1] & a_{56}.[1] \\ a_{60}.[1] & a_{61}.[1] & a_{62}.[1] & a_{63}.[1] & a_{64}.[1] & a_{65}.[1] & a_{66}.[1] \end{bmatrix}$$

The Kronecker product of the attention values with a ones matrix $[1]$ of shape $(32,32)$ gives the desired output matrix.

<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem; margin: 1.5rem 0;">
<img src="/blog/plane.jpg" width="224" height="224" alt="A plane" />
<img src="/blog/plane_grid.jpg" width="224" height="224" alt="The plane divided into a 7x7 grid" />
<img src="/blog/plane_attn.jpg" width="224" height="224" alt="The plane with attention values overlaid" />
</div>

---

## Related articles:

- [Three interpretations of matrix products visualized](/blog/matmul_animations)
