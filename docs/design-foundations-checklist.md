# Design Foundations Checklist

This document is for the phase before a full design system.

## Current Recommendation

- Keep the current operating monorepo.
- Continue engineering work that is independent from visual decisions.
- Do not extract a shared UI package yet.
- Do not extract a shared layout package yet.
- Treat each app layout as app-owned and already decided.

## Safe To Build Now

- `packages/domain-types`
- `packages/api-clients`
- app-level adapters from API responses to frontend domain models
- shared TypeScript and lint config
- shared scripts and workspace commands

These changes are low-risk because they do not depend on final visual decisions.

## Do Not Build Yet

- `packages/ui`
- `packages/layout`
- finalized `brand-tokens`
- a full design system package

These would lock in visual decisions that are still undecided.

## Required Decisions Before Shared UI

### 1. Color Roles

- [ ] Primary
- [ ] Secondary
- [ ] Surface
- [ ] Background
- [ ] Text
- [ ] Muted text
- [ ] Border
- [ ] Success
- [ ] Warning
- [ ] Danger
- [ ] Info
- [ ] Focus ring

Decide semantic roles first, not final hex values in code.

### 2. Typography

- [ ] Brand font family
- [ ] Body font family
- [ ] Heading scale
- [ ] Body scale
- [ ] Caption and helper scale
- [ ] Font weights
- [ ] Line-height rules

### 3. Button System

- [ ] Primary button
- [ ] Secondary button
- [ ] Tertiary or ghost button
- [ ] Destructive button
- [ ] Button sizes
- [ ] Button states: default, hover, pressed, disabled, loading
- [ ] Icon button rules

### 4. Form Controls

- [ ] Input
- [ ] Textarea
- [ ] Select
- [ ] Checkbox
- [ ] Radio
- [ ] Switch
- [ ] Validation states
- [ ] Helper and error text rules

### 5. Surfaces

- [ ] Card style
- [ ] Modal style
- [ ] Panel style
- [ ] Table container style
- [ ] Border radius scale
- [ ] Shadow scale

### 6. Feedback Patterns

- [ ] Empty state
- [ ] Loading state
- [ ] Error state
- [ ] Success confirmation
- [ ] Toast or banner pattern

### 7. Motion

- [ ] Default transition duration
- [ ] Easing rules
- [ ] Hover motion rules
- [ ] Modal enter and exit rules
- [ ] Reduced motion support

### 8. Accessibility Baseline

- [ ] Contrast target
- [ ] Focus visible rule
- [ ] Disabled state rule
- [ ] Keyboard navigation expectations
- [ ] Form error announcement pattern

## Shared vs App-Owned Rule

Only make something shared when all of the following are true:

- at least two apps need it
- the visual shape is meaningfully the same
- the behavior is meaningfully the same
- a single change should intentionally affect every consumer

Keep it app-owned when any of the following are true:

- it belongs to a specific flow
- it is a landing-only section
- it is part of an app shell or page skeleton
- it is likely to diverge per persona

## What To Produce Before `packages/ui`

Create a lightweight decision artifact first:

- a one-page color role sheet
- a typography sheet
- button variants and states
- core input states
- 5 to 10 screenshots of repeated UI candidates across apps

After that, compare repeated components and only then decide what belongs in shared UI.

## Recommended Sequence

1. Continue monorepo and API/domain work now.
2. Finalize design foundations outside of code.
3. Create `packages/brand-tokens` only after visual decisions are approved.
4. Create `packages/ui` only after repeated primitives are confirmed.
5. Keep layouts inside each app unless multiple apps truly share the same shell behavior.
