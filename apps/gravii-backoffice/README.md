# Gravii Backoffice

Gravii Backoffice is the internal admin and operations surface for monitoring
partners, acquisition quality, pool health, campaigns, and risk signals.

The app started from the `gravii-hq_v2.html` prototype and is being migrated into
a product-ready Next.js App Router implementation while preserving prototype
parity during the transition.

## Stack

- Next.js 16
- React 19
- TypeScript/TSX
- CSS Modules
- Bun for local package management and workspace orchestration
- Firebase client auth plus shared Gravii API clients where live admin contracts exist

## Local Development

From the workspace root:

```bash
bun run dev:backoffice
```

Or from this app directory:

```bash
bun install
bun run dev
```

The app runs on:

```text
http://localhost:3004
```

## Available Scripts

| Command | Description |
| --- | --- |
| `bun run dev` | Start the Next.js dev server on port 3004 |
| `bun run build` | Build the app for production |
| `bun run start` | Start the production server |
| `bun run lint` | Run ESLint with zero warnings allowed |
| `bun run typecheck` | Run TypeScript without emitting files |

From the workspace root, use `bun run check` as the default completion gate for
code changes and `bun run verify` when build, routing, package, or deployment
risk is involved.

## Current Surface

The current internal HQ dashboard includes:

- overview
- pool composition
- pool cohort
- pool explorer
- acquisition source
- acquisition attribution
- acquisition funnel
- partner list
- partner performance
- partner detail
- campaigns
- sybil risk
- risk health

The page model and navigation types live in:

- [src/features/hq/types.ts](/Users/kxwxn/Gravii/FRONTEND/apps/gravii-backoffice/src/features/hq/types.ts)
- [src/features/hq/data.ts](/Users/kxwxn/Gravii/FRONTEND/apps/gravii-backoffice/src/features/hq/data.ts)
- [src/features/hq/dashboard.tsx](/Users/kxwxn/Gravii/FRONTEND/apps/gravii-backoffice/src/features/hq/dashboard.tsx)

## Repository Structure

```text
src/
  app/
    api/
      auth/
      me/
    globals.css
    layout.tsx
    page.tsx
  features/
    auth/
    hq/
      data.ts
      dashboard.module.css
      dashboard.tsx
      section-view.tsx
      selectors.ts
      types.ts
      pages/
  lib/
    auth/
  proxy.ts
docs/
  frontend-implementation-standards.md
```

## Source of Truth

- App entry: [src/app/page.tsx](/Users/kxwxn/Gravii/FRONTEND/apps/gravii-backoffice/src/app/page.tsx)
- HQ dashboard: [src/features/hq/dashboard.tsx](/Users/kxwxn/Gravii/FRONTEND/apps/gravii-backoffice/src/features/hq/dashboard.tsx)
- Prototype reference: [gravii-hq_v2.html](/Users/kxwxn/Gravii/FRONTEND/apps/gravii-backoffice/gravii-hq_v2.html)
- Implementation standards: [docs/frontend-implementation-standards.md](/Users/kxwxn/Gravii/FRONTEND/apps/gravii-backoffice/docs/frontend-implementation-standards.md)

## Working Rules

- Keep new React work in `.ts` and `.tsx`.
- Keep route shells thin and place dashboard logic under `src/features/hq`.
- Keep dashboard data and navigation metadata in `src/features/hq/data.ts`.
- Keep filtering and derived calculations in `src/features/hq/selectors.ts`.
- Use `src/proxy.ts` for framework-level request interception; do not reintroduce `src/middleware.ts`.
- Do not add new product behavior to the legacy HTML prototype.
- Replace prototype-backed segments with React components one page or shell segment at a time.
