# Launch App Design System Plan

## Purpose

This document defines the planning direction for a Launch App UI/UX redesign backed by a design system.

The goal is not just to restyle screens. The goal is to create a stable product language that can support:

- live Gravii ID
- live X-Ray analysis
- future Standing
- future Discovery
- future My Space
- shared Gravii frontend conventions across user-facing surfaces

## Current Layout And Reference Decision

The current redesign direction keeps the five-panel Launch App strip as the primary layout.

The earlier `Identity Command Center` option is not the active direction for this app. Instead, the design system should improve the existing five ordered surfaces with Slush-inspired foundations from the local reference file at `/Users/kxwxn/Downloads/index.html`.

- high-contrast black and white foundations
- bright accent tokens inspired by Slush: blue, yellow, violet, green, orange, and glacier
- heavy uppercase display typography with tight line-height
- thick black borders on interactive cards and containers
- pill buttons with a second back layer and elastic hover motion
- square or rounded card forms with bold color fills
- smoother hover, focus, and active panel motion using elastic easing
- polished reserved states for `STANDING`, `DISCOVERY`, and `MY SPACE`

## Implemented Foundation Slice

The first implementation slice applies the Slush-inspired direction without replacing the five-panel layout.

- `src/app/globals.css` owns the Slush color, radius, border, shadow, and elastic easing primitives.
- font role tokens are resolved on `body` so the Next.js local font variables are available before `--font-ui`, `--font-display`, and `--font-accent` are consumed.
- `src/app/page.module.css` keeps the five ordered panels and adds a mobile horizontal scroll treatment so the strip remains intact on small screens.
- `src/components/layout/launch-panel` and `src/components/layout/panel-shell` carry the shared bordered panel shell, oversized active titles, and elastic preview or close affordances.
- `src/components/ui/action-button` carries the shared pill action pattern with a bordered front layer and colored back layer.
- `src/features/profile`, `src/features/x-ray`, and `src/features/coming-soon` now use the same thick-border, pop-shadow, accent-fill surface language for live and reserved panel content.
- Connected Gravii ID states prioritize the live persona dashboard first; the larger brand introduction remains for locked, loading, and error states where orientation is still useful.
- Decorative logo repetition is intentionally reduced inside connected product states; live signals such as reputation, tier, credits, history, and net worth should carry the visual weight.
- Reserved panels no longer rely on single-message placeholders; each reserved surface now exposes panel-specific readiness metrics, launch-step status, and quick routes back to live surfaces.
- Panel previews use a stationary bordered shell with one inner front/back flip layer so Slush-style hover motion reads as a real card turn without moving the outer panel frame.
- Connected Gravii ID states suppress ambient atmosphere gradients behind live dashboard content so colored backgrounds do not read as accidental external panels.

## Design System Principles

### 1. Product First, Library Second

The design system should start from Launch App product needs, not from a generic component inventory.

Prioritize primitives that directly support wallet identity, analysis, rankings, campaigns, and reserved states.

### 2. Tokens Before Components

Do not begin with one-off component rewrites.

Define tokens first so later component work has stable names and predictable constraints.

Minimum token families:

- color
- typography
- spacing
- radius
- border
- shadow and elevation
- motion
- opacity
- z-index
- layout density

### 3. CSS Modules Remain The Default

This repo currently standardizes on CSS Modules.

The design system should therefore begin as:

- CSS custom properties in `src/app/globals.css` for global tokens
- component-level CSS Modules for implementation
- TypeScript/TSX-only React components

Do not introduce Tailwind, Shadcn UI, or another styling system unless that migration is explicitly approved as a separate workstream.

### 4. Keep Brand Effects Intentional

The current app already has distinctive brand effects:

- panel strips
- textured grain overlays
- Gravii motion mark
- identity/persona canvas
- X-Ray analytical dashboard visuals

The redesign should preserve what is strategically useful, but promote it into named primitives instead of leaving effects scattered across features.

### 5. Redesign In Vertical Slices

Avoid a full UI rewrite in one pass.

Recommended slice order:

1. global tokens and baseline foundations
2. shell and panel system
3. shared primitives
4. Gravii ID surface
5. X-Ray surface
6. reserved surfaces
7. future Discovery, My Space, and Standing production surfaces

## Proposed Design Token Model

### Color Tokens

Use semantic tokens rather than raw color names in components.

Suggested layers:

- `--color-canvas`
- `--color-canvas-raised`
- `--color-surface`
- `--color-surface-inverse`
- `--color-text`
- `--color-text-muted`
- `--color-text-inverse`
- `--color-border`
- `--color-border-strong`
- `--color-accent`
- `--color-accent-contrast`
- `--color-success`
- `--color-warning`
- `--color-danger`
- `--color-info`

Brand-specific tokens can sit underneath semantic tokens, but feature components should prefer semantic names.

### Typography Tokens

Current local fonts can become named type roles.

Suggested roles:

- display
- headline
- title
- body
- label
- mono
- number
- brand

Each role should define:

- font family
- size scale
- line height
- letter spacing
- weight range
- intended usage

### Spacing And Layout Tokens

Suggested spacing scale:

- `--space-1`
- `--space-2`
- `--space-3`
- `--space-4`
- `--space-5`
- `--space-6`
- `--space-8`
- `--space-10`
- `--space-12`
- `--space-16`

Suggested layout tokens:

- `--shell-padding`
- `--panel-gap`
- `--panel-radius`
- `--panel-header-height`
- `--content-max-width`
- `--surface-min-height`

### Motion Tokens

Motion should be meaningful and limited.

Suggested tokens:

- `--motion-fast`
- `--motion-base`
- `--motion-slow`
- `--ease-standard`
- `--ease-emphasized`
- `--ease-exit`
- `--motion-stagger-small`
- `--motion-stagger-large`

Add `prefers-reduced-motion` rules at the foundation layer before adding more animation-heavy components.

## Proposed Component System

### Foundation Components

These should be stable and low-level.

- `Button`
- `IconButton`
- `Badge`
- `Tag`
- `Field`
- `Textarea`
- `Select`
- `Tabs`
- `Dialog`
- `Toast`
- `Tooltip`
- `Logo`
- `LoadingMark`

### Product Shell Components

These are Launch App-specific and should live under layout or product-shell ownership.

- `AppShell`
- `PanelStrip`
- `PanelCard`
- `PanelShell`
- `PanelHeader`
- `SurfaceFrame`
- `ReservedSurface`

### Data Display Components

These should support Gravii ID and X-Ray first.

- `MetricCard`
- `SignalCard`
- `IdentityBadge`
- `WalletAddress`
- `ReputationList`
- `ChainValueList`
- `ActivityTimeline`
- `CreditCounter`
- `EmptyState`
- `ErrorState`

### Brand Effect Components

These should stay explicit because they carry cost and motion.

- `GrainOverlay`
- `MotionLogo`
- `PersonaCanvas`
- `ThermalXrayField`
- `ScanLine`

Each effect component should document:

- where it can be used
- performance implications
- reduced-motion behavior
- whether it is decorative or meaningful

## Recommended Folder Direction

Keep the current repo-local structure and add design system boundaries gradually.

Suggested target:

```text
src/
  app/
    globals.css
  components/
    ui/
      button/
      badge/
      field/
      logo/
      metric-card/
      states/
    layout/
      app-shell/
      panel-shell/
      panel-strip/
  features/
    profile/
    x-ray/
    standing/
    discovery/
    my-space/
  lib/
    design-tokens/
```

Only add `src/lib/design-tokens` if token helpers or generated token metadata are needed. Pure CSS token definitions can remain in `globals.css`.

## Migration Roadmap

### Phase 1: Audit And Token Draft

Deliverables:

- inventory current colors, fonts, spacing, radii, shadows, and motion values
- define semantic token names
- document which tokens are stable versus experimental
- identify duplicated visual patterns across Profile and X-Ray

Exit criteria:

- there is one agreed token naming model
- no large component rewrite has happened yet

### Phase 2: Foundation Token Implementation

Deliverables:

- add token definitions to `src/app/globals.css`
- preserve current visuals as much as practical
- add reduced-motion baseline rules
- document token usage in `docs/design-system`

Exit criteria:

- components can start referencing semantic tokens
- global CSS remains limited to foundation concerns

### Phase 3: Primitive Extraction

Deliverables:

- stabilize shared `Button`, `Badge`, `Logo`, `MetricCard`, and state components
- migrate existing one-off styles into primitives only when at least two surfaces need them
- preserve feature-specific styles inside feature folders

Exit criteria:

- Profile and X-Ray no longer duplicate basic cards, badges, buttons, or state treatments

### Phase 4: Shell Redesign

Deliverables:

- redesign `LaunchPanel` and `PanelShell` against tokens
- decide whether `MySpaceDock` remains or is removed
- add keyboard and focus behavior checks
- verify responsive behavior

Exit criteria:

- the panel system has one clear active primitive family
- future surfaces can use the same shell without special-case layout work

### Phase 5: Surface Redesign

Deliverables:

- redesign `GRAVII ID` using identity and metric primitives
- redesign `X-RAY` using analytical dashboard primitives
- keep Standing, Discovery, and My Space as polished reserved states until backend contracts exist

Exit criteria:

- live surfaces feel part of one system
- reserved surfaces do not look like unfinished placeholders

### Phase 6: Production Surface Expansion

Deliverables:

- apply the same primitives to future Standing, Discovery, and My Space backend-backed surfaces
- avoid resurrecting stale mock-era UI unless it is intentionally redesigned

Exit criteria:

- all product surfaces share tokens, layout rules, interaction patterns, and state handling

## Design System Governance

### Component Graduation Rule

A component can move into `src/components/ui` when:

- at least two features need it
- it is mostly presentational
- its props are stable enough to document
- it does not encode one feature's business rules

### Feature Ownership Rule

A component should stay feature-local when:

- only one feature uses it
- it depends on that feature's data model
- it would need awkward props to become generic
- it is still changing quickly

### Token Change Rule

Token changes should be treated as broad UI changes.

Before changing a stable token:

- identify affected components
- check responsive states
- run typecheck and tests
- visually inspect the shell, Gravii ID, and X-Ray

## Verification Checklist

For each design system migration slice:

- run `bun run typecheck`
- run `bun run test`
- inspect desktop shell behavior
- inspect mobile or narrow viewport behavior
- verify keyboard panel opening and closing
- verify reduced-motion behavior
- verify sign-in and auth-gated states
- verify Profile loading, ready, and error states
- verify X-Ray search, loading, history, result, and error states

## Open Decisions

- Should the future design system stay fully CSS Modules-based, or should a separate styling migration be planned?
- Should Gravii shared design tokens live only inside this app first, or move into a monorepo package later?
- Should auth/session hardening happen before or after the first visual redesign slice?
- Should `MySpaceDock` survive as a special product layout, or should all five surfaces use one panel system?
- Should brand effects such as grain and canvas be always available primitives or feature-specific effects?
