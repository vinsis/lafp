---
title: Doubly stochastic matrices
description: Properties of doubly stochastic matrices, majorization, and Muirhead's inequality, with Python checks.
canvas: left
---

# Doubly stochastic matrices

Consider all possible `n!` permutations of a `n`-dimensional vector `x`. This gives us `n!` permutation vectors in $R^n$ and `n!` permutation matrices in $R^{n \times n}$. Each of these vectors is equal to $Px$ for each permutation matrix $P$:

```python-editor collapsed
import math

pie.clear()
pie.scalar(50, out='unit')
TEAL, PINK, AMBER, GRAY = '#0d9488', '#be185d', '#b45309', '#71717a'

# The 6 corners of a regular hexagon: center (cx, cy), radius r, first corner at `rotation` degrees
def hexagon(cx, cy, r, rotation):
    angles = [math.radians(rotation + 60 * k) for k in range(6)]
    return [pie.point(cx + r * math.cos(a), cy + r * math.sin(a), hidden=True) for a in angles]

pie.polygon(hexagon(-3.2, 0, 2.2, 90), out='hex_left', fill='#0d948833', stroke=TEAL)
pie.polygon(hexagon(3.2, 0, 2.2, 180), out='hex_right', fill='#be185d33', stroke=PINK)
lv0 = pie.point(-3.2, 2.2, out='lv0', fill=TEAL)
rv0 = pie.point(1, 0, out='rv0', fill=PINK)
pt_D = pie.point(-3.2, -0.3, out='pt_D', fill=AMBER)
pt_Dx = pie.point(3.2, -0.3, out='pt_Dx', fill=AMBER)
pie.text('P', -3.2, 2.65, 20, out='lab_P', stroke=TEAL)
pie.text('Px', 1, -0.55, 20, out='lab_Px', stroke=PINK)
pie.text('D', -3.65, 0.1, 20, out='lab_D', stroke=AMBER)
pie.text('Dx', 3.75, 0.1, 20, out='lab_Dx', stroke=AMBER)
pie.text('(n × n)-dimensional space', -3.2, -3, 14, out='cap_left', stroke=TEAL)
pie.text('n-dimensional space', 3.2, -3, 14, out='cap_right', stroke=PINK)
pie.text('each vertex is a permutation matrix; each interior point is a doubly stochastic matrix',
         -3.2, -4.2, 12, 4.4, -1, out='rd_left', stroke=TEAL)
rd_right = pie.text('each vertex is a permutation vector; each interior point is a convex combination of them',
                    3.2, -4.2, 12, 4.4, -1, out='rd_right', stroke=PINK)

arc_ctrl = pie.point(0, 3.6, out='arc_ctrl', hidden=True)
pie.annotate_curved_arrow(lv0, rv0, arc_ctrl, 0.06, 'P ↦ Px', out='arr_P', stroke=GRAY)
arc_ctrl_d = pie.point(0, -1.8, out='arc_ctrl_d', hidden=True)
pie.annotate_curved_arrow(pt_D, pt_Dx, arc_ctrl_d, 0.05, 'D ↦ Dx', out='arr_D', stroke=AMBER)
```

Picture two spaces side by side: the polytope on the left lives in $(n \times n)$-dimensional space where $n=3$, and its six vertices are the six permutation matrices $P$.

The polytope on the right lives in $n$-dimensional space, and its six vertices are the corresponding permutation vectors $Px$. 

Inside each polytope sits an amber point: 
- $\textcolor{#b45309}{D}$ on the left is a doubly stochastic matrix, a convex combination of the permutation matrices, and 
- $\textcolor{#b45309}{Dx}$ on the right is its image.

- Each permutation matrix $P$ at a teal vertex maps to a permutation vector $Px$ at the matching pink vertex, drawn here as the grey arrow $P \mapsto Px$.
- The interior doubly stochastic matrix $\textcolor{#b45309}{D}$, being a convex combination of the vertices, maps to the point $\textcolor{#b45309}{Dx}$ inside the right polytope, which is that same convex combination of the permutation vectors.

#### Python implementation

```python
import torch

# Permutation matrices (vertices of Birkhoff polytope)
P1 = torch.eye(3)
P2 = torch.Tensor([[0,1,0],[1,0,0],[0,0,1]])
P3 = torch.Tensor([[0,0,1],[0,1,0],[1,0,0]])
P4 = torch.Tensor([[1,0,0],[0,0,1],[0,1,0]])
P5 = torch.Tensor([[0,0,1],[1,0,0],[0,1,0]])
P6 = torch.Tensor([[0,1,0],[0,0,1],[1,0,0]])

P_full = torch.stack([P1, P2, P3, P4, P5, P6], dim=-1)  # (3,3,6)
to_permute = torch.Tensor([1,2,3])

vertices = torch.stack([P_full[...,i] @ to_permute for i in range(6)])
print(vertices)

### Output ###:
tensor([[1., 2., 3.],
        [2., 1., 3.],
        [3., 2., 1.],
        [1., 3., 2.],
        [3., 1., 2.],
        [2., 3., 1.]])
```

We saw that any point inside the Birkhoff polytope is a doubly stochastic matrix `D` which can be seen as a convex sum of permutation matrices. The corresponding convex sum of permutations of `x` is given by $Dx$:

#### Verification using Python

```python
x = torch.randn(6).softmax(dim=-1)                      #    (,6)

# point is a doubly stochastic matrix
point = (P_full * x).sum(dim=-1)                        # (3,3,6) => (3,3)

# (1,6) @ (6,3) -> (1,3) -> 3
print(x @ vertices)         # convex sum of permutations of "to_permute"

# (3,3) @ (3,1) -> (3,1) -> 3
print(point @ to_permute)   # same as (x @ vertices)

### Output ###:
tensor([2.2665, 1.8233, 1.9102])
tensor([2.2665, 1.8233, 1.9102])
```

This leads to the following property:

> Each point `y` in the convex hull of all permutations of vector `x` is the product `Dx` for some doubly stochastic matrix `D`: `y = Dx`.

To appreciate its significance, we need to understand a few properties of doubly stochastic matrices.

---

## 0. Properties of doubly stochastic matrices

### 0.1. Product preserves vector sum

For a doubly stochastic matrix `D`, if `y = Dx`, we have $1^Ty = 1^Tx$. It is easy to see that:

$$\begin{aligned}
\underbrace{1^T\textcolor{#e11d48}{y}}_{\textcolor{#b45309}{\text{sum of y}}} &= 1^T(\textcolor{#e11d48}{Dx}) \\
&= (\underbrace{\textcolor{#b45309}{1^TD}}_{\textcolor{#b45309}{\text{sum of cols}}})x \\
&= \underbrace{1^Tx}_{\textcolor{#b45309}{\text{sum of x}}}
\end{aligned}$$

---

### 0.2. Input majorizes output

Given two arrays `a` and `b` of equal length `n`, we say that `a` majorizes `b` if:

$$\textcolor{#e11d48}{sum}(\text{i largest values of a}) \begin{cases} \ge \textcolor{#e11d48}{sum}(\text{i largest values of b}), & i \lt n \\ = \textcolor{#e11d48}{sum}(\text{i largest values of b}), & i = n \end{cases}$$

In other words if $a_1 \ge a_2 \ge ... a_n$ and $b_1 \ge b_2 \ge ... b_n$ then the graph of cumulative sums of $a$ is above the graph of cumulative sums of $b$ and they intersect at the $n$-th point.

> Given a doubly stochastic matrix `D` and a vector `x`, the input vector `x` majorizes the output vector `y = Dx`.

An example is shown below for permutation matrices and doubly stochastic matrices for `n=3`:

#### Verification using Python

```python
# refer to the code above for P_full
doubly_stochastic_matrix = (P_full * x).sum(dim=-1)
# pick a random vector which sums to 1
vector_in = torch.randn(3).softmax(dim=-1)
vector_out = doubly_stochastic_matrix @ vector_in
vector_in_sorted_cumsum = vector_in.sort(descending=True).values.cumsum(dim=-1)
vector_out_sorted_cumsum = vector_out.sort(descending=True).values.cumsum(dim=-1)
# condition for majorization
assert torch.all(vector_in_sorted_cumsum >= vector_out_sorted_cumsum)
print(vector_in_sorted_cumsum)
print(vector_out_sorted_cumsum)

### Output ###:
tensor([0.7674, 0.9329, 1.0000])
tensor([0.4229, 0.7315, 1.0000])
```

This property can be interpreted as "spreading out" the values of the input vector while keeping its sum the same. The limit of this "spreading out" is the vector with all equal values. In the example below, we use a different doubly stochastic matrix to show this property:

#### Verification using Python

```python
# start with a vector with all weight concentrated in one dimension
y = torch.Tensor([1,0,0])
for _ in range(10):
    # create a new doubly stochastic matrix
    x = torch.randn(6).softmax(dim=-1)
    doubly_stochastic_matrix = (P_full * x).sum(dim=-1)
    y = doubly_stochastic_matrix @ y
    print(y)

### Output ###:
tensor([0.2121, 0.3339, 0.4540])
tensor([0.3614, 0.3435, 0.2951])
tensor([0.3218, 0.3403, 0.3379])
tensor([0.3346, 0.3360, 0.3294])
tensor([0.3325, 0.3334, 0.3342])
tensor([0.3333, 0.3330, 0.3337])
tensor([0.3333, 0.3333, 0.3334])
tensor([0.3333, 0.3333, 0.3333])
tensor([0.3333, 0.3333, 0.3333])
tensor([0.3333, 0.3333, 0.3333])
```

---

## 1. Muirhead's inequality

Muirhead's inequality concerns two vectors of the same length. It involves the mean of terms of the form $\textcolor{#b45309}{x}^{{a}}\textcolor{#b45309}{y}^{{b}}\textcolor{#b45309}{z}^{{c}}$, averaged over all permutations of the base $(x, y, z)$. It can be seen as a function of two vectors `a` and `x` of equal length `n`.

The picture below lays out all six terms at once. The exponents ${a}, {b}, {c}$ stay pinned to slots 1, 2, 3; only the bases $\textcolor{#b45309}{x}, \textcolor{#b45309}{y}, \textcolor{#b45309}{z}$ shuffle, one term per permutation. All six start dim, and we light them up one at a time.

```python-editor collapsed
pie.clear()
pie.scalar(55, out='unit')
AMBER, GRAY = '#b45309', '#71717a'

pie.text('μ(a,x) = (1/3!) · Σ of the 6 terms below', 0, 4.6, 16, out='title_box')
# (term, order of the bases, x, y)
terms = [('xᵃ yᵇ zᶜ', 'x y z', -3.6, 1), ('xᵃ zᵇ yᶜ', 'x z y', 0, 1), ('yᵃ xᵇ zᶜ', 'y x z', 3.6, 1),
         ('zᵃ xᵇ yᶜ', 'z x y', -3.6, -1), ('yᵃ zᵇ xᶜ', 'y z x', 0, -1), ('zᵃ yᵇ xᶜ', 'z y x', 3.6, -1)]
term, top = {}, {}
for i, (t, bases, x, y) in enumerate(terms, 1):
    term[i] = pie.text(t, x, y, 18, out=f'term_{i}', stroke=GRAY)
    pie.text(f'bases: {bases}', x, y - 0.55, 11, out=f'map_{i}', stroke=GRAY)
    top[i] = pie.text(f'term {i} of 6:   {t}', 0, 3, 22, out=f'top_{i}', stroke=AMBER, hidden=True)
pie.text('The exponents a, b, c stay pinned to slots 1, 2, 3. Only the base letters x, y, z shuffle, '
         'one term for each of the 3! = 6 permutations.', 0, -3.4, 13, 9, -1, out='caption_box')
```

Click each term to spotlight it:

- The identity permutation keeps the bases in order: $\textcolor{#b45309}{x}^{{a}} \textcolor{#b45309}{y}^{{b}} \textcolor{#b45309}{z}^{{c}}$.

```python-editor collapsed
pie.set_stroke(term[1], AMBER)
pie.show(top[1])
```

- Swap the last two bases, $y \leftrightarrow z$, to get $\textcolor{#b45309}{x}^{{a}} \textcolor{#b45309}{z}^{{b}} \textcolor{#b45309}{y}^{{c}}$.

```python-editor collapsed
pie.set_stroke(term[1], GRAY)
pie.hide(top[1])
pie.set_stroke(term[2], AMBER)
pie.show(top[2])
```

- Back at the first term, swapping the first two bases instead, $x \leftrightarrow y$, gives $\textcolor{#b45309}{y}^{{a}} \textcolor{#b45309}{x}^{{b}} \textcolor{#b45309}{z}^{{c}}$.

```python-editor collapsed
pie.set_stroke(term[2], GRAY)
pie.hide(top[2])
pie.set_stroke(term[3], AMBER)
pie.show(top[3])
```

- Now swap that term's first and last bases, $y \leftrightarrow z$, to get $\textcolor{#b45309}{z}^{{a}} \textcolor{#b45309}{x}^{{b}} \textcolor{#b45309}{y}^{{c}}$.

```python-editor collapsed
pie.set_stroke(term[3], GRAY)
pie.hide(top[3])
pie.set_stroke(term[4], AMBER)
pie.show(top[4])
```

- Rotating all three bases one slot to the right turns $z\,x\,y$ into $\textcolor{#b45309}{y}^{{a}} \textcolor{#b45309}{z}^{{b}} \textcolor{#b45309}{x}^{{c}}$.

```python-editor collapsed
pie.set_stroke(term[4], GRAY)
pie.hide(top[4])
pie.set_stroke(term[5], AMBER)
pie.show(top[5])
```

- Finally, swapping the first two bases gives the full reversal of term 1: $\textcolor{#b45309}{z}^{{a}} \textcolor{#b45309}{y}^{{b}} \textcolor{#b45309}{x}^{{c}}$.

```python-editor collapsed
pie.set_stroke(term[5], GRAY)
pie.hide(top[5])
pie.set_stroke(term[6], AMBER)
pie.show(top[6])
```

Averaging these $3! = 6$ terms gives $\mu(a, x)$. In general, for vectors `a` and `x` of length `n`:

$$\mu(a, x) = \frac{1}{n!} \sum_{\sigma \in S_n} x_{\sigma(1)}^{{a_1}} \cdots x_{\sigma(n)}^{{a_n}}$$

for all permutations $\sigma \in S_n$.

---

### 1.1. Connection with majorization

Muirhead's inequality states that if $\textcolor{#1d4ed8}{b}$ majorizes $\textcolor{#be185d}{a}$, then $\mu(\textcolor{#be185d}{a}, x) \le \mu(\textcolor{#1d4ed8}{b}, x)$ for all $x > 0$. Writing this majorization relation as $\textcolor{#b45309}{[a] \le [b]}$, the inequality gives us the following chain of implications:

$$\begin{aligned} \textcolor{#1d4ed8}{b} \text{ majorizes } \textcolor{#be185d}{a} &\implies \mu(\textcolor{#be185d}{a}, x) \le \mu(\textcolor{#1d4ed8}{b}, x) \;\; \forall \, x > 0 \\ &\implies \textcolor{#b45309}{[a] \le [b]} \end{aligned}$$

The converse also holds: since input majorizes output for a doubly stochastic matrix, the mere existence of a doubly stochastic matrix $D$ with $\textcolor{#be185d}{a} = D\textcolor{#1d4ed8}{b}$ is already enough to conclude the same relation:

$$\textcolor{#be185d}{a} = D\textcolor{#1d4ed8}{b} \implies \textcolor{#b45309}{[a] \le [b]}$$

The below example has been taken from [here](https://artofproblemsolving.com/wiki/index.php/Muirhead%27s_Inequality). For example, $\textcolor{#1d4ed8}{[4,0,0]}$ majorizes $\textcolor{#be185d}{[2,1,1]}$. This means:

- $\underbrace{x^4 + y^4 + z^4}_{\mu(\textcolor{#1d4ed8}{b},\, x)} \ge \underbrace{x^2yz + xy^2z + xyz^2}_{\mu(\textcolor{#be185d}{a},\, x)}$
- $\begin{bmatrix} \textcolor{#be185d}{2} \\ \textcolor{#be185d}{1} \\ \textcolor{#be185d}{1} \end{bmatrix} = \begin{bmatrix} 1/2 & 1/6 & 1/3 \\ 1/4 & 3/4 & 0 \\ 1/4 & 1/12 & 2/3 \end{bmatrix} \begin{bmatrix} \textcolor{#1d4ed8}{4} \\ \textcolor{#1d4ed8}{0} \\ \textcolor{#1d4ed8}{0} \end{bmatrix}$ where the matrix is doubly stochastic.

How are these two points linked? The link becomes clear once you write the doubly stochastic matrix as a convex sum of permutation matrices. The coefficients of the convex sum are the link to the first expression:

$$\begin{aligned} \begin{bmatrix} 1/2 & 1/6 & 1/3 \\ 1/4 & 3/4 & 0 \\ 1/4 & 1/12 & 2/3 \end{bmatrix} &= \textcolor{#b45309}{\frac{1}{12}}\begin{bmatrix} 0&0&1 \\ 1&0&0 \\ 0&1&0 \end{bmatrix} + \textcolor{#b45309}{\frac{2}{12}}\begin{bmatrix} 0&1&0 \\ 1&0&0 \\ 0&0&1 \end{bmatrix} \\ &+ \textcolor{#b45309}{\frac{3}{12}}\begin{bmatrix} 0&0&1 \\ 0&1&0 \\ 1&0&0 \end{bmatrix} + \textcolor{#b45309}{\frac{6}{12}}\begin{bmatrix} 1&0&0 \\ 0&1&0 \\ 0&0&1 \end{bmatrix} \end{aligned}$$

These are exactly the same coefficients that appear when the weighted AM-GM inequality is applied to the terms $\textcolor{#1d4ed8}{x^4}, \textcolor{#1d4ed8}{y^4}, \textcolor{#1d4ed8}{z^4}$ (the terms of $\mu(\textcolor{#1d4ed8}{b}, x)$), one weighted sum per row of the doubly stochastic matrix:

$$\begin{aligned} \textcolor{#b45309}{\frac{1}{12}} \textcolor{#1d4ed8}{x^4} + \textcolor{#b45309}{\frac{2}{12}} \textcolor{#1d4ed8}{x^4} + \textcolor{#b45309}{\frac{3}{12}} \textcolor{#1d4ed8}{y^4} + \textcolor{#b45309}{\frac{6}{12}} \textcolor{#1d4ed8}{z^4} &\ge \underbrace{x^{4/12} \cdot x^{8/12} \cdot y^{12/12} \cdot z^{24/12}}_{\text{weighted AM-GM}} = \textcolor{#be185d}{xyz^2} \\ \textcolor{#b45309}{\frac{1}{12}} \textcolor{#1d4ed8}{z^4} + \textcolor{#b45309}{\frac{2}{12}} \textcolor{#1d4ed8}{z^4} + \textcolor{#b45309}{\frac{3}{12}} \textcolor{#1d4ed8}{x^4} + \textcolor{#b45309}{\frac{6}{12}} \textcolor{#1d4ed8}{y^4} &\ge z^{4/12} \cdot z^{8/12} \cdot x^{12/12} \cdot y^{24/12} = \textcolor{#be185d}{zxy^2} \\ \textcolor{#b45309}{\frac{1}{12}} \textcolor{#1d4ed8}{y^4} + \textcolor{#b45309}{\frac{2}{12}} \textcolor{#1d4ed8}{y^4} + \textcolor{#b45309}{\frac{3}{12}} \textcolor{#1d4ed8}{z^4} + \textcolor{#b45309}{\frac{6}{12}} \textcolor{#1d4ed8}{x^4} &\ge y^{4/12} \cdot y^{8/12} \cdot z^{12/12} \cdot x^{24/12} = \textcolor{#be185d}{yzx^2} \end{aligned}$$

Each row's right-hand side is one of the three terms of $\mu(\textcolor{#be185d}{a}, x)$. Summing the left-hand sides recovers $\textcolor{#1d4ed8}{x^4 + y^4 + z^4}$, since each of $\textcolor{#1d4ed8}{x^4}, \textcolor{#1d4ed8}{y^4}, \textcolor{#1d4ed8}{z^4}$ appears across the three rows with total weight $\frac{1+2+3+6}{12} = 1$; summing the right-hand sides recovers $\textcolor{#be185d}{x^2yz + xy^2z + xyz^2}$. Together they give us the first expression. Given a doubly stochastic matrix, how can one express it as a convex sum of permutation matrices? This is what we explore next.

---

[← Birkhoff polytope](/series/permutation_sinkhorn/3_birkhoff_polytope)  ·  [Birkhoff-von-Neumann algorithm →](/series/permutation_sinkhorn/5_birkhoff_von_neumann)
