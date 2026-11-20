import { createMemo, For, type JSX } from 'solid-js';
import type { TextNode } from '~/lib/nodes/state/Node';
import { expectNode, type UiArg } from '~/lib/ui/nodeHandle';

type Values = number | Values[];
type Marks = boolean | Marks[];
type GridItem = { name: string; values: Values; marked: Marks; clickable?: boolean };
type Item = GridItem | { text: string } | { error: string };

const ndim = (v: Values): number => (Array.isArray(v) ? 1 + ndim(v[0] ?? 0) : 0);

/**
 * `pie.ui.grids(data, cell)`: arrays drawn as grids of cells, side by side.
 * Text `data` holds a JSON list of items. `{"text": "→"}` is shown as is, `{"error": "..."}` as an error. An array is
 * `{"name", "values", "marked", "clickable"}`: `values` is a nested list of numbers, of any number of dimensions
 * (3D and up are drawn as their 2D slices side by side), and `marked` a nested list of booleans of the same shape.
 * Marked cells are colored, in another color in a clickable array. Hovering or clicking a cell of a clickable array
 * writes its index, e.g. `1,2`, into Text `cell`. Leaving the array puts back the last clicked index.
 */
export function Grids(props: { args: UiArg[] }) {
  const [data] = expectNode<TextNode>(props.args[0], ['Text']);
  const [cell, setCell] = expectNode<TextNode>(props.args[1], ['Text']);
  const items = createMemo<Item[]>(() => (data().value ? JSON.parse(data().value) : []));
  /** The last clicked cell. Hovering shows another cell; leaving the array goes back to this one. */
  let clicked = cell().value;
  const show = (value: string) => { if (cell().value !== value) setCell({ value }); };

  /** One cell, the cells of a 1D or 2D array as a grid, or the 2D slices of a 3D-and-up array side by side. */
  function cells(values: Values, marked: Marks, path: number[], clickable: boolean): JSX.Element {
    const d = ndim(values);
    if (d === 0) {
      return (
        <span
          class="pie-grids-cell"
          classList={{ 'pie-grids-marked': marked === true, 'pie-grids-clickable': clickable }}
          onMouseEnter={clickable ? () => show(path.join(',')) : undefined}
          onClick={clickable ? () => { clicked = path.join(','); show(clicked); } : undefined}
        >
          {String(values)}
        </span>
      );
    }
    if (d <= 2) {
      const rows = (d === 1 ? [values] : values) as Values[][];
      const markRows = (d === 1 ? [marked] : marked) as Marks[][];
      return (
        <span class="pie-grids-matrix" style={{ 'grid-template-columns': `repeat(${rows[0]?.length ?? 0}, auto)` }}>
          {rows.flatMap((row, r) =>
            row.map((v, c) => cells(v, markRows[r][c], d === 1 ? [...path, c] : [...path, r, c], clickable)))}
        </span>
      );
    }
    return (
      <span class="pie-grids-stack">
        {(values as Values[]).map((v, i) => cells(v, (marked as Marks[])[i], [...path, i], clickable))}
      </span>
    );
  }

  return (
    <div class="pie-grids">
      <For each={items()}>
        {(item) => ('error' in item
          ? <span class="pie-grids-error">{item.error}</span>
          : 'text' in item
          ? <span class="pie-grids-text">{item.text}</span>
          : (
            <span class="pie-grids-array" onMouseLeave={item.clickable ? () => show(clicked) : undefined}>
              <span class="pie-grids-name">{item.name}</span>
              {cells(item.values, item.marked, [], !!item.clickable)}
            </span>
          ))}
      </For>
    </div>
  );
}
