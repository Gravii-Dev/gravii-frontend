# My Space Feature Guide

This folder owns the code-preserved `My Space` surface.

`My Space` remains planned as the personalized benefit feed, but for the current phase it is intentionally hidden from navigation and direct panel routing while Gravii ID, X-Ray, Discovery, and Ranking stay visible.

## Feature Purpose

The feature currently exists to:

- preserve the `05 MY SPACE` implementation and panel metadata for a later rollout
- communicate that personalized benefits are still planned
- avoid shipping stale grouped-campaign mocks during the live auth/data rollout

## Main Files

### `my-space-content.tsx`

This is the main surface component.

Responsibilities:

- render the reserved-state copy and chrome when the hidden surface is reactivated
- render my-space-specific readiness metrics and phased launch steps
- provide quick routes back to live Gravii ID and X-Ray surfaces
- preserve the panel contract used by the shell

## What This Feature Owns

- the My Space panel's reserved-state messaging
- the panel-specific coming-soon framing

## What This Feature Does Not Own

- the global panel shell
- personalized feed grouping
- real opt-in persistence
- eligibility computation

## Production Direction

When the My Space backend surface is ready, this folder can expand again into the personalized-feed feature boundary. For the current rollout, keeping it explicitly reserved is the safer production posture.
