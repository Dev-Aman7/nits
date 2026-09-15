import { STAGGER, STAGGER_DELAY, partners } from "@/lib/content";
import { Reveal } from "../Reveal";
import s from "../Sections.module.css";

/**
 * 06 — Partners. The real institution list, typeset.
 *
 * Three groups, each a mono label against a ruled list: name in display type,
 * location right-aligned in mono. A logo wall was the alternative, but the
 * logos are not in the repo and a grid of empty slots reads as unfinished —
 * and a name set in the page's own face reads as a credential, where a logo
 * strip reads as decoration. When logos arrive they sit beside the names
 * without changing the construction.
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
            <Reveal
              key={group.label}
              name="nits-in-sm"
              range={STAGGER[i]}
              delay={STAGGER_DELAY[i]}
              className={s.partnerGroup}
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
          ))}
        </div>
      </div>
    </section>
  );
}
