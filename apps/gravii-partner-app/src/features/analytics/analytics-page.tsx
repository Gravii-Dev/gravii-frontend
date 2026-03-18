'use client'

import { useMemo, useState } from 'react'

import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { formatNumber } from '@/lib/format'

import { analyticsGroupData, regionMultiplierMap } from './data'
import styles from './analytics-page.module.css'

type AnalyticsDimension = 'chain' | 'region'
type AnalyticsGroup = keyof typeof analyticsGroupData

const chainTabs = ['all', 'eth', 'base', 'arb', 'bsc', 'poly', 'avax', 'hl', 'kaia', 'sol'] as const
const regionTabs = ['all', 'US', 'JP', 'KR', 'TW', 'TH', 'SG', 'DE', 'GB', 'VN', 'ID'] as const
const analyticsGroupLabels: Record<AnalyticsGroup, string> = {
  top5: 'Black',
  top20: 'Platinum',
  top50: 'Gold',
  bottom50: 'Classic'
}

export function AnalyticsPage() {
  const [dimension, setDimension] = useState<AnalyticsDimension>('chain')
  const [activeChain, setActiveChain] = useState<(typeof chainTabs)[number]>('all')
  const [activeRegion, setActiveRegion] = useState<(typeof regionTabs)[number]>('all')
  const [group, setGroup] = useState<AnalyticsGroup>('top5')

  const groupData = analyticsGroupData[group]
  const regionMultiplier = activeRegion === 'all' ? 1 : (regionMultiplierMap[activeRegion] ?? 1)

  const topSummary = useMemo(() => {
    if (dimension === 'chain') {
      return {
        totalUsers: '301,012',
        stable: '$3,820',
        native: '$2,940',
        other: '$1,670',
        available: '$4,280'
      }
    }

    return {
      totalUsers: formatNumber(Math.floor(301012 * regionMultiplier)),
      stable: `$${formatNumber(Math.floor(3820 * (0.7 + regionMultiplier)))}`,
      native: `$${formatNumber(Math.floor(2940 * (0.68 + regionMultiplier)))}`,
      other: `$${formatNumber(Math.floor(1670 * (0.65 + regionMultiplier)))}`,
      available: `$${formatNumber(Math.floor(4280 * (0.72 + regionMultiplier)))}`
    }
  }, [dimension, regionMultiplier])

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow="User Analytics"
        title="Overview-to-analytics handoff now lands on a dedicated page with the original controls."
        description="The key prototype actions are here again: dimension switching, group pills, chain tabs, and dynamic summary metrics."
      />

      <div className={styles.toggleRow}>
        <button
          type="button"
          className={`${styles.toggle} ${dimension === 'chain' ? styles.toggleActive : ''}`}
          onClick={() => setDimension('chain')}
        >
          By Chain
        </button>
        <button
          type="button"
          className={`${styles.toggle} ${dimension === 'region' ? styles.toggleActive : ''}`}
          onClick={() => setDimension('region')}
        >
          By Region
        </button>
      </div>

      {dimension === 'chain' ? (
        <div className={styles.tabRow}>
          {chainTabs.map((chain) => (
            <button
              key={chain}
              type="button"
              className={`${styles.tab} ${activeChain === chain ? styles.tabActive : ''}`}
              onClick={() => setActiveChain(chain)}
            >
              {chain === 'all' ? 'All' : chain.toUpperCase()}
            </button>
          ))}
        </div>
      ) : (
        <div className={styles.tabRow}>
          {regionTabs.map((region) => (
            <button
              key={region}
              type="button"
              className={`${styles.tab} ${activeRegion === region ? styles.tabActive : ''}`}
              onClick={() => setActiveRegion(region)}
            >
              {region}
            </button>
          ))}
        </div>
      )}

      <section className="grid-auto-4" style={{ gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' }}>
        <Card title="Total Users">
          <p className={styles.metric}>{topSummary.totalUsers}</p>
        </Card>
        <Card title="Avg Stablecoin Portfolio">
          <p className={styles.metric}>{topSummary.stable}</p>
        </Card>
        <Card title="Avg Native Token Portfolio">
          <p className={styles.metric}>{topSummary.native}</p>
        </Card>
        <Card title="Avg Other Token Portfolio">
          <p className={styles.metric}>{topSummary.other}</p>
        </Card>
        <Card title="Avg Available Value">
          <p className={styles.metric}>{topSummary.available}</p>
        </Card>
      </section>

      <Card title="Group selection" eyebrow="Tier slices">
        <div className={styles.groupBar}>
          <div className={styles.groupPills}>
            {Object.entries(analyticsGroupLabels).map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={`${styles.toggle} ${group === value ? styles.toggleActive : ''}`}
                onClick={() => setGroup(value as AnalyticsGroup)}
              >
                {label}
              </button>
            ))}
          </div>
          <p className={styles.groupSummary}>
            {analyticsGroupLabels[group]} · {formatNumber(groupData.users)} users · Avg Portfolio {groupData.portfolio}
          </p>
        </div>
      </Card>

      <section className="grid-auto-2">
        <Card title="Asset Allocation">
          <div className={styles.metricGrid}>
            <div>
              <span className={styles.label}>Portfolio</span>
              <strong>{groupData.portfolio}</strong>
            </div>
            <div>
              <span className={styles.label}>Stables</span>
              <strong>{groupData.stbl}</strong>
            </div>
            <div>
              <span className={styles.label}>Native</span>
              <strong>{groupData.native}</strong>
            </div>
            <div>
              <span className={styles.label}>Others</span>
              <strong>{groupData.other}</strong>
            </div>
          </div>
        </Card>

        <Card title="DeFi & NFT">
          <div className={styles.metricGrid}>
            <div>
              <span className={styles.label}>Avg DeFi TVL</span>
              <strong>{groupData.defiTvl}</strong>
            </div>
            <div>
              <span className={styles.label}>Unclaimed Rewards</span>
              <strong>{groupData.rewards}</strong>
            </div>
            <div>
              <span className={styles.label}>Avg NFT Count</span>
              <strong>{groupData.nftCount}</strong>
            </div>
            <div>
              <span className={styles.label}>Avg NFT Value</span>
              <strong>{groupData.nftVal}</strong>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid-auto-2">
        <Card title="Gas & Transfers">
          <div className={styles.metricGrid}>
            <div>
              <span className={styles.label}>Avg Total Gas</span>
              <strong>{groupData.gasTotal}</strong>
            </div>
            <div>
              <span className={styles.label}>Avg 30d Gas</span>
              <strong>{groupData.gas30}</strong>
            </div>
            <div>
              <span className={styles.label}>Avg Gas / Tx</span>
              <strong>{groupData.gasTx}</strong>
            </div>
            <div>
              <span className={styles.label}>Unique Counterparts</span>
              <strong>{groupData.counterparts}</strong>
            </div>
          </div>
        </Card>

        <Card title="Trading Summary">
          <div className={styles.metricGrid}>
            <div>
              <span className={styles.label}>Lifetime Vol</span>
              <strong>{groupData.ltVol}</strong>
            </div>
            <div>
              <span className={styles.label}>30d Vol</span>
              <strong>{groupData.vol30}</strong>
            </div>
            <div>
              <span className={styles.label}>Avg Trade Size</span>
              <strong>{groupData.tradeSize}</strong>
            </div>
            <div>
              <span className={styles.label}>Swaps</span>
              <strong>{groupData.swaps}</strong>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid-auto-2">
        <Card title="Wallet Type Distribution">
          <div className={styles.stackBars}>
            {[
              ['Fresh', groupData.wFresh],
              ['Kaia Only', groupData.wKaia],
              ['EVM Only', groupData.wEvm],
              ['Multi-chain', groupData.wMulti]
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

        <Card title="User Activity Status">
          <div className={styles.stackBars}>
            {[
              ['Active 7d', groupData.act7],
              ['Active 30d', groupData.act30],
              ['Active 90d', groupData.act90],
              ['Inactive 90d+', groupData.inact]
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
      </section>
    </div>
  )
}
