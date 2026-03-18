# Gravii Launch App

Launch App is Gravii's end-user product. It lets a connected wallet holder view a Gravii profile, discover campaigns, review personalized benefits, inspect leaderboard standing, and run wallet analysis on any address.

This repository currently contains a refactored product prototype implemented with Next.js App Router and Bun. The UI is production-like, but the data layer is still mock-driven. No real wallet connection, persistent storage, or backend API integration exists in this repo yet.

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

By default, `bun run dev` starts the Next.js dev server. If port `3000` is occupied, Next.js will automatically move to the next available port.

Within the shared frontend workspace, Turbopack is configured to resolve from the parent workspace root so the app can still be run directly from this directory or orchestrated from the shared root.

## Current App Surfaces

The current prototype is a single-page experience with five main surfaces:

1. `Profile`
2. `My Space`
3. `Discovery`
4. `X-Ray`
5. `Standing`

The route shell now lives in [page.tsx](/Users/kxwxn/Gravii/FRONTEND/apps/gravii-user-app/src/app/page.tsx), and each surface renders from its own feature module plus shared layout primitives under `src/components/layout`.

## Repository Structure

```text
src/
  app/
    globals.css
    layout.tsx
    page.module.css
    page.tsx
  components/
    layout/
      launch-panel/
        index.tsx
        launch-panel.module.css
      my-space-dock/
        index.tsx
        my-space-dock.module.css
      panel-shell/
        index.tsx
        panel-shell.module.css
    ui/
      action-button/
        action-button.module.css
        index.tsx
      grain-overlay/
        index.tsx
      launch-primitives/
        index.tsx
        launch-primitives.module.css
  features/
    launch-app/
      campaign-data.ts
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
      look-up-data.ts
      x-ray-content.module.css
      x-ray-content.tsx
  lib/
    gravii-fonts.ts
    simplex-noise.ts
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

The current implementation is still a prototype. The following parts are mocked in the UI:

- wallet connection and authentication state
- Gravii profile data
- campaign and partner catalog
- eligibility checks
- opt-in state
- X-Ray pricing, payment, and analysis result
- leaderboard positions and ranking deltas

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
