# Infinite Canvas Guide

This folder contains the Profile feature's custom canvas-based persona background system.

## Purpose

The infinite canvas exists to make the `GRAVII ID` surface feel like more than a static dashboard.

It visually communicates that:

- Gravii has a broader persona universe
- the current user occupies one point within that universe
- the active persona is a highlighted identity, not just a text label

## Files

### `index.tsx`

Responsibilities:

- own the React lifecycle around the canvas
- hold references to the container and canvas elements
- track scroll position and velocity
- subscribe to wheel and resize behavior
- trigger drawing via `renderInfiniteCanvasScene`

What it does not do:

- directly implement all drawing math

### `infinite-canvas-renderer.ts`

Responsibilities:

- own low-level canvas drawing
- render the repeating persona card grid
- apply gradients, typography, glow, and active state treatment
- perform wrapping and bar-like visual composition logic

Why it is separate:

- it keeps the React component from becoming too overloaded with drawing details
- it makes the rendering algorithm easier to reason about in isolation

## Runtime Behavior

At a high level, the system works like this:

1. The React component measures the container.
2. The canvas renderer draws a repeated grid of persona tiles.
3. Wheel events modify velocity.
4. Animation frames gradually decay velocity and update scroll position.
5. The active persona tile is emphasized when the user is connected.

This produces a slow, continuous-feeling spatial background without needing large image assets.

## Why Canvas Was Chosen

Canvas is useful here because:

- the content is visually repetitive and procedural
- drawing many layered tiles would be more cumbersome in regular DOM
- the effect benefits from low-level control over glow, text, and animation

## Why This Is Feature-Owned, Not Shared

Even though it is visually sophisticated, it belongs to Profile because:

- it depends on `PERSONA_ITEMS`
- it is specifically about identity and persona framing
- no other feature currently uses the same visual language

If another feature later reused the same exact system, that would be the moment to reconsider extraction.

## Testing Note

The project test setup mocks canvas-related APIs so the component tree can render in `jsdom`.

The tests do not fully verify the visual output of the canvas renderer. That is normal for this stage of the prototype. The current tests are focused more on interaction than on pixel correctness.
