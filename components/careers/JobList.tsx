import type { Job } from "@/lib/careers";
import s from "./Careers.module.css";

type JobListProps = {
  jobs: readonly Job[];
  selectedId: string;
  onSelect: (id: string) => void;
};

/**
 * Hairline job rows. Selection is a button with aria-selected so keyboard
 * and screen readers stay in sync with the detail panel.
 */
export function JobList({ jobs, selectedId, onSelect }: JobListProps) {
  return (
    <ul className={s.list} role="listbox" aria-label="Open roles">
      {jobs.map((job) => {
        const selected = job.id === selectedId;
        return (
          <li key={job.id} className={s.listItem} role="presentation">
            <button
              type="button"
              role="option"
              aria-selected={selected}
              className={s.listButton}
              onClick={() => onSelect(job.id)}
            >
              <span className={`mono ${s.listMeta}`}>
                <span className={s.listTeam}>{job.team}</span>
                <span>{job.location}</span>
                <span>{job.type}</span>
              </span>
              <span className={s.listTitle}>{job.title}</span>
              <span className={s.listSummary}>{job.summary}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
