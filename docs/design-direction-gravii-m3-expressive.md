# Gravii Design Direction: Material 3 Expressive-Inspired

## Status

- Phase: `pre-refactor`
- Date: `2026-04-16`
- Scope: workspace-level visual direction before token extraction or UI package work

## Product Inputs

- Product: Gravii analyzes onchain wallets and assigns user personas from behavioral signals.
- Primary audiences: `B2C` users, `B2B` partners, and adjacent internal operators who need to trust the same product language.
- Desired impression: `comfortable`, `stable`, `smart`
- Avoided impression: stereotypical tech aesthetic, loud hype, or a "trying too hard" premium tone
- Current brand asset note: the logo title font is `Cloth`

## Reference Set

- Material 3 Expressive: <https://m3.material.io/blog/building-with-m3-expressive>
- Offbrand: <https://www.itsoffbrand.com/>
- ctrl.xyz: <https://ctrl.xyz/>

These references should be interpreted as directional input, not copied literally.

## Design Thesis

Gravii should feel like calm intelligence applied to wallet behavior.

The interface should communicate that Gravii understands complexity without performing complexity. The product should feel reassuring first, insightful second, and technical only where the workflow truly requires it.

## Core Principles

### 1. Quiet Confidence

- Prefer restraint over spectacle.
- Let structure, spacing, and clarity carry authority.
- Avoid hero moments that feel boastful or trend-driven.

### 2. Warm Precision

- Use precise layouts and data presentation, but soften them with humane spacing, rounded shapes, and warmer surfaces.
- Avoid cold dashboards that look like generic infrastructure tools.

### 3. Expressive, Not Noisy

- Borrow Material 3 Expressive's richer shape language, hierarchy, and statefulness.
- Reduce exaggerated bounce, candy-color contrast, or playful visual tricks that would weaken trust.

### 4. Trust Through Legibility

- Information-heavy surfaces must remain calm and readable.
- Data views should use contrast, grouping, and hierarchy before decoration.

### 5. One Brand, Multiple Densities

- `gravii-user-app` should feel more spacious and guided.
- `gravii-partner-app` and `gravii-backoffice` can become denser, but should still inherit the same color, shape, and motion rules.
- `gravii-user-landing` can stay more atmospheric, but should still feel like the same company.

## What "Material 3 Expressive-Inspired" Means for Gravii

For this workspace, "Material 3 Expressive-inspired" means:

- use semantic color roles instead of one-off page colors
- use richer component states, clearer hierarchy, and more intentional shape variation
- allow friendly motion and rounded surfaces
- avoid copying Google's product look directly
- avoid treating Material as a drop-in web component strategy

It does **not** mean:

- adopt every Material component as-is
- push the product into a bright mobile-only aesthetic
- replace app-owned layouts with a shared UI package before the visual language is proven

## Visual Direction

### Tone

- calm
- grounded
- observant
- helpful
- quietly premium

### Anti-Tone

- neon crypto
- dark-mode-by-default swagger
- overbuilt fintech seriousness
- shiny startup self-importance

### Shape Language

- rounded rectangles and soft capsules over sharp geometric blocks
- corner radius should feel intentional and slightly generous
- cards should feel layered and tactile, not glassy
- controls should look touch-friendly even on desktop

## Color Direction

Start with semantic roles first. Treat the values below as exploration candidates for mockups and pilot work, not locked production tokens.

| Role | Direction | Candidate |
| --- | --- | --- |
| `primary` | deep slate blue for trust and intelligence | `#27445C` |
| `primary-container` | mist blue for selected states and calm emphasis | `#D9E7EF` |
| `secondary` | sage teal for supportive actions and subtle highlights | `#5F7E73` |
| `tertiary` | warm sand for signature accents and restrained warmth | `#B79A73` |
| `surface` | soft ivory for the main resting background | `#F7F3ED` |
| `surface-alt` | fog beige for cards and grouped sections | `#EEE8E0` |
| `text` | ink blue-grey for primary reading contrast | `#1F2B33` |
| `text-muted` | softened slate for secondary information | `#5F6B73` |
| `border` | quiet mineral tone for separators and strokes | `#D3D8DB` |
| `success` | muted moss green | `#3F7460` |
| `warning` | amber clay | `#A9783A` |
| `danger` | softened berry red | `#9B5861` |
| `focus-ring` | calm azure distinct from primary | `#7D9FD0` |

### Color Notes

- Default backgrounds should lean warm-neutral rather than stark white or graphite black.
- Accent colors should read as intelligent and composed, not high-voltage.
- Data visualization colors should be derived from the same semantic family instead of introducing a separate "dashboard palette."

## Typography Direction

### Locked Brand Input

- Use `Cloth` for the logo title and selective brand-signature moments.

### Recommended Usage for `Cloth`

- wordmark
- landing hero lockups
- large section titles used sparingly

Do not use `Cloth` for:

- long paragraphs
- dense data views
- tables
- small labels
- repeated UI headings across the product

### UI Font Pairing Direction

Use a calm sans-serif partner font for the application UI. The partner font should feel clean and current without looking like a default SaaS stack.

Recommended pilot candidates:

1. `Instrument Sans`
2. `Geist`
3. `Public Sans`

For the first pilot, start by testing `Instrument Sans` against `Cloth`. If the pairing feels too soft, test `Geist` next.

### Type System Guidance

- Display moments: rare, brand-led, spacious
- Product headings: clear and structured, not theatrical
- Body copy: comfortable line height and moderate density
- Numbers and wallet data: high legibility, no decorative treatment

## Motion Direction

Motion should support comprehension and reassurance.

Recommended behavior:

- hover transitions: `120ms` to `160ms`
- press feedback: `90ms` to `120ms`
- modal and drawer transitions: `220ms` to `280ms`
- larger panel or section transitions: `280ms` to `360ms`

Recommended character:

- smooth easing
- low overshoot
- no playful bounce on trust-critical surfaces
- no decorative motion that competes with analysis content
- always support reduced-motion preferences

## Component Guidance

### Buttons

- Buttons should look friendly and stable, not aggressive.
- Primary buttons should feel supportive rather than salesy.
- Rounded shapes are appropriate, but avoid cartoonishly pill-heavy controls everywhere.
- Press states should slightly compress or darken, never flash.

### Inputs

- Inputs should look calm and reliable.
- Prefer softened outlines, clear active states, and generous padding.
- Validation should feel instructional rather than alarming.

### Cards and Panels

- Prefer layered surfaces over heavy shadows.
- Use surface contrast and border tone before adding visual effects.
- Panels should guide the eye through grouped content without feeling like separate products.

### Data Surfaces

- Use hierarchy, whitespace, and section framing to reduce mental load.
- Do not lean on neon accents, glow, or dense grid lines to signal "advanced analytics."

## Workspace Application Strategy

### First Pilot

Start in `apps/gravii-user-app`.

Recommended pilot target:

- the opening `GRAVII ID` and `X-RAY` experience

Reason:

- it expresses Gravii's core value most directly
- it sets the tone for both analysis and persona identity
- it can later inform partner and admin surfaces without forcing a shared layout package immediately

### Second Wave

After the pilot is approved:

- adapt the same token direction to `gravii-partner-app`
- tighten density while preserving the same color and motion language

### Landing Alignment

`gravii-user-landing` should inherit the same brand direction, but it may keep more expressive composition, richer imagery, and larger typography moments than the product apps.

## Pre-Refactor Deliverables

Before touching product code, complete the following:

1. Approve the tone and anti-tone list.
2. Approve the provisional semantic color direction.
3. Confirm how widely `Cloth` should appear beyond the logo.
4. Test one UI sans pairing against `Cloth`.
5. Capture `5` to `10` screenshots of repeated UI patterns across the current apps.
6. Confirm the exact pilot screen and success criteria.

## Explicit Non-Goals for This Phase

- no shared `packages/ui` extraction yet
- no shared `packages/layout` extraction yet
- no full Material or MUI adoption decision yet
- no app-wide refactor before the first pilot proves the design language

## Recommended Next Step

Move from this brief into a single pilot execution plan for `apps/gravii-user-app`, covering:

- approved font pairing
- approved provisional color roles
- pilot component list
- the exact screens included in the first refactor
