import { createUniqueId, For } from 'solid-js';
import type { TextNode } from '~/lib/nodes/state/Node';
import { expectNode, type UiArg } from '~/lib/ui/nodeHandle';

/**
 * `pie.ui.text_radio(text, options=['a', 'b'])`: one radio button per option. Choosing one writes it into Text `text`.
 * A button is checked while `text` holds its option.
 */
export function TextRadio(props: { args: UiArg[]; options?: string[] }) {
  const [text, setText] = expectNode<TextNode>(props.args[0], ['Text']);
  if (!props.options?.length) throw new Error('needs `options`, a list of strings');
  // Groups the buttons, so choosing one unchecks the others.
  const group = createUniqueId();

  return (
    <span class="pie-ui-choices">
      <For each={props.options}>
        {(option) => (
          <label>
            <input type="radio" name={group} checked={text().value === option} onChange={() => setText({ value: option })} />
            {option}
          </label>
        )}
      </For>
    </span>
  );
}
