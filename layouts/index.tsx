import { For } from "solid-js";
import site from "../site.yml";
import { InteractiveIcon, OpenSourceIcon, PieLogo, ProgrammableIcon } from "./icons";
import { LogoTwoLine } from "./logo";

// The figure: points on the unit circle, each with an arrow to where the matrix sends it.
const MATRIX = [[1, 0.5], [-1, 2]];
const UNIT = 40;
const NUM_POINTS = 30;

/** The row vector [x, y] times `MATRIX`. */
const transform = ([x, y]: number[]) => [x * MATRIX[0][0] + y * MATRIX[1][0], x * MATRIX[0][1] + y * MATRIX[1][1]];

const circlePoint = (i: number, n: number) => [Math.cos((2 * Math.PI * i) / n), Math.sin((2 * Math.PI * i) / n)];

/** A rainbow from red at t = 0, all at the same mid lightness so every hue shows on a light background. */
function rainbow(t: number) {
  return `oklch(0.55 0.14 ${29 + 360 * t})`;
}

const arrows = Array.from({ length: NUM_POINTS }, (_, i) => {
  const from = circlePoint(i, NUM_POINTS);
  return { from, to: transform(from), color: rainbow(i / NUM_POINTS) };
});

// Motion values for the two dots, sampled at the same angles, so the ellipse dot is always the circle dot times `MATRIX`.
const motionValues = (f: (p: number[]) => number[]) =>
  Array.from({ length: 121 }, (_, i) => {
    const [x, y] = f(circlePoint(i, 120));
    return `${x * UNIT},${y * UNIT}`;
  }).join(";");
const circleValues = motionValues(p => p);
const ellipseValues = motionValues(transform);

function Figure() {
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
        <For each={arrows}>
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
          <animateMotion dur="2s" values={ellipseValues} calcMode="linear" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  );
}

/** The homepage, at `/`. */
export default function Home() {
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
        <Figure />
      </div>
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
