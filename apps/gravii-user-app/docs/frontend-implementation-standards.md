# Frontend Implementation Standards

## Purpose

This document defines the repository-level frontend implementation rules for Launch App.

Use it alongside [docs/launch-app/architecture.md](/Users/kxwxn/Gravii/LanunchApp-v1/docs/launch-app/architecture.md):

- `docs/launch-app/architecture.md` covers product and system boundaries.
- This document covers code organization, styling, and refactor direction inside this repo.

## Current State

Current repo characteristics:

- `Next.js App Router`
- `React 19`
- `Bun` lockfile and Bun-based local workflow
- `TypeScript/TSX` source files
- a route shell in [src/app/page.tsx](/Users/kxwxn/Gravii/LanunchApp-v1/src/app/page.tsx) with shared layout primitives under `src/components/layout`
- feature surfaces extracted under `src/features/profile`, `src/features/my-space`, `src/features/discovery`, `src/features/x-ray`, and `src/features/standing`
- shared Launch App primitives and mock data under `src/features/launch-app`
- shared app-wide styles in [src/app/globals.css](/Users/kxwxn/Gravii/LanunchApp-v1/src/app/globals.css)

## Decisions

Repository-level defaults:

- package manager: `Bun`
- framework: `Next.js App Router`
- React version policy: use the latest stable versions for new projects, but treat upgrades in existing repos as dedicated work
- language policy: use `TypeScript/TSX` for all ongoing work
- styling direction: use `CSS Modules` for new component-level refactors
- global CSS scope: keep `globals.css` for resets, tokens, fonts, and truly shared utilities only

## Folder Structure

Target structure for ongoing refactors:

```text
src/
  app/
    layout.tsx
    page.tsx
    globals.css
  components/
    ui/
    layout/
  features/
    profile/
    my-space/
    discovery/
    x-ray/
    standing/
  lib/
```

Rules:

- Keep `src/app` focused on routes, layouts, and route entry files.
- Put shared UI primitives under `src/components/ui`.
- Put cross-surface layout building blocks under `src/components/layout`.
- Put feature-specific modules under `src/features/<feature>`.
- Put shared helpers and non-visual utilities under `src/lib`.

## Colocation Rules

When creating or extracting components, keep implementation and styles together.

Default component pattern:

```text
src/features/discovery/components/campaign-card/
  index.tsx
  campaign-card.module.css
```

Default route pattern:

```text
src/app/discovery/
  page.tsx
  page.module.css
```

Default rule:

- prefer one component file and one `*.module.css` file in the same folder
- keep only those two files in the folder by default
- add private helpers or tests in the same folder only when complexity justifies them

## Styling Rules

- Prefer `*.module.css` for component and route styles.
- Keep selectors local and component-owned.
- Avoid adding new one-off global selectors to `globals.css`.
- Avoid inline style objects for static values.
- Use inline styles only for values that must be calculated at runtime.

`globals.css` is allowed for:

- reset and normalization
- typography foundations
- CSS custom properties and theme tokens
- shared animation keyframes
- truly app-wide utility classes when a module is not the right owner

## Refactor Direction

Do not keep expanding [src/app/page.tsx](/Users/kxwxn/Gravii/LanunchApp-v1/src/app/page.tsx) beyond route orchestration. Extract new surface logic into `src/features/*` and shared shell pieces into `src/components/layout`.

Preferred extraction order:

1. `Profile` (done)
2. `My Space` (done)
3. `Discovery` (done)
4. `X-Ray` (done)
5. `Standing` (done)

For each extraction:

- move JSX into a feature-local component folder
- create a colocated `*.module.css` file
- keep the folder minimal by default: component file plus module CSS
- move feature-local mock data or helpers next to the feature when practical
- keep shared primitives separate from feature-specific UI

## Migration Rules

- Do not combine framework upgrades, package manager migration, and styling migration in one unrelated change.
- Keep routine feature work compatible with the current repo shape.
- If a task is only a structural refactor, avoid broad visual restyling at the same time.
- TypeScript has already been introduced, so new refactors should stay inside the TS/TSX structure.

## Documentation Maintenance

Documentation updates are part of implementation work in this repository. Do not treat them as optional cleanup.

Required rule:

- when code is added, changed, moved, renamed, or deleted, update the relevant committed English documentation in the same change whenever the behavior, responsibility boundary, public surface, folder ownership, or developer workflow has changed

Use this mapping:

- update `README.md` when the repo overview, commands, top-level structure summary, or prototype status has changed
- update `docs/codebase/architecture-overview.md` when the route shell, app flow, shell state, runtime model, or major responsibility boundaries have changed
- update `docs/codebase/folder-structure.md` when file placement rules, shared-vs-feature ownership, or folder conventions have changed
- update `src/features/*/README.md` when a feature's purpose, local state, child components, data flow, or responsibilities have changed
- update `src/components/layout/README.md`, `src/components/ui/README.md`, or `src/lib/README.md` when shared layout, shared UI primitives, or helper responsibilities have changed
- update `docs/launch-app/*` when the change affects product scope, domain model, business rules, API contract, or system architecture

Deletion and refactor rule:

- if code is removed or moved, remove or rewrite stale documentation in the same change so docs never continue to describe code that no longer exists

Language rule:

- committed repository documentation should remain in English
- private Korean companion docs may be maintained under `.local-docs/`, which is gitignored in this repository

## Practical Default

For new frontend work in this repo:

- use `bun` commands
- keep route files in `src/app`
- extract feature UI under `src/features`
- colocate styles as `*.module.css`
- keep component folders minimal by default: the component file and its CSS module
- leave global concerns in `src/app/globals.css` only when there is a clear app-wide owner
- update the relevant docs as part of the same change whenever the work changes behavior, structure, or ownership
