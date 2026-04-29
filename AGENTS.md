# Gravii Frontend Operations Monorepo Rules

This repository uses a 3-layer frontend guidance model.

## Layers

1. Global baseline: [`frontend-standards`](../../.ai-skills/frontend-standards/SKILL.md)
2. Gravii domain override: [`gravii-frontend`](../../.ai-skills/gravii-frontend/SKILL.md)
3. Repo-local override: this file, the root docs, and any deeper `AGENTS.md`

## Precedence

When rules conflict, use the narrowest applicable document:

1. nearest local `AGENTS.md` and local docs
2. this root `AGENTS.md`
3. `gravii-frontend`
4. `frontend-standards`

If a task moves into an app folder that already contains its own `AGENTS.md`, follow that file for the app-specific rules.

## Workspace Scope

- The repository root is an operating monorepo for the frontend applications under `apps/` and the shared packages under `packages/`.
- Each app still owns its own routes, components, styling, assets, and deployment target.
- Do not merge app runtime code into shared packages unless the extraction is an explicit task with a stable shared contract.

## Workspace Rules

- Package manager: `Bun`
- Workspace orchestration: use the root `bun run dev`, `build`, `lint`, and `typecheck` scripts powered by `turbo`
- React and Next.js changes must remain TypeScript-only
- Prefer app-local changes first; introduce or expand `packages/*` only when at least two apps benefit and the shared surface is intentional
- Keep `packages/` focused on shared config, domain types, API clients, and other stable cross-app modules
- Treat framework upgrades, package-manager migration, and large styling migrations as separate workstreams
- Preserve the persona-based app naming under `apps/`
- Committed repository docs should stay in English; private Korean notes can live under `.local-docs/` and must remain gitignored

## Documentation Maintenance

- Update the root [`README.md`](README.md) when workspace-level conventions, scripts, or operating expectations change
- Update [`apps/README.md`](apps/README.md) when app naming or workspace composition changes
- Update [`packages/README.md`](packages/README.md) when package scope or ownership changes
- If a task touches an app, update that app's `README.md`, nearest docs, and nearest `AGENTS.md` when responsibilities, structure, or behavior change

## Handoff Files

These files exist to make cross-session and cross-agent work resumable. Keep their roles distinct.

- [`PLAN.md`](PLAN.md): the active execution plan for the current multi-step stream
- [`PROGRESS.md`](PROGRESS.md): an append-only work log with date, files touched, verification, and the next handoff point
- [`TODO.md`](TODO.md): the durable backlog of remaining actionable work

Rules:

- Do not duplicate the same note across all three files
- Rewrite `PLAN.md` when the active plan materially changes instead of turning it into a history log
- Append to `PROGRESS.md` when meaningful work is completed or handed off
- Keep `TODO.md` focused on durable remaining work, not session notes or completed items
- If there is no active workstream, leave `PLAN.md` in an idle state instead of inventing work

## Local References

- workspace overview: [`README.md`](README.md)
- app naming: [`apps/README.md`](apps/README.md)
- shared package scope: [`packages/README.md`](packages/README.md)
- example app-local override: [`apps/gravii-user-app/AGENTS.md`](apps/gravii-user-app/AGENTS.md)
