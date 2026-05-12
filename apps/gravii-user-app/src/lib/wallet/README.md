# Wallet Helpers Guide

This folder owns wallet-provider configuration that is shared by auth and any future wallet-aware surfaces.

Runtime note:

- the `/sign-in` route layout owns the Reown AppKit provider so the launch shell does not load WalletConnect UI assets before the user chooses to sign in

## Current Files

### `appkit-config.ts`

Purpose:

- configure Reown AppKit with Wagmi
- expose the supported EVM networks for WalletConnect and injected wallets
- keep the WalletConnect project ID lookup in one place

Environment:

- `NEXT_PUBLIC_REOWN_PROJECT_ID` is preferred
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is supported as a compatibility alias

If neither value is present, the app still builds and renders, but the sign-in page warns that WalletConnect modal support needs a real Reown project ID before production use.

### `accounts` dependency

Wagmi 3 references the Tempo `accounts` package through an optional dynamic import. The app does not expose Tempo as a primary sign-in route, but the package is installed so Next/Turbopack can resolve Wagmi's connector graph during production builds.
