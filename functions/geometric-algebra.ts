import { Node2NodeFunc } from '~/lib/nodes/functions/Node2NodeFunc';
import { AnyNode, ArrayNode, ScalarNode } from '~/lib/nodes/state/Node';
import { Dtype, add, cos, div, mul, num, ref, scalar, sin, sqrt, sub } from '~/lib/nodes/jax';
import { neg, scalarArray, scalarValues } from './linear-algebra';

// Ported from geomatic-math-extensions `src/geometric-algebra.ts`. A keyword there,
// `ga-quaternion-product`, is `ga_quaternion_product` here. Quaternions are scalar-first [w, x, y, z].

/** Hamilton product a ⊗ b. */
function quaternionMul(a: Dtype[], b: Dtype[]): Dtype[] {
  const [aw, ax, ay, az] = a.map(ref);
  const [bw, bx, by, bz] = b.map(ref);
  const m = (p: Dtype, q: Dtype) => mul(ref(p), ref(q));
  return [
    sub(sub(sub(m(aw, bw), m(ax, bx)), m(ay, by)), m(az, bz)),
    sub(add(add(m(aw, bx), m(ax, bw)), m(ay, bz)), m(az, by)),
    add(add(sub(m(aw, by), m(ax, bz)), m(ay, bw)), m(az, bx)),
    add(sub(add(m(aw, bz), m(ax, by)), m(ay, bx)), m(az, bw)),
  ];
}

/**
 * The unit quaternion [cos(θ/2), sin(θ/2)·û] for a rotation of `degrees` about `axis`.
 * A 2D axis is (x, y, 0). A zero-length axis gives the identity [1, 0, 0, 0].
 */
function rotationQuaternion(axis: Dtype[], degrees: Dtype): Dtype[] {
  const x = ref(axis[0]);
  const y = ref(axis[1]);
  const z = axis.length === 3 ? ref(axis[2]) : scalar(0);
  const norm = sqrt(add(add(mul(ref(x), ref(x)), mul(ref(y), ref(y))), mul(ref(z), ref(z))));
  const invNorm = num(norm) === 0 ? scalar(0) : div(scalar(1), ref(norm));
  // θ/2 in radians: degrees · π / 360.
  const half = div(mul(ref(degrees), scalar(Math.PI)), scalar(360));
  const s = sin(ref(half));
  return [cos(ref(half)), ...[x, y, z].map((v) => mul(ref(s), mul(ref(v), ref(invNorm))))];
}

/**
 * Hamilton product of two quaternions.
 * @param a - Array of 4 scalars [w, x, y, z]
 * @param b - Array of 4 scalars [w, x, y, z]
 * @returns Array of scalars, shape [4]: a ⊗ b
 * @auxiliaryNodes el_<i> (Scalar nodes)
 */
export const QuaternionProduct: Node2NodeFunc = {
  keyword: 'ga_quaternion_product', outputType: 'Array',
  parameters: [{ name: 'a', type: 'Array' }, { name: 'b', type: 'Array' }],
  compute(inputs: AnyNode[]) {
    const av = scalarValues(inputs[0] as ArrayNode, 'ga_quaternion_product');
    const bv = scalarValues(inputs[1] as ArrayNode, 'ga_quaternion_product');
    if (av.length !== 4 || bv.length !== 4) {
      throw new Error(`ga_quaternion_product: expected length-4 quaternions, got lengths ${av.length} and ${bv.length}`);
    }
    return scalarArray(quaternionMul(av, bv), [4]);
  },
};

/**
 * The unit quaternion [cos(θ/2), sin(θ/2)·v1, sin(θ/2)·v2, sin(θ/2)·v3] for a rotation of θ
 * about the unit axis (v1, v2, v3). A zero-length axis gives [1, 0, 0, 0].
 * @param axis - Array of 2 or 3 scalars; a 2D axis is (x, y, 0)
 * @param degrees - Angle θ in degrees
 * @returns Array of scalars, shape [4]
 * @auxiliaryNodes el_<i> (Scalar nodes)
 */
export const GetRotationQuaternion: Node2NodeFunc = {
  keyword: 'ga_rotation_quaternion', outputType: 'Array',
  parameters: [{ name: 'axis', type: 'Array' }, { name: 'degrees', type: 'Scalar' }],
  compute(inputs: AnyNode[]) {
    const v = scalarValues(inputs[0] as ArrayNode, 'ga_rotation_quaternion');
    if (v.length !== 2 && v.length !== 3) {
      throw new Error(`ga_rotation_quaternion: expected a 2D or 3D axis, got length ${v.length}`);
    }
    return scalarArray(rotationQuaternion(v, (inputs[1] as ScalarNode).value), [4]);
  },
};

/**
 * 3D vectors as pure quaternions: a row of zeros (the real parts) is put on top,
 * so column i becomes (0, x, y, z).
 * @param vectors - Array of scalars, shape [3, n]: row 0 the x's, row 1 the y's, row 2 the z's
 * @returns Array of scalars, shape [4, n]
 * @auxiliaryNodes el_<i> (Scalar nodes)
 */
export const BatchVec3DToQuaternion: Node2NodeFunc = {
  keyword: 'ga_batch_vec3d_to_quaternion', outputType: 'Array',
  parameters: [{ name: 'vectors', type: 'Array' }],
  compute(inputs: AnyNode[]) {
    const vectors = inputs[0] as ArrayNode;
    const values = scalarValues(vectors, 'ga_batch_vec3d_to_quaternion');
    const shape = vectors.shape;
    if (shape.length !== 2 || shape[0] !== 3) {
      throw new Error(`ga_batch_vec3d_to_quaternion: expected a 3×n array, got shape [${shape}]`);
    }
    const n = shape[1];
    const zeros = Array.from({ length: n }, () => scalar(0));
    return scalarArray([...zeros, ...values.map(ref)], [4, n]);
  },
};

/**
 * Rotates each column v of a 4×n array of quaternions by q · v · q⁻¹, where q is the rotation
 * quaternion for `axis` and `degrees`. The real parts are dropped: they stay 0 for pure quaternions.
 * @param quaternions - Array of scalars, shape [4, n]: row 0 the real parts, rows 1–3 the i, j, k parts
 * @param axis - Array of 2 or 3 scalars, the rotation axis
 * @param degrees - Angle in degrees
 * @returns Array of scalars, shape [3, n]: the rotated i, j, k parts
 * @auxiliaryNodes el_<i> (Scalar nodes)
 */
export const BatchQuaternionRotation: Node2NodeFunc = {
  keyword: 'ga_batch_quaternion_rotation', outputType: 'Array',
  parameters: [{ name: 'quaternions', type: 'Array' }, { name: 'axis', type: 'Array' }, { name: 'degrees', type: 'Scalar' }],
  compute(inputs: AnyNode[]) {
    const quaternions = inputs[0] as ArrayNode;
    const el = scalarValues(quaternions, 'ga_batch_quaternion_rotation');
    const axis = scalarValues(inputs[1] as ArrayNode, 'ga_batch_quaternion_rotation');
    const shape = quaternions.shape;
    if (shape.length !== 2 || shape[0] !== 4) {
      throw new Error(`ga_batch_quaternion_rotation: expected a 4×n array of quaternions, got shape [${shape}]`);
    }
    if (axis.length !== 2 && axis.length !== 3) {
      throw new Error(`ga_batch_quaternion_rotation: expected a 2D or 3D axis, got length ${axis.length}`);
    }
    const n = shape[1];

    // q is a unit quaternion, so its inverse is its conjugate.
    const q = rotationQuaternion(axis, (inputs[2] as ScalarNode).value);
    const qInv = [ref(q[0]), neg(ref(q[1])), neg(ref(q[2])), neg(ref(q[3]))];

    const outX: Dtype[] = [], outY: Dtype[] = [], outZ: Dtype[] = [];
    for (let i = 0; i < n; i++) {
      const v = [el[i], el[n + i], el[2 * n + i], el[3 * n + i]];
      const rotated = quaternionMul(quaternionMul(q, v), qInv);
      outX.push(rotated[1]);
      outY.push(rotated[2]);
      outZ.push(rotated[3]);
    }
    return scalarArray([...outX, ...outY, ...outZ], [3, n]);
  },
};
