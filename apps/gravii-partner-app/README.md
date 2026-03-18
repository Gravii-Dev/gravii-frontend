# Gravii Partner App v1

This repository was converted from a single static prototype HTML into a structured Next.js App Router application with TypeScript and CSS Modules.

## What changed

- Product-grade route structure for dashboard, Lens, Connect, Reach, and Settings
- Reusable layout and UI primitives instead of page-local inline markup
- Feature-owned mock data that can be swapped for real API data later
- Interactive campaign builder with live eligibility and reach preview
- Responsive app shell with mobile navigation

## Run locally

```bash
bun install
bun run dev
```

## Structure

```text
src/
  app/
  components/
  features/
  lib/
```

## Feature ownership

- `src/components/layout/app-shell` owns shell rendering and navigation config
- `src/features/*` own their page UI and feature-local data files
- `src/lib/*` is kept for shared utilities only

## Legacy prototype

The original prototype is still kept in the repo as:

- `Partner_App(incl-Dashboard)_new.html`

Use it as the reference spec until the React version is visually and behaviorally identical. The app source of truth is under `src/`.
