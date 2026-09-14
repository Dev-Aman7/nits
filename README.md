# NITS Engineering — website

Production implementation of `Nits Home v3.dc.html`, the Claude Design canvas
for the NITS Engineering home page. Next.js 16 (App Router) + React 19,
TypeScript, CSS Modules. No UI framework and no CSS framework — the design
system is small enough to be the stylesheet.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm start
npm run typecheck
```

---

## What this is a port of

The source was a single Design Component: one file of inline `style`
attributes, `sc-if` conditionals, `{{ }}` bindings, `style-hover` attributes and
a `DCLogic` class. None of that survives here. What survives is every value —
colours, type steps, spacing, borders, keyframes and scroll ranges are taken
from `docs/design.md`, which was itself reverse-engineered from the v3 source.

| Design Component | Here |
|---|---|
| Inline `style` attributes | CSS custom properties + CSS Modules |
| `style-hover="…"` | real `:hover` rules |
| `<sc-if value="{{ showNotes }}">` | plain conditional rendering |
| `{{ progressWidth }}`, `{{ depthExp }}`, `{{ navBg }}` | `lib/useScrollState.ts` |
| `DCLogic` scroll listener | one rAF-throttled passive listener, shared |
| `animation-timeline: view()` only | same, plus an IntersectionObserver fallback |

---

## The spec

`docs/design.md` is the source of truth for every value in this codebase —
colours, the five heading steps, spacing, borders, the seven keyframes and
every scroll range. It was reverse-engineered from the v3 canvas, and values it
marks *(approximation)* are the ones inferred rather than read literally.
`docs/Nits Home v3.dc.html` and `docs/Nits Home v2.1.dc.html` are the original
canvases, kept for reference.

If you change a token in `app/globals.css`, change it in `docs/design.md` too —
otherwise the next person porting a new page builds against a stale system.

## Structure

```
app/
  layout.tsx        fonts, metadata, OG/Twitter, the html.js flag
  page.tsx          section order, skip link, Organization JSON-LD
  globals.css       tokens, reset, keyframes, reveal system, primitives
components/
  Chrome.tsx        progress bar + navbar (the two fixed elements)
  Reveal.tsx        one primitive behind every below-fold reveal
  Sections.module.css
  sections/         Hero, Approach, Scale, Evidence, Products, Partners,
                    Contact, Footer
lib/
  content.ts        all copy, product rows, partner cards, stagger constants
  useScrollState.ts progress / depth exponent / nav ground inversion
docs/
  design.md         the design system this is built from
  Nits Home v3.dc.html, Nits Home v2.1.dc.html   original canvases
public/assets/      the ten PNGs, unchanged
verify.mjs          13 design-fidelity checks (see below)
```

### Where to change things

- **Copy, product rows, partner cards, contact details** → `lib/content.ts`.
  Nothing in `components/` hard-codes a sentence.
- **Colours, type, spacing** → the token block at the top of `app/globals.css`.
- **The Genesis figure** → drop the image in `public/assets/` and set
  `evidence.figure.src` in `lib/content.ts`. The labelled placeholder
  disappears on its own.
- **Placeholder notes** (`Specification placeholders …`, `Two statuses are
  placeholders …`) → these were the `showNotes` prop in v3. Delete the
  `note` strings in `lib/content.ts` and the `<p>` that renders them once the
  real figures land.

---

## Two things v3 did not have

`design.md` records both of these as gaps in the implementation rather than
decisions, so they are filled here.

**1. A mobile navigation pattern.** v3 had no collapsed menu — the three-part
nav row simply wrapped to two or three lines, pushing into the hero. Below
900px the links and CTA now move into an opaque sheet behind a hairline
toggle. Above 900px the group is `display: contents`, so wordmark / links / CTA
remain the same three `space-between` children v3 had; nothing about the
desktop bar changed. The sheet is opaque rather than glass, per rule 19 —
glassmorphism is reserved for the bar itself, and a nested `backdrop-filter`
inside the already-blurred header does not sample the page behind it anyway.

**2. A fallback for scroll-driven animation.** Every below-fold reveal in v3
used `animation-timeline: view()`, which only Chromium ships. Elsewhere
`animation-fill-mode: both` left elements sitting at their end state — correct,
but with no motion at all. `Reveal.tsx` now keeps the native scrubbing path on
Chromium and, everywhere else, holds each element at its keyframe start and
releases it once via IntersectionObserver on a 900ms
`cubic-bezier(0.16, 1, 0.3, 1)`. The stagger quartet is reproduced as
`0 / 90 / 180 / 270ms` delays.

Both paths end in the same place. The paused state is scoped to `html.js`
(set by an inline script before first paint), so with JavaScript disabled
nothing is ever stranded at `opacity: 0`.

Verified in Chromium (native path) and Firefox 155 (fallback path): held at
`opacity: 0` before entry, `running` and `opacity: 1` after, with nav ground
inversion and the depth readout working in both.

---

## Notes on fidelity

- The Scale rail releases `position: sticky` below 880px. v3 kept it sticky
  past the point where its 340px + 520px flex bases force a stack, where
  sticky no longer does anything useful.
- `.productStatus` gained `margin-left: auto`. It is a no-op while the product
  row is a single line — the name and description columns absorb all free
  space — and it keeps the status flush right once the row wraps, instead of
  leaving a 132px right-aligned box stranded mid-row on mobile.
- `scroll-behavior: smooth` and `scroll-padding-top: 80px` are additions, not
  ports — v3 set neither, so its anchor links jumped and landed underneath the
  fixed navbar. Both are guarded by `prefers-reduced-motion`. If you want the
  original jump, delete the two lines from the `html` rule in `globals.css`.
- Fonts are self-hosted through `next/font/google` rather than loaded from the
  Google CDN at runtime. Same families, same weights (Archivo 400/500/600,
  IBM Plex Mono 400/500 — v3 loaded Archivo 700 but never used it).
- Everything else — the three grounds, the five heading steps, the single
  11px/500/0.14em mono label, the 1px hairline grids, zero box-shadows, the
  `mix-blend-mode: screen` on every product logo, the seven keyframes and
  every scroll range — is as specified.

## Added for production

Skip link, landmark roles and `aria-label`s, a `prefers-reduced-motion` block,
`:focus-visible` on `currentColor` (works on all three grounds without a
variant), OG/Twitter metadata, `Organization` JSON-LD, and `theme-color`.
The depth readout carries an `aria-label` because `10⁻⁵ m` does not read aloud.

---

## Verification

`verify.mjs` asserts the design system holds, not just that the page renders:
three grounds and no fourth, zero `box-shadow` anywhere, exactly one mono label
style, no radius outside `0 / 999px / 50%`, nav ground inversion across all
seven sections, the depth readout hitting all three buckets, progress bar,
image loading, a single `h1`, no horizontal overflow at 390px, the mobile menu,
and the reveal fallback under Firefox.

```bash
npm run build && npx next start -p 3100 &
npm i -D playwright && npx playwright install chromium firefox
node verify.mjs
```

Last run: 13/13.
