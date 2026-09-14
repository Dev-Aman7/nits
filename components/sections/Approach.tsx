import { approach } from "@/lib/content";
import { Reveal } from "../Reveal";
import s from "../Sections.module.css";

/**
 * 01 — Approach. The page's first inversion to ink and its widest measure.
 * A 48px dot field drifts ±64px against the scroll behind the thesis.
 */
export function Approach() {
  return (
    <section id="act-01" className={`${s.section} ${s.approach}`} aria-labelledby="approach-heading">
      <Reveal
        name="nits-par"
        range="cover 0% cover 100%"
        parallax
        className={s.dotField}
        aria-hidden="true"
      />

      <div className={`${s.blocks} ${s.approachInner}`}>
        <div className={`mono ${s.eyebrowInk}`}>01 / Approach</div>

        <Reveal
          as="h2"
          id="approach-heading"
          name="nits-rise"
          range="entry 15% cover 30%"
          className={`h2lg ${s.thesis}`}
        >
          {approach.thesis}
        </Reveal>

        <Reveal name="nits-fade" range="entry 35% cover 45%" className={s.approachColumns}>
          {approach.columns.map((copy) => (
            <p key={copy.slice(0, 24)} className="body">
              {copy}
            </p>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
