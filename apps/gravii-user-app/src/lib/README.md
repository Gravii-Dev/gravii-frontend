# Library Helpers Guide

This folder contains low-level, non-feature helpers.

These files are not route entries, not feature surfaces, and not reusable React UI primitives. They support the rest of the app at a lower abstraction level.

## Current Files

### `gravii-fonts.ts`

Purpose:

- define shared font family string constants

Why it exists:

- visual systems such as the Profile canvas renderer need stable font names
- centralizing the font strings avoids scattering literal font values through rendering code

### `simplex-noise.ts`

Purpose:

- provide deterministic simplex noise helpers used by the grain overlay effect

Exports:

- `buildPermTable`
- `simplex2D`

Why it exists:

- `grain-overlay` needs a lightweight procedural texture source
- this math is lower-level than a UI component
- keeping it in `src/lib` prevents the visual component from becoming too overloaded with implementation detail

## Boundary Rule

If a helper:

- has no React dependency
- expresses low-level math, formatting, or neutral logic
- is not clearly owned by a single feature

then `src/lib` is usually an appropriate home.

If a helper is deeply tied to one feature's domain meaning, it should usually stay inside that feature folder instead.
