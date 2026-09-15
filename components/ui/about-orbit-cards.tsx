"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { HoverTransition } from "./hover-transition";

export type AboutOrbitCard = {
  id: string;
  name: string;
  role: string;
  blurb: string;
  initials: string;
  accent: string;
};

type Pose = {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  rotate: number;
  z: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Anticlockwise arc: bottom-left → mid (focus) → top-left. Units are % of stage. */
function targetPose(t: number, compact: boolean): Pose {
  const capped = clamp(t, -1.35, 1.35);
  if (compact) {
    const focus = 1 - smoothstep(0.15, 0.85, Math.abs(capped));
    return {
      x: 50,
      y: 50 + capped * 42,
      scale: 0.82 + focus * 0.18,
      opacity: focus,
      rotate: capped * -6,
      z: Math.round(20 - Math.abs(capped) * 10),
    };
  }

  // Anticlockwise along the left: enter bottom-inset → peak further left → exit top-inset
  const angle = -capped * Math.PI * 0.52;
  const focus = 1 - smoothstep(0.2, 1.05, Math.abs(capped));
  return {
    x: 40 - 26 * Math.cos(angle),
    y: 50 + 38 * Math.sin(angle),
    scale: 0.68 + focus * 0.32,
    opacity: 0.2 + focus * 0.8,
    rotate: capped * -14,
    z: Math.round(20 - Math.abs(capped) * 12),
  };
}

function PortraitFace({
  card,
  hover = false,
}: {
  card: AboutOrbitCard;
  hover?: boolean;
}) {
  return (
    <div
      className="relative flex h-full min-h-[280px] w-full flex-col justify-between overflow-hidden p-5 text-[var(--paper)]"
      style={{
        background: hover
          ? `linear-gradient(165deg, color-mix(in oklab, ${card.accent} 72%, #000) 0%, #0a0a0a 100%)`
          : `radial-gradient(circle at 30% 18%, color-mix(in oklab, ${card.accent} 55%, #fff) 0%, transparent 42%), linear-gradient(160deg, ${card.accent}, #0c0d10)`,
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 6px, rgba(255,255,255,0.03) 6px, rgba(255,255,255,0.03) 7px)",
        }}
      />
      <div className="relative z-[1] flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
        <span>{card.role}</span>
        <span className="size-2 bg-[var(--paper)]" />
      </div>
      <div className="relative z-[1] flex flex-1 items-center justify-center">
        <span
          className={cn(
            "select-none font-medium tracking-[-0.06em] text-white/25",
            hover ? "text-5xl" : "text-6xl",
          )}
        >
          {card.initials}
        </span>
      </div>
      {hover ? (
        <div className="relative z-[1]">
          <p className="text-2xl font-medium tracking-[-0.03em] text-white">
            {card.name}
          </p>
          <p className="mt-2 max-w-[28ch] text-sm leading-snug text-white/70">
            {card.blurb}
          </p>
        </div>
      ) : (
        <div className="relative z-[1]">
          <p className="text-xl font-medium tracking-[-0.03em] text-white/90">
            {card.name}
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
            Hover to reveal
          </p>
        </div>
      )}
    </div>
  );
}

export function AboutOrbitCards({
  cards,
  progress,
  className,
}: {
  cards: readonly AboutOrbitCard[];
  /** 0–1 scroll progress through the pinned About stage */
  progress: number;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const poses = useRef<Pose[]>(
    cards.map(() => ({ x: 50, y: 50, scale: 0.8, opacity: 0, rotate: 0, z: 0 })),
  );
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mediaReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mediaCompact = window.matchMedia("(max-width: 820px)");
    let frame = 0;

    const tick = () => {
      const n = cards.length;
      const continuous = clamp(progressRef.current, 0, 1) * Math.max(n - 1, 1);
      const compact = mediaCompact.matches;
      const reduced = mediaReduce.matches;

      cards.forEach((_, i) => {
        const el = cardRefs.current[i];
        if (!el) return;

        const t = continuous - i;
        const target = reduced
          ? {
              x: 50,
              y: 50,
              scale: Math.abs(t) < 0.5 ? 1 : 0.92,
              opacity: Math.abs(t) < 0.5 ? 1 : 0,
              rotate: 0,
              z: Math.abs(t) < 0.5 ? 20 : 0,
            }
          : targetPose(t, compact);

        const current = poses.current[i]!;
        const damp = reduced ? 1 : 0.14;
        current.x += (target.x - current.x) * damp;
        current.y += (target.y - current.y) * damp;
        current.scale += (target.scale - current.scale) * damp;
        current.opacity += (target.opacity - current.opacity) * damp;
        current.rotate += (target.rotate - current.rotate) * damp;
        current.z = target.z;

        const visible = current.opacity > 0.04 && Math.abs(t) < 1.4;
        el.style.visibility = visible ? "visible" : "hidden";
        el.style.opacity = String(current.opacity);
        el.style.zIndex = String(current.z);
        el.style.left = `${current.x}%`;
        el.style.top = `${current.y}%`;
        el.style.transform = `translate3d(-50%, -50%, 0) rotate(${current.rotate}deg) scale(${current.scale})`;
        el.style.pointerEvents = Math.abs(t) < 0.55 ? "auto" : "none";
      });

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [cards]);

  return (
    <div
      ref={rootRef}
      className={cn("relative h-full w-full overflow-hidden", className)}
      aria-label="Team portraits"
    >
      {cards.map((card, i) => (
        <div
          key={card.id}
          ref={(node) => {
            cardRefs.current[i] = node;
          }}
          className="absolute w-[min(92%,280px)] will-change-transform md:w-[min(100%,320px)]"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate3d(-50%, -50%, 0) scale(0.8)",
            opacity: 0,
          }}
        >
          <HoverTransition
            className="aspect-[3/4] min-h-0 w-full shadow-[0_24px_60px_rgba(0,0,0,0.18)]"
            effect="strips"
            direction="bottom"
            duration={0.85}
            label={`${card.name}, ${card.role}`}
            defaultComponent={<PortraitFace card={card} />}
            hoverComponent={<PortraitFace card={card} hover />}
          />
        </div>
      ))}
    </div>
  );
}
