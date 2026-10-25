---
title: 3. Quaternions
canvas: left
---

# 3. Quaternions

Here's another way to think of a rotation in 3D space: rotating a vector about another vector (or direction). Quaternions have an algebra that allows this view of rotation. 

Quaternions are seen as a generalization of complex numbers. A quaternion is a 4-tuple $q = w + xi + yj + zk$ where $i^2 = j^2 = k^2 = ijk = -1$. 

---

## 3.1 A little bit of algebra with quaternions

The product of two quaternions $a = a_0 + a_1i + a_2j + a_3k$ and $b = b_0 + b_1i + b_2j + b_3k$ is:

$$\begin{aligned}
ab &= \textcolor{#1d4ed8}{(a_0b_0 - a_1b_1 - a_2b_2 - a_3b_3)} \\
  &\quad + \textcolor{#be185d}{(a_0b_1 + a_1b_0 + a_2b_3 - a_3b_2)i} \\
  &\quad + \textcolor{#047857}{(a_0b_2 - a_1b_3 + a_2b_0 + a_3b_1)j} \\
  &\quad + \textcolor{#b45309}{(a_0b_3 + a_1b_2 - a_2b_1 + a_3b_0)k}
\end{aligned}$$

Now if $a_0 = b_0, a_1 = -b_1, a_2 = -b_2, a_3 = -b_3$, then $ab = a_0^2 + a_1^2 + a_2^2 + a_3^2$ which is equal to the square of the norm of the vector $\begin{bmatrix} a_0 \\ a_1 \\ a_2 \\ a_3 \end{bmatrix}$.

---

One can create two quaternions from a 3D **unit** vector $q = \begin{bmatrix} \textcolor{#047857}{q_1} \\ \textcolor{#b45309}{q_2} \\ \textcolor{#6d28d9}{q_3} \end{bmatrix}$ and an angle $\theta$ like so:

$$\begin{aligned}
\textcolor{#1d4ed8}{q_\theta} &= \cos(\theta/2) + \sin(\theta/2)(\textcolor{#047857}{q_1}i + \textcolor{#b45309}{q_2}j + \textcolor{#6d28d9}{q_3}k) \\
&= \underbrace{\cos(\theta/2)}_{a_0} + \underbrace{\textcolor{#047857}{\sin(\theta/2)q_1}}_{a_1}i + \underbrace{\textcolor{#b45309}{\sin(\theta/2)q_2}}_{a_2}j + \underbrace{\textcolor{#6d28d9}{\sin(\theta/2)q_3}}_{a_3}k \\
\\
\textcolor{#be185d}{q_\theta^*} &= \cos(\theta/2) - \sin(\theta/2)(\textcolor{#047857}{q_1}i + \textcolor{#b45309}{q_2}j + \textcolor{#6d28d9}{q_3}k) \\
&= \underbrace{\cos(\theta/2)}_{b_0} - \underbrace{\textcolor{#047857}{\sin(\theta/2)q_1}}_{b_1}i - \underbrace{\textcolor{#b45309}{\sin(\theta/2)q_2}}_{b_2}j - \underbrace{\textcolor{#6d28d9}{\sin(\theta/2)q_3}}_{b_3}k
\end{aligned}$$

Note that $\textcolor{#1d4ed8}{q_\theta} \cdot \textcolor{#be185d}{q_\theta^*} = 1$ 

#### Reason
If $\begin{bmatrix} \textcolor{#047857}{q_1} \\ \textcolor{#b45309}{q_2} \\ \textcolor{#6d28d9}{q_3} \end{bmatrix}$ is a unit vector, then $\begin{bmatrix} \cos(\theta/2) \\ \textcolor{#047857}{q_1}\sin(\theta/2) \\ \textcolor{#b45309}{q_2}\sin(\theta/2) \\ \textcolor{#6d28d9}{q_3}\sin(\theta/2) \end{bmatrix}$ is also a unit vector for any $\theta$. 

Thus, $\textcolor{#be185d}{q_\theta^*}$ is the inverse of $\textcolor{#1d4ed8}{q_\theta}$ and we can write it as $\textcolor{#be185d}{q_\theta^*} = \textcolor{#1d4ed8}{q_\theta}^{-1}$.

---

## 3.2 Rotating a vector using quaternions

```python-editor collapsed
import math

pie.clear()
pie.scalar(90, out='unit')
GRAY, BLUE, GOLD = '#71717a', '#1d4ed8', '#ca8a04'
p0 = pie.point(0, 0, out='p0', hidden=True)
pie.circle(p0, 1, out='circ', stroke=GRAY)
pie.la_vec2d(1, 0, out='eref', stroke=GRAY)
theta = pie.scalar(0.9, out='theta')
half = pie.lift(lambda t: 0.5 * t, pie.Scalar)(theta, out='half')
cos_ = pie.lift(math.cos, pie.Scalar)
sin_ = pie.lift(math.sin, pie.Scalar)
# y is at angle θ; the quaternion's (w, v) at angle θ/2
pie.la_vec2d(cos_(theta, out='yw'), sin_(theta, out='yv'), out='yvec', stroke=GOLD)
pie.la_vec2d(cos_(half, out='qw'), sin_(half, out='qv'), out='qvec', stroke=BLUE)
```

Let's say we want to rotate a vector $\textcolor{#0d9488}{x} = \textcolor{#0d9488}{\begin{bmatrix} x_1 \\ x_2 \\ x_3 \end{bmatrix}}$ around an axis represented by a unit vector $q = \begin{bmatrix} q_1 \\ q_2 \\ q_3 \end{bmatrix}$ by an angle $\theta$.

```python-editor collapsed
pie.translate_scalar_to(theta, 3.141, animate=True)
```

Let's denote the output vector as $\textcolor{#ca8a04}{y} = \textcolor{#ca8a04}{\begin{bmatrix} y_1 \\ y_2 \\ y_3 \end{bmatrix}}$. Then:

$$\textcolor{#ca8a04}{\begin{bmatrix} 0 \\ y_1 \\ y_2 \\ y_3 \end{bmatrix}} = \textcolor{#1d4ed8}{q_\theta}\,\textcolor{#0d9488}{\begin{bmatrix} 0 \\ x_1 \\ x_2 \\ x_3 \end{bmatrix}}\,\textcolor{#be185d}{q_\theta^{-1}}$$

Here we took the liberty to represent a quaternion $a + bi + cj + dk$ as a vector $\begin{bmatrix} a \\ b \\ c \\ d \end{bmatrix}$. One can verify the above equation by multiplying the quaternions on the right hand side.

Let's see how it looks like for 2D rotations. 

---

## 3.3 Visualizing quaternion rotations

### 3.3.1 Rotations in 2D
Since quaternions describe rotations in 3D, once can think of a rotation of $\begin{bmatrix} x \\ y \end{bmatrix}$ by $\theta$ in a 2D plane as rotation of $\begin{bmatrix} x \\ y \\ 0 \end{bmatrix}$ about the z-axis by the same angle. 

```python-editor collapsed
import math

pie.clear()
GRAY, BLUE, GOLD = '#71717a', '#1d4ed8', '#ca8a04'
p0 = pie.point(0, 0, out='p0', hidden=True)
x0 = pie.scalar(3, out='x0')
y0 = pie.scalar(1, out='y0')
v0 = pie.la_vec2d(x0, y0, 0, 0, out='v0', stroke=GRAY)

# Labels sit at 1.3 times the tip of their vector
scale = 1.3
times = pie.lift(lambda s, v: s * v, pie.Scalar)
pie.text('v', times(scale, x0), times(scale, y0), out='an0', stroke=GRAY)
```

- Say we want to rotate this vector

- Turn it into a quaternion $\textcolor{#0d9488}{q_{in}}$.

It is essentially this operation:
$$\begin{bmatrix} x \\ y \end{bmatrix} \;\longmapsto\; \textcolor{#0d9488}{q_{in}} = \begin{bmatrix} 0 \\ x \\ y \\ 0 \end{bmatrix}$$

```python-editor collapsed
qin = [0, x0, y0, 0]
axis = [0, 0, 1]
deg = pie.scalar(30, out='deg')
q_theta = pie.ga_rotation_quaternion(axis, deg, out='q_theta')
neg_deg = pie.lift(lambda d: -d, pie.Scalar)(deg, out='neg_deg')
q_neg_theta = pie.ga_rotation_quaternion(axis, neg_deg, out='q_neg_theta')
prod1 = pie.ga_quaternion_product(q_theta, qin, out='prod1')
prod2 = pie.ga_quaternion_product(prod1, q_neg_theta, out='prod2')
x1, y1 = prod1[1], prod1[2]
x2, y2 = prod2[1], prod2[2]
v1 = pie.la_vec2d(x1, y1, 0, 0, out='v1', stroke=BLUE)
v2 = pie.la_vec2d(x2, y2, 0, 0, out='v2', stroke=GOLD)
pie.text('(qθ)(qin)', times(scale, x1), times(scale, y1), out='an1', stroke=BLUE)
pie.text('(qθ)(qin)(-qθ)', times(scale, x2), times(scale, y2), out='an2', stroke=GOLD)
```

- Rotated vector after the multiplication $\textcolor{#1d4ed8}{q_\theta}\,\textcolor{#0d9488}{q_{in}}$
- Rotated vector after the multiplication $\textcolor{#ca8a04}{q_{out}} = \textcolor{#1d4ed8}{q_\theta}\,\textcolor{#0d9488}{q_{in}}\,\textcolor{#be185d}{q_\theta^{-1}}$

The reverse mapping simply drops the first (zero) component of $\textcolor{#ca8a04}{q_{out}}$:
$$\textcolor{#ca8a04}{q_{out}} = \begin{bmatrix} 0 \\ x' \\ y' \\ 0 \end{bmatrix} \;\longmapsto\; \begin{bmatrix} x' \\ y' \end{bmatrix}$$

#### A couple of things to note

```python-editor collapsed
# The angle of each vector, in degrees
angle = pie.lift(lambda y, x: math.degrees(math.atan2(y, x)), pie.Scalar)
a0 = angle(y0, x0, out='a0')
a1 = angle(y1, x1, out='a1')
a2 = angle(y2, x2, out='a2')
pie.arc(p0, 1, a0, a1, out='arc0', stroke=BLUE)
pie.arc(p0, 1, a1, a2, out='arc1', stroke=GOLD)
```

- This angle is equal to this angle. 
  - Try animating the angle to see how this entire setup evolves. 

```python-editor collapsed
pie.translate_scalar_to(deg, 135, animate=True)
```

- The first and last values of the quaternion products $\textcolor{#1d4ed8}{q_\theta}\,\textcolor{#0d9488}{q_{in}}$ and $\textcolor{#1d4ed8}{q_\theta}\,\textcolor{#0d9488}{q_{in}}\,\textcolor{#be185d}{q_\theta^{-1}}$ are zero.
  - Indeed once can verify this in the first product and the second product. 

```python-editor collapsed
# The first product
pie.la_array_to_texts(prod1, -4, -2, 1, 1, 14, out='prod1_texts')
# The second product
pie.la_array_to_texts(prod2, -2, -2, 1, 1, 14, out='prod2_texts')
```

---

### 3.3.2 Rotations in 3D

Unlike the 2D case, in general all four numbers in the product $\textcolor{#1d4ed8}{q_\theta}\,\textcolor{#0d9488}{q_{in}}$ are non-zero. So it is not possible to visualize it. 

#### An example 
- Turn $\begin{bmatrix} 1 \\ 1 \\ 1 \end{bmatrix}$ into a quaternion
- Use $\begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix}$
- Define the angle in degrees
- Get the corresponding quaternion
- Get the quaternion product
- Display it: You can see all four values are non-zero

```python-editor
pie.clear()
v = [0, 1, 1, 1]
axis = [1, 2, 3]
deg = pie.scalar(30, out='deg')
q = pie.ga_rotation_quaternion(axis, deg, out='q')
vout = pie.ga_quaternion_product(q, v, out='vout')
pie.la_array_to_texts(vout, 0, 0, 1, 1, 14, out='vout_texts')
```

However the product $\textcolor{#1d4ed8}{q_\theta}\,\textcolor{#0d9488}{q_{in}}\,\textcolor{#be185d}{q_\theta^{-1}}$ always has the first value equal to 0, which allows one to interpret it as a 3D vector:

$$\textcolor{#ca8a04}{q_{out}} = \textcolor{#1d4ed8}{q_\theta}\,\textcolor{#0d9488}{q_{in}}\,\textcolor{#be185d}{q_\theta^{-1}} = \begin{bmatrix} 0 \\ x' \\ y' \\ z' \end{bmatrix} \;\longmapsto\; \begin{bmatrix} x' \\ y' \\ z' \end{bmatrix}$$

#### Continuing the previous example
- Negate the degree
- Get $q_{-\theta}$
- Get the final product
- Display it: the first value is $0$.

```python-editor
neg_deg = pie.lift(lambda d: -d, pie.Scalar)(deg, out='neg_deg')
qneg = pie.ga_rotation_quaternion(axis, neg_deg, out='qneg')
vout2 = pie.ga_quaternion_product(vout, qneg, out='vout2')
pie.la_array_to_texts(vout2, 3, 0, 1, 1, 14, out='vout2_texts')
```

One can visualize 3D rotations by rotating a cube. 

```python-editor collapsed
pie.clear()
GRAY = '#71717a'
p0 = pie.point(0, 0, out='p0', hidden=True)
pie.la_ortho_axes(p0, 5, out='axes')
points3d = pie.la_cube_array(2, out='points3d')
qs = pie.ga_batch_vec3d_to_quaternion(points3d, out='qs')
# The axis of rotation, as three scalars so it can move
ax = pie.scalar(1, out='ax')
ay = pie.scalar(0, out='ay')
az = pie.scalar(0, out='az')
axis = [ax, ay, az]
pie.la_vec3d(ax, ay, az, out='v_axis', stroke=GRAY)
deg = pie.scalar(0, out='deg')
rotated = pie.ga_batch_quaternion_rotation(qs, axis, deg, out='rotated')

deg_text = pie.lift(lambda d: f'Degree of rotation: {round(d, 2):g}', pie.Text)(deg, out='text_deg')
pie.text(deg_text, 0, 5, 14, -1, 0, out='tbox_deg')
pie.text('Axis of rotation', 5, -3, 14, 1.5, -1, out='tbox_axis')
pie.la_array_to_texts(axis, 5, -4, 1, 1, 14, out='axis_texts')
pie.la_cube_from_array(rotated, p0, out='cube')
```

- This is the cube we want to rotate about this axis by an angle `deg`, currently set to $0$. 

- Animate degrees `deg` to $150$ to see how the cube rotates.

```python-editor collapsed
pie.translate_scalar_to(deg, 150, animate=True)
```

- One can also move the axis from x-axis to y-axis and see its effect on the orientation of the cube. 

```python-editor collapsed
pie.translate_scalar_to(axis, [0, 1, 0], animate=True)
```

- Move it to z-axis.

```python-editor collapsed
pie.translate_scalar_to(axis, [0, 0, 1], animate=True)
```

---

## 3.4 Matrix representation of a quaternion

A quaternion $q = w + xi + yj + zk$ can be represented as a matrix:

$$\begin{bmatrix} 1-2s(y^2+z^2) & 2s(xy - zw) & 2s(xz+wy) \\ 2s(xy+zw) & 1-2s(x^2+z^2) & 2s(yz-wx) \\ 2s(xz-wy) & 2s(yz+wx) & 1-2s(x^2+y^2) \end{bmatrix}$$

where $s = \|q\|^{-2}$ and $\|q\| = \sqrt{w^2 + x^2 + y^2 + z^2}$.

#### Python implementation
```python
class Quaternion:
    def __init__(self, w:float, x:float, y:float, z:float):
        self.w = w
        self.x = x
        self.y = y
        self.z = z

    def norm(self):
        return np.sqrt(self.w**2 + self.x**2 + self.y**2 + self.z**2)

    def unit(self):
        n = self.norm()
        return Quaternion(self.w/n, self.x/n, self.y/n, self.z/n)

    def conjugate(self):
        return Quaternion(self.w, -self.x, -self.y, -self.z)

    def __mul__(self, other):
        w = self.w*other.w - self.x*other.x - self.y*other.y - self.z*other.z
        x = self.w*other.x + self.x*other.w + self.y*other.z - self.z*other.y
        y = self.w*other.y - self.x*other.z + self.y*other.w + self.z*other.x
        z = self.w*other.z + self.x*other.y - self.y*other.x + self.z*other.w
        return Quaternion(w, x, y, z)

    def to_matrix(self):
        u = self.unit()
        w,x,y,z = u.w, u.x, u.y, u.z
        xx, yy, zz = x*x, y*y, z*z
        xy, xz, yz = x*y, x*z, y*z
        wx, wy, wz = w*x, w*y, w*z
        m = [[1 - 2*(yy + zz), 2*(xy - wz), 2*(xz + wy)],
             [2*(xy + wz), 1 - 2*(xx + zz), 2*(yz - wx)],
             [2*(xz - wy), 2*(yz + wx), 1 - 2*(xx + yy)]]
        return np.array(m)
```

Here is how one would use it to rotate a vector:

```python
def rotate_vector(
    axis_x:float, axis_y:float, axis_z:float,
    angle:float,
    vector_x:float, vector_y:float, vector_z:float
):
    cos_angle, sin_angle = np.cos(angle/2), np.sin(angle/2)
    # make the axis a unit vector
    axis_norm = np.sqrt(axis_x**2 + axis_y**2 + axis_z**2)
    axis_x, axis_y, axis_z = axis_x/axis_norm, axis_y/axis_norm, axis_z/axis_norm
    q = Quaternion(cos_angle, sin_angle*axis_x, sin_angle*axis_y, sin_angle*axis_z)
    v = Quaternion(0, vector_x, vector_y, vector_z)
    y = q * v * q.conjugate()
    return y.x, y.y, y.z
```

---

[← 3D rotation matrices](/series/rotations/3d_rotation_matrices)  ·  [Rotations as reflections →](/series/rotations/rotation_as_reflections)
