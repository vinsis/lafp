---
title: Minimization of squared norm of a vector sum
description: Find the x that minimizes the squared norm of a + Mx, with a visual example and a step-by-step solution.
---

# Minimization of squared norm of a vector sum

$$f(x) = \|a + Mx\|^2$$

---

## Problem statement

Given a vector of the form $a + Mx$, where $M$ is a matrix and $a$ is a vector, we want to find $x$ that minimizes the squared norm of the vector.

$$\text{min}_{\textcolor{#b45309}{x}} \ \|\underbrace{a}_{\in R^n} + \underbrace{M}_{\in R^{\text{n x k}}} \textcolor{#b45309}{\underbrace{x}_{\in R^k}}\|^2$$

<div style="display: flex; flex-direction: column; align-items: center; margin: 1.5rem 0;">
<svg width="200" height="150" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="mnvs-arrow-amber" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto" fill="#d97706"><path d="M 0 0 L 10 5 L 0 10 z" /></marker>
    <marker id="mnvs-arrow-teal" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto" fill="#0d9488"><path d="M 0 0 L 10 5 L 0 10 z" /></marker>
  </defs>
  <g fill="#27272a">
    <line x1="20" y1="100" x2="180" y2="100" stroke="#71717a" stroke-width="1" />
    <line x1="100" y1="130" x2="100" y2="20" stroke="#71717a" stroke-width="1" />
    <line x1="-100" y1="30" x2="200" y2="30" stroke="#d97706" stroke-width="1.5" stroke-dasharray="4,4" />
    <text x="30" y="15" fill="#d97706" font-size="14" font-family="sans-serif" text-anchor="middle" alignment-baseline="hanging">Mx</text>
    <line x1="100" y1="100" x2="100" y2="30" stroke="#d97706" stroke-width="2.5" marker-end="url(#mnvs-arrow-amber)" />
    <line x1="100" y1="100" x2="160" y2="30" stroke="#0d9488" stroke-width="1.5" marker-end="url(#mnvs-arrow-teal)" />
    <text x="130" y="45" fill="#0d9488" font-size="14" font-family="sans-serif" text-anchor="middle" alignment-baseline="hanging">a</text>
    <circle cx="100" cy="100" r="3" fill="#71717a" />
    <g>
      <line y1="30" y2="30" x1="160" x2="180" stroke="#0d9488" stroke-width="1.5" marker-end="url(#mnvs-arrow-teal)"><animate attributeName="x2" values="20;200;20" keyTimes="0;0.5;1" dur="5s" repeatCount="indefinite" /></line>
    </g>
  </g>
</svg>
</div>

Find `x` for which $\|a + Mx\|^2$ is minimized. Here `M` is the basis vector $e_1$ and `x` is a scalar. The vector with minimum norm is shown in bold.

---

## Solution

We can write the function as:

$$\begin{align} f(x) &= \langle a + Mx, a + Mx \rangle \\ &= \langle a, a \rangle + 2 \langle a, Mx \rangle + \langle Mx, Mx \rangle \\ &= \langle a, a \rangle + 2 \langle M^Ta, x \rangle + \langle M^TMx, x \rangle \end{align}$$

It then follows that $\nabla f(\textcolor{#b45309}{x}) = 2M^Ta + 2M^TM\textcolor{#b45309}{x}$. Setting it to zero, we get the solution:

> $$\textcolor{#b45309}{x}^* = -(M^TM)^{-1}M^Ta$$
>
> Note that $M\textcolor{#b45309}{x}^*$ is the projection of $a$ onto the column space of $M$.

Thus the optimal value of $\textcolor{#b45309}{x}$ is the negative of the projection of $a$ onto the column space of $M$. Ideally, if $Mx$ were equal to $-a$, the norm of the sum would be zero. But that may not be possible if $a$ is not in the column space of $M$. Simply said, the optimal value of $\textcolor{#b45309}{x}$ tries to get $M\textcolor{#b45309}{x}$ as close as possible to $-a$.

---

## Related articles:

- [Projection matrix](/la/20_projection_matrix)
