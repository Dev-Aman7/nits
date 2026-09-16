"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

export type RevealName =
  | "nits-rise"
  | "nits-fade"
  | "nits-in"
  | "nits-in-sm"
  | "nits-lift"
  | "nits-zoom"
  | "nits-par";

type RevealProps = {
  /** Which keyframe set to play. */
  name: RevealName;
  /** Scroll range for the native `animation-timeline: view()` path. */
  range?: string;
  /** Delay used only by the IntersectionObserver fallback, to reproduce the stagger. */
  delay?: string;
  /** Scroll-linked rather than an entrance — the parallax dot field. */
  parallax?: boolean;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
} & Record<string, unknown>;

/**
 * One primitive behind every below-fold reveal.
 *
 * Chromium runs the original construction — the keyframes scrub against
 * `animation-timeline: view()` over the given range. Everywhere else the
 * element is held paused at the keyframe start and released, once, when
 * IntersectionObserver reports it in view. Both paths finish identically, and
 * the paused state is scoped to `html.js` so a no-JS render stays visible.
 */
export function Reveal({
  name,
  range = "entry 10% cover 34%",
  delay,
  parallax = false,
  as: Tag = "div",
  className,
  style,
  children,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Chromium drives this from the scroll timeline; no observer needed.
    if (CSS.supports("animation-timeline", "view()")) return;
    if (parallax) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-in-view", "true");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [parallax]);

  return (
    <Tag
      ref={ref}
      className={className}
      data-reveal=""
      data-parallax={parallax ? "true" : undefined}
      style={
        {
          ...style,
          "--reveal-name": name,
          "--reveal-range": range,
          ...(delay ? { "--reveal-delay": delay } : {}),
        } as CSSProperties
      }
      {...rest}
    >
      {children}
    </Tag>
  );
}
