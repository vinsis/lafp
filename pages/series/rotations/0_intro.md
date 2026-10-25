---
title: Rotation is linear
description: Start of a series on rotations, from 2D rotation matrices to quaternions and Lie algebra. Why rotation is linear and preserves lengths and angles.
canvas: left
---

# Rotation is linear

This series starts from 2D rotation matrices and takes us through the developments we have made to understand and describe rotations. It covers imaginary numbers, intrinsic and extrinsic rotations, Euler angles, quaternions, geometric algebra and Lie theory.

> Rotation is linear and can be represented by a matrix.

---

## 0. Establishing fundamental facts about rotations

First let's see that rotations are linear transformations.

### 0.1. Add-then-rotate = Rotate-then-add

- Sum of two rotated vectors is the same as rotating the sum of the vectors. In other words

$$\underbrace{R(v) + R(w)}_{\text{rotate, then add}} = \underbrace{R(v + w)}_{\text{add, then rotate}}$$

```python-editor collapsed
import math

pie.clear()
AMBER = '#b45309'

# (x, y) turned by deg degrees about the origin; axis picks the coordinate
def turn_xy(deg, x, y, axis):
    t = math.radians(deg)
    if axis == 'x':
        return x * math.cos(t) - y * math.sin(t)
    return x * math.sin(t) + y * math.cos(t)

turn = pie.lift(turn_xy, pie.Scalar)
add_deg = pie.scalar(0, out='add_deg')  # add, then rotate
rot_deg = pie.scalar(0, out='rot_deg')  # rotate, then add
# The columns (2, 3) and (-1, 2), each turned by rot_deg, added tip to tail
m = [[turn(rot_deg, 2, 3, 'x'), turn(rot_deg, -1, 2, 'x')], [turn(rot_deg, 2, 3, 'y'), turn(rot_deg, -1, 2, 'y')]]
arrow0 = pie.la_weighted_sum(m, [1, 1], out='arrow0', hidden=True)
# Their sum (1, 5), turned by add_deg
arrow_out = pie.la_vec2d(turn(add_deg, 1, 5, 'x'), turn(add_deg, 1, 5, 'y'), out='arrowOut', stroke=AMBER)
```

Add then rotate ends up here.

```python-editor collapsed
# rotate
pie.translate_scalar_to(add_deg, 45, animate=True)
```

```python-editor collapsed
# ends up here
c, s = math.cos(math.radians(45)), math.sin(math.radians(45))
pie.point(c - 5 * s, s + 5 * c, out='p')
pie.text('Output vector after rotation', -4, 5, 14, 3, -1, out='ptb')
```

Rotate and then add ends up at the same point.

```python-editor collapsed
# rotate
pie.hide(arrow_out)
pie.translate_scalar_to(rot_deg, 45, animate=True)
```

```python-editor collapsed
# add
pie.show(arrow0)
```

---

### 0.2. Scale-then-rotate = Rotate-then-scale

Now let's see linearity in action for scaling:

```python-editor collapsed
import math

pie.clear()

# (s·x, s·y) turned by deg degrees about the origin; axis picks the coordinate
def turn_scaled_xy(deg, s, x, y, axis):
    t = math.radians(deg)
    if axis == 'x':
        return s * (x * math.cos(t) - y * math.sin(t))
    return s * (x * math.sin(t) + y * math.cos(t))

turn_scaled = pie.lift(turn_scaled_xy, pie.Scalar)
scale1 = pie.scalar(1, out='scale1')  # scale, then rotate
deg1 = pie.scalar(0, out='deg1')
deg2 = pie.scalar(0, out='deg2')      # rotate, then scale
scale2 = pie.scalar(1, out='scale2')
vin = pie.la_vec2d(turn_scaled(deg2, 1, 2, 3, 'x'), turn_scaled(deg2, 1, 2, 3, 'y'), out='vin')
vin_scaled = pie.la_vec2d(turn_scaled(deg1, scale1, 2, 3, 'x'), turn_scaled(deg1, scale1, 2, 3, 'y'), out='vin_scaled')
```

- Scaling a rotated vector is the same as rotating the scaled vector. In other words:
$$\underbrace{R(\alpha v)}_{\text{scale, then rotate}} = \underbrace{\alpha R(v)}_{\text{rotate, then scale}}$$

- Scale then rotate ends up here.

```python-editor collapsed
# scale
pie.translate_scalar_to(scale1, 1.5, animate=True)
```

```python-editor collapsed
# rotate
pie.translate_scalar_to(deg1, 45, animate=True)
```

```python-editor collapsed
# ends up here
c, s = math.cos(math.radians(45)), math.sin(math.radians(45))
pie.point(1.5 * (2 * c - 3 * s), 1.5 * (2 * s + 3 * c), out='copy')
```

- Rotate then scale also ends up at the same point

```python-editor collapsed
# rotate
pie.hide(vin_scaled)
pie.translate_scalar_to(deg2, 45, animate=True)
```

```python-editor collapsed
# scale
vout = pie.la_scale_vec2d(vin, scale2, out='vout')
pie.translate_scalar_to(scale2, 1.5, animate=True)
```


---

These two properties establish that rotations are linear transformations. Thus we can represent any rotation as a matrix. That is $R(v) = Rv$ where $R$ is a matrix and $v$ is the vector to be rotated.

---

## 1. Rotation preserves length and angle between vectors

Also note that a rotation preserves the angles between two vectors. In other words, the dot product of two rotated vectors is the same as the dot product of the original vectors:

$$\begin{aligned}
\textcolor{#0d9488}{R}\textcolor{#1d4ed8}{v} \cdot \textcolor{#0d9488}{R}\textcolor{#be185d}{w} &= \textcolor{#1d4ed8}{v} \cdot \textcolor{#be185d}{w} \\
\Rightarrow (\textcolor{#0d9488}{R}\textcolor{#1d4ed8}{v})^T \textcolor{#0d9488}{R}\textcolor{#be185d}{w} &= \textcolor{#1d4ed8}{v}^T \textcolor{#be185d}{w} \\
\Rightarrow \textcolor{#1d4ed8}{v}^T \textcolor{#0d9488}{R}^T \textcolor{#0d9488}{R} \textcolor{#be185d}{w} &= \textcolor{#1d4ed8}{v}^T \textcolor{#be185d}{w}
\end{aligned}$$

This implies that $R^TR = I$ where $I$ is the identity matrix. Thus, the inverse of a rotation matrix is its transpose. It also reveals one more fact:

> The columns of a rotation matrix are orthonormal.

It is important to understand how rotation transforms space. The visual aid below will help with it:

- Define angle of rotation.

```python-editor collapsed
import math

pie.clear()
GRID = '#a1a1aa'
theta = pie.scalar(0, out='theta')
rot_matrix = pie.la_rotation_matrix(theta, out='rot_matrix')
angle_label = pie.lift(lambda t: f'theta = {round(t, 2):g} deg', pie.Text)
pie.text(angle_label(theta), 0, 6, out='angle_text')
pie.la_grid_transform(rot_matrix, out='grid', stroke=GRID)
```

- View how it transforms a grid.

- First and second basis vectors.

```python-editor collapsed
cos_t = pie.lift(lambda t: math.cos(math.radians(t)), pie.Scalar)(theta)
sin_t = pie.lift(lambda t: math.sin(math.radians(t)), pie.Scalar)(theta)
neg_sin_t = pie.lift(lambda t: -math.sin(math.radians(t)), pie.Scalar)(theta)
pie.la_vec2d(cos_t, sin_t, 0, 0, out='e1_vec')
pie.la_vec2d(neg_sin_t, cos_t, 0, 0, out='e2_vec')
```

- Animate theta

```python-editor collapsed
pie.translate_scalar_to(theta, 90, animate=True)
```

Note that all the above arguments are valid for rotations in any dimension and basis.

---

[2D rotations →](/series/rotations/2d_rotations)
