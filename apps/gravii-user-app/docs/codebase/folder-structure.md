# Codebase Folder Structure Guide

This document explains why the repository is structured the way it is and how to decide where future code should live.

## Top-Level Principle

The repository is organized primarily by product feature, not only by technical artifact type.

That means the code prefers:

- `profile`, `discovery`, and `x-ray` folders for feature ownership

over a structure that immediately spreads code into:

- `constants`
- `hooks`
- `store`
- `types`
- `effects`

This choice is intentional.

## Why a Feature-First Structure Fits This App

Launch App is not a generic component library. It is a product UI made of five distinct user-facing surfaces.

Each surface has:

- its own UI
- its own interaction state
- its own data shape
- its own small cluster of supporting components

When that is true, feature-first folders usually make the code easier to understand.

Benefits:

- related files stay close together
- a developer can understand one user surface without jumping across many top-level folders
- feature-level refactors stay more contained
- it is easier to see which files belong to Profile versus Discovery

## Current Folder Map

### `src/app`

Use for:

- route entry files
- global layout files
- route-level CSS
- future route handlers only if the route itself owns them

Current role:

- `layout.tsx` sets the outer HTML structure
- `page.tsx` is the single route entry and shell orchestration point
- `globals.css` contains app-wide styling tokens and shared global rules

### `src/features`

Use for:

- product surface logic
- feature-specific state
- feature-specific view-model helpers
- feature-specific child components
- feature-specific mock data until real APIs arrive

Current subfolders:

- `launch-app`
- `profile`
- `my-space`
- `discovery`
- `x-ray`
- `standing`

### `src/components/layout`

Use for:

- shared structural wrappers
- panel frame components
- components that define how the product shell looks and opens

These are not generic business features. They are layout infrastructure.

### `src/components/ui`

Use for:

- reusable presentation primitives
- small widgets shared across more than one feature
- reusable visual systems that do not belong to only one feature

### `src/lib`

Use for:

- low-level utility functions
- non-React helpers
- drawing or math helpers
- neutral helpers that are not feature-owned

## Why `src/features/launch-app` Exists

`src/features/launch-app` can look strange at first because the folder name sounds like it should contain the whole app.

In practice, it is the shared feature-core for the current prototype.

It exists because some code is:

- too app-specific to live in `src/lib`
- too business-aware to live in `src/components`
- shared across multiple surfaces, so it should not live inside `profile` or `discovery`

Examples:

- panel metadata
- shell state
- mock repository access
- shared Launch App types

If the app grows, this folder might later be renamed to something like `launch-shell` or `app-core`. For now, it is functioning as the app-level feature layer.

## Difference From a Layer-First Alternative

An alternative structure would look more like this:

```text
components/
constants/
hooks/
store/
types/
utils/
```

That style organizes files by technical category.

It can work well when:

- the app is small
- there are only a few product surfaces
- the project is mostly a UI toolkit
- state and data concerns are simple and centralized

But in this app, it would introduce tradeoffs:

- Profile-related code would be split across `components`, `constants`, `types`, and `hooks`
- Discovery-related files would be physically separated from each other
- it becomes harder to answer "what files belong to this surface?"
- top-level folders can become dumping grounds over time

## What Belongs Where

### Keep code inside a feature folder when:

- only one surface uses it
- it uses feature-specific data shapes
- it expresses feature-specific behavior
- moving it out would make the project harder to scan

Examples:

- `use-my-space-state.ts`
- `profile-view-model.ts`
- `discovery-partner-detail`
- `x-ray-result-view`

### Move code into `src/components/ui` when:

- more than one feature uses it
- it is mostly presentational
- it is not tightly bound to a single feature's data model

Examples in the current repo:

- `ActionButton`
- `SharedTagChip`
- `MiniBar`

### Move code into `src/components/layout` when:

- it defines framing, shell layout, or navigation structure
- it is used to place other features inside a shared screen system

Examples:

- `LaunchPanel`
- `MySpaceDock`
- `PanelShell`

### Move code into `src/lib` when:

- it is not really a UI component
- it is low-level logic or math
- it can be used without React

Examples:

- simplex noise generation
- font constant definitions

## Do We Ever Need `hooks`, `constants`, `store`, `types`, or `effects` Folders?

Yes, but only when the codebase earns them.

### `hooks`

Add a shared `src/hooks` folder when:

- multiple features use the same hook
- the hook is not feature-owned
- it would otherwise be duplicated

Do not add it just because one feature has one hook.

### `constants`

Add a shared `constants` folder when:

- values are truly app-wide
- they are not better understood inside a feature

Be careful. Global constants folders become junk drawers very easily.

### `store`

Add a shared store folder when:

- state must be shared across many distant parts of the UI
- lifting state into the route shell becomes awkward
- the state has product-wide meaning, such as session, wallet, theme, or notifications

Right now, the shell state is simple enough to keep in a local hook.

### `types`

Add a shared types folder when:

- the same type is reused across many features
- the type is part of an API contract or product-wide domain model

Do not move every interface into a global folder too early. Feature-local types are often easier to reason about.

### `effects`

Add a shared effects folder when:

- the effect is clearly reusable across multiple surfaces
- it is more of a visual subsystem than a feature-owned component

In the current codebase:

- `grain-overlay` already behaves like a shared effect
- `infinite-canvas` is still better understood as Profile-specific

## Production Growth Strategy

As the app becomes real, the best strategy is usually:

1. Keep code local to the feature by default.
2. Extract shared code only after real reuse appears.
3. Avoid creating empty architecture categories "for the future".

This keeps the code grounded in actual product behavior instead of speculative structure.

## Documentation Maintenance Rules

This repository expects folder and responsibility documentation to stay current with the code.

When making changes:

1. Update the nearest README or codebase doc that explains the area you changed.
2. Remove or rewrite stale documentation when code is moved or deleted.
3. Treat documentation updates as part of the same change, not as follow-up cleanup.

Practical mapping:

- if you change feature responsibilities, local state, child components, or flow, update that feature's `README.md`
- if you change shared panel framing or shared UI ownership, update `src/components/layout/README.md` or `src/components/ui/README.md`
- if you change file placement conventions or extraction rules, update this document
- if you change shell flow or top-level runtime responsibilities, update `docs/codebase/architecture-overview.md`

Committed docs in this repo should stay in English. Private Korean mirrors belong under `.local-docs/` so they remain outside Git.

## Recommended Placement Rules for Future Work

When adding new code, ask these questions in order:

1. Is this only for one feature?
   - Put it in that feature folder.
2. Is it a shared layout wrapper?
   - Put it in `src/components/layout`.
3. Is it a shared presentational primitive?
   - Put it in `src/components/ui`.
4. Is it low-level, non-visual logic?
   - Put it in `src/lib`.
5. Is it shared app-wide state?
   - Consider a shared store or provider, but only if the shell can no longer hold it cleanly.

## Bottom Line

The current structure is better understood as:

- route-first at the `app` layer
- feature-first at the product layer
- shared layout and UI primitives where reuse is real

That is a strong fit for the current prototype and a reasonable base for production growth.
