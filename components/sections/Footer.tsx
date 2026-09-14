import { site } from "@/lib/content";
import s from "../Sections.module.css";

/** A single mono row on ink: tagline left, copyright right. */
export function Footer() {
  return (
    <footer className={`mono ${s.footer}`}>
      <span>&ldquo;{site.tagline}&rdquo;</span>
      <span>
        Copyright {site.legalName} {site.copyrightYear}
      </span>
    </footer>
  );
}
