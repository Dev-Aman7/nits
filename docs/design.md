# Design System

Reverse-engineered from `Nits Home v3.dc.html` (the current working version) with reference to `Nits Home v2.1.dc.html`. All values below are read from the actual implementation. Where a value is inferred rather than literal it is marked **(approximation)**.

Implementation note: the site is a single Design Component. There is no Tailwind, no CSS framework, and no external stylesheet. Every rule is an inline `style` attribute; the only global CSS is a small `<helmet><style>` block holding body resets, link states and `@keyframes`. There are therefore no CSS custom properties or theme variables in the source — the tokens in this document are patterns extracted from repeated literal values, not declared variables.

---

## Brand & Design Philosophy

Scientific-instrument minimalism. The page reads like technical documentation that has been typeset properly: numbered sections ("00 / Overview" … "05 / Partners"), monospaced captions, hairline rules, figure labels ("Fig. 01 / Genesis 1.3"), and nothing decorative that does not carry information.

Principles visible in the code:

- **Ground inversion as narrative.** The page opens on warm paper (`#F4F3F0`), descends into near-black (`#0B0C10`) for the four argument sections, returns to paper for Partners, and closes on saturated indigo (`#4B55EE`). Background is the structural device; there are only three grounds in the whole page.
- **Two typefaces, strictly divided.** Archivo carries all statements; IBM Plex Mono carries all metadata. A mono label never makes an argument, and a sans heading never acts as a caption.
- **Hairlines over boxes.** Separation is achieved with 1px borders and 1px grid gaps that let the ground show through. There is not a single box-shadow or rounded card in the design.
- **Restrained, single-direction motion.** Everything enters by rising and fading. No slide-ins from the side, no scale-ups except one figure, no rotation.
- **Editorial scale contrast.** The hero runs to 132px while body copy sits at 17px; the jump is the emphasis mechanism, not colour or weight.
- **Honest placeholders.** Unconfirmed content is labelled as such in mono ("Status TBC", "Specification placeholders"), rather than filled with invented data.

---

## Color System

Three grounds, each with its own text and border ramp. Colours are not shared across grounds — the same role has a different value on paper than on ink.

### Grounds (backgrounds)

| Role | Value | Usage |
|---|---|---|
| Paper | `#F4F3F0` | Body default, Overview (00), Partners (05), card faces on paper |
| Ink | `#0B0C10` | Approach (01), Scale (02), Evidence (03), Products (04), footer, card faces on ink |
| Indigo | `#4B55EE` | Contact section ground, primary button, accent text on paper |

### Surfaces

| Value | Usage |
|---|---|
| `#12141C` | Figure-placeholder fill; product-row hover ground (one step off ink) |
| `#F4F3F0` | Partner card faces sitting on a `#CFCCC4` grid |
| `#0B0C10` | Evidence card faces sitting on a `#2A2E3A` grid |
| `#FFFFFF` | Inverted button on indigo |

### Text colors

On ink (`#0B0C10`):
| Value | Role |
|---|---|
| `#F4F3F0` | Primary text / headings |
| `#AFB3BD` | Body and card copy (secondary) |
| `#8A8F9B` | Mono metadata, tertiary labels, footer text |
| `#6E7380` | Quaternary — the single dimmest note (placeholder sub-line only) |
| `#ADB3FF` | Accent labels on dark (section numbers, scale steps, card eyebrows, "Built") |

On paper (`#F4F3F0`):
| Value | Role |
|---|---|
| `#0B0C10` | Primary text / headings |
| `#43464F` | Body and card copy (secondary) |
| `#5C5F68` | Mono metadata (hero top rail) |
| `#4B55EE` | Accent labels on light (section numbers, card eyebrows, "Scroll to descend") |

On indigo (`#4B55EE`):
| Value | Role |
|---|---|
| `#FFFFFF` | Primary text / headings / link values |
| `#E4E6FF` | Secondary — lede paragraph and contact-row key labels |

### Accent scale

| Value | Usage |
|---|---|
| `#4B55EE` | Indigo base — CTA ground, contact ground, accent text on paper, progress bar |
| `#3A43D6` | Hover/pressed step for the indigo button only |
| `#ADB3FF` | Accent text on dark grounds (the light-on-dark counterpart of `#4B55EE`) |
| `#E4E6FF` | Secondary text on the indigo ground |

The accent has an explicit ground mapping: `#4B55EE` on paper, `#ADB3FF` on ink. `#4B55EE` is never used as text on the dark ground (it would fall below readable contrast), and this is why the global `a:hover` rule changes opacity rather than colour.

### Border colors

| Value | Ground | Usage |
|---|---|---|
| `#E2E0DA` | paper | Hero bottom hairline |
| `#CFCCC4` | paper | Partner card grid lines and outer border |
| `#1A1D26` | ink | Section top borders, scale-step dividers, product-row dividers |
| `#2A2E3A` | ink | Emphasis borders — figure frame, Evidence card grid, products table head rule, placeholder ring |
| `rgba(255,255,255,0.40)` | indigo | Contact list top border |
| `rgba(255,255,255,0.25)` | indigo | Contact row dividers |
| `rgba(11,12,16,0.10)` | nav on paper | Nav bottom border |
| `rgba(244,243,240,0.12)` | nav on ink | Nav bottom border |

Rule in use: `#1A1D26` for ordinary structure on dark, `#2A2E3A` when a border defines a component edge. On paper the same distinction is `#E2E0DA` (structure) / `#CFCCC4` (component).

### Gradients

There are no decorative colour gradients. Two functional background images exist:

- Dot field, Approach: `radial-gradient(rgba(244,243,240,0.10) 1px, transparent 1px)` at `background-size: 48px 48px`, container `opacity: 0.6`.
- Vertical rule field, figure placeholder: `repeating-linear-gradient(90deg, rgba(244,243,240,0.05) 0 1px, transparent 1px 11px)` over `#12141C`.

### Opacity usage

| Value | Where |
|---|---|
| `0.72` | Nav link rest state |
| `1` | Nav link hover; button rest/hover (explicitly re-asserted to defeat the global link hover) |
| `0.68` | Global `a:hover` |
| `0.60` | Dot-field container |
| `0.16` | Dim phase of the CTA status dot blink |
| `0.10` / `0.05` | Dot and rule field ink alphas |
| `0.08` | Progress-bar track (`rgba(11,12,16,0.08)`) |
| `0.78` / `0.72` | Nav ground alphas (paper / ink) behind the blur |

---

## Typography

### Families

- **Archivo** (Google Fonts, weights 400/500/600/700 loaded) — all headings, body copy, buttons, nav, product names. Stack: `Archivo, Helvetica, sans-serif`.
- **IBM Plex Mono** (weights 400/500 loaded) — every label, eyebrow, caption, status, figure tag, footer line and contact key. Stack: `'IBM Plex Mono', monospace`.

Only weights 500, 600 and the 400 default are actually used in the markup; 700 is loaded but unused.

`-webkit-font-smoothing: antialiased` is set on body.

### Scale

Headings and display (Archivo, weight 600, fluid):

| Step | Size | Line height | Letter spacing | Usage |
|---|---|---|---|---|
| Display | `clamp(52px, 9.5vw, 132px)` | 0.9 | −0.045em | Hero H1 only |
| H2-lg | `clamp(40px, 6.2vw, 84px)` | 0.98 | −0.04em | Thesis statements — Approach (01), Contact |
| H2 | `clamp(34px, 4.4vw, 56px)` | 1.02 | −0.035em | All other section H2s (02, 03, 04, 05) |
| H3 | `clamp(24px, 2.4vw, 30px)` | 1.25 | −0.025em | Scale-step statements, product names (weight 500) |
| H4 | `20px` | 1.3 | −0.015em | Partner card titles (weight 500) |

Numeric display: `clamp(36px, 4vw, 48px)` / line-height 1 / −0.025em for the depth readout, with a `22px` exponent (line-height 1.1, letter-spacing 0) and a `24px` unit glyph.

Body (Archivo, weight 400):

| Step | Size | Line height | Usage |
|---|---|---|---|
| Body-lg | `19px` | 1.6 | Section ledes (Evidence, Contact) |
| Body | `17px` | 1.6 | Standard paragraphs, hero lede, product descriptions |
| Body-sm | `15px` | 1.55 | Card copy inside grids |

UI text (Archivo, weight 500): `15px`, letter-spacing −0.005em — nav links and both buttons share this one step.

Label (IBM Plex Mono, one style only, used everywhere):

```
font-family: 'IBM Plex Mono', monospace;
font-size: 11px;
font-weight: 500;
letter-spacing: 0.14em;
text-transform: uppercase;
```

There is exactly one mono label style in the design. Variation is by colour (`#ADB3FF` / `#4B55EE` accent, `#8A8F9B` / `#5C5F68` neutral, `#6E7380` dim), never by size or tracking.

### Hierarchy rules

1. Mono label states the section number and name.
2. Archivo H2 states the claim, one sentence, `text-wrap: balance`, `max-width: 900px` (1180px for the centered Approach thesis).
3. Body paragraph at 17px explains it, `text-wrap: pretty`, max-width 700–720px.
4. Mono label again for any status or caption.

Letter spacing tightens as size grows (−0.015em → −0.045em) and opens only for mono labels (+0.14em). Body copy carries no tracking.

---

## Layout

- **No fixed max content width.** Sections are full-bleed and content is bounded per element: `max-width: 1100px` (hero H1), `1180px` (Approach thesis and its column set, centered with `margin: 0 auto`), `900px` (section H2s), `700–720px` (paragraphs), `560px` (contact lede), `420px` (Scale sticky rail).
- **Page margins / container padding:** `clamp(20px, 4vw, 40px)` horizontally on every section, nav and footer. Scale-step and card interiors use `clamp(24px, 4vw, 64px)` and `32px 24px 40px` respectively.
- **Section vertical padding:** `clamp(96px, 12vw, 192px)` for sections 01–05; `clamp(96px, 12vw, 160px)` for Contact; hero uses `160px` top (clearing the fixed nav) / `40px` bottom.
- **Grid structure:** intrinsic, not a fixed column count. Recurring patterns:
  - `repeat(auto-fit, minmax(260px, 1fr))` — Approach 3-column prose, `gap: 64px`
  - `repeat(auto-fit, minmax(220px, 1fr))` — 4-up card grids, `gap: 1px` over a border-coloured ground (the hairline-grid technique)
  - `repeat(auto-fit, minmax(320px, 1fr))` — Contact two-column, `gap: 80px`
  - Flex-wrap two-column with `flex: 1 1 340px` (max 420px) + `flex: 3 1 520px` — Scale sticky rail vs. steps, i.e. a ~1:3 split
  - Flex-wrap hero: `flex: 1 1 520px` H1 + `flex: 0 1 300px` lede, `align-items: end`, `gap: 64px`
- **Alignment:** everything is left-aligned and flush to the container padding. Right alignment appears only for mono metadata at the end of a row (product status, "Programme / four products", contact values).
- **Vertical rhythm inside sections:** `80px` between major blocks, `48px` label→heading, `32px` inside a heading group, `24px` label→copy, `16px` within a text pair, `8px` name→subtitle.

---

## Spacing System

Recurring literal values, all multiples of 8 except the 2px progress bar and 1px hairlines:

| Token | Value | Typical usage |
|---|---|---|
| 1 | `1px` | Hairline borders, grid gaps |
| 2 | `2px` | Progress-bar height, exponent kerning |
| 8 | `8px` | Name → mono subtitle |
| 12 | `12px` | Button icon gap, button vertical padding |
| 16 | `16px` | Nav vertical padding, contact row padding, logo gap, pair gap |
| 20 | `20px` | Placeholder stack gap |
| 24 | `24px` | Card interior gap, nav item gap (also hero rail gap, footer padding) |
| 32 | `32px` | Nav link gap, product row padding, card top padding, heading-group gap |
| 40 | `40px` | Card bottom padding, Scale rail gap, hero bottom padding |
| 48 | `48px` | Label → heading, dot-field tile size |
| 64 | `64px` | Column gaps, parallax travel |
| 80 | `80px` | Block gap inside sections, Contact column gap, Scale step padding |
| 96 | `96px` | Hero block gap, minimum section padding |
| 160 | `160px` | Hero top padding, Contact max padding |
| 192 | `192px` | Section max padding |

Fluid pairs: `clamp(20px, 4vw, 40px)` (container), `clamp(24px, 4vw, 64px)` (step interior), `clamp(96px, 12vw, 192px)` (section).

---

## Components

### Navbar

Fixed, `top: 2px` (sitting under the progress bar), `z-index: 80`, full width. Three-part flex: wordmark / nav links / CTA, `justify-content: space-between`, `flex-wrap: wrap`, `gap: 24px`, padding `16px clamp(20px, 4vw, 40px)`.

- **Glass:** `backdrop-filter: blur(16px)` with a translucent ground — `rgba(244,243,240,0.78)` over paper, `rgba(11,12,16,0.72)` over ink. This is the only glassmorphism in the design.
- **Ground inversion:** background, text colour and border colour are swapped by JS as sections 01–04 pass the 70px scroll line, transitioning `background 400ms ease, color 400ms ease, border-color 400ms ease`.
- **Border:** 1px bottom, `rgba(11,12,16,0.10)` on paper / `rgba(244,243,240,0.12)` on ink.
- **Links:** Archivo 15px, −0.005em, `opacity: 0.72` → `1` on hover. Five items: Approach, Scale, Genesis 1.3, Products, Partners.
- **Wordmark:** `assets/nits-wordmark.png`, 32×72px, `object-fit: contain`.
- **Responsive:** no media queries — the flex row wraps and the container padding compresses to 20px. No hamburger menu exists **(gap in the implementation, not a documented behaviour)**.

### Buttons

One component, two variants, identical geometry:

| Property | Primary (nav) | Inverted (contact) |
|---|---|---|
| Padding | `12px 24px` | `16px 28px` |
| Radius | `999px` | `999px` |
| Ground | `#4B55EE` | `#FFFFFF` |
| Text | `#FFFFFF` | `#0B0C10` |
| Hover | ground → `#3A43D6` | ground → `#0B0C10`, text → `#FFFFFF` |
| Type | Archivo 15px / 500 / −0.005em | same |
| Shadow | none | none |

Both carry a 6px trailing status dot (`border-radius: 50%`, `animation: nits-blink 2.4s infinite`) — white on the primary, `#4B55EE` on the inverted. Both explicitly set `opacity: 1` in rest and hover to override the global `a:hover` opacity.

Label is "Request access" in both places, sentence case.

### Cards (hairline grid)

Used twice — Evidence specs (4) and Partner audiences (4).

- Container: `display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1px;` with `background` and `border: 1px solid` set to the border colour (`#2A2E3A` on ink, `#CFCCC4` on paper). The gap *is* the rule.
- Face: ground colour (`#0B0C10` / `#F4F3F0`), padding `32px 24px 40px`, `display: flex; flex-direction: column; gap: 24px`.
- Content: mono accent eyebrow, then either body-sm copy directly (Evidence) or a 20px title + body-sm copy pair with `gap: 16px` (Partners).
- Radius `0`, no border on the face itself, no shadow, no hover state.
- Responsive: reflows 4 → 2 → 1 column intrinsically at ~880px and ~440px container width.

### Hero (Overview)

`min-height: 100vh`, `flex-direction: column`, `justify-content: space-between`, `gap: 96px`. Three bands: a mono top rail (section number left, tagline right), the headline block, and a 1px absolute bottom hairline (`#E2E0DA`). Headline and lede sit on a wrapping flex row aligned to the baseline of the block (`align-items: end`).

### Product rows (Products table)

A borderless table built from flex rows. Head rule `1px solid #2A2E3A`, each row `border-bottom: 1px solid #1A1D26`, padding `32px 0`, `gap: 32px`, `align-items: center`, wrapping.

Column pattern: 56px mono index (`P—01`) / 208×88px logo (`object-fit: contain`, `object-position: left center`, `mix-blend-mode: screen`) / `flex: 1 1 240px` name + mono subtitle / `flex: 1 1 260px` 17px description / 132px right-aligned mono status.

Hover: row ground → `#12141C`. Status colour encodes state — `#ADB3FF` for "Built", `#8A8F9B` for "Status TBC" / "Coming soon".

### Figure (image placeholder)

`aspect-ratio: 2.1 / 1`, `min-height: 320px`, `border: 1px solid #2A2E3A`, ground `#12141C` with the 11px vertical rule field. Centered 56px circle ring plus mono instruction text; mono figure tag top-left in accent, mono status bottom-right in neutral. Corner insets `24px`.

### Contact section

Indigo ground. Left column: 72×72px logo (`filter: brightness(0) invert(1)`), H2-lg, 19px lede, inverted button — stacked with `gap: 48px`. Right column: a definition list of three rows, `justify-content: space-between`, padding `16px 0`, top border at 40% white, dividers at 25% white, all mono. The address value is right-aligned with `line-height: 1.7`.

### Footer

Ink ground, single flex row, padding `24px clamp(20px, 4vw, 40px)`, mono label style in `#8A8F9B`, tagline left / copyright right, wrapping.

### Forms / Modals / Badges

None exist. Contact is a `mailto:` link, not a form. The closest thing to a badge is the mono status cell in the product rows, which has no container — colour alone carries the state.

### Scroll progress bar

`position: fixed; top: 0`, 2px tall, full width. Track `rgba(11,12,16,0.08)`, fill `#4B55EE`, width driven from scroll position in JS. Toggleable via the `showProgress` prop.

---

## Border Radius

The design is square by default. Only three radii appear:

| Value | Usage |
|---|---|
| `0` (implicit) | Every section, card, figure, table row, image — the default |
| `999px` | Buttons (both variants) |
| `50%` | 6px status dots, 56px placeholder ring |
| `2px` | `:focus-visible` outline rounding only |

---

## Shadows & Depth

- **Box shadows: none.** There is not one `box-shadow` in the file.
- **Drop shadows: none.**
- **Glow: none.**
- **Blur:** one instance — `backdrop-filter: blur(16px)` on the navbar.
- **Glassmorphism:** navbar only (translucent ground + 16px backdrop blur + 1px hairline). Not used on cards or sections.
- **Neumorphism:** none.
- **Layering technique:** depth is produced by ground inversion, 1px hairlines, `position: sticky` (Scale rail), `mix-blend-mode: screen` on logos, and z-index (progress 90, nav 80). Elevation is never suggested by shadow.

---

## Imagery

All imagery is PNG from `assets/`. There is no photography in the build — the one photographic slot is an explicit labelled placeholder.

| Asset | Usage | Treatment |
|---|---|---|
| `nits-wordmark.png` | Navbar | 32×72px, `object-fit: contain` |
| `nits-logo.png` | Contact | 72×72px, `filter: brightness(0) invert(1)` to force pure white |
| `logo-genesis.png` | Evidence hero logo | `width: min(520px, 80%)`, `mix-blend-mode: screen` |
| `row-squyd/kraken/genesis/morula.png` | Product rows | 208×88px, `object-fit: contain`, `object-position: left center`, `mix-blend-mode: screen` |
| `logo-squyd/kraken/morula.png` | present in `assets/` but not referenced by v3 | — |

- **Aspect ratios:** figure slot `2.1 / 1` (stated as 2400 × 1240 recommended); product logo slot `208 × 88` ≈ 2.36:1; contact logo 1:1.
- **Treatments:** `mix-blend-mode: screen` is applied uniformly to all product logos so they knock out their own dark backgrounds against the ink ground. Consistency here is deliberate — a logo without it reads heavier than its neighbours.
- **Overlays and masks:** none, other than the two background-image texture fields.
- **Positioning:** logos are left-aligned and vertically centered within their row; the figure is full container width.

---

## Icons

No icon library, no SVG icon set, no icon font. The entire iconographic vocabulary is:

- **Status dot** — 6px `div`, `border-radius: 50%`, blinking. White on the primary button, `#4B55EE` on the inverted.
- **Placeholder ring** — 56px `div`, 1px `#2A2E3A` border, `border-radius: 50%`.
- **Text glyphs** — `↓` in "Scroll to descend ↓", `⁻¹ ⁻³ ⁻⁵` superscripts in the scale labels, `—` in `P—01`.

Stroke width, where a shape has one, is `1px`. Icon colour always inherits the accent or neutral of its ground. Usage pattern: an icon only ever appears as a trailing element to text, never standalone.

---

## Animation & Motion

Seven keyframes are declared; all of them move on the Y axis or in opacity only.

```css
@keyframes nits-rise   { from { opacity: 0; transform: translateY(32px) } to { opacity: 1; transform: none } }
@keyframes nits-fade   { from { opacity: 0 } to { opacity: 1 } }
@keyframes nits-in     { from { opacity: 0; transform: translateY(48px) } to { opacity: 1; transform: none } }
@keyframes nits-in-sm  { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: none } }
@keyframes nits-zoom   { from { opacity: 0; transform: scale(1.04) } to { opacity: 1; transform: none } }
@keyframes nits-par    { from { transform: translateY(64px) }  to { transform: translateY(-64px) } }
@keyframes nits-blink  { 0%,45% { opacity: 1 } 50%,95% { opacity: 0.16 } 100% { opacity: 1 } }
```

### Entrance (page load, hero only)

- H1: `nits-rise 900ms cubic-bezier(0.16, 1, 0.3, 1) both`
- Hero lede: `nits-fade 1200ms 300ms both`

These two are the only time-driven entrances; everything below the fold is scroll-driven.

### Scroll animations (CSS scroll-driven, `animation-timeline: view()`)

Every below-fold reveal uses the same construction — `animation: <name> linear both; animation-timeline: view(); animation-range: entry X% cover Y%`. Progress is tied to element position, so the animation scrubs with the scroll rather than firing once.

| Element | Keyframe | Range |
|---|---|---|
| Approach thesis H2 | `nits-rise` | `entry 15% → cover 30%` |
| Approach 3-column prose | `nits-fade` | `entry 35% → cover 45%` |
| Scale steps (×3) | `nits-in` | `entry 20% → cover 40%` |
| Evidence logo | `nits-in` | `entry 5% → cover 26%` |
| Evidence H2 | `nits-in` | `entry 10% → cover 28%` |
| Evidence lede | `nits-fade` | `entry 20% → cover 34%` |
| Figure | `nits-zoom` | `entry 8% → cover 32%` |
| Section H2s (04, 05, Contact) | `nits-in` | `entry 10% → cover 34%` |

**Stagger pattern:** grid children and table rows step their `entry` start by 7% — `8% / 15% / 22% / 29%`, with `cover` end tracking at `34% / 41% / 48% / 55%`. This exact quartet recurs for Evidence cards, product rows and Partner cards.

### Parallax

Approach dot field: `nits-par linear both` over `animation-range: cover 0% → cover 100%`, translating `+64px → −64px` — a 128px total drift against a 48px tile.

### Hover / micro-interactions

| Target | Change | Timing |
|---|---|---|
| Any link (global) | `opacity 1 → 0.68` | `200ms ease` |
| Nav link | `opacity 0.72 → 1` | `200ms ease` (inherited) |
| Primary button | ground `#4B55EE → #3A43D6` | no explicit transition |
| Inverted button | ground `#FFFFFF → #0B0C10`, text inverts | no explicit transition |
| Product row | ground → `#12141C` | no explicit transition |
| Status dots | perpetual `nits-blink 2.4s infinite` | — |
| Navbar ground | paper ↔ ink swap | `400ms ease` on background, color, border-color |

### JS-driven behaviour

Three things are computed in the logic class on a `requestAnimationFrame`-throttled passive scroll listener:

1. **Progress width** — `scrollY / (scrollHeight − innerHeight)`, written as a percentage.
2. **Depth readout** — the Scale section's own scroll progress is bucketed at 0.34 / 0.67 to swap the exponent between `−1`, `−3` and `−5`.
3. **Nav ground** — tests whether any of `act-01`…`act-04` crosses the 70px line.

### Timing & easing summary

- Durations: `200ms` (hover), `400ms` (nav theme), `900ms` (H1), `1200ms` (hero lede), `2400ms` (dot blink loop).
- Easings: `ease` (transitions), `cubic-bezier(0.16, 1, 0.3, 1)` (H1 entrance), `linear` (all scroll-driven, so progress maps to scroll position uniformly).
- Transforms used: `translateY` (max 64px), `scale` (1.04 max). No rotation, no skew, no 3D transforms.

### Focus state

`a:focus-visible { outline: 2px solid currentColor; outline-offset: 4px; border-radius: 2px }` — the outline inherits the ground's text colour, so it works on paper, ink and indigo without variants.

### Page transitions

None — single page, anchor navigation to `#act-00`…`#act-05` and `#contact`.

---

## 3D / WebGL

**Not used.** No three.js, no `<canvas>`, no WebGL context, no 3D models, no particle systems, no `perspective` or `transform-style: preserve-3d`. Depth cues are entirely 2D (blend modes, hairlines, sticky positioning, parallax on a flat texture).

---

## Responsive Design

There are **no media queries** in the implementation. All responsive behaviour comes from three mechanisms: `clamp()` on type and padding, `flex-wrap` / `auto-fit` grids, and `minmax()` floors. The breakpoints below are therefore the *container widths at which the intrinsic layouts reflow*, not declared breakpoints — treat them as **(approximations derived from the `minmax` floors)**.

### Desktop (≈1200px+)

- Container padding at its 40px maximum; section padding at 192px.
- Hero: headline and lede side by side, lede 300px wide.
- Scale: sticky 420px rail beside the step column at roughly 1:3.
- Card grids and product rows in full 4-up / single-line form.
- Type at scale ceilings: H1 132px, H2-lg 84px, H2 56px.

### Tablet (≈700–1100px)

- Container padding interpolating 28–40px; section padding on the `12vw` slope (~84–130px).
- Hero lede drops below the headline once the 520px headline floor plus 300px lede exceeds the row.
- Card grids go 4 → 2 columns (at ~880px of grid width); Approach prose 3 → 2 columns (at ~840px).
- Product rows begin wrapping: the description and status drop to a second line below the logo and name.
- Scale rail still side-by-side until the container drops under ~860px, then the rail stacks above the steps and its `position: sticky` stops being useful **(approximation — behaviour follows from the 340px + 520px flex bases)**.
- Type descends the `vw` slopes: H1 ~67–105px, H2 ~31–48px.

### Mobile (≈<700px)

- Container padding at its 20px floor; section padding at the 96px floor.
- Every grid is single-column; every flex row is fully stacked.
- Contact goes single-column (320px floor) — logo, heading, lede, button, then the contact list.
- Navbar wraps to two or three rows: wordmark, then links, then the CTA. Nav links wrap within their own row at `gap: 32px`. There is no collapsed/hamburger pattern.
- Type at floors: H1 52px, H2-lg 40px, H2 34px, H3 24px; body sizes are fixed and do not shrink.
- Animations are unchanged — scroll-driven ranges are relative to the element, so they behave identically. Scroll-driven animation is unsupported in some mobile browsers, in which case `both` leaves elements at their end state, i.e. fully visible **(behaviour of the `both` fill, not an explicit fallback)**.

Note: v2.1 carried `min-width: 1200px` and was desktop-only. v3 removed it; the fluid system above is what replaced it.

---

## Page Structure

### Home (single page)

1. **Scroll progress bar** — 2px, fixed top, indigo fill on 8%-ink track. Optional (`showProgress`).
2. **Navbar** — fixed, glass, ground-inverting. Wordmark / 5 links / indigo pill CTA.
3. **00 Overview** *(paper)* — full-viewport hero. Mono rail ("00 / Overview" · "Building A Healthier Tomorrow"), 132px headline "Thinking and building the impossible." with a 300px lede and an indigo "Scroll to descend ↓" cue, closed by a hairline. Load-time rise + fade.
4. **01 Approach** *(ink)* — parallaxing dot field. Mono number, centered 84px thesis at 1180px, then three 17px columns of prose. The page's first inversion and its widest measure.
5. **02 Scale** *(ink)* — two-part split. Sticky left rail holds the section number, a 56px heading and a live `10⁻ⁿ m` depth readout; the right column is three full-height steps (body → tissue → cell), each a mono scale label plus a 30px statement, divided by hairlines. The readout's exponent changes as the steps pass.
6. **03 Evidence** *(ink)* — product proof. Genesis logo in `screen` blend, 56px heading "Digital Light 3D Bioprinter", 19px lede, then a 2.1:1 figure placeholder with corner tags, then a 4-up hairline-grid spec card set, closed by a mono placeholder note.
7. **04 Products** *(ink)* — the programme table. Heading with a right-aligned mono count, then four rows: index, logo, name + mono descriptor, description, right-aligned status. Rows highlight to `#12141C` on hover.
8. **05 Partners** *(paper)* — second inversion back to paper. 56px heading, then four hairline-grid cards (Labs, Clinical, Industry, Capital) on a `#CFCCC4` grid.
9. **Contact** *(indigo)* — the only saturated ground. White logo, 84px heading, lede, white pill CTA; right column is a three-row mono definition list on white-alpha rules.
10. **Footer** *(ink)* — single mono row, tagline left, copyright right.

Narrative shape: paper → ink (four sections) → paper → indigo. The ink block is the argument; the two paper sections frame it; indigo is the close.

---

## Design Tokens

```text
# Colors — grounds
paper                 #F4F3F0
ink                   #0B0C10
indigo                #4B55EE

# Colors — surfaces
surface-ink-raised    #12141C
white                 #FFFFFF

# Colors — text on ink
text-ink-1            #F4F3F0
text-ink-2            #AFB3BD
text-ink-3            #8A8F9B
text-ink-4            #6E7380
accent-on-ink         #ADB3FF

# Colors — text on paper
text-paper-1          #0B0C10
text-paper-2          #43464F
text-paper-3          #5C5F68
accent-on-paper       #4B55EE

# Colors — text on indigo
text-indigo-1         #FFFFFF
text-indigo-2         #E4E6FF

# Colors — accent
accent                #4B55EE
accent-hover          #3A43D6
accent-light          #ADB3FF
accent-tint           #E4E6FF

# Colors — borders
border-paper          #E2E0DA
border-paper-strong   #CFCCC4
border-ink            #1A1D26
border-ink-strong     #2A2E3A
border-on-indigo      rgba(255,255,255,0.40)
divider-on-indigo     rgba(255,255,255,0.25)
nav-border-paper      rgba(11,12,16,0.10)
nav-border-ink        rgba(244,243,240,0.12)

# Colors — translucent grounds
nav-bg-paper          rgba(244,243,240,0.78)
nav-bg-ink            rgba(11,12,16,0.72)
progress-track        rgba(11,12,16,0.08)

# Typography — families
font-sans             Archivo, Helvetica, sans-serif      (400 / 500 / 600)
font-mono             'IBM Plex Mono', monospace          (500)

# Typography — scale
display               clamp(52px, 9.5vw, 132px) / 0.9  / -0.045em / 600
h2-lg                 clamp(40px, 6.2vw, 84px)  / 0.98 / -0.04em  / 600
h2                    clamp(34px, 4.4vw, 56px)  / 1.02 / -0.035em / 600
h3                    clamp(24px, 2.4vw, 30px)  / 1.25 / -0.025em / 500
h4                    20px / 1.3  / -0.015em / 500
numeric               clamp(36px, 4vw, 48px) / 1 / -0.025em
body-lg               19px / 1.6
body                  17px / 1.6
body-sm               15px / 1.55
ui                    15px / 500 / -0.005em
label                 11px / 500 / 0.14em / uppercase / mono

# Spacing
1  2  8  12  16  20  24  32  40  48  64  80  96  160  192   (px)
space-container       clamp(20px, 4vw, 40px)
space-step            clamp(24px, 4vw, 64px)
space-section         clamp(96px, 12vw, 192px)

# Radius
radius-none           0        (default — sections, cards, figures, rows)
radius-pill           999px    (buttons)
radius-circle         50%      (status dots, placeholder ring)
radius-focus          2px      (focus outline only)

# Shadows
none                  — no box-shadow anywhere in the design
blur-glass            backdrop-filter: blur(16px)   (navbar only)

# Breakpoints  (intrinsic, no media queries — approximations)
mobile                < ~700px    all layouts single-column
tablet                ~700–1100px grids 2-up, rows wrapping
desktop               > ~1200px   full 4-up, scale ceilings reached
grid-floor-card       220px
grid-floor-prose      260px
grid-floor-contact    320px
flex-base-rail        340px (max 420px)
flex-base-steps       520px

# Content measures
measure-hero          1100px
measure-thesis        1180px
measure-heading       900px
measure-prose         700–720px
measure-lede          560px

# Animation durations
dur-hover             200ms
dur-theme             400ms
dur-entrance          900ms
dur-entrance-slow     1200ms  (300ms delay)
dur-blink             2400ms  (infinite)

# Easing
ease-default          ease
ease-entrance         cubic-bezier(0.16, 1, 0.3, 1)
ease-scroll           linear   (all scroll-driven animations)

# Motion distances
rise-sm               24px
rise                  32px
rise-lg               48px
parallax              ±64px
zoom                  scale(1.04)

# Scroll-driven ranges
reveal-standard       entry 10% → cover 34%
stagger-quartet       entry 8/15/22/29% → cover 34/41/48/55%
parallax-range        cover 0% → cover 100%

# Z-index
progress              90
navbar                80
```

---

# Implementation Guidelines

Rules derived from this implementation, for building a new page that belongs to the same site.

**Ground and colour**

1. Pick one of three grounds per section — warm paper `#F4F3F0`, near-black `#0B0C10`, or indigo `#4B55EE`. Never invent a fourth, and never use pure white or pure black as a ground.
2. Swap the text ramp with the ground. On paper use `#0B0C10` / `#43464F` / `#5C5F68`; on ink use `#F4F3F0` / `#AFB3BD` / `#8A8F9B`. Do not carry a paper grey onto ink.
3. The accent flips by ground: `#4B55EE` on paper, `#ADB3FF` on ink. Indigo text on the dark ground is a contrast failure and the design deliberately avoids it.
4. Alternate grounds to mark narrative beats, not to decorate. Paper frames, ink argues, indigo closes.
5. Use indigo sparingly — as a ground for the closing section, as the CTA fill, and for small accent labels. It is never a heading colour on paper.

**Type**

6. Two families, no exceptions. Archivo says things; IBM Plex Mono labels things. If a piece of text is a number, a status, a caption or a category, it is mono.
7. Use the one mono label style (11px / 500 / 0.14em / uppercase) everywhere and vary only its colour. Do not introduce a second mono size or a different tracking.
8. Pick heading sizes from the five-step scale; do not interpolate a new size between steps. A thesis statement gets `h2-lg`, an ordinary section heading gets `h2`.
9. Tighten tracking as type grows and never track body copy. Set `text-wrap: balance` on headings and `text-wrap: pretty` on paragraphs.
10. Keep prose to a 700–720px measure even when the section is full-bleed.

**Layout**

11. Sections are full-bleed with `clamp(20px, 4vw, 40px)` side padding; width is constrained per element with `max-width`, never by a wrapper container.
12. Use `clamp(96px, 12vw, 192px)` for section vertical padding so the rhythm holds at every width.
13. Space blocks on the 8px family — 80px between major blocks, 48px label→heading, 24px within a group, 8px name→subtitle.
14. Build multi-column layouts with `auto-fit` + `minmax()` or `flex-wrap` with a flex-basis, so they reflow without media queries. Do not add breakpoints; extend the intrinsic system.
15. Left-align everything. Right alignment is reserved for mono metadata terminating a row.

**Components and surfaces**

16. Separate with 1px hairlines, not shadows. For card sets, use `gap: 1px` over a border-coloured container ground so the rules are the grid.
17. Keep corners square. The only rounded things are pill buttons and circular dots.
18. Never add a box-shadow. Depth comes from ground inversion, hairlines, sticky positioning and blend modes.
19. Reserve glassmorphism for the navbar — a translucent ground plus `blur(16px)`. Cards stay opaque.
20. Buttons are pills with the one 15px/500 label, "Request access" sentence case, and a trailing 6px blinking dot. Use the indigo variant on light grounds and the white variant on indigo.
21. Apply `mix-blend-mode: screen` to every product logo on a dark ground, or to none of them — mixed treatment makes logos read at different weights in the same row set.
22. Label unconfirmed content in mono ("Status TBC", "Image placeholder — …, 2400 × 1240 recommended") rather than filling it with plausible-looking data.

**Motion**

23. Everything enters by rising and fading on the Y axis. No horizontal slides, no rotation, no bounce.
24. Drive below-fold reveals with `animation-timeline: view()` and `linear` easing so they scrub with the scroll; reserve time-based easing (`cubic-bezier(0.16, 1, 0.3, 1)`) for the hero on load.
25. Stagger sets of 4 by 7% of scroll range — `entry 8% / 15% / 22% / 29%`.
26. Keep motion distances small: 24/32/48px rises, ±64px parallax, `scale(1.04)` maximum.
27. Hover states change one property — opacity for links, ground for buttons and rows. 200ms `ease`, nothing longer except the 400ms nav theme swap.
28. Always set `animation-fill-mode: both` so an element ends visible where scroll-driven animation is unsupported.
29. Keep the `:focus-visible` outline on `currentColor` so it survives every ground without a variant.

**Content voice**

30. Number every section in mono ("03 / Evidence") and give it one declarative heading sentence. The heading makes a claim; the paragraph beneath it explains the claim; the mono labels carry the evidence.
