import { Node2NodeFunc } from '~/lib/nodes/functions/Node2NodeFunc';
import { AnyNode, ArrayNode, ScalarNode } from '~/lib/nodes/state/Node';
import { num, scalar } from '~/lib/nodes/jax';

// Curves drawn by sampling, used by the ebook's polynomial and Bezier chapters. They compute
// with plain numbers, so `pie.partial` can't differentiate through them.

const SAMPLES = 200;

/**
 * The graph of the polynomial a₀ + a₁x + a₂x² + … for x from xMin to xMax:
 * `pie.polynomial([1, 2])` draws y = 1 + 2x.
 * @param coefficients - Array of scalars a₀, a₁, a₂, …
 * @param xMin - Left end; default -10
 * @param xMax - Right end; default 10
 * @returns Polyline node
 * @auxiliaryNodes None
 */
export const Polynomial: Node2NodeFunc = {
  keyword: 'polynomial', outputType: 'Polyline',
  parameters: [
    { name: 'coefficients', type: 'Array' },
    { name: 'xMin', type: 'Scalar', defaultValue: -10 }, { name: 'xMax', type: 'Scalar', defaultValue: 10 },
  ],
  compute(inputs: AnyNode[]) {
    const array = inputs[0] as ArrayNode;
    if (array.itemType !== 'Scalar') throw new Error(`polynomial: expected an array of scalars, got an array of ${array.itemType}`);
    const coefficients = array.items.map((item) => num((item as ScalarNode).value));
    const [xMin, xMax] = (inputs.slice(1) as ScalarNode[]).map((n) => num(n.value));
    const vertices = Array.from({ length: SAMPLES }, (_, i) => {
      const x = xMin + ((xMax - xMin) * i) / (SAMPLES - 1);
      // Horner's rule: a₀ + x(a₁ + x(a₂ + …)).
      const y = coefficients.reduceRight((acc, c) => acc * x + c, 0);
      return { type: 'Point', x: scalar(x), y: scalar(y) };
    });
    return { main: { type: 'Polyline', vertices } };
  },
};
