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
 */

export type Shape = number[];
export type GridItem =
  | { kind: 'grid'; shape: Shape; marked: boolean[] }
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
  | { kind: 'new' }
  | { kind: 'ellipsis' }
  | { kind: 'array'; shape: Shape; data: number[]; bool: boolean };

/** An index item matched to the axis it indexes. */
type Part =
  | { kind: 'slice'; axis: number; start: number; step: number; len: number }
  | { kind: 'int'; axis: number; value: number }
  | { kind: 'array'; axis: number; shape: Shape; data: number[] }
  | { kind: 'new' };

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
    if (it.kind === 'new') parts.push({ kind: 'new' });
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
    if (p.kind === 'new') shape.push(1);
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

// --- Reading the expression ---------------------------------------------------------------------------------------

type Token = { text: string; kind: 'name' | 'num' | 'op'; start: number; end: number };
type Nested = number | boolean | Nested[];

/** What an expression draws, and its shape: null once an operator has failed. */
type Value = { shape: Shape | null; items: GridItem[] };

function tokenize(src: string): Token[] {
  const re = /\s*(?:(\.\.\.)|([A-Za-z_]\w*)|(\d+(?:\.\d+)?)|(\S))/y;
  const tokens: Token[] = [];
  for (let m = re.exec(src); m; m = re.exec(src)) {
    const text = m[1] ?? m[2] ?? m[3] ?? m[4];
    tokens.push({ text, kind: m[2] ? 'name' : m[3] ? 'num' : 'op', start: re.lastIndex - text.length, end: re.lastIndex });
  }
  return tokens;
}

/** A list literal, e.g. `[[0, 1], [2, 3]]` or `[True, False]`, as an index array. */
function listIndex(list: Nested[]): IndexItem {
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
  return { kind: 'array', shape, data: data.map(Number), bool: data.length > 0 && data.every((v) => typeof v === 'boolean') };
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
    if ('<>=!'.includes(t.text)) return new PyError('SyntaxError', `'${t.text}' isn't supported: a grid has no values to compare`);
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
        const index = this.subscript();
        this.expect(']');
        x = applyIndex(x, index);
        indexed = true;
      } else break;
    }
    const marked: boolean[] = new Array(count(drawn)).fill(false);
    if (indexed) for (const p of x.data) marked[p] = true;
    return { shape: x.shape, items: [{ kind: 'grid', shape: drawn, marked }] };
  }

  /** The items between `[` and `]`. */
  subscript(): IndexItem[] {
    const items: IndexItem[] = [];
    do {
      if (this.peek(']')) break;   // a trailing comma, e.g. A[0,]
      items.push(this.indexItem());
    } while (this.eat(','));
    if (!items.length) throw this.syntax();
    return items;
  }

  indexItem(): IndexItem {
    if (this.eat('...')) return { kind: 'ellipsis' };
    if (this.peek('[')) return listIndex(this.list());
    const t = this.peek();
    if (t?.kind === 'name' && t.text !== 'None') {
      throw new PyError('IndexError', `can't index with '${t.text}': write index arrays out, e.g. A[[0, 2]]. A grid has no values, so masks like A[A > 0] don't work`);
    }
    const none = !!this.peek('None');
    const start = this.bound();
    if (!this.eat(':')) {
      if (none) return { kind: 'new' };
      if (start === undefined) throw this.syntax();
      return { kind: 'int', value: start };
    }
    const stop = this.bound();
    const step = this.eat(':') ? this.bound() : undefined;
    if (step === 0) throw new PyError('ValueError', 'slice step cannot be zero');
    return { kind: 'slice', start, stop, step };
  }

  /** A slice bound: an integer, `None`, or nothing. */
  bound(): number | undefined {
    if (this.eat('None')) return undefined;
    if (this.peek('-') || this.peek()?.kind === 'num') return this.integer();
    return undefined;
  }

  integer(): number {
    const sign = this.eat('-') ? -1 : 1;
    const t = this.peek();
    if (t?.kind !== 'num') throw this.syntax();
    if (!/^\d+$/.test(t.text)) {
      throw new PyError('IndexError', 'only integers, slices (`:`), ellipsis (`...`), numpy.newaxis (`None`) and integer or boolean arrays are valid indices');
    }
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
