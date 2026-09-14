import { Chrome } from "@/components/Chrome";
import { Approach } from "@/components/sections/Approach";
import { Contact } from "@/components/sections/Contact";
import { Evidence } from "@/components/sections/Evidence";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Partners } from "@/components/sections/Partners";
import { Products } from "@/components/sections/Products";
import { Scale } from "@/components/sections/Scale";
import { site } from "@/lib/content";

/**
 * Narrative shape: paper → ink (four sections) → paper → indigo.
 * The ink block is the argument; the two paper sections frame it;
 * indigo is the close.
 */
export default function Home() {
  return (
    <>
      <a href="#act-00" className="skipLink">
        Skip to content
      </a>

      <Chrome />

      <main>
        <Hero />
        <Approach />
        <Scale />
        <Evidence />
        <Products />
        <Partners />
        <Contact />
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: site.legalName,
            alternateName: site.name,
            slogan: site.tagline,
            description: site.description,
            email: site.email,
            sameAs: [site.linkedin.href],
            address: {
              "@type": "PostalAddress",
              streetAddress: "A15, 19 University Road, Civil Lines",
              addressLocality: "New Delhi",
              postalCode: "110007",
              addressCountry: "IN",
            },
          }),
        }}
      />
    </>
  );
}
