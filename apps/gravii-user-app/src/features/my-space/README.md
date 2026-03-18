# My Space Feature Guide

This folder owns the `My Space` surface of the Launch App prototype.

`My Space` is the personalized campaign feed. It is where the app tries to answer:

"What benefits are most relevant to me right now?"

## Feature Purpose

The feature turns shared campaign and partner data into a user-centric grouped experience.

It organizes campaigns into:

- `YOUR BENEFITS`
- `ALMOST THERE`
- `INVITE ONLY`

This grouping is one of the clearest examples of the prototype taking a raw catalog and reshaping it into a product-specific experience.

## Main Files

### `my-space-content.tsx`

This is the main surface component.

Responsibilities:

- render the surface copy and category chips
- compute and render grouped campaign sections
- render connected and locked states
- coordinate the local UI state from `useMySpaceState`
- trigger navigation to Discovery or Profile when needed

### `my-space-view-model.ts`

Responsibilities:

- adapt shared partner and campaign data into grouped campaign collections
- attach partner metadata to campaign objects
- compute stable card keys

Why it matters:

- it keeps transformation logic outside the main UI component
- it hints at the future shape of a feature-local adapter layer

### `use-my-space-state.ts`

Responsibilities:

- own the current category filter
- track which sections are open
- track which campaign card is expanded
- track mock opt-in state

Why it matters:

- My Space has more internal interaction state than a static read-only list
- this hook keeps that local behavior cohesive

### `components/campaign-card`

Responsibilities:

- render one campaign card
- expose collapsed and expanded states
- show status-specific actions such as opt in, qualify, request access, or notify

## Feature Flow

The main feature flow is:

1. Read available categories from the mock repository.
2. Read grouped campaign collections from `getMySpaceCampaignCollections`.
3. Apply the current category filter.
4. Render three eligibility-based sections.
5. Let the user expand cards and simulate opt-in behavior.

This is currently a local UI flow with no persistence.

## Connected vs Locked States

### Connected

The user can:

- browse grouped campaigns
- change categories
- expand cards
- simulate opt-in
- jump into Discovery

### Locked

The user sees:

- the content window under a locked visual treatment
- a CTA to reveal the profile
- a CTA to connect the wallet

This is an intentional product pattern: My Space is presented as a personalized reward unlocked by identity.

## What This Feature Owns

- category-filtered grouping of personalized campaigns
- local expansion and opt-in behavior
- the meaning of `eligible`, `almost there`, and `invite only` sections in this surface

## What This Feature Does Not Own

- the global panel shell
- campaign search across all partners
- real opt-in persistence
- actual eligibility computation

## Production Direction

When real APIs arrive, the likely evolution is:

- replace grouped mock derivation with a personalized feed endpoint
- keep the section structure and UI state local to the feature
- swap local opt-in state for server-backed mutation state

That means the feature boundary should remain useful even after the mock layer is removed.
