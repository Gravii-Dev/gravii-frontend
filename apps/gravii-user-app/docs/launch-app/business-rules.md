# Launch App Business Rules

## Purpose

This document defines the user-facing rules that Launch App relies on. It is intentionally product-focused rather than implementation-specific.

## Rule Categories

- access and session rules
- profile and persona rules
- campaign eligibility rules
- X-Ray rules
- leaderboard rules

## 1. Access and Session Rules

### 1.1 Wallet Connection

- A user must connect a supported wallet to unlock personalized surfaces.
- Disconnected users may browse limited preview states but cannot receive personalized eligibility results.
- Session identity is anchored to the connected wallet.

### 1.2 Supported Wallets

MVP assumption:

- EVM wallets are required
- Solana support is optional and should be treated as a deliberate scope decision, not implied

### 1.3 Profile Availability

- If the wallet has not yet been analyzed, the app may show a `profile pending` or `insufficient data` state.
- The app must not invent personas for wallets with no supporting activity.

## 2. Profile and Persona Rules

### 2.1 Primary Persona

- Each eligible wallet receives exactly one primary persona for display.
- The primary persona should represent the strongest current behavioral signal.

### 2.2 Secondary Personas

- A wallet may display up to two secondary personas.
- Secondary personas should not duplicate the primary persona.
- Secondary personas should be ranked by confidence or relevance.

### 2.3 Tier

- Each wallet receives one membership tier.
- Tier should be monotonic at a point in time: a user cannot display multiple tiers simultaneously.
- MVP display tiers observed in the prototype are `Classic`, `Gold`, `Platinum`, and `Black`.

### 2.4 Reputation

- Reputation is distinct from tier.
- Reputation reflects trust and account quality rather than purchasing power alone.
- A wallet can have a high tier and still have risk flags.

### 2.5 Risk and Flags

- Risk signals must be shown separately from persona and tier.
- High-risk or suspicious labels must not be hidden from X-Ray results.
- Risk output should be explainable at least at summary level.

## 3. Campaign Eligibility Rules

### 3.1 Campaign Statuses

Launch App currently implies these user-facing statuses:

- `eligible`
- `reach_to_unlock`
- `invite_only`
- `upcoming`
- `ineligible`

These statuses should remain mutually exclusive at evaluation time.

### 3.2 Eligibility Inputs

Campaign evaluation may depend on:

- primary persona
- secondary personas
- membership tier
- asset holdings
- stablecoin reserves
- trading activity
- ranking threshold
- chain activity
- recency of activity

### 3.3 My Space Grouping

- `My Space` should only contain campaigns relevant to the connected user.
- The surface groups campaigns into:
  - eligible now
  - almost there
  - invite only

### 3.4 Discovery Visibility

- Discovery may show campaigns beyond the user's current eligibility.
- A user may inspect locked campaigns and qualification rules even when not eligible.

### 3.5 Qualification Steps

- Locked campaigns must expose qualification guidance as concrete steps.
- Guidance should map to objective signals wherever possible.
- If the campaign is truly unavailable, the UI should state that there is no alternate path.

### 3.6 Verification Behavior

- Eligibility verification must return a stable result for a known evaluation timestamp.
- Verification results should distinguish:
  - eligible now
  - not yet eligible
  - invite only
  - upcoming
  - unavailable

### 3.7 Opt-In

- Opt-in records explicit user intent.
- Opt-in alone does not guarantee reward, whitelisting, or successful campaign entry unless another downstream rule says so.
- A user should not be able to create duplicate active opt-ins for the same campaign.

## 4. X-Ray Rules

### 4.1 Target Wallet Analysis

- A connected user may request analysis for any supported wallet address.
- The target wallet does not need to belong to the requesting user.

### 4.2 Pricing

The current prototype shows `0.1 USDC` per analysis.

MVP rule assumption:

- X-Ray requires either a direct payment or a credit balance before analysis begins

### 4.3 Analysis Lifecycle

- Each X-Ray request must move through a clear lifecycle:
  - pending
  - running
  - complete
  - failed

### 4.4 Result Content

Each result should include:

- persona summary
- tier summary
- risk summary
- sybil or trust signal
- portfolio summary
- chain distribution
- funding source summary
- DeFi participation summary
- transfer behavior summary
- gas usage summary
- recent activity summary

### 4.5 History

- Prior analyses should be visible to the requesting user.
- History should show at least target wallet, request date, and summary persona.

### 4.6 Fresh Wallets

Per wallet triage guidance:

- fresh wallets should return quickly with a minimal result rather than forcing a full deep analysis

## 5. Leaderboard Rules

### 5.1 Categories

The current prototype implies these leaderboard categories:

- `Top Movers`
- `Power Users`
- `High Volume`
- `Rising Stars`
- `Trendsetters`
- `Most Active`

### 5.2 Ranking Snapshot

- Leaderboard data should come from a known computation window or snapshot.
- A user's displayed rank, percentile, and weekly change must refer to the same snapshot family.

### 5.3 Population Context

- Standing should always include the total ranked population or a clear subset label.
- Percentile should be derived from the current rank and population size.

### 5.4 Display Name

- If a user-controlled name is unavailable, the product may fall back to shortened wallet identity.

## 6. Label Rules

Knowledgebase documents imply these high-priority labels for MVP-quality analysis:

- sybil cluster
- spending analytics
- high risk
- active yield farmer
- churn risk (30d)

Rules:

- labels must carry a computation timestamp
- labels should expose confidence internally, even if the UI does not show it everywhere
- user-facing labels should prefer clarity over internal model terminology

## 7. Data Freshness Rules

- Profile and metrics should show a last computed timestamp.
- Eligibility should be recalculated when the inputs that matter have materially changed.
- Leaderboard should communicate snapshot timing.
- X-Ray results should show when they were computed.

## 8. Rule Precedence

When multiple rules conflict:

1. safety and fraud rules override growth rules
2. invite-only constraints override generic eligibility
3. closed or upcoming campaign state overrides profile-based matching
4. missing data should produce explicit uncertainty rather than assumed eligibility

## Open Questions

- Exact persona taxonomy and scoring thresholds are still not fixed in this repo.
- Tier thresholds need a final product decision.
- Campaign qualification rules need a normalized schema owned by product and backend together.
- X-Ray pricing and entitlement rules still need product approval.
