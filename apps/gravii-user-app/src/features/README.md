# Features Folder Guide

This folder contains the product-facing surfaces and the app-level feature core for the Launch App prototype.

## Why `features` Exists

The project is organized primarily around user-facing product surfaces rather than only around technical categories.

That means a feature folder is the place where a reader can usually find:

- the main content component for a surface
- feature-specific view-model logic
- local state helpers
- child components used only by that feature
- mock data that currently stands in for future API responses

## Current Feature Map

### `launch-app`

This is not a normal screen feature. It is the shared feature-core for the prototype.

It owns:

- shell state
- shared panel metadata
- shared Launch App types
- the mock repository wrapper
- shared campaign data used by multiple surfaces

If someone asks "what holds the prototype together above the individual panels?", this folder is part of the answer.

### `profile`

Owns the `GRAVII ID` surface.

Responsibilities:

- rendering the identity summary
- rendering connected versus disconnected states
- presenting persona-driven visuals
- highlighting the matched campaigns and navigation affordances into other surfaces

### `my-space`

Owns the personalized benefit feed surface.

Responsibilities:

- grouping campaigns by eligibility state
- handling category filtering
- tracking local open or closed section state
- tracking local expanded card state
- tracking mock opt-in state

### `discovery`

Owns the broader campaign exploration surface.

Responsibilities:

- partner search
- partner status filtering
- campaign category filtering
- card-to-detail view transitions
- qualification guidance UI

### `x-ray`

Owns the wallet analysis surface.

Responsibilities:

- search input
- credit status and lookup entitlement messaging
- reserved credit purchase modal boundary for the future checkout layer
- loading transition
- result dashboard
- paginated history

### `standing`

Owns the leaderboard surface.

Responsibilities:

- category switching
- percentile calculation
- ranking table rendering
- connected versus locked hero state

## Why This Is Better Than a Flat `components/panels` Folder

If all product surfaces lived under one `components/panels` folder, feature logic would become harder to track because:

- state helpers would need another home
- mock data would need another home
- view-model logic would need another home
- feature-specific visual systems would need another home

A feature folder keeps those related responsibilities together.

## Reading Strategy

When exploring one surface, start with:

1. the `*-content.tsx` file
2. the feature README
3. the feature view-model or state helper
4. any nested `components/` folder

That usually gives a complete picture of how the surface works.
