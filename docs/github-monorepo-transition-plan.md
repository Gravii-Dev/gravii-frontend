# GitHub And Monorepo Transition Plan

This document captures the current Git/GitHub state of the frontend workspace and a safe migration order for moving toward a single GitHub monorepo without breaking the live `gravii.io` deployment.

## Current State

Workspace root:

- Path: `FRONTEND/`
- Git repo: no
- GitHub remote: no
- Meaning: root-level monorepo changes are not currently tracked by a single repository

App status:

| App | Path | Local `.git` | GitHub remote | Notes |
| --- | --- | --- | --- | --- |
| User Landing | `apps/gravii-user-landing` | yes | yes | Connected to `https://github.com/Gravii-Dev/gravii-landing-v2.git` |
| User App | `apps/gravii-user-app` | yes | no | Local git exists, but no remote is configured |
| Backoffice | `apps/gravii-backoffice` | no | no confirmed connection from this workspace | Managed only as a folder inside `FRONTEND` right now |
| Partner App | `apps/gravii-partner-app` | no | no confirmed connection from this workspace | Managed only as a folder inside `FRONTEND` right now |

## Immediate Interpretation

- The current workspace is structurally a monorepo, but not yet a single Git monorepo.
- `gravii-user-landing` is the only app that is clearly connected to GitHub from inside this workspace.
- The public partner acquisition route is now served from `apps/gravii-user-landing` at `/partners`.
- `gravii-user-app` has local commit history potential, but it is not yet connected to a GitHub remote.
- Root-level files such as `turbo.json`, `package.json`, `packages/*`, and `docs/*` are not protected by any root git history right now.
- Nested git repos inside a future monorepo will become confusing unless they are intentionally preserved for a short transition period only.

## Recommended Direction

Recommended target:

- Make `FRONTEND/` the single GitHub monorepo.
- Keep each app as an independent Vercel project if needed.
- Point each Vercel project at its app directory, not at the whole workspace build by default.

Why this is the safest long-term direction:

- One source of truth for all frontend changes
- Shared root tooling becomes naturally versioned
- Future packages in `packages/*` become easy to maintain
- Less confusion about where to commit and where to push
- Better fit for Turbo workspaces

## Safe Migration Order

Do this in order.

### Phase 1: Protect The Live Landing Project

Before changing Git structure:

1. Confirm the live Vercel project for `gravii.io` still points to `apps/gravii-user-landing`.
2. Confirm its build command is app-scoped.
3. Confirm required environment variables are stored in Vercel.
4. Do not remove the nested git repo for `gravii-user-landing` until the new monorepo repo exists and the Vercel connection plan is clear.

Preferred Vercel setup for the live site:

- Root Directory: `apps/gravii-user-landing`
- Install Command: `bun install`
- Build Command: `bun run build`

## Phase 2: Snapshot Existing Repos

Before flattening anything:

1. Save the current remote URL and default branch for `gravii-user-landing`.
2. Save the current branch and any uncommitted changes for `gravii-user-landing`.
3. Save the current branch and untracked files for `gravii-user-app`.
4. Decide whether `gravii-user-app` needs its own historical repo preserved or whether it can begin fresh in the monorepo.

Minimum safety step:

- Create a backup copy or archive of the two nested repos before removing `.git` directories.

## Phase 3: Create The Real Root Repository

At `FRONTEND/`:

1. Initialize a root git repository.
2. Add a root `.gitignore` that excludes `node_modules`, `.next`, `.turbo`, env files, and generated artifacts.
3. Commit the monorepo root as the new source of truth.
4. Create a GitHub repository for the monorepo, for example `gravii-frontend`.
5. Add that GitHub repo as the root `origin`.

## Phase 4: Fold Nested Apps Into The Root

After the root repo exists:

1. Remove nested `.git` folders from:
   - `apps/gravii-user-landing/.git`
   - `apps/gravii-user-app/.git`
2. Add those app folders as normal tracked directories under the root repo.
3. Commit the unified workspace state from the root.

Important:

- Do not do this until Phase 3 is complete.
- Once nested `.git` folders are removed, commits must happen from the root repo.

## Phase 5: Reconnect Deployments Cleanly

After the root monorepo is on GitHub:

1. Repoint or reconnect each Vercel project to the new monorepo GitHub repository.
2. For each Vercel project, set the correct Root Directory:
   - `apps/gravii-user-landing`
   - `apps/gravii-user-app`
   - `apps/gravii-backoffice`
   - `apps/gravii-partner-app`
3. Keep each deployment independently scoped to its app folder.

This preserves separate deployables while still using one repo.

## Phase 6: Standardize Daily Workflow

After migration:

- Commit from `FRONTEND/`
- Push from `FRONTEND/`
- Run app-specific dev commands from the root:
  - `bun run dev:user-landing`
  - `bun run dev:user-app`
  - `bun run dev:backoffice`
  - `bun run dev:partner-app`
- Run all dev servers together with `bun run dev`

## Practical Warnings

- If you initialize the root repo before protecting `gravii-user-landing`, you may create deployment confusion.
- If you delete nested `.git` directories too early, you can lose easy access to existing app-local history.
- If Vercel points at the repo root without an app-specific root directory, unrelated app changes can break live deploys.
- If multiple apps keep separate git repos forever while also living inside one pseudo-monorepo folder, operations will stay confusing.

## Recommended Next Action

Recommended next execution sequence:

1. Confirm `gravii.io` Vercel settings for `apps/gravii-user-landing`
2. Initialize root git in `FRONTEND/`
3. Create the root GitHub repo
4. Backup nested repos
5. Remove nested `.git` directories
6. Commit and push the unified monorepo
7. Reconnect Vercel projects one by one

## Decision Summary

Best recommendation for this workspace:

- Yes to one GitHub monorepo at `FRONTEND/`
- Yes to separate Vercel projects per app
- No to keeping mixed long-term nested git repos inside the monorepo
