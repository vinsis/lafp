import { Show, type Accessor } from 'solid-js';
import type { Node, NodeDefinition, PointNode } from '~/lib/nodes/state/Node';
import { num } from '~/lib/nodes/jax';

// Node types drawn by the functions in `functions/linear-algebra.ts` and `functions/annotations.ts`.
// Sizes are in pixels and divided by `unit` (pixels per grid unit), so they stay fixed on screen.
const STROKE_WIDTH = 2;
const ARROW_HEAD = 10;

/**
 * An arrow from `p1` to `p2`, head at `p2`. `color` is the function's default; `stroke` and `fill`
 * set from Python win over it. `stroke` colors the line, and the head too unless `fill` is set.
 */
export interface ArrowNode extends Node {
  type: 'Arrow';
  p1: PointNode;
  p2: PointNode;
  color?: string;
}

/**
 * A line with a default color of its own, for functions that color each line differently.
 * `stroke` set from Python wins over `color`. The built-in `Line` has no default but `currentColor`.
 */
export interface ColoredLineNode extends Node {
  type: 'ColoredLine';
  p1: PointNode;
  p2: PointNode;
  color?: string;
}

/**
 * A closed polygon through `vertices`. `color`, when a function sets it, fills and outlines it;
 * `fill` and `stroke` set from Python win over it. Without either it is an outline only.
 */
export interface PolygonNode extends Node {
  type: 'Polygon';
  vertices: PointNode[];
  color?: string;
}

/** An open path through `vertices`. The built-in shapes have no open path of more than two points. */
export interface PolylineNode extends Node {
  type: 'Polyline';
  vertices: PointNode[];
}

// Adds the types above to the node types, so functions can take and return them.
declare module '~/lib/nodes/state/Node' {
  interface NodeTypeMap {
    Arrow: ArrowNode;
    ColoredLine: ColoredLineNode;
    Polygon: PolygonNode;
    Polyline: PolylineNode;
  }
}

// No arrow when it is zero length or NaN.
const renderArrow = (arrow: Accessor<ArrowNode>, unit: Accessor<number>) => {
  const shape = () => {
    const { p1, p2 } = arrow();
    const x1 = num(p1.x), y1 = num(p1.y), x2 = num(p2.x), y2 = num(p2.y);
    const dx = x2 - x1, dy = y2 - y1;
    const length = Math.hypot(dx, dy);
    if (!Number.isFinite(x1) || !Number.isFinite(y1) || !Number.isFinite(length) || length === 0) return null;
    const ux = dx / length, uy = dy / length;
    // The head shrinks to fit an arrow shorter than it.
    const head = Math.min(ARROW_HEAD / unit(), length);
    const baseX = x2 - head * ux, baseY = y2 - head * uy;
    const half = head / 2.5;
    return {
      x1, y1, baseX, baseY,
      head: `${x2},${y2} ${baseX - half * uy},${baseY + half * ux} ${baseX + half * uy},${baseY - half * ux}`,
    };
  };
  const stroke = () => arrow().stroke ?? arrow().color ?? 'currentColor';

  return (
    <Show when={shape()}>
      {(s) => (
        <>
          <line x1={s().x1} y1={s().y1} x2={s().baseX} y2={s().baseY} stroke={stroke()} stroke-width={STROKE_WIDTH} vector-effect="non-scaling-stroke" />
          <polygon points={s().head} fill={arrow().fill ?? stroke()} />
        </>
      )}
    </Show>
  );
};

const renderColoredLine = (line: Accessor<ColoredLineNode>) => (
  <Show when={line().p1 && line().p2}>
    <line
      x1={num(line().p1.x)} y1={num(line().p1.y)} x2={num(line().p2.x)} y2={num(line().p2.y)}
      stroke={line().stroke ?? line().color ?? 'currentColor'} stroke-width={STROKE_WIDTH} vector-effect="non-scaling-stroke"
    />
  </Show>
);

const pointsAttr = (vertices: PointNode[]) => vertices.map((p) => `${num(p.x)},${num(p.y)}`).join(' ');

const renderPolygon = (polygon: Accessor<PolygonNode>) => (
  <polygon
    points={pointsAttr(polygon().vertices)} fill={polygon().fill ?? polygon().color ?? 'none'}
    stroke={polygon().stroke ?? polygon().color ?? 'currentColor'}
    stroke-width={1} vector-effect="non-scaling-stroke"
  />
);

const renderPolyline = (polyline: Accessor<PolylineNode>) => (
  <polyline
    points={pointsAttr(polyline().vertices)} fill="none" stroke={polyline().stroke ?? 'currentColor'}
    stroke-width={STROKE_WIDTH} vector-effect="non-scaling-stroke"
  />
);

export const Arrow: NodeDefinition<ArrowNode> = { type: 'Arrow', prefix: 'arrow', render: renderArrow };
export const ColoredLine: NodeDefinition<ColoredLineNode> = { type: 'ColoredLine', prefix: 'cline', render: renderColoredLine };
export const Polygon: NodeDefinition<PolygonNode> ={ type: 'Polygon', prefix: 'poly', render: renderPolygon };
export const Polyline: NodeDefinition<PolylineNode> = { type: 'Polyline', prefix: 'pl', render: renderPolyline };
