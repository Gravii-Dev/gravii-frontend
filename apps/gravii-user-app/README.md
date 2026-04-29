# Gravii Launch App

Launch App is Gravii's end-user product. It lets a connected wallet holder view a Gravii profile, discover campaigns, review personalized benefits, inspect leaderboard standing, and run wallet analysis on any address.

This repository now runs as a live-backend-connected frontend for the current Launch App rollout. Wallet sign-in, Gravii ID, and X-Ray use the production User API, while the remaining surfaces stay explicitly marked as coming soon until their backend surfaces are ready.

## Tech Stack

- Next.js 16
- React 19
- Bun for local package management and dev server
- TypeScript/TSX
- CSS Modules for feature-level styling plus shared globals in `src/app/globals.css`

## Local Development

### Requirements

- Bun
- Node.js runtime compatible with Next.js 16

### Commands

```bash
bun install
bun run dev
bun run lint
bun run typecheck
bun run build
```

`bun run dev` starts the app on `http://localhost:3003` so landing handoff stays stable inside the shared workspace.

Within the shared frontend workspace, Turbopack is configured to resolve from the parent workspace root so the app can still be run directly from this directory or orchestrated from the shared root.

## Current App Surfaces

The current product shell is a single-page experience with five ordered surfaces:

1. `GRAVII ID`
2. `X-RAY`
3. `STANDING`
4. `DISCOVERY`
5. `MY SPACE`

The route shell lives in [page.tsx](/Users/kxwxn/Gravii/FRONTEND/apps/gravii-user-app/src/app/page.tsx), and each surface renders from its own feature module plus shared layout primitives under `src/components/layout`.

## Repository Structure

```text
src/
  app/
    globals.css
    fonts/
      cloth.woff
      cloth.woff2
      geist-latin.woff2
    layout.tsx
    page.module.css
    page.tsx
  components/
    layout/
      launch-panel/
        index.tsx
        launch-panel.module.css
      panel-shell/
        index.tsx
        panel-shell.module.css
    ui/
      action-button/
        action-button.module.css
        index.tsx
      gravii-logo/
        gravii-logo.module.css
        index.tsx
      grain-overlay/
        index.tsx
      launch-primitives/
        index.tsx
        launch-primitives.module.css
  features/
    launch-app/
      panel-config.ts
      types.ts
    discovery/
      discovery-content.module.css
      discovery-content.tsx
    my-space/
      components/
        campaign-card/
          campaign-card.module.css
          index.tsx
      my-space-content.module.css
      my-space-content.tsx
    profile/
      components/
        infinite-canvas/
          index.tsx
          infinite-canvas.module.css
      persona-data.ts
      profile-content.module.css
      profile-content.tsx
    standing/
      standing-content.module.css
      standing-content.tsx
      standing-data.ts
    x-ray/
      x-ray-content.module.css
      x-ray-content.tsx
      x-ray-view-model.ts
  lib/
    auth/
      shared.ts
      user-api.ts
public/
  brand/
    centre-circle.svg
    curve.svg
    logo-symbol.svg
    logo-wordmark.svg
docs/
  launch-app/
    product-scope.md
    user-flows.md
    domain-model.md
    business-rules.md
    api-contract.md
    data-requirements.md
    architecture.md
```

## Documentation Index

- [docs/frontend-implementation-standards.md](/Users/kxwxn/Gravii/FRONTEND/apps/gravii-user-app/docs/frontend-implementation-standards.md)
- [docs/launch-app/product-scope.md](/Users/kxwxn/Gravii/FRONTEND/apps/gravii-user-app/docs/launch-app/product-scope.md)
- [docs/launch-app/user-flows.md](/Users/kxwxn/Gravii/FRONTEND/apps/gravii-user-app/docs/launch-app/user-flows.md)
- [docs/launch-app/domain-model.md](/Users/kxwxn/Gravii/FRONTEND/apps/gravii-user-app/docs/launch-app/domain-model.md)
- [docs/launch-app/business-rules.md](/Users/kxwxn/Gravii/FRONTEND/apps/gravii-user-app/docs/launch-app/business-rules.md)
- [docs/launch-app/api-contract.md](/Users/kxwxn/Gravii/FRONTEND/apps/gravii-user-app/docs/launch-app/api-contract.md)
- [docs/launch-app/data-requirements.md](/Users/kxwxn/Gravii/FRONTEND/apps/gravii-user-app/docs/launch-app/data-requirements.md)
- [docs/launch-app/architecture.md](/Users/kxwxn/Gravii/FRONTEND/apps/gravii-user-app/docs/launch-app/architecture.md)

## Current Prototype Status

Current live-backed parts:

- wallet challenge/signature sign-in against the User API
- 24 hour JWT session validation against the User API
- live `GRAVII ID` loading through `/api/v1/me/identity`, including short bootstrap polling for newly created wallets and the refreshed branded identity presentation
- live X-Ray credits, lookup history, fresh lookup runs, and detail reads with the new Gravii-branded analytical surface
- browser-side auth and user reads now go through a same-origin Next.js `/api/v1/*` rewrite before reaching the User API so local development is not blocked by backend CORS policy

Current intentionally reserved parts:

- `STANDING`
- `DISCOVERY`
- `MY SPACE`

These three surfaces now render explicit coming-soon states instead of the older mock product flows.

The main route shell lives in [page.tsx](/Users/kxwxn/Gravii/FRONTEND/apps/gravii-user-app/src/app/page.tsx), while all five product surfaces render through feature modules under `src/features`.

## Source Grounding

These docs are grounded in:

- the current prototype UI in [src/app/page.tsx](/Users/kxwxn/Gravii/FRONTEND/apps/gravii-user-app/src/app/page.tsx)
- Gravii knowledgebase notes related to Launch App
- `Litepaper.md`
- `wallet-triage-system.md`
- `gravii-api.md`
- `Gravii MVP-Data Labels & Required Data Points`

## Scope Boundary

This repository and its docs cover only `Launch App`.

They do not define:

- the public landing page
- the partner-facing dashboard
- full campaign operations tooling

## Assumptions

- Launch App will remain a separate end-user product from the landing page and dashboard.
- The backend will expose JSON APIs over HTTP rather than embedding all business logic inside the Next.js app.
- Wallet analysis and behavioral labeling will be shared platform capabilities consumed by Launch App.
