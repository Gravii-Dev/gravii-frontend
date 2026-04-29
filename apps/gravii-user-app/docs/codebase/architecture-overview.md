# Codebase Architecture Overview

This document explains how the current Launch App frontend is organized at the code level.

It is intentionally different from the product and backend architecture documents under `docs/launch-app`. Those documents describe the target product and platform. This document describes how the current frontend code is assembled today.

## Key Terms

### Architecture

Architecture describes the major responsibility boundaries in the app and how data or state flows between them.

In this repository, the high-level frontend architecture is:

1. `src/app/page.tsx` acts as the single route entry point.
2. `src/features/auth/auth-provider.tsx` owns client-side User API session bootstrap and sign-in routing.
3. `src/features/launch-app/use-launch-shell.ts` owns shared shell state such as the active and hovered panel.
4. `src/components/layout/*` renders the panel system around the feature content.
5. `src/features/*` renders each product surface and computes feature-specific UI state.
6. `src/lib/auth/user-api.ts` owns User API calls and wire-to-view model normalization for live auth, Gravii ID, and X-Ray data.

### Folder Structure

Folder structure is the physical layout of files and directories. It is how the architecture is represented on disk.

The current structure is mostly feature-first:

- `src/app` for the route entry
- `src/features` for product surfaces and feature-specific logic
- `src/components/layout` for the shared panel frame
- `src/components/ui` for reusable primitives
- `src/lib` for low-level helpers

### Responsibility Unit

A responsibility unit is the smallest meaningful area of ownership.

Examples in this repository:

- `src/features/profile` owns the `GRAVII ID` surface.
- `src/components/layout/panel-shell` owns the common expanded panel frame.
- `src/components/ui/grain-overlay` owns one visual effect and nothing else.

Good responsibility boundaries answer two questions clearly:

- What is this module allowed to do?
- What is this module intentionally not responsible for?

### Shell

In this repository, "shell" means the shared application frame around feature content.

The shell includes:

- the top header in `src/app/page.tsx`
- the active or hovered panel state in `src/features/launch-app/use-launch-shell.ts`
- the panel opening and closing behavior in `src/components/layout/launch-panel`
- the shared expanded frame in `src/components/layout/panel-shell`

The shell does not own the full internal logic of Profile, Discovery, X-Ray, or Standing. It only places those features inside the panel system and coordinates top-level interaction.

## Current Runtime Model

The app is currently a single-route, client-driven frontend with live User API integration for auth, Gravii ID, and X-Ray.

Important implications:

- The main route is `/`.
- Most interactive code is client-side.
- Wallet sign-in uses an injected EVM wallet on `/sign-in`.
- The browser stores the User API JWT and revalidates it through the User API.
- Browser API reads go through the same-origin `/api/v1/*` rewrite before reaching the User API.
- `GRAVII ID` and `X-RAY` use live backend reads.
- `STANDING`, `DISCOVERY`, and `MY SPACE` are reserved coming-soon surfaces.
- Some mock-era data and view-model files still exist but are no longer the active runtime path for reserved surfaces.

At runtime, the flow is roughly:

```text
Root route
  -> HomePage (`src/app/page.tsx`)
  -> UserAuthProvider (`src/features/auth/auth-provider.tsx`)
  -> useLaunchShell()
  -> LaunchPanel / PanelShell
  -> feature content component
  -> feature-local state or view-model
  -> User API helper or reserved coming-soon state
  -> Next.js /api/v1 rewrite
  -> Gravii User API
```

## Surface Map

The product currently exposes five surfaces:

### 1. Profile

- Folder: `src/features/profile`
- Product label in the UI: `GRAVII ID`
- Main job: load and render the current user's live Gravii identity summary
- Extra visual system: the persona infinite canvas

### 2. My Space

- Folder: `src/features/my-space`
- Product label in the UI: `MY SPACE`
- Main job: reserve the future personalized benefits surface
- Current state: coming soon

### 3. Discovery

- Folder: `src/features/discovery`
- Product label in the UI: `DISCOVERY`
- Main job: reserve the future campaign discovery surface
- Current state: coming soon

### 4. X-Ray

- Folder: `src/features/x-ray`
- Product label in the UI: `X-RAY`
- Main job: run live wallet analysis lookups, show credits, reopen history, and render persisted result details

### 5. Standing

- Folder: `src/features/standing`
- Product label in the UI: `STANDING`
- Main job: reserve the future ranked standing surface
- Current state: coming soon

## Shared Systems

### `src/features/launch-app`

This folder is not one surface like the others. It is a shared feature-core layer for the current prototype.

It owns:

- cross-surface panel metadata in `panel-config.ts`
- shared type definitions in `types.ts`
- shell state in `use-launch-shell.ts`
- legacy mock repository and campaign data files that should be audited before the design system migration

This folder exists because the app needs an app-level feature layer that is above the individual screens but below the route entry and layout components.

### `src/components/layout`

This folder owns the panel frame itself.

It contains:

- `launch-panel`: the standard vertical panel wrapper for the five current panels
- `panel-shell`: the shared expanded panel frame with the common header and footer
- `my-space-dock`: a legacy or alternate My Space layout primitive that is not part of the current `src/app/page.tsx` runtime path

These components know how the app opens and frames content, but they do not own the business logic inside each feature.

### `src/components/ui`

This folder owns reusable primitives shared across multiple surfaces.

It contains:

- `action-button`: a reusable button style with propagation control
- `grain-overlay`: a reusable canvas noise effect for panels and docks
- `launch-primitives`: small reusable display primitives used mainly in X-Ray and campaign views

### `src/lib`

This folder owns non-visual helpers with lower-level responsibilities.

It currently contains:

- `auth/user-api.ts`: User API client helpers and payload normalization
- `auth/shared.ts`: user sign-in route helpers
- `simplex-noise.ts`: math helpers used by the grain effect
- `gravii-fonts.ts`: shared font name constants

## Canvas Usage

The codebase currently uses canvas in two runtime features:

### `src/components/ui/grain-overlay`

Purpose:

- render a textured monochrome grain layer for certain panels
- add depth without introducing a large external asset

Behavior:

- builds noise on an offscreen canvas
- copies it into the visible canvas on resize
- is used as a shared visual enhancement

### `src/features/profile/components/infinite-canvas`

Purpose:

- render a repeating persona tile field behind the Profile surface
- visually reinforce the idea of many possible personas, with the active one highlighted

Behavior:

- tracks scroll velocity and position
- redraws on animation frames
- delegates drawing math to `infinite-canvas-renderer.ts`

The canvas layer is purely presentational in both cases. It does not drive business logic or data state.

## Testing Shape

Current tests focus on key interactions instead of full visual verification.

Covered today:

- panel open and close behavior
- sign-out button behavior through the mocked auth provider
- reserved Discovery and My Space coming-soon states
- X-Ray session-required behavior
- X-Ray live-flow rendering through mocked User API helpers

The test setup mocks browser APIs such as canvas, `ResizeObserver`, and `matchMedia` so these UI systems can render in `jsdom`.

## What Changes As More APIs Arrive

The current structure is already partially live-backed, but more responsibilities will shift as Standing, Discovery, and My Space receive backend contracts.

### Things that will likely stay the same

- `src/app/page.tsx` staying thin
- `src/components/layout` continuing to own the panel frame
- each feature folder continuing to own its own surface
- feature-local view-models continuing to adapt raw API data into UI-ready shapes

### Things that will likely change

- remaining mock-era files will be removed or replaced by feature-local API adapters
- future campaign catalog, eligibility, opt-in, and leaderboard data will move to backend-backed reads and writes
- auth/session hardening may move some access decisions out of purely client-side state
- feature-level API orchestration may move out of large surface components when the live contracts expand

### Things that may be added later

- feature-local `api.ts` or `queries.ts` files
- a session provider or global store if session state becomes broader than the shell
- route expansion if each surface eventually becomes its own URL
- shared design system primitives once the redesign begins

## Reading Order Recommendation

For someone new to the project, the most useful order is:

1. `src/app/page.tsx`
2. `src/features/auth/auth-provider.tsx`
3. `src/lib/auth/user-api.ts`
4. `src/features/launch-app/use-launch-shell.ts`
5. `src/components/layout/README.md`
6. each feature README under `src/features/*`
7. `src/components/ui/README.md`
8. `src/lib/README.md`
9. `docs/codebase/current-project-analysis.md`
10. `docs/design-system/launch-app-design-system-plan.md`

That order mirrors the real runtime layering of the app.
