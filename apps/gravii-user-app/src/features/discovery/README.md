# Discovery Feature Guide

This folder owns the `Discovery` campaign surface in the current Launch App rollout.

## Feature Purpose

This feature currently exists to:

- keep the `DISCOVERY` route and panel contract stable
- read from the Discovery catalog adapter when the backend endpoint exists
- render no local partner or campaign rows while live data is unavailable
- expose loading, error, unavailable, and empty states without restoring mock data
- route users back to currently live surfaces instead of presenting local campaign rows

## Main Files

### `discovery-content.tsx`

This is the main surface component.

Responsibilities:

- call the Discovery catalog read adapter
- render live catalog rows when available
- render stable loading, unavailable, error, and empty states
- route users back to `GRAVII ID` and `X-RAY`
- preserve the shared panel contract used by the shell

## What This Feature Owns

- Discovery panel information architecture
- empty-state copy for the unavailable live catalog
- frontend-readiness for catalog, eligibility, and claim persistence

## What This Feature Does Not Own

- panel layout shell
- backend endpoint implementation
- real campaign claim writes
- production eligibility verification

## Production Direction

When the Discovery backend surface is ready, keep the visible shell stable and point the existing adapter at the live contract. Rows must continue to come from the backend rather than local fixtures.
