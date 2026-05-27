"use client";

import type { CSSProperties, ReactNode } from "react";

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
  tone = "default",
}: {
  label: string;
  meta: string;
  tone?: "default" | "positive" | "negative";
  value: string;
}) {
  return (
    <div className={joinClasses(styles.metricCard, tone !== "default" && styles[`metricCard_${tone}`])}>
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
    <section className={styles.sectionCard}>
      <span className={styles.sectionTitle}>{title}</span>
      {children}
    </section>
  );
}

function MiniBar({
  percent,
  tone = "primary",
}: {
  percent: number;
  tone?: "primary" | "green" | "amber" | "blue";
}) {
  return (
    <span className={styles.miniBar} aria-hidden="true">
      <span
        className={styles[`miniBar_${tone}`]}
        style={{ width: `${Math.min(Math.max(percent, 0), 100)}%` }}
      />
    </span>
  );
}

function formatPercentValue(percent: number) {
  return `${Math.round(percent)}%`;
}

function trendTone(value: string): "default" | "positive" | "negative" {
  if (value.startsWith("+")) return "positive";
  if (value.startsWith("-")) return "negative";
  return "default";
}

function portfolioDonutStyle(detail: XRayDetailViewModel): CSSProperties {
  const stable = detail.assetMix[0]?.percent ?? 0;
  const native = detail.assetMix[1]?.percent ?? 0;
  const other = detail.assetMix[2]?.percent ?? Math.max(0, 100 - stable - native);
  const stableEnd = Math.min(Math.max(stable, 0), 100);
  const nativeEnd = Math.min(stableEnd + Math.max(native, 0), 100);
  const otherEnd = Math.min(nativeEnd + Math.max(other, 0), 100);

  return {
    background: `conic-gradient(var(--xray-green) 0% ${stableEnd}%, var(--xray-blue) ${stableEnd}% ${nativeEnd}%, var(--xray-amber) ${nativeEnd}% ${otherEnd}%, var(--xray-muted-surface) ${otherEnd}% 100%)`,
  };
}

export default function XRayResultView({ detail, onBack }: XRayResultViewProps) {
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <button type="button" className={styles.backButton} onClick={onBack}>
          ← BACK TO SEARCH
        </button>
        <span className={styles.meta}>ANALYZED</span>
      </div>

      <div className={styles.walletBlock}>
        <span className={styles.walletLabel}>WALLET</span>
        <h2 className={styles.walletValue}>{detail.address}</h2>
      </div>

      <Section title="IDENTITY">
        <div className={styles.identityGrid}>
          <div className={styles.identityCell}>
            <span>Primary Persona</span>
            <strong>{detail.primaryPersona}</strong>
          </div>
          <div className={styles.identityCell}>
            <span>Also (up to 2)</span>
            <div className={styles.pillRow}>
              {detail.adjacentPersonas.length > 0 ? (
                detail.adjacentPersonas.map((persona) => (
                  <span key={persona} className={styles.personaPill}>
                    {persona}
                  </span>
                ))
              ) : (
                <span className={styles.personaPillMuted}>No secondary persona</span>
              )}
            </div>
          </div>
          <div className={styles.identityCell}>
            <span>Tier</span>
            <strong>{detail.tier}</strong>
          </div>
          <div className={styles.identityCell}>
            <span>Active Since</span>
            <strong>{detail.activeSince}</strong>
          </div>
          <div className={styles.identityCell}>
            <span>Reputation</span>
            <strong className={styles.positiveValue}>{detail.reputation}</strong>
          </div>
        </div>
      </Section>

      <div className={styles.metricSection}>
        <span className={styles.sectionTitle}>KEY METRICS</span>
        <div className={styles.metricGrid}>
          <MetricCard label="TOTAL VALUE" meta="Current portfolio" value={detail.totalValue} />
          <MetricCard label="TRANSACTIONS" meta="Analysis result" value={detail.transactions90d} />
          <MetricCard label="AVG MONTHLY TRADING VOL" meta="30 day volume" value={detail.tradingVolume30d} />
          <MetricCard label="ACTIVE CHAINS" meta="Observed footprint" value={String(detail.activeChains)} />
          <MetricCard label="DEFI TVL" meta={`${detail.defiProtocolCount} protocols`} value={detail.defiTvl} />
          <MetricCard label="NFTs HELD" meta="Collected assets" value={detail.nftsHeld} />
        </div>
      </div>

      <div className={styles.trendGrid}>
        <MetricCard
          label="7D TREND"
          meta="portfolio"
          tone={trendTone(detail.portfolioTrend7d)}
          value={detail.portfolioTrend7d}
        />
        <MetricCard
          label="30D TREND"
          meta="portfolio"
          tone={trendTone(detail.portfolioTrend30d)}
          value={detail.portfolioTrend30d}
        />
        <MetricCard
          label="90D TREND"
          meta="portfolio"
          tone={trendTone(detail.portfolioTrend90d)}
          value={detail.portfolioTrend90d}
        />
      </div>

      <Section title="PORTFOLIO OVERVIEW">
        <div className={styles.portfolioOverview}>
          <div className={styles.portfolioValue}>
            <span>Total Value</span>
            <strong>{detail.totalValue}</strong>
          </div>

          <div className={styles.portfolioTopGrid}>
            <div className={styles.assetSummary}>
              <div className={styles.donut} style={portfolioDonutStyle(detail)}>
                <span>ASSETS</span>
              </div>
              <div className={styles.assetSummaryRows}>
                {detail.assetMix.map((asset, index) => (
                  <div key={asset.label} className={styles.assetSummaryRow}>
                    <span className={joinClasses(styles.assetDot, styles[`assetDot_${index}`])} />
                    <span>{asset.label}</span>
                    <strong>{asset.total}</strong>
                    <small>{formatPercentValue(asset.percent)}</small>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.chainAndHealth}>
              <span className={styles.subsectionTitle}>BY CHAIN</span>
              <div className={styles.chainList}>
                {detail.chainDistribution.length > 0 ? (
                  detail.chainDistribution.map((chain) => (
                    <div key={chain.chain} className={styles.chainDistributionRow}>
                      <span className={styles.chainName}>{chain.chain}</span>
                      <MiniBar percent={chain.percent} tone="blue" />
                      <span className={styles.chainValue}>{chain.value}</span>
                      <small>
                        {formatPercentValue(chain.percent)}
                        {chain.tokenCount !== "—" ? ` · ${chain.tokenCount} tokens` : ""}
                      </small>
                    </div>
                  ))
                ) : (
                  <p className={styles.emptyState}>
                    No chain breakdown was returned for this wallet yet.
                  </p>
                )}
              </div>

              <div className={styles.healthGrid}>
                <span className={styles.subsectionTitle}>HEALTH</span>
                {detail.portfolioHealth.map((item) => (
                  <div key={item.label} className={styles.healthCard}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.assetTypeHeader}>
            <span className={styles.subsectionTitle}>BY ASSET TYPE</span>
            <small>Top tokens per category · remaining grouped as Others</small>
          </div>

          <div className={styles.assetTypeList}>
            {detail.assetMix.map((asset, index) => (
              <article key={asset.label} className={styles.assetTypeBlock}>
                <div className={styles.assetTypeTopline}>
                  <span className={joinClasses(styles.assetDot, styles[`assetDot_${index}`])} />
                  <strong>{asset.label.toUpperCase()}</strong>
                  <small>Total</small>
                  <span>{asset.total}</span>
                </div>

                <div className={styles.tokenList}>
                  {asset.tokens.length > 0 ? (
                    asset.tokens.map((token) => (
                      <div key={`${asset.label}-${token.name}`} className={styles.tokenRow}>
                        <span>{token.name}</span>
                        <MiniBar percent={token.percent} tone={index === 0 ? "green" : index === 1 ? "blue" : "amber"} />
                        <strong>{token.total}</strong>
                        {token.breakdown.length > 0 ? (
                          <small className={styles.breakdownList}>
                            {token.breakdown
                              .map((breakdown) => `${breakdown.chain} ${breakdown.value}`)
                              .join(" · ")}
                          </small>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <div className={styles.tokenRow}>
                      <span>Top tokens</span>
                      <strong>Not returned yet</strong>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </Section>

      <div className={styles.sectionGrid}>
        <Section title="FUNDING SOURCES">
          <div className={styles.rowList}>
            {detail.fundingSources.map((source) => (
              <div key={source.label} className={styles.percentRow}>
                <span>{source.label}</span>
                <MiniBar percent={source.percent} />
                <strong>{source.percent}%</strong>
              </div>
            ))}
          </div>
          <p className={styles.sectionNote}>
            Top 3 sources: <strong>{detail.topFundingSources}</strong>
          </p>
        </Section>

        <Section title="DeFi ENGAGEMENT">
          <div className={styles.rowList}>
            {detail.defiEngagement.map((entry) => (
              <div key={entry.label} className={styles.percentRow}>
                <span>{entry.label}</span>
                <MiniBar percent={entry.percent} tone="blue" />
                <strong>{entry.percent}%</strong>
                <small>
                  {entry.protocols.length > 0
                    ? entry.protocols
                        .map((protocol) =>
                          protocol.percent === null
                            ? protocol.name
                            : `${protocol.name} ${protocol.percent}%`
                        )
                        .join(" · ")
                    : "—"}
                </small>
              </div>
            ))}
          </div>
          <p className={styles.sectionNote}>
            Unclaimed rewards: <strong>{detail.unclaimedRewards}</strong>
          </p>
        </Section>
      </div>

      <div className={styles.sectionGrid}>
        <Section title="RISK ASSESSMENT">
          <div className={styles.riskGrid}>
            <MetricCard label="RISK LEVEL" meta="Wallet risk" value={detail.riskLevel} />
            <MetricCard label="SYBIL STATUS" meta="Identity quality" value={detail.sybilStatus} />
            <MetricCard label="ENTROPY" meta="Behavior spread" value={detail.entropy} />
            <MetricCard label="FLAGS" meta="Reputation flags" value={detail.flagsLabel} />
          </div>
        </Section>

        <Section title="TRANSFER PATTERNS & GAS">
          <div className={styles.rowList}>
            <div className={styles.percentRow}>
              <span>Incoming</span>
              <MiniBar percent={detail.transferPatterns.incoming} tone="green" />
              <strong>{detail.transferPatterns.incoming}%</strong>
              <small>{detail.transferPatterns.incomingValue}</small>
            </div>
            <div className={styles.percentRow}>
              <span>Outgoing</span>
              <MiniBar percent={detail.transferPatterns.outgoing} tone="amber" />
              <strong>{detail.transferPatterns.outgoing}%</strong>
              <small>{detail.transferPatterns.outgoingValue}</small>
            </div>
          </div>
          <p className={styles.sectionNote}>
            Top counterparties: <strong>{detail.transferPatterns.topCounterparties}</strong>
          </p>
          <p className={styles.sectionNote}>
            Gas: <strong>{detail.gasSpending.total}</strong> · avg {detail.gasSpending.avgPerTx} · {detail.gasSpending.topChains}
          </p>
        </Section>
      </div>

      <Section title="RECENT ACTIVITY">
        <div className={styles.activityList}>
          {detail.recentActivity.length > 0 ? (
            detail.recentActivity.map((transaction) => (
              <div
                key={`${transaction.date}-${transaction.action}`}
                className={styles.activityRow}
              >
                <span className={styles.activityDate}>{transaction.date}</span>
                <span className={styles.activityAction}>{transaction.action}</span>
                <span className={styles.activityMeta}>{transaction.platform}</span>
                <span className={styles.activityMeta}>{transaction.chain}</span>
              </div>
            ))
          ) : (
            <div className={joinClasses(styles.activityRow, styles.activityRowEmpty)}>
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
