# Gravii Figma To Code Handoff

This document defines how Gravii design work should move from Figma into the
frontend monorepo without losing brand geometry, token intent, or component
ownership.

## Goals

- Give designers a clear checklist before handoff.
- Give frontend engineers a stable mapping from Figma assets to code owners.
- Give AI tools enough context to avoid inventing off-brand UI.
- Make design system drift visible before implementation begins.

## Required Handoff Package

For each component or surface handoff, include:

- Figma file link
- page and frame name
- component or variant name
- intended app or surface
- responsive breakpoints or layout constraints
- states: default, hover, active, pressed, disabled, loading, error when relevant
- motion notes and reduced-motion expectation
- token references for color, type, spacing, radius, and shadow
- export requirements for images or SVGs
- notes about what should stay app-owned versus shared

## Naming Convention

Use stable names that can map to code.

Recommended Figma naming:

```text
Brand / Logo / 3D Symbol
Brand / Logo / Motion Wordmark
Components / Action Button / Compact
Components / Action Button / Standard
Navigation / Launch App / Sidebar
Navigation / Landing / Sticky Header
Tokens / Color / Solid Ink Surface
Tokens / Motion / Expressive Spin
```

Recommended code mapping:

```text
Brand / Logo / 3D Symbol -> @gravii/brand-logo-3d
Brand / Logo / Motion Wordmark -> apps/gravii-user-app/src/components/ui/gravii-logo
Components / Action Button -> apps/gravii-user-app/src/components/ui/action-button
Navigation / Launch App / Sidebar -> apps/gravii-user-app/src/app/page.tsx
Navigation / Landing / Sticky Header -> apps/gravii-user-landing/components/layout/sticky-header
Tokens / Color -> packages/brand-tokens and app-global CSS variables
```

## Logo Handoff Rules

For Gravii logo work:

- Do not hand off recreated logo geometry as loose approximations.
- Preserve the exact ring and lower smile relationship.
- Preserve rounded ends on the lower smile.
- State whether the asset is the static SVG mark, motion SVG mark, or 3D symbol.
- Provide symbol-only and lockup variants separately.
- Define the minimum clear space around the lower smile.
- Define the intended background and tone.
- Define whether motion is allowed.
- Include a reduced-motion treatment when motion is part of the concept.

Engineering acceptance criteria:

- Code uses `@gravii/brand-logo-3d` for the canonical 3D symbol.
- Code uses the app-local `GraviiLogo` wrapper for static or SVG motion logo
  variants where that is the correct source.
- The rendered mark is not clipped in desktop or mobile viewports.
- The logo returns to the front-facing orientation after spin.
- Hidden canvases do not keep running unnecessarily.

## Token Handoff Rules

Designers should name the role, not only the visual value.

Good:

```text
Surface / Ink
Surface / Paper
Text / Primary
Action / Primary Background
Focus / Ring
Motion / Standard Duration
```

Avoid:

```text
Purple 1
Cool Gradient 3
Button Color New
Random Glow
```

Engineering acceptance criteria:

- New raw values map to a semantic or app-local token.
- Existing tokens are reused before creating new ones.
- Token changes list every consuming surface that should intentionally change.
- App-local tokens remain app-local unless at least two apps need the same role.

## Component Handoff Rules

For every component, hand off:

- purpose
- allowed contexts
- disallowed contexts
- content constraints
- state matrix
- responsive behavior
- accessibility expectations
- motion behavior
- owner: shared, app-owned, candidate, or experimental

Example:

```text
Component: Action Button / Compact
Purpose: Compact product action in Launch App navigation and small panels.
Allowed: auth action, X-Ray action, compact product routes.
Disallowed: large landing hero CTA unless explicitly adapted.
Owner: app-owned candidate.
Code: apps/gravii-user-app/src/components/ui/action-button
```

## AI Prompt Capsule

When asking AI to generate or update Gravii UI from Figma, include:

```text
Use Gravii's current frontend conventions.
Respect TypeScript-only React and CSS Modules.
Use canonical logo and token sources.
Do not invent new visual styles unless the Figma frame explicitly introduces them.
Preserve responsive layout constraints and reduced-motion behavior.
Use docs/design-system/component-inventory.md for component ownership.
Use docs/design-system/ai-ready-design-system.md for brand and AI generation rules.
```

## Review Checklist

Before implementation starts:

- Is the owning app clear?
- Is the component shared, app-owned, candidate, or experimental?
- Is there an existing code component for this Figma component?
- Are all states specified?
- Are tokens named by role?
- Are motion and reduced-motion requirements specified?
- Are logo geometry and spacing protected?
- Is the expected verification gate identified?

Before merge:

- Relevant docs were updated.
- The smallest relevant verification gate passed.
- Browser inspection was completed for visible UI changes.
- Screenshots or notes exist for layout, motion, or responsive behavior.
- Any intentional design drift from Figma is documented.

## Common Rejection Reasons

Reject or send back a handoff when:

- the logo is a visual approximation instead of the canonical geometry
- the component has only a default state
- responsive behavior is unspecified
- colors are unnamed raw values
- motion has no reduced-motion note
- the design assumes a new shared component without proving cross-app reuse
- the Figma surface does not identify the owning app
