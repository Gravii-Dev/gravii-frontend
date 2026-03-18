# Profile Feature Guide

This folder owns the `GRAVII ID` surface in the Launch App prototype.

In panel terms, this is the surface identified internally as `profile`. In the UI, that surface is labeled `GRAVII ID`.

## Feature Purpose

The Profile surface answers the user-facing question:

"Who am I on-chain according to Gravii?"

It does that by combining:

- a main persona
- secondary personas
- tier and reputation status
- summary metrics
- cross-links into other surfaces such as `My Space` and `X-Ray`
- a strong visual identity layer through the infinite canvas

## Main Files

### `profile-content.tsx`

This is the main surface component.

Responsibilities:

- render the connected state
- render the disconnected, locked state
- render hero metrics and summary cards
- expose navigation into `myspace` and `lookup`
- mount the `InfiniteCanvas` visual system

Important note:

- this component is the feature's main presentation layer
- it does not fetch remote data today
- it reads mock snapshot data and persona definitions

### `profile-view-model.ts`

This file currently exports `PROFILE_SNAPSHOT`.

Responsibilities today:

- provide the mock profile summary used by the surface

Likely future role:

- adapt API profile responses into a UI-friendly shape
- derive display strings and grouped metrics from backend data

### `persona-data.ts`

Responsibilities:

- define the catalog of personas used by the profile surface and canvas
- provide persona names, descriptions, and gradients

Why it matters:

- the Profile surface is visually and semantically built around the persona system

### `components/infinite-canvas`

Responsibilities:

- render the repeating persona canvas in the background region
- highlight the active persona when connected

This is described in more detail in `components/infinite-canvas/README.md`.

## Connected vs Disconnected States

### Connected

When `connected` is `true`, the surface shows:

- persona hero card
- secondary persona tags
- tier badge
- activity and reputation metrics
- matched campaign navigation
- X-Ray navigation card

### Disconnected

When `connected` is `false`, the surface shows:

- skeleton placeholders for the hidden profile content
- a sign-in reveal card
- the canvas still remains to preserve the identity-oriented visual language

This split is important because it shows the product's intended progression from locked to personalized.

## Why the Infinite Canvas Lives Here

The infinite canvas is not a generic app decoration. It is conceptually tied to the Profile feature.

Reasons:

- it visualizes the persona system
- it highlights the active persona
- it reinforces the meaning of the `GRAVII ID` surface
- its behavior and copy make sense in the context of profile identity, not in a generic shared-effects folder

## Inputs and Outputs

Current inputs:

- `SharedContentProps`
- `PROFILE_SNAPSHOT`
- `PERSONA_ITEMS`

Current outputs:

- the `GRAVII ID` panel content
- navigation calls into `myspace` and `lookup`
- a share action for social posting

## What This Feature Owns

- profile-specific display logic
- identity metrics presentation
- persona framing
- the locked-to-revealed interaction model for profile

## What This Feature Does Not Own

- real session or wallet connection
- profile API calls
- cross-feature shell state
- campaign grouping logic
- X-Ray analysis logic

## Production Direction

When real APIs arrive, this folder will likely stay intact.

Likely additions:

- feature-local API adapters
- loading, empty, and error states
- freshness or computed-at metadata handling

The best production direction is probably to keep the same feature boundary while replacing the mock snapshot with a typed API-backed model.
