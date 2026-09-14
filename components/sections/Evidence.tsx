import Image from "next/image";
import { STAGGER, STAGGER_DELAY, evidence } from "@/lib/content";
import { GenesisFigure } from "../genesis/GenesisFigure";
import { Reveal } from "../Reveal";
import s from "../Sections.module.css";

/**
 * 03 — Evidence. Product proof: the Genesis logo in `screen` blend, the
 * claim, its explanation, a 2.1:1 figure and a 4-up hairline spec grid.
 *
 * The figure slot holds the instrument drawing — a live general-arrangement
 * view, drag to orbit. A real photograph still wins: set `evidence.figure.src`
 * and the photo takes the slot back.
 */
export function Evidence() {
  const { figure } = evidence;

  return (
    <section
      id="act-03"
      className={`${s.section} ${s.sectionInk}`}
      aria-labelledby="evidence-heading"
    >
      <div className={s.blocks}>
        <div className={`mono ${s.eyebrowInk}`}>03 / Evidence</div>

        <div className={s.evidenceHeadBlock}>
          <Reveal name="nits-in" range="entry 5% cover 26%">
            <Image
              src={evidence.logo.src}
              alt={evidence.logo.alt}
              width={1417}
              height={763}
              className={s.evidenceLogo}
            />
          </Reveal>

          <Reveal
            as="h2"
            id="evidence-heading"
            name="nits-in"
            range="entry 10% cover 28%"
            className={`h2 ${s.heading}`}
          >
            {evidence.heading}
          </Reveal>

          <Reveal
            as="p"
            name="nits-fade"
            range="entry 20% cover 34%"
            className={`bodyLg ${s.evidenceLede}`}
          >
            {evidence.lede}
          </Reveal>
        </div>

        <div className={s.evidenceFigureBlock}>
          <Reveal
            as="figure"
            name="nits-zoom"
            range="entry 8% cover 32%"
            className={s.figure}
            style={{ margin: 0 }}
          >
            {figure.src ? (
              <Image src={figure.src} alt={evidence.heading} fill className={s.figureImage} />
            ) : (
              <>
                <div className={`mono ${s.figurePlaceholder}`}>
                  <div className={s.figureRing} aria-hidden="true" />
                  <figcaption>
                    {figure.placeholder}
                    <br />
                    <span className={s.figureSub}>{figure.placeholderSub}</span>
                  </figcaption>
                </div>
                <GenesisFigure />
              </>
            )}
            <div className={`mono ${s.figureTag}`}>{figure.tag}</div>
            <div className={`mono ${s.figureStatus}`}>{figure.status}</div>
          </Reveal>

          <div
            className="cardGrid"
            style={
              {
                "--grid-line": "var(--border-ink-strong)",
                "--grid-face": "var(--ink)",
              } as React.CSSProperties
            }
          >
            {evidence.specs.map((spec, i) => (
              <Reveal
                key={spec.eyebrow}
                name="nits-in-sm"
                range={STAGGER[i]}
                delay={STAGGER_DELAY[i]}
                className={`card ${s.specCard}`}
              >
                <div className={`mono ${s.specEyebrow}`}>{spec.eyebrow}</div>
                <div className="bodySm">{spec.body}</div>
              </Reveal>
            ))}
          </div>

          <p className={`mono ${s.note}`}>{evidence.note}</p>
        </div>
      </div>
    </section>
  );
}
