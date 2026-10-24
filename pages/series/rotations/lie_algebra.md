---
title: 6. Lie groups and Lie algebra
canvas: left
---

# 6. Lie groups and Lie algebra

We have already seen, but not formally acknowledged, that the set of all rotations in an $n$-dimensional space forms a group. This group is called the _special orthogonal group_ and is denoted by $SO(n)$.

#### Why is it a group?
Let $R_1, R_2, R_3 \in SO(n)$ be rotation matrices. Then:

- **Closure**: the product of any two rotation matrices is also a rotation matrix, i.e. $R_1 R_2 \in SO(n)$.
- **Associativity**: matrix multiplication (and hence composition of rotations) is associative, i.e. $(R_1 R_2) R_3 = R_1 (R_2 R_3)$.
- **Identity**: the identity matrix $I$ is a rotation matrix, and $R_1 I = I R_1 = R_1$.
- **Inverse**: for every rotation matrix $R_1$ there is an inverse rotation matrix $R_1^{-1} = R_1^T$, such that $R_1 R_1^{-1} = R_1^{-1} R_1 = I$.

Another interesting property about this set of rotations is that one can find two elements that are arbitrarily close to each other. You can imagine the elements of this set as points in a space. The points are so close to each other that they form a surface (or a manifold). 

Now we will move on this smooth manifold, which is also a group, and try to gain some insights from it. A group which is also a smooth manifold is called a _Lie group_. Thus the set of all rotations in an $n$-dimensional space is a Lie group.

---

## 6.1 First approach - taking a small step on this manifold

Say you're moving along a smooth curve $\gamma(t)$ in the rotation manifold. At time $t = 0$, you are at point corresponding to the identity matrix $I$. You take a small step in the direction of a matrix $R$. You reach a point $I + \epsilon R$ where $\epsilon$ is a small number. Since $I + \epsilon R$ is a rotation matrix, we can see that:

$$\begin{aligned}
& (I + \textcolor{#be185d}{\epsilon} \textcolor{#1d4ed8}{R})^T(I + \textcolor{#be185d}{\epsilon} \textcolor{#1d4ed8}{R}) = I \\
\Rightarrow \ & I + \textcolor{#be185d}{\epsilon} (\textcolor{#1d4ed8}{R} + \textcolor{#1d4ed8}{R}^T) + \underbrace{\textcolor{#be185d}{\epsilon}^2 \textcolor{#1d4ed8}{R}^T\textcolor{#1d4ed8}{R}}_{\approx \, 0} = I \\
\Rightarrow \ & \textcolor{#1d4ed8}{R} + \textcolor{#1d4ed8}{R}^T = 0
\end{aligned}$$

where the last step drops the $\epsilon^2$ term since $\epsilon$ is small.

Thus, any small step $R$ on this manifold should satisfy $R^T = -R$. In other words, $R$ is skew-symmetric.

### 6.1.1 What exactly is $R$ here:
$R$ can be seen as the velocity at point $I$ as one moves along the curve $\gamma(t)$. 

$$\begin{aligned}
\gamma(\textcolor{#be185d}{\epsilon}) &\approx \gamma(0) + \textcolor{#be185d}{\epsilon} \, \gamma'(0) \\
&= I + \textcolor{#be185d}{\epsilon} \textcolor{#1d4ed8}{R}, \qquad \textcolor{#1d4ed8}{R} := \gamma'(0)
\end{aligned}$$

#### Relooking at 2D and 3D rotation matrices

Recall the familiar rotation matrices from earlier chapters. In 2D, a rotation by angle $\theta$ is:

$$R(\theta) = \begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}$$

In 3D, rotations by angle $\alpha$ about the $x$-axis, $\beta$ about the $y$-axis, and $\gamma$ about the $z$-axis are:

$$R_x(\alpha) = \begin{bmatrix} 1 & 0 & 0 \\ 0 & \cos\alpha & -\sin\alpha \\ 0 & \sin\alpha & \cos\alpha \end{bmatrix}$$

$$R_y(\beta) = \begin{bmatrix} \cos\beta & 0 & \sin\beta \\ 0 & 1 & 0 \\ -\sin\beta & 0 & \cos\beta \end{bmatrix}$$

$$R_z(\gamma) = \begin{bmatrix} \cos\gamma & -\sin\gamma & 0 \\ \sin\gamma & \cos\gamma & 0 \\ 0 & 0 & 1 \end{bmatrix}$$

None of these matrices are themselves skew-symmetric, but $R(0) = R_x(0) = R_y(0) = R_z(0) = I$, so each one sits at the identity when its angle is $0$. If we differentiate any of them with respect to its angle and evaluate at that point, we get exactly the kind of "small step direction" $R$ from §6.1:

$$\left.\frac{dR}{d\theta}\right|_{\theta = 0} = \begin{bmatrix} 0 & \textcolor{#047857}{-1} \\ \textcolor{#047857}{1} & 0 \end{bmatrix}$$

$$\left.\frac{dR_z}{d\gamma}\right|_{\gamma = 0} = \begin{bmatrix} 0 & \textcolor{#047857}{-1} & 0 \\ \textcolor{#047857}{1} & 0 & 0 \\ 0 & 0 & 0 \end{bmatrix}$$

Notice the mirrored pair of entries at position $(1,2)$ and $(2,1)$: $\textcolor{#047857}{-1}$ sits opposite $\textcolor{#047857}{1}$ across the diagonal, so swapping the two indices negates the value, i.e. $a_{ij} = -a_{ji}$. That is exactly skew-symmetry, matching what we found in §6.1.

This is the bridge between the abstract argument above and the concrete rotation matrices we already know: the skew-symmetric matrices are the *generators* of rotations, obtained by differentiating the rotation matrices at the identity.

### 6.1.2 Action of skew-symmetric matrices

Every $2 \times 2$ skew-symmetric matrix is a scalar multiple of the generator we just found:

$$\theta S = \theta \begin{bmatrix} 0 & \textcolor{#047857}{-1} \\ \textcolor{#047857}{1} & 0 \end{bmatrix} = \begin{bmatrix} 0 & \textcolor{#047857}{-\theta} \\ \textcolor{#047857}{\theta} & 0 \end{bmatrix}, \qquad S := \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$$

Now let's see what applying $\theta S$ once, does to a whole ring of points at once.

```python-editor collapsed
pie.clear()
pie.scalar(100, out='unit')
AMBER = '#b45309'
theta = pie.scalar(2, out='theta')
neg_theta = pie.lift(lambda t: -t, pie.Scalar)(theta, out='neg_theta')
zero = pie.scalar(0, out='zero')
# θS = [[0, −θ], [θ, 0]], and the identity for the input ring
matrix = [[zero, neg_theta], [theta, zero]]
identity = [[1, 0], [0, 1]]
npoints = 10
fanin = pie.la_circle_transform(identity, npoints, out='fanin')
fanout = pie.la_circle_transform(matrix, npoints, out='fanout')
theta_text = pie.lift(lambda t: f'theta = {round(t, 2):g}', pie.Text)(theta, out='theta_text')
theta_box = pie.text(theta_text, 0, 3, 14, 2.6, -1, out='theta_box')
pie.text('This is theta*S applied once, a scaled quarter turn (not a rotation)', 0, -3, 12, 3.6, -1, out='note_box')
```

- Applying the step matrix $\theta S$ once maps each point on the ring to a new one.

```python-editor collapsed
pie.set_stroke(theta_box, AMBER)
```

- Note that for any input point, the output point is perpendicular to it. 
  - First input-output pair
  - Second input-output pair
  - Third input-output pair
- Changing $\theta$ only changes the length of the output vector, not its direction. It continues to remain perpendicular to the input vector.
- Set $theta = 1.5$

```python-editor collapsed
pie.translate_scalar_to(theta, 1.5, animate=True)
```

- Set $theta = 0.5$

```python-editor collapsed
pie.translate_scalar_to(theta, 0.5, animate=True)
```

- Set $theta = 0.1$

```python-editor collapsed
pie.translate_scalar_to(theta, 0.1, animate=True)
```

- Set $theta = 2$

```python-editor collapsed
pie.translate_scalar_to(theta, 2, animate=True)
```

```python-editor collapsed
import numpy as np

pie.clear()
pie.scalar(100, out='unit')
GRAY, BLUE, GREEN = '#71717a', '#1d4ed8', '#047857'
p0 = pie.point(0, 0, out='p0', hidden=True)
r = 1
nn = 12
# nn points on the circle of radius r, and the step 0.55·S·p each one would take
angles = np.radians(np.linspace(0, 360 - 360 / nn, nn))
px = (r * np.cos(angles)).tolist()
py = (r * np.sin(angles)).tolist()
sc = 0.55
txs = [-sc * y for y in py]
tys = [sc * x for x in px]
```

> Geometrically, a skew-symmetric step pushes every point in a direction perpendicular to its position vector. 

On the unit circle, take a ring of points and draw the step each one would take.

```python-editor collapsed
pie.circle(p0, r, out='circ', stroke=GRAY)
```

```python-editor collapsed
pie.point(px, py, out='pts', fill=BLUE)
```

```python-editor collapsed
pie.la_vec2d(txs, tys, px, py, out='tangents', stroke=GREEN)
```

Every arrow lands along the tangent, so a small step never leaves the circle.

---

## 6.2 Lie algebra for 2D Rotations

In 2D, any skew-symmetric matrix can be written as a scalar multiple of a single generator matrix $S$:

$$\begin{aligned}
\begin{bmatrix} 0 & \textcolor{#047857}{-\theta} \\ \textcolor{#047857}{\theta} & 0 \end{bmatrix} &= \theta \begin{bmatrix} 0 & \textcolor{#047857}{-1} \\ \textcolor{#047857}{1} & 0 \end{bmatrix} \\
&= \theta S
\end{aligned}$$

$$S = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$$

Now, a small step in the direction of this matrix can be represented as:

$$\underbrace{I + \frac{1}{N} \begin{bmatrix} 0 & \textcolor{#047857}{-\theta} \\ \textcolor{#047857}{\theta} & 0 \end{bmatrix}}_{R\left(\frac{\theta}{N}\right)} = I + \frac{\theta S}{N}$$

where $N$ is a large number. In §6.1 we saw that this is a rotation matrix, let's call it $R\left(\frac{\theta}{N}\right)$.

A rotation by angle $\theta$ can be seen as a composition of $N$ rotations of angle $\frac{\theta}{N}$ each:

$$R(\theta) = R\left(\frac{\theta}{N}\right)^{N} \approx \left(I + \frac{\theta S}{N}\right)^{N}$$

As $N$ gets large, this expression can be approximated to:

$$R(\theta) = \lim_{N \to \infty} \left(I + \frac{\theta S}{N}\right)^{N} = e^{\theta S}$$

Now let's see what happens as we compute higher powers of $S$:

$$\begin{aligned}
S^2 &= \begin{bmatrix} 0 & \textcolor{#047857}{-1} \\ \textcolor{#047857}{1} & 0 \end{bmatrix}\begin{bmatrix} 0 & \textcolor{#047857}{-1} \\ \textcolor{#047857}{1} & 0 \end{bmatrix} \\
&= \begin{bmatrix} -1 & 0 \\ 0 & -1 \end{bmatrix} \\
&= -I
\end{aligned}$$

$$\begin{aligned}
S^3 &= S^2 S \\
&= -IS \\
&= -S
\end{aligned}$$

Since $S^2 = -I$, the powers of $S$ cycle with period 4, repeating the pattern $I, S, -I, -S$ forever ($S^4 = I$, $S^5 = S$, and so on). Grouping the even powers and odd powers of $\theta S$ in the exponential series therefore separates it into the Taylor series for $\cos\theta$ and $\sin\theta$:

$$\begin{aligned}
e^{\theta S} &= I + \theta S + \frac{\theta^2 S^2}{2!} + \frac{\theta^3 S^3}{3!} + \frac{\theta^4 S^4}{4!} + \ldots \\
&= \underbrace{\left(1 - \frac{\theta^2}{2!} + \frac{\theta^4}{4!} - \ldots\right)}_{\cos\theta} I + \underbrace{\left(\theta - \frac{\theta^3}{3!} + \frac{\theta^5}{5!} - \ldots\right)}_{\sin\theta} S \\
&= (\cos\theta) I + (\sin\theta) S \\
&= \begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}
\end{aligned}$$

This is the matrix representation of a 2D rotation by an angle $\theta$. The key insight here is: 

> A rotation matrix is an exponential of a skew-symmetric matrix

The outcome is that a finite rotation can be seen as taking a large number of extremely small steps on the Lie group of 2D rotations. Let's see it in action:

```python-editor collapsed
import math
import numpy as np

pie.clear()
pie.scalar(150, out='unit')
GRAY, BLUE, GREEN, PINK = '#71717a', '#1d4ed8', '#047857', '#be185d'
THETA_DEG = 120
nsteps = pie.scalar(6, out='nsteps')

# (I + θS/N)^k applied to (1, 0), for k = 0..N: radius (1 + (θ/N)²)^(k/2), angle k·atan(θ/N)
def euler_steps(n, theta_deg):
    n = max(1, round(n))
    step = math.radians(theta_deg) / n
    k = np.arange(n + 1)
    radius = (1 + step ** 2) ** (k / 2)
    angle = k * math.atan(step)
    return np.stack([radius * np.cos(angle), radius * np.sin(angle)], axis=1)

origin = pie.point(0, 0, out='origin')
pie.circle(origin, 1, out='circ', stroke=GRAY)
pie.point(1, 0, out='startpt', fill=GREEN)
pie.arc(origin, 1, 0, THETA_DEG, out='arc', stroke=PINK)
t = math.radians(THETA_DEG)
pie.point(math.cos(t), math.sin(t), out='ptarget', fill=PINK)
pie.text('Pink: the true rotation. Blue: N Euler steps, each landing just outside the circle. More steps hug the arc.', 0, 2, 14, 4, -1, out='desc_box')
```

We can watch this convergence directly. On the unit circle, start from the point at (1, 0). The true rotation carries it along an arc to its final position.

Each Euler step $I + \frac{\theta S}{N}$ instead lands slightly outside the circle, so a run of $N$ steps traces a string of points that spirals outward and lags behind.

```python-editor collapsed
pie.lift(euler_steps, pie.Array[pie.Point])(nsteps, THETA_DEG, out='spts', fill=BLUE)
```

a readout of $N$ shows the current step count.

```python-editor collapsed
pie.text(pie.lift(lambda n: f'N = {round(n)}', pie.Text)(nsteps), 0, -1.6, 16, out='tbox0')
```

- Increase the number of steps `nsteps = 10` and you get a better approximation to the rotation.

```python-editor collapsed
pie.scalar(10, out='nsteps')
```

- `nsteps = 15`

```python-editor collapsed
pie.scalar(15, out='nsteps')
```

- `nsteps = 20`

```python-editor collapsed
pie.scalar(20, out='nsteps')
```

- `nsteps = 30`

```python-editor collapsed
pie.scalar(30, out='nsteps')
```

#### Python implementation
```python
import numpy as np
from scipy.linalg import expm, logm
angle = np.pi/4
base_skew = np.array([[0, -1], [1, 0]])
skew = base_skew * angle
# same as np.array([[np.cos(angle), -np.sin(angle)], [np.sin(angle), np.cos(angle)]])
print(expm(skew))

'''
Output:
array([[ 0.70710678, -0.70710678],
       [ 0.70710678,  0.70710678]])
'''

# it can also be written as cos(angle) * I + sin(angle) * skew_symmetric_matrix
R = np.cos(angle) * np.eye(2) + np.sin(angle) * base_skew
print(R)

'''
Output:
array([[ 0.70710678, -0.70710678],
       [ 0.70710678,  0.70710678]])
'''

# logm takes a matrix and returns the skew-symmetric matrix
print(logm(R))

'''
Output: (equal to angle * base_skew up to floating point errors)
array([[-2.84558859e-16, -7.85398163e-01],
       [ 7.85398163e-01, -4.85080479e-17]])
'''
```

---

## 6.3 Second approach - differentiating the constraint $R^TR = I$

Imagine you are moving along a curve $\gamma(t)$ on the Lie group of rotations, just as in §6.1. At time $t = 0$, you are at the identity matrix. At any given time, you are at a point given by the rotation matrix $R(t) := \gamma(t)$. 

The constraint that you are always on the Lie group of rotations is given by $R(t)^TR(t) = I$. For simplicity, we write $R(t) = R$. Since $R^TR = I$, we can differentiate this equation with respect to $t$:

$$\begin{aligned}
\frac{d}{dt}(R^TR) &= 0 \\
\Rightarrow \frac{dR^T}{dt} R + R^T \frac{dR}{dt} &= 0 \\
\Rightarrow \dot{R}^T R + R^T \dot{R} &= 0 \\
\Rightarrow (R^T \dot{R})^T + R^T \dot{R} &= 0 \\
\Rightarrow R^T \dot{R} &= -(R^T \dot{R})^T
\end{aligned}$$

where $\dot{R} = \frac{dR}{dt}$. The last line says that $R^T \dot{R}$ is a skew-symmetric matrix $S$.

Thus we have:

$$\begin{aligned}
R^T \dot{R} &= S \\
\Rightarrow \dot{R} &= RS \\
\Rightarrow \frac{dR}{dt} &= RS
\end{aligned}$$

This is a differential equation with the initial condition of $R(0) = I$. The solution to this equation is: $R = e^S$.

We arrived at the same conclusion as before, that any element of the Lie group of rotations can be represented as an exponential of a skew-symmetric matrix.

---

## 6.4 Lie algebra for 3D Rotations

Now we look at how to create general skew-symmetric matrices for 3D rotations. We can write any skew-symmetric matrix as:

$$\begin{aligned}
S &= \begin{bmatrix} 0 & -z & y \\ z & 0 & -x \\ -y & x & 0 \end{bmatrix} \\
&= \textcolor{#1d4ed8}{x} \underbrace{\begin{bmatrix} 0 & 0 & 0 \\ 0 & 0 & -1 \\ 0 & 1 & 0 \end{bmatrix}}_{S_x} + \textcolor{#be185d}{y} \underbrace{\begin{bmatrix} 0 & 0 & 1 \\ 0 & 0 & 0 \\ -1 & 0 & 0 \end{bmatrix}}_{S_y} + \textcolor{#047857}{z} \underbrace{\begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 0 \end{bmatrix}}_{S_z} \\
&= \textcolor{#1d4ed8}{x}S_x + \textcolor{#be185d}{y}S_y + \textcolor{#047857}{z}S_z
\end{aligned}$$

Here $S_x, S_y, S_z$ can be considered the basis vectors for the Lie algebra of 3D rotations. It can be shown that it is isomorphic to the $\mathbb{R}^3$ vector space. In other words

> An element of the 3D vector space can be converted into a skew-symmetric matrix which can be exponentiated to get a rotation matrix.

$$\begin{bmatrix} \textcolor{#1d4ed8}{x} & \textcolor{#be185d}{y} & \textcolor{#047857}{z} \end{bmatrix} \xrightarrow{\text{hat map}} \begin{bmatrix} 0 & -\textcolor{#047857}{z} & \textcolor{#be185d}{y} \\ \textcolor{#047857}{z} & 0 & -\textcolor{#1d4ed8}{x} \\ -\textcolor{#be185d}{y} & \textcolor{#1d4ed8}{x} & 0 \end{bmatrix} \xrightarrow{\text{exponential map}} \text{Rotation matrix}$$

#### How are $\textcolor{#1d4ed8}{x}$, $\textcolor{#be185d}{y}$ and $\textcolor{#047857}{z}$ related to the rotation matrix

Write $(\textcolor{#1d4ed8}{x}, \textcolor{#be185d}{y}, \textcolor{#047857}{z}) = \theta \, \hat{n}$, where:

$$\theta = \sqrt{\textcolor{#1d4ed8}{x}^2 + \textcolor{#be185d}{y}^2 + \textcolor{#047857}{z}^2}, \qquad \hat{n} = \frac{1}{\theta}\begin{bmatrix} \textcolor{#1d4ed8}{x} \\ \textcolor{#be185d}{y} \\ \textcolor{#047857}{z} \end{bmatrix}$$

Then $\theta$ is the angle of rotation, and $\hat{n}$ is the (unit) axis of rotation, by the right-hand rule. This is the 3D analogue of §6.2: there, $\theta$ was directly the coefficient of the fixed generator $S$. Here, the magnitude of $(\textcolor{#1d4ed8}{x}, \textcolor{#be185d}{y}, \textcolor{#047857}{z})$ plays that role, while its direction additionally picks out the axis, something 2D didn't need since it only had one possible axis (perpendicular to the plane).

Exponentiating the skew-symmetric matrix gives a closed form known as Rodrigues' rotation formula:

$$e^{\theta [\hat{n}]_\times} = I + \sin\theta \, [\hat{n}]_\times + (1 - \cos\theta)[\hat{n}]_\times^2$$

where $[\hat{n}]_\times$ denotes the hat map (skew-symmetric matrix) of $\hat{n}$.

The three stages above map: Vector space → Lie algebra → Lie manifold.

#### Python implementation
```python
def hat_map(x:float, y:float, z:float) -> np.ndarray:
    return np.array([[0, -z, y], [z, 0, -x], [-y, x, 0]])

def exponential_map(skew_symmatric_matrix:np.ndarray) -> np.ndarray:
    return expm(skew_symmatric_matrix)

# a very small rotation around the x-axis
print(exponential_map(hat_map(0.01, 0, 0)))

'''
Output:
[[ 1.          0.          0.        ]
 [ 0.          0.99995    -0.00999983]
 [ 0.          0.00999983  0.99995   ]]
'''
```

There is a lot more to be said about Lie algebras but it may require another series of articles.

---

[← Geometric algebra](/series/rotations/geometric_algebra)
