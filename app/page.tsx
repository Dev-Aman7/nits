import { Chrome } from "@/components/Chrome";
import { GenesisField } from "@/components/genesis/GenesisField";
import { About } from "@/components/sections/About";
import { Approach } from "@/components/sections/Approach";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Instruments } from "@/components/sections/Instruments";
import { Partners } from "@/components/sections/Partners";
import { Scale } from "@/components/sections/Scale";
import { site } from "@/lib/content";

/**
 * Narrative shape: paper → ink (three sections) → paper → indigo.
 * The ink block is the argument; the paper sections frame it; indigo closes.
 *
 * Access folded into Instruments — the democratising claim and the four
 * machines are one beat, not two. 03 Evidence is gone before that: its deep
 * dive on Genesis 1.3 is not in the story any more.
 */
export default function Home() {
  return (
    <>
      <a href="#act-00" className="skipLink">
        Skip to content
      </a>

      <Chrome />

      {/* One cell field behind Approach and Scale — see components/genesis. */}
      <GenesisField />

      <main>
        <Hero />
        <Approach />
        <Scale />
        <Instruments />
        <About />
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
