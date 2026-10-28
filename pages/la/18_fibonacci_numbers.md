---
title: Fibonacci numbers with matrices and Binet's formula
description: Write the Fibonacci recurrence as a matrix, derive Binet's closed-form formula from its eigenvalues, and generalize to linear recurrences.
canvas: left
sidebar: _ebook.md
---

# 18. Fibonacci numbers

<details>
<summary>Review</summary>

Power iteration showed that repeatedly applying a matrix $M$ to a vector drives it toward the eigenvector of $M$'s largest eigenvalue, because $M^n = VD^nV^{-1}$ and the dominant eigenvalue swamps the rest. This chapter cashes that idea out on a sequence every programmer knows.

</details>

If you write code, you have almost certainly met the [Fibonacci numbers](https://en.wikipedia.org/wiki/Fibonacci_number), and probably written a function to compute the $n$-th one by iteration or recursion. Here we look at them through a linear-algebra lens, which reveals a closed-form formula and connects them to the broader family of **linear recurrence relations**.

---

## 18.1 Fibonacci numbers
The Fibonacci numbers are a sequence $F_i,\ i = 0, 1, 2, \ldots$ defined by $F_0 = 0$, $F_1 = 1$, and

$$F_{i+2} = F_{i+1} + F_i \quad \text{for } i \ge 0$$

The textbook recursive implementation follows the definition directly:

```python
def fibonacci(n):
    if n == 0: return 0
    if n == 1: return 1
    return fibonacci(n - 1) + fibonacci(n - 2)
```

---

## 18.2 Two consecutive Fibonacci numbers as a vector
Now pack two consecutive Fibonacci numbers into a 2D vector:

$$v_n = \begin{bmatrix} \textcolor{#1d4ed8}{F_n} \\ \textcolor{#be185d}{F_{n+1}} \end{bmatrix}$$

This gives $v_0 = \begin{bmatrix} 0 \\ 1 \end{bmatrix}$, $v_1 = \begin{bmatrix} 1 \\ 1 \end{bmatrix}$, $v_2 = \begin{bmatrix} 1 \\ 2 \end{bmatrix}$, and so on.

---

### 18.2.1 What is the direction of this vector?
The direction of $v_n$ is the angle $\tan^{-1}\!\left(\dfrac{F_{n+1}}{F_n}\right)$. As $n$ grows, does this ratio of consecutive Fibonacci numbers converge? If it does, then the direction of $v_n$ settles down too, and (just like power iteration) that limiting direction is the eigenvector of the largest eigenvalue of some matrix. Let's watch it happen before we find the matrix.

```python-editor collapsed
pie.clear()
pie.scalar(40, out='unit')
GRAY, TEAL, GOLD, VIOLET = '#71717a', '#0d9488', '#ca8a04', '#6d28d9'
```

Reveal the golden direction $[1, \phi]$, the line of slope $\phi \approx 1.618$.

```python-editor collapsed
pie.line(pie.point(3, 4.854, out='ga', hidden=True), pie.point(-3, -4.854, out='gb', hidden=True), out='gline', stroke=VIOLET)
pie.text('[1, φ]', 4.2, 4.2, 13, out='lblGL', stroke=VIOLET)
```

Now plot the Fibonacci vectors one at a time:

- $v_0 = [0, 1]$

```python-editor collapsed
pie.la_vec2d(0, 1, out='f0', stroke=TEAL)
pie.text('v₀', -0.5, 1.3, 13, out='lblV0', stroke=TEAL)
```

- $v_1 = [1, 1]$

```python-editor collapsed
pie.la_vec2d(1, 1, out='f1', stroke=TEAL)
pie.text('v₁', 1.7, 0.85, 13, out='lblV1', stroke=TEAL)
```

- $v_2 = [1, 2]$

```python-editor collapsed
pie.la_vec2d(1, 2, out='f2', stroke=TEAL)
pie.text('v₂', 0.4, 2.3, 13, out='lblV2', stroke=TEAL)
```

- $v_3 = [2, 3]$

```python-editor collapsed
pie.la_vec2d(2, 3, out='f3', stroke=TEAL)
pie.text('v₃', 2.7, 3.0, 13, out='lblV3', stroke=TEAL)
```

- and $v_4 = [3, 5]$.

```python-editor collapsed
pie.la_vec2d(3, 5, out='f4', stroke=GOLD)
pie.text('v₄', 3.4, 5.3, 13, out='lblV4', stroke=GOLD)
pie.text('Each Fibonacci vector vₙ = [Fₙ, Fₙ₊₁] grows longer, but its direction locks onto the golden line: Fₙ₊₁/Fₙ → φ ≈ 1.618.', -2.9, 4.2, 12, 4.2, -1, out='sumBox', stroke=GRAY)
```

Each vector is longer than the last, but their _directions_ zig-zag in and lock onto the violet line: the ratio $\dfrac{F_{n+1}}{F_n}$ converges to $\phi$.

---

## 18.3 The recurrence relation
The trick is to express $v_{n+1}$ as a matrix-vector product $M v_n$. Finding $M$ is easy:

$$\begin{aligned}
v_{n+1} &= \begin{bmatrix} F_{n+1} \\ F_{n+2} \end{bmatrix} \\
&= \begin{bmatrix} 0 \cdot \textcolor{#1d4ed8}{F_n} + \textcolor{#be185d}{F_{n+1}} \\ \underbrace{\textcolor{#1d4ed8}{F_n} + \textcolor{#be185d}{F_{n+1}}}_{\text{the recurrence}} \end{bmatrix} \\
&= \begin{bmatrix} \textcolor{#1d4ed8}{0} & \textcolor{#be185d}{1} \\ \textcolor{#1d4ed8}{1} & \textcolor{#be185d}{1} \end{bmatrix} \begin{bmatrix} \textcolor{#1d4ed8}{F_n} \\ \textcolor{#be185d}{F_{n+1}} \end{bmatrix} \\
&= \begin{bmatrix} \textcolor{#1d4ed8}{0} & \textcolor{#be185d}{1} \\ \textcolor{#1d4ed8}{1} & \textcolor{#be185d}{1} \end{bmatrix} v_n
\end{aligned}$$

So $M = \begin{bmatrix} \textcolor{#1d4ed8}{0} & \textcolor{#be185d}{1} \\ \textcolor{#1d4ed8}{1} & \textcolor{#be185d}{1} \end{bmatrix}$. Since $v_1 = M v_0$, $v_2 = M v_1 = M^2 v_0$, and in general $v_n = M^n v_0$, the vector $v_n$ points toward $M$'s dominant eigenvector for large $n$, exactly the convergence we just saw. Let's find its eigenvalues and eigenvectors.

If $\lambda$ is an eigenvalue of $M$, then $\begin{bmatrix} -\lambda & 1 \\ 1 & 1 - \lambda \end{bmatrix}$ is singular, so its columns are parallel and its determinant vanishes:

$$-\lambda(1 - \lambda) - 1 = 0 \implies \lambda^2 = \lambda + 1$$

This is precisely the equation that defines the [golden ratio](https://en.wikipedia.org/wiki/Golden_ratio).

- The eigenvalues are $\textcolor{#047857}{\phi} = \dfrac{1 + \sqrt{5}}{2} \approx 1.618$ and $\textcolor{#b45309}{\psi} = \dfrac{1 - \sqrt{5}}{2} \approx -0.618$.
- The corresponding eigenvectors are $\begin{bmatrix} 1 \\ \textcolor{#047857}{\phi} \end{bmatrix}$ and $\begin{bmatrix} 1 \\ \textcolor{#b45309}{\psi} \end{bmatrix}$.

Since $\textcolor{#047857}{\phi}$ is the larger absolute eigenvalue, for large $n$ the vector $v_n = \begin{bmatrix} F_n \\ F_{n+1} \end{bmatrix}$ points in the direction $\begin{bmatrix} 1 \\ \textcolor{#047857}{\phi} \end{bmatrix}$. In other words, for large $n$ the ratio $\dfrac{F_{n+1}}{F_n} \to \textcolor{#047857}{\phi} = \dfrac{1 + \sqrt{5}}{2}$.

---

### 18.3.1 Deriving Binet's formula
The eigendecomposition of $M$ is

$$\begin{aligned}
M &= VDV^{-1} \\
  &= \underbrace{\begin{bmatrix} 1 & 1 \\ \textcolor{#047857}{\phi} & \textcolor{#b45309}{\psi} \end{bmatrix}}_{V} \underbrace{\begin{bmatrix} \textcolor{#047857}{\phi} & 0 \\ 0 & \textcolor{#b45309}{\psi} \end{bmatrix}}_{D} \underbrace{\frac{1}{\textcolor{#b45309}{\psi} - \textcolor{#047857}{\phi}} \begin{bmatrix} \textcolor{#b45309}{\psi} & -1 \\ -\textcolor{#047857}{\phi} & 1 \end{bmatrix}}_{V^{-1}}
\end{aligned}$$

Because $v_n = M v_{n-1} = M^n v_0 = VD^nV^{-1}v_0$, and using $\dfrac{1}{\textcolor{#b45309}{\psi} - \textcolor{#047857}{\phi}} = \dfrac{-1}{\sqrt{5}}$, we can compute $v_n$ in closed form:

$$\begin{aligned} \begin{bmatrix} F_n \\ F_{n+1} \end{bmatrix} &= VD^nV^{-1}v_0 \\ &= \begin{bmatrix} 1 & 1 \\ \textcolor{#047857}{\phi} & \textcolor{#b45309}{\psi} \end{bmatrix} \begin{bmatrix} \textcolor{#047857}{\phi^n} & 0 \\ 0 & \textcolor{#b45309}{\psi^n} \end{bmatrix} \frac{1}{\textcolor{#b45309}{\psi} - \textcolor{#047857}{\phi}} \begin{bmatrix} \textcolor{#b45309}{\psi} & -1 \\ -\textcolor{#047857}{\phi} & 1 \end{bmatrix} \begin{bmatrix} 0 \\ 1 \end{bmatrix} \\ &= \frac{1}{\sqrt{5}} \begin{bmatrix} \textcolor{#047857}{\phi^n} - \textcolor{#b45309}{\psi^n} \\ \textcolor{#047857}{\phi^{n+1}} - \textcolor{#b45309}{\psi^{n+1}} \end{bmatrix} \end{aligned}$$

Reading off the first entry gives **Binet's formula** for the $n$-th Fibonacci number:

$$\begin{aligned}
F_n &= \frac{\textcolor{#047857}{\phi^n} - \textcolor{#b45309}{\psi^n}}{\sqrt{5}} \\
    &= \frac{1}{\sqrt{5}} \left[ \underbrace{\left( \frac{1 + \sqrt{5}}{2} \right)^n}_{\textcolor{#047857}{\phi^n}} - \underbrace{\left( \frac{1 - \sqrt{5}}{2} \right)^n}_{\textcolor{#b45309}{\psi^n}} \right]
\end{aligned}$$

---

## 18.4 Generalizing to any linear sum of the last two values
This chain of reasoning is not special to Fibonacci: it works for _any_ sequence where each term is a linear combination of the previous two. A slightly more general version is

$$a_0 = a, \quad a_1 = b, \quad a_{n+2} = \textcolor{#1d4ed8}{p} \cdot \textcolor{#1d4ed8}{a_n} + \textcolor{#be185d}{q} \cdot \textcolor{#be185d}{a_{n+1}}$$

Here the same packing gives

$$\begin{aligned}
v_{n+1} &= \begin{bmatrix} a_{n+1} \\ a_{n+2} \end{bmatrix} \\
        &= \begin{bmatrix} a_{n+1} \\ \underbrace{\textcolor{#1d4ed8}{p} \cdot \textcolor{#1d4ed8}{a_n} + \textcolor{#be185d}{q} \cdot \textcolor{#be185d}{a_{n+1}}}_{\text{the recurrence}} \end{bmatrix} \\
        &= \begin{bmatrix} \textcolor{#1d4ed8}{0} & \textcolor{#be185d}{1} \\ \textcolor{#1d4ed8}{p} & \textcolor{#be185d}{q} \end{bmatrix} \begin{bmatrix} \textcolor{#1d4ed8}{a_n} \\ \textcolor{#be185d}{a_{n+1}} \end{bmatrix} \\
        &= \begin{bmatrix} \textcolor{#1d4ed8}{0} & \textcolor{#be185d}{1} \\ \textcolor{#1d4ed8}{p} & \textcolor{#be185d}{q} \end{bmatrix} v_n
\end{aligned}$$

with $v_0 = \begin{bmatrix} a \\ b \end{bmatrix}$. The remaining steps are identical: find the eigenvalues and eigenvectors of this matrix, then use its eigendecomposition to write the $n$-th value in closed form.

---

## 18.5 Linear recurrence relations
The most general version of this idea is a **linear recurrence relation**:

$$a_t = \textcolor{#1d4ed8}{c_1 a_{t-1}} + \textcolor{#be185d}{c_2 a_{t-2}} + \cdots + \textcolor{#047857}{c_n a_{t-n}} + \textcolor{#0d9488}{k}$$

where the $c_i$ and $k$ are constants. The approach is unchanged in spirit: stack the last $n$ terms into a vector

$$v_n = \begin{bmatrix} a_{t-n} \\ a_{t-n+1} \\ \vdots \\ a_{t-1} \end{bmatrix}$$

and find a matrix $M$ (plus a constant vector $w$ to absorb the $k$ term) so that $v_{n+1} = M v_n + w$. Once again the powers of $M$, through its eigendecomposition, carry all the information about how the sequence grows.

Another place higher powers of a matrix show up is **Markov chains**, where repeatedly applying a transition matrix drives a probability distribution toward a steady state. We look at them next.

---

[← 17. Powers of a matrix](/la/17_powers_of_a_matrix)  ·  [19. Markov matrices →](/la/19_markov_matrices)
