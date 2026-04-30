# Frontend Data API Map

This document explains how the frontend surfaces in this workspace are expected to consume the Gravii backend APIs beyond auth.

## Source of Truth

The current API ownership summary comes from:

- [../gravii-knowledgebase/api-docs/README.md](/Users/kxwxn/Gravii/gravii-knowledgebase/api-docs/README.md)
- [api-docs.md](/Users/kxwxn/Gravii/FRONTEND/api-docs.md)
- the shared clients in `packages/api-clients`

## Surface to API Mapping

### `gravii.io` and `gravii.io/partners`

Frontend owner:

- `apps/gravii-user-landing`

Backend owner:

- Landing API

What belongs here:

- public waitlist or contact capture
- public label preview
- public referral and analytics attribution

Current live endpoint:

- `POST /api/v1/landing/waitlist`

What does not belong here:

- authenticated user profile data
- authenticated partner dashboard data
- direct calls to the internal engine

### `app.gravii.io`

Frontend owner:

- `apps/gravii-user-app`

Backend owner:

- User API

Current shared client:

- [packages/api-clients/src/user.ts](/Users/kxwxn/Gravii/FRONTEND/packages/api-clients/src/user.ts)

Auth-adjacent endpoints:

- `GET /api/v1/auth/challenge`
- `POST /api/v1/auth/verify`
- `GET /api/v1/auth/session`

Live business data endpoints:

- `GET /api/v1/me/identity`
- `GET /api/v1/me/credits`
- `GET /api/v1/me/xray/lookup-list`
- `POST /api/v1/me/xray/lookup`
- `GET /api/v1/me/xray/:address`
- `POST /api/v1/verify/telegram`

Next frontend responsibility:

- keep the app on the direct live JWT flow instead of reintroducing app-local auth/session routes
- align the shared user client in `packages/api-clients` with the current live route names
- add feature-level adapters for standing, discovery, and my-space payloads when those backend contracts exist

### `partner.gravii.io`

Frontend owner:

- `apps/gravii-partner-app`

Backend owner:

- Partner API

Current shared client:

- [packages/api-clients/src/partner.ts](/Users/kxwxn/Gravii/FRONTEND/packages/api-clients/src/partner.ts)

Auth-adjacent endpoints:

- `POST /api/v1/auth/google`
- `GET /api/v1/auth/session`
- `GET /api/v1/auth/me`

Business data endpoints already modeled in the shared client:

- `GET /api/v1/dashboard/overview/summary`
- `GET /api/v1/dashboard/analytics/group-stats`
- `GET /api/v1/dashboard/analytics/dex-protocols`
- `GET /api/v1/dashboard/labels`
- `GET /api/v1/dashboard/labels/filter`
- `GET /api/v1/dashboard/risk/overview`
- `GET /api/v1/dashboard/risk/alerts`
- `GET /api/v1/dashboard/risk/sybil-clusters`
- `GET /api/v1/populations`
- `POST /api/v1/populations`
- `GET /api/v1/populations/:id`
- `POST /api/v1/populations/:id/enrich`
- `GET /api/v1/populations/:id/status`
- `POST /api/v1/lens/pools`
- `GET /api/v1/lens/pools`
- `GET /api/v1/lens/pools/:id`
- `PATCH /api/v1/lens/pools/:id`
- `DELETE /api/v1/lens/pools/:id`
- `GET /api/v1/lens/pools/:id/progress`
- `GET /api/v1/lens/pools/:id/wallets`
- `GET /api/v1/lens/pools/:id/wallets/:address`

Current deployed reality:

- the auth/profile routes above are live and currently power `gravii-partner-app`
- the Lens pool routes above are also live and now power the routed Lens workflow in `gravii-partner-app`
- the public dashboard/population read endpoints are still modeled in the shared client and the knowledgebase docs, but the currently deployed public API still does not expose those reads for the routed analytics surfaces
- because of that mismatch, Lens now renders live backend data while the remaining dashboard-grade partner surfaces keep explicit preview-data callouts instead of silently claiming those numbers are live

Shared package status:

- `packages/api-clients/src/landing.ts` now matches the live `POST /api/v1/landing/waitlist` contract
- `packages/api-clients/src/user.ts` now matches the live user auth + Gravii ID + X-Ray route names
- `packages/api-clients/src/partner.ts` now covers live auth plus live Lens pool endpoints, while still keeping the documented dashboard/population methods for the routes that are not deployed yet

Next frontend responsibility:

- keep the partner app on the live Firebase Google + Bearer-token auth flow
- keep Lens aligned with the current knowledgebase contract, especially the client-side CSV parse flow and progress polling behavior
- switch dashboard and population screens to the Partner API a slice at a time once the public endpoints are actually published
- keep direct Partner API calls aligned with the current CORS allowlist during local development

### `admin.gravii.io`

Frontend owner:

- `apps/gravii-backoffice`

Backend owner:

- Admin API or admin routes on a protected Gravii API surface

Current shared client:

- [packages/api-clients/src/admin.ts](/Users/kxwxn/Gravii/FRONTEND/packages/api-clients/src/admin.ts)

Currently modeled endpoints:

- `POST /api/v1/auth/google/exchange`
- `GET /api/v1/auth/session`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/me`

Next frontend responsibility:

- replace seeded `/api/me` with real backend proxying when `GRAVII_ADMIN_ME_PROXY_ENABLED=true`
- wait for the admin data surface to be defined before wiring deeper backoffice screens

## Internal Engine Boundary

The internal Gravii engine is not a frontend integration target.

From the knowledgebase:

- external APIs are thin proxies
- auth, request validation, and CORS happen in those external APIs
- business logic and data orchestration live in the internal engine

That means the frontend should call:

- Landing API
- User API
- Partner API
- Admin API

The frontend should not call:

- the internal engine directly

## Practical Next Step

When backend auth is live for a surface:

1. align the frontend auth flow with the backend contract for that specific app
2. wire feature screens to the matching shared client methods in `packages/api-clients`
3. add feature-specific adapters only when the real payload shape is stable
