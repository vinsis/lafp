---
title: Circulant matrices
---

# Circulant matrices

A circulant matrix is a square matrix in which each row (or column) is a rightward (or downward) cyclic shift of the previous one. 

<div style="text-align:center;overflow-x:auto">
<svg width="480" height="220" xmlns="http://www.w3.org/2000/svg">
<g>
<path d="M75,10 L65,10 L65,200 L75,200" stroke="#71717a" fill="none" opacity="0"><animate attributeName="opacity" from="0" to="1" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></path>
<path d="M370,10 L380,10 L380,200 L370,200" stroke="#71717a" fill="none" opacity="0"><animate attributeName="opacity" from="0" to="1" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></path>
<path d="M420,10 L410,10 L410,200 L420,200" stroke="#71717a" fill="none" opacity="0"><animate attributeName="opacity" from="0" to="1" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></path>
<path d="M440,10 L450,10 L450,200 L440,200" stroke="#71717a" fill="none" opacity="0"><animate attributeName="opacity" from="0" to="1" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></path>
</g>
<g font-family="'JetBrains Mono', 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace">
<text x="10" y="30" fill="#0d9488" font-size="20">z₀=</text>
<text x="50" y="30" fill="#e11d48" font-size="20">x₀ <animate id="moveToRight0Forward" attributeName="x" from="50" to="420" dur="1s" fill="freeze" begin="2s;moveToRight0Backward.end+5s"/><animate attributeName="y" from="30" to="30" dur="1s" fill="freeze" begin="2s;moveToRight0Backward.end+5s"/><animate id="moveToRight0Backward" attributeName="x" from="420" to="50" dur="1s" fill="freeze" begin="moveToRight0Forward.end+5s"/><animate attributeName="y" from="30" to="30" dur="1s" fill="freeze" begin="moveToRight0Forward.end+5s"/></text>
<text x="72" y="30" fill="#0d9488" font-size="20">y₀</text>
<text x="100" y="30" fill="#0d9488" font-size="20">+ <animate id="opacity1To0" attributeName="opacity" from="1" to="0" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate id="opacity0To1" attributeName="opacity" from="0" to="1" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></text>
<text x="120" y="30" fill="#e11d48" font-size="20">x₁ <animate id="moveToRight1Forward" attributeName="x" from="120" to="420" dur="1s" fill="freeze" begin="2s;moveToRight1Backward.end+5s"/><animate attributeName="y" from="30" to="70" dur="1s" fill="freeze" begin="2s;moveToRight1Backward.end+5s"/><animate id="moveToRight1Backward" attributeName="x" from="420" to="120" dur="1s" fill="freeze" begin="moveToRight1Forward.end+5s"/><animate attributeName="y" from="70" to="30" dur="1s" fill="freeze" begin="moveToRight1Forward.end+5s"/></text>
<text x="142" y="30" fill="#0d9488" font-size="20">y₄</text>
<text x="170" y="30" fill="#0d9488" font-size="20">+ <animate id="opacity1To0" attributeName="opacity" from="1" to="0" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate id="opacity0To1" attributeName="opacity" from="0" to="1" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></text>
<text x="190" y="30" fill="#e11d48" font-size="20">x₂ <animate id="moveToRight2Forward" attributeName="x" from="190" to="420" dur="1s" fill="freeze" begin="2s;moveToRight2Backward.end+5s"/><animate attributeName="y" from="30" to="110" dur="1s" fill="freeze" begin="2s;moveToRight2Backward.end+5s"/><animate id="moveToRight2Backward" attributeName="x" from="420" to="190" dur="1s" fill="freeze" begin="moveToRight2Forward.end+5s"/><animate attributeName="y" from="110" to="30" dur="1s" fill="freeze" begin="moveToRight2Forward.end+5s"/></text>
<text x="212" y="30" fill="#0d9488" font-size="20">y₃</text>
<text x="240" y="30" fill="#0d9488" font-size="20">+ <animate id="opacity1To0" attributeName="opacity" from="1" to="0" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate id="opacity0To1" attributeName="opacity" from="0" to="1" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></text>
<text x="260" y="30" fill="#e11d48" font-size="20">x₃ <animate id="moveToRight3Forward" attributeName="x" from="260" to="420" dur="1s" fill="freeze" begin="2s;moveToRight3Backward.end+5s"/><animate attributeName="y" from="30" to="150" dur="1s" fill="freeze" begin="2s;moveToRight3Backward.end+5s"/><animate id="moveToRight3Backward" attributeName="x" from="420" to="260" dur="1s" fill="freeze" begin="moveToRight3Forward.end+5s"/><animate attributeName="y" from="150" to="30" dur="1s" fill="freeze" begin="moveToRight3Forward.end+5s"/></text>
<text x="282" y="30" fill="#0d9488" font-size="20">y₂</text>
<text x="310" y="30" fill="#0d9488" font-size="20">+ <animate id="opacity1To0" attributeName="opacity" from="1" to="0" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate id="opacity0To1" attributeName="opacity" from="0" to="1" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></text>
<text x="330" y="30" fill="#e11d48" font-size="20">x₄ <animate id="moveToRight4Forward" attributeName="x" from="330" to="420" dur="1s" fill="freeze" begin="2s;moveToRight4Backward.end+5s"/><animate attributeName="y" from="30" to="190" dur="1s" fill="freeze" begin="2s;moveToRight4Backward.end+5s"/><animate id="moveToRight4Backward" attributeName="x" from="420" to="330" dur="1s" fill="freeze" begin="moveToRight4Forward.end+5s"/><animate attributeName="y" from="190" to="30" dur="1s" fill="freeze" begin="moveToRight4Forward.end+5s"/></text>
<text x="352" y="30" fill="#0d9488" font-size="20">y₁</text>
</g>
<g font-family="'JetBrains Mono', 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace">
<text x="10" y="70" fill="#0d9488" font-size="20">z₁=</text>
<text x="50" y="70" fill="#e11d48" font-size="20">x₀ <animate id="opacity1To0" attributeName="opacity" from="1" to="0" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate id="opacity0To1" attributeName="opacity" from="0" to="1" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></text>
<text x="72" y="70" fill="#0d9488" font-size="20">y₁</text>
<text x="100" y="70" fill="#0d9488" font-size="20">+ <animate id="opacity1To0" attributeName="opacity" from="1" to="0" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate id="opacity0To1" attributeName="opacity" from="0" to="1" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></text>
<text x="120" y="70" fill="#e11d48" font-size="20">x₁ <animate id="opacity1To0" attributeName="opacity" from="1" to="0" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate id="opacity0To1" attributeName="opacity" from="0" to="1" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></text>
<text x="142" y="70" fill="#0d9488" font-size="20">y₀</text>
<text x="170" y="70" fill="#0d9488" font-size="20">+ <animate id="opacity1To0" attributeName="opacity" from="1" to="0" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate id="opacity0To1" attributeName="opacity" from="0" to="1" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></text>
<text x="190" y="70" fill="#e11d48" font-size="20">x₂ <animate id="opacity1To0" attributeName="opacity" from="1" to="0" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate id="opacity0To1" attributeName="opacity" from="0" to="1" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></text>
<text x="212" y="70" fill="#0d9488" font-size="20">y₄</text>
<text x="240" y="70" fill="#0d9488" font-size="20">+ <animate id="opacity1To0" attributeName="opacity" from="1" to="0" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate id="opacity0To1" attributeName="opacity" from="0" to="1" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></text>
<text x="260" y="70" fill="#e11d48" font-size="20">x₃ <animate id="opacity1To0" attributeName="opacity" from="1" to="0" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate id="opacity0To1" attributeName="opacity" from="0" to="1" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></text>
<text x="282" y="70" fill="#0d9488" font-size="20">y₃</text>
<text x="310" y="70" fill="#0d9488" font-size="20">+ <animate id="opacity1To0" attributeName="opacity" from="1" to="0" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate id="opacity0To1" attributeName="opacity" from="0" to="1" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></text>
<text x="330" y="70" fill="#e11d48" font-size="20">x₄ <animate id="opacity1To0" attributeName="opacity" from="1" to="0" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate id="opacity0To1" attributeName="opacity" from="0" to="1" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></text>
<text x="352" y="70" fill="#0d9488" font-size="20">y₂</text>
</g>
<g font-family="'JetBrains Mono', 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace">
<text x="10" y="110" fill="#0d9488" font-size="20">z₂=</text>
<text x="50" y="110" fill="#e11d48" font-size="20">x₀ <animate id="opacity1To0" attributeName="opacity" from="1" to="0" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate id="opacity0To1" attributeName="opacity" from="0" to="1" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></text>
<text x="72" y="110" fill="#0d9488" font-size="20">y₂</text>
<text x="100" y="110" fill="#0d9488" font-size="20">+ <animate id="opacity1To0" attributeName="opacity" from="1" to="0" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate id="opacity0To1" attributeName="opacity" from="0" to="1" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></text>
<text x="120" y="110" fill="#e11d48" font-size="20">x₁ <animate id="opacity1To0" attributeName="opacity" from="1" to="0" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate id="opacity0To1" attributeName="opacity" from="0" to="1" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></text>
<text x="142" y="110" fill="#0d9488" font-size="20">y₁</text>
<text x="170" y="110" fill="#0d9488" font-size="20">+ <animate id="opacity1To0" attributeName="opacity" from="1" to="0" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate id="opacity0To1" attributeName="opacity" from="0" to="1" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></text>
<text x="190" y="110" fill="#e11d48" font-size="20">x₂ <animate id="opacity1To0" attributeName="opacity" from="1" to="0" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate id="opacity0To1" attributeName="opacity" from="0" to="1" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></text>
<text x="212" y="110" fill="#0d9488" font-size="20">y₀</text>
<text x="240" y="110" fill="#0d9488" font-size="20">+ <animate id="opacity1To0" attributeName="opacity" from="1" to="0" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate id="opacity0To1" attributeName="opacity" from="0" to="1" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></text>
<text x="260" y="110" fill="#e11d48" font-size="20">x₃ <animate id="opacity1To0" attributeName="opacity" from="1" to="0" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate id="opacity0To1" attributeName="opacity" from="0" to="1" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></text>
<text x="282" y="110" fill="#0d9488" font-size="20">y₄</text>
<text x="310" y="110" fill="#0d9488" font-size="20">+ <animate id="opacity1To0" attributeName="opacity" from="1" to="0" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate id="opacity0To1" attributeName="opacity" from="0" to="1" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></text>
<text x="330" y="110" fill="#e11d48" font-size="20">x₄ <animate id="opacity1To0" attributeName="opacity" from="1" to="0" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate id="opacity0To1" attributeName="opacity" from="0" to="1" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></text>
<text x="352" y="110" fill="#0d9488" font-size="20">y₃</text>
</g>
<g font-family="'JetBrains Mono', 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace">
<text x="10" y="150" fill="#0d9488" font-size="20">z₃=</text>
<text x="50" y="150" fill="#e11d48" font-size="20">x₀ <animate id="opacity1To0" attributeName="opacity" from="1" to="0" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate id="opacity0To1" attributeName="opacity" from="0" to="1" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></text>
<text x="72" y="150" fill="#0d9488" font-size="20">y₃</text>
<text x="100" y="150" fill="#0d9488" font-size="20">+ <animate id="opacity1To0" attributeName="opacity" from="1" to="0" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate id="opacity0To1" attributeName="opacity" from="0" to="1" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></text>
<text x="120" y="150" fill="#e11d48" font-size="20">x₁ <animate id="opacity1To0" attributeName="opacity" from="1" to="0" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate id="opacity0To1" attributeName="opacity" from="0" to="1" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></text>
<text x="142" y="150" fill="#0d9488" font-size="20">y₂</text>
<text x="170" y="150" fill="#0d9488" font-size="20">+ <animate id="opacity1To0" attributeName="opacity" from="1" to="0" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate id="opacity0To1" attributeName="opacity" from="0" to="1" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></text>
<text x="190" y="150" fill="#e11d48" font-size="20">x₂ <animate id="opacity1To0" attributeName="opacity" from="1" to="0" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate id="opacity0To1" attributeName="opacity" from="0" to="1" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></text>
<text x="212" y="150" fill="#0d9488" font-size="20">y₁</text>
<text x="240" y="150" fill="#0d9488" font-size="20">+ <animate id="opacity1To0" attributeName="opacity" from="1" to="0" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate id="opacity0To1" attributeName="opacity" from="0" to="1" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></text>
<text x="260" y="150" fill="#e11d48" font-size="20">x₃ <animate id="opacity1To0" attributeName="opacity" from="1" to="0" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate id="opacity0To1" attributeName="opacity" from="0" to="1" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></text>
<text x="282" y="150" fill="#0d9488" font-size="20">y₀</text>
<text x="310" y="150" fill="#0d9488" font-size="20">+ <animate id="opacity1To0" attributeName="opacity" from="1" to="0" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate id="opacity0To1" attributeName="opacity" from="0" to="1" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></text>
<text x="330" y="150" fill="#e11d48" font-size="20">x₄ <animate id="opacity1To0" attributeName="opacity" from="1" to="0" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate id="opacity0To1" attributeName="opacity" from="0" to="1" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></text>
<text x="352" y="150" fill="#0d9488" font-size="20">y₄</text>
</g>
<g font-family="'JetBrains Mono', 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace">
<text x="10" y="190" fill="#0d9488" font-size="20">z₄=</text>
<text x="50" y="190" fill="#e11d48" font-size="20">x₀ <animate id="opacity1To0" attributeName="opacity" from="1" to="0" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate id="opacity0To1" attributeName="opacity" from="0" to="1" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></text>
<text x="72" y="190" fill="#0d9488" font-size="20">y₄</text>
<text x="100" y="190" fill="#0d9488" font-size="20">+ <animate id="opacity1To0" attributeName="opacity" from="1" to="0" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate id="opacity0To1" attributeName="opacity" from="0" to="1" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></text>
<text x="120" y="190" fill="#e11d48" font-size="20">x₁ <animate id="opacity1To0" attributeName="opacity" from="1" to="0" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate id="opacity0To1" attributeName="opacity" from="0" to="1" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></text>
<text x="142" y="190" fill="#0d9488" font-size="20">y₃</text>
<text x="170" y="190" fill="#0d9488" font-size="20">+ <animate id="opacity1To0" attributeName="opacity" from="1" to="0" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate id="opacity0To1" attributeName="opacity" from="0" to="1" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></text>
<text x="190" y="190" fill="#e11d48" font-size="20">x₂ <animate id="opacity1To0" attributeName="opacity" from="1" to="0" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate id="opacity0To1" attributeName="opacity" from="0" to="1" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></text>
<text x="212" y="190" fill="#0d9488" font-size="20">y₂</text>
<text x="240" y="190" fill="#0d9488" font-size="20">+ <animate id="opacity1To0" attributeName="opacity" from="1" to="0" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate id="opacity0To1" attributeName="opacity" from="0" to="1" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></text>
<text x="260" y="190" fill="#e11d48" font-size="20">x₃ <animate id="opacity1To0" attributeName="opacity" from="1" to="0" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate id="opacity0To1" attributeName="opacity" from="0" to="1" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></text>
<text x="282" y="190" fill="#0d9488" font-size="20">y₁</text>
<text x="310" y="190" fill="#0d9488" font-size="20">+ <animate id="opacity1To0" attributeName="opacity" from="1" to="0" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate id="opacity0To1" attributeName="opacity" from="0" to="1" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></text>
<text x="330" y="190" fill="#e11d48" font-size="20">x₄ <animate id="opacity1To0" attributeName="opacity" from="1" to="0" dur="1s" begin="2s;opacity0To1.end+5s" fill="freeze"/><animate id="opacity0To1" attributeName="opacity" from="0" to="1" dur="1s" begin="opacity1To0.end+5s" fill="freeze"/></text>
<text x="352" y="190" fill="#0d9488" font-size="20">y₀</text>
</g>
</svg>
</div>

Its connection with circular convolution $c_{\textcolor{#e11d48}{k}} = \sum_{i=0}^{n-1} a_{\textcolor{#e11d48}{i}}b_{\textcolor{#e11d48}{k-i}}$ is what makes it interesting: each output $z_k$ is a sum of products $x_i y_j$ where the indices wrap around cyclically.

---

## 0. Cyclic permutation matrix

The following matrix is a 5x5 cyclic permutation matrix:

$$\begin{bmatrix} 0 & 0 & 0 & 0 & 1 \\ 1 & 0 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 & 0 \\ 0 & 0 & 1 & 0 & 0 \\ 0 & 0 & 0 & 1 & 0 \end{bmatrix}$$

The corresponding permutation only has one cycle of order 5: $(1 \rightarrow 2 \rightarrow 3 \rightarrow 4 \rightarrow 5)$. Thus its eigenvalues are the 5th roots of unity $\lambda, \lambda^2, \lambda^3, \lambda^4, \lambda^5 = 1$ where $\lambda = e^{2\pi i / 5}$. For a reason that will become clear shortly, we order the eigenvalues like so: $1, \lambda, \lambda^2, \lambda^3, \lambda^4$.

The (unnormalized) eigenvector corresponding to the eigenvalue $\lambda$ is $\begin{bmatrix} 1 & \lambda & \lambda^2 & \lambda^3 & \lambda^4 \end{bmatrix}$. The rest of the eigenvectors can be formed by replacing $\lambda$ with $\lambda^k$ for different values of $k$. The matrix of all (normalized) eigenvectors looks like:

$$V = \frac{1}{\sqrt{5}} \begin{bmatrix} 1 & 1 & 1 & 1 & 1 \\ 1 & \lambda & \lambda^2 & \lambda^3 & \lambda^4 \\ 1 & \lambda^2 & \lambda^4 & \lambda & \lambda^3 \\ 1 & \lambda^3 & \lambda & \lambda^4 & \lambda^2 \\ 1 & \lambda^4 & \lambda^3 & \lambda^2 & \lambda \end{bmatrix}$$

This is the 5x5 [DFT matrix](https://en.wikipedia.org/wiki/DFT_matrix). Thus the eigenvectors of the permutation matrix are the columns of the DFT matrix. We can generalize this to any size of the cyclic permutation matrix.

> The eigenvectors of a cyclic `n x n` permutation matrix are the columns of the `n x n` DFT matrix. The eigenvalues are the `n`th roots of unity.

---

### 0.1. Spectral properties of any circulant matrix

Now here is a fun fact: any circulant matrix has the same eigenvectors as its corresponding cyclic permutation matrix. It is based on two insights:

> 1. $Ax = \lambda x \Rightarrow \underbrace{\textcolor{#b45309}{p(A)x = p(\lambda)x}}_{\textcolor{#b45309}{\text{polynomial function of A has the same eigenvectors}}}$
>
> 2. A circulant matrix is a polynomial function of cyclic permutation matrices.

The first point can be verified by simply expanding the polynomial. An example of the second point is the following:

$$\begin{bmatrix} a & b & c \\ c & a & b \\ b & c & a \end{bmatrix} = a\begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix} + b\begin{bmatrix} 0 & 1 & 0 \\ 0 & 0 & 1 \\ 1 & 0 & 0 \end{bmatrix} + c\begin{bmatrix} 0 & 0 & 1 \\ 1 & 0 & 0 \\ 0 & 1 & 0 \end{bmatrix}$$

which is equal to $p(A) = aI + bA + cA^2$ where $A$ is the matrix for the cyclic permutation `1,2,3 → 3,1,2`. Thus the eigenvalues of the above circulant matrix are $p(\lambda) = a + b\lambda + c\lambda^2$ for each root of unity $\lambda$.

---

## 1. Connection with the convolution theorem

If $F$ is the DFT matrix and $D$ is the diagonal matrix of eigenvalues of the cyclic permutation matrix, then the eigendecomposition of the permutation matrix is $P = FDF^{-1}$. In the code below, the cyclic matrix is reconstructed using an eigendecomposition product of a DFT matrix and a diagonal matrix of roots of unity:

#### Verification using Python

```python
import torch
P5 = torch.Tensor([
    [0,0,0,0,1],
    [1,0,0,0,0],
    [0,1,0,0,0],
    [0,0,1,0,0],
    [0,0,0,1,0],
])
F = torch.fft.fft(torch.eye(5)).div(5**0.5)  # DFT matrix
D = torch.arange(5).mul(2 * torch.pi * 1j).div(5).exp().diag()  # Diagonal matrix of roots of unity

P5_reconstructed = F @ D @ F.conj()
print(P5_reconstructed.imag.norm())
print((P5_reconstructed.real - P5).norm())

### Output: ###
tensor(2.0843e-07)  # Imaginary part is very close to zero
tensor(2.1113e-07)  # Real part is very close to the original matrix
```

---

### 1.1. Convolution theorem

The convolution theorem states that the Fourier transform of the convolution of two functions is the product of their Fourier transforms. Mathematically, it can be written as:

$$\mathcal{F}(f * g) = \mathcal{F}(f) \cdot \mathcal{F}(g)$$

Now we look at how it is connected to the eigendecomposition of a circulant matrix $C$. The convolution $Cx$ is the same as the matrix multiplication $FDF^{-1}x$ which can be interpreted like so:

$$Cx = \underbrace{F \underbrace{D \underbrace{F^{-1}x}_{\textcolor{#b45309}{\text{x in Fourier basis}}}}_{\textcolor{#e11d48}{\text{element-wise product}}}}_{\text{x in original basis}}$$

> What's convolution in one domain is a product in another domain. Equivalently: what's a matrix-vector product in one basis is an elementwise product in another basis.

In the next section we will look at the geometry of an object whose vertices are these permutation matrices.

---

[← Permutation spectra](/series/permutation_sinkhorn/1_permutation_spectra)  ·  [Birkhoff polytope →](/series/permutation_sinkhorn/3_birkhoff_polytope)
