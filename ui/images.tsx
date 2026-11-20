import { For, Show } from 'solid-js';
import type { TextNode } from '~/lib/nodes/state/Node';
import { expectNode, type UiArg } from '~/lib/ui/nodeHandle';

/**
 * `pie.ui.images(a, b, ..., captions=['A', 'B'])`: the images in Text nodes `a`, `b`, … side by side, at their own
 * size, each with its caption under it. Each Text holds an image URL or a data URL. An empty Text is skipped,
 * caption included.
 */
export function Images(props: { args: UiArg[]; captions?: string[] }) {
  const nodes = props.args.map((arg) => expectNode<TextNode>(arg, ['Text'])[0]);

  return (
    <div class="pie-images">
      <For each={nodes}>
        {(node, i) => (
          <Show when={node().value}>
            <figure>
              <img src={node().value} alt={props.captions?.[i()] ?? ''} />
              <Show when={props.captions?.[i()]}>
                <figcaption>{props.captions![i()]}</figcaption>
              </Show>
            </figure>
          </Show>
        )}
      </For>
    </div>
  );
}
