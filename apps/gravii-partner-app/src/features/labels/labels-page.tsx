'use client'

import { useMemo, useState } from 'react'

import { PersonaModal } from '@/components/ui/persona-modal'
import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
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

function activeMultiplier(activeWindow: ActiveWindow): number {
  const map: Record<ActiveWindow, number> = { all: 1, '7d': 0.35, '30d': 0.58, '90d': 0.82, '90p': 0.18 }
  return map[activeWindow]
}

export function LabelsPage() {
  const [tab, setTab] = useState<BehaviorTab>('behavior')
  const [selectedLabelIds, setSelectedLabelIds] = useState<number[]>([])
  const [selectedChains, setSelectedChains] = useState<ChainOptionId[]>([])
  const [selectedAssets, setSelectedAssets] = useState<AssetOptionId[]>([])
  const [activeWindowFilter, setActiveWindowFilter] = useState<ActiveWindow>('all')
  const [showPersonaModal, setShowPersonaModal] = useState(false)
  const [valueFilters, setValueFilters] = useState({
    chains: [] as string[],
    tiers: [] as string[],
    assets: [] as string[],
    holdings: [] as string[],
    payments: [] as string[],
    trading: [] as string[],
    tiv: [] as string[]
  })

  const filteredBehaviorUsers = useMemo(() => {
    const multiplier = activeMultiplier(activeWindowFilter)

    if (selectedLabelIds.length === 0) {
      return Math.round(301012 * multiplier)
    }

    let total = 0

    for (const label of labelSegments) {
      if (!selectedLabelIds.includes(label.id)) {
        continue
      }

      let labelUsers = label.users

      if (selectedChains.length > 0) {
        const chainPct = selectedChains.reduce((sum, chain) => sum + (label.chains[chain] ?? 0), 0)
        labelUsers = Math.round(labelUsers * chainPct / 100)
      }

      total += labelUsers
    }

    if (selectedLabelIds.length > 1) {
      total = Math.round(total * (1 - 0.08 * (selectedLabelIds.length - 1)))
    }

    return Math.round(total * multiplier)
  }, [activeWindowFilter, selectedChains, selectedLabelIds])

  const behaviorSummary = useMemo(() => {
    const activeLabels = labelSegments.filter((segment) => selectedLabelIds.includes(segment.id))

    if (activeLabels.length === 0) {
      return {
        users: filteredBehaviorUsers,
        avgBal: 4230,
        txFreq: 38,
        retention: 72
      }
    }

    const avgBal = Math.round(activeLabels.reduce((sum, item) => sum + item.avgBal, 0) / activeLabels.length)
    const txFreq = Math.round(activeLabels.reduce((sum, item) => sum + item.txFreq, 0) / activeLabels.length)
    const retention = Math.round(activeLabels.reduce((sum, item) => sum + item.retention, 0) / activeLabels.length)

    return {
      users: filteredBehaviorUsers,
      avgBal,
      txFreq,
      retention
    }
  }, [filteredBehaviorUsers, selectedLabelIds])

  const valueActiveCount = Object.values(valueFilters).reduce((sum, values) => sum + values.length, 0)
  const valueFactor = valueActiveCount > 0 ? Math.max(0.1, 1 - valueActiveCount * 0.22) : 1
  const valueUsers = Math.round(301012 * valueFactor)
  const valuePortfolio = Math.round(8430 * (0.6 + valueFactor * 0.4))
  const valuePayment = Math.round(2327 * (0.5 + valueFactor * 0.5))
  const valueTrading = Math.round(47200 * (0.4 + valueFactor * 0.6))

  const toggleMulti = <T extends string>(current: T[], next: T): T[] =>
    current.includes(next) ? current.filter((value) => value !== next) : [...current, next]

  const toggleLabel = (labelId: number) => {
    setSelectedLabelIds((current) => toggleMulti(current.map(String), String(labelId)).map(Number))
  }

  const labelTotalBase = Math.round(301012 * activeMultiplier(activeWindowFilter))

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow="User Segments"
        title="Same segment filters as the prototype, now split into maintainable typed state."
        description="The important button behaviors are restored here: tab switching, segment selection, filter pills, and the persona mapping modal."
      />

      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${tab === 'behavior' ? styles.tabActive : ''}`}
          onClick={() => setTab('behavior')}
        >
          By Behavior
        </button>
        <button
          type="button"
          className={`${styles.tab} ${tab === 'value' ? styles.tabActive : ''}`}
          onClick={() => setTab('value')}
        >
          By Value
        </button>
      </div>

      {tab === 'behavior' ? (
        <>
          <Card title="Filters" eyebrow="Behavior targeting">
            <div className={styles.filterGrid}>
              <div>
                <p className={styles.filterLabel}>Chains</p>
                <div className={styles.pills}>
                  <button
                    type="button"
                    className={`${styles.pill} ${selectedChains.length === 0 ? styles.pillActive : ''}`}
                    onClick={() => setSelectedChains([])}
                  >
                    All
                  </button>
                  {chainOptions.map((chain) => (
                    <button
                      key={chain}
                      type="button"
                      className={`${styles.pill} ${selectedChains.includes(chain) ? styles.pillActive : ''}`}
                      onClick={() => setSelectedChains((current) => toggleMulti(current, chain))}
                    >
                      {chain.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className={styles.filterLabel}>Assets</p>
                <div className={styles.pills}>
                  <button
                    type="button"
                    className={`${styles.pill} ${selectedAssets.length === 0 ? styles.pillActive : ''}`}
                    onClick={() => setSelectedAssets([])}
                  >
                    All
                  </button>
                  {assetOptions.map((asset) => (
                    <button
                      key={asset}
                      type="button"
                      className={`${styles.pill} ${selectedAssets.includes(asset) ? styles.pillActive : ''}`}
                      onClick={() => setSelectedAssets((current) => toggleMulti(current, asset))}
                    >
                      {asset}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <p className={styles.filterSummary}>
              <strong>{selectedLabelIds.length || 'All'} labels</strong> ·{' '}
              <strong>{selectedChains.length || 'All'} chains</strong> ·{' '}
              <strong>{formatNumber(filteredBehaviorUsers)} users</strong>
            </p>
          </Card>

          <div className={styles.inlineControls}>
            <div className={styles.controlLabel}>Last Active</div>
            <div className={styles.pills}>
              {(['all', '7d', '30d', '90d', '90p'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`${styles.pill} ${activeWindowFilter === value ? styles.pillActive : ''}`}
                  onClick={() => setActiveWindowFilter(value)}
                >
                  {value === 'all' ? 'All' : value === '90p' ? '90d+' : `≤ ${value}`}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.labelHeader}>
            <span>Click segments to filter</span>
            <button type="button" className={styles.infoButton} onClick={() => setShowPersonaModal(true)}>
              Persona mapping
            </button>
          </div>

          <section className={styles.labelGrid}>
            {labelSegments.map((segment) => {
              let displayUsers = segment.users

              if (selectedChains.length > 0) {
                const chainPct = selectedChains.reduce((sum, chain) => sum + (segment.chains[chain] ?? 0), 0)
                displayUsers = Math.round(displayUsers * chainPct / 100)
              }

              displayUsers = Math.round(displayUsers * activeMultiplier(activeWindowFilter))
              const displayPct = ((displayUsers / labelTotalBase) * 100).toFixed(1)

              return (
                <button
                  key={segment.id}
                  type="button"
                  className={`${styles.labelCard} ${selectedLabelIds.includes(segment.id) ? styles.labelCardActive : ''}`}
                  onClick={() => toggleLabel(segment.id)}
                >
                  <div className={styles.labelCardHeader}>
                    <span className={styles.checkbox}>{selectedLabelIds.includes(segment.id) ? '✓' : ''}</span>
                    <span className={styles.labelName}>{segment.name}</span>
                    <strong>{formatNumber(displayUsers)}</strong>
                  </div>
                  <p className={styles.labelPct}>{displayPct}% of total</p>
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
              )
            })}
          </section>

          <section className="grid-auto-4">
            <Card title="Filtered users">
              <p className={styles.metric}>{formatNumber(behaviorSummary.users)}</p>
            </Card>
            <Card title="Avg balance">
              <p className={styles.metric}>${formatNumber(behaviorSummary.avgBal)}</p>
            </Card>
            <Card title="Avg Tx frequency">
              <p className={styles.metric}>{behaviorSummary.txFreq}/mo</p>
            </Card>
            <Card title="Retention rate (30d)">
              <p className={styles.metric}>{behaviorSummary.retention}%</p>
            </Card>
          </section>
        </>
      ) : (
        <>
          <Card title="Value filters" eyebrow="Value targeting">
            <div className={styles.valueFilterStack}>
              {[
                { key: 'chains', label: 'Chains', options: chainOptions },
                { key: 'tiers', label: 'Tier', options: tierOptions },
                { key: 'assets', label: 'Asset type', options: assetOptions },
                { key: 'holdings', label: 'Holdings', options: holdOptions },
                { key: 'payments', label: 'Payment', options: paymentOptions },
                { key: 'trading', label: 'Trading Vol', options: tradingOptions },
                { key: 'tiv', label: 'Available Value', options: tivOptions }
              ].map((group) => (
                <div key={group.key}>
                  <p className={styles.filterLabel}>{group.label}</p>
                  <div className={styles.pills}>
                    <button
                      type="button"
                      className={`${styles.pill} ${valueFilters[group.key as keyof typeof valueFilters].length === 0 ? styles.pillActive : ''}`}
                      onClick={() =>
                        setValueFilters((current) => ({
                          ...current,
                          [group.key]: []
                        }))
                      }
                    >
                      All
                    </button>
                    {group.options.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`${styles.pill} ${valueFilters[group.key as keyof typeof valueFilters].includes(option) ? styles.pillActive : ''}`}
                        onClick={() =>
                          setValueFilters((current) => ({
                            ...current,
                            [group.key]: toggleMulti(current[group.key as keyof typeof valueFilters], option)
                          }))
                        }
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className={styles.filterSummary}>
              <strong>{valueActiveCount || 'All'} filters</strong> ·{' '}
              <strong>{formatNumber(valueUsers)} users</strong>
            </p>
          </Card>

          <section className="grid-auto-4">
            <Card title="Filtered users">
              <p className={styles.metric}>{formatNumber(valueUsers)}</p>
            </Card>
            <Card title="Avg portfolio">
              <p className={styles.metric}>${formatNumber(valuePortfolio)}</p>
            </Card>
            <Card title="Avg monthly payment">
              <p className={styles.metric}>${formatNumber(valuePayment)}</p>
            </Card>
            <Card title="Avg trading volume">
              <p className={styles.metric}>${formatNumber(valueTrading)}</p>
            </Card>
          </section>
        </>
      )}

      <PersonaModal open={showPersonaModal} onClose={() => setShowPersonaModal(false)} />
    </div>
  )
}
