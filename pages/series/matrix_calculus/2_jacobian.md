---
title: Jacobian of a function
canvas: left
---

# Jacobian of a function

Gradient of a function is defined only for scalar-valued functions. What if the output is also vector-valued? The idea is to view a $n\text{ dimensional}$ output as $n$ number of $1\text{ dimensional}$ outputs.

---

## 0. Key idea

Let $f: R^n \rightarrow R^2$ be a vector-valued function. One can actually think of it as two scalar-valued functions $f_1, f_2: R^n \rightarrow R$. Gradient is defined for the functions $f_1, f_2$ since they are scalar-valued.

```python-editor collapsed
pie.clear()
pie.scalar(50, out='unit')
GRAY, GOLD = '#71717a', '#ca8a04'
pie.circle(pie.point(-5, 3.3, out='c_in_c', hidden=True), 1.3, out='c_in')
pie.circle(pie.point(-0.5, 3.3, out='c_out_c', hidden=True), 1.3, out='c_out')
pie.annotate_arrow(pie.point(-3.5, 3.3, out='fa', hidden=True), pie.point(-1.8, 3.3, out='fb', hidden=True), 0, out='arrow_f')
pie.text('Rⁿ', -5.4, 3.0, 20, out='lab_rn', stroke=GOLD)
pie.text('R²', -0.9, 3.0, 20, out='lab_r2', stroke=GOLD)
pie.text('f', -2.75, 4.1, 20, out='lab_f', stroke=GOLD)
```

A vector-valued function $f: R^n \rightarrow R^2$ maps a point in $R^n$ to a point in $R^2$.

The same map is equally two scalar-valued functions $f_1, f_2: R^n \rightarrow R$, one per output coordinate.

```python-editor collapsed
pie.annotate_arrow(pie.point(-2.75, 1.8, out='da', hidden=True), pie.point(-2.75, 0.3, out='db', hidden=True), 0, out='arrow_d', stroke=GRAY)
pie.circle(pie.point(-5, -2.3, out='c_in2_c', hidden=True), 1.3, out='c_in2')
pie.circle(pie.point(-0.5, -1.2, out='c_r1_c', hidden=True), 0.75, out='c_r1')
pie.circle(pie.point(-0.5, -3.4, out='c_r2_c', hidden=True), 0.75, out='c_r2')
pie.annotate_arrow(pie.point(-3.6, -1.9, out='f1a', hidden=True), pie.point(-1.4, -1.35, out='f1b', hidden=True), 0, out='arrow_f1')
pie.annotate_arrow(pie.point(-3.6, -2.7, out='f2a', hidden=True), pie.point(-1.4, -3.25, out='f2b', hidden=True), 0, out='arrow_f2')
pie.text('Rⁿ', -5.4, -2.6, 20, out='lab_rn2', stroke=GOLD)
pie.text('R', -0.65, -1.45, 18, out='lab_ra', stroke=GOLD)
pie.text('R', -0.65, -3.65, 18, out='lab_rb', stroke=GOLD)
pie.text('f₁', -2.6, -1.0, 18, out='lab_f1', stroke=GOLD)
pie.text('f₂', -2.6, -3.55, 18, out='lab_f2', stroke=GOLD)
```

Thus a small change in the output of $f$ can be shown as a small change in the output of $f_1, f_2$ for a small change in input $dx$.

$$\begin{aligned} df &= \begin{bmatrix} df_1 \\ df_2 \end{bmatrix} \\ &= \begin{bmatrix} \langle \nabla f_1, dx \rangle \\ \langle \nabla f_2, dx \rangle \end{bmatrix} \\ &= \underbrace{\textcolor{#b45309}{\begin{bmatrix} \text{---} & \nabla f_1^T & \text{---} \\ \text{---} & \nabla f_2^T & \text{---} \end{bmatrix}}}_{\textcolor{#b45309}{\text{Jacobian of } f}} \begin{bmatrix} \vert \\ dx \\ \vert \end{bmatrix} \end{aligned}$$

Thus, the Jacobian matrix can be viewed as a matrix of gradients of scalar-valued functions. However a more abstract view of Jacobian is to look at it in the following way:

$$\underbrace{\text{change in output}}_{\textcolor{#e11d48}{R^{\text{out}}}} = \underbrace{\text{Jacobian}}_{\textcolor{#b45309}{R^{\text{out}}, R^{\text{in}}}} \times \underbrace{\text{change in input}}_{\textcolor{#e11d48}{R^{\text{in}}}}$$

It is applicable for small changes in input and output. Thus the shape of the Jacobian matrix is $\textcolor{#b45309}{(\text{output dim}, \text{input dim})}$.

---

## 1. Properties of Jacobian

### 1.1 Jacobian of a composition of functions

Given two functions $f: R^a \rightarrow R^b, g: R^b \rightarrow R^c$, the Jacobian of $g \circ f$ is given by:

$$\underbrace{\underbrace{\text{Jacobian of } g}_{\textcolor{#e11d48}{R^c, R^b}} \times \underbrace{\text{Jacobian of } f}_{\textcolor{#e11d48}{R^b, R^a}}}_{\textcolor{#b45309}{R^c, R^a}}$$

Some interesting properties of Jacobian of a function $f: R^n \rightarrow R^n$ (input and output dims are the same) are mentioned below.

---

### 1.2 Jacobian determinant

The determinant of a Jacobian matrix provides an idea of how the space around a point is stretched or compressed. If the determinant is non-zero, it means the function is invertible at that point. If it is positive, the orientation of the space is preserved. The absolute value of the determinant is also used extensively in normalizing flows.

---

### 1.3 Jacobian inverse

If a function $f: R^n \rightarrow R^n$ is invertible at a point $x \in R^n$, then the Jacobian of its inverse $f^{-1}$ is the inverse of the Jacobian of $f$ at $x$. It also implies that the determinant of the Jacobian of $f^{-1}$ is the inverse of the determinant of the Jacobian of $f$.

---

[← Gradient of a function](/series/matrix_calculus/1_gradient)  ·  [Key matrix derivatives →](/series/matrix_calculus/3_key_derivatives)
