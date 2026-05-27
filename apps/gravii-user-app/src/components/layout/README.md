# Layout Components Guide

This folder contains the shared structural components that make the Launch App workspace system work.

These components are responsible for framing and opening the product surfaces. They are not responsible for the business meaning of Profile, Discovery, X-Ray, or the other features.

## Design Role

The layout layer answers questions such as:

- How does a workspace navigation card look when inactive, hovered, or active?
- How does the active product surface render inside the main workspace board?
- How is the common workspace header rendered for non-home sections?
- How does the logo tile act as the Home entry point for the rest of the app?
- How does the active section keep an independent border and a thin entering bar inside the workspace board?

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
- track the active and hovered visual states passed in by the shell
- choose dark or light text treatment based on the panel configuration
- expose accessible navigation labels for tests and keyboard users

Important details:

- it receives metadata from `src/features/launch-app/panel-config.ts`
- the Home section stays in shell state, but the logo tile renders the Home navigation control instead of a separate `00 HOME` card
- section cards show their configured color by default, reverse to the neutral paper surface on hover, and show the marker dot only when active
- active cards expand vertically in the sidebar instead of turning into the workspace body
- inactive cards remain visible so the user can jump between product surfaces without losing orientation
- selecting a card replaces the active workspace surface with that section
- the active section owns its own thin "entering section" bar and bordered frame, so section boundaries stay visually explicit without stacking all sections at once
- the app shell keeps navigation and feature content in separate scroll contexts: the sidebar stays fully visible, while the active workspace frame owns long-content scrolling
- the active border frame is the full feature viewport; spacing lives inside the scroll surface so the visible content area does not shrink away from the border
- on small screens, the navigation rail becomes a compact responsive grid above the workspace board instead of relying on nav scrolling

What it does not own:

- the content of the feature itself
- the global active panel state
- any domain logic

### `panel-shell`

Primary job:

- render the common workspace frame shared by non-home product surfaces

Responsibilities:

- draw the shared header
- render the shared title treatment
- accept a header action slot for shared session controls such as `SIGN IN` or `SIGN OUT`
- provide the workspace action button, currently used to return to Home
- render the body content passed from the feature
- preserve consistent spacing and editorial display typography across sections

Why it matters:

- it gives the app a consistent workspace frame
- it keeps each feature from duplicating the same shell structure
- it keeps the top-right session action consistent across every expanded product surface

What it does not own:

- preview state logic
- active panel selection
- any feature-specific UI content

## Collaboration Between Layout Components

The normal expanded flow is:

1. `HomePage` decides which panel is active.
2. `LaunchPanel` renders the active state inside the navigation rail.
3. `HomePage` renders the active feature surface inside one bordered workspace section.
4. `PanelShell` wraps non-home feature content inside that active section.

This layering is useful because:

- the route entry stays declarative
- layout rules stay consistent
- features stay focused on their own content

## Why These Components Live in `components/layout`

They are shared infrastructure, not product-specific business features.

They are also not tiny generic UI atoms. They are structural wrappers that understand the panel system. That makes `components/layout` the clearest home for them.
