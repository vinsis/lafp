---
title: 0. Introduction
canvas: left
---

# 0. Introduction

Welcome!

```python-editor collapsed
pie.clear()
pie.scalar(0, out='gridOpacity')
BLUE, AMBER, TEAL, GRAY = '#1d4ed8', '#b45309', '#0d9488', '#71717a'

# A grid transformed by a matrix
grid = [[pie.point(-5.28 + 0.92 * i + 0.36 * j, 1.6 + 0.2 * i + 0.8 * j, out=f'grid_{i}{j}', hidden=True) for j in range(3)] for i in range(3)]
for i in range(3):
    pie.line(grid[i][0], grid[i][2], out=f'grid_v{i}', stroke=BLUE)
    pie.line(grid[0][i], grid[2][i], out=f'grid_h{i}', stroke=BLUE)

# A circle mapped to an ellipse
ce_center = pie.point(0, 2.6, out='ce_center', hidden=True)
pie.circle(ce_center, 1, out='ce_circle', stroke=GRAY)
pie.la_mat_to_ellipse([[1.125, 0.45], [0.135, 0.765]], ce_center, out='ce_ellipse', stroke=AMBER)

# The principal axes of an ellipse
pa_center = pie.point(4, 2.6, out='pa_center', hidden=True)
pie.la_mat_to_ellipse([[1.105, 0.34], [0.34, 0.7225]], pa_center, out='pa_ellipse', stroke=GRAY)
pie.la_vec2d(1.1254, 0.6585, 4, 2.6, out='pa_major', stroke=TEAL)
pie.la_vec2d(-0.2646, 0.4522, 4, 2.6, out='pa_minor', stroke=BLUE)

# Projection of a vector onto a line
pie.line(pie.point(-5.274, -3.046, out='proj_a', hidden=True), pie.point(-2.726, -2.154, out='proj_b', hidden=True), out='proj_line', stroke=GRAY)
pie.la_vec2d(0.35, 1.15, -4, -2.6, out='proj_vec', stroke=BLUE)
pie.la_vec2d(0.6704, 0.2346, -4, -2.6, out='proj_onto', stroke=AMBER)
pie.line(pie.point(-3.65, -1.45, out='proj_tip', hidden=True), pie.point(-3.3296, -2.3654, out='proj_foot', hidden=True), out='proj_drop', stroke=GRAY)

# Power iteration turning a vector towards an eigenvector
steps = [(0.1891, 1.1345), (0.5883, 0.9881), (0.8013, 0.825), (0.8979, 0.7185), (0.9426, 0.6587)]
for k, (x, y) in enumerate(steps):
    pie.la_vec2d(x, y, 0, -2.6, out=f'pow_{k}', stroke=TEAL if k == len(steps) - 1 else BLUE)
pie.line(pie.point(-1.1154, -3.2669, out='pow_eig_a', hidden=True), pie.point(1.1154, -1.9331, out='pow_eig_b', hidden=True), out='pow_eig_line', stroke=TEAL)

# A rotation
rot_center = pie.point(4, -2.6, out='rot_center', hidden=True)
pie.arc(rot_center, 1.1, 20, 105, out='rot_arc', stroke=GRAY)
pie.la_vec2d(1.0337, 0.3762, 4, -2.6, out='rot_start', stroke=BLUE)
pie.la_vec2d(-0.2847, 1.0625, 4, -2.6, out='rot_end', stroke=AMBER)

pie.text('Linear algebra, visually', 0, 5.3, 16, out='title')
captions = [('grid transform', -4, 0.9), ('circle → ellipse', 0, 0.9), ('principal axes', 4, 0.9),
            ('projection', -4, -4.25), ('power iteration', 0, -4.25), ('rotation', 4, -4.25)]
for k, (caption, x, y) in enumerate(captions):
    pie.text(caption, x, y, 11, out=f'cap_{k}', stroke=GRAY)
```

> Linear algebra stands today as the epitome of accessible yet powerful mathematical theory. It has many appealing facets which radiate in different directions. 
>
> [Alan Tucker](https://www.math.miami.edu/~armstrong/210fa19/tucker.pdf)

Linear algebra is one of the most useful topics you will ever learn if you work in technology. It is a foundational skill for areas like scientific computing and machine learning. It also sets the stage to build more sophisticated ideas in applied and pure sciences. 

---

## What can one do with it
Linear Algebra provides a powerful set of problem-solving tools. By mastering it and integrating it with programming, one will gain invaluable problem-solving skills that can be applied in a multitude of real-world scenarios.

#### Detour: the lens of linearity
There is a pervasive belief in the scientific (and maybe philosophical?) community that we look at the world through the lens of linearity. We know how to solve linear problems, and we solve a non-linear problem by approximating it to a linear problem. Linear algebra is the mathematical machinery that powers this lens.

It also forms the bedrock of modern computing and AI. The software behind it has an impressive amount of engineering ingenuity the enables efficiently implementing matrix calculus and calculating matrix products at scale. 

---

## Prerequisites
- You are expected to be familiar with basic geometry and trigonometry.
- If you understand simple code snippets in Python, that will help a lot. If you cannot, you can just ignore the code snippets and move on.

These code snippets serve as an additional tool for explanation. There is no explanation on how the code is written. For example, the following code snippet illustrates the _iterative_ aspect of matrix-matrix product:

```python
def get_matrix_matrix_product(left_matrix, right_matrix): 
    return [
        get_matrix_vector_product(left_matrix, column_vector) 
        for column_vector in right_matrix
    ]
```

If you can understand this code, that's great. But if you can't, you can still rely on plain text and the good old latex.

#### Comparison with other resources
Some other great resources worth mentioning here are:
- [MIT OCW Course](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/) by the legendary Prof. Gilbert Strang: This is without a doubt one of the best courses out there to learn linear algebra. And its totally free of cost.
- [Linear Algebra Done Right](https://linear.axler.net/) by Sheldon Axler: This is a great textbook but it may be a bit overwhelming for an absolute beginner.
- [Essence of Linear Algebra](https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab) by 3blue1brown: It's a great starting point but it only provides a basic introduction to the topic.

Why this series then?
- It covers more applied topics and problems like Barycentric co-ordinates, Bezier curves, inverse of transpose of a matrix etc.
- The digital medium allows using visual aids, animations and an interactive format to convey information in a more engaging and intuitive way.
- It is fully contained and comprehensive - by the end of this series, you will know enough linear algebra required to become a data scientist.

---

## Visualization and interactivity
Each page has a canvas, and the text has Python editors that draw on it. Press Run in the editor below to draw a simple vector. You can change the code and run it again.

```python-editor
pie.clear()
pie.la_vec2d(2, 2, out='vec')
```

Editors on a page share the same canvas and the same Python variables, so an editor can build on the figure drawn by the one above it. Run them in order.

#### Open source implementation
The implementation of these commands is [fully open source](https://github.com/TinyVolt/geomatic-math-extensions/blob/main/src/linear-algebra.ts). You can also define your own functions and play with them in the editor using extensions.

---

[1. Weighted means →](/la/1_weighted_means)
