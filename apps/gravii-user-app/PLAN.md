# Gravii User App Active Plan

This file describes the current active workstream. Rewrite this file when the active plan materially changes.

## Current Workstream

Post-merge monitoring for the Launch App visual-system stabilization.

## Immediate Plan

1. Keep the merged visual-system checkpoint intact on `main`.
2. Leave the generated/example `lefthook.yml` unstaged unless it is explicitly adopted later.
3. For future pushes or PRs, verify the Vercel user-app deployment before handoff.
4. Continue UI/UX work as focused slices rather than another broad unbounded redesign pass.

## Status Query Protocol

When the user asks "where are we?", "what is left?", "what did we do?", or similar status questions, check these sources in order:

1. `PROGRESS.md` for the implementation history and latest handoff notes.
2. `git status --short` for the actual uncommitted worktree state.
3. `git log -1 --oneline` for the latest committed version.
4. GitHub PR checks, especially the Vercel preview deployment status.
5. `TODO.md` for durable backlog items that are not tied to the current session.

## Current Known State

- Branch: `main`
- Latest merged visual-system checkpoint: `7cb4026 feat(user-app): stabilize launch app visual system`
- Merged pull request: `https://github.com/Gravii-Dev/gravii-frontend/pull/50`
- Vercel production deployment for user app: `https://vercel.com/kxwxns-projects/gravii-frontend-gravii-user-app/zgpPHp4xbTmnL5Yg3J4L1J1XW12V`
- Latest exact commit and Vercel inspector URL should be read live from `git log -1 --oneline` and GitHub commit statuses.
- Worktree: root `lefthook.yml` remains intentionally unstaged.
- Preferred local dev URL: `http://localhost:3001/`

## Not In Scope For This Plan

- Rebuilding the whole UI from a new external reference.
- Removing existing product UI or feature logic.
- Implementing backend APIs.
- Implementing the future 3D iconography system unless explicitly requested as the next slice.
