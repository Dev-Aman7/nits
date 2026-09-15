import { about } from "@/lib/content";
import { Reveal } from "../Reveal";
import s from "../Sections.module.css";

/**
 * 05 — About. Trust.
 *
 * Prose on the left, a hairline metadata column on the right — mono keys,
 * mono values right-aligned, which is the only right-alignment the design
 * allows (rule 15). Nothing in the column is invented; it restates what the
 * page and the registered address already establish.
 */
export function About() {
  return (
    <section id="act-05" className={`${s.section} ${s.sectionPaper}`} aria-labelledby="about-heading">
      <div className={s.blocks}>
        <div className={s.headingGroup}>
          <div className={`mono ${s.eyebrowPaper}`}>05 / About</div>
          {about.heading ? (
            <Reveal as="h2" id="about-heading" name="nits-in" className={`h2 ${s.heading}`}>
              {about.heading}
            </Reveal>
          ) : (
            <h2 id="about-heading" className={`mono ${s.headingPlaceholderPaper}`}>
              {about.headingPlaceholder}
            </h2>
          )}
        </div>

        <div className={s.aboutGrid}>
          {about.body ? (
            <Reveal as="p" name="nits-fade" className={`bodyLg ${s.aboutBody}`}>
              {about.body}
            </Reveal>
          ) : (
            <p className={`mono ${s.bodyPlaceholderPaper}`}>{about.bodyPlaceholder}</p>
          )}

          <dl className={s.aboutFacts}>
            {about.facts.map((fact) => (
              <div key={fact.key} className={`mono ${s.aboutFactRow}`}>
                <dt className={s.aboutFactKey}>{fact.key}</dt>
                <dd className={s.aboutFactValue}>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
