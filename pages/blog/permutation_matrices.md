---
title: Permutation matrices - from shuffle to symmetry
---

# Permutation matrices - from shuffle to symmetry

$$\begin{bmatrix} v_1 \\ \textcolor{#b45309}{v_2} \\ \textcolor{#e11d48}{v_3} \\ {v_4} \end{bmatrix} \mathrel{ \overset{P} {\underset{P^T} {\substack{\longrightarrow \\[-0.3em] \longleftarrow}} }} \begin{bmatrix} \textcolor{#b45309}{v_2} \\ {v_4} \\ v_1 \\ \textcolor{#e11d48}{v_3} \end{bmatrix}$$

A permutation matrix simply permutes (or shuffles) the elements of the input vector it is multiplied with. When it is multiplied with a matrix, it shuffles the rows or columns of the matrix. This seemingly naive operation leads to some interesting observations, especially in conjunction with other operations like transpose or inverse. This article explores some elementary yet interesting properties of this class of matrices.

---

## Shuffling columns and rows of a matrix

<div style="display: flex; justify-content: center; margin: 1.5rem 0; overflow-x: auto;">
<svg width="550" height="150" viewBox="0 0 550 150" xmlns="http://www.w3.org/2000/svg">
<g id="staticGroup">
<g><rect x="0" y="0" width="30" height="30" fill="rgb(0,0,30)" opacity="0.8" /><text x="15" y="15" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">0,0</text></g>
<g><rect x="30" y="0" width="30" height="30" fill="rgb(51,0,30)" opacity="0.8" /><text x="45" y="15" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">0,1</text></g>
<g><rect x="60" y="0" width="30" height="30" fill="rgb(102,0,30)" opacity="0.8" /><text x="75" y="15" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">0,2</text></g>
<g><rect x="90" y="0" width="30" height="30" fill="rgb(153,0,30)" opacity="0.8" /><text x="105" y="15" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">0,3</text></g>
<g><rect x="120" y="0" width="30" height="30" fill="rgb(204,0,30)" opacity="0.8" /><text x="135" y="15" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">0,4</text></g>
<g><rect x="0" y="30" width="30" height="30" fill="rgb(0,51,30)" opacity="0.8" /><text x="15" y="45" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">1,0</text></g>
<g><rect x="30" y="30" width="30" height="30" fill="rgb(51,51,30)" opacity="0.8" /><text x="45" y="45" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">1,1</text></g>
<g><rect x="60" y="30" width="30" height="30" fill="rgb(102,51,30)" opacity="0.8" /><text x="75" y="45" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">1,2</text></g>
<g><rect x="90" y="30" width="30" height="30" fill="rgb(153,51,30)" opacity="0.8" /><text x="105" y="45" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">1,3</text></g>
<g><rect x="120" y="30" width="30" height="30" fill="rgb(204,51,30)" opacity="0.8" /><text x="135" y="45" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">1,4</text></g>
<g><rect x="0" y="60" width="30" height="30" fill="rgb(0,102,30)" opacity="0.8" /><text x="15" y="75" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">2,0</text></g>
<g><rect x="30" y="60" width="30" height="30" fill="rgb(51,102,30)" opacity="0.8" /><text x="45" y="75" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">2,1</text></g>
<g><rect x="60" y="60" width="30" height="30" fill="rgb(102,102,30)" opacity="0.8" /><text x="75" y="75" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">2,2</text></g>
<g><rect x="90" y="60" width="30" height="30" fill="rgb(153,102,30)" opacity="0.8" /><text x="105" y="75" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">2,3</text></g>
<g><rect x="120" y="60" width="30" height="30" fill="rgb(204,102,30)" opacity="0.8" /><text x="135" y="75" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">2,4</text></g>
<g><rect x="0" y="90" width="30" height="30" fill="rgb(0,153,30)" opacity="0.8" /><text x="15" y="105" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">3,0</text></g>
<g><rect x="30" y="90" width="30" height="30" fill="rgb(51,153,30)" opacity="0.8" /><text x="45" y="105" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">3,1</text></g>
<g><rect x="60" y="90" width="30" height="30" fill="rgb(102,153,30)" opacity="0.8" /><text x="75" y="105" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">3,2</text></g>
<g><rect x="90" y="90" width="30" height="30" fill="rgb(153,153,30)" opacity="0.8" /><text x="105" y="105" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">3,3</text></g>
<g><rect x="120" y="90" width="30" height="30" fill="rgb(204,153,30)" opacity="0.8" /><text x="135" y="105" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">3,4</text></g>
<g><rect x="0" y="120" width="30" height="30" fill="rgb(0,204,30)" opacity="0.8" /><text x="15" y="135" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">4,0</text></g>
<g><rect x="30" y="120" width="30" height="30" fill="rgb(51,204,30)" opacity="0.8" /><text x="45" y="135" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">4,1</text></g>
<g><rect x="60" y="120" width="30" height="30" fill="rgb(102,204,30)" opacity="0.8" /><text x="75" y="135" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">4,2</text></g>
<g><rect x="90" y="120" width="30" height="30" fill="rgb(153,204,30)" opacity="0.8" /><text x="105" y="135" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">4,3</text></g>
<g><rect x="120" y="120" width="30" height="30" fill="rgb(204,204,30)" opacity="0.8" /><text x="135" y="135" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">4,4</text></g>
<animateTransform id="swapStaticFwd" attributeName="transform" type="translate" from="0 0" to="160 0" dur="2s" begin="colShuffleBack_block_0_0.end + 0.5s" fill="freeze" />
<animateTransform id="swapStaticBack" attributeName="transform" type="translate" from="160 0" to="0 0" dur="2s" begin="rowShuffleBack_block_0_0.end + 0.5s" fill="freeze" />
</g>
<g id="permGroup" transform="translate(160 0)">
<rect x="0" y="0" width="30" height="30" fill="#f4f4f5" stroke="gray" />
<rect x="30" y="0" width="30" height="30" fill="#f4f4f5" stroke="gray" />
<rect x="60" y="0" width="30" height="30" fill="#27272a" stroke="gray" />
<rect x="90" y="0" width="30" height="30" fill="#f4f4f5" stroke="gray" />
<rect x="120" y="0" width="30" height="30" fill="#f4f4f5" stroke="gray" />
<rect x="0" y="30" width="30" height="30" fill="#27272a" stroke="gray" />
<rect x="30" y="30" width="30" height="30" fill="#f4f4f5" stroke="gray" />
<rect x="60" y="30" width="30" height="30" fill="#f4f4f5" stroke="gray" />
<rect x="90" y="30" width="30" height="30" fill="#f4f4f5" stroke="gray" />
<rect x="120" y="30" width="30" height="30" fill="#f4f4f5" stroke="gray" />
<rect x="0" y="60" width="30" height="30" fill="#f4f4f5" stroke="gray" />
<rect x="30" y="60" width="30" height="30" fill="#f4f4f5" stroke="gray" />
<rect x="60" y="60" width="30" height="30" fill="#f4f4f5" stroke="gray" />
<rect x="90" y="60" width="30" height="30" fill="#f4f4f5" stroke="gray" />
<rect x="120" y="60" width="30" height="30" fill="#27272a" stroke="gray" />
<rect x="0" y="90" width="30" height="30" fill="#f4f4f5" stroke="gray" />
<rect x="30" y="90" width="30" height="30" fill="#27272a" stroke="gray" />
<rect x="60" y="90" width="30" height="30" fill="#f4f4f5" stroke="gray" />
<rect x="90" y="90" width="30" height="30" fill="#f4f4f5" stroke="gray" />
<rect x="120" y="90" width="30" height="30" fill="#f4f4f5" stroke="gray" />
<rect x="0" y="120" width="30" height="30" fill="#f4f4f5" stroke="gray" />
<rect x="30" y="120" width="30" height="30" fill="#f4f4f5" stroke="gray" />
<rect x="60" y="120" width="30" height="30" fill="#f4f4f5" stroke="gray" />
<rect x="90" y="120" width="30" height="30" fill="#27272a" stroke="gray" />
<rect x="120" y="120" width="30" height="30" fill="#f4f4f5" stroke="gray" />
<animateTransform id="swapPermFwd" attributeName="transform" type="translate" from="160 0" to="0 0" dur="2s" begin="colShuffleBack_block_0_0.end + 0.5s" fill="freeze" />
<animateTransform id="swapPermBack" attributeName="transform" type="translate" from="0 0" to="160 0" dur="2s" begin="rowShuffleBack_block_0_0.end + 0.5s" fill="freeze" />
</g>
<text x="335" y="75" text-anchor="middle" dominant-baseline="middle" font-size="24" fill="#27272a">=</text>
<g transform="translate(360 0)"><rect x="0" y="0" width="30" height="30" fill="rgb(0,0,30)" opacity="0.8" /><text x="15" y="15" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">0,0</text>
<animateMotion id="pauseStart_block_0_0" dur="1s" path="M0,0" begin="0s;swapPermBack.end + 0.5s" />
<animateMotion id="colShuffleFwd_block_0_0" dur="2s" path="M0,0 L60,0" begin="pauseStart_block_0_0.end" />
<animateMotion id="pauseCol_block_0_0" dur="1s" path="M60,0" begin="colShuffleFwd_block_0_0.end" />
<animateMotion id="colShuffleBack_block_0_0" dur="2s" path="M60,0 L0,0" begin="pauseCol_block_0_0.end" />
<animateMotion id="pauseMid_block_0_0" dur="1s" path="M0,0" begin="swapPermFwd.end + 0.5s" />
<animateMotion id="rowShuffleFwd_block_0_0" dur="2s" path="M0,0 L0,30" begin="pauseMid_block_0_0.end" />
<animateMotion id="pauseRow_block_0_0" dur="1s" path="M0,30" begin="rowShuffleFwd_block_0_0.end" />
<animateMotion id="rowShuffleBack_block_0_0" dur="2s" path="M0,30 L0,0" begin="pauseRow_block_0_0.end" /></g>
<g transform="translate(360 0)"><rect x="30" y="0" width="30" height="30" fill="rgb(51,0,30)" opacity="0.8" /><text x="45" y="15" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">0,1</text>
<animateMotion dur="1s" path="M0,0" begin="0s;swapPermBack.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L-30,0" begin="pauseStart_block_0_0.end" />
<animateMotion dur="1s" path="M-30,0" begin="colShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M-30,0 L0,0" begin="pauseCol_block_0_0.end" />
<animateMotion dur="1s" path="M0,0" begin="swapPermFwd.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L0,30" begin="pauseMid_block_0_0.end" />
<animateMotion dur="1s" path="M0,30" begin="rowShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M0,30 L0,0" begin="pauseRow_block_0_0.end" /></g>
<g transform="translate(360 0)"><rect x="60" y="0" width="30" height="30" fill="rgb(102,0,30)" opacity="0.8" /><text x="75" y="15" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">0,2</text>
<animateMotion dur="1s" path="M0,0" begin="0s;swapPermBack.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L60,0" begin="pauseStart_block_0_0.end" />
<animateMotion dur="1s" path="M60,0" begin="colShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M60,0 L0,0" begin="pauseCol_block_0_0.end" />
<animateMotion dur="1s" path="M0,0" begin="swapPermFwd.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L0,30" begin="pauseMid_block_0_0.end" />
<animateMotion dur="1s" path="M0,30" begin="rowShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M0,30 L0,0" begin="pauseRow_block_0_0.end" /></g>
<g transform="translate(360 0)"><rect x="90" y="0" width="30" height="30" fill="rgb(153,0,30)" opacity="0.8" /><text x="105" y="15" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">0,3</text>
<animateMotion dur="1s" path="M0,0" begin="0s;swapPermBack.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L-60,0" begin="pauseStart_block_0_0.end" />
<animateMotion dur="1s" path="M-60,0" begin="colShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M-60,0 L0,0" begin="pauseCol_block_0_0.end" />
<animateMotion dur="1s" path="M0,0" begin="swapPermFwd.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L0,30" begin="pauseMid_block_0_0.end" />
<animateMotion dur="1s" path="M0,30" begin="rowShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M0,30 L0,0" begin="pauseRow_block_0_0.end" /></g>
<g transform="translate(360 0)"><rect x="120" y="0" width="30" height="30" fill="rgb(204,0,30)" opacity="0.8" /><text x="135" y="15" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">0,4</text>
<animateMotion dur="1s" path="M0,0" begin="0s;swapPermBack.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L-30,0" begin="pauseStart_block_0_0.end" />
<animateMotion dur="1s" path="M-30,0" begin="colShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M-30,0 L0,0" begin="pauseCol_block_0_0.end" />
<animateMotion dur="1s" path="M0,0" begin="swapPermFwd.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L0,30" begin="pauseMid_block_0_0.end" />
<animateMotion dur="1s" path="M0,30" begin="rowShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M0,30 L0,0" begin="pauseRow_block_0_0.end" /></g>
<g transform="translate(360 0)"><rect x="0" y="30" width="30" height="30" fill="rgb(0,51,30)" opacity="0.8" /><text x="15" y="45" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">1,0</text>
<animateMotion dur="1s" path="M0,0" begin="0s;swapPermBack.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L60,0" begin="pauseStart_block_0_0.end" />
<animateMotion dur="1s" path="M60,0" begin="colShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M60,0 L0,0" begin="pauseCol_block_0_0.end" />
<animateMotion dur="1s" path="M0,0" begin="swapPermFwd.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L0,60" begin="pauseMid_block_0_0.end" />
<animateMotion dur="1s" path="M0,60" begin="rowShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M0,60 L0,0" begin="pauseRow_block_0_0.end" /></g>
<g transform="translate(360 0)"><rect x="30" y="30" width="30" height="30" fill="rgb(51,51,30)" opacity="0.8" /><text x="45" y="45" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">1,1</text>
<animateMotion dur="1s" path="M0,0" begin="0s;swapPermBack.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L-30,0" begin="pauseStart_block_0_0.end" />
<animateMotion dur="1s" path="M-30,0" begin="colShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M-30,0 L0,0" begin="pauseCol_block_0_0.end" />
<animateMotion dur="1s" path="M0,0" begin="swapPermFwd.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L0,60" begin="pauseMid_block_0_0.end" />
<animateMotion dur="1s" path="M0,60" begin="rowShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M0,60 L0,0" begin="pauseRow_block_0_0.end" /></g>
<g transform="translate(360 0)"><rect x="60" y="30" width="30" height="30" fill="rgb(102,51,30)" opacity="0.8" /><text x="75" y="45" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">1,2</text>
<animateMotion dur="1s" path="M0,0" begin="0s;swapPermBack.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L60,0" begin="pauseStart_block_0_0.end" />
<animateMotion dur="1s" path="M60,0" begin="colShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M60,0 L0,0" begin="pauseCol_block_0_0.end" />
<animateMotion dur="1s" path="M0,0" begin="swapPermFwd.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L0,60" begin="pauseMid_block_0_0.end" />
<animateMotion dur="1s" path="M0,60" begin="rowShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M0,60 L0,0" begin="pauseRow_block_0_0.end" /></g>
<g transform="translate(360 0)"><rect x="90" y="30" width="30" height="30" fill="rgb(153,51,30)" opacity="0.8" /><text x="105" y="45" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">1,3</text>
<animateMotion dur="1s" path="M0,0" begin="0s;swapPermBack.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L-60,0" begin="pauseStart_block_0_0.end" />
<animateMotion dur="1s" path="M-60,0" begin="colShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M-60,0 L0,0" begin="pauseCol_block_0_0.end" />
<animateMotion dur="1s" path="M0,0" begin="swapPermFwd.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L0,60" begin="pauseMid_block_0_0.end" />
<animateMotion dur="1s" path="M0,60" begin="rowShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M0,60 L0,0" begin="pauseRow_block_0_0.end" /></g>
<g transform="translate(360 0)"><rect x="120" y="30" width="30" height="30" fill="rgb(204,51,30)" opacity="0.8" /><text x="135" y="45" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">1,4</text>
<animateMotion dur="1s" path="M0,0" begin="0s;swapPermBack.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L-30,0" begin="pauseStart_block_0_0.end" />
<animateMotion dur="1s" path="M-30,0" begin="colShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M-30,0 L0,0" begin="pauseCol_block_0_0.end" />
<animateMotion dur="1s" path="M0,0" begin="swapPermFwd.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L0,60" begin="pauseMid_block_0_0.end" />
<animateMotion dur="1s" path="M0,60" begin="rowShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M0,60 L0,0" begin="pauseRow_block_0_0.end" /></g>
<g transform="translate(360 0)"><rect x="0" y="60" width="30" height="30" fill="rgb(0,102,30)" opacity="0.8" /><text x="15" y="75" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">2,0</text>
<animateMotion dur="1s" path="M0,0" begin="0s;swapPermBack.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L60,0" begin="pauseStart_block_0_0.end" />
<animateMotion dur="1s" path="M60,0" begin="colShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M60,0 L0,0" begin="pauseCol_block_0_0.end" />
<animateMotion dur="1s" path="M0,0" begin="swapPermFwd.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L0,-60" begin="pauseMid_block_0_0.end" />
<animateMotion dur="1s" path="M0,-60" begin="rowShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M0,-60 L0,0" begin="pauseRow_block_0_0.end" /></g>
<g transform="translate(360 0)"><rect x="30" y="60" width="30" height="30" fill="rgb(51,102,30)" opacity="0.8" /><text x="45" y="75" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">2,1</text>
<animateMotion dur="1s" path="M0,0" begin="0s;swapPermBack.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L-30,0" begin="pauseStart_block_0_0.end" />
<animateMotion dur="1s" path="M-30,0" begin="colShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M-30,0 L0,0" begin="pauseCol_block_0_0.end" />
<animateMotion dur="1s" path="M0,0" begin="swapPermFwd.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L0,-60" begin="pauseMid_block_0_0.end" />
<animateMotion dur="1s" path="M0,-60" begin="rowShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M0,-60 L0,0" begin="pauseRow_block_0_0.end" /></g>
<g transform="translate(360 0)"><rect x="60" y="60" width="30" height="30" fill="rgb(102,102,30)" opacity="0.8" /><text x="75" y="75" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">2,2</text>
<animateMotion dur="1s" path="M0,0" begin="0s;swapPermBack.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L60,0" begin="pauseStart_block_0_0.end" />
<animateMotion dur="1s" path="M60,0" begin="colShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M60,0 L0,0" begin="pauseCol_block_0_0.end" />
<animateMotion dur="1s" path="M0,0" begin="swapPermFwd.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L0,-60" begin="pauseMid_block_0_0.end" />
<animateMotion dur="1s" path="M0,-60" begin="rowShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M0,-60 L0,0" begin="pauseRow_block_0_0.end" /></g>
<g transform="translate(360 0)"><rect x="90" y="60" width="30" height="30" fill="rgb(153,102,30)" opacity="0.8" /><text x="105" y="75" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">2,3</text>
<animateMotion dur="1s" path="M0,0" begin="0s;swapPermBack.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L-60,0" begin="pauseStart_block_0_0.end" />
<animateMotion dur="1s" path="M-60,0" begin="colShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M-60,0 L0,0" begin="pauseCol_block_0_0.end" />
<animateMotion dur="1s" path="M0,0" begin="swapPermFwd.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L0,-60" begin="pauseMid_block_0_0.end" />
<animateMotion dur="1s" path="M0,-60" begin="rowShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M0,-60 L0,0" begin="pauseRow_block_0_0.end" /></g>
<g transform="translate(360 0)"><rect x="120" y="60" width="30" height="30" fill="rgb(204,102,30)" opacity="0.8" /><text x="135" y="75" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">2,4</text>
<animateMotion dur="1s" path="M0,0" begin="0s;swapPermBack.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L-30,0" begin="pauseStart_block_0_0.end" />
<animateMotion dur="1s" path="M-30,0" begin="colShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M-30,0 L0,0" begin="pauseCol_block_0_0.end" />
<animateMotion dur="1s" path="M0,0" begin="swapPermFwd.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L0,-60" begin="pauseMid_block_0_0.end" />
<animateMotion dur="1s" path="M0,-60" begin="rowShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M0,-60 L0,0" begin="pauseRow_block_0_0.end" /></g>
<g transform="translate(360 0)"><rect x="0" y="90" width="30" height="30" fill="rgb(0,153,30)" opacity="0.8" /><text x="15" y="105" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">3,0</text>
<animateMotion dur="1s" path="M0,0" begin="0s;swapPermBack.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L60,0" begin="pauseStart_block_0_0.end" />
<animateMotion dur="1s" path="M60,0" begin="colShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M60,0 L0,0" begin="pauseCol_block_0_0.end" />
<animateMotion dur="1s" path="M0,0" begin="swapPermFwd.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L0,30" begin="pauseMid_block_0_0.end" />
<animateMotion dur="1s" path="M0,30" begin="rowShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M0,30 L0,0" begin="pauseRow_block_0_0.end" /></g>
<g transform="translate(360 0)"><rect x="30" y="90" width="30" height="30" fill="rgb(51,153,30)" opacity="0.8" /><text x="45" y="105" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">3,1</text>
<animateMotion dur="1s" path="M0,0" begin="0s;swapPermBack.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L-30,0" begin="pauseStart_block_0_0.end" />
<animateMotion dur="1s" path="M-30,0" begin="colShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M-30,0 L0,0" begin="pauseCol_block_0_0.end" />
<animateMotion dur="1s" path="M0,0" begin="swapPermFwd.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L0,30" begin="pauseMid_block_0_0.end" />
<animateMotion dur="1s" path="M0,30" begin="rowShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M0,30 L0,0" begin="pauseRow_block_0_0.end" /></g>
<g transform="translate(360 0)"><rect x="60" y="90" width="30" height="30" fill="rgb(102,153,30)" opacity="0.8" /><text x="75" y="105" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">3,2</text>
<animateMotion dur="1s" path="M0,0" begin="0s;swapPermBack.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L60,0" begin="pauseStart_block_0_0.end" />
<animateMotion dur="1s" path="M60,0" begin="colShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M60,0 L0,0" begin="pauseCol_block_0_0.end" />
<animateMotion dur="1s" path="M0,0" begin="swapPermFwd.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L0,30" begin="pauseMid_block_0_0.end" />
<animateMotion dur="1s" path="M0,30" begin="rowShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M0,30 L0,0" begin="pauseRow_block_0_0.end" /></g>
<g transform="translate(360 0)"><rect x="90" y="90" width="30" height="30" fill="rgb(153,153,30)" opacity="0.8" /><text x="105" y="105" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">3,3</text>
<animateMotion dur="1s" path="M0,0" begin="0s;swapPermBack.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L-60,0" begin="pauseStart_block_0_0.end" />
<animateMotion dur="1s" path="M-60,0" begin="colShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M-60,0 L0,0" begin="pauseCol_block_0_0.end" />
<animateMotion dur="1s" path="M0,0" begin="swapPermFwd.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L0,30" begin="pauseMid_block_0_0.end" />
<animateMotion dur="1s" path="M0,30" begin="rowShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M0,30 L0,0" begin="pauseRow_block_0_0.end" /></g>
<g transform="translate(360 0)"><rect x="120" y="90" width="30" height="30" fill="rgb(204,153,30)" opacity="0.8" /><text x="135" y="105" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">3,4</text>
<animateMotion dur="1s" path="M0,0" begin="0s;swapPermBack.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L-30,0" begin="pauseStart_block_0_0.end" />
<animateMotion dur="1s" path="M-30,0" begin="colShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M-30,0 L0,0" begin="pauseCol_block_0_0.end" />
<animateMotion dur="1s" path="M0,0" begin="swapPermFwd.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L0,30" begin="pauseMid_block_0_0.end" />
<animateMotion dur="1s" path="M0,30" begin="rowShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M0,30 L0,0" begin="pauseRow_block_0_0.end" /></g>
<g transform="translate(360 0)"><rect x="0" y="120" width="30" height="30" fill="rgb(0,204,30)" opacity="0.8" /><text x="15" y="135" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">4,0</text>
<animateMotion dur="1s" path="M0,0" begin="0s;swapPermBack.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L60,0" begin="pauseStart_block_0_0.end" />
<animateMotion dur="1s" path="M60,0" begin="colShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M60,0 L0,0" begin="pauseCol_block_0_0.end" />
<animateMotion dur="1s" path="M0,0" begin="swapPermFwd.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L0,-60" begin="pauseMid_block_0_0.end" />
<animateMotion dur="1s" path="M0,-60" begin="rowShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M0,-60 L0,0" begin="pauseRow_block_0_0.end" /></g>
<g transform="translate(360 0)"><rect x="30" y="120" width="30" height="30" fill="rgb(51,204,30)" opacity="0.8" /><text x="45" y="135" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">4,1</text>
<animateMotion dur="1s" path="M0,0" begin="0s;swapPermBack.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L-30,0" begin="pauseStart_block_0_0.end" />
<animateMotion dur="1s" path="M-30,0" begin="colShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M-30,0 L0,0" begin="pauseCol_block_0_0.end" />
<animateMotion dur="1s" path="M0,0" begin="swapPermFwd.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L0,-60" begin="pauseMid_block_0_0.end" />
<animateMotion dur="1s" path="M0,-60" begin="rowShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M0,-60 L0,0" begin="pauseRow_block_0_0.end" /></g>
<g transform="translate(360 0)"><rect x="60" y="120" width="30" height="30" fill="rgb(102,204,30)" opacity="0.8" /><text x="75" y="135" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">4,2</text>
<animateMotion dur="1s" path="M0,0" begin="0s;swapPermBack.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L60,0" begin="pauseStart_block_0_0.end" />
<animateMotion dur="1s" path="M60,0" begin="colShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M60,0 L0,0" begin="pauseCol_block_0_0.end" />
<animateMotion dur="1s" path="M0,0" begin="swapPermFwd.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L0,-60" begin="pauseMid_block_0_0.end" />
<animateMotion dur="1s" path="M0,-60" begin="rowShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M0,-60 L0,0" begin="pauseRow_block_0_0.end" /></g>
<g transform="translate(360 0)"><rect x="90" y="120" width="30" height="30" fill="rgb(153,204,30)" opacity="0.8" /><text x="105" y="135" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">4,3</text>
<animateMotion dur="1s" path="M0,0" begin="0s;swapPermBack.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L-60,0" begin="pauseStart_block_0_0.end" />
<animateMotion dur="1s" path="M-60,0" begin="colShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M-60,0 L0,0" begin="pauseCol_block_0_0.end" />
<animateMotion dur="1s" path="M0,0" begin="swapPermFwd.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L0,-60" begin="pauseMid_block_0_0.end" />
<animateMotion dur="1s" path="M0,-60" begin="rowShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M0,-60 L0,0" begin="pauseRow_block_0_0.end" /></g>
<g transform="translate(360 0)"><rect x="120" y="120" width="30" height="30" fill="rgb(204,204,30)" opacity="0.8" /><text x="135" y="135" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="12" font-weight="bold">4,4</text>
<animateMotion dur="1s" path="M0,0" begin="0s;swapPermBack.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L-30,0" begin="pauseStart_block_0_0.end" />
<animateMotion dur="1s" path="M-30,0" begin="colShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M-30,0 L0,0" begin="pauseCol_block_0_0.end" />
<animateMotion dur="1s" path="M0,0" begin="swapPermFwd.end + 0.5s" />
<animateMotion dur="2s" path="M0,0 L0,-60" begin="pauseMid_block_0_0.end" />
<animateMotion dur="1s" path="M0,-60" begin="rowShuffleFwd_block_0_0.end" />
<animateMotion dur="2s" path="M0,-60 L0,0" begin="pauseRow_block_0_0.end" /></g>
</svg>
</div>

The animation shows the effect of permutation matrices on the matrix: the columns are first shuffled (right multiplication), then the rows (left multiplication), and finally shuffled back.

> Right multiplication with a permutation matrix shuffles the columns of the matrix. Left multiplication with a permutation matrix shuffles the rows of the matrix.

Consider the following permutation matrix:

$$P = \begin{bmatrix} 0 & 0 & 1 & 0 \\ 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$

Multiplying a matrix to the right with $P$ shuffles the columns of the matrix.

$$\begin{bmatrix} | & | & | & | \\ c_1 & \textcolor{#b45309}{c_2} & \textcolor{#e11d48}{c_3} & {c_4} \\ | & | & | & | \end{bmatrix} P = \begin{bmatrix} | & | & | & | \\ \textcolor{#b45309}{c_2} & \textcolor{#e11d48}{c_3} & c_1 & {c_4} \\ | & | & | & | \end{bmatrix}$$

Column shuffle: $1 \rightarrow 3, 2 \rightarrow 1, 3 \rightarrow 2, 4 \rightarrow 4$

Multiplying a matrix to the left with the same matrix $P$ shuffles the rows of the matrix.

$$P \begin{bmatrix} - & r_1 & - \\ - & \textcolor{#b45309}{r_2} & - \\ - & \textcolor{#e11d48}{r_3} & - \\ - & {r_4} & - \end{bmatrix} = \begin{bmatrix} - & \textcolor{#e11d48}{r_3} & - \\ - & r_1 & - \\ - & \textcolor{#b45309}{r_2} & - \\ - & {r_4} & - \end{bmatrix}$$

Row shuffle: $1 \rightarrow 2, 2 \rightarrow 3, 3 \rightarrow 1, 4 \rightarrow 4$

Notice that the same matrix shuffles the rows and columns in different ways. In fact, the column shuffle is the inverse of the row shuffle and vice versa. Let's explore this idea further.

---

## Inverse of a permutation matrix

In case you did not notice, the actions of the matrices $P, P^T$ are inverses of each other. In other words, the inverse of a permutation matrix is its transpose: $P^{-1} = P^T$. Consider the earlier permutation matrix as an example:

$$PP^T = \begin{bmatrix} 0 & 0 & 1 & 0 \\ 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 1 & 0 & 0 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix} = I_4 = P^TP$$

This is true for any permutation matrix.

---

## Row column duality

Consider the following bilinear expression:

$$x^TPy = \begin{bmatrix} x_1 & \textcolor{#b45309}{x_2} & \textcolor{#e11d48}{x_3} & {x_4} \end{bmatrix} \begin{bmatrix} 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 1 & 0 & 0 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} \textcolor{#e11d48}{y_3} \\ y_1 \\ \textcolor{#b45309}{y_2} \\ {y_4} \end{bmatrix} = \sum_{i=1}^{4} x_i y_i$$

Note that $x^TPy = \langle x, \underbrace{Py}_{\textcolor{#b45309}{\text{shuffle} \ y}} \rangle = \langle \underbrace{P^Tx}_{\textcolor{#b45309}{\text{unshuffle} \ x}}, y \rangle$ where shuffle and unshuffle are inverse permutations of each other. This provides us two ways to align the elements of the two vectors as shown below.

<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 2rem; margin: 1.5rem 0;">
<div style="text-align: center;">
⟨Pᵀx, y⟩ (shuffle x by Pᵀ)
<svg width="220" height="146" viewBox="0 0 220 146" xmlns="http://www.w3.org/2000/svg">
<g transform="translate(40 10)"><text x="0" y="0" text-anchor="middle" dominant-baseline="middle" font-size="18" fill="#0d9488">x1</text>
  <animateTransform attributeName="transform" type="translate" from="40 10" to="40 44" dur="1.2s" begin="vec_shuffle_x_cycle.begin" fill="freeze" />
  <animateTransform attributeName="transform" type="translate" from="40 44" to="40 10" dur="1.2s" begin="vec_shuffle_x_cycle.begin+5.7s" fill="freeze" /></g>
<g transform="translate(40 44)"><text x="0" y="0" text-anchor="middle" dominant-baseline="middle" font-size="18" fill="#b45309">x2</text>
  <animateTransform attributeName="transform" type="translate" from="40 44" to="40 78" dur="1.2s" begin="vec_shuffle_x_cycle.begin" fill="freeze" />
  <animateTransform attributeName="transform" type="translate" from="40 78" to="40 44" dur="1.2s" begin="vec_shuffle_x_cycle.begin+5.7s" fill="freeze" /></g>
<g transform="translate(40 78)"><text x="0" y="0" text-anchor="middle" dominant-baseline="middle" font-size="18" fill="#e11d48">x3</text>
  <animateTransform attributeName="transform" type="translate" from="40 78" to="40 10" dur="1.2s" begin="vec_shuffle_x_cycle.begin" fill="freeze" />
  <animateTransform attributeName="transform" type="translate" from="40 10" to="40 78" dur="1.2s" begin="vec_shuffle_x_cycle.begin+5.7s" fill="freeze" /></g>
<g transform="translate(40 112)"><text x="0" y="0" text-anchor="middle" dominant-baseline="middle" font-size="18" fill="#27272a">x4</text>
  <animateTransform attributeName="transform" type="translate" from="40 112" to="40 112" dur="1.2s" begin="vec_shuffle_x_cycle.begin" fill="freeze" />
  <animateTransform attributeName="transform" type="translate" from="40 112" to="40 112" dur="1.2s" begin="vec_shuffle_x_cycle.begin+5.7s" fill="freeze" /></g>
<g transform="translate(140 10)"><text x="0" y="0" text-anchor="middle" dominant-baseline="middle" font-size="18" fill="#e11d48">y3</text></g>
<g transform="translate(140 44)"><text x="0" y="0" text-anchor="middle" dominant-baseline="middle" font-size="18" fill="#0d9488">y1</text></g>
<g transform="translate(140 78)"><text x="0" y="0" text-anchor="middle" dominant-baseline="middle" font-size="18" fill="#b45309">y2</text></g>
<g transform="translate(140 112)"><text x="0" y="0" text-anchor="middle" dominant-baseline="middle" font-size="18" fill="#27272a">y4</text></g>
<rect x="0" y="0" width="1" height="1" opacity="0"><animate id="vec_shuffle_x_cycle" attributeName="opacity" from="0" to="0" dur="7.4s" begin="0s;vec_shuffle_x_cycle.end" /></rect>
</svg>
</div>
<div style="text-align: center;">
⟨x, Py⟩ (shuffle y by P)
<svg width="220" height="146" viewBox="0 0 220 146" xmlns="http://www.w3.org/2000/svg">
<g transform="translate(40 10)"><text x="0" y="0" text-anchor="middle" dominant-baseline="middle" font-size="18" fill="#0d9488">x1</text></g>
<g transform="translate(40 44)"><text x="0" y="0" text-anchor="middle" dominant-baseline="middle" font-size="18" fill="#b45309">x2</text></g>
<g transform="translate(40 78)"><text x="0" y="0" text-anchor="middle" dominant-baseline="middle" font-size="18" fill="#e11d48">x3</text></g>
<g transform="translate(40 112)"><text x="0" y="0" text-anchor="middle" dominant-baseline="middle" font-size="18" fill="#27272a">x4</text></g>
<g transform="translate(140 10)"><text x="0" y="0" text-anchor="middle" dominant-baseline="middle" font-size="18" fill="#e11d48">y3</text>
  <animateTransform attributeName="transform" type="translate" from="140 10" to="140 78" dur="1.2s" begin="vec_shuffle_y_cycle.begin" fill="freeze" />
  <animateTransform attributeName="transform" type="translate" from="140 78" to="140 10" dur="1.2s" begin="vec_shuffle_y_cycle.begin+5.7s" fill="freeze" /></g>
<g transform="translate(140 44)"><text x="0" y="0" text-anchor="middle" dominant-baseline="middle" font-size="18" fill="#0d9488">y1</text>
  <animateTransform attributeName="transform" type="translate" from="140 44" to="140 10" dur="1.2s" begin="vec_shuffle_y_cycle.begin" fill="freeze" />
  <animateTransform attributeName="transform" type="translate" from="140 10" to="140 44" dur="1.2s" begin="vec_shuffle_y_cycle.begin+5.7s" fill="freeze" /></g>
<g transform="translate(140 78)"><text x="0" y="0" text-anchor="middle" dominant-baseline="middle" font-size="18" fill="#b45309">y2</text>
  <animateTransform attributeName="transform" type="translate" from="140 78" to="140 44" dur="1.2s" begin="vec_shuffle_y_cycle.begin" fill="freeze" />
  <animateTransform attributeName="transform" type="translate" from="140 44" to="140 78" dur="1.2s" begin="vec_shuffle_y_cycle.begin+5.7s" fill="freeze" /></g>
<g transform="translate(140 112)"><text x="0" y="0" text-anchor="middle" dominant-baseline="middle" font-size="18" fill="#27272a">y4</text>
  <animateTransform attributeName="transform" type="translate" from="140 112" to="140 112" dur="1.2s" begin="vec_shuffle_y_cycle.begin" fill="freeze" />
  <animateTransform attributeName="transform" type="translate" from="140 112" to="140 112" dur="1.2s" begin="vec_shuffle_y_cycle.begin+5.7s" fill="freeze" /></g>
<rect x="0" y="0" width="1" height="1" opacity="0"><animate id="vec_shuffle_y_cycle" attributeName="opacity" from="0" to="0" dur="7.4s" begin="0s;vec_shuffle_y_cycle.end" /></rect>
</svg>
</div>
</div>

### Permutation and inverses: an interesting observation

If $M$ is an invertible matrix then note that $(MP)^{-1} = P^TM^{-1}$. One can interpret each side as shown below.

$$\underbrace{(MP)^{-1}}_{\text{shuffle columns then invert}} = \underbrace{P^TM^{-1}}_{\text{invert then unshuffle rows}}$$

This insight is useful in cases where shuffling rows or columns converts the matrix into a form that is easier to invert. For example, one can swap columns to find a better pivot or to find the inverse of a sparse matrix.

---

## Application: Removing rows and columns from a matrix

Given the inverse $M^{-1}$ of a matrix $M$, under certain conditions it is faster to calculate the inverse of the matrix after removing a fixed number `k` of rows and columns by manipulating $M^{-1}$. A specific version of this problem is easier to calculate: if the last `k` rows and columns are removed. So how do we convert an arbitrary removal of `k` rows and `k` columns into a removal of the last `k` rows and `k` columns? By shuffling the columns and rows as shown below.

As an example, consider a `8-by-8 matrix`. You want to remove the columns `[1,4,6]` and the rows `[2,3,5]` from the matrix. We can multiply this matrix on both the sides by two permutation matrices chosen such that the rows and columns to remove are moved to the end.

<div style="display: flex; justify-content: center; margin: 1.5rem 0;">
<svg width="240" height="240" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
<g>
<rect x="0" y="0" width="30" height="30" fill="rgb(217 119 6)" stroke="black" opacity="0.8"><animateMotion id="pauseStart" dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion id="colShuffle2" dur="2" path="M0,0 L 0 0" begin="pauseStart.end" /><animateMotion id="pauseMid" dur="2" path="M0,0" begin="colShuffle2.end" /><animateMotion id="rowShuffle2" dur="2" path="M 0 0 L 0 0" begin="pauseMid.end" /><animateMotion id="pauseEnd" dur="1" path="M 0 0" begin="rowShuffle2.end" /></rect>
<rect x="30" y="0" width="30" height="30" fill="rgb(100,100,100)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L 180 0" begin="pauseStart.end" /><animateMotion dur="2" path="M180,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M 180 0 L 180 0" begin="pauseMid.end" /><animateMotion dur="1" path="M 180 0" begin="rowShuffle2.end" /></rect>
<rect x="60" y="0" width="30" height="30" fill="rgb(217 119 6)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L -30 0" begin="pauseStart.end" /><animateMotion dur="2" path="M-30,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M -30 0 L -30 0" begin="pauseMid.end" /><animateMotion dur="1" path="M -30 0" begin="rowShuffle2.end" /></rect>
<rect x="90" y="0" width="30" height="30" fill="rgb(217 119 6)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L -30 0" begin="pauseStart.end" /><animateMotion dur="2" path="M-30,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M -30 0 L -30 0" begin="pauseMid.end" /><animateMotion dur="1" path="M -30 0" begin="rowShuffle2.end" /></rect>
<rect x="120" y="0" width="30" height="30" fill="rgb(100,100,100)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L 60 0" begin="pauseStart.end" /><animateMotion dur="2" path="M60,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M 60 0 L 60 0" begin="pauseMid.end" /><animateMotion dur="1" path="M 60 0" begin="rowShuffle2.end" /></rect>
<rect x="150" y="0" width="30" height="30" fill="rgb(217 119 6)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L -60 0" begin="pauseStart.end" /><animateMotion dur="2" path="M-60,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M -60 0 L -60 0" begin="pauseMid.end" /><animateMotion dur="1" path="M -60 0" begin="rowShuffle2.end" /></rect>
<rect x="180" y="0" width="30" height="30" fill="rgb(100,100,100)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L -30 0" begin="pauseStart.end" /><animateMotion dur="2" path="M-30,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M -30 0 L -30 0" begin="pauseMid.end" /><animateMotion dur="1" path="M -30 0" begin="rowShuffle2.end" /></rect>
<rect x="210" y="0" width="30" height="30" fill="rgb(217 119 6)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L -90 0" begin="pauseStart.end" /><animateMotion dur="2" path="M-90,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M -90 0 L -90 0" begin="pauseMid.end" /><animateMotion dur="1" path="M -90 0" begin="rowShuffle2.end" /></rect>
<rect x="0" y="30" width="30" height="30" fill="rgb(217 119 6)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L 0 0" begin="pauseStart.end" /><animateMotion dur="2" path="M0,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M 0 0 L 0 0" begin="pauseMid.end" /><animateMotion dur="1" path="M 0 0" begin="rowShuffle2.end" /></rect>
<rect x="30" y="30" width="30" height="30" fill="rgb(100,100,100)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L 180 0" begin="pauseStart.end" /><animateMotion dur="2" path="M180,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M 180 0 L 180 0" begin="pauseMid.end" /><animateMotion dur="1" path="M 180 0" begin="rowShuffle2.end" /></rect>
<rect x="60" y="30" width="30" height="30" fill="rgb(217 119 6)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L -30 0" begin="pauseStart.end" /><animateMotion dur="2" path="M-30,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M -30 0 L -30 0" begin="pauseMid.end" /><animateMotion dur="1" path="M -30 0" begin="rowShuffle2.end" /></rect>
<rect x="90" y="30" width="30" height="30" fill="rgb(217 119 6)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L -30 0" begin="pauseStart.end" /><animateMotion dur="2" path="M-30,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M -30 0 L -30 0" begin="pauseMid.end" /><animateMotion dur="1" path="M -30 0" begin="rowShuffle2.end" /></rect>
<rect x="120" y="30" width="30" height="30" fill="rgb(100,100,100)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L 60 0" begin="pauseStart.end" /><animateMotion dur="2" path="M60,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M 60 0 L 60 0" begin="pauseMid.end" /><animateMotion dur="1" path="M 60 0" begin="rowShuffle2.end" /></rect>
<rect x="150" y="30" width="30" height="30" fill="rgb(217 119 6)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L -60 0" begin="pauseStart.end" /><animateMotion dur="2" path="M-60,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M -60 0 L -60 0" begin="pauseMid.end" /><animateMotion dur="1" path="M -60 0" begin="rowShuffle2.end" /></rect>
<rect x="180" y="30" width="30" height="30" fill="rgb(100,100,100)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L -30 0" begin="pauseStart.end" /><animateMotion dur="2" path="M-30,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M -30 0 L -30 0" begin="pauseMid.end" /><animateMotion dur="1" path="M -30 0" begin="rowShuffle2.end" /></rect>
<rect x="210" y="30" width="30" height="30" fill="rgb(217 119 6)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L -90 0" begin="pauseStart.end" /><animateMotion dur="2" path="M-90,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M -90 0 L -90 0" begin="pauseMid.end" /><animateMotion dur="1" path="M -90 0" begin="rowShuffle2.end" /></rect>
<rect x="0" y="60" width="30" height="30" fill="rgb(100,100,100)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L 0 0" begin="pauseStart.end" /><animateMotion dur="2" path="M0,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M 0 0 L 0 150" begin="pauseMid.end" /><animateMotion dur="1" path="M 0 150" begin="rowShuffle2.end" /></rect>
<rect x="30" y="60" width="30" height="30" fill="rgb(100,100,100)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L 180 0" begin="pauseStart.end" /><animateMotion dur="2" path="M180,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M 180 0 L 180 150" begin="pauseMid.end" /><animateMotion dur="1" path="M 180 150" begin="rowShuffle2.end" /></rect>
<rect x="60" y="60" width="30" height="30" fill="rgb(100,100,100)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L -30 0" begin="pauseStart.end" /><animateMotion dur="2" path="M-30,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M -30 0 L -30 150" begin="pauseMid.end" /><animateMotion dur="1" path="M -30 150" begin="rowShuffle2.end" /></rect>
<rect x="90" y="60" width="30" height="30" fill="rgb(100,100,100)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L -30 0" begin="pauseStart.end" /><animateMotion dur="2" path="M-30,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M -30 0 L -30 150" begin="pauseMid.end" /><animateMotion dur="1" path="M -30 150" begin="rowShuffle2.end" /></rect>
<rect x="120" y="60" width="30" height="30" fill="rgb(100,100,100)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L 60 0" begin="pauseStart.end" /><animateMotion dur="2" path="M60,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M 60 0 L 60 150" begin="pauseMid.end" /><animateMotion dur="1" path="M 60 150" begin="rowShuffle2.end" /></rect>
<rect x="150" y="60" width="30" height="30" fill="rgb(100,100,100)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L -60 0" begin="pauseStart.end" /><animateMotion dur="2" path="M-60,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M -60 0 L -60 150" begin="pauseMid.end" /><animateMotion dur="1" path="M -60 150" begin="rowShuffle2.end" /></rect>
<rect x="180" y="60" width="30" height="30" fill="rgb(100,100,100)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L -30 0" begin="pauseStart.end" /><animateMotion dur="2" path="M-30,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M -30 0 L -30 150" begin="pauseMid.end" /><animateMotion dur="1" path="M -30 150" begin="rowShuffle2.end" /></rect>
<rect x="210" y="60" width="30" height="30" fill="rgb(100,100,100)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L -90 0" begin="pauseStart.end" /><animateMotion dur="2" path="M-90,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M -90 0 L -90 150" begin="pauseMid.end" /><animateMotion dur="1" path="M -90 150" begin="rowShuffle2.end" /></rect>
<rect x="0" y="90" width="30" height="30" fill="rgb(100,100,100)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L 0 0" begin="pauseStart.end" /><animateMotion dur="2" path="M0,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M 0 0 L 0 90" begin="pauseMid.end" /><animateMotion dur="1" path="M 0 90" begin="rowShuffle2.end" /></rect>
<rect x="30" y="90" width="30" height="30" fill="rgb(100,100,100)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L 180 0" begin="pauseStart.end" /><animateMotion dur="2" path="M180,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M 180 0 L 180 90" begin="pauseMid.end" /><animateMotion dur="1" path="M 180 90" begin="rowShuffle2.end" /></rect>
<rect x="60" y="90" width="30" height="30" fill="rgb(100,100,100)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L -30 0" begin="pauseStart.end" /><animateMotion dur="2" path="M-30,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M -30 0 L -30 90" begin="pauseMid.end" /><animateMotion dur="1" path="M -30 90" begin="rowShuffle2.end" /></rect>
<rect x="90" y="90" width="30" height="30" fill="rgb(100,100,100)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L -30 0" begin="pauseStart.end" /><animateMotion dur="2" path="M-30,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M -30 0 L -30 90" begin="pauseMid.end" /><animateMotion dur="1" path="M -30 90" begin="rowShuffle2.end" /></rect>
<rect x="120" y="90" width="30" height="30" fill="rgb(100,100,100)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L 60 0" begin="pauseStart.end" /><animateMotion dur="2" path="M60,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M 60 0 L 60 90" begin="pauseMid.end" /><animateMotion dur="1" path="M 60 90" begin="rowShuffle2.end" /></rect>
<rect x="150" y="90" width="30" height="30" fill="rgb(100,100,100)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L -60 0" begin="pauseStart.end" /><animateMotion dur="2" path="M-60,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M -60 0 L -60 90" begin="pauseMid.end" /><animateMotion dur="1" path="M -60 90" begin="rowShuffle2.end" /></rect>
<rect x="180" y="90" width="30" height="30" fill="rgb(100,100,100)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L -30 0" begin="pauseStart.end" /><animateMotion dur="2" path="M-30,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M -30 0 L -30 90" begin="pauseMid.end" /><animateMotion dur="1" path="M -30 90" begin="rowShuffle2.end" /></rect>
<rect x="210" y="90" width="30" height="30" fill="rgb(100,100,100)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L -90 0" begin="pauseStart.end" /><animateMotion dur="2" path="M-90,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M -90 0 L -90 90" begin="pauseMid.end" /><animateMotion dur="1" path="M -90 90" begin="rowShuffle2.end" /></rect>
<rect x="0" y="120" width="30" height="30" fill="rgb(217 119 6)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L 0 0" begin="pauseStart.end" /><animateMotion dur="2" path="M0,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M 0 0 L 0 -60" begin="pauseMid.end" /><animateMotion dur="1" path="M 0 -60" begin="rowShuffle2.end" /></rect>
<rect x="30" y="120" width="30" height="30" fill="rgb(100,100,100)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L 180 0" begin="pauseStart.end" /><animateMotion dur="2" path="M180,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M 180 0 L 180 -60" begin="pauseMid.end" /><animateMotion dur="1" path="M 180 -60" begin="rowShuffle2.end" /></rect>
<rect x="60" y="120" width="30" height="30" fill="rgb(217 119 6)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L -30 0" begin="pauseStart.end" /><animateMotion dur="2" path="M-30,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M -30 0 L -30 -60" begin="pauseMid.end" /><animateMotion dur="1" path="M -30 -60" begin="rowShuffle2.end" /></rect>
<rect x="90" y="120" width="30" height="30" fill="rgb(217 119 6)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L -30 0" begin="pauseStart.end" /><animateMotion dur="2" path="M-30,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M -30 0 L -30 -60" begin="pauseMid.end" /><animateMotion dur="1" path="M -30 -60" begin="rowShuffle2.end" /></rect>
<rect x="120" y="120" width="30" height="30" fill="rgb(100,100,100)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L 60 0" begin="pauseStart.end" /><animateMotion dur="2" path="M60,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M 60 0 L 60 -60" begin="pauseMid.end" /><animateMotion dur="1" path="M 60 -60" begin="rowShuffle2.end" /></rect>
<rect x="150" y="120" width="30" height="30" fill="rgb(217 119 6)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L -60 0" begin="pauseStart.end" /><animateMotion dur="2" path="M-60,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M -60 0 L -60 -60" begin="pauseMid.end" /><animateMotion dur="1" path="M -60 -60" begin="rowShuffle2.end" /></rect>
<rect x="180" y="120" width="30" height="30" fill="rgb(100,100,100)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L -30 0" begin="pauseStart.end" /><animateMotion dur="2" path="M-30,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M -30 0 L -30 -60" begin="pauseMid.end" /><animateMotion dur="1" path="M -30 -60" begin="rowShuffle2.end" /></rect>
<rect x="210" y="120" width="30" height="30" fill="rgb(217 119 6)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L -90 0" begin="pauseStart.end" /><animateMotion dur="2" path="M-90,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M -90 0 L -90 -60" begin="pauseMid.end" /><animateMotion dur="1" path="M -90 -60" begin="rowShuffle2.end" /></rect>
<rect x="0" y="150" width="30" height="30" fill="rgb(100,100,100)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L 0 0" begin="pauseStart.end" /><animateMotion dur="2" path="M0,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M 0 0 L 0 0" begin="pauseMid.end" /><animateMotion dur="1" path="M 0 0" begin="rowShuffle2.end" /></rect>
<rect x="30" y="150" width="30" height="30" fill="rgb(100,100,100)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L 180 0" begin="pauseStart.end" /><animateMotion dur="2" path="M180,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M 180 0 L 180 0" begin="pauseMid.end" /><animateMotion dur="1" path="M 180 0" begin="rowShuffle2.end" /></rect>
<rect x="60" y="150" width="30" height="30" fill="rgb(100,100,100)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L -30 0" begin="pauseStart.end" /><animateMotion dur="2" path="M-30,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M -30 0 L -30 0" begin="pauseMid.end" /><animateMotion dur="1" path="M -30 0" begin="rowShuffle2.end" /></rect>
<rect x="90" y="150" width="30" height="30" fill="rgb(100,100,100)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L -30 0" begin="pauseStart.end" /><animateMotion dur="2" path="M-30,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M -30 0 L -30 0" begin="pauseMid.end" /><animateMotion dur="1" path="M -30 0" begin="rowShuffle2.end" /></rect>
<rect x="120" y="150" width="30" height="30" fill="rgb(100,100,100)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L 60 0" begin="pauseStart.end" /><animateMotion dur="2" path="M60,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M 60 0 L 60 0" begin="pauseMid.end" /><animateMotion dur="1" path="M 60 0" begin="rowShuffle2.end" /></rect>
<rect x="150" y="150" width="30" height="30" fill="rgb(100,100,100)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L -60 0" begin="pauseStart.end" /><animateMotion dur="2" path="M-60,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M -60 0 L -60 0" begin="pauseMid.end" /><animateMotion dur="1" path="M -60 0" begin="rowShuffle2.end" /></rect>
<rect x="180" y="150" width="30" height="30" fill="rgb(100,100,100)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L -30 0" begin="pauseStart.end" /><animateMotion dur="2" path="M-30,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M -30 0 L -30 0" begin="pauseMid.end" /><animateMotion dur="1" path="M -30 0" begin="rowShuffle2.end" /></rect>
<rect x="210" y="150" width="30" height="30" fill="rgb(100,100,100)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L -90 0" begin="pauseStart.end" /><animateMotion dur="2" path="M-90,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M -90 0 L -90 0" begin="pauseMid.end" /><animateMotion dur="1" path="M -90 0" begin="rowShuffle2.end" /></rect>
<rect x="0" y="180" width="30" height="30" fill="rgb(217 119 6)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L 0 0" begin="pauseStart.end" /><animateMotion dur="2" path="M0,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M 0 0 L 0 -90" begin="pauseMid.end" /><animateMotion dur="1" path="M 0 -90" begin="rowShuffle2.end" /></rect>
<rect x="30" y="180" width="30" height="30" fill="rgb(100,100,100)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L 180 0" begin="pauseStart.end" /><animateMotion dur="2" path="M180,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M 180 0 L 180 -90" begin="pauseMid.end" /><animateMotion dur="1" path="M 180 -90" begin="rowShuffle2.end" /></rect>
<rect x="60" y="180" width="30" height="30" fill="rgb(217 119 6)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L -30 0" begin="pauseStart.end" /><animateMotion dur="2" path="M-30,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M -30 0 L -30 -90" begin="pauseMid.end" /><animateMotion dur="1" path="M -30 -90" begin="rowShuffle2.end" /></rect>
<rect x="90" y="180" width="30" height="30" fill="rgb(217 119 6)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L -30 0" begin="pauseStart.end" /><animateMotion dur="2" path="M-30,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M -30 0 L -30 -90" begin="pauseMid.end" /><animateMotion dur="1" path="M -30 -90" begin="rowShuffle2.end" /></rect>
<rect x="120" y="180" width="30" height="30" fill="rgb(100,100,100)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L 60 0" begin="pauseStart.end" /><animateMotion dur="2" path="M60,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M 60 0 L 60 -90" begin="pauseMid.end" /><animateMotion dur="1" path="M 60 -90" begin="rowShuffle2.end" /></rect>
<rect x="150" y="180" width="30" height="30" fill="rgb(217 119 6)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L -60 0" begin="pauseStart.end" /><animateMotion dur="2" path="M-60,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M -60 0 L -60 -90" begin="pauseMid.end" /><animateMotion dur="1" path="M -60 -90" begin="rowShuffle2.end" /></rect>
<rect x="180" y="180" width="30" height="30" fill="rgb(100,100,100)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L -30 0" begin="pauseStart.end" /><animateMotion dur="2" path="M-30,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M -30 0 L -30 -90" begin="pauseMid.end" /><animateMotion dur="1" path="M -30 -90" begin="rowShuffle2.end" /></rect>
<rect x="210" y="180" width="30" height="30" fill="rgb(217 119 6)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L -90 0" begin="pauseStart.end" /><animateMotion dur="2" path="M-90,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M -90 0 L -90 -90" begin="pauseMid.end" /><animateMotion dur="1" path="M -90 -90" begin="rowShuffle2.end" /></rect>
<rect x="0" y="210" width="30" height="30" fill="rgb(217 119 6)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L 0 0" begin="pauseStart.end" /><animateMotion dur="2" path="M0,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M 0 0 L 0 -90" begin="pauseMid.end" /><animateMotion dur="1" path="M 0 -90" begin="rowShuffle2.end" /></rect>
<rect x="30" y="210" width="30" height="30" fill="rgb(100,100,100)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L 180 0" begin="pauseStart.end" /><animateMotion dur="2" path="M180,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M 180 0 L 180 -90" begin="pauseMid.end" /><animateMotion dur="1" path="M 180 -90" begin="rowShuffle2.end" /></rect>
<rect x="60" y="210" width="30" height="30" fill="rgb(217 119 6)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L -30 0" begin="pauseStart.end" /><animateMotion dur="2" path="M-30,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M -30 0 L -30 -90" begin="pauseMid.end" /><animateMotion dur="1" path="M -30 -90" begin="rowShuffle2.end" /></rect>
<rect x="90" y="210" width="30" height="30" fill="rgb(217 119 6)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L -30 0" begin="pauseStart.end" /><animateMotion dur="2" path="M-30,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M -30 0 L -30 -90" begin="pauseMid.end" /><animateMotion dur="1" path="M -30 -90" begin="rowShuffle2.end" /></rect>
<rect x="120" y="210" width="30" height="30" fill="rgb(100,100,100)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L 60 0" begin="pauseStart.end" /><animateMotion dur="2" path="M60,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M 60 0 L 60 -90" begin="pauseMid.end" /><animateMotion dur="1" path="M 60 -90" begin="rowShuffle2.end" /></rect>
<rect x="150" y="210" width="30" height="30" fill="rgb(217 119 6)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L -60 0" begin="pauseStart.end" /><animateMotion dur="2" path="M-60,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M -60 0 L -60 -90" begin="pauseMid.end" /><animateMotion dur="1" path="M -60 -90" begin="rowShuffle2.end" /></rect>
<rect x="180" y="210" width="30" height="30" fill="rgb(100,100,100)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L -30 0" begin="pauseStart.end" /><animateMotion dur="2" path="M-30,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M -30 0 L -30 -90" begin="pauseMid.end" /><animateMotion dur="1" path="M -30 -90" begin="rowShuffle2.end" /></rect>
<rect x="210" y="210" width="30" height="30" fill="rgb(217 119 6)" stroke="black" opacity="0.8"><animateMotion dur="1" path="M0,0" begin="0s;pauseEnd.end" /><animateMotion dur="2" path="M0,0 L -90 0" begin="pauseStart.end" /><animateMotion dur="2" path="M-90,0" begin="colShuffle2.end" /><animateMotion dur="2" path="M -90 0 L -90 -90" begin="pauseMid.end" /><animateMotion dur="1" path="M -90 -90" begin="rowShuffle2.end" /></rect>
</g>
</svg>
</div>

Shuffle the columns and rows so that the rows and columns to remove (colored gray) are moved to the end. Column shuffle: `[0,7,1,2,6,3,5,4]`, row shuffle: `[0,1,7,6,2,5,3,4]`

I have written two articles that explore this problem in greater detail:

- [Inverse of a matrix after row and column removal](/blog/inverse_row_col_removed)
- [Inverse of a block of a matrix](/blog/inverse_matrix_block)

---

## Permutation group

The set of all `n-by-n` permutation matrices forms a group under matrix multiplication. This group is called the permutation group. The identity element of this group is the identity matrix. The inverse of a permutation matrix is its transpose. The product of two permutation matrices is another permutation matrix.

---

## Related articles:

- [Series: From permutations to Sinkhorn](/series/permutation_sinkhorn/0_permutation_cycles)
