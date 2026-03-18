'use client'

import { useMemo, useState } from 'react'

import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'

import { riskWallets } from './data'
import styles from './risk-page.module.css'

type RiskLevelFilter = 'all' | 'critical' | 'high' | 'medium'
type SortOrder = 'newest' | 'oldest'

export function RiskPage() {
  const [riskFilter, setRiskFilter] = useState<RiskLevelFilter>('all')
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')
  const [blockedWallets, setBlockedWallets] = useState<string[]>([])

  const rows = useMemo(() => {
    const filtered = riskWallets.filter((wallet) => riskFilter === 'all' || wallet.risk === riskFilter)
    return [...filtered].sort((left, right) =>
      sortOrder === 'newest'
        ? left.flaggedHoursAgo - right.flaggedHoursAgo
        : right.flaggedHoursAgo - left.flaggedHoursAgo
    )
  }, [riskFilter, sortOrder])

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow="Risk Analysis"
        title="The original filter and action buttons are restored here."
        description="Risk level distribution, flagged clusters, table filtering, sorting, and per-wallet block actions now behave as independent product controls."
      />

      <section className="grid-auto-2">
        <Card title="Risk level distribution" accent="rose">
          <div className={styles.distribution}>
            {[
              ['Critical', 23],
              ['High', 34],
              ['Medium', 28],
              ['Low', 15]
            ].map(([label, value]) => (
              <div key={label}>
                <div className={styles.barHeader}>
                  <span>{label}</span>
                  <strong>{value}%</strong>
                </div>
                <div className={styles.barTrack}>
                  <span className={styles.barFill} style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Sybil clusters detected" accent="amber">
          <div className={styles.clusterList}>
            {[
              ['Cluster #1', 'Critical Risk', 247, 'Shared funding source · identical transaction timing'],
              ['Cluster #2', 'High Risk', 183, 'Cross-contract coordination · similar gas patterns'],
              ['Cluster #3', 'Medium Risk', 129, 'Circular transfer loops · low portfolio diversity']
            ].map(([cluster, severity, wallets, summary]) => (
              <article key={cluster} className={styles.clusterCard}>
                <div className={styles.clusterHeader}>
                  <div>
                    <h3>{cluster}</h3>
                    <p>{severity}</p>
                  </div>
                  <strong>{wallets}</strong>
                </div>
                <span>{summary}</span>
              </article>
            ))}
          </div>
        </Card>
      </section>

      <Card
        title="Recently flagged wallets"
        action={
          <div className={styles.filters}>
            <select value={riskFilter} onChange={(event) => setRiskFilter(event.target.value as RiskLevelFilter)}>
              <option value="all">All Levels</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
            </select>
            <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value as SortOrder)}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        }
      >
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <span>Wallet Address</span>
            <span>Risk Level</span>
            <span>Cluster</span>
            <span>Flagged</span>
            <span>Action</span>
          </div>
          {rows.map((row) => {
            const blocked = blockedWallets.includes(row.address)

            return (
              <div key={row.address} className={styles.tableRow}>
                <span className={styles.mono}>{row.address}</span>
                <span className={`${styles.badge} ${styles[`badge${row.risk}`]}`}>{row.risk}</span>
                <span>{row.cluster}</span>
                <span>{row.flaggedHoursAgo} hours ago</span>
                <button
                  type="button"
                  className={`${styles.blockButton} ${blocked ? styles.blockButtonBlocked : ''}`}
                  onClick={() =>
                    setBlockedWallets((current) =>
                      current.includes(row.address)
                        ? current.filter((value) => value !== row.address)
                        : [...current, row.address]
                    )
                  }
                >
                  {blocked ? 'Blocked' : 'Block'}
                </button>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
