/**
 * GENESIS 1.3 — procedural geometry for the hairline instrument asset.
 *
 * Top-down photopolymer architecture: optics above, vat below, carriage
 * descends. Units are roughly 1.0 = 100 mm. Every number that describes the
 * real machine rather than the drawing is marked PLACEHOLDER.
 *
 * Returns one object of named line buffers. Nothing here touches three.js or
 * the DOM, so it can be unit-tested or re-baked to any renderer.
 */

import {
  type Buf, type Vec3, TAU,
  seg, poly, circle, circleAx, box, cyl, cone, hatch, rectAx, fasteners, dim,
} from './draw';

export const VAT_R = 0.52;
export const SURF_Y = 0.80;
export const LENS_Y = 1.52;
export const LENS_R = 0.085;
export const COL_Z = -0.66;
export const CAR_Y = 1.06;
export const PUMP: Vec3 = [0.66, 0.49, -0.46];

export interface MachineGeometry {
  /** chassis, vat, thermal, fluidics, electronics */
  base: { structure: Buf; detail: Buf; accent: Buf };
  /** Z column, rails, drive — fixed */
  column: { structure: Buf; detail: Buf };
  /** carriage and build platform — descends */
  carriage: { structure: Buf; detail: Buf; accent: Buf };
  /** bridge, light engine, optics */
  optics: { structure: Buf; detail: Buf; accent: Buf };
  /** frame and class II enclosure */
  shell: { structure: Buf; detail: Buf };
  /** recoater blade, swept in X by the caller */
  recoater: Buf;
  /** recoater rail, fixed to the base */
  recoaterRail: Buf;
  /** peristaltic rotor, rotated in Y by the caller */
  pumpRotor: Buf;
  /** ground grid, dimensions, axis triad, scale bar — never explodes */
  furniture: Buf;
}

export function buildMachine(): MachineGeometry {
  const A0S: Buf = [], A0D: Buf = [], A0A: Buf = [];
  const A1S: Buf = [], A1D: Buf = [];
  const A1CS: Buf = [], A1CD: Buf = [], A1CA: Buf = [];
  const A2S: Buf = [], A2D: Buf = [], A2A: Buf = [];
  const A3S: Buf = [], A3D: Buf = [];
  const REC: Buf = [], RAIL: Buf = [], ROTOR: Buf = [], FUR: Buf = [];

  // ---------------------------------------------------------------- base
  box(A0S, 1.86, 0.42, 1.62, 0, 0.06, 0);
  box(A0D, 1.70, 0.02, 1.46, 0, 0.48, 0);
  fasteners(A0D, 1.62, 1.38, [0, 0.50, 0], 'y', 0.04);

  for (const sx of [-0.80, 0.80]) {
    for (const sz of [-0.70, 0.70]) {
      cyl(A0D, 0.048, 0.0, 0.06, 16, 4, sx, sz);
      for (let i = 0; i < 4; i++) circleAx(A0D, 0.030, 12, [sx, 0.065 + i * 0.012, sz], 'y');
    }
  }

  hatch(A0D, 0.931, 0.12, 0, 1.10, 0.24, 9, 'x');
  hatch(A0D, -0.931, 0.12, 0, 1.10, 0.24, 9, 'x');
  rectAx(A0D, 1.14, 0.28, [0.931, 0.24, 0], 'x');
  rectAx(A0D, 1.14, 0.28, [-0.931, 0.24, 0], 'x');

  // front control panel: display, soft keys, e-stop
  rectAx(A0D, 0.40, 0.20, [0.56, 0.26, 0.812], 'z');
  rectAx(A0D, 0.30, 0.11, [0.56, 0.30, 0.814], 'z');
  for (let i = 0; i < 4; i++) circleAx(A0D, 0.017, 12, [0.44 + i * 0.08, 0.19, 0.814], 'z');
  circleAx(A0A, 0.040, 20, [-0.62, 0.26, 0.814], 'z');
  circleAx(A0D, 0.055, 20, [-0.62, 0.26, 0.812], 'z');
  circleAx(A0A, 0.014, 10, [-0.44, 0.26, 0.814], 'z');

  // rear service panel
  rectAx(A0D, 0.46, 0.26, [-0.40, 0.24, -0.812], 'z');
  for (let i = 0; i < 3; i++) rectAx(A0D, 0.08, 0.05, [-0.54 + i * 0.13, 0.29, -0.814], 'z');
  circleAx(A0D, 0.034, 16, [-0.40, 0.17, -0.814], 'z');
  fasteners(A0D, 0.46, 0.26, [-0.40, 0.24, -0.812], 'z', 0.02);

  // electronics bay, seen through the wireframe
  box(A0D, 0.62, 0.20, 0.46, -0.44, 0.14, -0.30);
  for (let i = 0; i < 5; i++) seg(A0D, [-0.70 + i * 0.13, 0.14, -0.52], [-0.70 + i * 0.13, 0.14, -0.08]);
  for (let i = 0; i < 4; i++) rectAx(A0D, 0.05, 0.04, [-0.66 + i * 0.11, 0.245, -0.07], 'z');

  // vat, thermal jacket, Peltier stack
  cyl(A0S, VAT_R, 0.50, 0.92, 72, 12);
  circle(A0D, VAT_R * 0.94, 0.50, 72);
  circle(A0A, VAT_R * 0.96, SURF_Y, 72);
  circle(A0D, VAT_R * 0.96, SURF_Y - 0.05, 72);
  cyl(A0D, VAT_R + 0.06, 0.46, 0.52, 72, 8);
  fasteners(A0D, 0.96, 0.96, [0, 0.52, 0], 'y', 0.02);
  box(A0D, 0.60, 0.06, 0.60, 0, 0.40, 0);
  for (let i = 0; i < 14; i++) {
    const x = -0.28 + i * 0.043;
    poly(A0D, [[x, 0.40, -0.28], [x, 0.28, -0.28], [x, 0.28, 0.28], [x, 0.40, 0.28]]);
  }

  for (const s of [-1, 1]) {
    poly(A0D, [
      [s * (VAT_R + 0.06), 0.62, 0], [s * (VAT_R + 0.30), 0.62, 0],
      [s * (VAT_R + 0.30), 0.36, 0], [s * 0.30, 0.34, 0],
    ]);
  }

  // peristaltic feed pump and bioink cartridge
  cyl(A0S, 0.13, PUMP[1], PUMP[1] + 0.14, 32, 6, PUMP[0], PUMP[2]);
  circleAx(A0D, 0.165, 32, [PUMP[0], PUMP[1] + 0.14, PUMP[2]], 'y');
  cyl(A0D, 0.10, PUMP[1] + 0.14, PUMP[1] + 0.30, 24, 4, 0.20, -0.62);
  cyl(A0D, 0.055, PUMP[1] + 0.30, PUMP[1] + 0.36, 16, 4, 0.20, -0.62);
  circle(A0D, 0.10, PUMP[1] + 0.24, 24, 0.20, -0.62);
  poly(A0A, [
    [0.20, 0.85, -0.52], [0.20, 0.94, -0.46], [0.46, 0.96, -0.46],
    [PUMP[0], 0.90, PUMP[2]], [PUMP[0], 0.66, PUMP[2] - 0.13],
    [0.30, 0.88, -0.20], [0.14, 0.86, 0.02],
  ]);

  // in-situ monitoring camera, sighted on the surface
  box(A0D, 0.12, 0.10, 0.16, -0.70, 0.86, 0.30);
  cyl(A0D, 0.035, 0.86, 0.90, 16, 4, -0.70, 0.30);
  for (let i = 0; i < 7; i++) {
    seg(A0D,
      [-0.66 + i * 0.09, 0.88 - i * 0.012, 0.28 - i * 0.038],
      [-0.63 + i * 0.09, 0.876 - i * 0.012, 0.26 - i * 0.038]);
  }

  dim(A0D, [-VAT_R, 0.36, VAT_R + 0.42], [VAT_R, 0.36, VAT_R + 0.42], 0.03);

  // ---------------------------------------------------------------- column
  box(A1S, 0.16, 1.62, 0.16, 0, 0.50, COL_Z);
  for (let y = 0.60; y < 2.06; y += 0.14) {
    seg(A1D, [-0.081, y, COL_Z - 0.081], [-0.081, y, COL_Z + 0.081]);
  }
  for (const s of [-1, 1]) {
    box(A1D, 0.036, 1.46, 0.05, s * 0.138, 0.58, COL_Z);
    for (let y = 0.64; y < 2.02; y += 0.16) circleAx(A1D, 0.009, 6, [s * 0.138, y, COL_Z + 0.026], 'z');
  }

  // lead screw, drawn as an actual helix
  const helix: Vec3[] = [];
  for (let i = 0; i <= 480; i++) {
    const t = i / 480;
    const y = 0.54 + t * 1.46;
    const a = t * TAU * 19;
    helix.push([Math.cos(a) * 0.042, y, COL_Z + Math.sin(a) * 0.042]);
  }
  poly(A1D, helix);

  cyl(A1S, 0.10, 2.06, 2.26, 24, 6, 0, COL_Z);            // stepper
  fasteners(A1D, 0.17, 0.17, [0, 2.06, COL_Z], 'y', 0.005);
  cyl(A1D, 0.055, 2.00, 2.06, 16, 4, 0, COL_Z);           // coupling
  seg(A1D, [-0.055, 2.03, COL_Z], [0.055, 2.03, COL_Z]);
  cyl(A1D, 0.072, 0.50, 0.56, 20, 4, 0, COL_Z);           // thrust bearing
  for (const y of [0.62, 1.96]) box(A1D, 0.05, 0.04, 0.04, 0.11, y, COL_Z - 0.10);

  // ---------------------------------------------------------------- carriage
  box(A1CS, 0.34, 0.22, 0.30, 0, CAR_Y, COL_Z);
  for (const s of [-1, 1]) box(A1CD, 0.07, 0.13, 0.10, s * 0.138, CAR_Y + 0.045, COL_Z);
  cyl(A1CD, 0.062, CAR_Y + 0.02, CAR_Y + 0.16, 20, 4, 0, COL_Z);
  fasteners(A1CD, 0.26, 0.22, [0, CAR_Y, COL_Z], 'y', 0.02);

  box(A1CD, 0.11, 0.10, 0.60, 0, CAR_Y + 0.06, COL_Z + 0.36);
  for (let i = 1; i < 5; i++) {
    seg(A1CD, [-0.055, CAR_Y + 0.06, COL_Z + 0.12 * i], [0.055, CAR_Y + 0.06, COL_Z + 0.12 * i]);
  }
  poly(A1CD, [[0, CAR_Y + 0.11, COL_Z + 0.66], [0, 0.76, COL_Z + 0.66], [0, 0.76, -0.06]]);

  circle(A1CS, 0.44, 0.72, 64);
  circle(A1CD, 0.44, 0.70, 64);
  for (let i = 0; i < 64; i += 2) {
    const a = (i / 64) * TAU;
    seg(A1CD, [Math.cos(a) * 0.44, 0.72, Math.sin(a) * 0.44], [Math.cos(a) * 0.44, 0.70, Math.sin(a) * 0.44]);
  }
  for (let r = 0.10; r <= 0.39; r += 0.072) {
    const n = Math.max(6, Math.round(r * 48));
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU;
      circle(A1CD, 0.015, 0.715, 6, Math.cos(a) * r, Math.sin(a) * r);
    }
  }
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * TAU;
    seg(A1CD, [0, 0.695, 0], [Math.cos(a) * 0.42, 0.695, Math.sin(a) * 0.42]);
  }
  circle(A1CA, 0.055, 0.715, 20);
  dim(A1CD, [-0.44, 0.60, 0], [0.44, 0.60, 0], 0.025);

  // ---------------------------------------------------------------- optics
  box(A2S, 1.86, 0.14, 1.62, 0, 2.10, 0);
  for (let i = -5; i <= 5; i++) seg(A2D, [i * 0.16, 2.12, -0.62], [i * 0.16, 2.12, 0.62]);
  fasteners(A2D, 1.72, 1.48, [0, 2.24, 0], 'y', 0.04);

  box(A2S, 0.58, 0.44, 0.58, 0, 1.68, 0);
  box(A2D, 0.42, 0.06, 0.42, 0, 2.10, 0);
  for (const sx of [-0.19, 0.19]) {
    for (const sz of [-0.19, 0.19]) seg(A2D, [sx, 2.10, sz], [sx, 1.68, sz]);
  }

  rectAx(A2D, 0.30, 0.20, [0, 1.96, -0.20], 'z');                   // LED board
  for (let i = 0; i < 4; i++) circleAx(A2A, 0.022, 12, [-0.10 + i * 0.067, 1.96, -0.195], 'z');
  poly(A2D, [                                                        // dichroic at 45 degrees
    [-0.14, 1.82, -0.14], [0.14, 1.82, -0.14], [0.14, 1.96, 0.14], [-0.14, 1.96, 0.14],
  ], true);
  rectAx(A2D, 0.26, 0.18, [0, 1.74, 0.22], 'z');                     // DMD
  for (let i = 0; i < 5; i++) seg(A2D, [-0.11 + i * 0.055, 1.66, 0.215], [-0.11 + i * 0.055, 1.82, 0.215]);
  circleAx(A2D, 0.10, 24, [0, 1.62, 0], 'y');                        // condenser

  hatch(A2D, 0.291, 1.72, 0, 0.40, 0.30, 9, 'x');
  hatch(A2D, -0.291, 1.72, 0, 0.40, 0.30, 9, 'x');

  cone(A2S, 0.17, 1.68, LENS_R, LENS_Y, 48, 8);
  for (let i = 0; i < 3; i++) circle(A2D, 0.155 - i * 0.022, 1.645 - i * 0.035, 40);
  circle(A2A, LENS_R, LENS_Y, 48);
  circle(A2D, LENS_R * 0.62, LENS_Y, 48);
  for (let y = LENS_Y - 0.06; y > SURF_Y; y -= 0.10) seg(A2D, [0, y, 0], [0, y - 0.05, 0]);

  // ---------------------------------------------------------------- shell
  box(A3S, 1.94, 1.72, 1.70, 0, 0.44, 0);
  for (const sx of [-0.94, 0.94]) {
    for (const sz of [-0.82, 0.82]) {
      box(A3D, 0.07, 1.76, 0.07, sx, 0.42, sz);
      for (let y = 0.50; y < 2.12; y += 0.18) seg(A3D, [sx - 0.035, y, sz], [sx + 0.035, y, sz]);
    }
  }
  for (const y of [0.46, 2.14]) {
    for (const sz of [-0.82, 0.82]) seg(A3D, [-0.94, y, sz], [0.94, y, sz]);
  }

  poly(A3D, [[-0.74, 0.58, 0.851], [0.74, 0.58, 0.851], [0.74, 1.82, 0.851], [-0.74, 1.82, 0.851]], true);
  poly(A3D, [[-0.66, 0.66, 0.851], [0.66, 0.66, 0.851], [0.66, 1.74, 0.851], [-0.66, 1.74, 0.851]], true);
  for (let i = 0; i < 13; i++) {
    const x = -0.64 + i * 0.107;
    seg(A3D, [x, 0.68, 0.852], [Math.min(x + 0.30, 0.64), 1.00, 0.852]);
  }
  seg(A3D, [0.62, 1.10, 0.856], [0.62, 1.34, 0.856]);
  for (const y of [0.70, 1.70]) {
    seg(A3D, [-0.76, y, 0.851], [-0.70, y, 0.851]);
    circleAx(A3D, 0.012, 8, [-0.74, y, 0.853], 'z');
  }
  box(A3D, 0.06, 0.05, 0.05, 0.70, 1.78, 0.80);

  box(A3D, 1.46, 0.12, 1.26, 0, 1.98, 0);
  for (let i = 0; i < 24; i++) {
    const x = -0.70 + i * 0.061;
    poly(A3D, [[x, 1.98, -0.62], [x + 0.030, 2.04, -0.62], [x + 0.061, 1.98, -0.62]]);
    poly(A3D, [[x, 1.98, 0.62], [x + 0.030, 2.04, 0.62], [x + 0.061, 1.98, 0.62]]);
  }
  rectAx(A3D, 1.46, 1.26, [0, 1.98, 0], 'y');

  // ---------------------------------------------------------------- moving parts
  box(REC, 0.10, 0.08, 1.12, 0, 0.90, 0);
  poly(REC, [[-0.04, 0.90, -0.56], [0, 0.845, -0.56], [0.04, 0.90, -0.56]]);
  poly(REC, [[-0.04, 0.90, 0.56], [0, 0.845, 0.56], [0.04, 0.90, 0.56]]);
  seg(REC, [0, 0.845, -0.56], [0, 0.845, 0.56]);
  for (let i = 1; i < 6; i++) seg(REC, [-0.05, 0.94, -0.56 + i * 0.187], [0.05, 0.94, -0.56 + i * 0.187]);

  for (const sz of [-0.60, 0.60]) {
    seg(RAIL, [-0.86, 0.96, sz], [0.86, 0.96, sz]);
    box(RAIL, 0.06, 0.05, 0.05, -0.86, 0.935, sz);
    box(RAIL, 0.06, 0.05, 0.05, 0.86, 0.935, sz);
  }

  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * TAU;
    cyl(ROTOR, 0.028, 0, 0.12, 12, 4, Math.cos(a) * 0.082, Math.sin(a) * 0.082);
  }
  circleAx(ROTOR, 0.095, 20, [0, 0.12, 0], 'y');

  // ---------------------------------------------------------------- furniture
  for (let i = -5; i <= 5; i++) {
    seg(FUR, [i * 0.25, -0.002, -1.25], [i * 0.25, -0.002, 1.25]);
    seg(FUR, [-1.25, -0.002, i * 0.25], [1.25, -0.002, i * 0.25]);
  }
  dim(FUR, [-1.28, 0, -1.10], [-1.28, 2.26, -1.10], 0.05);
  seg(FUR, [-0.97, 0, -1.10], [-1.34, 0, -1.10]);
  seg(FUR, [-0.97, 2.26, -1.10], [-1.34, 2.26, -1.10]);
  dim(FUR, [-0.97, -0.22, 1.18], [0.97, -0.22, 1.18], 0.05);
  const O: Vec3 = [-1.34, 0.02, 1.16];
  const axes: Vec3[] = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  for (const d of axes) seg(FUR, O, [O[0] + d[0] * 0.26, O[1] + d[1] * 0.26, O[2] + d[2] * 0.26]);
  for (let i = 0; i <= 5; i++) seg(FUR, [0.30 + i * 0.12, -0.22, -1.20], [0.30 + i * 0.12, -0.17, -1.20]);
  seg(FUR, [0.30, -0.195, -1.20], [0.90, -0.195, -1.20]);

  return {
    base: { structure: A0S, detail: A0D, accent: A0A },
    column: { structure: A1S, detail: A1D },
    carriage: { structure: A1CS, detail: A1CD, accent: A1CA },
    optics: { structure: A2S, detail: A2D, accent: A2A },
    shell: { structure: A3S, detail: A3D },
    recoater: REC,
    recoaterRail: RAIL,
    pumpRotor: ROTOR,
    furniture: FUR,
  };
}

export interface Callout {
  /** which assembly the anchor belongs to, so it follows the exploded view */
  group: 'base' | 'column' | 'carriage' | 'optics' | 'shell';
  anchor: Vec3;
  side: 'l' | 'r';
  title: string;
  sub: string;
}

export const CALLOUTS: readonly Callout[] = [
  { group: 'optics', anchor: [0.29, 1.86, 0.29], side: 'r', title: '01 · LIGHT ENGINE', sub: '405 NM · DMD · DICHROIC' },
  { group: 'optics', anchor: [0.09, 1.58, 0], side: 'r', title: '02 · PROJECTION LENS', sub: 'FOCUSED TO SURFACE' },
  { group: 'column', anchor: [0.14, 1.60, COL_Z], side: 'l', title: '03 · Z DRIVE', sub: 'STEPPER · LEAD SCREW · 2 RAILS' },
  { group: 'carriage', anchor: [0.17, CAR_Y, COL_Z], side: 'l', title: '04 · CARRIAGE', sub: 'RECIRCULATING BEARINGS' },
  { group: 'carriage', anchor: [0.31, 0.72, 0.31], side: 'r', title: '05 · BUILD PLATFORM', sub: 'PERFORATED · RIBBED' },
  { group: 'base', anchor: [0, 0.90, -0.56], side: 'r', title: '06 · RECOATER', sub: 'BLADE · LEVELS EACH LAYER' },
  { group: 'base', anchor: [-0.52, 0.66, 0], side: 'l', title: '07 · VAT', sub: 'JACKETED · PELTIER STACK' },
  { group: 'base', anchor: [PUMP[0], 0.63, PUMP[2]], side: 'r', title: '08 · FEED PUMP', sub: 'PERISTALTIC · CARTRIDGE' },
  { group: 'base', anchor: [-0.70, 0.88, 0.30], side: 'l', title: '09 · PROCESS CAMERA', sub: 'IN-SITU MONITORING' },
  { group: 'shell', anchor: [-0.97, 1.96, 0], side: 'l', title: '10 · ENCLOSURE', sub: 'CLASS II · HEPA PLENUM' },
];
