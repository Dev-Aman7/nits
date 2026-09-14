'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  CELL_COUNT, CELL_VERTEX_SHADER, CELL_FRAGMENT_SHADER,
} from './lib/cellShaders';
import s from './ScaleField.module.css';

/**
 * The cell field, pinned behind the Scale section.
 *
 * Scale descends — 10⁻¹ the body, 10⁻³ the tissue, 10⁻⁵ the cell — so the
 * sequence runs in REVERSE here: it opens on the finished perfused construct
 * and resolves down to individual cells in suspension. Beat 5 → beat 0 is
 * exactly that descent, which is why this section is the right home for it
 * and why no new copy is needed to explain what you are looking at.
 *
 * Progress comes from this section's own bounding rect, the same measurement
 * the depth readout already uses, so the illustration and the exponent never
 * disagree.
 */
export function ScaleField() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const section = host.closest('section');
    if (!section) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas, antialias: true, alpha: true, powerPreference: 'high-performance',
      });
    } catch {
      host.style.display = 'none';
      return; // no WebGL — Scale reads exactly as it did before
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
      seed[i] = Math.random();
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
        uBeat: { value: 5 },
        uTime: { value: 0 },
        uSize: { value: 1.15 },
        uPixelRatio: { value: pixelRatio },
        /* ink ground: pale cells, indigo where crosslinked */
        uCell: { value: new THREE.Vector3(0.58, 0.61, 0.70) },
        uHot: { value: new THREE.Vector3(0.68, 0.70, 1.0) },
        uAlpha: { value: 0 },
      },
    });
    scene.add(new THREE.Points(geo, mat));

    let W = 1;
    let H = 1;
    /* the canvas is sticky and viewport-tall — measure it, not the tall host */
    const fit = () => {
      W = Math.max(canvas.clientWidth, 1);
      H = Math.max(canvas.clientHeight, 1);
      renderer.setSize(W, H, false);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      mat.uniforms.uSize.value = W < 700 ? 0.95 : 1.15;
    };
    const ro = new ResizeObserver(fit);
    ro.observe(canvas);
    fit();

    /* 0 at the top of the section, 1 once its last step has been read */
    let progress = 0;
    const readProgress = () => {
      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      progress = Math.min(1, Math.max(0, -rect.top / travel));
    };
    readProgress();
    window.addEventListener('scroll', readProgress, { passive: true });
    window.addEventListener('resize', readProgress, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; },
      { rootMargin: '15% 0px' },
    );
    io.observe(section);

    let raf = 0;
    let t = 0;
    let last = performance.now();
    let smoothed = progress;

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!visible) return;
      if (!reduced) t += dt;

      smoothed += (progress - smoothed) * Math.min(dt * 6, 1);

      /* the descent: construct (5) at the body, down to loose cells (0) */
      const beat = 5 - smoothed * 5;
      mat.uniforms.uBeat.value = beat;
      mat.uniforms.uTime.value = t;

      /* fade in as the section arrives, out as it leaves */
      const edge = Math.min(smoothed / 0.06, (1 - smoothed) / 0.06, 1);
      mat.uniforms.uAlpha.value = Math.max(0, Math.min(1, edge)) * 0.85;

      /* push in as the scale drops — the camera descends with the copy */
      const dist = 4.6 - smoothed * 1.5;
      const spin = t * 0.04 + smoothed * 0.9;
      camera.position.set(Math.sin(spin) * dist, 0.55 - smoothed * 0.25, Math.cos(spin) * dist);
      camera.lookAt(0, 0, 0);
      /* the rail owns the left of this section, so bias the field right */
      if (W >= 880) camera.translateX(-0.55);

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('scroll', readProgress);
      window.removeEventListener('resize', readProgress);
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
