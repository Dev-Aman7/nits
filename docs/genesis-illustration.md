# Genesis illustration layer

Added: the GENESIS 1.3 instrument and the cell field, as section-scoped
illustrations. **No copy changed.** Every section keeps the ground, layout and
words it already had; `lib/content.ts` is untouched.

A snapshot of the project as it stood before this work is in `.backup-*/`
(git-ignored). Delete it once you're happy.

## What was added

| File | Role |
|---|---|
| `components/genesis/lib/draw.ts` | Line primitives — no three.js, no DOM |
| `components/genesis/lib/machine.ts` | GENESIS 1.3 geometry + callout anchors |
| `components/genesis/lib/machineScene.ts` | The machine as a plain scene object, shared by the two places that draw it |
| `components/genesis/lib/cellShaders.ts` | Procedural cell field (GLSL) |
| `components/genesis/HeroMachine.tsx` | Instrument, full bleed behind act 00 |
| `components/genesis/ScaleField.tsx` | Cell field behind act 02 |
| `components/genesis/GenesisFigure.tsx` | Instrument inside the act 03 figure slot |

One new dependency: `three` (+ `@types/three`).

## What was edited

- `components/sections/Hero.tsx` — one `<HeroMachine />` added
- `components/sections/Scale.tsx` — one `<ScaleField />` added
- `components/sections/Evidence.tsx` — `<GenesisFigure />` added beside the
  existing placeholder, which now only shows if WebGL is unavailable
- `components/Sections.module.css` — one appended block: stacking contexts and
  scrims so the existing copy stays readable over the drawings
- `.gitignore` — ignores `.backup-*/`

## Why Scale is where the sequence lives

Scale descends: 10⁻¹ the body, 10⁻³ the tissue, 10⁻⁵ the cell. So the print
sequence runs **in reverse** there — it opens on the finished perfused
construct and resolves down to individual cells in suspension. Beat 5 → beat 0
is exactly that descent, which is why the existing copy already describes what
you are looking at and no new words were needed.

Progress comes from the section's own bounding rect — the same measurement
`useScrollState` already uses for the depth readout — so the illustration and
the exponent can never disagree.

## Behaviour

- **No WebGL**: each component removes its own host and the section renders
  exactly as it did before. The Evidence mono placeholder is the documented
  fallback and reappears automatically.
- **Off screen**: every canvas stops drawing via IntersectionObserver.
- **Reduced motion**: ambient time freezes; scroll still drives the field.
- **StrictMode**: each effect disposes every geometry, material and renderer,
  so React 19's dev double-mount does not leak a second WebGL context.
- **Mobile**: below 880px the drawings drop to 50–55% opacity and the scrims
  go full width. `CELL_RESOLUTION` in `cellShaders.ts` is the one perf knob —
  160 gives 25,600 points, drop to 96 for 9,216.

## Open items

- Every number on the machine is a placeholder. Layer height, build volume,
  vat capacity and spot size want the real GENESIS 1.3 spec.
- The machine is drawn top-down with a scanning beam. GENESIS 1.3 is a
  *Digital Light* printer, which projects a full cross-sectional mask per
  exposure rather than scanning a point — kept as a beam per direction, but
  researchers in the target audience will notice.
- The recoater only exists in top-down architecture. Bottom-up removes it and
  the vat floor becomes a release film.
- A real photograph still beats the drawing in the figure slot: set
  `evidence.figure.src` in `lib/content.ts` and the photo takes the slot back.
