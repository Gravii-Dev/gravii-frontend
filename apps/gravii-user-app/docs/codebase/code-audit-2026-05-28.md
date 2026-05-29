# Code Audit Snapshot - 2026-05-28

## Purpose

This document records the full code audit snapshot for the Gravii Launch App frontend.

Use it as a standing reference before cleanup, refactor, dependency, or UI-system work. It is not a request to remove everything immediately. Each item should be handled with the product intent, current hidden surfaces, and verification gates in mind.

## Scope

Audited app:

- `/Users/kxwxn/Gravii/FRONTEND/apps/gravii-user-app`

Primary focus:

- unnecessary logic
- unused components and hooks
- stale compatibility code
- dependency and security risk
- strictness gaps
- large files that increase future change risk

Ignored during this audit:

- unrelated dirty worktree changes in sibling apps, especially `apps/gravii-user-landing`
- backend implementation details outside the frontend app

## Verification Performed

Passing checks:

- `bun run lint`
- `bun run typecheck`
- `bun run test`
- `bunx tsc --noEmit --noImplicitAny true --pretty false`
- `bun run build`

Build note:

- The first build attempt failed only because `next/font/google` could not fetch Roboto Flex while network access was blocked.
- The build passed after network access was allowed.

Security check:

- `bun audit` completed after network access was allowed.
- Result after dependency pass: no vulnerabilities found.
- The original audit found 4 vulnerabilities across the workspace audit output.
- The app-relevant path was `ws` via `viem`, `wagmi`, `@reown/appkit`, and `@reown/appkit-adapter-wagmi`.
- Workspace-wide paths also included `turbo` and `firebase`.

Secret check:

- No Stripe `sk_*`, `whsec_*`, or obvious frontend secret literals were found in `src`, `docs`, `README.md`, `package.json`, or `next.config.ts`.

## Findings

### P1 - Dependency Vulnerabilities

Original `bun audit` reported unresolved vulnerabilities.

Frontend-relevant issue:

- `ws >=8.0.0 <8.20.1`
- Reaches this app through `viem`, `wagmi`, `@reown/appkit`, and `@reown/appkit-adapter-wagmi`
- Severity: moderate

Workspace-wide issues:

- `protobufjs <=7.5.7` through `firebase` in `gravii-backoffice`
- `turbo <=2.9.13`

Recommended action:

- Completed: workspace root `turbo` was updated to `2.9.15`.
- Completed: root override `protobufjs` was updated to `8.4.2`.
- Completed: root override `ws` was added at `8.21.0`.
- Completed: `bun install` refreshed the workspace lockfile.
- Completed: `bun audit` now reports no vulnerabilities.

### P2 - Unused UI Primitive Package

Files:

- `src/components/ui/launch-primitives/index.tsx`
- `src/components/ui/launch-primitives/launch-primitives.module.css`

Observed state:

- No imports from app source were found.
- `src/components/ui/README.md` still describes these primitives as used heavily in X-Ray, but that is no longer true.

Recommended action:

- Completed: the unused component and CSS were removed.
- Completed: `src/components/ui/README.md`, `README.md`, and `docs/codebase/architecture-overview.md` were updated.
- If similar primitives are needed later, reintroduce them intentionally from a live feature use case.

### P2 - Unused Discovery Filters Component

Files:

- `src/features/discovery/components/discovery-filters/index.tsx`
- `src/features/discovery/components/discovery-filters/discovery-filters.module.css`

Observed state:

- No imports from app source were found.
- Discovery currently renders its filter UI inline inside `src/features/discovery/discovery-content.tsx`.

Recommended action:

- Completed: the unused component and CSS were removed.
- Discovery currently keeps one filter implementation inline in `src/features/discovery/discovery-content.tsx`.

### P2 - Hidden My Space Still Enters The Runtime Graph

Files:

- `src/app/page.tsx`
- `src/features/launch-app/panel-config.ts`
- `src/features/my-space/my-space-content.tsx`
- `src/features/coming-soon/coming-soon-content.tsx`

Observed state:

- `MY SPACE` is intentionally hidden through `HIDDEN_PANEL_IDS`.
- Completed: `src/app/page.tsx` no longer imports `MySpaceContent`.
- Completed: `CONTENT_MAP` keeps a static `myspace` fallback to `HomeContent` so hidden panel IDs remain type-safe without importing the hidden feature.
- The preserved My Space implementation remains in `src/features/my-space` for later product reactivation.

Recommended action:

- Keep the product record.
- If My Space is re-enabled, replace the `HomeContent` fallback with either a direct import or lazy-loaded `MySpaceContent`.

Do not fully delete My Space without confirming product direction, because the user explicitly asked to keep a record for later use.

### P2 - Potentially Unused App Dependency

File:

- `package.json`

Observed state:

- `@gravii/domain-types` is listed as an app dependency.
- No imports from app source were found during the audit.

Recommended action:

- Completed: `@gravii/domain-types` was removed from `apps/gravii-user-app/package.json`.
- Completed: `bun install`, `bun run typecheck`, and `bun run build` passed after removal.

### P2 - Legacy Token Storage Helpers Are Now Misleading

File:

- `src/lib/auth/user-api.ts`

Observed state:

- The app correctly moved browser auth to same-origin BFF plus httpOnly session cookies.
- Completed: the no-op token read/store helpers were removed.
- Completed: the unused `authenticated` request option and server-only bearer branch were removed.
- Completed: legacy localStorage cleanup remains as an internal `clearLegacyUserToken()` call during sign-out/session clear.

Recommended action:

- Keep browser auth on the same-origin BFF and httpOnly cookie path.
- Keep only the pending X-Ray wallet and identity bootstrap sessionStorage helpers as browser-visible auth-adjacent state.

### P3 - Legacy Material System Compatibility Is Overgrown

Files:

- `src/app/layout.tsx`
- `src/app/globals.css`
- multiple feature CSS modules

Observed state:

- `data-liquid-glass` attributes still exist throughout feature surfaces.
- `src/app/layout.tsx` globally neutralizes `backdrop-filter`, pseudo-reflection, and filter effects with injected CSS.
- `src/app/globals.css` still defines many compatibility aliases such as `liquid-glass-*`, `slush-*`, `m3e-*`, and `green-*`.
- The visual direction has moved to the current solid Raw Materials-inspired system, so these names now mostly function as compatibility shims.

Recommended action:

- Do not remove all aliases blindly, because existing CSS modules still reference them.
- Create a focused design-token cleanup pass:
  - replace feature references with semantic tokens
  - remove neutralized liquid-glass pseudo-layer rules
  - keep only stable semantic aliases
  - update component README material notes

### P3 - TypeScript Strictness Gap

File:

- `tsconfig.json`

Observed state:

- Completed: `noImplicitAny` is now explicitly set to `true`.
- A manual check with `noImplicitAny true` passed without errors before the change.

Recommended action:

- Run the normal verification gate after changing it.

### P3 - Large Modules Increase Change Risk

Largest files found:

- `src/features/profile/profile-content.module.css` - 1120 lines
- `src/app/page.module.css` - 941 lines
- `src/features/profile/profile-content.tsx` - 628 lines
- `src/features/x-ray/x-ray-view-model.ts` - 621 lines
- `src/features/discovery/discovery-content.module.css` - 594 lines
- `src/features/x-ray/components/x-ray-result-view/x-ray-result-view.module.css` - 593 lines
- `src/lib/auth/user-api.ts` - 579 lines
- `src/features/discovery/discovery-content.tsx` - 557 lines

Recommended action:

- Split by responsibility, not by arbitrary size.
- Good first targets:
  - move profile dashboard sub-sections into feature-local components
  - split X-Ray view-model into parser, formatter, and pagination helpers
  - split User API helpers into session, identity, xray, and checkout modules
  - keep route shell orchestration in `src/app/page.tsx`, but move visual shell sub-pieces if it grows further

## Items That Should Not Be Treated As Bugs

### Discovery And Ranking Empty Data

Discovery has `PARTNERS_DATA: Partner[] = []`.

Ranking has empty `RANKING_ROWS`.

This matches the current product rule:

- do not show hardcoded mock campaign or leaderboard data
- keep the UI skeleton ready for future live APIs

Do not reintroduce mock rows unless explicitly requested for demo mode.

### `accounts` Dependency

`accounts` is documented as a build-time compatibility dependency for Wagmi 3 optional dynamic imports.

Do not remove it unless a production build confirms Wagmi/Reown still resolves correctly without it.

### `@tanstack/react-query`

This dependency is used by the AppKit/Wagmi provider setup.

Do not remove it.

### `@gravii/brand-tokens`

This is imported by `src/app/layout.tsx`.

Do not remove it without replacing the app-level brand token dependency.

## Recommended Cleanup Order

1. Start a design-token cleanup pass after the mechanical cleanup is stable.
2. Split large modules only after behavior is covered by the existing checks and any needed browser smoke tests.
3. If My Space is re-enabled, replace the current `HomeContent` fallback with the preserved feature implementation.

## Completion Gate For Cleanup Work

For each cleanup PR or branch, run:

- `bun run lint`
- `bun run typecheck`
- `bun run test`
- `bun run build`

For dependency work, also run:

- `bun audit`

For UI/design-token work, also inspect the local app in browser across at least:

- desktop laptop width
- narrow tablet width
- mobile width

## Handoff Notes For Future Agents

- This app is TypeScript-only. Do not add `.js` or `.jsx` React code.
- Use CSS Modules for new component styles.
- Keep committed docs in English.
- Do not touch sibling app changes unless the user explicitly asks.
- My Space is intentionally hidden but product-preserved.
- Discovery and Ranking should stay free of hardcoded mock rows until live backend contracts exist.
- Browser auth should continue using the same-origin BFF and httpOnly session cookie.
- Stripe secrets and price IDs must stay out of frontend code.
