# Gravii Design System Component Inventory

This inventory records the current canonical, app-owned, and candidate design
system surfaces in the Gravii frontend monorepo.

Use it to decide whether a change should be app-local, shared, or still treated
as experimental.

## Status Labels

| Status | Meaning |
| --- | --- |
| Canonical | Approved source for current usage. Prefer this before creating alternatives. |
| App-owned | Owned by one app. Do not extract unless another app needs the same behavior. |
| Candidate | Repeated or important enough to evaluate for a future shared primitive. |
| Experimental | Useful but not stable enough to standardize. |
| Legacy | Existing code that should not be expanded without review. |

## Shared Packages

| Surface | Status | Owner | Source | Notes |
| --- | --- | --- | --- | --- |
| Brand tokens | Canonical | Workspace | `packages/brand-tokens` | Shared CSS variables and TypeScript token exports for cross-app visual alignment. |
| 3D brand logo | Canonical | Workspace | `packages/brand-logo-3d` | Shared React Three Fiber Gravii symbol used by landing and Launch App navigation surfaces. |
| Domain types | Canonical | Workspace | `packages/domain-types` | Product and API domain types, not a visual primitive. |
| API clients | Canonical | Workspace | `packages/api-clients` | Fetch wrappers and API helpers, not a visual primitive. |

## Brand Assets

| Surface | Status | Owner | Source | Usage Rule |
| --- | --- | --- | --- | --- |
| `GraviiLogo3D` | Canonical | Workspace | `@gravii/brand-logo-3d` | Use for live 3D logo treatment in landing header and Launch App nav. |
| `GraviiLogo` | Canonical | Launch App | `apps/gravii-user-app/src/components/ui/gravii-logo` | Use for app-local SVG logo variants, loading states, watermarks, and static/motion SVG marks. |
| Figma logo source | Canonical design source | Design | Current Gravii Figma file | Designer handoff must preserve geometry, spacing, and export names. |

## Launch App UI

| Surface | Status | Owner | Source | Notes |
| --- | --- | --- | --- | --- |
| Launch App shell | App-owned | `gravii-user-app` | `apps/gravii-user-app/src/app/page.tsx` | Product workspace orchestration, active panel state, mobile nav, auth action, theme transition. |
| Launch App shell styles | App-owned | `gravii-user-app` | `apps/gravii-user-app/src/app/page.module.css` | Owns current sidebar, workspace, mobile header, and section surface rules. |
| Launch panel | Candidate | `gravii-user-app` | `apps/gravii-user-app/src/components/layout/launch-panel` | Reusable inside Launch App only for now. Could become a broader product nav primitive later. |
| Panel shell | Candidate | `gravii-user-app` | `apps/gravii-user-app/src/components/layout/panel-shell` | In-surface section title treatment. Keep app-owned until repeated elsewhere. |
| Action button | Candidate | `gravii-user-app` | `apps/gravii-user-app/src/components/ui/action-button` | Current shared bold pill action pattern inside Launch App. Evaluate before cross-app extraction. |
| Morph icon | App-owned | `gravii-user-app` | `apps/gravii-user-app/src/components/ui/morph-icon` | App-local icon morph primitive. Do not use in landing unless intentionally promoted. |
| Expressive cursor | Experimental | `gravii-user-app` | `apps/gravii-user-app/src/components/ui/expressive-cursor` | App-local cursor treatment. Verify accessibility and reduced motion before promotion. |
| Theme ink transition | Experimental | `gravii-user-app` | `apps/gravii-user-app/src/components/ui/theme-ink-transition` | App-local WebGL transition. Keep app-owned. |

## Launch App Feature Surfaces

| Surface | Status | Owner | Source | Notes |
| --- | --- | --- | --- | --- |
| Home | App-owned | `gravii-user-app` | `apps/gravii-user-app/src/features/home` | Product entry surface and anonymous state. |
| Gravii ID profile | App-owned | `gravii-user-app` | `apps/gravii-user-app/src/features/profile` | Live identity state, loading, error, and connected persona readout. |
| X-Ray | App-owned | `gravii-user-app` | `apps/gravii-user-app/src/features/x-ray` | Wallet analysis workflow and credit purchase surfaces. |
| Discovery | App-owned | `gravii-user-app` | `apps/gravii-user-app/src/features/discovery` | Reserved/candidate product surface. |
| Ranking | App-owned | `gravii-user-app` | `apps/gravii-user-app/src/features/standing` | Reserved/candidate product surface. |

## Landing UI

| Surface | Status | Owner | Source | Notes |
| --- | --- | --- | --- | --- |
| Sticky header | App-owned | `gravii-user-landing` | `apps/gravii-user-landing/components/layout/sticky-header` | Public landing nav and CTA. Uses shared 3D logo. |
| Cursor trail | Experimental | `gravii-user-landing` | `apps/gravii-user-landing/components/layout/cursor-trail` | Landing-specific expressive cursor. Keep separate from Launch App cursor until behavior is unified. |
| Back to top | App-owned | `gravii-user-landing` | `apps/gravii-user-landing/components/layout/back-to-top` | Landing scroll utility. |
| Lenis runtime | App-owned | `gravii-user-landing` | `apps/gravii-user-landing/components/layout/lenis` | Landing scroll behavior. |
| Hero WebGPU/WebGL background | App-owned | `gravii-user-landing` | `apps/gravii-user-landing/components/sections/hero` | Landing-specific visual system. Do not generalize yet. |

## Token Sources

| Token Layer | Status | Source | Notes |
| --- | --- | --- | --- |
| Shared brand tokens | Canonical | `packages/brand-tokens/css/tokens.css` | Cross-app shared token baseline. |
| Launch App globals | App-owned | `apps/gravii-user-app/src/app/globals.css` | App-specific product shell and design system role tokens. |
| Landing global styles | App-owned | `apps/gravii-user-landing/lib/styles/css/global.css` | Landing-specific global style system. |

## Promotion Rules

Promote a component to shared only when all are true:

- at least two apps need the same visual shape
- at least two apps need the same behavior
- a single change should intentionally affect all consumers
- documentation exists in this inventory and the relevant README
- focused app gates and the workspace gate pass

Keep a component app-owned when:

- it belongs to one app shell
- it is tied to a single product workflow
- it carries app-specific routing, auth, or data behavior
- it is likely to diverge by persona or surface

## Current Gaps

- No canonical form-control system yet.
- No canonical modal/dialog system yet.
- No cross-app table or data-grid system yet.
- No automated inventory generation yet.
- No Figma component IDs are recorded in code docs yet.
- No automated Figma to code drift check exists yet.
