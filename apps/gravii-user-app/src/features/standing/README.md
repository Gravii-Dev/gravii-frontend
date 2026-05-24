# Ranking Feature Guide

This folder is still named `standing` for code continuity, but the visible product label is now `RANKING`.

## Feature Purpose

The Ranking surface answers two different questions:

- "How are wallets ranked publicly?"
- "Where does my own signed wallet stand?"

The first layer is visible to everyone. The second layer requires sign-in because it depends on a wallet-specific session.

## Main Files

### `standing-content.tsx`

Responsibilities:

- render the category-based public ranking board
- expose `Overall`, `Wealth`, `Activity`, `Trade`, and `Streak` board switches
- keep the personal wallet rank area visible as a product promise
- gate the personal wallet rank behind the sign-in action for anonymous users
- route connected users back to `GRAVII ID` for identity review

## Production Direction

When real ranking APIs arrive, this folder should replace the local ranking rows and personal-rank preview with category reads, public ranking snapshots, and current-wallet standing reads without changing the shell-level `leaderboard` panel ID.
