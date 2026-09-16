import { STAGGER_DELAY, partners } from "@/lib/content";
import { Reveal } from "../Reveal";
import s from "../Sections.module.css";

/** Faster cover end than the global quartet — cards finish opaque while still on screen. */
const PARTNER_STAGGER = [
  "entry 0% cover 18%",
  "entry 4% cover 22%",
  "entry 8% cover 26%",
] as const;

/**
 * 06 — Partners. The real institution list, typeset.
 *
 * Three hairline-grid columns (Clinical / Laboratories / Industry). Each face
 * is a mono eyebrow over a ruled name + place list. Paper faces stay opaque;
 * Reveal only lifts the inner content so the #CFCCC4 grid never shows through.
 */
export function Partners() {
  return (
    <section
      id="act-06"
      className={`${s.section} ${s.sectionPaper}`}
      aria-labelledby="partners-heading"
    >
      <div className={s.blocks}>
        <div className={s.headingGroup}>
          <Reveal as="h2" id="partners-heading" name="nits-in" className={`h2 ${s.heading}`}>
            {partners.heading}
          </Reveal>
        </div>

        <div className={s.partnerGroups}>
          {partners.groups.map((group, i) => (
            <div key={group.label} className={s.partnerGroup}>
              <Reveal
                name="nits-lift"
                range={PARTNER_STAGGER[i]}
                delay={STAGGER_DELAY[i]}
                className={s.partnerGroupBody}
              >
                <div className={s.partnerGroupHead}>
                  <span className={`mono ${s.partnerGroupLabel}`}>{group.label}</span>
                  <span className={`mono ${s.partnerGroupCount}`}>
                    {String(group.items.length).padStart(2, "0")}
                  </span>
                </div>

                <ul className={s.partnerList}>
                  {group.items.map((item) => (
                    <li key={item.name} className={s.partnerRow}>
                      <span className={s.partnerName}>{item.name}</span>
                      {item.place ? (
                        <span className={`mono ${s.partnerPlace}`}>{item.place}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
