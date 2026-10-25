---
title: Polynomials are vectors in disguise
description: A polynomial is defined by its coefficients, so it is a vector. See how adding and scaling polynomials looks as curves.
canvas: left
---

# 8. Polynomials are vectors in disguise

<details>
<summary>Review</summary>

The same point can be expressed in two different ways using two different sets of basis vectors: a point written as $x$ in the basis of $A$ is the point $Ax$, and the same point written in the basis of $B$ is $B^{-1}Ax$.

</details>

In this chapter we meet an object that does not look like a vector at all - the polynomial - and discover that it is a vector in disguise.

---

## 8.1 Let's talk about polynomials
A polynomial of degree `n` is a function $f(x) = a_0 + a_1x + a_2x^2 + a_3x^3 + ... + a_nx^n$ where $a_0, a_1, ..., a_n$ are `n+1` real numbers (or floating point numbers if you are writing a program). These numbers are also called coefficients.

A simple (but inefficient) way to create a polynomial function is:

```python
def create_polynomial_function(*coefficients):
    def f(x):
        return sum(c * x**i for (i,c) in enumerate(coefficients))
    return f
```

Also note that a polynomial is completely defined by its coefficients. Thus we can start denoting a polynomial $f(x) = a_0 + a_1x + a_2x^2 + a_3x^3 + ... + a_nx^n$ with an array of numbers $[a_0, a_1, a_2, ..., a_n]$.

### 8.1.1 Adding two polynomials
If we have

- $f(x) = \textcolor{#1d4ed8}{a_0} + \textcolor{#1d4ed8}{a_1}x + \textcolor{#1d4ed8}{a_2}x^2 + \textcolor{#1d4ed8}{a_3}x^3 + ... + \textcolor{#1d4ed8}{a_n}x^n$ and
- $g(x) = \textcolor{#be185d}{b_0} + \textcolor{#be185d}{b_1}x + \textcolor{#be185d}{b_2}x^2 + \textcolor{#be185d}{b_3}x^3 + ... + \textcolor{#be185d}{b_n}x^n$

then the sum of these two functions is another polynomial:

$$f(x) + g(x) = (\textcolor{#1d4ed8}{a_0}+\textcolor{#be185d}{b_0}) + (\textcolor{#1d4ed8}{a_1}+\textcolor{#be185d}{b_1})x + (\textcolor{#1d4ed8}{a_2}+\textcolor{#be185d}{b_2})x^2 + (\textcolor{#1d4ed8}{a_3}+\textcolor{#be185d}{b_3})x^3 + ... + (\textcolor{#1d4ed8}{a_n}+\textcolor{#be185d}{b_n})x^n$$

We can use the array of coefficients to denote these polynomial functions:

- $f(x) = [\textcolor{#1d4ed8}{a_0}, \textcolor{#1d4ed8}{a_1}, \textcolor{#1d4ed8}{a_2}, ..., \textcolor{#1d4ed8}{a_n}]$
- $g(x) = [\textcolor{#be185d}{b_0}, \textcolor{#be185d}{b_1}, \textcolor{#be185d}{b_2}, ..., \textcolor{#be185d}{b_n}]$
- $f(x) + g(x) = [\textcolor{#1d4ed8}{a_0}+\textcolor{#be185d}{b_0}, \textcolor{#1d4ed8}{a_1}+\textcolor{#be185d}{b_1}, \textcolor{#1d4ed8}{a_2}+\textcolor{#be185d}{b_2}, ..., \textcolor{#1d4ed8}{a_n}+\textcolor{#be185d}{b_n}]$

This looks just like adding two vectors:

$$\begin{bmatrix} \textcolor{#1d4ed8}{a_0} \\ \textcolor{#1d4ed8}{a_1} \\ \vdots \\ \textcolor{#1d4ed8}{a_n} \end{bmatrix} + \begin{bmatrix} \textcolor{#be185d}{b_0} \\ \textcolor{#be185d}{b_1} \\ \vdots \\ \textcolor{#be185d}{b_n} \end{bmatrix} = \begin{bmatrix} \textcolor{#1d4ed8}{a_0}+\textcolor{#be185d}{b_0} \\ \textcolor{#1d4ed8}{a_1}+\textcolor{#be185d}{b_1} \\ \vdots \\ \textcolor{#1d4ed8}{a_n}+\textcolor{#be185d}{b_n} \end{bmatrix}$$

### 8.1.2 Scaling a polynomial
Given a polynomial function $f(x) = \textcolor{#1d4ed8}{a_0} + \textcolor{#1d4ed8}{a_1}x + \textcolor{#1d4ed8}{a_2}x^2 + \textcolor{#1d4ed8}{a_3}x^3 + ... + \textcolor{#1d4ed8}{a_n}x^n$, it is easy to see that

$$\textcolor{#047857}{c} \cdot f(x) = \textcolor{#047857}{c} \cdot \textcolor{#1d4ed8}{a_0} + \textcolor{#047857}{c} \cdot \textcolor{#1d4ed8}{a_1}x + \textcolor{#047857}{c} \cdot \textcolor{#1d4ed8}{a_2}x^2 + \textcolor{#047857}{c} \cdot \textcolor{#1d4ed8}{a_3}x^3 + ... + \textcolor{#047857}{c} \cdot \textcolor{#1d4ed8}{a_n}x^n$$

If we denote $f(x)$ with the array of coefficients $[\textcolor{#1d4ed8}{a_0}, \textcolor{#1d4ed8}{a_1}, \textcolor{#1d4ed8}{a_2}, ..., \textcolor{#1d4ed8}{a_n}]$, then we have $\textcolor{#047857}{c} \cdot f(x) = [\textcolor{#047857}{c} \cdot \textcolor{#1d4ed8}{a_0}, \textcolor{#047857}{c} \cdot \textcolor{#1d4ed8}{a_1}, \textcolor{#047857}{c} \cdot \textcolor{#1d4ed8}{a_2}, ..., \textcolor{#047857}{c} \cdot \textcolor{#1d4ed8}{a_n}]$. This looks just like scaling a vector:

$$\textcolor{#047857}{c} \cdot \begin{bmatrix} \textcolor{#1d4ed8}{a_0} \\ \textcolor{#1d4ed8}{a_1} \\ \vdots \\ \textcolor{#1d4ed8}{a_n} \end{bmatrix} = \begin{bmatrix} \textcolor{#047857}{c} \cdot \textcolor{#1d4ed8}{a_0} \\ \textcolor{#047857}{c} \cdot \textcolor{#1d4ed8}{a_1} \\ \vdots \\ \textcolor{#047857}{c} \cdot \textcolor{#1d4ed8}{a_n} \end{bmatrix}$$

---

## 8.2 A polynomial is a vector
We have gotten so far only by defining two simple operations: scaling a vector and adding two vectors. We could replace a _vector_ with a _polynomial_ and the entire line of reasoning we have used so far would still be correct. Just like vectors, adding two polynomials gives us another polynomial of the same dimension (or degree). Just like vectors, a weighted sum of polynomials is also linear. 

> The algebra of vector addition and scaling is the same as the algebra of polynomial addition and scaling.

So when you add two arrays `[p,q]` and `[x,y]`, it doesn't matter if you view them as vectors or polynomials. They are _abstractions_ of properties shared by both vectors and polynomials. This abstraction leads to the idea of a [vector space](https://en.wikipedia.org/wiki/Vector_space).

In short, a polynomial is just a vector and we will treat it like one.

#### Then why does it not look like a vector?
This is just an opinion and you can skip it if you want.

We saw earlier that a matrix maps a straight line to another straight line. A matrix is just an array of (column) vectors. Now if you imagine a (column) vector to be coefficients of a polynomial, it becomes hard to understand what's going on: we are scaling and adding multiple polynomials to get a new polynomial. But where does "a line gets mapped to another line" fit into this picture?

The idea of an n-dimensional space where each point is a vector is _one_ geometry that we gave to the algebra of vectors. When we visualize polynomial curves (on a 2d-plane) being scaled and added, that is _another geometry_ that we are giving to the algebra of vectors. These two geometries should not be mixed. A matrix maps a line to another line in the geometry of n-dimensional spaces, not in the geometry of polynomial curves.

---

## 8.3 _Another_ geometry of vectors: polynomial curves

```python-editor collapsed
pie.clear()
BLUE, PINK, GREEN, GOLD = '#1d4ed8', '#be185d', '#047857', '#ca8a04'
pie.polynomial([1, 2], out='poly1', stroke=BLUE)
pie.text('1 + 2x', 2.0, 5.4, 12, out='box_blue_lbl', stroke=BLUE)
pie.polynomial([-1, 2, 1], out='poly2', stroke=PINK)
pie.text('-1 + 2x + x²', -2.5, 0.55, 12, out='box_pink_lbl', stroke=PINK)
pie.polynomial([1, 2, -1.6, 0.3], out='poly3', stroke=GREEN)
pie.text('1 + 2x - 1.6x² + 0.3x³', 3.5, 1.7, 12, out='box_green_lbl', stroke=GREEN)
pie.polynomial([-3, 1, -0.3, 0.5, 1], out='poly4', stroke=GOLD)
pie.text('-3 + x - 0.3x² + 0.5x³ + x⁴', -0.9, -4.3, 12, out='box_gold_lbl', stroke=GOLD)
```

A polynomial of degree `n` can be seen as a vector of dimensionality `n+1`. For example $f(x) = a + bx + cx^2$ is a polynomial of degree `2`, which can also be seen as a 3-dimensional vector $\begin{bmatrix} a \\ b \\ c \end{bmatrix}$.

Next thing to note is that we can plot any polynomial on a 2d-plane. Here are some examples of polynomials corresponding to 2-dimensional, 3-dimensional, 4-dimensional and 5-dimensional vectors, plotted on the canvas as plain functions:

- The blue line is the polynomial $1 + 2x$, i.e. the vector $\textcolor{#1d4ed8}{\begin{bmatrix} 1 \\ 2 \end{bmatrix}}$
- The pink curve is the polynomial $-1 + 2x + x^2$, i.e. the vector $\textcolor{#be185d}{\begin{bmatrix} -1 \\ 2 \\ 1 \end{bmatrix}}$
- The green curve is the polynomial $1 + 2x - 1.6x^2 + 0.3x^3$, i.e. the vector $\textcolor{#047857}{\begin{bmatrix} 1 \\ 2 \\ -1.6 \\ 0.3 \end{bmatrix}}$
- The gold curve is the polynomial $-3 + x - 0.3x^2 + 0.5x^3 + x^4$, i.e. the vector $\textcolor{#ca8a04}{\begin{bmatrix} -3 \\ 1 \\ -0.3 \\ 0.5 \\ 1 \end{bmatrix}}$

---

### 8.3.1 Scaling a (polynomial) vector

```python-editor collapsed
pie.clear()
GRAY, GOLD = '#71717a', '#ca8a04'
pie.polynomial([1, 2, -1.6, 0.3], out='poly3', stroke=GRAY)
pie.text('1 + 2x - 1.6x² + 0.3x³', 2.5, 1.09, 12, out='box_grey_lbl', stroke=GRAY)

c = pie.scalar(1, out='c')
scaled = pie.lift(lambda c, a: c * a, pie.Scalar)
coefficients = [scaled(c, a) for a in [1, 2, -1.6, 0.3]]
pie.polynomial(coefficients, out='spoly', stroke=GOLD)
pie.text(pie.lift(lambda c: f'c = {round(c, 2):g}', pie.Text)(c), 2.5, -3.5, 12, out='box_c')
pie.text('scaled coefficients:', -6, 4.5, 12, out='box_cv')
pie.la_array_to_texts(coefficients, -6, 3.5, 1, 1, 16, out='sviz')
# The label sits just above the gold curve at x = 1, where the curve is at c · 1.7
pie.text('c · (1 + 2x - 1.6x² + 0.3x³)', 1, pie.lift(lambda c: 1.7 * c + 0.4, pie.Scalar)(c), 12, out='box_gold_lbl', stroke=GOLD)
```

Let's scale the polynomial $1 + 2x - 1.6x^2 + 0.3x^3$ by a scalar value $c$.

The gold curve is the scaled polynomial $c \cdot \begin{bmatrix} 1 \\ 2 \\ -1.6 \\ 0.3 \end{bmatrix}$, which starts at $c = 1$ - exactly on top of the grey original. You can see the effect of scaling both visually and algebraically (the scaled coefficient vector is shown on the canvas). `0.25` increases $c$, `-0.25` decreases it:

```python-editor
pie.translate_scalar_by(c, 0.25, animate=True)
```

Reset $c$ to `1`:

```python-editor collapsed
pie.translate_scalar_to(c, 1, animate=True)
```

Note what happens as you scale: every point of the curve moves vertically by the same factor, the roots (where the curve crosses the x-axis) stay put, and at $c = 0$ the whole curve flattens into the zero polynomial.

---

### 8.3.2 Adding two (polynomial) vectors

```python-editor collapsed
pie.clear()
BLUE, PINK, GOLD = '#1d4ed8', '#be185d', '#ca8a04'
pie.polynomial([1, 2, 1], out='fpoly', stroke=BLUE)
pie.text('1 + 2x + x²', 1, 4.4, 12, out='box_fpoly_lbl', stroke=BLUE)
pie.polynomial([1, -3, -1.5], out='gpoly', stroke=PINK)
pie.text('1 - 3x - 1.5x²', -3, -3.9, 12, out='box_gpoly_lbl', stroke=PINK)
```

Note that you can only add two vectors if they have the same dimensionality. In other words, you can only add two polynomials if they have the same degree.

Take the blue polynomial $1 + 2x + x^2$, i.e. the vector $\textcolor{#1d4ed8}{\begin{bmatrix} 1 \\ 2 \\ 1 \end{bmatrix}}$, and the pink polynomial $1 - 3x - 1.5x^2$, i.e. the vector $\textcolor{#be185d}{\begin{bmatrix} 1 \\ -3 \\ -1.5 \end{bmatrix}}$.

Adding them coefficient by coefficient - just like adding two vectors - gives the gold polynomial:

```python-editor collapsed
pie.polynomial([2, -1, -0.5], out='sumpoly', stroke=GOLD)
pie.text('2 - x - 0.5x²', -4, -1.6, 12, out='box_sumpoly_lbl', stroke=GOLD)
pie.text('gold = blue + pink, added coefficient by coefficient', 4.2, 0, 12, 4, -1, out='box_sum_cap')
```

$$\textcolor{#1d4ed8}{\begin{bmatrix} 1 \\ 2 \\ 1 \end{bmatrix}} + \textcolor{#be185d}{\begin{bmatrix} 1 \\ -3 \\ -1.5 \end{bmatrix}} = \begin{bmatrix} 2 \\ -1 \\ -0.5 \end{bmatrix}$$

You can verify the sum visually: at any value of $x$, the height of the gold curve is the sum of the heights of the blue and pink curves.

Next we will see how selecting a particular kind of polynomial leads to Bezier curves.

---

[← 7. Linear transformations](/la/7_linear_transformations)  ·  [9. Bezier curves →](/la/9_bezier_curves)
