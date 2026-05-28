# Architecture Guide

Architecture notes for the Gravii public landing app.

## Core Decisions

- Next.js App Router and React Server Components are used for routes and metadata.
- React and Next.js code is TypeScript-only.
- CSS Modules are the primary component styling system.
- GSAP drives scroll-tied landing motion through app-local primitives.
- Lenis is mounted by the landing shell for smooth scroll.
- The hero background uses the app-local raw WebGPU renderer with a React Three Fiber WebGL fallback.
- Waitlist submission goes through the server action in `app/(site)/actions.ts`.

## File Organization

```text
app/
  (site)/          Public routes and server actions
components/
  effects/         Scroll/display motion primitives
  layout/          Site shell, header, footer, overlays
  sections/        Public landing sections
  ui/              Small reusable UI primitives
features/
  partner-landing/ Partner acquisition page
lib/
  config/          Site URL configuration
  dev/             Development-only tools
  hooks/           Shared hooks/state
  styles/          Tokens and global CSS
  utils/           Waitlist, fetch, rate limit, math, strings
  webgpu/          Raw WebGPU renderer internals
```

## Runtime Boundaries

- Production runtime should not mount development overlays.
- Mock UI behavior must not replace waitlist/API/referral behavior.
- The `/partners` route keeps its handoff to `partner.gravii.io`.
- Metadata routes must remain server-rendered by Next.js.

## Completion Gates

- `bun run typecheck`
- `bun run lint`
- `bun run build`
- Browser route smoke for `/`, `/partners`, `/robots.txt`, `/sitemap.xml`, and `/manifest.webmanifest`
