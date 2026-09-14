/**
 * The GENESIS 1.3 machine, as a plain scene object.
 *
 * Two places on the page draw this machine — the hero, full bleed behind the
 * headline, and the Evidence figure — so the three.js side lives here once and
 * the React components stay thin. Nothing in this file touches the DOM beyond
 * the canvas it is handed, and it owns every GPU resource it creates.
 */

import * as THREE from 'three';
import { buildMachine, SURF_Y, LENS_Y, LENS_R, COL_Z, CAR_Y, PUMP } from './machine';

export type Ground = 'paper' | 'ink';

export interface MachineSceneOptions {
  canvas: HTMLCanvasElement;
  ground: Ground;
  /** world-units of vertical frustum; smaller crops in closer */
  viewHeight?: number;
  /** world-space y the camera looks at */
  centerY?: number;
  /** draw the ground grid, dimension lines, axis triad and scale bar */
  furniture?: boolean;
  /** degrees per second of idle rotation; 0 holds still */
  idleSpin?: number;
}

export interface MachineScene {
  resize(width: number, height: number, pixelRatio: number): void;
  /** advance and draw; `opacity` multiplies every line weight */
  frame(dt: number, opacity: number): void;
  setGround(ground: Ground): void;
  /** relative drag, in pixels */
  orbit(dx: number, dy: number): void;
  dispose(): void;
}

const CHAIN_N = 26;
const RAYS = 28;
const TAU = Math.PI * 2;

export function createMachineScene(opts: MachineSceneOptions): MachineScene {
  const {
    canvas,
    viewHeight = 2.82,
    centerY = 1.14,
    furniture = false,
    idleSpin = 0.13,
  } = opts;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 80);
  const world = new THREE.Group();
  scene.add(world);

  /* three weights: structure, construction detail, accent */
  const matS = new THREE.LineBasicMaterial({ transparent: true });
  const matD = new THREE.LineBasicMaterial({ transparent: true });
  const matA = new THREE.LineBasicMaterial({ transparent: true });
  const beamMat = new THREE.LineBasicMaterial({ transparent: true });

  const owned: { dispose(): void }[] = [matS, matD, matA, beamMat];

  const lines = (arr: number[], mat: THREE.LineBasicMaterial) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(arr), 3));
    owned.push(g);
    return new THREE.LineSegments(g, mat);
  };

  const M = buildMachine();

  const gBase = new THREE.Group();
  gBase.add(lines(M.base.structure, matS), lines(M.base.detail, matD), lines(M.base.accent, matA));
  gBase.add(lines(M.recoaterRail, matD));

  const gOptics = new THREE.Group();
  gOptics.add(lines(M.optics.structure, matS), lines(M.optics.detail, matD), lines(M.optics.accent, matA));

  const gShell = new THREE.Group();
  gShell.add(lines(M.shell.structure, matS), lines(M.shell.detail, matD));

  /* the column stays put; only the carriage descends */
  const gStage = new THREE.Group();
  const gColumn = new THREE.Group();
  const gCarriage = new THREE.Group();
  gColumn.add(lines(M.column.structure, matS), lines(M.column.detail, matD));
  gCarriage.add(
    lines(M.carriage.structure, matS),
    lines(M.carriage.detail, matD),
    lines(M.carriage.accent, matA),
  );
  gStage.add(gColumn, gCarriage);

  world.add(gBase, gStage, gOptics, gShell);
  if (furniture) world.add(lines(M.furniture, matD));

  const gRecoat = new THREE.Group();
  gRecoat.add(lines(M.recoater, matD));
  gBase.add(gRecoat);

  const gPump = new THREE.Group();
  gPump.add(lines(M.pumpRotor, matD));
  gPump.position.set(PUMP[0], PUMP[1] + 0.01, PUMP[2]);
  gBase.add(gPump);

  const chainGeo = new THREE.BufferGeometry();
  chainGeo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(CHAIN_N * 6), 3));
  owned.push(chainGeo);
  gStage.add(new THREE.LineSegments(chainGeo, matD));

  /* the beam: rays leave the aperture circle and converge on the focal point,
     so the cone leans as the spot rasters the cross-section */
  const beamGeo = new THREE.BufferGeometry();
  beamGeo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array((RAYS + 1) * 6), 3));
  owned.push(beamGeo);
  const beamLines = new THREE.LineSegments(beamGeo, beamMat);
  beamLines.frustumCulled = false;
  world.add(beamLines);

  const spotGeo = new THREE.BufferGeometry();
  spotGeo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(3), 3));
  const spotMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uCol: { value: new THREE.Color(0x4b55ee) },
      uA: { value: 1 },
      uScale: { value: 1 },
    },
    vertexShader: `uniform float uA; uniform float uScale; void main(){
      gl_PointSize = 26.0 * uScale;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `uniform vec3 uCol; uniform float uA; void main(){
      float d = length(gl_PointCoord - 0.5);
      float a = smoothstep(0.5, 0.0, d); a *= a;
      if(a < 0.004) discard;
      gl_FragColor = vec4(uCol, a * uA); }`,
  });
  owned.push(spotGeo, spotMat);
  const spot = new THREE.Points(spotGeo, spotMat);
  spot.frustumCulled = false;
  world.add(spot);

  /* ---------------------------------------------------------------- ground */
  let ground: Ground = opts.ground;
  function setGround(g: Ground) {
    ground = g;
    const dark = g === 'ink';
    const line = dark ? 0xf4f3f0 : 0x0b0c10;
    const acc = dark ? 0xadb3ff : 0x4b55ee;
    matS.color.setHex(line);
    matD.color.setHex(line);
    matA.color.setHex(acc);
    beamMat.color.setHex(acc);
    (spotMat.uniforms.uCol.value as THREE.Color).setHex(acc);
  }
  setGround(ground);

  /* ---------------------------------------------------------------- camera */
  let yaw = -0.62;
  let pitch = 0.2;
  let targetYaw = yaw;
  let targetPitch = pitch;
  let idle = 0;
  let W = 1;
  let H = 1;
  let PR = 1;

  function resize(width: number, height: number, pixelRatio: number) {
    W = Math.max(width, 1);
    H = Math.max(height, 1);
    PR = pixelRatio;
    renderer.setPixelRatio(PR);
    renderer.setSize(W, H, false);
    const vh = W < 760 ? viewHeight * 1.18 : viewHeight;
    const vw = vh * (W / H);
    camera.left = -vw / 2;
    camera.right = vw / 2;
    camera.top = vh / 2;
    camera.bottom = -vh / 2;
    camera.updateProjectionMatrix();
    spotMat.uniforms.uScale.value = PR * (H / 760);
  }

  function orbit(dx: number, dy: number) {
    targetYaw += dx * 0.0072;
    targetPitch = Math.max(-0.24, Math.min(0.72, targetPitch + dy * 0.0045));
    idle = 0;
  }

  /* ---------------------------------------------------------------- frame */
  let t = 0;

  function frame(dt: number, opacity: number) {
    t += dt;
    idle += dt;

    if (idle > 1.2 && idleSpin !== 0) targetYaw += dt * idleSpin;
    yaw += (targetYaw - yaw) * Math.min(dt * 8, 1);
    pitch += (targetPitch - pitch) * Math.min(dt * 8, 1);

    const a = Math.max(0, Math.min(1, opacity));
    matS.opacity = 0.92 * a;
    matD.opacity = (ground === 'ink' ? 0.3 : 0.34) * a;
    matA.opacity = 0.95 * a;
    beamMat.opacity = 0.4 * a;
    spotMat.uniforms.uA.value = a;

    const dist = 16;
    camera.position.set(
      Math.sin(yaw) * Math.cos(pitch) * dist,
      centerY + Math.sin(pitch) * dist,
      Math.cos(yaw) * Math.cos(pitch) * dist,
    );
    camera.lookAt(0, centerY, 0);

    /* the carriage descends as layers are written */
    const cycle = (t * 0.11) % 1;
    const drop = cycle * 0.34;
    gCarriage.position.y = -drop;

    /* drag chain: fixed anchor, moving end, a fold in between */
    const cp = chainGeo.attributes.position as THREE.BufferAttribute;
    const anchorY = 0.56;
    const endY = CAR_Y + 0.04 - drop;
    for (let i = 0; i < CHAIN_N; i++) {
      const mk = (s: number): [number, number, number] => [
        0.02,
        anchorY + (endY - anchorY) * s,
        COL_Z - 0.14 - Math.sin(s * Math.PI) * (0.14 + drop * 0.24),
      ];
      const p0 = mk(i / CHAIN_N);
      const p1 = mk((i + 1) / CHAIN_N);
      cp.setXYZ(i * 2, p0[0], p0[1], p0[2]);
      cp.setXYZ(i * 2 + 1, p1[0], p1[1], p1[2]);
    }
    cp.needsUpdate = true;

    /* recoater sweeps once per layer, parked between passes */
    const lay = (t * 0.11 * 384) % 1;
    const sweep = lay > 0.72 ? (lay - 0.72) / 0.28 : 0;
    gRecoat.position.x = -0.86 + sweep * 1.72;
    gRecoat.visible = sweep > 0.001;
    gPump.rotation.y = -t * 2.1;

    /* beam */
    const spin = t * 1.35;
    const rr = 0.36 * (0.35 + 0.65 * Math.abs(Math.sin(t * 0.33)));
    const fx = Math.cos(spin) * rr;
    const fz = Math.sin(spin) * rr;
    const fy = SURF_Y + 0.004;
    const bp = beamGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < RAYS; i++) {
      const ang = (i / RAYS) * TAU;
      bp.setXYZ(i * 2, Math.cos(ang) * LENS_R, LENS_Y, Math.sin(ang) * LENS_R);
      bp.setXYZ(i * 2 + 1, fx, fy, fz);
    }
    bp.setXYZ(RAYS * 2, 0, LENS_Y, 0);
    bp.setXYZ(RAYS * 2 + 1, fx, fy, fz);
    bp.needsUpdate = true;

    const sp = spotGeo.attributes.position as THREE.BufferAttribute;
    sp.setXYZ(0, fx, fy, fz);
    sp.needsUpdate = true;

    renderer.render(scene, camera);
  }

  function dispose() {
    for (const o of owned) o.dispose();
    renderer.dispose();
  }

  return { resize, frame, setGround, orbit, dispose };
}
