# Standing Feature Guide

This folder owns the `Standing` surface of the Launch App prototype.

Standing answers the question:

"How do I compare with other users?"

## Feature Purpose

The feature presents leaderboard context through:

- category switching
- the user's own rank
- percentile context
- weekly movement
- a visible ranking table

Compared with the more exploratory Discovery surface or the flow-heavy X-Ray surface, Standing is a compact read-mostly analytical surface.

## Main Files

### `standing-content.tsx`

This is the main surface component.

Responsibilities:

- manage the active leaderboard category
- compute the current snapshot and percentile
- render connected and locked hero states
- render the ranking table for the selected category

### `standing-view-model.ts`

Responsibilities:

- calculate percentile from rank and total users
- select the current leaderboard snapshot for the active category

Why it matters:

- it keeps light transformation logic out of the main JSX
- it provides a natural place for future backend response adaptation

### `standing-data.ts`

Responsibilities:

- define mock leaderboard categories
- define mock leaderboard rows
- define the user's mock ranks
- define total population size

## Connected vs Disconnected States

### Connected

The user sees:

- personal rank summary
- percentile
- top category hint
- a highlighted self row above the ranking table

### Disconnected

The user sees:

- a locked hero prompt
- a connect wallet CTA
- the broader leaderboard table still remains as a product teaser

This mirrors the product idea that public leaderboard context can attract interest, while personalized standing requires identity.

## What This Feature Owns

- leaderboard category interaction
- personal ranking summary presentation
- table rendering for ranking rows

## What This Feature Does Not Own

- shell state
- real scoring logic
- snapshot generation jobs
- backend ranking computation

## Production Direction

When real APIs arrive, the likely evolution is:

- fetch categories and current category snapshots from the backend
- fetch the current user's standing from a real endpoint
- add empty, loading, and failure states for category switching

The view-model layer is already a good place to convert raw ranking responses into the display-oriented shape used by the UI.
