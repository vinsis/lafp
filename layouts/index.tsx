import { type Accessor, type Component, type JSX, For, Index, on, onCleanup, onMount, Show, createEffect, createMemo, createSignal } from "solid-js";
import { Dynamic } from "solid-js/web";
import { num } from "~/lib/nodes/jax";
import type { ScalarNode } from "~/lib/nodes/state/Node";
import { NodeStore } from "~/lib/nodes/state/NodeStore";
import { PythonScope } from "~/lib/python/runner";
import latest from "virtual:latest-pages";
import site from "../site.yml";
import { type Mesh, projectMesh } from "../functions/mesh";
import {
  ArticleIcon, BookIcon, ChevronLeftIcon, ChevronRightIcon, InteractiveIcon, OpenSourceIcon, PieLogo, ProgrammableIcon,
  SeriesIcon, ToolsIcon,
} from "./icons";
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

const MATRIX_CODE = `import numpy as np

# Modify a matrix, or add your own, to change the shape of the ellipse, then click Run.
matrices = {
    'general':    [[2, 1], [0, 1]],
    'stretch':    [[2, 0], [0, 0.5]],
    'skew':       [[1, 0], [1, 1]],
    'rotation':   [[0.8, 0.6], [-0.6, 0.8]],
    'reflection': [[1, 0], [0, -1]],
    'singular':   [[1, 0.5], [2, 1]],
}
names = list(matrices)

def pick(i):
    return np.array(matrices[names[int(i)]])

choice = pie.scalar(0, out='choice')
pie.lift(pick, pie.Array[pie.Scalar])(choice, out='M')
pie.ui.radio(choice, options=names)
`;

/** The ellipse: the unit circle's points, each with an arrow to where the matrix `M` in `store` sends it. */
function EllipseFigure(props: { store: NodeStore }) {
  // A bad `M`, e.g. 3×3, keeps the last good matrix.
  const matrix = animated(createMemo<number[][]>(prev => readMatrix(props.store) ?? prev, MATRIX));
  return <Figure matrix={matrix} />;
}

/** Array of Scalars node `id`'s shape and numbers, row by row, or undefined if there is none. */
function readArray(store: NodeStore, id: string): { shape: number[]; values: number[] } | undefined {
  const node = store.getNodeValue(id);
  if (node?.type !== "Array" || node.itemType !== "Scalar") return;
  return { shape: node.shape, values: node.items.map(item => num((item as ScalarNode).value)) };
}

const SVD_IMAGE = "/blog/plane.jpg";   // 224 × 224

const SVD_CODE = `import base64, io
import numpy as np
from PIL import Image
from pyodide.http import pyfetch

# The image: one 224×224 matrix per color, values in [0, 1].
response = await pyfetch('${SVD_IMAGE}')
X = np.asarray(Image.open(io.BytesIO(await response.bytes())).convert('RGB')) / 255

# SVD of each color matrix, X_c = U Σ Vᵀ. Computed once: moving k only changes how many terms are kept.
factors = [np.linalg.svd(X[:, :, c], full_matrices=False) for c in range(3)]

def rank_k(k):
    """Each color matrix cut to its top k singular values: the closest matrix of rank k."""
    k = int(k)
    Xk = np.stack([U[:, :k] * s[:k] @ Vt[:k] for U, s, Vt in factors], axis=2)
    return to_image(Xk)

def to_image(X):
    """X as a BMP data URL, for the figure. Values are clipped to [0, 1]."""
    buffer = io.BytesIO()
    Image.fromarray((np.clip(X, 0, 1) * 255).round().astype(np.uint8)).save(buffer, format='BMP')
    return 'data:image/bmp;base64,' + base64.b64encode(buffer.getvalue()).decode()

k = pie.scalar(10, out='k')
pie.lift(rank_k, pie.Text)(k, out='Xk')
pie.ui.slider(k, min=1, max=100, step=1, label='k')
`;

/** The image, or once the code has run, its rank-k version: Text `Xk` in `store`, with k from Scalar `k`. */
function SvdFigure(props: { store: NodeStore }) {
  const image = () => {
    const node = props.store.getNodeValue("Xk");
    return node?.type === "Text" && node.value ? node.value : undefined;
  };
  const k = () => {
    const node = props.store.getNodeValue("k");
    return node?.type === "Scalar" ? num(node.value) : undefined;
  };
  return (
    <figure class="home-svd">
      <img src={image() ?? SVD_IMAGE} width="224" height="224" alt="" />
      <figcaption>{image() && k() !== undefined ? `Rank ${k()}` : "Original"}</figcaption>
    </figure>
  );
}

const TEAPOT_URL = "/models/teapot.obj";

const TEAPOT_CODE = `import numpy as np

# The figure multiplies each point (x, y, z, 1) of the teapot by M, then by a fixed camera.

def rotate_y(deg):
    """Turns about the y-axis, which points up."""
    c, s = np.cos(np.radians(deg)), np.sin(np.radians(deg))
    return np.array([[c, 0, s, 0], [0, 1, 0, 0], [-s, 0, c, 0], [0, 0, 0, 1]])

def rotate_x(deg):
    """Tilts about the x-axis, which points right."""
    c, s = np.cos(np.radians(deg)), np.sin(np.radians(deg))
    return np.array([[1, 0, 0, 0], [0, c, -s, 0], [0, s, c, 0], [0, 0, 0, 1]])

def model(turn, tilt):
    """Turn, then tilt: the rightmost matrix acts first."""
    return rotate_x(tilt) @ rotate_y(turn)

turn, tilt = pie.scalar(30, out='turn'), pie.scalar(20, out='tilt')
pie.lift(model, pie.Array[pie.Scalar])(turn, tilt, out='M')
pie.ui.slider(turn, min=-180, max=180, step=1, label='turn')
pie.ui.slider(tilt, min=-90, max=90, step=1, label='tilt')
`;

/** An OBJ file's vertices and triangles, centered on the origin and scaled into the cube [-1, 1]³. */
function parseObj(text: string): Mesh {
  const vertices: number[][] = [];
  const faces: number[][] = [];
  for (const line of text.split("\n")) {
    const p = line.trim().split(/\s+/);
    if (p[0] === "v") vertices.push(p.slice(1, 4).map(Number));
    if (p[0] === "f") faces.push(p.slice(1, 4).map(t => parseInt(t, 10) - 1));
  }
  const mid = [0, 1, 2].map(i => (Math.min(...vertices.map(v => v[i])) + Math.max(...vertices.map(v => v[i]))) / 2);
  const centered = vertices.map(v => v.map((x, i) => x - mid[i]));
  const extent = Math.max(...centered.flat().map(Math.abs));
  return { vertices: centered.map(v => v.map(x => x / extent)), faces };
}

/** `TEAPOT_CODE`'s model matrix before it runs: turned 30° and tilted 20°, 16 numbers row by row. */
const TEAPOT_MODEL = (() => {
  const [turn, tilt] = [30, 20].map(d => (d * Math.PI) / 180);
  const [cy, sy, cx, sx] = [Math.cos(turn), Math.sin(turn), Math.cos(tilt), Math.sin(tilt)];
  return [cy, 0, sy, 0, sx * sy, cx, -sx * cy, 0, -cx * sy, sx, cx * cy, 0, 0, 0, 0, 1];
})();

/** The camera at z = 4 looking at the origin, then a 45° perspective, as in the 3D tool. */
const TEAPOT_CAMERA = (() => {
  const [distance, near, far] = [4, 0.1, 100];
  const f = 1 / Math.tan((45 * Math.PI) / 180 / 2);
  const a = (far + near) / (near - far);
  const b = (2 * far * near) / (near - far);
  return [f, 0, 0, 0, 0, f, 0, 0, 0, 0, a, b - a * distance, 0, 0, -1, distance];
})();

/** The teapot, turned by the 4×4 matrix `M` in `store`. */
function TeapotFigure(props: { store: NodeStore }) {
  const size = 224;
  const [mesh, setMesh] = createSignal<Mesh>();
  onMount(() => {
    fetch(TEAPOT_URL).then(r => r.text()).then(text => setMesh(parseObj(text)));
  });
  const model = () => {
    const M = readArray(props.store, "M");
    return M?.shape.join() === "4,4" ? M.values : TEAPOT_MODEL;
  };
  const triangles = createMemo(() => {
    const m = mesh();
    return m ? projectMesh(m, model(), TEAPOT_CAMERA, 1) : [];
  });
  return (
    <svg width={size} height={size} viewBox="-1 -1 2 2" aria-hidden="true">
      <g transform="scale(1 -1)">
        <Index each={triangles()}>
          {t => (
            <polygon
              points={t().points.join(" ")} fill={t().fill} stroke={t().stroke}
              stroke-width="1" stroke-linejoin="round" vector-effect="non-scaling-stroke"
            />
          )}
        </Index>
      </g>
    </svg>
  );
}

const EINSUM_CODE = `import json
import numpy as np

A = np.arange(6).reshape(2, 3)
B = np.arange(12).reshape(3, 4)
S = np.arange(9).reshape(3, 3)
u, v = np.array([1, 2, 3]), np.array([10, 20])

# Each example: what it computes, its subscripts, and the arrays they name.
EXAMPLES = [
    ('matrix product', 'ij,jk->ik', {'A': A, 'B': B}),
    ('outer product', 'i,j->ij', {'u': u, 'v': v}),
    ('column sums', 'ij->j', {'A': A}),
    ('diagonal', 'ii->i', {'S': S}),
    ('transpose', 'ij->ji', {'A': A}),
]

def used(letters, x, out, idx):
    """Which cells of x make out[idx]. Each letter of out takes its value in idx. A letter not in out is summed
    over, so it takes every value, but the same one everywhere it appears."""
    m = np.zeros(x.shape, bool)
    for pos in np.ndindex(x.shape):
        value = dict(zip(out, idx))
        m[pos] = all(value.setdefault(l, p) == p for l, p in zip(letters, pos))
    return m

def chosen(cell, shape):
    """The index written in cell, e.g. '1,2', or the first cell if it isn't one of shape's."""
    try:
        idx = tuple(int(s) for s in cell.split(','))
    except ValueError:
        return (0,) * len(shape)
    inside = len(idx) == len(shape) and all(0 <= i < n for i, n in zip(idx, shape))
    return idx if inside else (0,) * len(shape)

def grid(x, marked, clickable=False):
    """One array for pie.ui.grids, with no name over it."""
    return {'name': '', 'values': x.tolist(), 'marked': marked.tolist(), 'clickable': clickable}

def figure(choice, cell):
    """The arrays and out as grids. The cells that make the chosen cell of out are marked."""
    _, spec, arrays = EXAMPLES[int(choice)]
    ins, out = spec.split('->')
    result = np.einsum(spec, *arrays.values())
    idx = chosen(cell, result.shape)
    items = []
    for letters, x in zip(ins.split(','), arrays.values()):
        if items:
            items.append({'text': ','})
        items.append(grid(x, used(letters, x, out, idx)))
    picked = np.zeros(result.shape, bool)
    picked[idx] = True
    items += [{'text': '→'}, grid(result, picked, clickable=True)]
    return json.dumps(items)

def call(choice):
    """The example's einsum call, as Markdown code."""
    _, spec, arrays = EXAMPLES[int(choice)]
    return f"\`np.einsum('{spec}', {', '.join(arrays)})\`"

choice = pie.scalar(0, out='choice')
cell = pie.text('', out='cell')   # the chosen cell of out, e.g. '1,2'
pie.ui.radio(choice, options=[name for name, _, _ in EXAMPLES])
pie.ui.markdown(pie.lift(call, pie.Text)(choice))
pie.ui.grids(pie.lift(figure, pie.Text)(choice, cell), cell)
`;

/**
 * One example on the homepage: its title, the text with it, its code, and the figure its code drives.
 * No `figure`: the code's UIs, under its editor, are the figure.
 */
type Example = { title: string; intro: () => JSX.Element; code: string; figure?: Component<{ store: NodeStore }> };

const EXAMPLES: Example[] = [
  {
    title: "Circle → ellipse",
    intro: () => <>Change the matrix. See <a href="/la/3_mat_vec_mul#333-circle-ellipse">chapter 3</a> for why it works.</>,
    code: MATRIX_CODE,
    figure: EllipseFigure,
  },
  {
    title: "SVD of an image",
    intro: () => (
      <>
        Best rank-k approximation of an image. See <a href="/la/23_svd">chapter 23</a> for
        SVD, and the <a href="/tools/image_matrix">image tool</a> for more.
      </>
    ),
    code: SVD_CODE,
    figure: SvdFigure,
  },
  {
    title: "Rotate a teapot",
    intro: () => (
      <>
        3D rotations. See <a href="/la/12_rotations">chapter 12</a> for
        rotations, and the <a href="/tools/3d_model">3D tool</a> for more.
      </>
    ),
    code: TEAPOT_CODE,
    figure: TeapotFigure,
  },
  {
    title: "Einsum",
    intro: () => (
      <>
        Visualize Einstein summation on tensors. See the{" "}
        <a href="/tools/broadcasting_einsum">einsum tool</a> for more.
      </>
    ),
    code: EINSUM_CODE,
  },
];

/** The examples, one at a time, with buttons to the previous and next. Each keeps its own Python variables and figure. */
function Examples() {
  const [current, setCurrent] = createSignal(0);
  const go = (step: number) => setCurrent(i => (i + step + EXAMPLES.length) % EXAMPLES.length);
  return (
    <section class="home-try">
      <div class="home-try-nav">
        <button type="button" class="home-try-arrow" aria-label="Previous example" title="Previous example" onClick={() => go(-1)}>
          <ChevronLeftIcon />
        </button>
        <div class="home-try-head">
          <span class="home-try-title">{EXAMPLES[current()].title}</span>
          <p>{EXAMPLES[current()].intro()}</p>
        </div>
        <button type="button" class="home-try-arrow" aria-label="Next example" title="Next example" onClick={() => go(1)}>
          <ChevronRightIcon />
        </button>
      </div>
      <For each={EXAMPLES}>
        {(example, i) => <ExampleView example={example} hidden={i() !== current()} />}
      </For>
    </section>
  );
}

/** One example: its editor and its figure. Hidden, not removed, when another is shown, so it keeps its state. */
function ExampleView(props: { example: Example; hidden: boolean }) {
  // Holds the nodes the example's editor makes. Not drawn: the figure reads them.
  // The arguments are those of a page with `canvas: none`: the canvas on the right, collapsed.
  const store = new NodeStore("right", "first");
  return (
    <div class="home-try-example" hidden={props.hidden}>
      <TryPython code={props.example.code} store={store} collapsed />
      <Show when={props.example.figure}>
        {figure => (
          <div class="home-figure">
            <Dynamic component={figure()} store={store} />
          </div>
        )}
      </Show>
    </div>
  );
}

/** A runnable Python editor. Loaded in the browser only, as on Markdown pages. `store`: where its `pie.*` calls go. */
function TryPython(props: { code: string; store?: NodeStore; collapsed?: boolean }) {
  const [editor, setEditor] = createSignal<Component<{ code: string; collapsed?: boolean; scope: PythonScope }>>();
  const scope = new PythonScope(props.store);
  onCleanup(() => scope.dispose());
  onMount(() => {
    import("~/lib/markdown/components/PythonEditor").then(({ PythonEditor }) => setEditor(() => PythonEditor));
  });
  return (
    // A collapsed editor has no code block while it loads, so the code doesn't flash up and vanish.
    <Show when={editor()} fallback={props.collapsed ? undefined : <pre><code>{props.code}</code></pre>}>
      {e => <Dynamic component={e()} code={props.code} collapsed={props.collapsed} scope={scope} />}
    </Show>
  );
}

/** A `YYYY-MM-DD` date as e.g. "9 Nov 2026". In UTC, so the server and the browser show the same day. */
const formatDate = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/** What kind of post a page is, from its folder, with the header's icon for it. */
const KINDS: { prefix: string; label: string; icon: Component }[] = [
  { prefix: "/la/", label: "eBook", icon: BookIcon },
  { prefix: "/blog/", label: "Blog", icon: ArticleIcon },
  { prefix: "/series/", label: "Series", icon: SeriesIcon },
  { prefix: "/tools/", label: "Tools", icon: ToolsIcon },
];

/** The newest pages in the RSS feed. A page in none of the `KINDS` folders gets no tag. */
function Latest() {
  return (
    <section class="home-latest">
      <h2>Latest posts (<a href="/rss.xml" rel="external">RSS</a>)</h2>
      <ul>
        <For each={latest}>
          {page => (
            <li>
              <a href={page.href}>
                <Show when={KINDS.find(kind => page.href.startsWith(kind.prefix))}>
                  {kind => <span class="home-latest-kind"><Dynamic component={kind().icon} />{kind().label}</span>}
                </Show>
                <span class="home-latest-title">{page.title || page.href}</span>
                <Show when={page.date}>{date => <time datetime={date()}>{formatDate(date())}</time>}</Show>
                <Show when={page.description}>{description => <p>{description()}</p>}</Show>
              </a>
            </li>
          )}
        </For>
      </ul>
    </section>
  );
}

/** The homepage, at `/`. */
export default function Home() {
  return (
    <main class="home">
      <details class="home-ai">
        <summary>Is this AI slop?</summary>
        <p>
          No. This website predates ChatGPT. All articles continue to be written by <a href="https://www.vinaysisodia.com/">me</a>. AI wrote the code for visualizations while porting to <a href="https://pie.tinyvolt.com">Pie</a>, and also modified some text. I am reviewing and fixing it page by page.
        </p>
      </details>
      <div class="home-hero">
        <h1 aria-label={site.title}>
          <svg class="home-logo" viewBox="0 0 548 126" aria-hidden="true">
            <LogoTwoLine />
          </svg>
        </h1>
        <div class="home-buttons">
          <a class="home-button" href="/la/0_intro"><BookIcon />eBook</a>
          <a class="home-button" href="/blog"><ArticleIcon />Blog</a>
          <a class="home-button" href="/series"><SeriesIcon />Series</a>
          <a class="home-button" href="/tools"><ToolsIcon />Tools</a>
        </div>
        <ul class="home-features">
          <li><InteractiveIcon /> Interactive</li>
          <li><ProgrammableIcon /> Programmable</li>
          <li><OpenSourceIcon /> Open-source</li>
        </ul>
      </div>
      <Examples />
      <Latest />
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
