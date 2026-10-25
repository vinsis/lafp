---
title: 9. Bezier curves
canvas: left
---

# 9. Bezier curves

<details>
<summary>Review</summary>

A polynomial is a vector: the polynomial $a_0 + a_1t + a_2t^2 + ... + a_nt^n$ is the vector $[a_0, a_1, a_2, ..., a_n]$, and scaling/adding polynomials is exactly scaling/adding vectors.

</details>

In this chapter we put polynomial vectors to work and build one of the most widely used tools in computer graphics - the Bezier curve.

---

## 9.1 A general guideline to describe curves

```python-editor collapsed
import numpy as np

pie.clear()
pie.scalar(50, out='unit')
TEAL, PINK, GOLD = '#0d9488', '#be185d', '#ca8a04'

# Points (x(s), y(s)) for s from start to end
def curve_points(x_of, y_of, start, end, n=200):
    s = np.linspace(start, end, n)
    return np.stack([x_of(s), y_of(s)], axis=1)

curve = pie.lift(curve_points, pie.Array[pie.Point])
pie.polyline(curve(lambda s: s, np.sin, -8, 8, hidden=True), out='psin', stroke=TEAL)
pie.text('y = sin x', -5, 1.8, 12, out='lbl_sin', stroke=TEAL)
pie.polyline(curve(lambda s: s, lambda s: s * np.sin(2 * s), -8, 8, hidden=True), out='pxsin', stroke=PINK)
pie.text('y = x·sin 2x', 4.6, 3.2, 12, out='lbl_xsin', stroke=PINK)
pie.polynomial([0, -2, 0, 0.5], out='fcurve', stroke=GOLD)
pie.text('y = 0.5x³ − 2x', -3.7, -4.5, 12, out='lbl_poly', stroke=GOLD)
```

By describing a curve, we mean writing down one or more (algebraic) equations that, when plotted on a 2D plane or a 3D space, give rise to the curve they describe. A simple description of the curve can have the format $y = f(x)$, possibly with some constraints on the value of $x$ - for example $y = \sin(x)$, a wavier $y = x\sin(2x)$, or this polynomial curve $y = 0.5x^3 - 2x$.

### 9.1.1 Understanding the problem: y = f(x) is not enough

```python-editor collapsed
import numpy as np

pie.clear()
TEAL, PINK = '#0d9488', '#be185d'

# Points (x(s), y(s)) for s from start to end
def curve_points(x_of, y_of, start, end, n=200):
    s = np.linspace(start, end, n)
    return np.stack([x_of(s), y_of(s)], axis=1)

pie.polyline(pie.lift(curve_points, pie.Array[pie.Point])(lambda s: s**2 - 4, lambda s: s, -4, 4, hidden=True), out='par', stroke=TEAL)
pie.circle(pie.point(0, 0, out='p0', hidden=True), 3, out='circ', stroke=PINK)
```

Consider this sideways parabola, described by the equation $x = y^2 - 4$.

Or this circle, described by the equation $x^2 + y^2 = 9$.

These curves simply cannot be described by an equation `y = f(x)`. The reason is that `y = f(x)` is a function. A function has a _unique_ output for a given input - it cannot have two different outputs for the same input. But the curves above clearly have two different `y`-values for many values of `x`. They can be described by other equations involving `x` and `y`, but that can get quite tricky and complicated pretty fast.

### 9.1.2 Understanding a solution
One possible, and commonly used, solution to describing (almost) any curve is:

> Describe $x$ and $y$ as functions of a third variable $t$: $$\enspace x = f(t), \enspace y = g(t)$$ 

Then plot y-versus-x on a 2D plane. These equations are also called **parametric equations** - you are using a parameter $t$ to describe how $x$ and $y$ behave as functions of $t$. The curves we saw above can be expressed in parametric form like so:

- $y = \sin(x), \; -4 \le x \le 4$: trace $x = t, \; y = \sin(t)$ as $t$ sweeps from $-4$ to $4$.

```python-editor collapsed
import numpy as np

pie.clear()
pie.scalar(50, out='unit')
TEAL = '#0d9488'

# Points (x(s), y(s)) for s from start to end
def curve_points(x_of, y_of, start, end, n=200):
    s = np.linspace(start, end, n)
    return np.stack([x_of(s), y_of(s)], axis=1)

t = pie.scalar(-4, out='t')
pie.lift(lambda t: (t, np.sin(t)), pie.Point)(t, out='pt', fill=TEAL)
pie.polyline(pie.lift(curve_points, pie.Array[pie.Point])(lambda s: s, np.sin, -4, t, hidden=True), out='trail', stroke=TEAL)
pie.text(pie.lift(lambda t: f'x = t, y = sin t,   t = {t:.2f}', pie.Text)(t), -3.5, 4, 13, out='lbl_rd', stroke=TEAL)
# Sweep t from -4 to 4
pie.translate_scalar_to(t, 4, animate=True)
```

- $x = y^2 - 4$: trace $x = t^2 - 4, \; y = t$ as $t$ sweeps from $-3$ to $3$.

```python-editor collapsed
import numpy as np

pie.clear()
pie.scalar(50, out='unit')
PINK = '#be185d'

# Points (x(s), y(s)) for s from start to end
def curve_points(x_of, y_of, start, end, n=200):
    s = np.linspace(start, end, n)
    return np.stack([x_of(s), y_of(s)], axis=1)

t = pie.scalar(-3, out='t2')
pie.lift(lambda t: (t**2 - 4, t), pie.Point)(t, out='pt2', fill=PINK)
pie.polyline(pie.lift(curve_points, pie.Array[pie.Point])(lambda s: s**2 - 4, lambda s: s, -3, t, hidden=True), out='trail2', stroke=PINK)
pie.text(pie.lift(lambda t: f'x = t² − 4, y = t,   t = {t:.2f}', pie.Text)(t), 0, 4.3, 13, out='lbl_rd2', stroke=PINK)
# Sweep t from -3 to 3
pie.translate_scalar_to(t, 3, animate=True)
```

- $x^2 + y^2 = 9$: trace $x = 3\cos(t), \; y = 3\sin(t)$ as $t$ sweeps from $0$ to $2\pi$.

```python-editor collapsed
import numpy as np

pie.clear()
pie.scalar(50, out='unit')
GOLD = '#ca8a04'

# Points (x(s), y(s)) for s from start to end
def curve_points(x_of, y_of, start, end, n=200):
    s = np.linspace(start, end, n)
    return np.stack([x_of(s), y_of(s)], axis=1)

t = pie.scalar(0, out='tc')
pie.lift(lambda t: (3 * np.cos(t), 3 * np.sin(t)), pie.Point)(t, out='pc', fill=GOLD)
pie.polyline(pie.lift(curve_points, pie.Array[pie.Point])(lambda s: 3 * np.cos(s), lambda s: 3 * np.sin(s), 0, t, hidden=True), out='trail3', stroke=GOLD)
pie.text(pie.lift(lambda t: f'x = 3cos t, y = 3sin t,   t = {t:.2f}', pie.Text)(t), 0, 4.5, 13, out='lbl_rd3', stroke=GOLD)
# Sweep t from 0 to 2π
pie.translate_scalar_to(t, float(2 * np.pi), animate=True)
```

#### A pythonic pseudocode for plotting a curve may look like:

```python
def x(t):
    return some_function(t)

def y(t):
    return some_other_function(t)

def sample_t(start=0, end=1, num_points=100):
    step = (end-start)/(num_points-1)
    return [start + i*step for i in range(num_points)]
    
ts = sample_t()
xs = [x(t) for t in ts]
ys = [y(t) for t in ts]
plot(xs,ys)
```

---

### 9.1.3 Extending to 3 or more dimensions
We can use parametric curves to describe curves in any dimension. If we have a curve in three dimensions, all we need to do is describe `z` as a function of `t`, $z = h(t)$. Then for each value of `t`, we get a point `(x(t), y(t), z(t))` on the curve in three dimensions.

#### In the code, you just need to add a few more lines:

```python
def z(t):
    return yet_another_function(t)

ts = sample_t()
xs = [x(t) for t in ts]
ys = [y(t) for t in ts]
zs = [z(t) for t in ts]
plot(xs,ys)
```

---

## 9.2 Bezier curves
The core idea behind Bezier curves is simple:

> Use polynomial functions $x = f(t)$ and $y = g(t)$, and then plot y-versus-x.

Since a polynomial function is just a vector, we just need to find two vectors `x` and `y` and then plot y-versus-x. Note that this idea can be easily extended to Bezier curves in 3D space as well: we just need three vectors described by polynomials $x = f(t)$, $y = g(t)$, $z = h(t)$ and then plot `(x,y,z)` in 3D space.

### 9.2.1 Bezier curve of second degree

```python-editor collapsed
pie.clear()
unit = pie.scalar(50, out='unit')
BLUE, PINK, GREEN = '#1d4ed8', '#be185d', '#047857'
pie.polynomial([1, -2, 1], out='bp1', stroke=BLUE)
pie.text('p₁', -1, 3.4, 16, out='bx1', stroke=BLUE)
pie.polynomial([0, 2, -2], out='bp2', stroke=PINK)
pie.text('p₂', 0.5, 1, 16, out='bx2', stroke=PINK)
pie.polynomial([0, 0, 1], out='bp3', stroke=GREEN)
pie.text('p₃', 2, 3.4, 16, out='bx3', stroke=GREEN)
```

We start with the identity

$$((1-t) + t)^2 = \underbrace{\textcolor{#1d4ed8}{(1-t)^2}}_{\textcolor{#1d4ed8}{p_1(t)}} + \underbrace{\textcolor{#be185d}{2t(1-t)}}_{\textcolor{#be185d}{p_2(t)}} + \underbrace{\textcolor{#047857}{t^2}}_{\textcolor{#047857}{p_3(t)}}$$

where each term is a polynomial - and hence a vector:

- $p_1(t) = (1-t)^2 = 1 - 2t + t^2$, i.e. the blue curve $\textcolor{#1d4ed8}{[1, -2, 1]}$
- $p_2(t) = 2t(1-t) = 0 + 2t - 2t^2$, i.e. the pink curve $\textcolor{#be185d}{[0, 2, -2]}$
- $p_3(t) = t^2 = 0 + 0t + t^2$, i.e. the green curve $\textcolor{#047857}{[0, 0, 1]}$

These three vectors form the **basis** for calculating the Bezier curve. Note that for all three curves, whenever the input $t$ is between `0` and `1`, the output is also between `0` and `1`, as you can see if you zoom into this unit region to see it clearly:

```python-editor collapsed
pie.translate_scalar_to(unit, 300, animate=True)
```

Or zoom back out:

```python-editor collapsed
pie.translate_scalar_to(unit, 50, animate=True)
```

And since the three polynomials sum to $((1-t)+t)^2 = 1$, their outputs at any $t$ are three weights that add up to exactly `1`.

Remember that we want polynomial functions (aka vectors) $x(t)$ and $y(t)$. We get them by taking weighted sums of these basis vectors. The weights $x_1, x_2, x_3$ and $y_1, y_2, y_3$ come from the three input points needed to create a Bezier curve of degree two: $(x_1,y_1)$, $(x_2,y_2)$, $(x_3,y_3)$:

$$\begin{aligned} x(t) &= \begin{bmatrix} \textcolor{#1d4ed8}{1} & \textcolor{#be185d}{0} & \textcolor{#047857}{0} \\ \textcolor{#1d4ed8}{-2} & \textcolor{#be185d}{2} & \textcolor{#047857}{0} \\ \textcolor{#1d4ed8}{1} & \textcolor{#be185d}{-2} & \textcolor{#047857}{1} \end{bmatrix} \begin{bmatrix} \textcolor{#1d4ed8}{x_1} \\ \textcolor{#be185d}{x_2} \\ \textcolor{#047857}{x_3} \end{bmatrix} = \begin{bmatrix} x_1 \\ 2x_2-2x_1 \\ x_1-2x_2+x_3 \end{bmatrix} \\ &= x_1 + (2x_2-2x_1)t + (x_1-2x_2+x_3)t^2 \end{aligned}$$

$$\begin{aligned} y(t) &= \begin{bmatrix} \textcolor{#1d4ed8}{1} & \textcolor{#be185d}{0} & \textcolor{#047857}{0} \\ \textcolor{#1d4ed8}{-2} & \textcolor{#be185d}{2} & \textcolor{#047857}{0} \\ \textcolor{#1d4ed8}{1} & \textcolor{#be185d}{-2} & \textcolor{#047857}{1} \end{bmatrix} \begin{bmatrix} \textcolor{#1d4ed8}{y_1} \\ \textcolor{#be185d}{y_2} \\ \textcolor{#047857}{y_3} \end{bmatrix} = \begin{bmatrix} y_1 \\ 2y_2-2y_1 \\ y_1-2y_2+y_3 \end{bmatrix} \\ &= y_1 + (2y_2-2y_1)t + (y_1-2y_2+y_3)t^2 \end{aligned}$$

That's it! Given three points $(x_1,y_1)$, $(x_2,y_2)$ and $(x_3,y_3)$, you can calculate the parametric equations $x(t)$ and $y(t)$ and then plot y-versus-x to get the Bezier path. Let's see it in action.

```python-editor collapsed
pie.clear()
pie.scalar(60, out='unit')
PINK, GRAY, TEAL = '#be185d', '#71717a', '#0d9488'
pa = pie.point(-2, -2, out='pa', fill=PINK)
pb = pie.point(0, 3, out='pb', fill=PINK)
pc = pie.point(3, 2, out='pc', fill=PINK)
pie.text('P1', -2, -1.6, 12, out='lab_1')
pie.text('P2', 0, 3.4, 12, out='lab_2')
pie.text('P3', 3, 2.4, 12, out='lab_3')
```

We start with the three pink anchor points $P_1 = (-2,-2)$, $P_2 = (0,3)$ and $P_3 = (3,2)$.

```python-editor collapsed
pie.line(pa, pb, out='e1', stroke=GRAY)
pie.line(pb, pc, out='e2', stroke=GRAY)
pie.line(pc, pa, out='e3', stroke=GRAY)
```

Joining the anchor points in order gives the grey control polygon.

We build the curve directly from the parametric polynomials we derived above. The point $B(t)$ is just the weighted sum of the three anchors, using the basis polynomials as weights:

$$B(t) = \textcolor{#1d4ed8}{(1-t)^2}\,P_1 + \textcolor{#be185d}{2t(1-t)}\,P_2 + \textcolor{#047857}{t^2}\,P_3$$

```python-editor collapsed
import numpy as np

# B(t) for one t or an array of them: the anchors weighted by (1-t)², 2t(1-t) and t²
def bezier(p1, p2, p3, t):
    p1, p2, p3 = np.array(p1), np.array(p2), np.array(p3)
    t = np.asarray(t)[..., None]
    return (1 - t)**2 * p1 + 2 * t * (1 - t) * p2 + t**2 * p3

t = pie.scalar(0, out='t')
pie.lift(lambda p1, p2, p3, t: tuple(bezier(p1, p2, p3, t)), pie.Point)(pa, pb, pc, t, out='bpt', fill=TEAL)
trail = pie.lift(lambda p1, p2, p3, t: bezier(p1, p2, p3, np.linspace(0, t, 100)), pie.Array[pie.Point])(pa, pb, pc, t, hidden=True)
pie.polyline(trail, out='bez', stroke=TEAL)
pie.text(pie.lift(lambda t: f't = {t:.2f}', pie.Text)(t), -4, 4, 13, out='lbl_rdt', stroke=TEAL)
label_x = pie.lift(lambda p1, p2, p3, t: bezier(p1, p2, p3, t)[0] + 0.5, pie.Scalar)(pa, pb, pc, t)
label_y = pie.lift(lambda p1, p2, p3, t: bezier(p1, p2, p3, t)[1] - 0.4, pie.Scalar)(pa, pb, pc, t)
pie.text('B(t)', label_x, label_y, 12, out='lbl_bt', stroke=TEAL)
```

As $t$ sweeps from `0` to `1`, this point moves through space; trace its path and you get the teal Bezier curve.

```python-editor collapsed
pie.translate_scalar_to(t, 1, animate=True)
```

Some observations:

- At $t = 0$ the weights are $(1, 0, 0)$, so the curve starts exactly at $P_1$.

```python-editor collapsed
pie.bezier_quadratic(pa, pb, pc, out='bez_full', stroke=TEAL)
pie.translate_scalar_to(t, 0, animate=True)
```

- At $t = 1$ the weights are $(0, 0, 1)$, so it ends exactly at $P_3$.

```python-editor collapsed
pie.bezier_quadratic(pa, pb, pc, out='bez_full', stroke=TEAL)
pie.translate_scalar_to(t, 1, animate=True)
```

- $P_2$'s weight $2t(1-t)$ peaks at only `0.5`, so at $t = 0.5$ the curve is pulled toward $P_2$ but never reaches it.

```python-editor collapsed
pie.bezier_quadratic(pa, pb, pc, out='bez_full', stroke=TEAL)
pie.translate_scalar_to(t, 0.5, animate=True)
```

---

### 9.2.2 Bezier curve of third degree

```python-editor collapsed
pie.clear()
unit = pie.scalar(50, out='unit')
BLUE, PINK, GREEN, AMBER = '#1d4ed8', '#be185d', '#047857', '#b45309'
pie.polynomial([1, -3, 3, -1], out='cp1', stroke=BLUE)
pie.text('p₁', -0.6, 3.4, 16, out='cbx1', stroke=BLUE)
pie.polynomial([0, 3, -6, 3], out='cp2', stroke=PINK)
pie.text('p₂', 0.33, 0.7, 16, out='cbx2', stroke=PINK)
pie.polynomial([0, 0, 3, -3], out='cp3', stroke=GREEN)
pie.text('p₃', 0.67, 0.7, 16, out='cbx3', stroke=GREEN)
pie.polynomial([0, 0, 0, 1], out='cp4', stroke=AMBER)
pie.text('p₄', 1.6, 3.4, 16, out='cbx4', stroke=AMBER)
```

We start with the identity

$$((1-t) + t)^3 = \underbrace{\textcolor{#1d4ed8}{(1-t)^3}}_{\textcolor{#1d4ed8}{p_1(t)}} + \underbrace{\textcolor{#be185d}{3t(1-t)^2}}_{\textcolor{#be185d}{p_2(t)}} + \underbrace{\textcolor{#047857}{3t^2(1-t)}}_{\textcolor{#047857}{p_3(t)}} + \underbrace{\textcolor{#b45309}{t^3}}_{\textcolor{#b45309}{p_4(t)}}$$

where:

- $p_1(t) = (1-t)^3 = 1 - 3t + 3t^2 - t^3$, i.e. the blue curve $\textcolor{#1d4ed8}{[1, -3, 3, -1]}$
- $p_2(t) = 3t(1-t)^2 = 0 + 3t - 6t^2 + 3t^3$, i.e. the pink curve $\textcolor{#be185d}{[0, 3, -6, 3]}$
- $p_3(t) = 3t^2(1-t) = 0 + 0t + 3t^2 - 3t^3$, i.e. the green curve $\textcolor{#047857}{[0, 0, 3, -3]}$
- $p_4(t) = t^3 = 0 + 0t + 0t^2 + t^3$, i.e. the amber curve $\textcolor{#b45309}{[0, 0, 0, 1]}$

These four vectors form the basis for calculating the Bezier curve of degree three. This looks a lot like what we did for Bezier curves of degree two. Again, for all four of these polynomials, whenever the input is between `0` and `1`, the output is also between `0` and `1`, as you can see if you zoom into this unit region to see it clearly:

```python-editor collapsed
pie.translate_scalar_to(unit, 300, animate=True)
```

Or zoom back out:

```python-editor collapsed
pie.translate_scalar_to(unit, 50, animate=True)
```

And they sum to `1`.

The parametric polynomial equations (aka vectors) $x(t)$ and $y(t)$ are again weighted sums of these four basis vectors, with the weights coming from the four input points $(x_1,y_1)$, $(x_2,y_2)$, $(x_3,y_3)$, $(x_4,y_4)$:

$$\begin{aligned} x(t) &= \begin{bmatrix} \textcolor{#1d4ed8}{1} & \textcolor{#be185d}{0} & \textcolor{#047857}{0} & \textcolor{#b45309}{0} \\ \textcolor{#1d4ed8}{-3} & \textcolor{#be185d}{3} & \textcolor{#047857}{0} & \textcolor{#b45309}{0} \\ \textcolor{#1d4ed8}{3} & \textcolor{#be185d}{-6} & \textcolor{#047857}{3} & \textcolor{#b45309}{0} \\ \textcolor{#1d4ed8}{-1} & \textcolor{#be185d}{3} & \textcolor{#047857}{-3} & \textcolor{#b45309}{1} \end{bmatrix} \begin{bmatrix} \textcolor{#1d4ed8}{x_1} \\ \textcolor{#be185d}{x_2} \\ \textcolor{#047857}{x_3} \\ \textcolor{#b45309}{x_4} \end{bmatrix} \\ &= x_1 + (3x_2-3x_1)t + (3x_1-6x_2+3x_3)t^2 + (-x_1+3x_2-3x_3+x_4)t^3 \end{aligned}$$

and similarly for $y(t)$ with the weights $y_1, y_2, y_3, y_4$.

```python-editor collapsed
pie.clear()
pie.scalar(60, out='unit')
PINK, GRAY, TEAL = '#be185d', '#71717a', '#0d9488'
pa = pie.point(-2, -2, out='pa', fill=PINK)
pb = pie.point(-1, 3, out='pb', fill=PINK)
pc = pie.point(2, 4, out='pc', fill=PINK)
pd = pie.point(3, 2, out='pd', fill=PINK)
pie.text('P1', -2, -1.6, 12, out='lab_1')
pie.text('P2', -1, 3.4, 12, out='lab_2')
pie.text('P3', 2, 4.4, 12, out='lab_3')
pie.text('P4', 3, 2.4, 12, out='lab_4')
```

Let's look at an example with the four anchor points $P_1 = (-2,-2)$, $P_2 = (-1,3)$, $P_3 = (2,4)$ and $P_4 = (3,2)$.

```python-editor collapsed
pie.line(pa, pb, out='e1', stroke=GRAY)
pie.line(pb, pc, out='e2', stroke=GRAY)
pie.line(pc, pd, out='e3', stroke=GRAY)
pie.line(pd, pa, out='e4', stroke=GRAY)
```

As before, the grey control polygon joins the anchors in order. We build the curve exactly as we did for degree two: the point $B(t)$ is the weighted sum of the four anchors, using the four basis polynomials as weights:

$$B(t) = \textcolor{#1d4ed8}{(1-t)^3}\,P_1 + \textcolor{#be185d}{3t(1-t)^2}\,P_2 + \textcolor{#047857}{3t^2(1-t)}\,P_3 + \textcolor{#b45309}{t^3}\,P_4$$

```python-editor collapsed
import numpy as np

# B(t) for one t or an array of them: the anchors weighted by (1-t)³, 3t(1-t)², 3t²(1-t) and t³
def bezier(p1, p2, p3, p4, t):
    p1, p2, p3, p4 = np.array(p1), np.array(p2), np.array(p3), np.array(p4)
    t = np.asarray(t)[..., None]
    return (1 - t)**3 * p1 + 3 * t * (1 - t)**2 * p2 + 3 * t**2 * (1 - t) * p3 + t**3 * p4

t = pie.scalar(0, out='t')
pie.lift(lambda p1, p2, p3, p4, t: tuple(bezier(p1, p2, p3, p4, t)), pie.Point)(pa, pb, pc, pd, t, out='bpt', fill=TEAL)
trail = pie.lift(lambda p1, p2, p3, p4, t: bezier(p1, p2, p3, p4, np.linspace(0, t, 100)), pie.Array[pie.Point])(pa, pb, pc, pd, t, hidden=True)
pie.polyline(trail, out='bez', stroke=TEAL)
pie.text(pie.lift(lambda t: f't = {t:.2f}', pie.Text)(t), -4.3, 4.3, 13, out='lbl_rdt', stroke=TEAL)
label_x = pie.lift(lambda p1, p2, p3, p4, t: bezier(p1, p2, p3, p4, t)[0] + 0.5, pie.Scalar)(pa, pb, pc, pd, t)
label_y = pie.lift(lambda p1, p2, p3, p4, t: bezier(p1, p2, p3, p4, t)[1] - 0.4, pie.Scalar)(pa, pb, pc, pd, t)
pie.text('B(t)', label_x, label_y, 12, out='lbl_bt', stroke=TEAL)
```

As $t$ sweeps from `0` to `1`, trace its path and you get the teal Bezier curve of degree three.

```python-editor collapsed
pie.translate_scalar_to(t, 1, animate=True)
```

Some observations:

- At $t = 0$ the weights are $(1, 0, 0, 0)$, so the curve starts exactly at $P_1$.

```python-editor collapsed
pie.bezier_cubic(pa, pb, pc, pd, out='bez_full', stroke=TEAL)
pie.translate_scalar_to(t, 0, animate=True)
```

- At $t = 1$ the weights are $(0, 0, 0, 1)$, so it ends exactly at $P_4$.

```python-editor collapsed
pie.bezier_cubic(pa, pb, pc, pd, out='bez_full', stroke=TEAL)
pie.translate_scalar_to(t, 1, animate=True)
```

- At $t = 1/3$ the curve leans toward $P_2$ but never touches it, since $P_2$'s weight $3t(1-t)^2$ is never `1`.

```python-editor collapsed
pie.bezier_cubic(pa, pb, pc, pd, out='bez_full', stroke=TEAL)
pie.translate_scalar_to(t, 1 / 3, animate=True)
```

- At $t = 2/3$ it leans toward $P_3$ but never touches it, since $P_3$'s weight $3t^2(1-t)$ is never `1`.

```python-editor collapsed
pie.bezier_cubic(pa, pb, pc, pd, out='bez_full', stroke=TEAL)
pie.translate_scalar_to(t, 2 / 3, animate=True)
```

---

## 9.3 Properties of Bezier curves

### 9.3.1 The entire curve lies inside the convex hull of the points

```python-editor collapsed
pie.clear()
pie.scalar(60, out='unit')
PINK, TEAL = '#be185d', '#0d9488'
qa = pie.point(0, -3, out='qa', fill=PINK)
qb = pie.point(-2, 3, out='qb', fill=PINK)
qc = pie.point(2, 2, out='qc', fill=PINK)
pie.polyline([qa, qb, qc, qa], out='hull2', stroke=PINK)
pie.bezier_quadratic(qa, qb, qc, out='bez2', stroke=TEAL)
pie.text('convex hull', -2.8, -0.2, 12, out='lbl_hull', stroke=PINK)
pie.text('Bezier curve', -0.5, 1.9, 12, out='lbl_bez', stroke=TEAL)
```

For the points `[0,-3], [-2,3], [2,2]`, the Bezier curve always lies inside the triangle formed by these points. This follows from what we noticed about the basis polynomials: for $t \in [0,1]$ the three weights are all non-negative and sum to `1`, so every point of the curve is a weighted average of the anchor points.

```python-editor collapsed
pie.clear()
pie.scalar(60, out='unit')
PINK, TEAL = '#be185d', '#0d9488'
ra = pie.point(1, -3, out='ra', fill=PINK)
rb = pie.point(2, 3, out='rb', fill=PINK)
rc = pie.point(-4, 2, out='rc', fill=PINK)
rd = pie.point(3, -1, out='rd', fill=PINK)
# The hull's corners, going around counter-clockwise
pie.polyline([ra, rd, rb, rc, ra], out='hull3', stroke=PINK)
pie.bezier_cubic(ra, rb, rc, rd, out='bez3', stroke=TEAL)
pie.text('convex hull', 3.3, -2.6, 12, out='lbl_hull', stroke=PINK)
pie.text('Bezier curve', -0.6, 2, 12, out='lbl_bez', stroke=TEAL)
```

The same holds in degree three: for the points `[1,-3], [2,3], [-4,2], [3,-1]`, the Bezier curve always lies inside the convex hull formed by these points.

### 9.3.2 Tangents at the start and end points point towards the nearest anchor point

```python-editor collapsed
pie.clear()
pie.scalar(60, out='unit')
PINK, TEAL, GOLD = '#be185d', '#0d9488', '#ca8a04'
qa = pie.point(0, -3, out='qa', fill=PINK)
qb = pie.point(-2, 3, out='qb', fill=PINK)
qc = pie.point(2, 2, out='qc', fill=PINK)
pie.bezier_quadratic(qa, qb, qc, out='bez2', stroke=TEAL)
```

Given a Bezier curve of degree 2 with points `startPoint`, `midPoint` and `endPoint`, we draw tangents at `startPoint` and `endPoint`:

- The tangent at `startPoint` points in the same direction as the line joining the points `startPoint` and `midPoint`.

```python-editor collapsed
pie.line(qa, qb, out='t1', stroke=GOLD)
pie.text('tangent at start', -2.5, -0.5, 12, out='lbl_tan_a', stroke=GOLD)
```

- The tangent at `endPoint` points in the same direction as the line joining the points `endPoint` and `midPoint`.

```python-editor collapsed
pie.line(qc, qb, out='t2', stroke=GOLD)
pie.text('tangent at end', 0.9, 3.1, 12, out='lbl_tan_b', stroke=GOLD)
```

```python-editor collapsed
pie.clear()
pie.scalar(60, out='unit')
PINK, TEAL, GOLD, GRAY = '#be185d', '#0d9488', '#ca8a04', '#71717a'
ra = pie.point(1, -3, out='ra', fill=PINK)
rb = pie.point(2, 3, out='rb', fill=PINK)
rc = pie.point(-4, 2, out='rc', fill=PINK)
rd = pie.point(3, -1, out='rd', fill=PINK)
pie.bezier_cubic(ra, rb, rc, rd, out='bez3', stroke=TEAL)
pie.line(rb, rc, out='mid', stroke=GRAY)
```

Similarly, given a Bezier curve of degree 3 with points `startPoint`, `midPointA`, `midPointB` and `endPoint`:

- The tangent at `startPoint` points in the same direction as the line joining the points `startPoint` and `midPointA`.

```python-editor collapsed
pie.line(ra, rb, out='t1', stroke=GOLD)
pie.text('tangent at start', 2.9, 0.2, 12, out='lbl_tan_a', stroke=GOLD)
```

- The tangent at `endPoint` points in the same direction as the line joining the points `endPoint` and `midPointB`.

```python-editor collapsed
pie.line(rd, rc, out='t2', stroke=GOLD)
pie.text('tangent at end', -0.5, -0.5, 12, out='lbl_tan_b', stroke=GOLD)
```

You can even get a closed form solution, i.e. an exact equation for the slope of the tangent at any point on a Bezier curve. For a Bezier curve of degree 2:

$$
\begin{aligned}
\frac{dy}{dx} &= \frac{dy}{dt} \bigg/ \frac{dx}{dt} \\
&= \frac{2(y_2 - y_1) + 2t(y_1 - 2y_2 + y_3)}{2(x_2 - x_1) + 2t(x_1 - 2x_2 + x_3)}
\end{aligned}
$$

- At $t = 0$ (the start point) the slope is $\frac{y_2 - y_1}{x_2 - x_1}$ - the slope of the line joining the first two points.
- At $t = 1$ (the end point) the slope is $\frac{y_3 - y_2}{x_3 - x_2}$ - the slope of the line joining the last two points.

Similarly for a Bezier curve of degree 3:

$$\frac{dy}{dx} = \frac{3(y_2 - y_1) + 2t(3y_1 - 6y_2 + 3y_3) + 3t^2(-y_1 + 3y_2 - 3y_3 + y_4)}{3(x_2 - x_1) + 2t(3x_1 - 6x_2 + 3x_3) + 3t^2(-x_1 + 3x_2 - 3x_3 + x_4)}$$

- At $t = 0$ the slope is $\frac{y_2 - y_1}{x_2 - x_1}$, and at $t = 1$ the slope is $\frac{y_4 - y_3}{x_4 - x_3}$.

---

## 9.4 Bezier curves in 3 dimensions
First let's look at the code that takes three or four points as inputs and returns points on a Bezier curve:

```python
def create_polynomial_function(*coefficients):
    def f(x):
        return sum(c * x**i for (i,c) in enumerate(coefficients))
    return f

def sample_t(start=0, end=1, num_points=100):
    step = (end-start)/(num_points-1)
    return [start + i*step for i in range(num_points)]

Point=[float,float]

def get_bezier_curve(*points:[Point]):
    assert len(points) in [3,4]
    xs, ys = list(zip(*points))
    if len(points) == 3:
        x1,x2,x3 = xs
        y1,y2,y3 = ys
        x_coefficients = [x1, 2*(x2-x1), x1 - 2*x2 + x3]
        y_coefficients = [y1, 2*(y2-y1), y1 - 2*y2 + y3]
    elif len(points) == 4:
        x1,x2,x3,x4 = xs
        y1,y2,y3,y4 = ys
        x_coefficients = [x1, 3*(x2-x1), 3*x1 - 6*x2 + 3*x3, -x1 + 3*x2 -3*x3 +  x4]
        y_coefficients = [y1, 3*(y2-y1), 3*y1 - 6*y2 + 3*y3, -y1 + 3*y2 -3*y3 +  y4]
    x = create_polynomial_function(*x_coefficients)
    y = create_polynomial_function(*y_coefficients)
    ts = sample_t()
    return list(zip([x(t) for t in ts], [y(t) for t in ts]))
```

To extend this idea to create Bezier curves in three dimensions, you only need to modify the `get_bezier_curve` function. Let's write a new function `get_bezier_curve_3d` which calculates points on a 3-dimensional Bezier curve:

```python
Point3d = [float,float,float]

def get_bezier_curve_3d(*points:[Point3d]):
    assert len(points) in [3,4]
    xs, ys, zs = list(zip(*points))
    if len(points) == 3:
        x1,x2,x3 = xs
        y1,y2,y3 = ys
        z1,z2,z3 = zs
        x_coefficients = [x1, 2*(x2-x1), x1 - 2*x2 + x3]
        y_coefficients = [y1, 2*(y2-y1), y1 - 2*y2 + y3]
        z_coefficients = [z1, 2*(z2-z1), z1 - 2*z2 + z3]
    elif len(points) == 4:
        x1,x2,x3,x4 = xs
        y1,y2,y3,y4 = ys
        z1,z2,z3,z4 = zs
        x_coefficients = [x1, 3*(x2-x1), 3*x1 - 6*x2 + 3*x3, -x1 + 3*x2 -3*x3 +  x4]
        y_coefficients = [y1, 3*(y2-y1), 3*y1 - 6*y2 + 3*y3, -y1 + 3*y2 -3*y3 +  y4]
        z_coefficients = [z1, 3*(z2-z1), 3*z1 - 6*z2 + 3*z3, -z1 + 3*z2 -3*z3 +  z4]
    x = create_polynomial_function(*x_coefficients)
    y = create_polynomial_function(*y_coefficients)
    z = create_polynomial_function(*z_coefficients)
    ts = sample_t()
    return list(zip([x(t) for t in ts], [y(t) for t in ts], [z(t) for t in ts]))
```

There are other curves, like cubic splines, which also share very similar ideas to what we discussed here.

In the next chapter, we will look at one of the most important operations in linear algebra - the dot product.

---

[← 8. Polynomial curves are vectors in disguise](/la/8_polynomial_curves)  ·  [10. Dot product →](/la/10_dot_product)
