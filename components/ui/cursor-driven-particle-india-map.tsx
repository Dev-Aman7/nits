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
  /**
   * When true, particles start scattered and gather into the map as the
   * closest section scrolls into view.
   */
  assembleOnScroll?: boolean;
  /** Multiplier for how far particles scatter from the map (default 1) */
  scatterScale?: number;
}

/** Ease-out cubic local assemble factor — shared by mesh + update. */
function assembleEase(assemble: number, delay: number) {
  const span = Math.max(0.001, 1 - delay);
  const local = Math.max(0, Math.min(1, (assemble - delay) / span));
  return 1 - Math.pow(1 - local, 3);
}

class Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  scatterX: number;
  scatterY: number;
  /** Per-particle stagger offset in [0, ~0.35] applied to assemble progress */
  assembleDelay: number;
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
    rng: () => number,
    scatter: { x: number; y: number; delay: number } | null,
    /** When remeshing mid-assemble, start at lerp(scatter, origin) instead of scatter */
    placeAtAssemble: number | null
  ) {
    this.originX = x;
    this.originY = y;
    this.scatterX = scatter?.x ?? x;
    this.scatterY = scatter?.y ?? y;
    this.assembleDelay = scatter?.delay ?? 0;

    if (scatter) {
      if (placeAtAssemble != null) {
        const t = assembleEase(placeAtAssemble, this.assembleDelay);
        this.x = this.scatterX + (this.originX - this.scatterX) * t;
        this.y = this.scatterY + (this.originY - this.scatterY) * t;
      } else {
        this.x = scatter.x;
        this.y = scatter.y;
      }
      this.vx = 0;
      this.vy = 0;
    } else {
      this.x = x + (rng() - 0.5) * birthJitter;
      this.y = y + (rng() - 0.5) * birthJitter;
      this.vx = (rng() - 0.5) * 5;
      this.vy = (rng() - 0.5) * 5;
    }

    this.size = size;
    this.color = color;
    this.dispersion = dispersion;
    this.returnSpd = returnSpd;
    this.interactionRadius = interactionRadius;
    this.friction = friction;
    this.ambientJitter = ambientJitter;
  }

  update(
    mouseX: number,
    mouseY: number,
    rng: () => number,
    assemble: number,
    cursorEnabled: boolean
  ) {
    const t = assembleEase(assemble, this.assembleDelay);
    const targetX = this.scatterX + (this.originX - this.scatterX) * t;
    const targetY = this.scatterY + (this.originY - this.scatterY) * t;

    if (cursorEnabled) {
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const distance = Math.hypot(dx, dy);
      const radius = this.interactionRadius;

      if (distance < radius && mouseX !== -1000 && mouseY !== -1000) {
        const force = (radius - distance) / radius;
        this.vx -= (dx / distance) * force * this.dispersion;
        this.vy -= (dy / distance) * force * this.dispersion;
      }
    }

    this.vx += (targetX - this.x) * this.returnSpd;
    this.vy += (targetY - this.y) * this.returnSpd;
    this.vx *= this.friction;
    this.vy *= this.friction;

    if (cursorEnabled) {
      const distToOrigin = Math.hypot(this.x - this.originX, this.y - this.originY);
      if (distToOrigin < 1 && this.ambientJitter > 0 && rng() > 0.95) {
        this.vx += (rng() - 0.5) * this.ambientJitter;
        this.vy += (rng() - 0.5) * this.ambientJitter;
      }
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

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/**
 * Section top crossing viewport: 0 while still below the fold,
 * 1 once the section has settled near the top — long scrub for a slow gather.
 */
function measureAssembleProgress(section: HTMLElement): number {
  const rect = section.getBoundingClientRect();
  const vh = window.innerHeight || 1;
  const start = vh * 1.05;
  const end = vh * 0.12;
  const raw = clamp01((start - rect.top) / (start - end));
  return smoothstep(0, 1, raw);
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
  assembleOnScroll = false,
  scatterScale = 1,
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
    let hasMeshed = false;
    let rng = createRng(seed);
    let assembleTarget = assembleOnScroll ? 0 : 1;
    let assemble = assembleTarget;
    let reducedMotion = false;
    let resizeDebounceId = 0;
    /** Per-frame blend toward scroll target — bidirectional gather / disperse */
    const ASSEMBLE_SMOOTH = 0.022;
    const RESIZE_DEBOUNCE_MS = 120;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncReduced = () => {
      reducedMotion = media.matches;
      if (reducedMotion) {
        assembleTarget = 1;
        assemble = 1;
      }
    };
    syncReduced();

    const sectionEl =
      containerRef.current?.closest("section") ??
      document.getElementById("act-05");

    const updateAssembleTarget = () => {
      if (!assembleOnScroll || reducedMotion) {
        assembleTarget = 1;
        return;
      }
      if (!sectionEl) {
        assembleTarget = 1;
        return;
      }
      assembleTarget = measureAssembleProgress(sectionEl);
    };

    /**
     * @param force — remesh even if size unchanged (theme / reduced-motion)
     */
    const init = (force = false, reason = "init") => {
      const container = containerRef.current;
      if (!container) return;

      const nextW = container.clientWidth;
      const nextH = container.clientHeight;
      if (nextW < 1 || nextH < 1) return;

      const sizeUnchanged =
        Math.abs(nextW - containerWidth) < 1 && Math.abs(nextH - containerHeight) < 1;

      if (!force && hasMeshed && sizeUnchanged) {
        return;
      }

      // Remesh mid-flight: keep visual continuity at current assemble
      const preserveAssemble = hasMeshed && assembleOnScroll && !reducedMotion;

      rng = createRng(seed);
      containerWidth = nextW;
      containerHeight = nextH;

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
      const cx = containerWidth / 2;
      const cy = containerHeight / 2;
      const scaleFactor = Math.max(0.5, scatterScale);
      const scatterRadius =
        Math.hypot(containerWidth, containerHeight) * 0.95 * scaleFactor;
      const bleed = Math.min(containerWidth, containerHeight) * 0.05;
      const placeAt = preserveAssemble ? assemble : null;

      const clampScatter = (v: number, max: number) =>
        Math.max(-bleed, Math.min(max + bleed, v));

      for (let y = 0; y < mapPixels.height; y += step) {
        for (let x = 0; x < mapPixels.width; x += step) {
          const index = (y * mapPixels.width + x) * 4;
          const alpha = mapPixels.data[index + 3] ?? 0;
          if (alpha > 128) {
            const ox = x / dpr;
            const oy = y / dpr;

            let scatter: { x: number; y: number; delay: number } | null = null;
            if (assembleOnScroll && !reducedMotion) {
              const angle = rng() * Math.PI * 2;
              // Wide ring near edges — strong separation before gather
              const dist = scatterRadius * (0.55 + rng() * 0.5);
              scatter = {
                x: clampScatter(cx + Math.cos(angle) * dist, containerWidth),
                y: clampScatter(cy + Math.sin(angle) * dist, containerHeight),
                delay: rng() * 0.32,
              };
            }

            particles.push(
              new Particle(
                ox,
                oy,
                particleSize,
                fillColor,
                dispersionStrength,
                returnSpeed,
                interactionRadius,
                friction,
                ambientJitter,
                birthJitter,
                rng,
                scatter,
                placeAt
              )
            );
          }
        }
      }

      ctx.clearRect(0, 0, containerWidth, containerHeight);
      updateAssembleTarget();
      if (!assembleOnScroll || reducedMotion) assemble = assembleTarget;
      hasMeshed = true;
    };

    const scheduleResizeInit = () => {
      window.clearTimeout(resizeDebounceId);
      resizeDebounceId = window.setTimeout(() => {
        init(false);
      }, RESIZE_DEBOUNCE_MS);
    };

    const animate = () => {
      updateAssembleTarget();
      if (assembleOnScroll && !reducedMotion) {
        assemble += (assembleTarget - assemble) * ASSEMBLE_SMOOTH;
        if (Math.abs(assembleTarget - assemble) < 0.0005) assemble = assembleTarget;
      } else {
        assemble = assembleTarget;
      }
      const cursorEnabled = !assembleOnScroll || assemble > 0.82;
      ctx.clearRect(0, 0, containerWidth, containerHeight);
      for (const particle of particles) {
        particle.update(mouseX, mouseY, rng, assemble, cursorEnabled);
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

    const onScrollOrResize = () => updateAssembleTarget();
    const onReducedChange = () => {
      syncReduced();
      init(true);
    };

    const timeoutId = setTimeout(() => {
      init(true);
      animate();
    }, 100);

    const resizeObserver = new ResizeObserver(() => scheduleResizeInit());
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    const themeObserver = new MutationObserver(() => init(true));
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    media.addEventListener("change", onReducedChange);

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    canvas.addEventListener("touchend", handleMouseLeave);

    return () => {
      clearTimeout(timeoutId);
      window.clearTimeout(resizeDebounceId);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      media.removeEventListener("change", onReducedChange);
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
    assembleOnScroll,
    scatterScale,
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
