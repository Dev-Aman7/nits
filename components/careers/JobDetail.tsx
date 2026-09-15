import { careers, type Job } from "@/lib/careers";
import s from "./Careers.module.css";

type JobDetailProps = {
  job: Job;
};

/**
 * Typeset role brief — about spans full width; lists sit in a hairline grid.
 */
export function JobDetail({ job }: JobDetailProps) {
  return (
    <article className={s.detail} aria-labelledby={`job-title-${job.id}`}>
      <header className={s.detailHead}>
        <div className={`mono ${s.detailMeta}`}>
          <span className={s.detailMetaAccent}>{job.team}</span>
          <span>{job.location}</span>
          <span>{job.type}</span>
          <span>Posted {job.posted}</span>
        </div>
        <h2 id={`job-title-${job.id}`} className={s.detailTitle}>
          {job.title}
        </h2>
        <p className={s.detailSummary}>{job.summary}</p>
      </header>

      <div className={s.detailGrid}>
        <section className={`${s.detailBlock} ${s.detailBlockWide}`}>
          <h3 className={`mono ${s.detailBlockLabel}`}>{careers.sections.about}</h3>
          <p className={s.detailBody}>{job.about}</p>
        </section>

        <section className={s.detailBlock}>
          <h3 className={`mono ${s.detailBlockLabel}`}>
            {careers.sections.responsibilities}
          </h3>
          <ul className={s.detailList}>
            {job.responsibilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className={s.detailBlock}>
          <h3 className={`mono ${s.detailBlockLabel}`}>
            {careers.sections.requirements}
          </h3>
          <ul className={s.detailList}>
            {job.requirements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className={`${s.detailBlock} ${s.detailBlockWide}`}>
          <h3 className={`mono ${s.detailBlockLabel}`}>
            {careers.sections.niceToHave}
          </h3>
          <ul className={s.detailList}>
            {job.niceToHave.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>

      <div className={s.detailActions}>
        <a
          className="btn btnPrimary"
          href={job.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {careers.applyLabel}
          <span className="dot" aria-hidden="true" />
        </a>
        <p className={`mono ${s.detailApplyNote}`}>{careers.applyNote}</p>
      </div>
    </article>
  );
}
