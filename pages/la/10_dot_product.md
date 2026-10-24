---
title: 10. Dot product
canvas: left
---

# 10. Dot product

<details>
<summary>Review</summary>

A Bezier curve is nothing but a weighted sum of its anchor points, where the weights are the basis polynomials $\textcolor{#1d4ed8}{(1-t)^2}, \textcolor{#be185d}{2t(1-t)}, \textcolor{#047857}{t^2}$ (for degree two) that are non-negative and add up to `1` for every $t \in [0,1]$.

</details>

In this chapter we study one of the most important operations in linear algebra - the dot product. It takes two vectors and returns a single number, and hidden inside that number is both the geometry of angles and the mechanics of matrix-vector multiplication.

---

## 10.1 Getting started: definition and obvious properties
A dot product is a function of two vectors of the **same dimensionality**. Its output is a single scalar number, defined as:

$$\langle \begin{bmatrix} p_1 \\ p_2 \\ \vdots \\ p_n \end{bmatrix}, \begin{bmatrix} q_1 \\ q_2 \\ \vdots \\ q_n \end{bmatrix} \rangle = \sum_{i=1}^{n} p_i q_i$$

It can also be seen as a matrix multiplication of a row vector with a column vector:

$$\begin{bmatrix} p_1 & p_2 & \cdots & p_n \end{bmatrix} \begin{bmatrix} q_1 \\ q_2 \\ \vdots \\ q_n \end{bmatrix} = \sum_{i=1}^{n} p_i q_i$$

The dot product of two vectors `p` and `q` is usually denoted by the expression $\langle p, q \rangle$.

### 10.1.1 Properties
- It is **commutative**: $\langle p, q \rangle = \langle q, p \rangle$. This is easy to see, since $\sum_i p_i q_i = \sum_i q_i p_i$.
- It is **linear**. This gives us $\langle cp, q \rangle = \langle p, cq \rangle = c\langle p, q \rangle$ where `c` is a real number, and $\langle p, q + r \rangle = \langle p, q \rangle + \langle p, r \rangle$.
- Combining commutativity and linearity, it is **bilinear**. For vectors `p, q, r, s` we can expand a dot product of sums term by term: $\langle p + q, \; r + s \rangle = \langle p, r \rangle + \langle p, s \rangle + \langle q, r \rangle + \langle q, s \rangle$.

---

## 10.2 Viewing trigonometry through the lens of linear algebra
Recall that the norm (or L2-norm) of a vector is basically how long the vector is, denoted by the notation $\lVert \cdot \rVert$. In other words, $\lVert v \rVert = \sqrt{v_1^2 + v_2^2 + \ldots + v_n^2}$. Thus, scaling a vector by `c` scales its length by `c` as well. Also recall that a **unit vector** is just a vector whose norm is `1`.

Now note that the dot product of a vector with itself is equal to the squared length of that vector:

$$\langle v, v \rangle = v_1^2 + v_2^2 + \ldots + v_n^2 = \lVert v \rVert^2$$

This lets us express any vector as a scaled version of a unit vector: $$v = \underbrace{\textcolor{#0284c7}{\lVert v \rVert}}_{\textcolor{#0284c7}{\text{magnitude}}} \, \underbrace{\textcolor{#be185d}{v_{unit}}}_{\textcolor{#be185d}{\text{direction}}}$$ where $v_{unit}$ is a vector in the same direction as $v$ but with length `1`.

This naive-looking formula is quite powerful! It reduces a vector of any length to a single number related to its length, which lets us view trigonometric problems through the lens of linear algebra. Let's look at an example.

---

```python-editor collapsed
pie.clear()
pie.scalar(200, out='unit')
TEAL, PINK, GOLD, GRAY = '#0d9488', '#be185d', '#ca8a04', '#71717a'
p0 = pie.point(0, 0, out='p0', hidden=True)
pie.circle(p0, 1, out='circ', stroke=GRAY)
pie.la_vec2d(0.5, 0.866, out='veca', stroke=TEAL)
pie.la_vec2d(-0.866, 0.5, out='vecb', stroke=PINK)
pta = pie.point(0.5, 0.866, out='pta', hidden=True)
ptb = pie.point(-0.866, 0.5, out='ptb', hidden=True)
pie.line(ptb, pta, out='cside', stroke=GOLD)
pie.text('a', 0.28, 0.55, 16, out='label_a', stroke=TEAL)
pie.text('b', -0.5, 0.35, 16, out='label_b', stroke=PINK)
pie.text('c = a − b', -0.4, 0.85, 16, out='label_c', stroke=GOLD)
pie.arc(p0, 0.3, 60, 150, out='theta_arc', stroke=GOLD)
pie.text('θ', -0.05, 0.38, 16, out='theta_label')
```

Consider a triangle with sides `a, b, c` such that the sides `a, b` have length `1` and the angle between them is $\theta$. Here vector a and vector b are two unit vectors sitting on the unit circle, and the third side, the vector $c = a - b$, joins the tip of `b` to the tip of `a`. Its length is exactly the length of side `c`. Applying the **law of cosines** and viewing lengths as norms gives us:

$$
\begin{aligned}
\lVert a - b \rVert^2 &= 1 + 1 - 2\cos\theta \quad \text{(law of cosines, with } \lVert a \rVert = \lVert b \rVert = 1 \text{)} \\
\Rightarrow \langle a - b, \; a - b \rangle &= 2 - 2\cos\theta \\
\Rightarrow \lVert a \rVert^2 + \lVert b \rVert^2 - \langle a, b \rangle - \langle b, a \rangle &= 2 - 2\cos\theta \quad \text{(expanding via bilinearity)} \\
\Rightarrow 1 + 1 - 2\langle a, b \rangle &= 2 - 2\cos\theta \\
\Rightarrow \langle a, b \rangle &= \cos\theta
\end{aligned}
$$

In general, if $\textcolor{#1d4ed8}{p}$ and $\textcolor{#be185d}{q}$ are two vectors of the same dimensionality with angle $\theta$ between them, we can pull the norms out using bilinearity:

$$
\begin{aligned}
\langle \textcolor{#1d4ed8}{p}, \textcolor{#be185d}{q} \rangle &= \langle \lVert \textcolor{#1d4ed8}{p} \rVert\, \textcolor{#1d4ed8}{p_{unit}}, \; \lVert \textcolor{#be185d}{q} \rVert\, \textcolor{#be185d}{q_{unit}} \rangle \\
&= \lVert \textcolor{#1d4ed8}{p} \rVert \, \lVert \textcolor{#be185d}{q} \rVert \, \langle \textcolor{#1d4ed8}{p_{unit}}, \textcolor{#be185d}{q_{unit}} \rangle \\
&= \lVert \textcolor{#1d4ed8}{p} \rVert \, \lVert \textcolor{#be185d}{q} \rVert \cos\theta
\end{aligned}
$$

where $\textcolor{#1d4ed8}{p_{unit}}, \textcolor{#be185d}{q_{unit}}$ are the unit vectors corresponding to $\textcolor{#1d4ed8}{p}$ and $\textcolor{#be185d}{q}$. In other words, **the dot product of two vectors is the product of their lengths times the cosine of the angle between them** - and for unit vectors it is just the cosine of that angle.

#### The proof works in any dimension
This property is not limited to 2D. The proof above only used the law of cosines and the algebraic properties of the dot product (commutativity, bilinearity), so it holds for vectors of any dimension. See the [Law of cosines](https://en.wikipedia.org/wiki/Law_of_cosines) for details.

---

## 10.3 When is the dot product zero?
Since $\langle p, q \rangle = \lVert p \rVert \, \lVert q \rVert \cos\theta$, the sign of the dot product is the sign of $\cos\theta$:

- The dot product is **zero** exactly when the two vectors are **perpendicular** ($\theta = 90°$). This holds in any dimension, not just 2D.
- It is **positive** when the angle between them is less than `90°`, and **negative** when it is greater than `90°`.

Let's see this for two 2-dimensional unit vectors `A` and `B`. We keep `A` fixed along the x-axis and rotate `B`:

```python-editor collapsed
import math

pie.clear()
pie.scalar(200, out='unit')
TEAL, PINK, GRAY = '#0d9488', '#be185d', '#71717a'
pie.circle(pie.point(0, 0, out='p0', hidden=True), 1, out='circ', stroke=GRAY)
angle_b = pie.scalar(1.047, out='angle_b')
# B is the unit vector at angle_b (in radians), and its label sits just past its tip
on_circle = pie.lift(lambda angle, r, axis: r * (math.cos(angle) if axis == 'x' else math.sin(angle)), pie.Scalar)
pie.la_vec2d(1, 0, out='vecA', stroke=TEAL)
pie.text('A', 1.15, 0, 14, out='lbl_a', stroke=TEAL)
pie.la_vec2d(on_circle(angle_b, 1, 'x'), on_circle(angle_b, 1, 'y'), out='vecB', stroke=PINK)
pie.text('B', on_circle(angle_b, 1.15, 'x'), on_circle(angle_b, 1.15, 'y'), 14, out='lbl_b', stroke=PINK)
# ⟨A,B⟩ = 1·cos(angle_b) + 0·sin(angle_b)
pie.text(pie.lift(lambda angle: f'⟨A,B⟩ = {math.cos(angle):.2f}', pie.Text)(angle_b), 0, -1.2, 16, out='dbox')
```

Here `A` points along the x-axis and `B` starts at `60°`. The readout shows their dot product $\langle A, B \rangle$, which equals $\cos\theta$ since both are unit vectors. 

- Rotate `B` away from `A` and watch the dot product shrink - it passes through **zero** the moment `B` becomes perpendicular to `A`, then turns **negative** as the angle exceeds `90°`. 

```python-editor collapsed
pie.translate_scalar_to(angle_b, math.pi, animate=True)
```

- Rotate `B` back toward `A` and the dot product climbs back up toward `1` (the maximum, reached when the vectors point the same way).

```python-editor collapsed
pie.translate_scalar_to(angle_b, -0.55, animate=True)
```

---

## 10.4 Dot product as a projection
Given vectors `p` and `q`, one often wants the vector obtained by **projecting `p` onto `q`**. This is shown in the figure below.

```python-editor collapsed
pie.clear()
pie.scalar(55, out='unit')
TEAL, GOLD, GRAY = '#0d9488', '#ca8a04', '#71717a'
pie.la_vec2d(4, 3, out='vecp', stroke=TEAL)
pie.text('p', 4, 3.4, 16, out='lp')
pie.la_vec2d(4, -2, out='vecq', stroke=TEAL)
pie.text('q', 4.2, -2, 16, out='lq')
```

We start with vector `p` $= [4, 3]$ and vector `q` $= [4, -2]$.

```python-editor collapsed
pie.la_vec2d(2, -1, out='vecproj', stroke=GOLD)
pie.line(pie.point(2, -1, out='ptproj', hidden=True), pie.point(4, 3, out='ptp', hidden=True), out='drop', stroke=GRAY)
pie.text('projection', 1.4, -1.6, 14, out='lpr', stroke=GOLD)
```

Dropping `p` perpendicularly onto the line of `q` gives the projection, shown in gold.

- This projected vector has the **same direction as `q`**. 
- Its length is the length of `p` times the cosine of the angle between `p` and `q`, which works out to $\frac{\langle p, q \rangle}{\lVert q \rVert}$. So the projection vector itself is:

$$\left( \frac{\langle \textcolor{#1d4ed8}{p}, \textcolor{#be185d}{q} \rangle}{\lVert \textcolor{#be185d}{q} \rVert} \right) \frac{\textcolor{#be185d}{q}}{\lVert \textcolor{#be185d}{q} \rVert} = \textcolor{#ca8a04}{\langle \textcolor{#1d4ed8}{p}, \textcolor{#be185d}{q_{unit}} \rangle \, \textcolor{#be185d}{q_{unit}}}$$

where $\textcolor{#be185d}{q_{unit}}$ is the unit vector in the direction of $\textcolor{#be185d}{q}$. 

#### Teaser

The last expression can be re-written even more elegantly as

$$\textcolor{#ca8a04}{\textcolor{#be185d}{q_{unit}} \, \textcolor{#be185d}{q_{unit}}^T \, \textcolor{#1d4ed8}{p}}$$

where $\textcolor{#be185d}{q_{unit}}^T$ is the **transpose** of $\textcolor{#be185d}{q_{unit}}$. We will study exactly what this means in the next chapter.

---

## 10.5 Dot product in matrix-vector multiplication
You may or may not have realized it, but the dot product can be found lurking inside any weighted sum, aka matrix-vector multiplication. Let's take a simple example:

$$
\begin{aligned}
\begin{bmatrix} \textcolor{#1d4ed8}{p_1} & \textcolor{#1d4ed8}{q_1} \\ \textcolor{#be185d}{p_2} & \textcolor{#be185d}{q_2} \\ \textcolor{#047857}{p_3} & \textcolor{#047857}{q_3} \end{bmatrix} \begin{bmatrix} v_1 \\ v_2 \end{bmatrix}
&= \underbrace{\begin{bmatrix} \textcolor{#1d4ed8}{p_1 v_1 + q_1 v_2} \\ \textcolor{#be185d}{p_2 v_1 + q_2 v_2} \\ \textcolor{#047857}{p_3 v_1 + q_3 v_2} \end{bmatrix}}_{\text{weighted sum of columns}} \\
&= \underbrace{\begin{bmatrix} \textcolor{#1d4ed8}{\langle (p_1, q_1), (v_1, v_2) \rangle} \\ \textcolor{#be185d}{\langle (p_2, q_2), (v_1, v_2) \rangle} \\ \textcolor{#047857}{\langle (p_3, q_3), (v_1, v_2) \rangle} \end{bmatrix}}_{\text{dot product of each row with } v}
\end{aligned}
$$

Suddenly the **row** of a matrix becomes relevant! So far we have only been looking at a matrix as an array of column vectors. Seeing each entry of the output as a dot product between a **row** of the matrix and the input vector gives us yet another perspective on matrix-vector multiplication. We will explore this row-based view in detail next.

In the next chapter we will study the **matrix transpose** - the operation that turns rows into columns and columns into rows - and see how it makes the projection formula above fall out cleanly.

---

[← 9. Bezier curves](/la/9_bezier_curves)  ·  [11. Matrix transpose →](/la/11_matrix_transpose)
