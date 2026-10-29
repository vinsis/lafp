import { createUniqueId, Index, useContext } from 'solid-js';
import type { ArrayNode, ScalarNode } from '~/lib/nodes/state/Node';
import { num, scalar } from '~/lib/nodes/jax';
import { play } from '~/lib/nodes/animation';
import { replaceNode } from '~/lib/nodes/functions/sideEffects';
import { expectNode, StoreContext, type UiArg } from '~/lib/ui/nodeHandle';

/**
 * `pie.ui.animated_radio(mask, options=['a', 'b'])`: one radio button per item of the Array of Scalars `mask`.
 * Choosing one moves its item to 1 and every other item to 0 over half a second, like
 * `translate_scalar_to(..., animate=True)`. Unlike `pie.ui.radio`, `mask` holds one weight per option, not an index.
 */
export function AnimatedRadio(props: { args: UiArg[]; options?: string[] }) {
  const [mask] = expectNode<ArrayNode>(props.args[0], ['Array']);
  const store = useContext(StoreContext)!;
  // Groups the buttons, so choosing one unchecks the others.
  const group = createUniqueId();
  const items = () => {
    const array = mask();
    if (array.itemType !== 'Scalar') throw new Error(`expects an Array of Scalars, got an Array of ${array.itemType}`);
    if (!props.options?.length) throw new Error('needs `options`, a list of labels');
    if (props.options.length !== array.items.length) {
      throw new Error(`got ${props.options.length} options for ${array.items.length} items`);
    }
    return array.items as ScalarNode[];
  };
  const choose = (chosen: number) => {
    const tracks = items().flatMap((item, i) => replaceNode(store, item, { value: scalar(i === chosen ? 1 : 0) }, true) ?? []);
    play(tracks);
  };

  return (
    <span class="pie-ui-choices">
      <Index each={items()}>
        {(item, i) => (
          <label>
            <input type="radio" name={group} checked={num(item().value) > 0.5} onChange={() => choose(i)} />
            {props.options![i]}
          </label>
        )}
      </Index>
    </span>
  );
}
