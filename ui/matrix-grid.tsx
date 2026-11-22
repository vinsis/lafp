import { For } from 'solid-js';
import type { TextNode } from '~/lib/nodes/state/Node';
import { expectNode, type UiArg } from '~/lib/ui/nodeHandle';
import { matrixGridItems, type Shape } from './numpy-index';

/**
 * `pie.ui.matrix_grid(expr, shapes={'A': [5, 8]}, size=12, color='#e11d48')`: the arrays in Text `expr`, a numpy
 * expression such as `A[:3, :] @ A.T`, as grids of squares `size` pixels wide, side by side, with the operators
 * between them (`@` shown as ×). Each operand is drawn as the array before its first `[...]`, with the cells it
 * picks in `color`. `shapes` gives each name's shape: 1 or 2 whole
 * numbers. Bad syntax, an unknown name or a bad index shows an error instead; a shape mismatch in an operator shows
 * after the grids. See `numpy-index.ts` for the syntax.
 */
export function MatrixGrid(props: { args: UiArg[]; shapes?: Record<string, unknown>; size?: number; color?: string }) {
  const [expr] = expectNode<TextNode>(props.args[0], ['Text']);
  const shapes = checkShapes(props.shapes);
  const size = props.size ?? 12;
  const color = props.color ?? '#e11d48';
  const items = () => matrixGridItems(expr().value, shapes);

  return (
    <div class="pie-grids">
      <For each={items()}>
        {(item) => (item.kind === 'grid'
          ? (
            <span class="pie-grids-array">
              <Cells shape={item.shape} marked={item.marked} size={size} color={color} />
            </span>
          )
          : <span class={item.kind === 'text' ? 'pie-grids-text' : 'pie-grids-error'}>{item.text}</span>)}
      </For>
    </div>
  );
}

/** A 2D array as rows of squares; a 1D array as one row. */
function Cells(props: { shape: Shape; marked: boolean[]; size: number; color: string }) {
  const cols = props.shape[props.shape.length - 1];
  const rows = props.shape.length === 1 ? 1 : props.shape[0];
  const s = props.size;
  return (
    <svg width={cols * s + 1} height={rows * s + 1} style={{ display: 'block' }}>
      {props.marked.map((on, i) => (
        <rect
          x={(i % cols) * s + 0.5} y={Math.floor(i / cols) * s + 0.5} width={s} height={s}
          fill={on ? props.color : '#f4f4f5'} stroke="#3f3f46" stroke-width={1}
        />
      ))}
    </svg>
  );
}

function checkShapes(shapes: Record<string, unknown> | undefined): Record<string, Shape> {
  if (!shapes || typeof shapes !== 'object') throw new Error("needs shapes, e.g. shapes={'A': [5, 8]}");
  for (const [name, s] of Object.entries(shapes)) {
    if (!Array.isArray(s) || s.length < 1 || s.length > 2 || !s.every((n) => Number.isInteger(n) && n >= 0)) {
      throw new Error(`shapes['${name}'] must be a list of 1 or 2 whole numbers, got ${JSON.stringify(s)}`);
    }
  }
  return shapes as Record<string, Shape>;
}
