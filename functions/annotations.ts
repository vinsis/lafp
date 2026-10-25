import { BlueprintNode, Node2NodeFunc } from '~/lib/nodes/functions/Node2NodeFunc';
import { AnyNode, ArrayNode, LineNode, PointNode, ScalarNode, TextNode } from '~/lib/nodes/state/Node';
import { num, scalar } from '~/lib/nodes/jax';

// Stand-ins for the geomatic annotation commands (`annotate-arrow`, `annotate-dim-line`, …) used by
// the ebook pages. A keyword there, `annotate-arrow`, is `annotate_arrow` here. Labels are built-in
// Text nodes; for text on its own, use `pie.text(value, x, y, font_size)`.
//
// Annotations only label a figure, so they compute with plain numbers and `pie.partial` can't
// differentiate through them.

/** Sizes in grid units. */
const ANGLE_MARK_RADIUS = 0.4;
const BRACKET_DEPTH = 0.25;
const TICK_HALF = 0.1;
const LABEL_OFFSET = 0.3;
const ARROW_HEAD_RUN = 0.25;
/** In pixels. */
const LABEL_SIZE = 14;

type XY = [number, number];

const point = ([x, y]: XY) => ({ type: 'Point', x: scalar(x), y: scalar(y) });

const xy = (p: AnyNode): XY => [num((p as PointNode).x), num((p as PointNode).y)];

/** The positions in an Array of Points. */
function xyList(array: ArrayNode, keyword: string): XY[] {
  if (array.itemType !== 'Point') throw new Error(`${keyword}: expected an array of points, got an array of ${array.itemType}`);
  return array.items.map(xy);
}

const plus = ([x, y]: XY, [dx, dy]: XY, k = 1): XY => [x + k * dx, y + k * dy];
const mid = ([x1, y1]: XY, [x2, y2]: XY): XY => [(x1 + x2) / 2, (y1 + y2) / 2];

/** The unit vector from a to b, and its counter-clockwise normal. Both are 0 when a = b. */
function frame(a: XY, b: XY): { u: XY; n: XY; length: number } {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const length = Math.hypot(dx, dy);
  if (length === 0) return { u: [0, 0], n: [0, 0], length };
  return { u: [dx / length, dy / length], n: [-dy / length, dx / length], length };
}

const scalarNode = (value: number) => ({ type: 'Scalar', value: scalar(value) });

/** Adds a label centered at `at` as `result.label`, unless `text` is empty. */
function addLabel(result: Record<string, BlueprintNode>, text: string, at: XY) {
  if (text !== '') {
    // w = h = 0: plain text, no border
    result.label = {
      type: 'Text', value: text, x: scalarNode(at[0]), y: scalarNode(at[1]), fontSize: scalarNode(LABEL_SIZE),
      w: scalarNode(0), h: scalarNode(0),
    };
  }
  return result;
}

/**
 * An arrow from p1 to p2, pulled back by `gap` at both ends so it doesn't touch what it joins.
 * @param p1 - The tail end
 * @param p2 - The head end
 * @param gap - Distance left clear at each end; default 0
 * @returns Arrow node
 * @auxiliaryNodes None
 */
export const AnnotateArrow: Node2NodeFunc = {
  keyword: 'annotate_arrow', outputType: 'Arrow',
  parameters: [{ name: 'p1', type: 'Point' }, { name: 'p2', type: 'Point' }, { name: 'gap', type: 'Scalar', defaultValue: 0 }],
  compute(inputs: AnyNode[]) {
    const a = xy(inputs[0]);
    const b = xy(inputs[1]);
    const { u, length } = frame(a, b);
    // A gap longer than half the arrow leaves a zero-length arrow, which isn't drawn.
    const gap = Math.min(num((inputs[2] as ScalarNode).value), length / 2);
    return { main: { type: 'Arrow', p1: point(plus(a, u, gap)), p2: point(plus(b, u, -gap)) } };
  },
};

/**
 * An arc marking the angle between two lines that start at the same point. It spans the smaller
 * of the two angles, centered on the start of `line1`, with a label just outside its middle.
 * @param line1 - Line, ColoredLine or Arrow
 * @param line2 - Line, ColoredLine or Arrow
 * @param text - Label; default none
 * @returns Arc node
 * @auxiliaryNodes label (Text node)
 */
export const AnnotateAngleMark: Node2NodeFunc = {
  keyword: 'annotate_angle_mark', outputType: 'Arc',
  parameters: [
    { name: 'line1', type: ['Line', 'ColoredLine', 'Arrow'] }, { name: 'line2', type: ['Line', 'ColoredLine', 'Arrow'] },
    { name: 'text', type: 'Text', defaultValue: '' },
  ],
  compute(inputs: AnyNode[]) {
    const [l1, l2] = inputs as LineNode[];
    const angle = (line: LineNode) => Math.atan2(num(line.p2.y) - num(line.p1.y), num(line.p2.x) - num(line.p1.x)) * 180 / Math.PI;
    const a1 = angle(l1), a2 = angle(l2);
    // The arc runs counter-clockwise from `start`, so start from whichever line makes the sweep ≤ 180°.
    const sweep = (((a2 - a1) % 360) + 360) % 360;
    const [start, span] = sweep <= 180 ? [a1, sweep] : [a2, 360 - sweep];
    const center = xy(l1.p1);
    const result: Record<string, BlueprintNode> = {
      main: {
        type: 'Arc', center: point(center), radius: scalarNode(ANGLE_MARK_RADIUS),
        startAngle: scalarNode(start), endAngle: scalarNode(start + span),
      },
    };
    const middle = (start + span / 2) * Math.PI / 180;
    return addLabel(result, (inputs[2] as TextNode).value, plus(center, [Math.cos(middle), Math.sin(middle)], ANGLE_MARK_RADIUS + LABEL_OFFSET));
  },
};

/**
 * A curly bracket from p1 to p2, bulging to the left of the direction p1 → p2, with a label past its tip.
 * @param p1 - Point
 * @param p2 - Point
 * @param text - Label; default none
 * @returns BezierCubic node: the half from p1 to the tip
 * @auxiliaryNodes half2 (BezierCubic node, the half from the tip to p2), label (Text node)
 */
export const AnnotateCurlyBracket: Node2NodeFunc = {
  keyword: 'annotate_curly_bracket', outputType: 'BezierCubic',
  parameters: [{ name: 'p1', type: 'Point' }, { name: 'p2', type: 'Point' }, { name: 'text', type: 'Text', defaultValue: '' }],
  compute(inputs: AnyNode[]) {
    const a = xy(inputs[0]);
    const b = xy(inputs[1]);
    const { n } = frame(a, b);
    const m = mid(a, b);
    const tip = plus(m, n, BRACKET_DEPTH);
    // Each half leaves its end heading outwards and reaches the tip heading outwards, so the tip is a point.
    const result: Record<string, BlueprintNode> = {
      half2: { type: 'BezierCubic', p1: point(tip), control1: point(m), control2: point(plus(b, n, BRACKET_DEPTH)), p2: point(b) },
    };
    result.main = { type: 'BezierCubic', p1: point(a), control1: point(plus(a, n, BRACKET_DEPTH)), control2: point(m), p2: point(tip) };
    return addLabel(result, (inputs[2] as TextNode).value, plus(tip, n, LABEL_OFFSET));
  },
};

/**
 * A dimension line: a line from p1 to p2 with a tick across each end, and a label to the left of its middle.
 * @param p1 - Point
 * @param p2 - Point
 * @param text - Label; default none
 * @returns Line node
 * @auxiliaryNodes tick1, tick2 (Line nodes), label (Text node)
 */
export const AnnotateDimLine: Node2NodeFunc = {
  keyword: 'annotate_dim_line', outputType: 'Line',
  parameters: [{ name: 'p1', type: 'Point' }, { name: 'p2', type: 'Point' }, { name: 'text', type: 'Text', defaultValue: '' }],
  compute(inputs: AnyNode[]) {
    const a = xy(inputs[0]);
    const b = xy(inputs[1]);
    const { n } = frame(a, b);
    const tick = (at: XY) => ({ type: 'Line', p1: point(plus(at, n, -TICK_HALF)), p2: point(plus(at, n, TICK_HALF)) });
    const result: Record<string, BlueprintNode> = { tick1: tick(a), tick2: tick(b) };
    result.main = { type: 'Line', p1: point(a), p2: point(b) };
    return addLabel(result, (inputs[2] as TextNode).value, plus(mid(a, b), n, LABEL_OFFSET));
  },
};

/**
 * A curved arrow from p1 to p2, bent towards `control` (a quadratic Bezier), with a label at `control`.
 * Each end is moved `gap` towards the control point, so it doesn't touch what it joins.
 * @param p1 - The tail end
 * @param p2 - The head end
 * @param control - The control point
 * @param gap - Distance each end is moved; default 0
 * @param text - Label; default none
 * @returns BezierQuadratic node
 * @auxiliaryNodes head (Arrow node, a short arrow along the curve's end), label (Text node)
 */
export const AnnotateCurvedArrow: Node2NodeFunc = {
  keyword: 'annotate_curved_arrow', outputType: 'BezierQuadratic',
  parameters: [
    { name: 'p1', type: 'Point' }, { name: 'p2', type: 'Point' }, { name: 'control', type: 'Point' },
    { name: 'gap', type: 'Scalar', defaultValue: 0 }, { name: 'text', type: 'Text', defaultValue: '' },
  ],
  compute(inputs: AnyNode[]) {
    const c = xy(inputs[2]);
    const gap = num((inputs[3] as ScalarNode).value);
    const toward = (end: XY) => plus(end, frame(end, c).u, gap);
    const a = toward(xy(inputs[0]));
    const b = toward(xy(inputs[1]));
    // A quadratic Bezier ends heading from its control point to its end point.
    const { u } = frame(c, b);
    const result: Record<string, BlueprintNode> = {
      head: { type: 'Arrow', p1: point(plus(b, u, -ARROW_HEAD_RUN)), p2: point(b) },
    };
    result.main = { type: 'BezierQuadratic', p1: point(a), control: point(c), p2: point(b) };
    return addLabel(result, (inputs[4] as TextNode).value, c);
  },
};

/**
 * A rectangle with its bottom-left corner at `position`, rotated counter-clockwise about that corner.
 * @param position - The bottom-left corner
 * @param width - Width
 * @param height - Height
 * @param rotation - Rotation in degrees; default 0
 * @returns Polygon node
 * @auxiliaryNodes None
 */
export const Rectangle: Node2NodeFunc = {
  keyword: 'rectangle', outputType: 'Polygon',
  parameters: [
    { name: 'position', type: 'Point' }, { name: 'width', type: 'Scalar' },
    { name: 'height', type: 'Scalar' }, { name: 'rotation', type: 'Scalar', defaultValue: 0 },
  ],
  compute(inputs: AnyNode[]) {
    const corner = xy(inputs[0]);
    const [w, h, deg] = (inputs.slice(1) as ScalarNode[]).map((s) => num(s.value));
    const t = deg * Math.PI / 180;
    const along: XY = [Math.cos(t), Math.sin(t)];
    const up: XY = [-Math.sin(t), Math.cos(t)];
    const vertices = [corner, plus(corner, along, w), plus(plus(corner, along, w), up, h), plus(corner, up, h)];
    return { main: { type: 'Polygon', vertices: vertices.map(point) } };
  },
};

/**
 * A closed outline through points, in order.
 * @param points - Array of points
 * @returns Polygon node
 * @auxiliaryNodes None
 */
export const PolygonFunc: Node2NodeFunc = {
  keyword: 'polygon', outputType: 'Polygon',
  parameters: [{ name: 'points', type: 'Array' }],
  compute(inputs: AnyNode[]) {
    return { main: { type: 'Polygon', vertices: xyList(inputs[0] as ArrayNode, 'polygon').map(point) } };
  },
};

/**
 * An open path through points, in order.
 * @param points - Array of points
 * @returns Polyline node
 * @auxiliaryNodes None
 */
export const PolylineFunc: Node2NodeFunc = {
  keyword: 'polyline', outputType: 'Polyline',
  parameters: [{ name: 'points', type: 'Array' }],
  compute(inputs: AnyNode[]) {
    return { main: { type: 'Polyline', vertices: xyList(inputs[0] as ArrayNode, 'polyline').map(point) } };
  },
};
