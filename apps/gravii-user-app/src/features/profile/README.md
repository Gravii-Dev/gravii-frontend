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
- a branded identity presentation layer that prioritizes persona status over decorative marks

## Main Files

### `profile-content.tsx`

This is the main surface component.

Responsibilities:

- render the connected state
- render the disconnected, locked state
- render the profile hero, metrics, and navigation cards
- expose navigation into `myspace` and `lookup`
- keep the identity loading, retry, and locked states visually aligned with the brand system

Important note:

- this component is the feature's main presentation layer
- it now reads the live Gravii ID payload from the User API
- it keeps a short bootstrap polling window for newly created wallets until `/api/v1/me/identity` stops returning `404`
- it still uses local persona definitions to map backend labels into the visual system
- it no longer mounts the older infinite canvas by default, even though the canvas implementation remains in the folder for future experimentation

### `profile-view-model.ts`

Responsibilities today:

- adapt the live Gravii ID payload into a UI-friendly snapshot
- derive display strings and grouped metric labels from backend data

### `persona-data.ts`

Responsibilities:

- define the catalog of personas used by the profile surface and canvas
- provide persona names, descriptions, and gradients

Why it matters:

- the Profile surface is visually and semantically built around the persona system

## Connected vs Disconnected States

### Connected

When `connected` is `true`, the surface shows:

- a compact ready-state identity bar
- persona hero panel
- persona signal, tier, and net-worth summary
- secondary persona tags
- tier badge
- activity and reputation metrics
- matched campaign navigation
- X-Ray navigation card

### Disconnected

When `connected` is `false`, the surface shows:

- a branded locked-state hero
- preview cards that hint at the hidden identity data
- a session restore or retry action depending on state

This split is important because it shows the product's intended progression from locked to personalized.

## Inputs and Outputs

Current inputs:

- `SharedContentProps`
- live Gravii ID responses
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

- wallet-provider connection
- global auth bootstrap
- cross-feature shell state
- campaign grouping logic
- X-Ray analysis logic

## Production Direction

When real APIs arrive, this folder will likely stay intact.

Current production direction:

- keep this feature boundary intact
- keep using typed API-backed view models with feature-local loading, bootstrap polling, error, and retry states
- keep the brand-led presentation local to the feature instead of leaking profile-specific identity UI into global primitives
