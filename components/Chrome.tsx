"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";
import { contact, navLinks, site } from "@/lib/content";
import { useScrollState } from "@/lib/useScrollState";
import styles from "./Chrome.module.css";

/**
 * The page's two fixed elements. Both read the same rAF-throttled scroll
 * state, so there is one listener for the whole document.
 */
export function Chrome() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { progress, navOnDark } = useScrollState();
  const [open, setOpen] = useState(false);
  const menuId = useId();

  const close = useCallback(() => setOpen(false), []);

  /* The sheet is a mobile-only affordance — leaving the query should never
     strand it open, and Escape should always shut it. */
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const query = window.matchMedia("(min-width: 901px)");
    const onChange = () => {
      if (query.matches) close();
    };

    window.addEventListener("keydown", onKey);
    query.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("keydown", onKey);
      query.removeEventListener("change", onChange);
    };
  }, [open, close]);

  /* Careers stays on paper; only home inverts the nav over ink sections. */
  const ground = isHome && navOnDark ? "ink" : "paper";

  return (
    <>
      {isHome ? (
        <div className={styles.progress} role="presentation">
          <div
            className={styles.progressFill}
            style={{ width: `${(progress * 100).toFixed(2)}%` }}
          />
        </div>
      ) : null}

      <header className={styles.nav} data-ground={ground}>
        <a href="/" className={styles.wordmark} aria-label={`${site.name} — home`}>
          <Image
            src="/assets/nits-wordmark.png"
            alt={site.name}
            width={72}
            height={32}
            className={styles.wordmarkImg}
            priority
          />
        </a>

        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={styles.toggleBars} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          {open ? "Close" : "Menu"}
        </button>

        <div className={styles.group} id={menuId} data-open={open}>
          <nav className={styles.links} aria-label="Primary">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={styles.link}
                onClick={close}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a
            href="/#contact"
            className={`btn btnPrimary ${styles.cta}`}
            onClick={close}
          >
            {contact.cta}
            <span className="dot" aria-hidden="true" />
          </a>
        </div>
      </header>
    </>
  );
}
