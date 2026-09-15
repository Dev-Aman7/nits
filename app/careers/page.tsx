import type { Metadata } from "next";
import { CareersHero } from "@/components/careers/CareersHero";
import { CareersOpenings } from "@/components/careers/CareersOpenings";
import s from "@/components/careers/Careers.module.css";
import { Chrome } from "@/components/Chrome";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { careers, jobs } from "@/lib/careers";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Careers",
  description: careers.lede,
  openGraph: {
    title: `Careers — ${site.name}`,
    description: careers.lede,
    url: "/careers",
  },
};

/**
 * Careers — paper page with a hairline list of openings and a detail panel.
 * Apply opens the hardcoded Google Form (see lib/careers.ts). Closes with
 * the same indigo Contact block as home, then the footer.
 */
export default function CareersPage() {
  return (
    <>
      <a href="#careers-main" className="skipLink">
        Skip to content
      </a>

      <Chrome />

      <main id="careers-main" className={s.page}>
        <CareersHero />
        {jobs.length > 0 ? (
          <CareersOpenings />
        ) : (
          <p className={`mono ${s.openings}`}>{careers.emptyLabel}</p>
        )}
        <Contact />
      </main>

      <Footer />
    </>
  );
}
