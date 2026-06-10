# Gravii User App TODO

This file tracks durable remaining work. Keep session history in `PROGRESS.md` and the current execution plan in `PLAN.md`.

## High Priority

- Commit the handoff tracking files separately from the visual-system checkpoint.
- Push `codex/launch-app-visual-system-handoff` after the handoff commit is created.
- Leave root `lefthook.yml` unstaged unless the project intentionally adopts Lefthook later.
- Preserve the current UI and feature logic while cleaning up any future version history.

## Product/UI Follow-Ups

- Implement the future 3D-style iconography direction as a separate focused slice if still desired.
- Continue checking responsive states after each major layout or motion change.
- Keep sign-in, X-Ray checkout, analysis before/after, Discovery, and Ranking scenarios in browser QA.
- Continue using section representative colors inside content surfaces without returning to unrelated accent palettes.

## Engineering Follow-Ups

- Keep `http://localhost:3001/` as the preferred local dev URL for the Launch App.
- Run `bun run typecheck`, `bun run lint`, and `bun run test` before handoff.
- Run `bun run build` before deploy or PR merge; if it fails only because `next/font` cannot fetch Google Fonts, rerun with network access.
- Update `PROGRESS.md` after meaningful implementation work.
- Latest verified visual-system checkpoint: `65c8017 feat(user-app): stabilize visual system`.

## Backlog

- Decide whether shared design-system primitives should eventually move into a package used by multiple Gravii apps.
- Define the final backend API contract for future Discovery and Ranking data once backend scope is ready.
