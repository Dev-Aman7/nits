"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";
import { INDIA_MAP_PATH, INDIA_MAP_VIEWBOX } from "./india-map-path";

export interface CursorDrivenParticleIndiaMapProps {
  className?: string;
  /** Particle radius in CSS pixels */
  particleSize?: number;
  /** Sampling step — lower = denser (min 1) */
  particleDensity?: number;
  /** Cursor repulsion strength */
  dispersionStrength?: number;
  /** Spring pull back to origin */
  returnSpeed?: number;
  /** Cursor influence radius in CSS px */
  interactionRadius?: number;
  /** Velocity damping per frame (0–1) */
  friction?: number;
  /** Idle micro-jitter near origin */
  ambientJitter?: number;
  /** Inset from container edges (0–0.35) */
  mapPadding?: number;
  /** Seeded birth jitter / idle noise */
  seed?: number;
  /** Override fill color; defaults to inherited color */
  color?: string;
  /** Fill alpha when sampling the map path (0–1) */
  sampleAlpha?: number;
}

class Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  dispersion: number;
  returnSpd: number;
  interactionRadius: number;
  friction: number;
  ambientJitter: number;

  constructor(
    x: number,
    y: number,
    size: number,
    color: string,
    dispersion: number,
    returnSpd: number,
    interactionRadius: number,
    friction: number,
    ambientJitter: number,
    birthJitter: number,
    rng: () => number
  ) {
    this.x = x + (rng() - 0.5) * birthJitter;
    this.y = y + (rng() - 0.5) * birthJitter;
    this.originX = x;
    this.originY = y;
    this.vx = (rng() - 0.5) * 5;
    this.vy = (rng() - 0.5) * 5;
    this.size = size;
    this.color = color;
    this.dispersion = dispersion;
    this.returnSpd = returnSpd;
    this.interactionRadius = interactionRadius;
    this.friction = friction;
    this.ambientJitter = ambientJitter;
  }

  update(mouseX: number, mouseY: number, rng: () => number) {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.hypot(dx, dy);
    const radius = this.interactionRadius;

    if (distance < radius && mouseX !== -1000 && mouseY !== -1000) {
      const force = (radius - distance) / radius;
      this.vx -= (dx / distance) * force * this.dispersion;
      this.vy -= (dy / distance) * force * this.dispersion;
    }

    this.vx += (this.originX - this.x) * this.returnSpd;
    this.vy += (this.originY - this.y) * this.returnSpd;
    this.vx *= this.friction;
    this.vy *= this.friction;

    const distToOrigin = Math.hypot(this.x - this.originX, this.y - this.originY);
    if (distToOrigin < 1 && this.ambientJitter > 0 && rng() > 0.95) {
      this.vx += (rng() - 0.5) * this.ambientJitter;
      this.vy += (rng() - 0.5) * this.ambientJitter;
    }

    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** Mulberry32 — deterministic PRNG from seed */
function createRng(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function CursorDrivenParticleIndiaMap({
  className,
  particleSize = 1.4,
  particleDensity = 5,
  dispersionStrength = 14,
  returnSpeed = 0.08,
  interactionRadius = 120,
  friction = 0.85,
  ambientJitter = 0.2,
  mapPadding = 0.08,
  seed = 42,
  color,
  sampleAlpha = 1,
}: CursorDrivenParticleIndiaMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let animationFrameId = 0;
    let particles: Particle[] = [];
    let mouseX = -1000;
    let mouseY = -1000;
    let containerWidth = 0;
    let containerHeight = 0;
    let rng = createRng(seed);

    const init = () => {
      const container = containerRef.current;
      if (!container) return;

      rng = createRng(seed);
      containerWidth = container.clientWidth;
      containerHeight = container.clientHeight;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(containerWidth * dpr));
      canvas.height = Math.max(1, Math.floor(containerHeight * dpr));
      canvas.style.width = `${containerWidth}px`;
      canvas.style.height = `${containerHeight}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      const computedStyle = window.getComputedStyle(container);
      const fillColor = color || computedStyle.color || "#0b0c10";

      ctx.clearRect(0, 0, containerWidth, containerHeight);

      const pad = Math.max(0, Math.min(0.35, mapPadding));
      const availW = containerWidth * (1 - pad * 2);
      const availH = containerHeight * (1 - pad * 2);
      const scale = Math.min(
        availW / INDIA_MAP_VIEWBOX.width,
        availH / INDIA_MAP_VIEWBOX.height
      );
      const drawW = INDIA_MAP_VIEWBOX.width * scale;
      const drawH = INDIA_MAP_VIEWBOX.height * scale;
      const offsetX = (containerWidth - drawW) / 2;
      const offsetY = (containerHeight - drawH) / 2;

      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);
      ctx.fillStyle = fillColor;
      ctx.globalAlpha = sampleAlpha;
      const path = new Path2D(INDIA_MAP_PATH);
      ctx.fill(path);
      ctx.restore();
      ctx.globalAlpha = 1;

      const mapPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
      particles = [];

      const step = Math.max(1, Math.floor(particleDensity * dpr));
      const birthJitter = 10;

      for (let y = 0; y < mapPixels.height; y += step) {
        for (let x = 0; x < mapPixels.width; x += step) {
          const index = (y * mapPixels.width + x) * 4;
          const alpha = mapPixels.data[index + 3] ?? 0;
          if (alpha > 128) {
            particles.push(
              new Particle(
                x / dpr,
                y / dpr,
                particleSize,
                fillColor,
                dispersionStrength,
                returnSpeed,
                interactionRadius,
                friction,
                ambientJitter,
                birthJitter,
                rng
              )
            );
          }
        }
      }

      ctx.clearRect(0, 0, containerWidth, containerHeight);
    };

    const animate = () => {
      ctx.clearRect(0, 0, containerWidth, containerHeight);
      for (const particle of particles) {
        particle.update(mouseX, mouseY, rng);
        particle.draw(ctx);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    const setPointer = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = clientX - rect.left;
      mouseY = clientY - rect.top;
    };

    const handleMouseMove = (e: MouseEvent) => setPointer(e.clientX, e.clientY);
    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };
    const handleTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) setPointer(t.clientX, t.clientY);
    };
    const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) setPointer(t.clientX, t.clientY);
    };

    const timeoutId = setTimeout(() => {
      init();
      animate();
    }, 100);

    const resizeObserver = new ResizeObserver(() => init());
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    const themeObserver = new MutationObserver(() => init());
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    canvas.addEventListener("touchend", handleMouseLeave);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    particleSize,
    particleDensity,
    dispersionStrength,
    returnSpeed,
    interactionRadius,
    friction,
    ambientJitter,
    mapPadding,
    seed,
    color,
    sampleAlpha,
  ]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex h-full min-h-[400px] w-full touch-none items-center justify-center",
        className
      )}
      aria-hidden
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
