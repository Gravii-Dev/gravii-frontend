# `launch-app` Feature Core Guide

This folder contains the shared feature-core for the current Launch App prototype.

It is easy to mistake this folder for "the whole app," but that is not quite its role. It sits between the route shell and the individual product surfaces.

## Why This Folder Exists

Some code in the prototype is:

- too Launch App-specific for `src/lib`
- not structural enough for `src/components/layout`
- shared across several surfaces, so it should not live inside only `profile` or `discovery`

This folder is the current home for that app-level feature logic.

## Files and Responsibilities

### `types.ts`

Purpose:

- define shared UI-facing types used across multiple surfaces

What it owns:

- panel IDs and panel configuration types
- shared content props passed into feature surfaces
- campaign, partner, leaderboard, and related mock-domain types

Why it matters:

- it gives the prototype one common vocabulary
- it prevents each feature from redefining the same panel or campaign concepts

### `panel-config.ts`

Purpose:

- define the standard panel sequence and display metadata

What it owns:

- panel order
- panel number labels
- preview tab labels
- editor copy
- dark or light token preferences
- hover behavior metadata

Why it matters:

- `src/app/page.tsx` can render the panel strip declaratively
- layout components can style themselves from data instead of hardcoded branching spread across the app

### `use-launch-shell.ts`

Purpose:

- own the current shell interaction state

What it owns:

- `activePanel`
- `hoveredPanel`
- `isConnected`
- handlers for open, close, connect, toggle connection, and hover updates

Why it matters:

- this is the current central source of truth for shell interaction
- it keeps `src/app/page.tsx` lightweight

What it does not own:

- real authentication
- wallet connection
- any persistent state

### `campaign-data.ts`

Purpose:

- provide shared mock campaign and partner data used by My Space and Discovery

What it owns:

- the benefit category list
- partner mock data
- campaign metadata and qualification steps

Why it matters:

- multiple surfaces depend on the same underlying campaign world
- storing it once helps the prototype stay internally consistent

### `mock-repository.ts`

Purpose:

- provide a centralized mock access layer

What it owns:

- wrapper methods that expose shared prototype data

Why it matters:

- feature screens depend on one access layer instead of importing every data file directly
- the repository shape hints at how future real data access could be introduced

Today it returns in-memory mock data. Later it can be replaced or adapted into real API access.

## How This Folder Works With the Rest of the App

The current flow looks like this:

1. `src/app/page.tsx` imports `PANELS` and `useLaunchShell`.
2. The route renders layout wrappers based on `PANELS`.
3. Feature surfaces receive `SharedContentProps`.
4. Feature screens read data directly or through `launchMockRepository`.

This folder therefore acts as:

- the shared configuration layer
- the shared shell-state layer
- the shared mock-domain layer

## Why This Is Not the Same as `src/lib`

`src/lib` is for low-level helpers.

`launch-app` is not low-level. It knows about:

- panels
- campaigns
- partners
- shared product surfaces
- shell connection state

That makes it app-specific feature logic, not a neutral utility layer.

## Likely Future Evolution

When real APIs arrive, this folder may evolve in one of two directions:

### Keep the folder and narrow its role

Possible future contents:

- panel metadata
- shell-level providers or controllers
- shared Launch App domain types

### Split the folder into more explicit names

Possible future replacements:

- `src/features/launch-shell`
- `src/features/app-core`
- `src/features/session`

Either approach can work. The important point is that the code here is app-level feature logic, not generic infrastructure.
