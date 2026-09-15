"use client";

import { scale } from "@/lib/content";
import { useScrollState } from "@/lib/useScrollState";
import { Reveal } from "../Reveal";
import s from "../Sections.module.css";

/**
 * 02 — Scale. A sticky rail carries the section number, heading and a live
 * `10⁻ⁿ m` depth readout whose exponent is bucketed from this section's own
 * scroll progress; the right column is three full-height steps.
 *
 * The field behind the steps ascends with them — the spheroid Approach ended
 * on, then printed layers, then the vascularised construct. It is drawn by
 * GenesisField, mounted once at the page level, so the spheroids carry across
 * the section boundary without a handoff.
 */
export function Scale() {
  const { depthExponent } = useScrollState();

  return (
    <section id="act-02" className={s.scale} aria-labelledby="scale-heading">
      <div className={s.scaleSplit}>
        <div className={s.scaleRailCol}>
          <div className={s.scaleRail}>
            {scale.heading ? (
              <h2 id="scale-heading" className="h2">
                {scale.heading}
              </h2>
            ) : (
              <h2 id="scale-heading" className={`mono ${s.headingPlaceholder}`}>
                {scale.headingPlaceholder}
              </h2>
            )}

            <div className={s.scaleReadout}>
              <div className={`mono ${s.scaleReadoutLabel}`}>{scale.readoutLabel}</div>
              <p
                className={s.scaleNumber}
                aria-label={`Current depth: 10 to the power ${depthExponent} metres`}
              >
                <span aria-hidden="true">10</span>
                <span className={s.scaleExponent} aria-hidden="true">
                  {depthExponent}
                </span>
                <span className={s.scaleUnit} aria-hidden="true">
                  m
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className={s.scaleSteps}>
          {scale.steps.map((step) => (
            <Reveal
              key={step.label}
              name="nits-in"
              range="entry 20% cover 40%"
              className={s.scaleStep}
            >
              <div className={`mono ${s.scaleStepLabel}`}>{step.label}</div>
              <p className={`h3 ${s.scaleStepStatement}`}>{step.statement}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
