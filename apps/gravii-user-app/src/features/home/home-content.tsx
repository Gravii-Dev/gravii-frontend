"use client";

import ActionButton from "@/components/ui/action-button";
import type { SharedContentProps } from "@/features/launch-app/types";

import styles from "./home-content.module.css";

const productMap = [
  {
    label: "Gravii ID",
    value: "Persona",
    copy: "Translate wallet activity into a usable identity layer.",
  },
  {
    label: "X-Ray",
    value: "Lookup",
    copy: "Read any wallet against the same identity graph.",
  },
  {
    label: "Standing",
    value: "Reputation",
    copy: "Prepare cohort rank, tier movement, and guarded signals.",
  },
  {
    label: "Discovery",
    value: "Matching",
    copy: "Route verified opportunities to the right wallet context.",
  },
];

export default function HomeContent({
  connected,
  onConnect,
  onNavigate,
}: SharedContentProps) {
  return (
    <div className={styles.root}>
      <section className={styles.hero}>
        <div className={styles.heroMain}>
          <div className={styles.heroBrandStack}>
            <span className={styles.kicker}>00 / COMMAND HOME</span>
          </div>
          <h1 className={styles.title}>
            Wallets become
            <span>identity.</span>
          </h1>
        </div>
        <div className={styles.heroAside}>
          <p>
            Gravii reads wallet behavior and turns it into a practical identity
            workspace for persona, X-Ray, standing, and matched opportunities.
          </p>
          <ActionButton
            size="panel"
            className={styles.primaryAction}
            onClick={connected ? () => onNavigate?.("profile") : onConnect}
          >
            {connected ? "OPEN GRAVII ID" : "SIGN IN"}
          </ActionButton>
        </div>
      </section>

      <section className={styles.statusGrid} aria-label="Gravii session overview">
        <article className={`${styles.statusCard} ${styles.statusCardStrong}`}>
          <span className={styles.cardLabel}>SESSION</span>
          <strong>{connected ? "CONNECTED" : "ANONYMOUS"}</strong>
          <p>{connected ? "Identity context is available." : "Connect a wallet to generate the first readout."}</p>
        </article>
        <article className={styles.statusCard}>
          <span className={styles.cardLabel}>COVERAGE</span>
          <strong>50+ chains</strong>
          <p>Designed for a multi-chain wallet graph.</p>
        </article>
        <article className={styles.statusCard}>
          <span className={styles.cardLabel}>X-RAY</span>
          <strong>10-30 sec</strong>
          <p>Run a read and reopen prior wallet lookups.</p>
        </article>
      </section>

      <section className={styles.mapGrid} aria-label="Product map">
        {productMap.map((item) => (
          <article className={styles.mapCard} key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <p>{item.copy}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
