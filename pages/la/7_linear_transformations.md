---
title: Linear transformations and change of basis
description: Reach the same point with two different sets of vectors, see matrices as encoders and decoders, and learn how a change of basis works.
canvas: left
sidebar: _ebook.md
---

# 7. Linear transformations

<details>
<summary>Review</summary>

A matrix-vector product $Mv$ is a weighted sum of the columns of $M$, the inverse $M^{-1}$ undoes the action of $M$, and a matrix-matrix product composes two transformations. We will now use all three ideas together.

</details>

---

In this chapter we look at the same point through the eyes of two different matrices, and discover the idea of _changing the basis_.

## 7.1 Reaching a point in two different ways

```python-editor collapsed
pie.clear()
pie.scalar(60, out='unit')
GOLD, PINK, GREEN = '#a16207', '#be185d', '#047857'
p = pie.point(4, 4, out='p', fill=GOLD)
pie.text('P (4,4)', 4.2, 4.4, 12, out='box_p')
```

Let's say you want to reach the point `P = [4,4]` by taking a weighted sum of two vectors (_aka_ a linear combination of two vectors).

```python-editor collapsed
pie.la_vec2d(2, -3, out='va1', stroke=PINK)
pie.la_vec2d(3, 1, out='va2', stroke=PINK)
pie.text('a₁', 2.4, -3.6, 12, out='lbl_a1', stroke=PINK)
pie.text('a₂', 3.6, 1.2, 12, out='lbl_a2', stroke=PINK)
```

The first pair of vectors is given by the matrix $A = \textcolor{#be185d}{\begin{bmatrix} 2 & 3 \\ -3 & 1 \end{bmatrix}}$. These are the pink vectors on the canvas.

```python-editor collapsed
pie.la_vec2d(1, 2, out='vb1', stroke=GREEN)
pie.la_vec2d(-3, 2, out='vb2', stroke=GREEN)
pie.text('b₁', 1.2, 2.4, 12, out='lbl_b1', stroke=GREEN)
pie.text('b₂', -3.6, 2.4, 12, out='lbl_b2', stroke=GREEN)
```

The second pair of vectors is given by the matrix $B = \textcolor{#047857}{\begin{bmatrix} 1 & -3 \\ 2 & 2 \end{bmatrix}}$. These are the green vectors.

In other words, we want to find values $a_1, a_2$ and $b_1, b_2$ such that

$$\textcolor{#be185d}{\begin{bmatrix} 2 & 3 \\ -3 & 1 \end{bmatrix}} \begin{bmatrix} \textcolor{#be185d}{a_1} \\ \textcolor{#be185d}{a_2} \end{bmatrix} = \begin{bmatrix} 4 \\ 4 \end{bmatrix} \quad \text{and} \quad \textcolor{#047857}{\begin{bmatrix} 1 & -3 \\ 2 & 2 \end{bmatrix}} \begin{bmatrix} \textcolor{#047857}{b_1} \\ \textcolor{#047857}{b_2} \end{bmatrix} = \begin{bmatrix} 4 \\ 4 \end{bmatrix}$$

The solution to these equations must be obvious by now:

$$
\begin{aligned}
\begin{bmatrix} \textcolor{#be185d}{a_1} \\ \textcolor{#be185d}{a_2} \end{bmatrix} &= A^{-1} \begin{bmatrix} 4 \\ 4 \end{bmatrix} \\
&= \frac{1}{11} \begin{bmatrix} 1 & -3 \\ 3 & 2 \end{bmatrix} \begin{bmatrix} 4 \\ 4 \end{bmatrix} \\
&\approx \begin{bmatrix} -0.73 \\ 1.82 \end{bmatrix}
\end{aligned}
$$

$$
\begin{aligned}
\begin{bmatrix} \textcolor{#047857}{b_1} \\ \textcolor{#047857}{b_2} \end{bmatrix} &= B^{-1} \begin{bmatrix} 4 \\ 4 \end{bmatrix} \\
&= \frac{1}{8} \begin{bmatrix} 2 & 3 \\ -2 & 1 \end{bmatrix} \begin{bmatrix} 4 \\ 4 \end{bmatrix} \\
&= \begin{bmatrix} 2.5 \\ -0.5 \end{bmatrix}
\end{aligned}
$$

You can see both walks on the canvas. Scale and add the pink pair to reach `P`:

```python-editor collapsed
pie.la_weighted_sum([[2, 3], [-3, 1]], [-0.7273, 1.8182], out='suma', stroke=PINK)
pie.text('a₁·v₁ + a₂·v₂ = P', -3.8, -3, 12, 3, -1, out='cap_walk_a', stroke=PINK)
```

Then scale and add the green pair to reach the same point along a completely different route:

```python-editor collapsed
pie.la_weighted_sum([[1, -3], [2, 2]], [2.5, -0.5], out='sumb', stroke=GREEN)
pie.text('b₁·w₁ + b₂·w₂ = P', 4.3, -3.3, 12, 3, -1, out='cap_walk_b', stroke=GREEN)
```

But let's try to understand _what_ these equations mean in a slightly less rigorous and more _visceral_ way.

---

### 7.1.1 A change in perspective

```python-editor collapsed
import numpy as np

pie.clear()
pie.scalar(60, out='unit')
GOLD, PINK, GREEN = '#a16207', '#be185d', '#047857'
p = pie.point(4, 4, out='p', fill=GOLD)
pie.text('P (4,4)', 4.2, 4.4, 12, out='box_p')
qa = pie.point(-0.73, 1.82, out='qa', fill=PINK)
qb = pie.point(2.5, -0.5, out='qb', fill=GREEN)
pie.text('(-0.73, 1.82)', -2.4, 2.2, 12, out='box_qa')
pie.text('(2.5, -0.5)', 2.7, -0.9, 12, out='box_qb')

# The head of an arrow, a fraction t of the way from start to end.
def arrow_head(start, end, t):
    start = np.array(start)
    return (start + t * (np.array(end) - start)).tolist()

# One weight per direction: the chosen one's arrows grow to full length, the other's shrink to nothing
direction = pie.scalar([1, 0], out='direction')
head = pie.lift(arrow_head, pie.Point)
pie.annotate_arrow(qa, head(qa, p, direction[0], hidden=True), 0.1, out='fwd_a', stroke=PINK)
pie.annotate_arrow(qb, head(qb, p, direction[0], hidden=True), 0.1, out='fwd_b', stroke=GREEN)
pie.annotate_arrow(p, head(p, qa, direction[1], hidden=True), 0.1, out='back_a', stroke=PINK)
pie.annotate_arrow(p, head(p, qb, direction[1], hidden=True), 0.1, out='back_b', stroke=GREEN)

label = pie.lift(lambda w, forward, inverse: forward if w > 0.5 else inverse, pie.Text)
pie.text(label(direction[0], 'A', 'A⁻¹'), 1.3, 3.3, 16, out='box_a', stroke=PINK)
pie.text(label(direction[0], 'B', 'B⁻¹'), 3.5, 1.5, 16, out='box_b', stroke=GREEN)

pie.ui.animated_radio(direction, options=['A, B', 'A⁻¹, B⁻¹'], label='Arrows of:')
```

Note that both the input points $\textcolor{#be185d}{\begin{bmatrix} a_1 \\ a_2 \end{bmatrix}}, \textcolor{#047857}{\begin{bmatrix} b_1 \\ b_2 \end{bmatrix}}$ and the output point $\begin{bmatrix} 4 \\ 4 \end{bmatrix}$ lie in the same 2d-plane. Thus we can think of the matrix $\textcolor{#be185d}{A}$ as mapping the pink point $\textcolor{#be185d}{\begin{bmatrix} -0.73 \\ 1.82 \end{bmatrix}}$ to $\textcolor{#a16207}{P}$, and the matrix $\textcolor{#047857}{B}$ as mapping the green point $\textcolor{#047857}{\begin{bmatrix} 2.5 \\ -0.5 \end{bmatrix}}$ to $\textcolor{#a16207}{P}$.

We can show these two mappings by drawing an arrow from each input point to the output point.

The inverse matrices do the exact opposite. They send the point $\textcolor{#a16207}{P} = \begin{bmatrix} 4 \\ 4 \end{bmatrix}$ back to $\textcolor{#be185d}{\begin{bmatrix} -0.73 \\ 1.82 \end{bmatrix}}$ and $\textcolor{#047857}{\begin{bmatrix} 2.5 \\ -0.5 \end{bmatrix}}$ respectively. Switch between the two sets of arrows with the buttons below the editor.

---

### 7.1.2 Yet another change in perspective: matrices as encoders and decoders
In the above section we solved the following question: for what values of $a_1, a_2$ is $\textcolor{#be185d}{\begin{bmatrix} 2 & 3 \\ -3 & 1 \end{bmatrix}} \begin{bmatrix} a_1 \\ a_2 \end{bmatrix} = \begin{bmatrix} 4 \\ 4 \end{bmatrix}$? Let's reframe this question in a more _human_ language:

Matrix $A$ multiplied by (the code for matrix $A$ to get to the destination) = the destination.

$$\underbrace{\textcolor{#be185d}{\begin{bmatrix} 2 & 3 \\ -3 & 1 \end{bmatrix}}}_{\text{matrix } A} \underbrace{\begin{bmatrix} a_1 \\ a_2 \end{bmatrix}}_{\text{code to reach the destination}} = \underbrace{\begin{bmatrix} 4 \\ 4 \end{bmatrix}}_{\text{destination}}$$

> We can consider the `code for matrix A to get to the destination` as an `encoding of the destination by matrix A`. 

Finally, we can frame the question as: **what is the encoding `[a1,a2]` of the vector `P = [4,4]` by the matrix `A`?** This encoding `[a1,a2]` is how the matrix `A` _sees_ the point `P = [4,4]`. An internal dialog of the matrix `A` looks something like:

- _"I need to take `a1 = -0.73` steps along my first vector and `a2 = 1.82` steps along my second vector to get to `P = [4,4]`."_ Take the pink walk:

```python-editor collapsed
pie.clear()
pie.scalar(50, out='unit')
GOLD, PINK, GREEN = '#a16207', '#be185d', '#047857'
pie.point(4, 4, out='p', fill=GOLD)
pie.text('P (4,4)', 4.2, 4.4, 12, out='box_p')
pie.la_vec2d(2, -3, out='va1', stroke=PINK)
pie.la_vec2d(3, 1, out='va2', stroke=PINK)
pie.la_weighted_sum([[2, 3], [-3, 1]], [-0.7273, 1.8182], out='suma', stroke=GOLD)
pie.text('a₁', 2.4, -3.6, 12, out='lbl_a1', stroke=PINK)
pie.text('a₂', 3.6, 1.2, 12, out='lbl_a2', stroke=PINK)
```

Similarly, an internal dialog of matrix `B` looks like:

- _"I need to take `b1 = 2.5` steps along my first vector and `b2 = -0.5` steps along my second vector to get to `P = [4,4]`."_ Take the green walk:

```python-editor collapsed
pie.clear()
pie.scalar(50, out='unit')
GOLD, GREEN = '#a16207', '#047857'
pie.point(4, 4, out='p', fill=GOLD)
pie.text('P (4,4)', 4.2, 4.4, 12, out='box_p')
pie.la_vec2d(1, 2, out='vb1', stroke=GREEN)
pie.la_vec2d(-3, 2, out='vb2', stroke=GREEN)
pie.la_weighted_sum([[1, -3], [2, 2]], [2.5, -0.5], out='sumb', stroke=GOLD)
pie.text('b₁', 1.45, 1.78, 12, out='lbl_b1', stroke=GREEN)
pie.text('b₂', -3.6, 2.4, 12, out='lbl_b2', stroke=GREEN)
```

This brings us to an interesting scenario: say Bob is using matrix `A` to encode any given point in 2d-space and Alice is using matrix `B` to encode any given point in 2d-space. How can Alice and Bob communicate?

---

## 7.2 Change of basis

```python-editor collapsed
pie.clear()
pie.scalar(25, out='unit')
GOLD, PINK, GREEN = '#a16207', '#be185d', '#047857'
pie.la_vec2d(2, -3, out='va1', stroke=PINK)
pie.la_vec2d(3, 1, out='va2', stroke=PINK)
pie.text('a₁', 2.4, -3.6, 12, out='lbl_a1', stroke=PINK)
pie.text('a₂', 3.6, 1.2, 12, out='lbl_a2', stroke=PINK)
```

Since the columns of a matrix form the basis of how to _walk_ in the entire output space, they are also known as **basis vectors**. Now let's understand the problem further:

- According to Bob, a vector encoding $x = \begin{bmatrix} 2 \\ 3 \end{bmatrix}$ denotes the point in space one can reach after taking `2` steps along the first of Bob's pink basis vectors and `3` steps along the second.
- What is the vector encoding according to Alice?

Note that the vector encoding $x = \begin{bmatrix} 2 \\ 3 \end{bmatrix}$ by the matrix $A = \textcolor{#be185d}{\begin{bmatrix} 2 & 3 \\ -3 & 1 \end{bmatrix}}$ is actually the point

$$
\begin{aligned}
Ax &= \textcolor{#be185d}{\begin{bmatrix} 2 & 3 \\ -3 & 1 \end{bmatrix}} \begin{bmatrix} 2 \\ 3 \end{bmatrix} \\
&= \begin{bmatrix} 13 \\ -3 \end{bmatrix}
\end{aligned}
$$

```python-editor collapsed
pie.point(13, -3, out='pdec', fill=GOLD)
pie.text('Ax = (13, -3)', 10.5, -4.2, 12, out='box_dec')
```

You can think of this as _decoding_ the encoded vector: walk 2 steps along the first pink vector and 3 steps along the second to land on the decoded point.

```python-editor collapsed
pie.la_weighted_sum([[2, 3], [-3, 1]], [2, 3], out='dec', stroke=PINK)
pie.text('Decode: 2·v₁ + 3·v₂ = Ax', -9, -6, 12, 0, 0, out='cap_decode_a', stroke=PINK)
```

Now Alice needs to _encode_ this decoded point using her own green basis vectors - the matrix `B`.

```python-editor collapsed
pie.la_vec2d(1, 2, out='vb1', stroke=GREEN)
pie.la_vec2d(-3, 2, out='vb2', stroke=GREEN)
pie.text('b₁', 1.2, 2.4, 12, out='lbl_b1', stroke=GREEN)
pie.text('b₂', -3.6, 2.4, 12, out='lbl_b2', stroke=GREEN)
```

This is exactly what we did above when we reframed the question:

$$
\begin{aligned}
B^{-1}(Ax) &= \frac{1}{8} \begin{bmatrix} 2 & 3 \\ -2 & 1 \end{bmatrix} \begin{bmatrix} 13 \\ -3 \end{bmatrix} \\
&= \begin{bmatrix} 2.125 \\ -3.625 \end{bmatrix}
\end{aligned}
$$

Indeed, walking 2.125 steps along Alice's first green vector and -3.625 steps along her second lands on exactly the same point.

```python-editor collapsed
pie.la_weighted_sum([[1, -3], [2, 2]], [2.125, -3.625], out='enc', stroke=GREEN)
pie.text('Encode: 2.125·w₁ - 3.625·w₂ = Ax', -9, 3.5, 12, 0, 0, out='cap_encode_b', stroke=GREEN)
```

Let us repeat what we just did here:

- Bob shared the location of a point $x$ with Alice. But the location `x = [2,3]` was encoded by matrix `A`.
- Alice knew the location was `2` steps along the first basis vector of Bob's matrix `A` and `3` steps along the second basis vector of Bob's matrix.
- But Alice wanted to encode this location according to her own matrix `B`.
- So Alice first _decoded_ the vector $x$ to get the decoded point $Ax$.
- Then she used her own matrix `B` to encode the point $Ax$. That's how she got $B^{-1}Ax$.

$$\underbrace{\textcolor{#047857}{B^{-1}}}_{\text{encode with } B} \; \underbrace{\textcolor{#be185d}{A}}_{\text{decode from } A} \; x$$

Another way to describe what we just did is - we changed the basis of the vector $x$ from matrix $A$ to matrix $B$.

Similarly, if you want to change the basis of a vector $x$ from matrix $B$ to matrix $A$, the new vector under the change of basis is $A^{-1}Bx$.

$$\underbrace{\textcolor{#be185d}{A^{-1}}}_{\text{encode with } A} \; \underbrace{\textcolor{#047857}{B}}_{\text{decode from } B} \; x$$

Note that these formulae are applicable to a vector $x$ of any dimension, not just two dimensions. The line of reasoning that we applied did not depend on the dimensionality of the vectors.

---

## 7.3 A simple application

```python-editor collapsed
pie.clear()
pie.scalar(50, out='unit')
GOLD, PINK, GREEN = '#a16207', '#be185d', '#047857'
pie.la_vec2d(2, 3, out='va1', stroke=PINK)
pie.la_vec2d(3, -2, out='va2', stroke=PINK)
pie.text('a₁', 2.4, 3.6, 12, out='lbl_a1', stroke=PINK)
pie.text('a₂', 3.6, -2.4, 12, out='lbl_a2', stroke=PINK)
pie.la_vec2d(-3, 1, out='vb1', stroke=GREEN)
pie.la_vec2d(1, -3, out='vb2', stroke=GREEN)
pie.text('b₁', -3.6, 1.2, 12, out='lbl_b1', stroke=GREEN)
pie.text('b₂', 1.2, -3.6, 12, out='lbl_b2', stroke=GREEN)
pie.text('Player 1: A (pink)   Player 2: B (green)', 0, 5.3, 12, 4.4, -1, out='cap_players')
```

Change of basis has a LOT of uses. A simple use case is if you are building a robot (or a video game) in which you have two components (or players) in different orientations. You want to make sure that they can communicate correctly. Here is a visual example. We have:

- Player 1 with the basis $A = \textcolor{#be185d}{\begin{bmatrix} 2 & 3 \\ 3 & -2 \end{bmatrix}}$ - the pink vectors
- Player 2 with the basis $B = \textcolor{#047857}{\begin{bmatrix} -3 & 1 \\ 1 & -3 \end{bmatrix}}$ - the green vectors
- Player 1 announces a location: $x = \begin{bmatrix} 1 \\ 1 \end{bmatrix}$ under their own basis `A`.

First, decode player 1's message to the _canonical_ basis $\begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}$:

$$
\begin{aligned}
Ax &= \textcolor{#be185d}{\begin{bmatrix} 2 & 3 \\ 3 & -2 \end{bmatrix}} \begin{bmatrix} 1 \\ 1 \end{bmatrix} \\
&= \begin{bmatrix} 5 \\ 1 \end{bmatrix}
\end{aligned}
$$

```python-editor collapsed
pie.point(5, 1, out='pdec', fill=GOLD)
pie.text('Ax = (5, 1)', 5.2, 1.3, 12, out='box_dec')
```

Take 1 step along each of player 1's vectors to reach the actual location.

```python-editor collapsed
pie.la_weighted_sum([[2, 3], [3, -2]], [1, 1], out='dec', stroke=PINK)
pie.text('Ax = v₁ + v₂', -2, -2, 12, 3, -1, out='cap_decode_a', stroke=PINK)
```

Then encode it under player 2's basis:

$$
\begin{aligned}
B^{-1}Ax &= \frac{1}{8} \begin{bmatrix} -3 & -1 \\ -1 & -3 \end{bmatrix} \begin{bmatrix} 5 \\ 1 \end{bmatrix} \\
&= \begin{bmatrix} -2 \\ -1 \end{bmatrix}
\end{aligned}
$$

Indeed, taking -2 steps along player 2's first vector and -1 steps along the second reaches exactly the same location. Player 2 now knows the point as `[-2,-1]` - the same physical location, seen through a different basis.

```python-editor collapsed
pie.la_weighted_sum([[-3, 1], [1, -3]], [-2, -1], out='enc', stroke=GREEN)
pie.text('B⁻¹Ax = -2w₁ - w₂', 5.2, 3.5, 12, 1.8, -1, out='cap_encode_b', stroke=GREEN)
```

In the next chapter, we will use matrices to draw polynomial curves.

---

[← 6. Matrix-matrix multiplication](/la/6_matrix_matrix_multiplication)  ·  [8. Polynomial curves are vectors in disguise →](/la/8_polynomial_curves)
