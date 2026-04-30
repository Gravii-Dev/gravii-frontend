# Frontend Auth Rollout Status

This document captures the current frontend-side auth rollout for the Gravii surfaces in this workspace, the public landing ownership decision, the QA path, and the remaining frontend work.

## Active Surfaces

- `gravii.io` and `gravii.io/partners`: `apps/gravii-user-landing`
- `app.gravii.io`: `apps/gravii-user-app`
- `partner.gravii.io`: `apps/gravii-partner-app`
- `admin.gravii.io`: `apps/gravii-backoffice`

The standalone `apps/gravii-partner-landing` app has been retired from the active workspace. The partner acquisition surface now lives at `/partners` inside `apps/gravii-user-landing`.

## What Was Implemented

### Shared Packages

- `packages/domain-types` now defines shared auth and live surface models:
  - `AuthIdentity`
  - `UserSession`
  - `PartnerSession`
  - `AdminSession`
  - current live landing waitlist types
  - current live user auth, Gravii ID, and X-Ray types
  - `ProviderExchangeRequest`
  - `UserMe`, `PartnerMe`, `AdminMe`
- `packages/api-clients` now exposes auth-aware landing, user, partner, and admin clients with:
  - env-driven base URL resolution
  - bearer token injection
  - refresh-aware retry hooks
  - current live Landing API and User API route names

### User App

- Replaced the older app-local auth/session scaffold with the live User API JWT flow.
- User sign-in now uses the live backend contract:
  - `GET /api/v1/auth/challenge`
  - `POST /api/v1/auth/verify`
  - `GET /api/v1/auth/session`
- JWT state is stored in `localStorage` and validated directly against the User API.
- `GRAVII ID` now reads live data from `GET /api/v1/me/identity`.
- `X-RAY` now reads live credits, lookup history, lookup detail, and submits real lookup requests.
- `STANDING`, `DISCOVERY`, and `MY SPACE` are now explicit coming-soon surfaces instead of the older mock product flows.
- The panel order now matches the backend rollout request:
  - `01 GRAVII ID`
  - `02 X-RAY`
  - `03 STANDING`
  - `04 DISCOVERY`
  - `05 MY SPACE`

### Partner App

- Replaced the seeded cookie/session bootstrap with the live partner auth flow from the backend guide.
- Partner auth now uses Firebase Google OAuth in the browser plus Bearer-token validation against the Partner API.
- Sign-in now uses `POST /api/v1/auth/google` after Google OAuth and `GET /api/v1/auth/session` on app load.
- Route protection now happens client-side in the auth provider because Firebase persists tokens in IndexedDB rather than HTTP cookies.
- Removed the partner-side app-local auth issuance routes from the product flow.
- Reworked the onboarding destinations and focused Connect module screens so they match the partner mockup more closely:
  - `Your ecosystem only` -> `X-Ray Users`
  - `Expand with Gravii pool` -> `X-Ray Users`
  - `Discover new users` -> `Create Campaign`
  - Gate modules open distinct focused pages instead of a repeated generic Connect catalog
- Added a shared preview-data status layer across the fixture-backed routed pages so the product now explicitly distinguishes live auth/profile from preview analytics data.
- Current backend reality note: the deployed public Partner API exposes auth/profile routes, but the documented public dashboard/population routes currently return `404`, so those routed data surfaces remain preview-backed for now.

### Admin App

- Added Google Workspace sign-in UI.
- Added tenant/domain enforcement.
- Added app-local exchange, session, refresh, and logout routes.
- Added route protection for the backoffice shell.
- Added sign-in bootstrap checks so existing admin sessions skip redundant sign-in.
- Added app-local `GET /api/me` scaffolding with a seeded fallback and an opt-in backend proxy path.

### Landing Handoff

- The user landing header now forwards public traffic into the user app while preserving UTM and referral query params.
- The `/partners` route inside `apps/gravii-user-landing` now forwards partner CTA traffic into the partner app while preserving marketing params.
- The landing CTA env handling now rejects unexpected hostnames and falls back to the canonical app domains so a bad env value cannot send user traffic to the wrong Gravii surface.
- Landing CTA query passthrough is now hydrated on the client so local and deployed handoff links preserve current marketing params instead of freezing the server-rendered href.
- Local verification confirms:
  - home `LAUNCH APP` resolves to `https://app.gravii.io/`
  - `/partners` `Get Started` resolves to `https://partner.gravii.io`
- Deployed-site note:
  - `https://www.gravii.io` is still serving an older build where home `LAUNCH APP` opens with `_blank`
  - deployed `/partners` CTA hrefs already resolve to `https://partner.gravii.io`
  - a fresh landing redeploy is still needed so production exactly matches the current repo state

## Current QA Path

Use local app ports that align with the landing defaults:

- `gravii-user-landing`: `3000`
- `gravii-partner-app`: `3001`
- `gravii-user-app`: `3003`
- `gravii-backoffice`: `3004`

These ports are now enforced by each app's `dev` script so `bun run dev` no longer relies on Next.js auto-assigning whichever port is free first.

### User App

- Anonymous traffic to `/` is redirected to `/sign-in` by the client auth provider.
- Injected EVM wallets now run the live challenge-signature flow against the User API.
- After sign-in, `GRAVII ID` and `X-RAY` use live backend data immediately.

### Partner App

- Anonymous traffic is redirected to `/sign-in`.
- Sign-in now uses the live Google OAuth flow backed by Firebase and the Partner API.
- Local dev uses port `3001` so browser requests satisfy the current Partner API CORS policy.

### Admin App

- Anonymous traffic is redirected to `/sign-in`.
- Without Firebase config, seeded QA is still available through the exchange route.
- Only the configured workspace domain is allowed.

### Cookie Expectations

- Admin refresh cookie: `gravii_admin_refresh`

The user app no longer uses an app-owned refresh cookie. It keeps the live 24 hour JWT in `localStorage` and validates it through the User API. Partner auth also does not use an app-owned refresh cookie anymore; Firebase persists the Google session client-side and the frontend sends the Firebase ID token as a Bearer token to the Partner API.

### Automated QA

- Root Playwright coverage now exists for:
  - landing `LAUNCH APP` handoff into the user app
  - landing `/partners` `Get Started` handoff into the partner app
  - anonymous user-app redirect into the live wallet sign-in surface
  - anonymous partner-app redirect into the live Google sign-in surface
  - anonymous admin redirect into the workspace sign-in surface
  - partner sign-in `next` preservation
- Run it from the workspace root with `bun run test:e2e`.
- Current baseline: `bun run test:e2e` is green locally after moving Playwright off the root Turbo dev wrappers and onto direct app-local Next dev commands.

## Current Limitations

- The admin auth flow still relies on the older frontend-managed session model.
- The partner app is now aligned with the live backend auth contract, but its dashboard and population data surfaces still need real API wiring once the corresponding public Partner API endpoints stop returning `404`.
- The user app now targets the live EVM wallet flow only. Broader wallet coverage can be added later.
- Partner auth depends on Firebase Google OAuth plus the Partner API allowing the local/frontend origin.
- The shared partner client still models dashboard/population routes that are documented by the knowledgebase but not yet published by the currently deployed public Partner API.

## Next Frontend Work

1. Finish the partner-app product refactor so the remaining dashboard, analytics, labels, risk, and settings surfaces are visually aligned with the partner mockup.
2. Run production QA on `gravii.io` and `gravii.io/partners` for the live waitlist, CTA routing, UTM preservation, and analytics.
3. Keep polishing the live `app.gravii.io` Gravii ID/X-Ray experience while the remaining user surfaces stay reserved.
4. Replace the older frontend-managed admin auth flow with its live backend contract.
5. Expand end-to-end auth coverage for the live partner Google flow and the live user wallet flow.

## Ownership Split

- Frontend owns:
  - sign-in UI
  - route protection
  - landing handoff behavior
  - Firebase client auth state for the partner app
- Backend owns:
  - challenge generation and verification
  - provider identity exchange
  - refresh and logout semantics where the surface actually uses backend-managed sessions
  - bearer protection for business APIs
  - OpenAPI `securitySchemes` and protected-route declarations
