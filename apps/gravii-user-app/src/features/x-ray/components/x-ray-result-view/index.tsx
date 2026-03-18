"use client";

import { Card, MiniBar, SectionTitle } from "@/components/ui/launch-primitives";
import { getAnalysisResult } from "@/features/x-ray/x-ray-view-model";

import styles from "./x-ray-result-view.module.css";

type XRayResultViewProps = {
  wallet: string;
  onBack: () => void;
};

function metricToneClass(color: "green" | "amber" | "purple" | "red" | "muted") {
  if (color === "green") return styles.metricToneGreen;
  if (color === "amber") return styles.metricToneAmber;
  if (color === "purple") return styles.metricTonePurple;
  if (color === "red") return styles.metricToneRed;
  return styles.metricToneMuted;
}

function parseNumeric(value: string) {
  return Number.parseFloat(value.replace(/[$,]/g, ""));
}

export default function XRayResultView({ wallet, onBack }: XRayResultViewProps) {
  const result = getAnalysisResult(wallet);

  const assetCategories = [
    { label: "STABLECOINS", data: result.assets.stables, tone: "green" as const },
    { label: "NATIVE TOKENS", data: result.assets.native, tone: "blue" as const },
    { label: "OTHER TOKENS", data: result.assets.others, tone: "amber" as const },
  ];

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <button type="button" className={styles.backButton} onClick={onBack}>
          ← BACK TO SEARCH
        </button>
        <span className={styles.meta}>ANALYZED</span>
      </div>

      <div className={styles.walletLabel}>WALLET</div>
      <p className={styles.walletValue}>{result.wallet}</p>

      {/* ① IDENTITY */}
      <div className={styles.sectionSpacer}>
        <SectionTitle>IDENTITY</SectionTitle>
        <Card>
          <div className={styles.identityGrid}>
            <div className={styles.dataBlock}>
              <span className={styles.dataLabel}>Primary Persona</span>
              <span className={styles.dataValueLarge}>{result.persona}</span>
            </div>
            <div className={styles.dataBlock}>
              <span className={styles.dataLabel}>Also (up to 2)</span>
              <div className={styles.alsoChips}>
                {result.also.map((a) => (
                  <span key={a} className={styles.alsoChip}>{a}</span>
                ))}
              </div>
            </div>
            <div className={styles.dataBlock}>
              <span className={styles.dataLabel}>Tier</span>
              <span className={styles.dataValue}>{result.tier}</span>
            </div>
            <div className={styles.dataBlock}>
              <span className={styles.dataLabel}>Active Since</span>
              <span className={styles.dataValue}>{result.since}</span>
            </div>
            <div className={styles.dataBlock}>
              <span className={styles.dataLabel}>Reputation</span>
              <span className={`${styles.dataValue} ${styles.metricToneGreen}`}>Trusted</span>
            </div>
          </div>
        </Card>
      </div>

      {/* ② KEY METRICS */}
      <div className={styles.sectionSpacer}>
        <SectionTitle>KEY METRICS</SectionTitle>
        <div className={styles.metricGrid}>
          {[
            { label: "TOTAL VALUE", value: result.totalValue },
            { label: "TRANSACTIONS", value: result.txCount },
            { label: "AVG MONTHLY VOL", value: result.monthlyVol },
            { label: "ACTIVE CHAINS", value: result.activeChains },
            { label: "DEFI TVL", value: result.defiTvl },
            { label: "NFTS HELD", value: result.nftCount },
          ].map((metric) => (
            <Card key={metric.label}>
              <span className={styles.metricLabel}>{metric.label}</span>
              <span className={styles.metricValue}>{metric.value}</span>
            </Card>
          ))}
        </div>
      </div>

      {/* ②-b PORTFOLIO TREND */}
      <div className={styles.sectionSpacer}>
        <div className={styles.metricGrid}>
          {result.trends.map((trend) => (
            <Card key={trend.label}>
              <span className={styles.metricLabel}>{trend.label}</span>
              <span className={`${styles.metricValue} ${trend.up ? styles.metricToneGreen : styles.metricToneRed}`}>
                {trend.value}
              </span>
              <span className={styles.trendSubtitle}>portfolio</span>
            </Card>
          ))}
        </div>
      </div>

      {/* ③ PORTFOLIO OVERVIEW */}
      <div className={styles.sectionSpacer}>
        <SectionTitle>PORTFOLIO OVERVIEW</SectionTitle>
        <Card>
          {/* Total */}
          <div className={styles.overviewTotal}>
            <span className={styles.dataLabel}>Total Value</span>
            <span className={styles.overviewTotalValue}>{result.totalValue}</span>
          </div>

          {/* Donut + Type summary | Chain + Health */}
          <div className={styles.overviewGrid}>
            {/* Left: Donut + asset types */}
            <div className={styles.overviewLeft}>
              <div
                className={styles.donut}
                style={{
                  background: `conic-gradient(
                    rgba(100,200,130,0.85) 0% ${result.assets.stables.pct}%,
                    rgba(130,160,240,0.8) ${result.assets.stables.pct}% ${result.assets.stables.pct + result.assets.native.pct}%,
                    rgba(255,200,80,0.85) ${result.assets.stables.pct + result.assets.native.pct}% 100%
                  )`,
                }}
              >
                <div className={styles.donutCenter}>
                  <span className={styles.donutLabel}>ASSETS</span>
                </div>
              </div>
              <div className={styles.assetSummary}>
                {[
                  { label: "Stablecoins", data: result.assets.stables, color: "rgba(100,200,130,0.85)" },
                  { label: "Native Tokens", data: result.assets.native, color: "rgba(130,160,240,0.8)" },
                  { label: "Other Tokens", data: result.assets.others, color: "rgba(255,200,80,0.85)" },
                ].map((a) => (
                  <div key={a.label} className={styles.assetRow}>
                    <div className={styles.assetDot} style={{ background: a.color }} />
                    <span className={styles.assetLabel}>{a.label}</span>
                    <span className={styles.assetValue}>{a.data.total}</span>
                    <span className={styles.assetPct}>{a.data.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Chain distribution + Health */}
            <div className={styles.overviewRight}>
              {/* Chain distribution */}
              <div>
                <span className={styles.subsectionTitle}>BY CHAIN</span>
                <div className={styles.chainList}>
                  {result.chains.map((ch) => (
                    <div key={ch.name} className={styles.chainRow}>
                      <span className={styles.chainName}>{ch.name}</span>
                      <div className={styles.chainBarTrack}>
                        <div className={styles.chainBarFill} style={{ width: `${ch.pct}%` }} />
                      </div>
                      <span className={styles.chainValue}>{ch.value}</span>
                      <span className={styles.chainPct}>{ch.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Health */}
              <div className={styles.healthSection}>
                <span className={styles.subsectionTitle}>HEALTH</span>
                <div className={styles.healthGrid}>
                  {result.health.map((h) => (
                    <div key={h.label} className={styles.healthRow}>
                      <span className={styles.healthLabel}>{h.label}</span>
                      <span className={`${styles.healthValue} ${metricToneClass(h.tone)}`}>{h.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.overviewDivider} />

          {/* BY ASSET TYPE — nested bars */}
          <div className={styles.assetTypeHeader}>
            <span className={styles.assetTypeTitle}>BY ASSET TYPE</span>
            <span className={styles.assetTypeHint}>Top 5 per category · remaining grouped as Others</span>
          </div>

          {assetCategories.map((cat) => {
            const maxVal = Math.max(...cat.data.tokens.map((tk) => parseNumeric(tk.total)));
            const toneColor =
              cat.tone === "green" ? "rgba(100,200,130,0.85)" :
              cat.tone === "blue" ? "rgba(130,160,240,0.8)" :
              "rgba(255,200,80,0.85)";
            return (
              <div key={cat.label} className={styles.assetCategoryBlock}>
                <div className={styles.assetCategoryHeader}>
                  <div className={styles.assetDot} style={{ background: toneColor }} />
                  <span className={styles.assetCategoryName}>{cat.label}</span>
                  <span className={styles.assetCategoryTotalLabel}>Total</span>
                  <span className={styles.assetCategoryTotalValue}>{cat.data.total}</span>
                </div>
                <div className={styles.tokenList}>
                  {cat.data.tokens.map((tk) => {
                    const tkVal = parseNumeric(tk.total);
                    const tkPct = (tkVal / maxVal) * 100;
                    const isOthers = "isOthers" in tk && tk.isOthers;
                    return (
                      <div key={tk.name} className={isOthers ? styles.tokenRowOthers : undefined}>
                        <div className={styles.tokenBar}>
                          <span className={`${styles.tokenName} ${isOthers ? styles.tokenNameOthers : ""}`}>{tk.name}</span>
                          <div className={isOthers ? styles.tokenBarTrackSmall : styles.tokenBarTrack}>
                            <div
                              className={styles.tokenBarFill}
                              style={{ width: `${tkPct}%`, background: toneColor, opacity: isOthers ? 0.3 : 0.7 }}
                            />
                          </div>
                          <span className={`${styles.tokenTotal} ${isOthers ? styles.tokenTotalOthers : ""}`}>{tk.total}</span>
                        </div>
                        {/* Sub-bars for chain breakdown */}
                        {tk.breakdown.length > 1 ? (
                          <div className={styles.tokenBreakdown}>
                            {tk.breakdown.map((b) => {
                              const bVal = parseNumeric(b.val);
                              const bPct = (bVal / tkVal) * 100;
                              return (
                                <div key={b.chain} className={styles.breakdownRow}>
                                  <span className={styles.breakdownChain}>on {b.chain}</span>
                                  <div className={styles.breakdownBarTrack}>
                                    <div className={styles.breakdownBarFill} style={{ width: `${bPct}%`, background: toneColor }} />
                                  </div>
                                  <span className={styles.breakdownVal}>{b.val}</span>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className={styles.tokenBreakdown}>
                            <span className={styles.breakdownChain}>on {tk.breakdown[0].chain}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </Card>
      </div>

      {/* ⑤ FUNDING SOURCES */}
      <div className={styles.sectionSpacer}>
        <SectionTitle>FUNDING SOURCES</SectionTitle>
        <Card>
          <div className={styles.bars}>
            {[
              { label: "CEX (Centralized Exchange)", pct: result.funding.cex },
              { label: "Bridge", pct: result.funding.bridge },
              { label: "Direct Wallet", pct: result.funding.wallet },
            ].map((row) => (
              <div key={row.label} className={styles.barRow}>
                <span className={styles.barLabelWide}>{row.label}</span>
                <MiniBar pct={row.pct} tone="purple" />
                <span className={styles.barValue}>{row.pct}%</span>
              </div>
            ))}
          </div>
          <div className={styles.fundingFooter}>
            <span className={styles.fundingFooterText}>
              Top 3 Sources: <span className={styles.fundingFooterHighlight}>{result.funding.top3.join(" · ")}</span>
            </span>
          </div>
        </Card>
      </div>

      {/* ⑥ DeFi ENGAGEMENT */}
      <div className={styles.sectionSpacer}>
        <SectionTitle>DeFi ENGAGEMENT</SectionTitle>
        <Card>
          <div className={styles.bars}>
            {[
              { label: "Liquidity Providing", data: result.defi.lp, tone: "green" as const },
              { label: "Lending", data: result.defi.lending, tone: "purple" as const },
              { label: "Staking", data: result.defi.staking, tone: "purple" as const },
              { label: "Vault", data: result.defi.vault, tone: "amber" as const },
            ].map((d) => (
              <div key={d.label}>
                <div className={styles.barRow}>
                  <span className={styles.barLabelWide}>{d.label}</span>
                  <MiniBar pct={d.data.pct} tone={d.tone} />
                  <span className={styles.barValue}>{d.data.pct}%</span>
                </div>
                <div className={styles.protocolRow}>
                  {d.data.protocols.map((p) => (
                    <span key={p.name} className={`${styles.protocolText} ${p.name === "Others" ? styles.protocolOthers : ""}`}>
                      {p.name} <span className={styles.protocolPct}>{p.pct}%</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className={styles.fundingFooter}>
            <span className={styles.fundingFooterText}>
              Unclaimed Rewards: <span className={styles.metricToneGreen}>{result.unclaimed}</span>
            </span>
          </div>
        </Card>
      </div>

      {/* ⑦ RISK ASSESSMENT */}
      <div className={styles.sectionSpacer}>
        <SectionTitle>RISK ASSESSMENT</SectionTitle>
        <Card>
          <div className={styles.riskGrid}>
            {[
              { label: "RISK LEVEL", value: result.risk, tone: "green" as const },
              { label: "SYBIL STATUS", value: result.sybil, tone: "green" as const },
              { label: "ENTROPY", value: result.entropy, tone: "muted" as const },
              { label: "FLAGS", value: result.flags, tone: "green" as const },
            ].map((r) => (
              <div key={r.label} className={styles.riskItem}>
                <span className={styles.metricLabel}>{r.label}</span>
                <span className={`${styles.riskValue} ${metricToneClass(r.tone)}`}>{r.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ⑧ TRANSFER PATTERNS & GAS */}
      <div className={styles.sectionSpacer}>
        <SectionTitle>TRANSFER PATTERNS &amp; GAS</SectionTitle>
        <div className={styles.transferGasGrid}>
          <Card>
            <span className={styles.subsectionTitleInCard}>TRANSFERS</span>
            <div className={styles.bars}>
              <div className={styles.barRow}>
                <span className={styles.barLabel}>Incoming</span>
                <MiniBar pct={result.transfer.incoming} tone="green" />
                <span className={styles.barValue}>{result.transfer.incoming}%</span>
                <span className={`${styles.barWideValue} ${styles.metricToneGreen}`}>{result.transfer.inVal}</span>
              </div>
              <div className={styles.barRow}>
                <span className={styles.barLabel}>Outgoing</span>
                <MiniBar pct={result.transfer.outgoing} tone="amber" />
                <span className={styles.barValue}>{result.transfer.outgoing}%</span>
                <span className={`${styles.barWideValue} ${styles.metricToneAmber}`}>{result.transfer.outVal}</span>
              </div>
            </div>
            <div className={styles.transferFooter}>
              Top 3 Counterparties: <span className={styles.transferHighlight}>{result.transfer.top3.join(" · ")}</span>
            </div>
          </Card>
          <Card>
            <span className={styles.subsectionTitleInCard}>GAS SPENDING</span>
            <div className={styles.gasStats}>
              <div>
                <span className={styles.dataLabel}>Total Spent</span>
                <span className={styles.gasTotal}>{result.gas.total}</span>
              </div>
              <div>
                <span className={styles.dataLabel}>
                  Top 3 Chains: <span className={styles.transferHighlight}>{result.gas.top3Chains.join(" · ")}</span>
                </span>
              </div>
              <div>
                <span className={styles.dataLabel}>
                  Avg per TX: <span className={styles.transferHighlight}>{result.gas.avgTx}</span>
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ⑨ RECENT ACTIVITY */}
      <div className={styles.sectionSpacer}>
        <SectionTitle>RECENT ACTIVITY</SectionTitle>
        <div className={styles.recentList}>
          {result.recentTx.map((transaction) => (
            <div key={`${transaction.date}-${transaction.action}`} className={styles.recentRow}>
              <span className={styles.recentDate}>{transaction.date}</span>
              <span className={styles.recentAction}>{transaction.action}</span>
              <span className={styles.recentPlatform}>{transaction.platform}</span>
              <span className={styles.recentChain}>{transaction.chain}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
