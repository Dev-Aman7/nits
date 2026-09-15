"use client";

import { careers, getJobById, jobs } from "@/lib/careers";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import { useEffect, useMemo, useState } from "react";
import s from "./Careers.module.css";
import { JobDetail } from "./JobDetail";
import { JobList } from "./JobList";

function matchesQuery(job: (typeof jobs)[number], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const hay = [job.title, job.team, job.location, job.type, job.summary]
    .join(" ")
    .toLowerCase();
  return hay.includes(q);
}

/**
 * Left: searchable job list. Right: selected role brief.
 * Search is ready for a longer openings list later.
 */
export function CareersOpenings() {
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(jobs[0]!.id);

  const filtered = useMemo(
    () => jobs.filter((job) => matchesQuery(job, query)),
    [query],
  );

  /* Keep selection inside the filtered set when search changes. */
  useEffect(() => {
    if (filtered.length === 0) return;
    if (!filtered.some((job) => job.id === selectedId)) {
      setSelectedId(filtered[0]!.id);
    }
  }, [filtered, selectedId]);

  const selected =
    filtered.length === 0
      ? null
      : (getJobById(selectedId) ?? filtered[0] ?? null);

  return (
    <section id="openings" className={s.openings} aria-label="Open roles">
      <motion.div
        className={s.split}
        initial={reduce ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={
          reduce ? { duration: 0 } : { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
        }
      >
        <aside className={s.listPane}>
          <div className={s.listHead}>
            <div className={`mono ${s.listLabel}`}>
              {careers.openingsLabel}
              <span className={s.listCount}>
                {" "}
                · {String(filtered.length).padStart(2, "0")}
              </span>
            </div>

            <label className={s.search}>
              <span className="sr-only">{careers.searchPlaceholder}</span>
              <input
                type="search"
                className={s.searchInput}
                placeholder={careers.searchPlaceholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
              />
            </label>
          </div>

          {filtered.length > 0 ? (
            <JobList
              jobs={filtered}
              selectedId={selected?.id ?? null}
              onSelect={setSelectedId}
            />
          ) : (
            <p className={`mono ${s.noResults}`}>{careers.noResultsLabel}</p>
          )}
        </aside>

        <div className={s.detailPane}>
          <AnimatePresence mode="wait">
            {selected ? (
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
            ) : (
              <motion.p
                key="empty"
                className={`mono ${s.noResults}`}
                initial={false}
                animate={{ opacity: 1 }}
              >
                {careers.noResultsLabel}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
