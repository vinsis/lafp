---
title: 5. Geometric algebra (aka Clifford algebra)
description: The geometric product and bivectors, and how geometric algebra describes reflections and rotations in 2D and 3D, with the Python clifford library.
canvas: left
---

# 5. Geometric algebra (aka Clifford algebra)

Geometric algebra provides a framework which unifies all of the concepts that we have discussed so far. It is a powerful tool which generalizes the ideas of vectors and dot products, and elegantly describes rotations and reflections. 

We describe reflections using geometric algebra, and use their connection with rotation to describe a rotation. We will use the [clifford](https://clifford.readthedocs.io/en/latest/index.html) library to demonstrate these concepts.

---

## 5.1 Some definitions

We define the geometric product of two vectors to be a sum of two components: a commutative product ($a \cdot b = b \cdot a$) and an anti-commutative product ($a \wedge b = -b \wedge a$):

$$\begin{aligned}
ab &= \underbrace{\textcolor{#1d4ed8}{a \cdot b}}_{\text{grade 0 (scalar)}} + \underbrace{\textcolor{#be185d}{a \wedge b}}_{\text{grade 2 (bivector)}} \\
ba &= \textcolor{#1d4ed8}{a \cdot b} - \textcolor{#be185d}{a \wedge b}
\end{aligned}$$

Here $a \wedge b$ is a _bivector_, an element of the plane spanned by $a$ and $b$; we'll see below exactly what its magnitude and orientation mean. The dot product $a \cdot b$ is just the usual dot product of two vectors. With that, we make the following observations:

- For any vector $v$:
$$\begin{aligned}
v \wedge v &= -v \wedge v \\
\Rightarrow v \wedge v &= 0 \\
\Rightarrow vv &= v \cdot v
\end{aligned}$$
  and $u^2 = uu = 1$ for any unit vector $u$.
- For two perpendicular vectors $a,b$, $a \cdot b = 0 \Rightarrow ab = a \wedge b$.

---

### 5.1.1 Visualizing the behavior of a bivector

Let's see these three facts directly, and along the way pin down what a bivector's magnitude and orientation actually are. First, we build $a \wedge b$ as an oriented area:

```python-editor collapsed
import math

pie.clear()
pie.scalar(45, out='unit')
BLUE, PINK, TEAL = '#1d4ed8', '#be185d', '#0d9488'
length = 3
ax, ay = 3, 0
theta = pie.scalar(45, out='theta')
# b has length 3 and sits at angle θ (in degrees)
b_part = pie.lift(lambda t, axis: length * (math.cos(math.radians(t)) if axis == 'x' else math.sin(math.radians(t))), pie.Scalar)
bx = b_part(theta, 'x', out='bx')
by = b_part(theta, 'y', out='by')
plus = pie.lift(lambda u, v: u + v, pie.Scalar)
times = pie.lift(lambda k, v: k * v, pie.Scalar)

p_origin = pie.point(0, 0, out='p_origin', hidden=True)
p_a_tip = pie.point(ax, ay, out='p_a_tip', hidden=True)
p_sum = pie.point(plus(ax, bx), plus(ay, by), out='p_sum', hidden=True)
p_b_tip = pie.point(bx, by, out='p_b_tip', hidden=True)
pie.polygon([p_origin, p_a_tip, p_sum, p_b_tip], out='parallelogram', fill='#0d948833', stroke=TEAL)
pie.la_vec2d(ax, ay, out='a_arrow', stroke=BLUE)
pie.la_vec2d(bx, by, out='b_arrow', stroke=PINK)

klab = 1.2
pie.text('a', klab * ax, klab * ay, 16, out='a_label', stroke=BLUE)
pie.text('b', times(klab, bx), times(klab, by), 16, out='b_label', stroke=PINK)

# a∧b = a1·b2 − a2·b1, rounded to two decimals
def wedge_text(bx, by):
    return f'a∧b = {round(ax * by - ay * bx, 2) + 0.0:.2f}  (signed area)'

pie.text(pie.lift(wedge_text, pie.Text)(bx, by), 0, -4.6, 16, 7, -1, out='wedge_box', stroke=TEAL)
```

- Vectors $\textcolor{#1d4ed8}{a}$ and $\textcolor{#be185d}{b}$ span a parallelogram: this is the plane element that the bivector $a \wedge b$ lives in, and its magnitude is about to show up as that parallelogram's area.
- The signed area itself is printed live: its magnitude is exactly that parallelogram's area, and its sign is the orientation of $a$ relative to $b$, together these are what a bivector's "magnitude and orientation" mean.
  - $a \wedge b = \underbrace{a_1b_2 - a_2b_1}_{\text{signed area}}$, the value that tracks both the size and the orientation of the parallelogram.
- Now sweep $\theta$ through a full turn: as $\textcolor{#be185d}{b}$ rotates onto $\textcolor{#1d4ed8}{a}$ (or onto its opposite direction), the parallelogram flattens into a line and the printed area shrinks to $0$, exactly the $v \wedge v = 0$ case above. 

```python-editor collapsed
pie.translate_scalar_to(theta, 180, animate=True)
```

- As $\textcolor{#be185d}{b}$ crosses over to the other side of $\textcolor{#1d4ed8}{a}$, the sign of $a \wedge b$ flips, which is the geometric picture behind $a \wedge b = -b \wedge a$.

```python-editor collapsed
pie.translate_scalar_to(theta, 315, animate=True)
```

#### Usage in Python
```python
import clifford as cf
layout, blades = cf.Cl(2) # create a 2D clifford algebra

# blades is a dict {'': 1, 'e1': (1^e1), 'e2': (1^e2), 'e12': (1^e12)}
# we can assign the variables e1 = blades['e1'], e2 = blades['e2'] and so on automatically by:
locals().update(blades)
v1 = 3*e1
v2 = e1 + e2
print(v1 ^ v2)

'''
Output
(3^e12)
'''

print(v1^v1)
'''
Output
0
'''
```

---

## 5.2 The key idea behind bivectors (and multivectors)

Given an orthonormal basis $e_1, e_2, ..., e_n$, we can represent any vector $v$ as a linear combination of these basis vectors. We can also represent any bivector $B$ as a linear combination of the basis bivectors $e_i \wedge e_j$. 

For example, consider the parallelogram created by the vectors $\begin{bmatrix} 2 \\ 1 \\ 1 \end{bmatrix}$ and $\begin{bmatrix} 1 \\ 1 \\ 2 \end{bmatrix}$ in a 3D space. 

```python-editor collapsed
pie.clear()
pie.scalar(48, out='unit')
BLUE, PINK, GREEN, AMBER, VIOLET, GRAY = '#1d4ed8', '#be185d', '#047857', '#b45309', '#6d28d9', '#71717a'
PANEL = '#f4f4f5'
pie.text('Extending the idea of components of a vector to components of a plane', 3.9, -2, 15, 4, -1, out='title_box')

# One basis plane, with its origin at (ox, oy): a panel, two axes, the projections a and b of the
# two vectors onto the plane, and the parallelogram they span
def plane_panel(name, ox, oy, color, h_name, v_name, a, b, a_label_at, b_label_at):
    corner = pie.point(ox - 0.7, oy - 0.7, out=f'corner_{name}', hidden=True)
    pie.rectangle(corner, 4.5, 4.5, out=f'bg_{name}', fill=PANEL, stroke='none')
    h1 = pie.point(ox - 0.4, oy, out=f'h1_{name}', hidden=True)
    h2 = pie.point(ox + 3.2, oy, out=f'h2_{name}', hidden=True)
    pie.line(h1, h2, out=f'axis_h_{name}', stroke=color)
    v1 = pie.point(ox, oy - 0.4, out=f'v1_{name}', hidden=True)
    v2 = pie.point(ox, oy + 3.2, out=f'v2_{name}', hidden=True)
    pie.line(v1, v2, out=f'axis_v_{name}', stroke=color)
    origin = pie.point(ox, oy, out=f'origin_{name}', fill=GRAY)
    tip_a = pie.point(ox + a[0], oy + a[1], out=f'tip_a_{name}', hidden=True)
    tip_b = pie.point(ox + b[0], oy + b[1], out=f'tip_b_{name}', hidden=True)
    tip_c = pie.point(ox + a[0] + b[0], oy + a[1] + b[1], out=f'tip_c_{name}', hidden=True)
    pie.annotate_arrow(origin, tip_a, 0.03, out=f'vec_a_{name}', stroke=BLUE)
    pie.annotate_arrow(origin, tip_b, 0.03, out=f'vec_b_{name}', stroke=PINK)
    pie.line(tip_a, tip_c, out=f'side_ac_{name}', stroke=color)
    pie.line(tip_c, tip_b, out=f'side_cb_{name}', stroke=color)
    pie.text(h_name, ox + 3.35, oy - 0.35, 12, out=f'axis_h_label_{name}')
    pie.text(v_name, ox - 0.35, oy + 3.35, 12, out=f'axis_v_label_{name}')
    pie.text(f'({a[0]},{a[1]})', a_label_at[0], a_label_at[1], 11, out=f'coord_a_label_{name}', stroke=BLUE)
    pie.text(f'({b[0]},{b[1]})', b_label_at[0], b_label_at[1], 11, out=f'coord_b_label_{name}', stroke=PINK)

plane_panel('xy', -5.5, 1.5, GREEN, 'e1', 'e2', (2, 1), (1, 1), (-3.26, 2.26), (-4.68, 2.78))
plane_panel('yz', 2.4, 1.5, AMBER, 'e2', 'e3', (1, 1), (1, 2), (3.68, 2.32), (3.16, 3.74))
plane_panel('zx', -5.5, -4.8, VIOLET, 'e1', 'e3', (2, 1), (1, 2), (-3.26, -4.04), (-4.74, -2.56))
```

We can represent it as a combination of the parallelograms created by projections on the basis bivectors

- $\textcolor{#047857}{e_1 \wedge e_2}$
- $\textcolor{#b45309}{e_2 \wedge e_3}$
- $\textcolor{#6d28d9}{e_3 \wedge e_1}$, which represent the $\textcolor{#047857}{xy}$, $\textcolor{#b45309}{yz}$ and $\textcolor{#6d28d9}{zx}$ planes respectively.

---

Some properties of and notations for 3D basis vectors $e_1, e_2, e_3$:

- Since these basis vectors are unit vectors, we have $e_1e_1 = e_2e_2 = e_3e_3 = 1$
- A unit bivector in the $\textcolor{#047857}{xy}$ plane is represented by $\textcolor{#047857}{e_1e_2 = e_{12}}$
- Similarly, a unit bivector in the $\textcolor{#b45309}{yz}$ plane is defined like so: $\textcolor{#b45309}{e_2e_3 = e_{23}}$
- And finally a unit bivector in the $\textcolor{#6d28d9}{xz}$ plane: $\textcolor{#6d28d9}{e_1e_3 = e_{13}}$
- The anti-commutativity of the wedge product gives us: $e_{ij} = -e_{ji}, \ i \ne j$

Thus we have:

$$\begin{aligned}
\textcolor{#1d4ed8}{\begin{bmatrix} 2 \\ 1 \\ 1 \end{bmatrix}}\textcolor{#be185d}{\begin{bmatrix} 1 \\ 1 \\ 2 \end{bmatrix}} &= \textcolor{#1d4ed8}{(2e_1 + e_2 + e_3)}\textcolor{#be185d}{(e_1 + e_2 + 2e_3)} \\
&= \underbrace{2 + 1 + 2}_{\text{grade 0 (scalar)}} + \underbrace{\textcolor{#047857}{e_1e_2} + \textcolor{#b45309}{e_2e_3} - 3\textcolor{#6d28d9}{e_3e_1}}_{\text{grade 2 (bivector)}} \\
&= 5 + \textcolor{#047857}{e_{12}} + \textcolor{#b45309}{e_{23}} - 3\textcolor{#6d28d9}{e_{31}}
\end{aligned}$$

The scalar part $5$ is the dot product $(2e_1+e_2+e_3) \cdot (e_1+e_2+2e_3)$, and the bivector part is a linear combination of the basis bivectors:

$$\textcolor{#047857}{1}\cdot e_{12} + \textcolor{#b45309}{1}\cdot e_{23} + \textcolor{#6d28d9}{(-3)}\cdot e_{31}$$

so the parallelogram spanned by the two original vectors decomposes into a signed area of $\textcolor{#047857}{1}$ on the $\textcolor{#047857}{xy}$ plane, $\textcolor{#b45309}{1}$ on the $\textcolor{#b45309}{yz}$ plane, and $\textcolor{#6d28d9}{-3}$ on the $\textcolor{#6d28d9}{zx}$ plane, exactly the magnitudes we saw projected earlier.

#### Reproducing the same result in Python
```python
layout, blades = cf.Cl(3) # create a 3D clifford algebra
locals().update(blades)
a = 2*e1 + e2 + e3
b = e1 + e2 + 2*e3
print(a * b)    # sum of a scalar and a bivector

'''
Output:
5 + (1^e12) + (3^e13) + (1^e23)
'''

print(a ^ b)    # a bivector expressed as a sum of projections on the basis planes

'''
Output:
(1^e12) + (3^e13) + (1^e23)
'''
```

---

## 5.3 Connection with imaginary number $i$

The square of the bivector $e_1e_2$ is:

$$\begin{aligned}
(e_1e_2)^2 &= (e_1e_2)(e_1e_2) \\
&= e_1e_2(-e_2e_1) \\
&= -e_1(e_2^2)e_1 \\
&= -e_1^2 \\
&= -1
\end{aligned}$$

> The bivector $e_1e_2$ behaves like the imaginary number $i$. 

This is a key insight that connects geometric algebra with complex numbers.

Indeed one can see that:

$$\begin{aligned}
&(\textcolor{#1d4ed8}{xe_1} + \textcolor{#be185d}{ye_2})\overbrace{\textcolor{#0d9488}{(\cos\theta + \sin\theta\,e_{12})}}^{\simeq\ \cos\theta + i\sin\theta} \\
&= \textcolor{#1d4ed8}{(x\cos\theta - y\sin\theta)e_1} + \textcolor{#be185d}{(x\sin\theta + y\cos\theta)e_2}
\end{aligned}$$

But what does it mean to multiply a vector by an element of the form `scalar + bivector`? Note that the bivector $\sin\theta\,e_{12}$ is a bivector in xy plane with magnitude $\sin\theta$ and a positive orientation. Let's understand the tuple of a scalar and a bivector, $\textcolor{#0d9488}{\cos\theta + \sin\theta\,e_{12}}$, further.

---

### 5.3.1 Rotation in 2D

```python-editor collapsed
import math

pie.clear()
pie.scalar(50, out='unit')
BLUE, PINK, TEAL, FAINT = '#1d4ed8', '#be185d', '#0d9488', '#d4d4d8'
r = 3
origin = pie.point(0, 0, out='origin', hidden=True)
a_deg = pie.scalar(40, out='a_deg')
theta_deg = pie.scalar(90, out='theta_deg')
plus = pie.lift(lambda u, v: u + v, pie.Scalar)
# The x or y of the point at `deg` degrees on a circle of radius `radius`
polar = pie.lift(lambda deg, radius, axis: radius * (math.cos(math.radians(deg)) if axis == 'x' else math.sin(math.radians(deg))), pie.Scalar)
q_deg = plus(a_deg, theta_deg, out='q_deg')
p_pt = pie.point(polar(a_deg, r, 'x'), polar(a_deg, r, 'y'), out='p_pt', hidden=True)
q_pt = pie.point(polar(q_deg, r, 'x'), polar(q_deg, r, 'y'), out='q_pt', hidden=True)

pie.circle(origin, r, out='unit_circle', stroke=FAINT)
pie.annotate_arrow(origin, p_pt, 0, out='p_arrow', stroke=BLUE)
pie.annotate_arrow(origin, q_pt, 0, out='q_arrow', stroke=PINK)
line_op = pie.line(origin, p_pt, out='line_op', hidden=True)
line_oq = pie.line(origin, q_pt, out='line_oq', hidden=True)
theta_label = pie.lift(lambda t: f'θ = {round(t)}°', pie.Text)(theta_deg, out='theta_label')
pie.annotate_angle_mark(line_op, line_oq, theta_label, out='theta_arc')
klab = 1.2
pie.text('p', polar(a_deg, klab * r, 'x'), polar(a_deg, klab * r, 'y'), 16, out='p_label', stroke=BLUE)
pie.text('q', polar(q_deg, klab * r, 'x'), polar(q_deg, klab * r, 'y'), 16, out='q_label', stroke=PINK)

# pq = cos θ + sin θ e₁e₂, each part rounded to two decimals
def pq_text(t):
    c = round(math.cos(math.radians(t)), 2) + 0.0
    s = round(math.sin(math.radians(t)), 2) + 0.0
    return f'pq = {c:g} + {s:g}·e₁e₂'

pie.text(pie.lift(pq_text, pie.Text)(theta_deg), 0, -4.2, 15, 4.8, -1, out='pq_box', stroke=TEAL)
pie.text('Only the angle θ between p and q sets pq. Rotate p,q together and pq stays the same; change θ and pq changes; flip the sign of θ and the e₁e₂ part flips sign too.', 0, 5.4, 13, 4.4, -1, out='summary_box')
```

Given _any_ two unit vectors $p,q$ in the 2D plane with an angle of $\theta$ between them, we can see that:

- $p \cdot q = \cos\theta$
- $p \wedge q = \sin\theta\,e_1e_2$: this is because the (signed) area of the parallelogram spanned by two unit vectors is equal to the (signed) area between them.
- $pq = p \cdot q + p \wedge q = \cos\theta + \sin\theta\,e_1e_2$ which is the quantity we just used above to rotate a vector.

For example, to rotate a vector $\begin{bmatrix} x \\ y \end{bmatrix}$ by 90°, all of the choices below work:

- Axis aligned: $p = 1e_1 + 0e_2, \ q = 0e_1 + 1e_2$

```python-editor collapsed
pie.translate_scalar_to(a_deg, 0, animate=True)
```

- Rotated by 45 degrees: $p = (1/\sqrt2)e_1 + (1/\sqrt2)e_2, \ q = -(1/\sqrt2)e_1 + (1/\sqrt2)e_2$

```python-editor collapsed
pie.translate_scalar_to(a_deg, 45, animate=True)
```

- Rotated by 180 degrees: $p = 0e_1 + 1e_2, \ q = -1e_1 + 0e_2$

```python-editor collapsed
pie.translate_scalar_to(a_deg, 180, animate=True)
```

In each case, $pq = e_1e_2 = \cos(\pi/2) + \sin(\pi/2)\,e_1e_2$: $p$ and $q$ sweep together through a full turn while $\theta$ stays fixed, so the $pq$ readout never moves.

```python-editor collapsed
pie.translate_scalar_to(a_deg, 180 + 8 * 27.5, animate=True)
```

Also note that if $pq$ rotates a vector by $\theta$, then $qp = \cos\theta - \sin\theta\,e_1e_2$ rotates the vector by $-\theta$. This is because:

$$\begin{aligned}
p^2 = q^2 &= 1 \\
\Rightarrow (pq)(qp) &= 1 \\
\Rightarrow qp &= (pq)^{-1}
\end{aligned}$$

(yes, there is a notion of an inverse of a vector, and also a bivector among other objects, in geometric algebra).

```python-editor collapsed
pie.translate_scalar_to(theta_deg, -90, animate=True)
```

One last thing to note is that $v(pq)$ rotates the vector $v$ counterclockwise by $\theta$ while $(pq)v$ rotates the vector clockwise by $\theta$. It also means that $v(pq) = (qp)v = (pq)^{-1}v$.

#### Python implementation
```python
import clifford as cf
from math import pi, sin, cos
layout, blades = cf.Cl(2) # create a 2D clifford algebra
locals().update(blades)
x = 1^e1        # the vector to be rotated
theta = pi/4    # the angle of rotation

# pick any two vectors with an angle of theta between them
random_angle = 1.4376
p = (cos(random_angle)^e1) + (sin(random_angle)^e2)
q = (cos(random_angle + theta)^e1) + (sin(random_angle + theta)^e2)
pq = p*q    # the bivector R = pq which is also a rotor since the vectors are unit vectors
print(pq)

'''
Output:
0.70711 + (0.70711^e12)
This is equivalent to cos(theta) + i*sin(theta) in the complex plane
'''

print(pq * x)   # Rv rotates the vector x by -theta
'''
Output:
(0.70711^e1) - (0.70711^e2)
'''

print(x * pq)   # vR rotates the vector x by theta
'''
Output:
(0.70711^e1) + (0.70711^e2)
'''
```

#### Connection with quaternions

We just saw that $(e_1e_2)^2 = -1$. Using the same reasoning, we can show that $(e_2e_3)^2 = -1$ and $(e_1e_3)^2 = -1$. Thus the bivectors $e_1e_2, e_2e_3, e_1e_3$ behave like the imaginary numbers $i, j, k$ respectively. You can also ensure that $ijk = (e_1e_2)(e_2e_3)(e_1e_3) = -1$.

That said, I think the real appreciation of geometric algebra comes not from finding these connections but from the fact that it provides a unified framework to describe rotations, reflections and many other operations in a simple and elegant way. So let's focus on that.

---

## 5.4 Describing a rotation in 3D

We start by generalizing how vectors were being rotated in a 2D plane. We had a bivector $\textcolor{#0d9488}{B} = e_1e_2$ of magnitude 1 and another vector $v$ _in the same plane_. Then we saw that $\textcolor{#0d9488}{R} = \cos\theta + \sin\theta\,\textcolor{#0d9488}{B}$ rotated the vector $v$ by an angle $\theta$. This pattern actually works for any plane in a higher dimensional space.

> Given a unit bivector $\textcolor{#0d9488}{B}$ and a vector $v$ in the same plane, the quantity $v\textcolor{#0d9488}{R}$ with $\textcolor{#0d9488}{R} = \cos\theta + \sin\theta\,\textcolor{#0d9488}{B}$ rotates the vector $v$ by an angle $\theta$ in the plane defined by $\textcolor{#0d9488}{B}$.

This is a generalization of the 2D rotation we saw earlier. The limitation that we have right now is that we can only rotate vectors in the same plane as the bivector $\textcolor{#0d9488}{B}$. We will see how to overcome this limitation in the next section.

```python-editor collapsed
import math

pie.clear()
pie.scalar(50, out='unit')
BLUE, PINK, GREEN, AMBER = '#1d4ed8', '#be185d', '#047857', '#b45309'
ORANGE, TEAL, GRAY = '#ea580c', '#0d9488', '#71717a'
radius = 3
origin = pie.point(0, 0, out='origin', hidden=True)
theta_deg = pie.scalar(40, out='theta_deg')
p_deg = pie.scalar(0, out='p_deg')
plus = pie.lift(lambda u, v: u + v, pie.Scalar)
times = pie.lift(lambda k, v: k * v, pie.Scalar)
middle = pie.lift(lambda u, v: (u + v) / 2, pie.Scalar)
# The x or y of the point at `deg` degrees on a circle of radius `radius`
polar = pie.lift(lambda deg, radius, axis: radius * (math.cos(math.radians(deg)) if axis == 'x' else math.sin(math.radians(deg))), pie.Scalar)
q_deg = plus(p_deg, theta_deg, out='q_deg')
r_deg = plus(q_deg, theta_deg, out='r_deg')
px, py = polar(p_deg, radius, 'x', out='px'), polar(p_deg, radius, 'y', out='py')
qx, qy = polar(q_deg, radius, 'x', out='qx'), polar(q_deg, radius, 'y', out='qy')
rx, ry = polar(r_deg, radius, 'x', out='rx'), polar(r_deg, radius, 'y', out='ry')
p_pt = pie.point(px, py, out='p_pt', hidden=True)
q_pt = pie.point(qx, qy, out='q_pt', hidden=True)
r_pt = pie.point(rx, ry, out='r_pt', hidden=True)

pie.circle(origin, radius, out='unit_circle', stroke=GRAY)
pie.annotate_arrow(origin, p_pt, 0, out='p_arrow', stroke=BLUE)
pie.annotate_arrow(origin, q_pt, 0, out='q_arrow', stroke=PINK)
r_arrow = pie.annotate_arrow(origin, r_pt, 0, out='r_arrow', stroke=GREEN, hidden=True)
line_op = pie.line(origin, p_pt, out='line_op', hidden=True)
line_oq = pie.line(origin, q_pt, out='line_oq', hidden=True)
line_or = pie.line(origin, r_pt, out='line_or', hidden=True)

# v = αp + βq, and vR = αq + βr
alpha = pie.scalar(1.3, out='alpha')
beta = pie.scalar(0.7, out='beta')
combo = pie.lift(lambda a, b, u, w: a * u + b * w, pie.Scalar)
vx, vy = combo(alpha, beta, px, qx, out='vx'), combo(alpha, beta, py, qy, out='vy')
vrx, vry = combo(alpha, beta, qx, rx, out='vrx'), combo(alpha, beta, qy, ry, out='vry')
v_pt = pie.point(vx, vy, out='v_pt', hidden=True)
vr_pt = pie.point(vrx, vry, out='vr_pt', hidden=True)
v_arrow = pie.annotate_arrow(origin, v_pt, 0, out='v_arrow', stroke=AMBER, hidden=True)
vr_arrow = pie.annotate_arrow(origin, vr_pt, 0, out='vr_arrow', stroke=ORANGE, hidden=True)

# Labels sit a little past the tips
klab = 1.2
pie.text('p', times(klab, px), times(klab, py), 16, out='p_label', stroke=BLUE)
pie.text('q', times(klab, qx), times(klab, qy), 16, out='q_label', stroke=PINK)
r_label = pie.text('r', times(klab, rx), times(klab, ry), 16, out='r_label', stroke=GREEN, hidden=True)
v_label = pie.text('v', times(klab, vx), times(klab, vy), 16, out='v_label', stroke=AMBER, hidden=True)
vr_label = pie.text('vR', times(klab, vrx), times(klab, vry), 16, out='vr_label', stroke=ORANGE, hidden=True)
readout = pie.lift(lambda a, b, name, u, w: f'{name} = {a:g}{u} + {b:g}{w}', pie.Text)
v_readout = pie.text(readout(alpha, beta, 'v', 'p', 'q'), 0, -4, 14, 5.5, -1, out='v_readout', stroke=AMBER, hidden=True)
vr_readout = pie.text(readout(alpha, beta, 'vR', 'q', 'r'), 0, -5, 14, 5.5, -1, out='vr_readout', stroke=ORANGE, hidden=True)

# The two angle marks, each with its label at the middle of its angle
theta_label = pie.lift(lambda t: f'θ = {round(t)}°', pie.Text)(theta_deg, out='theta_label')
pq_mid = middle(p_deg, q_deg, out='pq_mid')
qr_mid = middle(q_deg, r_deg, out='qr_mid')
pq_mark = pie.annotate_angle_mark(line_op, line_oq, out='pq_mark', hidden=True)
pq_mark_label = pie.text(theta_label, polar(pq_mid, 0.7, 'x'), polar(pq_mid, 0.7, 'y'), 14, out='pq_mark_label', hidden=True)
qr_mark = pie.annotate_angle_mark(line_oq, line_or, out='qr_mark', hidden=True)
qr_mark_label = pie.text(theta_label, polar(qr_mid, 0.7, 'x'), polar(qr_mid, 0.7, 'y'), 14, out='qr_mark_label', hidden=True)
```

To show why, let's use a small trick: define the quantity $\textcolor{#0d9488}{R} = \cos\theta + \sin\theta\,\textcolor{#0d9488}{B}$ as a product of two unit vectors in two different ways. We pick vectors $\textcolor{#1d4ed8}{p}$, $\textcolor{#be185d}{q}$, $\textcolor{#047857}{r}$ in the same plane as the bivector $\textcolor{#0d9488}{B}$, placed on a unit circle so we can see the angles between them line up.

The angle between $\textcolor{#1d4ed8}{p},\textcolor{#be185d}{q}$ is $\theta$,

```python-editor collapsed
pie.show([pq_mark, pq_mark_label])
```

and the angle between $\textcolor{#be185d}{q},\textcolor{#047857}{r}$ is also $\theta$. Then we can write:

```python-editor collapsed
pie.show([r_arrow, r_label, qr_mark, qr_mark_label])
```

$$\textcolor{#0d9488}{B} = \textcolor{#1d4ed8}{p}\textcolor{#be185d}{q} = \textcolor{#be185d}{q}\textcolor{#047857}{r} \quad \text{because} \quad \textcolor{#1d4ed8}{p} \cdot \textcolor{#be185d}{q} = \textcolor{#be185d}{q} \cdot \textcolor{#047857}{r}, \ \ \textcolor{#1d4ed8}{p} \wedge \textcolor{#be185d}{q} = \textcolor{#be185d}{q} \wedge \textcolor{#047857}{r}$$

We can represent any vector in the plane defined by $\textcolor{#0d9488}{B}$ as a linear combination of the basis vectors $\textcolor{#1d4ed8}{p},\textcolor{#be185d}{q}$. So if we show that $\textcolor{#1d4ed8}{p}\textcolor{#0d9488}{R}$ rotates the vector $\textcolor{#1d4ed8}{p}$ by $\theta$ and $\textcolor{#be185d}{q}\textcolor{#0d9488}{R}$ rotates the vector $\textcolor{#be185d}{q}$ by $\theta$, then we have shown that $v\textcolor{#0d9488}{R}$ rotates the vector $v$ by $\theta$ in the plane defined by $\textcolor{#0d9488}{B}$. Now we have:

$$\begin{aligned}
\textcolor{#1d4ed8}{p}\textcolor{#0d9488}{R} &= \textcolor{#1d4ed8}{p}(\textcolor{#1d4ed8}{p}\textcolor{#be185d}{q}) = \textcolor{#be185d}{q} \\
\textcolor{#be185d}{q}\textcolor{#0d9488}{R} &= \textcolor{#be185d}{q}(\textcolor{#be185d}{q}\textcolor{#047857}{r}) = \textcolor{#047857}{r}
\end{aligned}$$

Multiplying $\textcolor{#1d4ed8}{p}$ by $\textcolor{#0d9488}{R}$ lands exactly on $\textcolor{#be185d}{q}$,

```python-editor collapsed
pie.hide([pq_mark, pq_mark_label, qr_mark, qr_mark_label])
ctrl_pq = pie.point(polar(pq_mid, 1.35 * radius, 'x'), polar(pq_mid, 1.35 * radius, 'y'), out='ctrl_pq', hidden=True)
pie.annotate_curved_arrow(p_pt, q_pt, ctrl_pq, 0.15, 'R', out='pr_eq_q', stroke=TEAL)
```

and likewise multiplying $\textcolor{#be185d}{q}$ by $\textcolor{#0d9488}{R}$ lands on $\textcolor{#047857}{r}$. Thus, $\textcolor{#1d4ed8}{p}$ got rotated by $\theta$ to $\textcolor{#be185d}{q}$ and $\textcolor{#be185d}{q}$ got rotated by $\theta$ to $\textcolor{#047857}{r}$.

```python-editor collapsed
ctrl_qr = pie.point(polar(qr_mid, 1.35 * radius, 'x'), polar(qr_mid, 1.35 * radius, 'y'), out='ctrl_qr', hidden=True)
pie.annotate_curved_arrow(q_pt, r_pt, ctrl_qr, 0.15, 'R', out='qr_eq_r', stroke=TEAL)
```

So, given $v = \alpha \textcolor{#1d4ed8}{p} + \beta \textcolor{#be185d}{q}$ as any vector in the plane, drawn here as the amber combination of $\textcolor{#1d4ed8}{p}$ and $\textcolor{#be185d}{q}$:

```python-editor collapsed
pie.show([v_arrow, v_label, v_readout])
```

$$\begin{aligned}
v\textcolor{#0d9488}{R} &= (\alpha \textcolor{#1d4ed8}{p} + \beta \textcolor{#be185d}{q})\textcolor{#0d9488}{R} \\
&= \alpha(\textcolor{#1d4ed8}{p}\textcolor{#0d9488}{R}) + \beta(\textcolor{#be185d}{q}\textcolor{#0d9488}{R}) \\
&= \alpha \textcolor{#be185d}{q} + \beta \textcolor{#047857}{r}
\end{aligned}$$

which rotates the vector $v$ by $\theta$ in the plane defined by $\textcolor{#0d9488}{B}$, landing on $vR = \alpha \textcolor{#be185d}{q} + \beta \textcolor{#047857}{r}$, the orange combination of $\textcolor{#be185d}{q}$ and $\textcolor{#047857}{r}$.

```python-editor collapsed
pie.show([vr_arrow, vr_label, vr_readout])
```

That is, once $\textcolor{#0d9488}{R}$ rotates the basis vectors $\textcolor{#1d4ed8}{p}\to\textcolor{#be185d}{q}$ and $\textcolor{#be185d}{q}\to\textcolor{#047857}{r}$, every vector in the plane inherits the same rotation by $\theta$.

```python-editor collapsed
pie.text('pR = q and qR = r since B = pq = qr. So any v = αp + βq rotates to vR = αq + βr: R rotates every vector in the plane by θ.', 0, 5.5, 13, 5.5, -1, out='summary_box')
```

#### Python implementation
```python
import clifford as cf
from math import sqrt
layout, blades = cf.Cl(3) # create a 3D clifford algebra
locals().update(blades)
x = (0^e1) + (1^e2) + (-4^e3)        # the vector to be rotated
SQRT14 = sqrt(14)
SQRT3 = sqrt(3)
# define coefficients of unit vectors p and q
p1, p2, p3 = 1/SQRT14, 2/SQRT14, -3/SQRT14
q1, q2, q3 = 1/SQRT3, 1/SQRT3, 1/SQRT3
# define the unit vectors p and q
'''
note that the dot product of p and q is zero i.e p|q = 0
thus, the angle between p and q is 90 degrees
'''
p = (p1^e1) + (p2^e2) + (p3^e3)
q = (q1^e1) + (q2^e2) + (q3^e3)
'''
define the rotor R = p^q
the rotor R will rotate any vector x by an angle of ±90 degrees
'''
pq = p*q
print(f'pq is {pq}')

# now let's rotate the vector
x_rotated_1 = pq * x
x_rotated_2 = x * pq
print(x_rotated_1)
print(x_rotated_2)
print(f'Dot product between x and x_rotated_1 is {x_rotated_1|x}')

'''
pq is -(0.1543^e12) + (0.61721^e13) + (0.77152^e23)
-(2.62316^e1) - (3.08607^e2) - (0.77152^e3)
(2.62316^e1) + (3.08607^e2) + (0.77152^e3)
Dot product between x and x_rotated_1 is 0
'''
```

If we try to rotate a vector that is not in the plane defined by the bivector $\textcolor{#0d9488}{B}$, we will get something that is not a vector:

```python
x_not_in_plane = (0^e1) + (1^e2) + (2^e3)
print(pq * x_not_in_plane)

'''
Output:
(1.08012^e1) + (1.54303^e2) - (0.77152^e3) - (0.92582^e123)
'''
```

---

## 5.5 Describing a reflection

```python-editor collapsed
import math

pie.clear()
pie.scalar(50, out='unit')
BLUE, GREEN, GRAY = '#1d4ed8', '#047857', '#71717a'
radius = 3.5
origin = pie.point(0, 0, out='origin', hidden=True)
u_deg = pie.scalar(35, out='u_deg')
theta_deg = pie.scalar(38, out='theta_deg')
plus = pie.lift(lambda a, b: a + b, pie.Scalar)
minus = pie.lift(lambda a, b: a - b, pie.Scalar)
middle = pie.lift(lambda a, b: (a + b) / 2, pie.Scalar)
# The x or y of the point at `deg` degrees on a circle of radius `radius`
polar = pie.lift(lambda deg, radius, axis: radius * (math.cos(math.radians(deg)) if axis == 'x' else math.sin(math.radians(deg))), pie.Scalar)

# The mirror line through the origin along u
far = 1.3 * radius
u_far = pie.point(polar(u_deg, far, 'x'), polar(u_deg, far, 'y'), out='u_far', hidden=True)
u_neg_far = pie.point(polar(u_deg, -far, 'x'), polar(u_deg, -far, 'y'), out='u_neg_far', hidden=True)
pie.line(u_neg_far, u_far, out='u_line', stroke=GRAY)
u_pt = pie.point(polar(u_deg, radius, 'x'), polar(u_deg, radius, 'y'), out='u_pt', hidden=True)
line_ou = pie.line(origin, u_pt, out='line_ou', hidden=True)

# v is θ past u, and its reflection vr is θ before u
v_deg = plus(u_deg, theta_deg, out='v_deg')
vr_deg = minus(u_deg, theta_deg, out='vr_deg')
v_pt = pie.point(polar(v_deg, radius, 'x'), polar(v_deg, radius, 'y'), out='v_pt', hidden=True)
vr_pt = pie.point(polar(vr_deg, radius, 'x'), polar(vr_deg, radius, 'y'), out='vr_pt', hidden=True)
pie.annotate_arrow(origin, v_pt, 0, out='v_arrow', stroke=BLUE)
line_ov = pie.line(origin, v_pt, out='line_ov', hidden=True)
line_ovr = pie.line(origin, vr_pt, out='line_ovr', hidden=True)

klab = 1.25
pie.text('u', polar(u_deg, klab * radius, 'x'), polar(u_deg, klab * radius, 'y'), 16, out='u_label', stroke=GRAY)
pie.text('v', polar(v_deg, klab * radius, 'x'), polar(v_deg, klab * radius, 'y'), 16, out='v_label', stroke=BLUE)

# The θ mark from u to v, with its label at the middle of the angle
theta_label = pie.lift(lambda t: f'θ = {round(t)}°', pie.Text)(theta_deg, out='theta_label')
uv_mid = middle(u_deg, v_deg, out='uv_mid')
theta_mark = pie.annotate_angle_mark(line_ou, line_ov, out='theta_mark', hidden=True)
theta_mark_label = pie.text(theta_label, polar(uv_mid, 0.7, 'x'), polar(uv_mid, 0.7, 'y'), 14, out='theta_mark_label', hidden=True)
```

We cover reflection about a line first. Let's say the reflection of a vector $\textcolor{#1d4ed8}{v}$ about a line defined by a unit vector $u$ is $\textcolor{#047857}{v_r}$.

This reflection can be seen as a rotation of $2\theta$ where $\theta$ is the angle from $\textcolor{#1d4ed8}{v}$ to $u$. This rotation happens in the plane defined by $u$ and $\textcolor{#1d4ed8}{v}$.

```python-editor collapsed
pie.show([theta_mark, theta_mark_label])
```

Rotating $\textcolor{#1d4ed8}{v}$ by $2\theta$ about $u$ lands exactly on the reflected vector $\textcolor{#047857}{v_r}$.

```python-editor collapsed
pie.annotate_arrow(origin, vr_pt, 0, out='vr_arrow', stroke=GREEN)
pie.text('vr', polar(vr_deg, klab * radius, 'x'), polar(vr_deg, klab * radius, 'y'), 16, out='vr_label', stroke=GREEN)
readout = pie.lift(lambda t: f'θ = {round(t)}°   2θ = {round(2 * t)}°  (v reflects to vr by rotating 2θ)', pie.Text)
pie.text(readout(theta_deg), 0, -5.6, 14, 7, -1, out='readout_box')
```

Indeed, the total angle swept from $\textcolor{#1d4ed8}{v}$ to $\textcolor{#047857}{v_r}$ is $2\theta$, twice the angle to the mirror line. Writing $\textcolor{#1d4ed8}{\hat{v}} = \textcolor{#1d4ed8}{v}/\|v\|$ for the unit vector along $\textcolor{#1d4ed8}{v}$, we can describe this reflection as:

```python-editor collapsed
pie.hide([theta_mark, theta_mark_label])
twotheta_label = pie.lift(lambda t: f'2θ = {round(2 * t)}°', pie.Text)(theta_deg, out='twotheta_label')
pie.annotate_angle_mark(line_ov, line_ovr, twotheta_label, out='total_angle_mark')
```

$$\begin{aligned}
\textcolor{#047857}{v_r} &= \|v\|\,\textcolor{#1d4ed8}{\hat{v}}(\textcolor{#1d4ed8}{\hat{v}}u)(\textcolor{#1d4ed8}{\hat{v}}u) \\
&= \|v\|\,u\textcolor{#1d4ed8}{\hat{v}}u \\
&= u\textcolor{#1d4ed8}{v}u
\end{aligned}$$

---

Now let's talk about reflection about a hyperplane. Note that the reflection about a hyperplane is just the negative of the reflection about a line that is perpendicular to the hyperplane. This is because:

- Reflection about a line: keep the component along the line the same and negate the component perpendicular to the line.
- Reflection about a hyperplane: keep the component along the hyperplane the same and negate the component perpendicular to the hyperplane.

As you can see, these two are exactly opposite operations. Thus, the reflection about a hyperplane represented by a normal vector $u$ is given by negating the line-reflection formula above:

$$\textcolor{#047857}{v_r} = -u\textcolor{#1d4ed8}{v}u$$

Notice the simplicity of this expression. It applies to vectors in all dimensions and does not depend on the basis being used. This is the power of geometric algebra.

---

## 5.6 Describing a rotation using reflections

Now we will define a general rotation in 3D space using reflections. We will use the fact that a rotation is a composition of two reflections. If the first reflection is about a line defined by a unit vector $m$ and the second reflection is about a line defined by a unit vector $n$, then the composition of these two reflections is a rotation by an angle $2\theta$ where $\theta$ is the angle between $m$ and $n$. This is because the composition of two reflections is a rotation by twice the angle between the two lines. Thus, we can write the rotation as:

$$\begin{aligned}
\textcolor{#047857}{v_{rotated}} &= n\underbrace{(m\textcolor{#1d4ed8}{v}m)}_{\text{first reflection, about }m}n \\
&= (nm)\textcolor{#1d4ed8}{v}(mn)
\end{aligned}$$

If we reflected the vector around the planes represented by the vectors $m$ and $n$, we would still have gotten the same result because:

$$\begin{aligned}
\textcolor{#047857}{v_{rotated}} &= -n\underbrace{(-m\textcolor{#1d4ed8}{v}m)}_{\text{first reflection, about the hyperplane}\ \perp m}n \\
&= (nm)\textcolor{#1d4ed8}{v}(mn)
\end{aligned}$$

Now note that $mn$ and $nm$ are inverses of each other. Thus if we define $\textcolor{#0d9488}{R} = mn$, we can write the rotation as:

$$\textcolor{#047857}{v_{rotated}} = \textcolor{#0d9488}{R}\,\textcolor{#1d4ed8}{v}\,\textcolor{#0d9488}{R}^{-1}$$

If we want to rotate $v$ by an angle of $\theta$, we just need to find unit vectors $m,n$ which have an angle of $\theta/2$ between them. Does it look eerily similar to the formula for a rotation using quaternions? That is because quaternions are a subset of geometric algebra!

#### Python implementation
```python
'''
To rotate the vector x_not_in_plane by 90 degrees, we find a vector which forms an angle of 45 degrees with p
'''
r1, r2, r3 = (p1+q1)/2, (p2+q2)/2, (p3+q3)/2
r_norm = sqrt(r1**2 + r2**2 + r3**2)
r1, r2, r3 = r1/r_norm, r2/r_norm, r3/r_norm
r = (r1^e1) + (r2^e2) + (r3^e3)
pr = p*r
y_not_in_plane = pr * x_not_in_plane * pr.inv()
print(y_not_in_plane)

'''
Output:
(0.36584^e1) + (2.11446^e2) - (0.62866^e3)
'''
```

---

## 5.7 Number of free variables for 3D rotation

We have gone over different ways to describe a 3D rotation. In each case, the number of free variables needed to describe a rotation is 3.

- Euler angles: 3 angles $\phi, \theta, \psi$ corresponding to the three rotations.
- Axis-angle representation: two values to describe the unit vector and one value to describe the angle.
- Quaternions: Same as the axis-angle representation.
- Geometric algebra: The plane of rotation is described by two unit vectors. The angle of rotation is described by the angle between them. Each unit vector needs two free variables. So it may seem like we need four variables here. But the fact that their dot product is equal to $\cos\theta$ puts an extra constraint and thus we need only three variables.

In the next section, we will cover a different approach to describe rotations in 3D space. However the number of free variables needed to describe a rotation will remain the same.

---

[← Rotations as reflections](/series/rotations/rotation_as_reflections)  ·  [Lie algebra →](/series/rotations/lie_algebra)

