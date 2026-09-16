"use client";

import { useEffect, useRef } from "react";
import s from "./CareersScrollFrames.module.css";
import { FRAME_COUNT, frameUrl } from "./lib/scrollFrames";

const MOBILE_MQ = "(max-width: 900px)";
const REDUCE_MQ = "(prefers-reduced-motion: reduce)";
const BATCH = 8;

type Frame = ImageBitmap | HTMLImageElement;

/**
 * Scroll-scrubbed lattice on the right of the careers stage.
 * One canvas, frames drawn from page travel — no extra pin.
 */
export function CareersScrollFrames() {
  const hostRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const frame = frameRef.current;
    const canvas = canvasRef.current;
    if (!host || !frame || !canvas) return;

    const mobile = window.matchMedia(MOBILE_MQ);
    let stop: (() => void) | undefined;

    const start = () => {
      const stage = host.parentElement;
      const ctx = canvas.getContext("2d", { alpha: true });
      if (!stage || !ctx) return () => {};

      const reduce = window.matchMedia(REDUCE_MQ).matches;
      const frames: Array<Frame | null> = Array.from(
        { length: FRAME_COUNT },
        () => null,
      );

      let cancelled = false;
      let lastDrawn = -1;
      let canvasW = 0;
      let canvasH = 0;
      let loop = 0;
      let queued = false;

      const fit = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = Math.max(1, frame.clientWidth);
        const h = Math.max(1, frame.clientHeight);
        const bw = Math.round(w * dpr);
        const bh = Math.round(h * dpr);
        if (canvas.width === bw && canvas.height === bh) return;
        canvas.width = bw;
        canvas.height = bh;
        canvasW = bw;
        canvasH = bh;
        lastDrawn = -1;
      };

      const drawSource = (src: Frame, index: number) => {
        if (index === lastDrawn) return;
        lastDrawn = index;
        ctx.clearRect(0, 0, canvasW, canvasH);
        const iw = src.width;
        const ih = src.height;
        if (!iw || !ih) return;
        const scale = Math.min(canvasW / iw, canvasH / ih);
        const dw = iw * scale;
        const dh = ih * scale;
        ctx.drawImage(src, (canvasW - dw) / 2, (canvasH - dh) / 2, dw, dh);
      };

      const nearest = (index: number): { src: Frame; index: number } | null => {
        for (let i = index; i >= 0; i--) {
          const src = frames[i];
          if (src) return { src, index: i };
        }
        for (let i = index + 1; i < FRAME_COUNT; i++) {
          const src = frames[i];
          if (src) return { src, index: i };
        }
        return null;
      };

      const progress = () => {
        const rect = stage.getBoundingClientRect();
        const travel = Math.max(1, rect.height - window.innerHeight);
        return Math.min(1, Math.max(0, -rect.top / travel));
      };

      const targetIndex = () =>
        reduce ? 0 : Math.round(progress() * (FRAME_COUNT - 1));

      const paint = () => {
        if (cancelled) return;
        fit();
        const rect = stage.getBoundingClientRect();
        if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;
        const hit = nearest(targetIndex());
        if (!hit) return;
        drawSource(hit.src, hit.index);
      };

      const requestPaint = () => {
        if (queued || cancelled) return;
        queued = true;
        requestAnimationFrame(() => {
          queued = false;
          paint();
        });
      };

      const loadFrame = async (i: number) => {
        if (frames[i] || cancelled) return;
        const img = new Image();
        img.src = frameUrl(i + 1);
        try {
          await img.decode();
          if (cancelled) return;
          try {
            const bitmap = await createImageBitmap(img);
            if (cancelled) {
              bitmap.close();
              return;
            }
            frames[i] = bitmap;
          } catch {
            if (cancelled) return;
            frames[i] = img;
          }
          requestPaint();
        } catch {
          /* skip a missing frame — nearest() covers the hole */
        }
      };

      const loadAll = async () => {
        await loadFrame(0);
        if (cancelled) return;
        paint();
        if (reduce) return;
        for (let i = 1; i < FRAME_COUNT && !cancelled; i += BATCH) {
          const end = Math.min(i + BATCH, FRAME_COUNT);
          await Promise.all(
            Array.from({ length: end - i }, (_, k) => loadFrame(i + k)),
          );
          if (cancelled) return;
          paint();
        }
      };

      if (reduce) {
        window.addEventListener("resize", requestPaint, { passive: true });
      } else {
        const tick = () => {
          loop = requestAnimationFrame(tick);
          paint();
        };
        loop = requestAnimationFrame(tick);
        window.addEventListener("resize", requestPaint, { passive: true });
      }

      void loadAll();

      return () => {
        cancelled = true;
        window.removeEventListener("resize", requestPaint);
        if (loop) cancelAnimationFrame(loop);
        for (const src of frames) {
          if (src && "close" in src) src.close();
        }
      };
    };

    const apply = () => {
      stop?.();
      stop = undefined;
      if (mobile.matches) return;
      stop = start();
    };

    apply();
    mobile.addEventListener("change", apply);

    return () => {
      mobile.removeEventListener("change", apply);
      stop?.();
    };
  }, []);

  return (
    <div ref={hostRef} className={s.host} aria-hidden="true">
      <div ref={frameRef} className={s.frame}>
        <canvas ref={canvasRef} className={s.canvas} />
      </div>
    </div>
  );
}
