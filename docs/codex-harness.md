# Codex Harness

This document defines the local operating harness for Codex Desktop work in the
Gravii frontend workspace.

This workspace is the user's current primary Gravii responsibility. When a
Gravii request is ambiguous, start here before looking at sibling Gravii repos.

## Active Context Sources

Use sources in this order:

1. nearest app or package `AGENTS.md`
2. root `AGENTS.md`
3. root `README.md` and affected app/package docs
4. `gravii-frontend`
5. `frontend-standards`

Claude, Gemini, Cursor, and OpenCode context files are inactive unless the user
explicitly asks Codex to inspect or migrate them.

## Default Verification Gates

Use the smallest gate that matches the risk:

| Change type | Default gate |
| --- | --- |
| Workspace code change | `bun run check` |
| Build, routing, package, deployment, or config change | `bun run verify` |
| `gravii-user-landing` only | `bun run check:user-landing` |
| Auth, route handoff, or user-flow change | `bun run test:e2e` plus the relevant app gate |
| Visual/layout/motion change | relevant app gate plus browser inspection |
| Documentation-only change | read back changed docs; no build required unless commands or contracts changed |

If a gate fails because of known unrelated debt, record the exact failing command
and the unrelated failure before finishing.

## Task Routines

### UI Implementation

1. Read the nearest `AGENTS.md`, app README, and relevant feature/component docs.
2. Keep changes app-local unless a shared package already owns the surface.
3. Implement in TypeScript/TSX and CSS Modules unless the app explicitly documents another styling system.
4. Verify with the relevant app gate.
5. Inspect the local page in a browser for layout, responsive behavior, and visible state quality.
6. Update nearby docs when structure, behavior, or ownership changes.

### API Client or Data Flow

1. Identify the owning app, shared package, and backend contract.
2. Keep API shapes typed and avoid `any`.
3. Preserve live API-backed behavior unless the task explicitly calls for mocks.
4. Run the focused app/package gate and broader workspace gate when shared packages change.
5. Update API mapping or affected README docs when contracts or ownership change.

### Bug Fix

1. Reproduce or locate the failure before editing.
2. Fix the narrowest owning module.
3. Add or update a regression check when the failure mode is likely to return.
4. Run the focused gate that would have caught the bug.
5. Note any residual risk or skipped verification.

### Handoff

Use the handoff files only when the workstream needs cross-session continuity:

- `PLAN.md`: current multi-step plan
- `PROGRESS.md`: append-only completed work and verification log
- `TODO.md`: durable remaining work

Do not duplicate the same note across all three files.
