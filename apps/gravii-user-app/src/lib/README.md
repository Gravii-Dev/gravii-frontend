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
- all exported font aliases currently resolve to Roboto Flex so canvas rendering stays aligned with the app-wide type system

### `wallet/`

Purpose:

- configure Reown AppKit and Wagmi for WalletConnect-based EVM wallet selection
- centralize the WalletConnect project ID lookup and supported networks
- keep auth-facing wallet setup separate from feature UI

Why it exists:

- sign-in needs WalletConnect modal support while the User API still owns challenge generation, signature verification, and JWT issuance
- future wallet-aware surfaces should reuse the same provider configuration instead of creating their own wallet clients

## Boundary Rule

If a helper:

- has no React dependency
- expresses low-level math, formatting, or neutral logic
- is not clearly owned by a single feature

then `src/lib` is usually an appropriate home.

If a helper is deeply tied to one feature's domain meaning, it should usually stay inside that feature folder instead.
