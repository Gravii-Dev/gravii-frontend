# Gravii User App TODO

This file tracks durable remaining work. Keep session history in `PROGRESS.md` and the current execution plan in `PLAN.md`.

## High Priority

- Verify the Vercel user-app deployment after every push/PR update.
- Leave root `lefthook.yml` unstaged unless the project intentionally adopts Lefthook later.
- Preserve the current UI and feature logic while cleaning up any future version history.

## Product/UI Follow-Ups

- Review the lightweight `DepthIcon` direction in the browser and decide whether the next step should be custom 3D assets, Lottie, or WebGL.
- Continue checking responsive states after each major layout or motion change.
- Keep sign-in, X-Ray checkout, analysis before/after, Discovery, and Ranking scenarios in browser QA.
- Continue using section representative colors inside content surfaces without returning to unrelated accent palettes.

## Engineering Follow-Ups

- Keep `http://localhost:3001/` as the preferred local dev URL for the Launch App.
- Run `bun run typecheck`, `bun run lint`, and `bun run test` before handoff.
- Run `bun run build` before deploy or PR merge; if it fails only because `next/font` cannot fetch Google Fonts, rerun with network access.
- After pushing, check `gh pr checks <number>` and confirm the relevant `Vercel - gravii-frontend-gravii-user-app` check is passing.
- Record the Vercel preview URL in `PROGRESS.md` for every PR handoff.
- Update `PROGRESS.md` after meaningful implementation work.
- Latest merged visual-system checkpoint: `7cb4026 feat(user-app): stabilize launch app visual system`.
- Latest verified production inspector: `https://vercel.com/kxwxns-projects/gravii-frontend-gravii-user-app/zgpPHp4xbTmnL5Yg3J4L1J1XW12V`.
- Current focused slice adds `DepthIcon`, Discovery catalog adapter, and Ranking board/user-summary adapters.

## Backlog

- Decide whether shared design-system primitives should eventually move into a package used by multiple Gravii apps.
- Confirm final backend API contracts for Discovery catalog, campaign eligibility/actions, Ranking leaderboard, and user ranking summary.
