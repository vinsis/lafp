---
title: Weighted sums and weighted means
description: Linear algebra starts with weighted sums. See how scaling and adding numbers shows up in indexing, expected values, rotation and polynomials.
canvas: left
sidebar: _ebook.md
---

# 1. Weighted means

Let's start with calculating a weighted sum for an array of numbers $\textcolor{#1d4ed8}{x} = [\textcolor{#1d4ed8}{x_1}, \textcolor{#1d4ed8}{x_2}, \textcolor{#1d4ed8}{x_3}]$ where the weights are given by the array $\textcolor{#0d9488}{w} = [\textcolor{#0d9488}{w_1}, \textcolor{#0d9488}{w_2}, \textcolor{#0d9488}{w_3}]$

$$\text{weighted\_sum}(\textcolor{#1d4ed8}{x},\textcolor{#0d9488}{w}) = \underbrace{\textcolor{#0d9488}{w_1} \textcolor{#1d4ed8}{x_1}}_{\text{scaled } \textcolor{#1d4ed8}{x_1}} + \underbrace{\textcolor{#0d9488}{w_2} \textcolor{#1d4ed8}{x_2}}_{\text{scaled } \textcolor{#1d4ed8}{x_2}} + \underbrace{\textcolor{#0d9488}{w_3} \textcolor{#1d4ed8}{x_3}}_{\text{scaled } \textcolor{#1d4ed8}{x_3}}$$

```python
def get_weighted_sum(values, weights):
    return sum((v*w) for (v,w) in zip(values, weights))
```

```python-editor collapsed
pie.clear()
pie.scalar(50, out='unit')
pie.scalar(0, out='gridOpacity')
BLUE, TEAL, VIOLET, GREEN, GRAY = '#1d4ed8', '#0d9488', '#6d28d9', '#047857', '#71717a'

# Step 1: scale each value by its weight
for k, cx in enumerate([-4, 0, 4]):
    sub = '₁₂₃'[k]
    x_pt = pie.point(cx - 0.5, 3.45, out=f'x{k}', hidden=True)
    w_pt = pie.point(cx + 0.5, 3.45, out=f'w{k}', hidden=True)
    pie.circle(x_pt, 0.11, out=f'x{k}_dot', fill=BLUE, stroke=BLUE)
    pie.circle(w_pt, 0.11, out=f'w{k}_dot', fill=TEAL, stroke=TEAL)
    pie.rectangle(pie.point(cx - 0.85, 1.55, out=f'scale{k}_corner', hidden=True), 1.7, 0.9, out=f'scale{k}_box', stroke=GRAY)
    pie.annotate_arrow(x_pt, pie.point(cx - 0.5, 2.45, out=f'scale{k}_in_left', hidden=True), 0.18, out=f'x{k}_arrow', stroke=BLUE)
    pie.annotate_arrow(w_pt, pie.point(cx + 0.5, 2.45, out=f'scale{k}_in_right', hidden=True), 0.18, out=f'w{k}_arrow', stroke=TEAL)
    pie.text(f'x{sub}', cx - 0.5, 3.95, 14, out=f'x{k}_label', stroke=BLUE)
    pie.text(f'w{sub}', cx + 0.5, 3.95, 14, out=f'w{k}_label', stroke=TEAL)
    pie.text('scale: ×', cx, 2, 12, out=f'scale{k}_label', stroke=GRAY)
    pie.text(f'w{sub}x{sub}', cx, 0.95, 13, out=f'term{k}_label', stroke=VIOLET)

# Step 2: add the scaled values
add_center = pie.point(0, -1.55, out='add_center', hidden=True)
pie.circle(add_center, 0.62, out='add_circle', stroke=GRAY)
for k, (cx, (tx, ty)) in enumerate(zip([-4, 0, 4], [(-0.4, -1.05), (0, -0.9), (0.4, -1.05)])):
    pie.annotate_arrow(pie.point(cx, 0.6, out=f'term{k}_pt', hidden=True), pie.point(tx, ty, out=f'add_in{k}', hidden=True), 0.12, out=f'term{k}_arrow', stroke=VIOLET)
pie.annotate_arrow(pie.point(0, -2.17, out='add_out', hidden=True), pie.point(0, -2.95, out='output_in', hidden=True), 0.08, out='sum_arrow', stroke=GREEN)
pie.text('add: +', 0, -1.55, 13, out='add_label', stroke=GRAY)
pie.text('weighted_sum(x, w)', 0, -3.5, 14, 4.6, -1, out='sum_label', stroke=GREEN)
pie.text('Two-step pipeline: first scale each xᵢ by its weight wᵢ, then add the three scaled terms to get the weighted sum.', 0, 5.35, 12, 9, -1, out='caption', stroke=GRAY)
```

It can be seen as a two step process:

a) we scale each value by its corresponding weight <br />
b) we add the scaled values up

```python
def scale(value, weight):
    return value * weight

def add(scaled_values):
    return sum(scaled_values)

def get_weighted_sum(values, weights):
    return add(scale(v, w) for (v, w) in zip(values, weights))
```

One thing we achieve by doing so is separation of logic for scaling the values and adding them. For instance, you can provide your own definitions of `scaling` and `adding` and pass them as parameters to `get_weighted_sum`:

```python
def get_weighted_sum(values, weights, *, scale_function, add_function):
    return add_function(
        scale_function(v, w) 
        for (v, w) in zip(values, weights)
    )
```

---

## 1.1. How to scale and add

Now we can simply focus on different ways to scale and add two values together. You already saw the `scale` and `add` functions above. But there are many other possible ways to scale and add. 

```python-editor collapsed
pie.clear()
pie.scalar(32, out='unit')
pie.scalar(0, out='gridOpacity')
TEAL, TEAL_DARK, GRAY, LIGHT_GRAY = '#0d9488', '#115e59', '#71717a', '#d4d4d8'

def label(name, text, x, y, size, color=None, w=0, h=0):
    pie.text(text, x, y, size, w, h, out=name, stroke=color)

# Column dividers
pie.line(pie.point(-3.4, 7.4, out='div1_top', hidden=True), pie.point(-3.4, -3.2, out='div1_bottom', hidden=True), out='div1', stroke=LIGHT_GRAY)
pie.line(pie.point(3.4, 7.4, out='div2_top', hidden=True), pie.point(3.4, -3.2, out='div2_bottom', hidden=True), out='div2', stroke=LIGHT_GRAY)
label('head1', '① The dictionary', -6.65, 6.25, 15, TEAL_DARK)
label('head2', '② Worked example', 0, 6.25, 15, TEAL_DARK)
label('head3', "③ Why it's geometry", 6.5, 6.25, 15, TEAL_DARK)

# ① The dictionary
label('classical', 'classical', -8, 4.55, 12, GRAY)
label('tropical', 'tropical', -5.3, 4.55, 12, TEAL)
label('mul_classical', '⊗ = ×', -8, 3.15, 13, GRAY)
label('mul_tropical', '⊗ = +', -5.3, 3.15, 13, TEAL)
label('add_classical', '⊕ = +', -8, 1.75, 13, GRAY)
label('add_tropical', '⊕ = max', -5.3, 1.75, 13, TEAL)
pie.annotate_arrow(pie.point(-7.3, 3.15, out='mul_from', hidden=True), pie.point(-6, 3.15, out='mul_to', hidden=True), 0.04, out='mul_arrow', stroke=TEAL)
pie.annotate_arrow(pie.point(-7.3, 1.75, out='add_from', hidden=True), pie.point(-6, 1.75, out='add_to', hidden=True), 0.04, out='add_arrow', stroke=TEAL)
label('dictionary', 'multiply → plus,  add → max', -6.65, 0.55, 11, GRAY)

# ② Worked example
rows = [('values  = [1, 2, 3]', 4.55, 13, GRAY), ('weights = [6, 1, 3]', 3.85, 13, GRAY),
        ('tropical scale  ⊗ = + :', 2.85, 12, GRAY), ('1 + 6 = 7', 2.15, 13, TEAL_DARK), ('2 + 1 = 3', 1.45, 13, TEAL), ('3 + 3 = 6', 0.75, 13, TEAL),
        ('tropical add  ⊕ = max :', -0.25, 12, GRAY), ('max(7, 3, 6) = 7', -0.95, 13, TEAL_DARK), ('weighted_sum = 7', -2.15, 13, TEAL_DARK)]
for k, (row, y, size, color) in enumerate(rows):
    label(f'example{k}', row, 0, y, size, color)

# ③ A tropical polynomial is the upper envelope of lines
pie.line(pie.point(4.925, -2.24, out='axis_bottom', hidden=True), pie.point(4.925, 4.42, out='axis_top', hidden=True), out='axis', stroke=LIGHT_GRAY)
pie.line(pie.point(4.925, 0.55, out='a0_start', hidden=True), pie.point(8.075, 0.55, out='a0_end', hidden=True), out='a0', stroke=GRAY)
pie.line(pie.point(4.925, -0.35, out='a1_start', hidden=True), pie.point(8.075, 2.8, out='a1_end', hidden=True), out='a1', stroke=GRAY)
pie.line(pie.point(4.925, -2.15, out='a2_start', hidden=True), pie.point(8.075, 4.15, out='a2_end', hidden=True), out='a2', stroke=GRAY)
corner_one = pie.point(5.825, 0.55, out='corner_one', fill=TEAL)
corner_two = pie.point(6.725, 1.45, out='corner_two', fill=TEAL)
envelope_start = pie.point(4.925, 0.55, out='envelope_start', hidden=True)
envelope_end = pie.point(8.075, 4.15, out='envelope_end', hidden=True)
pie.polyline([envelope_start, corner_one, corner_two, envelope_end], out='envelope', stroke=TEAL)
label('poly_label', 'p(x) = max(a₀, a₁+x, a₂+2x)', 6.5, 5.25, 11, TEAL)
label('a0_label', 'a₀', 8.6, 0.55, 11, TEAL_DARK)
label('a1_label', 'a₁+x', 8.6, 2.8, 11, TEAL_DARK)
label('a2_label', 'a₂+2x', 8.6, 4.15, 11, TEAL_DARK)
label('creases', 'breakpoints = creases (max switches line)', 6.9, -3.9, 11, TEAL_DARK, 3.4, -1)
label('caption', 'This max-plus substitution IS the tropical semiring   •   worked example gives weighted_sum = 7', 0, -7.7, 12, TEAL_DARK, 15, -1)
```

One way is described below (this leads to the exciting area of [Tropical Geometry](https://en.wikipedia.org/wiki/Tropical_geometry)). Here is an overview of it. 

```python
def tropical_scale(value, weight):
    return value + weight

def tropical_add(scaled_values):
    return max(scaled_values)

weighted_sum = get_weighted_sum(
    [1,2,3], [6,1,3], 
    scale_function = tropical_scale, 
    add_function = tropical_add
)
```

However let us stick to the _conventional_ notions of scaling and adding: 
- we scale two numbers by multiplying them - `scale(x,y) = x*y`
- we add two numbers by summing them up - `add(x,y) = x+y`. 

But **we are going to get creative with _what_ to scale and add**. 

> Instead of numbers, we will scale and add arrays of numbers.

How do we scale an array `array_of_numbers` with a given weight `weight`? Scale each value in the array with the given weight.

```python
def scale_array(array_of_numbers, weight):
    return [number * weight for number in array_of_numbers]
```

How do we add two or more arrays of numbers? Do an elementwise addition (all arrays need to have the same length).

```python
def add_arrays(array_of_arrays):
    result = [0] * len(array_of_arrays[0])
    for array in array_of_arrays:
        result = [(r+v) for (r,v) in zip(result, array)]
    return result
```

Then we can pass these functions to `get_weighted_sum` along with the inputs to scale and add.

---

## 1.2. Weighted sums are everywhere

Here is an overview of the examples that follow.

```python-editor collapsed
import math

pie.clear()
pie.scalar(32, out='unit')
pie.scalar(0, out='gridOpacity')
BLUE, AMBER, TEAL, CYAN, GRAY, LIGHT_GRAY = '#1d4ed8', '#b45309', '#0d9488', '#0e7490', '#71717a', '#d4d4d8'

def label(name, text, x, y, size, color=None, w=0, h=0):
    pie.text(text, x, y, size, w, h, out=name, stroke=color)

label('title', '1.2 · Weighted sums are everywhere', 0, 9, 17)
pie.line(pie.point(-9.5, 0, out='div_left', hidden=True), pie.point(9.5, 0, out='div_right', hidden=True), out='div_h', stroke=LIGHT_GRAY)
pie.line(pie.point(0, -8.7, out='div_bottom', hidden=True), pie.point(0, 8, out='div_top', hidden=True), out='div_v', stroke=LIGHT_GRAY)

def cell(name, cx, y, color):
    """A 1.3-wide square whose top half holds the entry at (cx, y)."""
    pie.rectangle(pie.point(cx - 0.65, y - 0.65, out=f'{name}_corner', hidden=True), 1.3, 1.3, out=f'{name}_box', stroke=color)

# Indexing
label('indexing', 'Indexing', -4.75, 7.2, 15)
label('index_values', 'values', -8.7, 5.3, 11, GRAY)
label('index_weights', 'weights', -8.7, 3.9, 11, GRAY)
for k, (value, weight, color) in enumerate([(2, 0, GRAY), (3, 0, GRAY), (5, 1, AMBER)]):
    cx = -6.6 + 1.85 * k
    cell(f'index{k}', cx, 5.3, color)
    label(f'index_value{k}', str(value), cx, 5.3, 15, color)
    label(f'index_weight{k}', str(weight), cx, 3.9, 13, color)
label('index_result', 'array[2] = 5', -4.75, 2.4, 14, AMBER)

# Expected value of a die
label('expected', 'Expected value', 4.9, 7.2, 15)
for k in range(6):
    cx = 2.35 + 1.05 * k
    label(f'face{k}', str(k + 1), cx, 5.9, 14)
    pie.rectangle(pie.point(cx - 0.28, 4.5, out=f'prob_corner{k}', hidden=True), 0.56, 0.6, out=f'prob_bar{k}', fill=TEAL, stroke=TEAL)
    label(f'prob{k}', '1/6', cx, 3.95, 11, TEAL)
label('expected_result', 'E = Σ pᵢ·vᵢ = 3.5', 4.9, 2.5, 14)

# Positional notation
label('positional', 'Positional notation', -4.75, -1.2, 15)
for k, (text, y) in enumerate([('digits', -3), ('place', -4.15), ('product', -5.3)]):
    label(f'digits_label{k}', text, -8.7, y, 11, GRAY)
for k, (digit, place) in enumerate([(2, 100), (3, 10), (4, 1)]):
    cx = -6.6 + 1.85 * k
    cell(f'digit{k}', cx, -3, BLUE)
    label(f'digit{k}', str(digit), cx, -3, 15, BLUE)
    label(f'place{k}', str(place), cx, -4.15, 13, TEAL)
    label(f'product{k}', str(digit * place), cx, -5.3, 13)
label('digits_result', '234 = 200 + 30 + 4', -4.75, -6.55, 14, AMBER)
label('digits_formula', 'number = weighted_sum(digits, [100, 10, 1])', -4.75, -9, 11, GRAY, 7.8, -1)

# Spring equilibrium: a bead held by three springs
def spring(a, b, zigs, width=0.22):
    """The corners of a zigzag from a to b: a straight lead at each end and `zigs` turns between."""
    (ax, ay), (bx, by) = a, b
    dx, dy = bx - ax, by - ay
    length = math.hypot(dx, dy)
    nx, ny = -dy / length * width, dx / length * width
    pts = [(ax, ay), (ax + 0.14 * dx, ay + 0.14 * dy)]
    for k in range(zigs):
        t = 0.14 + 0.72 * (k + 0.5) / zigs
        s = 1 if k % 2 == 0 else -1
        pts.append((ax + t * dx + s * nx, ay + t * dy + s * ny))
    return pts + [(ax + 0.86 * dx, ay + 0.86 * dy), (bx, by)]

bead_xy = (5.3667, -5.2167)
anchors = [(3.2, -3.3), (7, -3.5), (5, -7)]
label('springs', 'Spring equilibrium', 4.9, -1.2, 15)
for k, (anchor, zigs) in enumerate(zip(anchors, [6, 10, 14])):
    corners = [pie.point(x, y, out=f'spring{k}_{j}', hidden=True) for j, (x, y) in enumerate(spring(bead_xy, anchor, zigs))]
    pie.polyline(corners, out=f'spring{k}', stroke=CYAN)
    pie.point(*anchor, out=f'anchor{k}', fill=GRAY)
bead = pie.point(*bead_xy, out='bead', fill=AMBER)
pie.circle(bead, 0.24, out='bead_circle', fill=AMBER, stroke=AMBER)
for k, (text, x, y, color) in enumerate([('a₁', 2.85, -3, GRAY), ('a₂', 7.35, -3.15, GRAY), ('a₃', 5, -7.45, GRAY),
                                         ('k₁ = 1', 3.55, -3.95, TEAL), ('k₂ = 2', 6.7, -4.2, TEAL), ('k₃ = 3', 6.05, -6.3, TEAL)]):
    label(f'spring_label{k}', text, x, y, 11, color)
label('springs_formula', 'rest point = weighted_sum(anchors, normalized stiffness)', 4.9, -9, 11, None, 7.6, -1)
```

### 1.2.1. Indexing

Given an array `array = [x,y,z]`, its `i-th` element (counting from 0) is `array[i]`. This can be seen as a weighted sum where the weight corresponding to the `i-th` element is 1 and all other weights are zero.

```python
array, weights = [2,3,5], [0,0,1]
index = 2
# this is the same as 
# array_at_index = array[index]
array_at_index = get_weighted_sum(
    array, weights, 
    scale_function = scale, 
    add_function = add
)
```

### 1.2.2. Expected value of a random variable

Given a six-sided die with values $[1,2,3,4,5,6]$ and probabilities $[p_1, p_2, p_3, p_4, p_5, p_6]$, the expected value is:

```python
expected_value = get_weighted_sum(
    values, probs, 
    scale_function = scale, 
    add_function = add
)
```

---

Now let's look at some examples of weighted sums of arrays of numbers:

### 1.2.3. Rotation

A point on a unit circle with center at origin is given by $[\cos(\theta), \sin(\theta)]$. It can be seen as a weighted sum of two arrays $[1,0]$ and $[0,1]$ (what are the corresponding weights?):

```python
import math
v1, v2 = [1,0], [0,1]
angle_in_radians = math.pi / 6
weights = [math.cos(angle_in_radians), math.sin(angle_in_radians)]
get_weighted_sum(
    [v1, v2], weights, 
    scale_function = scale_array, 
    add_function = add_arrays
)
```

### 1.2.4. Polynomials

A polynomial itself is nothing but a weighted sum: 

$$p(x) = \textcolor{#1d4ed8}{a} + \textcolor{#be185d}{b}.x + \textcolor{#047857}{c}.x^2 + \textcolor{#b45309}{d}.x^3 + ... = \text{weighted\_sum}([\textcolor{#1d4ed8}{a},\textcolor{#be185d}{b},\textcolor{#047857}{c},\textcolor{#b45309}{d},...], [1,x,x^2,x^3,...])$$

But a more interesting thing to note is that two or more polynomials can be scaled and added just like arrays of numbers. Given two polynomials

- $p(x) = \textcolor{#1d4ed8}{p_1} + \textcolor{#be185d}{p_2}.x + \textcolor{#047857}{p_3}.x^2 + \textcolor{#b45309}{p_4}.x^3$
- $q(x) = \textcolor{#1d4ed8}{q_1} + \textcolor{#be185d}{q_2}.x + \textcolor{#047857}{q_3}.x^2 + \textcolor{#b45309}{q_4}.x^3$

their sum is given by:

$$p(x) + q(x) = (\textcolor{#1d4ed8}{p_1} + \textcolor{#1d4ed8}{q_1}) + (\textcolor{#be185d}{p_2} + \textcolor{#be185d}{q_2}).x + (\textcolor{#047857}{p_3} + \textcolor{#047857}{q_3}).x^2 + (\textcolor{#b45309}{p_4} + \textcolor{#b45309}{q_4}).x^3$$

Similarly, a polynomial can be scaled by a weight $\textcolor{#0d9488}{w}$ like so:

$$\textcolor{#0d9488}{w} . p(x) = \textcolor{#0d9488}{w}.\textcolor{#1d4ed8}{p_1} + \textcolor{#0d9488}{w}.\textcolor{#be185d}{p_2}x + \textcolor{#0d9488}{w}.\textcolor{#047857}{p_3}x^2 + \textcolor{#0d9488}{w}.\textcolor{#b45309}{p_4}x^3$$

---

## 1.3. A new format for weighted sums

A good format can greatly influence the ease of grasping an idea. Using an array of arrays seems a bit cumbersome. It obfuscates some _obvious_ properties of scaling and adding arrays. Let's use a different format to represent an array. We will represent the array `[x1,x2,x3]` as:

$$\begin{bmatrix} x_1 \\ x_2 \\ x_3 \end{bmatrix}$$

The format for scaling `[x1,x2,x3]` with a weight `w` is:

$$\textcolor{#0d9488}{w} . \begin{bmatrix} x_1 \\ x_2 \\ x_3 \end{bmatrix} = \begin{bmatrix} \textcolor{#0d9488}{w} . x_1 \\ \textcolor{#0d9488}{w} . x_2 \\ \textcolor{#0d9488}{w} . x_3 \end{bmatrix}$$

The format for adding two (or more) arrays `[x1, x2, x3]` and `[y1, y2, y3]`

$$\begin{bmatrix} x_1 \\ x_2 \\ x_3 \end{bmatrix} + \begin{bmatrix} y_1 \\ y_2 \\ y_3 \end{bmatrix} + ... = \begin{bmatrix} x_1 + y_1 + ...\\ x_2 + y_2 + ... \\ x_3 + y_3 + ... \end{bmatrix}$$

---

## 1.4. Some observations

First thing to note with this choice of scale and add - each item is itself a weighted mean

$$\textcolor{#0d9488}{w_1} . \begin{bmatrix} x_1 \\ x_2 \\ x_3 \end{bmatrix} + \textcolor{#0d9488}{w_2} . \begin{bmatrix} y_1 \\ y_2 \\ y_3 \end{bmatrix} = \begin{bmatrix} \textcolor{#0d9488}{w_1}.x_1 + \textcolor{#0d9488}{w_2}.y_1 \\ \textcolor{#0d9488}{w_1}.x_2 + \textcolor{#0d9488}{w_2}.y_2 \\ \underbrace{\textcolor{#0d9488}{w_1}.x_3 + \textcolor{#0d9488}{w_2}.y_3}_{\text{\textcolor{#1d4ed8}{weighted sum}}} \end{bmatrix}$$

This observation allows us to implement `get_weighted_sum` for an array of arrays in yet another way which is hard to understand:

#### Hard to understand implementation
```python
def get_weighted_sum_for_array_of_arrays(array_of_arrays, weights):
    return [
        get_weighted_sum(
            [array[i] for array in array_of_arrays], 
            weights, 
            scale_function=scale, 
            add_function=add
        ) 
        for i in range(len(array_of_arrays[0]))
    ]
```

It is easy to see what we are trying to say using our newly concocted format:

$$\text{weighted\_sum}(\begin{bmatrix} \begin{bmatrix} \textcolor{#1d4ed8}{x_1} \\ \textcolor{#1d4ed8}{x_2} \\ \textcolor{#1d4ed8}{x_3} \end{bmatrix}, \begin{bmatrix} \textcolor{#be185d}{y_1} \\ \textcolor{#be185d}{y_2} \\ \textcolor{#be185d}{y_3} \end{bmatrix} \end{bmatrix}, \begin{bmatrix} \textcolor{#1d4ed8}{w_1} \\ \textcolor{#be185d}{w_2} \end{bmatrix}) = \begin{bmatrix} \text{weighted\_sum}([\textcolor{#1d4ed8}{x_1}, \textcolor{#be185d}{y_1}], [\textcolor{#1d4ed8}{w_1}, \textcolor{#be185d}{w_2}]) \\ \text{weighted\_sum}([\textcolor{#1d4ed8}{x_2}, \textcolor{#be185d}{y_2}], [\textcolor{#1d4ed8}{w_1}, \textcolor{#be185d}{w_2}]) \\ \text{weighted\_sum}([\textcolor{#1d4ed8}{x_3}, \textcolor{#be185d}{y_3}], [\textcolor{#1d4ed8}{w_1}, \textcolor{#be185d}{w_2}]) \end{bmatrix}$$

We can simplify the format even more by stacking all the arrays as columns and removing the text $weighted\_sum$ since it is all what we have been talking about.

$$\text{weighted\_sum}(\begin{bmatrix} \begin{bmatrix} \textcolor{#1d4ed8}{x_1} \\ \textcolor{#1d4ed8}{x_2} \\ \textcolor{#1d4ed8}{x_3} \end{bmatrix}, \begin{bmatrix} \textcolor{#be185d}{y_1} \\ \textcolor{#be185d}{y_2} \\ \textcolor{#be185d}{y_3} \end{bmatrix} \end{bmatrix}, \begin{bmatrix} \textcolor{#1d4ed8}{w_1} \\ \textcolor{#be185d}{w_2} \end{bmatrix}) = \underbrace{\begin{bmatrix} \textcolor{#1d4ed8}{x_1} & \textcolor{#be185d}{y_1} \\ \textcolor{#1d4ed8}{x_2} & \textcolor{#be185d}{y_2} \\ \textcolor{#1d4ed8}{x_3} & \textcolor{#be185d}{y_3} \end{bmatrix}}_{\text{stack as columns}} \begin{bmatrix} \textcolor{#1d4ed8}{w_1} \\ \textcolor{#be185d}{w_2} \end{bmatrix}$$

---

### 1.4.1. Who is scaling whom?

Note that an array of numbers `values = [x,y,z]` scaled by `weights = [w1, w2, w3]` and then summed up is the same as `weights` scaled by `values` and then summed up:

$$\text{weighted\_sum}(\textcolor{#1d4ed8}{values},\textcolor{#0d9488}{weights}) = \text{weighted\_sum}(\textcolor{#0d9488}{weights},\textcolor{#1d4ed8}{values})$$

Using our new format, we can show this as:

$$\begin{bmatrix} \textcolor{#1d4ed8}{x} & \textcolor{#1d4ed8}{y} & \textcolor{#1d4ed8}{z} \end{bmatrix} \begin{bmatrix} \textcolor{#0d9488}{w_1} \\ \textcolor{#0d9488}{w_2} \\ \textcolor{#0d9488}{w_3} \end{bmatrix} = \begin{bmatrix} \textcolor{#0d9488}{w_1} & \textcolor{#0d9488}{w_2} & \textcolor{#0d9488}{w_3} \end{bmatrix} \begin{bmatrix} \textcolor{#1d4ed8}{x} \\ \textcolor{#1d4ed8}{y} \\ \textcolor{#1d4ed8}{z} \end{bmatrix}$$

This seemingly innocous equation has some really beautiful interpretations as we will see next. 

---

## 1.5. What was this all about? What's next?

We began with taking weighted sums of numbers and then moved on to taking weighted sums of arrays. When we realized the code was getting messier, we came up with a different way to represent weighted sums of arrays. This new format made it easier to look at what was going on. It also enabled us to do some simple algebra on arrays.

### 1.5.1 Giving arrays a geometric setting

The arrays `[1,1,1]` and `[2,2,2]` seem quite similar in some way. In fact they are just scaled versions of each other. 

Similarly `[1,2,3]` and `[0.9, 2, 3.1]` seem to be _close_ to each other. This is because the values in the arrays are quite similar. 

In order to draw some insights from these observations, a good way is to visualize them. In other words, we give these arrays some _geometry_. This geometry when combined with the algebra using the format we came up with gives rise to some beautiful things. 

---

[← 0. Introduction](/la/0_intro)  ·  [2. Geometry of weighted sums →](/la/2_spacewalk)
