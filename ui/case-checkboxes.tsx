import { Index } from 'solid-js';
import type { ScalarNode } from '~/lib/nodes/state/Node';
import { num } from '~/lib/nodes/jax';
import { Checkboxes } from '~/lib/ui/components/checkboxes';
import { expectNode, isHandle, type UiArg } from '~/lib/ui/nodeHandle';

/**
 * `pie.ui.case_checkboxes(n, [mask_a, mask_b], options=[['a1', 'a2'], ['b1', 'b2']])`: the checkboxes of
 * `pie.ui.checkboxes` for the Array of Scalars that Scalar `n` picks, by index. `options`: one label list per Array.
 */
export function CaseCheckboxes(props: { args: UiArg[]; options?: string[][] }) {
  const [n] = expectNode<ScalarNode>(props.args[0], ['Scalar']);
  const masks = props.args[1];
  if (masks === undefined || isHandle(masks)) throw new Error('needs a list of Arrays as its second argument');
  if (props.options && props.options.length !== masks.length) {
    throw new Error(`got ${props.options.length} option lists for ${masks.length} Arrays`);
  }
  const picked = () => {
    const i = num(n().value);
    if (!(i >= 0 && i < masks.length)) throw new Error(`no Array at index ${i}; there are ${masks.length}`);
    return i;
  };

  // Every Array keeps its checkboxes; only the picked one shows.
  return (
    <span>
      <Index each={masks}>
        {(mask, i) => (
          <span style={{ display: picked() === i ? undefined : 'none' }}>
            <Checkboxes args={[mask()]} options={props.options?.[i]} />
          </span>
        )}
      </Index>
    </span>
  );
}
