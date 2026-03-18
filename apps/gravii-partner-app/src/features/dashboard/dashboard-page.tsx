import { ArrowUpRight, ShieldAlert } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { WorkspaceHandoffLink } from '@/components/ui/workspace-handoff-link'
import { formatCompactCurrency, formatCurrency, formatNumber, formatPercent } from '@/lib/format'

import { dashboardSnapshot, type AssetMixCardData, type ChainBreakdownItem } from './data'
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

function AssetMixCard({ card }: { card: AssetMixCardData }) {
  return (
    <Card title={card.title} className={styles.assetCard}>
      <div className={styles.assetBody}>
        <div className={styles.ringWrap}>
          <div
            className={styles.assetRing}
            style={{ backgroundImage: createConicGradient(card.segments) }}
            aria-hidden="true"
          />
          <div className={styles.assetCenter}>
            <span className="eyebrow-label">Total</span>
            <strong>{formatCompactCurrency(card.total)}</strong>
          </div>
        </div>
        <p className={styles.assetHelper}>{card.helper}</p>
        <div className={styles.legend}>
          {card.segments.map((segment) => (
            <div key={segment.label} className={styles.legendItem}>
              <span
                className={styles.legendDot}
                style={{ backgroundColor: segment.color }}
                aria-hidden="true"
              />
              <span>{segment.label}</span>
              <strong>{formatPercent(segment.share)}</strong>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

function ChainPanel({ title, cards }: { title: string; cards: ChainBreakdownItem[] }) {
  return (
    <Card title={title} accent="blue">
      <div className={styles.chainList}>
        {cards.map((chain) => (
          <div key={chain.network} className={styles.chainRow}>
            <div className={styles.chainHeader}>
              <div className={styles.chainMeta}>
                <span className={`${styles.chainBadge} ${styles[`chainBadge${chain.tone}`]}`}>
                  {chain.network}
                </span>
                <span className={styles.chainUsers}>
                  {formatNumber(chain.users)} users · {chain.share}%
                </span>
              </div>
            </div>
            <div className={styles.segmentTrack} aria-hidden="true">
              {chain.segments.map((segment) => (
                <span
                  key={`${chain.network}-${segment.label}`}
                  className={styles.segmentFill}
                  style={{ width: `${segment.share}%`, backgroundColor: segment.color }}
                />
              ))}
            </div>
            <div className={styles.segmentLegend}>
              {chain.segments.map((segment) => (
                <span key={`${chain.network}-${segment.label}-legend`} className={styles.segmentText}>
                  {segment.label} {segment.share}%
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export function DashboardPage() {
  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow="Partner Intelligence"
        title="Your connected user base, shaped into product-ready insights."
        description="The old prototype packed everything into one page. This refactor turns it into a route-based workspace with reusable analytics blocks that can be replaced by live APIs later."
        actions={
          <div className={styles.headerActions}>
            <WorkspaceHandoffLink
              href="/analytics"
              requiredPages={['analytics']}
              className="button-secondary"
            >
              Go to User Analytics
            </WorkspaceHandoffLink>
            <WorkspaceHandoffLink
              href="/reach"
              requiredPages={['campaigns']}
              className="button-primary"
            >
              Launch a campaign
              <ArrowUpRight size={16} />
            </WorkspaceHandoffLink>
          </div>
        }
      />

      <Card accent="teal" className={styles.heroCard}>
        <div className={styles.heroMeta}>
          <div>
            <p className="eyebrow-label">Total connected users</p>
            <p className="stat-value">{formatNumber(dashboardSnapshot.totalConnectedUsers)}</p>
          </div>
          <div className={styles.heroGrowth}>
            <div>
              <span>Last 24h</span>
              <strong>+{formatNumber(dashboardSnapshot.userGrowth.daily)}</strong>
            </div>
            <div>
              <span>Last 7d</span>
              <strong>+{formatNumber(dashboardSnapshot.userGrowth.weekly)}</strong>
            </div>
            <div>
              <span>Last 30d</span>
              <strong>+{formatNumber(dashboardSnapshot.userGrowth.monthly)}</strong>
            </div>
          </div>
          <p className={styles.snapshot}>{dashboardSnapshot.snapshotLabel}</p>
        </div>
      </Card>

      <section className="grid-auto-4">
        {dashboardSnapshot.assetMixCards.map((card) => (
          <AssetMixCard key={card.id} card={card} />
        ))}
      </section>

      <section className="grid-auto-2">
        {dashboardSnapshot.chainPanels.map((panel) => (
          <ChainPanel key={panel.title} title={panel.title} cards={panel.cards} />
        ))}
      </section>

      <section className="grid-auto-2">
        <Card
          title="Users by region"
          eyebrow="Geo mix"
          action={<span className="pill">IP-estimated only</span>}
        >
          <div className={styles.regionList}>
            {dashboardSnapshot.regionDistribution.map((region) => (
              <div key={region.code} className={styles.regionRow}>
                <div className={styles.regionLabel}>
                  <strong>{region.code}</strong>
                  <span>{formatNumber(region.users)} users</span>
                </div>
                <div className={styles.regionBar}>
                  <span
                    className={styles.regionFill}
                    style={{ width: `${region.share}%`, backgroundColor: region.color }}
                  />
                </div>
                <span className={styles.regionShare}>{formatPercent(region.share)}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Risk & activation priorities" eyebrow="Ops brief" accent="rose">
          <div className={styles.riskList}>
            {dashboardSnapshot.riskAlerts.map((alert) => (
              <article key={alert.cluster} className={styles.riskCard}>
                <div className={styles.riskHeader}>
                  <div>
                    <p className={styles.riskSeverity}>{alert.severity}</p>
                    <h3>{alert.cluster}</h3>
                  </div>
                  <ShieldAlert size={18} />
                </div>
                <p>{alert.summary}</p>
                <strong>{formatNumber(alert.wallets)} wallets</strong>
              </article>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid-auto-4">
        {dashboardSnapshot.commercialKpis.map((kpi) => (
          <Card key={kpi.label} title={kpi.label}>
            <p className={styles.kpiValue}>{kpi.value}</p>
            <p className={styles.kpiHelper}>{kpi.helper}</p>
          </Card>
        ))}
      </section>

      <section className="grid-auto-4">
        {dashboardSnapshot.activationKpis.map((kpi) => (
          <Card key={kpi.label} title={kpi.label}>
            <p className={styles.kpiValue}>{kpi.value}</p>
            <p className={styles.kpiHelper}>{kpi.helper}</p>
          </Card>
        ))}
      </section>

      <section className="grid-auto-4">
        <Card title="Top interacted protocols">
          <div className={styles.tagRow}>
            {dashboardSnapshot.insights.topProtocols.map((item) => (
              <span key={item} className="pill">
                {item}
              </span>
            ))}
          </div>
        </Card>
        <Card title="Top funding sources">
          <div className={styles.tagRow}>
            {dashboardSnapshot.insights.topFundingSources.map((item) => (
              <span key={item} className="pill">
                {item}
              </span>
            ))}
          </div>
        </Card>
        <Card title="Net NFT worth">
          <p className={styles.kpiValue}>{formatCurrency(dashboardSnapshot.insights.nftWorth)}</p>
          <p className={styles.kpiHelper}>Premium-collector users available for higher-end perks</p>
        </Card>
        <Card title="Sybil rate">
          <p className={styles.kpiValue}>{dashboardSnapshot.insights.sybilRate}%</p>
          <p className={styles.kpiHelper}>Use Reach risk filtering before broad activation campaigns</p>
        </Card>
      </section>
    </div>
  )
}
