"use client";

import type { ReactNode } from "react";

import GraviiLogo from "@/components/ui/gravii-logo";
import type { XRayDetailViewModel } from "@/features/x-ray/x-ray-view-model";

import styles from "./x-ray-result-view.module.css";

type XRayResultViewProps = {
  detail: XRayDetailViewModel;
  onBack: () => void;
};

function joinClasses(...classNames: Array<string | false | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

function MetricCard({
  label,
  meta,
  value,
}: {
  label: string;
  meta: string;
  value: string;
}) {
  return (
    <div className={styles.metricCard} data-liquid-glass="soft">
      <span className={styles.metricLabel}>{label}</span>
      <strong className={styles.metricValue}>{value}</strong>
      <span className={styles.metricMeta}>{meta}</span>
    </div>
  );
}

function Section({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <section className={styles.sectionCard} data-liquid-glass="panel">
      <span className={styles.sectionTitle}>{title}</span>
      {children}
    </section>
  );
}

export default function XRayResultView({ detail, onBack }: XRayResultViewProps) {
  return (
    <div className={styles.root}>
      <div className={styles.header} data-liquid-glass="panel">
        <button type="button" className={styles.backButton} data-liquid-glass="soft" onClick={onBack}>
          ← BACK TO SEARCH
        </button>
        <span className={styles.meta}>ANALYZED</span>
      </div>

      <section className={styles.hero} data-liquid-glass="panel">
        <div className={styles.heroCopy}>
          <span className={styles.walletLabel}>WALLET</span>
          <h2 className={styles.walletValue}>{detail.address}</h2>
          <p className={styles.heroNarrative}>
            {detail.primaryPersona} profile · {detail.tier} tier · {detail.reputation} reputation
          </p>

          <div className={styles.pillRow}>
            <span className={styles.personaPill} data-liquid-glass="soft">{detail.primaryPersona}</span>
            {detail.adjacentPersonas.map((persona) => (
              <span key={persona} className={styles.personaPillMuted} data-liquid-glass="soft">
                {persona}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.heroMark}>
          <GraviiLogo decorative variant="motion" className={styles.mark} />
          <div className={styles.heroFactCard} data-liquid-glass="soft">
            <span className={styles.sectionTitle}>IDENTITY READ</span>
            <strong className={styles.factValue}>{detail.activeSince}</strong>
            <span className={styles.factMeta}>{detail.activeChains} active chains</span>
          </div>
        </div>
      </section>

      <div className={styles.metricGrid}>
        <MetricCard label="TOTAL VALUE" meta="Current portfolio" value={detail.totalValue} />
        <MetricCard label="TRANSACTIONS" meta="Last 90 days" value={detail.transactions90d} />
        <MetricCard label="AVG MONTHLY VOL" meta="30 day volume" value={detail.tradingVolume30d} />
        <MetricCard label="DEFI TVL" meta={`${detail.defiProtocolCount} protocols`} value={detail.defiTvl} />
        <MetricCard label="30D TREND" meta="Portfolio trend" value={detail.portfolioTrend30d} />
        <MetricCard label="REPUTATION" meta="Current state" value={detail.reputation} />
      </div>

      <div className={styles.sectionGrid}>
        <Section title="CHAIN BREAKDOWN">
          <div className={styles.chainList}>
            {detail.byChain.length > 0 ? (
              detail.byChain.map((chain) => (
                <div key={chain.chain} className={styles.chainRow} data-liquid-glass="soft">
                  <span className={styles.chainName}>{chain.chain}</span>
                  <span className={styles.chainValue}>{chain.value}</span>
                </div>
              ))
            ) : (
              <p className={styles.emptyState}>
                No chain breakdown was returned for this wallet yet.
              </p>
            )}
          </div>
        </Section>

        <Section title="REPUTATION FLAGS">
          <div className={styles.flagWrap}>
            {detail.reputationFlags.length > 0 ? (
              detail.reputationFlags.map((flag) => (
                <span key={flag} className={styles.flagChip} data-liquid-glass="soft">
                  {flag}
                </span>
              ))
            ) : (
              <p className={styles.emptyState}>No active flags</p>
            )}
          </div>
        </Section>
      </div>

      <Section title="PORTFOLIO & RISK SIGNALS">
        <div className={styles.signalGrid}>
          <div className={styles.signalCard} data-liquid-glass="soft">
            <span className={styles.metricLabel}>PORTFOLIO OVERVIEW</span>
            <strong>{detail.totalValue}</strong>
            <span>Across {detail.activeChains} active chains</span>
          </div>
          <div className={styles.signalCard} data-liquid-glass="soft">
            <span className={styles.metricLabel}>DEFI ENGAGEMENT</span>
            <strong>{detail.defiTvl}</strong>
            <span>{detail.defiProtocolCount} protocols detected</span>
          </div>
          <div className={styles.signalCard} data-liquid-glass="soft">
            <span className={styles.metricLabel}>RISK ASSESSMENT</span>
            <strong>{detail.reputation}</strong>
            <span>
              {detail.reputationFlags.length > 0
                ? `${detail.reputationFlags.length} active flags`
                : "No active flags"}
            </span>
          </div>
          <div className={styles.signalCard} data-liquid-glass="soft">
            <span className={styles.metricLabel}>TRANSFER & GAS</span>
            <strong>{detail.transactions90d}</strong>
            <span>Transactions available in the current result schema</span>
          </div>
        </div>
      </Section>

      <Section title="RECENT ACTIVITY">
        <div className={styles.activityList}>
          {detail.recentActivity.length > 0 ? (
            detail.recentActivity.map((transaction) => (
              <div
                key={`${transaction.date}-${transaction.action}`}
                className={styles.activityRow}
                data-liquid-glass="soft"
              >
                <span className={styles.activityDate}>{transaction.date}</span>
                <span className={styles.activityAction}>{transaction.action}</span>
                <span className={styles.activityMeta}>{transaction.platform}</span>
                <span className={styles.activityMeta}>{transaction.chain}</span>
              </div>
            ))
          ) : (
            <div className={joinClasses(styles.activityRow, styles.activityRowEmpty)} data-liquid-glass="soft">
              <span className={styles.activityAction}>
                No recent activity was returned for this wallet yet.
              </span>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}
