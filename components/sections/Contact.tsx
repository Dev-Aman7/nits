import Image from "next/image";
import { contact, site } from "@/lib/content";
import { Reveal } from "../Reveal";
import s from "../Sections.module.css";

/**
 * Contact — the only saturated ground, and the close of the narrative.
 * Contact is a `mailto:` link, not a form; there are no forms in this design.
 */
export function Contact() {
  return (
    <section id="contact" className={s.contact} aria-labelledby="contact-heading">
      <div className={s.contactGrid}>
        <div className={s.contactLeft}>
          <Image
            src="/assets/nits-logo.png"
            alt={site.name}
            width={72}
            height={72}
            className={s.contactLogo}
          />

          <Reveal as="h2" id="contact-heading" name="nits-in" className="h2lg">
            {contact.heading}
          </Reveal>

          <p className={`bodyLg ${s.contactLede}`}>{contact.lede}</p>

          <a href={`mailto:${site.email}`} className={`btn btnInverted ${s.contactCta}`}>
            {contact.cta}
            <span className="dot dotAccent" aria-hidden="true" />
          </a>
        </div>

        <dl className={s.contactList}>
          <div className={`mono ${s.contactRow}`}>
            <dt className={s.contactKey}>Enquiries</dt>
            <dd style={{ margin: 0 }}>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </dd>
          </div>

          <div className={`mono ${s.contactRow}`}>
            <dt className={s.contactKey}>LinkedIn</dt>
            <dd style={{ margin: 0 }}>
              <a href={site.linkedin.href} target="_blank" rel="noreferrer noopener">
                {site.linkedin.label}
              </a>
            </dd>
          </div>

          <div className={`mono ${s.contactRow}`} style={{ alignItems: "start" }}>
            <dt className={s.contactKey}>Registered office</dt>
            <dd className={s.contactValue} style={{ margin: 0 }}>
              {site.address.map((line, i) => (
                <span key={line}>
                  {line}
                  {i < site.address.length - 1 ? <br /> : null}
                </span>
              ))}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
