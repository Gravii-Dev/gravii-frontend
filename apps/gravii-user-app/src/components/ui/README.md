# UI Components Guide

This folder contains reusable UI primitives and shared visual systems used across the Launch App prototype.

These components are smaller and more reusable than the feature surfaces, but they are not as low-level as the helpers in `src/lib`.

## Design Role

The UI layer answers questions such as:

- What should a shared action button look like?
- How should shared tag chips be rendered?
- How can multiple features reuse the same small display primitive?
- How can the app apply a reusable grain texture effect?

## Component Map

### `action-button`

Primary job:

- render a shared button style for shell and action controls

Responsibilities:

- apply the standard button styling for light or dark surfaces
- support compact and panel button sizes
- optionally stop click propagation so nested buttons do not accidentally trigger parent panel actions
- expose `aria-pressed` for toggle-like cases such as the mock sign-in button
- render the current Slush-inspired pill treatment with a bordered front face, a colored back face, and a vertical flip reveal on hover or focus

Where it is used:

- shell header sign-in or sign-out action
- panel close button
- feature CTA buttons such as analyze, restore session, opt in, and reserved-state actions

Why it matters:

- the panel system uses click handlers at multiple levels
- stopping propagation by default makes panel controls safer and more predictable

### `gravii-logo`

Primary job:

- render the approved Gravii symbol, wordmark, and motion mark from local brand assets

Responsibilities:

- expose a single API for `symbol`, `wordmark`, and `motion` variants
- optionally expose a `spinY` treatment for symbol-style usage when the shell needs a continuous vertical-axis rotation
- keep logo usage inside the app grounded in the shipped SVG assets under `public/brand`
- provide the symbol-only motion treatment used by session hydration, `GRAVII ID`, and `X-Ray`
- respect reduced-motion preferences for the animated curve orbit

Why it is shared:

- the same brand mark now appears in the shell header, loading states, and multiple feature surfaces
- centralizing the asset wiring keeps future logo updates local to one component

### `grain-overlay`

Primary job:

- render a reusable grain or noise texture on top of certain panel surfaces

Responsibilities:

- generate grayscale texture using simplex noise plus randomized grain
- render the result onto a canvas sized to the current element
- respond to resize through `ResizeObserver`
- expose `panel` and `dock` variants
- expose active and inactive visual opacity states

Why it is shared:

- `launch-panel` uses it directly and the older dock variant remains available only for legacy reference
- the effect is not owned by one specific feature

### `launch-primitives`

Primary job:

- provide small reusable display components used by multiple feature views

Exports:

- `SectionTitle`
- `Card`
- `MiniBar`
- `SharedTagChip`

Responsibilities of each primitive:

#### `SectionTitle`

- render a consistent section heading treatment
- currently used heavily in the X-Ray result dashboard

#### `Card`

- provide a shared card container style
- helps X-Ray sections and other surfaces reuse the same basic frame

#### `MiniBar`

- render a compact segmented percentage bar
- useful for funding source, DeFi, or transfer pattern summaries

#### `SharedTagChip`

- render campaign or persona tags with consistent type-driven styling
- map shared campaign tag semantics such as `verified`, `requires`, `tier`, and `open` into visual treatment

## Why These Components Live in `components/ui`

They are:

- presentational
- reused or reusable across multiple surfaces
- smaller than a feature
- not structural enough to belong in `components/layout`

## What Should Not Move Here

Do not move a component here just because it is visually interesting.

Keep a component inside a feature if:

- it is only used by one feature
- it depends heavily on feature-specific data
- its meaning is easier to understand inside the feature context

For example, the Profile infinite canvas is more appropriately owned by the Profile feature, even though it is a visual component.
