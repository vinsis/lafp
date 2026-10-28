---
title: 2. 3D rotation matrices
description: Why 3D rotations do not commute, intrinsic and extrinsic rotations, and Euler angles, with Python examples using scipy.
canvas: left
sidebar: _series.md
---

# 2. 3D rotation matrices

Rotations in 3D space are more complex than in 2D space. In 2D space, we can describe a rotation with just one angle (assuming center of rotation is the origin). In 3D space, there are many ways to describe a rotation but they can roughly be categorized into two types:

- rotations around the axes (Davenport rotations, Euler angles)
- axis-angle representation (Euler-Rodrigues formula, quaternions)

Let's start with rotations around fixed coordinate axes since they are simplest to define and other rotations can be defined as a composition of these simpler rotations.

> Rotations in 3D introduce a new concept: the axis of rotation. A common way is to describe any rotation as a composition of rotations about the x-, y- and z- axes. 

---

## 2.1 3D Rotations are NOT commutative

Using the same logic used in 2D rotations above, the rotation matrices for rotations about the x-, y- and z-axes by an angle $\theta$ are:

- Around x-axis: $R_x(\theta) = \begin{bmatrix} 1 & 0 & 0 \\ 0 & \textcolor{#b45309}{\cos\theta} & \textcolor{#b45309}{-\sin\theta} \\ 0 & \textcolor{#b45309}{\sin\theta} & \textcolor{#b45309}{\cos\theta} \end{bmatrix}$
- Around y-axis: $R_y(\theta) = \begin{bmatrix} \textcolor{#b45309}{\cos\theta} & 0 & \textcolor{#b45309}{\sin\theta} \\ 0 & 1 & 0 \\ \textcolor{#b45309}{-\sin\theta} & 0 & \textcolor{#b45309}{\cos\theta} \end{bmatrix}$
- Around z-axis: $R_z(\theta) = \begin{bmatrix} \textcolor{#b45309}{\cos\theta} & \textcolor{#b45309}{-\sin\theta} & 0 \\ \textcolor{#b45309}{\sin\theta} & \textcolor{#b45309}{\cos\theta} & 0 \\ 0 & 0 & 1 \end{bmatrix}$

> Rotations in 2D commute but in any higher dimension they don't commute.

Rotating about the x-axis and then the y-axis gives a different result than rotating about the y-axis and then the x-axis. This is visualized below:

```python-editor collapsed
pie.clear()
pie.scalar(0, out='gridOpacity')
# Rotation angles in degrees
alpha1 = pie.scalar(0, out='alpha1')
beta1 = pie.scalar(0, out='beta1')
alpha2 = pie.scalar(0, out='alpha2')
beta2 = pie.scalar(0, out='beta2')
ra1 = pie.la_rotation_matrix3d_x(alpha1, out='ra1')
rb1 = pie.la_rotation_matrix3d_y(beta1, out='rb1')
ra2 = pie.la_rotation_matrix3d_x(alpha2, out='ra2')
rb2 = pie.la_rotation_matrix3d_y(beta2, out='rb2')
# Left cube: R_x, then R_y. Right cube: R_y, then R_x
r1 = pie.la_matmul(rb1, ra1, out='r1')
r2 = pie.la_matmul(ra2, rb2, out='r2')

origin1 = pie.point(-3, 0, out='origin1', hidden=True)
pie.la_ortho_axes(origin1, 1, out='axes1')
cube1 = pie.la_cube_array(out='cube1')
y_cube1 = pie.la_matmul(r1, cube1, out='y_cube1')
pie.la_cube_from_array(y_cube1, origin1, out='cube1_rotated')

origin2 = pie.point(3, 0, out='origin2', hidden=True)
pie.la_ortho_axes(origin2, 1, out='axes2')
cube2 = pie.la_cube_array(out='cube2')
y_cube2 = pie.la_matmul(r2, cube2, out='y_cube2')
pie.la_cube_from_array(y_cube2, origin2, out='cube2_rotated')

pie.text('Rₓ then Rᵧ', -3, 3, 14, out='tbox_0')
pie.text('Rᵧ then Rₓ', 3, 3, 14, out='tbox_1')
```

- Set up two cubes

Rotate the left cube first: $R_x$ then $R_y$:
- Rotate the left cube by 60 degrees about x-axis.

```python-editor collapsed
pie.translate_scalar_to(alpha1, 60, animate=True)
```

- Then rotate it by 30 degrees about y-axis.

```python-editor collapsed
pie.translate_scalar_to(beta1, 30, animate=True)
```

Rotate the right cube next: $R_y$ then $R_x$:
- Then rotate it by 30 degrees about y-axis.

```python-editor collapsed
pie.translate_scalar_to(beta2, 30, animate=True)
```

- Rotate the left cube by 60 degrees about x-axis.

```python-editor collapsed
pie.translate_scalar_to(alpha2, 60, animate=True)
```

It is clear that they end up in different orientations.

---

## 2.2 Intrinsic and extrinsic rotations

In 3D space, we can rotate a vector about the x-axis, y-axis or z-axis. These axes are fixed and such rotations are called extrinsic rotations. Now imagine that a rotation also rotates the axes. Eg consider a rotation about z-axis followed by x-axis. Rotating about the z-axis also rotates the x and y-axes. Then the second rotation is with respect to the rotated x-axis. 

#### An example
Imagine the x-, y- and z-axes attached to an aircraft. These axes are initially aligned with the fixed axes. When the aircraft rotates about z-axis, the x- and y-axes attached to the aircraft also rotate. The next rotation can be described with respect to rotated x-axis. These rotations are called intrinsic rotations. Note that the aircraft continue to point in the (intrinsic) x-axis direction after the rotation as well. 

We want to find the connection between intrinsic rotations and extrinsic rotations.

These two kinds of rotations are just a special case of change of basis. An intrinsic rotation is a change of basis followed by a rotation. [Using our knowledge of change of basis](/la/7_linear_transformations), we can map an intrinsic rotation to an extrinsic rotation. First, let's see how the same set of rotations is described using intrinsic and extrinsic rotations.

We rotate a vector $\textcolor{#1d4ed8}{v} = \begin{bmatrix} \cos(\pi/6) \\ \sin(\pi/6) \\ 0 \end{bmatrix}$ in two different ways.

---

### 2.2.1 Extrinsic rotations

```python-editor collapsed
import math

pie.clear()
pie.scalar(90, out='unit')
pie.scalar(0, out='gridOpacity')
GRAY, DARK, PINK, AMBER = '#71717a', '#27272a', '#be185d', '#b45309'
p0 = pie.point(0, 0, out='p0', hidden=True)
xaxisp1 = pie.point(-10, 0, out='xaxisp1', hidden=True)
xaxisp2 = pie.point(10, 0, out='xaxisp2', hidden=True)
yaxisp1 = pie.point(0, -10, out='yaxisp1', hidden=True)
yaxisp2 = pie.point(0, 10, out='yaxisp2', hidden=True)
pie.line(xaxisp1, xaxisp2, out='xaxis', stroke=GRAY)
pie.line(yaxisp1, yaxisp2, out='yaxis', stroke=GRAY)
pie.circle(p0, 1, out='circ', stroke=GRAY)

th = math.pi / 6
vx0, vy0 = math.cos(th), math.sin(th)
# Angles in radians: az about the z-axis, then ax about the x-axis
az = pie.scalar(0, out='az')
ax = pie.scalar(0, out='ax')
pie.la_vec2d(vx0, vy0, out='vBase', stroke=DARK)

# v turned by az about the z-axis
mx = pie.lift(lambda az, x, y: x * math.cos(az) - y * math.sin(az), pie.Scalar)(az, vx0, vy0, out='mx')
my = pie.lift(lambda az, x, y: x * math.sin(az) + y * math.cos(az), pie.Scalar)(az, vx0, vy0, out='my')
pie.la_vec2d(mx, my, out='vMidE', stroke=PINK)
# then turned by ax about the x-axis: on the screen, its y shrinks by cos(ax)
fy_e = pie.lift(lambda my, ax: my * math.cos(ax), pie.Scalar)(my, ax, out='fyE')
pie.la_vec2d(mx, fy_e, out='vFinE', stroke=AMBER)
```

Image the screen as the 2D plane with x- and y-axes in the plane, and the z-axis pointing outwards perpendicular to the screen. 

In this view, a 3D vector $\begin{bmatrix} x \\ y \\ z \end{bmatrix}$ looks like a 2D vector $\begin{bmatrix} x \\ y \end{bmatrix}$. 

Thus the input vector $\textcolor{#1d4ed8}{v} = \begin{bmatrix} \cos(\pi/6) \\ \sin(\pi/6) \\ 0 \end{bmatrix}$ looks like this 2D vector.

- The vector is rotated by 30° about the z-axis. 
  - The rotation matrix for this transform is $\textcolor{#e11d48}{R_z(\pi/6)}$.

```python-editor collapsed
pie.translate_scalar_to(az, 0.5235988, animate=True)
```

- And then by 180° about the x-axis. 
  - The rotation matrix for this transform is $\textcolor{#b45309}{R_x(\pi)}$.

```python-editor collapsed
pie.translate_scalar_to(ax, 3.1415927, animate=True)
```

The final rotation matrix is $\textcolor{#b45309}{R_x(\pi)}\textcolor{#e11d48}{R_z(\pi/6)}$.

This composition of rotations and the final rotated vector can be described like so:

$$\begin{aligned} \textcolor{#b45309}{R_x(\pi)}\,\textcolor{#e11d48}{R_z(\pi/6)} &= \textcolor{#b45309}{\begin{bmatrix} 1 & 0 & 0 \\ 0 & -1 & 0 \\ 0 & 0 & -1 \end{bmatrix}} \textcolor{#e11d48}{\begin{bmatrix} \cos\frac{\pi}{6} & -\sin\frac{\pi}{6} & 0 \\ \sin\frac{\pi}{6} & \cos\frac{\pi}{6} & 0 \\ 0 & 0 & 1 \end{bmatrix}} \\ &= \begin{bmatrix} \cos\frac{\pi}{6} & -\sin\frac{\pi}{6} & 0 \\ -\sin\frac{\pi}{6} & -\cos\frac{\pi}{6} & 0 \\ 0 & 0 & -1 \end{bmatrix} \end{aligned}$$

$$\begin{aligned} v_{rotated} &= \textcolor{#b45309}{R_x(\pi)}\,\textcolor{#e11d48}{R_z(\pi/6)}\,\textcolor{#1d4ed8}{v} \\ &= \begin{bmatrix} \cos\frac{\pi}{6} & -\sin\frac{\pi}{6} & 0 \\ -\sin\frac{\pi}{6} & -\cos\frac{\pi}{6} & 0 \\ 0 & 0 & -1 \end{bmatrix} \textcolor{#1d4ed8}{\begin{bmatrix} \cos\frac{\pi}{6} \\ \sin\frac{\pi}{6} \\ 0 \end{bmatrix}} \\ &= \begin{bmatrix} \sin\frac{\pi}{6} \\ -\cos\frac{\pi}{6} \\ 0 \end{bmatrix} \end{aligned}$$

When viewed on the 2D plane, this is what it looks like. 

#### Python implementation using `scipy`
```python
from scipy.spatial.transform import Rotation

# lower case axis names imply extrinsic rotations
# r = rotation about z-axis by 30 degrees followed by rotation about x-axis by 180 degrees
r = Rotation.from_euler('zx', [30,180], degrees=True)
print(r.as_matrix())

'''
Output
- note that cos(30) ≈ 0.866 and sin(30) = 0.5
- the matrix is the same as what we just calculated above
'''
[[ 8.66025404e-01 -5.00000000e-01  0.00000000e+00]
 [-5.00000000e-01 -8.66025404e-01 -1.22464680e-16]
 [ 6.12323400e-17  1.06057524e-16 -1.00000000e+00]]
```

---

### 2.2.2 Intrinsic rotations

```python-editor collapsed
import math

pie.clear()
pie.scalar(90, out='unit')
pie.scalar(0, out='gridOpacity')
GRAY, DARK = '#71717a', '#27272a'
p0 = pie.point(0, 0, out='p0', hidden=True)
# Angles in degrees: rz about the z-axis, which turns the x- and y-axes and the vector together,
# then rx about the turned x-axis
rz = pie.scalar(0, out='rz')
rx = pie.scalar(0, out='rx')

# (x, y) turned by rz degrees about the origin
def turned(rz, x, y):
    t = math.radians(rz)
    return (x * math.cos(t) - y * math.sin(t), x * math.sin(t) + y * math.cos(t))

turn = pie.lift(turned, pie.Point)
pie.line(turn(rz, -10, 0, out='xaxisp1', hidden=True), turn(rz, 10, 0, out='xaxisp2', hidden=True), out='xaxis', stroke=GRAY)
pie.line(turn(rz, 0, -10, out='yaxisp1', hidden=True), turn(rz, 0, 10, out='yaxisp2', hidden=True), out='yaxis', stroke=GRAY)
pie.circle(p0, 1, out='circ', stroke=GRAY)

# v in the turned basis is (cos 30°, sin 30°); turning it by rx about the turned x-axis
# scales its y by cos(rx) on the screen
th = math.pi / 6
v_at = pie.lift(lambda rz, rx, th: turned(rz, math.cos(th), math.sin(th) * math.cos(math.radians(rx))), pie.Point)
v0 = v_at(rz, rx, th, out='v0', hidden=True)
pie.annotate_arrow(p0, v0, out='vin', stroke=DARK)
```

In this case, we have the same setup of the axes and the vector being rotated.

- The first rotation rotates not just the vector but also the x- and y-axes: rotate about z-axis

```python-editor collapsed
pie.translate_scalar_to(rz, 30, animate=True)
```

#### A key insight
The rotated vector still has the same coordinates in this new basis with rotated x- and y-axes. In other words, the vector is still $\textcolor{#1d4ed8}{\begin{bmatrix} \cos(\pi/6) \\ \sin(\pi/6) \\ 0 \end{bmatrix}}$ in the basis defined by the rotation matrix $\textcolor{#e11d48}{R_z(\pi/6)}$.

Now the second rotation is about the x-axis. In this case, the x-axis is also rotated.

- The second rotation about the x-axis ends up here. 

```python-editor collapsed
pie.translate_scalar_to(rx, 180, animate=True)
```

The coordinates of the vector in the new basis are $\textcolor{#b45309}{R_x(\pi)}\,\textcolor{#1d4ed8}{v}$. To get the coordinates of the vector in the original basis, we simply multiply the rotated vector by the basis matrix $\textcolor{#e11d48}{R_z(\pi/6)}$. Thus, the final rotation matrix is $\textcolor{#e11d48}{R_z(\pi/6)}\textcolor{#b45309}{R_x(\pi)}$.

Indeed you can verify that:

$$\begin{aligned} \textcolor{#e11d48}{R_z(\pi/6)}\,\textcolor{#b45309}{R_x(\pi)} &= \textcolor{#e11d48}{\begin{bmatrix} \cos\frac{\pi}{6} & -\sin\frac{\pi}{6} & 0 \\ \sin\frac{\pi}{6} & \cos\frac{\pi}{6} & 0 \\ 0 & 0 & 1 \end{bmatrix}} \textcolor{#b45309}{\begin{bmatrix} 1 & 0 & 0 \\ 0 & -1 & 0 \\ 0 & 0 & -1 \end{bmatrix}} \\ &= \begin{bmatrix} \cos\frac{\pi}{6} & \sin\frac{\pi}{6} & 0 \\ \sin\frac{\pi}{6} & -\cos\frac{\pi}{6} & 0 \\ 0 & 0 & -1 \end{bmatrix} \end{aligned}$$

$$\begin{aligned} v_{rotated} &= \textcolor{#e11d48}{R_z(\pi/6)}\,\textcolor{#b45309}{R_x(\pi)}\,\textcolor{#1d4ed8}{v} \\ &= \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix} \end{aligned}$$

#### A note about $\textcolor{#e11d48}{R_z(\pi/6)}\,\textcolor{#b45309}{R_x(\pi)}$
The matrix $\textcolor{#e11d48}{R_z(\pi/6)}\,\textcolor{#b45309}{R_x(\pi)}$ can also be interpreted as a composition of two rotations around the _fixed_ axes: a 180 degree rotation about the x-axis followed by a 30 degree rotation about the z-axis.

#### Python implementation using `scipy`
```python
from scipy.spatial.transform import Rotation

# upper case axis names imply intrinsic rotations
# r = _intrinsic_ rotation about z-axis by 30 degrees followed by rotation about x-axis by 180 degrees
r = Rotation.from_euler('ZX', [30,180], degrees=True)
print(r.as_matrix())

'''
Output
- note that cos(30) ≈ 0.866 and sin(30) = 0.5
- the matrix is the same as what we just calculated above
'''
[[ 8.66025404e-01  5.00000000e-01  6.12323400e-17]
 [ 5.00000000e-01 -8.66025404e-01 -1.06057524e-16]
 [ 0.00000000e+00  1.22464680e-16 -1.00000000e+00]]
```

---

## 2.3 Euler angles

Euler angles are an extension of the idea of intrinsic rotations. They involve three rotations about the (intrinsic) axes by three angles $\textcolor{#e11d48}{\phi}, \textcolor{#b45309}{\theta}, \psi$. The three axes of rotations have the format `axis 1 → (rotated) axis 2 → (twice rotated) axis 1` where each axis is one of the x-, y- or z-axes. There are 6 such combinations:

- $x\text{-}y'\text{-}x''$
- $y\text{-}x'\text{-}y''$
- $z\text{-}x'\text{-}z''$
- $x\text{-}z'\text{-}x''$
- $y\text{-}z'\text{-}y''$
- $z\text{-}y'\text{-}z''$

Each rotation not only rotates the vector but also the remaining two axes. The single and double ticks denote that these axes are intrinsic axes.

Now consider the rotation $z\text{-}x'\text{-}z''$ by angles $\textcolor{#e11d48}{\phi}, \textcolor{#b45309}{\theta}, \psi$. The corresponding rotation matrices are $\textcolor{#e11d48}{R_z(\phi)}, \textcolor{#b45309}{R_x(\theta)}, R_z(\psi)$. Using the same logic as above, we can consider the first rotation as a change of basis. The second and third rotations can also be considered change of bases. Note that after each change of basis, the vector coordinates in the new basis remain the same. Thus the coordinates of the (thrice rotated) vector in the original basis is $\textcolor{#e11d48}{R_z(\phi)}\,\textcolor{#b45309}{R_x(\theta)}\,R_z(\psi)\textcolor{#1d4ed8}{v}$.

#### Python implementation
```python
from scipy.spatial.transform import Rotation

# upper case axis names imply intrinsic rotations
# r = three 90 degree intrinsic rotations about x, z and x axes respectively
r = Rotation.from_euler('XZX', [90,90,90], degrees=True)
print(r.as_matrix())

'''
Output
'''
[[ 2.22044605e-16 -1.89526925e-16  1.00000000e+00]
 [ 1.89526925e-16 -1.00000000e+00 -1.89526925e-16]
 [ 1.00000000e+00  1.89526925e-16 -2.22044605e-16]]
```

---

### 2.3.1 Intrinsic to extrinsic rotations and vice versa

Note that the composition of rotations $\textcolor{#e11d48}{R_z(\phi)}\,\textcolor{#b45309}{R_x(\theta)}\,R_z(\psi)\textcolor{#1d4ed8}{v}$ can be interpreted in two different ways. 

1. Consider the rotations as intrinsic rotations, which we have already covered. 
2. Consider the rotations as extrinsic rotations. In this interpretation, all rotations occur around the fixed x-, y- and z-axes. The first rotation is about the z-axis by an angle $\psi$, the second rotation is about the new x-axis by an angle $\textcolor{#b45309}{\theta}$ and the third rotation is about the new z-axis by an angle $\textcolor{#e11d48}{\phi}$.

> Thus, an intrinsic rotation around the axes $x,y',z''$ by angles $\alpha, \beta, \gamma$ is equivalent to an extrinsic rotation around the axes $z,y,x$ by angles $\gamma, \beta, \alpha$.

---

[← 2D rotations](/series/rotations/2d_rotations)  ·  [Quaternions →](/series/rotations/quaternions)
