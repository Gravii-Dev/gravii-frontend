# Wallet Helpers Guide

This folder owns wallet-provider configuration that is shared by auth and any future wallet-aware surfaces.

Runtime note:

- explicit Launch App sign-in actions mount the Reown AppKit provider and open the WalletConnect/Reown wallet modal directly so the user can connect without leaving the current surface
- the `/sign-in` route layout still owns the same provider for direct-link and external handoff fallbacks

## Current Files

### `appkit-config.ts`

Purpose:

- configure Reown AppKit with Wagmi
- expose the supported EVM networks for WalletConnect and injected wallets
- keep the WalletConnect project ID lookup in one place

Environment:

- `NEXT_PUBLIC_REOWN_PROJECT_ID` is preferred
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is supported as a compatibility alias

If neither value is present, the app still builds and renders, but wallet sign-in falls back to an injected browser wallet and still needs a real Reown project ID before production WalletConnect support is complete.

### `accounts` dependency

Wagmi 3 references the Tempo `accounts` package through an optional dynamic import. The app does not expose Tempo as a primary sign-in route, but the package is installed so Next/Turbopack can resolve Wagmi's connector graph during production builds.

### Wagmi optional entry shims

Purpose:

- `wagmi-tempo-shim.ts` keeps the unused `@wagmi/core/tempo` entry out of the app bundle because the current Wagmi and Viem Tempo wallet export shapes do not line up.
- `wagmi-connectors-shim.ts` disables optional Safe/Base Account connector discovery from Reown's helper path so the app does not bundle unused optional wallet SDKs.

These shims are wired in `next.config.ts` for both Webpack dev builds and Turbopack production builds. Remove them only when Gravii intentionally supports Tempo, Safe app, or Base Account connector flows and the matching wallet SDK packages are installed.
