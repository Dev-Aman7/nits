import { hero, site } from "@/lib/content";
import { HeroMachine } from "../genesis/HeroMachine";
import s from "../Sections.module.css";

/**
 * 00 — Overview. Full-viewport hero on paper: a mono top rail, the headline
 * block, and a 1px bottom hairline. The only two time-driven entrances on the
 * page live here; everything below the fold is scroll-driven.
 *
 * The Genesis 1.3 instrument is drawn full bleed behind all of it — hairlines
 * only, on the paper ground, fading out as the section leaves.
 */
export function Hero() {
  return (
    <section id="act-00" className={s.hero} aria-labelledby="hero-heading">
      <HeroMachine />

      <div className={`mono ${s.heroRail}`}>
        <span>&ldquo;{site.tagline}&rdquo;</span>
      </div>

      <div className={s.heroBlock}>
        <h1 id="hero-heading" className={`display ${s.heroHeadline}`}>
          {hero.headline}
        </h1>
        <div className={s.heroAside}>
          <div className={`mono ${s.heroCue}`}>{hero.cue}</div>
        </div>
      </div>

      <div className={s.heroRule} aria-hidden="true" />
    </section>
  );
}
