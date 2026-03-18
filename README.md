# Gravii Frontend Operations Monorepo

This root workspace is an operating monorepo for the Gravii frontend applications in this folder.

## Scope

- No product code was refactored to create shared runtime packages.
- Each application still owns its own routes, components, styles, and deployment target.

This workspace adds a shared root for install, lint, build, and typecheck orchestration.

## Workspace Apps

- `apps/gravii-backoffice`
- `apps/gravii-user-landing`
- `apps/gravii-user-app`
- `apps/gravii-partner-app`
- `apps/gravii-partner-landing`

Internal naming is persona-based:

- `gravii-backoffice`: internal admin and operations surfaces
- `gravii-user-landing`: public Gravii landing experience
- `gravii-user-app`: end-user product
- `gravii-partner-app`: partner workspace and product tools
- `gravii-partner-landing`: partner-facing acquisition and marketing surface

## Root Commands

Install root tooling:

```bash
bun install
```

Run all app dev servers:

```bash
bun run dev
```

Run a single app:

```bash
bun run dev:backoffice
bun run dev:user-landing
bun run dev:user-app
bun run dev:partner-app
bun run dev:partner-landing
```

Run workspace tasks:

```bash
bun run build
bun run lint
bun run typecheck
bun run typecheck:user-landing
```

## Notes

- This is intentionally an operating monorepo, not a shared UI monorepo.
- Product code should continue to run from each app directory as before.
- Shared packages such as design tokens, API types, or config packages can be added later without forcing a UI merge.
- `packages/` and `tooling/scripts/` are scaffolded for the next phase, but no shared runtime packages have been extracted yet.
- `bun run typecheck:user-landing` remains available when you only want to target `gravii-user-landing`.
- `packages/domain-types` now holds the first shared domain models.
- `packages/api-clients` now holds thin shared clients for the live Gravii APIs.

## Docs

- `docs/design-foundations-checklist.md`: pre-design-system checklist for visual foundations and shared UI readiness
# gravii-frontend
