import { createSignal, For, onCleanup, onMount, Show } from 'solid-js';
import type { ScalarNode } from '~/lib/nodes/state/Node';
import { num, scalar } from '~/lib/nodes/jax';
import { expectNode, type UiArg } from '~/lib/ui/nodeHandle';

/**
 * `pie.ui.dropdown(n, options=['a', 'b'])`: a dropdown with one entry per option. Scalar `n` holds the chosen index.
 * Drawn by the page, not the browser, so its open list matches the page. Keys: ↑ and ↓ move, Enter or Space
 * chooses, Escape closes.
 */
export function Dropdown(props: { args: UiArg[]; options?: string[] }) {
  const [n, setN] = expectNode<ScalarNode>(props.args[0], ['Scalar']);
  if (!props.options?.length) throw new Error('needs `options`, a list of strings');
  const options = props.options;

  const [open, setOpen] = createSignal(false);
  // The option under the mouse or the arrow keys while the list is open.
  const [active, setActive] = createSignal(0);
  const picked = () => num(n().value);
  let root!: HTMLDivElement;

  const show = () => {
    setActive(picked());
    setOpen(true);
  };
  const choose = (i: number) => {
    setN({ value: scalar(i) });
    setOpen(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open()) return show();
      const step = e.key === 'ArrowDown' ? 1 : -1;
      setActive((active() + step + options.length) % options.length);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (open()) choose(active());
      else show();
    } else if (e.key === 'Escape' || e.key === 'Tab') {
      setOpen(false);
    }
  };

  // A click anywhere outside closes the list.
  onMount(() => {
    const close = (e: PointerEvent) => {
      if (!root.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    onCleanup(() => document.removeEventListener('pointerdown', close));
  });

  return (
    <div class="pie-dropdown" ref={root}>
      <button
        type="button" class="pie-dropdown-button" aria-haspopup="listbox" aria-expanded={open()}
        onClick={() => (open() ? setOpen(false) : show())} onKeyDown={onKeyDown}
      >
        {options[picked()] ?? ''}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <Show when={open()}>
        <ul class="pie-dropdown-list" role="listbox">
          <For each={options}>
            {(option, i) => (
              <li
                role="option" aria-selected={picked() === i()} classList={{ 'pie-dropdown-active': active() === i() }}
                onPointerEnter={() => setActive(i())} onClick={() => choose(i())}
              >
                {option}
              </li>
            )}
          </For>
        </ul>
      </Show>
    </div>
  );
}
