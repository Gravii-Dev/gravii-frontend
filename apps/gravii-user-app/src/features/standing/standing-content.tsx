"use client";

import ActionButton from "@/components/ui/action-button";
import type { SharedContentProps } from "@/features/launch-app/types";

import styles from "./standing-content.module.css";

const publicRankingRows = [
  {
    rank: "#001",
    wallet: "0x8C...4A91",
    persona: "Strategic Holder",
    score: "982",
    movement: "+4",
  },
  {
    rank: "#002",
    wallet: "0x19...B70E",
    persona: "Chain Native",
    score: "941",
    movement: "+1",
  },
  {
    rank: "#003",
    wallet: "0xAF...32D8",
    persona: "Liquidity Scout",
    score: "918",
    movement: "-",
  },
  {
    rank: "#004",
    wallet: "0x44...C019",
    persona: "Signal Curator",
    score: "887",
    movement: "+8",
  },
];

export default function StandingContent({
  connected,
  dark,
  onConnect,
  onNavigate,
}: SharedContentProps) {
  return (
    <div className={`${styles.root} ${dark ? styles.rootDark : styles.rootLight}`}>
      <section className={styles.hero} aria-label="Ranking overview">
        <div>
          <span className={styles.eyebrow}>Public ranking</span>
          <h2>Wallet ranks stay visible. Personal rank needs sign-in.</h2>
        </div>
        <p>
          Anyone can browse the public ranking board. To calculate your own wallet
          standing against the same cohort, Gravii needs a signed wallet session.
        </p>
      </section>

      <section className={styles.board} aria-label="Public ranking board">
        <div className={styles.boardHeader}>
          <span>Rank</span>
          <span>Wallet</span>
          <span>Persona</span>
          <span>Score</span>
          <span>Move</span>
        </div>

        <div className={styles.rows}>
          {publicRankingRows.map((row) => (
            <article className={styles.row} key={row.rank}>
              <strong>{row.rank}</strong>
              <span>{row.wallet}</span>
              <span>{row.persona}</span>
              <span>{row.score}</span>
              <span>{row.movement}</span>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.personalArea} aria-label="Personal wallet ranking">
        <div className={`${styles.personalPreview} ${!connected ? styles.personalPreviewLocked : ""}`}>
          <span className={styles.eyebrow}>My wallet rank</span>
          <strong>{connected ? "Session linked" : "Rank hidden"}</strong>
          <p>
            {connected
              ? "Your signed wallet session is ready for wallet-specific ranking once the ranking read endpoint is live."
              : "Connect your wallet to compare your own rank, tier, and movement against the public board."}
          </p>
          <div className={styles.personalStats}>
            <span>Tier context</span>
            <span>Peer cohort</span>
            <span>Rank movement</span>
          </div>
        </div>

        {!connected ? (
          <div className={styles.signInGate} role="region" aria-label="Personal ranking sign-in gate">
            <div className={styles.signInCard}>
              <span className={styles.eyebrow}>Wallet required</span>
              <h3>Want to know your rank?</h3>
              <p>Sign in with your wallet to unlock your personal ranking card.</p>
              <ActionButton size="panel" className={styles.signInButton} onClick={onConnect}>
                SIGN IN
              </ActionButton>
            </div>
          </div>
        ) : (
          <ActionButton
            size="panel"
            className={styles.profileButton}
            onClick={() => onNavigate?.("profile")}
          >
            REVIEW GRAVII ID
          </ActionButton>
        )}
      </section>
    </div>
  );
}
