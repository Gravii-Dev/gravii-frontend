'use client'

import { startTransition, useDeferredValue, useMemo, useState } from 'react'

import { PartnerDataStatus } from '@/components/ui/partner-data-status'
import { usePartnerAuth } from '@/features/auth/auth-provider'
import { formatNumber } from '@/lib/format'
import { getPartnerWorkspaceName } from '@/lib/partner-profile'

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

const fundingSplit = [
  { label: 'CEX', percentage: 55, tone: 'two' },
  { label: 'Bridge', percentage: 30, tone: 'three' },
  { label: 'Wallet', percentage: 15, tone: 'four' }
] as const

const fundingTags = ['Binance', 'OKX', 'Bybit'] as const
const baseDexProtocols = [
  { label: 'Partner Workspace', percentage: 72, tone: 'one' },
  { label: 'Uniswap', percentage: 48, tone: 'two' },
  { label: 'PancakeSwap', percentage: 35, tone: 'three' },
  { label: 'Curve', percentage: 22, tone: 'five' },
  { label: 'SushiSwap', percentage: 15, tone: 'six' }
] as const
const topChains = [
  { label: 'Ethereum', percentage: 38, tone: 'eth' },
  { label: 'Base', percentage: 22, tone: 'base' },
  { label: 'Arbitrum', percentage: 16, tone: 'arb' }
] as const
const topOverlap = [
  { label: 'Long-term Holders', percentage: 62, tone: 'one' },
  { label: 'DEX Traders', percentage: 48, tone: 'two' },
  { label: 'Stablecoin Spenders', percentage: 35, tone: 'three' }
] as const
const defiCategorySplit = [
  { label: 'LP', percentage: 35, tone: 'one' },
  { label: 'Lending', percentage: 28, tone: 'two' },
  { label: 'Staking', percentage: 25, tone: 'three' },
  { label: 'Vault', percentage: 12, tone: 'five' }
] as const
const nftCollections = ['BAYC', 'Azuki', 'Pudgy Penguins'] as const

function parseCurrency(value: string) {
  const numeric = Number(value.replace(/[$,]/g, ''))
  return Number.isFinite(numeric) ? numeric : 0
}

function buildConicGradient(parts: readonly { percentage: number; tone: string }[]) {
  let current = 0

  return `conic-gradient(${parts
    .map((part) => {
      const start = current
      current += part.percentage
      const color =
        part.tone === 'one'
          ? 'var(--chart-1)'
          : part.tone === 'two'
            ? 'var(--chart-2)'
            : part.tone === 'three'
              ? 'var(--chart-3)'
              : part.tone === 'five'
                ? 'var(--chart-5)'
                : 'var(--chart-6)'
      return `${color} ${start}% ${current}%`
    })
    .join(', ')})`
}

export function AnalyticsPage() {
  const auth = usePartnerAuth()
  const partnerName = getPartnerWorkspaceName(auth.session)
  const [dimension, setDimension] = useState<AnalyticsDimension>('chain')
  const [activeChain, setActiveChain] = useState<(typeof chainTabs)[number]>('all')
  const [activeRegion, setActiveRegion] = useState<(typeof regionTabs)[number]>('all')
  const [group, setGroup] = useState<AnalyticsGroup>('top5')
  const deferredDimension = useDeferredValue(dimension)
  const deferredActiveRegion = useDeferredValue(activeRegion)
  const deferredGroup = useDeferredValue(group)

  const groupData = analyticsGroupData[deferredGroup]
  const regionMultiplier =
    deferredActiveRegion === 'all' ? 1 : (regionMultiplierMap[deferredActiveRegion] ?? 1)

  const topSummary = useMemo(() => {
    if (deferredDimension === 'chain') {
      return {
        available: '$4,280',
        native: '$2,940',
        other: '$1,670',
        stable: '$3,820',
        totalUsers: '301,012'
      }
    }

    return {
      available: `$${formatNumber(Math.floor(4280 * (0.72 + regionMultiplier)))}`,
      native: `$${formatNumber(Math.floor(2940 * (0.68 + regionMultiplier)))}`,
      other: `$${formatNumber(Math.floor(1670 * (0.65 + regionMultiplier)))}`,
      stable: `$${formatNumber(Math.floor(3820 * (0.7 + regionMultiplier)))}`,
      totalUsers: formatNumber(Math.floor(301012 * regionMultiplier))
    }
  }, [deferredDimension, regionMultiplier])

  const assetBreakdown = useMemo(() => {
    const stable = parseCurrency(groupData.stbl)
    const native = parseCurrency(groupData.native)
    const other = parseCurrency(groupData.other)
    const total = stable + native + other || 1

    return [
      { label: 'Stables', percentage: Math.round((stable / total) * 100), tone: 'one' },
      { label: 'Native', percentage: Math.round((native / total) * 100), tone: 'five' },
      { label: 'Others', percentage: Math.max(0, 100 - Math.round((stable / total) * 100) - Math.round((native / total) * 100)), tone: 'six' }
    ] as const
  }, [groupData.native, groupData.other, groupData.stbl])

  const dexProtocols = useMemo(
    () => [
      { ...baseDexProtocols[0], label: partnerName },
      ...baseDexProtocols.slice(1)
    ],
    [partnerName]
  )

  const activityCounts = useMemo(() => {
    const totalUsers = groupData.users
    return [
      Math.round((totalUsers * groupData.act7) / 100),
      Math.round((totalUsers * groupData.act30) / 100),
      Math.round((totalUsers * groupData.act90) / 100),
      Math.round((totalUsers * groupData.inact) / 100)
    ]
  }, [groupData.act30, groupData.act7, groupData.act90, groupData.inact, groupData.users])

  return (
    <div className={styles.page}>
      <div className={styles.mainHeader}>
        <h1 className={styles.mainTitle}>User Analytics</h1>
      </div>
      <PartnerDataStatus surface="analytics" />

      <div className={styles.dimensionRow}>
        <button
          type="button"
          className={`${styles.dimensionPill} ${dimension === 'chain' ? styles.dimensionPillActive : ''}`}
          onClick={() => startTransition(() => setDimension('chain'))}
        >
          By Chain
        </button>
        <button
          type="button"
          className={`${styles.dimensionPill} ${dimension === 'region' ? styles.dimensionPillActive : ''}`}
          onClick={() => startTransition(() => setDimension('region'))}
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
              className={`${styles.chainTab} ${activeChain === chain ? styles.chainTabActive : ''}`}
              onClick={() => startTransition(() => setActiveChain(chain))}
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
              className={`${styles.chainTab} ${activeRegion === region ? styles.chainTabActive : ''}`}
              onClick={() => startTransition(() => setActiveRegion(region))}
            >
              {region}
            </button>
          ))}
        </div>
      )}

      <section className={styles.summaryGrid}>
        <article className={styles.card}><div className={styles.cardTitle}>Total Users</div><div className={styles.kpiValue}>{topSummary.totalUsers}</div></article>
        <article className={styles.card}><div className={styles.cardTitle}>Avg Stablecoin Portfolio</div><div className={styles.kpiValue}>{topSummary.stable}</div></article>
        <article className={styles.card}><div className={styles.cardTitle}>Avg Native Token Portfolio</div><div className={styles.kpiValue}>{topSummary.native}</div></article>
        <article className={styles.card}><div className={styles.cardTitle}>Avg Other Tokens Portfolio</div><div className={styles.kpiValue}>{topSummary.other}</div></article>
        <article className={styles.card}><div className={styles.cardTitle}>Avg Available Value</div><div className={styles.kpiValue}>{topSummary.available}</div></article>
      </section>

      <section className={styles.groupBar}>
        <div className={styles.groupPills}>
          {Object.entries(analyticsGroupLabels).map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={`${styles.groupPill} ${group === value ? styles.groupPillActive : ''}`}
              onClick={() => startTransition(() => setGroup(value as AnalyticsGroup))}
            >
              {label}
            </button>
          ))}
        </div>
        <div className={styles.groupSummary}>
          {analyticsGroupLabels[group]} · {formatNumber(groupData.users)} users · Avg Portfolio {groupData.portfolio}
        </div>
      </section>

      <section className={styles.grid2Half}>
        <article className={styles.card}>
          <div className={styles.cardTitle}>Asset Allocation</div>
          <div className={styles.donutWrapper}>
            <div className={styles.donutContainer}>
              <div
                className={styles.donutRing}
                style={{ backgroundImage: buildConicGradient(assetBreakdown) }}
                aria-hidden="true"
              />
              <div className={styles.donutCenter}>
                <div className={styles.donutCenterLabel}>Split</div>
                <div className={styles.donutCenterValue}>{groupData.portfolio}</div>
              </div>
            </div>
            <div className={styles.donutLegend}>
              {assetBreakdown.map((item) => (
                <div key={item.label} className={styles.legendItem}>
                  <span className={`${styles.legendDot} ${styles[`legendDot${item.tone}`]}`} aria-hidden="true" />
                  {item.label}
                  <span className={styles.legendValue}>{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className={styles.card}>
          <div className={styles.cardTitle}>Funding Sources</div>
          <div className={styles.donutWrapper}>
            <div className={styles.donutContainer}>
              <div
                className={styles.donutRing}
                style={{ backgroundImage: buildConicGradient(fundingSplit) }}
                aria-hidden="true"
              />
              <div className={styles.donutCenter}>
                <div className={styles.donutCenterLabel}>Source</div>
                <div className={styles.donutCenterValue}>Top 3</div>
              </div>
            </div>
            <div className={styles.donutLegend}>
              {fundingSplit.map((item) => (
                <div key={item.label} className={styles.legendItem}>
                  <span className={`${styles.legendDot} ${styles[`legendDot${item.tone}`]}`} aria-hidden="true" />
                  {item.label}
                  <span className={styles.legendValue}>{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.tagRow}>
            {fundingTags.map((tag) => (
              <span key={tag} className={styles.kpiTag}>
                {tag}
              </span>
            ))}
          </div>
        </article>
      </section>

      <section className={styles.grid2Half}>
        <article className={styles.card}>
          <div className={styles.cardTitle}>DeFi Engagement</div>
          <div className={styles.quadGrid}>
            <div className={styles.quadItem}><div className={styles.quadLabel}>Avg DeFi TVL</div><div className={styles.quadValue}>{groupData.defiTvl}</div></div>
            <div className={styles.quadItem}><div className={styles.quadLabel}>Unclaimed Rewards</div><div className={styles.quadValue}>{groupData.rewards}</div></div>
          </div>
          <div className={styles.subsection}>
            <div className={styles.quadLabel}>DeFi Category Split</div>
            <div className={styles.analyticsBarLabel}>
              {defiCategorySplit.map((item) => (
                <span key={item.label}>
                  {item.label} <b>{item.percentage}%</b>
                </span>
              ))}
            </div>
            <div className={styles.barTrack}>
              {defiCategorySplit.map((item) => (
                <div
                  key={item.label}
                  className={`${styles.barSegment} ${styles[`barSegment${item.tone}`]}`}
                  style={{ width: `${item.percentage}%` }}
                />
              ))}
            </div>
          </div>
        </article>

        <article className={styles.card}>
          <div className={styles.cardTitle}>NFT Holdings</div>
          <div className={styles.quadGrid}>
            <div className={styles.quadItem}><div className={styles.quadLabel}>Avg NFT Count</div><div className={styles.quadValue}>{groupData.nftCount}</div></div>
            <div className={styles.quadItem}><div className={styles.quadLabel}>Avg Portfolio Value</div><div className={styles.quadValue}>{groupData.nftVal}</div></div>
          </div>
          <div className={styles.subsection}>
            <div className={styles.quadLabel}>Top Collections</div>
            <div className={styles.tagRow}>
              {nftCollections.map((tag) => (
                <span key={tag} className={styles.kpiTag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </article>
      </section>

      <section className={styles.grid2Half}>
        <article className={styles.card}>
          <div className={styles.cardTitle}>Gas Spending</div>
          <div className={styles.tripleGrid}>
            <div className={styles.quadItem}><div className={styles.quadLabel}>Avg Total Gas</div><div className={styles.quadValue}>{groupData.gasTotal}</div></div>
            <div className={styles.quadItem}><div className={styles.quadLabel}>Avg 30d Gas</div><div className={styles.quadValue}>{groupData.gas30}</div></div>
            <div className={styles.quadItem}><div className={styles.quadLabel}>Avg Gas/Tx</div><div className={styles.quadValue}>{groupData.gasTx}</div></div>
          </div>
        </article>

        <article className={styles.card}>
          <div className={styles.cardTitle}>Transfer Patterns</div>
          <div className={styles.tripleGrid}>
            <div className={styles.quadItem}><div className={styles.quadLabel}>Avg Inflow ▲</div><div className={styles.quadValue}>{groupData.txIn}</div></div>
            <div className={styles.quadItem}><div className={styles.quadLabel}>Avg Outflow ▼</div><div className={styles.quadValue}>{groupData.txOut}</div></div>
            <div className={styles.quadItem}><div className={styles.quadLabel}>Unique Counterparts</div><div className={styles.quadValue}>{groupData.counterparts}</div></div>
          </div>
        </article>
      </section>

      <section className={styles.grid2Half}>
        <article className={styles.card}>
          <div className={styles.cardTitle}>Trading Summary</div>
          <div className={styles.quadGrid}>
            <div className={styles.quadItem}><div className={styles.quadLabel}>Avg Lifetime Vol</div><div className={styles.quadValue}>{groupData.ltVol}</div></div>
            <div className={styles.quadItem}><div className={styles.quadLabel}>Avg 30d Vol</div><div className={styles.quadValue}>{groupData.vol30}</div></div>
            <div className={styles.quadItem}><div className={styles.quadLabel}>Avg Trade Size</div><div className={styles.quadValue}>{groupData.tradeSize}</div></div>
            <div className={styles.quadItem}><div className={styles.quadLabel}>Avg Swaps (30d)</div><div className={styles.quadValue}>{groupData.swaps}</div></div>
          </div>
        </article>

        <article className={styles.card}>
          <div className={styles.cardTitle}>Most Used DEX Protocols</div>
          <div className={styles.rankList}>
            {dexProtocols.map((item) => (
              <div key={item.label} className={styles.rankItem}>
                <span className={styles.rankName}>{item.label}</span>
                <div className={styles.rankBarTrack}>
                  <div
                    className={`${styles.rankBar} ${styles[`rankBar${item.tone}`]}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className={styles.rankVal}>{item.percentage}%</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className={styles.grid2Half}>
        <article className={styles.card}>
          <div className={styles.cardTitle}>Wallet Type Distribution</div>
          <div className={styles.analyticsBarLabel}>
            <span>Fresh <b>{groupData.wFresh}%</b></span>
            <span>Kaia Only <b>{groupData.wKaia}%</b></span>
            <span>EVM Only <b>{groupData.wEvm}%</b></span>
            <span>Multi-chain <b>{groupData.wMulti}%</b></span>
          </div>
          <div className={styles.barTrackLarge}>
            <div className={`${styles.barSegment} ${styles.barSegmentFour}`} style={{ width: `${groupData.wFresh}%` }} />
            <div className={`${styles.barSegment} ${styles.barSegmentThree}`} style={{ width: `${groupData.wKaia}%` }} />
            <div className={`${styles.barSegment} ${styles.barSegmentOne}`} style={{ width: `${groupData.wEvm}%` }} />
            <div className={`${styles.barSegment} ${styles.barSegmentTwo}`} style={{ width: `${groupData.wMulti}%` }} />
          </div>
        </article>

        <article className={styles.card}>
          <div className={styles.cardTitle}>Spending Tier Distribution</div>
          <div className={styles.analyticsBarLabel}>
            <span>Whale <b>{groupData.sWhale}%</b></span>
            <span>High <b>{groupData.sHigh}%</b></span>
            <span>Med <b>{groupData.sMed}%</b></span>
            <span>Low <b>{groupData.sLow}%</b></span>
            <span>Inactive <b>{groupData.sInact}%</b></span>
          </div>
          <div className={styles.barTrackLarge}>
            <div className={`${styles.barSegment} ${styles.barSegmentAmber}`} style={{ width: `${groupData.sWhale}%` }} />
            <div className={`${styles.barSegment} ${styles.barSegmentOrange}`} style={{ width: `${groupData.sHigh}%` }} />
            <div className={`${styles.barSegment} ${styles.barSegmentOne}`} style={{ width: `${groupData.sMed}%` }} />
            <div className={`${styles.barSegment} ${styles.barSegmentTwo}`} style={{ width: `${groupData.sLow}%` }} />
            <div className={`${styles.barSegment} ${styles.barSegmentMuted}`} style={{ width: `${groupData.sInact}%` }} />
          </div>
        </article>
      </section>

      <section className={styles.grid2Half}>
        <article className={styles.card}>
          <div className={styles.cardTitle}>Activity Profile</div>
          <div className={styles.quadGrid}>
            <div className={styles.quadItem}><div className={styles.quadLabel}>Avg Tx/Week</div><div className={styles.quadValue}>{groupData.txWeek}</div></div>
            <div className={styles.quadItem}><div className={styles.quadLabel}>Most Active Hour</div><div className={styles.quadValue}>{groupData.activeHr}</div></div>
            <div className={styles.quadItem}><div className={styles.quadLabel}>Most Active Day</div><div className={styles.quadValue}>{groupData.activeDay}</div></div>
            <div className={styles.quadItem}><div className={styles.quadLabel}>Avg Wallet Age</div><div className={styles.quadValue}>{groupData.walletAge}</div></div>
          </div>
        </article>

        <article className={styles.card}>
          <div className={styles.cardTitle}>User Activity Status</div>
          <div className={styles.analyticsBarLabel}>
            <span>Active 7d <b>{groupData.act7}%</b></span>
            <span>Active 30d <b>{groupData.act30}%</b></span>
            <span>Active 90d <b>{groupData.act90}%</b></span>
            <span>Inactive 90d+ <b>{groupData.inact}%</b></span>
          </div>
          <div className={styles.barTrackLarge}>
            <div className={`${styles.barSegment} ${styles.barSegmentTeal}`} style={{ width: `${groupData.act7}%` }} />
            <div className={`${styles.barSegment} ${styles.barSegmentOne}`} style={{ width: `${groupData.act30}%` }} />
            <div className={`${styles.barSegment} ${styles.barSegmentAmber}`} style={{ width: `${groupData.act90}%` }} />
            <div className={`${styles.barSegment} ${styles.barSegmentRed}`} style={{ width: `${groupData.inact}%` }} />
          </div>
          <div className={styles.barLegend}>
            <span className={styles.barLegendItem}><span className={`${styles.legendDot} ${styles.legendDotteal}`} />{formatNumber(activityCounts[0])} users</span>
            <span className={styles.barLegendItem}><span className={`${styles.legendDot} ${styles.legendDotone}`} />{formatNumber(activityCounts[1])} users</span>
            <span className={styles.barLegendItem}><span className={`${styles.legendDot} ${styles.legendDotamber}`} />{formatNumber(activityCounts[2])} users</span>
            <span className={styles.barLegendItem}><span className={`${styles.legendDot} ${styles.legendDotred}`} />{formatNumber(activityCounts[3])} users</span>
          </div>
        </article>
      </section>
    </div>
  )
}
