---
title: Another proof of Fibonacci sequence in classic probability puzzle
description: A linear algebra proof that the chance no three of n random sticks form a triangle is the product of 1/Fᵢ over the Fibonacci numbers.
---

# Another proof of Fibonacci sequence in classic probability puzzle

Recently [Scientific American reported](https://www.scientificamerican.com/article/students-find-hidden-fibonacci-sequence-in-classic-probability-puzzle/) that Fibonacci sequence appears as an answer to the following problem:

> If I have `n` sticks with random lengths between 0 and 1, what is the probability that no three of those sticks can form a triangle?

The answer to this puzzle is $\Pi_{i=1}^n \frac{1}{F_i} = \frac{1}{1} \frac{1}{1} \frac{1}{2} \dots \frac{1}{F_n}$ where $F_i$ is the `i-th` Fibonacci number. [This](https://arxiv.org/abs/2504.19911) is the Arxiv link for the paper which contains a proof of it. Someone [posted](https://old.reddit.com/r/math/comments/1mk27de/students_find_hidden_fibonacci_sequence_in/n7fqmw3/) a novel proof of this puzzle which is more linear algebraic in nature. I made a small modification on top of this proof which is what I present here. Most of the credit to this proof goes to the Reddit user.

---

## 0. Outline of the proof

Here is the overall idea - sort the lengths $l_i$ from shortest to longest. The vector of sorted lengths can be shown to be a linear combination of a certain basis. Once we get this basis, we use it express the longest length $l_n$ in terms of it. Finally we use the condition that $\text{longest length} \le 1$ to get a simplex.

<div style="display: flex; justify-content: center; margin: 1.5rem 0; overflow-x: auto;">
<svg width="700" height="140" viewBox="0 0 700 140" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="fib-arrow-amber" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto" fill="#b45309"><path d="M 0 0 L 10 5 L 0 10 z" /></marker>
  </defs>
  <rect x="10" y="20" width="150" height="80" rx="10" fill="#0d9488" fill-opacity="0.1" stroke="#0d9488" stroke-width="1" />
  <rect x="190" y="20" width="150" height="80" rx="10" fill="#0d9488" fill-opacity="0.1" stroke="#0d9488" stroke-width="1" />
  <rect x="370" y="20" width="150" height="80" rx="10" fill="#0d9488" fill-opacity="0.1" stroke="#0d9488" stroke-width="1" />
  <rect x="550" y="20" width="140" height="80" rx="10" fill="#0d9488" fill-opacity="0.1" stroke="#0d9488" stroke-width="1" />
  <path d="M 160 60 L 190 60" stroke="#b45309" stroke-width="2" marker-end="url(#fib-arrow-amber)" />
  <path d="M 340 60 L 370 60" stroke="#b45309" stroke-width="2" marker-end="url(#fib-arrow-amber)" />
  <path d="M 520 60 L 550 60" stroke="#b45309" stroke-width="2" marker-end="url(#fib-arrow-amber)" />
  <text x="85" y="40" text-anchor="middle" fill="#52525b" font-family="sans-serif" font-size="12">Step 1</text>
  <text x="265" y="40" text-anchor="middle" fill="#52525b" font-family="sans-serif" font-size="12">Step 2</text>
  <text x="445" y="40" text-anchor="middle" fill="#52525b" font-family="sans-serif" font-size="12">Step 3</text>
  <text x="620" y="40" text-anchor="middle" fill="#52525b" font-family="sans-serif" font-size="12">Step 4</text>
  <text x="85" y="65" text-anchor="middle" fill="#27272a" font-family="sans-serif" font-size="14">Sort stick lengths</text>
  <text x="85" y="80" text-anchor="middle" fill="#27272a" font-family="sans-serif" font-size="14">l₁ ≤ l₂ ≤ ... ≤ lₙ</text>
  <text x="265" y="65" text-anchor="middle" fill="#27272a" font-family="sans-serif" font-size="14">Express as linear</text>
  <text x="265" y="80" text-anchor="middle" fill="#27272a" font-family="sans-serif" font-size="14">combination of basis</text>
  <text x="445" y="65" text-anchor="middle" fill="#27272a" font-family="sans-serif" font-size="14">Express lₙ in</text>
  <text x="445" y="80" text-anchor="middle" fill="#27272a" font-family="sans-serif" font-size="14">terms of basis</text>
  <text x="620" y="65" text-anchor="middle" fill="#27272a" font-family="sans-serif" font-size="14">Apply condition</text>
  <text x="620" y="80" text-anchor="middle" fill="#27272a" font-family="sans-serif" font-size="14">lₙ ≤ 1 → simplex</text>
  <text x="85" y="130" text-anchor="middle" fill="#b45309" font-family="sans-serif" font-size="14">l = (l₁,l₂,...,lₙ)</text>
  <text x="265" y="130" text-anchor="middle" fill="#b45309" font-family="sans-serif" font-size="14">l = Σ cᵢbᵢ</text>
  <text x="445" y="130" text-anchor="middle" fill="#b45309" font-family="sans-serif" font-size="14">l<tspan baseline-shift="sub" font-size="10">n</tspan> = Σ d<tspan baseline-shift="sub" font-size="10">i</tspan>b<tspan baseline-shift="sub" font-size="10">ni</tspan></text>
  <text x="620" y="130" text-anchor="middle" fill="#b45309" font-family="sans-serif" font-size="14">Σ d<tspan baseline-shift="sub" font-size="10">i</tspan>b<tspan baseline-shift="sub" font-size="10">ni</tspan> ≤ 1</text>
</svg>
</div>

These steps are implemented below:

---

## 1. Steps 1 and 2 - Expressing sorted stick lengths as a matrix-vector product

We do this for two cases - the case where the lengths can not form a triangle and the general case (the lengths may or may not form a triangle).

### 1.1 Lengths which cannot form a triangle

Given the shortest length is $l_1 = \varepsilon_1$, we have that $l_2 = l_1 + \varepsilon_2$. Note that $l_3$ has to be bigger than $l_1 + l_2 = 2l_1 + \varepsilon_2$. We can assume that $l_3 = 2l_1 + \varepsilon_2 + \varepsilon_3$. Using the same argument, the next three lengths can be written down as:

$$l_4 = 3l_1 + 2\varepsilon_2 + \varepsilon_3 + \varepsilon_4$$

$$l_5 = 5l_1 + 3\varepsilon_2 + 2\varepsilon_3 + \varepsilon_4 + \varepsilon_5$$

$$l_6 = 8l_1 + 5\varepsilon_2 + 3\varepsilon_3 + 2\varepsilon_4 + \varepsilon_5 + \varepsilon_6$$

$$\cdots$$

$$l_n = F_nl_1 + F_{n-1}\varepsilon_1 + F_{n-2}\varepsilon_2 + \cdots + \varepsilon_{n-1}$$

Thus the vector of sorted lengths can be written down as:

$$l = \begin{bmatrix} 1 & 0 & 0 & ... & 0 & 0 \\ 1 & 1 & 0 & ... & 0 & 0 \\ 2 & 1 & 1 & ... & 0 & 0 \\ 3 & 2 & 1 & ... & ... & ... \\ ... & ... & ... & ... & 1 & 0 \\ F_n & F_{n-1} & F_{n-2} & ... & 1 & 1 \end{bmatrix} \begin{bmatrix} \varepsilon_1 \\ \varepsilon_2 \\ \varepsilon_3 \\ ... \\ \varepsilon_n \end{bmatrix}$$

### 1.2 Any arbitrary vector of lengths

This case is much simpler. As before, start with $l_1 = \varepsilon_1$. Then since $l_2 \ge l_1$, we have that $l_2 = l_1 + \varepsilon_2$ and so on. For sake of completion, the remaining lengths look something like:

$$l_3 = l_1 + \varepsilon_2 + \varepsilon_3$$

$$l_4 = l_1 + \varepsilon_2 + \varepsilon_3 + \varepsilon_4$$

$$\cdots$$

$$l_n = l_1 + \varepsilon_2 + \varepsilon_3 + \cdots + \varepsilon_n$$

In this case, the vector of sorted lengths can be written down as:

$$l = \begin{bmatrix} 1 & 0 & 0 & ... & 0 & 0 \\ 1 & 1 & 0 & ... & 0 & 0 \\ 1 & 1 & 1 & ... & 0 & 0 \\ 1 & 1 & 1 & ... & ... & ... \\ ... & ... & ... & ... & 1 & 0 \\ 1 & 1 & 1 & ... & 1 & 1 \end{bmatrix} \begin{bmatrix} \varepsilon_1 \\ \varepsilon_2 \\ \varepsilon_3 \\ ... \\ \varepsilon_n \end{bmatrix}$$

---

## 2. Step 3 - largest length in each case

### 2.1 First case

In this case, the largest length is $\sum_{i=1}^n \textcolor{#b45309}{F_i}y_i$ for positive coefficients $y_i$.

### 2.2 Second case

In this case, the largest length is $\sum_{i=1}^n x_i$ for positive coefficients $x_i$.

---

## 3. Step 4 - obtain simplexes for each case

Since these lengths are sampled from the interval $[0,1]$, they have to be less than or equal to one. Applying this condition to each of the largest lengths above we get:

i) $\sum_{i=1}^n \textcolor{#b45309}{F_i} y_i \le 1$: the points that satisfy this condition form a volume $V_1$. This is the volume of the simplex formed by origin and vectors $\underbrace{\frac{1}{F_i} \textcolor{#b45309}{e_i}}_{\text{standard basis vector scaled by} \ 1/F_i}$ for $i$ from 1 to n.

ii) $\sum_{i=1}^n x_i \le 1$: this is the standard simplex and has a volume $V_2$ of $\frac{1}{n!}$. The exact volume is not needed for the proof though.

---

## 4. Final step

The probability is given by $\frac{V_1}{V_2}$. How do we find $V_1$ in terms of $V_2$? By defining a map $y_i = x_i / F_i$. It is easy to see that the determinant of Jacobian of this map is $|J| = \Pi_i \frac{1}{F_i}$. Thus the volume $V_1 = |J|V_2$. This gives us the probability to be:

$$\Pi_{i=1}^n \frac{1}{F_i}$$
