import { batch, createUniqueId, For } from 'solid-js';
import type { ArrayNode, ScalarNode } from '~/lib/nodes/state/Node';
import { num, scalar } from '~/lib/nodes/jax';
import { expectNode, useSetNode, type UiArg } from '~/lib/ui/nodeHandle';

/**
 * `pie.ui.bits_radio(bits)`: one radio button per bit pattern of the Array of Scalars `bits`, `00…0` to `11…1`.
 * The first item is the leftmost bit. Choosing a pattern writes every item, so it stays in sync with
 * `pie.ui.checkboxes(bits)`. An item other than 0 counts as 1.
 */
export function BitsRadio(props: { args: UiArg[] }) {
  const [bits] = expectNode<ArrayNode>(props.args[0], ['Array']);
  const setNode = useSetNode();
  // Groups the buttons, so choosing one unchecks the others.
  const group = createUniqueId();
  const items = () => {
    const array = bits();
    if (array.itemType !== 'Scalar') throw new Error(`expects an Array of Scalars, got an Array of ${array.itemType}`);
    return array.items as ScalarNode[];
  };
  const patterns = () => {
    const n = items().length;
    return Array.from({ length: 2 ** n }, (_, p) => p.toString(2).padStart(n, '0'));
  };
  const current = () => items().map((item) => (num(item.value) !== 0 ? '1' : '0')).join('');
  const choose = (pattern: string) => {
    batch(() => items().forEach((item, i) => setNode(item, { value: scalar(Number(pattern[i])) })));
  };

  return (
    <span class="pie-ui-choices">
      <For each={patterns()}>
        {(pattern) => (
          <label>
            <input type="radio" name={group} checked={current() === pattern} onChange={() => choose(pattern)} />
            {pattern}
          </label>
        )}
      </For>
    </span>
  );
}
