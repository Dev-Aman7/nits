import Image from "next/image";
import { STAGGER, STAGGER_DELAY, instruments } from "@/lib/content";
import { Reveal } from "../Reveal";
import s from "../Sections.module.css";

/**
 * 03/04 — Instruments. Access's claim and Instruments' apparatus, merged.
 *
 * Built as the same rail-and-steps construction as Scale: the heading and
 * body hold sticky in a left rail, and the four instruments arrive one at a
 * time in the scrolling column beside it, each its own card, each triggered
 * by its own scroll position rather than all animating in as one wave.
 *
 * Two treatments carry the card, both drawn from the subject rather than from
 * a motion library:
 *
 *   Axonometric extrusion — the card is a shallow box in hairlines, parallel
 *   projection rather than perspective, which is the convention the machine
 *   drawing in the hero already uses. Nothing is a 3D transform, so the type
 *   stays crisp.
 *
 *   Exposure sweep — a light plane crosses the face and the content resolves
 *   behind it, which is what a digital-light engine does to cure a layer.
 */
export function Instruments() {
  return (
    <section
      id="act-04"
      className={`${s.section} ${s.sectionInk}`}
      aria-labelledby="instruments-heading"
    >
      <div className={s.instrumentsSplit}>
        <div className={s.instrumentsRailCol}>
          <div className={s.instrumentsRail}>
            {instruments.heading ? (
              <h2 id="instruments-heading" className="h2">
                {instruments.heading}
              </h2>
            ) : (
              <h2 id="instruments-heading" className={`mono ${s.headingPlaceholder}`}>
                {instruments.headingPlaceholder}
              </h2>
            )}

            {instruments.body ? (
              <p className={`body ${s.instrumentsRailBody}`}>{instruments.body}</p>
            ) : (
              <p className={`mono ${s.bodyPlaceholder}`}>{instruments.bodyPlaceholder}</p>
            )}
          </div>
        </div>

        <div className={s.instrumentsCards}>
          {/* The section opens on the claim alone — no card competing with it
              for the first read. The first instrument only arrives once the
              reader has committed to scrolling past it. */}
          <div className={s.instrumentsIntro} aria-hidden="true" />

          {instruments.rows.map((row, i) => (
            <div key={row.key} className={s.instrumentCardStep}>
              <Reveal
                name="nits-in"
                range={STAGGER[i]}
                delay={STAGGER_DELAY[i]}
                className={s.instrumentCardBox}
              >
                {/* The axonometric extrusion: a back face offset by a constant
                    vector and the four edges joining it to the front. Because
                    the offset is constant, every connector is the same length
                    at the same angle whatever the card's size — so there is
                    nothing to measure and no JavaScript. The front face is
                    opaque and paints above this layer, which removes the
                    hidden lines for free. */}
                <span className={s.cardExtrude} aria-hidden="true">
                  <span className={s.cardBack} />
                  <span className={`${s.cardEdge} ${s.cardEdgeTL}`} />
                  <span className={`${s.cardEdge} ${s.cardEdgeTR}`} />
                  <span className={`${s.cardEdge} ${s.cardEdgeBR}`} />
                  <span className={`${s.cardEdge} ${s.cardEdgeBL}`} />
                </span>

                <article className={s.instrumentCard}>
                  {/* The exposure sweep — a light plane crossing the face, the
                      way a DLP engine cures a layer. */}
                  <span className={s.cardSweepLine} aria-hidden="true" />

                  <div className={s.instrumentCardBody}>
                    <div className={s.instrumentCardFigure}>
                      <Image
                        src={row.logo}
                        alt={row.name}
                        width={208}
                        height={88}
                        className={s.instrumentLogo}
                      />
                    </div>

                    <div className={`mono ${s.instrumentIndex}`}>{row.index}</div>
                    <h3 className={`h3 ${s.instrumentName}`}>{row.name}</h3>
                    <div className={`mono ${s.instrumentDescriptor}`}>{row.descriptor}</div>
                    <p className={`body ${s.instrumentCapability}`}>{row.capability}</p>
                  </div>
                </article>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
