---
title: The Khatri-Rao Product Visualized
description: The Khatri-Rao product as a column-wise Kronecker product, its row-wise variant, and three properties with proofs, including the Hadamard Gram matrix.
---

# The Khatri-Rao Product Visualized

The Khatri-Rao product takes two matrices with the *same number of columns* and pairs their columns up, replacing each pair by its Kronecker product. The result is a tall matrix with the same number of columns as the inputs. As a result it keeps the width fixed while the heights are multiplied.

---

## 1. Definition: the column-wise Kronecker product

Write $\textcolor{#0d9488}{A} = \begin{bmatrix} \textcolor{#0d9488}{a_1} & \textcolor{#0d9488}{a_2} & \cdots & \textcolor{#0d9488}{a_K} \end{bmatrix}$ and $\textcolor{#b45309}{B} = \begin{bmatrix} \textcolor{#b45309}{b_1} & \textcolor{#b45309}{b_2} & \cdots & \textcolor{#b45309}{b_K} \end{bmatrix}$ as lists of columns, with $\textcolor{#0d9488}{a_k} \in \mathbb{R}^{I}$ and $\textcolor{#b45309}{b_k} \in \mathbb{R}^{J}$. On a matrix, a subscript picks a *column* and a superscript picks a *row*: $\textcolor{#0d9488}{a_k}$ is the $k$-th column of $\textcolor{#0d9488}{A}$, and $\textcolor{#0d9488}{a^i}$ (section 3) is its $i$-th row. The Khatri-Rao product is defined column by column:

$$\underbrace{\textcolor{#0d9488}{A} \odot \textcolor{#b45309}{B}}_{IJ \times K} = \begin{bmatrix} \underbrace{\textcolor{#0d9488}{a_1} \otimes \textcolor{#b45309}{b_1}}_{IJ \times 1} & \textcolor{#0d9488}{a_2} \otimes \textcolor{#b45309}{b_2} & \cdots & \textcolor{#0d9488}{a_K} \otimes \textcolor{#b45309}{b_K} \end{bmatrix}$$

Column $k$ of the output depends only on column $k$ of each input. Nothing mixes across columns.

The two inputs have $K = 2$ columns each. In the figure below, matching columns share a color: the entries of $A$ are circles, the columns of $B$ are blocks.

<div style="display: flex; flex-wrap: wrap; justify-content: center; align-items: flex-start; gap: 2rem; margin: 1.5rem 0;">
<svg width="75" height="115" viewBox="0 0 75 115" xmlns="http://www.w3.org/2000/svg">
<g>
<path d="M15,5 L5,5 L5,80 L15,80" stroke="#27272a" stroke-width="1" fill="none" />
<path d="M60,5 L65,5 L65,80 L60,80" stroke="#27272a" stroke-width="1" fill="none" />
<circle cx="17.5" cy="17.5" r="7.5" fill="rgb(217 119 6)" opacity="1" />
<circle cx="52.5" cy="17.5" r="7.5" fill="rgb(13 148 136)" opacity="0.55" />
<circle cx="17.5" cy="42.5" r="7.5" fill="rgb(217 119 6)" opacity="0.7" />
<circle cx="52.5" cy="42.5" r="7.5" fill="rgb(13 148 136)" opacity="1" />
<circle cx="17.5" cy="67.5" r="7.5" fill="rgb(217 119 6)" opacity="0.45" />
<circle cx="52.5" cy="67.5" r="7.5" fill="rgb(13 148 136)" opacity="0.75" />
<text x="17.5" y="95" text-anchor="middle" font-size="12" fill="rgb(217 119 6)">a&#8321;</text>
<text x="52.5" y="95" text-anchor="middle" font-size="12" fill="rgb(13 148 136)">a&#8322;</text>
<text x="35" y="112" text-anchor="middle" font-size="13" fill="#71717a">A</text>
</g>
</svg>
<svg width="85" height="115" viewBox="0 0 85 115" xmlns="http://www.w3.org/2000/svg">
<g>
<path d="M15,17.5 L5,17.5 L5,67.5 L15,67.5" stroke="#27272a" stroke-width="1" fill="none" />
<path d="M70,17.5 L80,17.5 L80,67.5 L70,67.5" stroke="#27272a" stroke-width="1" fill="none" />
<rect x="15" y="22.5" width="25" height="40" fill="rgb(217 119 6)" />
<rect x="45" y="22.5" width="25" height="40" fill="rgb(13 148 136)" />
<text x="27.5" y="95" text-anchor="middle" font-size="12" fill="rgb(217 119 6)">b&#8321;</text>
<text x="57.5" y="95" text-anchor="middle" font-size="12" fill="rgb(13 148 136)">b&#8322;</text>
<text x="42.5" y="112" text-anchor="middle" font-size="13" fill="#71717a">B</text>
</g>
</svg>
</div>

<div style="display: flex; justify-content: center; margin: 1.5rem 0;">
<svg width="175" height="180" viewBox="0 0 175 180" xmlns="http://www.w3.org/2000/svg">
<g fill="rgb(200,200,200)">
<path d="M15,5 L5,5 L5,80 L15,80" stroke="#27272a" stroke-width="1" fill="none">
  <animateTransform id="krExpand" begin="0s; krContract.end" attributeName="transform" type="scale" values="1 1;1 2;1 2" keyTimes="0; 0.25; 1" dur="3" additive="sum" fill="freeze" />
  <animateTransform begin="0s; krContract.end" attributeName="transform" type="translate" values="0 0;0 -2.5;0 -2.5" keyTimes="0; 0.25; 1" dur="3" additive="sum" fill="freeze" />
  <animateTransform id="krContract" begin="krExpand.end" attributeName="transform" type="scale" values="1 1;1 0.5;1 0.5" keyTimes="0; 0.25; 1" dur="3" additive="sum" />
  <animateTransform begin="krExpand.end" attributeName="transform" type="translate" values="0 0;0 2.5;0 2.5" keyTimes="0; 0.25; 1" dur="3" additive="sum" />
</path>
<path d="M60,5 L65,5 L65,80 L60,80" stroke="#27272a" stroke-width="1" fill="none">
  <animateTransform begin="0s; krContract.end" attributeName="transform" type="scale" values="1 1;1 2;1 2" keyTimes="0; 0.25; 1" dur="3" additive="sum" fill="freeze" />
  <animateTransform begin="0s; krContract.end" attributeName="transform" type="translate" values="0 0;100 -2.5;100 -2.5" keyTimes="0; 0.25; 1" dur="3" additive="sum" fill="freeze" />
  <animateTransform begin="krExpand.end" attributeName="transform" type="scale" values="1 1;1 0.5;1 0.5" keyTimes="0; 0.25; 1" dur="3" additive="sum" />
  <animateTransform begin="krExpand.end" attributeName="transform" type="translate" values="0 0;-100 2.5;-100 2.5" keyTimes="0; 0.25; 1" dur="3" additive="sum" />
</path>
<circle cx="17.5" cy="17.5" r="7.5" fill="rgb(217 119 6)" opacity="1">
  <animateMotion begin="0s; krContract.end" path="M0,0 L0,12.5" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" fill="freeze" />
  <animateMotion begin="krExpand.end" path="M0,12.5 L0,0" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" />
</circle>
<circle cx="52.5" cy="17.5" r="7.5" fill="rgb(13 148 136)" opacity="0.55">
  <animateMotion begin="0s; krContract.end" path="M0,0 L60,12.5" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" fill="freeze" />
  <animateMotion begin="krExpand.end" path="M60,12.5 L0,0" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" />
</circle>
<circle cx="17.5" cy="42.5" r="7.5" fill="rgb(217 119 6)" opacity="0.7">
  <animateMotion begin="0s; krContract.end" path="M0,0 L0,37.5" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" fill="freeze" />
  <animateMotion begin="krExpand.end" path="M0,37.5 L0,0" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" />
</circle>
<circle cx="52.5" cy="42.5" r="7.5" fill="rgb(13 148 136)" opacity="1">
  <animateMotion begin="0s; krContract.end" path="M0,0 L60,37.5" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" fill="freeze" />
  <animateMotion begin="krExpand.end" path="M60,37.5 L0,0" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" />
</circle>
<circle cx="17.5" cy="67.5" r="7.5" fill="rgb(217 119 6)" opacity="0.45">
  <animateMotion begin="0s; krContract.end" path="M0,0 L0,62.5" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" fill="freeze" />
  <animateMotion begin="krExpand.end" path="M0,62.5 L0,0" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" />
</circle>
<circle cx="52.5" cy="67.5" r="7.5" fill="rgb(13 148 136)" opacity="0.75">
  <animateMotion begin="0s; krContract.end" path="M0,0 L60,62.5" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" fill="freeze" />
  <animateMotion begin="krExpand.end" path="M60,62.5 L0,0" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" />
</circle>
<rect x="75" y="25" height="40" width="25" fill="rgb(217 119 6)" opacity="1">
  <animateMotion begin="0s; krContract.end" path="M0,0 L-40,-15" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" fill="freeze" />
  <animateMotion begin="krExpand.end" path="M-40,-15 L0,0" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" />
</rect>
<rect x="75" y="25" height="40" width="25" fill="rgb(217 119 6)" opacity="0.7">
  <animateMotion begin="0s; krContract.end" path="M0,0 L-40,35" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" fill="freeze" />
  <animateMotion begin="krExpand.end" path="M-40,35 L0,0" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" />
</rect>
<rect x="75" y="25" height="40" width="25" fill="rgb(217 119 6)" opacity="0.45">
  <animateMotion begin="0s; krContract.end" path="M0,0 L-40,85" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" fill="freeze" />
  <animateMotion begin="krExpand.end" path="M-40,85 L0,0" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" />
</rect>
<rect x="105" y="25" height="40" width="25" fill="rgb(13 148 136)" opacity="0.55">
  <animateMotion begin="0s; krContract.end" path="M0,0 L25,-15" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" fill="freeze" />
  <animateMotion begin="krExpand.end" path="M25,-15 L0,0" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" />
</rect>
<rect x="105" y="25" height="40" width="25" fill="rgb(13 148 136)" opacity="1">
  <animateMotion begin="0s; krContract.end" path="M0,0 L25,35" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" fill="freeze" />
  <animateMotion begin="krExpand.end" path="M25,35 L0,0" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" />
</rect>
<rect x="105" y="25" height="40" width="25" fill="rgb(13 148 136)" opacity="0.75">
  <animateMotion begin="0s; krContract.end" path="M0,0 L25,85" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" fill="freeze" />
  <animateMotion begin="krExpand.end" path="M25,85 L0,0" dur="3" keyTimes="0; 0.25; 1" keyPoints="0; 1; 1" />
</rect>
<text x="85" y="172" text-anchor="middle" font-size="13" fill="#71717a" opacity="0">A &#8857; B
  <animate begin="0s; krContract.end" attributeName="opacity" values="0;1;1" dur="3" keyTimes="0; 0.25; 1" fill="freeze" />
  <animate begin="krExpand.end" attributeName="opacity" values="1;0;0" dur="3" keyTimes="0; 0.25; 1" />
</text>
</g>
</svg>
</div>

#### An example with $2 \times 2$ inputs 

$$\begin{aligned}
\begin{bmatrix} \textcolor{#0d9488}{a_{11}} & \textcolor{#0d9488}{a_{12}} \\ \textcolor{#0d9488}{a_{21}} & \textcolor{#0d9488}{a_{22}} \end{bmatrix} \odot \begin{bmatrix} \textcolor{#b45309}{b_{11}} & \textcolor{#b45309}{b_{12}} \\ \textcolor{#b45309}{b_{21}} & \textcolor{#b45309}{b_{22}} \end{bmatrix}
&= \begin{bmatrix} \underbrace{\textcolor{#0d9488}{a_1} \otimes \textcolor{#b45309}{b_1}}_{\text{first columns}} & \underbrace{\textcolor{#0d9488}{a_2} \otimes \textcolor{#b45309}{b_2}}_{\text{second columns}} \end{bmatrix} \\ \\
&= \begin{bmatrix}
      \textcolor{#0d9488}{a_{11}} \textcolor{#b45309}{\begin{bmatrix} b_{11} \\ b_{21} \end{bmatrix}} & \textcolor{#0d9488}{a_{12}} \textcolor{#b45309}{\begin{bmatrix} b_{12} \\ b_{22} \end{bmatrix}} \\[6pt]
      \textcolor{#0d9488}{a_{21}} \textcolor{#b45309}{\begin{bmatrix} b_{11} \\ b_{21} \end{bmatrix}} & \textcolor{#0d9488}{a_{22}} \textcolor{#b45309}{\begin{bmatrix} b_{12} \\ b_{22} \end{bmatrix}}
   \end{bmatrix} \\ \\
&= \begin{bmatrix}
      \textcolor{#0d9488}{a_{11}}\textcolor{#b45309}{b_{11}} & \textcolor{#0d9488}{a_{12}}\textcolor{#b45309}{b_{12}} \\
      \textcolor{#0d9488}{a_{11}}\textcolor{#b45309}{b_{21}} & \textcolor{#0d9488}{a_{12}}\textcolor{#b45309}{b_{22}} \\
      \textcolor{#0d9488}{a_{21}}\textcolor{#b45309}{b_{11}} & \textcolor{#0d9488}{a_{22}}\textcolor{#b45309}{b_{12}} \\
      \textcolor{#0d9488}{a_{21}}\textcolor{#b45309}{b_{21}} & \textcolor{#0d9488}{a_{22}}\textcolor{#b45309}{b_{22}}
   \end{bmatrix}
\end{aligned}$$

The second step is a $2 \times 2$ grid of *blocks*, not of numbers: each block is one whole column of $\textcolor{#b45309}{B}$, written out as a stacked pair and scaled by a single entry of $\textcolor{#0d9488}{A}$. Column $1$ of the answer therefore only ever sees $\textcolor{#b45309}{b_1}$, and column $2$ only ever sees $\textcolor{#b45309}{b_2}$, never the whole of $\textcolor{#b45309}{B}$. That single difference is what separates $\odot$ from $\otimes$.

---

## 2. One column at a time: the Kronecker product of two columns

Zoom in on a single column pair $\textcolor{#0d9488}{a}$, $\textcolor{#b45309}{b}$. Inside this section a subscript indexes an *entry* of that one column, not a column of a matrix. The Kronecker product $\textcolor{#0d9488}{a} \otimes \textcolor{#b45309}{b}$ stacks one scaled copy of $\textcolor{#b45309}{b}$ per entry of $\textcolor{#0d9488}{a}$:

$$\begin{aligned}
\textcolor{#0d9488}{a} \otimes \textcolor{#b45309}{b}
&= \begin{bmatrix} \textcolor{#0d9488}{a_1} \\ \textcolor{#0d9488}{a_2} \\ \textcolor{#0d9488}{a_3} \end{bmatrix} \otimes \textcolor{#b45309}{b} \\ \\
&= \begin{bmatrix} \textcolor{#0d9488}{a_1} \textcolor{#b45309}{b} \\ \textcolor{#0d9488}{a_2} \textcolor{#b45309}{b} \\ \textcolor{#0d9488}{a_3} \textcolor{#b45309}{b} \end{bmatrix}
\end{aligned}$$

Laying those same three blocks side by side instead of stacking them gives the outer product $\textcolor{#b45309}{b}\textcolor{#0d9488}{a^T}$:

$$\begin{aligned}
\textcolor{#b45309}{b}\textcolor{#0d9488}{a^T}
&= \begin{bmatrix} \textcolor{#b45309}{b_1} \\ \textcolor{#b45309}{b_2} \end{bmatrix} \begin{bmatrix} \textcolor{#0d9488}{a_1} & \textcolor{#0d9488}{a_2} & \textcolor{#0d9488}{a_3} \end{bmatrix} \\ \\
&= \begin{bmatrix} \textcolor{#0d9488}{a_1}\textcolor{#b45309}{b_1} & \textcolor{#0d9488}{a_2}\textcolor{#b45309}{b_1} & \textcolor{#0d9488}{a_3}\textcolor{#b45309}{b_1} \\ \textcolor{#0d9488}{a_1}\textcolor{#b45309}{b_2} & \textcolor{#0d9488}{a_2}\textcolor{#b45309}{b_2} & \textcolor{#0d9488}{a_3}\textcolor{#b45309}{b_2} \end{bmatrix}
\end{aligned}$$

Its columns are $\textcolor{#0d9488}{a_1}\textcolor{#b45309}{b}$, $\textcolor{#0d9488}{a_2}\textcolor{#b45309}{b}$ and $\textcolor{#0d9488}{a_3}\textcolor{#b45309}{b}$, the very blocks that the Kronecker product stacks.

<div style="display: flex; justify-content: center; margin: 1.5rem 0;">
<svg width="190" height="152" viewBox="0 0 190 152" xmlns="http://www.w3.org/2000/svg">
<g>
<rect x="80" y="45" width="15" height="40" fill="#a1a1aa">
  <animateMotion id="kro0" begin="0s; kroBack2.end" path="M0,0 L70,-40" dur="3" keyTimes="0; 0.5; 1" keyPoints="0; 1; 1" fill="freeze" />
  <animate begin="0s; kroBack2.end" attributeName="fill" values="#a1a1aa; rgb(217 119 6); rgb(217 119 6)" dur="3" keyTimes="0; 0.4; 1" fill="freeze" />
  <animateMotion id="kroBack0" begin="kro2.end" path="M70,-40 L0,0" dur="2" keyTimes="0; 0.5; 1" keyPoints="0; 1; 1" />
  <animate begin="kro2.end" attributeName="fill" values="rgb(217 119 6); #a1a1aa; #a1a1aa" dur="2" keyTimes="0; 0.5; 1" />
</rect>
<rect x="80" y="45" width="15" height="40" fill="#a1a1aa">
  <animateMotion id="kro1" begin="0s; kroBack2.end" path="M0,0 L70,0" dur="3" keyTimes="0; 0.5; 1" keyPoints="0; 1; 1" fill="freeze" />
  <animate begin="0s; kroBack2.end" attributeName="fill" values="#a1a1aa; rgb(225 29 72); rgb(225 29 72)" dur="3" keyTimes="0; 0.4; 1" fill="freeze" />
  <animateMotion id="kroBack1" begin="kro2.end" path="M70,0 L0,0" dur="2" keyTimes="0; 0.5; 1" keyPoints="0; 1; 1" />
  <animate begin="kro2.end" attributeName="fill" values="rgb(225 29 72); #a1a1aa; #a1a1aa" dur="2" keyTimes="0; 0.5; 1" />
</rect>
<rect x="80" y="45" width="15" height="40" fill="#a1a1aa">
  <animateMotion id="kro2" begin="0s; kroBack2.end" path="M0,0 L70,40" dur="3" keyTimes="0; 0.5; 1" keyPoints="0; 1; 1" fill="freeze" />
  <animate begin="0s; kroBack2.end" attributeName="fill" values="#a1a1aa; rgb(124 58 237); rgb(124 58 237)" dur="3" keyTimes="0; 0.4; 1" fill="freeze" />
  <animateMotion id="kroBack2" begin="kro2.end" path="M70,40 L0,0" dur="2" keyTimes="0; 0.5; 1" keyPoints="0; 1; 1" />
  <animate begin="kro2.end" attributeName="fill" values="rgb(124 58 237); #a1a1aa; #a1a1aa" dur="2" keyTimes="0; 0.5; 1" />
</rect>
<rect x="80" y="45" width="15" height="40" fill="#a1a1aa" />
<circle cx="27.5" cy="35" r="7.5" fill="rgb(217 119 6)" />
<circle cx="27.5" cy="65" r="7.5" fill="rgb(225 29 72)" />
<circle cx="27.5" cy="95" r="7.5" fill="rgb(124 58 237)" />
<path d="M18,23 L8,23 L8,107 L18,107" stroke="#71717a" stroke-width="1" fill="none" />
<path d="M37,23 L47,23 L47,107 L37,107" stroke="#71717a" stroke-width="1" fill="none" />
<path d="M80,40 L70,40 L70,90 L80,90" stroke="#71717a" stroke-width="1" fill="none" />
<path d="M95,40 L105,40 L105,90 L95,90" stroke="#71717a" stroke-width="1" fill="none" />
<path d="M150,0 L140,0 L140,130 L150,130" stroke="#71717a" stroke-width="1" fill="none" />
<path d="M165,0 L175,0 L175,130 L165,130" stroke="#71717a" stroke-width="1" fill="none" />
<text x="60" y="70" text-anchor="middle" font-size="16" fill="#27272a">&#8855;</text>
<text x="120" y="70" text-anchor="middle" font-size="16" fill="#27272a">=</text>
<text x="27.5" y="145" text-anchor="middle" font-size="13" fill="#71717a">a</text>
<text x="87.5" y="145" text-anchor="middle" font-size="13" fill="#71717a">b</text>
<text x="157.5" y="145" text-anchor="middle" font-size="13" fill="#71717a">a &#8855; b</text>
</g>
</svg>
</div>

Three copies of $\textcolor{#b45309}{b}$, each tinted by the entry of $\textcolor{#0d9488}{a}$ that scales it. The output length is the product of the two input lengths.

Both layouts hold the same numbers in the same order, because $\operatorname{vec}$ reads a matrix one column at a time and stacks those columns into a single long vector. That is why the Khatri-Rao product has a natural interpretation as **an outer product in disguise**:

$$\underbrace{\textcolor{#0d9488}{a} \otimes \textcolor{#b45309}{b}}_{\text{blocks stacked}} = \operatorname{vec}\big(\underbrace{\textcolor{#b45309}{b}\textcolor{#0d9488}{a^T}}_{\text{blocks side by side}}\big)$$

> Each column of $\textcolor{#0d9488}{A} \odot \textcolor{#b45309}{B}$ is a flattened outer product matrix.

---

## 3. The row-wise variant

Swapping rows for columns gives the face-splitting product. For $\textcolor{#0d9488}{A} \in \mathbb{R}^{I \times J}$ and $\textcolor{#b45309}{B} \in \mathbb{R}^{I \times K}$, the matrix $\textcolor{#0d9488}{A} \bullet \textcolor{#b45309}{B} \in \mathbb{R}^{I \times JK}$ has rows $\textcolor{#0d9488}{a^i} \otimes \textcolor{#b45309}{b^i}$, where $\textcolor{#0d9488}{a^i}$ is the $i$-th row of $\textcolor{#0d9488}{A}$. The two are transposes of each other:

$$\textcolor{#0d9488}{A} \bullet \textcolor{#b45309}{B} = (\textcolor{#0d9488}{A^T} \odot \textcolor{#b45309}{B^T})^T$$

Its defining property is that it turns a Kronecker product of inputs into an elementwise product of outputs:

$$(\textcolor{#0d9488}{A} \bullet \textcolor{#b45309}{B})\underbrace{(\textcolor{#0d9488}{x} \otimes \textcolor{#b45309}{y})}_{\text{Kronecker in}} = \underbrace{(\textcolor{#0d9488}{Ax}) * (\textcolor{#b45309}{By})}_{\text{Hadamard out}}$$

where $*$ is the elementwise (Hadamard) product. 

#### Proof

The identity holds row by row, so watch a single row $i$, with $\textcolor{#0d9488}{a}$ short for $\textcolor{#0d9488}{a^i}$ and $\textcolor{#b45309}{b}$ short for $\textcolor{#b45309}{b^i}$. 

Both Kronecker products are indexed by the pair $(j,k)$: entry $(j,k)$ is $\textcolor{#0d9488}{a_j}\textcolor{#b45309}{b_k}$ on one side and $\textcolor{#0d9488}{x_j}\textcolor{#b45309}{y_k}$ on the other:

$$\begin{aligned}
\big[(\textcolor{#0d9488}{A} \bullet \textcolor{#b45309}{B})(\textcolor{#0d9488}{x} \otimes \textcolor{#b45309}{y})\big]_i
&= (\textcolor{#0d9488}{a} \otimes \textcolor{#b45309}{b}) \cdot (\textcolor{#0d9488}{x} \otimes \textcolor{#b45309}{y}) \\ \\
&= \sum_{j,k} \textcolor{#0d9488}{a_j} \textcolor{#b45309}{b_k} \textcolor{#0d9488}{x_j} \textcolor{#b45309}{y_k} \\
&= \sum_{j,k} \underbrace{(\textcolor{#0d9488}{a_j x_j})}_{\textcolor{#0d9488}{\text{depends on } j}} \underbrace{(\textcolor{#b45309}{b_k y_k})}_{\textcolor{#b45309}{\text{depends on } k}} \\ \\
&= \Big(\sum_j \textcolor{#0d9488}{a_j x_j}\Big) \Big(\sum_k \textcolor{#b45309}{b_k y_k}\Big) \\ \\
&= (\textcolor{#0d9488}{a} \cdot \textcolor{#0d9488}{x})(\textcolor{#b45309}{b} \cdot \textcolor{#b45309}{y}) \\
&= \big[(\textcolor{#0d9488}{Ax}) * (\textcolor{#b45309}{By})\big]_i
\end{aligned}$$

---

## 4. Three properties worth remembering

### 4.1 The Gram matrix collapses to a Hadamard product

$$(\textcolor{#0d9488}{A} \odot \textcolor{#b45309}{B})^T (\textcolor{#0d9488}{A} \odot \textcolor{#b45309}{B}) = (\textcolor{#0d9488}{A^TA}) * (\textcolor{#b45309}{B^TB})$$

#### Proof
Entry $(k,l)$ of the left side is the dot product of column $k$ with column $l$, and the two families separate:

$$\begin{aligned}
\big[(\textcolor{#0d9488}{A} \odot \textcolor{#b45309}{B})^T (\textcolor{#0d9488}{A} \odot \textcolor{#b45309}{B})\big]_{kl}
&= (\textcolor{#0d9488}{a_k} \otimes \textcolor{#b45309}{b_k})^T (\textcolor{#0d9488}{a_l} \otimes \textcolor{#b45309}{b_l}) \\ \\
&= \underbrace{(\textcolor{#0d9488}{a_k^T a_l})}_{\textcolor{#0d9488}{[A^TA]_{kl}}} \underbrace{(\textcolor{#b45309}{b_k^T b_l})}_{\textcolor{#b45309}{[B^TB]_{kl}}} \\ \\
&= \big[(\textcolor{#0d9488}{A^TA}) * (\textcolor{#b45309}{B^TB})\big]_{kl}
\end{aligned}$$

A $K \times K$ answer that never touches the $IJ \times K$ matrix $\textcolor{#0d9488}{A} \odot \textcolor{#b45309}{B}$. This is the single most useful fact about $\odot$. 

---

### 4.2 It expresses a weighted sum of outer products as a matrix-vector product

$$(\textcolor{#0d9488}{A} \odot \textcolor{#b45309}{B})x = \operatorname{vec}\big(\textcolor{#b45309}{B} \operatorname{diag}(x) \textcolor{#0d9488}{A^T}\big)$$

#### Proof

Read the left side one column at a time, then replace each Kronecker column by the outer product it flattens:

$$\begin{aligned}
(\textcolor{#0d9488}{A} \odot \textcolor{#b45309}{B})x
&= \underbrace{\sum_k x_k \, (\textcolor{#0d9488}{a_k} \otimes \textcolor{#b45309}{b_k})}_{\text{weighted sum of the columns}} \\ \\
&= \sum_k x_k \operatorname{vec}(\textcolor{#b45309}{b_k}\textcolor{#0d9488}{a_k^T}) \\ \\
&= \operatorname{vec}\Big(\sum_k x_k \, \textcolor{#b45309}{b_k}\textcolor{#0d9488}{a_k^T}\Big) \\ \\
&= \operatorname{vec}\big(\textcolor{#b45309}{B} \operatorname{diag}(x) \textcolor{#0d9488}{A^T}\big)
\end{aligned}$$

The last step is the outer-product reading of a matrix product: $\operatorname{diag}(x)$ hands weight $x_k$ to the $k$-th pairing of a column of $\textcolor{#b45309}{B}$ with a row of $\textcolor{#0d9488}{A^T}$. 

---

### 4.3 The mixed product rule carries over

$$(\textcolor{#0d9488}{A} \otimes \textcolor{#b45309}{B})(\textcolor{#0d9488}{C} \odot \textcolor{#b45309}{D}) = (\textcolor{#0d9488}{AC}) \odot (\textcolor{#b45309}{BD})$$

#### Proof
Column $k$ of $\textcolor{#0d9488}{C} \odot \textcolor{#b45309}{D}$ is itself a Kronecker product, so the mixed product rule for $\otimes$ applies to it directly:

$$\begin{aligned}
\big[(\textcolor{#0d9488}{A} \otimes \textcolor{#b45309}{B})(\textcolor{#0d9488}{C} \odot \textcolor{#b45309}{D})\big]_k
&= (\textcolor{#0d9488}{A} \otimes \textcolor{#b45309}{B})(\textcolor{#0d9488}{c_k} \otimes \textcolor{#b45309}{d_k}) \\ \\
&= \textcolor{#0d9488}{Ac_k} \otimes \textcolor{#b45309}{Bd_k} \\ \\
&= \big[(\textcolor{#0d9488}{AC}) \odot (\textcolor{#b45309}{BD})\big]_k
\end{aligned}$$

The Khatri-Rao product is also associative: $(A \odot B) \odot C = A \odot (B \odot C)$.
