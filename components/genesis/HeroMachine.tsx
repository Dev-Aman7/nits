'use client';

import { useEffect, useRef } from 'react';
import { createMachineScene, type MachineScene } from './lib/machineScene';
import s from './HeroMachine.module.css';

/**
 * The GENESIS 1.3 instrument, full bleed behind the hero headline.
 *
 * Paper ground, so the hairlines are drawn dark. The whole drawing fades as
 * the hero leaves the viewport rather than scrolling away under the next
 * section — the machine belongs to act 00 and nowhere else.
 *
 * Decorative: aria-hidden, pointer-events none, and it never steals a click
 * from the headline sitting over it.
 */
export function HeroMachine() {
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
        ground: 'paper',
        viewHeight: 3.05,
        centerY: 1.16,
        idleSpin: reduced ? 0 : 0.1,
      });
    } catch {
      host.style.display = 'none';
      return; // no WebGL — the hero reads exactly as it did before
    }

    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    const fit = () => machine.resize(host.clientWidth, host.clientHeight, pixelRatio);
    const ro = new ResizeObserver(fit);
    ro.observe(host);
    fit();

    /* Opacity is driven from the hero's own position, not page progress, so
       the fade still lands correctly if sections are added above or below. */
    let fade = 1;
    const readFade = () => {
      const section = host.parentElement;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const travel = Math.max(window.innerHeight * 0.6, 1);
      fade = Math.max(0, Math.min(1, rect.bottom / travel));
    };
    readFade();
    window.addEventListener('scroll', readFade, { passive: true });
    window.addEventListener('resize', readFade, { passive: true });

    let raf = 0;
    let last = performance.now();
    let visible = true;

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!visible || fade <= 0.002) return; // off screen: skip the draw entirely
      machine.frame(reduced ? 0 : dt, fade);
    };
    raf = requestAnimationFrame(loop);

    const io = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; },
      { rootMargin: '10% 0px' },
    );
    io.observe(host);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('scroll', readFade);
      window.removeEventListener('resize', readFade);
      machine.dispose();
    };
  }, []);

  return (
    <div ref={hostRef} className={s.host} aria-hidden="true">
      <canvas ref={canvasRef} className={s.canvas} />
    </div>
  );
}
