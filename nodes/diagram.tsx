import { Index, Show, type Accessor } from 'solid-js';
import type { Node, NodeDefinition } from '~/lib/nodes/state/Node';

/** One shape of a diagram: a box, or a line. All sizes are in grid units. */
export interface DiagramItem {
  /** A box's bottom-left corner and size. A line goes from (x, y) to (x + w, y + h). */
  x: number;
  y: number;
  w: number;
  h: number;
  line?: boolean;
  fill?: string;
  stroke?: string;
  /** Text at the center of the box. A box of size 0 draws only its label. */
  label?: string;
  /** In pixels. Default 12. */
  font?: number;
  /** The label's width: it wraps at spaces to fit. 0 or left out: one line. */
  wrap?: number;
  /** The label's color. */
  color?: string;
}

/** Many boxes and lines in one node, so a figure of many shapes is one node to draw and to change. */
export interface DiagramNode extends Node {
  type: 'Diagram';
  items: DiagramItem[];
}

declare module '~/lib/nodes/state/Node' {
  interface NodeTypeMap {
    Diagram: DiagramNode;
  }
}

/** `text` broken at spaces into lines of at most `chars` characters. A longer word gets a line of its own. */
function wrapLines(text: string, chars: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/).filter(Boolean)) {
    if (line && line.length + 1 + word.length > chars) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  return line ? [...lines, line] : lines;
}

const Label = (props: { item: DiagramItem; unit: number }) => {
  const fs = () => (props.item.font ?? 12) / props.unit;
  const lines = () => {
    const wrap = props.item.wrap ?? 0;
    return wrap > 0 ? wrapLines(props.item.label ?? '', Math.max(1, Math.floor(wrap / (0.55 * fs())))) : [props.item.label ?? ''];
  };
  const cx = () => props.item.x + props.item.w / 2;
  // y grows upward: the first line is the highest.
  const top = () => props.item.y + props.item.h / 2 + ((lines().length - 1) * 1.4 * fs()) / 2;
  return (
    <Index each={lines()}>
      {(line, i) => (
        // scale(1, -1) undoes the canvas's flip, so the text is upright.
        <g transform={`translate(${cx()}, ${top() - i * 1.4 * fs()}) scale(1, -1)`}>
          <text x={0} y={0} font-size={`${fs()}`} text-anchor="middle" dominant-baseline="central" fill={props.item.color ?? 'currentColor'}>
            {line()}
          </text>
        </g>
      )}
    </Index>
  );
};

// Every shape first, then every label, so labels are never hidden under a box.
const renderDiagram = (diagram: Accessor<DiagramNode>, unit: Accessor<number>) => (
  <g>
    <Index each={diagram().items}>
      {(item) => (
        <Show when={item().line ? item().w !== 0 || item().h !== 0 : item().w > 0 && item().h > 0}>
          {item().line ? (
            <line
              x1={item().x} y1={item().y} x2={item().x + item().w} y2={item().y + item().h}
              stroke={item().stroke ?? 'currentColor'} stroke-width={1} vector-effect="non-scaling-stroke"
            />
          ) : (
            <rect
              x={item().x} y={item().y} width={item().w} height={item().h}
              fill={item().fill ?? 'none'} stroke={item().stroke ?? 'none'} stroke-width={1} vector-effect="non-scaling-stroke"
            />
          )}
        </Show>
      )}
    </Index>
    <Index each={diagram().items}>
      {(item) => (
        <Show when={item().label}>
          <Label item={item()} unit={unit()} />
        </Show>
      )}
    </Index>
  </g>
);

export const Diagram: NodeDefinition<DiagramNode> = { type: 'Diagram', prefix: 'diagram', render: renderDiagram };
