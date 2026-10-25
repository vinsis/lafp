---
title: 17. Powers of a matrix
canvas: left
---

# 17. Powers of a matrix

<details>
<summary>Review</summary>

A symmetric matrix has real eigenvalues and perpendicular eigenvectors, which makes its eigendecomposition especially clean. More generally, whenever a matrix $M$ has a full set of eigenvectors we can write $M = VDV^{-1}$, and raising $M$ to a power only touches the diagonal core: $M^k = VD^kV^{-1}$. This chapter turns that fact into a surprisingly practical algorithm.

</details>

**Power iteration** (also called the power method) is a simple algorithm for finding the largest eigenvalue of a matrix and its corresponding eigenvector. It works by repeatedly applying the matrix to a vector, and it falls right out of what we already know about matrix powers.

---

## 17.1 Let's keep transforming a vector
Given a matrix $M$ and a starting vector $v$, repeat these steps:

1. Normalize $v$ to unit length: $v_{unit} = \dfrac{v}{\|v\|}$.
2. Replace $v$ with the matrix-vector product: $v = M v_{unit}$.
3. Go back to step 1.

Here is a small program that does exactly this:

```python
Vector = [float]
Matrix = [[float]]

def scale_vector(scale: float, vector: Vector) -> Vector:
    return [i * scale for i in vector]

def add_vectors(array_of_vectors: Matrix) -> Vector:
    dimensionality = len(array_of_vectors[0])
    output = [0] * dimensionality
    for vector in array_of_vectors:
        output = [i + j for (i, j) in zip(output, vector)]
    return output

def get_matrix_vector_product(matrix: Matrix, vector: Vector) -> Vector:
    scaled_vectors = [scale_vector(scale, vector)
        for (scale, vector) in zip(vector, matrix)]
    return add_vectors(scaled_vectors)

def get_norm(vector: Vector) -> float:
    return (sum(i ** 2 for i in vector)) ** 0.5

def get_unit_vector(vector: Vector) -> Vector:
    norm = get_norm(vector)
    return [i / norm for i in vector]

vector = [1, 1]
matrix = [[1.5, 0.2], [0.5, 0.5]]
num_steps = 100

for _ in range(num_steps):
    vector = get_unit_vector(vector)
    vector = get_matrix_vector_product(matrix, vector)
```

---

### 17.1.1 When does it converge?
Let's watch the iteration $v = M\left(\dfrac{v}{\|v\|}\right)$ run for two different matrices. The starting vector does not matter, so we begin with $x = [1, 1]$ in both cases.

Start with

$$A = \begin{bmatrix} 1.5 & 0.1 \\ 0.5 & 0.5 \end{bmatrix}$$

whose largest eigenvalue is $\textcolor{#b45309}{\lambda} \approx 1.54$.

```python-editor collapsed
pie.clear()
pie.scalar(100, out='unit')
GRAY, TEAL, GOLD, VIOLET = '#71717a', '#0d9488', '#ca8a04', '#6d28d9'
p0 = pie.point(0, 0, out='p0', hidden=True)
pie.circle(p0, 1, out='circ', stroke=GRAY)
pie.la_mat_to_ellipse([[1.5, 0.1], [0.5, 0.5]], p0, out='ellA', stroke=GRAY)
```

First see how $A$ stretches the unit circle into an ellipse,

then reveal the dominant eigenvector direction, the direction stretched the most.

```python-editor collapsed
pie.line(pie.point(3.6, 1.73, out='ea', hidden=True), pie.point(-3.6, -1.73, out='eb', hidden=True), out='eline', stroke=VIOLET)
pie.text('λ ≈ 1.54', 2.95, 1.5, 13, out='lblE', stroke=VIOLET)
```

Now run the iteration one step at a time.

- Start with $\textcolor{#0d9488}{x} = [1, 1]$, normalized.

```python-editor collapsed
pie.la_vec2d(2.12, 2.12, out='x0', stroke=TEAL)
pie.text('x₀', 2.5, 2.5, 13, out='lblX0', stroke=TEAL)
```

- Apply $A$ and renormalize.
- Again.
- Again.
- And once more.

```python-editor collapsed
pie.la_vec2d(2.54, 1.59, out='x1', stroke=TEAL)
pie.la_vec2d(2.66, 1.39, out='x2', stroke=TEAL)
pie.la_vec2d(2.69, 1.32, out='x3', stroke=TEAL)
pie.la_vec2d(2.70, 1.30, out='x4', stroke=GOLD)
pie.text('x₄', 3.2, 1.5, 13, out='lblX4', stroke=GOLD)
pie.text('The iteration converges onto the dominant eigenvector, the direction [0.90, 0.43].', 0, -2, 12, 2.4, -1, out='sumA', stroke=GOLD)
```

Each new arrow leans closer to the violet line, and after only a few steps $\textcolor{#ca8a04}{x}$ has locked onto the dominant eigenvector: it **converges** to the direction $[0.90,\, 0.43]$.

---

Now try the scaled rotation

$$\begin{aligned}
B &= 1.6 \begin{bmatrix} \cos 60^\circ & -\sin 60^\circ \\ \sin 60^\circ & \cos 60^\circ \end{bmatrix} \\
  &= \begin{bmatrix} 0.8 & -1.39 \\ 1.39 & 0.8 \end{bmatrix}
\end{aligned}$$

which has no real eigenvectors, since a rotation moves every direction.

```python-editor collapsed
pie.clear()
pie.scalar(50, out='unit')
GRAY, TEAL, GOLD = '#71717a', '#0d9488', '#ca8a04'
p0 = pie.point(0, 0, out='p0', hidden=True)
pie.circle(p0, 1, out='circ', stroke=GRAY)
pie.la_mat_to_ellipse([[0.8, -1.386], [1.386, 0.8]], p0, out='ellB', stroke=GRAY)
```

See how $B$ maps the unit circle.

Then iterate:

- Start with $\textcolor{#0d9488}{x} = [1, 1]$.

```python-editor collapsed
y0 = pie.la_vec2d(2.12, 2.12, out='y0', stroke=TEAL)
pie.text('y₀', 2.55, 2.55, 13, out='lblY0', stroke=TEAL)
```

- Apply $B$ and renormalize.

```python-editor collapsed
y1 = pie.la_vec2d(-0.78, 2.9, out='y1', stroke=TEAL)
pie.text('y₁', -0.95, 3.5, 13, out='lblY1', stroke=TEAL)
pie.annotate_angle_mark(y0, y1, out='angB', stroke=GOLD)
```

- Again.

```python-editor collapsed
pie.la_vec2d(-2.9, 0.78, out='y2', stroke=TEAL)
pie.text('y₂', -3.5, 0.95, 13, out='lblY2', stroke=TEAL)
```

- Again.

```python-editor collapsed
pie.la_vec2d(-2.12, -2.12, out='y3', stroke=TEAL)
pie.text('y₃', -2.55, -2.55, 13, out='lblY3', stroke=TEAL)
```

- And again.

```python-editor collapsed
pie.la_vec2d(0.78, -2.9, out='y4', stroke=GOLD)
pie.text('y₄', 0.95, -3.5, 13, out='lblY4', stroke=GOLD)
pie.text('A rotation has no real eigenvector, so the iteration never settles, it marches 60° around the circle forever.', 0, -4, 12, 2.6, -1, out='sumB', stroke=GOLD)
```

The arrow turns by $60^\circ$ at every step and marches around the circle forever: it **never converges**.

So when does the iteration converge, and to what direction?

---

### 17.1.2 The answer
For an $n \times n$ matrix $M$, the iteration converges to the eigenvector belonging to the largest eigenvalue if all three of the following hold:

- $M$ is **diagonalizable**, meaning $M = VDV^{-1}$ where $V$ has rank $n$ (its columns are the eigenvectors of $M$) and $D$ is diagonal (its entries are the eigenvalues of $M$).
- The largest **absolute** eigenvalue of $M$ is **unique**.
- The starting vector $x$ is **not perpendicular** to the eigenvector of that largest absolute eigenvalue.

The rotation $B$ fails the first two conditions (it has no real eigendecomposition), which is why its iteration never settles.

---

### 17.1.3 But why?
At each step we compute $v_{n+1} = M \cdot \dfrac{v_n}{\|v_n\|}$. This is _similar_ to just repeatedly multiplying by $M$, that is, computing $M^n v_0$ where $v_0$ is the starting vector. Why similar? Because the loop

```python
for _ in range(num_steps):
    vector = get_unit_vector(vector)
    vector = get_matrix_vector_product(matrix, vector)
```

differs from the plain power loop

```python
for _ in range(num_steps):
    vector = get_matrix_vector_product(matrix, vector)
```

only by the renormalization at the start of each step. And scaling the input of a matrix only scales the output by the same factor: $M(\textcolor{#0d9488}{c}x) = \textcolor{#0d9488}{c}(Mx)$. It never changes the _direction_ of the output.

So the normalized iteration $v_{n+1} = M \dfrac{v_n}{\|v_n\|}$ and the raw power iteration $w_{n+1} = M^n v_0$ always point in the same direction, differing only in length. If one converges in direction, so does the other. Now look at what a matrix power does through the eigendecomposition:

$$\begin{aligned}
M^k &= VD^kV^{-1} \\
&= V \underbrace{\begin{bmatrix} \textcolor{#b45309}{\lambda_1^k} & 0 & \cdots & 0 \\ 0 & \textcolor{#b45309}{\lambda_2^k} & \cdots & 0 \\ \vdots & \vdots & \ddots & \vdots \\ 0 & 0 & \cdots & \textcolor{#b45309}{\lambda_n^k} \end{bmatrix}}_{D^k:\ \text{each eigenvalue raised to the } k\text{-th power}} V^{-1}
\end{aligned}$$

The key observation is that raising numbers to a power does not change which one is largest:

```python
argmax(array) == argmax([i ** k for i in array])
```

Assume $\textcolor{#b45309}{\lambda_1}$ is the largest absolute eigenvalue, so $\textcolor{#b45309}{\lambda_1^k}$ is the largest entry of $D^k$. As $k$ grows, $\textcolor{#b45309}{\lambda_1^k}$ pulls away from all the others, because each ratio $(\lambda_1 / \lambda_i)^k$ (for $i \ne 1$) blows up. So $D^k$ becomes dominated by its top-left entry:

$$\underbrace{\begin{bmatrix} \textcolor{#b45309}{\lambda_1^k} & 0 & \cdots & 0 \\ 0 & \lambda_2^k & \cdots & 0 \\ \vdots & \vdots & \ddots & \vdots \\ 0 & 0 & \cdots & \lambda_n^k \end{bmatrix}}_{D^k} \approx \underbrace{\begin{bmatrix} \textcolor{#b45309}{\lambda_1^k} & 0 & \cdots & 0 \\ 0 & 0 & \cdots & 0 \\ \vdots & \vdots & \ddots & \vdots \\ 0 & 0 & \cdots & 0 \end{bmatrix}}_{\text{every other eigenvalue crushed toward } 0}$$

which gives $M^k \approx V \begin{bmatrix} \textcolor{#b45309}{\lambda_1^k} & 0 & \cdots \\ 0 & 0 & \cdots \\ \vdots & \vdots & \ddots \end{bmatrix} V^{-1}$. Reading this from right to left:

- As $k$ grows, applying it to $x$ scales the first coordinate of $V^{-1}x$ by $\textcolor{#b45309}{\lambda_1^k}$ and crushes every other coordinate toward $0$.
- So the middle vector keeps only its first entry: it looks like $[c, 0, \ldots, 0]$ for some number $c$.
- Multiplying that by $V$ picks out $c$ times the **first column of $V$**, which is exactly the eigenvector $\textcolor{#1d4ed8}{v_1}$ of the largest absolute eigenvalue:

$$\begin{bmatrix} \vert & \vert & & \vert \\ \textcolor{#1d4ed8}{v_1} & v_2 & \cdots & v_n \\ \vert & \vert & & \vert \end{bmatrix} \begin{bmatrix} c \\ 0 \\ \vdots \\ 0 \end{bmatrix} = c\, \textcolor{#1d4ed8}{v_1}$$

So $M^k v_0 \approx c\, \textcolor{#1d4ed8}{v_1}$: the raw power iteration lines up with the dominant eigenvector, and therefore so does the normalized power iteration. That is the direction $x$ converged to for matrix $A$.

---

## 17.2 Finding the largest eigenvalue
This hands us an easy way to find the largest absolute eigenvalue and its eigenvector for any diagonalizable matrix $M$: iterate until $x$ stops moving, and the amount by which $M$ then stretches $x$ is that eigenvalue.

It is especially valuable when $M$ is **sparse**, because a matrix-vector product with a sparse matrix is cheap, and power iteration only ever needs matrix-vector products, never the full eigendecomposition. According to [this Wikipedia article](https://en.wikipedia.org/wiki/Power_iteration), Google used exactly this idea to compute the dominant eigenvector of the enormous matrix representing links between web pages.

One of the most elegant consequences of these ideas is **Binet's formula** for Fibonacci numbers, which we turn to next.

In the next chapter we use eigendecomposition and matrix powers to derive a closed-form expression for the $n$-th **Fibonacci number**, turning a recursive sequence into a single formula.

---

[← 16. Eigenvectors of symmetric matrices](/la/16_eigenvectors_symmetric_matrices)  ·  [18. Fibonacci numbers →](/la/18_fibonacci_numbers)
