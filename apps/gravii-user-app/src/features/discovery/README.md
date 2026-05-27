# Discovery Feature Guide

This folder owns the `Discovery` campaign surface in the current Launch App rollout.

## Feature Purpose

This feature currently exists to:

- keep the `DISCOVERY` route and panel contract stable
- render no local partner or campaign rows while the backend catalog is unavailable
- explain the backend work needed for catalog, eligibility, and claim actions
- route users back to currently live surfaces instead of presenting local campaign rows

## Main Files

### `discovery-content.tsx`

This is the main surface component.

Responsibilities:

- render the live-data placeholder for Discovery
- describe the required catalog API, eligibility read model, and claim persistence
- route users back to `GRAVII ID` and `X-RAY`
- preserve the shared panel contract used by the shell

## What This Feature Owns

- Discovery panel information architecture
- empty-state copy for the unavailable live catalog
- backend-readiness milestones for catalog, eligibility, and claim persistence

## What This Feature Does Not Own

- panel layout shell
- backend catalog reads
- real campaign claim writes
- production eligibility verification

## Production Direction

When the Discovery backend surface is ready, add server-backed catalog reads and wire eligibility verification plus claim actions to authenticated endpoints. The visible shell should remain stable, but rows must come from the backend rather than local fixtures.
