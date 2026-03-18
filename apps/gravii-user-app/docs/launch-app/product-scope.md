# Launch App Product Scope

## Purpose

Launch App is Gravii's end-user interface for turning on-chain behavior into usable product value. It is the place where a wallet holder:

- connects a wallet
- receives a Gravii identity and behavioral summary
- sees campaigns matched to that identity
- explores the broader campaign marketplace
- checks social standing against peers
- analyzes any wallet through X-Ray

This document defines the MVP boundary for Launch App only.

## Product Position

Within the Gravii product suite:

- Landing Page handles acquisition and waitlist conversion.
- Launch App serves end users.
- Dashboard serves partners and campaign operators.

Launch App depends on shared Gravii platform capabilities:

- wallet analysis
- behavioral labels
- persona and tier assignment
- campaign eligibility evaluation
- leaderboard scoring

## Core User

Primary user:

- a crypto-native wallet holder who wants to understand their on-chain identity and access relevant benefits

Secondary user:

- a curious user who wants to inspect another wallet through X-Ray

## User Jobs

The MVP must let the user answer these questions:

- Who am I on-chain according to Gravii?
- Which campaigns are relevant to me right now?
- What do I need to do to unlock better campaigns?
- How do I compare with other users?
- What can Gravii infer about a wallet I want to inspect?

## Product Surfaces

### 1. Profile

Purpose:

- present the user's Gravii identity

Must show:

- primary persona
- up to two secondary personas
- membership tier
- home chain
- activity start date
- transaction count
- NFT count
- trend summary
- matched campaign count
- reputation summary

### 2. My Space

Purpose:

- show the campaigns most relevant to the current user

Must show:

- eligible campaigns
- almost-there campaigns
- invite-only campaigns
- category filters
- per-campaign detail
- opt-in state

### 3. Discovery

Purpose:

- show the broader campaign catalog, not just personalized items

Must show:

- partner directory
- campaign list by partner
- category filter
- status filter
- search
- campaign detail
- qualification guidance
- eligibility verification result

### 4. X-Ray

Purpose:

- analyze any wallet and return a Gravii-style behavioral summary

Must show:

- search input
- analysis pricing or credit gating
- analysis progress
- result dashboard
- recent analysis history

### 5. Standing

Purpose:

- show the user's ranking and peer context

Must show:

- multiple leaderboard categories
- user rank
- total population context
- percentile
- weekly movement
- top leaderboard entries

## MVP In Scope

The MVP includes:

- real wallet connection
- user session state
- real Gravii profile fetch for the connected wallet
- real campaign catalog read APIs
- real eligibility evaluation output
- real personalized My Space feed
- real X-Ray request and result retrieval
- real leaderboard read APIs
- basic opt-in tracking
- event instrumentation for product usage

## MVP Out of Scope

The MVP does not need:

- campaign creation or editing tools
- partner admin workflows
- user-to-user messaging
- portfolio trading execution
- claim settlement or reward distribution logic
- advanced social graph features
- highly configurable notification center
- in-app fiat payments

## Current Prototype vs MVP

Current prototype:

- static UI with mocked data
- no real authentication
- no backend writes
- no durable state

MVP target:

- the same five surfaces backed by real APIs and durable data

## Functional Requirements

### Wallet and Session

- user can connect a supported wallet
- app resolves a wallet identity for the session
- app loads profile-dependent surfaces after connection

### Gravii Identity

- app can fetch and render a profile snapshot for the connected wallet
- app can show profile freshness timestamp
- app can handle no-profile and low-data wallets

### Campaign Experience

- app can fetch partner and campaign data
- app can evaluate and display eligibility status
- app can explain why a campaign is locked
- app can record opt-in intent

### Wallet Analysis

- app can submit an analysis request for a target wallet
- app can show queued, running, complete, and failed states
- app can render the returned summary and breakdowns

### Ranking

- app can fetch leaderboard data for a category
- app can fetch the current user's standing in the same category

## Non-Functional Requirements

- mobile-usable responsive layout
- acceptable perceived latency for initial profile load
- clear loading and empty states
- deterministic display for eligibility and rank status
- observability for critical requests and failures

## Launch App KPIs

Suggested initial KPIs:

- wallet connect conversion rate
- profile load completion rate
- campaign detail view rate
- opt-in conversion rate
- X-Ray analysis completion rate
- 7-day repeat visit rate

## Open Questions

- Which chains are in MVP for connected user identity: EVM only or EVM plus Solana?
- Is X-Ray paid per request, credit-based, or free in the first release?
- Does opt-in only register intent, or does it trigger downstream claim/whitelist flows?
- Are leaderboard scores daily snapshots or continuously recomputed?
