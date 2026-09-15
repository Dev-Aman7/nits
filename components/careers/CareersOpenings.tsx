"use client";

import { getJobById, jobs } from "@/lib/careers";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import { useState } from "react";
import s from "./Careers.module.css";
import { JobDetail } from "./JobDetail";
import { JobList } from "./JobList";

/**
 * List + detail shell. Selection is local state; detail swaps with a short
 * opacity fade only (no slide / scale — design.md restraint).
 */
export function CareersOpenings() {
  const reduce = useReducedMotion();
  const [selectedId, setSelectedId] = useState(jobs[0]!.id);
  const selected = getJobById(selectedId) ?? jobs[0]!;

  return (
    <section className={s.openings} aria-label="Open roles">
      <motion.div
        className={s.openingsSplit}
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={
          reduce ? { duration: 0 } : { duration: 0.65, ease: [0.16, 1, 0.3, 1] }
        }
      >
        <div className={s.listCol}>
          <JobList
            jobs={jobs}
            selectedId={selected.id}
            onSelect={setSelectedId}
          />
        </div>

        <div className={s.detailCol}>
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={
                reduce ? { duration: 0 } : { duration: 0.28, ease: "easeOut" }
              }
            >
              <JobDetail job={selected} />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
