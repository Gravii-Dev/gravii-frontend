# Gravii User App Active Plan

This file describes the current active workstream. Rewrite this file when the active plan materially changes.

## Current Workstream

Stabilize the Launch App visual system and prepare the current local changes for a clean versioned handoff.

## Immediate Plan

1. Keep the verified visual-system checkpoint intact.
2. Commit the handoff tracking files as a separate documentation checkpoint.
3. Leave the generated/example `lefthook.yml` unstaged unless it is explicitly adopted later.
4. Push the branch and merge through the normal GitHub flow.

## Status Query Protocol

When the user asks "where are we?", "what is left?", "what did we do?", or similar status questions, check these sources in order:

1. `PROGRESS.md` for the implementation history and latest handoff notes.
2. `git status --short` for the actual uncommitted worktree state.
3. `git log -1 --oneline` for the latest committed version.
4. `TODO.md` for durable backlog items that are not tied to the current session.

## Current Known State

- Branch: `codex/launch-app-visual-system-handoff`
- Latest visual-system checkpoint: `65c8017 feat(user-app): stabilize visual system`
- Worktree: handoff docs are pending as a separate commit; root `lefthook.yml` remains intentionally unstaged.
- Preferred local dev URL: `http://localhost:3001/`

## Not In Scope For This Plan

- Rebuilding the whole UI from a new external reference.
- Removing existing product UI or feature logic.
- Implementing backend APIs.
- Implementing the future 3D iconography system unless explicitly requested as the next slice.
