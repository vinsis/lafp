---
title: Markov matrices and stationary distributions
description: Model a Markov process as a matrix, find its stationary distribution, and see what the eigenvalues and eigenvectors of a Markov matrix tell you.
canvas: left
---

# 19. Markov matrices

<details>
<summary>Review</summary>

The last two chapters ran on powers of a matrix: $M^n x$ swings toward the eigenvector of the largest eigenvalue, which gave us power iteration and a closed form for the Fibonacci numbers. This chapter is about a family of matrices whose powers push probability distributions around: Markov matrices.

</details>

Suppose a particle hops between a fixed set of states at each tick of a clock, and where it goes next depends only on where it is now. This simple setup shows up everywhere: PageRank, text generation, queueing, board games. Linear algebra turns questions about its long-run behavior into questions about eigenvalues.

---

## 19.1 Markov process
You are given a particle and a fixed number of states `state 1, state 2, ..., state n`. At any time step `t` the particle is in exactly one state; call it $s_t$. At time `t+1` the state $s_{t+1}$ is random, and it depends only on $s_t$, not on any earlier history. The sequence $s_0, s_1, s_2, \ldots$ is then called a **Markov process**.

Here is a two-state example:

- If the particle is in `state 1`:
  - it stays in `state 1` with probability $0.3$
  - it moves to `state 2` with probability $1 - 0.3 = 0.7$
  - we can pack these into an array $\textcolor{#1d4ed8}{[0.3, 0.7]}$, where entry $i$ is the probability of being in state $i$ at the next time step
- If the particle is in `state 2`:
  - it moves to `state 1` with probability $0.9$
  - it stays in `state 2` with probability $0.1$
  - the array for this state is $\textcolor{#be185d}{[0.9, 0.1]}$

So each state contributes one array of length equal to the number of states, holding non-negative values that sum to $1$. Writing each array as a column, the whole process becomes a matrix:

$$M = \begin{bmatrix} \textcolor{#1d4ed8}{0.3} & \textcolor{#be185d}{0.9} \\ \textcolor{#1d4ed8}{0.7} & \textcolor{#be185d}{0.1} \end{bmatrix}$$

This is a square `n-by-n` matrix where `n` is the number of states. Column $i$ holds the probabilities of the next state, given that the particle is currently in state $i$. Every column sums to $1$; such a matrix is called a **Markov matrix** (or a stochastic matrix).

Different matrices give processes with very different personalities. Compare these three:

$$M_A = \begin{bmatrix} 0.3 & 0.9 \\ 0.7 & 0.1 \end{bmatrix} \qquad M_B = \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix} \qquad M_C = \begin{bmatrix} 0.5 & 0 \\ 0.5 & 1 \end{bmatrix}$$

Under $M_A$ the particle keeps hopping back and forth at random. Under $M_B$ it alternates between the two states deterministically, forever. Under $M_C$, once the particle enters `state 2` it stays there forever: the second state is absorbing.

---

### 19.1.1 Stationary and limiting distributions
Instead of tracking a single particle, it is more revealing to track the whole probability distribution over states as time passes. 

#### A quick note on visualization of Markov process
In the figures below:
- Each vertical column is the distribution at one time step, read left to right for $t = 0, 1, 2, \ldots$ 
- Within a column, each stacked block is one state; the block's height is the probability of that state, and its color encodes the same probability (blue for $0$ through red for $1$), so two similar distributions look similar at a glance.

Start a random 4-state Markov process from the uniform distribution.

```python-editor collapsed
pie.clear()
pie.scalar(50, out='unit')
GRAY = '#71717a'
iterations = pie.scalar(5, out='iter')
m = pie.la_markov_matrix(4, out='m')
pie.la_markov_simulation(4, iterations, m, [0.25, 0.25, 0.25, 0.25], 4, 0.3, -5, 0, out='sim')
pie.text('random 4-state', -3.8, 4.3, 14, out='t1_label', stroke=GRAY)
pie.text('t →', -3.0, -0.6, 13, out='taxis_label', stroke=GRAY)
```

After a few steps the columns stop changing: the distribution converges to a fixed set of values regardless of how long we keep going. Extend the run to more time steps and the distribution stays locked in place.

```python-editor collapsed
pie.scalar(10, out='iter')
```

When this happens, and the same values are reached from any starting distribution, we say the process has a **limiting distribution**.

Not every process has one. Run process $B$ from the start distribution $[0.8, 0.2]$: the two blocks swap at every step and never settle, so no limiting distribution exists.

```python-editor collapsed
M_B = [[0, 1], [1, 0]]
pie.la_markov_simulation(2, 8, M_B, [0.8, 0.2], 2, 0.3, -5, -3.5, out='sim_b1')
pie.text('B from [0.8, 0.2]', -3.8, -1.2, 14, out='t2_label', stroke=GRAY)
```

But run the same process from $[0.5, 0.5]$ and nothing changes at all.

```python-editor collapsed
pie.la_markov_simulation(2, 8, M_B, [0.5, 0.5], 2, 0.3, 1.2, -3.5, out='sim_b2')
pie.text('B from [0.5, 0.5]', 3, -1.2, 14, out='t3_label', stroke=GRAY)
pie.text('A limiting distribution is reached from any start. B never settles from [0.8, 0.2], yet [0.5, 0.5] is stationary.', 1.8, 2.4, 13, 3.2, -1, out='sum1_box', stroke=GRAY)
```

That start is a **stationary distribution** of $B$, a distribution the process leaves untouched, even though $B$ has no limiting distribution.

It is important to keep the two ideas apart:

- A limiting distribution, if it exists, does not depend on the initial state: the process eventually converges to it no matter where it began. A limiting distribution is always also stationary.
- A stationary distribution may depend on the initial state, as we just saw. Its existence does NOT imply that a limiting distribution exists.

#### Note
If you prefer thinking about particles rather than probabilities: imagine releasing a large number of particles and letting each one hop independently. The proportion of particles in each state is a proxy for the probability of finding one particle in that state, and it gets more faithful as the number of particles grows.

---

## 19.2 Markov process as a matrix
Let's write the Markov matrix generically, with column $i$ holding the next-state probabilities out of state $i$:

$$M = \begin{bmatrix} \vert & \vert & & \vert \\ \textcolor{#1d4ed8}{v_1} & \textcolor{#be185d}{v_2} & \cdots & \textcolor{#047857}{v_n} \\ \vert & \vert & & \vert \end{bmatrix}$$

If the particle is currently in the first state, the probability of it being in the first state is $1$ and of any other state is $0$. So the state itself can be written as a vector: $s_t = \begin{bmatrix} 1 & 0 & \cdots & 0 \end{bmatrix}^T$. The probabilities at the next time step are then just a matrix-vector product:

$$\begin{aligned}
s_{t+1} &= M s_t \\
&= \begin{bmatrix} \vert & \vert & & \vert \\ \textcolor{#1d4ed8}{v_1} & \textcolor{#be185d}{v_2} & \cdots & \textcolor{#047857}{v_n} \\ \vert & \vert & & \vert \end{bmatrix} \begin{bmatrix} 1 \\ 0 \\ \vdots \\ 0 \end{bmatrix} \\
&= \underbrace{\textcolor{#1d4ed8}{v_1}}_{\text{the first column, picked out by the } 1 \text{ in } s_t}
\end{aligned}$$

Similarly, the probabilities two steps ahead are

$$\begin{aligned} s_{t+2} &= M s_{t+1} \\ &= M^2 s_t \end{aligned}$$

In general, if the initial probabilities at `t = 0` are given by the vector $s_0$, the probabilities after $n$ steps are

$$s_n = M^n s_0$$

Powers of a matrix again: the long-run behavior of a Markov process is the story of $M^n$.

---

### 19.2.1 Markov matrix and stationary distribution
A stationary distribution is one the process leaves unchanged:

$$s_{t+1} = s_t \implies M s_t = s_t$$

But $M s_t = s_t$ says exactly that $s_t$ is an **eigenvector of $M$ with eigenvalue $1$**. So a Markov process has a stationary distribution precisely when its matrix has an eigenvalue equal to $1$, and the stationary probabilities are that eigenvector scaled so its entries sum to $1$. (We will see below that a Markov matrix always has the eigenvalue $1$.)

---

## 19.3 A Markov matrix preserves the sum of a vector
Each column of $M$ sums to $1$. We can say the same thing in one equation: multiplying by a row of ones on the left adds up each column, so

$$\begin{bmatrix} 1 & 1 & \cdots & 1 \end{bmatrix} M = \begin{bmatrix} 1 & 1 & \cdots & 1 \end{bmatrix}$$

Let's call this row vector $\overrightarrow{1}$, so that $\overrightarrow{1} M = \overrightarrow{1}$. You can think of $\overrightarrow{1}$ as a function: feed it a vector $v$ and it returns the sum of the entries of $v$, since $\overrightarrow{1} v = \sum_i v_i$.

Now take any vector $v$ and sum the entries of $Mv$:

$$\begin{aligned}
\overrightarrow{1} (Mv) &= (\overrightarrow{1} M) v & \text{regroup} \\
&= \overrightarrow{1} v & \text{since } \overrightarrow{1} M = \overrightarrow{1}
\end{aligned}$$

The sum of the entries of $Mv$ equals the sum of the entries of $v$. Multiplying _any_ vector by a Markov matrix preserves the sum of its values. (This is why $M s_t$ is again a valid probability vector: the entries still sum to $1$.)

```python-editor collapsed
pie.clear()
pie.scalar(70, out='unit')
GRAY, GOLD = '#71717a', '#ca8a04'
a = pie.scalar(0.3, out='a')
b = pie.scalar(0.1, out='b')
one_minus = pie.lift(lambda v: 1 - v, pie.Scalar)
# Columns (a, 1 - a) and (1 - b, b): each sums to 1
m = [[a, one_minus(b)], [one_minus(a), b]]
pie.la_array_to_texts(m, 2.0, 1.2, 0.6, 0.6, out='readout')
pie.la_circle_transform2(m, 20, out='fan')
```

For a 2-by-2 Markov matrix this means an input vector $\begin{bmatrix} p & q \end{bmatrix}^T$ is mapped to another point on the line $x + y = p + q$. We can watch this happen by transforming points on a circle and joining each input point to its output point.

Every joining segment is parallel to the line $x + y = 0$: multiplication by $M$ can only slide a point along the direction that keeps $x + y$ constant.

```python-editor collapsed
pie.line(pie.point(-1.7, 1.7, out='gp1', hidden=True), pie.point(1.7, -1.7, out='gp2', hidden=True), out='gline', stroke=GOLD)
pie.text('x + y = 0', 1.2, -1.7, 14, out='xy_label', stroke=GOLD)
pie.text('Mv keeps x + y constant: every input→output segment is parallel to x + y = 0, whatever M is.', 3, -1, 13, 1.8, -1, out='sum2_box', stroke=GRAY)
```

Change the matrix and the output ellipse changes shape, but the segments stay parallel to that same line.

```python-editor collapsed
pie.translate_scalar_to([a, b], [0.8, 0.5], animate=True)
```

---

## 19.4 The product of two Markov matrices is a Markov matrix
Let $A$ and $B$ be Markov matrices and let $C = AB$. Since $\overrightarrow{1} A = \overrightarrow{1}$ and $\overrightarrow{1} B = \overrightarrow{1}$, we get

$$\begin{aligned}
\overrightarrow{1} C &= \overrightarrow{1} (AB) \\
&= (\overrightarrow{1} A) B & \text{regroup} \\
&= \overrightarrow{1} B & \text{since } \overrightarrow{1} A = \overrightarrow{1} \\
&= \overrightarrow{1} & \text{since } \overrightarrow{1} B = \overrightarrow{1}
\end{aligned}$$

The columns of $C$ sum to $1$, and its entries are non-negative (sums of products of non-negative numbers), so $C$ is a Markov matrix. In particular every power $M^n$ of a Markov matrix is again a Markov matrix.

---

## 19.5 Eigenvalues and eigenvectors of a Markov matrix
A Markov matrix has largest eigenvalue equal to $1$; every other eigenvalue is at most $1$ in absolute value.

It is easy to see that $1$ is always an eigenvalue. We have $\overrightarrow{1} M = \overrightarrow{1}$, which transposes to $M^T \overrightarrow{1}^T = \overrightarrow{1}^T$, so $1$ is an eigenvalue of $M^T$. And we saw earlier that a matrix and its transpose have the same eigenvalues, so $M$ has the eigenvalue $1$ too.

Why is it the largest? Suppose some eigenvalue had $|\textcolor{#b45309}{\lambda}| > 1$. We saw in the chapter on powers of a matrix that for large $n$, $M^n x \approx \textcolor{#b45309}{\lambda}^n c\, v$ along the dominant eigenvector, so $M^n x$ would blow up in magnitude. But $M^n$ is itself a Markov matrix for every $n$: its entries stay between $0$ and $1$, so $M^n x$ stays bounded. No blow-up is possible, hence $|\textcolor{#b45309}{\lambda}| \le 1$ for every eigenvalue, and $\textcolor{#b45309}{\lambda} = 1$ is the largest.

The eigenvalue $1$ showed up here as the fixed point of a Markov process. Next we meet a family of matrices whose only eigenvalues are $0$ and $1$: projection matrices, the workhorses behind least squares.

---

[← 18. Fibonacci numbers](/la/18_fibonacci_numbers)  ·  [20. Projection matrix →](/la/20_projection_matrix)
