import { Index, useContext } from 'solid-js';
import type { ArrayNode, ScalarNode } from '~/lib/nodes/state/Node';
import { num, scalar } from '~/lib/nodes/jax';
import { play } from '~/lib/nodes/animation';
import { replaceNode } from '~/lib/nodes/functions/sideEffects';
import { expectNode, StoreContext, type UiArg } from '~/lib/ui/nodeHandle';

/**
 * `pie.ui.animated_checkboxes(mask, options=['a', 'b'])`: like `pie.ui.checkboxes`, but a ticked or
 * unticked item moves to 1 or 0 over half a second, like `translate_scalar_to(..., animate=True)`.
 */
export function AnimatedCheckboxes(props: { args: UiArg[]; options?: string[] }) {
  const [mask] = expectNode<ArrayNode>(props.args[0], ['Array']);
  const store = useContext(StoreContext)!;
  const items = () => {
    const array = mask();
    if (array.itemType !== 'Scalar') throw new Error(`expects an Array of Scalars, got an Array of ${array.itemType}`);
    if (props.options && props.options.length !== array.items.length) {
      throw new Error(`got ${props.options.length} options for ${array.items.length} items`);
    }
    return array.items as ScalarNode[];
  };
  const animateTo = (item: ScalarNode, value: number) => {
    const track = replaceNode(store, item, { value: scalar(value) }, true);
    if (track) play([track]);
  };

  return (
    <span class="pie-ui-choices">
      <Index each={items()}>
        {(item, i) => (
          <label>
            <input
              type="checkbox"
              checked={num(item().value) !== 0}
              onChange={(e) => animateTo(item(), e.currentTarget.checked ? 1 : 0)}
            />
            {props.options?.[i] ?? String(i)}
          </label>
        )}
      </Index>
    </span>
  );
}
