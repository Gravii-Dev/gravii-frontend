# Gravii User App Progress Log

This file is an append-only handoff log for meaningful implementation work in the Gravii User App.

Use this file to record:

- date and scope
- files or systems touched
- verification performed
- known caveats
- next handoff point

Do not use this file as a backlog. Durable remaining work belongs in `TODO.md` if one is created later.

## 2026-06-10

### Scope

- Continued the Launch App visual-system refinement pass.
- Applied the Material Expressive cursor/type-motion slice previously added to the app shell.
- Reworked the app color direction into a violet/lavender/plum family, using section temperature differences instead of unrelated green/orange/blue accents.
- Added the shared bold solid pill button treatment with a pastel bloom underlay through `ActionButton`.
- Tuned section content surfaces so active section colors are reflected inside the main workspace, not only in the left navigation.
- Adjusted dark-mode navigation contrast and remaining off-white token usage.
- Updated design-system docs to match the current violet-family/pastel-bloom direction.

### Key Files Touched

- `src/features/launch-app/panel-config.ts`
- `src/app/globals.css`
- `src/app/page.module.css`
- `src/components/ui/action-button/action-button.module.css`
- `src/components/layout/launch-panel/launch-panel.module.css`
- `docs/design-system/launch-app-design-system-plan.md`
- `src/components/ui/README.md`

### Verification

- `bun run typecheck` passed.
- `bun run lint` passed.
- `bun run test` passed: 10 test files, 24 tests.
- `bun run build` passed after allowing network access for `next/font` to fetch Roboto Flex from Google Fonts.
- Browser checked `http://localhost:3001/` in desktop light, desktop dark, and a 390px mobile viewport.
- Confirmed no document-level horizontal or vertical overflow in those browser checks.
- Confirmed active section title did not clip in the desktop probe.
- Confirmed shared `ActionButton` instances expose the new bloom pseudo-layer.

### Caveats

- The worktree is currently dirty and not yet committed.
- Current local changes include broader previous UI/auth/responsive work, not only the latest violet/pastel pass.
- Untracked items currently include `src/components/ui/expressive-cursor/`, `src/components/ui/morph-icon/`, and `../../lefthook.yml`; review before staging.
- The 3D-style iconography direction has not been implemented yet. The current pass only covers color, buttons, cursor/type motion, and section atmosphere.

### Next Handoff Point

- Review the dirty worktree and separate intentional product changes from accidental/generated files.
- Decide whether to commit the current visual-system pass as one version or split into smaller commits.
- If continuing UI polish, the next focused slice should be iconography/motion primitives, not another broad palette pass.

### Handoff File Setup

- Added `PLAN.md` as the active plan file for the current workstream.
- Added `TODO.md` as the durable backlog file.
- Status questions should now be answered by checking `PROGRESS.md`, `git status --short`, `git log -1 --oneline`, and `TODO.md` together.
- Current branch during setup: `main`.
- Latest known commit during setup: `40c5975 Polish landing waitlist flow and remove dead code`.

### Versioning Checkpoint

- Created branch `codex/launch-app-visual-system-handoff`.
- Verified before committing:
  - `bun run typecheck`
  - `bun run lint`
  - `bun run test`
  - `bun run build`
- Created commit `65c8017 feat(user-app): stabilize visual system`.
- Created commit `e310d0c docs(user-app): add handoff tracking`.
- Pushed branch `codex/launch-app-visual-system-handoff` to origin.
- Created PR `https://github.com/Gravii-Dev/gravii-frontend/pull/50`.
- Excluded root `lefthook.yml` from the app/UI commit because it is an example Lefthook config and not part of the user-app visual-system workstream.
- Kept handoff tracking docs separate so they can be committed as their own documentation checkpoint.

### Vercel Deployment Check

- Verified PR #50 Vercel checks with `gh pr checks 50`.
- `Vercel - gravii-frontend-gravii-user-app` passed.
- User app preview URL: `https://gravii-frontend-gravii-user-app-git-code-83365e-kxwxns-projects.vercel.app`.
- The exact Vercel inspector URL changes on every push and should be read live from `gh pr checks 50`.
- Operating rule going forward: after every push/PR update, verify the Vercel user-app deployment and record the preview URL or failure state here.

## 2026-06-11

### PR Merge And Production Deployment

- Merged PR #50: `https://github.com/Gravii-Dev/gravii-frontend/pull/50`.
- Merge commit: `7cb4026936ab5d74109591ceb970cccb276e9eef`.
- Fast-forwarded local `main` to `origin/main`.
- Verified main commit status through GitHub/Vercel status checks.
- `Vercel - gravii-frontend-gravii-user-app` completed successfully.
- User app production deployment inspector: `https://vercel.com/kxwxns-projects/gravii-frontend-gravii-user-app/zgpPHp4xbTmnL5Yg3J4L1J1XW12V`.
- Confirmed `https://app.gravii.io/` responds with `HTTP/2 200`.

### Current Handoff Point

- Local branch: `main`.
- Latest merged app checkpoint: `7cb4026 feat(user-app): stabilize launch app visual system`.
- Root `lefthook.yml` remains intentionally unstaged and was not included in the product/UI work.

### Next Slice In Progress

- Added lightweight 3D-style section iconography with `src/components/ui/depth-icon`.
- Wired `DepthIcon` into the workspace navigation panels and active section top bar.
- Added Discovery catalog read support through `readDiscoveryCatalog`.
- Added Ranking public leaderboard and signed wallet summary read support through `readRankingLeaderboard` and `readUserRankingSummary`.
- Kept Discovery and Ranking free of local mock rows; empty/loading/error/unavailable states now represent API readiness.
- Updated UI, feature, and lib docs to describe the new iconography primitive and API-ready surfaces.

Verification completed:

- `bun run typecheck` passed.
- `bun run lint` passed.
- `bun run test` passed: 10 test files, 24 tests.
- `bun run build` passed after rerunning with network access for `next/font` Roboto Flex.
- Product dev server is running at `http://localhost:3001/`.
- Mock reference dev server is running at `http://127.0.0.1:3000/` from `/Users/kxwxn/Downloads/GraviiApp.jsx`.
- Both local servers returned `HTTP 200` through curl with network permissions.

Caveats:

- Playwright is not installed in this app's `node_modules`, so screenshot automation was not available in this pass.
- Localhost WalletConnect metadata warning is visible in dev because configured metadata URL is `https://app.gravii.io` while the dev URL is `http://localhost:3001`.
