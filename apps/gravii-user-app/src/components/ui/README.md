# UI Components Guide

This folder contains reusable UI primitives and shared visual systems used across the Launch App prototype.

These components are smaller and more reusable than the feature surfaces, but they are not as low-level as the helpers in `src/lib`.

## Design Role

The UI layer answers questions such as:

- What should a shared action button look like?
- How should shared tag chips be rendered?
- How can multiple features reuse the same small display primitive?
- How can the app keep shared surfaces on one solid material system?

## Component Map

### `action-button`

Primary job:

- render a shared button style for shell and action controls

Responsibilities:

- apply the standard button styling for light or dark surfaces
- support compact and panel button sizes
- optionally stop click propagation so nested buttons do not accidentally trigger parent panel actions
- expose `aria-pressed` for toggle-like cases such as the authenticated session button
- render the current solid pill treatment with tonal hover color and no 3D flip layer
- keep `data-liquid-glass="button"` only as a backwards-compatible material hook; the runtime now neutralizes glass blur and reflection

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
- render the revised symbol with a larger gap between the ring and lower curve
- compose the `wordmark` variant from the revised symbol as the `g` plus the exported `r a v ii` letter paths
- expose a `spinY` treatment for cases that explicitly need a continuous vertical-axis rotation
- keep logo usage inside the app grounded in the shipped SVG assets under `public/brand`
- provide the split symbol motion treatment used by session hydration, `GRAVII ID`, and `X-Ray`
- respect reduced-motion preferences for the animated ring and lower curve motion

Why it is shared:

- the same brand mark now appears in the shell header, the Home landing hero, loading states, and reserved-surface watermarks
- centralizing the asset wiring keeps future logo updates local to one component

### `theme-ink-transition`

Primary job:

- render the light/dark theme transition as a WebGL ink-bleed background layer

Responsibilities:

- use the Leonid Kostetskyi reference shader pattern for `noise(gl_FragCoord.xy * 0.2)` plus a `smoothstep` threshold
- animate the shader uniform in real time instead of using a raster mask sprite
- keep the transition behind the UI so text, cards, and controls do not geometrically distort
- use the reference theme colors `#FDFAF3` and `#1F1F1F`
- degrade safely by doing nothing if WebGL is unavailable

Why it is shared:

- it is a presentational transition primitive owned by the shell, but isolated from the page so the landing and app shells can reuse the same theme-motion contract later

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

## Material Runtime Note

The app still has `data-liquid-glass` attributes in older feature surfaces, but they are now compatibility hooks rather than a visual glass effect.

Current rule:

- `src/app/layout.tsx` neutralizes runtime `backdrop-filter` and pseudo-element reflection on these stable hooks.
- `src/app/globals.css` maps legacy liquid/glass color tokens to the current Raw Materials-inspired solid paper and ink palette.
- New shared primitives should use solid backgrounds, no caustic overlays, and no reflective pseudo-layers.
- Stable `data-*` attributes should remain only when they help older feature code inherit the shared material contract without targeting hashed CSS Module class names.
