import type { ScalarNode, TextNode } from '~/lib/nodes/state/Node';
import { num } from '~/lib/nodes/jax';
import { renderMarkdown } from '~/lib/markdown/render';
import { expectNode, type UiArg } from '~/lib/ui/nodeHandle';

/**
 * `pie.ui.markdown(n, sections=['# a', '# b'])`: the markdown section that Scalar `n` picks, by index.
 * `pie.ui.markdown(text)`: the markdown in Text node `text`.
 * Rendered like the page's text, `$…$` and `$$…$$` included.
 */
export function Markdown(props: { args: UiArg[]; sections?: string[] }) {
  const [n] = expectNode<ScalarNode | TextNode>(props.args[0], ['Scalar', 'Text']);
  const html = () => {
    const node = n();
    if (node.type === 'Text') return renderMarkdown(node.value);
    if (!props.sections?.length) throw new Error('needs `sections`, a list of markdown strings, or a Text node');
    const i = num(node.value);
    const section = props.sections![i];
    if (section === undefined) throw new Error(`no section at index ${i}; there are ${props.sections!.length}`);
    return renderMarkdown(section);
  };

  return <div class="pie-ui-markdown" innerHTML={html()} />;
}
