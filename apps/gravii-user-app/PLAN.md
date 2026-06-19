# Gravii User App Active Plan

This file describes the current active workstream. Rewrite this file when the active plan materially changes.

## Current Workstream

Implement the next focused Launch App slice: API-ready Discovery and Ranking surfaces. The lightweight `DepthIcon` direction was rejected in review and must stay removed unless a new approved iconography direction is provided.

## Immediate Plan

1. Keep the merged visual-system checkpoint intact on `main`.
2. Keep Discovery and Ranking free of mock data while wiring frontend adapters for live API data.
3. Remove the `DepthIcon` primitive and all section-icon wiring from the current PR branch.
4. Leave the generated/example `lefthook.yml` unstaged unless it is explicitly adopted later.
5. For future pushes or PRs, verify the Vercel user-app deployment before handoff.

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
- Current local mock reference URL: `http://localhost:3000/`, served from `/Users/kxwxn/Downloads/GraviiApp.jsx` through `/private/tmp/gravii-mock-viewer`

## Not In Scope For This Plan

- Rebuilding the whole UI from a new external reference.
- Removing existing product UI or feature logic.
- Implementing backend APIs.
- Reintroducing local mock campaign or ranking rows.
