import { Index, type Accessor } from 'solid-js';
import type { Node, NodeDefinition } from '~/lib/nodes/state/Node';

/** One filled polygon. `points` is flat, in grid units: [x0, y0, x1, y1, ...]. */
export interface PolygonsItem {
  points: number[];
  fill?: string;
  stroke?: string;
}

/** Many filled polygons in one node, drawn in list order: later ones on top. */
export interface PolygonsNode extends Node {
  type: 'Polygons';
  items: PolygonsItem[];
}

declare module '~/lib/nodes/state/Node' {
  interface NodeTypeMap {
    Polygons: PolygonsNode;
  }
}

const renderPolygons = (node: Accessor<PolygonsNode>) => (
  <g>
    <Index each={node().items}>
      {(item) => (
        <polygon
          points={item().points.join(' ')}
          fill={item().fill ?? node().fill ?? 'none'}
          stroke={item().stroke ?? node().stroke ?? 'none'}
          stroke-width={1} stroke-linejoin="round" vector-effect="non-scaling-stroke"
        />
      )}
    </Index>
  </g>
);

export const Polygons: NodeDefinition<PolygonsNode> = { type: 'Polygons', prefix: 'polygons', render: renderPolygons };
