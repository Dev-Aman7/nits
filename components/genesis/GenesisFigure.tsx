'use client';

import { useEffect, useRef } from 'react';
import { createMachineScene, type MachineScene } from './lib/machineScene';
import s from './GenesisFigure.module.css';

/**
 * The instrument inside the Evidence figure slot.
 *
 * The hero shows the machine working; this shows it drawn — furniture on, so
 * the ground grid, overall dimensions, axis triad and scale bar read as a
 * general-arrangement sheet rather than a second hero. Ink ground, drag to
 * orbit, and it sits inside the existing 2.1:1 figure frame with its mono
 * corner tags untouched.
 */
export function GenesisFigure() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let machine: MachineScene;
    try {
      machine = createMachineScene({
        canvas,
        ground: 'ink',
        viewHeight: 2.72,
        centerY: 1.12,
        furniture: true,
        idleSpin: reduced ? 0 : 0.11,
      });
    } catch {
      host.style.display = 'none';
      return; // no WebGL — the mono placeholder behind this stays visible
    }

    /* the drawing is live, so the placeholder underneath it stands down */
    const frame = host.closest('figure');
    frame?.setAttribute('data-gl', 'on');

    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    const fit = () => machine.resize(host.clientWidth, host.clientHeight, pixelRatio);
    const ro = new ResizeObserver(fit);
    ro.observe(host);
    fit();

    /* ---- drag to orbit ---- */
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const down = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      host.setPointerCapture(e.pointerId);
      host.classList.add(s.dragging);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      machine.orbit(e.clientX - lastX, e.clientY - lastY);
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const up = () => {
      dragging = false;
      host.classList.remove(s.dragging);
    };

    host.addEventListener('pointerdown', down);
    host.addEventListener('pointermove', move);
    host.addEventListener('pointerup', up);
    host.addEventListener('pointercancel', up);

    /* ---- only draw while on screen ---- */
    let visible = false;
    const io = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; },
      { rootMargin: '20% 0px' },
    );
    io.observe(host);

    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!visible) return;
      machine.frame(reduced ? 0 : dt, 1);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener('pointerdown', down);
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerup', up);
      host.removeEventListener('pointercancel', up);
      frame?.removeAttribute('data-gl');
      machine.dispose();
    };
  }, []);

  return (
    <div ref={hostRef} className={s.host}>
      <canvas ref={canvasRef} className={s.canvas} />
    </div>
  );
}
