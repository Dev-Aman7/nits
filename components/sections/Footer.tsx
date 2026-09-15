import { site } from "@/lib/content";
import s from "../Sections.module.css";

/** Mono row on ink: tagline, careers link, copyright. */
export function Footer() {
  return (
    <footer className={`mono ${s.footer}`}>
      <span>&ldquo;{site.tagline}&rdquo;</span>
      <a href="/careers" className={s.footerLink}>
        Careers
      </a>
      <span>
        Copyright {site.legalName} {site.copyrightYear}
      </span>
    </footer>
  );
}
