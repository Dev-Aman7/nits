import { STAGGER, STAGGER_DELAY, partners } from "@/lib/content";
import { Reveal } from "../Reveal";
import s from "../Sections.module.css";

/**
 * 05 — Partners. The second inversion, back to paper, on a #CFCCC4 hairline
 * grid — the same card construction as Evidence with the ramp swapped.
 */
export function Partners() {
  return (
    <section
      id="act-05"
      className={`${s.section} ${s.sectionPaper}`}
      aria-labelledby="partners-heading"
    >
      <div className={s.blocks}>
        <div className={s.headingGroup}>
          <div className={`mono ${s.eyebrowPaper}`}>05 / Partners</div>
          <Reveal
            as="h2"
            id="partners-heading"
            name="nits-in"
            className={`h2 ${s.heading}`}
          >
            {partners.heading}
          </Reveal>
        </div>

        <div
          className="cardGrid"
          style={
            {
              "--grid-line": "var(--border-paper-strong)",
              "--grid-face": "var(--paper)",
            } as React.CSSProperties
          }
        >
          {partners.cards.map((card, i) => (
            <Reveal
              key={card.eyebrow}
              name="nits-in-sm"
              range={STAGGER[i]}
              delay={STAGGER_DELAY[i]}
              className={`card ${s.partnerCard}`}
            >
              <div className={`mono ${s.partnerEyebrow}`}>{card.eyebrow}</div>
              <div className={s.partnerBody}>
                <div className="h4">{card.title}</div>
                <div className={`bodySm ${s.partnerCopy}`}>{card.body}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
