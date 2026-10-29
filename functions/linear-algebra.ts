import { BlueprintNode, Node2NodeFunc } from '~/lib/nodes/functions/Node2NodeFunc';
import { AnyNode, ArrayNode, PointNode, ScalarNode, TextNode } from '~/lib/nodes/state/Node';
import { Dtype, add, atan2, cos, div, maximum, mul, num, ref, scalar, sin, sqrt, sub } from '~/lib/nodes/jax';
import type { ArrowNode } from '../nodes/linear-algebra';

// Ported from geomatic-math-extensions `src/linear-algebra.ts`. A keyword there, `la-vec2d`,
// is `la_vec2d` here. Only the functions the ebook pages use so far.
//
// Points the source marks `hidden` are written inline in the node that uses them, not as
// nodes of their own, so they aren't drawn. Items of an output Array are nodes of their own,
// so Python can index them.

// Default arrow colors. `stroke=` from Python wins over them.
const VEC_COLOR = '#0d9488';  // vectors, and the scaled columns of a weighted sum
const SUM_COLOR = '#b45309';  // resultant of a weighted sum
const ISO_AXIS_COLOR = '#71717a';     // 3D axes
const ISO_FACE_COLOR = '#0d9488';     // near z-face edges of a cube
const ISO_FAR_FACE_COLOR = '#b45309'; // far z-face edges
const ISO_CONNECT_COLOR = '#6d28d9';  // edges between the two z-faces
const ISO_COS30 = Math.sqrt(3) / 2;

// ---------------------------------------------------------------------------
// Helpers. Some are exported for `geometric-algebra.ts`; the registry skips them, as they have no keyword.
// jax-js frees an array once an op uses it, so every value read more than once goes through `ref`.
// ---------------------------------------------------------------------------

export const neg = (a: Dtype): Dtype => sub(scalar(0), a);

const point = (x: Dtype, y: Dtype) => ({ type: 'Point', x, y });

const arrow = (p1: object, p2: object, color = VEC_COLOR) => ({ type: 'Arrow', p1, p2, color });

/** The values of an Array of Scalars, row-major. */
export function scalarValues(array: ArrayNode, keyword: string): Dtype[] {
  if (array.itemType !== 'Scalar') {
    throw new Error(`${keyword}: expected an array of scalars, got an array of ${array.itemType}`);
  }
  return array.items.map((item) => (item as ScalarNode).value);
}

function pointItems(array: ArrayNode, keyword: string): PointNode[] {
  if (array.itemType !== 'Point') {
    throw new Error(`${keyword}: expected an array of points, got an array of ${array.itemType}`);
  }
  return array.items as PointNode[];
}

/** An Array of Scalars holding `values`, row-major. Each item is saved as `el_<i>`. */
export function scalarArray(values: Dtype[], shape: number[]): Record<string, BlueprintNode> {
  const result: Record<string, BlueprintNode> = {};
  const items = values.map((value, i) => (result[`el_${i}`] = { type: 'Scalar', value }));
  result.main = { type: 'Array', itemType: 'Scalar', shape, items };
  return result;
}

/** An Array of the nodes saved under `keys`, which must already be in `result`. */
function arrayOf(result: Record<string, BlueprintNode>, keys: string[], itemType: string) {
  result.main = { type: 'Array', itemType, shape: [keys.length], items: keys.map((key) => result[key]) };
  return result;
}

const degToRad = (deg: Dtype): Dtype => div(mul(ref(deg), scalar(Math.PI)), scalar(180));

/**
 * True isometric projection: +x runs up-right, +y up-left, +z straight down; the axes sit 120° apart.
 *   screenX = (√3/2)·(x − y),  screenY = (x + y)/2 − z
 */
function isometricProject(x: Dtype, y: Dtype, z: Dtype): { x: Dtype; y: Dtype } {
  return {
    x: mul(scalar(ISO_COS30), sub(ref(x), ref(y))),
    y: sub(div(add(ref(x), ref(y)), scalar(2)), ref(z)),
  };
}

/**
 * The 12 edges of a cube with corners `corners[idx]`, idx = i + 2j + 4k; an edge joins corners
 * one bit apart. Colored by group: near z-face (bit 4 set), far z-face, and the connectors between.
 * Saves each edge as `edge_<a>_<b>` and returns the keys.
 */
function cubeEdges(result: Record<string, BlueprintNode>, corners: object[]): string[] {
  const keys: string[] = [];
  for (let a = 0; a < 8; a++) {
    for (const bit of [1, 2, 4]) {
      const b = a ^ bit;
      if (a >= b) continue;
      const color = bit === 4 ? ISO_CONNECT_COLOR : (a & 4) ? ISO_FACE_COLOR : ISO_FAR_FACE_COLOR;
      const key = `edge_${a}_${b}`;
      result[key] = { type: 'ColoredLine', p1: corners[a], p2: corners[b], color };
      keys.push(key);
    }
  }
  return keys;
}

/** atan2 that gives 0 at (0, 0), like `Math.atan2`. jax-js gives NaN there. */
const atan2Safe = (y: Dtype, x: Dtype): Dtype => (num(y) === 0 && num(x) === 0 ? scalar(0) : atan2(y, x));

/** Reshape a flat, row-major list into a rows×cols 2D list. */
function reshape<T>(flat: T[], rows: number, cols: number): T[][] {
  return Array.from({ length: rows }, (_, r) => flat.slice(r * cols, r * cols + cols));
}

function transpose<T>(matrix: T[][]): T[][] {
  if (matrix.length === 0) return [];
  return matrix[0].map((_, c) => matrix.map((row) => row[c]));
}

/** (m×k) · (k×n) → (m×n), plain numbers. */
function matmulNumber(a: number[][], b: number[][]): number[][] {
  return a.map((row) => b[0].map((_, j) => row.reduce((sum, ait, t) => sum + ait * b[t][j], 0)));
}

/** Probability distribution from reals; subtracts the max first, for stability. */
function softmax(values: number[]): number[] {
  const max = Math.max(...values);
  const exps = values.map((v) => Math.exp(v - max));
  const sum = exps.reduce((acc, e) => acc + e, 0);
  return exps.map((e) => e / sum);
}

/** (m×k) · (k×n) → (m×n), differentiable in both. */
function matmulDtype(a: Dtype[][], b: Dtype[][]): Dtype[][] {
  return a.map((row) => b[0].map((_, j) => row.reduce((sum, ait, t) => add(sum, mul(ref(ait), ref(b[t][j]))), scalar(0))));
}

/** The entries [a, b, c, d] of a 2×2 matrix [[a, b], [c, d]]. */
const entries2x2 = (matrix: AnyNode, keyword: string) => scalarValues(matrix as ArrayNode, keyword).slice(0, 4);

/** `n` colors whose hues sweep the color wheel from red, all at the same mid lightness so every hue reads on a light page. */
const rainbowGradient = (n: number): string[] => Array.from({ length: n }, (_, i) => `oklch(0.55 0.14 ${29 + (360 * i) / n})`);

/** (a·x + b·y, c·x + d·y) for plain numbers x, y. */
const transform2x2 = ([a, b, c, d]: Dtype[], x: number, y: number) => point(
  add(mul(ref(a), scalar(x)), mul(ref(b), scalar(y))),
  add(mul(ref(c), scalar(x)), mul(ref(d), scalar(y))),
);

// ---------------------------------------------------------------------------
// Vectors and matrices
// ---------------------------------------------------------------------------

/**
 * A 2D vector (x, y) drawn as an arrow from (offsetX, offsetY) to (offsetX + x, offsetY + y).
 * @param x - X component
 * @param y - Y component
 * @param offsetX - X of the tail; default 0
 * @param offsetY - Y of the tail; default 0
 * @returns Arrow node
 * @auxiliaryNodes None
 */
export const Vector2D: Node2NodeFunc = {
  keyword: 'la_vec2d', outputType: 'Arrow',
  parameters: [
    { name: 'x', type: 'Scalar' }, { name: 'y', type: 'Scalar' },
    { name: 'offsetX', type: 'Scalar', defaultValue: 0 }, { name: 'offsetY', type: 'Scalar', defaultValue: 0 },
  ],
  compute(inputs: AnyNode[]) {
    const [x, y, ox, oy] = (inputs as ScalarNode[]).map((n) => n.value);
    return { main: arrow(point(ref(ox), ref(oy)), point(add(ref(ox), ref(x)), add(ref(oy), ref(y)))) };
  },
};

/**
 * An arrow scaled by a number: the tail stays, the head moves so (head − tail) becomes scale · (head − tail).
 * @param arrow - Arrow node
 * @param scale - Scale factor
 * @returns Arrow node
 * @auxiliaryNodes None
 */
export const ScaleVector2D: Node2NodeFunc = {
  keyword: 'la_scale_vec2d', outputType: 'Arrow',
  parameters: [{ name: 'arrow', type: 'Arrow' }, { name: 'scale', type: 'Scalar' }],
  compute(inputs: AnyNode[]) {
    const { p1, p2 } = inputs[0] as ArrowNode;
    const scale = (inputs[1] as ScalarNode).value;
    const head = point(
      add(ref(p1.x), mul(ref(scale), sub(ref(p2.x), ref(p1.x)))),
      add(ref(p1.y), mul(ref(scale), sub(ref(p2.y), ref(p1.y)))),
    );
    return { main: arrow(point(ref(p1.x), ref(p1.y)), head) };
  },
};

/**
 * A 2×n matrix whose columns are the given points: `pie.la_mat_from_points([a, b, c])`.
 * @param points - Array of points
 * @returns Array of scalars, shape [2, n]: row 0 the x's, row 1 the y's
 * @auxiliaryNodes el_<i> (Scalar nodes)
 */
export const MatrixFromPoints: Node2NodeFunc = {
  keyword: 'la_mat_from_points', outputType: 'Array',
  parameters: [{ name: 'points', type: 'Array' }],
  compute(inputs: AnyNode[]) {
    // Each point is a column: row 0 holds the x's, row 1 the y's.
    const points = pointItems(inputs[0] as ArrayNode, 'la_mat_from_points');
    const xs = points.map((p) => ref(p.x));
    const ys = points.map((p) => ref(p.y));
    return scalarArray([...xs, ...ys], [2, points.length]);
  },
};

/**
 * The n column points of a 2×n matrix. The inverse of `la_mat_from_points`.
 * @param matrix - Array of scalars, shape [2, n]
 * @returns Array of points, shape [n]
 * @auxiliaryNodes pt_<i> (Point nodes)
 */
export const MatrixToPoints: Node2NodeFunc = {
  keyword: 'la_mat_to_points', outputType: 'Array',
  parameters: [{ name: 'matrix', type: 'Array' }],
  compute(inputs: AnyNode[]) {
    const matrix = inputs[0] as ArrayNode;
    const values = scalarValues(matrix, 'la_mat_to_points');
    const n = matrix.shape[1];
    const result: Record<string, BlueprintNode> = {};
    const keys = Array.from({ length: n }, (_, i) => {
      result[`pt_${i}`] = point(ref(values[i]), ref(values[n + i]));
      return `pt_${i}`;
    });
    return arrayOf(result, keys, 'Point');
  },
};

/**
 * Matrix product a · b. A 1D operand is treated like NumPy does: on the left as a row, on the
 * right as a column, falling back to the other reading if the shapes don't fit.
 * @param a - Array of scalars, 1D or 2D
 * @param b - Array of scalars, 1D or 2D
 * @returns Array of scalars, shape [rows, cols]
 * @auxiliaryNodes el_<i> (Scalar nodes)
 */
export const MatMul: Node2NodeFunc = {
  keyword: 'la_matmul', outputType: 'Array',
  parameters: [{ name: 'a', type: 'Array' }, { name: 'b', type: 'Array' }],
  compute(inputs: AnyNode[]) {
    const a = inputs[0] as ArrayNode;
    const b = inputs[1] as ArrayNode;
    const aVals = scalarValues(a, 'la_matmul');
    const bVals = scalarValues(b, 'la_matmul');

    // A 2D array has one reading; a 1D array of length p is a row (1×p) or a column (p×1).
    const candidates = (shape: number[], len: number, preferRow: boolean) => {
      if (shape.length >= 2) return [{ rows: shape[0], cols: shape[1] }];
      const row = { rows: 1, cols: len };
      const col = { rows: len, cols: 1 };
      return preferRow ? [row, col] : [col, row];
    };
    let chosen: { ad: { rows: number; cols: number }; bd: { rows: number; cols: number } } | null = null;
    for (const ad of candidates(a.shape, aVals.length, true)) {
      for (const bd of candidates(b.shape, bVals.length, false)) {
        if (ad.cols === bd.rows) { chosen = { ad, bd }; break; }
      }
      if (chosen) break;
    }
    if (!chosen) throw new Error(`la_matmul: incompatible shapes [${a.shape}] and [${b.shape}]`);

    const product = matmulDtype(reshape(aVals, chosen.ad.rows, chosen.ad.cols), reshape(bVals, chosen.bd.rows, chosen.bd.cols));
    return scalarArray(product.flat(), [product.length, product[0].length]);
  },
};

/**
 * A weighted sum of column vectors drawn as a tip-to-tail chain of scaled columns,
 * plus the resultant from the origin.
 * @param matrix - Array of scalars, shape [2, n]; its columns are the vectors
 * @param weights - Array of n scalars
 * @param colors - Array of n texts, one color per scaled column; default teal for all
 * @returns Arrow node: the resultant (amber)
 * @auxiliaryNodes term_<i> (Arrow nodes, the scaled columns, teal)
 */
export const VisualizeWeightSum: Node2NodeFunc = {
  keyword: 'la_weighted_sum', outputType: 'Arrow',
  parameters: [
    { name: 'matrix', type: 'Array' }, { name: 'weights', type: 'Array' },
    { name: 'colors', type: 'Array', defaultValue: null },
  ],
  compute(inputs: AnyNode[]) {
    const matrix = inputs[0] as ArrayNode;
    const values = scalarValues(matrix, 'la_weighted_sum');
    const w = scalarValues(inputs[1] as ArrayNode, 'la_weighted_sum');
    const colors = (inputs[2] as ArrayNode | undefined)?.items.map((item) => (item as TextNode).value);
    const n = matrix.shape[1];

    // pts[0] is the origin; pts[i + 1] is the running sum after column i.
    const pts = [point(scalar(0), scalar(0))];
    let cx = scalar(0), cy = scalar(0);
    for (let i = 0; i < n; i++) {
      cx = add(ref(cx), mul(ref(w[i]), ref(values[i])));
      cy = add(ref(cy), mul(ref(w[i]), ref(values[n + i])));
      pts.push(point(ref(cx), ref(cy)));
    }

    const result: Record<string, BlueprintNode> = {};
    for (let i = 0; i < n; i++) result[`term_${i}`] = arrow(pts[i], pts[i + 1], colors?.[i]);
    result.main = arrow(pts[0], pts[n], SUM_COLOR);
    return result;
  },
};

/**
 * A 2×2 linear map shown by mapping the integer grid lines over [-5, 5]².
 * @param matrix - Array of scalars, shape [2, 2]
 * @returns Array of Line nodes
 * @auxiliaryNodes line_<i> (Line nodes)
 */
export const VisualizeGridTransform: Node2NodeFunc = {
  keyword: 'la_grid_transform', outputType: 'Array',
  parameters: [{ name: 'matrix', type: 'Array' }],
  compute(inputs: AnyNode[]) {
    const m = entries2x2(inputs[0], 'la_grid_transform');
    const R = 5;
    // One point per lattice point, shared by the lines that meet there.
    const cache = new Map<string, object>();
    const at = (x: number, y: number) => {
      const key = `${x},${y}`;
      if (!cache.has(key)) cache.set(key, transform2x2(m, x, y));
      return cache.get(key)!;
    };

    const result: Record<string, BlueprintNode> = {};
    const keys: string[] = [];
    const addLine = (p1: object, p2: object) => {
      const key = `line_${keys.length}`;
      result[key] = { type: 'Line', p1, p2 };
      keys.push(key);
    };
    for (let i = -R; i <= R; i++) addLine(at(i, -R), at(i, R));   // vertical
    for (let j = -R; j <= R; j++) addLine(at(-R, j), at(R, j));   // horizontal
    return arrayOf(result, keys, 'Line');
  },
};

/**
 * A 2×2 linear map shown as a fan: n points evenly spaced on the unit circle, each mapped by
 * the matrix and joined to the origin. Each line has its own rainbow color.
 * @param matrix - Array of scalars, shape [2, 2]
 * @param n - Number of points
 * @returns Array of ColoredLine nodes, so `pie.hide(fan)` hides every line
 * @auxiliaryNodes line_<i> (ColoredLine nodes)
 */
export const VisualizeCircleTransform: Node2NodeFunc = {
  keyword: 'la_circle_transform', outputType: 'Array',
  parameters: [{ name: 'matrix', type: 'Array' }, { name: 'n', type: 'Scalar' }],
  compute(inputs: AnyNode[]) {
    const m = entries2x2(inputs[0], 'la_circle_transform');
    const n = Math.max(1, Math.round(num((inputs[1] as ScalarNode).value)));
    const result: Record<string, BlueprintNode> = {};
    const keys = rainbowGradient(n).map((color, i) => {
      const theta = (2 * Math.PI * i) / n;
      result[`line_${i}`] = { type: 'ColoredLine', p1: point(scalar(0), scalar(0)), p2: transform2x2(m, Math.cos(theta), Math.sin(theta)), color };
      return `line_${i}`;
    });
    return arrayOf(result, keys, 'ColoredLine');
  },
};

/**
 * Like `la_circle_transform`, but each line joins a point on the unit circle to its image
 * under the matrix.
 * @param matrix - Array of scalars, shape [2, 2]
 * @param n - Number of points
 * @returns Array of ColoredLine nodes, so `pie.hide(fan)` hides every line
 * @auxiliaryNodes line_<i> (ColoredLine nodes)
 */
export const VisualizeCircleTransform2: Node2NodeFunc = {
  keyword: 'la_circle_transform2', outputType: 'Array',
  parameters: [{ name: 'matrix', type: 'Array' }, { name: 'n', type: 'Scalar' }],
  compute(inputs: AnyNode[]) {
    const m = entries2x2(inputs[0], 'la_circle_transform2');
    const n = Math.max(1, Math.round(num((inputs[1] as ScalarNode).value)));
    const result: Record<string, BlueprintNode> = {};
    const keys = rainbowGradient(n).map((color, i) => {
      const theta = (2 * Math.PI * i) / n;
      const x = Math.cos(theta), y = Math.sin(theta);
      result[`line_${i}`] = { type: 'ColoredLine', p1: point(scalar(x), scalar(y)), p2: transform2x2(m, x, y), color };
      return `line_${i}`;
    });
    return arrayOf(result, keys, 'ColoredLine');
  },
};

/**
 * The numbers of an array as a grid of text, e.g. to show a matrix. A 1D array is a column;
 * a 2D array an r×c grid. Values are rounded to at most two decimals.
 * @param array - Array of scalars, 1D or 2D
 * @param x - X of the top-left cell's center
 * @param y - Y of the top-left cell's center
 * @param cellWidth - Distance between columns
 * @param cellHeight - Distance between rows; rows go down
 * @param fontSize - Font size in pixels; default 14
 * @returns Array of Text nodes
 * @auxiliaryNodes text_<r>_<c> (Text nodes)
 */
export const ArrayToTexts: Node2NodeFunc = {
  keyword: 'la_array_to_texts', outputType: 'Array',
  parameters: [
    { name: 'array', type: 'Array' },
    { name: 'x', type: 'Scalar' }, { name: 'y', type: 'Scalar' },
    { name: 'cellWidth', type: 'Scalar' }, { name: 'cellHeight', type: 'Scalar' },
    { name: 'fontSize', type: 'Scalar', defaultValue: 14 },
  ],
  compute(inputs: AnyNode[]) {
    const array = inputs[0] as ArrayNode;
    const [x, y, cellWidth, cellHeight] = (inputs.slice(1, 5) as ScalarNode[]).map((n) => num(n.value));
    const fontSize = { type: 'Scalar', value: scalar(num((inputs[5] as ScalarNode).value)) };
    const values = scalarValues(array, 'la_array_to_texts').map(num);

    let rows: number, cols: number;
    if (array.shape.length === 1) [rows, cols] = [array.shape[0], 1];
    else if (array.shape.length === 2) [rows, cols] = array.shape;
    else throw new Error(`la_array_to_texts: expected a 1D or 2D array, got shape [${array.shape}]`);

    // Integers as-is; others rounded to at most two decimals, trailing zeros dropped.
    const fmt = (v: number) => String(Math.round(v * 100) / 100);
    const result: Record<string, BlueprintNode> = {};
    const keys: string[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const key = `text_${r}_${c}`;
        result[key] = {
          type: 'Text',
          value: fmt(values[r * cols + c]),
          x: { type: 'Scalar', value: scalar(x + c * cellWidth) },
          y: { type: 'Scalar', value: scalar(y - r * cellHeight) },
          fontSize,
          // w = h = 0: plain text, no border
          w: { type: 'Scalar', value: scalar(0) },
          h: { type: 'Scalar', value: scalar(0) },
        };
        keys.push(key);
      }
    }
    return arrayOf(result, keys, 'Text');
  },
};

/**
 * Dot product Σ aᵢ·bᵢ of two vectors of the same length.
 * @param a - Array of scalars
 * @param b - Array of scalars
 * @returns Scalar node
 * @auxiliaryNodes None
 */
export const DotProduct: Node2NodeFunc = {
  keyword: 'la_dot', outputType: 'Scalar',
  parameters: [{ name: 'a', type: 'Array' }, { name: 'b', type: 'Array' }],
  compute(inputs: AnyNode[]) {
    const av = scalarValues(inputs[0] as ArrayNode, 'la_dot');
    const bv = scalarValues(inputs[1] as ArrayNode, 'la_dot');
    if (av.length !== bv.length) {
      throw new Error(`la_dot: vectors must be the same length (got ${av.length} and ${bv.length})`);
    }
    const value = av.reduce((sum, a, i) => add(sum, mul(ref(a), ref(bv[i]))), scalar(0));
    return { main: { type: 'Scalar', value } };
  },
};

/**
 * The projection (v1·v2 / v2·v2) · v2 of v1 onto v2, as an arrow from the origin.
 * Projecting onto the zero vector gives the zero vector.
 * @param v1 - Array of 2 scalars
 * @param v2 - Array of 2 scalars
 * @returns Arrow node
 * @auxiliaryNodes None
 */
export const ProjectV1OnV2: Node2NodeFunc = {
  keyword: 'la_project', outputType: 'Arrow',
  parameters: [{ name: 'v1', type: 'Array' }, { name: 'v2', type: 'Array' }],
  compute(inputs: AnyNode[]) {
    const a = scalarValues(inputs[0] as ArrayNode, 'la_project');
    const b = scalarValues(inputs[1] as ArrayNode, 'la_project');
    if (a.length !== 2 || b.length !== 2) {
      throw new Error(`la_project: expected 2D vectors, got lengths ${a.length} and ${b.length}`);
    }
    const dot = add(mul(ref(a[0]), ref(b[0])), mul(ref(a[1]), ref(b[1])));
    const bb = add(mul(ref(b[0]), ref(b[0])), mul(ref(b[1]), ref(b[1])));
    const scale = num(bb) === 0 ? scalar(0) : div(dot, ref(bb));
    return { main: arrow(point(scalar(0), scalar(0)), point(mul(ref(scale), ref(b[0])), mul(ref(scale), ref(b[1])))) };
  },
};

// ---------------------------------------------------------------------------
// Rotation matrices
// ---------------------------------------------------------------------------

/**
 * The 2D rotation matrix [[cos θ, −sin θ], [sin θ, cos θ]].
 * @param degrees - Angle θ in degrees
 * @returns Array of scalars, shape [2, 2]
 * @auxiliaryNodes el_<i> (Scalar nodes)
 */
export const RotationMatrix: Node2NodeFunc = {
  keyword: 'la_rotation_matrix', outputType: 'Array',
  parameters: [{ name: 'degrees', type: 'Scalar' }],
  compute(inputs: AnyNode[]) {
    const theta = degToRad((inputs[0] as ScalarNode).value);
    const c = cos(ref(theta)), s = sin(ref(theta));
    return scalarArray([ref(c), neg(ref(s)), ref(s), ref(c)], [2, 2]);
  },
};

/**
 * The 3×3 rotation matrix about the X axis: [[1, 0, 0], [0, cos θ, −sin θ], [0, sin θ, cos θ]].
 * @param degrees - Angle θ in degrees
 * @returns Array of scalars, shape [3, 3]
 * @auxiliaryNodes el_<i> (Scalar nodes)
 */
export const RotationMatrix3DX: Node2NodeFunc = {
  keyword: 'la_rotation_matrix3d_x', outputType: 'Array',
  parameters: [{ name: 'degrees', type: 'Scalar' }],
  compute(inputs: AnyNode[]) {
    const theta = degToRad((inputs[0] as ScalarNode).value);
    const c = cos(ref(theta)), s = sin(ref(theta));
    return scalarArray([
      scalar(1), scalar(0), scalar(0),
      scalar(0), ref(c), neg(ref(s)),
      scalar(0), ref(s), ref(c),
    ], [3, 3]);
  },
};

/**
 * The 3×3 rotation matrix about the Y axis: [[cos θ, 0, sin θ], [0, 1, 0], [−sin θ, 0, cos θ]].
 * @param degrees - Angle θ in degrees
 * @returns Array of scalars, shape [3, 3]
 * @auxiliaryNodes el_<i> (Scalar nodes)
 */
export const RotationMatrix3DY: Node2NodeFunc = {
  keyword: 'la_rotation_matrix3d_y', outputType: 'Array',
  parameters: [{ name: 'degrees', type: 'Scalar' }],
  compute(inputs: AnyNode[]) {
    const theta = degToRad((inputs[0] as ScalarNode).value);
    const c = cos(ref(theta)), s = sin(ref(theta));
    return scalarArray([
      ref(c), scalar(0), ref(s),
      scalar(0), scalar(1), scalar(0),
      neg(ref(s)), scalar(0), ref(c),
    ], [3, 3]);
  },
};

/**
 * The 3×3 rotation matrix about the Z axis: [[cos θ, −sin θ, 0], [sin θ, cos θ, 0], [0, 0, 1]].
 * @param degrees - Angle θ in degrees
 * @returns Array of scalars, shape [3, 3]
 * @auxiliaryNodes el_<i> (Scalar nodes)
 */
export const RotationMatrix3DZ: Node2NodeFunc = {
  keyword: 'la_rotation_matrix3d_z', outputType: 'Array',
  parameters: [{ name: 'degrees', type: 'Scalar' }],
  compute(inputs: AnyNode[]) {
    const theta = degToRad((inputs[0] as ScalarNode).value);
    const c = cos(ref(theta)), s = sin(ref(theta));
    return scalarArray([
      ref(c), neg(ref(s)), scalar(0),
      ref(s), ref(c), scalar(0),
      scalar(0), scalar(0), scalar(1),
    ], [3, 3]);
  },
};

// ---------------------------------------------------------------------------
// 3D, drawn with isometric projection
// ---------------------------------------------------------------------------

/**
 * The positive halves of the three isometric 3D axes, from `origin`.
 * @param origin - Screen position of the 3D origin
 * @param length - Length of each axis
 * @returns Array of ColoredLine nodes
 * @auxiliaryNodes axis_<i> (ColoredLine nodes)
 */
export const OrthographicAxes: Node2NodeFunc = {
  keyword: 'la_ortho_axes', outputType: 'Array',
  parameters: [{ name: 'origin', type: 'Point' }, { name: 'length', type: 'Scalar' }],
  compute(inputs: AnyNode[]) {
    const origin = inputs[0] as PointNode;
    const len = (inputs[1] as ScalarNode).value;
    // Screen directions of +x, +y, +z; must match `isometricProject`.
    const dirs: [number, number][] = [[ISO_COS30, 0.5], [-ISO_COS30, 0.5], [0, -1]];

    const result: Record<string, BlueprintNode> = {};
    const keys = dirs.map(([dx, dy], i) => {
      result[`axis_${i}`] = {
        type: 'ColoredLine',
        p1: point(ref(origin.x), ref(origin.y)),
        p2: point(add(ref(origin.x), mul(scalar(dx), ref(len))), add(ref(origin.y), mul(scalar(dy), ref(len)))),
        color: ISO_AXIS_COLOR,
      };
      return `axis_${i}`;
    });
    return arrayOf(result, keys, 'ColoredLine');
  },
};

/**
 * A 3D vector drawn as an arrow from the origin, with isometric projection.
 * @param x - X component
 * @param y - Y component
 * @param z - Z component
 * @returns Arrow node
 * @auxiliaryNodes None
 */
export const Vector3D: Node2NodeFunc = {
  keyword: 'la_vec3d', outputType: 'Arrow',
  parameters: [{ name: 'x', type: 'Scalar' }, { name: 'y', type: 'Scalar' }, { name: 'z', type: 'Scalar' }],
  compute(inputs: AnyNode[]) {
    const [x, y, z] = (inputs as ScalarNode[]).map((n) => n.value);
    const tip = isometricProject(x, y, z);
    return { main: arrow(point(scalar(0), scalar(0)), point(tip.x, tip.y)) };
  },
};

/**
 * The 8 corners (±a/2, ±a/2, ±a/2) of a cube centered at the origin, one per column.
 * @param length - Edge length a; default 1
 * @returns Array of scalars, shape [3, 8]: row 0 the x's, row 1 the y's, row 2 the z's
 * @auxiliaryNodes el_<i> (Scalar nodes)
 */
export const GetArrayForCube: Node2NodeFunc = {
  keyword: 'la_cube_array', outputType: 'Array',
  parameters: [{ name: 'length', type: 'Scalar', defaultValue: 1 }],
  compute(inputs: AnyNode[]) {
    const half = div(ref((inputs[0] as ScalarNode).value), scalar(2));
    // Corner idx picks the sign per axis from its bits: bit set → +half.
    const row = (bit: number) => Array.from({ length: 8 }, (_, idx) => (idx & bit) ? ref(half) : neg(ref(half)));
    return scalarArray([...row(1), ...row(2), ...row(4)], [3, 8]);
  },
};

/**
 * A cube drawn from its 8 corners with isometric projection. Edges of the near z-face are teal,
 * of the far z-face amber, and the edges between them violet.
 * @param array - Array of scalars, shape [3, 8], as from `la_cube_array`
 * @param center - Screen position the projected cube is moved by
 * @returns Array of 12 ColoredLine nodes, the edges
 * @auxiliaryNodes edge_<a>_<b> (ColoredLine nodes)
 */
export const GetCubeFromArray: Node2NodeFunc = {
  keyword: 'la_cube_from_array', outputType: 'Array',
  parameters: [{ name: 'array', type: 'Array' }, { name: 'center', type: 'Point' }],
  compute(inputs: AnyNode[]) {
    const array = inputs[0] as ArrayNode;
    const [rows, cols] = array.shape;
    if (rows !== 3 || cols !== 8) {
      throw new Error(`la_cube_from_array: expected a 3×8 array, got ${rows}×${cols}`);
    }
    const values = scalarValues(array, 'la_cube_from_array');
    const center = inputs[1] as PointNode;

    const corners = Array.from({ length: 8 }, (_, idx) => {
      const proj = isometricProject(values[idx], values[8 + idx], values[16 + idx]);
      return point(add(ref(center.x), proj.x), add(ref(center.y), proj.y));
    });
    const result: Record<string, BlueprintNode> = {};
    return arrayOf(result, cubeEdges(result, corners), 'ColoredLine');
  },
};

// ---------------------------------------------------------------------------
// Markov chains
// ---------------------------------------------------------------------------

/**
 * Simulates a Markov chain p ← T·p and draws each step's distribution as a column of stacked
 * rectangles, heights summing to `colHeight`. Each rectangle's color is its probability
 * (blue = 0 → red = 1). Not differentiable.
 * @param nStates - Number of states
 * @param nIter - Number of steps (columns)
 * @param transitionMatrix - Array of scalars, shape [nStates, nStates]; entry [i][j] = P(j → i), so each column sums to 1
 * @param startDist - Array of nStates scalars, the distribution at step 0
 * @param colHeight - Height of a column
 * @param colWidth - Width of a column
 * @param offsetX - X of the bottom-left corner of the first column
 * @param offsetY - Y of the bottom-left corner of the first column
 * @returns Array of Polygon nodes
 * @auxiliaryNodes rect_<t>_<s> (Polygon nodes)
 */
export const MarkovSimulation: Node2NodeFunc = {
  keyword: 'la_markov_simulation', outputType: 'Array',
  parameters: [
    { name: 'nStates', type: 'Scalar' }, { name: 'nIter', type: 'Scalar' },
    { name: 'transitionMatrix', type: 'Array' }, { name: 'startDist', type: 'Array' },
    { name: 'colHeight', type: 'Scalar' }, { name: 'colWidth', type: 'Scalar' },
    { name: 'offsetX', type: 'Scalar' }, { name: 'offsetY', type: 'Scalar' },
  ],
  compute(inputs: AnyNode[]) {
    const scalarAt = (i: number) => num((inputs[i] as ScalarNode).value);
    const nStates = Math.max(1, Math.round(scalarAt(0)));
    const nIter = Math.max(1, Math.round(scalarAt(1)));
    const [colHeight, colWidth, offsetX, offsetY] = [scalarAt(4), scalarAt(5), scalarAt(6), scalarAt(7)];

    const tVals = scalarValues(inputs[2] as ArrayNode, 'la_markov_simulation').map(num);
    if (tVals.length !== nStates * nStates) {
      throw new Error(
        `la_markov_simulation: transitionMatrix must be ${nStates}×${nStates} (${nStates * nStates} entries), got ${tVals.length}`
      );
    }
    const T = reshape(tVals, nStates, nStates);
    let p = scalarValues(inputs[3] as ArrayNode, 'la_markov_simulation').map(num);
    if (p.length !== nStates) {
      throw new Error(`la_markov_simulation: startDist must have length ${nStates}, got ${p.length}`);
    }

    const distributions = [p];
    for (let t = 1; t < nIter; t++) {
      p = matmulNumber(T, p.map((v) => [v])).map((row) => row[0]);
      distributions.push(p);
    }

    // Blue (hue 264) for probability 0 through green and yellow to red (hue 29) for 1, all at the same mid lightness.
    const colorFor = (prob: number) => `oklch(0.55 0.14 ${264 - 235 * Math.min(1, Math.max(0, prob))})`;
    // A small gap between stacked rectangles keeps the state boundaries visible.
    const gap = colHeight * 0.015;
    const corner = (x: number, y: number) => point(scalar(x), scalar(y));

    const result: Record<string, BlueprintNode> = {};
    const keys: string[] = [];
    for (let t = 0; t < nIter; t++) {
      const x0 = offsetX + t * colWidth * 1.5;
      const x1 = x0 + colWidth;
      let y0 = offsetY;
      for (let s = 0; s < nStates; s++) {
        const prob = distributions[t][s];
        const y1 = y0 + prob * colHeight;
        const top = Math.max(y0, y1 - gap);
        const key = `rect_${t}_${s}`;
        result[key] = {
          type: 'Polygon',
          vertices: [corner(x0, y0), corner(x1, y0), corner(x1, top), corner(x0, top)],
          color: colorFor(prob),
        };
        keys.push(key);
        y0 = y1;
      }
    }
    return arrayOf(result, keys, 'Polygon');
  },
};

/**
 * A random n×n Markov matrix: each column is the softmax of random values, so every column
 * sums to 1. A new matrix is drawn each time it recomputes.
 * @param n - Number of states
 * @returns Array of scalars, shape [n, n]
 * @auxiliaryNodes el_<i> (Scalar nodes)
 */
export const MarkovMatrix: Node2NodeFunc = {
  keyword: 'la_markov_matrix', outputType: 'Array',
  parameters: [{ name: 'n', type: 'Scalar' }],
  compute(inputs: AnyNode[]) {
    const n = Math.max(1, Math.round(num((inputs[0] as ScalarNode).value)));
    // The [-2, 2] spread keeps entries varied without saturating softmax.
    const columns = Array.from({ length: n }, () => softmax(Array.from({ length: n }, () => Math.random() * 4 - 2)));
    return scalarArray(transpose(columns).flat().map(scalar), [n, n]);
  },
};

/**
 * The image of the unit circle under a 2×2 matrix: an ellipse whose radii are the matrix's
 * singular values, rotated to its major axis (the top eigenvector of A·Aᵀ).
 * @param matrix - Array of scalars, shape [2, 2]
 * @param center - Center of the ellipse
 * @returns Ellipse node
 * @auxiliaryNodes None
 */
export const MatrixToEllipse: Node2NodeFunc = {
  keyword: 'la_mat_to_ellipse', outputType: 'Ellipse',
  parameters: [{ name: 'matrix', type: 'Array' }, { name: 'center', type: 'Point' }],
  compute(inputs: AnyNode[]) {
    const [a, b, c, d] = entries2x2(inputs[0], 'la_mat_to_ellipse');
    const center = inputs[1] as PointNode;

    // M = A·Aᵀ is symmetric 2×2, so its eigenvalues have a closed form.
    const m00 = add(mul(ref(a), ref(a)), mul(ref(b), ref(b)));
    const m01 = add(mul(ref(a), ref(c)), mul(ref(b), ref(d)));
    const m11 = add(mul(ref(c), ref(c)), mul(ref(d), ref(d)));
    const diff = sub(ref(m00), ref(m11));
    const disc = sqrt(add(mul(ref(diff), ref(diff)), mul(scalar(4), mul(ref(m01), ref(m01)))));
    const trace = add(m00, m11);
    // Clamped at 0, so float noise on a singular matrix can't give NaN.
    const radiusX = sqrt(maximum(scalar(0), div(add(ref(trace), ref(disc)), scalar(2))));
    const radiusY = sqrt(maximum(scalar(0), div(sub(ref(trace), ref(disc)), scalar(2))));
    // In degrees, as the Ellipse node expects. When the image is a circle, (2·m01, diff) is (0, 0) and the rotation is 0.
    const rotation = mul(mul(scalar(0.5), atan2Safe(mul(scalar(2), m01), diff)), scalar(180 / Math.PI));

    return {
      main: {
        type: 'Ellipse',
        center: point(ref(center.x), ref(center.y)),
        radiusX: { type: 'Scalar', value: radiusX },
        radiusY: { type: 'Scalar', value: radiusY },
        rotation: { type: 'Scalar', value: rotation },
      },
    };
  },
};
