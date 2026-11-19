import { Index } from 'solid-js';
import { Textbox } from '~/lib/ui/components/textbox';
import type { UiArg } from '~/lib/ui/nodeHandle';
import { caseArgs } from './case';

/**
 * `pie.ui.case_textbox(n, [text_a, text_b])`: the text box of `pie.ui.textbox` for the node that Scalar `n` picks,
 * by index. Each node keeps its value while another is picked.
 */
export function CaseTextbox(props: { args: UiArg[] }) {
  const { items, picked } = caseArgs(props.args);

  // Every node keeps its text box; only the picked one shows.
  return (
    <span class="pie-case">
      <Index each={items}>
        {(item, i) => (
          <span style={{ display: picked() === i ? undefined : 'none' }}>
            <Textbox args={[item()]} />
          </span>
        )}
      </Index>
    </span>
  );
}
