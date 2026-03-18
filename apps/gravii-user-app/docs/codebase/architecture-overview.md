# Codebase Architecture Overview

This document explains how the current Launch App prototype is organized at the code level.

It is intentionally different from the product and backend architecture documents under `docs/launch-app`. Those documents describe the target product and platform. This document describes how the current frontend code is assembled today.

## Key Terms

### Architecture

Architecture describes the major responsibility boundaries in the app and how data or state flows between them.

In this repository, the high-level frontend architecture is:

1. `src/app/page.tsx` acts as the single route entry point.
2. `src/features/launch-app/use-launch-shell.ts` owns shared shell state such as the active panel and mock connection state.
3. `src/components/layout/*` renders the panel system around the feature content.
4. `src/features/*` renders each product surface and computes feature-specific UI state.
5. `src/features/launch-app/mock-repository.ts` and feature data files provide mock data to the screens.

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
- the dedicated `My Space` dock in `src/components/layout/my-space-dock`

The shell does not own the full internal logic of Profile, Discovery, X-Ray, or Standing. It only places those features inside the panel system and coordinates top-level interaction.

## Current Runtime Model

The prototype is currently a single-route, client-driven application.

Important implications:

- The main route is `/`.
- Most interactive code is client-side.
- There are no real API calls, wallet SDK calls, server actions, or persistent writes in the current implementation.
- The sign-in state is simulated in local React state.
- Screen data is mock data stored in TypeScript files.

At runtime, the flow is roughly:

```text
Root route
  -> HomePage (`src/app/page.tsx`)
  -> useLaunchShell()
  -> LaunchPanel / MySpaceDock
  -> feature content component
  -> feature-local state or view-model
  -> launchMockRepository / feature mock data
```

## Surface Map

The product currently exposes five surfaces:

### 1. Profile

- Folder: `src/features/profile`
- Product label in the UI: `GRAVII ID`
- Main job: show the current user's identity summary
- Extra visual system: the persona infinite canvas

### 2. My Space

- Folder: `src/features/my-space`
- Product label in the UI: `MY SPACE`
- Main job: show grouped, personalized campaign opportunities
- Local interaction state: category filter, open sections, expanded card, mock opt-in state

### 3. Discovery

- Folder: `src/features/discovery`
- Product label in the UI: `DISCOVERY`
- Main job: explore the broader campaign and partner catalog
- Local interaction state: category filter, status filter, search query, selected partner

### 4. X-Ray

- Folder: `src/features/x-ray`
- Product label in the UI: `X-RAY`
- Main job: simulate wallet analysis request, payment confirmation, loading, history, and result display

### 5. Standing

- Folder: `src/features/standing`
- Product label in the UI: `STANDING`
- Main job: show leaderboard categories, ranking context, and the user's standing

## Shared Systems

### `src/features/launch-app`

This folder is not one surface like the others. It is a shared feature-core layer for the current prototype.

It owns:

- cross-surface panel metadata in `panel-config.ts`
- shared type definitions in `types.ts`
- shell state in `use-launch-shell.ts`
- mock repository access in `mock-repository.ts`
- shared campaign data in `campaign-data.ts`

This folder exists because the prototype needs an "app-level feature layer" that is above the individual screens but below the route entry and layout components.

### `src/components/layout`

This folder owns the panel frame itself.

It contains:

- `launch-panel`: the standard vertical panel wrapper for Profile, Discovery, Standing, and X-Ray
- `my-space-dock`: the separate dock-style wrapper for My Space
- `panel-shell`: the shared expanded panel frame with the common header and footer

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
- mock sign-in toggling
- My Space category filtering and opt-in state
- Discovery filtering and detail view
- X-Ray payment flow and result rendering

The test setup mocks browser APIs such as canvas, `ResizeObserver`, and `matchMedia` so these UI systems can render in `jsdom`.

## What Changes When Real APIs Arrive

The current structure is already pointing toward a production-ready direction, but some responsibilities will shift:

### Things that will likely stay the same

- `src/app/page.tsx` staying thin
- `src/components/layout` continuing to own the panel frame
- each feature folder continuing to own its own surface
- feature-local view-models continuing to adapt raw API data into UI-ready shapes

### Things that will likely change

- mock repository reads will be replaced by feature-local API adapters or shared typed clients
- simulated connection state will be replaced by a real session or wallet integration
- mock opt-in state will move to backend writes
- X-Ray loading will become request-driven rather than timer-driven

### Things that may be added later

- feature-local `api.ts` or `queries.ts` files
- a session provider or global store if session state becomes broader than the shell
- route expansion if each surface eventually becomes its own URL

## Reading Order Recommendation

For someone new to the project, the most useful order is:

1. `src/app/page.tsx`
2. `src/features/launch-app/use-launch-shell.ts`
3. `src/components/layout/README.md`
4. each feature README under `src/features/*`
5. `src/components/ui/README.md`
6. `src/lib/README.md`

That order mirrors the real runtime layering of the app.
