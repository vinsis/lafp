import type { ScalarNode } from '~/lib/nodes/state/Node';
import { num } from '~/lib/nodes/jax';
import { renderMarkdown } from '~/lib/markdown/render';
import { expectNode, type UiArg } from '~/lib/ui/nodeHandle';

/**
 * `pie.ui.markdown(n, sections=['# a', '# b'])`: the markdown section that Scalar `n` picks, by index.
 * Rendered like the page's text, `$…$` and `$$…$$` included.
 */
export function Markdown(props: { args: UiArg[]; sections?: string[] }) {
  const [n] = expectNode<ScalarNode>(props.args[0], ['Scalar']);
  if (!props.sections?.length) throw new Error('needs `sections`, a list of markdown strings');
  const html = () => {
    const i = num(n().value);
    const section = props.sections![i];
    if (section === undefined) throw new Error(`no section at index ${i}; there are ${props.sections!.length}`);
    return renderMarkdown(section);
  };

  return <div class="pie-ui-markdown" innerHTML={html()} />;
}
