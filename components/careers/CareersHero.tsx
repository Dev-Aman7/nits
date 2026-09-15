"use client";

import { careers, jobs } from "@/lib/careers";
import { motion, useReducedMotion } from "motion/react";
import s from "./Careers.module.css";

/**
 * Paper hero: claim + openings count. Rise/fade only — design.md motion.
 */
export function CareersHero() {
  const reduce = useReducedMotion();
  const count = String(jobs.length).padStart(2, "0");

  return (
    <header className={s.hero}>
      <motion.div
        className={s.heroInner}
        initial={reduce ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          reduce ? { duration: 0 } : { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
        }
      >
        <div className={s.heroCopy}>
          <div className={`mono ${s.eyebrow}`}>{careers.eyebrow}</div>
          <h1 className={`h2 ${s.heading}`}>{careers.heading}</h1>
          <p className={`bodyLg ${s.lede}`}>{careers.lede}</p>
        </div>

        <div className={s.count} aria-label={`${jobs.length} open roles`}>
          <span className={`mono ${s.countValue}`}>{count}</span>
          <span className={`mono ${s.countLabel}`}>{careers.openingsLabel}</span>
        </div>
      </motion.div>
    </header>
  );
}
