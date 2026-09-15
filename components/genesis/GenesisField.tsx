'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  CELL_COUNT, CELL_VERTEX_SHADER, CELL_FRAGMENT_SHADER,
  seedFor, sharedTime, HANDOFF,
} from './lib/cellShaders';
import s from './GenesisField.module.css';

/**
 * One cell field, spanning Approach and Scale.
 *
 * This used to be two components with a canvas each, handed over at the
 * section boundary. Two canvases drawing the same cloud is a problem with no
 * good solution: fade between them and you get a brightness dip, hold both and
 * you get the cloud twice, vertically offset, because one is fixed to the
 * viewport and the other is sticky inside its section.
 *
 * So there is one canvas now, fixed to the viewport for the whole arc, and the
 * copy scrolls over it. The spheroids simply stay where they are while the
 * Approach thesis leaves and Scale's first statement arrives. There is no
 * handoff to get wrong.
 *
 *   Approach   arrival → cylindrical volume → spheroids
 *   Scale      spheroids → printed layers → vascularised construct
 *   Instruments  the construct disperses and spreads behind the machines
 *
 * Approach ends on the state Scale opens with, so the two timelines meet
 * without a seam. Instruments then spends the one move the shader had left:
 * the dense thing in one place becomes many, everywhere. That is the
 * democratising claim now sitting in the Instruments rail, stated in the
 * illustration rather than only under it, and the four instrument cards
 * arrive through the spreading field.
 *
 * All three sections are ink, so the palette never changes across the arc.
 */

/* Approach stages, as a fraction of its scroll.
   COMPACT_BY is 1: the compaction runs to the section's last pixel. It used to
   finish at 0.82, which left half a viewport of motionless spheroids before
   Scale took over — scroll the reader pays for and gets nothing back from.
   ARRIVE_BY is set so the cells have converged exactly as the section pins. */
const ARRIVE_BY = 0.42;
const SETTLE_BY = 0.52;
const COMPACT_BY = 1;

/* Scale stages, as a fraction of its scroll */
const SCALE_STAGES = [
  { beat: 4, hold: 0.26 },   // spheroids — carried in from Approach
  { beat: 3, hold: 0.6 },    // stacked printed layers
  { beat: 5, hold: 1 },      // vascularised construct
] as const;
const SCALE_RAMP = 0.16;

/* Instruments, as a fraction of its scroll. The spread runs across the first
   card and a half; after that the field settles back so the cards carry the
   section. It never disappears entirely until the last screen — the point is
   that the machines sit inside the distribution, not after it. */
const DISPERSE_BY = 0.45;
const SETTLE_BACK_FROM = 0.3;
const FIELD_GONE_BY = 0.94;

const ramp = (x: number, a: number, b: number) => Math.min(Math.max((x - a) / (b - a), 0), 1);
const ease = (t: number) => t * t * (3 - 2 * t);

export function GenesisField() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const approach = document.getElementById('act-01');
    const scale = document.getElementById('act-02');
    /* Optional: the dispersal phase only exists while there is a section for
       it to happen in. The field must never take the page down with it if the
       structure changes underneath. */
    const disperse = document.getElementById('act-04');
    if (!approach || !scale) {
      host.style.display = 'none';
      return;
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas, antialias: true, alpha: true, powerPreference: 'high-performance',
      });
    } catch {
      host.style.display = 'none';
      return; // no WebGL — both sections read as plain type
    }

    const pixelRatio = Math.min(window.devicePixelRatio, 1.75);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(pixelRatio);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);

    const geo = new THREE.BufferGeometry();
    const idx = new Float32Array(CELL_COUNT);
    const seed = new Float32Array(CELL_COUNT);
    for (let i = 0; i < CELL_COUNT; i++) {
      idx[i] = i;
      seed[i] = seedFor(i);
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(CELL_COUNT * 3), 3));
    geo.setAttribute('aIdx', new THREE.Float32BufferAttribute(idx, 1));
    geo.setAttribute('aSeed', new THREE.Float32BufferAttribute(seed, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 3);

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      depthTest: false,
      vertexShader: CELL_VERTEX_SHADER,
      fragmentShader: CELL_FRAGMENT_SHADER,
      uniforms: {
        uBeatA: { value: 0 },
        uBeatB: { value: 4 },
        uMix: { value: 0 },
        uDisperse: { value: 1 },
        uTime: { value: 0 },
        uSize: { value: 1.15 },
        uPixelRatio: { value: pixelRatio },
        uCell: { value: new THREE.Vector3(0.09, 0.1, 0.14) },
        uHot: { value: new THREE.Vector3(0.29, 0.33, 0.93) },
        uAlpha: { value: 0 },
      },
    });
    scene.add(new THREE.Points(geo, mat));

    let W = 1;
    let H = 1;
    const fit = () => {
      W = Math.max(window.innerWidth, 1);
      H = Math.max(window.innerHeight, 1);
      renderer.setSize(W, H, false);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      mat.uniforms.uSize.value = W < 700 ? 0.95 : 1.15;
    };
    fit();
    window.addEventListener('resize', fit);

    /* ---------------------------------------------------------------- read */
    let pApproach = 0;   // 0..1, starts one screen before Approach
    let pScale = 0;      // 0..1 across Scale's own scroll
    let pDisperse = 0;   // 0..1 across Instruments' own scroll
    let phase: 'approach' | 'scale' | 'disperse' = 'approach';
    let band = 0;        // px from the bottom the cells may use
    let active = false;

    const read = () => {
      const vh = window.innerHeight;
      const ra = approach.getBoundingClientRect();
      const rs = scale.getBoundingClientRect();

      const aStart = vh;
      const aEnd = -(ra.height - vh);
      pApproach = Math.min(1, Math.max(0, (aStart - ra.top) / (aStart - aEnd)));

      const sTravel = Math.max(1, rs.height - vh);
      pScale = Math.min(1, Math.max(0, -rs.top / sTravel));

      /* Scale owns the field the moment its top reaches the top of the
         screen. Approach is at its last stage by then and Scale opens on that
         same stage, so the switch changes nothing on screen. */
      const rx = disperse ? disperse.getBoundingClientRect() : null;
      if (rx) {
        const xTravel = Math.max(1, rx.height - vh);
        pDisperse = Math.min(1, Math.max(0, -rx.top / xTravel));
        phase = rx.top <= 0 ? 'disperse' : rs.top <= 0 ? 'scale' : 'approach';
      } else {
        pDisperse = 0;
        phase = rs.top <= 0 ? 'scale' : 'approach';
      }

      band = phase === 'approach'
        ? Math.max(0, Math.min(vh, vh - ra.top + vh * 0.1))
        : vh;

      const lastRect = rx ?? rs;
      active = ra.top < vh * 1.05 && lastRect.bottom > 0;
    };
    read();
    window.addEventListener('scroll', read, { passive: true });
    window.addEventListener('resize', read, { passive: true });

    /* --------------------------------------------------------------- frame */
    let raf = 0;
    let last = performance.now();
    let smoothA = pApproach;
    let smoothS = pScale;
    let smoothX = pDisperse;

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      host.style.setProperty('--seq-show', active ? '1' : '0');
      if (!active) return;

      const t = sharedTime(reduced);
      const k = Math.min(dt * 6, 1);
      smoothA += (pApproach - smoothA) * k;
      smoothS += (pScale - smoothS) * k;
      smoothX += (pDisperse - smoothX) * k;

      host.style.setProperty('--seq-band', `${Math.round(band)}px`);
      mat.uniforms.uTime.value = t;

      let dist: number;
      let ele: number;
      let spin: number;
      let lookY: number;
      let lateral: number;
      let alpha: number;

      if (phase === 'approach') {
        /* ---- Approach: arrive, settle into the cylinder, compact ---- */
        const arrive = ease(ramp(smoothA, 0, ARRIVE_BY));
        const mix = ease(ramp(smoothA, SETTLE_BY, COMPACT_BY));
        mat.uniforms.uBeatA.value = 0;
        mat.uniforms.uBeatB.value = 4;
        mat.uniforms.uMix.value = mix;
        mat.uniforms.uDisperse.value = 1 - arrive;

        alpha = ramp(smoothA, 0, 0.14) * 0.9;

        /* Dark over the paper hero, pale once the ground beneath is ink. */
        const onInk = Math.min(Math.max((band / H - 0.25) / 0.45, 0), 1);
        mat.uniforms.uCell.value.set(
          0.09 + (0.58 - 0.09) * onInk,
          0.1 + (0.61 - 0.1) * onInk,
          0.14 + (0.7 - 0.14) * onInk,
        );
        mat.uniforms.uHot.value.set(
          0.29 + (0.68 - 0.29) * onInk,
          0.33 + (0.7 - 0.33) * onInk,
          0.93 + (1.0 - 0.93) * onInk,
        );

        /* converges on the pose Scale opens from */
        dist = (5.4 - arrive * 0.9) * (1 - mix) + HANDOFF.dist * mix;
        ele = 0.34 * (1 - mix) + HANDOFF.ele * mix;
        spin = t * 0.045 + arrive * 0.3 * (1 - mix);
        lookY = HANDOFF.lookY * mix;
        lateral = HANDOFF.lateral * mix;
      } else if (phase === 'scale') {
        /* ---- Scale: spheroids, layers, construct ---- */
        const t1 = ease(ramp(smoothS, SCALE_STAGES[0].hold, SCALE_STAGES[0].hold + SCALE_RAMP));
        const t2 = ease(ramp(smoothS, SCALE_STAGES[1].hold, SCALE_STAGES[1].hold + SCALE_RAMP));

        let a: number = SCALE_STAGES[0].beat;
        let b: number = SCALE_STAGES[0].beat;
        let mix = 0;
        if (t2 > 0) { a = SCALE_STAGES[1].beat; b = SCALE_STAGES[2].beat; mix = t2; }
        else if (t1 > 0) { a = SCALE_STAGES[0].beat; b = SCALE_STAGES[1].beat; mix = t1; }
        mat.uniforms.uBeatA.value = a;
        mat.uniforms.uBeatB.value = b;
        mat.uniforms.uMix.value = mix;
        mat.uniforms.uDisperse.value = 0;

        mat.uniforms.uCell.value.set(0.58, 0.61, 0.7);
        mat.uniforms.uHot.value.set(0.68, 0.7, 1.0);

        /* Hands the field to Instruments at full strength when that section
           exists; fades itself out when it does not. */
        alpha = disperse ? 0.9 : Math.min((1 - smoothS) / 0.05, 1) * 0.9;

        const stage = t1 + t2;
        dist = HANDOFF.dist - 0.95 * Math.sin((stage / 2) * Math.PI);
        ele = HANDOFF.ele + 0.7 * Math.sin((stage / 2) * Math.PI * 0.8);
        spin = t * 0.045 + stage * 0.45;
        lookY = HANDOFF.lookY + (0.1 * Math.min(stage, 2)) / 2;
        /* field opposite the step's copy: cell right, tissue left, construct right */
        lateral = HANDOFF.lateral * (1 - 2 * t1 + 2 * t2);
      } else {
        /* ---- Instruments: the construct comes apart and spreads ----

           One dense thing in one place becoming many, everywhere. The camera
           pulls back as it goes, so the spread reads as reach rather than the
           object simply exploding towards the lens. The instrument cards are
           opaque and slide over the top; the field shows in the gaps. */
        const spread = ease(ramp(smoothX, 0, DISPERSE_BY));

        mat.uniforms.uBeatA.value = SCALE_STAGES[2].beat;
        mat.uniforms.uBeatB.value = SCALE_STAGES[2].beat;
        mat.uniforms.uMix.value = 0;
        /* A loosening, not an explosion. Past about 0.5 the cloud spreads
           over so wide a solid angle that 25,600 points read as dust — the
           density collapses and the section looks emptier than before the
           move, which is the opposite of the intent. */
        mat.uniforms.uDisperse.value = spread * 0.5;

        mat.uniforms.uCell.value.set(0.58, 0.61, 0.7);
        mat.uniforms.uHot.value.set(0.68, 0.7, 1.0);

        /* Settles back rather than leaving — the rail copy and the cards need
           the foreground, but the machines should sit inside the distribution
           rather than after it. */
        alpha = 0.9
          * (1 - 0.33 * ease(ramp(smoothX, SETTLE_BACK_FROM, SETTLE_BACK_FROM + 0.22)))
          * (1 - ease(ramp(smoothX, FIELD_GONE_BY - 0.1, FIELD_GONE_BY)));

        /* A modest pull-back only. Retreating far enough to see the whole
           spread also thins it to dust by the second card, which is the
           opposite of the point — the machines should still be inside it. */
        dist = HANDOFF.dist + 1.2 * spread;
        ele = HANDOFF.ele + 0.5 * spread;
        spin = t * 0.045 + 0.9 + spread * 0.5;
        lookY = HANDOFF.lookY + 0.1;
        /* Held right of the sticky rail, but not pinned to the far edge. */
        lateral = HANDOFF.lateral * (1 + 0.15 * spread);
      }

      mat.uniforms.uAlpha.value = Math.max(0, alpha);

      camera.position.set(Math.sin(spin) * dist, ele, Math.cos(spin) * dist);
      camera.lookAt(0, lookY, 0);
      if (W >= 880) camera.translateX(lateral);

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', read);
      window.removeEventListener('resize', read);
      window.removeEventListener('resize', fit);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={hostRef} className={s.host} aria-hidden="true">
      <canvas ref={canvasRef} className={s.canvas} />
    </div>
  );
}
