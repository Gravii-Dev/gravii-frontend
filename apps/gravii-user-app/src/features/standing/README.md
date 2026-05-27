# Ranking Feature Guide

This folder is still named `standing` for code continuity, but the visible product label is now `RANKING`.

## Feature Purpose

The Ranking surface answers two different questions:

- "How are wallets ranked publicly?"
- "Where does my own signed wallet stand?"

The first layer is visible to everyone. The second layer requires sign-in because it depends on a wallet-specific session.

The current implementation intentionally renders no local leaderboard rows, names, ranks, seasons, or reward values. Ranking data should appear only after live leaderboard endpoints are connected.

## Main Files

### `standing-content.tsx`

Responsibilities:

- render the live-data placeholder for Ranking
- describe the required public board, current-wallet rank, season, and reward endpoints
- gate the future personal wallet rank behind the sign-in action for anonymous users
- route connected users back to `GRAVII ID` for identity review

## Production Direction

When real ranking APIs arrive, this folder should add category reads, public ranking snapshots, and current-wallet standing reads without changing the shell-level `leaderboard` panel ID.
