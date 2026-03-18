# Packages

Shared packages will be added here in later phases of the monorepo migration.

- `eslint-config` now provides the shared Next.js flat-config helper used by the app surfaces that lint with ESLint.
- `tsconfig` now provides the shared TypeScript base configs used by all five apps.
- `domain-types` now provides a minimal shared domain layer for campaigns, partners, populations, risk, labels, and analytics concepts.
- `api-clients` now provides thin shared fetch wrappers for the live landing, user, and partner APIs.

Planned next candidates:

- `brand-tokens`
- app-level adapters that map raw API payloads into the shared domain types
