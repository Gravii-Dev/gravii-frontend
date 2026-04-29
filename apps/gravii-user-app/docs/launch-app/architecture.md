# Launch App Architecture

## Purpose

This document describes the target architecture needed to turn the current Next.js prototype into a production Launch App.

## Current State

Current repository:

- Next.js frontend only
- single-page product shell
- live wallet sign-in against the User API now exists
- shared API client scaffolding now exists
- live Gravii ID and X-Ray backend reads now exist
- `Standing`, `Discovery`, and `My Space` remain reserved as coming-soon surfaces

Current shared platform context from knowledgebase:

- Gravii API exists separately as a backend service
- wallet analysis logic already points toward provider orchestration
- label generation and triage are shared platform concerns

## Target Architecture Overview

```text
User Wallet
  ->
Launch App (Next.js)
  ->
Launch App API client layer
  ->
Gravii Platform APIs
  ->
Analysis providers + campaign data + ranking jobs + storage
```

## Top-Level Components

### 1. Frontend App

Owned by this repo.

Responsibilities:

- wallet connect UI
- client-side JWT bootstrap
- route and surface rendering
- client-side loading, error, and empty states
- event instrumentation
- minimal local UI state

Recommended frontend additions:

- final browser QA against the live auth/data contracts
- partner/admin alignment with their live backend auth contracts
- remaining product-data hydration beyond Gravii ID and X-Ray
- reusable feature modules instead of one giant component

Current frontend readiness already includes:

- direct wallet sign-in against the live User API
- client-side JWT persistence and session validation
- live Gravii ID loading
- live X-Ray credits, lookup history, lookup runs, and detail reads
- explicit coming-soon reservations for the remaining three surfaces

### 2. Session Service

Responsibilities:

- wallet challenge generation
- signature verification
- JWT issuance
- session validation

Notes:

- the Launch App now calls this backend contract directly from the browser
- wallet verification and JWT issuance are not duplicated inside the Next.js app anymore

### 3. Profile and Label Service

Responsibilities:

- compute or fetch Gravii profile snapshots
- store persona, tier, and label outputs
- serve profile read models to Launch App

Inputs:

- transaction history
- balances
- DeFi positions
- label jobs

### 4. Campaign Service

Responsibilities:

- store partner catalog
- store campaign definitions
- store qualification rules
- evaluate eligibility
- store user opt-ins

Outputs:

- personalized My Space feed
- Discovery catalog
- campaign detail and qualification view

### 5. X-Ray Analysis Service

Responsibilities:

- accept wallet analysis requests
- triage target wallets
- orchestrate provider calls
- compute result summary
- persist analysis history

Inputs already suggested by knowledgebase:

- Kaia triage
- EVM balance and activity providers
- DeFi and NFT providers
- label generation logic

### 6. Leaderboard Service

Responsibilities:

- compute category-specific scores
- create daily or scheduled snapshots
- expose user standing and top entries

## Suggested Runtime Boundaries

### Next.js App

Use for:

- rendering
- session-aware page shells
- browser wallet interaction
- direct client calls to the authenticated User API

Do not use as the primary place for:

- blockchain analysis jobs
- heavy ranking computation
- long-running eligibility pipelines
- app-local auth issuance or cookie-backed refresh handling

### Gravii Backend

Use for:

- wallet analysis orchestration
- campaign eligibility evaluation
- label computation
- persistent read and write APIs

## Data Flow by Surface

### Profile

```text
Connect wallet
  -> verify session
  -> request live Gravii ID
  -> render profile and metrics
```

### My Space

```text
Connected wallet
  -> request personalized campaign feed
  -> render grouped campaigns
  -> submit opt-in writes
```

### Discovery

```text
Request partner catalog
  -> filter/search on client or server
  -> request campaign detail
  -> verify eligibility for connected wallet
```

### X-Ray

```text
Submit analysis request
  -> request live lookup
  -> refresh lookup history and credits
  -> request persisted detail
  -> render result
```

### Standing

```text
Request leaderboard categories
  -> request category snapshot
  -> request current user standing
  -> render table and summary
```

## Storage Model

Recommended durable storage domains:

- users and wallet mappings
- profile snapshots
- behavioral labels
- partner catalog
- campaign rules
- eligibility results
- opt-in records
- X-Ray analysis requests and results
- leaderboard snapshots and entries

## Caching Strategy

Suggested cache policy:

- profile snapshots: short TTL cache
- campaign catalog: medium TTL cache with purge on change
- eligibility results: cached but invalidated on key profile changes
- X-Ray results: cache by target wallet plus freshness window
- leaderboard: cache by snapshot key

## Security and Abuse Controls

Minimum controls required:

- signed wallet authentication
- request rate limiting
- abuse controls on X-Ray analysis
- audit trail for opt-ins and eligibility checks
- careful exposure of risk and fraud labels

## Observability

Need:

- request tracing from frontend to backend
- job status metrics for X-Ray
- profile load failure rates
- eligibility error rates
- leaderboard snapshot job health

## Implementation Phases

### Phase 1: Live Identity and X-Ray

- live JWT session bootstrap
- live Gravii ID endpoint
- live X-Ray credits/history/detail
- keep the remaining surfaces reserved instead of shipping stale mocks

### Phase 2: Replace Reserved Surfaces

- real campaign read endpoints
- real leaderboard read endpoints
- real My Space feed

### Phase 3: Production Hardening

- caching
- observability
- abuse controls
- data freshness guarantees

## Architecture Decisions to Lock Soon

- whether personalized feeds are precomputed or assembled on request
- whether X-Ray runs synchronously, asynchronously, or hybrid
- what database is authoritative for campaign and profile read models

## Open Questions

- The app now uses a same-origin Next.js rewrite for browser-side `/api/v1/*` calls so local and hosted browser sessions are not blocked by backend CORS policy. Should that remain a lightweight transport boundary only, or grow into richer server-side proxy logic later?
- Will wallet analysis results be eventually consistent across Profile and X-Ray, or separately versioned?
- Will ranking jobs and profile jobs share the same storage backend?
