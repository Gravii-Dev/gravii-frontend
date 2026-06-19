# `launch-app` Feature Core Guide

This folder contains the shared feature-core for the current Launch App workspace.

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

Why it matters:

- it gives the prototype one common vocabulary
- it prevents each feature from redefining the same panel or campaign concepts

### `panel-config.ts`

Purpose:

- define the standard workspace navigation sequence and display metadata

What it owns:

- navigation order, including the Home command section rendered by the logo tile
- hidden panel IDs for code-preserved surfaces that should not be visible in the current product shell
- panel number labels for configuration and analytics context, even though the current nav UI hides them
- preview tab labels
- editor copy
- section summaries used by the navigation cards
- dark or light token preferences

Why it matters:

- `src/app/page.tsx` can render the contained left navigation declaratively
- layout components can style themselves from data instead of hardcoded branching spread across the app

### `use-launch-shell.ts`

Purpose:

- own the current shell interaction state

What it owns:

- `activePanel`
- handlers for navigation selection and home return

Why it matters:

- this is the current central source of truth for shell interaction
- it keeps `src/app/page.tsx` lightweight

What it does not own:

- real authentication
- wallet connection
- any persistent state

## How This Folder Works With the Rest of the App

The current flow looks like this:

1. `src/app/page.tsx` imports `PANELS` and `useLaunchShell`.
2. The route renders the logo Home control, contained left navigation, and one transparent active workspace based on `activePanel`.
3. The active panel renders its title and feature content groups directly on the app canvas.
4. Feature surfaces receive `SharedContentProps`.

This folder therefore acts as:

- the shared configuration layer
- the shared shell-state layer

## Why This Is Not the Same as `src/lib`

`src/lib` is for low-level helpers.

`launch-app` is not low-level. It knows about:

- panels
- the home command surface
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
