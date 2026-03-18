# Launch App API Contract

## Purpose

This document defines the API contract required to turn the current Launch App prototype into a real product. It is intentionally shaped around the existing UI.

## Contract Style

Recommended approach:

- use JSON over HTTP between Launch App and the Gravii backend
- validate all inputs and outputs with Zod on the server
- keep public or cross-repo contracts RESTful

Reason:

- Launch App and Gravii API already exist as separate concerns
- the current knowledgebase points to a dedicated backend service

## Conventions

- Base path: `/api/v1`
- Content type: `application/json`
- Authenticated endpoints require a wallet-backed session token
- Timestamps use ISO 8601 UTC strings
- Monetary values should be sent as numeric fields plus currency where needed

## Error Envelope

```json
{
  "error": {
    "code": "campaign_not_found",
    "message": "Campaign not found",
    "details": null
  }
}
```

## 1. Session and Identity

### POST `/api/v1/session/wallet-challenge`

Purpose:

- create a message for wallet signature

Request:

```json
{
  "wallet_address": "0x1234...",
  "wallet_type": "evm_eoa"
}
```

Response:

```json
{
  "message": "Welcome to Gravii",
  "nonce": "f2416d4d-20a8-4a4e-b35f-9b4f4c9f8b20",
  "expires_at": "2026-03-11T10:00:00Z"
}
```

### POST `/api/v1/session/wallet-verify`

Purpose:

- verify wallet signature and create a session

Request:

```json
{
  "wallet_address": "0x1234...",
  "wallet_type": "evm_eoa",
  "signature": "0xabcdef...",
  "nonce": "f2416d4d-20a8-4a4e-b35f-9b4f4c9f8b20"
}
```

Response:

```json
{
  "session_token": "jwt-or-session-token",
  "user": {
    "id": "usr_123",
    "display_name": "Messi",
    "primary_wallet": "0x1234..."
  }
}
```

## 2. Profile

### GET `/api/v1/me/profile`

Purpose:

- fetch the connected wallet's Gravii profile

Response:

```json
{
  "wallet_address": "0x1234...",
  "profile": {
    "primary_persona": "Strategic Holder",
    "secondary_personas": ["Profit Hunter", "Chain Hopper"],
    "tier": "Platinum",
    "home_chain": "Ethereum",
    "reputation_status": "trusted",
    "risk_status": "low",
    "active_since": "2023-10-01",
    "matched_campaign_count": 6,
    "computed_at": "2026-03-11T09:00:00Z"
  },
  "metrics": {
    "transaction_count": 1247,
    "monthly_volume_usd": 12010,
    "active_chain_count": 4,
    "defi_tvl_usd": 68200,
    "nft_count": 12,
    "trend_7d_pct": 3.2,
    "trend_30d_pct": 12.4,
    "trend_90d_pct": -2.8,
    "standout_percentile": 3
  }
}
```

### GET `/api/v1/me/profile/labels`

Purpose:

- fetch high-priority behavioral labels for the connected wallet

Response:

```json
{
  "wallet_address": "0x1234...",
  "labels": [
    {
      "key": "spending_tier",
      "value": "medium",
      "confidence": 0.94,
      "computed_at": "2026-03-11T09:00:00Z"
    }
  ]
}
```

## 3. My Space

### GET `/api/v1/me/campaigns`

Purpose:

- fetch personalized campaign feed for the connected wallet

Query params:

- `category`
- `limit`

Response:

```json
{
  "wallet_address": "0x1234...",
  "groups": {
    "eligible": [
      {
        "campaign_id": "cmp_1",
        "partner_name": "Partner Alpha",
        "name": "Yield Booster",
        "campaign_type": "Yield Boost",
        "category": "Wealth & Finance",
        "status": "eligible",
        "supported_chains": ["ethereum", "base"],
        "period_label": "Jan 30 - Mar 1, 2026",
        "description": "Prestige rewards for verified value.",
        "tags": [
          { "type": "verified", "label": "Smart Saver" },
          { "type": "tier", "label": "Platinum+" }
        ],
        "opt_in_status": "not_opted_in"
      }
    ],
    "almost_there": [],
    "invite_only": []
  },
  "computed_at": "2026-03-11T09:00:00Z"
}
```

### POST `/api/v1/me/campaign-opt-ins`

Purpose:

- create an opt-in record for the connected wallet

Request:

```json
{
  "campaign_id": "cmp_1",
  "source_surface": "myspace"
}
```

Response:

```json
{
  "campaign_id": "cmp_1",
  "wallet_address": "0x1234...",
  "status": "active",
  "opted_in_at": "2026-03-11T09:05:00Z"
}
```

## 4. Discovery

### GET `/api/v1/campaigns`

Purpose:

- fetch partner and campaign catalog

Query params:

- `category`
- `status`
- `search`
- `page`
- `page_size`

Response:

```json
{
  "items": [
    {
      "partner": {
        "id": "par_1",
        "name": "Partner Alpha",
        "status": "eligible"
      },
      "campaigns": [
        {
          "id": "cmp_1",
          "name": "Yield Booster",
          "campaign_type": "Yield Boost",
          "category": "Wealth & Finance",
          "status": "eligible",
          "supported_chains": ["ethereum", "base"],
          "period_label": "Jan 30 - Mar 1, 2026",
          "description": "Prestige rewards for verified value.",
          "tags": [
            { "type": "verified", "label": "Smart Saver" }
          ]
        }
      ]
    }
  ],
  "page": 1,
  "page_size": 20,
  "total": 1
}
```

### GET `/api/v1/campaigns/:campaignId`

Purpose:

- fetch one campaign with requirements and optional current-user evaluation

Response:

```json
{
  "campaign": {
    "id": "cmp_1",
    "partner_id": "par_1",
    "name": "Yield Booster",
    "campaign_type": "Yield Boost",
    "category": "Wealth & Finance",
    "status": "eligible",
    "supported_chains": ["ethereum", "base"],
    "period_label": "Jan 30 - Mar 1, 2026",
    "description": "Prestige rewards for verified value."
  },
  "requirements": {
    "required_personas": ["Smart Saver", "Profit Hunter"],
    "required_tier_min": "Platinum",
    "qualification_steps": [
      "Maintain core assets long-term",
      "Reach Platinum tier"
    ]
  },
  "current_wallet_evaluation": {
    "status": "eligible",
    "missing_requirements": []
  }
}
```

### POST `/api/v1/campaigns/:campaignId/verify-eligibility`

Purpose:

- run or fetch a verification result for the connected wallet

Request:

```json
{}
```

Response:

```json
{
  "campaign_id": "cmp_1",
  "wallet_address": "0x1234...",
  "status": "not_yet_eligible",
  "reasons": [
    "Current tier is Gold",
    "Required persona Strategic Holder not present"
  ],
  "missing_requirements": [
    "Reach Platinum tier",
    "Achieve Strategic Holder persona"
  ],
  "verified_at": "2026-03-11T09:10:00Z"
}
```

## 5. X-Ray

### POST `/api/v1/xray/analyses`

Purpose:

- create a wallet analysis request

Request:

```json
{
  "target_wallet_address": "0x7a3b...9f2c",
  "chain_family": "evm",
  "payment_method": "credits"
}
```

Response:

```json
{
  "analysis_id": "xra_123",
  "status": "pending",
  "price_amount": 0.1,
  "price_currency": "USDC",
  "requested_at": "2026-03-11T09:15:00Z"
}
```

### GET `/api/v1/xray/analyses/:analysisId`

Purpose:

- fetch request status and result when available

Response:

```json
{
  "analysis_id": "xra_123",
  "status": "complete",
  "target_wallet_address": "0x7a3b...9f2c",
  "requested_at": "2026-03-11T09:15:00Z",
  "completed_at": "2026-03-11T09:15:04Z",
  "result": {
    "primary_persona": "Strategic Holder",
    "secondary_personas": ["Profit Hunter", "Chain Hopper"],
    "tier": "Platinum",
    "reputation_status": "trusted",
    "risk_status": "low",
    "sybil_status": "clean",
    "flags": [],
    "metrics": {
      "portfolio_value_usd": 142300,
      "transaction_count": 1247,
      "monthly_volume_usd": 12010,
      "active_chain_count": 4,
      "defi_tvl_usd": 68200,
      "nft_count": 12
    },
    "portfolio_breakdown": {},
    "chain_breakdown": [],
    "funding_breakdown": {},
    "defi_breakdown": {},
    "transfer_breakdown": {},
    "gas_breakdown": {},
    "recent_activity": []
  }
}
```

### GET `/api/v1/me/xray/analyses`

Purpose:

- fetch recent X-Ray analysis history for the connected user

Query params:

- `page`
- `page_size`

Response:

```json
{
  "items": [
    {
      "analysis_id": "xra_123",
      "requested_at": "2026-03-11T09:15:00Z",
      "target_wallet_address": "0x7a3b...9f2c",
      "status": "complete",
      "primary_persona": "Strategic Holder"
    }
  ],
  "page": 1,
  "page_size": 10,
  "total": 1
}
```

## 6. Standing

### GET `/api/v1/leaderboards/categories`

Purpose:

- fetch available leaderboard categories

Response:

```json
{
  "items": [
    { "key": "top_movers", "label": "Top Movers" },
    { "key": "power_users", "label": "Power Users" }
  ]
}
```

### GET `/api/v1/leaderboards/:categoryKey`

Purpose:

- fetch leaderboard snapshot for one category

Response:

```json
{
  "category": {
    "key": "top_movers",
    "label": "Top Movers"
  },
  "snapshot": {
    "snapshot_date": "2026-03-11",
    "population_size": 279941,
    "computed_at": "2026-03-11T08:00:00Z"
  },
  "me": {
    "wallet_address": "0x1234...",
    "display_name": "Messi",
    "rank": 56247,
    "percentile": 21,
    "weekly_change": 342,
    "tier": "Gold",
    "top_category": "power_users"
  },
  "entries": [
    {
      "rank": 1,
      "display_name": "Benji",
      "wallet_preview": "xxx...sfxx",
      "tier": "Black",
      "weekly_change": 1
    }
  ]
}
```

## 7. Recommended Validation Rules

- wallet addresses must be normalized before processing
- unknown leaderboard categories return `404`
- ineligible campaigns still return detail payloads if they are visible in Discovery
- opt-in requests must reject duplicate active records
- X-Ray target wallets must be validated for supported chain family

## 8. Contract Ownership

- product owns user-facing semantics and state names
- backend owns provider orchestration and analysis internals
- frontend owns request timing, loading states, and optimistic UI only where explicitly safe

## Open Questions

- Should the session layer live in Launch App, in Gravii API, or in a shared auth service?
- Will eligibility be fetched precomputed, evaluated on demand, or both?
- Does X-Ray return immediately for cached wallets and async for uncached wallets?
