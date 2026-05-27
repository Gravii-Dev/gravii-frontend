"use client";

import { useMemo, useState } from "react";

import ActionButton from "@/components/ui/action-button";
import type { SharedContentProps } from "@/features/launch-app/types";

import styles from "./standing-content.module.css";

type RankingCategory = {
  id: "overall" | "wealth" | "activity" | "trade" | "streak";
  label: string;
  description: string;
};

type RankingRow = {
  chain: string;
  change: string;
  name: string;
  persona: string;
  rank: string;
  tier: "Black" | "Platinum" | "Gold" | "Classic";
  up: boolean | null;
};

const CATEGORIES: RankingCategory[] = [
  {
    description: "Composite score across activity, trading, holdings, and consistency.",
    id: "overall",
    label: "Overall",
  },
  {
    description: "Capital depth, stable reserves, and portfolio quality.",
    id: "wealth",
    label: "Wealth",
  },
  {
    description: "Recent transaction density and cross-chain participation.",
    id: "activity",
    label: "Activity",
  },
  {
    description: "Trading volume, timing, and execution behavior.",
    id: "trade",
    label: "Trade",
  },
  {
    description: "Consistency of verified on-chain participation.",
    id: "streak",
    label: "Streak",
  },
];

const RANKING_ROWS: Record<RankingCategory["id"], RankingRow[]> = {
  activity: [],
  overall: [],
  streak: [],
  trade: [],
  wealth: [],
};

function tierClassName(tier: RankingRow["tier"]) {
  if (tier === "Black") {
    return styles.tierBlack;
  }

  if (tier === "Platinum") {
    return styles.tierPlatinum;
  }

  if (tier === "Gold") {
    return styles.tierGold;
  }

  return styles.tierClassic;
}

function movementClassName(row: RankingRow) {
  if (row.up === true) {
    return styles.moveUp;
  }

  if (row.up === false) {
    return styles.moveDown;
  }

  return styles.moveFlat;
}

export default function StandingContent({
  connected,
  dark,
  onConnect,
  onNavigate,
}: SharedContentProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<RankingCategory["id"]>("overall");
  const activeCategory = useMemo(
    () => CATEGORIES.find((category) => category.id === activeCategoryId) ?? CATEGORIES[0],
    [activeCategoryId]
  );
  const rows = RANKING_ROWS[activeCategoryId];

  return (
    <div className={`${styles.root} ${dark ? styles.rootDark : styles.rootLight}`}>
      <section className={styles.hero} aria-label="Ranking overview">
        <div>
          <span className={styles.eyebrow}>Public ranking</span>
          <h2>See where every wallet stands.</h2>
        </div>
        <p>
          Rankings update daily from on-chain behavior. Public boards stay visible;
          your personal wallet rank requires a signed Gravii session.
        </p>
      </section>

      <section className={styles.youPanel} aria-label="Personal wallet ranking">
        {connected ? (
          <div className={styles.youGrid}>
            <div>
              <span className={styles.eyebrow}>You</span>
              <strong>Connected wallet</strong>
            </div>
            <div>
              <span className={styles.eyebrow}>Your rank</span>
              <strong>Pending API</strong>
              <span>Wallet-specific rank is not loaded yet.</span>
            </div>
            <div>
              <span className={styles.eyebrow}>Weekly</span>
              <strong>—</strong>
              <span>No movement data yet.</span>
            </div>
            <div>
              <span className={styles.eyebrow}>Strongest</span>
              <strong>{activeCategory.label}</strong>
              <span>{activeCategory.description}</span>
            </div>
          </div>
        ) : (
          <div className={styles.lockedYou}>
            <div>
              <span className={styles.eyebrow}>My wallet rank</span>
              <strong>Rank hidden</strong>
              <p>
                Browse the public board now. Sign in to calculate your own wallet
                rank, tier, and movement against this category.
              </p>
            </div>
            <ActionButton size="panel" className={styles.signInButton} onClick={onConnect}>
              SIGN IN
            </ActionButton>
          </div>
        )}
      </section>

      <section className={styles.categoryBar} aria-label="Ranking categories">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            type="button"
            className={category.id === activeCategoryId ? styles.categoryActive : styles.categoryButton}
            onClick={() => setActiveCategoryId(category.id)}
          >
            {category.label}
          </button>
        ))}
      </section>

      <section className={styles.board} aria-label={`${activeCategory.label} ranking board`}>
        <div className={styles.boardIntro}>
          <div>
            <span className={styles.eyebrow}>{activeCategory.label} board</span>
            <p>{activeCategory.description}</p>
          </div>
          <span className={styles.updatePill}>UPDATED DAILY</span>
        </div>

        <div className={styles.boardHeader}>
          <span>#</span>
          <span>Tier</span>
          <span>Name</span>
          <span>Persona</span>
          <span>Chain</span>
          <span>Change</span>
        </div>

        {connected ? (
          <>
            <article className={`${styles.row} ${styles.youRow}`}>
              <strong>—</strong>
              <span>—</span>
              <span>Your wallet</span>
              <span>Pending API</span>
              <span>—</span>
              <span>—</span>
            </article>
            <div className={styles.rankGap}>· · ·</div>
          </>
        ) : null}

        <div className={styles.rows}>
          {rows.length === 0 ? (
            <div className={styles.emptyRows}>
              <strong>Public leaderboard data is not connected yet.</strong>
              <span>Rows will render here from the live Ranking API.</span>
            </div>
          ) : null}

          {rows.map((row) => (
            <article className={styles.row} key={`${activeCategoryId}-${row.rank}-${row.name}`}>
              <strong>{row.rank}</strong>
              <span className={tierClassName(row.tier)}>{row.tier}</span>
              <span>{row.name}</span>
              <span>{row.persona}</span>
              <span>{row.chain}</span>
              <span className={movementClassName(row)}>{row.change === "0" ? "—" : row.change}</span>
            </article>
          ))}
        </div>
      </section>

      {connected ? (
        <ActionButton
          size="panel"
          className={styles.profileButton}
          onClick={() => onNavigate?.("profile")}
        >
          REVIEW GRAVII ID
        </ActionButton>
      ) : null}
    </div>
  );
}
