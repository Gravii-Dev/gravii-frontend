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

Internal naming is persona-based:

- `gravii-backoffice`: internal admin and operations surfaces
- `gravii-user-landing`: public Gravii landing experience, including the `/partners` acquisition route
- `gravii-user-app`: end-user product
- `gravii-partner-app`: partner workspace and product tools

## Root Commands

Install root tooling:

```bash
bun install
```

Run all app dev servers:

```bash
bun run dev
```

Default local ports are fixed so cross-app handoff stays stable:

- `gravii-user-landing`: `http://localhost:3000`
- `gravii-partner-app`: `http://localhost:3001`
- `gravii-user-app`: `http://localhost:3003`
- `gravii-backoffice`: `http://localhost:3004`

Run a single app:

```bash
bun run dev:backoffice
bun run dev:user-landing
bun run dev:user-app
bun run dev:partner-app
```

Run workspace tasks:

```bash
bun run build
bun run lint
bun run typecheck
bun run typecheck:user-landing
bun run test:e2e
```

## Notes

- This is intentionally an operating monorepo, not a shared UI monorepo.
- Product code should continue to run from each app directory as before.
- Shared packages such as design tokens, API types, or config packages can be added later without forcing a UI merge.
- `packages/` and `tooling/scripts/` are scaffolded for the next phase, but no shared runtime packages have been extracted yet.
- `bun run typecheck:user-landing` remains available when you only want to target `gravii-user-landing`.
- `packages/domain-types` now holds the first shared domain models.
- `packages/api-clients` now holds thin shared clients for the live Gravii APIs, including auth-aware user, partner, and admin clients.
- The public partner acquisition surface is now owned by `apps/gravii-user-landing` at `/partners`; there is no separate standalone partner landing app in the active workspace.

## Docs

- `AGENTS.md`: workspace-level operating rules plus cross-session handoff conventions
- `PLAN.md`: active multi-step execution plan when a workstream is in progress
- `PROGRESS.md`: append-only work log and handoff history
- `TODO.md`: durable backlog for cross-session work
- `docs/design-direction-gravii-m3-expressive.md`: pre-refactor Gravii design direction brief for a Material 3 Expressive-inspired visual system
- `docs/mockups/gravii-m3-expressive-preview.html`: static visual mockup for the new Gravii direction before app refactors begin
- `docs/mockups/gravii-m3-expressive-preview.png`: rendered screenshot of the same visual mockup for quick review
- `docs/mockups/gravii-m3e-option-a-strong.html`: stronger A/B concept where Material 3 Expressive shape, icon, and role-color cues are intentionally more visible
- `docs/mockups/gravii-m3e-option-a-strong.png`: rendered screenshot of option A
- `docs/mockups/gravii-m3e-option-b-restrained.html`: calmer A/B concept that keeps the expressive system cues but lowers the visual volume for Gravii
- `docs/mockups/gravii-m3e-option-b-restrained.png`: rendered screenshot of option B
- `docs/mockups/gravii-motion-logo-preview.html`: animated SVG mockup showing the red Gravii signal arc orbiting outside the core ring without collision
- `docs/mockups/gravii-motion-logo-preview.png`: rendered screenshot of the motion-logo concept
- `docs/mockups/gravii-motion-logo-monochrome.html`: all-black motion-logo preview that separates the official static lockup from the symbol-only orbit animation
- `docs/mockups/gravii-motion-logo-monochrome.png`: rendered screenshot of the monochrome motion-logo concept
- `docs/design-foundations-checklist.md`: pre-design-system checklist for visual foundations and shared UI readiness
- `docs/frontend-auth-rollout-status.md`: current frontend auth rollout status, QA flow, and next frontend work
- `docs/backend-auth-handoff.md`: backend-facing auth API contract for user, partner, and admin surfaces
- `docs/frontend-data-api-map.md`: frontend-to-backend API ownership map for landing, user, partner, and admin surfaces
