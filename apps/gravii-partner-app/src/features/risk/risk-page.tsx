'use client'

import { startTransition, useDeferredValue, useMemo, useState } from 'react'

import { PartnerDataStatus } from '@/components/ui/partner-data-status'
import { riskWallets } from './data'
import styles from './risk-page.module.css'

type RiskLevelFilter = 'all' | 'critical' | 'high' | 'medium'
type SortOrder = 'newest' | 'oldest'

const riskDistribution = [
  { count: 538, label: 'Critical', percentage: 23, tone: 'critical' },
  { count: 796, label: 'High', percentage: 34, tone: 'high' },
  { count: 655, label: 'Medium', percentage: 28, tone: 'medium' },
  { count: 351, label: 'Low', percentage: 15, tone: 'low' }
] as const

const topFlaggedChains = [
  { label: 'Ethereum', percentage: 42, tone: 'critical' },
  { label: 'BSC', percentage: 35, tone: 'high' },
  { label: 'Base', percentage: 23, tone: 'medium' }
] as const

const clusterCards = [
  {
    details: ['Shared Funding Source', 'Identical Transaction Timing'],
    entropy: 8,
    name: 'Cluster #1',
    risk: 'Critical Risk',
    tone: 'critical',
    wallets: 247
  },
  {
    details: ['Cross-contract Coordination', 'Similar Gas Price Patterns'],
    entropy: 14,
    name: 'Cluster #2',
    risk: 'High Risk',
    tone: 'high',
    wallets: 183
  },
  {
    details: ['Circular Transfer Loops', 'Low Portfolio Diversity'],
    entropy: 24,
    name: 'Cluster #3',
    risk: 'Medium Risk',
    tone: 'medium',
    wallets: 129
  }
] as const

function buildRiskDistributionGradient() {
  let cursor = 0

  return `conic-gradient(${riskDistribution
    .map((item) => {
      const start = cursor
      cursor += item.percentage
      const color =
        item.tone === 'critical'
          ? 'var(--accent-red)'
          : item.tone === 'high'
            ? 'var(--accent-orange)'
            : item.tone === 'medium'
              ? 'var(--accent-amber)'
              : 'var(--accent-teal)'
      return `${color} ${start}% ${cursor}%`
    })
    .join(', ')})`
}

export function RiskPage() {
  const [riskFilter, setRiskFilter] = useState<RiskLevelFilter>('all')
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')
  const [blockedWallets, setBlockedWallets] = useState<string[]>([])
  const deferredRiskFilter = useDeferredValue(riskFilter)
  const deferredSortOrder = useDeferredValue(sortOrder)
  const blockedWalletSet = useMemo(() => new Set(blockedWallets), [blockedWallets])

  const rows = useMemo(() => {
    const filtered = riskWallets.filter(
      (wallet) => deferredRiskFilter === 'all' || wallet.risk === deferredRiskFilter
    )
    return [...filtered].sort((left, right) =>
      deferredSortOrder === 'newest'
        ? left.flaggedHoursAgo - right.flaggedHoursAgo
        : right.flaggedHoursAgo - left.flaggedHoursAgo
    )
  }, [deferredRiskFilter, deferredSortOrder])

  return (
    <div className={styles.page}>
      <div className={styles.mainHeader}>
        <h1 className={styles.mainTitle}>Risk Analysis</h1>
      </div>
      <PartnerDataStatus surface="risk" />

      <section className={styles.topGrid}>
        <div className={styles.riskLeft}>
          <article className={styles.card}>
            <div className={styles.cardTitle}>Risk Level Distribution</div>
            <div className={styles.donutWrapper}>
              <div className={styles.donutContainer}>
                <div
                  className={styles.donutRing}
                  style={{ backgroundImage: buildRiskDistributionGradient() }}
                  aria-hidden="true"
                />
                <div className={styles.donutCenter}>
                  <div className={styles.donutCenterValue}>19%</div>
                  <div className={styles.donutCenterLabel}>At Risk</div>
                </div>
              </div>
              <div className={styles.donutLegend}>
                {riskDistribution.map((item) => (
                  <div key={item.label} className={styles.legendItem}>
                    <span className={`${styles.legendDot} ${styles[`legendDot${item.tone}`]}`} aria-hidden="true" />
                    <span>{item.label}</span>
                    <span className={styles.legendValue}>
                      {item.count} · {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <div className={styles.miniKpis}>
            <article className={styles.card}>
              <div className={styles.cardTitle}>Total Flagged</div>
              <div className={styles.miniKpiValue}>2,340</div>
            </article>
            <article className={styles.card}>
              <div className={styles.cardTitle}>Flagged Rate</div>
              <div className={styles.miniKpiValue}>19%</div>
            </article>
            <article className={styles.card}>
              <div className={styles.cardTitle}>Avg Entropy</div>
              <div className={styles.miniKpiValue}>0.15</div>
            </article>
          </div>

          <article className={styles.card}>
            <div className={styles.cardTitle}>Top Flagged Chains</div>
            <div className={styles.flaggedChainList}>
              {topFlaggedChains.map((chain) => (
                <div key={chain.label} className={styles.flaggedChain}>
                  <div className={styles.flaggedChainHeader}>
                    <span className={`${styles.chainBadge} ${styles[`chainBadge${chain.tone}`]}`}>
                      {chain.label}
                    </span>
                    <span className={styles.flaggedChainMeta}>{chain.percentage}%</span>
                  </div>
                  <div className={styles.flaggedTrack}>
                    <div
                      className={`${styles.flaggedFill} ${styles[`flaggedFill${chain.tone}`]}`}
                      style={{ width: `${chain.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>

        <div className={styles.riskRight}>
          <article className={styles.card}>
            <div className={styles.cardTitle}>Sybil Clusters Detected</div>
            <div className={styles.clusterStack}>
              {clusterCards.map((cluster) => (
                <article
                  key={cluster.name}
                  className={`${styles.clusterCard} ${styles[`clusterCard${cluster.tone}`]}`}
                >
                  <div className={styles.clusterCardHeader}>
                    <div>
                      <span className={styles.clusterName}>{cluster.name}</span>
                      <span className={`${styles.riskBadge} ${styles[`riskBadge${cluster.tone}`]}`}>
                        {cluster.risk}
                      </span>
                    </div>
                    <div className={styles.clusterWallets}>
                      <span className={styles.clusterWalletValue}>{cluster.wallets}</span>
                      <span className={styles.clusterWalletLabel}>wallets</span>
                    </div>
                  </div>
                  <div className={styles.clusterCardBody}>
                    {cluster.details.map((detail) => (
                      <div key={detail} className={styles.clusterDetail}>
                        {detail}
                      </div>
                    ))}
                    <div className={styles.clusterDetail}>
                      Entropy: 0.{cluster.entropy.toString().padStart(2, '0')}
                      <span className={styles.entropyBar}>
                        <span
                          className={`${styles.entropyFill} ${styles[`entropyFill${cluster.tone}`]}`}
                          style={{ width: `${cluster.entropy}%` }}
                        />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.tableHeader}>
          <div className={styles.cardTitleTable}>Recently Flagged Wallets</div>
          <div className={styles.tableFilters}>
            <select
              value={riskFilter}
              onChange={(event) =>
                startTransition(() => setRiskFilter(event.target.value as RiskLevelFilter))
              }
            >
              <option value="all">All Levels</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
            </select>
            <select
              value={sortOrder}
              onChange={(event) =>
                startTransition(() => setSortOrder(event.target.value as SortOrder))
              }
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        <div className={styles.tableWrap}>
          <div className={styles.tableHead}>
            <span>Wallet Address</span>
            <span>Risk Level</span>
            <span>Cluster</span>
            <span>Flagged</span>
            <span>Action</span>
          </div>
          {rows.map((row) => {
            const blocked = blockedWalletSet.has(row.address)

            return (
              <div key={row.address} className={styles.tableRow}>
                <span className={styles.mono}>{row.address}</span>
                <span className={`${styles.riskBadge} ${styles[`riskBadge${row.risk}`]}`}>
                  {row.risk}
                </span>
                <span>{row.cluster}</span>
                <span>{row.flaggedHoursAgo} hours ago</span>
                <button
                  type="button"
                  className={`${styles.blockButton} ${blocked ? styles.blockButtonBlocked : ''}`}
                  onClick={() =>
                    startTransition(() =>
                      setBlockedWallets((current) =>
                        current.includes(row.address)
                          ? current.filter((value) => value !== row.address)
                          : [...current, row.address]
                      )
                    )
                  }
                >
                  {blocked ? 'Blocked' : 'Block'}
                </button>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
