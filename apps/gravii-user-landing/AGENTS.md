# Gravii User Landing Rules

This app is the public Gravii landing and partner acquisition surface.

## Guidance Layers

When rules conflict, use the narrowest applicable source:

1. this file and this app's local docs
2. the monorepo root `AGENTS.md`
3. `gravii-frontend`
4. `frontend-standards`

Local docs that matter for this app:

- `README.md`: current app scope, routes, scripts, environment, and deployment notes
- `STYLEGUIDE.md`: CSS Modules, tokens, responsive, and Tailwind migration policy
- `.cursor/rules/*.mdc`: inactive legacy Cursor-oriented reference material

The user works in Codex Desktop, not Cursor. Do not use `.cursor/rules/*.mdc` as active instructions unless the user explicitly asks to inspect or migrate Cursor rules. Do not reintroduce old starter naming, JavaScript/JSX examples, or patterns that conflict with the current Gravii app docs.

## Stack

- Package manager: Bun
- Framework: Next.js App Router
- Language: TypeScript and TSX only
- Styling: CSS Modules as the primary system
- Formatting and linting: Biome
- Motion: GSAP, Lenis, Tempus, and Hamo where already used
- Rendering: raw WebGPU for the hero background; keep WebGL utilities only where the codebase already uses them

## Implementation Rules

- Use `bun` scripts from `package.json`; do not introduce npm, pnpm, or yarn workflow files.
- Write all React and Next.js files in `.ts` or `.tsx`; do not add `.js` or `.jsx`.
- Use CSS Modules for new app and component styles.
- Do not add new Tailwind utility classes in app or component code. Existing Tailwind can remain in untouched legacy files until a focused migration.
- Use the app's local image, link, style, and WebGPU helpers instead of bypassing established wrappers.
- Keep route code thin. Put reusable product sections under `components/sections`, layout under `components/layout`, primitives under `components/ui`, and non-UI logic under `lib`.
- For `/partners`, preserve the current handoff behavior to `partner.gravii.io` unless the task explicitly changes partner acquisition flow.
- Respect reduced-motion behavior for non-essential animation.

## Documentation

Update the nearest committed English docs when behavior, routes, environment variables, structure, or ownership changes. Private Korean notes should stay under `.local-docs/` if they are needed.

## Verification

- From the workspace root, use `bun run check:user-landing` as the default completion gate for app-local code changes.
- Use `bun run build:user-landing` when routing, build config, rendering, WebGPU setup, metadata, or deployment behavior changes.
- Inspect `http://localhost:3000` in a browser for visible layout, motion, or responsive changes.
