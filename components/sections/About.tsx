import { about } from "@/lib/content";
import { Reveal } from "../Reveal";
import s from "../Sections.module.css";
import { CursorDrivenParticleIndiaMap } from "../ui/cursor-driven-particle-india-map";

/**
 * 05 — About. Trust.
 *
 * Prose on the left, particle India map on the right.
 * Map particles gather from a scatter field as the section scrolls into view.
 */
export function About() {
  return (
    <section id="act-05" className={`${s.section} ${s.sectionPaper}`} aria-labelledby="about-heading">
      <div className={s.aboutSplit}>
        <div className={s.aboutLeftCol}>
          <div className={s.headingGroup}>
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
            assembleOnScroll
            particleDensity={3}
            particleSize={1}
            dispersionStrength={1}
            returnSpeed={0.028}
            friction={0.9}
            interactionRadius={130}
            seed={4}
          />
        </div>
      </div>
    </section>
  );
}
