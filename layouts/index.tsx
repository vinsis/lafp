import { type Accessor, type Component, For, on, onCleanup, onMount, Show, createEffect, createMemo, createSignal } from "solid-js";
import { Dynamic } from "solid-js/web";
import { num } from "~/lib/nodes/jax";
import type { ScalarNode } from "~/lib/nodes/state/Node";
import { NodeStore } from "~/lib/nodes/state/NodeStore";
import { PythonScope } from "~/lib/python/runner";
import site from "../site.yml";
import { InteractiveIcon, OpenSourceIcon, PieLogo, ProgrammableIcon } from "./icons";
import { LogoTwoLine } from "./logo";

// The figure: points on the unit circle, each with an arrow to where the matrix sends it.
const MATRIX = [[1, 0.5], [-1, 2]];
const UNIT = 40;
const NUM_POINTS = 30;

/** The row vector [x, y] times `m`. */
const transform = (m: number[][]) => ([x, y]: number[]) => [x * m[0][0] + y * m[1][0], x * m[0][1] + y * m[1][1]];

const circlePoint = (i: number, n: number) => [Math.cos((2 * Math.PI * i) / n), Math.sin((2 * Math.PI * i) / n)];

/** A rainbow from red at t = 0, all at the same mid lightness so every hue shows on a light background. */
function rainbow(t: number) {
  return `oklch(0.55 0.14 ${29 + 360 * t})`;
}

const arrows = (m: number[][]) => Array.from({ length: NUM_POINTS }, (_, i) => {
  const from = circlePoint(i, NUM_POINTS);
  return { from, to: transform(m)(from), color: rainbow(i / NUM_POINTS) };
});

// Motion values for the two dots, sampled at the same angles, so the ellipse dot is always the circle dot times the matrix.
const motionValues = (f: (p: number[]) => number[]) =>
  Array.from({ length: 121 }, (_, i) => {
    const [x, y] = f(circlePoint(i, 120));
    return `${x * UNIT},${y * UNIT}`;
  }).join(";");
const circleValues = motionValues(p => p);

/** The 2×2 matrix in node `M`, or undefined if there is none: `pie.scalar(M, out='M')` makes it. */
function readMatrix(store: NodeStore): number[][] | undefined {
  const node = store.getNodeValue("M");
  if (node?.type !== "Array" || node.itemType !== "Scalar" || node.shape.join() !== "2,2") return;
  const [a, b, c, d] = node.items.map(item => num((item as ScalarNode).value));
  return [[a, b], [c, d]];
}

/** How long the figure takes to move to a new matrix: as long as pie's `animate=True`. */
const ANIMATION_MS = 500;

/** Slow at the start and end, fast in the middle, as in pie's animations. */
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) ** 2);

/** `target`, but moving entry by entry to each new value over `ANIMATION_MS`. A change mid-move starts from where it is. */
function animated(target: Accessor<number[][]>): Accessor<number[][]> {
  const [shown, setShown] = createSignal(target());
  let frame = 0;
  createEffect(on(target, to => {
    const from = shown();
    const start = performance.now();
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(function step() {
      const t = Math.min((performance.now() - start) / ANIMATION_MS, 1);
      const e = easeInOut(t);
      setShown(from.map((row, i) => row.map((v, j) => v + (to[i][j] - v) * e)));
      if (t < 1) frame = requestAnimationFrame(step);
    });
  }, { defer: true }));
  // `frame` is 0 on the server, which has no `cancelAnimationFrame`: effects run only in the browser.
  onCleanup(() => frame && cancelAnimationFrame(frame));
  return shown;
}

function Figure(props: { matrix: Accessor<number[][]> }) {
  const size = 200;
  const ticks = Array.from({ length: Math.floor(size / 2 / UNIT) * 2 + 1 }, (_, i) => (i - Math.floor(size / 2 / UNIT)) * UNIT);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <defs>
        <marker id="home-dot" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" markerUnits="userSpaceOnUse">
          <circle cx="5" cy="5" r="5" fill="#52525b" />
        </marker>
      </defs>
      <g transform={`translate(${size / 2} ${size / 2}) scale(1 -1)`}>
        <For each={ticks}>
          {t => (
            <>
              <line x1={t} y1={-size / 2} x2={t} y2={size / 2} stroke={t === 0 ? "#71717a" : "#a7b5b5"} stroke-width="1" />
              <line x1={-size / 2} y1={t} x2={size / 2} y2={t} stroke={t === 0 ? "#71717a" : "#a7b5b5"} stroke-width="1" />
            </>
          )}
        </For>
        <For each={arrows(props.matrix())}>
          {a => (
            <line
              x1={a.from[0] * UNIT} y1={a.from[1] * UNIT} x2={a.to[0] * UNIT} y2={a.to[1] * UNIT}
              stroke={a.color} stroke-width="1.5" marker-end="url(#home-dot)"
            />
          )}
        </For>
        <circle r="6" fill="#3f3f46">
          <animateMotion dur="2s" values={circleValues} calcMode="linear" repeatCount="indefinite" />
        </circle>
        <circle r="6" fill="#3f3f46">
          <animateMotion dur="2s" values={motionValues(transform(props.matrix()))} calcMode="linear" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  );
}

const MATRIX_CODE = `M = [[2, 1],
     [0, 1]]  

pie.scalar(M, out='M')
`;

const FIBONACCI_CODE = `def matmul(A, B):
    return [[sum(a * b for a, b in zip(row, col)) for col in zip(*B)] for row in A]

M = [[1, 1],
     [1, 0]]

# The top-right entry of M^n is the nth Fibonacci number.
P = M
for n in range(1, 11):   # try range(1, 101)
    print(n, P[0][1])
    P = matmul(P, M)

# Squaring jumps ahead: M^2, M^4, M^8, ... so M^n takes about log2(n) steps, not n.
def matpow(M, n):
    result = [[1, 0], [0, 1]]
    while n:
        if n & 1:
            result = matmul(result, M)
        M = matmul(M, M)
        n >>= 1
    return result

f = matpow(M, 10_000)[0][1]
print(f'The 10,000th Fibonacci number has {len(str(f))} digits:')
print(f)
`;

/** A runnable Python editor. Loaded in the browser only, as on Markdown pages. `store`: where its `pie.*` calls go. */
function TryPython(props: { code: string; store?: NodeStore }) {
  const [editor, setEditor] = createSignal<Component<{ code: string; scope: PythonScope }>>();
  const scope = new PythonScope(props.store);
  onCleanup(() => scope.dispose());
  onMount(() => {
    import("~/lib/markdown/components/PythonEditor").then(({ PythonEditor }) => setEditor(() => PythonEditor));
  });
  return (
    <Show when={editor()} fallback={<pre><code>{props.code}</code></pre>}>
      {e => <Dynamic component={e()} code={props.code} scope={scope} />}
    </Show>
  );
}

/** The homepage, at `/`. */
export default function Home() {
  // Holds the nodes the matrix editor makes. Not drawn: the figure reads `M` from it.
  const store = new NodeStore();
  // A bad `M`, e.g. 3×3, keeps the last good matrix.
  const matrix = animated(createMemo<number[][]>(prev => readMatrix(store) ?? prev, MATRIX));
  return (
    <main class="home">
      <div class="home-hero">
        <h1 aria-label={site.title}>
          <svg class="home-logo" viewBox="0 0 548 126" aria-hidden="true">
            <LogoTwoLine />
          </svg>
        </h1>
        <div class="home-buttons">
          <a class="home-button" href="/la/0_intro">eBook</a>
          <a class="home-button" href="/blog">Blog</a>
          <a class="home-button" href="/series">Series</a>
        </div>
        <ul class="home-features">
          <li><InteractiveIcon /> Interactive</li>
          <li><ProgrammableIcon /> Programmable</li>
          <li><OpenSourceIcon /> Open-source</li>
        </ul>
      </div>
      <div class="home-figure">
        <Figure matrix={matrix} />
      </div>
      <section class="home-try">
        <p>
          Try it: change the matrix.
          See <a href="/la/3_mat_vec_mul#333-circle-ellipse">chapter 3</a> for why it works.
        </p>
        <TryPython code={MATRIX_CODE} store={store} />
      </section>
      <section class="home-try">
        <p>
          Try it: Fibonacci numbers from powers of a matrix.
          See <a href="/la/18_fibonacci_numbers">chapter 18</a> for why it works.
        </p>
        <TryPython code={FIBONACCI_CODE} />
      </section>
      <p class="home-credits">
        Made with{" "}
        <a class="home-credits-pie" href="https://github.com/TinyVolt/pie-ssg" aria-label="pie-ssg" title="pie-ssg">
          <PieLogo />
        </a>{" "}
        by <a href="https://www.vinaysisodia.com/">Vinay Sisodia</a>.
        Logos designed by <a href="https://www.linkedin.com/in/jo-yun-hsu-5779b690/">Jo Hsu</a>.
      </p>
    </main>
  );
}
