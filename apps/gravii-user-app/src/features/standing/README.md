# Ranking Feature Guide

This folder is still named `standing` for code continuity, but the visible product label is now `RANKING`.

## Feature Purpose

The Ranking surface answers two different questions:

- "How are wallets ranked publicly?"
- "Where does my own signed wallet stand?"

The first layer is visible to everyone. The second layer requires sign-in because it depends on a wallet-specific session.

The current implementation intentionally renders no local leaderboard rows, names, ranks, seasons, or reward values. It now calls the public leaderboard and signed wallet summary adapters, then falls back to product-safe loading, unavailable, error, or empty states until live endpoints return data.

## Main Files

### `standing-content.tsx`

Responsibilities:

- call the public leaderboard read adapter for the active category
- call the signed current-wallet ranking summary adapter after sign-in
- render stable loading, unavailable, error, and empty states without mock rows
- gate the future personal wallet rank behind the sign-in action for anonymous users
- route connected users back to `GRAVII ID` for identity review

## Production Direction

When real ranking APIs arrive, this folder should keep the shell-level `leaderboard` panel ID and fill the existing board and wallet-summary states from the backend contract.
