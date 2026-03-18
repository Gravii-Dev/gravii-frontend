# Launch App Data Requirements

## Purpose

This document lists the data fields required to power each Launch App surface. It translates the prototype UI into backend-facing data requirements.

## Data Sources

Likely source categories:

- blockchain explorers and node providers
- portfolio and token balance providers
- DeFi protocol data providers
- NFT holdings providers
- Gravii internal computed labels
- campaign and partner catalog managed by Gravii
- leaderboard snapshot jobs

## 1. Session and Wallet Data

Required fields:

- `wallet_address`
- `wallet_type`
- `chain_family`
- `signature_nonce`
- `session_token`
- `user_id`
- `display_name`

Used by:

- all personalized surfaces

## 2. Profile Surface Data

### Identity Fields

- `primary_persona`
- `secondary_personas`
- `tier`
- `home_chain`
- `reputation_status`
- `risk_status`
- `flags`
- `active_since`
- `computed_at`

### Summary Metric Fields

- `transaction_count`
- `monthly_volume_usd`
- `active_chain_count`
- `nft_count`
- `matched_campaign_count`
- `trend_7d_pct`
- `trend_30d_pct`
- `trend_90d_pct`
- `standout_percentile`

### Persona Canvas Data

- `persona_name`
- `persona_description`
- `persona_confidence`
- `persona_visual_variant`

Notes:

- the current prototype shows many persona names in a visual wall, so the product can either use a static taxonomy directory or live popularity data

## 3. My Space Data

### Personalized Feed Fields

- `campaign_id`
- `partner_id`
- `partner_name`
- `campaign_name`
- `campaign_type`
- `category`
- `status`
- `supported_chains`
- `period_label`
- `description`
- `tags`
- `opt_in_status`

### Grouping Fields

- `eligibility_status`
- `missing_requirements`
- `qualification_steps`

### Filter Fields

- `category`

Notes:

- the UI groups campaigns into `eligible`, `almost there`, and `invite only`, so each response needs a grouping-friendly status

## 4. Discovery Data

### Partner List Fields

- `partner_id`
- `partner_name`
- `partner_status`
- `campaign_count`
- `eligible_campaign_count`
- `representative_tags`
- `logo_or_avatar`

### Campaign Detail Fields

- `campaign_id`
- `partner_id`
- `campaign_name`
- `campaign_type`
- `category`
- `status`
- `supported_chains`
- `period_start`
- `period_end`
- `period_label`
- `description`
- `tags`
- `qualification_steps`

### User Evaluation Fields

- `current_wallet_status`
- `reasons`
- `missing_requirements`
- `verified_at`

### Search and Filter Inputs

- `category`
- `status`
- `search_query`

## 5. X-Ray Data

### Request Fields

- `target_wallet_address`
- `chain_family`
- `requested_by_wallet`
- `price_amount`
- `price_currency`
- `payment_state`
- `analysis_status`

### Result Summary Fields

- `primary_persona`
- `secondary_personas`
- `tier`
- `active_since`
- `reputation_status`
- `risk_status`
- `sybil_status`
- `flags`

### Key Metric Fields

- `portfolio_value_usd`
- `transaction_count`
- `monthly_volume_usd`
- `active_chain_count`
- `defi_tvl_usd`
- `nft_count`

### Trend Fields

- `trend_7d_pct`
- `trend_30d_pct`
- `trend_90d_pct`

### Portfolio Fields

- `asset_groups[]`
- `asset_groups[].label`
- `asset_groups[].value_usd`
- `asset_groups[].share_pct`
- `asset_groups[].tokens[]`
- `asset_groups[].tokens[].symbol`
- `asset_groups[].tokens[].value_usd`
- `asset_groups[].tokens[].chain_breakdown[]`

### Chain Fields

- `chain_breakdown[]`
- `chain_breakdown[].chain`
- `chain_breakdown[].value_usd`
- `chain_breakdown[].share_pct`
- `chain_breakdown[].token_count`

### Funding Fields

- `funding_breakdown.cex_pct`
- `funding_breakdown.bridge_pct`
- `funding_breakdown.wallet_pct`
- `funding_breakdown.top_sources`

### DeFi Fields

- `defi_breakdown.groups[]`
- `defi_breakdown.groups[].type`
- `defi_breakdown.groups[].share_pct`
- `defi_breakdown.groups[].protocols[]`
- `defi_breakdown.groups[].protocols[].name`
- `defi_breakdown.groups[].protocols[].share_pct`

### Transfer and Gas Fields

- `transfer_breakdown.incoming_pct`
- `transfer_breakdown.outgoing_pct`
- `transfer_breakdown.incoming_value_usd`
- `transfer_breakdown.outgoing_value_usd`
- `transfer_breakdown.top_counterparties`
- `gas_breakdown.total_gas_usd`
- `gas_breakdown.avg_gas_per_tx_usd`
- `gas_breakdown.top_chains`

### Recent Activity Fields

- `recent_activity[]`
- `recent_activity[].date`
- `recent_activity[].action`
- `recent_activity[].platform`
- `recent_activity[].chain`

### History Fields

- `analysis_id`
- `requested_at`
- `target_wallet_address`
- `primary_persona`
- `status`

## 6. Standing Data

### Category Fields

- `category_key`
- `category_label`
- `sort_order`

### User Standing Fields

- `rank`
- `population_size`
- `percentile`
- `weekly_change`
- `top_category`
- `tier`
- `display_name`
- `wallet_preview`

### Leaderboard Entry Fields

- `rank`
- `tier`
- `display_name`
- `wallet_preview`
- `weekly_change`

## 7. Shared Label Inputs

Per knowledgebase documents, the label system requires these broad input families:

- wallet identity and age
- transaction history
- token balances
- funding source traces
- counterparty graph data
- DeFi and protocol interactions
- risk and sanctions references

Priority label outputs currently implied as valuable to Launch App:

- `sybil_cluster`
- `spending_tier`
- `high_risk`
- `active_yield_farmer`
- `churn_risk_30d`

## 8. Freshness Expectations

Suggested freshness targets:

- profile summary: near-real-time or hourly cached
- campaign catalog: near-real-time when edited, otherwise cached
- eligibility result: recompute when profile inputs change materially
- X-Ray result: computed per request, cache allowed
- leaderboard: daily snapshot is acceptable

## 9. Minimum MVP Dataset

If launch needs a narrow first cut, the minimum viable backend dataset is:

- connected wallet identity
- one computed Gravii profile snapshot
- one campaign catalog with normalized eligibility status
- one X-Ray analysis response contract
- one leaderboard snapshot per category

## Open Questions

- Which providers are authoritative for token balances and DeFi positions in production?
- Which fields are stored durably versus computed on demand?
- Which profile fields are wallet-level versus user-level once multiple wallets exist?
