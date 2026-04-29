# Gravii Partner App v1

This app now treats the partner mockup HTML as the visual and routing source of truth while keeping a production-ready Next.js App Router structure.

## What changed

- Product-grade route structure for dashboard, Lens, Connect, Reach, and Settings
- Reusable layout and UI primitives instead of page-local inline markup
- Real Firebase Google auth wired to the live Partner API bearer-token flow
- Live Partner API auth responses normalized into the shared camelCase `PartnerProfile` shape before the app consumes them
- Mockup-driven Reach flow that now mirrors the original `Create Campaign` structure more closely
- Live Lens workflow with client-side CSV parsing, pool CRUD, progress polling, aggregate summaries, and wallet drill-downs against the deployed Partner API
- Mockup-aligned Connect and Settings routes that follow the original page structure and copy more directly
- Mockup-driven typography and token parity for routed partner pages, including the prototype accent/chart palette and mono KPI treatment
- Responsive app shell with mobile navigation

## Run locally

```bash
bun install
bun run dev
```

## Structure

```text
src/
  app/
  components/
  features/
  lib/
```

## Feature ownership

- `src/components/layout/app-shell` owns shell rendering and navigation config
- `src/features/*` own their page UI and feature-local data files
- `src/lib/*` is kept for shared utilities only

## Auth

The current partner auth flow follows the live backend guide:

- Firebase client SDK handles Google OAuth
- the frontend sends the Firebase ID token as `Authorization: Bearer <token>`
- `POST /api/v1/auth/google` creates or restores the partner account
- `GET /api/v1/auth/session` validates the token on app load

There is no app-local cookie session layer for partner auth anymore. Route protection now happens client-side through the auth provider because Firebase persists tokens in IndexedDB rather than HTTP cookies.

The auth provider now also keeps session restoration quieter after the first successful bootstrap:

- repeated Firebase token refresh events reuse the same in-flight session bootstrap instead of stacking duplicate Partner API calls
- once the workspace is open, token refreshes no longer force the whole app back through the blocking loading gate unless the session is actually lost
- sign-out now clears workspace-local scenario/module state so switching partner accounts does not keep the previous workspace shape

## Workspace Access

The partner profile returned by the live auth flow is now the source of truth for opening the routed workspace.

- `auth-provider` restores the live partner profile from Firebase + Partner API
- `src/lib/workspace-access.ts` derives partner-status gating, plan-level module access, visible pages, and the default shell destination
- onboarding and the routed shell both consume that shared access layer instead of separately guessing which pages should be visible

Today the backend auth profile only exposes `plan` and `status`, not granular feature entitlements. The workspace-access layer therefore keeps a centralized permissive plan map for now, ready to be swapped over once backend feature flags arrive.

## Partner identity in fixture-backed routes

The live Partner API currently restores the authenticated partner profile, and Lens is now powered by live backend data. The older dashboard/population read endpoints are still not live right now. Until those data endpoints return again, the routed product keeps fixture-backed content for the remaining dashboard-grade views while still replacing hardcoded brand identity with the authenticated partner workspace name.

- onboarding now shows the active workspace name and plan
- the routed shell shows the active workspace name and plan under the Gravii logo
- settings now show live email, plan, status, and last-login details
- dashboard/analytics/reach/campaign-manager fixture data now derives partner-facing labels from the authenticated workspace instead of hardcoded `Pendle Finance`
- dashboard, analytics, labels, risk, reach, and campaign-manager render an explicit preview-data status callout so QA and demos do not mistake fixture-backed numbers for live Partner API reads
- Lens renders a live-data status callout and now consumes the deployed `/api/v1/lens/*` routes for pool management and X-Ray browsing

## Lens live flow

The Lens route is the first routed partner surface that now consumes non-auth Partner API business data in production.

- CSV stays client-side: the page parses a local `.csv` or pasted buffer and posts `{ name, chains, addresses[] }` to the API
- the frontend creates pools through `POST /api/v1/lens/pools`
- active pools refresh through `GET /api/v1/lens/pools`, `GET /api/v1/lens/pools/:id`, and `GET /api/v1/lens/pools/:id/progress`
- wallet browsing uses `GET /api/v1/lens/pools/:id/wallets` with filters, sort, and pagination
- wallet drill-down uses `GET /api/v1/lens/pools/:id/wallets/:address`
- the UI normalizes the snake_case Lens payloads into the shared camelCase domain shapes before rendering

## Onboarding Routing

The root onboarding cards are now expected to open distinct product surfaces instead of collapsing into the same generic page.

- Reach scenarios route into scenario-specific pages that mirror the mockup:
- `Discover new users` routes into `/reach` and locks the campaign builder to the Gravii pool scope.
- `Your ecosystem only` and `Expand with Gravii pool` route into `/connect?module=xray-link`, matching the original prototype's X-Ray Users entry point.
- Lens routes into `/lens`.
- Gate options deep-link into `/connect?module=...` and render a module-specific screen for:
  - `gate-api`
  - `community-bot`
  - `agent-api`
- `/connect` now defaults to the `X-Ray Users` surface so it behaves like the original prototype instead of exposing a separate catalog page.
- Successful partner sign-in should always land on the root onboarding chooser first so the user sees the `Welcome to Gravii` scenario screen before entering the routed shell.
- Requested deep links are still preserved through the sign-in `next` parameter when the user is intentionally entering a specific route.

## Current parity status

- `onboarding`, `reach`, `lens`, `connect`, `settings`, `dashboard`, `analytics`, `labels`, and `risk` now follow the mockup structure instead of the older shared-card scaffolding.
- `campaign-manager` now follows the mockup header/filter/action structure instead of the earlier generic documentation-style header.
- `campaign-manager` now also uses mockup-style campaign cards instead of the shared `Card` wrapper, including the partner/type/status chrome, 14-day mini-bar strip, `14d ago / today` labels, and centered report toggle.
- The routed partner pages also share the mockup card system now: heavier borders, darker card fill, mono KPI values, and the original accent/chart palette.
- The routed shell is closer to the prototype too: sidebar icons and the extra session card are removed, while logout now lives under `Settings` so the app keeps a product-safe sign-out path.
- The partner app globals now include the same accent, chart, and CTA tokens used by the HTML prototype so route-level CSS can match the original look more directly.
- Dev-time route warmup is now intentionally lighter than production: eager route `prefetch()` calls only run in production builds so local mockup work does not trigger unnecessary route compilation on every sign-in or onboarding render.
- The Labels route now defers its heaviest filter math and lazy-loads the persona modal so repeated segment toggles stay more responsive during local testing.
- The Reach route now keeps form inputs urgent and shifts the heaviest preview/estimate recomputation onto a deferred copy of the campaign form so typing feels lighter.
- The Reach draft strip and preview panel are lazy-loaded, and Analytics tab switches now run through non-urgent transitions/deferred state so route interactions stay snappier during product QA.
- The Risk route now applies the same pattern: filter/sort controls transition non-urgently, derived rows come from deferred state, and blocked-wallet membership checks use a `Set` during table rendering.
- Lens is now live against the deployed Partner API for pool CRUD, progress polling, aggregate summaries, filtered wallet browsing, and per-wallet X-Ray drill-down.
- The remaining routed data-heavy pages still explicitly declare their current data mode. Partner auth/profile are live, but public dashboard/population reads are still unavailable from the deployed Partner API, so those product surfaces keep their preview-data status banners instead of silently pretending to be live.
- Remaining work is primarily authenticated browser QA and small spacing/copy polish, not another large route architecture rewrite.

## Legacy prototype

The original prototype is still kept in the repo as:

- `Partner_App(incl-Dashboard)_new.html`

Use it as the reference spec until the React version is visually and behaviorally identical. The app source of truth is under `src/`.
