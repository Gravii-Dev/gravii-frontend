# Gravii Launch App

Launch App is Gravii's end-user product. It lets a connected wallet holder view a Gravii profile, discover campaigns, inspect ranking context, and run wallet analysis on any address.

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

The current product shell is a single-page experience with four visible ordered surfaces:

1. `GRAVII ID`
2. `X-RAY`
3. `DISCOVERY`
4. `RANKING`

`MY SPACE` is intentionally preserved in code but hidden from navigation and direct panel routing until the personalized feed returns to the active product scope.

The route shell lives in [page.tsx](/Users/kxwxn/Gravii/FRONTEND/apps/gravii-user-app/src/app/page.tsx), and each surface renders from its own feature module plus shared layout primitives under `src/components/layout`.

## Repository Structure

```text
src/
  app/
    api/
      user-api/
        [...path]/
          route.ts
      user-session/
        logout/
          route.ts
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
    x-ray/
      x-ray-content.module.css
      x-ray-content.tsx
      x-ray-view-model.ts
  lib/
    auth/
      server-user-session.ts
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

- WalletConnect/Reown AppKit wallet selection backed by the User API challenge/signature sign-in contract
- anonymous users can land on `/` without an automatic wallet prompt; explicit `SIGN IN` actions open the WalletConnect/Reown wallet modal directly, while `/sign-in` remains available as a direct-link fallback
- 24 hour User API session validation through an httpOnly same-origin session cookie
- live `GRAVII ID` loading through `/api/v1/me/identity`, including short bootstrap polling for newly created wallets and the persona dashboard presentation for persona, chain, rank, activity, reputation, NFTs, matched campaigns, and X-Ray entry
- live X-Ray credits, lookup history, fresh lookup runs, and detail reads with the new Gravii-branded analytical surface
- browser-side auth and user reads now go through the same-origin Next.js `/api/user-api/*` backend-for-frontend route; JWTs are captured server-side during wallet verification and are not exposed back to browser JavaScript

Current intentionally reserved parts:

- `DISCOVERY`
- `RANKING`
- hidden code-preserved `MY SPACE`

Discovery now keeps its structure visible behind a sign-in gate for anonymous users. Ranking shows the public board while gating wallet-specific rank behind sign-in. My Space remains code-preserved but hidden.

The main route shell lives in [page.tsx](/Users/kxwxn/Gravii/FRONTEND/apps/gravii-user-app/src/app/page.tsx), while visible and preserved product surfaces render through feature modules under `src/features`.

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
