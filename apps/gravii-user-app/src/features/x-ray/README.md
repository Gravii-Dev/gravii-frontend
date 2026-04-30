# X-Ray Feature Guide

This folder owns the `X-Ray` surface of the Launch App prototype.

X-Ray answers the question:

"What can Gravii infer about any wallet I want to inspect?"

## Feature Purpose

This is the most dashboard-like and flow-heavy surface in the prototype.

It combines:

- a search entry state
- a live credits gauge and lookup entitlement messaging
- a loading step
- a result dashboard
- a paginated history list
- brand-led loading and restrained product section treatments shared with the new profile direction

That makes it one of the strongest examples of a self-contained feature flow in the project.

## Main Files

### `x-ray-content.tsx`

This is the main surface controller.

Responsibilities:

- hold the wallet input
- request live credits and lookup history
- submit real lookups to the backend
- open persisted X-Ray detail views
- switch between search, loading, and result modes
- paginate through history
- handle locked versus connected access

Why it matters:

- this component acts as the orchestrator for the entire X-Ray interaction flow

### `x-ray-view-model.ts`

Responsibilities:

- expose X-Ray summary stats
- paginate analysis history
- map tolerant backend X-Ray detail payloads into a UI-friendly view model

### `components/x-ray-history-list`

Responsibilities:

- render paginated history rows
- let the user reopen a previous wallet analysis

### `components/x-ray-result-view`

Responsibilities:

- render the full result dashboard for one analyzed wallet
- organize the result into identity, metrics, reputation, chain, and activity sections
- keep the result styling local so the analytical surface can evolve without reshaping shared primitives

This component is intentionally large because it represents a dense analytical dashboard rather than a small card or widget.

### `components/x-ray-credit-purchase-modal`

Responsibilities:

- preserve the future X-Ray credit purchase modal boundary
- keep checkout copy explicitly reserved until backend pricing, fulfillment, and webhook contracts exist
- avoid starting any payment transaction from the current frontend-only state

## Feature Flow

The feature flow is:

1. Enter a wallet address.
2. Click analyze.
3. Use available lookup credits to submit the live request.
4. Wait through the live analysis loading state with the Gravii motion mark.
5. View the persisted result dashboard.
6. Optionally return to search or reopen history rows.

## Connected vs Disconnected States

### Disconnected

The user can read the proposition and credit framing, but must restore the Gravii session before analysis can begin.

### Connected

The user can:

- submit a live lookup
- view real lookup history
- navigate into a persisted result

## What This Feature Owns

- analysis flow state
- result dashboard rendering
- history pagination

## What This Feature Does Not Own

- backend wallet analysis orchestration
- billing, checkout, or payment fulfillment rails
- global auth state
- wallet-provider connection

## Production Direction

The real platform is now partially connected. The remaining likely additions are:

- payment and checkout UX once backend pricing, credit purchase, webhook, and entitlement contracts exist
- richer async status handling if lookup latency changes
- stronger failure-state handling for provider-side errors
- more detailed backend result sections as the X-Ray schema stabilizes

The current folder boundary should remain valid because the entire lookup/history/detail flow is still one coherent product surface.
