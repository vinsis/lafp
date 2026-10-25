---
title: Transforming normal vectors with a matrix
description: Why a normal vector stops being perpendicular when you transform it with the same matrix, and which matrix keeps it perpendicular.
canvas: left
---

# 13. Normal vectors

<details>
<summary>Review</summary>

A rotation matrix $R$ satisfies $R^T R = R R^T = I$, so its transpose is its inverse. That equality came straight from the dot products of its columns. In this chapter we lean on the same $(AB)^T = B^T A^T$ machinery to answer a very concrete question about perpendicular vectors.

</details>

Suppose you have drawn a vector $q$ perpendicular to another vector $p$, and now you transform $p$ by a matrix $\textcolor{#1d4ed8}{M}$ into $\textcolor{#1d4ed8}{M}p$. You would like the perpendicular vector to follow along and stay perpendicular. The catch is that $\textcolor{#1d4ed8}{M}q$ is usually **not** perpendicular to $\textcolor{#1d4ed8}{M}p$. So the question is: by what matrix $\textcolor{#be185d}{N}$ should we transform $q$ so that $\textcolor{#be185d}{N}q$ stays perpendicular to $\textcolor{#1d4ed8}{M}p$?

---

## 13.1 The problem

```python-editor collapsed
import numpy as np

pie.clear()
pie.scalar(110, out='unit')
GRAY = '#71717a'
PAIR_COLORS = ['#dc2626', '#d97706', '#16a34a', '#2563eb']
p0 = pie.point(0, 0, out='p0', hidden=True)
pie.circle(p0, 1, out='circ', stroke=GRAY)
# Four points p on the unit circle, and a normal q = p turned by 90° at the tip of each
angles = np.radians([0, 90, 180, 270])
px, py = np.cos(angles), np.sin(angles)
pvecs = pie.la_vec2d(px.tolist(), py.tolist(), out='pvecs')
pie.set_stroke(pvecs, PAIR_COLORS)
qvecs = pie.la_vec2d((-py).tolist(), px.tolist(), px.tolist(), py.tolist(), out='qvecs')
pie.set_stroke(qvecs, PAIR_COLORS)
lab_p = pie.text('p', 1.25, 0, 15, out='labP', stroke=PAIR_COLORS[0])
lab_q = pie.text('q', 1.25, 1.25, 15, out='labQ', stroke=PAIR_COLORS[0])
```

Take several points $p$ evenly spaced on a circle and attach to each a **normal vector** $q$, meaning a vector perpendicular to $p$. If we transform the points by a matrix

$$\textcolor{#1d4ed8}{M} = \begin{bmatrix} 1.5 & -1 \\ 0 & -1 \end{bmatrix}$$

```python-editor collapsed
for node in [pvecs, qvecs, lab_p, lab_q]:
    pie.hide(node)
# M starts as the identity, row-major
M = [pie.scalar(v, out=f'm{k}') for k, v in enumerate([1, 0, 0, 1])]
# Row `row` of a 2×2 matrix times the vectors (xs[i], ys[i])
def apply_row(m11, m12, m21, m22, xs, ys, row):
    xs, ys = np.array(xs), np.array(ys)
    return m11 * xs + m12 * ys if row == 0 else m21 * xs + m22 * ys

apply = pie.lift(apply_row, pie.Array[pie.Scalar])
mpx, mpy = apply(*M, px.tolist(), py.tolist(), 0), apply(*M, px.tolist(), py.tolist(), 1)
mqx, mqy = apply(*M, (-py).tolist(), px.tolist(), 0), apply(*M, (-py).tolist(), px.tolist(), 1)
mpvecs = pie.la_vec2d(mpx, mpy, out='mpvecs')
pie.set_stroke(mpvecs, PAIR_COLORS)
mqvecs = pie.la_vec2d(mqx, mqy, mpx, mpy, out='mqvecs')
pie.set_stroke(mqvecs, PAIR_COLORS)
pie.la_mat_to_ellipse([[M[0], M[1]], [M[2], M[3]]], p0, out='ellipse', stroke=GRAY)

# Labels and the angle mark for the first pair
scaled = pie.lift(lambda k, *vs: k * sum(vs), pie.Scalar)
pie.text('Mp', scaled(1.25, mpx[0]), scaled(1.25, mpy[0]), 15, out='labMP', stroke=PAIR_COLORS[0])
pie.text('Mq', scaled(1.25, mpx[0], mqx[0]), scaled(1.25, mpy[0], mqy[0]), 15, out='labMQ', stroke=PAIR_COLORS[0])
mp_tip = pie.point(mpx[0], mpy[0], out='mptipA', hidden=True)
ext_p = pie.point(scaled(2, mpx[0]), scaled(2, mpy[0]), out='extPA', hidden=True)
mq_tip = pie.point(scaled(1, mpx[0], mqx[0]), scaled(1, mpy[0], mqy[0]), out='mqtipA', hidden=True)
line_mp = pie.line(mp_tip, ext_p, out='lineMpA', hidden=True)
line_mq = pie.line(mp_tip, mq_tip, out='lineMqA', hidden=True)
pie.annotate_angle_mark(line_mp, line_mq, out='angleA')
pie.text('Transforming p and its normal q by the same M breaks the right angle: Mq no longer meets Mp at 90 degrees.', -0.5, -2.5, 14, 3.5, -0.5, out='sumBoxA', stroke=GRAY)
```

and transform their normals the same way, the transformed pairs are no longer at right angles.

```python-editor collapsed
pie.translate_scalar_to(M, [1.5, -1, 0, -1], animate=True)
```

---

## 13.2 Working out the solution
We know $\langle p, q \rangle = 0$ and we want $\langle \textcolor{#1d4ed8}{M}p, \textcolor{#be185d}{N}q \rangle = 0$, where $\textcolor{#be185d}{N}$ is the unknown matrix to apply to the normal. Writing the dot product as a matrix product $\langle x, y \rangle = x^T y$ and using $(\textcolor{#1d4ed8}{M}x)^T = x^T \textcolor{#1d4ed8}{M}^T$:

$$\begin{aligned}
\langle \textcolor{#1d4ed8}{M}p, \textcolor{#be185d}{N}q \rangle &= (\textcolor{#1d4ed8}{M}p)^T (\textcolor{#be185d}{N}q) \\
&= p^T \textcolor{#1d4ed8}{M}^T \textcolor{#be185d}{N} q \\
&= p^T \underbrace{(\textcolor{#1d4ed8}{M}^T \textcolor{#be185d}{N})}_{\text{want this to vanish}} q
\end{aligned}$$

Compare this last line with the fact we started from, $\langle p, q \rangle = p^T q = 0$. If we could make the middle factor $\textcolor{#1d4ed8}{M}^T \textcolor{#be185d}{N}$ disappear, the two expressions would match and $\langle \textcolor{#1d4ed8}{M}p, \textcolor{#be185d}{N}q \rangle$ would be forced to zero exactly when $\langle p, q \rangle$ is. That happens precisely when

$$\begin{aligned} \textcolor{#1d4ed8}{M}^T \textcolor{#be185d}{N} &= I \\ \textcolor{#be185d}{N} &= (\textcolor{#1d4ed8}{M}^T)^{-1} \end{aligned}$$

So $\textcolor{#be185d}{N}$ is the **inverse of the transpose** of $\textcolor{#1d4ed8}{M}$. This matrix is important enough that it has a name: it is called the _inverse-transpose_ (or the _cotangent_ / _normal_ matrix in graphics, where it is exactly how surface normals are transformed).

---

## 13.3 The solution
For our matrix

$$\textcolor{#1d4ed8}{M} = \begin{bmatrix} 1.5 & -1 \\ 0 & -1 \end{bmatrix}$$

transposing gives

$$\textcolor{#1d4ed8}{M}^T = \begin{bmatrix} 1.5 & 0 \\ -1 & -1 \end{bmatrix}$$

and inverting that gives

$$\textcolor{#be185d}{N} = (\textcolor{#1d4ed8}{M}^T)^{-1} = \begin{bmatrix} \tfrac{2}{3} & 0 \\ -\tfrac{2}{3} & -1 \end{bmatrix}$$

```python-editor collapsed
import numpy as np

pie.clear()
pie.scalar(110, out='unit')
GRAY = '#71717a'
PAIR_COLORS = ['#dc2626', '#d97706', '#16a34a', '#2563eb']
p0 = pie.point(0, 0, out='p0', hidden=True)
pie.circle(p0, 1, out='circ', stroke=GRAY)
angles = np.radians([0, 90, 180, 270])
px, py = np.cos(angles), np.sin(angles)
# M and N start as the identity, row-major
M = [pie.scalar(v, out=f'm{k}') for k, v in enumerate([1, 0, 0, 1])]
N = [pie.scalar(v, out=f'n{k}') for k, v in enumerate([1, 0, 0, 1])]
# Row `row` of a 2×2 matrix times the vectors (xs[i], ys[i])
def apply_row(m11, m12, m21, m22, xs, ys, row):
    xs, ys = np.array(xs), np.array(ys)
    return m11 * xs + m12 * ys if row == 0 else m21 * xs + m22 * ys

apply = pie.lift(apply_row, pie.Array[pie.Scalar])
mpx, mpy = apply(*M, px.tolist(), py.tolist(), 0), apply(*M, px.tolist(), py.tolist(), 1)
pie.la_mat_to_ellipse([[M[0], M[1]], [M[2], M[3]]], p0, out='ellipse', stroke=GRAY)
mpvecs = pie.la_vec2d(mpx, mpy, out='mpvecs')
pie.set_stroke(mpvecs, PAIR_COLORS)
scaled = pie.lift(lambda k, *vs: k * sum(vs), pie.Scalar)
pie.text('Mp', scaled(1.25, mpx[0]), scaled(1.25, mpy[0]), 15, out='labMP', stroke=PAIR_COLORS[0])
```

Let's redo the experiment on the same four pairs, but this time transform each $p$ by $M$

```python-editor collapsed
pie.translate_scalar_to(M, [1.5, -1, 0, -1], animate=True)
```

and its normal $q$ by $N$ instead of $M$.

```python-editor collapsed
nqx, nqy = apply(*N, (-py).tolist(), px.tolist(), 0), apply(*N, (-py).tolist(), px.tolist(), 1)
nqvecs = pie.la_vec2d(nqx, nqy, mpx, mpy, out='nqvecs')
pie.set_stroke(nqvecs, PAIR_COLORS)
pie.text('Nq', scaled(1.25, mpx[0], nqx[0]), scaled(1.25, mpy[0], nqy[0]), 15, out='labNQ', stroke=PAIR_COLORS[0])
mp_tip = pie.point(mpx[0], mpy[0], out='mptipB', hidden=True)
ext_p = pie.point(scaled(2, mpx[0]), scaled(2, mpy[0]), out='extPB', hidden=True)
nq_tip = pie.point(scaled(1, mpx[0], nqx[0]), scaled(1, mpy[0], nqy[0]), out='nqtipB', hidden=True)
line_mp = pie.line(mp_tip, ext_p, out='lineMpB', hidden=True)
line_nq = pie.line(mp_tip, nq_tip, out='lineNqB', hidden=True)
pie.annotate_angle_mark(line_mp, line_nq, out='angleB')
pie.text('Transforming the normal by N restores every right angle: Nq meets Mp at 90 degrees again.', -0.5, -2.5, 14, 3.5, -0.5, out='sumBoxB', stroke=GRAY)
pie.translate_scalar_to(N, [0.6667, 0, -0.6667, -1], animate=True)
```

Now every normal meets its $Mp$ at a right angle again, all the way around the circle.

This is the whole point of the inverse-transpose. Whenever you transform geometry by a matrix $\textcolor{#1d4ed8}{M}$, its normals must be transformed by $(\textcolor{#1d4ed8}{M}^T)^{-1}$ to keep pointing perpendicular to the surface.

#### Why not just reuse $M$?
It is tempting to think a normal is "just another vector" and transform it by the same $\textcolor{#1d4ed8}{M}$. Section 13.1 shows why that fails: $\textcolor{#1d4ed8}{M}$ stretches and shears the space, and a direction that was perpendicular before the shear is tilted afterwards. Only the inverse-transpose undoes exactly the part of $\textcolor{#1d4ed8}{M}$ that would have spoiled the right angle.

In the next chapter we turn to **eigenvectors and eigenvalues**, the special directions a matrix leaves unrotated, scaling them by just a number.

---

[← 12. Rotations](/la/12_rotations)  ·  [14. Eigenvectors and eigenvalues →](/la/14_eigenvectors_eigenvalues)
