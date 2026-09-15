/**
 * Careers page copy and openings. Content is data — components only layout.
 *
 * Apply targets a single Google Form until per-role forms exist. Swap
 * CAREERS_APPLY_FORM_URL when the real form is ready.
 */

/** Replace with the live Google Form URL. */
export const CAREERS_APPLY_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSc-PLACEHOLDER-REPLACE-ME/viewform";

export type Job = {
  id: string;
  slug: string;
  title: string;
  team: string;
  location: string;
  type: string;
  posted: string;
  summary: string;
  about: string;
  responsibilities: readonly string[];
  requirements: readonly string[];
  niceToHave: readonly string[];
  applyUrl: string;
};

export const careers = {
  eyebrow: "Careers",
  heading: "Build the instrument the experiment asks for.",
  lede:
    "NITS Engineering designs and builds bioprinting instruments with the people who use them — in labs, hospitals and industry R&D. We hire for craft, curiosity and the patience to get a living system to work.",
  openingsLabel: "Open roles",
  emptyLabel: "No openings right now",
  applyLabel: "Apply via Google Form",
  applyNote: "Opens in a new tab. We review every application.",
  sections: {
    about: "About the role",
    responsibilities: "What you will do",
    requirements: "What you bring",
    niceToHave: "Nice to have",
  },
} as const;

export const jobs: readonly Job[] = [
  {
    id: "mech-design",
    slug: "mechanical-design-engineer",
    title: "Mechanical Design Engineer",
    team: "Instruments",
    location: "New Delhi",
    type: "Full-time",
    posted: "2026-03",
    summary:
      "Own the mechanical architecture of our bioprinters — from extrusion paths to enclosure and service access.",
    about:
      "You will design the physical systems that place living material with precision: stages, fluid paths, thermal control and the frames that keep everything repeatable on a bench. Work sits next to firmware, optics and the biologists who specify the experiment.",
    responsibilities: [
      "Design and iterate mechanical assemblies for SQUYD, KRAKEN, GENESIS and MORULA platforms.",
      "Produce CAD, drawings and BOMs that manufacturing and field service can trust.",
      "Prototype, test and document tolerances that matter for biological deposition.",
      "Collaborate with firmware and applications on motion, fluidics and thermal constraints.",
      "Support partner labs when an instrument needs a mechanical change at the bench.",
    ],
    requirements: [
      "Degree in mechanical engineering or equivalent practical experience.",
      "Strong CAD (SolidWorks, Fusion or similar) and drawing discipline.",
      "Experience shipping hardware that moves, seals or holds tight tolerances.",
      "Comfort working with electrical and firmware counterparts.",
      "Based in or willing to relocate to New Delhi.",
    ],
    niceToHave: [
      "Prior work on laboratory instruments, CNC or fluidic systems.",
      "Familiarity with DLP, extrusion or sterile-environment design.",
      "Experience with supplier management for precision parts in India.",
    ],
    applyUrl: CAREERS_APPLY_FORM_URL,
  },
  {
    id: "tissue-scientist",
    slug: "tissue-engineering-scientist",
    title: "Tissue Engineering Scientist",
    team: "R&D",
    location: "New Delhi",
    type: "Full-time",
    posted: "2026-03",
    summary:
      "Define what the instrument must achieve biologically — and prove it on printed constructs.",
    about:
      "You sit between the bench and the machine. Your protocols, assays and failure modes become the specification for the next hardware revision. Partners in hospitals and university labs are part of the loop, not an afterthought.",
    responsibilities: [
      "Design and run bioprinting protocols for microtissues and soft constructs.",
      "Translate experimental needs into clear instrument requirements.",
      "Develop assays for viability, architecture and reproducibility.",
      "Write protocols partners can follow without a specialist on site.",
      "Feed structured feedback into mechanical and firmware roadmaps.",
    ],
    requirements: [
      "PhD or MSc in tissue engineering, biomaterials, cell biology or related field.",
      "Hands-on experience with 3D cell culture, hydrogels or bioprinting.",
      "Clear scientific writing and protocol discipline.",
      "Willingness to work closely with engineers who do not speak biology by default.",
      "Based in or willing to relocate to New Delhi.",
    ],
    niceToHave: [
      "Experience with DLP or extrusion bioprinters.",
      "Prior collaboration with instrument vendors or core facilities.",
      "Publication or IP record in engineered tissues.",
    ],
    applyUrl: CAREERS_APPLY_FORM_URL,
  },
  {
    id: "firmware-controls",
    slug: "firmware-controls-engineer",
    title: "Firmware & Controls Engineer",
    team: "Instruments",
    location: "New Delhi",
    type: "Full-time",
    posted: "2026-02",
    summary:
      "Make motion, light and fluid delivery deterministic enough for living systems.",
    about:
      "Biological experiments fail when timing and dosage drift. You will own the control stack that keeps deposition, curing and environmental loops stable — from embedded firmware to the host software researchers actually touch.",
    responsibilities: [
      "Design and implement firmware for motion, pumps, sensors and light engines.",
      "Build host-side control software with clear operator feedback.",
      "Characterise latency, jitter and failure modes under lab conditions.",
      "Work with mechanical and applications teams on closed-loop behaviours.",
      "Maintain bring-up, calibration and field-update paths for shipped instruments.",
    ],
    requirements: [
      "Strong embedded C/C++ or Rust, plus comfort in a high-level host language.",
      "Experience with real-time control, steppers/servos or sensor fusion.",
      "Discipline around testing, logging and reproducible builds.",
      "Ability to debug hardware and software in the same sitting.",
      "Based in or willing to relocate to New Delhi.",
    ],
    niceToHave: [
      "Optics, DLP or fluidics control experience.",
      "Prior medical or laboratory device work.",
      "Familiarity with UI for instrument operators (not consumer apps).",
    ],
    applyUrl: CAREERS_APPLY_FORM_URL,
  },
  {
    id: "clinical-apps",
    slug: "clinical-applications-specialist",
    title: "Clinical Applications Specialist",
    team: "Field",
    location: "New Delhi / travel",
    type: "Full-time",
    posted: "2026-02",
    summary:
      "Bring instruments into clinical and academic labs — and bring their requirements back.",
    about:
      "Our partners specify what we build. You will be the person in the room when a hospital or university lab turns a research question into an instrument brief, then stay with them through install, training and the first successful runs.",
    responsibilities: [
      "Lead installs, training and first experiments at partner sites.",
      "Capture clinical and lab requirements in a form engineering can act on.",
      "Maintain relationships across AIIMS, CMC, university labs and industry R&D.",
      "Build application notes and demos that show what the instrument can do.",
      "Escalate product issues with enough evidence for a clean fix.",
    ],
    requirements: [
      "Background in biomedical engineering, life sciences or clinical research ops.",
      "Comfort teaching complex instruments to mixed audiences.",
      "Strong written and spoken communication; travel readiness in India.",
      "Organised follow-through — notes, tickets and next steps after every visit.",
      "Based in or willing to relocate to New Delhi.",
    ],
    niceToHave: [
      "Prior applications or field roles for lab instruments.",
      "Experience in regenerative medicine or surgical research settings.",
      "Hindi and English fluency in technical conversations.",
    ],
    applyUrl: CAREERS_APPLY_FORM_URL,
  },
] as const;

export function getJobById(id: string): Job | undefined {
  return jobs.find((job) => job.id === id);
}
