"use client";

import { useState } from "react";

import {
  ACQUISITION_SOURCE_STATS,
  ACTIVITY_BY_TIER,
  ATTRIBUTION_FIRST_TOUCH_ROWS,
  CAMPAIGN_FILTERS,
  COHORT_ROWS,
  COHORT_SUMMARY,
  COMPOSITION_SYBIL_STATUS,
  COMPOSITION_VALUE_STATS,
  FUNNEL_ROWS,
  FUNNEL_STAGES,
  GROWTH_GRADE_ROWS,
  GROWTH_HEALTH_STATS,
  GROWTH_TREND_ROWS,
  NET_POOL_EFFECT,
  OVERVIEW_SOURCE_MIX,
  OVERVIEW_STATS,
  PAGE_TITLES,
  PARTNER_ATTRIBUTION_ROWS,
  PARTNER_FILTERS,
  PERSONA_BREAKDOWN,
  PRIMARY_CHAIN_DISTRIBUTION,
  PRODUCT_CONTRIBUTIONS,
  PRODUCT_LABELS,
  RISK_CHAIN_DISTRIBUTION,
  RISK_SYBIL_PARTNERS,
  RISK_SYBIL_STATS,
  SAMPLE_EXPLORER_PROFILE,
  SOURCE_QUALITY_ROWS,
  SOURCE_TREND_WEEKS,
  TIER_DISTRIBUTION,
  USER_GROWTH_SERIES
} from "@/features/hq/data";
import {
  buildCampaignSummary,
  buildPartnerSummary,
  getActiveCampaigns,
  getOverviewTopPartners,
  getProductBadges,
  getRevenueLeaders
} from "@/features/hq/selectors";
import type {
  AccentTone,
  Campaign,
  DashboardPageId,
  DashboardStat,
  ExplorerProfile,
  Partner
} from "@/features/hq/types";
import styles from "@/features/hq/dashboard.module.css";

type DashboardSectionViewProps = {
  currentPage: DashboardPageId;
  selectedPeriod: string;
  filteredPartners: Partner[];
  filteredCampaigns: Campaign[];
  selectedPartner: Partner;
  partnerSearch: string;
  partnerStatusFilters: string[];
  partnerPlanFilters: string[];
  partnerProductFilters: string[];
  campaignStatusFilters: string[];
  campaignScopeFilters: string[];
  campaignPartnerFilters: string[];
  explorerQuery: string;
  explorerQueryDraft: string;
  explorerSearchTick: number;
  onNavigate: (pageId: DashboardPageId) => void;
  onOpenPartnerDetail: (partnerName: string) => void;
  onPartnerSearchChange: (value: string) => void;
  onTogglePartnerStatus: (value: string) => void;
  onTogglePartnerPlan: (value: string) => void;
  onTogglePartnerProduct: (value: string) => void;
  onResetPartnerFilters: () => void;
  onToggleCampaignStatus: (value: string) => void;
  onToggleCampaignScope: (value: string) => void;
  onToggleCampaignPartner: (value: string) => void;
  onResetCampaignFilters: () => void;
  onExplorerQueryDraftChange: (value: string) => void;
  onExplorerSearch: () => void;
};

type DemoFilterBarProps = {
  groups: Array<{ label: string; options: string[] }>;
  note?: string;
  toggleLabel?: string;
};

type FilterGroupProps = {
  label: string;
  options: readonly string[];
  values: string[];
  onToggle: (value: string) => void;
};

type CardProps = {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

function cx(...classNames: Array<string | false | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

function formatCurrency(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}

function matchesExplorerProfile(profile: ExplorerProfile, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (normalized.length === 0) {
    return true;
  }

  const haystack = [
    profile.walletAddress,
    profile.graviiId,
    profile.tier,
    profile.status,
    ...profile.personas
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalized);
}

function filterTextRows(
  rows: readonly (readonly string[])[],
  activeGroups: string[][]
): string[][] {
  return rows
    .filter((row) => {
      const haystack = row.join(" ").toLowerCase();

      return activeGroups.every((group) => {
        if (group.length === 0) {
          return true;
        }

        return group.some((value) => haystack.includes(value.toLowerCase()));
      });
    })
    .map((row) => [...row]);
}

function Badge({
  tone,
  children
}: Readonly<{ tone: AccentTone; children: React.ReactNode }>) {
  return (
    <span className={styles.badge} data-tone={tone}>
      {children}
    </span>
  );
}

function Card({ title, action, children, className }: Readonly<CardProps>) {
  return (
    <section className={cx(styles.card, className)}>
      <header className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>{title}</h2>
        {action ? <div>{action}</div> : null}
      </header>
      {children}
    </section>
  );
}

function StatGrid({ stats }: Readonly<{ stats: DashboardStat[] }>) {
  return (
    <div className={styles.statGrid}>
      {stats.map((stat) => (
        <article key={stat.label} className={styles.statCard} data-tone={stat.accent}>
          <p className={styles.statLabel}>{stat.label}</p>
          <p className={styles.statValue}>{stat.value}</p>
          {stat.supportingText ? (
            <p className={styles.statSupporting}>{stat.supportingText}</p>
          ) : null}
        </article>
      ))}
    </div>
  );
}

function FilterToggleGroup({ label, options, values, onToggle }: Readonly<FilterGroupProps>) {
  return (
    <div className={styles.filterGroup}>
      <span className={styles.filterLabel}>{label}</span>
      <button
        type="button"
        className={cx(styles.filterChip, values.length === 0 && styles.filterChipActive)}
        onClick={() => {
          options.forEach((option) => {
            if (values.includes(option)) {
              onToggle(option);
            }
          });
        }}
      >
        All
      </button>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={cx(styles.filterChip, values.includes(option) && styles.filterChipActive)}
          onClick={() => onToggle(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function DemoFilterBar({ groups, note, toggleLabel }: Readonly<DemoFilterBarProps>) {
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const [toggleOn, setToggleOn] = useState(true);

  return (
    <div className={styles.filterBar}>
      {groups.map((group) => {
        const values = selected[group.label] ?? [];

        return (
          <div key={group.label} className={styles.filterGroup}>
            <span className={styles.filterLabel}>{group.label}</span>
            <button
              type="button"
              className={cx(styles.filterChip, values.length === 0 && styles.filterChipActive)}
              onClick={() => {
                setSelected((current) => ({ ...current, [group.label]: [] }));
              }}
            >
              All
            </button>
            {group.options.map((option) => (
              <button
                key={option}
                type="button"
                className={cx(
                  styles.filterChip,
                  values.includes(option) && styles.filterChipActive
                )}
                onClick={() => {
                  setSelected((current) => {
                    const existing = current[group.label] ?? [];
                    const next = existing.includes(option)
                      ? existing.filter((value) => value !== option)
                      : [...existing, option];

                    return { ...current, [group.label]: next };
                  });
                }}
              >
                {option}
              </button>
            ))}
          </div>
        );
      })}

      {toggleLabel ? (
        <button
          type="button"
          className={cx(styles.filterChip, toggleOn && styles.filterChipActive)}
          onClick={() => setToggleOn((value) => !value)}
        >
          {toggleLabel}
        </button>
      ) : null}

      <button
        type="button"
        className={styles.filterReset}
        onClick={() => {
          setSelected({});
          setToggleOn(true);
        }}
      >
        Reset
      </button>

      {note ? <p className={styles.filterNote}>{note}</p> : null}
    </div>
  );
}

function BarList({ bars }: Readonly<{ bars: typeof OVERVIEW_SOURCE_MIX }>) {
  return (
    <div className={styles.barList}>
      {bars.map((bar) => (
        <div key={bar.label} className={styles.barRow}>
          <div className={styles.barHeader}>
            <span className={styles.barLabel}>{bar.label}</span>
            <span className={styles.barValue} data-tone={bar.accent}>
              {bar.valueLabel}
            </span>
          </div>
          <div className={styles.barTrack}>
            <div
              className={styles.barFill}
              data-tone={bar.accent}
              style={{ width: `${bar.percentage}%` }}
            />
          </div>
          {bar.note ? <p className={styles.barNote}>{bar.note}</p> : null}
        </div>
      ))}
    </div>
  );
}

function GrowthChart() {
  const max = Math.max(...USER_GROWTH_SERIES);

  return (
    <div className={styles.sparkChart}>
      {USER_GROWTH_SERIES.map((value, index) => (
        <div
          key={`${value}-${index}`}
          className={styles.sparkBar}
          style={{ height: `${(value / max) * 100}%` }}
        />
      ))}
    </div>
  );
}

function TierDonut() {
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const segments = TIER_DISTRIBUTION.map((slice, index) => {
    const offsetPercentage = TIER_DISTRIBUTION.slice(0, index).reduce(
      (sum, current) => sum + current.percentage,
      0
    );

    return {
      ...slice,
      length: (slice.percentage / 100) * circumference,
      dashOffset: -((offsetPercentage / 100) * circumference)
    };
  });

  return (
    <div className={styles.donutLayout}>
      <div className={styles.donutWrap}>
        <svg viewBox="0 0 140 140" className={styles.donutSvg} aria-hidden="true">
          <circle cx="70" cy="70" r={radius} className={styles.donutTrack} />
          {segments.map((slice) => (
            <circle
              key={slice.label}
              cx="70"
              cy="70"
              r={radius}
              className={styles.donutSegment}
              data-tone={slice.accent}
              style={{
                strokeDasharray: `${slice.length} ${circumference - slice.length}`,
                strokeDashoffset: slice.dashOffset
              }}
            />
          ))}
        </svg>
        <div className={styles.donutCenter}>
          <strong>487K</strong>
          <span>Total IDs</span>
        </div>
      </div>

      <div className={styles.donutLegend}>
        {TIER_DISTRIBUTION.map((slice) => (
          <div key={slice.label} className={styles.legendRow}>
            <span className={styles.legendSwatch} data-tone={slice.accent} />
            <span>
              {slice.label} — {slice.percentage}% ({slice.countLabel})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SourceTrendChart() {
  return (
    <div className={styles.stackedColumns}>
      {SOURCE_TREND_WEEKS.map((week, weekIndex) => {
        const total = week.reduce((sum, value) => sum + value, 0);

        return (
          <div key={`week-${weekIndex}`} className={styles.stackedColumn}>
            {week.map((value, segmentIndex) => {
              const tone = ["teal", "blue", "purple", "amber", "hq"][segmentIndex] as AccentTone;

              return (
                <div
                  key={`${weekIndex}-${segmentIndex}`}
                  className={styles.stackedSegment}
                  data-tone={tone}
                  style={{ height: `${(value / total) * 100}%` }}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function EmptyState({
  title,
  description
}: Readonly<{ title: string; description: string }>) {
  return (
    <div className={styles.emptyState}>
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  );
}

function OverviewSection({
  selectedPeriod,
  onNavigate
}: Readonly<Pick<DashboardSectionViewProps, "selectedPeriod" | "onNavigate">>) {
  const topPartners = getOverviewTopPartners();
  const liveCampaigns = getActiveCampaigns();

  return (
    <div className={styles.stack}>
      <div className={styles.contextBanner}>
        Operating window set to <strong>{selectedPeriod}</strong>. Core product metrics remain
        separated from raw samples so the UI can evolve cleanly toward real APIs.
      </div>
      <StatGrid stats={OVERVIEW_STATS} />

      <div className={styles.gridWide}>
        <Card
          title="User Growth"
          action={
            <button type="button" className={styles.linkButton} onClick={() => onNavigate("pool-cohort")}>
              View Cohort
            </button>
          }
        >
          <GrowthChart />
          <div className={styles.chartFooter}>
            <span>30d ago</span>
            <span>Today</span>
          </div>
        </Card>

        <Card title="Tier Distribution">
          <TierDonut />
        </Card>
      </div>

      <div className={styles.gridTwo}>
        <Card
          title="Acquisition Source Mix (7d)"
          action={
            <button type="button" className={styles.linkButton} onClick={() => onNavigate("acq-source")}>
              Details
            </button>
          }
        >
          <BarList bars={OVERVIEW_SOURCE_MIX} />
        </Card>

        <Card
          title="Top Partners by Drive (7d)"
          action={
            <button type="button" className={styles.linkButton} onClick={() => onNavigate("partner-list")}>
              All Partners
            </button>
          }
        >
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Partner</th>
                  <th>Users</th>
                  <th>Gold+</th>
                  <th>Sybil</th>
                </tr>
              </thead>
              <tbody>
                {topPartners.map((partner) => (
                  <tr key={partner.name}>
                    <td>{partner.name}</td>
                    <td>{formatNumber(Math.round(partner.users1st / 14.8))}</td>
                    <td>
                      <Badge tone={partner.goldRate >= 50 ? "green" : "teal"}>
                        {partner.goldRate}%
                      </Badge>
                    </td>
                    <td>
                      <Badge tone={partner.sybilRate <= 8 ? "green" : partner.sybilRate <= 15 ? "amber" : "red"}>
                        {partner.sybilRate}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Card
        title="Active Campaigns"
        action={
          <button type="button" className={styles.linkButton} onClick={() => onNavigate("campaigns")}>
            All Campaigns
          </button>
        }
      >
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Partner</th>
                <th>Scope</th>
                <th>Engaged</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {liveCampaigns.map((campaign) => (
                <tr key={`${campaign.partner}-${campaign.name}`}>
                  <td>{campaign.name}</td>
                  <td>{campaign.partner}</td>
                  <td>
                    <Badge
                      tone={
                        campaign.scope === "Users"
                          ? "blue"
                          : campaign.scope === "Both"
                            ? "teal"
                            : "purple"
                      }
                    >
                      {campaign.scope}
                    </Badge>
                  </td>
                  <td>{formatNumber(campaign.engaged)}</td>
                  <td>
                    <Badge tone={campaign.status === "Live" ? "green" : "amber"}>
                      {campaign.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className={styles.gridTwo}>
        <Card
          title="Revenue (30d)"
          action={
            <button type="button" className={styles.linkButton} onClick={() => onNavigate("partner-perf")}>
              View Performance
            </button>
          }
        >
          <div className={styles.revenueHero}>
            <div>
              <span className={styles.mutedLabel}>Total MRR</span>
              <strong className={styles.revenueHeadline}>$33,800</strong>
            </div>
            <span className={styles.positiveDelta}>+18.2% MoM</span>
          </div>

          <div className={styles.revenueSplit}>
            <article className={styles.metricPanel} data-tone="blue">
              <span className={styles.mutedLabel}>Gate (API)</span>
              <strong>$22,400</strong>
              <span>66% of MRR</span>
            </article>
            <article className={styles.metricPanel} data-tone="teal">
              <span className={styles.mutedLabel}>Reach (Campaign)</span>
              <strong>$8,200</strong>
              <span>24% of MRR</span>
            </article>
            <article className={styles.metricPanel} data-tone="purple">
              <span className={styles.mutedLabel}>Lens (Report)</span>
              <strong>$3,200</strong>
              <span>10% of MRR</span>
            </article>
          </div>
        </Card>

        <Card title="Revenue by Top Partners">
          <BarList
            bars={[
              { label: "ZenProtocol", valueLabel: "$8,200", percentage: 100, accent: "green" },
              { label: "Nexus Finance", valueLabel: "$6,800", percentage: 83, accent: "green" },
              { label: "ChainVault", valueLabel: "$3,400", percentage: 41, accent: "teal" },
              { label: "DeFi Pulse", valueLabel: "$2,800", percentage: 34, accent: "teal" },
              { label: "Others (30)", valueLabel: "$12,600", percentage: 60, accent: "neutral" }
            ]}
          />
        </Card>
      </div>
    </div>
  );
}

function PoolCompositionSection() {
  const compositionStats: DashboardStat[] = TIER_DISTRIBUTION.map((slice) => ({
    label: slice.label,
    value: slice.countLabel,
    accent: slice.accent,
    supportingText: `${slice.percentage.toFixed(1)}% of pool`
  }));

  return (
    <div className={styles.stack}>
      <DemoFilterBar
        groups={[
          { label: "Chain", options: ["Ethereum", "Arbitrum", "Base", "Polygon", "Optimism"] },
          { label: "Source", options: ["Partner Drive", "Campaign", "Organic", "Bot", "Referral"] }
        ]}
        toggleLabel="Include Sybil"
        note="Preview filter interactions are wired for the future API layer. The core information architecture is already separated."
      />

      <StatGrid stats={compositionStats} />

      <div className={styles.gridTwo}>
        <Card title="Top Personas (All Tiers)">
          <BarList bars={PERSONA_BREAKDOWN} />
          <p className={styles.inlineNote}>
            Showing top 8 of 20 personas. Remaining personas account for 29% of the pool.
          </p>
        </Card>

        <Card title="Primary Chain Distribution">
          <BarList bars={PRIMARY_CHAIN_DISTRIBUTION} />
          <div className={styles.summarySplit}>
            <div>
              <strong>62%</strong>
              <span>2+ chains</span>
            </div>
            <div>
              <strong>28%</strong>
              <span>4+ chains</span>
            </div>
            <div>
              <strong>3.4</strong>
              <span>Avg chains/user</span>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Value Distribution">
        <StatGrid stats={COMPOSITION_VALUE_STATS} />
      </Card>

      <div className={styles.gridTwo}>
        <Card title="Sybil Status in Pool">
          <BarList bars={COMPOSITION_SYBIL_STATUS} />
        </Card>
        <Card title="Pool Rollup">
          <div className={styles.metricPanel} data-tone="neutral">
            <span className={styles.mutedLabel}>Total Including Sybil</span>
            <strong>487,231</strong>
            <span>69,187 flagged and tracked separately</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

function PoolCohortSection() {
  return (
    <div className={styles.stack}>
      <DemoFilterBar
        groups={[
          { label: "Source", options: ["Partner Drive", "Campaign", "Organic", "Bot"] },
          { label: "Tier", options: ["Gold+", "Platinum+", "Black"] }
        ]}
      />

      <StatGrid stats={COHORT_SUMMARY} />

      <Card title="Monthly Cohort Retention">
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Cohort</th>
                <th>Size</th>
                <th>Week 1</th>
                <th>Week 2</th>
                <th>Week 3</th>
                <th>Week 4</th>
                <th>Month 2</th>
                <th>Month 3</th>
              </tr>
            </thead>
            <tbody>
              {COHORT_ROWS.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell) => (
                    <td key={`${row[0]}-${cell}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={styles.inlineNote}>
          Trend: retention is improving month over month and newest cohorts show the strongest
          stickiness.
        </p>
      </Card>

      <Card title="Activity by Tier (30d)">
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Tier</th>
                <th>Active Rate</th>
                <th>Avg Tx/User</th>
                <th>Avg Sessions</th>
              </tr>
            </thead>
            <tbody>
              {ACTIVITY_BY_TIER.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell) => (
                    <td key={`${row[0]}-${cell}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function PoolExplorerSection({
  explorerQuery,
  explorerQueryDraft,
  explorerSearchTick,
  onExplorerQueryDraftChange,
  onExplorerSearch
}: Readonly<
  Pick<
    DashboardSectionViewProps,
    | "explorerQuery"
    | "explorerQueryDraft"
    | "explorerSearchTick"
    | "onExplorerQueryDraftChange"
    | "onExplorerSearch"
  >
>) {
  const isExactMatch = matchesExplorerProfile(SAMPLE_EXPLORER_PROFILE, explorerQuery);

  return (
    <div className={styles.stack}>
      <DemoFilterBar
        groups={[
          { label: "Tier", options: ["Classic", "Gold", "Platinum", "Black"] },
          { label: "Persona", options: ["Diamond Hands", "Yield Explorer", "Fast Mover"] },
          { label: "Status", options: ["Clean", "Suspect", "Sybil"] },
          { label: "Chain", options: ["ETH", "ARB", "BASE"] },
          { label: "Source", options: ["Partner", "Campaign", "Organic"] }
        ]}
      />

      <Card title="Wallet / Gravii ID Search">
        <div className={styles.searchRow}>
          <input
            value={explorerQueryDraft}
            onChange={(event) => onExplorerQueryDraftChange(event.target.value)}
            className={styles.searchInput}
            placeholder="Search by wallet address, Gravii ID, or persona"
          />
          <button type="button" className={styles.primaryButton} onClick={onExplorerSearch}>
            Search
          </button>
        </div>
      </Card>

      <Card
        key={explorerSearchTick}
        title={`Profile ${SAMPLE_EXPLORER_PROFILE.graviiId}`}
        className={cx(explorerSearchTick > 0 && styles.searchResultPulse)}
      >
        {!isExactMatch && explorerQuery.trim().length > 0 ? (
          <div className={styles.infoBanner}>
            No exact match in the sample dataset, so the prototype-style default example result is
            shown.
          </div>
        ) : null}

          <div className={styles.partnerHero}>
            <div>
              <p className={styles.monoText}>{SAMPLE_EXPLORER_PROFILE.walletAddress}</p>
              <div className={styles.heroTitleRow}>
                <h3 className={styles.partnerName}>Gravii ID {SAMPLE_EXPLORER_PROFILE.graviiId}</h3>
                <Badge tone="purple">{SAMPLE_EXPLORER_PROFILE.tier}</Badge>
                <Badge tone="green">{SAMPLE_EXPLORER_PROFILE.status}</Badge>
              </div>
            </div>
            <div className={styles.badgeRow}>
              {SAMPLE_EXPLORER_PROFILE.personas.map((persona) => (
                <Badge key={persona} tone={persona === "Diamond Hands" ? "hq" : "blue"}>
                  {persona}
                </Badge>
              ))}
            </div>
          </div>

          <StatGrid stats={SAMPLE_EXPLORER_PROFILE.facts} />

          <div className={styles.timeline}>
            {SAMPLE_EXPLORER_PROFILE.touchpoints.map((touchpoint) => (
              <div key={`${touchpoint.title}-${touchpoint.date}`} className={styles.timelineItem}>
                <div className={styles.timelineDot} data-tone={touchpoint.accent} />
                <div className={styles.timelineBody}>
                  <div className={styles.timelineHeader}>
                    <div>
                      <strong>{touchpoint.title}</strong>
                      <Badge tone={touchpoint.accent}>{touchpoint.stepLabel}</Badge>
                    </div>
                    <span className={styles.timelineDate}>{touchpoint.date}</span>
                  </div>
                  <p>{touchpoint.note}</p>
                </div>
              </div>
            ))}
          </div>
      </Card>
    </div>
  );
}

function AcquisitionSourceSection() {
  const [tierFilters, setTierFilters] = useState<string[]>([]);
  const [chainFilters, setChainFilters] = useState<string[]>([]);
  const filteredRows = filterTextRows(SOURCE_QUALITY_ROWS, [tierFilters, chainFilters]);

  return (
    <div className={styles.stack}>
      <div className={styles.filterBar}>
        <FilterToggleGroup
          label="Tier"
          options={["Gold+ Only", "Platinum+", "Black"]}
          values={tierFilters}
          onToggle={(value) =>
            setTierFilters((current) =>
              current.includes(value)
                ? current.filter((item) => item !== value)
                : [...current, value]
            )
          }
        />
        <FilterToggleGroup
          label="Chain"
          options={["ETH", "ARB", "BASE", "POLY"]}
          values={chainFilters}
          onToggle={(value) =>
            setChainFilters((current) =>
              current.includes(value)
                ? current.filter((item) => item !== value)
                : [...current, value]
            )
          }
        />
        <button
          type="button"
          className={styles.filterReset}
          onClick={() => {
            setTierFilters([]);
            setChainFilters([]);
          }}
        >
          Reset
        </button>
      </div>

      <StatGrid stats={ACQUISITION_SOURCE_STATS} />

      <Card title="Source Quality Comparison (7d New Users)">
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Source</th>
                <th>New IDs</th>
                <th>Gold+ %</th>
                <th>Sybil %</th>
                <th>30d Retention</th>
                <th>Avg Value</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell) => (
                    <td key={`${row[0]}-${cell}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredRows.length === 0 ? (
          <EmptyState
            title="No rows match the current source filters"
            description="This mirrors the original prototype behavior where filter text matching could reduce the table to zero rows."
          />
        ) : null}
        <div className={styles.infoBanner}>
          Highest quality source: Referral. Lowest volume, but strongest Gold+ rate, retention, and
          per-user value.
        </div>
      </Card>

      <Card title="Source Mix Trend (12 Weeks)">
        <SourceTrendChart />
        <div className={styles.legendGrid}>
          {[
            ["Partner Drive", "teal"],
            ["Campaign", "blue"],
            ["Organic", "purple"],
            ["Bot", "amber"],
            ["Referral", "hq"]
          ].map(([label, tone]) => (
            <div key={label} className={styles.legendRow}>
              <span className={styles.legendSwatch} data-tone={tone} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function AcquisitionAttributionSection() {
  return (
    <div className={styles.stack}>
      <div className={styles.gridTwo}>
        <Card title="Primary Model — First-Touch">
          <p className={styles.bodyText}>
            Attributes each user to the first channel that brought them into Gravii. This is the
            operating lens for net-new ecosystem growth.
          </p>
          <div className={styles.infoBanner}>
            Example: organic signup first, then partner campaign later. First-touch remains Organic.
          </div>
        </Card>
        <Card title="Recorded Model — Any-Touch">
          <p className={styles.bodyText}>
            Records every touchpoint in the journey so partner teams can see influence on existing
            users, not just acquisition.
          </p>
          <div className={styles.infoBanner}>
            Example: Organic → Partner X Campaign → Partner Y Drive. All three remain queryable in
            the explorer.
          </div>
        </Card>
      </div>

      <Card title="First-Touch Attribution — Who Brought Users In">
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Source</th>
                <th>Total Users</th>
                <th>Gold+ Rate</th>
                <th>Avg Value</th>
                <th>Trend (30d)</th>
              </tr>
            </thead>
            <tbody>
              {ATTRIBUTION_FIRST_TOUCH_ROWS.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell) => (
                    <td key={`${row[0]}-${cell}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="First-Touch vs Any-Touch — Partner Attribution">
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Partner</th>
                <th>As 1st Touch</th>
                <th>As Any Touch</th>
                <th>Ratio</th>
                <th>Insight</th>
              </tr>
            </thead>
            <tbody>
              {PARTNER_ATTRIBUTION_ROWS.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell) => (
                    <td key={`${row[0]}-${cell}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.infoBanner}>
          Ratios above 2.0x usually signal a partner is reclaiming existing users more often than it
          is bringing net-new growth.
        </div>
      </Card>
    </div>
  );
}

function AcquisitionFunnelSection() {
  return (
    <div className={styles.stack}>
      <Card title="Acquisition Funnel (Last 30d)">
        <div className={styles.funnel}>
          {FUNNEL_STAGES.map((stage, index) => (
            <div key={stage.label}>
              <div className={styles.funnelStage} data-tone={stage.accent}>
                <div>
                  <strong>{stage.label}</strong>
                  <p>{stage.note}</p>
                </div>
                <div className={styles.funnelMetric}>
                  <strong>{stage.value}</strong>
                  <span>{stage.percentage}</span>
                </div>
              </div>
              {index < FUNNEL_STAGES.length - 1 ? <div className={styles.funnelConnector} /> : null}
            </div>
          ))}
        </div>
      </Card>

      <Card title="Funnel Conversion by Source">
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Source</th>
                <th>Visits→ID</th>
                <th>ID→Campaign</th>
                <th>ID→Retained</th>
                <th>Best Stage</th>
              </tr>
            </thead>
            <tbody>
              {FUNNEL_ROWS.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell) => (
                    <td key={`${row[0]}-${cell}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function PartnerListSection({
  filteredPartners,
  partnerSearch,
  partnerStatusFilters,
  partnerPlanFilters,
  partnerProductFilters,
  onPartnerSearchChange,
  onTogglePartnerStatus,
  onTogglePartnerPlan,
  onTogglePartnerProduct,
  onResetPartnerFilters,
  onOpenPartnerDetail
}: Readonly<
  Pick<
    DashboardSectionViewProps,
    | "filteredPartners"
    | "partnerSearch"
    | "partnerStatusFilters"
    | "partnerPlanFilters"
    | "partnerProductFilters"
    | "onPartnerSearchChange"
    | "onTogglePartnerStatus"
    | "onTogglePartnerPlan"
    | "onTogglePartnerProduct"
    | "onResetPartnerFilters"
    | "onOpenPartnerDetail"
  >
>) {
  const summary = buildPartnerSummary(filteredPartners);
  const stats: DashboardStat[] = [
    {
      label: "Matching Partners",
      value: formatNumber(summary.total),
      accent: "hq",
      supportingText: "Current working set"
    },
    {
      label: "Active",
      value: formatNumber(summary.active),
      accent: "green",
      supportingText: "Healthy accounts"
    },
    {
      label: "Flagged",
      value: formatNumber(summary.flagged),
      accent: "red",
      supportingText: "Requires review"
    },
    {
      label: "Multi-Product",
      value: formatNumber(summary.multiProduct),
      accent: "blue",
      supportingText: "Using 2+ product lines"
    },
    {
      label: "Visible Revenue",
      value: formatCurrency(summary.totalRevenue),
      accent: "teal",
      supportingText: "Revenue represented in sample"
    }
  ];

  return (
    <div className={styles.stack}>
      <Card title="Partner Search">
        <div className={styles.searchRow}>
          <input
            className={styles.searchInput}
            value={partnerSearch}
            onChange={(event) => onPartnerSearchChange(event.target.value)}
            placeholder="Search partners"
          />
        </div>
      </Card>

      <div className={styles.filterBar}>
        <FilterToggleGroup
          label="Status"
          options={PARTNER_FILTERS.status}
          values={partnerStatusFilters}
          onToggle={onTogglePartnerStatus}
        />
        <FilterToggleGroup
          label="Plan"
          options={PARTNER_FILTERS.plan}
          values={partnerPlanFilters}
          onToggle={onTogglePartnerPlan}
        />
        <FilterToggleGroup
          label="Product"
          options={PARTNER_FILTERS.product}
          values={partnerProductFilters}
          onToggle={onTogglePartnerProduct}
        />
        <button type="button" className={styles.filterReset} onClick={onResetPartnerFilters}>
          Reset
        </button>
      </div>

      <StatGrid stats={stats} />

      <Card title="All Partners">
        {filteredPartners.length === 0 ? (
          <EmptyState
            title="No partners match the current filter set"
            description="Clear a few filters or broaden the search term to see more accounts."
          />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Partner</th>
                  <th>Status</th>
                  <th>Plan</th>
                  <th>Products</th>
                  <th>1st Touch</th>
                  <th>Gold+</th>
                  <th>Sybil</th>
                  <th>Revenue</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filteredPartners.map((partner) => (
                  <tr
                    key={partner.name}
                    className={styles.clickableRow}
                    onClick={() => onOpenPartnerDetail(partner.name)}
                  >
                    <td>{partner.name}</td>
                    <td>
                      <Badge
                        tone={
                          partner.status === "Active"
                            ? "green"
                            : partner.status === "Review"
                              ? "amber"
                              : "red"
                        }
                      >
                        {partner.status}
                      </Badge>
                    </td>
                    <td>{partner.plan}</td>
                    <td>
                      <div className={styles.badgeRow}>
                        {getProductBadges(partner.products).map((product) => (
                          <Badge
                            key={`${partner.name}-${product}`}
                            tone={
                              product === "Reach" ? "teal" : product === "Gate" ? "blue" : "purple"
                            }
                          >
                            {product}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td>{formatNumber(partner.users1st)}</td>
                    <td>{partner.goldRate}%</td>
                    <td>{partner.sybilRate}%</td>
                    <td>{formatCurrency(partner.revenue)}</td>
                    <td>
                      <button
                        type="button"
                        className={styles.secondaryButton}
                        onClick={(event) => {
                          event.stopPropagation();
                          onOpenPartnerDetail(partner.name);
                        }}
                      >
                        Open
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className={styles.inlineNote}>
          Search, filter, and drill-down behavior is now separated from view markup so it can be
          wired to real APIs later without rewriting the interface.
        </p>
      </Card>
    </div>
  );
}

function PartnerPerformanceSection() {
  const partners = getRevenueLeaders();
  const multiProduct = partners.filter((partner) => partner.products.length >= 2).length;
  const reachOnly = partners.filter((partner) => partner.products.join(",") === "R").length;
  const gateOnly = partners.filter((partner) => partner.products.join(",") === "G").length;
  const lensOnly = partners.filter((partner) => partner.products.join(",") === "L").length;
  const totalRevenue = partners.reduce((sum, partner) => sum + partner.revenue, 0);

  return (
    <div className={styles.stack}>
      <Card title="Partner Performance Scorecard">
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Partner</th>
                <th>Drive (1st Touch)</th>
                <th>Drive (Any Touch)</th>
                <th>Gold+ Rate</th>
                <th>Sybil Rate</th>
                <th>Campaigns</th>
                <th>Avg CPA</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((partner) => (
                <tr key={partner.name}>
                  <td>{partner.name}</td>
                  <td>{formatNumber(partner.users1st)}</td>
                  <td>{formatNumber(partner.usersAny)}</td>
                  <td>{partner.goldRate}%</td>
                  <td>{partner.sybilRate}%</td>
                  <td>{partner.campaigns}</td>
                  <td>{partner.avgCpa > 0 ? `$${partner.avgCpa.toFixed(2)}` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className={styles.gridTwo}>
        <Card title="Revenue by Partner (Visible Sample)">
          <BarList
            bars={partners.map((partner, index) => ({
              label: partner.name,
              valueLabel: formatCurrency(partner.revenue),
              percentage: partners[0] ? (partner.revenue / partners[0].revenue) * 100 : 0,
              accent:
                index < 2 ? "green" : index < 4 ? "teal" : partner.revenue > 0 ? "blue" : "neutral"
            }))}
          />
          <div className={styles.infoBanner}>Visible sample MRR: {formatCurrency(totalRevenue)}</div>
        </Card>

        <Card title="Product Adoption in Sample">
          <div className={styles.revenueSplit}>
            <article className={styles.metricPanel} data-tone="teal">
              <span className={styles.mutedLabel}>Reach Only</span>
              <strong>{reachOnly}</strong>
              <span>Campaign-only partners</span>
            </article>
            <article className={styles.metricPanel} data-tone="blue">
              <span className={styles.mutedLabel}>Gate Only</span>
              <strong>{gateOnly}</strong>
              <span>API verification only</span>
            </article>
            <article className={styles.metricPanel} data-tone="purple">
              <span className={styles.mutedLabel}>Lens Only</span>
              <strong>{lensOnly}</strong>
              <span>Report-only partners</span>
            </article>
            <article className={styles.metricPanel} data-tone="hq">
              <span className={styles.mutedLabel}>Multi-Product</span>
              <strong>{multiProduct}</strong>
              <span>2+ products active</span>
            </article>
          </div>
        </Card>
      </div>
    </div>
  );
}

function PartnerDetailSection({
  selectedPartner,
  onNavigate
}: Readonly<Pick<DashboardSectionViewProps, "selectedPartner" | "onNavigate">>) {
  const stats: DashboardStat[] = [
    {
      label: "1st Touch Users",
      value: formatNumber(selectedPartner.users1st),
      accent: "teal",
      supportingText: "Primary acquisition attribution"
    },
    {
      label: "Any Touch Users",
      value: formatNumber(selectedPartner.usersAny),
      accent: "blue",
      supportingText: "All influenced users"
    },
    {
      label: "Gold+ Rate",
      value: `${selectedPartner.goldRate}%`,
      accent: "green",
      supportingText: "Quality mix"
    },
    {
      label: "Sybil Rate",
      value: `${selectedPartner.sybilRate}%`,
      accent: selectedPartner.sybilRate >= 15 ? "red" : selectedPartner.sybilRate >= 10 ? "amber" : "green",
      supportingText: "Fraud and risk exposure"
    },
    {
      label: "Live Campaigns",
      value: String(selectedPartner.liveCampaigns),
      accent: "purple",
      supportingText: `${selectedPartner.campaigns} total`
    },
    {
      label: "Revenue",
      value: formatCurrency(selectedPartner.revenue),
      accent: "hq",
      supportingText: "Current visible MRR"
    }
  ];

  const tierBars = [
    { label: "Black", valueLabel: `${selectedPartner.tierDist.black}%`, percentage: selectedPartner.tierDist.black, accent: "purple" as const },
    { label: "Platinum", valueLabel: `${selectedPartner.tierDist.platinum}%`, percentage: selectedPartner.tierDist.platinum, accent: "amber" as const },
    { label: "Gold", valueLabel: `${selectedPartner.tierDist.gold}%`, percentage: selectedPartner.tierDist.gold, accent: "hq" as const },
    { label: "Classic", valueLabel: `${selectedPartner.tierDist.classic}%`, percentage: selectedPartner.tierDist.classic, accent: "neutral" as const }
  ];

  const driveBars = [
    { label: "X-RAY", valueLabel: `${selectedPartner.driveSources.xray}%`, percentage: selectedPartner.driveSources.xray, accent: "blue" as const },
    { label: "Campaign", valueLabel: `${selectedPartner.driveSources.campaign}%`, percentage: selectedPartner.driveSources.campaign, accent: "teal" as const },
    { label: "Bot", valueLabel: `${selectedPartner.driveSources.bot}%`, percentage: selectedPartner.driveSources.bot, accent: "purple" as const },
    { label: "Agent", valueLabel: `${selectedPartner.driveSources.agent}%`, percentage: selectedPartner.driveSources.agent, accent: "hq" as const }
  ];

  return (
    <div className={styles.stack}>
      <button type="button" className={styles.secondaryButton} onClick={() => onNavigate("partner-list")}>
        ← Back to List
      </button>

      <Card title="Partner Snapshot">
        <div className={styles.partnerHero}>
          <div>
            <div className={styles.heroTitleRow}>
              <h3 className={styles.partnerName}>{selectedPartner.name}</h3>
              <Badge
                tone={
                  selectedPartner.status === "Active"
                    ? "green"
                    : selectedPartner.status === "Review"
                      ? "amber"
                      : "red"
                }
              >
                {selectedPartner.status}
              </Badge>
              <Badge tone="hq">{selectedPartner.plan}</Badge>
            </div>
            <div className={styles.badgeRow}>
              {selectedPartner.products.map((product) => (
                <Badge
                  key={`${selectedPartner.name}-${product}`}
                  tone={product === "R" ? "teal" : product === "G" ? "blue" : "purple"}
                >
                  {PRODUCT_LABELS[product]}
                </Badge>
              ))}
            </div>
          </div>

          <div className={styles.partnerMeta}>
            <span>Joined {selectedPartner.joined}</span>
            <span>Last active {selectedPartner.lastActive}</span>
          </div>
        </div>
      </Card>

      <StatGrid stats={stats} />

      <div className={styles.gridTwo}>
        <Card title="User Pool — Tier Distribution">
          <BarList bars={tierBars} />
        </Card>
        <Card title="Drive Source Breakdown">
          <BarList bars={driveBars} />
        </Card>
      </div>

      <div className={styles.gridTwo}>
        <Card title="Campaigns">
          {selectedPartner.campaignList.length === 0 ? (
            <EmptyState
              title="No campaigns in the visible sample"
              description="This account currently contributes through non-campaign channels or is still in setup."
            />
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Campaign</th>
                    <th>Scope</th>
                    <th>Engaged</th>
                    <th>New IDs</th>
                    <th>CPA</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPartner.campaignList.map((campaign) => (
                    <tr key={campaign.name}>
                      <td>{campaign.name}</td>
                      <td>{campaign.scope}</td>
                      <td>{formatNumber(campaign.engaged)}</td>
                      <td>{formatNumber(campaign.newIds)}</td>
                      <td>${campaign.cpa.toFixed(2)}</td>
                      <td>{campaign.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card title="Gate API Usage (30d)">
          <div className={styles.revenueSplit}>
            <article className={styles.metricPanel} data-tone="blue">
              <span className={styles.mutedLabel}>API Queries</span>
              <strong>{formatNumber(selectedPartner.apiQueries)}</strong>
              <span>30d sample volume</span>
            </article>
            <article className={styles.metricPanel} data-tone="green">
              <span className={styles.mutedLabel}>Avg Latency</span>
              <strong>{selectedPartner.apiLatency > 0 ? `${selectedPartner.apiLatency}ms` : "—"}</strong>
              <span>Verification path latency</span>
            </article>
            <article className={styles.metricPanel} data-tone="amber">
              <span className={styles.mutedLabel}>Error Rate</span>
              <strong>{selectedPartner.apiErrorRate > 0 ? `${selectedPartner.apiErrorRate}%` : "—"}</strong>
              <span>Surface errors over requests</span>
            </article>
            <article className={styles.metricPanel} data-tone="hq">
              <span className={styles.mutedLabel}>Plan Limit</span>
              <strong>{selectedPartner.apiPlanLimit}</strong>
              <span>Commercial limit</span>
            </article>
          </div>

          {selectedPartner.lensReports.length > 0 ? (
            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>Recent Lens Reports</h3>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Report</th>
                      <th>Wallets</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPartner.lensReports.map((report) => (
                      <tr key={report.name}>
                        <td>{report.name}</td>
                        <td>{formatNumber(report.wallets)}</td>
                        <td>{report.date}</td>
                        <td>{report.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </Card>
      </div>

      <Card title="Revenue History">
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Month</th>
                <th>Gate</th>
                <th>Reach</th>
                <th>Lens</th>
                <th>Total</th>
                <th>Change</th>
              </tr>
            </thead>
            <tbody>
              {selectedPartner.revenueHistory.map((point) => (
                <tr key={point.month}>
                  <td>{point.month}</td>
                  <td>{formatCurrency(point.gate)}</td>
                  <td>{formatCurrency(point.reach)}</td>
                  <td>{formatCurrency(point.lens)}</td>
                  <td>{formatCurrency(point.total)}</td>
                  <td>{point.change}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function CampaignSection({
  filteredCampaigns,
  campaignStatusFilters,
  campaignScopeFilters,
  campaignPartnerFilters,
  onToggleCampaignStatus,
  onToggleCampaignScope,
  onToggleCampaignPartner,
  onResetCampaignFilters
}: Readonly<
  Pick<
    DashboardSectionViewProps,
    | "filteredCampaigns"
    | "campaignStatusFilters"
    | "campaignScopeFilters"
    | "campaignPartnerFilters"
    | "onToggleCampaignStatus"
    | "onToggleCampaignScope"
    | "onToggleCampaignPartner"
    | "onResetCampaignFilters"
  >
>) {
  const summary = buildCampaignSummary(filteredCampaigns);
  const stats: DashboardStat[] = [
    {
      label: "Live",
      value: formatNumber(summary.live),
      accent: "green",
      supportingText: `${filteredCampaigns.length} total matching`
    },
    {
      label: "Total Engaged",
      value: formatNumber(summary.totalEngaged),
      accent: "teal",
      supportingText: "Across filtered campaigns"
    },
    {
      label: "New IDs",
      value: formatNumber(summary.totalNewIds),
      accent: "blue",
      supportingText: "First entered through Reach"
    },
    {
      label: "Avg CPA",
      value: `$${summary.avgCpa.toFixed(2)}`,
      accent: "hq",
      supportingText: "Lower is better"
    },
    {
      label: "Total Cost",
      value: formatCurrency(summary.totalCost),
      accent: "green",
      supportingText: "Across filtered campaigns"
    }
  ];

  return (
    <div className={styles.stack}>
      <div className={styles.filterBar}>
        <FilterToggleGroup
          label="Status"
          options={CAMPAIGN_FILTERS.status}
          values={campaignStatusFilters}
          onToggle={onToggleCampaignStatus}
        />
        <FilterToggleGroup
          label="Scope"
          options={CAMPAIGN_FILTERS.scope}
          values={campaignScopeFilters}
          onToggle={onToggleCampaignScope}
        />
        <FilterToggleGroup
          label="Partner"
          options={CAMPAIGN_FILTERS.partner}
          values={campaignPartnerFilters}
          onToggle={onToggleCampaignPartner}
        />
        <button type="button" className={styles.filterReset} onClick={onResetCampaignFilters}>
          Reset
        </button>
      </div>

      <StatGrid stats={stats} />

      <Card title="Campaign List">
        {filteredCampaigns.length === 0 ? (
          <EmptyState
            title="No campaigns match the selected filters"
            description="Clear a few chips to restore the visible sample."
          />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Partner</th>
                  <th>Scope</th>
                  <th>Engaged</th>
                  <th>New IDs</th>
                  <th>Cost</th>
                  <th>CPA</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((campaign) => (
                  <tr key={`${campaign.partner}-${campaign.name}`}>
                    <td>{campaign.name}</td>
                    <td>{campaign.partner}</td>
                    <td>{campaign.scope}</td>
                    <td>{formatNumber(campaign.engaged)}</td>
                    <td>{formatNumber(campaign.newIds)}</td>
                    <td>{formatCurrency(campaign.cost)}</td>
                    <td>${campaign.cpa.toFixed(2)}</td>
                    <td>{campaign.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className={styles.inlineNote}>
          Showing {filteredCampaigns.length} campaigns from the typed working set with React-based
          filtering instead of string-matching DOM hacks.
        </p>
      </Card>

      <div className={styles.gridTwo}>
        <Card title="Effectiveness by Scope">
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Scope</th>
                  <th>Campaigns</th>
                  <th>Avg Engaged</th>
                  <th>Avg CPA</th>
                  <th>Sybil Rate</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Users", "6", "1,840", "$0.32", "3.2%"],
                  ["Both", "8", "2,640", "$0.42", "6.8%"],
                  ["Gravii Pool", "4", "3,210", "$0.56", "11.2%"]
                ].map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell) => (
                      <td key={`${row[0]}-${cell}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={styles.inlineNote}>
            Users scope keeps CPA lowest. Gravii Pool scope trades cost for reach.
          </p>
        </Card>

        <Card title="Effectiveness by Tier Targeting">
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Target Tier</th>
                  <th>Campaigns</th>
                  <th>Avg Engagement</th>
                  <th>Avg CPA</th>
                  <th>Retention After</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Black", "3", "62%", "$0.24", "88%"],
                  ["Platinum+", "6", "48%", "$0.31", "76%"],
                  ["Gold+", "8", "36%", "$0.42", "68%"],
                  ["Classic (all)", "4", "22%", "$0.83", "42%"]
                ].map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell) => (
                      <td key={`${row[0]}-${cell}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

function RiskSybilSection() {
  const [severityFilters, setSeverityFilters] = useState<string[]>([]);
  const [partnerFilters, setPartnerFilters] = useState<string[]>([]);
  const filteredRows = filterTextRows(RISK_SYBIL_PARTNERS, [severityFilters, partnerFilters]);

  return (
    <div className={styles.stack}>
      <div className={styles.filterBar}>
        <FilterToggleGroup
          label="Severity"
          options={["Critical", "Suspect", "Clean"]}
          values={severityFilters}
          onToggle={(value) =>
            setSeverityFilters((current) =>
              current.includes(value)
                ? current.filter((item) => item !== value)
                : [...current, value]
            )
          }
        />
        <FilterToggleGroup
          label="Partner"
          options={["Orbital Labs", "MetaBridge", "ChainVault", "Nexus"]}
          values={partnerFilters}
          onToggle={(value) =>
            setPartnerFilters((current) =>
              current.includes(value)
                ? current.filter((item) => item !== value)
                : [...current, value]
            )
          }
        />
        <button
          type="button"
          className={styles.filterReset}
          onClick={() => {
            setSeverityFilters([]);
            setPartnerFilters([]);
          }}
        >
          Reset
        </button>
      </div>

      <StatGrid stats={RISK_SYBIL_STATS} />

      <Card title="Sybil by Partner">
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Partner</th>
                <th>Flagged</th>
                <th>Rate</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell) => (
                    <td key={`${row[0]}-${cell}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredRows.length === 0 ? (
          <EmptyState
            title="No partner rows match the current sybil filters"
            description="The original prototype applied text-based filtering to table rows, including combinations that can intentionally hide every row."
          />
        ) : null}
      </Card>

      <Card title="Sybil Distribution by Chain">
        <BarList bars={RISK_CHAIN_DISTRIBUTION} />
      </Card>
    </div>
  );
}

function RiskHealthSection() {
  return (
    <div className={styles.stack}>
      <section className={styles.gradeHero}>
        <span className={styles.gradeLabel}>Growth Health</span>
        <strong className={styles.gradeValue}>A</strong>
        <p>Net growth MoM ≥10%, churn &lt;1%, and sources diversified</p>
      </section>

      <Card title="Grading Criteria">
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Grade</th>
                <th>Net Growth MoM</th>
                <th>Conditions</th>
              </tr>
            </thead>
            <tbody>
              {GROWTH_GRADE_ROWS.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell) => (
                    <td key={`${row[0]}-${cell}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <StatGrid stats={GROWTH_HEALTH_STATS} />

      <Card title="Growth Health Trend (12 Weeks)">
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Week</th>
                <th>Net Growth</th>
                <th>MoM Rate</th>
                <th>Churn</th>
                <th>Source Div.</th>
                <th>Gold+ Acq.</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {GROWTH_TREND_ROWS.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell) => (
                    <td key={`${row[0]}-${cell}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className={styles.gridThree}>
        {PRODUCT_CONTRIBUTIONS.map((contribution) => (
          <Card key={contribution.label} title={contribution.label}>
            <div className={styles.contributionHero}>
              <strong>{contribution.headline}</strong>
              <span>{contribution.note}</span>
            </div>
            <div className={styles.factList}>
              {contribution.facts.map(([label, value]) => (
                <div key={`${contribution.label}-${label}`} className={styles.factRow}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card title="Net Pool Effect (30d)">
        <StatGrid stats={NET_POOL_EFFECT} />
      </Card>
    </div>
  );
}

export function DashboardSectionView(props: Readonly<DashboardSectionViewProps>) {
  switch (props.currentPage) {
    case "overview":
      return <OverviewSection selectedPeriod={props.selectedPeriod} onNavigate={props.onNavigate} />;
    case "pool-composition":
      return <PoolCompositionSection />;
    case "pool-cohort":
      return <PoolCohortSection />;
    case "pool-explorer":
      return (
        <PoolExplorerSection
          explorerQuery={props.explorerQuery}
          explorerQueryDraft={props.explorerQueryDraft}
          explorerSearchTick={props.explorerSearchTick}
          onExplorerQueryDraftChange={props.onExplorerQueryDraftChange}
          onExplorerSearch={props.onExplorerSearch}
        />
      );
    case "acq-source":
      return <AcquisitionSourceSection />;
    case "acq-attribution":
      return <AcquisitionAttributionSection />;
    case "acq-funnel":
      return <AcquisitionFunnelSection />;
    case "partner-list":
      return <PartnerListSection {...props} />;
    case "partner-perf":
      return <PartnerPerformanceSection />;
    case "partner-detail":
      return <PartnerDetailSection selectedPartner={props.selectedPartner} onNavigate={props.onNavigate} />;
    case "campaigns":
      return <CampaignSection {...props} />;
    case "risk-sybil":
      return <RiskSybilSection />;
    case "risk-health":
      return <RiskHealthSection />;
    default:
      return (
        <EmptyState
          title={PAGE_TITLES[props.currentPage]}
          description="This page has not been wired yet."
        />
      );
  }
}
