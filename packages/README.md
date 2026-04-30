# Packages

Shared packages will be added here in later phases of the monorepo migration.

- `eslint-config` now provides the shared Next.js flat-config helper used by the app surfaces that lint with ESLint.
- `tsconfig` now provides the shared TypeScript base configs used by the current app surfaces.
- `domain-types` now provides a minimal shared domain layer for campaigns, partners, populations, risk, labels, analytics, and the current live landing/user auth contracts.
- `api-clients` now provides thin shared fetch wrappers for the live landing, user, partner, and admin APIs plus shared auth helpers.
- `brand-tokens` now provides shared Gravii CSS variables and TypeScript token exports for cross-app visual alignment.
- app-local `GET /api/me` routes can now use `api-clients` to proxy into backend `GET /api/v1/me` once the corresponding `*_ME_PROXY_ENABLED` env flags are enabled.

Planned next candidates:

- app-level adapters that map raw API payloads into the shared domain types
