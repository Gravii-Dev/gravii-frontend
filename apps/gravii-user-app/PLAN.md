# Gravii User App Active Plan

This file describes the current active workstream. Rewrite this file when the active plan materially changes.

## Current Workstream

Stabilize the Launch App visual system and prepare the current local changes for a clean versioned handoff.

## Immediate Plan

1. Keep the verified visual-system checkpoint intact.
2. Commit the handoff tracking files as a separate documentation checkpoint.
3. Leave the generated/example `lefthook.yml` unstaged unless it is explicitly adopted later.
4. Push the branch and verify the Vercel preview deployment for the user app.
5. Merge through the normal GitHub flow after GitHub and Vercel checks are green.

## Status Query Protocol

When the user asks "where are we?", "what is left?", "what did we do?", or similar status questions, check these sources in order:

1. `PROGRESS.md` for the implementation history and latest handoff notes.
2. `git status --short` for the actual uncommitted worktree state.
3. `git log -1 --oneline` for the latest committed version.
4. GitHub PR checks, especially the Vercel preview deployment status.
5. `TODO.md` for durable backlog items that are not tied to the current session.

## Current Known State

- Branch: `codex/launch-app-visual-system-handoff`
- Latest visual-system checkpoint: `65c8017 feat(user-app): stabilize visual system`
- Pull request: `https://github.com/Gravii-Dev/gravii-frontend/pull/50`
- Vercel preview for user app: `https://gravii-frontend-gravii-user-app-git-code-83365e-kxwxns-projects.vercel.app`
- Latest exact commit and Vercel inspector URL should be read live from `git log -1 --oneline` and `gh pr checks 50`.
- Worktree: root `lefthook.yml` remains intentionally unstaged.
- Preferred local dev URL: `http://localhost:3001/`

## Not In Scope For This Plan

- Rebuilding the whole UI from a new external reference.
- Removing existing product UI or feature logic.
- Implementing backend APIs.
- Implementing the future 3D iconography system unless explicitly requested as the next slice.
