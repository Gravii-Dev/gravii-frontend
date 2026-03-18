# Launch App Frontend Rules

This repo uses a 3-layer frontend guidance model.

## Layers

1. Global baseline: [/Users/kxwxn/.ai-skills/frontend-standards/SKILL.md](/Users/kxwxn/.ai-skills/frontend-standards/SKILL.md)
2. Gravii domain override: [/Users/kxwxn/.ai-skills/gravii-frontend/SKILL.md](/Users/kxwxn/.ai-skills/gravii-frontend/SKILL.md)
3. Repo-local override: this file and repo docs

## Precedence

When rules conflict, use the narrowest layer:

1. this repo's local docs
2. `gravii-frontend`
3. `frontend-standards`

## Why This Repo Uses `gravii-frontend`

This repository is a Gravii repo because:

- the working path is under `/Users/kxwxn/Gravii/...`
- the package name and README identify the product as Gravii Launch App
- the product docs under `docs/launch-app` describe a Gravii product

## Repo-Local Overrides

For this repository, apply these local rules:

- package manager: `Bun`
- framework: `Next.js App Router`
- preserve the current `TypeScript/TSX` codebase unless a broader migration is explicitly requested
- use `CSS Modules` for new component or route styles
- default to a minimal component folder: the component file and its `*.module.css` file
- keep `src/app/globals.css` limited to app-wide styles, tokens, resets, and shared keyframes
- do not keep growing `src/app/page.tsx`; extract new work into `src/features/*` or shared component folders
- treat framework upgrades, Bun migration, TypeScript migration, and large styling migration as separate changes
- documentation maintenance is required for structural, behavioral, or ownership changes; update the relevant repo docs in the same change instead of leaving docs drift for later
- when code is added, moved, renamed, or deleted, update the nearest committed English docs that explain that area, including `README.md`, `docs/codebase/*`, and feature or component `README.md` files when applicable
- if a change affects feature responsibilities or flow, update the corresponding `src/features/*/README.md`; if it affects shared layout or primitives, update `src/components/layout/README.md`, `src/components/ui/README.md`, or `src/lib/README.md` as needed
- if a change affects product scope, API contracts, system boundaries, or repo-level conventions, update the relevant file under `docs/launch-app/*` or `docs/frontend-implementation-standards.md` in the same change
- committed repository docs should stay in English; private Korean companion docs, when maintained, must stay under `.local-docs/` so they remain gitignored

## Local References

- implementation rules: [docs/frontend-implementation-standards.md](/Users/kxwxn/Gravii/FRONTEND/apps/gravii-user-app/docs/frontend-implementation-standards.md)
- product and system architecture: [docs/launch-app/architecture.md](/Users/kxwxn/Gravii/FRONTEND/apps/gravii-user-app/docs/launch-app/architecture.md)
- repo overview: [README.md](/Users/kxwxn/Gravii/FRONTEND/apps/gravii-user-app/README.md)
- codebase architecture overview: [docs/codebase/architecture-overview.md](/Users/kxwxn/Gravii/FRONTEND/apps/gravii-user-app/docs/codebase/architecture-overview.md)
- codebase folder guide: [docs/codebase/folder-structure.md](/Users/kxwxn/Gravii/FRONTEND/apps/gravii-user-app/docs/codebase/folder-structure.md)
