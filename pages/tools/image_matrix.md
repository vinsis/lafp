---
title: Matrix operations on an image
description: Matrix operations like SVD, blur, sharpen, flip and color transformations are shown here.
date: 2026-11-20
tags: #2d #cv #tool
---

# Matrix operations on an image

An image is a 3D tensor that can also be seen as three matrices of shape $(w, h)$ stacked together or $3D$ vectors arranged in a $w \times h$ grid. Different operations acting on either of these two views are shown.

```python-editor collapsed
import base64, io
from functools import lru_cache
import numpy as np
from PIL import Image

SIZE = 128   # the longer side of the image, in pixels

@lru_cache(maxsize=2)
def decode(url):
    """The image in data URL `url`, scaled so its longer side is SIZE, as an array of shape (height, width, 3)
    in [0, 1]. Transparent parts become white."""
    image = Image.open(io.BytesIO(base64.b64decode(url.split(',', 1)[1]))).convert('RGBA')
    image = Image.alpha_composite(Image.new('RGBA', image.size, 'white'), image).convert('RGB')
    scale = SIZE / max(image.size)
    image = image.resize((max(1, round(image.width * scale)), max(1, round(image.height * scale))))
    return np.asarray(image) / 255

def encode(X):
    """X, an array of shape (height, width, 3), as a BMP data URL: uncompressed, so quick to make.
    Values are clipped to [0, 1]."""
    buffer = io.BytesIO()
    Image.fromarray((np.clip(X, 0, 1) * 255).round().astype(np.uint8)).save(buffer, format='BMP')
    return 'data:image/bmp;base64,' + base64.b64encode(buffer.getvalue()).decode()

def per_channel(f, X):
    """f applied to the red, green and blue matrices of X."""
    return np.stack([f(X[:, :, c]) for c in range(3)], axis=2)

def band(n, k):
    """An n×n matrix whose row i averages entries i-k to i+k: a band along the diagonal."""
    i = np.arange(n)
    B = (abs(i[:, None] - i[None, :]) <= k).astype(float)
    return B / B.sum(axis=1, keepdims=True)

def reverse(n):
    """The n×n permutation matrix that reverses order: the identity, flipped."""
    return np.eye(n)[::-1]

_factors = {}

def factors(X):
    """U, s, Vᵀ of each color matrix of X. Computed once per image: moving k only changes how many terms are kept."""
    hit = _factors.get(id(X))
    if hit is None or hit[0] is not X:
        _factors.clear()
        hit = _factors[id(X)] = (X, [np.linalg.svd(X[:, :, c], full_matrices=False) for c in range(3)])
    return hit[1]

def svd(X, k):
    """Each color matrix cut to its top k singular values: the closest matrix of rank k."""
    return np.stack([U[:, :k] * s[:k] @ Vt[:k] for U, s, Vt in factors(X)], axis=2)

def blur(X, k):
    """B X Bᵀ: B averages each pixel with k neighbors above and below, Bᵀ with k to the left and right."""
    Bh, Bw = band(X.shape[0], k), band(X.shape[1], k)
    return per_channel(lambda C: Bh @ C @ Bw.T, X)

def sharpen(X, k):
    """X + (X - B X Bᵀ): adds back what blurring takes away."""
    return 2 * X - blur(X, k)

def flip(X, k):
    """P X: P reverses the order of the rows."""
    P = reverse(X.shape[0])
    return per_channel(lambda C: P @ C, X)

def mirror(X, k):
    """X P: P reverses the order of the columns."""
    P = reverse(X.shape[1])
    return per_channel(lambda C: C @ P, X)

def transpose(X, k):
    """Xᵀ: rows become columns."""
    return per_channel(lambda C: C.T, X)

def recolor(C):
    """Multiplies each pixel, a vector (red, green, blue), by the 3×3 matrix C."""
    return lambda X, k: X @ C.T

# 3×3 color matrices.
COLORS = {
    'grayscale': np.array([[0.299, 0.587, 0.114]] * 3),
    'sepia': np.array([[0.393, 0.769, 0.189], [0.349, 0.686, 0.168], [0.272, 0.534, 0.131]]),
    'swap red and blue': np.array([[0., 0, 1], [0, 1, 0], [1, 0, 0]]),
}

def bmatrix(M):
    """M as a LaTeX matrix."""
    rows = (' & '.join(f'{v:g}' for v in row) for row in M)
    return r'\begin{bmatrix}' + r' \\ '.join(rows) + r'\end{bmatrix}'

# Each operation: what it does to the image, the matrix it multiplies by (or None), and its formula.
OPERATIONS = {
    'SVD: keep the top k singular values': (svd, None, r'X_k = \sum_{i=1}^{k} \sigma_i u_i v_i^T'),
    'Blur': (blur, lambda X, k: band(X.shape[0], k), r'B X B^T'),
    'Sharpen': (sharpen, lambda X, k: band(X.shape[0], k), r'X + (X - B X B^T)'),
    'Flip upside down': (flip, lambda X, k: reverse(X.shape[0]), r'P X'),
    'Mirror left to right': (mirror, lambda X, k: reverse(X.shape[1]), r'X P'),
    'Transpose': (transpose, None, r'X^T'),
    **{f'Colors: {name}': (recolor(C), None, r'p \mapsto ' + bmatrix(C) + r'\, p') for name, C in COLORS.items()},
}
USES_K = {svd, blur, sharpen}

def uses_k(op):
    """1 if the operation uses k, else 0."""
    return float(OPERATIONS[op][0] in USES_K)

def original(img):
    """The image as the operations see it: scaled to SIZE."""
    return encode(decode(img)) if img else ''

def result(op, img, k):
    """The image after the operation."""
    if not img:
        return ''
    return encode(OPERATIONS[op][0](decode(img), int(k)))

@lru_cache(maxsize=64)
def matrix(op, img, k):
    """The matrix the operation multiplies by, as an image: dark where its entries are large. Empty if it has none.
    Cached, so going back to an operation, image and k seen before costs nothing."""
    make = OPERATIONS[op][1]
    if not img or make is None:
        return ''
    M = make(decode(img), int(k))
    gray = 1 - M / M.max()
    return encode(np.repeat(gray[:, :, None], 3, axis=2))

def formula(op, k):
    """The operation's formula, with k if it uses it."""
    fn, _, tex = OPERATIONS[op]
    return tex + (rf'\qquad k = {int(k)}' if fn in USES_K else '')

img = pie.text('', out='img')   # the image as a data URL, filled by the upload UI
op = pie.text(list(OPERATIONS)[0], out='op')
k = pie.scalar(10, out='k')

# Every lift is made before the upload UI shows, since it writes `img` as soon as it loads its image.
show_k = pie.lift(uses_k, pie.Scalar)(op)
tex = pie.lift(formula, pie.Text)(op, k)
shown = [pie.lift(original, pie.Text)(img), pie.lift(matrix, pie.Text)(op, img, k), pie.lift(result, pie.Text)(op, img, k)]

pie.ui.image_upload(img, src='/blog/plane.jpg')
pie.ui.dropdown(op, options=list(OPERATIONS), label='Operation')
pie.ui.slider_if(k, show_k, min=1, max=40, step=1, label='k')
pie.ui.latex(tex)
pie.ui.images(*shown, captions=['Image', 'Matrix', 'Result'])
```
