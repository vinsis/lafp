---
title: Matrix-matrix multiplication, visualized
description: How to multiply two matrices, why it is associative but usually not commutative, and how to see it as composing and factorizing transformations.
canvas: left
sidebar: _ebook.md
---

# 6. Matrix-matrix multiplication

<details>
<summary>Review</summary>

A matrix-vector product $Mv$ can be viewed as a weighted sum of the columns of $M$. The matrix $M$ can also be viewed as a function that maps the point $v$ to the point $Mv$. In the last chapter we used the inverse $M^{-1}$, the function that undoes $M$, to check whether a point lies inside a triangle.

</details>

---

In this chapter we multiply a matrix with another matrix, and meet the powerful idea of _composing_ and _decomposing_ transformations.

---

## 6.1 The two lenses of matrix-vector multiplication
We introduced matrix-vector multiplication by taking a weighted sum of vectors. Then we changed our perspective to view a matrix as a function that takes in a vector and outputs another vector. Viewing through this lens allowed us to say things like _"a matrix maps point A to point B"_ or _"a matrix transforms a circle into an ellipse"_.

We will follow a similar approach here: we will look at _a_ way to multiply two matrices. Then we will look at matrix-matrix multiplication through an entirely different lens which will enable us to see some insightful (and pretty!) visuals.

### 6.1.1 Let's bring in some notation
We will use an upper case letter like $M$ to denote a matrix, and a lower case letter like $v$ to denote a vector. If we are dealing with more than one matrices or vectors, we will either use different names like $M, N, v, w, ...$ or use subscripts $M_1, M_2, ...$ and $v_1, v_2, ...$

The matrix-vector product of $M$ and $v$ will be written as $Mv$.

> Remember that $Mv$ is a vector, not a matrix. Similarly $M_1v_2$ is also a vector - it is the product of the matrix $M_1$ and the vector $v_2$.

---

### 6.1.2 Remember that matrix-vector multiplication is linear
It follows the two rules of linearity:

1. Adding vectors in the input space followed by a matrix transformation is the same as transforming the input vectors first and then adding them up.

   $$\underbrace{M\underbrace{(\textcolor{#1d4ed8}{u} + \textcolor{#be185d}{v} + \cdots)}_{\text{add the inputs}}}_{\text{then transform}} = \underbrace{\underbrace{\textcolor{#1d4ed8}{Mu}}_{\text{transform}} + \underbrace{\textcolor{#be185d}{Mv}}_{\text{transform}} + \cdots}_{\text{then add the outputs}}$$

2. Scaling a vector in the input space followed by a matrix transformation is the same as doing the matrix transformation first and then scaling the output vector by the same amount.

   $$\underbrace{M\underbrace{(\textcolor{#1d4ed8}{u} \cdot \textcolor{#047857}{c})}_{\text{scale the input}}}_{\text{then transform}} = \underbrace{\underbrace{(\textcolor{#1d4ed8}{Mu})}_{\text{transform}} \cdot \textcolor{#047857}{c}}_{\text{then scale the output}}$$

Let's write down some functions to perform matrix-vector multiplication:

```python-editor
Vector = [float]
Matrix = [[float]]
    
def scale_vector(scale:float, vector:Vector) -> Vector:
    return [i*scale for i in vector]

def add_vectors(array_of_vectors:Matrix) -> Vector:
    dimensionality = len(array_of_vectors[0])
    output = [0]*dimensionality
    for vector in array_of_vectors:
        output = [i+j for (i,j) in zip(output, vector)]
    return output

def get_matrix_vector_product(matrix:Matrix, vector:Vector) -> Vector:
    scaled_vectors = [scale_vector(scale, vector) 
        for (scale, vector) in zip(vector, matrix)]
    return add_vectors(scaled_vectors)
```

---

## 6.2 Definition: what is matrix multiplication?
Let $M$ be a matrix and $v_1, v_2$ be two vectors. Note that the matrix-vector products $Mv_1$ and $Mv_2$ are also vectors. Let us _invent_ a new format to show these two matrix-vector multiplications in a single expression:

$$M \begin{bmatrix} \textcolor{#1d4ed8}{v_1} & \textcolor{#be185d}{v_2} \end{bmatrix} = \begin{bmatrix} \textcolor{#1d4ed8}{Mv_1} & \textcolor{#be185d}{Mv_2} \end{bmatrix}$$

To make it clearer that $\textcolor{#1d4ed8}{v_1}, \textcolor{#be185d}{v_2}, \textcolor{#1d4ed8}{Mv_1}, \textcolor{#be185d}{Mv_2}$ are _column_ vectors, we can modify the expression as shown below (the vertical lines denote that each entry is a column):

$$M \begin{bmatrix} | & | \\ \textcolor{#1d4ed8}{v_1} & \textcolor{#be185d}{v_2} \\ | & | \end{bmatrix} = \begin{bmatrix} | & | \\ \textcolor{#1d4ed8}{Mv_1} & \textcolor{#be185d}{Mv_2} \\ | & | \end{bmatrix}$$

But a matrix is just an _array_ or an ordered collection of vectors. This means that both $\begin{bmatrix} | & | \\ \textcolor{#1d4ed8}{v_1} & \textcolor{#be185d}{v_2} \\ | & | \end{bmatrix}$ and $\begin{bmatrix} | & | \\ \textcolor{#1d4ed8}{Mv_1} & \textcolor{#be185d}{Mv_2} \\ | & | \end{bmatrix}$ are matrices. Let's name them `X` and `Y`. This gives us: $MX = Y$. There we have it, a matrix-matrix multiplication!

Once you have the function to calculate a matrix-vector product, `get_matrix_vector_product`, it is really easy to implement a matrix-matrix product using it:

```python-editor
def get_matrix_matrix_product(A:Matrix, B:Matrix) -> Matrix:
    return [get_matrix_vector_product(A,v) for v in B]

# Each inner list is a column
A = [[1, 0], [1, 1]]
B = [[-1, 1], [1, 1]]
print(get_matrix_matrix_product(A, B))  # [[0, 1], [2, 1]]
```

Note that this function is meant to illustrate what matrix-matrix multiplication is - it is not an efficient implementation. You should use the native functions to multiply two matrices (especially if they are large matrices).

### 6.2.1 Generalizing it to any number of vectors
We can use the same format to show $n$ matrix-vector multiplications in a single expression:

$$M \begin{bmatrix} | & | & & | \\ v_1 & v_2 & \cdots & v_n \\ | & | & & | \end{bmatrix} = \begin{bmatrix} | & | & & | \\ Mv_1 & Mv_2 & \cdots & Mv_n \\ | & | & & | \end{bmatrix}$$

Thus a matrix-matrix multiplication is just a collection of many matrix-vector multiplications, and the matrix-matrix product is just a collection of many matrix-vector products. Now some observations which should be obvious by now:

1. The dimensionality of each vector $v_1, v_2, ..., v_n$ in the right matrix needs to be the same as the number of columns in the left matrix `M`.
2. The number of columns (or vectors) in the product is the same as the number of columns in the right matrix (`n` in the example above).
3. The number of rows (or dimensionality of each output vector) in the product is the same as the number of rows in the left matrix.

---

## 6.3 Some properties of matrix-matrix multiplication

### 6.3.1 Matrix-matrix multiplication is associative
That is, $(PQ)x = P(Qx)$. Note that $P, Q, PQ$ are matrices whereas $x, Qx, PQx$ are vectors.

Let $Q = \begin{bmatrix} | & | & & | \\ \textcolor{#1d4ed8}{q_1} & \textcolor{#be185d}{q_2} & \cdots & \textcolor{#047857}{q_n} \\ | & | & & | \end{bmatrix}$ and let $x = \begin{bmatrix} \textcolor{#1d4ed8}{x_1} \\ \textcolor{#be185d}{x_2} \\ \vdots \\ \textcolor{#047857}{x_n} \end{bmatrix}$, with each $\textcolor{#1d4ed8}{x_1}, \textcolor{#be185d}{x_2}, \ldots, \textcolor{#047857}{x_n}$ colored to match the column of $Q$ it scales. Then we have

$$
\begin{aligned}
(PQ)x &= \begin{bmatrix} | & | & & | \\ P\textcolor{#1d4ed8}{q_1} & P\textcolor{#be185d}{q_2} & \cdots & P\textcolor{#047857}{q_n} \\ | & | & & | \end{bmatrix} \begin{bmatrix} \textcolor{#1d4ed8}{x_1} \\ \textcolor{#be185d}{x_2} \\ \vdots \\ \textcolor{#047857}{x_n} \end{bmatrix} \\
&= \underbrace{(Pq_1) \cdot \textcolor{#1d4ed8}{x_1} + (Pq_2) \cdot \textcolor{#be185d}{x_2} + \cdots + (Pq_n) \cdot \textcolor{#047857}{x_n}}_{\text{weighted sum of the columns of } PQ} \\
&= P(\textcolor{#1d4ed8}{x_1} q_1) + P(\textcolor{#be185d}{x_2} q_2) + \cdots + P(\textcolor{#047857}{x_n} q_n) \quad \text{since } M(u \cdot c) = (Mu) \cdot c \\
&= P(\textcolor{#1d4ed8}{x_1} q_1 + \textcolor{#be185d}{x_2} q_2 + \cdots + \textcolor{#047857}{x_n} q_n) \quad \text{since } M(u + v + \cdots) = Mu + Mv + \cdots \\
&= P(Qx)
\end{aligned}
$$

### 6.3.2 Matrix-matrix multiplication is also linear
This can easily be seen from the fact that a matrix-matrix product is a _"collection"_ of multiple matrix-vector products. And we have seen earlier that matrix-vector multiplication is linear. You can try to find a rigorous (and proper) proof yourself.

$$M(A+B) = MA + MB \quad \text{and} \quad M(A \text{ scaled by } c) = MA \text{ scaled by } c$$

Just like scaling a vector, scaling a matrix means multiplying each entry inside the matrix by the scale.

### 6.3.3 Usually AB != BA
You can check this by looking at the output of the matrix _function_ `AB` and the matrix _function_ `BA` for the same input `x`. As an example, we will use `2-by-2` matrices:

$$A = \begin{bmatrix} | & | \\ \textcolor{#1d4ed8}{a_1} & \textcolor{#be185d}{a_2} \\ | & | \end{bmatrix}, \quad B = \begin{bmatrix} | & | \\ \textcolor{#047857}{b_1} & \textcolor{#b45309}{b_2} \\ | & | \end{bmatrix}, \quad x = \begin{bmatrix} x_1 \\ x_2 \end{bmatrix}$$

We can see that

$$
\begin{aligned}
ABx &= A(x_1 \textcolor{#047857}{b_1} + x_2 \textcolor{#b45309}{b_2}) \quad \text{(}B\text{ mixes its own columns first)} \\
BAx &= B(x_1 \textcolor{#1d4ed8}{a_1} + x_2 \textcolor{#be185d}{a_2}) \quad \text{(}A\text{ mixes its own columns first)}
\end{aligned}
$$

They are not equal. In the sections below we will visualize this difference in greater detail.

---

## 6.4 Visualizing matrix-matrix multiplication

```python-editor collapsed
pie.clear()
BLUE, PINK, GRID = '#1d4ed8', '#be185d', '#a1a1aa'
# The current matrix, row-major. It starts as the identity.
s11 = pie.scalar(1, out='s11')
s12 = pie.scalar(0, out='s12')
s21 = pie.scalar(0, out='s21')
s22 = pie.scalar(1, out='s22')
S = [s11, s12, s21, s22]
current = [[s11, s12], [s21, s22]]
pie.la_grid_transform(current, out='grid', stroke=GRID)
pie.la_vec2d(s11, s21, out='v1', stroke=BLUE)
pie.la_vec2d(s12, s22, out='v2', stroke=PINK)
pie.la_array_to_texts(current, -5, -4, 1, 1, 16, out='curviz')
```

We have already seen some visual examples of how `2-by-2` matrices transform the input space (points, lines, circles etc). Note that if `A` and `B` are `2-by-2` matrices, their products `AB` and `BA` are also `2-by-2` matrices. Thus we can visualize how these matrices `AB` and `BA` transform the input space.

Since `AB(x) = A(Bx)`, we can see how an input vector `x` is mapped to `Bx` first and then how the vector `Bx` is mapped to `ABx`. This allows us to _decompose_ the transformation by the matrix `AB` into two transformations: `B` then `A`.

> In the product $AB$, the matrix $B$ acts on the input first, and then $A$ acts on the result - the product is read right-to-left.

For the visualizations we use

$$A = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}, \quad B = \begin{bmatrix} -1 & 1 \\ 1 & 1 \end{bmatrix}$$

This gives us

$$
\begin{aligned}
AB &= \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} -1 & 1 \\ 1 & 1 \end{bmatrix} = \begin{bmatrix} 0 & 2 \\ 1 & 1 \end{bmatrix} \\
BA &= \begin{bmatrix} -1 & 1 \\ 1 & 1 \end{bmatrix} \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} -1 & 0 \\ 1 & 2 \end{bmatrix}
\end{aligned}
$$

The canvas shows the input grid transformed by the current matrix, which starts as the identity matrix (so the grid is undistorted). The blue arrow is the first column of the current matrix - the image of the vector `[1,0]` - and the pink arrow is the second column, the image of `[0,1]`. The current matrix itself is shown in the bottom-left corner.

Let's decompose the transformation by `AB` into two steps:

- First multiply the identity by $B$: the grid is now transformed by $B$.

```python-editor collapsed
pie.translate_scalar_to(S, [-1, 1, 1, 1], animate=True)
```

- Now multiply the result by $A$: the grid is now transformed by $AB$.

```python-editor collapsed
pie.translate_scalar_to(S, [0, 2, 1, 1], animate=True)
```

Now let's apply the two matrices in the opposite order:

- Reset to the identity first.

```python-editor collapsed
pie.translate_scalar_to(S, [1, 0, 0, 1], animate=True)
```

- Multiply by $A$: the grid is now transformed by $A$.

```python-editor collapsed
pie.translate_scalar_to(S, [1, 1, 0, 1], animate=True)
```

- Then multiply by $B$: the grid is now transformed by $BA$.

```python-editor collapsed
pie.translate_scalar_to(S, [-1, 0, 1, 2], animate=True)
```

The end result is different from $AB$ - a visual confirmation that $AB \neq BA$. You can flip between the transformation by $AB$ and the transformation by $BA$ to compare them directly:

```python-editor collapsed
# One weight per product. The chosen one's is 1, so each entry moves between its AB and BA value.
choice = pie.scalar([1, 0], out='choice')
blend = pie.lift(lambda w_ab, w_ba, ab, ba: w_ab * ab + w_ba * ba, pie.Scalar)
for out, ab, ba in [('s11', 0, -1), ('s12', 2, 0), ('s21', 1, 1), ('s22', 1, 2)]:
    blend(choice[0], choice[1], ab, ba, out=out)

A_TEX = r'\begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}'
B_TEX = r'\begin{bmatrix} -1 & 1 \\ 1 & 1 \end{bmatrix}'

def product_tex(s11, s12, s21, s22):  # columns colored like the arrows
    return r'\begin{bmatrix} \textcolor{#1d4ed8}{%d} & \textcolor{#be185d}{%d} \\ \textcolor{#1d4ed8}{%d} & \textcolor{#be185d}{%d} \end{bmatrix}' % (s11, s12, s21, s22)

AB_TEX = 'AB = ' + A_TEX + B_TEX + ' = ' + product_tex(0, 2, 1, 1)
BA_TEX = 'BA = ' + B_TEX + A_TEX + ' = ' + product_tex(-1, 0, 1, 2)

pie.ui.animated_radio(choice, options=['AB', 'BA'], label='Product:')
pie.ui.latex(pie.lift(lambda w_ab: AB_TEX if w_ab > 0.5 else BA_TEX, pie.Text)(choice[0]))
```

---

## 6.5 The idea of "factorizing" a matrix into a product of two matrices
In many cases, decomposing the transformation of a matrix $M$ into two or more transformations $A, B, C, ...$ makes it easier to understand how $M$ transforms the input space. This is especially the case if the matrix transformations $A, B, C, ...$ are simpler to understand. We can simply _compose_ multiple simple transformations to get a complicated transformation.

In other words, for a given matrix $M$ we want to find matrices $A, B, C, ...$ such that $M = ABC...$. Let's look at some decompositions of the matrix

$$M = \begin{bmatrix} -1 & 0 \\ 1 & 2 \end{bmatrix}$$

This is the same matrix as $BA$ from the previous section, but let's call it $M$ for the sake of simplicity.

### 6.5.1 Different decompositions of M

Note that

$$
\begin{aligned}
M &= \begin{bmatrix} -1 & 0 \\ 1 & 2 \end{bmatrix} \\
  &= \begin{bmatrix} 1 & 0 \\ -1 & 1 \end{bmatrix} \begin{bmatrix} -1 & 0 \\ 0 & 2 \end{bmatrix}
\end{aligned}
$$

Let $P = \begin{bmatrix} 1 & 0 \\ -1 & 1 \end{bmatrix}$ and $Q = \begin{bmatrix} -1 & 0 \\ 0 & 2 \end{bmatrix}$. In other words, $M = PQ$.

Also note that $Q$ itself can be factorized:

$$
\begin{aligned}
Q &= \begin{bmatrix} -1 & 0 \\ 0 & 2 \end{bmatrix} \\
  &= \begin{bmatrix} -1 & 0 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} 1 & 0 \\ 0 & 2 \end{bmatrix}
\end{aligned}
$$

Let $Q_1 = \begin{bmatrix} -1 & 0 \\ 0 & 1 \end{bmatrix}$ and $Q_2 = \begin{bmatrix} 1 & 0 \\ 0 & 2 \end{bmatrix}$. In other words, $Q = Q_1 Q_2$.

Each of these factors is a very simple transformation: $Q_2$ stretches the plane vertically by `2`, $Q_1$ flips it horizontally, and $P$ is a vertical _shear_ (it slides each point vertically in proportion to its x-coordinate). Let's compose them on the canvas and watch the complicated transformation $M$ emerge from simple steps:

```python-editor collapsed
import numpy as np

pie.clear()
BLUE, PINK, GRID = '#1d4ed8', '#be185d', '#a1a1aa'

I = np.array([[1, 0], [0, 1]])
P = np.array([[1, 0], [-1, 1]])
Q1 = np.array([[-1, 0], [0, 1]])
Q2 = np.array([[1, 0], [0, 2]])
Q = Q1 @ Q2
M = P @ Q
PRODUCTS = np.array([I, Q2, Q, M])

# One weight per product. The chosen one's is 1, so the current matrix moves between products.
choice = pie.scalar([1, 0, 0, 0], out='choice')

def blend(weights):
    return np.tensordot(weights, PRODUCTS, axes=1)

current = pie.lift(blend, pie.Array[pie.Scalar])(choice, out='current')
pie.la_grid_transform(current, out='grid', stroke=GRID)
pie.la_vec2d(current[0, 0], current[1, 0], out='v1', stroke=BLUE)
pie.la_vec2d(current[0, 1], current[1, 1], out='v2', stroke=PINK)
pie.la_array_to_texts(current, -5, -4, 1, 1, 16, out='curviz')

def tex(m):
    return r'\begin{bmatrix} %d & %d \\ %d & %d \end{bmatrix}' % tuple(m.ravel())

def product_tex(m):  # columns colored like the arrows
    return r'\begin{bmatrix} \textcolor{#1d4ed8}{%d} & \textcolor{#be185d}{%d} \\ \textcolor{#1d4ed8}{%d} & \textcolor{#be185d}{%d} \end{bmatrix}' % tuple(m.ravel())

LATEX = [
    'I = ' + product_tex(I),
    'Q_2 = ' + product_tex(Q2),
    'Q = Q_1 Q_2 = ' + tex(Q1) + tex(Q2) + ' = ' + product_tex(Q),
    'M = PQ = P Q_1 Q_2 = ' + tex(P) + tex(Q1) + tex(Q2) + ' = ' + product_tex(M),
]

pie.ui.animated_radio(choice, options=['I', 'Q₂', 'Q₁Q₂ = Q', 'PQ₁Q₂ = PQ = M'], label='Product:')
pie.ui.latex(pie.lift(lambda weights: LATEX[int(np.argmax(weights))], pie.Text)(choice))
```

Pick $I$, then $Q$, then $M$ to apply $M = PQ$ in two steps. Pick $I$, then $Q_2$, then $Q$, then $M$ to apply $M = P Q_1 Q_2$ in three steps.

A key takeaway from this section is that decomposition of a matrix into other matrices is a useful tool. We will explore this tool in greater detail later when we cover a particular decomposition: `Singular Value Decomposition`.

### 6.5.2 Another simple decomposition
$AA^{-1} = A^{-1}A$ is equal to a square matrix whose diagonal elements are `1` and non-diagonal elements are `0`. This is also called the `Identity Matrix`. If $A$ is a `2-by-2` matrix then

$$
\begin{aligned}
AA^{-1} &= \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} \\
A^{-1}A &= \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}
\end{aligned}
$$

This can be understood by noticing that $A^{-1}$ just does the opposite of $A$. So if $A$ maps a vector `a` to `b`, $A^{-1}$ will map `b` to `a`. Thus the net effect of $A^{-1}A$ is that the output vector is the same as the input vector. The same logic can be applied to $AA^{-1}$.

---

## 6.6 Algebraic equations involving matrices
If two matrices $X$ and $C$ are equal, we can multiply both sides by another matrix:

$$X = C \Rightarrow MX = MC \text{ and } XM = CM$$

Now let's say $X = AB$ and $M = A^{-1}$. This gives us:

$$
\begin{aligned}
AB &= C \\
\Rightarrow A^{-1}AB &= A^{-1}C \\
\Rightarrow B &= A^{-1}C
\end{aligned}
$$

Thus, if $AB = C$, we have $B = A^{-1}C$. Using a similar argument, we have $AB = C \Rightarrow A = CB^{-1}$.

We will use these equations later on.

In the next chapter, we will take a closer look at what makes a transformation _linear_.

---

[← 5. Barycentric coordinates](/la/5_barycentric_coordinates)  ·  [7. Linear transformations →](/la/7_linear_transformations)
