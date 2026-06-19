# Layout Components Guide

This folder contains the shared structural components that make the Launch App workspace system work.

These components are responsible for framing and opening the product surfaces. They are not responsible for the business meaning of Profile, Discovery, X-Ray, or the other features.

## Design Role

The layout layer answers questions such as:

- How does a workspace navigation card look when inactive or active?
- How does the active product surface render inside the main workspace board as one readable surface?
- How is the common workspace title rendered inside non-home sections?
- How does the logo tile act as the Home entry point for the rest of the app?
- How does the left navigation stay visually grouped inside one contained sidebar?
- How does the sidebar use the product panel hues as one blended pastel navigation container?

It does not answer questions such as:

- Which campaigns are eligible?
- What persona is active?
- How does X-Ray calculate a result?

Those concerns belong to feature folders.

## Component Map

### `launch-panel`

Primary job:

- render one of the ordered navigation cards used by the Launch App workspace

Responsibilities:

- render the product section affordance in the left navigation rail
- handle click and keyboard selection behavior
- track the active visual state passed in by the shell
- choose dark or light text treatment based on the panel configuration
- expose accessible navigation labels for tests and keyboard users

Important details:

- it receives metadata from `src/features/launch-app/panel-config.ts`
- the Home section stays in shell state, but the logo tile renders the Home navigation control instead of a separate `00 HOME` card
- section cards sit inside one rounded sidebar container and use flat solid product colors, with no gradient, shadow, or hover treatment on the cards themselves
- the sidebar container uses a more expressive blended pastel background derived from warm and cool product-adjacent hues, while each card still owns its active expansion state
- active cards expand vertically in the sidebar instead of turning into the workspace body
- inactive cards remain visible so the user can jump between product surfaces without losing orientation
- navigation cards render only the section label, without extra descriptive copy inside the button
- selecting a card replaces the active workspace content with that section
- the active section no longer adds a large enclosing content surface; titles and feature content groups sit directly on the app canvas
- feature folders own the small floating panels and clickable row/button treatments inside that transparent workspace
- the app shell keeps navigation and feature content in separate scroll contexts: the sidebar stays fully visible, while the active workspace frame owns long-content scrolling
- on small screens, navigation opens as an off-canvas contained drawer while the workspace keeps its own scroll surface

What it does not own:

- the content of the feature itself
- the global active panel state
- any domain logic

### `panel-shell`

Primary job:

- render the common workspace frame shared by non-home product surfaces

Responsibilities:

- render the shared title treatment above the feature content groups
- render the body content passed from the feature
- preserve consistent spacing and display typography across sections

Why it matters:

- it gives the app a consistent in-surface title treatment
- it keeps each feature from duplicating the same shell structure

What it does not own:

- preview state logic
- active panel selection
- any feature-specific UI content

## Collaboration Between Layout Components

The normal expanded flow is:

1. `HomePage` decides which panel is active.
2. `LaunchPanel` renders the active state inside the navigation rail.
3. `HomePage` renders the active feature content directly inside the transparent workspace.
4. `PanelShell` adds a simple in-surface heading for non-home feature content.

This layering is useful because:

- the route entry stays declarative
- layout rules stay consistent
- features stay focused on their own content

## Why These Components Live in `components/layout`

They are shared infrastructure, not product-specific business features.

They are also not tiny generic UI atoms. They are structural wrappers that understand the panel system. That makes `components/layout` the clearest home for them.
