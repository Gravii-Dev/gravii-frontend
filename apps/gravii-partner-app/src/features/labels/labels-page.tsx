'use client'

import dynamic from 'next/dynamic'
import { startTransition, useDeferredValue, useMemo, useState } from 'react'

import { PartnerDataStatus } from '@/components/ui/partner-data-status'
import { formatNumber } from '@/lib/format'

import { chainColorMap, labelSegments } from './data'
import styles from './labels-page.module.css'

type BehaviorTab = 'behavior' | 'value'
type ActiveWindow = 'all' | '7d' | '30d' | '90d' | '90p'

const chainOptions = ['eth', 'base', 'arb', 'bsc', 'poly', 'avax', 'hl', 'kaia', 'sol'] as const
const assetOptions = ['stables', 'native', 'others'] as const
const tierOptions = ['black', 'platinum', 'gold', 'classic'] as const
const holdOptions = ['u1k', '1k10k', '10k50k', '50kp'] as const
const paymentOptions = ['u500', '500_5k', '5k20k', '20kp'] as const
const tradingOptions = ['u1k', '1k10k', '10k100k', '100kp'] as const
const tivOptions = ['1k', '10k', '50k', '100k'] as const

type ChainOptionId = (typeof chainOptions)[number]
type AssetOptionId = (typeof assetOptions)[number]

const holdingsDistribution = [
  { label: '< $1K', percentage: 42, tone: 'four' },
  { label: '$1K–$10K', percentage: 30, tone: 'one' },
  { label: '$10K–$50K', percentage: 18, tone: 'two' },
  { label: '$50K+', percentage: 10, tone: 'amber' }
] as const

const tradingDistribution = [
  { label: '< $1K', percentage: 35, tone: 'four' },
  { label: '$1K–$10K', percentage: 28, tone: 'one' },
  { label: '$10K–$100K', percentage: 24, tone: 'two' },
  { label: '$100K+', percentage: 13, tone: 'amber' }
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

const PersonaModal = dynamic(
  () => import('@/components/ui/persona-modal').then((module) => module.PersonaModal),
  { ssr: false }
)

function activeMultiplier(activeWindow: ActiveWindow): number {
  const map: Record<ActiveWindow, number> = { all: 1, '7d': 0.35, '30d': 0.58, '90d': 0.82, '90p': 0.18 }
  return map[activeWindow]
}

function formatOptionLabel(option: string) {
  const map: Record<string, string> = {
    all: 'All',
    black: 'Black',
    platinum: 'Platinum',
    gold: 'Gold',
    classic: 'Classic',
    stables: 'Stables',
    native: 'Native',
    others: 'Others',
    u1k: '< $1K',
    '1k10k': '$1K–$10K',
    '10k50k': '$10K–$50K',
    '50kp': '$50K+',
    u500: '< $500',
    '500_5k': '$500–$5K',
    '5k20k': '$5K–$20K',
    '20kp': '$20K+',
    '10k100k': '$10K–$100K',
    '100kp': '$100K+',
    '7d': '≤ 7d',
    '30d': '≤ 30d',
    '90d': '≤ 90d',
    '90p': '90d+',
    eth: 'ETH',
    base: 'Base',
    arb: 'Arbitrum',
    bsc: 'BSC',
    poly: 'Polygon',
    avax: 'Avalanche',
    hl: 'Hyperliquid',
    kaia: 'Kaia',
    sol: 'Solana'
  }

  return map[option] ?? option
}

export function LabelsPage() {
  const [tab, setTab] = useState<BehaviorTab>('behavior')
  const [selectedLabelIds, setSelectedLabelIds] = useState<number[]>([])
  const [selectedChains, setSelectedChains] = useState<ChainOptionId[]>([])
  const [selectedAssets, setSelectedAssets] = useState<AssetOptionId[]>([])
  const [activeWindowFilter, setActiveWindowFilter] = useState<ActiveWindow>('all')
  const [showPersonaModal, setShowPersonaModal] = useState(false)
  const [valueFilters, setValueFilters] = useState({
    assets: [] as string[],
    chains: [] as string[],
    holdings: [] as string[],
    payments: [] as string[],
    tiers: [] as string[],
    tiv: [] as string[],
    trading: [] as string[]
  })
  const deferredSelectedLabelIds = useDeferredValue(selectedLabelIds)
  const deferredSelectedChains = useDeferredValue(selectedChains)
  const deferredActiveWindowFilter = useDeferredValue(activeWindowFilter)
  const deferredValueFilters = useDeferredValue(valueFilters)
  const selectedLabelIdSet = useMemo(
    () => new Set(deferredSelectedLabelIds),
    [deferredSelectedLabelIds]
  )
  const windowMultiplier = useMemo(
    () => activeMultiplier(deferredActiveWindowFilter),
    [deferredActiveWindowFilter]
  )
  const activeLabels = useMemo(
    () => labelSegments.filter((segment) => selectedLabelIdSet.has(segment.id)),
    [selectedLabelIdSet]
  )
  const labelTotalBase = Math.round(301012 * windowMultiplier)

  const filteredBehaviorUsers = useMemo(() => {
    if (activeLabels.length === 0) {
      return Math.round(301012 * windowMultiplier)
    }

    let total = 0

    for (const label of activeLabels) {
      let labelUsers = label.users

      if (deferredSelectedChains.length > 0) {
        const chainPct = deferredSelectedChains.reduce(
          (sum, chain) => sum + (label.chains[chain] ?? 0),
          0
        )
        labelUsers = Math.round((labelUsers * chainPct) / 100)
      }

      total += labelUsers
    }

    if (activeLabels.length > 1) {
      total = Math.round(total * (1 - 0.08 * (activeLabels.length - 1)))
    }

    return Math.round(total * windowMultiplier)
  }, [activeLabels, deferredSelectedChains, windowMultiplier])

  const behaviorSummary = useMemo(() => {
    if (activeLabels.length === 0) {
      return {
        avgBal: 4230,
        retention: 72,
        txFreq: 38,
        users: filteredBehaviorUsers
      }
    }

    const avgBal = Math.round(activeLabels.reduce((sum, item) => sum + item.avgBal, 0) / activeLabels.length)
    const txFreq = Math.round(activeLabels.reduce((sum, item) => sum + item.txFreq, 0) / activeLabels.length)
    const retention = Math.round(activeLabels.reduce((sum, item) => sum + item.retention, 0) / activeLabels.length)

    return {
      avgBal,
      retention,
      txFreq,
      users: filteredBehaviorUsers
    }
  }, [activeLabels, filteredBehaviorUsers])

  const valueSummary = useMemo(() => {
    const activeCount = Object.values(deferredValueFilters).reduce(
      (sum, values) => sum + values.length,
      0
    )
    const factor = activeCount > 0 ? Math.max(0.1, 1 - activeCount * 0.22) : 1

    return {
      valueActiveCount: activeCount,
      valuePayment: Math.round(2327 * (0.5 + factor * 0.5)),
      valuePortfolio: Math.round(8430 * (0.6 + factor * 0.4)),
      valueTrading: Math.round(47200 * (0.4 + factor * 0.6)),
      valueUsers: Math.round(301012 * factor)
    }
  }, [deferredValueFilters])

  const behaviorLabelCards = useMemo(
    () =>
      labelSegments.map((segment) => {
        let displayUsers = segment.users

        if (deferredSelectedChains.length > 0) {
          const chainPct = deferredSelectedChains.reduce(
            (sum, chain) => sum + (segment.chains[chain] ?? 0),
            0
          )
          displayUsers = Math.round((displayUsers * chainPct) / 100)
        }

        displayUsers = Math.round(displayUsers * windowMultiplier)

        return {
          chains: segment.chains,
          displayPct: ((displayUsers / labelTotalBase) * 100).toFixed(1),
          displayUsers,
          id: segment.id,
          isSelected: selectedLabelIdSet.has(segment.id),
          name: segment.name,
          threshold: segment.threshold
        }
      }),
    [deferredSelectedChains, labelTotalBase, selectedLabelIdSet, windowMultiplier]
  )

  const toggleMulti = <T extends string>(current: T[], next: T): T[] =>
    current.includes(next) ? current.filter((value) => value !== next) : [...current, next]

  const toggleLabel = (labelId: number) => {
    startTransition(() => {
      setSelectedLabelIds((current) =>
        toggleMulti(current.map(String), String(labelId)).map(Number)
      )
    })
  }

  return (
    <div className={styles.page}>
      <div className={styles.mainHeader}>
        <h1 className={styles.mainTitle}>User Segments</h1>
      </div>
      <PartnerDataStatus surface="labels" />

      <div className={styles.segTabs}>
        <button
          type="button"
          className={`${styles.segTab} ${tab === 'behavior' ? styles.segTabActive : ''}`}
          onClick={() => startTransition(() => setTab('behavior'))}
        >
          By Behavior
        </button>
        <button
          type="button"
          className={`${styles.segTab} ${tab === 'value' ? styles.segTabActive : ''}`}
          onClick={() => startTransition(() => setTab('value'))}
        >
          By Value
        </button>
      </div>

      {tab === 'behavior' ? (
        <>
          <section className={`${styles.card} ${styles.filterBar}`}>
            <div className={styles.filterSection}>
              <div className={styles.filterGroup}>
                <div className={styles.filterLabel}>Chains</div>
                <div className={styles.filterPills}>
                  <button
                    type="button"
                    className={`${styles.filterPill} ${selectedChains.length === 0 ? styles.filterPillActive : ''}`}
                    onClick={() => startTransition(() => setSelectedChains([]))}
                  >
                    All
                  </button>
                  {chainOptions.map((chain) => (
                    <button
                      key={chain}
                      type="button"
                      className={`${styles.filterPill} ${selectedChains.includes(chain) ? styles.filterPillActive : ''}`}
                      onClick={() =>
                        startTransition(() =>
                          setSelectedChains((current) => toggleMulti(current, chain))
                        )
                      }
                    >
                      {formatOptionLabel(chain)}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.filterGroup}>
                <div className={styles.filterLabel}>Assets</div>
                <div className={styles.filterPills}>
                  <button
                    type="button"
                    className={`${styles.filterPill} ${selectedAssets.length === 0 ? styles.filterPillActive : ''}`}
                    onClick={() => startTransition(() => setSelectedAssets([]))}
                  >
                    All
                  </button>
                  {assetOptions.map((asset) => (
                    <button
                      key={asset}
                      type="button"
                      className={`${styles.filterPill} ${selectedAssets.includes(asset) ? styles.filterPillActive : ''}`}
                      onClick={() =>
                        startTransition(() =>
                          setSelectedAssets((current) => toggleMulti(current, asset))
                        )
                      }
                    >
                      {formatOptionLabel(asset)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.filterSummary}>
              <span className={styles.summaryHighlight}>{selectedLabelIds.length || 0} labels</span> ·{' '}
              <span className={styles.summaryHighlight}>
                {selectedChains.length === 0 ? 'All chains' : `${selectedChains.length} chains`}
              </span>{' '}
              · <span className={styles.summaryHighlight}>{formatNumber(filteredBehaviorUsers)} users</span>
            </div>
          </section>

          <div className={styles.inlineFilterRow}>
            <span className={styles.inlineFilterLabel}>Last Active</span>
            <div className={styles.filterPills}>
              {(['all', '7d', '30d', '90d', '90p'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`${styles.filterPill} ${activeWindowFilter === value ? styles.filterPillActive : ''}`}
                  onClick={() => startTransition(() => setActiveWindowFilter(value))}
                >
                  {formatOptionLabel(value)}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.labelGridHeader}>
            Click segments to filter ↓{' '}
            <button type="button" className={styles.infoButton} onClick={() => setShowPersonaModal(true)}>
              ⓘ
            </button>
          </div>

          <div className={styles.labelGrid}>
            {behaviorLabelCards.map((segment) => (
                <button
                  key={segment.id}
                  type="button"
                  className={`${styles.labelCard} ${selectedLabelIds.includes(segment.id) ? styles.labelCardActive : ''}`}
                  onClick={() => toggleLabel(segment.id)}
                >
                  <div className={styles.labelCardHeader}>
                    <span className={styles.checkbox}>{segment.isSelected ? '✓' : ''}</span>
                    <span className={styles.labelName}>{segment.name}</span>
                    <strong>{formatNumber(segment.displayUsers)}</strong>
                  </div>
                  <p className={styles.labelPct}>{segment.displayPct}% of total</p>
                  <div className={styles.chainBar}>
                    {Object.entries(segment.chains).map(([chain, value]) => (
                      <span
                        key={`${segment.id}-${chain}`}
                        style={{ width: `${value}%`, backgroundColor: chainColorMap[chain] ?? '#555' }}
                      />
                    ))}
                  </div>
                  <p className={styles.threshold}>{segment.threshold}</p>
                </button>
              ))}
          </div>

          <section className={styles.summarySection}>
            <div className={styles.summaryLabel}>Filtered Results</div>
            <div className={styles.summaryGrid}>
              <article className={styles.card}><div className={styles.cardTitle}>Filtered Users</div><div className={styles.kpiValue}>{formatNumber(behaviorSummary.users)}</div></article>
              <article className={styles.card}><div className={styles.cardTitle}>Avg Balance</div><div className={styles.kpiValue}>${formatNumber(behaviorSummary.avgBal)}</div></article>
              <article className={styles.card}><div className={styles.cardTitle}>Avg Tx Frequency</div><div className={styles.kpiValue}>{behaviorSummary.txFreq}/mo</div></article>
              <article className={styles.card}><div className={styles.cardTitle}>Retention Rate (30d)</div><div className={styles.kpiValue}>{behaviorSummary.retention}%</div></article>
            </div>
          </section>

          <div className={styles.footerNote}>
            These segments can be used as targeting criteria when creating a campaign
          </div>
        </>
      ) : (
        <>
          <section className={`${styles.card} ${styles.filterBar}`}>
            <div className={styles.filterSection}>
              {[
                { key: 'chains', label: 'Chains', options: chainOptions },
                { key: 'tiers', label: 'Tier', options: tierOptions },
                { key: 'assets', label: 'Asset Type', options: assetOptions },
                { key: 'holdings', label: 'Holdings', options: holdOptions },
                { key: 'payments', label: 'Payment', options: paymentOptions },
                { key: 'trading', label: 'Trading Vol', options: tradingOptions },
                { key: 'tiv', label: 'Available Value', options: tivOptions }
              ].map((group) => (
                <div key={group.key} className={styles.filterGroup}>
                  <div className={styles.filterLabel}>{group.label}</div>
                  <div className={styles.filterPills}>
                    <button
                      type="button"
                      className={`${styles.filterPill} ${valueFilters[group.key as keyof typeof valueFilters].length === 0 ? styles.filterPillActive : ''}`}
                      onClick={() =>
                        startTransition(() =>
                          setValueFilters((current) => ({
                            ...current,
                            [group.key]: []
                          }))
                        )
                      }
                    >
                      All
                    </button>
                    {group.options.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`${styles.filterPill} ${valueFilters[group.key as keyof typeof valueFilters].includes(option) ? styles.filterPillActive : ''}`}
                        onClick={() =>
                          startTransition(() =>
                            setValueFilters((current) => ({
                              ...current,
                              [group.key]: toggleMulti(current[group.key as keyof typeof valueFilters], option)
                            }))
                          )
                        }
                      >
                        {formatOptionLabel(option)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.filterSummary}>
              <span className={styles.summaryHighlight}>
                {valueSummary.valueActiveCount === 0 ? 'All filters' : `${valueSummary.valueActiveCount} filters`}
              </span>{' '}
              · <span className={styles.summaryHighlight}>{formatNumber(valueSummary.valueUsers)} users</span>
            </div>
          </section>

          <section className={styles.summarySection}>
            <div className={styles.summaryLabel}>Filtered Results</div>
            <div className={styles.summaryGrid}>
              <article className={styles.card}><div className={styles.cardTitle}>Filtered Users</div><div className={styles.kpiValue}>{formatNumber(valueSummary.valueUsers)}</div></article>
              <article className={styles.card}><div className={styles.cardTitle}>Avg Portfolio</div><div className={styles.kpiValue}>${formatNumber(valueSummary.valuePortfolio)}</div></article>
              <article className={styles.card}><div className={styles.cardTitle}>Avg Monthly Payment</div><div className={styles.kpiValue}>${formatNumber(valueSummary.valuePayment)}</div></article>
              <article className={styles.card}><div className={styles.cardTitle}>Avg Trading Volume</div><div className={styles.kpiValue}>${formatNumber(valueSummary.valueTrading)}</div></article>
            </div>
          </section>

          <section className={styles.grid2Half}>
            <article className={styles.card}>
              <div className={styles.cardTitle}>Holdings Distribution</div>
              <div className={styles.rankList}>
                {holdingsDistribution.map((item) => (
                  <div key={item.label} className={styles.rankItem}>
                    <span className={styles.rankName}>{item.label}</span>
                    <div className={styles.rankBarTrack}>
                      <div className={`${styles.rankBar} ${styles[`rankBar${item.tone}`]}`} style={{ width: `${item.percentage}%` }} />
                    </div>
                    <span className={styles.rankVal}>{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </article>
            <article className={styles.card}>
              <div className={styles.cardTitle}>Trading Volume Distribution</div>
              <div className={styles.rankList}>
                {tradingDistribution.map((item) => (
                  <div key={item.label} className={styles.rankItem}>
                    <span className={styles.rankName}>{item.label}</span>
                    <div className={styles.rankBarTrack}>
                      <div className={`${styles.rankBar} ${styles[`rankBar${item.tone}`]}`} style={{ width: `${item.percentage}%` }} />
                    </div>
                    <span className={styles.rankVal}>{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className={styles.grid2Half}>
            <article className={styles.card}>
              <div className={styles.cardTitle}>Top Chains</div>
              <div className={styles.rankList}>
                {topChains.map((item) => (
                  <div key={item.label} className={styles.rankItem}>
                    <span className={styles.rankName}>{item.label}</span>
                    <div className={styles.rankBarTrack}>
                      <div className={`${styles.rankBar} ${styles[`rankBar${item.tone}`]}`} style={{ width: `${item.percentage}%` }} />
                    </div>
                    <span className={styles.rankVal}>{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </article>
            <article className={styles.card}>
              <div className={styles.cardTitle}>Top Segment Overlap</div>
              <div className={styles.rankList}>
                {topOverlap.map((item) => (
                  <div key={item.label} className={styles.rankItem}>
                    <span className={styles.rankName}>{item.label}</span>
                    <div className={styles.rankBarTrack}>
                      <div className={`${styles.rankBar} ${styles[`rankBar${item.tone}`]}`} style={{ width: `${item.percentage}%` }} />
                    </div>
                    <span className={styles.rankVal}>{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </article>
          </section>
        </>
      )}

      <PersonaModal open={showPersonaModal} onClose={() => setShowPersonaModal(false)} />
    </div>
  )
}
