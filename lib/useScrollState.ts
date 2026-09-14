"use client";

import { useEffect, useState } from "react";
import { darkSectionIds, scale } from "./content";

/** The scroll line the navbar tests its ground against. */
const NAV_LINE = 70;

/** Bucket boundaries for the depth readout, from the v3 logic class. */
const DEPTH_BUCKETS = [0.34, 0.67] as const;

export type ScrollState = {
  /** 0–1 page scroll progress, written to the progress bar as a percentage. */
  progress: number;
  /** The exponent shown in the Scale section's `10⁻ⁿ m` readout. */
  depthExponent: string;
  /** True while an ink-ground section owns the nav scroll line. */
  navOnDark: boolean;
};

const INITIAL: ScrollState = {
  progress: 0,
  depthExponent: scale.steps[0].exponent,
  navOnDark: false,
};

function readDepthExponent(): string {
  const el = document.getElementById("act-02");
  if (!el) return scale.steps[0].exponent;

  const rect = el.getBoundingClientRect();
  const travel = Math.max(1, rect.height - window.innerHeight);
  const t = Math.min(1, Math.max(0, -rect.top / travel));

  if (t < DEPTH_BUCKETS[0]) return scale.steps[0].exponent;
  if (t < DEPTH_BUCKETS[1]) return scale.steps[1].exponent;
  return scale.steps[2].exponent;
}

function readNavOnDark(): boolean {
  return darkSectionIds.some((id) => {
    const el = document.getElementById(id);
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return rect.top <= NAV_LINE && rect.bottom > NAV_LINE;
  });
}

/**
 * One rAF-throttled passive scroll listener feeding all three scroll-derived
 * values — matching the single listener in the v3 logic class rather than
 * attaching one per consumer.
 */
export function useScrollState(): ScrollState {
  const [state, setState] = useState<ScrollState>(INITIAL);

  useEffect(() => {
    let frame: number | null = null;

    const measure = () => {
      frame = null;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;

      const next: ScrollState = {
        progress: max > 0 ? window.scrollY / max : 0,
        depthExponent: readDepthExponent(),
        navOnDark: readNavOnDark(),
      };

      setState((prev) =>
        prev.progress === next.progress &&
        prev.depthExponent === next.depthExponent &&
        prev.navOnDark === next.navOnDark
          ? prev
          : next,
      );
    };

    const onScroll = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(measure);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    measure();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return state;
}
