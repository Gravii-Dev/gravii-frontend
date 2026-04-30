# Standing Feature Guide

This folder now owns the reserved `Standing` surface in the current Launch App rollout.

Standing is still intended to answer "How do I compare with other users?", but for the current phase it remains a coming-soon surface while Gravii ID and X-Ray ship live first.

## Feature Purpose

The feature currently exists to:

- preserve the panel slot and wording for Standing
- communicate that ranked wallet context is planned
- avoid shipping stale mock leaderboard data during the live rollout

## Main Files

### `standing-content.tsx`

This is the main surface component.

Responsibilities:

- render the reserved-state copy and chrome
- render standing-specific readiness metrics and phased launch steps
- provide quick routes back to live Gravii ID and X-Ray surfaces
- preserve the panel contract used by the shell

## What This Feature Owns

- the Standing panel's reserved-state messaging
- the panel-specific coming-soon framing

## What This Feature Does Not Own

- shell state
- scoring logic
- snapshot generation jobs
- backend ranking computation

## Production Direction

When real leaderboard APIs arrive, this folder can expand again into a richer feature boundary with category switching, current-user standing, and ranking-table state. For now, the production-safe direction is to keep it explicitly reserved.
