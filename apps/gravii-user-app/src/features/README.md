# Features Folder Guide

This folder contains the product-facing surfaces and the app-level feature core for the Launch App prototype.

## Why `features` Exists

The project is organized primarily around user-facing product surfaces rather than only around technical categories.

That means a feature folder is the place where a reader can usually find:

- the main content component for a surface
- feature-specific view-model logic
- local state helpers
- child components used only by that feature
- backend-backed adapters or explicit reserved-state content when live APIs are not ready

## Current Feature Map

### `launch-app`

This is not a normal screen feature. It is the shared feature-core for the prototype.

It owns:

- shell state
- shared panel metadata
- shared Launch App types
- shared content props and panel IDs used by multiple surfaces

If someone asks "what holds the prototype together above the individual panels?", this folder is part of the answer.

### `home`

Owns the Home command surface rendered from the logo tile entry point.

Responsibilities:

- presenting the app's starting point inside the workspace board
- carrying the large Gravii wordmark treatment for first-entry brand recognition
- explaining the current product map and session state
- routing connected users toward `GRAVII ID`
- routing anonymous users toward wallet sign-in

### `profile`

Owns the `GRAVII ID` surface.

Responsibilities:

- rendering the identity summary
- rendering connected versus disconnected states
- presenting persona-driven visuals
- highlighting the matched campaigns and navigation affordances into other surfaces

### `my-space`

Owns the preserved personalized benefit feed surface.

Responsibilities:

- keeping the reserved personalized feed route available for the later rollout
- rendering no local benefit or campaign rows until a live personalized-feed API exists
- linking back into `GRAVII ID` and `X-Ray`
- staying hidden from current navigation and direct panel routing until the product scope reactivates it

### `discovery`

Owns the broader campaign exploration surface.

Responsibilities:

- rendering the empty live-data placeholder for the future partner campaign catalog
- explaining the future catalog, eligibility, and claim path
- staying empty of catalog data until the backend contract is ready

### `x-ray`

Owns the wallet analysis surface.

Responsibilities:

- search input
- credit status and lookup entitlement messaging
- X-Ray-only credit purchase modal and Checkout Session redirect boundary
- loading transition
- result dashboard
- paginated history

### `standing`

Owns the `RANKING` surface.

Responsibilities:

- rendering the empty live-data placeholder for the future public ranking board
- keeping the wallet-specific rank layer gated behind sign-in
- explaining that public boards, current-wallet rank, seasons, and rewards must come from backend reads

## Why This Is Better Than a Flat `components/panels` Folder

If all product surfaces lived under one `components/panels` folder, feature logic would become harder to track because:

- state helpers would need another home
- backend adapters or reserved-state copy would need another home
- view-model logic would need another home
- feature-specific visual systems would need another home

A feature folder keeps those related responsibilities together.

## Reading Strategy

When exploring one surface, start with:

1. the `*-content.tsx` file
2. the feature README
3. the feature view-model, API adapter, or state helper when one exists
4. any nested `components/` folder

That usually gives a complete picture of how the surface works.
