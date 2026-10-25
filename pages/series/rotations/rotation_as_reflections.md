---
title: 4. Thinking of rotations in terms of reflections
canvas: left
---

# 4. Thinking of rotations in terms of reflections

The relationship between rotation and reflections is not immediately obvious, but easy to understand and extremely useful. We will explore this relationship algebraically first and then geometrically.

First we need to understand the concept of a reflection matrix. 

#### Reflection is also linear
It can be shown that reflection of sum of two vectors is the sum of reflections of those vectors. The scaling argument also holds. 


---

## 4.1 Reflection matrices
One can think of reflection around a point, a line or a hyperplane. We start with reflection around a line and then derive some properties for reflection around a hyperplane.

### 4.1.1 Reflection around a line

```python-editor collapsed
import math

pie.clear()
pie.scalar(70, out='unit')
GRAY, BLUE, PINK, GREEN, GOLD = '#71717a', '#1d4ed8', '#be185d', '#047857', '#ca8a04'
phi = pie.scalar(0.7, out='phi')
VX, VY, LLEN = 2, 0.7, 2.6

# One part of reflecting v = (VX, VY) around the line along u = (cos φ, sin φ), as (x, y)
def reflect_line_point(phi, part):
    ux, uy = math.cos(phi), math.sin(phi)
    dot = ux * VX + uy * VY
    par = (dot * ux, dot * uy)
    parts = {
        'par': par,
        'perp': (VX - par[0], VY - par[1]),
        'neg_perp': (par[0] - VX, par[1] - VY),
        'out': (2 * par[0] - VX, 2 * par[1] - VY),
        'end': (LLEN * ux, LLEN * uy),
        'neg_end': (-LLEN * ux, -LLEN * uy),
        'hyp_end': (-LLEN * uy, LLEN * ux),
        'hyp_neg_end': (LLEN * uy, -LLEN * ux),
    }
    return parts[part]

line_pt = pie.lift(reflect_line_point, pie.Point)
part_x = pie.lift(lambda phi, part: reflect_line_point(phi, part)[0], pie.Scalar)
part_y = pie.lift(lambda phi, part: reflect_line_point(phi, part)[1], pie.Scalar)
mirror = pie.line(line_pt(phi, 'neg_end', out='nep', hidden=True), line_pt(phi, 'end', out='ep', hidden=True), out='mirror', stroke=GRAY, hidden=True)
pie.la_vec2d(VX, VY, out='vV', stroke=BLUE)
```

- This vector $\textcolor{#1d4ed8}{v}$ denotes the point we want to reflect.

- This is the line of reflection. It is represented by a unit vector $u$. 

```python-editor collapsed
pie.show(mirror)
```

- It keeps the component of $\textcolor{#1d4ed8}{v}$ along $u$ the same.
  - The component parallel to $u$: $\textcolor{#047857}{v_{\parallel}} = (uu^T)\textcolor{#1d4ed8}{v}$

```python-editor collapsed
par_x, par_y = part_x(phi, 'par'), part_y(phi, 'par')
pie.la_vec2d(par_x, par_y, out='vPar', stroke=GREEN)
```

- The component of $\textcolor{#1d4ed8}{v}$ perpendicular to $u$ is negated.
  - The component perpendicular to $u$: $\textcolor{#be185d}{v_\perp} = (I - uu^T)\textcolor{#1d4ed8}{v}$

```python-editor collapsed
par_x, par_y = part_x(phi, 'par'), part_y(phi, 'par')
pie.la_vec2d(part_x(phi, 'perp'), part_y(phi, 'perp'), par_x, par_y, out='vPerp', stroke=PINK)
pie.la_vec2d(part_x(phi, 'neg_perp'), part_y(phi, 'neg_perp'), par_x, par_y, out='neg_vPerp', stroke=PINK)
pie.la_vec2d(part_x(phi, 'out'), part_y(phi, 'out'), out='vOut', stroke=GOLD)
```

- The sum of these two components - the parallel and the negative of perpendicular - gives the reflected vector.
  - The original vector: $\textcolor{#1d4ed8}{v} = \textcolor{#047857}{v_{\parallel}} + \textcolor{#be185d}{v_\perp}$
  - The reflected vector: $\textcolor{#b45309}{v_{out}} = \textcolor{#047857}{v_{\parallel}} - \textcolor{#be185d}{v_\perp} = (2uu^T - I)\textcolor{#1d4ed8}{v}$

- Animate the line of reflection

```python-editor collapsed
pie.translate_scalar_to(phi, 3.1415, animate=True)
```


The matrix $$M = 2uu^T - I$$ reflects any vector around the line given by a unit vector $u$.

This equation, and the entire line of reasoning, holds for any higher dimensional space as well. 

---

### 4.1.2 Reflection around a hyperplane

Now we define reflection around a hyperplane. 

#### What is a hyperplane?
It means a line in 2D, a plane in 3D and a $n-1$ dimensional space in a $n$-dimensional space. 

We represent this hyperplane using a unit vector $u$ that is orthogonal to this space. This reflection flips the component of the vector _parallel_ to the vector $u$ while keeping the rest of the components the same. 

```python-editor collapsed
pie.line(line_pt(phi, 'hyp_end', out='eep', hidden=True), line_pt(phi, 'hyp_neg_end', out='neep', hidden=True), out='hyperplane', stroke=GRAY)
```

The reflection we just saw can be seen as a reflection around this hyperplane


Using the same logic as above, we have:

- The reflected vector: $\textcolor{#b45309}{v_{out}} = \textcolor{#be185d}{v_\perp} - \textcolor{#047857}{v_{\parallel}} = (I - 2uu^T)\textcolor{#1d4ed8}{v}$

Thus, the reflection matrix is:

$$M = I - 2uu^T$$

---

## 4.2 Algebraic approach

Given a unit vector $u$ and the corresponding (hyperplane) reflection matrix $M = I - 2uu^T$, it is easy to see that

- $M = M^T$: it is symmetric.
- $MM^T = I$: its transpose is its inverse.

#### Proof
$$\begin{aligned}
MM^T &= (I - 2uu^T)(I - 2uu^T)^T \\
&= (\textcolor{#0d9488}{I} - \textcolor{#0d9488}{2uu^T})(\textcolor{#b45309}{I} - \textcolor{#b45309}{2uu^T}) \\
&= \textcolor{#0d9488}{I}\textcolor{#b45309}{I} - \textcolor{#0d9488}{I}\textcolor{#b45309}{2uu^T} - \textcolor{#0d9488}{2uu^T}\textcolor{#b45309}{I} + \underbrace{\textcolor{#0d9488}{2uu^T}\,\textcolor{#b45309}{2uu^T}}_{4u(u^Tu)u^T} \\
&= I - 2uu^T - 2uu^T + 4u(u^Tu)u^T \\
&= I - 4uu^T + 4u(u^Tu)u^T \\
&= I
\end{aligned}$$

since $u^Tu = 1$ for a unit vector $u$. 

- A $n \times n$ reflection matrix $M$ has $n-1$ eigenvalues equal to $1$ and one eigenvalue equal to $-1$.

#### Outline of proof
This matrix maps $u$ to $-u$ and keeps the rest of the orthogonal vectors the same. Both $u$ and $-u$ have the same length. 

To summarize:

| | Reflection matrix $M$ | Rotation matrix $R$ |
|---|---|---|
| Orthogonality | $MM^T = I$ | $RR^T = I$ |
| Determinant | $\det(M) = -1$ | $\det(R) = 1$ |

---

Now it is easy to see that if $M_1, M_2$ are two reflection matrices,

- $(M_1M_2)(M_1M_2)^T = I$
- $\det(M_1M_2) = (-1)^2 = 1$

Thus $M_1M_2$ is a rotation matrix. In other words:

> A composition of two reflections is a rotation.

---

## 4.3 Geometric approach

We visualize a rotation as a composition of two reflections around two axes, working entirely in the 2D plane first where each axis is a line through the origin. 

### 4.3.1 Visualizing in 2D

```python-editor collapsed
import math

pie.clear()
pie.scalar(70, out='unit')
GRAY, BLUE, PINK, GOLD, GREEN = '#71717a', '#1d4ed8', '#be185d', '#ca8a04', '#047857'
origin = pie.point(0, 0, out='origin', hidden=True)
circ = pie.circle(origin, 2, out='circ', stroke=GRAY, hidden=True)
theta = pie.scalar(0.6, out='theta')
BETA, RR, MLEN = 0.35, 2, 2.6
V0 = (RR * math.cos(BETA), RR * math.sin(BETA))

# A point of the figure, as (x, y), for the angle θ between the mirrors L1 (fixed, horizontal) and L2
def two_mirrors_point(theta, key):
    u2 = (math.cos(theta), math.sin(theta))
    def reflect(u, v):
        dot = u[0] * v[0] + u[1] * v[1]
        return (2 * dot * u[0] - v[0], 2 * dot * u[1] - v[1])
    v1 = reflect((1, 0), V0)
    v2 = reflect(u2, v1)
    c2, s2 = math.cos(2 * theta), math.sin(2 * theta)
    points = {
        'v1': v1,
        'v2': v2,
        'vr': (c2 * V0[0] - s2 * V0[1], s2 * V0[0] + c2 * V0[1]),
        'lv1': (1.18 * v1[0], 1.18 * v1[1]),
        'lv2': (1.28 * v2[0], 1.28 * v2[1]),
        'e2': (MLEN * u2[0], MLEN * u2[1]),
        'ne2': (-MLEN * u2[0], -MLEN * u2[1]),
        'l2': (1.08 * MLEN * u2[0], 1.08 * MLEN * u2[1]),
        'thl': (0.95 * math.cos(theta / 2), 0.95 * math.sin(theta / 2)),
        't2l': (1.7 * math.cos(BETA + theta), 1.7 * math.sin(BETA + theta)),
    }
    return points[key]

fig_pt = pie.lift(two_mirrors_point, pie.Point)
fig_x = pie.lift(lambda theta, key: two_mirrors_point(theta, key)[0], pie.Scalar)
fig_y = pie.lift(lambda theta, key: two_mirrors_point(theta, key)[1], pie.Scalar)
mirror1 = pie.line(pie.point(-MLEN, 0, out='ne1p', hidden=True), pie.point(MLEN, 0, out='e1p', hidden=True), out='mirror1', stroke=GRAY, hidden=True)
mirror2 = pie.line(fig_pt(theta, 'ne2', out='ne2p', hidden=True), fig_pt(theta, 'e2', out='e2p', hidden=True), out='mirror2', stroke=GRAY, hidden=True)
```

We start with the vector we want to rotate. Here is the input $\textcolor{#1d4ed8}{v}$.

```python-editor collapsed
pie.la_vec2d(V0[0], V0[1], out='vV', stroke=BLUE)
pie.text('v', 1.18 * V0[0], 1.18 * V0[1], 16, out='vlab', stroke=BLUE)
```

Now place two mirror lines through the origin. The first, axis $L_1$, is fixed along the horizontal.

```python-editor collapsed
pie.text('L1', 1.08 * MLEN, 0, 15, out='l1lab', stroke=GRAY)
pie.show(mirror1)
```

The second, axis $L_2$, is tilted away from it.

```python-editor collapsed
pie.text('L2', fig_x(theta, 'l2'), fig_y(theta, 'l2'), 15, out='l2lab', stroke=GRAY)
pie.show(mirror2)
```

The angle $\theta$ between the two axes is marked by the arc.

```python-editor collapsed
pie.arc(origin, 0.75, 0, pie.lift(math.degrees, pie.Scalar)(theta), out='arc_theta', stroke=GRAY)
pie.text('θ', fig_x(theta, 'thl'), fig_y(theta, 'thl'), 16, out='thlab', stroke=GRAY)
```

- Reflecting $\textcolor{#1d4ed8}{v}$ across $L_1$ gives $\textcolor{#be185d}{v_1}$.

```python-editor collapsed
pie.la_vec2d(fig_x(theta, 'v1'), fig_y(theta, 'v1'), out='vV1', stroke=PINK)
pie.text('v1', fig_x(theta, 'lv1'), fig_y(theta, 'lv1'), 16, out='v1lab', stroke=PINK)
```

- Reflecting $\textcolor{#be185d}{v_1}$ across $L_2$ gives $\textcolor{#b45309}{v_2}$, which lands back on the guide circle of radius $|v|$, since a reflection preserves length.

```python-editor collapsed
pie.la_vec2d(fig_x(theta, 'v2'), fig_y(theta, 'v2'), out='vV2', stroke=GOLD)
pie.text('v2', fig_x(theta, 'lv2'), fig_y(theta, 'lv2'), 16, out='v2lab', stroke=GOLD)
pie.show(circ)
```

Now check the claim. Rotate the original $\textcolor{#1d4ed8}{v}$ directly by $2\theta$: the green vector lands exactly on top of $\textcolor{#b45309}{v_2}$, and its arc is twice the $\theta$ arc between the mirrors.

```python-editor collapsed
pie.la_vec2d(fig_x(theta, 'vr'), fig_y(theta, 'vr'), out='vRot', stroke=GREEN)
end_deg = pie.lift(lambda theta: math.degrees(BETA + 2 * theta), pie.Scalar)
pie.arc(origin, 1.5, math.degrees(BETA), end_deg(theta), out='arc_two', stroke=GREEN)
pie.text('2θ', fig_x(theta, 't2l'), fig_y(theta, 't2l'), 16, out='t2lab', stroke=GREEN)
```

Two reflections equal one rotation by twice the inter-mirror angle.

Widen the angle between the axes and watch $\textcolor{#be185d}{v_1}$, $\textcolor{#b45309}{v_2}$, both arcs and the green comparison vector move together, staying locked to the identity as $\theta$ changes.

```python-editor collapsed
pie.translate_scalar_to(theta, 1, animate=True)
```

We will use this insight - that two reflections compose into a rotation - to describe a rotation using geometric algebra next.

---

### 4.3.2 Visualizing in 3D

In 3D each hyperplane is a plane and this is genuinely hard to picture, so we reduce it to 2D without loss of generality and let the flat picture, where the angles are honest, carry the argument.

#### An observation we use as as trick
Consider a 3D reflection around a hyperplane represented by a unit vector $u$. If $u$ lies in the XY plane, it will only negate the component of an input vector $v$ that lies in this place. It will leave the z-value of $v$ untouched. In other words:
$$\begin{bmatrix} x \\ y \\ \textcolor{#0d9488}{z} \end{bmatrix} \to \begin{bmatrix} x' \\ y' \\ \textcolor{#0d9488}{z} \end{bmatrix}$$

Thus, two or more reflections whose vectors lie in the XY plane when composed will all leave the z-coordinate unchanged:

$$\begin{bmatrix} x \\ y \\ \textcolor{#0d9488}{z} \end{bmatrix} \to \begin{bmatrix} x' \\ y' \\ \textcolor{#0d9488}{z} \end{bmatrix} \to \begin{bmatrix} x'' \\ y'' \\ \textcolor{#0d9488}{z} \end{bmatrix} \to \dots$$


```python-editor collapsed
pie.clear()
pie.scalar(32, out='unit')
GRAY, GROUND, GROUND_EDGE, DARK = '#71717a', '#d4d4d8', '#a1a1aa', '#27272a'
corners = [
    pie.point(0, 3, out='gnd_a', hidden=True),
    pie.point(5.1961524, 0, out='gnd_b', hidden=True),
    pie.point(0, -3, out='gnd_c', hidden=True),
    pie.point(-5.1961524, 0, out='gnd_d', hidden=True),
]
pie.polygon(corners, out='ground', fill=GROUND, stroke=GROUND_EDGE)
pie.line(pie.point(0, -3, out='z_bot', hidden=True), pie.point(0, 3.4, out='z_top', hidden=True), out='z_axis', stroke=DARK)
pie.la_vec2d(2.5980762, -1.5, out='scaffold_x', stroke=GRAY)
pie.la_vec2d(-2.5980762, -1.5, out='scaffold_y', stroke=GRAY)
```

Choose coordinates and look at the xy-plane as a faint ground. Perpendicular to it stands the z-axis, which we take as the fixed rotation axis. The in-plane x and y directions span that ground.

Labelling the axis, the triad and the plane fixes the frame.

```python-editor collapsed
pie.text('z : rotation axis (fixed line)', 0.3, 3.3, 13, out='tbox_0')
pie.text('x', 2.7980762, -1.8, 13, out='tbox_1')
pie.text('y', -3.0980762, -1.8, 13, out='tbox_2')
pie.text('xy-plane : every reflection stays inside here', -2, -3.6, 13, out='tbox_3')
pie.text("The two mirror normals span a plane; take it as the xy-plane, so z is the shared rotation axis. Any vector's z-component is left untouched by both reflections, so only its in-plane part moves. Tracking that part in this flat plane loses nothing.", 0, -7, 12, 9.2, -1, out='tbox_4')
```

Here is the argument without loss of generality: the two mirror normals span a plane, which we take as the xy-plane, so $z = n_1 \times n_2$ is the fixed rotation axis. 

A general $\textcolor{#047857}{v}$ need not lie in this plane, but each normal has no $z$-component, so both reflections leave $\textcolor{#047857}{v}$'s $z$-component untouched. Only its in-plane part $v_\perp$ ever moves, and it stays in the plane. Tracking $v_\perp$ here loses no generality; the axial part just rides along fixed.

To see this on the scaffold itself, add a vector and its rotated image. Here is a vector $\textcolor{#047857}{v} = (x, y, z)$, lifted off the ground to height $z$.

```python-editor collapsed
GREEN, TEAL, LEVEL = '#047857', '#0d9488', '#a1a1aa'
pie.la_vec2d(1.348063, 0.252281, out='vec_v', stroke=GREEN)
pie.la_vec2d(-1.348063, 0.252281, out='vec_vr', stroke=TEAL)
```

Rotating it about the $z$-axis gives its image $v' = (x', y', z)$: the in-plane part has turned, but the tip does not rise or fall.

The level connector shows both tips sit at one height, so $z$ is unchanged.

```python-editor collapsed
pie.line(pie.point(1.348063, 0.252281, out='vtip', hidden=True), pie.point(-1.348063, 0.252281, out='vrtip', hidden=True), out='level', stroke=LEVEL)
pie.text('same height, so same z', 0, 1, 12, out='tbox_z')
```

Thus we can use the same visualization as for the 2D case to illustrate the connection between rotations and composition of two reflections in the general case. 

---

[← Quaternions](/series/rotations/quaternions)  ·  [Geometric algebra →](/series/rotations/geometric_algebra)
