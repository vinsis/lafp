import { Index } from 'solid-js';
import type { UiArg } from '~/lib/ui/nodeHandle';
import { caseArgs } from './case';
import { TextRadio } from './text_radio';

/**
 * `pie.ui.case_text_radio(n, [text_a, text_b], options=[['a1', 'a2'], ['b1', 'b2']])`: the radio buttons of
 * `pie.ui.text_radio` for the Text that Scalar `n` picks, by index, with that Text's options.
 */
export function CaseTextRadio(props: { args: UiArg[]; options?: string[][] }) {
  const { items, picked } = caseArgs(props.args);
  if (props.options?.length !== items.length) {
    throw new Error(`needs \`options\`, one list of strings per Text: got ${props.options?.length ?? 0} lists for ${items.length} Texts`);
  }

  // Every Text keeps its buttons; only the picked one shows.
  return (
    <span class="pie-case">
      <Index each={items}>
        {(text, i) => (
          <span style={{ display: picked() === i ? undefined : 'none' }}>
            <TextRadio args={[text()]} options={props.options![i]} />
          </span>
        )}
      </Index>
    </span>
  );
}
