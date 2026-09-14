/**
 * All page copy in one place. Content is data, the components are layout —
 * so a wording change never means touching markup.
 *
 * Items marked `placeholder` follow design.md rule 22: unconfirmed content is
 * labelled in mono rather than filled with invented data.
 */

export const site = {
  name: "NITS Engineering",
  legalName: "NITS Engineering Pvt. Ltd.",
  tagline: "Building A Healthier Tomorrow",
  description:
    "NITS Engineering is a bio-medical research company building a healthier tomorrow. We build the instruments that let researchers attempt what the field has written off as out of reach.",
  email: "hello@nitsengineering.com",
  linkedin: {
    label: "nits-engineering",
    href: "https://www.linkedin.com/company/nits-engineering/",
  },
  /* Punctuation lives in the data — each entry is one rendered line, verbatim. */
  address: [
    "NITS Engineering Pvt Ltd.",
    "A15, 19 University Road,",
    "Civil Lines, 110007, New Delhi, India",
  ],
  copyrightYear: 2026,
} as const;

export const navLinks = [
  { label: "Approach", href: "#act-01" },
  { label: "Scale", href: "#act-02" },
  { label: "Genesis 1.3", href: "#act-03" },
  { label: "Products", href: "#act-04" },
  { label: "Partners", href: "#act-05" },
] as const;

/** Sections whose ground is ink — the navbar inverts while any of these owns the scroll line. */
export const darkSectionIds = ["act-01", "act-02", "act-03", "act-04"] as const;

export const hero = {
  headline: "Thinking and building the impossible.",
  /**
   * No longer rendered — the hero headline now stands alone over the Genesis
   * drawing. Kept because `site.description` still carries it into metadata
   * and the JSON-LD, and to make restoring the lede a one-line change.
   */
  lede: site.description,
  cue: "Scroll to descend ↓",
} as const;

export const approach = {
  thesis: "Living tissue is not something you wait for. It is something you can build.",
  columns: [
    "For a century, biology set the pace of medicine. Tissue had to be donated, cultured, or approximated — and every question a researcher could ask was shaped by what happened to be available.",
    "We think that constraint is an engineering problem. If a cell can be positioned, held, fed and observed, then tissue becomes a thing you specify rather than a thing you find.",
    "That belief is the whole company. The instruments are how we argue it — each one built to make a previously impossible experiment ordinary.",
  ],
} as const;

export const scale = {
  heading: "Down to the scale where medicine is decided.",
  readoutLabel: "Current depth",
  steps: [
    {
      label: "10⁻¹ m — the body",
      statement:
        "Where the problem is stated: an organ that fails, a drug that has to be trusted, a wound that will not close.",
      exponent: "−1",
    },
    {
      label: "10⁻³ m — the tissue",
      statement:
        "Where structure starts to matter. Function here comes from arrangement — which cells, next to which, in what geometry.",
      exponent: "−3",
    },
    {
      label: "10⁻⁵ m — the cell",
      statement:
        "Where we work. Place a living cell deliberately, keep it alive, and the tissue above it becomes designable.",
      exponent: "−5",
    },
  ],
} as const;

export const evidence = {
  logo: { src: "/assets/logo-genesis.png", alt: "Genesis 1.3" },
  heading: "Digital Light 3D Bioprinter",
  lede: "Light does the building. A projected image cures a whole layer of cell-laden resin at once, so a construct forms in the time an extrusion nozzle would still be tracing its first path — and the cells inside it stay alive.",
  figure: {
    tag: "Fig. 01 / Genesis 1.3",
    status: "Built",
    placeholder: "Image placeholder — Genesis 1.3, full bleed",
    placeholderSub: "2400 × 1240 recommended",
    /** Drop a real file in /public/assets and set this to swap the placeholder out. */
    src: null as string | null,
  },
  specs: [
    { eyebrow: "Projection", body: "A full layer is cured in one exposure — no nozzle, no shear on the cells." },
    {
      eyebrow: "Resolution",
      body: "Geometry defined in software, down to the scale where tissue architecture begins.",
    },
    { eyebrow: "Environment", body: "Sterile, temperature-held chamber across the whole build." },
    { eyebrow: "Verification", body: "Post-print imaging and a viability readout for every construct." },
  ],
  note: "Specification placeholders — send the real figures and I'll set them",
} as const;

export type ProductStatus = "built" | "tbc" | "soon";

export const products = {
  eyebrow: "04 / Programme",
  heading: "Genesis is one instrument in a four-part programme.",
  count: "Programme / four products",
  note: "Two statuses are placeholders — confirm and I'll set them",
  rows: [
    {
      index: "P—01",
      logo: "/assets/row-squyd.png",
      name: "SQUYD™",
      descriptor: "Where Engineering Creates Living System",
      description: "The platform the programme is built on.",
      status: "tbc" as ProductStatus,
      statusLabel: "Status TBC",
    },
    {
      index: "P—02",
      logo: "/assets/row-kraken.png",
      name: "KRAKEN",
      descriptor: "The Worlds First High-Throughput System",
      description: "3D bioprinting at the volume a real screening campaign consumes.",
      status: "tbc" as ProductStatus,
      statusLabel: "Status TBC",
    },
    {
      index: "P—03",
      logo: "/assets/row-genesis.png",
      name: "GENESIS 1.3",
      descriptor: "Digital Light 3D Bioprinter",
      description: "Let there be light. A full layer cured in one exposure.",
      status: "built" as ProductStatus,
      statusLabel: "Built",
    },
    {
      index: "P—04",
      logo: "/assets/row-morula.png",
      name: "MORULA™",
      descriptor: "Engineered microtissues. Advancing human health.",
      description: "Human physiologically relevant <em>in vitro</em> screening models.",
      status: "soon" as ProductStatus,
      statusLabel: "Coming soon",
    },
  ],
} as const;

export const partners = {
  heading: "We look for people whose experiment does not fit the catalogue.",
  cards: [
    {
      eyebrow: "Labs",
      title: "Research groups",
      body: "Print the construct the protocol calls for instead of the one that happens to exist.",
    },
    {
      eyebrow: "Clinical",
      title: "Hospitals & diagnostics",
      body: "Tissue models for testing, training and diagnostic development.",
    },
    {
      eyebrow: "Industry",
      title: "Pharma & biotech R&D",
      body: "Screen against human tissue earlier, with material you specified.",
    },
    {
      eyebrow: "Capital",
      title: "Investors",
      body: "A hardware company in a field that has stopped being willing to wait.",
    },
  ],
} as const;

export const contact = {
  heading: "Tell us what you have been told cannot be built.",
  lede: "We work directly with the people running the experiment. Send the construct, the constraint, or the question — whichever you have.",
  cta: "Request access",
} as const;

/**
 * The stagger quartet from design.md: each member of a set of four starts 7%
 * of scroll range later than the last, with `cover` end tracking alongside.
 */
export const STAGGER = [
  "entry 8% cover 34%",
  "entry 15% cover 41%",
  "entry 22% cover 48%",
  "entry 29% cover 55%",
] as const;

/** Matching time-based delays for the IntersectionObserver fallback path. */
export const STAGGER_DELAY = ["0ms", "90ms", "180ms", "270ms"] as const;
