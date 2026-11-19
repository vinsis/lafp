import type { ScalarNode } from '~/lib/nodes/state/Node';
import { num } from '~/lib/nodes/jax';
import { expectNode, isHandle, type UiArg } from '~/lib/ui/nodeHandle';

/**
 * For the `pie.ui.case_*` UIs, whose arguments are Scalar `n` and a list of nodes: the list, and `picked()`, the
 * index `n` holds. `picked()` throws if no item has that index.
 */
export function caseArgs(args: UiArg[]) {
  const [n] = expectNode<ScalarNode>(args[0], ['Scalar']);
  const items = args[1];
  if (items === undefined || isHandle(items)) throw new Error('needs a list of nodes as its second argument');
  const picked = () => {
    const i = num(n().value);
    if (!(i >= 0 && i < items.length)) throw new Error(`no item at index ${i}; there are ${items.length}`);
    return i;
  };
  return { items, picked };
}
