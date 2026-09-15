import { about } from "@/lib/content";
import { Reveal } from "../Reveal";
import s from "../Sections.module.css";
import { CursorDrivenParticleIndiaMap } from "../ui/cursor-driven-particle-india-map";

/**
 * 05 — About. Trust.
 *
 * Prose on the left, particle India map on the right.
 */
export function About() {
  return (
    <section id="act-05" className={`${s.section} ${s.sectionPaper}`} aria-labelledby="about-heading">
      <div className={s.aboutSplit}>
        <div className={s.aboutLeftCol}>
          <div className={s.headingGroup}>
            <div className={`mono ${s.eyebrowPaper}`}>05 / About</div>
            {about.heading ? (
              <Reveal as="h2" id="about-heading" name="nits-in" className={`h2 ${s.aboutHeading}`}>
                {about.heading}
              </Reveal>
            ) : (
              <h2 id="about-heading" className={`mono ${s.headingPlaceholderPaper}`}>
                {about.headingPlaceholder}
              </h2>
            )}
          </div>

          {about.body ? (
            <Reveal as="p" name="nits-fade" className={`bodyLg ${s.aboutBody}`}>
              {about.body}
            </Reveal>
          ) : (
            <p className={`mono ${s.bodyPlaceholderPaper}`}>{about.bodyPlaceholder}</p>
          )}
        </div>

        <div className={s.aboutMapCol}>
          <CursorDrivenParticleIndiaMap
            className={s.aboutMap}
            particleDensity={3}
            particleSize={1}
            dispersionStrength={1}
            returnSpeed={0.08}
            interactionRadius={130}
            seed={42}
          />
        </div>
      </div>
    </section>
  );
}
