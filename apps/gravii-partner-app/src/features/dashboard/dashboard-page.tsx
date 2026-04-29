'use client'

import { ArrowUpRight } from 'lucide-react'
import { useMemo } from 'react'

import { PartnerDataStatus } from '@/components/ui/partner-data-status'
import { WorkspaceHandoffLink } from '@/components/ui/workspace-handoff-link'
import { usePartnerAuth } from '@/features/auth/auth-provider'
import {
  formatCompactCurrency,
  formatCurrency,
  formatNumber,
  formatPercent
} from '@/lib/format'
import { getPartnerWorkspaceName } from '@/lib/partner-profile'

import {
  getDashboardSnapshot,
  type AssetMixCardData,
  type ChainBreakdownItem
} from './data'
import styles from './dashboard-page.module.css'

function createConicGradient(segments: AssetMixCardData['segments']): string {
  let current = 0

  const stops = segments.map((segment) => {
    const start = current
    const end = current + segment.share
    current = end
    return `${segment.color} ${start}% ${end}%`
  })

  return `conic-gradient(${stops.join(', ')})`
}

function InfoTooltip({ body, title }: { body: string; title: string }) {
  return (
    <span className={styles.infoIcon}>
      ⓘ
      <span className={styles.infoTooltip}>
        <strong>{title}</strong> — {body}
      </span>
    </span>
  )
}

function AssetMixCard({ card }: { card: AssetMixCardData }) {
  const showAvailabilityTooltip = card.id.startsWith('available-')

  return (
    <article className={styles.card}>
      <div className={styles.cardTitle}>
        {card.title}
        {showAvailabilityTooltip ? (
          <InfoTooltip
            title="Available Assets"
            body="Assets held by your connected users without active deployment. Not staked, lent, or providing liquidity."
          />
        ) : null}
      </div>
      <div className={styles.donutWrapper}>
        <div className={styles.donutContainer}>
          <div
            className={styles.assetRing}
            style={{ backgroundImage: createConicGradient(card.segments) }}
            aria-hidden="true"
          />
          <div className={styles.donutCenter}>
            <div className={styles.donutCenterLabel}>Total</div>
            <div className={styles.donutCenterValue}>{formatCompactCurrency(card.total)}</div>
          </div>
        </div>
        <div className={styles.donutLegend}>
          {card.segments.map((segment) => (
            <div key={segment.label} className={styles.legendItem}>
              <span
                className={styles.legendDot}
                style={{ backgroundColor: segment.color }}
                aria-hidden="true"
              />
              <span>{segment.label}</span>
              <span className={styles.legendValue}>{formatPercent(segment.share)}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}

function ChainPanel({
  panel,
  title
}: {
  panel: ChainBreakdownItem[]
  title: string
}) {
  return (
    <section className={styles.card}>
      <div className={styles.cardTitle}>{title}</div>
      {panel.map((chain) => (
        <div key={chain.network} className={styles.barSection}>
          <div className={styles.barHeader}>
            <span className={`${styles.chainBadge} ${styles[`chainBadge${chain.tone}`]}`}>
              {chain.network}
            </span>
            <span className={styles.barMeta}>
              {formatNumber(chain.users)} users · {chain.share}%
            </span>
          </div>
          <div className={styles.barTrack}>
            {chain.segments.map((segment) => (
              <div
                key={`${chain.network}-${segment.label}`}
                className={styles.barSegment}
                style={{ width: `${segment.share}%`, background: segment.color }}
              >
                <span className={styles.barSegmentLabel}>{segment.label}</span>
              </div>
            ))}
          </div>
          <div className={styles.barLegend}>
            {chain.segments.map((segment) => (
              <span key={`${chain.network}-${segment.label}-legend`} className={styles.barLegendItem}>
                <span
                  className={styles.legendDot}
                  style={{ backgroundColor: segment.color }}
                  aria-hidden="true"
                />
                {segment.label} {segment.share}%
              </span>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

export function DashboardPage() {
  const auth = usePartnerAuth()
  const partnerName = getPartnerWorkspaceName(auth.session)
  const dashboardSnapshot = useMemo(
    () => getDashboardSnapshot(partnerName),
    [partnerName]
  )
  const snapshotLabel = dashboardSnapshot.snapshotLabel

  return (
    <div className={styles.page}>
      <div className={styles.mainHeader}>
        <h1 className={styles.mainTitle}>Gravii Dashboard</h1>
        <WorkspaceHandoffLink
          href="/reach"
          requiredPages={['campaigns']}
          className={`${styles.headerCta} button-primary`}
        >
          Create Campaign
        </WorkspaceHandoffLink>
      </div>
      <PartnerDataStatus surface="dashboard" />

      <div className={styles.sectionLead}>Your Connected Users — Asset Overview</div>

      <section className={styles.heroCard}>
        <div>
          <div className={styles.heroLabel}>Total Connected Users</div>
          <div className={styles.heroValue}>{formatNumber(dashboardSnapshot.totalConnectedUsers)}</div>
        </div>
        <div className={styles.heroGrowth}>
          <div>
            <div className={styles.heroGrowthLabel}>Last 24h</div>
            <div className={styles.heroGrowthValue}>+{formatNumber(dashboardSnapshot.userGrowth.daily)}</div>
          </div>
          <div>
            <div className={styles.heroGrowthLabel}>Last 7d</div>
            <div className={styles.heroGrowthValue}>+{formatNumber(dashboardSnapshot.userGrowth.weekly)}</div>
          </div>
          <div>
            <div className={styles.heroGrowthLabel}>Last 30d</div>
            <div className={styles.heroGrowthValue}>+{formatNumber(dashboardSnapshot.userGrowth.monthly)}</div>
          </div>
        </div>
        <div className={styles.heroSnapshot}>{snapshotLabel}</div>
      </section>

      <section className={styles.grid4}>
        {dashboardSnapshot.assetMixCards.map((card) => (
          <AssetMixCard key={card.id} card={card} />
        ))}
      </section>

      <section className={styles.grid2Half}>
        <ChainPanel title="Deployed by Chain — Top 3" panel={dashboardSnapshot.chainPanels[0].cards} />
        <ChainPanel title="Available by Chain — Top 3" panel={dashboardSnapshot.chainPanels[1].cards} />
      </section>

      <section className={styles.card}>
        <div className={styles.cardTitle}>
          Users by Region — Top 10 Countries
          <InfoTooltip
            title="IP Geolocation"
            body="Region is estimated based on IP address at the time of wallet connection. Does not guarantee user nationality or residence."
          />
        </div>
        <div className={styles.regionBars}>
          {[
            ...dashboardSnapshot.regionDistribution,
            { code: 'Others', users: 28596, share: 9.5, color: 'rgba(255,255,255,0.15)' }
          ].map((region) => (
            <div key={region.code} className={styles.regionRow}>
              <span className={styles.regionCode}>{region.code}</span>
              <div className={styles.regionTrack}>
                <div
                  className={styles.regionFill}
                  style={{ width: `${region.share}%`, background: region.color }}
                >
                  <span>{formatPercent(region.share)}</span>
                </div>
              </div>
              <span className={styles.regionUsers}>{formatNumber(region.users)}</span>
            </div>
          ))}
        </div>
      </section>

      <div className={styles.analyticsLinkRow}>
        <WorkspaceHandoffLink
          href="/analytics"
          requiredPages={['analytics']}
          className={styles.analyticsLink}
        >
          Want deeper insights? → Go to User Analytics
        </WorkspaceHandoffLink>
      </div>

      <section className={styles.grid4}>
        {dashboardSnapshot.commercialKpis.map((kpi) => (
          <article key={kpi.label} className={styles.card}>
            <div className={styles.cardTitle}>
              {kpi.labelLines?.map((line) => (
                <span key={line} className={styles.cardTitleLine}>
                  {line}
                </span>
              )) ?? kpi.label}
            </div>
            <div className={styles.kpiValue}>{kpi.value}</div>
          </article>
        ))}
      </section>

      <section className={styles.grid4}>
        {dashboardSnapshot.activationKpis.map((kpi) => (
          <article key={kpi.label} className={styles.card}>
            <div className={styles.cardTitle}>{kpi.label}</div>
            <div className={styles.kpiValue}>{kpi.value}</div>
          </article>
        ))}
      </section>

      <section className={styles.grid4}>
        <article className={styles.card}>
          <div className={styles.cardTitle}>Top 3 Interacted Protocols</div>
          <div className={styles.kpiTags}>
            {dashboardSnapshot.insights.topProtocols.map((item) => (
              <span key={item} className={styles.kpiTag}>
                {item}
              </span>
            ))}
          </div>
        </article>
        <article className={styles.card}>
          <div className={styles.cardTitle}>Top 3 Funding Sources</div>
          <div className={styles.kpiTags}>
            {dashboardSnapshot.insights.topFundingSources.map((item) => (
              <span key={item} className={styles.kpiTag}>
                {item}
              </span>
            ))}
          </div>
        </article>
        <article className={styles.card}>
          <div className={styles.cardTitle}>Net NFT Worth (Total)</div>
          <div className={styles.kpiValue}>{formatCurrency(dashboardSnapshot.insights.nftWorth)}</div>
        </article>
        <article className={styles.card}>
          <div className={styles.cardTitle}>Sybil rate</div>
          <div className={styles.kpiValue}>{dashboardSnapshot.insights.sybilRate}%</div>
        </article>
      </section>
    </div>
  )
}
