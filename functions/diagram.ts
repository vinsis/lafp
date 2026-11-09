import { Node2NodeFunc } from '~/lib/nodes/functions/Node2NodeFunc';
import type { AnyNode, TextNode } from '~/lib/nodes/state/Node';
import type { DiagramItem } from '../nodes/diagram';

/**
 * Many boxes and lines as one node, drawn by the `Diagram` node type in `nodes/diagram.tsx`.
 * Called from Python as `pie.diagram(json.dumps(items))`, with `items` a list of dicts with the fields of `DiagramItem`.
 * `pie.ui.step_list` changes the node to show the steps of a figure.
 * @param items - The items as JSON text
 * @returns Diagram node
 * @auxiliaryNodes None
 */
export const DiagramFunc: Node2NodeFunc = {
  keyword: 'diagram', outputType: 'Diagram',
  parameters: [{ name: 'items', type: 'Text' }],
  compute(inputs: AnyNode[]) {
    const items = JSON.parse((inputs[0] as TextNode).value) as DiagramItem[];
    if (!Array.isArray(items)) throw new Error('diagram: expects a JSON list of items');
    return { main: { type: 'Diagram', items } };
  },
};
