import { Show } from 'solid-js';
import type { ScalarNode } from '~/lib/nodes/state/Node';
import { num } from '~/lib/nodes/jax';
import { Slider } from '~/lib/ui/components/slider';
import { expectNode, type UiArg } from '~/lib/ui/nodeHandle';

/**
 * `pie.ui.slider_if(n, show, min=0, max=1, step=0.01)`: the slider of `pie.ui.slider` for Scalar `n`, shown only
 * while Scalar `show` is not 0. While hidden, its grip and label hide too.
 */
export function SliderIf(props: { args: UiArg[]; min?: number; max?: number; step?: number }) {
  const [show] = expectNode<ScalarNode>(props.args[1], ['Scalar']);
  return (
    <Show when={num(show().value) !== 0}>
      <Slider args={[props.args[0]]} min={props.min} max={props.max} step={props.step} />
    </Show>
  );
}
