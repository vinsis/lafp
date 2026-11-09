[fully written by an agent except this line]
# pie-ssg site

This folder is a site made with [pie-ssg](https://github.com/TinyVolt/pie-ssg): a Markdown-based static site generator for interactive science explainers. Pages are Markdown. Readers can run Python in the page and draw on a canvas.

Requires Node 24.

```sh
npm run dev       # dev server
npm run build     # build to .output/; also runs the checks listed under "Build checks"
npm run start     # run the built server
npm run preview   # preview the build with vite
```

## Where things go

| Folder / file | What it holds |
| --- | --- |
| `pages/` | Markdown pages. `pages/a/b.md` is served at `/a/b`. A file whose name starts with `_`, e.g. `pages/_topics.md`, gets no URL; use it as a sidebar or a glossary. |
| `functions/` | Your own TypeScript functions, called from Python as `pie.<keyword>(...)`. |
| `nodes/` | Your own node types: what a node holds and how it is drawn. |
| `ui/` | Your own UIs for nodes, called from Python as `pie.ui.<name>(...)`. |
| `layouts/` | Optional overrides: `header.tsx` (top of every page) and `index.tsx` (homepage, `/`). |
| `styles/` | CSS. Every `.css` file here loads after the built-in styles, so it wins. |
| `public/` | Static files, served as-is. |
| `site.yml` | Site settings. |
| `node_modules/@tinyvolt/pie/src/` | The pie-ssg app itself, installed as the `@tinyvolt/pie` package. `~/` in imports means this folder. |

Do the work in the folders above. Don't edit `node_modules/@tinyvolt/pie/`: installing or updating the package replaces it.

## site.yml

Flat `key: value` lines. Values may be quoted. A key may appear only once.

- `title` (required): shown in the header and in every browser tab title.
- `url`: where the site is deployed, e.g. `https://example.com`. Needed for `sitemap.xml`, `robots.txt`, canonical links and `og:url`; without it the build skips them and warns.
- `description`: shown in search results and link previews for a page with no `description` of its own.
- `sidebar`, `toc`, `glossary`: the value for every page that doesn't set the key itself (see "Pages"). A `sidebar` or `glossary` path here is relative to the project root, e.g. `sidebar: pages/_topics.md`.

## Pages

A page is a `.md` file under `pages/`. `/pages` lists every page. A file whose name starts with `_` is not a page: it gets no URL and isn't listed.

Optional frontmatter at the very top, as flat `key: value` lines:

```md
---
title: Circles
canvas: left
---
```

- `title`: the tab title. Empty means the tab shows the site title alone.
- `description`: shown in search results and link previews. Empty means `site.yml`'s `description`.
- `canvas`: `left`, `right`, `top`, `bottom` or `none` (default). Every page has a canvas, on that side of the page. `none`: it starts collapsed on the right, and the button on the divider opens it. Every `pie.*` call works either way. Python can show, hide or move it: see `pie.show_canvas` under "Side effects".
- `sidebar`: a `.md` file shown in a collapsible sidebar on the left, e.g. `sidebar: _topics.md`. The path is relative to the page's file. `none`: no sidebar, even when `site.yml` sets one. Left out: `site.yml`'s `sidebar`.
  - It starts collapsed. A button opens it, and the rest of the page shrinks to make room. A new page starts with it collapsed.
  - On screens narrower than `--sidebar-drawer-below` (768px by default), it opens over the page instead. Tapping outside it or on one of its links closes it.
  - Its frontmatter is ignored. Its Python editors share variables only with each other, and have no canvas: a `pie.*` call there raises "this page has no canvas".
- `toc`: `true` or `false`. `true` adds a table of contents of the page's `##` and `###` headings, after its leading `#` title, or at the very start if it has none. Each `###` is nested under the `##` before it. Every heading gets an `id`, and duplicate headings get `-2`, `-3`, …. No list if the page has no `##` or `###`. Left out: `site.yml`'s `toc`, else `false`.
- `glossary`: a `.md` file of terms, e.g. `glossary: _terms.md`. The path is relative to the page's file. `none`: no glossary, even when `site.yml` sets one. Left out: `site.yml`'s `glossary`.
  - In that file, each `##` heading is a term, and the text up to the next `##` is its definition, in any markdown. Its `#` heading names the section at the end of the page; without one, the section is called "Glossary". Other text before the first `##` is ignored.
  - In the page, `[[term]]` marks a term, and `[[shown|term]]` shows other words. Matching ignores case. `[[...]]` inside code is left alone.
  - Hovering a term shows a popup with the first 4 lines of its definition and a "more" link. On touch screens, a tap shows it and a tap anywhere else hides it.
  - "more" opens a collapsed section at the end of the page and scrolls to the term. The section lists only the terms the page uses, in the file's order.
  - `[[...]]` only works in the page's own text. In a sidebar file, in the glossary file, or on a page without a glossary, it shows as written, brackets included.
- `tags`: hashtags separated by spaces or commas, e.g. `tags: #math #linear-algebra`. A tag is made of letters, digits, `_`, `+` and `-`, and is turned into lower case. A word that isn't a tag, e.g. `math` without its `#`, is skipped without an error.
  - The page shows its tags as links at the end of its text. Each opens `/_tags/<tag>`, which lists the pages with that tag, sorted by title. A page without a `title` is listed by its URL.
  - `/_tags` lists every tag and how many pages have it. Only the tag pages link to it.
  - Only a page's own frontmatter counts: `tags` in `site.yml` does nothing.

Other keys are ignored. A bad value fails the build, and shows an error screen in dev.

Math uses KaTeX: `$…$` inline, and `$$…$$` on its own lines for a display block.

- KaTeX doesn't fail the build on an error: it shows the bad formula in red on the page. Check commands against KaTeX's list.
- There are no custom macros. Color with `\textcolor{#1d4ed8}{m}`. `\lightblue` doesn't exist. `\red`, `\green`, `\orange` and the like do exist, but in KaTeX's own colors (e.g. `\orange` is `#ffa500`), which won't match the canvas.

HTML blocks work in pages. A collapsed section with Markdown inside needs blank lines around the Markdown:

````md
<details>
<summary>Cuda implementation</summary>

```cpp
int x = 0;
```

</details>
````

A page's URL must not match a route in `node_modules/@tinyvolt/pie/src/routes/` (`/`, `/pages`, `/_tags`, `/_tags/<tag>`). For example, `pages/pages.md` fails the build.

## Python editors

A `python-editor` code fence becomes a runnable editor with Run and Stop buttons. A plain `python` fence is only highlighted code.

````md
```python-editor
a = pie.point(1, 2, out='a')
r = pie.scalar(1, out='r')
pie.circle(a, r)
```
````

- Python runs in the browser with Pyodide 0.28.2. `pie` is already imported.
- All editors on one page share the same Python variables and the same canvas. Editors in the page's sidebar are separate: see `sidebar` under "Pages".
- `import numpy`, `scipy`, `matplotlib` and other [Pyodide packages](https://pyodide.org/en/0.28.2/usage/packages-in-pyodide.html) load on first use.
- `plt.show()` shows matplotlib figures under the editor.
- `` ```python-editor collapsed `` starts the editor collapsed: only its toolbar shows until the reader expands it. Other words after `python-editor` are ignored.

## Drawing on the canvas: `pie.*`

Each `pie.<keyword>(...)` call makes a node: one thing the page tracks, such as a point or a circle. Nodes are drawn on the canvas. When a node changes, every node built from it updates.

`out='<id>'` names a node. Calling again with the same `out` replaces that node, and everything built from it updates:

```python
pie.scalar(3, out='r')   # the circle above now has radius 3
```

Common mistake: `center = pie.point(1, 2)` does not give the node the id `center`. It gets an automatic id. Use `pie.point(1, 2, out='center')`.

`pie.get_node('<id>')` returns the existing node with that id, e.g. `c = pie.get_node('center')`, in any editor on the page. It makes no new node. An unknown id raises an error. It can't be called inside a lifted function.

`fill='<color>'` and `stroke='<color>'` color a node, e.g. `pie.circle(a, r, fill='orange', stroke='#333')`:

- A color is any CSS color (`'red'`, `'#ff0000'`, `'rgb(255, 0, 0)'`) or `'none'`. A bad color raises an error.
- Every node the call makes gets the colors, including extra nodes such as the center point of `ellipse_from_foci`.
- A node shows only the colors its render function draws with. A point uses only `fill`, a line only `stroke`. For `partial`'s arrow, `stroke` colors the line and `fill` the head.

There are five system nodes:
- `unit`: a scalar holding the pixels per grid unit (default 50). Changing it changes the grid unit, e.g. `pie.scalar(80, out='unit')`.
- `gridOpacity`: a scalar that multiplies the opacity of the grid lines and axes (default 1; 0 hides them), e.g. `pie.scalar(0.5, out='gridOpacity')`.
- `canvasColor`: a text holding a CSS color for the canvas background (default `''`: no background), e.g. `pie.text('#111', out='canvasColor')`.
- `originX`, `originY`: scalars holding where the origin sits, in grid units from the canvas center (default 0; positive is right and up), e.g. `pie.scalar(1, out='originX')`. Every node moves with the origin.

Built-in functions:

| Call | Makes |
| --- | --- |
| `pie.scalar(value)` | a number |
| `pie.text(value, x, y, font_size, w, h)` | a string; drawn centered at (x, y) only if both are given. All optional: `value` `''`, `font_size` 12 (pixels), `w` and `h` 0. `w`/`h`: 0 and 0 = one line, no box; above 0 = fixed size; -1 = fits the text, at most 5 |
| `pie.point(x, y)` | a point |
| `pie.line(p1, p2)` | a line |
| `pie.distance(p1, p2)` | a number |
| `pie.triangle(v1, v2, v3)` | a triangle |
| `pie.circle(center, radius)` | a circle |
| `pie.ellipse(center, radius_x, radius_y, rotation)` | an ellipse; rotation in degrees |
| `pie.ellipse_from_foci(f1, f2, string_length)` | an ellipse |
| `pie.arc(center, radius, start_angle, end_angle)` | an arc; angles in degrees |
| `pie.bezier_quadratic(p1, control, p2)` | a curve |
| `pie.bezier_cubic(p1, control1, control2, p2)` | a curve |
| `pie.partial(target, var)` | the derivative of scalar `target` with respect to `var`. `var` is a scalar node (gives a number) or a point node (gives an arrow at the point). |

Arguments can be nodes or plain numbers. Passing an array where one item is expected runs the function once per item (except `partial`).

- Parameters are positional only, for built-ins and `functions/` alike: `pie.text('a', 0, 1, 14)`, not `font_size=14`. The only keyword arguments are `out`, `hidden`, `fill`, `stroke` and `animate`.
- `hidden=True` makes the node but doesn't draw it, e.g. a corner point a shape is built from: `pie.point(0, 0, hidden=True)`.
- `pie.scalar([1, 0, 0])` makes an Array of Scalars. `a[i]` (in Python, outside a lifted function) is its item node, e.g. `pie.point(a[0], a[1])`.
- A boxed `pie.text` (w or h not 0) always has the page background behind it. It ignores `fill`; `stroke` colors both the text and the border. For a colored box with a label, draw a filled shape, then an unboxed text over it.
- Draw order: nodes are drawn in the order they were made, later on top, except that every point is drawn above every other node. Replacing a node with the same `out` keeps its place.
- `fill` and `stroke` are plain colors set by the call, `set_fill` or `set_stroke`. No node or lifted function can drive them. For a shape whose color depends on a value, make one shape per color, and use lifts to give the inactive ones a size of 0.

### Side effects

These change existing nodes, or the canvas, instead of making a new one. They run once, when called.

| Call | Does |
| --- | --- |
| `pie.clear()` | removes every node and resets the system nodes: `unit` (pixels per grid unit) to 50, `gridOpacity` to 1, `canvasColor` to `''`, `originX` and `originY` to 0 |
| `pie.translate_point_to(p, x, y)` | moves point `p` to (x, y) |
| `pie.translate_point_by(p, dx, dy)` | moves point `p` by (dx, dy) |
| `pie.translate_scalar_to(s, value)` | sets scalar `s` to `value` |
| `pie.translate_scalar_by(s, delta)` | adds `delta` to scalar `s` |
| `pie.set_fill(node, color)` | sets `node`'s fill |
| `pie.set_stroke(node, color)` | sets `node`'s stroke |
| `pie.hide(node)` | stops drawing `node` |
| `pie.show(node)` | draws a hidden `node` again |
| `pie.remove(node)` | removes `node`; nodes built from it are removed too |
| `pie.show_canvas(side)` | shows the canvas. `side` is optional: `left`, `right`, `top` or `bottom` also moves it there. Any other value raises an error |
| `pie.hide_canvas()` | collapses the canvas; its nodes stay |

- `p`, `s` or `node` can be an array: every item changes.
- `pie.clear()` doesn't change whether the canvas is shown, or its side.
- A moved node stops following the nodes it was built from. Nodes built from it follow the move. A moved point keeps its colors.
- The four `translate_*` calls take `animate=True`: the value moves to its new value over half a second instead of jumping. The call returns when the move ends, so a loop of animated calls plays one after another. An array's items move together. Other calls raise an error if passed `animate`.

### Lifting a Python function: `pie.lift`

`pie.lift(f, out_type)` turns a plain Python function into one that takes nodes and returns a node. It reruns when its input nodes change. `out_type` is one of `pie.Scalar`, `pie.Point`, `pie.Text` (or `str`), `pie.Array[pie.Scalar]`, `pie.Array[pie.Point]`.

```python
import numpy as np
linspace = pie.lift(np.linspace, out_type=pie.Array[pie.Scalar])
n = pie.scalar(5, out='n')
xs = linspace(0, n, 5)
pie.point(xs, 0)          # 5 points from 0 to 5; set `n` again and they move
```

A lifted function also takes `fill` and `stroke`, e.g. `linspace(0, n, 5, fill='red')`, and `hidden=True`.

What the function gets and must return:

- A Scalar input arrives as a `float`, a Point as a tuple `(x, y)`, a Text as a `str`, an Array as a numpy array of its shape (an Array of Points has a last dimension of 2).
- Any other argument is passed through unchanged, whatever it is, e.g. an `int`, a string or a list of dicts: `pie.lift(f, pie.Text)(t, 'Q', steps)`.
- `pie.Scalar` needs a number, `pie.Point` a tuple or list of 2 numbers, `pie.Text` a `str`. `pie.Array[...]` needs a numpy array of numbers, not a list: return `np.array([...])`.
- `g = f(...)` lifted to an Array: `g[i]`, outside the lifted function, is its item node. Reruns keep the item nodes while the shape stays the same, so `pie.point(g[0], g[1])` follows `g`. This is how one lift can give several numbers, e.g. a box's left, bottom, width and height.
- A function defined with `def` in a block is found by name when it reruns, so running a new `def f` changes what existing nodes compute. Anything else, e.g. a lambda, is kept by reference.
- Before an animation plays (`animate=True`, or a UI that animates), every lifted function it affects runs once per frame, in one batch. Dozens of lifts on one animated node play smoothly.

Limits:

- A lifted function can't call `pie.*` or index arrays.
- `pie.partial` can't differentiate through a lifted function.

### UIs for nodes: `pie.ui`

`pie.ui.<name>(...)` shows a UI, such as a slider, for one or more nodes. The UI shows the nodes' values and updates when they change. A UI that writes, such as a slider, changes its node, and every node built from it updates:

```python
r = pie.scalar(1, out='r')
pie.circle(pie.point(0, 0), r)
pie.ui.slider(r, min=0, max=4, label='radius')
pie.ui.latex(r)
```

- Positional arguments are nodes, or lists of nodes at any depth. Keyword arguments are plain values, never nodes.
- Every UI takes `label='<text>'`, shown in front of it. Default: none.
- The UIs show below the editor that made them, outside its box: collapsing the editor doesn't hide them. Running the block again replaces them, instead of adding more.
- A UI hides while one of its nodes is removed, and shows again if a node with the same id comes back.
- Writing a node is like `translate_*`: the node stops following the nodes it was built from.

| Call | Shows |
| --- | --- |
| `pie.ui.slider(n, min=0, max=1, step=0.01)` | a slider for Scalar `n` |
| `pie.ui.textbox(n)` | a text box for Scalar or Text `n`. It writes on Enter or on leaving the box. Text that isn't a number puts a Scalar's value back |
| `pie.ui.radio(n, options=['a', 'b'])` | one radio button per option. Scalar `n` holds the chosen index. `options` is required |
| `pie.ui.checkboxes(mask, options=['a', 'b'])` | one checkbox per item of Array of Scalars `mask`, in row-major order: 1 when ticked, 0 when not; any value other than 0 shows ticked. `options`: one label per item; without it, the labels are the item positions |
| `pie.ui.latex(a, b, ...)` | the nodes as LaTeX, side by side. A Scalar shows its number (at most 4 decimals), a Point `(x, y)`, a Text its value as LaTeX source, an Array of 1 dimension a column and of 2 a matrix. A list of nodes is shown like an Array |

Errors:

- Python raises for an unknown UI name, an unknown node, a node in a keyword argument, or a keyword argument named `args`.
- A UI given the wrong kind of node, e.g. `pie.ui.slider(point)`, shows the error in red in its place. Python doesn't raise.
- Sidebar editors have no canvas, so `pie.ui.*` there raises "this page has no canvas".

#### Dragging UIs

**Every UI can be dragged; readers may not notice unless the text tells them.** Each UI has a grip, ⋮⋮, at its left. With a mouse it shows on hover; on touchscreens it always shows. Only the grip starts a drag, so sliders and text boxes work as usual. Dragging the grip:

- into the page's text puts the UI between two top-level blocks (paragraphs, headings, editors, …), never inside an editor. A line shows where it will land. Near the text's top or bottom edge, the text scrolls.
- onto the canvas puts the UI at that spot on the screen. Panning and zooming the canvas don't move it. Resizing the canvas keeps it inside.

A UI moves freely between the text and the canvas. Running its block again puts it back below the editor. Positions aren't saved when the page reloads.

## Your own functions: `functions/`

Each `functions/**/*.ts` file exports one or more `Node2NodeFunc` objects. Each becomes `pie.<keyword>` in Python. Copy `functions/midpoint.ts` as a starting point:

```ts
import { Node2NodeFunc } from '~/lib/nodes/functions/Node2NodeFunc';
import { AnyNode, PointNode } from '~/lib/nodes/state/Node';
import { add, div, ref, scalar } from '~/lib/nodes/jax';

export const Midpoint: Node2NodeFunc = {
  keyword: 'midpoint', outputType: 'Point',
  parameters: [{ name: 'point1', type: 'Point' }, { name: 'point2', type: 'Point' }],
  compute(inputs: AnyNode[]) {
    const p1 = inputs[0] as PointNode;
    const p2 = inputs[1] as PointNode;
    return {
      main: { type: 'Point', x: div(add(ref(p1.x), ref(p2.x)), scalar(2)), y: div(add(ref(p1.y), ref(p2.y)), scalar(2)) },
    };
  },
};
```

- `compute` returns an object whose `main` entry is the output node. Other entries are extra nodes drawn alongside it.
- Do the math with the helpers in `~/lib/nodes/jax` (`add`, `sub`, `mul`, `div`, `sqrt`, `sin`, `cos`, `atan2`, …), not plain JS operators. Wrap a node's number field in `ref(...)` before using it. These keep `pie.partial` working on your function.
- Node types and their fields are in `node_modules/@tinyvolt/pie/src/lib/nodes/state/Node.ts`.
- A file can also export a `SideEffectFunc` (same module as `Node2NodeFunc`): `keyword`, `parameters`, and `run(inputs, store)`, which changes the store instead of returning nodes. See `node_modules/@tinyvolt/pie/src/lib/nodes/functions/sideEffects.ts`.
- A keyword used twice, by two of your files or by yours and a built-in, fails the build.

## Your own node types: `nodes/`

Each `nodes/**/*.{ts,tsx}` file exports one or more `NodeDefinition` objects. Each adds a node type that functions can output and the canvas draws. Copy `nodes/square.tsx` as a starting point:

```tsx
import type { Accessor } from 'solid-js';
import type { Node, NodeDefinition, PointNode, ScalarNode } from '~/lib/nodes/state/Node';
import { num } from '~/lib/nodes/jax';

export interface SquareNode extends Node {
  type: 'Square';
  center: PointNode;
  side: ScalarNode;
}

// Adds 'Square' to the node types, so functions can take and return it.
declare module '~/lib/nodes/state/Node' {
  interface NodeTypeMap {
    Square: SquareNode;
  }
}

const renderSquare = (square: Accessor<SquareNode>) => {
  const side = () => num(square().side.value);
  return (
    <rect
      x={num(square().center.x) - side() / 2}
      y={num(square().center.y) - side() / 2}
      width={side()}
      height={side()}
      fill={square().fill ?? 'none'} stroke={square().stroke ?? 'currentColor'}
      stroke-width={2} vector-effect="non-scaling-stroke"
    />
  );
};

export const Square: NodeDefinition<SquareNode> = { type: 'Square', prefix: 'sq', render: renderSquare };
```

- `type`: the type name. It must match the interface's `type`.
- `prefix`: the start of automatic ids: `sq` gives `sq0`, `sq1`, …. Default: the type name in lower case.
- `render(node, unit)`: returns Solid SVG elements, in grid units. `node()` returns the node's current data. Call it inside the JSX attributes, so the drawing updates when the node changes. `unit` is pixels per grid unit: divide by it for a size that stays fixed on screen. Leave `render` out for a node that isn't drawn.
- `num(...)` turns a node's number field into a plain JS number.
- `node().fill` and `node().stroke` hold the colors set from Python, or `undefined`. Use them before your default, e.g. `fill={square().fill ?? 'none'}`. A render function that doesn't read them ignores them.
- The `declare module` block is needed so that a `Node2NodeFunc` accepts the type in `outputType` and `parameters`.
- Python makes a node of your type through a function in `functions/`. `functions/square.ts` adds `pie.square(center, side)`.
- The built-in node types are in `node_modules/@tinyvolt/pie/src/lib/nodes/state/Node.ts`, and their render functions are in `node_modules/@tinyvolt/pie/src/lib/nodes/render/renderLogic.tsx`.
- A type name used twice, by two of your files or by yours and a built-in, fails the build.

## Your own UIs: `ui/`

Each PascalCase export of a `ui/**/*.{ts,tsx}` file is a UI: a Solid component. Its Python name is the export name in snake_case: `Slider` is `pie.ui.slider`, `MatrixProduct` is `pie.ui.matrix_product`. Other exports, e.g. a camelCase helper, are ignored. Copy `ui/stepper.tsx` as a starting point:

```tsx
import type { ScalarNode } from '~/lib/nodes/state/Node';
import { num, scalar } from '~/lib/nodes/jax';
import { expectNode, type UiArg } from '~/lib/ui/nodeHandle';

/** `pie.ui.stepper(n, step=1)`: − and + buttons that change Scalar `n` by `step`, with its value between them. */
export function Stepper(props: { args: UiArg[]; step?: number }) {
  const [n, setN] = expectNode<ScalarNode>(props.args[0], ['Scalar']);
  const step = props.step ?? 1;
  const add = (delta: number) => setN({ value: scalar(num(n().value) + delta) });
  return (
    <span>
      <button type="button" onClick={() => add(-step)}>−</button>
      {' '}{num(n().value)}{' '}
      <button type="button" onClick={() => add(step)}>+</button>
    </span>
  );
}
```

- `props.args` holds the positional arguments. Each node in them is a pair `[n, setN]`, like a Solid signal: `n()` returns the node's current data; call it inside the JSX so the UI updates. `setN(changes)` writes fields of the node, e.g. `{ value: scalar(2) }`. A list stays a list of pairs.
- The keyword arguments are the other props, as plain values.
- `expectNode(arg, types)` checks that `arg` is one node of one of `types` and returns its pair. Otherwise it throws, and the UI shows the error.
- `useSetNode()` returns `setNode(node, changes)`, to write a node that isn't an argument, such as an Array's item: `setNode(array().items[i], { value: scalar(1) })`. Write an Array's items one by one: replacing the whole Array removes its item nodes and everything built from them.
- A UI that throws shows `pie.ui.<name>: <message>` in red in its place.
- Don't add a grip or a label: every UI gets both. `args` and `label` are reserved prop names.
- The built-in UIs are in `node_modules/@tinyvolt/pie/src/lib/ui/components/`.
- A name used twice, by two of your files or by yours and a built-in, raises an error when a page with a Python editor loads. It doesn't fail the build.

## Layouts: `layouts/`

- `layouts/header.tsx`: replaces the header on every page.
- `layouts/index.tsx`: replaces the homepage.

Each must `export default` a Solid component (Solid JSX: `class`, not `className`). Delete the file to get the built-in one back. `header.tsx` shows how to read `site.yml`: `import site from "../site.yml"`.

## Styles: `styles/`

Change the CSS variables in `styles/theme.css` (colors, fonts, text width), or add rules, e.g. `main h1 { color: crimson; }`.

- Sidebar: `--sidebar-width` (default `16rem`), `--sidebar-drawer-below` (default `768px`; narrower screens open it over the page) and `--color-backdrop` (behind it when it opens over the page). Its parts have the classes `.sidebar`, `.sidebar-text`, `.sidebar-edge`, `.sidebar-toggle` and `.sidebar-backdrop`.
- Table of contents: `.toc`.
- Glossary: `.term` (a term in the text), `.term-popup` (its popup), which holds `.term-popup-text` and `.term-more` (the "more" link), and `.glossary` (the section at the end of the page).
- Tags: `.tags` (the links at the end of a page) and `.tagged-description` (a page's description on a tag's page).
- UIs (`pie.ui.*`):
  - `.python-editor-uis`: a block's UIs below its editor.
  - `.python-editor-ui`: one UI, wherever it is. It holds `.python-editor-ui-grip` (the ⋮⋮ drag grip), `.python-editor-ui-label` (the `label`) and `.python-editor-ui-body` (the UI itself).
  - Where it is: `main > .python-editor-ui` (dropped in the text), `.canvas-ui-layer > .python-editor-ui` (on the canvas), `.python-editor-ui-dragging` (while dragged).
  - `.python-editor-ui-drop-line`: the line that shows where a dragged UI lands in the text.
  - Built-in UIs: match by element, e.g. `.python-editor-ui input[type=range]` (slider), `.python-editor-ui input[type=text]` (text box), `.python-editor-ui .katex` (LaTeX). `.pie-ui-choices` holds the radio buttons or checkboxes.
  - E.g. a wider slider: `.python-editor-ui input[type=range] { width: 16rem; }`. A grip that always shows: `.python-editor-ui-grip { opacity: 1; }`.

## Build checks

`npm run build` fails, with a message naming the file, when:

- a page's frontmatter or `site.yml` has a bad line or value, or `site.yml` has no `title`
- a `sidebar` or `glossary` file doesn't exist or is outside the project
- a page uses a `[[term]]` its glossary file doesn't have, or that file has a term twice, ignoring case
- a page's URL matches a route in `node_modules/@tinyvolt/pie/src/routes/`
- a `functions/` keyword is used twice
- a `nodes/` type name is used twice
- a `layouts/` file has no default export

Run `npm run build` after a change to confirm it.

## This site

What this site adds on top of pie-ssg. Each function and UI has a doc comment in its file with the details.

### Its functions (`functions/`)

| Call | Makes |
| --- | --- |
| `pie.rectangle(corner, w, h, rotation)` | a Polygon with its bottom-left corner at Point `corner`, rotated counter-clockwise (degrees, default 0) about it. Uses `fill` and `stroke`; default fill none. `w` and `h` can be nodes, and 0 draws nothing |
| `pie.polygon(points)` / `pie.polyline(points)` | a closed / open path through an Array of Points |
| `pie.annotate_arrow(p1, p2, gap)` | an arrow from `p1` to `p2`, pulled back by `gap` (default 0) at both ends |
| `pie.annotate_curved_arrow(p1, p2, control, gap, text)` | a curved arrow bent towards `control`, labeled there |
| `pie.annotate_curly_bracket(p1, p2, text)` | a curly bracket from `p1` to `p2`, bulging to the left of `p1 → p2`, labeled past its tip |
| `pie.annotate_dim_line(p1, p2, text)` | a line with a tick across each end, labeled left of its middle |
| `pie.annotate_angle_mark(line1, line2, text)` | an arc marking the angle between two lines that start at the same point |
| `pie.polynomial(coefficients, x_min, x_max)` | the graph of a₀ + a₁x + …, x from -10 to 10 by default |
| `pie.diagram(json.dumps(items))` | one Diagram node (`nodes/diagram.tsx`) that draws many boxes and lines. Each item is a dict: `x`, `y` (a box's bottom-left corner), `w`, `h`, and optionally `line` (a line from (x, y) to (x + w, y + h)), `fill`, `stroke`, `label` (at the box's center), `font` (pixels), `wrap` (the label's width; it wraps at spaces) and `color` (the label's) |

`functions/linear-algebra.ts` (`pie.la_*`: vectors, matrices, matrix products, transforms, rotation matrices, 3D) and `functions/geometric-algebra.ts` (`pie.ga_*`: quaternions) are for the linear algebra pages.

### Its UIs (`ui/`)

| Call | Shows |
| --- | --- |
| `pie.ui.markdown(n, sections=['# a', '# b'])` | the Markdown section that Scalar `n` picks, by index, rendered like the page (math included) |
| `pie.ui.markdown(text)` | the Markdown in Text node `text` |
| `pie.ui.animated_radio(mask, options=[...])` | one radio button per item of the Array of Scalars `mask`. Choosing one moves its item to 1 and the others to 0 over half a second. `snap=True`: the others drop to 0 at once |
| `pie.ui.animated_checkboxes(mask, options=[...])` | like `pie.ui.checkboxes`, but each item moves to 1 or 0 over half a second |
| `pie.ui.bits_radio(bits)` | one radio button per bit pattern `00…0` to `11…1` of the Array of Scalars `bits`, first item leftmost |
| `pie.ui.case_checkboxes(n, [mask_a, mask_b], options=[[...], [...]])` | the checkboxes for the Array that Scalar `n` picks |
| `pie.ui.step_list(diagram, steps=[...])` | one radio button per step of Diagram node `diagram`. Each step is a dict: `label`, and lists of `[item index, {field: value}]`: `start` (applied when the step begins), `move` (positions and sizes it animates to over half a second) and `end` (applied when it ends). `stagger`: `[item index, n, count]` moves that item in the n-th of `count` parts of the half second. Choosing the next step plays it; any other step shows at once |

### Code for visuals and UIs

The Python behind a figure should read like the algorithm it shows. Readers open the editor to learn the algorithm, not the drawing.

- Write the algorithm's steps as the algorithm has them, with its names: `m_new = max(m_old, tile.max())`, `d = d * exp(m_old - m_new) + exp(tile - m_new).sum()`. Compute the values the figure shows from that code. Don't hard-code results the code could produce.
- Keep the drawing code to the few calls that put shapes, text and UIs on the canvas, apart from the algorithm, e.g. in one helper at the end. No layout or animation machinery that hides the algorithm's steps.
- When a figure needs a step list or timing, keep it short and next to the drawing code, not mixed into the algorithm.
- Name the drawing helpers after what the algorithm does, so a call reads as a step of it: `move_data(K[j], Kj)` for a load from HBM to SRAM, `compute(Sij)`, `update(mi, li, Oi)`.
- Put the helpers in their own collapsed editor before the algorithm's editor, and tell the reader to run both in order.
- Many shapes that change together are one node, not many. Like a point cloud: one node type whose fields hold every point, not an Array of Point nodes. Make the node type in `nodes/`, the function that makes it in `functions/`, and a UI in `ui/` to change it. Don't build figures out of hundreds of nodes or lifts.
- Use each part for what it is for: a function makes a node from its inputs, a UI writes nodes when the reader acts, and a lift recomputes a value from other nodes. Don't make one do another's job.

### Step-through animations

The pages in `pages/series/online_softmax_flash_attention/` step a kernel through its loads, computations and stores. Each page has two editors:

1. Drawing helpers. A `Slot` is a place in HBM or SRAM, with its position, size and starting data (label, fill, outline). The actions record into the current step: `move_data(src, dst)` copies data, which flies over; `change(slots, ...)` changes it in place, filling up from the bottom; `run_block(square, slots)` switches SRAM to another CUDA block; `step(label, caption)` ends a step. Each page adds its own slots and named actions (`compute`, `update`, `stale`, …) on top.
2. The algorithm: its loops, with one action per line and a `step(...)` after each stage, then `show_steps(...)`.

`show_steps` turns the recorded steps into items for one `pie.diagram` node: each slot's outline, caption, old data, new data and ring, plus the zoom lines and the caption. For each step it computes how the items look as the step starts, after its moves, and as it ends, and passes only the changes to `pie.ui.step_list`. The figure is one node, with no lifts.

### Pages

- The page background is a light grey-teal, `#d3dcdc`. Use dark text (`#27272a`) and dark outlines (`#3f3f46`) on the canvas, not light grey.
- Give one object one color everywhere: in `\textcolor`, on the canvas, and in canvas text.
- A new blog post goes in `pages/blog/`, with a link at the top of the list in `pages/blog.md`.
- A series is a folder in `pages/series/`. Its pages are numbered in reading order, e.g. `1_online_softmax.md`, and set `sidebar: _series.md`. `_series.md` lists them, and `pages/series.md` has a section for each series.
- `date: YYYY-MM-DD` in a page's frontmatter dates it in `rss.xml` (made in `vite.config.ts`). Every page except `pages/blog.md` and `pages/series.md` is in the feed.
- Articles ported from the old site: drop links to `/nova/...`. Those pages don't exist here.
