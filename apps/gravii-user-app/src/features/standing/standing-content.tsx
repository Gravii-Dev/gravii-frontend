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
  activity: [
    { chain: "Ethereum", change: "+3", name: "Benji", persona: "Diamond Hands", rank: "1", tier: "Black", up: true },
    { chain: "BSC", change: "+1", name: "CZ", persona: "Active Trader", rank: "2", tier: "Platinum", up: true },
    { chain: "Ethereum", change: "-2", name: "Diddy", persona: "Power User", rank: "3", tier: "Black", up: false },
    { chain: "Arbitrum", change: "+4", name: "Cobie", persona: "Swing Trader", rank: "4", tier: "Gold", up: true },
    { chain: "Ethereum", change: "-1", name: "Vitalik", persona: "Smart Saver", rank: "5", tier: "Platinum", up: false },
    { chain: "Base", change: "+2", name: "DCFgod", persona: "Profit Hunter", rank: "6", tier: "Gold", up: true },
    { chain: "Ethereum", change: "0", name: "Hsaka", persona: "Active Trader", rank: "7", tier: "Gold", up: null },
    { chain: "Ethereum", change: "-1", name: "Satoshi", persona: "Strategic Holder", rank: "8", tier: "Platinum", up: false },
    { chain: "Ethereum", change: "+1", name: "Punk6529", persona: "NFT Collector", rank: "9", tier: "Gold", up: true },
    { chain: "Solana", change: "-3", name: "Ansem", persona: "Rising Star", rank: "10", tier: "Classic", up: false },
  ],
  overall: [
    { chain: "Ethereum", change: "+1", name: "Benji", persona: "Diamond Hands", rank: "1", tier: "Black", up: true },
    { chain: "Ethereum", change: "-1", name: "Diddy", persona: "Power User", rank: "2", tier: "Black", up: false },
    { chain: "Ethereum", change: "+3", name: "Satoshi", persona: "Strategic Holder", rank: "3", tier: "Platinum", up: true },
    { chain: "Ethereum", change: "+2", name: "Vitalik", persona: "Smart Saver", rank: "4", tier: "Platinum", up: true },
    { chain: "BSC", change: "-2", name: "CZ", persona: "Active Trader", rank: "5", tier: "Platinum", up: false },
    { chain: "Ethereum", change: "+5", name: "Punk6529", persona: "NFT Collector", rank: "6", tier: "Gold", up: true },
    { chain: "Arbitrum", change: "0", name: "Cobie", persona: "Swing Trader", rank: "7", tier: "Gold", up: null },
    { chain: "Ethereum", change: "+1", name: "Hsaka", persona: "Active Trader", rank: "8", tier: "Gold", up: true },
    { chain: "Base", change: "-3", name: "DCFgod", persona: "Profit Hunter", rank: "9", tier: "Gold", up: false },
    { chain: "Solana", change: "+4", name: "Ansem", persona: "Rising Star", rank: "10", tier: "Classic", up: true },
  ],
  streak: [
    { chain: "Ethereum", change: "+1", name: "Diddy", persona: "Power User", rank: "1", tier: "Black", up: true },
    { chain: "Ethereum", change: "+2", name: "Benji", persona: "Diamond Hands", rank: "2", tier: "Black", up: true },
    { chain: "BSC", change: "-1", name: "CZ", persona: "Active Trader", rank: "3", tier: "Platinum", up: false },
    { chain: "Arbitrum", change: "+3", name: "Cobie", persona: "Swing Trader", rank: "4", tier: "Gold", up: true },
    { chain: "Ethereum", change: "+1", name: "Hsaka", persona: "Active Trader", rank: "5", tier: "Gold", up: true },
    { chain: "Ethereum", change: "-2", name: "Satoshi", persona: "Strategic Holder", rank: "6", tier: "Platinum", up: false },
    { chain: "Ethereum", change: "0", name: "Vitalik", persona: "Smart Saver", rank: "7", tier: "Platinum", up: null },
    { chain: "Ethereum", change: "+1", name: "Punk6529", persona: "NFT Collector", rank: "8", tier: "Gold", up: true },
    { chain: "Base", change: "-1", name: "DCFgod", persona: "Profit Hunter", rank: "9", tier: "Gold", up: false },
    { chain: "Solana", change: "+5", name: "GCR", persona: "Chain Hopper", rank: "10", tier: "Classic", up: true },
  ],
  trade: [
    { chain: "Ethereum", change: "+2", name: "Vitalik", persona: "Smart Saver", rank: "1", tier: "Platinum", up: true },
    { chain: "Ethereum", change: "0", name: "Benji", persona: "Diamond Hands", rank: "2", tier: "Black", up: null },
    { chain: "Ethereum", change: "+4", name: "Punk6529", persona: "NFT Collector", rank: "3", tier: "Gold", up: true },
    { chain: "Ethereum", change: "-1", name: "Diddy", persona: "Power User", rank: "4", tier: "Black", up: false },
    { chain: "BSC", change: "+1", name: "CZ", persona: "Active Trader", rank: "5", tier: "Platinum", up: true },
    { chain: "Ethereum", change: "+3", name: "Satoshi", persona: "Strategic Holder", rank: "6", tier: "Platinum", up: true },
    { chain: "Arbitrum", change: "-2", name: "Cobie", persona: "Swing Trader", rank: "7", tier: "Gold", up: false },
    { chain: "Ethereum", change: "+1", name: "Hsaka", persona: "Active Trader", rank: "8", tier: "Gold", up: true },
    { chain: "Base", change: "0", name: "DCFgod", persona: "Profit Hunter", rank: "9", tier: "Gold", up: null },
    { chain: "Solana", change: "+2", name: "Ansem", persona: "Rising Star", rank: "10", tier: "Classic", up: true },
  ],
  wealth: [
    { chain: "Ethereum", change: "+2", name: "Diddy", persona: "Wealth Guard", rank: "1", tier: "Black", up: true },
    { chain: "Ethereum", change: "-1", name: "Benji", persona: "Diamond Hands", rank: "2", tier: "Black", up: false },
    { chain: "Ethereum", change: "0", name: "Vitalik", persona: "Smart Saver", rank: "3", tier: "Platinum", up: null },
    { chain: "BSC", change: "+1", name: "CZ", persona: "Major Investor", rank: "4", tier: "Platinum", up: true },
    { chain: "Ethereum", change: "+3", name: "Hsaka", persona: "Active Trader", rank: "5", tier: "Gold", up: true },
    { chain: "Ethereum", change: "-2", name: "Punk6529", persona: "NFT Collector", rank: "6", tier: "Gold", up: false },
    { chain: "Arbitrum", change: "+1", name: "Cobie", persona: "Swing Trader", rank: "7", tier: "Gold", up: true },
    { chain: "Ethereum", change: "-4", name: "Satoshi", persona: "Strategic Holder", rank: "8", tier: "Platinum", up: false },
    { chain: "Solana", change: "+2", name: "Ansem", persona: "Rising Star", rank: "9", tier: "Classic", up: true },
    { chain: "Ethereum", change: "+1", name: "GCR", persona: "Profit Hunter", rank: "10", tier: "Classic", up: true },
  ],
};

const MY_RANKS: Record<RankingCategory["id"], string> = {
  activity: "63,104",
  overall: "56,247",
  streak: "27,553",
  trade: "12,340",
  wealth: "41,892",
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
              <strong>Messi</strong>
            </div>
            <div>
              <span className={styles.eyebrow}>Your rank</span>
              <strong>#{MY_RANKS[activeCategoryId]}</strong>
              <span>of 279,941 users</span>
            </div>
            <div>
              <span className={styles.eyebrow}>Weekly</span>
              <strong className={styles.moveUp}>+342</strong>
              <span>positions gained</span>
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
              <strong>{MY_RANKS[activeCategoryId]}</strong>
              <span className={tierClassName("Gold")}>Gold</span>
              <span>Messi (You)</span>
              <span>Diamond Hands</span>
              <span>Ethereum</span>
              <span className={styles.moveUp}>+342</span>
            </article>
            <div className={styles.rankGap}>· · ·</div>
          </>
        ) : null}

        <div className={styles.rows}>
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
