import { Node2NodeFunc } from '~/lib/nodes/functions/Node2NodeFunc';
import type { AnyNode, ArrayNode, ScalarNode, TextNode } from '~/lib/nodes/state/Node';
import { num } from '~/lib/nodes/jax';
import type { PolygonsItem } from '../nodes/polygons';

type Mesh = { vertices: number[][]; faces: number[][] };

// The last mesh parsed, so moving a slider doesn't parse the same JSON again.
let lastText = '';
let lastMesh: Mesh = { vertices: [], faces: [] };
function parseMesh(text: string): Mesh {
  if (text !== lastText) {
    lastMesh = JSON.parse(text) as Mesh;
    lastText = text;
  }
  return lastMesh;
}

/** A 4×4 Array of Scalars as 16 numbers, row by row. */
function matrix4(node: AnyNode, name: string): number[] {
  const a = node as ArrayNode;
  if (a.type !== 'Array' || a.shape.join() !== '4,4') throw new Error(`mesh: ${name} must be a 4×4 Array of Scalars`);
  return a.items.map((item) => num((item as ScalarNode).value));
}

const LIGHT = (() => {
  const l = [0.4, 0.8, 0.6];
  const n = Math.hypot(...l);
  return l.map((v) => v / n);
})();
const COLOR = [13, 148, 136];   // the site's teal, darkened by the shading

/**
 * A 3D triangle mesh drawn as one `Polygons` node: each vertex is multiplied by `model`, then by `camera`
 * (camera and perspective together), and divided by w. Triangles are drawn farthest first, each shaded by how
 * squarely it faces a fixed light, and skipped if a corner is behind the camera.
 * Called from Python as `pie.mesh(mesh, model, camera, zoom)`.
 * @param mesh - Text holding JSON `{"vertices": [[x, y, z], ...], "faces": [[i, j, k], ...]}`
 * @param model - 4×4 Array of Scalars: the model matrix, for points (x, y, z, 1)
 * @param camera - 4×4 Array of Scalars: the camera and perspective matrices, multiplied
 * @param zoom - Grid units per unit of the screen's [-1, 1] square. Default 3
 * @returns Polygons node
 * @auxiliaryNodes None
 */
export const MeshFunc: Node2NodeFunc = {
  keyword: 'mesh', outputType: 'Polygons',
  parameters: [
    { name: 'mesh', type: 'Text' }, { name: 'model', type: 'Array' }, { name: 'camera', type: 'Array' },
    { name: 'zoom', type: 'Scalar', defaultValue: 3 },
  ],
  compute(inputs: AnyNode[]) {
    const { vertices, faces } = parseMesh((inputs[0] as TextNode).value);
    const M = matrix4(inputs[1], 'model');
    const C = matrix4(inputs[2], 'camera');
    const zoom = num((inputs[3] as ScalarNode).value);

    const n = vertices.length;
    const world = new Float64Array(n * 3);
    const screen = new Float64Array(n * 3);
    const w = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      const [x, y, z] = vertices[i];
      const p = [0, 1, 2].map((r) => M[4 * r] * x + M[4 * r + 1] * y + M[4 * r + 2] * z + M[4 * r + 3]);
      world.set(p, 3 * i);
      const c = [0, 1, 2, 3].map((r) => C[4 * r] * p[0] + C[4 * r + 1] * p[1] + C[4 * r + 2] * p[2] + C[4 * r + 3]);
      w[i] = c[3];
      screen.set([c[0] / c[3], c[1] / c[3], c[2] / c[3]], 3 * i);   // the perspective divide
    }

    const kept = faces.filter((f) => f.every((i) => w[i] > 0.1));
    const depth = (f: number[]) => screen[3 * f[0] + 2] + screen[3 * f[1] + 2] + screen[3 * f[2] + 2];
    kept.sort((f, g) => depth(g) - depth(f));   // farthest first: the painter's algorithm

    const items: PolygonsItem[] = kept.map((f) => {
      const [a, b, c] = f.map((i) => [world[3 * i], world[3 * i + 1], world[3 * i + 2]]);
      const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
      const v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
      const normal = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
      const facing = Math.abs(normal[0] * LIGHT[0] + normal[1] * LIGHT[1] + normal[2] * LIGHT[2]) / (Math.hypot(...normal) || 1);
      const shade = 0.3 + 0.7 * facing;
      const color = `rgb(${COLOR.map((v) => Math.round(v * shade)).join(', ')})`;
      return { points: f.flatMap((i) => [screen[3 * i] * zoom, screen[3 * i + 1] * zoom]), fill: color, stroke: color };
    });
    return { main: { type: 'Polygons', items } };
  },
};
