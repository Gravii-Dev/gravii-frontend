# Frontend Implementation Standards

## Purpose

This repository started as a single-file HTML prototype. It is being migrated into a product-ready baseline using Next.js App Router and TypeScript while preserving exact prototype fidelity during the transition.

## Source of Truth

- App entry: `src/app/page.tsx`
- Migration shell entry: `src/features/hq/shell/prototype-shell.tsx`
- Runtime bridge and HTML segmentation: `src/features/hq/shell/prototype-runtime.tsx`
- Prototype source extraction: `src/features/hq/shell/prototype-template.ts`
- Shared shell components: `src/features/hq/components/*`
- Migrated page components: `src/features/hq/pages/*`
- Typed mock data and navigation metadata: `src/features/hq/data.ts`
- Derived selectors and filtering logic: `src/features/hq/selectors.ts`
- Shared feature styling: `src/features/hq/dashboard.module.css`

## Working Rules

- Add new React work only in `.ts` and `.tsx`.
- Prefer `src/features/hq/components/<name>/index.tsx` for shell or shared UI.
- Prefer `src/features/hq/pages/<page>/index.tsx` for page-level prototype ports.
- Keep shell/runtime-only helpers in `src/features/hq/shell` or `src/features/hq/lib`.
- Keep dashboard numbers, table rows, and navigation definitions in `src/features/hq/data.ts`.
- Keep derived calculations, filtering, and sorting in `src/features/hq/selectors.ts`.
- Keep route/page shells thin. Business logic should stay in the feature layer.
- During the parity migration, preserving original inline style values is acceptable when they come directly from the prototype.
- Once a page is fully migrated and behavior is stable, move repeated styling into feature-local CSS Modules.

## Migration Note

- `gravii-hq_v2.html` remains as the original prototype reference.
- Do not add new product behavior to the legacy HTML file.
- Do not add new application behavior to the raw prototype bridge unless it is required to preserve parity.
- New work should continue reducing `dangerouslySetInnerHTML` coverage by replacing one page or shell segment at a time with React components.
- If the mock data is replaced with a real backend, keep the UI structure and swap the feature data layer first.
