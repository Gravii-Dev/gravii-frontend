# Discovery Feature Guide

This folder owns the `Discovery` surface of the Launch App prototype.

Discovery answers a different question than My Space:

"What is available across the ecosystem, even beyond my personalized feed?"

## Feature Purpose

Where My Space is curated and personal, Discovery is broader and exploratory.

This feature lets the user:

- browse partner entries
- filter by category
- filter by partner status
- search by partner name
- drill into a partner detail view
- inspect campaign qualification guidance

## Main Files

### `discovery-content.tsx`

This is the main surface component.

Responsibilities:

- hold local filter state
- hold local selected partner state
- render list view versus detail view
- coordinate the locked overlay
- connect filter controls and partner cards to the feature state

### `discovery-view-model.ts`

Responsibilities:

- define supported status filters
- filter partners by search, category, and status
- derive representative tags shown on partner cards
- look up a selected partner by ID

Why it matters:

- it keeps data selection logic out of the main JSX
- it gives the feature a clean adaptation layer between raw partner data and UI needs

### `components/discovery-filters`

Responsibilities:

- render category filter chips
- render status filter chips
- render the partner search input

### `components/discovery-partner-card`

Responsibilities:

- render one summary card in the partner directory grid
- show basic partner metadata
- surface a compact tag summary
- trigger selection of a partner detail view

### `components/discovery-partner-detail`

Responsibilities:

- render the focused detail view for one partner
- show campaigns and campaign statuses
- allow campaign sections to open and close
- show opt-in, connect, notify, request access, or qualification actions depending on state
- render qualification steps when requested

## Feature Flow

The core flow is:

1. Start in directory mode.
2. Apply search and filter state to the partner list.
3. Open a partner card.
4. Transition to detail mode.
5. Expand a campaign.
6. Explore its status and next-step action.

This feature therefore combines both browse and inspect responsibilities.

## Connected vs Locked States

Unlike My Space, Discovery still exposes the catalog when disconnected, but it overlays the personalized or gated action layer.

This is a useful product distinction:

- the catalog itself is discoverable
- certain actions remain identity-gated

## What This Feature Owns

- catalog exploration behavior
- partner list filtering
- partner detail inspection
- qualification guide rendering

## What This Feature Does Not Own

- the curated personalized grouping used by My Space
- the panel layout shell
- real backend eligibility checks
- real mutation workflows

## Production Direction

With real APIs, Discovery will likely keep the same user experience shape.

Likely future changes:

- server-backed query parameters for category, status, search, and pagination
- real campaign detail responses
- real eligibility verification actions
- richer empty and loading states

The current structure already leaves a natural place for those additions inside this feature folder.
