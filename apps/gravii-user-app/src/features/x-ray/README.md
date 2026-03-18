# X-Ray Feature Guide

This folder owns the `X-Ray` surface of the Launch App prototype.

X-Ray answers the question:

"What can Gravii infer about any wallet I want to inspect?"

## Feature Purpose

This is the most dashboard-like and flow-heavy surface in the prototype.

It combines:

- a search entry state
- a payment confirmation step
- a loading step
- a result dashboard
- a paginated history list

That makes it one of the strongest examples of a self-contained feature flow in the project.

## Main Files

### `x-ray-content.tsx`

This is the main surface controller.

Responsibilities:

- hold the wallet input
- open and close the payment modal
- simulate analysis loading
- switch between search, loading, and result modes
- paginate through history
- handle locked versus connected access

Why it matters:

- this component acts as the orchestrator for the entire X-Ray interaction flow

### `x-ray-view-model.ts`

Responsibilities:

- expose X-Ray price and summary stats
- paginate analysis history
- provide access to result data via `getAnalysisResult`

### `look-up-data.ts`

Responsibilities:

- define the mock analysis history list
- define the mock X-Ray result payload

This file is effectively the current fake backend for the X-Ray feature.

### `components/x-ray-pay-modal`

Responsibilities:

- present the payment confirmation step
- expose cancel and confirm actions
- prevent inner dialog clicks from closing the backdrop

### `components/x-ray-history-list`

Responsibilities:

- render paginated history rows
- let the user reopen a previous wallet analysis

### `components/x-ray-result-view`

Responsibilities:

- render the full result dashboard for one analyzed wallet
- organize the result into identity, metrics, portfolio, funding, DeFi, risk, and transfer sections
- reuse shared UI primitives such as `Card`, `MiniBar`, and `SectionTitle`

This component is intentionally large because it represents a dense analytical dashboard rather than a small card or widget.

## Feature Flow

The feature flow is:

1. Enter a wallet address.
2. Click analyze.
3. Confirm payment in the modal.
4. Wait through a simulated loading state.
5. View the result dashboard.
6. Optionally return to search or reopen history rows.

This flow gives the prototype a believable product rhythm, even though the underlying data is still mocked.

## Connected vs Disconnected States

### Disconnected

The user can read the proposition and price framing, but cannot analyze.

### Connected

The user can:

- submit a mock request
- view history
- navigate into a result

## What This Feature Owns

- analysis flow state
- payment confirmation UI
- result dashboard rendering
- history pagination

## What This Feature Does Not Own

- real payment processing
- actual wallet analysis orchestration
- backend polling
- persistent request lifecycle state

## Production Direction

When the real platform is connected, this feature will likely gain:

- request submission API calls
- async status polling or server push updates
- error states for failed analyses
- durable history reads
- richer pricing or credit state

Even with those additions, the current folder boundary should remain valid because the entire flow is still one coherent product surface.
