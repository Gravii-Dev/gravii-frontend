# Launch App Domain Model

## Overview

Launch App is powered by a small set of user, campaign, analysis, and ranking entities. This document defines the domain model needed to back the current prototype with real data.

## Design Principles

- one connected user may control multiple wallets, but the MVP centers on one primary wallet session
- the Gravii profile is a computed snapshot, not purely hand-authored data
- campaign eligibility is derived from profile and activity facts
- X-Ray can target wallets other than the connected user's own wallet
- leaderboard data is snapshot-based for predictability

## Core Entities

### User

Represents the application account or session owner.

Fields:

- `id`
- `display_name`
- `avatar_url`
- `created_at`
- `last_seen_at`
- `status`

Notes:

- In a wallet-only MVP, `User` may be a thin wrapper around a primary wallet identity.

### Wallet

Represents a blockchain wallet known to the system.

Fields:

- `id`
- `address`
- `chain_family`
- `wallet_type`
- `normalized_address`
- `first_seen_at`
- `last_seen_at`

Enums:

- `chain_family`: `evm`, `solana`, `multi_chain`
- `wallet_type`: `evm_eoa`, `evm_smart`, `solana`

### UserWallet

Join model between a user and a wallet.

Fields:

- `user_id`
- `wallet_id`
- `relationship_type`
- `is_primary`
- `connected_at`

Purpose:

- lets one user attach multiple wallets later without distorting the core user model

### GraviiProfile

Computed profile snapshot for a wallet.

Fields:

- `wallet_id`
- `primary_persona`
- `secondary_personas`
- `tier`
- `home_chain`
- `reputation_status`
- `risk_status`
- `flags`
- `active_since`
- `matched_campaign_count`
- `computed_at`

Notes:

- this is the main object rendered in the `Profile` surface

### WalletMetrics

Numerical summary metrics for a profile snapshot.

Fields:

- `wallet_id`
- `transaction_count`
- `monthly_volume_usd`
- `active_chain_count`
- `defi_tvl_usd`
- `nft_count`
- `portfolio_value_usd`
- `trend_7d_pct`
- `trend_30d_pct`
- `trend_90d_pct`
- `standout_percentile`
- `computed_at`

### Label

Machine or rules-based behavioral labels attached to a wallet.

Fields:

- `wallet_id`
- `label_key`
- `label_value`
- `confidence`
- `source`
- `computed_at`

Examples:

- `sybil_cluster`
- `spending_tier`
- `high_risk`
- `active_yield_farmer`
- `churn_risk_30d`

### Partner

Represents an organization running campaigns in the Gravii ecosystem.

Fields:

- `id`
- `name`
- `slug`
- `status`
- `logo_url`
- `description`
- `created_at`

### Campaign

Represents a single user-facing opportunity.

Fields:

- `id`
- `partner_id`
- `name`
- `campaign_type`
- `category`
- `status`
- `description`
- `period_start`
- `period_end`
- `supported_chains`
- `visibility`
- `created_at`
- `updated_at`

Enums:

- `status`: `eligible`, `reach_to_unlock`, `invite_only`, `upcoming`, `ineligible`, `closed`
- `visibility`: `public`, `gated`, `invite_only`

### CampaignRequirement

Structured rule input for eligibility evaluation.

Fields:

- `campaign_id`
- `required_personas`
- `required_tier_min`
- `required_labels`
- `required_chain_activity`
- `required_volume_threshold_usd`
- `required_holdings`
- `required_rank_threshold`
- `qualification_steps`

Notes:

- qualification steps map directly to the explanatory UI in Discovery and My Space

### CampaignEligibility

Evaluation result for a wallet against a campaign.

Fields:

- `campaign_id`
- `wallet_id`
- `status`
- `reasons`
- `missing_requirements`
- `verified_at`
- `expires_at`

Purpose:

- powers My Space grouping and Discovery verification

### CampaignOptIn

Tracks a user's explicit interest or registration in a campaign.

Fields:

- `campaign_id`
- `wallet_id`
- `status`
- `opted_in_at`
- `source_surface`

Enums:

- `status`: `active`, `withdrawn`

### XRayAnalysis

A wallet analysis request and its result envelope.

Fields:

- `id`
- `requested_by_wallet_id`
- `target_wallet_id`
- `status`
- `price_amount`
- `price_currency`
- `requested_at`
- `completed_at`
- `error_code`

Enums:

- `status`: `pending`, `running`, `complete`, `failed`, `expired`

### XRayAnalysisResult

Structured result for the X-Ray surface.

Fields:

- `analysis_id`
- `primary_persona`
- `secondary_personas`
- `tier`
- `reputation_status`
- `risk_status`
- `sybil_status`
- `flags`
- `wallet_summary`
- `portfolio_breakdown`
- `chain_breakdown`
- `funding_breakdown`
- `defi_breakdown`
- `transfer_breakdown`
- `gas_breakdown`
- `recent_activity`
- `computed_at`

### LeaderboardCategory

Represents a category such as `Top Movers` or `Power Users`.

Fields:

- `key`
- `label`
- `description`
- `sort_order`
- `active`

### LeaderboardSnapshot

Represents a ranked snapshot for a category at a point in time.

Fields:

- `id`
- `category_key`
- `snapshot_date`
- `population_size`
- `computed_at`

### LeaderboardEntry

Represents a wallet's rank inside a snapshot.

Fields:

- `snapshot_id`
- `wallet_id`
- `rank`
- `score`
- `weekly_change`
- `tier_at_snapshot`
- `display_name`

## Relationships

```text
User 1--* UserWallet *--1 Wallet
Wallet 1--1 GraviiProfile
Wallet 1--1 WalletMetrics
Wallet 1--* Label
Partner 1--* Campaign
Campaign 1--1 CampaignRequirement
Campaign 1--* CampaignEligibility
Wallet 1--* CampaignEligibility
Campaign 1--* CampaignOptIn
Wallet 1--* CampaignOptIn
Wallet 1--* XRayAnalysis (requested_by)
Wallet 1--* XRayAnalysis (target)
XRayAnalysis 1--1 XRayAnalysisResult
LeaderboardCategory 1--* LeaderboardSnapshot
LeaderboardSnapshot 1--* LeaderboardEntry
Wallet 1--* LeaderboardEntry
```

## Read Models by Surface

### Profile Read Model

- `GraviiProfile`
- `WalletMetrics`
- selected `Label` values

### My Space Read Model

- `CampaignEligibility`
- `Campaign`
- `Partner`

### Discovery Read Model

- `Partner`
- `Campaign`
- optional `CampaignEligibility`
- `CampaignRequirement`

### X-Ray Read Model

- `XRayAnalysis`
- `XRayAnalysisResult`
- target `Wallet`

### Standing Read Model

- `LeaderboardCategory`
- `LeaderboardSnapshot`
- `LeaderboardEntry`
- current user's standing record

## Persistence Notes

- `GraviiProfile`, `WalletMetrics`, and `Label` should be versioned or timestamped snapshots, not mutable blobs without lineage.
- `CampaignEligibility` can be materialized for performance and recomputed when profile signals change.
- `LeaderboardEntry` should be snapshot-based to preserve historical consistency.

## Open Questions

- Will Launch App attach multiple wallets per user in MVP, or exactly one primary wallet?
- Is `display_name` user-editable, or fully derived?
- Is X-Ray analysis history private to the requesting wallet, or shareable by URL?
