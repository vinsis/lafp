---
title: Three interpretations of matrix products
---

# Three interpretations of matrix products

This article explores three different interpretations of matrix products with the help of animations. Each of them provides a different perspective on the matrix product and can be useful in different contexts.

---

## 0. Prerequisites and notations

A row vector is shown as a horizontal rectangle and a column vector as a vertical rectangle. The scalar numbers are shown as circles.

A circle next to a rectangle represents the scalar multiplication of the number with the vector. The color of the circle and the rectangle are the same to indicate that they are related.

<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; margin: 1.5rem 0;">
<svg width="370" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<g>
<rect x="10" y="10" width="15" height="150" fill="rgb(217 119 6)" />
<text x="20" y="170" text-anchor="middle" dy="5" font-size="14" fill="#27272a">column vector</text>
<rect x="60" y="10" width="150" height="15" fill="rgb(13 148 136)" />
<text x="135" y="35" text-anchor="middle" dy="5" font-size="14" fill="#27272a">row vector</text>
<circle cx="257.5" cy="67.5" r="7.5" fill="rgb(225 29 72)" />
<text x="257.5" y="85" text-anchor="middle" dy="5" font-size="14" fill="#27272a">number</text>
</g>
</svg>
<svg width="370" height="170" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<g>
<circle cx="17.5" cy="85" r="7.5" fill="rgb(225 29 72)" />
<rect x="30" y="10" width="15" height="150" fill="rgb(225 29 72)" />
<text x="20" y="170" text-anchor="start" dy="5" font-size="17" fill="#27272a">number * column vector</text>
<circle cx="97.5" cy="17.5" r="7.5" fill="rgb(13 148 136)" />
<rect x="110" y="10" width="150" height="15" fill="rgb(13 148 136)" />
<text x="112.5" y="35" text-anchor="start" dy="5" font-size="17" fill="#27272a">number * row vector</text>
</g>
</svg>
</div>

Finally, the outer product of a column vector and a row vector is shown as a vertical rectangle joined with a horizontal rectangle on the top left corner. This visual aid should make sense if you are familiar with the concept of outer products.

<div style="display: flex; justify-content: center; margin: 1.5rem 0;">
<svg width="370" height="170" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<g>
<path d="M15,5 L5,5 L5,165, L15,165" stroke="#71717a" stroke-width="1" fill="none" />
<rect x="10" y="10" width="15" height="150" fill="#71717a" opacity="0.6" />
<path d="M20,5 L30,5 L30,165, L20,165" stroke="#71717a" stroke-width="1" fill="none" />
<path d="M65,72.5 L55,72.5 L55,97.5, L65,97.5" stroke="#71717a" stroke-width="1" fill="none" />
<rect x="60" y="77.5" width="60" height="15" fill="#71717a" opacity="0.6" />
<path d="M115,72.5 L125,72.5 L125,97.5, L115,97.5" stroke="#71717a" stroke-width="1" fill="none" />
<path d="M180,5 L170,5 L170,165, L180,165" stroke="#71717a" stroke-width="1" fill="none" />
<rect x="175" y="10" width="15" height="150" fill="#71717a" opacity="0.6" />
<rect x="175" y="10" width="60" height="15" fill="#71717a" opacity="0.6" />
<path d="M230,5 L240,5 L240,165, L230,165" stroke="#71717a" stroke-width="1" fill="none" />
<text x="145" y="85" text-anchor="middle" dy="5" font-size="14" fill="#27272a">=</text>
</g>
</svg>
</div>

An outer product of a column vector and a row vector.

That's it! On to the visualizations now.

---

## 1. Interpretation #1: Weighted sum of columns or rows

Scaling a vector by a scalar quantity defined as multiplying each of the vector's components by the scalar. Adding two vectors is defined as adding their corresponding components. This interpretation is quite useful when using matrices in geometry or any visual application. Eg taking a convex sum of n points in a 2D plane (or any higher-dimensional space).

### 1.1 Matrix vector product as a weighted sum of columns

<div style="display: flex; justify-content: center; margin: 1.5rem 0;">
<svg width="400" height="170" viewBox="0 0 200 170" xmlns="http://www.w3.org/2000/svg">
<g>
<path d="M15,5 L5,5 L5,165 L15,165" stroke="#71717a" stroke-width="1" fill="none" />
<path d="M70,5 L80,5 L80,165 L70,165" stroke="#71717a" stroke-width="1" fill="none">
  <animateMotion begin="oneColorChangeColsForward.end" path="M0,0 L135,0" dur="3" keyTimes="0; 0.5; 1" keyPoints="0; 1; 1" />
  <animateMotion begin="oneColumnForward.end" path="M135,0 L0,0" dur="2" keyTimes="0; 0.5; 1" keyPoints="0; 1; 1" />
</path>
<path d="M125,47.5 L115,47.5 L115,122.5 L125,122.5" stroke="#71717a" stroke-width="1" fill="none" stroke-opacity="1">
  <animate begin="oneColorChangeInputForward.end" attributeName="stroke-opacity" values="1;0;0" dur="3" keyTimes="0; 0.2; 1" />
  <animate begin="oneInputForward.end" attributeName="stroke-opacity" values="0;0;1" dur="2" keyTimes="0; 0.5; 1" />
</path>
<path d="M130,47.5 L140,47.5 L140,122.5 L130,122.5" stroke="#71717a" stroke-width="1" fill="none">
  <animate begin="oneColorChangeInputForward.end" attributeName="stroke-opacity" values="1;0;0" dur="3" keyTimes="0; 0.2; 1" />
  <animate begin="oneInputForward.end" attributeName="stroke-opacity" values="0;0;1" dur="2" keyTimes="0; 0.5; 1" />
</path>
<rect x="10" y="10" width="15" height="150" fill="#d4d4d8">
  <animate id="oneColorChangeColsForward" begin="0s; oneColorChangeColsBackward.end" attributeName="fill" values="#d4d4d8; rgb(217 119 6); rgb(217 119 6)" dur="3" keyTimes="0; 0.5; 1" fill="freeze" />
  <animateMotion id="oneColumnForward" begin="oneColorChangeColsForward.end" dur="3" path="M0,0 L25,0" keyTimes="0; 0.5; 1" keyPoints="0; 1; 1" />
  <animateMotion id="oneColumnBackward" begin="oneColumnForward.end" dur="2" path="M25,0 L0,0" keyTimes="0; 0.5; 1" keyPoints="0; 1; 1" />
  <animate id="oneColorChangeColsBackward" begin="oneColumnBackward.end" attributeName="fill" values="rgb(217 119 6); #d4d4d8; #d4d4d8" dur="2" keyTimes="0; 0.5; 1" fill="freeze" />
</rect>
<rect x="35" y="10" width="15" height="150" fill="#d4d4d8">
  <animate begin="0s; oneColorChangeColsBackward.end" attributeName="fill" values="#d4d4d8; rgb(13 148 136); rgb(13 148 136)" dur="3" keyTimes="0; 0.5; 1" fill="freeze" />
  <animateMotion begin="oneColorChangeColsForward.end" dur="3" path="M0,0 L80,0" keyTimes="0; 0.5; 1" keyPoints="0; 1; 1" />
  <animateMotion begin="oneColumnForward.end" dur="2" path="M80,0 L0,0" keyTimes="0; 0.5; 1" keyPoints="0; 1; 1" />
  <animate begin="oneColumnBackward.end" attributeName="fill" values="rgb(13 148 136); #d4d4d8; #d4d4d8" dur="2" keyTimes="0; 0.5; 1" fill="freeze" />
</rect>
<rect x="60" y="10" width="15" height="150" fill="#d4d4d8">
  <animate begin="0s; oneColorChangeColsBackward.end" attributeName="fill" values="#d4d4d8; rgb(100,100,100); rgb(100,100,100)" dur="3" keyTimes="0; 0.5; 1" fill="freeze" />
  <animateMotion begin="oneColorChangeColsForward.end" dur="3" path="M0,0 L135,0" keyTimes="0; 0.5; 1" keyPoints="0; 1; 1" />
  <animateMotion begin="oneColumnForward.end" dur="2" path="M135,0 L0,0" keyTimes="0; 0.5; 1" keyPoints="0; 1; 1" />
  <animate begin="oneColumnBackward.end" attributeName="fill" values="rgb(100,100,100); #d4d4d8; #d4d4d8" dur="2" keyTimes="0; 0.5; 1" fill="freeze" />
</rect>
<circle cx="127.5" cy="60" r="7.5" fill="#d4d4d8">
  <animate id="oneColorChangeInputForward" begin="0s; oneColorChangeInputBackward.end" attributeName="fill" values="#d4d4d8; rgb(217 119 6); rgb(217 119 6)" dur="3" keyTimes="0; 0.5; 1" fill="freeze" />
  <animateMotion id="oneInputForward" begin="oneColorChangeInputForward.end" dur="3" path="M0,0 L-110,25" keyTimes="0; 0.5; 1" keyPoints="0; 1; 1" />
  <animateMotion id="oneInputBackward" begin="oneInputForward.end" dur="2" path="M-110,25 L0,0" keyTimes="0; 0.5; 1" keyPoints="0; 1; 1" />
  <animate id="oneColorChangeInputBackward" begin="oneInputBackward.end" attributeName="fill" values="rgb(217 119 6); #d4d4d8; #d4d4d8" dur="2" keyTimes="0; 0.5; 1" fill="freeze" />
</circle>
<circle cx="127.5" cy="85" r="7.5" fill="#d4d4d8">
  <animate begin="0s; oneColorChangeInputBackward.end" attributeName="fill" values="#d4d4d8; rgb(13 148 136); rgb(13 148 136)" dur="3" keyTimes="0; 0.5; 1" fill="freeze" />
  <animateMotion begin="oneColorChangeInputForward.end" dur="3" path="M0,0 L-30,0" keyTimes="0; 0.5; 1" keyPoints="0; 1; 1" />
  <animateMotion begin="oneInputForward.end" dur="2" path="M-30,0 L0,0" keyTimes="0; 0.5; 1" keyPoints="0; 1; 1" />
  <animate begin="oneInputBackward.end" attributeName="fill" values="rgb(13 148 136); #d4d4d8; #d4d4d8" dur="2" keyTimes="0; 0.5; 1" fill="freeze" />
</circle>
<circle cx="127.5" cy="110" r="7.5" fill="#d4d4d8">
  <animate begin="0s; oneColorChangeInputBackward.end" attributeName="fill" values="#d4d4d8; rgb(100,100,100); rgb(100,100,100)" dur="3" keyTimes="0; 0.5; 1" fill="freeze" />
  <animateMotion begin="oneColorChangeInputForward.end" dur="3" path="M0,0 L50,-25" keyTimes="0; 0.5; 1" keyPoints="0; 1; 1" />
  <animateMotion begin="oneInputForward.end" dur="2" path="M50,-25 L0,0" keyTimes="0; 0.5; 1" keyPoints="0; 1; 1" />
  <animate begin="oneInputBackward.end" attributeName="fill" values="rgb(100,100,100); #d4d4d8; #d4d4d8" dur="2" keyTimes="0; 0.5; 1" fill="freeze" />
</circle>
<text x="70" y="86" text-anchor="middle" opacity="0" fill="#27272a">+
  <animate begin="oneColorChangeInputForward.end" attributeName="opacity" values="0;1;1" dur="3" keyTimes="0; 0.8; 1" />
  <animate begin="oneInputForward.end" attributeName="opacity" values="1;0;0" dur="2" keyTimes="0; 0.5; 1" />
</text>
<text x="150" y="86" text-anchor="middle" opacity="0" fill="#27272a">+
  <animate begin="oneColorChangeInputForward.end" attributeName="opacity" values="0;1;1" dur="3" keyTimes="0; 0.8; 1" />
  <animate begin="oneInputForward.end" attributeName="opacity" values="1;0;0" dur="2" keyTimes="0; 0.5; 1" />
</text>
</g>
</svg>
</div>

A matrix vector product can be seen as scaling the columns and then adding them up.

### 1.2 Vector matrix product as a weighted sum of rows

<div style="display: flex; justify-content: center; margin: 1.5rem 0;">
<svg width="265" height="125" viewBox="0 0 265 125" xmlns="http://www.w3.org/2000/svg">
<g>
<path d="M15,50 L5,50 L5,75 L15,75" stroke="#71717a" stroke-width="1" fill="none">
  <animate begin="twoInputChangeColorForward.end" attributeName="stroke-opacity" values="1;0;0" dur="3" keyTimes="0; 0.2; 1" />
  <animate begin="twoInputForward.end" attributeName="stroke-opacity" values="0;0;1" dur="2" keyTimes="0; 0.5; 1" />
</path>
<path d="M70,50 L80,50 L80,75 L70,75" stroke="#71717a" stroke-width="1" fill="none">
  <animate begin="twoInputChangeColorForward.end" attributeName="stroke-opacity" values="1;0;0" dur="3" keyTimes="0; 0.2; 1" />
  <animate begin="twoInputForward.end" attributeName="stroke-opacity" values="0;0;1" dur="2" keyTimes="0; 0.5; 1" />
</path>
<path d="M110,-37.5 L100,-37.5 L100,37.5 L110,37.5" stroke="#71717a" stroke-width="1" fill="none" transform="translate(0 62.5)">
  <animateTransform begin="twoInputChangeColorForward.end" attributeName="transform" type="scale" values="1 1;1 1.533;1 1.533" dur="3" keyTimes="0; 0.5; 1" additive="sum" />
  <animateTransform begin="twoInputChangeColorForward.end" attributeName="transform" type="translate" values="0 0;-25 0;-25 0" dur="3" keyTimes="0; 0.5; 1" additive="sum" />
  <animateTransform begin="twoInputForward.end" attributeName="transform" type="scale" values="1 1.533;1 1;1 1" dur="2" keyTimes="0; 0.5; 1" additive="sum" />
  <animateTransform begin="twoInputForward.end" attributeName="transform" type="translate" values="-25 0;0 0;0 0" dur="2" keyTimes="0; 0.5; 1" additive="sum" />
</path>
<path d="M250,-37.5 L260,-37.5 L260,37.5 L250,37.5" stroke="#71717a" stroke-width="1" fill="none" transform="translate(0 62.5)">
  <animateTransform begin="twoInputChangeColorForward.end" attributeName="transform" type="scale" values="1 1;1 1.533;1 1.533" dur="3" keyTimes="0; 0.5; 1" additive="sum" />
  <animateTransform begin="twoInputForward.end" attributeName="transform" type="scale" values="1 1.533;1 1;1 1" dur="2" keyTimes="0; 0.5; 1" additive="sum" />
</path>
<rect x="105" y="30" width="150" height="15" fill="#d4d4d8">
  <animate id="twoChangeColorForward" begin="0s; twoChangeColorBackward.end" attributeName="fill" values="#d4d4d8; rgb(217 119 6); rgb(217 119 6)" dur="3" keyTimes="0; 0.5; 1" fill="freeze" />
  <animateMotion id="twoRowForward" begin="twoChangeColorForward.end" dur="3" path="M0,0 L0,-20" keyTimes="0; 0.5; 1" keyPoints="0; 1; 1" />
  <animateMotion id="twoRowBackward" begin="twoRowForward.end" dur="2" path="M0,-20 L0,0" keyTimes="0; 0.5; 1" keyPoints="0; 1; 1" />
  <animate id="twoChangeColorBackward" begin="twoRowBackward.end" attributeName="fill" values="rgb(217 119 6); #d4d4d8; #d4d4d8" dur="2" keyTimes="0; 0.5; 1" fill="freeze" />
</rect>
<rect x="105" y="55" width="150" height="15" fill="#d4d4d8">
  <animate begin="0s; twoChangeColorBackward.end" attributeName="fill" values="#d4d4d8; rgb(13 148 136); rgb(13 148 136)" dur="3" keyTimes="0; 0.5; 1" fill="freeze" />
  <animateMotion begin="twoChangeColorForward.end" dur="3" path="M0,0 L0,0" keyTimes="0; 0.5; 1" keyPoints="0; 1; 1" />
  <animateMotion begin="twoRowForward.end" dur="2" path="M0,0 L0,0" keyTimes="0; 0.5; 1" keyPoints="0; 1; 1" />
  <animate begin="twoRowBackward.end" attributeName="fill" values="rgb(13 148 136); #d4d4d8; #d4d4d8" dur="2" keyTimes="0; 0.5; 1" fill="freeze" />
</rect>
<rect x="105" y="80" width="150" height="15" fill="#d4d4d8">
  <animate begin="0s; twoChangeColorBackward.end" attributeName="fill" values="#d4d4d8; rgb(100,100,100); rgb(100,100,100)" dur="3" keyTimes="0; 0.5; 1" fill="freeze" />
  <animateMotion begin="twoChangeColorForward.end" dur="3" path="M0,0 L0,20" keyTimes="0; 0.5; 1" keyPoints="0; 1; 1" />
  <animateMotion begin="twoRowForward.end" dur="2" path="M0,20 L0,0" keyTimes="0; 0.5; 1" keyPoints="0; 1; 1" />
  <animate begin="twoRowBackward.end" attributeName="fill" values="rgb(100,100,100); #d4d4d8; #d4d4d8" dur="2" keyTimes="0; 0.5; 1" fill="freeze" />
</rect>
<circle cx="17.5" cy="62.5" r="7.5" fill="#d4d4d8">
  <animate id="twoInputChangeColorForward" begin="0s; twoInputChangeColorBackward.end" attributeName="fill" values="#d4d4d8; rgb(217 119 6); rgb(217 119 6)" dur="3" keyTimes="0; 0.5; 1" fill="freeze" />
  <animateMotion id="twoInputForward" begin="twoInputChangeColorForward.end" dur="3" path="M0,0 L70,-45" keyTimes="0; 0.5; 1" keyPoints="0; 1; 1" />
  <animateMotion id="twoInputBackward" begin="twoInputForward.end" dur="2" path="M70,-45 L0,0" keyTimes="0; 0.5; 1" keyPoints="0; 1; 1" />
  <animate id="twoInputChangeColorBackward" begin="twoInputBackward.end" attributeName="fill" values="rgb(217 119 6); #d4d4d8; #d4d4d8" dur="2" keyTimes="0; 0.5; 1" fill="freeze" />
</circle>
<circle cx="42.5" cy="62.5" r="7.5" fill="#d4d4d8">
  <animate begin="0s; twoInputChangeColorBackward.end" attributeName="fill" values="#d4d4d8; rgb(13 148 136); rgb(13 148 136)" dur="3" keyTimes="0; 0.5; 1" fill="freeze" />
  <animateMotion begin="twoInputChangeColorForward.end" dur="3" path="M0,0 L45,0" keyTimes="0; 0.5; 1" keyPoints="0; 1; 1" />
  <animateMotion begin="twoInputForward.end" dur="2" path="M45,0 L0,0" keyTimes="0; 0.5; 1" keyPoints="0; 1; 1" />
  <animate begin="twoInputBackward.end" attributeName="fill" values="rgb(13 148 136); #d4d4d8; #d4d4d8" dur="2" keyTimes="0; 0.5; 1" fill="freeze" />
</circle>
<circle cx="67.5" cy="62.5" r="7.5" fill="#d4d4d8">
  <animate begin="0s; twoInputChangeColorBackward.end" attributeName="fill" values="#d4d4d8; rgb(100,100,100); rgb(100,100,100)" dur="3" keyTimes="0; 0.5; 1" fill="freeze" />
  <animateMotion begin="twoInputChangeColorForward.end" dur="3" path="M0,0 L20,45" keyTimes="0; 0.5; 1" keyPoints="0; 1; 1" />
  <animateMotion begin="twoInputForward.end" dur="2" path="M20,45 L0,0" keyTimes="0; 0.5; 1" keyPoints="0; 1; 1" />
  <animate begin="twoInputBackward.end" attributeName="fill" values="rgb(100,100,100); #d4d4d8; #d4d4d8" dur="2" keyTimes="0; 0.5; 1" fill="freeze" />
</circle>
<text x="180" y="45" text-anchor="middle" opacity="0" fill="#27272a">+
  <animate begin="twoInputChangeColorForward.end" attributeName="opacity" values="0;1;1" dur="3" keyTimes="0; 0.8; 1" />
  <animate begin="twoInputForward.end" attributeName="opacity" values="1;0;0" dur="2" keyTimes="0; 0.5; 1" />
</text>
<text x="180" y="90" text-anchor="middle" opacity="0" fill="#27272a">+
  <animate begin="twoInputChangeColorForward.end" attributeName="opacity" values="0;1;1" dur="3" keyTimes="0; 0.8; 1" />
  <animate begin="twoInputForward.end" attributeName="opacity" values="1;0;0" dur="2" keyTimes="0; 0.5; 1" />
</text>
</g>
</svg>
</div>

A vector matrix product can be seen as scaling the rows and then adding them up.

Note the duality between the two interpretations. The first one is useful when you want to think of the matrix as a collection of columns and the second one is useful when you want to think of the matrix as a collection of rows.

This is covered in more detail in [Geometry of weighted sums](/la/2_spacewalk).

## 2. Interpretation #2: Dot products of columns or rows with input vector

A dot product is a function that takes two vectors of equal length and returns a scalar quantity. It is defined as the sum of the products of the corresponding components of the two vectors.

### 2.1 Matrix vector product as a dot product of rows with input vector

<div style="display: flex; justify-content: center; margin: 1.5rem 0;">
<svg width="270" height="170" viewBox="0 0 270 170" xmlns="http://www.w3.org/2000/svg">
<g>
<path d="M15,47.5 L5,47.5 L5,122.5 L15,122.5" stroke="#71717a" stroke-width="1" fill="none">
  <animate begin="threeRotate.end" attributeName="stroke-opacity" values="1;0;0" dur="2" keyTimes="0; 0.2; 1" fill="freeze" />
  <animate begin="threeTranslate2_2.end" attributeName="stroke-opacity" values="0;1;1" dur="2" keyTimes="0; 0.2; 1" fill="freeze" />
</path>
<path d="M155,47.5 L165,47.5 L165,122.5 L155,122.5" stroke="#71717a" stroke-width="1" fill="none">
  <animate begin="threeRotate.end" attributeName="stroke-opacity" values="1;0;0" dur="2" keyTimes="0; 0.2; 1" fill="freeze" />
  <animate begin="threeTranslate2_2.end" attributeName="stroke-opacity" values="0;1;1" dur="2" keyTimes="0; 0.2; 1" fill="freeze" />
</path>
<path d="M195,5 L185,5 L185,165 L195,165" stroke="#71717a" stroke-width="1" fill="none" />
<path d="M200,5 L210,5 L210,165 L200,165" stroke="#71717a" stroke-width="1" fill="none" />
<text x="225" y="90" text-anchor="middle" fill="#27272a">=</text>
<path d="M250,47.5 L240,47.5 L240,122.5 L250,122.5" stroke="#71717a" stroke-width="1" fill="none" />
<path d="M255,47.5 L265,47.5 L265,122.5 L255,122.5" stroke="#71717a" stroke-width="1" fill="none" />
<rect x="10" y="52.5" height="15" width="150" fill="rgb(217 119 6)" r="0">
  <animateTransform id="threeRotate_0" begin="0s; threeResetScale_2.end" attributeName="transform" type="rotate" values="0 60 60; 90 60 60; 90 60 60" dur="1" fill="freeze" keyTimes="0;0.9;1" />
  <animateTransform id="threeTranslate_0" begin="threeRotate_0.end" attributeName="transform" type="translate" values="0 0; 0 -137.5; 0 -137.5" keyTimes="0;0.9;1" dur="1" fill="freeze" additive="sum" />
  <animate id="threeScale_0" begin="threeTranslate_0.end" attributeName="width" values="150; 15; 15" dur="2" fill="freeze" keyTimes="0;0.5;1" />
  <animate id="threeRadius_0" begin="threeTranslate_0.end" attributeName="rx" values="0; 7.5; 7.5" dur="2" fill="freeze" keyTimes="0;0.5;1" />
  <animateTransform id="threeTranslate2_0" begin="threeTranslate_0.end" attributeName="transform" type="translate" values="0 0; 42.5 -55; 42.5 -55" dur="2" fill="freeze" additive="sum" keyTimes="0;0.5;1" />
  <animateTransform id="threeResetTranslate_0" begin="threeTranslate2_0.end" attributeName="transform" type="translate" values="0 0; 0 0" dur="1" fill="freeze" />
  <animate id="threeResetRadius_0" begin="threeTranslate2_0.end" attributeName="rx" values="7.5; 0; 0" dur="1" fill="freeze" keyTimes="0;0;1" />
  <animate id="threeResetScale_0" begin="threeTranslate2_0.end" attributeName="width" values="15; 150; 150" dur="1" fill="freeze" keyTimes="0;0;1" />
</rect>
<rect x="10" y="77.5" height="15" width="150" fill="rgb(13 148 136)" r="0">
  <animateTransform id="threeRotate_1" begin="threeResetScale_0.end" attributeName="transform" type="rotate" values="0 85 85; 90 85 85; 90 85 85" dur="1" fill="freeze" keyTimes="0;0.9;1" />
  <animateTransform id="threeTranslate_1" begin="threeRotate_1.end" attributeName="transform" type="translate" values="0 0; 0 -112.5; 0 -112.5" keyTimes="0;0.9;1" dur="1" fill="freeze" additive="sum" />
  <animate id="threeScale_1" begin="threeTranslate_1.end" attributeName="width" values="150; 15; 15" dur="2" fill="freeze" keyTimes="0;0.5;1" />
  <animate id="threeRadius_1" begin="threeTranslate_1.end" attributeName="rx" values="0; 7.5; 7.5" dur="2" fill="freeze" keyTimes="0;0.5;1" />
  <animateTransform id="threeTranslate2_1" begin="threeTranslate_1.end" attributeName="transform" type="translate" values="0 0; 67.5 -55; 67.5 -55" dur="2" fill="freeze" additive="sum" keyTimes="0;0.5;1" />
  <animateTransform id="threeResetTranslate_1" begin="threeTranslate2_1.end" attributeName="transform" type="translate" values="0 0; 0 0" dur="1" fill="freeze" />
  <animate id="threeResetRadius_1" begin="threeTranslate2_1.end" attributeName="rx" values="7.5; 0; 0" dur="1" fill="freeze" keyTimes="0;0;1" />
  <animate id="threeResetScale_1" begin="threeTranslate2_1.end" attributeName="width" values="15; 150; 150" dur="1" fill="freeze" keyTimes="0;0;1" />
</rect>
<rect x="10" y="102.5" height="15" width="150" fill="rgb(100,100,100)" r="0">
  <animateTransform id="threeRotate_2" begin="threeResetScale_1.end" attributeName="transform" type="rotate" values="0 110 110; 90 110 110; 90 110 110" dur="1" fill="freeze" keyTimes="0;0.9;1" />
  <animateTransform id="threeTranslate_2" begin="threeRotate_2.end" attributeName="transform" type="translate" values="0 0; 0 -87.5; 0 -87.5" keyTimes="0;0.9;1" dur="1" fill="freeze" additive="sum" />
  <animate id="threeScale_2" begin="threeTranslate_2.end" attributeName="width" values="150; 15; 15" dur="2" fill="freeze" keyTimes="0;0.5;1" />
  <animate id="threeRadius_2" begin="threeTranslate_2.end" attributeName="rx" values="0; 7.5; 7.5" dur="2" fill="freeze" keyTimes="0;0.5;1" />
  <animateTransform id="threeTranslate2_2" begin="threeTranslate_2.end" attributeName="transform" type="translate" values="0 0; 92.5 -55; 92.5 -55" dur="2" fill="freeze" additive="sum" keyTimes="0;0.5;1" />
  <animateTransform id="threeResetTranslate_2" begin="threeTranslate2_2.end" attributeName="transform" type="translate" values="0 0; 0 0" dur="1" fill="freeze" />
  <animate id="threeResetRadius_2" begin="threeTranslate2_2.end" attributeName="rx" values="7.5; 0; 0" dur="1" fill="freeze" keyTimes="0;0;1" />
  <animate id="threeResetScale_2" begin="threeTranslate2_2.end" attributeName="width" values="15; 150; 150" dur="1" fill="freeze" keyTimes="0;0;1" />
</rect>
<rect x="190" y="10" height="150" width="15" fill="rgb(225 29 72)" opacity="0.8" />
<circle cx="252.5" cy="60" r="7.5" fill="rgb(217 119 6)" />
<circle cx="252.5" cy="85" r="7.5" fill="rgb(13 148 136)" />
<circle cx="252.5" cy="110" r="7.5" fill="rgb(100,100,100)" />
</g>
</svg>
</div>

A matrix vector product can be seen as a list of dot products of each row with the input vector.

### 2.2 Vector matrix product as a dot product of columns with input vector

<div style="display: flex; justify-content: center; margin: 1.5rem 0;">
<svg width="370" height="170" viewBox="0 0 370 170" xmlns="http://www.w3.org/2000/svg">
<g>
<path d="M15,72.5 L5,72.5 L5,97.5 L15,97.5" stroke="#71717a" stroke-width="1" fill="none" />
<path d="M155,72.5 L165,72.5 L165,97.5 L155,97.5" stroke="#71717a" stroke-width="1" fill="none" />
<path d="M195,5 L185,5 L185,165 L195,165" stroke="#71717a" stroke-width="1" fill="none" />
<path d="M250,5 L260,5 L260,165 L250,165" stroke="#71717a" stroke-width="1" fill="none" />
<path d="M300,72.5 L290,72.5 L290,97.5 L300,97.5" stroke="#71717a" stroke-width="1" fill="none" />
<path d="M355,72.5 365,72.5 365,97.5 355,97.5" stroke="#71717a" stroke-width="1" fill="none" />
<text x="275" y="90" text-anchor="middle" fill="#27272a">=</text>
<rect x="190" y="10" width="15" height="150" fill="rgb(217 119 6)" opacity="1" />
<rect x="215" y="10" width="15" height="150" fill="rgb(13 148 136)" opacity="1" />
<rect x="240" y="10" width="15" height="150" fill="rgb(100,100,100)" opacity="1" />
<rect x="10" y="77.5" height="15" width="150" fill="rgb(225 29 72)">
  <animateTransform id="fourRotate_0" begin="0s; fourResetScale_2.end" attributeName="transform" type="rotate" values="0 85 85; 90 85 85; 90 85 85" dur="1" fill="freeze" keyTimes="0;0.9;1" />
  <animateTransform id="fourTranslate_0" begin="fourRotate_0.end" attributeName="transform" type="translate" values="0 0; 0 -112.5; 0 -112.5" keyTimes="0;0.5;1" dur="1.5" fill="freeze" additive="sum" />
  <animate id="fourScale_0" begin="fourTranslate_0.end" attributeName="width" values="150; 15; 15" dur="2" fill="freeze" keyTimes="0;0.5;1" />
  <animate id="fourRadius_0" begin="fourTranslate_0.end" attributeName="rx" values="0; 7.5; 7.5" dur="2" fill="freeze" keyTimes="0;0.5;1" />
  <animateTransform id="fourTranslate2_0" begin="fourTranslate_0.end" attributeName="transform" type="translate" values="0 0; 67.5 -105; 67.5 -105" dur="2" fill="freeze" additive="sum" keyTimes="0;0.5;1" />
  <animateTransform id="fourResetTranslate_0" begin="fourTranslate2_0.end" attributeName="transform" type="translate" values="0 0; 0 0" dur="1" fill="freeze" />
  <animate id="fourResetRadius_0" begin="fourTranslate2_0.end" attributeName="rx" values="7.5; 0; 0" dur="1" fill="freeze" keyTimes="0;0;1" />
  <animate id="fourResetScale_0" begin="fourTranslate2_0.end" attributeName="width" values="15; 150; 150" dur="1" fill="freeze" keyTimes="0;0;1" />
</rect>
<rect x="10" y="77.5" height="15" width="150" fill="rgb(225 29 72)">
  <animateTransform id="fourRotate_1" begin="fourResetScale_0.end" attributeName="transform" type="rotate" values="0 85 85; 90 85 85; 90 85 85" dur="1" fill="freeze" keyTimes="0;0.9;1" />
  <animateTransform id="fourTranslate_1" begin="fourRotate_1.end" attributeName="transform" type="translate" values="0 0; 0 -137.5; 0 -137.5" keyTimes="0;0.5;1" dur="1.5" fill="freeze" additive="sum" />
  <animate id="fourScale_1" begin="fourTranslate_1.end" attributeName="width" values="150; 15; 15" dur="2" fill="freeze" keyTimes="0;0.5;1" />
  <animate id="fourRadius_1" begin="fourTranslate_1.end" attributeName="rx" values="0; 7.5; 7.5" dur="2" fill="freeze" keyTimes="0;0.5;1" />
  <animateTransform id="fourTranslate2_1" begin="fourTranslate_1.end" attributeName="transform" type="translate" values="0 0; 67.5 -105; 67.5 -105" dur="2" fill="freeze" additive="sum" keyTimes="0;0.5;1" />
  <animateTransform id="fourResetTranslate_1" begin="fourTranslate2_1.end" attributeName="transform" type="translate" values="0 0; 0 0" dur="1" fill="freeze" />
  <animate id="fourResetRadius_1" begin="fourTranslate2_1.end" attributeName="rx" values="7.5; 0; 0" dur="1" fill="freeze" keyTimes="0;0;1" />
  <animate id="fourResetScale_1" begin="fourTranslate2_1.end" attributeName="width" values="15; 150; 150" dur="1" fill="freeze" keyTimes="0;0;1" />
</rect>
<rect x="10" y="77.5" height="15" width="150" fill="rgb(225 29 72)">
  <animateTransform id="fourRotate_2" begin="fourResetScale_1.end" attributeName="transform" type="rotate" values="0 85 85; 90 85 85; 90 85 85" dur="1" fill="freeze" keyTimes="0;0.9;1" />
  <animateTransform id="fourTranslate_2" begin="fourRotate_2.end" attributeName="transform" type="translate" values="0 0; 0 -162.5; 0 -162.5" keyTimes="0;0.5;1" dur="1.5" fill="freeze" additive="sum" />
  <animate id="fourScale_2" begin="fourTranslate_2.end" attributeName="width" values="150; 15; 15" dur="2" fill="freeze" keyTimes="0;0.5;1" />
  <animate id="fourRadius_2" begin="fourTranslate_2.end" attributeName="rx" values="0; 7.5; 7.5" dur="2" fill="freeze" keyTimes="0;0.5;1" />
  <animateTransform id="fourTranslate2_2" begin="fourTranslate_2.end" attributeName="transform" type="translate" values="0 0; 67.5 -105; 67.5 -105" dur="2" fill="freeze" additive="sum" keyTimes="0;0.5;1" />
  <animateTransform id="fourResetTranslate_2" begin="fourTranslate2_2.end" attributeName="transform" type="translate" values="0 0; 0 0" dur="1" fill="freeze" />
  <animate id="fourResetRadius_2" begin="fourTranslate2_2.end" attributeName="rx" values="7.5; 0; 0" dur="1" fill="freeze" keyTimes="0;0;1" />
  <animate id="fourResetScale_2" begin="fourTranslate2_2.end" attributeName="width" values="15; 150; 150" dur="1" fill="freeze" keyTimes="0;0;1" />
</rect>
<circle cx="302.5" cy="85" r="7.5" fill="rgb(217 119 6)" />
<circle cx="327.5" cy="85" r="7.5" fill="rgb(13 148 136)" />
<circle cx="352.5" cy="85" r="7.5" fill="rgb(100,100,100)" />
</g>
</svg>
</div>

A vector matrix product can be seen as a list of dot products of each column with the input vector.

One needs to have some understanding of the dot product to appreciate this interpretation. It is covered in more detail in [The Dot Product of Two Vectors](/la/10_dot_product) (paywalled).

## 3. Interpretation #3: Matrix-matrix product as the sum of outer products

This is a less common interpretation but is quite useful. An outer product is a function that takes two vectors of arbitrary lengths and returns a matrix. There are two ways to look at this matrix:

1. Each column of the output matrix is the first vector scaled by the corresponding component of the second vector.
2. Each row of the output matrix is the second vector scaled by the corresponding component of the first vector.

A matrix-matrix product can be seen as a sum of outer products of the columns of the first matrix with the rows of the second matrix. This interpretation is useful in studying the spectral properties of symmetric matrices. Eg the product of a symmetric matrix with a vector can be seen as a sum of projections of the vector onto the eigenvectors of the matrix (scaled by the corresponding eigenvalues).

<div style="display: flex; justify-content: center; margin: 1.5rem 0;">
<svg width="425" height="170" viewBox="0 0 425 170" xmlns="http://www.w3.org/2000/svg">
<g>
<rect x="10" y="10" width="15" height="150" fill="rgb(217 119 6)" opacity="1">
  <animateMotion id="fiveColumnMotion_0" begin="0s; fiveColumnMotion_2.end" path="M0,0 L185,0" dur="3" keyTimes="0; 0.5; 1" keyPoints="0; 1; 1" fill="freeze" />
</rect>
<rect x="35" y="10" width="15" height="150" fill="rgb(13 148 136)" opacity="1">
  <animateMotion id="fiveColumnMotion_1" begin="fiveColumnMotion_0.end" path="M0,0 L250,0" dur="3" keyTimes="0; 0.5; 1" keyPoints="0; 1; 1" fill="freeze" />
</rect>
<rect x="60" y="10" width="15" height="150" fill="rgb(100,100,100)" opacity="1">
  <animateMotion id="fiveColumnMotion_2" begin="fiveColumnMotion_1.end" path="M0,0 L315,0" dur="3" keyTimes="0; 0.5; 1" keyPoints="0; 1; 1" fill="freeze" />
</rect>
<rect x="10" y="10" width="15" height="150" fill="rgb(217 119 6)" opacity="1"></rect>
<rect x="35" y="10" width="15" height="150" fill="rgb(13 148 136)" opacity="1"></rect>
<rect x="60" y="10" width="15" height="150" fill="rgb(100,100,100)" opacity="1"></rect>
<rect x="105" y="52.5" height="15" width="40" fill="rgb(217 119 6)" opacity="1">
  <animateMotion id="fiveRowMotion_0" begin="0s; fiveRowMotion_2.end" path="M0,0 L90,-42.5" dur="3" keyTimes="0; 0.5; 1" keyPoints="0; 1; 1" fill="freeze" />
</rect>
<rect x="105" y="77.5" height="15" width="40" fill="rgb(13 148 136)" opacity="1">
  <animateMotion id="fiveRowMotion_1" begin="fiveRowMotion_0.end" path="M0,0 L180,-67.5" dur="3" keyTimes="0; 0.5; 1" keyPoints="0; 1; 1" fill="freeze" />
</rect>
<rect x="105" y="102.5" height="15" width="40" fill="rgb(100,100,100)" opacity="1">
  <animateMotion id="fiveRowMotion_2" begin="fiveRowMotion_1.end" path="M0,0 L270,-92.5" dur="3" keyTimes="0; 0.5; 1" keyPoints="0; 1; 1" fill="freeze" />
</rect>
<rect x="105" y="52.5" height="15" width="40" fill="rgb(217 119 6)" opacity="1"></rect>
<rect x="105" y="77.5" height="15" width="40" fill="rgb(13 148 136)" opacity="1"></rect>
<rect x="105" y="102.5" height="15" width="40" fill="rgb(100,100,100)" opacity="1"></rect>
<rect x="195" y="10" width="15" height="150" fill="rgb(217 119 6)" opacity="1"></rect>
<rect x="285" y="10" width="15" height="150" fill="rgb(13 148 136)" opacity="1"></rect>
<rect x="375" y="10" width="15" height="150" fill="rgb(100,100,100)" opacity="1"></rect>
<rect x="195" y="10" height="15" width="40" fill="rgb(217 119 6)" opacity="1"></rect>
<rect x="285" y="10" height="15" width="40" fill="rgb(13 148 136)" opacity="1"></rect>
<rect x="375" y="10" height="15" width="40" fill="rgb(100,100,100)" opacity="1"></rect>
<path d="M15,5 L5,5 L5,165 L15,165" stroke="#71717a" stroke-width="1" fill="none"></path>
<path d="M70,5 L80,5 L80,165 L70,165" stroke="#71717a" stroke-width="1" fill="none"></path>
<path d="M110,47.5 L100,47.5 L100,122.5 L110,122.5" stroke="#71717a" stroke-width="1" fill="none"></path>
<path d="M140,47.5 L150,47.5 L150,122.5 L140,122.5" stroke="#71717a" stroke-width="1" fill="none"></path>
<path d="M200,5 L190,5 L190,165 L200,165" stroke="#71717a" stroke-width="1" fill="none"></path>
<path d="M230,5 L240,5 L240,165 L230,165" stroke="#71717a" stroke-width="1" fill="none"></path>
<path d="M290,5 L280,5 L280,165 L290,165" stroke="#71717a" stroke-width="1" fill="none"></path>
<path d="M320,5 L330,5 L330,165 L320,165" stroke="#71717a" stroke-width="1" fill="none"></path>
<path d="M380,5 L370,5 L370,165 L380,165" stroke="#71717a" stroke-width="1" fill="none"></path>
<path d="M410,5 L420,5 L420,165 L410,165" stroke="#71717a" stroke-width="1" fill="none"></path>
<text x="170" y="90" text-anchor="middle" fill="#27272a">=</text>
<text x="260" y="90" text-anchor="middle" fill="#27272a">+</text>
<text x="350" y="90" text-anchor="middle" fill="#27272a">+</text>
</g>
</svg>
</div>

A matrix-matrix product can be seen as the sum of the outer products of the columns of the first matrix with the rows of the second.

This is covered in more detail in [Symmetric Mv Product](/la/21_symmetric_matrix_vector_product) (paywalled).

I find this interpretation quite beautiful. Note that when the number of columns in the second matrix is one, it reduces to the weighted sum of columns interpretation. Similarly when the number of rows in the first matrix is one, it reduces to the weighted sum of rows interpretation.

---

## Related articles:

- [The Kronecker Product Visualized](/blog/kronecker_product)
