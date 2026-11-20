import { Node2NodeFunc } from '~/lib/nodes/functions/Node2NodeFunc';
import type { AnyNode, TextNode } from '~/lib/nodes/state/Node';
import type { PolygonsItem } from '../nodes/polygons';

/**
 * Many filled polygons as one node, drawn in list order by the `Polygons` node type in `nodes/polygons.tsx`.
 * Called from Python as `pie.polygons(json.dumps(items))`, with `items` a list of dicts:
 * `points` (flat, [x0, y0, x1, y1, ...], in grid units), and optionally `fill` and `stroke`.
 * The node's own `fill` and `stroke` are the default for items without them.
 * @param items - The polygons as JSON text
 * @returns Polygons node
 * @auxiliaryNodes None
 */
export const PolygonsFunc: Node2NodeFunc = {
  keyword: 'polygons', outputType: 'Polygons',
  parameters: [{ name: 'items', type: 'Text' }],
  compute(inputs: AnyNode[]) {
    const items = JSON.parse((inputs[0] as TextNode).value || '[]') as PolygonsItem[];
    if (!Array.isArray(items)) throw new Error('polygons: expects a JSON list of polygons');
    return { main: { type: 'Polygons', items } };
  },
};
