# Discovery Feature Guide

This folder owns the `Discovery` campaign surface in the current Launch App rollout.

## Feature Purpose

This feature currently exists to:

- render partner and campaign discovery from a local product dataset until the backend catalog is connected
- keep category, status, and search filtering visible in the shell
- show campaign detail expansion, qualification guidance, and eligibility verification affordances
- keep the personalized campaign layer gated behind wallet sign-in for anonymous users

## Main Files

### `discovery-content.tsx`

This is the main surface component.

Responsibilities:

- render the campaign discovery hero, filter bar, partner grid, and partner detail route
- expose campaign CTAs such as `OPT IN`, `HOW TO QUALIFY`, `VERIFY MY ELIGIBILITY`, `NOTIFY ME WHEN LIVE`, and invite-only access states
- keep the campaign structure visible behind a sign-in blur gate for anonymous users
- route qualification guidance back to `GRAVII ID` and `RANKING`
- preserve the shared panel contract used by the shell

## What This Feature Owns

- Discovery panel information architecture
- local partner and campaign preview data
- campaign filtering, detail expansion, qualification guide state, and locked anonymous state

## What This Feature Does Not Own

- panel layout shell
- backend catalog reads
- real campaign claim writes
- production eligibility verification

## Production Direction

When the Discovery backend surface is ready, replace the local partner dataset with server-backed catalog reads and wire eligibility verification and claim actions to authenticated endpoints. The visible shell should remain stable.
