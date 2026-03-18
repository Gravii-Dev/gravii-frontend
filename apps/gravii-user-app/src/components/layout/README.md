# Layout Components Guide

This folder contains the shared structural components that make the Launch App panel system work.

These components are responsible for framing and opening the product surfaces. They are not responsible for the business meaning of Profile, Discovery, X-Ray, or the other features.

## Design Role

The layout layer answers questions such as:

- How does a panel look when collapsed?
- How does a panel expand?
- How is the common panel header rendered?
- How does the dedicated `My Space` dock behave compared with the other panels?

It does not answer questions such as:

- Which campaigns are eligible?
- What persona is active?
- How does X-Ray calculate a result?

Those concerns belong to feature folders.

## Component Map

### `launch-panel`

Primary job:

- render one of the standard vertical panels used by Profile, Discovery, Standing, and X-Ray

Responsibilities:

- render the preview state when the panel is not active
- handle click and keyboard opening behavior
- track the active, hovered, collapsed, and idle visual states passed in by the shell
- choose dark or light visual tokens based on the panel configuration
- mount `PanelShell` only when the panel is active

Important details:

- it receives metadata from `src/features/launch-app/panel-config.ts`
- it renders the passed children inside the shared `PanelShell`
- it can optionally render `GrainOverlay` for the Discovery panel

What it does not own:

- the content of the feature itself
- the global active panel state
- any domain logic

### `my-space-dock`

Primary job:

- render the special dock-like entry and expanded frame for `My Space`

Why it exists separately:

- `My Space` is visually treated differently from the standard vertical strip panels
- it needs its own preview layout and compact behavior

Responsibilities:

- render preview and expanded states
- forward hover and open events back to the shell
- apply the dock-specific grain and styling
- reuse `PanelShell` for the expanded state so the app still feels structurally consistent

What it does not own:

- campaign grouping
- category filtering
- opt-in state

### `panel-shell`

Primary job:

- render the common expanded frame shared by active panels

Responsibilities:

- draw the shared header
- render the panel number, title, and sublabel
- provide the close button
- render the body content passed from the feature
- render the footer label

Why it matters:

- it gives the app a consistent expanded frame
- it keeps each feature from duplicating the same shell structure

What it does not own:

- preview state logic
- active panel selection
- any feature-specific UI content

## Collaboration Between Layout Components

The normal expanded flow is:

1. `HomePage` decides which panel is active.
2. `LaunchPanel` or `MySpaceDock` receives that state.
3. The layout component mounts `PanelShell`.
4. `PanelShell` wraps the feature content.

This layering is useful because:

- the route entry stays thin
- layout rules stay consistent
- features stay focused on their own content

## Why These Components Live in `components/layout`

They are shared infrastructure, not product-specific business features.

They are also not tiny generic UI atoms. They are structural wrappers that understand the panel system. That makes `components/layout` the clearest home for them.
