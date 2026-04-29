# Discovery Feature Guide

This folder now owns the reserved `Discovery` surface in the current Launch App rollout.

For the current phase, Discovery is intentionally parked behind a coming-soon state while Gravii ID and X-Ray ship live first.

## Feature Purpose

This feature currently exists to:

- preserve the product slot and panel chrome for Discovery
- communicate that the exploratory campaign surface is planned
- avoid leaving stale mock catalog behavior in production-facing QA

## Main Files

### `discovery-content.tsx`

This is the main surface component.

Responsibilities:

- render the reserved/coming-soon content
- render discovery-specific readiness metrics and launch-stage visibility
- provide quick routes back to live Gravii ID and X-Ray surfaces
- keep the panel wording aligned with the current rollout priority
- preserve the shared panel contract used by the shell

## What This Feature Owns

- the Discovery panel's reserved-state copy
- the panel-specific coming-soon framing

## What This Feature Does Not Own

- live campaign browsing
- qualification logic
- partner filtering
- panel layout shell

## Production Direction

When the Discovery backend surface is ready, this folder can expand again into a richer feature boundary with server-backed catalog reads and eligibility actions. For now, the production-safe direction is to keep it explicitly reserved.
