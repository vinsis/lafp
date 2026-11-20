---
title: 3D transformations with a 4x4 matrix
description: Turn, move and scale a teapot with 4×4 matrices, then project it onto the screen with a camera and a perspective matrix.
date: 2026-11-20
tags: #3d #cv #tool
canvas: right
---

# 3D transformations with a $4 \times 4$ matrix

Every point of the teapot is a vector $(x, y, z, 1)$. Scaling, turning and moving it are each a 4×4 matrix, and so are the camera and the perspective. Change the order to see that $TRS$ and $RTS$ are not the same.

```python-editor collapsed
import json
import numpy as np
from pyodide.http import open_url

def load_obj(url):
    """An OBJ file's vertices (n×3) and triangles (m×3 vertex indices, counted from 0)."""
    V, F = [], []
    for line in open_url(url):
        p = line.split()
        if p and p[0] == 'v':
            V.append([float(t) for t in p[1:4]])
        elif p and p[0] == 'f':
            F.append([int(t.split('/')[0]) - 1 for t in p[1:4]])
    return np.array(V), np.array(F)

def bmatrix(M):
    """M as a LaTeX matrix, to 2 decimals."""
    rows = (' & '.join(f'{v + 0:.2f}' for v in row) for row in M)
    return r'\begin{bmatrix}' + r' \\ '.join(rows) + r'\end{bmatrix}'
```

```python-editor
V, F = load_obj('/models/teapot.obj')
V = V - (V.min(axis=0) + V.max(axis=0)) / 2    # centered on the origin
V = V / np.abs(V).max()                         # inside the cube [-1, 1]³

def scale(s):
    return np.diag([s, s, s, 1.])

def rotate_y(deg):
    """Turns about the y-axis, which points up."""
    c, s = np.cos(np.radians(deg)), np.sin(np.radians(deg))
    return np.array([[c, 0, s, 0], [0, 1, 0, 0], [-s, 0, c, 0], [0, 0, 0, 1]])

def rotate_x(deg):
    """Tilts about the x-axis, which points right."""
    c, s = np.cos(np.radians(deg)), np.sin(np.radians(deg))
    return np.array([[1, 0, 0, 0], [0, c, -s, 0], [0, s, c, 0], [0, 0, 0, 1]])

def translate(x, y, z):
    """Moves by (x, y, z). Only possible as a matrix product thanks to the 1 in each point (x, y, z, 1)."""
    T = np.eye(4)
    T[:3, 3] = [x, y, z]
    return T

def perspective(fov, near=0.1, far=100):
    """Fits what a camera looking down -z sees into the cube [-1, 1]³. It sets w to the depth, so dividing by w
    shrinks far things."""
    f = 1 / np.tan(np.radians(fov) / 2)
    return np.array([[f, 0, 0, 0], [0, f, 0, 0],
                     [0, 0, (far + near) / (near - far), 2 * far * near / (near - far)], [0, 0, -1, 0]])

# The order of the model matrices. The rightmost acts first.
ORDERS = {
    'T R S: scale, turn, then move': lambda T, R, S: T @ R @ S,
    'R T S: scale, move, then turn about the origin': lambda T, R, S: R @ T @ S,
}

def model(order, turn, tilt, move, size):
    """The model matrix M: where each point of the teapot goes in the world."""
    return ORDERS[order](translate(move, 0, 0), rotate_x(tilt) @ rotate_y(turn), scale(size))

def camera(distance, fov):
    """The camera, at z = distance looking at the origin, then the perspective."""
    return perspective(fov) @ translate(0, 0, -distance)

def formula(order, turn, tilt, move, size):
    """M as the product of T, R and S in the chosen order, each matrix written out."""
    letters = order.split(':')[0].replace(' ', '')
    matrices = {'T': translate(move, 0, 0), 'R': rotate_x(tilt) @ rotate_y(turn), 'S': scale(size)}
    return f'M = {letters} = ' + ''.join(bmatrix(matrices[l]) for l in letters)

pie.clear()
pie.scalar(0, out='gridOpacity')   # the grid is flat; the teapot isn't
order = pie.text(list(ORDERS)[0], out='order')
turn, tilt = pie.scalar(30, out='turn'), pie.scalar(20, out='tilt')
move, size = pie.scalar(0, out='move'), pie.scalar(1, out='size')
distance, fov = pie.scalar(4, out='distance'), pie.scalar(45, out='fov')

# Each point p is drawn at (camera · M · p), divided by its w. pie.mesh does that for every vertex,
# draws the triangles farthest first, and shades them.
teapot = pie.text(json.dumps({'vertices': V.round(4).tolist(), 'faces': F.tolist()}), out='teapot')
M = pie.lift(model, pie.Array[pie.Scalar])(order, turn, tilt, move, size)
C = pie.lift(camera, pie.Array[pie.Scalar])(distance, fov)
pie.mesh(teapot, M, C)

pie.ui.dropdown(order, options=list(ORDERS), label='Order')
pie.ui.slider(turn, min=-180, max=180, step=1, label='turn')
pie.ui.slider(tilt, min=-90, max=90, step=1, label='tilt')
pie.ui.slider(move, min=-1.5, max=1.5, step=0.05, label='move x')
pie.ui.slider(size, min=0.3, max=1.5, step=0.05, label='size')
pie.ui.slider(distance, min=3, max=10, step=0.1, label='camera distance')
pie.ui.slider(fov, min=20, max=100, step=1, label='field of view')
pie.ui.latex(pie.lift(formula, pie.Text)(order, turn, tilt, move, size))
```
