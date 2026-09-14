/**
 * Line primitives for the NITS hairline drawing system.
 *
 * Everything the machine is made of accumulates into flat number[] buffers of
 * point pairs, ready for a THREE.Float32BufferAttribute. No three.js import
 * here on purpose — this module stays testable and framework-free.
 */

export type Vec3 = readonly [number, number, number];
export type Buf = number[];
export type Axis = 'x' | 'y' | 'z';

export const TAU = Math.PI * 2;

/** One line segment. */
export function seg(buf: Buf, a: Vec3, b: Vec3): void {
  buf.push(a[0], a[1], a[2], b[0], b[1], b[2]);
}

/** A polyline, optionally closed. */
export function poly(buf: Buf, pts: readonly Vec3[], close = false): void {
  for (let i = 0; i < pts.length - 1; i++) seg(buf, pts[i], pts[i + 1]);
  if (close && pts.length > 2) seg(buf, pts[pts.length - 1], pts[0]);
}

/** A circle lying flat in XZ. Returns its points so callers can strut between two. */
export function circle(
  buf: Buf, r: number, y: number, n: number, cx = 0, cz = 0,
): Vec3[] {
  const p: Vec3[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU;
    p.push([cx + Math.cos(a) * r, y, cz + Math.sin(a) * r]);
  }
  poly(buf, p, true);
  return p;
}

/** A circle standing in an arbitrary plane — fasteners, ports, bosses. */
export function circleAx(buf: Buf, r: number, n: number, c: Vec3, ax: Axis): Vec3[] {
  const p: Vec3[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU;
    const u = Math.cos(a) * r;
    const v = Math.sin(a) * r;
    if (ax === 'y') p.push([c[0] + u, c[1], c[2] + v]);
    else if (ax === 'z') p.push([c[0] + u, c[1] + v, c[2]]);
    else p.push([c[0], c[1] + u, c[2] + v]);
  }
  poly(buf, p, true);
  return p;
}

/** Twelve edges of a box. `cy` is the bottom face, not the centre. */
export function box(
  buf: Buf, w: number, h: number, d: number, cx: number, cy: number, cz: number,
): void {
  const x = w / 2;
  const z = d / 2;
  const y1 = cy + h;
  const lo: Vec3[] = [
    [cx - x, cy, cz - z], [cx + x, cy, cz - z],
    [cx + x, cy, cz + z], [cx - x, cy, cz + z],
  ];
  const hi: Vec3[] = lo.map((p) => [p[0], y1, p[2]] as Vec3);
  poly(buf, lo, true);
  poly(buf, hi, true);
  for (let i = 0; i < 4; i++) seg(buf, lo[i], hi[i]);
}

/** Two rings and a chosen number of struts between them. */
export function cyl(
  buf: Buf, r: number, y0: number, y1: number,
  n: number, struts: number, cx = 0, cz = 0,
): void {
  const a = circle(buf, r, y0, n, cx, cz);
  const b = circle(buf, r, y1, n, cx, cz);
  for (let i = 0; i < struts; i++) {
    const k = Math.round((i / struts) * n) % n;
    seg(buf, a[k], b[k]);
  }
}

/** A truncated cone — lens barrels, collars. */
export function cone(
  buf: Buf, r0: number, y0: number, r1: number, y1: number,
  n: number, struts: number, cx = 0, cz = 0,
): void {
  const a = circle(buf, r0, y0, n, cx, cz);
  const b = circle(buf, r1, y1, n, cx, cz);
  for (let i = 0; i < struts; i++) {
    const k = Math.round((i / struts) * n) % n;
    seg(buf, a[k], b[k]);
  }
}

/** Louvre hatching, the way vents are drawn on a general-arrangement sheet. */
export function hatch(
  buf: Buf, x: number, y: number, z: number,
  w: number, h: number, n: number, axis: Axis,
): void {
  for (let i = 0; i <= n; i++) {
    const t = n === 0 ? 0 : i / n;
    if (axis === 'x') seg(buf, [x, y + t * h, z - w / 2], [x, y + t * h, z + w / 2]);
    else seg(buf, [x - w / 2, y + t * h, z], [x + w / 2, y + t * h, z]);
  }
}

/** A flat rectangle in an arbitrary plane — panels, displays, port cutouts. */
export function rectAx(buf: Buf, w: number, h: number, c: Vec3, ax: Axis): void {
  const u = w / 2;
  const v = h / 2;
  const mk = (a: number, b: number): Vec3 =>
    ax === 'z' ? [c[0] + a, c[1] + b, c[2]]
      : ax === 'x' ? [c[0], c[1] + b, c[2] + a]
        : [c[0] + a, c[1], c[2] + b];
  poly(buf, [mk(-u, -v), mk(u, -v), mk(u, v), mk(-u, v)], true);
}

/** Fastener rings at the four corners of a panel. */
export function fasteners(
  buf: Buf, w: number, h: number, c: Vec3, ax: Axis, inset: number,
): void {
  const u = w / 2 - inset;
  const v = h / 2 - inset;
  for (const a of [-u, u]) {
    for (const b of [-v, v]) {
      const p: Vec3 = ax === 'z' ? [c[0] + a, c[1] + b, c[2]]
        : ax === 'x' ? [c[0], c[1] + b, c[2] + a]
          : [c[0] + a, c[1], c[2] + b];
      circleAx(buf, 0.014, 8, p, ax);
    }
  }
}

/** A dimension line with end ticks. Reads as a drawing, not a render. */
export function dim(buf: Buf, a: Vec3, b: Vec3, tick: number): void {
  seg(buf, a, b);
  const d: Vec3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const L = Math.hypot(d[0], d[1], d[2]) || 1;
  const u: Vec3 = [d[0] / L, d[1] / L, d[2] / L];
  const n: Vec3 = Math.abs(u[1]) > 0.8 ? [1, 0, 0] : [0, 1, 0];
  const t: Vec3 = [
    (u[1] * n[2] - u[2] * n[1]) * tick,
    (u[2] * n[0] - u[0] * n[2]) * tick,
    (u[0] * n[1] - u[1] * n[0]) * tick,
  ];
  for (const p of [a, b]) {
    seg(buf, [p[0] - t[0], p[1] - t[1], p[2] - t[2]], [p[0] + t[0], p[1] + t[1], p[2] + t[2]]);
  }
}
