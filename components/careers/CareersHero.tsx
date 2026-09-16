"use client";

import { careers, jobs } from "@/lib/careers";
import { motion, useReducedMotion } from "motion/react";
import s from "./Careers.module.css";

/**
 * Full-bleed paper hero — Overview rhythm: mono rail, claim, hairline.
 */
export function CareersHero() {
  const reduce = useReducedMotion();
  const count = String(jobs.length).padStart(2, "0");

  return (
    <header className={s.hero}>
      <motion.div
        className={s.heroRail}
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          reduce ? { duration: 0 } : { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
        }
      >
        <div className={`mono ${s.eyebrow}`}>{careers.eyebrow}</div>
        <div className={`mono ${s.heroCount}`} aria-label={`${jobs.length} open roles`}>
          <span className={s.heroCountNum}>{count}</span> {careers.openingsLabel}
        </div>
      </motion.div>

      <motion.div
        className={s.heroBlock}
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          reduce
            ? { duration: 0 }
            : { duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }
        }
      >
        <div className={s.heroCopy}>
          <h1 className={`h2lg ${s.heading}`}>{careers.heading}</h1>
          <p className={`bodyLg ${s.lede}`}>{careers.lede}</p>
        </div>
      </motion.div>

      <div className={s.heroRule} aria-hidden="true" />
    </header>
  );
}
