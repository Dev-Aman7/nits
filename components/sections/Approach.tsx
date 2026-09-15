import { approach } from "@/lib/content";
import s from "../Sections.module.css";

/**
 * 01 — Approach. The page's first inversion to ink.
 *
 * The thesis states the claim; the cell field behind it argues the claim —
 * a vat of cell-laden hydrogel through exposure, crosslink, stacking and
 * self-assembly to a perfused construct. The section runs several viewports
 * so the field has room to arrive, settle and compact. The field itself is
 * GenesisField, mounted once at the page level — it spans this section and
 * Scale as one continuous illustration rather than one canvas each.
 *
 * Note: the thesis is NOT wrapped in <Reveal>. It sits in a sticky block, and
 * a `view()` scroll timeline never resolves there — the element's own view
 * progress barely changes, so the reveal freezes part-way and the heading
 * renders permanently half-transparent.
 */
export function Approach() {
  return (
    <section id="act-01" className={s.approach} aria-labelledby="approach-heading">
      <div className={s.approachStage}>
        <div className={`mono ${s.eyebrowInk}`}>01 / Approach</div>

        <h2 id="approach-heading" className={`h2lg ${s.thesis}`}>
          {approach.thesis}
        </h2>
      </div>
    </section>
  );
}
