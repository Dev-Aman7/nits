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
  { label: "Instruments", href: "#act-04" },
  { label: "About", href: "#act-05" },
  { label: "Partners", href: "#act-06" },
] as const;

/** Sections whose ground is ink — the navbar inverts while any of these owns the scroll line. */
export const darkSectionIds = ["act-01", "act-02", "act-04"] as const;

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
} as const;

export const scale = {
  /**
   * The section now ASCENDS — spheroid → printed layers → vascularised
   * construct — picking up the object Approach ended on. The v3 heading
   * ("Down to the scale where medicine is decided") described a descent and
   * contradicts what the eye sees, so it is held as a labelled placeholder
   * until the replacement arrives. Design rule 22.
   */
  heading: "From the cell up to the thing that has to work." as string | null,
  headingPlaceholder: "Heading placeholder — section now ascends",
  readoutLabel: "Current depth",
  /**
   * Scale values are what is actually on screen, not the v3 values: a
   * spheroid is ~100 µm (10⁻⁴ m), not 10⁻⁵. The three statements are the
   * originals, reordered — they read as a build from the work to what it is
   * for.
   */
  steps: [
    {
      label: "10⁻⁴ m — the cell",
      statement:
        "Where we work. Place a living cell deliberately, keep it alive, and the tissue above it becomes designable.",
      exponent: "−4",
    },
    {
      label: "10⁻³ m — the tissue",
      statement:
        "Where structure starts to matter. Function here comes from arrangement — which cells, next to which, in what geometry.",
      exponent: "−3",
    },
    {
      label: "10⁻² m — the construct",
      statement:
        "Where the problem is stated: an organ that fails, a drug that has to be trusted, a wound that will not close.",
      exponent: "−2",
    },
  ],
} as const;

export type ProductStatus = "built" | "tbc" | "soon";

export type InstrumentKey = "squyd" | "kraken" | "genesis" | "morula";

/**
 * 03/04 — Instruments. Access's argument (democratising the instrument) and
 * Instruments' apparatus (the four machines) are one beat now, not two: the
 * heading and body carry the claim, sticky in the rail, while the four
 * instruments are its evidence, arriving one at a time in the scrolling
 * column beside it — the same construction as Scale's rail-and-steps.
 *
 * Heading and body are the client's brief, drafted and awaiting confirmation.
 */
export const instruments = {
  eyebrow: "04 / Instruments",
  heading: "Democratising the 3D bioprinter." as string | null,
  headingPlaceholder: "Heading placeholder — democratising bioprinting",
  /* The heading names the aim; the body states the barrier it removes. */
  body:
    "The instrument should never be the reason the experiment does not happen. Bioprinting has stayed a specialist's tool for practical reasons, not scientific ones." as
      | string
      | null,
  bodyPlaceholder: "Body placeholder — one paragraph, affordability implied",
  rows: [
    {
      key: "squyd" as InstrumentKey,
      index: "I—01",
      logo: "/assets/row-squyd.png",
      name: "SQUYD™",
      descriptor: "Where Engineering Creates Living System",
      capability: "Precisely depositing biological materials.",
    },
    {
      key: "kraken" as InstrumentKey,
      index: "I—02",
      logo: "/assets/row-kraken.png",
      name: "KRAKEN",
      descriptor: "The Worlds First High-Throughput System",
      capability: "Precisely and reproducibly fabricating tissues at scale.",
    },
    {
      key: "genesis" as InstrumentKey,
      index: "I—03",
      logo: "/assets/row-genesis.png",
      name: "GENESIS 1.3",
      descriptor: "Digital Light 3D Bioprinter",
      capability:
        "Precisely controlling light-based fabrication of soft tissue structures.",
    },
    {
      key: "morula" as InstrumentKey,
      index: "I—04",
      logo: "/assets/row-morula.png",
      name: "MORULA™",
      descriptor: "Engineered microtissues. Advancing human health.",
      capability:
        "Precisely controlling tissue architecture to create reproducible biological models.",
    },
  ],
} as const;

/**
 * 05 — About. Trust, and the page's return to paper before the close.
 *
 * No figures are invented here. The metadata column carries only what is
 * already established elsewhere on the page or in the registered address.
 */
export const about = {
  heading: "We build the instrument alongside the people using it." as string | null,
  headingPlaceholder: "Heading placeholder — about NITS",
  body:
    "NITS Engineering is a bio-medical research company in New Delhi. Our instruments are specified at the bench — in hospitals, university laboratories and industry R&D — because that is the only place the requirement is actually known. What we build is what the experiment asked for." as
      | string
      | null,
  bodyPlaceholder: "Body placeholder — who we are, why we are trusted",
  /** Mono metadata, right-aligned per design rule 15. */
  facts: [
    { key: "Based", value: "New Delhi, India" },
    { key: "Field", value: "Bio-medical instrumentation" },
    { key: "Instruments", value: "Four" },
    { key: "Working with", value: "Clinical · Academic · Industry" },
  ],
} as const;

/**
 * 06 — Partners. The real institution list, typeset rather than presented as
 * a logo wall — logos are not in the repo yet and a grid of empty slots reads
 * as unfinished. Each row is name + location, so a logo can be dropped in
 * beside the name later without changing the construction.
 *
 * The right-hand column is a location, not an expansion of the acronym —
 * ZHAW is Zurich University of Applied Sciences, but putting that in the
 * location slot made one row read as a different kind of entry. Tacit Medtek
 * has no location given; it renders without one rather than with a guess.
 * Design rule 22.
 */
export const partners = {
  heading: "Our partners are the ones setting the specification.",
  groups: [
    {
      label: "Clinical",
      items: [
        { name: "AIIMS", place: "New Delhi" },
        { name: "NewEra Hospital", place: "Nagpur" },
        { name: "CMC Vellore", place: "Vellore" },
      ],
    },
    {
      label: "Laboratories",
      items: [
        { name: "Beacon Lab, SRM", place: "Amravati" },
        { name: "THSTI", place: "Faridabad" },
        { name: "CCDC", place: "New Delhi" },
        { name: "SHINE School, VIT", place: "Vellore" },
        { name: "CBCMT, VIT", place: "Vellore" },
        { name: "NIT Agartala", place: "Agartala" },
        { name: "ZHAW", place: "Zurich" },
      ],
    },
    {
      label: "Industry",
      items: [{ name: "Tacit Medtek", place: null as string | null }],
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
