# My Space Feature Guide

This folder owns the code-preserved `My Space` surface.

`My Space` remains planned as the personalized benefit feed, but for the current phase it is intentionally hidden from navigation and direct panel routing while Gravii ID, X-Ray, Discovery, and Ranking stay visible.

## Feature Purpose

The feature currently exists to:

- preserve the `05 MY SPACE` implementation and panel metadata for a later rollout
- render no local benefit or campaign rows while the personalized backend feed is unavailable
- keep the route boundary ready for the later rollout
- avoid exposing the surface in the active navigation until the backend personalized feed contract is ready

## Main Files

### `my-space-content.tsx`

This is the main surface component.

Responsibilities:

- render the reserved state for the future personalized feed
- explain the required feed endpoint, benefit matching read model, and saved-space persistence
- provide quick routes back to live Gravii ID and Discovery surfaces
- preserve the panel contract used by the shell

## What This Feature Owns

- the hidden My Space panel boundary
- empty-state copy for the unavailable personalized feed
- backend-readiness milestones for feed, matching, and persistence

## What This Feature Does Not Own

- the global panel shell
- real opt-in persistence
- eligibility computation

## Production Direction

When the My Space backend surface is ready, add personalized server reads and connect saved-benefit or opt-in persistence. The current folder boundary can remain stable.
