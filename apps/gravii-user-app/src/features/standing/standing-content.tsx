"use client";

import { useState } from "react";

import type { LeaderboardCategoryKey, SharedContentProps } from "@/features/launch-app/types";
import { getStandingPercentile, getStandingSnapshot } from "@/features/standing/standing-view-model";

import styles from "./standing-content.module.css";

function tierClass(tier: "Black" | "Platinum" | "Gold" | "Classic") {
  if (tier === "Black") return styles.tierBlack;
  if (tier === "Platinum") return styles.tierPlatinum;
  if (tier === "Gold") return styles.tierGold;
  return styles.tierClassic;
}

function changeClass(up: boolean | null) {
  if (up === true) return styles.changeUp;
  if (up === false) return styles.changeDown;
  return styles.changeNeutral;
}

export default function StandingContent({ dark, connected, onConnect }: SharedContentProps) {
  const [activeCategory, setActiveCategory] = useState<LeaderboardCategoryKey>(0);
  const snapshot = getStandingSnapshot(activeCategory);
  const percentile = getStandingPercentile(snapshot.myRank, snapshot.totalUsers);

  return (
    <div className={`${styles.root} ${dark ? styles.rootDark : styles.rootLight}`}>
      <p className={styles.lead}>See where you stand.</p>
      <p className={styles.copy}>Rankings updated daily based on on-chain behavior.</p>

      <div className={styles.heroCard}>
        {connected ? (
          <div className={styles.heroStats}>
            <div>
              <span className={styles.heroLabel}>YOU</span>
              <span className={styles.heroValue}>Messi</span>
            </div>
            <div>
              <span className={styles.heroLabel}>YOUR RANK</span>
              <span className={`${styles.heroValue} ${styles.heroValueAccent}`}>#{snapshot.myRank}</span>
            </div>
            <div>
              <span className={styles.heroLabel}>PERCENTILE</span>
              <span className={`${styles.heroValue} ${styles.heroValuePositive}`}>Top {percentile}%</span>
            </div>
            <div>
              <span className={styles.heroLabel}>WEEKLY</span>
              <span className={`${styles.heroValue} ${styles.heroValuePositive}`}>+342</span>
            </div>
            <div>
              <span className={styles.heroLabel}>TOP CATEGORY</span>
              <span className={styles.heroValue}>{snapshot.categories[1] ?? snapshot.categories[0]}</span>
              <span className={styles.heroSub}>your strongest</span>
            </div>
          </div>
        ) : (
          <div className={styles.lockedHero}>
            <p className={styles.lockedTitle}>GET YOUR GRAVII ID</p>
            <p className={styles.lockedCopy}>See where you stand among peers.</p>
            <button type="button" className={styles.connectButton} onClick={onConnect}>
              Connect Wallet
            </button>
          </div>
        )}
      </div>

      <div className={styles.categoryRow}>
        {snapshot.categories.map((category, index) => (
          <button
            key={category}
            type="button"
            className={`${styles.categoryChip} ${index === activeCategory ? styles.categoryChipActive : ""}`}
            onClick={() => setActiveCategory(index as LeaderboardCategoryKey)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className={styles.tableWrap}>
        <div className={styles.tableHeader}>
          {["#", "TIER", "NAME", "ID", "CHANGE"].map((header) => (
            <span key={header}>{header}</span>
          ))}
        </div>

        {connected ? (
          <>
            <div className={styles.myRow}>
              <span className={`${styles.rankCell} ${styles.heroValueAccent}`}>{snapshot.myRank}</span>
              <span className={tierClass("Gold")}>Gold</span>
              <span className={styles.nameCell}>Messi (You)</span>
              <span className={styles.subCell}>xxx...2fxx</span>
              <span className={`${styles.rankCell} ${styles.heroValuePositive}`}>+342</span>
            </div>
            <div className={styles.separator}>· · ·</div>
          </>
        ) : null}

        <div className={styles.rows}>
          {snapshot.rows.map((row) => (
            <div key={`${row.rank}-${row.name}`} className={styles.row}>
              <span className={styles.rankCell}>{row.rank}</span>
              <span className={tierClass(row.tier)}>{row.tier}</span>
              <span className={styles.nameCell}>{row.name}</span>
              <span className={styles.subCell}>{row.id}</span>
              <span className={`${styles.rankCell} ${changeClass(row.up)}`}>{row.change === "0" ? "—" : row.change}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
