# Gravii AI-Ready Design System Harness

This document defines the first AI-ready operating layer for Gravii frontend
design system work. It does not replace the engineering harness in
`docs/codex-harness.md`; it adds the product and brand context that humans and
AI agents must use before generating or changing Gravii UI.

## Status

This is v1. It is still documentation-led, with a small static validator for
the first canonical logo, token, and handoff boundaries.

Use it when work touches:

- logo or brand marks
- navigation shells
- landing headers
- shared action buttons
- token naming
- UI generated or heavily edited with AI assistance
- Figma to code handoff

## Purpose

Gravii UI should not become a generic SaaS interface as more work is generated,
edited, or reviewed with AI tools. The design system harness exists to preserve:

- Gravii brand recognition
- product-specific density and workflow clarity
- consistent use of canonical assets
- intentional motion and interaction behavior
- a clear path from Figma decisions to code implementation

## Relationship To Existing Harnesses

Use these layers together:

1. `docs/codex-harness.md` for Codex operating rules and verification gates.
2. `docs/design-foundations-checklist.md` for pre-design-system decisions.
3. `apps/gravii-user-app/docs/design-system/launch-app-design-system-plan.md`
   for Launch App visual direction.
4. This document for AI-ready Gravii UI generation and review rules.
5. `docs/design-system/component-inventory.md` for canonical components and
   ownership.
6. `docs/design-system/figma-code-handoff.md` for designer to developer
   transfer expectations.

## AI Context Contract

Before asking an AI tool to create or modify Gravii UI, provide this context:

```text
This is Gravii frontend work.
Use the current Gravii frontend monorepo conventions.
Respect CSS Modules and TypeScript-only React.
Use existing tokens and canonical components before inventing new UI.
Preserve the Gravii brand mark, action button, navigation, and motion rules.
Do not create generic SaaS landing sections or unrelated design styles.
```

When the work is app-specific, also provide the owning app:

```text
Surface: gravii-user-app
Primary app style: product-dense workspace, operational UI, wallet identity.
Verification: focused app gate plus browser inspection for layout or motion.
```

```text
Surface: gravii-user-landing
Primary app style: public landing, expressive brand motion, conversion CTA.
Verification: check:user-landing plus browser inspection for visible UI work.
```

## Current Canonical Brand Rules

### Logo

- Use canonical code assets only.
- Do not redraw the logo from memory.
- Do not stretch, squash, crop, skew, or section-recolor the logo.
- Keep the ring and lower smile relationship intact.
- Keep enough vertical room for the lower smile.
- Use the 3D symbol from `@gravii/brand-logo-3d` when the surface calls for
  the live navigation or landing header treatment.
- Use the app-local `GraviiLogo` SVG asset wrapper when static or motion SVG
  variants are required.

### 3D Logo Motion

- Idle breathing is allowed when it does not distract from primary content.
- Hover spin is one horizontal spin around the vertical axis.
- Click or navigation-triggered spin is two horizontal spins around the vertical
  axis.
- After spin, the mark must return to the front-facing orientation.
- Reduced-motion preferences must be respected.
- Avoid ghosting, flipped-smile artifacts, white canvas flashes, or hidden
  WebGL canvases that keep running unnecessarily.

### Navigation

- Launch App navigation is product workflow UI, not a marketing card grid.
- The logo tile is the Home entry point.
- Section navigation should stay scannable and stable across theme or active
  section changes.
- Do not let the logo color shift per section unless the canonical component
  explicitly supports that behavior.
- Mobile navigation must be checked for clipping, off-canvas focus behavior,
  and hidden mount costs.

### Buttons

- Prefer the canonical action button pattern before inventing new CTA shapes.
- Buttons should have explicit states: default, hover, pressed, disabled, and
  loading when relevant.
- Icon slots should use existing app icon primitives when available.
- Do not create oversized marketing buttons inside dense product surfaces.

### Color And Surface

- Use semantic or established tokens before adding raw colors.
- New raw colors must be justified as part of a token or app-local art
  direction.
- Avoid one-off gradients that do not map to a named surface, motion, or brand
  role.
- Keep app surfaces legible and product-focused.
- Public landing surfaces can be more expressive, but still must use canonical
  brand assets and CTA behavior.

### Typography

- Respect existing font role tokens.
- Do not scale text with viewport width alone.
- Keep letter spacing non-negative unless the existing local system defines a
  specific role.
- Match type scale to surface density: hero type belongs to heroes, not compact
  panels, nav buttons, or dashboard cards.

### Motion

- Motion must clarify state, hierarchy, or brand character.
- Every non-essential motion path needs a reduced-motion fallback.
- Do not stack unrelated motion effects on the same interaction.
- Browser inspection is required for visible layout, animation, and responsive
  changes.

## AI UI Generation Do Not List

Do not ask AI tools to generate Gravii UI that:

- uses a generic SaaS hero as the first screen of an app surface
- adds decorative blobs, bokeh, or unrelated gradient orbs
- creates new logo layers instead of using canonical assets
- invents colors without mapping them to a token or explicit art direction
- places UI cards inside UI cards
- uses hidden explanatory text to describe how to use the app
- creates overlapping or clipped responsive text
- ignores reduced-motion preferences
- duplicates shared implementation logic across apps without a reason

## Review Checklist For AI-Generated UI

Use this checklist before accepting AI-generated Gravii UI:

- Does the surface use the correct owning app and local conventions?
- Are canonical logo, token, and component sources used?
- Is every new primitive app-owned or intentionally shared?
- Does mobile layout preserve text and logo bounds?
- Does animation return to a stable final state?
- Is reduced motion supported?
- Are focus states and keyboard paths intact?
- Does the implementation pass the relevant gate from `docs/codex-harness.md`?
- Was the result inspected in a browser if visual behavior changed?
- Were nearby docs updated when ownership, behavior, or structure changed?

## First Automation Candidates

Current automated check:

```bash
bun run check:design-system
```

The root `bun run check` gate also runs this validator before typecheck and
lint, so normal workspace verification now protects the first design-system
boundaries by default.

This verifies that the canonical design-system docs and brand package files
exist, the root script is registered, deprecated app-local 3D logo
implementations are absent, deprecated logo imports are not used, and the
handoff docs still point at `@gravii/brand-logo-3d`.

Good next checks:

- detect raw colors added outside token or app-global files
- detect missing Figma to code mapping entries for promoted components
- detect shared package additions without `packages/README.md` updates

## Current Scope Boundary

This harness currently covers the first canonical slice:

- logo
- 3D logo
- landing header
- Launch App navigation
- action button
- brand tokens
- motion rules
- Figma to code handoff

It does not yet define the full form system, table system, modal system, or all
future Discovery, Ranking, and My Space production surfaces.
