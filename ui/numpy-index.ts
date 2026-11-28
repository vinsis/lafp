/**
 * For `pie.ui.matrix_grid`: reads a numpy expression such as `A[:3, :] @ A.T` and works out what to draw.
 *
 * Each operand (a name, then `[...]` and `.T`) is drawn as the array before its first `[...]`, with the cells it
 * picks marked: `A[:3, :]` is A with its first 3 rows marked, `A.T[0]` is A.T with its first row marked, `A.T` is
 * A.T with nothing marked. Which cells are picked is found as in numpy: index an array of positions (0, 1, 2, ...)
 * shaped like that array, and see which positions come out.
 *
 * Supported: integers, slices, `...`, `None`, lists of integers or booleans as index arrays, chaining (`A[1:][0]`),
 * `.T`, numbers, `@ * / + -`, parentheses, and commas between arrays drawn side by side.
 *
 * Inside `[...]`, `i` and `j` are the row and column of each cell of the array being indexed, as after
 * `i, j = np.indices(A.shape)` in numpy, so `A[i // 2 == j // 2]` picks the diagonal 2×2 blocks. They take integers,
 * `+ - * / // % **`, `abs(...)`, `< <= > >= == !=`, `& | ^ ~` and parentheses, with Python's precedence and
 * numpy's rules: True/False results are a mask, integer results an index array, and a chained comparison such as
 * `0 <= i - j <= 2` fails as it does in numpy.
 */

export type Shape = number[];
export type GridItem =
  | { kind: 'grid'; name: string; shape: Shape; marked: boolean[] }
  | { kind: 'text'; text: string }
  | { kind: 'error'; text: string };

/** The items to draw for `src`, or one error item. */
export function matrixGridItems(src: string, shapes: Record<string, Shape>): GridItem[] {
  try {
    return new Reader(src, shapes).all();
  } catch (e) {
    return [{ kind: 'error', text: e instanceof Error ? e.message : String(e) }];
  }
}

/** An error worded like Python's, e.g. `IndexError: index 5 is out of bounds for axis 0 with size 3`. */
class PyError extends Error {
  constructor(type: string, message: string) {
    super(`${type}: ${message}`);
  }
}

// --- Shapes -------------------------------------------------------------------------------------------------------

const count = (shape: Shape) => shape.reduce((a, b) => a * b, 1);

/** As numpy prints a shape in its errors: `(3,8)`. */
const npShape = (s: Shape) => `(${s.join(',')}${s.length === 1 ? ',' : ''})`;

function strides(shape: Shape): number[] {
  const out: number[] = new Array(shape.length);
  let step = 1;
  for (let i = shape.length - 1; i >= 0; i--) {
    out[i] = step;
    step *= shape[i];
  }
  return out;
}

/** Flat index `flat` as one index per axis, row-major. */
function unravel(flat: number, shape: Shape): number[] {
  const out: number[] = new Array(shape.length);
  for (let i = shape.length - 1; i >= 0; i--) {
    out[i] = flat % shape[i];
    flat = Math.floor(flat / shape[i]);
  }
  return out;
}

/** numpy's broadcasting: the shape `shapes` broadcast to, or null if they don't. */
function broadcast(shapes: Shape[]): Shape | null {
  const ndim = Math.max(0, ...shapes.map((s) => s.length));
  const out: Shape = [];
  for (let i = 0; i < ndim; i++) {
    let d = 1;
    for (const s of shapes) {
      const n = s[s.length - ndim + i] ?? 1;
      if (n === 1) continue;
      if (d !== 1 && d !== n) return null;
      d = n;
    }
    out.push(d);
  }
  return out;
}

/** The shape of `a @ b`, with numpy's rules for 1D operands. */
function matmulShape(a: Shape, b: Shape): Shape {
  const signature = 'gufunc signature (n?,k),(k,m?)->(n?,m?)';
  if (!a.length || !b.length) {
    throw new PyError('ValueError', `matmul: Input operand ${a.length ? 1 : 0} does not have enough dimensions (has 0, ${signature} requires 1)`);
  }
  const left = a.length === 1 ? [1, ...a] : a;
  const right = b.length === 1 ? [...b, 1] : b;
  const k = left[left.length - 1];
  const k2 = right[right.length - 2];
  if (k !== k2) {
    throw new PyError('ValueError', `matmul: Input operand 1 has a mismatch in its core dimension 0, with ${signature} (size ${k2} is different from ${k})`);
  }
  const batch = broadcast([left.slice(0, -2), right.slice(0, -2)]);
  if (!batch) {
    throw new PyError('ValueError', `operands could not be broadcast together with remapped shapes [original->remapped]: ${npShape(a)} ${npShape(b)}`);
  }
  return [...batch, ...(a.length > 1 ? [left[left.length - 2]] : []), ...(b.length > 1 ? [right[right.length - 1]] : [])];
}

// --- Indexing an array of positions -------------------------------------------------------------------------------

/** An array whose cells hold positions in the drawn array. */
type Positions = { shape: Shape; data: number[] };

const arange = (shape: Shape): Positions => ({ shape, data: Array.from({ length: count(shape) }, (_, i) => i) });

function transpose(x: Positions): Positions {
  const shape = [...x.shape].reverse();
  const st = strides(x.shape);
  const data = Array.from({ length: x.data.length }, (_, f) => {
    const idx = unravel(f, shape);
    return x.data[idx.reduce((flat, v, i) => flat + v * st[idx.length - 1 - i], 0)];
  });
  return { shape, data };
}

/** One item between the commas of `[...]`. An array is a list literal; `bool` if all its items are booleans. */
type IndexItem =
  | { kind: 'int'; value: number }
  | { kind: 'slice'; start?: number; stop?: number; step?: number }
  | { kind: 'new'; len?: number }   // None; a single True or False adds an axis of length 1 or 0
  | { kind: 'ellipsis' }
  | { kind: 'array'; shape: Shape; data: number[]; bool: boolean };

/** An index item matched to the axis it indexes. */
type Part =
  | { kind: 'slice'; axis: number; start: number; step: number; len: number }
  | { kind: 'int'; axis: number; value: number }
  | { kind: 'array'; axis: number; shape: Shape; data: number[] }
  | { kind: 'new'; len: number };

function inBounds(v: number, n: number, axis: number): number {
  if (v < -n || v >= n) throw new PyError('IndexError', `index ${v} is out of bounds for axis ${axis} with size ${n}`);
  return v < 0 ? v + n : v;
}

/** Python's `slice.indices`: the first index, the step and how many indices a slice of an axis of size `n` takes. */
function sliceRange(n: number, s: { start?: number; stop?: number; step?: number }) {
  const step = s.step ?? 1;
  const clamp = (v: number | undefined, otherwise: number, lo: number, hi: number) =>
    v === undefined ? otherwise : Math.min(Math.max(v < 0 ? v + n : v, lo), hi);
  const start = step > 0 ? clamp(s.start, 0, 0, n) : clamp(s.start, n - 1, -1, n - 1);
  const stop = step > 0 ? clamp(s.stop, n, 0, n) : clamp(s.stop, -1, -1, n - 1);
  return { start, step, len: Math.max(0, Math.ceil((stop - start) / step)) };
}

/** A boolean mask over the axes of sizes `sizes`, as one integer array per axis, like `np.nonzero`. */
function nonzero(mask: { shape: Shape; data: number[] }, sizes: Shape, axis: number): { shape: Shape; data: number[] }[] {
  mask.shape.forEach((n, j) => {
    if (n !== sizes[j]) {
      throw new PyError('IndexError', `boolean index did not match indexed array along axis ${axis + j}; size of axis is ${sizes[j]} but size of corresponding boolean axis is ${n}`);
    }
  });
  const hits = mask.data.flatMap((v, f) => (v ? [unravel(f, mask.shape)] : []));
  return mask.shape.map((_, j) => ({ shape: [hits.length], data: hits.map((h) => h[j]) }));
}

/** Where index `flat` of the broadcast shape lands in an array of shape `shape`. `b`: the index in the broadcast shape. */
function broadcastIndex(shape: Shape, b: number[]): number {
  const offset = b.length - shape.length;
  return shape.reduce((flat, n, j) => flat * n + (n === 1 ? 0 : b[offset + j]), 0);
}

/** `x[index]`, as numpy does it. */
function applyIndex(x: Positions, index: IndexItem[]): Positions {
  const ndim = x.shape.length;
  const used = index.reduce((n, it) => n + (it.kind === 'new' || it.kind === 'ellipsis' ? 0 : it.kind === 'array' && it.bool ? it.shape.length : 1), 0);
  if (used > ndim) throw new PyError('IndexError', `too many indices for array: array is ${ndim}-dimensional, but ${used} were indexed`);
  if (index.filter((it) => it.kind === 'ellipsis').length > 1) throw new PyError('IndexError', "an index can only have a single ellipsis ('...')");

  // `...`, or the end of the index, stands for `:` on every axis not indexed.
  const fill: IndexItem[] = Array.from({ length: ndim - used }, () => ({ kind: 'slice' }));
  const at = index.findIndex((it) => it.kind === 'ellipsis');
  const full = at < 0 ? [...index, ...fill] : [...index.slice(0, at), ...fill, ...index.slice(at + 1)];

  let parts: Part[] = [];
  let axis = 0;
  for (const it of full) {
    if (it.kind === 'new') parts.push({ kind: 'new', len: it.len ?? 1 });
    else if (it.kind === 'slice') parts.push({ kind: 'slice', axis, ...sliceRange(x.shape[axis], it) }), axis++;
    else if (it.kind === 'int') parts.push({ kind: 'int', axis, value: inBounds(it.value, x.shape[axis], axis) }), axis++;
    else if (it.kind === 'array' && !it.bool) {
      parts.push({ kind: 'array', axis, shape: it.shape, data: it.data.map((v) => inBounds(v, x.shape[axis], axis)) });
      axis++;
    } else if (it.kind === 'array') {
      for (const a of nonzero(it, x.shape.slice(axis, axis + it.shape.length), axis)) parts.push({ kind: 'array', axis: axis++, ...a });
    }
  }

  // With any index array, integers count as index arrays too, and all of them broadcast together.
  if (parts.some((p) => p.kind === 'array')) {
    parts = parts.map((p) => (p.kind === 'int' ? { kind: 'array', axis: p.axis, shape: [], data: [p.value] } : p));
  }
  const arrays = parts.filter((p) => p.kind === 'array');
  const b = broadcast(arrays.map((a) => a.shape));
  if (!b) {
    throw new PyError('IndexError', `shape mismatch: indexing arrays could not be broadcast together with shapes ${arrays.map((a) => npShape(a.shape)).join(' ')}`);
  }

  // The result's axes: one per slice or None, in order. The index arrays' broadcast axes go where the arrays are
  // when they're next to each other, and first otherwise.
  const first = parts.findIndex((p) => p.kind === 'array');
  const last = parts.length - 1 - [...parts].reverse().findIndex((p) => p.kind === 'array');
  const together = first >= 0 && parts.slice(first, last + 1).every((p) => p.kind === 'array');
  const shape: Shape = first >= 0 && !together ? [...b] : [];
  let bAxis = 0;
  const axisOf: number[] = [];
  parts.forEach((p, i) => {
    if (i === first && together) bAxis = shape.length, shape.push(...b);
    axisOf[i] = shape.length;
    if (p.kind === 'slice') shape.push(p.len);
    if (p.kind === 'new') shape.push(p.len);
  });

  const st = strides(x.shape);
  const data = Array.from({ length: count(shape) }, (_, f) => {
    const out = unravel(f, shape);
    const inB = out.slice(bAxis, bAxis + b.length);
    let flat = 0;
    parts.forEach((p, i) => {
      if (p.kind === 'slice') flat += (p.start + p.step * out[axisOf[i]]) * st[p.axis];
      else if (p.kind === 'int') flat += p.value * st[p.axis];
      else if (p.kind === 'array') flat += p.data[broadcastIndex(p.shape, inB)] * st[p.axis];
    });
    return x.data[flat];
  });
  return { shape, data };
}

// --- Arithmetic inside [...] ----------------------------------------------------------------------------------------

/**
 * A value inside `[...]`, e.g. `i // 2 == j // 2`: an array, 0-d for a number, with numpy's dtype rules.
 * `list`: a `[...]` literal, which is a Python list, so it can't take part in arithmetic.
 */
type Arr = { shape: Shape; data: number[]; dtype: 'bool' | 'int' | 'float'; list?: boolean };

const ONLY_INTEGERS = 'only integers, slices (`:`), ellipsis (`...`), numpy.newaxis (`None`) and integer or boolean arrays are valid indices';
const COMPARISONS = ['<', '<=', '>', '>=', '==', '!='];

/** `np.indices(shape)[axis]`: each cell's index along `axis`. `i` is axis 0, `j` axis 1. */
function indices(shape: Shape, axis: number, name: string): Arr {
  if (axis >= shape.length) {
    throw new PyError('IndexError', `${name} needs an array with at least ${axis + 1} axes; this one has ${shape.length}`);
  }
  return { shape, data: Array.from({ length: count(shape) }, (_, f) => unravel(f, shape)[axis]), dtype: 'int' };
}

function elementwise(a: Arr, b: Arr, dtype: Arr['dtype'], fn: (x: number, y: number) => number): Arr {
  const shape = broadcast([a.shape, b.shape]);
  if (!shape) throw new PyError('ValueError', `operands could not be broadcast together with shapes ${npShape(a.shape)} ${npShape(b.shape)}`);
  const data = Array.from({ length: count(shape) }, (_, f) => {
    const idx = unravel(f, shape);
    return fn(a.data[broadcastIndex(a.shape, idx)], b.data[broadcastIndex(b.shape, idx)]);
  });
  return { shape, data, dtype };
}

function noList(op: string, ...values: Arr[]) {
  if (values.some((v) => v.list)) {
    throw new PyError('TypeError', `a [...] list can't be used with '${op}': in Python it's a list, not an array`);
  }
}

/** `a op b` for `+ - * / // % **`. */
function arith(op: string, a: Arr, b: Arr): Arr {
  noList(op, a, b);
  const bools = a.dtype === 'bool' && b.dtype === 'bool';
  if (bools && op === '+') return elementwise(a, b, 'bool', (x, y) => +(x || y));
  if (bools && op === '*') return elementwise(a, b, 'bool', (x, y) => +(x && y));
  if (bools && op === '-') {
    throw new PyError('TypeError', 'numpy boolean subtract, the `-` operator, is not supported, use the bitwise_xor, the `^` operator, or the logical_xor function instead.');
  }
  const float = a.dtype === 'float' || b.dtype === 'float';
  const dtype = float ? 'float' : 'int';
  const floorDiv = (x: number, y: number) => (y === 0 && !float ? 0 : Math.floor(x / y));   // numpy: integer x // 0 is 0
  switch (op) {
    case '+': return elementwise(a, b, dtype, (x, y) => x + y);
    case '-': return elementwise(a, b, dtype, (x, y) => x - y);
    case '*': return elementwise(a, b, dtype, (x, y) => x * y);
    case '/': return elementwise(a, b, 'float', (x, y) => x / y);
    case '//': return elementwise(a, b, dtype, floorDiv);
    case '%': return elementwise(a, b, dtype, (x, y) => (y === 0 && !float ? 0 : x - y * Math.floor(x / y)));
    default: return elementwise(a, b, dtype, (x, y) => {
      if (!float && y < 0) throw new PyError('ValueError', 'Integers to negative integer powers are not allowed.');
      return x ** y;
    });
  }
}

/** `a op b` for `& | ^`. */
function bitwise(op: string, a: Arr, b: Arr): Arr {
  noList(op, a, b);
  const name = { '&': 'bitwise_and', '|': 'bitwise_or', '^': 'bitwise_xor' }[op];
  if (a.dtype === 'float' || b.dtype === 'float') {
    throw new PyError('TypeError', `ufunc '${name}' not supported for the input types, and the inputs could not be safely coerced to any supported types according to the casting rule ''safe''`);
  }
  const fn = op === '&' ? (x: number, y: number) => x & y : op === '|' ? (x: number, y: number) => x | y : (x: number, y: number) => x ^ y;
  return elementwise(a, b, a.dtype === 'bool' && b.dtype === 'bool' ? 'bool' : 'int', fn);
}

function compare(op: string, a: Arr, b: Arr): Arr {
  noList(op, a, b);
  const fn = {
    '<': (x: number, y: number) => +(x < y), '<=': (x: number, y: number) => +(x <= y),
    '>': (x: number, y: number) => +(x > y), '>=': (x: number, y: number) => +(x >= y),
    '==': (x: number, y: number) => +(x === y), '!=': (x: number, y: number) => +(x !== y),
  }[op]!;
  return elementwise(a, b, 'bool', fn);
}

/** `-a`, `+a` or `~a`. */
function unaryOp(op: string, a: Arr): Arr {
  noList(op, a);
  if (op === '-' && a.dtype === 'bool') {
    throw new PyError('TypeError', 'The numpy boolean negative, the `-` operator, is not supported, use the `~` operator or the logical_not function instead.');
  }
  if (op === '~' && a.dtype === 'float') {
    throw new PyError('TypeError', "ufunc 'invert' not supported for the input types, and the inputs could not be safely coerced to any supported types according to the casting rule ''safe''");
  }
  const fn = op === '-' ? (x: number) => -x : op === '+' ? (x: number) => x : a.dtype === 'bool' ? (x: number) => 1 - x : (x: number) => ~x;
  return { shape: a.shape, data: a.data.map(fn), dtype: a.dtype };
}

/** Python's `bool(a)`, which a chained comparison like `0 <= x <= 2` needs: numpy refuses it for most arrays. */
function truth(a: Arr): boolean {
  const n = count(a.shape);
  if (n === 0) throw new PyError('ValueError', 'The truth value of an empty array is ambiguous. Use `array.size > 0` to check that an array is not empty.');
  if (n > 1) {
    throw new PyError('ValueError', 'The truth value of an array with more than one element is ambiguous. Use a.any() or a.all(). Write 0 <= x <= 2 as (0 <= x) & (x <= 2)');
  }
  return a.data[0] !== 0;
}

/** A value used as an index item, as numpy uses it: booleans as a mask, integers as an index or index array. */
function asIndex(a: Arr): IndexItem {
  if (a.dtype === 'float') throw new PyError('IndexError', a.shape.length ? 'arrays used as indices must be of integer (or boolean) type' : ONLY_INTEGERS);
  if (a.dtype === 'bool') return a.shape.length ? { kind: 'array', shape: a.shape, data: a.data, bool: true } : { kind: 'new', len: a.data[0] };
  return a.shape.length ? { kind: 'array', shape: a.shape, data: a.data, bool: false } : { kind: 'int', value: a.data[0] };
}

/** The binary operators inside [...] below the comparisons, by Python's precedence, lowest first. */
const IX_LEVELS = [
  { ops: ['|'], apply: bitwise },
  { ops: ['^'], apply: bitwise },
  { ops: ['&'], apply: bitwise },
  { ops: ['+', '-'], apply: arith },
  { ops: ['*', '/', '//', '%'], apply: arith },
];

/** A value used as a slice bound. */
function sliceInt(a: Arr): number {
  if (a.shape.length || a.dtype === 'float') throw new PyError('TypeError', 'slice indices must be integers or None or have an __index__ method');
  return a.data[0];
}

// --- Reading the expression ---------------------------------------------------------------------------------------

type Token = { text: string; kind: 'name' | 'num' | 'op'; start: number; end: number };
type Nested = number | boolean | Nested[];

/** What an expression draws, and its shape: null once an operator has failed. */
type Value = { shape: Shape | null; items: GridItem[] };

function tokenize(src: string): Token[] {
  const re = /\s*(?:(\.\.\.|\/\/|\*\*|<=|>=|==|!=)|([A-Za-z_]\w*)|(\d+(?:\.\d+)?)|(\S))/y;
  const tokens: Token[] = [];
  for (let m = re.exec(src); m; m = re.exec(src)) {
    const text = m[1] ?? m[2] ?? m[3] ?? m[4];
    tokens.push({ text, kind: m[2] ? 'name' : m[3] ? 'num' : 'op', start: re.lastIndex - text.length, end: re.lastIndex });
  }
  return tokens;
}

/** A list literal, e.g. `[[0, 1], [2, 3]]` or `[True, False]`, as the array numpy makes of it. */
function listArray(list: Nested[]): Arr {
  const shape: Shape = [];
  for (let v: Nested = list; Array.isArray(v); v = v[0]) {
    shape.push(v.length);
    if (!v.length) break;
  }
  const data: (number | boolean)[] = [];
  const ragged = () => new PyError('ValueError', 'setting an array element with a sequence. The requested array has an inhomogeneous shape');
  const walk = (v: Nested, d: number) => {
    if (d === shape.length) {
      if (Array.isArray(v)) throw ragged();
      data.push(v);
    } else {
      if (!Array.isArray(v) || v.length !== shape[d]) throw ragged();
      v.forEach((w) => walk(w, d + 1));
    }
  };
  walk(list, 0);
  const bool = data.length > 0 && data.every((v) => typeof v === 'boolean');
  return { shape, data: data.map(Number), dtype: bool ? 'bool' : 'int', list: true };
}

/** Reads the expression from left to right, working out what to draw as it goes. */
class Reader {
  src: string;
  shapes: Record<string, Shape>;
  tokens: Token[];
  i = 0;
  /** The first error from an operator, e.g. a shape mismatch in `@`. Shown after the grids. */
  opError: string | undefined;

  constructor(src: string, shapes: Record<string, Shape>) {
    this.src = src;
    this.shapes = shapes;
    this.tokens = tokenize(src);
  }

  peek(text?: string): Token | undefined {
    const t = this.tokens[this.i];
    return text === undefined || t?.text === text ? t : undefined;
  }

  eat(text: string): Token | undefined {
    const t = this.peek(text);
    if (t) this.i++;
    return t;
  }

  eatOp(ops: string[]): string | undefined {
    const t = this.peek();
    if (t?.kind !== 'op' || !ops.includes(t.text)) return undefined;
    this.i++;
    return t.text;
  }

  expect(text: string) {
    if (!this.eat(text)) throw this.syntax();
  }

  syntax(): PyError {
    const t = this.peek();
    if (!t) return new PyError('SyntaxError', 'the expression ends too early');
    if (/^[<>=!]/.test(t.text)) {
      return new PyError('SyntaxError', `'${t.text}' isn't supported here: a grid has no values to compare. Compare cell indices inside [...], e.g. A[i <= j]`);
    }
    return new PyError('SyntaxError', `unexpected '${t.text}'`);
  }

  /** The whole expression: arrays separated by commas are drawn side by side. */
  all(): GridItem[] {
    const items: GridItem[] = [];
    if (!this.peek()) return items;
    do {
      if (!this.peek()) break;   // a trailing comma
      items.push(...this.sum().items);
    } while (this.eat(','));
    if (this.peek()) throw this.syntax();
    if (this.opError) items.push({ kind: 'error', text: this.opError });
    return items;
  }

  sum(): Value {
    return this.binary(() => this.term(), ['+', '-']);
  }

  term(): Value {
    return this.binary(() => this.unary(), ['@', '*', '/']);
  }

  binary(next: () => Value, ops: string[]): Value {
    let left = next();
    for (let op = this.eatOp(ops); op; op = this.eatOp(ops)) {
      const right = next();
      const symbol = op === '@' ? '×' : op;
      left = { shape: this.combine(op, left.shape, right.shape), items: [...left.items, { kind: 'text', text: symbol }, ...right.items] };
    }
    return left;
  }

  combine(op: string, a: Shape | null, b: Shape | null): Shape | null {
    if (!a || !b) return null;
    try {
      if (op === '@') return matmulShape(a, b);
      const s = broadcast([a, b]);
      if (!s) throw new PyError('ValueError', `operands could not be broadcast together with shapes ${npShape(a)} ${npShape(b)}`);
      return s;
    } catch (e) {
      this.opError ??= (e as Error).message;
      return null;
    }
  }

  unary(): Value {
    const op = this.eatOp(['-', '+']);
    if (!op) return this.primary();
    const v = this.unary();
    return { shape: v.shape, items: [{ kind: 'text', text: op }, ...v.items] };
  }

  primary(): Value {
    const t = this.peek();
    if (t?.kind === 'num') {
      this.i++;
      return { shape: [], items: [{ kind: 'text', text: t.text }] };
    }
    if (t?.kind === 'name') {
      this.i++;
      return this.operand(t);
    }
    if (this.eat('(')) {
      const inner = this.sum();
      this.expect(')');
      let shape = inner.shape;
      let close = ')';
      while (this.eat('.')) {
        this.transposeAttr();
        shape = shape && [...shape].reverse();
        close += '.T';
      }
      if (this.peek('[')) throw new PyError('TypeError', 'only a name can be indexed, e.g. A[0], not (...)[0]');
      return { shape, items: [{ kind: 'text', text: '(' }, ...inner.items, { kind: 'text', text: close }] };
    }
    throw this.syntax();
  }

  /** The name after a `.`, which must be `T`. */
  transposeAttr() {
    const t = this.peek();
    if (t?.kind !== 'name') throw this.syntax();
    this.i++;
    if (t.text !== 'T') throw new PyError('AttributeError', `.${t.text} isn't supported; only .T is`);
  }

  /** A name, then any `[...]` and `.T`: one grid. */
  operand(name: Token): Value {
    if (!Object.hasOwn(this.shapes, name.text)) throw new PyError('NameError', `name '${name.text}' is not defined; add it to shapes`);
    let drawn = this.shapes[name.text];
    let x = arange(drawn);
    let indexed = false;
    for (;;) {
      if (this.eat('.')) {
        this.transposeAttr();
        x = transpose(x);
        if (!indexed) drawn = x.shape, x = arange(drawn);   // before the first [...], .T changes what is drawn
      } else if (this.eat('[')) {
        const index = this.subscript(x.shape);
        this.expect(']');
        x = applyIndex(x, index);
        indexed = true;
      } else break;
    }
    const marked: boolean[] = new Array(count(drawn)).fill(false);
    if (indexed) for (const p of x.data) marked[p] = true;
    return { shape: x.shape, items: [{ kind: 'grid', name: name.text, shape: drawn, marked }] };
  }

  /** The items between `[` and `]`, indexing an array of shape `shape`: `i` and `j` are its cells' indices. */
  subscript(shape: Shape): IndexItem[] {
    const items: IndexItem[] = [];
    do {
      if (this.peek(']')) break;   // a trailing comma, e.g. A[0,]
      items.push(this.indexItem(shape));
    } while (this.eat(','));
    if (!items.length) throw this.syntax();
    return items;
  }

  indexItem(shape: Shape): IndexItem {
    if (this.eat('...')) return { kind: 'ellipsis' };
    const none = !!this.eat('None');
    const first = none || this.peek(':') ? undefined : this.ixExpr(shape);
    if (!this.eat(':')) return none ? { kind: 'new' } : asIndex(first!);
    const start = first && sliceInt(first);
    const stop = this.bound(shape);
    const step = this.eat(':') ? this.bound(shape) : undefined;
    if (step === 0) throw new PyError('ValueError', 'slice step cannot be zero');
    return { kind: 'slice', start, stop, step };
  }

  /** A slice bound after a `:`: an integer expression, `None`, or nothing. */
  bound(shape: Shape): number | undefined {
    if (this.eat('None') || this.peek(':') || this.peek(',') || this.peek(']')) return undefined;
    return sliceInt(this.ixExpr(shape));
  }

  // An expression inside [...], with Python's precedence, lowest first: comparisons, |, ^, &, + -, * / // %,
  // unary - + ~, **.

  ixExpr(shape: Shape): Arr {
    let left = this.ixBinary(shape, 0);
    const op = this.eatOp(COMPARISONS);
    if (!op) return left;
    let right = this.ixBinary(shape, 0);
    let result = compare(op, left, right);
    // `a < b < c` is Python's `(a < b) and (b < c)`, which needs the truth of `a < b`: numpy refuses it for arrays.
    for (let next = this.eatOp(COMPARISONS); next; next = this.eatOp(COMPARISONS)) {
      left = right;
      right = this.ixBinary(shape, 0);
      if (truth(result)) result = compare(next, left, right);
    }
    return result;
  }

  /** The binary operators from level `level` of `IX_LEVELS` up. */
  ixBinary(shape: Shape, level: number): Arr {
    if (level === IX_LEVELS.length) return this.ixUnary(shape);
    const { ops, apply } = IX_LEVELS[level];
    let left = this.ixBinary(shape, level + 1);
    for (let op = this.eatOp(ops); op; op = this.eatOp(ops)) left = apply(op, left, this.ixBinary(shape, level + 1));
    return left;
  }

  ixUnary(shape: Shape): Arr {
    const op = this.eatOp(['-', '+', '~']);
    return op ? unaryOp(op, this.ixUnary(shape)) : this.ixPower(shape);
  }

  /** `a ** b`: tighter than a unary minus on its left, so `-i ** 2` is `-(i ** 2)`. */
  ixPower(shape: Shape): Arr {
    const base = this.ixPostfix(shape);
    return this.eatOp(['**']) ? arith('**', base, this.ixUnary(shape)) : base;
  }

  /** A value, then any `[...]` or `.T` on it, e.g. `i[0]`. Inside that `[...]`, `i` and `j` are still the whole arrays. */
  ixPostfix(shape: Shape): Arr {
    let a = this.ixPrimary(shape);
    for (;;) {
      if (this.peek('[') || this.peek('.')) noList('[...]', a);
      if (this.eat('.')) {
        this.transposeAttr();
        a = { ...transpose(a), dtype: a.dtype };
      } else if (this.eat('[')) {
        const index = this.subscript(shape);
        this.expect(']');
        a = { ...applyIndex(a, index), dtype: a.dtype };
      } else return a;
    }
  }

  ixPrimary(shape: Shape): Arr {
    const t = this.peek();
    if (this.peek('[')) return listArray(this.list());
    if (this.eat('(')) {
      const inner = this.ixExpr(shape);
      this.expect(')');
      return inner;
    }
    if (t?.kind === 'num') {
      this.i++;
      return { shape: [], data: [Number(t.text)], dtype: t.text.includes('.') ? 'float' : 'int' };
    }
    if (t?.kind !== 'name') throw this.syntax();
    this.i++;
    if (t.text === 'True' || t.text === 'False') return { shape: [], data: [+(t.text === 'True')], dtype: 'bool' };
    if (t.text === 'i') return indices(shape, 0, 'i');
    if (t.text === 'j') return indices(shape, 1, 'j');
    if (t.text === 'abs') {
      this.expect('(');
      const a = this.ixExpr(shape);
      this.expect(')');
      noList('abs', a);
      return { ...a, data: a.data.map(Math.abs) };
    }
    throw new PyError('IndexError', `can't index with '${t.text}': inside [...], use i and j, the cell's row and column, e.g. A[i <= j]. A grid has no values, so masks like A[A > 0] don't work`);
  }

  integer(): number {
    const sign = this.eat('-') ? -1 : 1;
    const t = this.peek();
    if (t?.kind !== 'num') throw this.syntax();
    if (!/^\d+$/.test(t.text)) throw new PyError('IndexError', ONLY_INTEGERS);
    this.i++;
    return sign * Number(t.text);
  }

  list(): Nested[] {
    this.expect('[');
    const out: Nested[] = [];
    while (!this.peek(']')) {
      if (this.peek('[')) out.push(this.list());
      else if (this.eat('True')) out.push(true);
      else if (this.eat('False')) out.push(false);
      else out.push(this.integer());
      if (!this.eat(',')) break;
    }
    this.expect(']');
    return out;
  }
}
