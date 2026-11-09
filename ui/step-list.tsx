import { createSignal, untrack } from 'solid-js';
import { play, type Track } from '~/lib/nodes/animation';
import { expectNode, type UiArg } from '~/lib/ui/nodeHandle';
import type { DiagramItem, DiagramNode } from '../nodes/diagram';

/** Changes to some items of a diagram: [item index, new values of its fields]. */
type Changes = [number, Partial<DiagramItem>][];

/**
 * One step of a figure. As the step plays, `start` is applied at once, the numbers in `move` are animated
 * there over half a second, and `end` is applied at the end.
 * `stagger`: [item index, n, count]: the item's move takes the n-th of `count` equal parts of the half second.
 */
interface Step {
  label: string;
  start?: Changes;
  move?: Changes;
  end?: Changes;
  stagger?: [number, number, number][];
}

const apply = (items: DiagramItem[], changes: Changes = []) => {
  const out = items.slice();
  for (const [i, change] of changes) out[i] = { ...out[i], ...change };
  return out;
};

/** `a` moved towards `b` by `t`, from 0 to 1. Only the position and size move. */
const tween = (a: DiagramItem, b: DiagramItem, t: number): DiagramItem => (a === b ? a : {
  ...a,
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
  w: a.w + (b.w - a.w) * t,
  h: a.h + (b.h - a.h) * t,
});

/**
 * `pie.ui.step_list(diagram, steps=[{'label': 'start'}, {'label': ..., 'start': ..., 'move': ..., 'end': ...}, ...])`:
 * three rows for the steps of Diagram node `diagram`: the previous step's label; a back button, `k/n` (the step shown
 * and the last step's number), a next button and the label of the step shown; the next step's label. Step 0 is the diagram as made. Next plays the step after the one shown;
 * back shows the step before it at once, as it ends.
 */
export function StepList(props: { args: UiArg[]; steps?: Step[] }) {
  const [diagram, setDiagram] = expectNode<DiagramNode>(props.args[0], ['Diagram']);
  const steps = props.steps ?? [];
  if (!steps.length) throw new Error('needs `steps`, a list of steps');

  // The items as each step starts, after its moves and as it ends.
  const ends = [untrack(diagram).items];
  const starts = [ends[0]];
  const moved = [ends[0]];
  for (let k = 1; k < steps.length; k++) {
    starts.push(apply(ends[k - 1], steps[k].start));
    moved.push(apply(starts[k], steps[k].move));
    ends.push(apply(moved[k], steps[k].end));
  }

  const last = steps.length - 1;
  const [shown, setShown] = createSignal(0);
  let playing = 0;  // the latest choice; an older animation stops when a new one starts

  /** Shows step `k` at once, as it ends. */
  const jump = (k: number) => {
    ++playing;
    setShown(k);
    setDiagram({ items: ends[k] });
  };

  /** Plays step `k` if it comes right after the one shown; otherwise shows it at once. */
  const choose = async (k: number) => {
    if (k < 0 || k > last) return;
    if (k !== shown() + 1) return jump(k);
    const token = ++playing;
    setShown(k);
    const parts = new Map((steps[k].stagger ?? []).map(([i, n, count]) => [i, [n, count]]));
    const local = (t: number, i: number) => {
      const part = parts.get(i);
      return part ? Math.min(Math.max(part[1] * t - part[0], 0), 1) : t;
    };
    const track: Track = {
      seek: (t) => {
        if (token === playing) setDiagram({ items: starts[k].map((item, i) => tween(item, moved[k][i], local(t, i))) });
      },
      stopped: () => token !== playing,
    };
    setDiagram({ items: starts[k] });
    await play([track]);
    if (token === playing) setDiagram({ items: ends[k] });
  };

  return (
    <div class="pie-ui-steps">
      <span class="pie-ui-steps-other">{shown() > 0 ? steps[shown() - 1].label : ' '}</span>
      <button type="button" aria-label="Previous step" disabled={shown() === 0} onClick={() => choose(shown() - 1)}>
        <svg viewBox="0 0 16 16" width="14" height="14"><polyline points="10,3 5,8 10,13" /></svg>
      </button>
      {/* As wide as the widest `k/n`, so the label doesn't shift as `k` gains digits. */}
      <span class="pie-ui-steps-count" style={{ 'min-width': `${2 * String(last).length + 1}ch` }}>{shown()}/{last}</span>
      <button type="button" aria-label="Next step" disabled={shown() === last} onClick={() => choose(shown() + 1)}>
        <svg viewBox="0 0 16 16" width="14" height="14"><polyline points="6,3 11,8 6,13" /></svg>
      </button>
      <span class="pie-ui-steps-name">{steps[shown()].label}</span>
      <span class="pie-ui-steps-other">{shown() < last ? steps[shown() + 1].label : ' '}</span>
    </div>
  );
}
