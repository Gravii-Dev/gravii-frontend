'use client'

import Link from 'next/link'
import type { ChangeEvent, FormEvent } from 'react'
import { useEffect, useState } from 'react'

import type {
  LensCreatePoolRequest,
  LensPool,
  LensPoolProgress,
  LensPoolSummary,
  LensPoolWalletDetail,
  LensPoolWalletListResponse,
  LensPoolWalletQuery,
  LensPoolWalletSort,
} from '@gravii/domain-types'

import { PartnerDataStatus } from '@/components/ui/partner-data-status'
import { parseLensAddressesCsv } from './csv'
import {
  createLensPool,
  deleteLensPool,
  lensSupportedChains,
  readLensApiErrorMessage,
  readLensPool,
  readLensPoolProgress,
  readLensPools,
  readLensPoolWalletDetail,
  readLensPoolWallets,
  renameLensPool,
} from './lens-api'
import styles from './lens-page.module.css'

interface WalletFilterDraft {
  chain: string
  limit: string
  maxValue: string
  minValue: string
  persona: string
  search: string
  sort: LensPoolWalletSort
  status: string
  tier: string
}

const defaultWalletFilterDraft: WalletFilterDraft = {
  chain: '',
  limit: '25',
  maxValue: '',
  minValue: '',
  persona: '',
  search: '',
  sort: 'net_worth_desc',
  status: '',
  tier: '',
}

function splitFilterInput(value: string) {
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
}

function toNullableNumber(value: string) {
  const trimmed = value.trim()

  if (!trimmed) {
    return undefined
  }

  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : undefined
}

function buildWalletQuery(draft: WalletFilterDraft): LensPoolWalletQuery {
  return {
    chain: splitFilterInput(draft.chain),
    limit: Number(draft.limit),
    maxValue: toNullableNumber(draft.maxValue),
    minValue: toNullableNumber(draft.minValue),
    offset: 0,
    persona: splitFilterInput(draft.persona),
    search: draft.search.trim() || undefined,
    sort: draft.sort,
    status: splitFilterInput(draft.status),
    tier: splitFilterInput(draft.tier),
  }
}

function buildProgressFromPool(pool: LensPool): LensPoolProgress {
  const completed = pool.analyzedCount + pool.failedCount

  return {
    analyzedCount: pool.analyzedCount,
    failedCount: pool.failedCount,
    id: pool.id,
    percentage: pool.walletCount > 0 ? completed / pool.walletCount : 0,
    status: pool.status,
    walletCount: pool.walletCount,
  }
}

function formatCompactNumber(value: number | null | undefined) {
  if (value == null || !Number.isFinite(value)) {
    return '—'
  }

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
    notation: value >= 10_000 ? 'compact' : 'standard',
  }).format(value)
}

function formatUsd(value: number | null | undefined) {
  if (value == null || !Number.isFinite(value)) {
    return '—'
  }

  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    maximumFractionDigits: value >= 1_000 ? 0 : 2,
    notation: value >= 100_000 ? 'compact' : 'standard',
    style: 'currency',
  }).format(value)
}

function formatPercent(value: number | null | undefined) {
  if (value == null || !Number.isFinite(value)) {
    return '—'
  }

  return `${Math.round(value * 100)}%`
}

function formatDateTime(value: string | null | undefined) {
  if (!value) {
    return '—'
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function shortenAddress(address: string) {
  if (address.length <= 14) {
    return address
  }

  return `${address.slice(0, 8)}…${address.slice(-6)}`
}

function sortDistributionEntries(entries: Record<string, number>, scale: 'count' | 'share') {
  return Object.entries(entries)
    .sort((first, second) => second[1] - first[1])
    .map(([label, value]) => ({
      label,
      percentage: scale === 'share' ? value : 0,
      value,
    }))
}

function SummaryMetric({
  detail,
  label,
  value,
}: {
  detail: string
  label: string
  value: string
}) {
  return (
    <article className={styles.metricCard}>
      <div className={styles.metricLabel}>{label}</div>
      <div className={styles.metricValue}>{value}</div>
      <div className={styles.metricDetail}>{detail}</div>
    </article>
  )
}

function DistributionPanel({
  emptyCopy,
  items,
  labelFormatter,
  title,
  valueFormatter,
}: {
  emptyCopy: string
  items: Array<{ label: string; percentage: number; value: number }>
  labelFormatter?: (label: string) => string
  title: string
  valueFormatter?: (item: { label: string; percentage: number; value: number }) => string
}) {
  return (
    <section className={styles.distributionCard}>
      <div className={styles.sectionTitle}>{title}</div>
      {items.length > 0 ? (
        <div className={styles.distributionList}>
          {items.map((item) => (
            <div key={`${title}-${item.label}`} className={styles.distributionRow}>
              <div className={styles.distributionMeta}>
                <span className={styles.distributionLabel}>
                  {labelFormatter ? labelFormatter(item.label) : item.label}
                </span>
                <span className={styles.distributionValue}>
                  {valueFormatter ? valueFormatter(item) : formatCompactNumber(item.value)}
                </span>
              </div>
              <div className={styles.distributionTrack}>
                <div
                  className={styles.distributionFill}
                  style={{ width: `${Math.max(6, Math.round(item.percentage * 100))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.emptyCopy}>{emptyCopy}</p>
      )}
    </section>
  )
}

function WalletPreviewState({ copy }: { copy: string }) {
  return (
    <div className={styles.walletPreviewState}>
      <div className={styles.walletPreviewTitle}>Wallet detail</div>
      <p>{copy}</p>
    </div>
  )
}

export function LensPage() {
  const [activePool, setActivePool] = useState<LensPool | null>(null)
  const [composeError, setComposeError] = useState<string | null>(null)
  const [composeName, setComposeName] = useState('')
  const [composeNotice, setComposeNotice] = useState<string | null>(null)
  const [csvDraft, setCsvDraft] = useState('')
  const [isBootstrapping, setIsBootstrapping] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPoolLoading, setIsPoolLoading] = useState(false)
  const [isRenaming, setIsRenaming] = useState(false)
  const [isWalletsLoading, setIsWalletsLoading] = useState(false)
  const [pools, setPools] = useState<LensPool[]>([])
  const [poolsError, setPoolsError] = useState<string | null>(null)
  const [progress, setProgress] = useState<LensPoolProgress | null>(null)
  const [renameDraft, setRenameDraft] = useState('')
  const [selectedChains, setSelectedChains] = useState<string[]>([])
  const [selectedPoolId, setSelectedPoolId] = useState<string | null>(null)
  const [selectedWalletAddress, setSelectedWalletAddress] = useState<string | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [walletDetail, setWalletDetail] = useState<LensPoolWalletDetail | null>(null)
  const [walletDetailError, setWalletDetailError] = useState<string | null>(null)
  const [walletDetailLoading, setWalletDetailLoading] = useState(false)
  const [walletFilterDraft, setWalletFilterDraft] = useState<WalletFilterDraft>(
    defaultWalletFilterDraft
  )
  const [walletQuery, setWalletQuery] = useState<LensPoolWalletQuery>(
    buildWalletQuery(defaultWalletFilterDraft)
  )
  const [walletResult, setWalletResult] = useState<LensPoolWalletListResponse | null>(null)
  const [walletsError, setWalletsError] = useState<string | null>(null)

  const parseResult = parseLensAddressesCsv(csvDraft)
  const progressPercent = Math.round((progress?.percentage ?? 0) * 100)

  useEffect(() => {
    let cancelled = false

    const bootstrap = async () => {
      setIsBootstrapping(true)

      try {
        const nextPools = await readLensPools()

        if (cancelled) {
          return
        }

        setPools(nextPools)
        setPoolsError(null)
        setSelectedPoolId((current) => {
          if (current && nextPools.some((pool) => pool.id === current)) {
            return current
          }

          return nextPools[0]?.id ?? null
        })
      } catch (error) {
        if (!cancelled) {
          setPoolsError(readLensApiErrorMessage(error, 'Unable to load Lens pools.'))
        }
      } finally {
        if (!cancelled) {
          setIsBootstrapping(false)
        }
      }
    }

    void bootstrap()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!selectedPoolId) {
      setActivePool(null)
      setProgress(null)
      setRenameDraft('')
      setWalletResult(null)
      setWalletsError(null)
      setSelectedWalletAddress(null)
      setWalletDetail(null)
      setWalletDetailError(null)
      return
    }

    let cancelled = false

    const loadPool = async () => {
      setIsPoolLoading(true)
      setIsWalletsLoading(true)

      try {
        const [nextPool, nextWallets] = await Promise.all([
          readLensPool(selectedPoolId),
          readLensPoolWallets(selectedPoolId, walletQuery),
        ])

        if (cancelled) {
          return
        }

        setActivePool(nextPool)
        setProgress(buildProgressFromPool(nextPool))
        setRenameDraft(nextPool.name)
        setWalletResult(nextWallets)
        setWalletsError(null)
        setSelectedWalletAddress(null)
        setWalletDetail(null)
        setWalletDetailError(null)
      } catch (error) {
        if (!cancelled) {
          const message = readLensApiErrorMessage(error, 'Unable to load the selected Lens pool.')
          setActivePool(null)
          setProgress(null)
          setWalletResult(null)
          setWalletsError(message)
        }
      } finally {
        if (!cancelled) {
          setIsPoolLoading(false)
          setIsWalletsLoading(false)
        }
      }
    }

    void loadPool()

    return () => {
      cancelled = true
    }
  }, [selectedPoolId, walletQuery])

  useEffect(() => {
    if (
      !selectedPoolId ||
      !activePool ||
      (activePool.status !== 'pending' && activePool.status !== 'analyzing')
    ) {
      return
    }

    let cancelled = false

    const interval = window.setInterval(async () => {
      try {
        const nextProgress = await readLensPoolProgress(selectedPoolId)

        if (cancelled) {
          return
        }

        setProgress(nextProgress)

        if (nextProgress.status === 'complete' || nextProgress.status === 'failed') {
          const [nextPool, nextPools, nextWallets] = await Promise.all([
            readLensPool(selectedPoolId),
            readLensPools(),
            readLensPoolWallets(selectedPoolId, walletQuery),
          ])

          if (cancelled) {
            return
          }

          setActivePool(nextPool)
          setPools(nextPools)
          setWalletResult(nextWallets)
          setWalletsError(null)
        }
      } catch (error) {
        if (!cancelled) {
          setWalletsError(
            readLensApiErrorMessage(error, 'Unable to refresh Lens progress right now.')
          )
        }
      }
    }, 2500)

    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [activePool, selectedPoolId, walletQuery])

  useEffect(() => {
    if (!selectedPoolId || !selectedWalletAddress) {
      return
    }

    let cancelled = false

    const loadWalletDetail = async () => {
      setWalletDetailLoading(true)
      setWalletDetailError(null)

      try {
        const nextWalletDetail = await readLensPoolWalletDetail(
          selectedPoolId,
          selectedWalletAddress
        )

        if (!cancelled) {
          setWalletDetail(nextWalletDetail)
        }
      } catch (error) {
        if (!cancelled) {
          setWalletDetail(null)
          setWalletDetailError(
            readLensApiErrorMessage(error, 'Unable to load the selected wallet detail.')
          )
        }
      } finally {
        if (!cancelled) {
          setWalletDetailLoading(false)
        }
      }
    }

    void loadWalletDetail()

    return () => {
      cancelled = true
    }
  }, [selectedPoolId, selectedWalletAddress])

  const handleCsvFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const text = await file.text()
    setUploadedFileName(file.name)
    setCsvDraft(text)
    setComposeNotice(null)
    setComposeError(null)
  }

  const handleChainToggle = (chain: string) => {
    setSelectedChains((current) =>
      current.includes(chain)
        ? current.filter((entry) => entry !== chain)
        : [...current, chain]
    )
  }

  const handleCreatePool = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setComposeError(null)
    setComposeNotice(null)

    if (!composeName.trim()) {
      setComposeError('Enter a pool name before creating a Lens analysis.')
      return
    }

    if (selectedChains.length === 0) {
      setComposeError('Select at least one chain for this pool.')
      return
    }

    if (parseResult.addresses.length === 0) {
      setComposeError('Paste or upload at least one wallet address.')
      return
    }

    if (parseResult.addresses.length > 100) {
      setComposeError('Lens supports up to 100 wallet addresses per pool.')
      return
    }

    setIsCreating(true)

    try {
      const nextPoolInput: LensCreatePoolRequest = {
        addresses: parseResult.addresses,
        chains: selectedChains,
        name: composeName.trim(),
      }

      const createdPool = await createLensPool(nextPoolInput)

      setPools((current) => [
        createdPool,
        ...current.filter((pool) => pool.id !== createdPool.id),
      ])
      setSelectedPoolId(createdPool.id)
      setActivePool(createdPool)
      setProgress(buildProgressFromPool(createdPool))
      setComposeNotice(
        `Created ${createdPool.name} with ${createdPool.walletCount} wallets. Analysis is now running in the background.`
      )
      setComposeName('')
      setCsvDraft('')
      setUploadedFileName(null)
      setSelectedChains([])
      setWalletFilterDraft(defaultWalletFilterDraft)
      setWalletQuery(buildWalletQuery(defaultWalletFilterDraft))
    } catch (error) {
      setComposeError(readLensApiErrorMessage(error, 'Unable to create the Lens pool.'))
    } finally {
      setIsCreating(false)
    }
  }

  const handleRenamePool = async () => {
    if (!selectedPoolId || !renameDraft.trim() || renameDraft.trim() === activePool?.name) {
      return
    }

    setIsRenaming(true)

    try {
      const updatedPool = await renameLensPool(selectedPoolId, {
        name: renameDraft.trim(),
      })

      setActivePool(updatedPool)
      setPools((current) =>
        current.map((pool) => (pool.id === updatedPool.id ? updatedPool : pool))
      )
    } catch (error) {
      setComposeError(readLensApiErrorMessage(error, 'Unable to rename the pool.'))
    } finally {
      setIsRenaming(false)
    }
  }

  const handleDeletePool = async () => {
    if (!selectedPoolId || !activePool) {
      return
    }

    const shouldDelete = window.confirm(
      `Delete ${activePool.name}? This hides the pool from Lens.`
    )

    if (!shouldDelete) {
      return
    }

    setIsDeleting(true)

    try {
      await deleteLensPool(selectedPoolId)

      const nextPools = pools.filter((pool) => pool.id !== selectedPoolId)
      setPools(nextPools)
      setSelectedPoolId(nextPools[0]?.id ?? null)
      setComposeNotice(`${activePool.name} was removed from the Lens workspace.`)
    } catch (error) {
      setComposeError(readLensApiErrorMessage(error, 'Unable to delete the pool.'))
    } finally {
      setIsDeleting(false)
    }
  }

  const handleApplyFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setWalletQuery(buildWalletQuery(walletFilterDraft))
  }

  const handleResetFilters = () => {
    setWalletFilterDraft(defaultWalletFilterDraft)
    setWalletQuery(buildWalletQuery(defaultWalletFilterDraft))
  }

  const handleRefreshPools = async () => {
    try {
      const nextPools = await readLensPools()
      setPools(nextPools)
      setPoolsError(null)

      if (selectedPoolId && !nextPools.some((pool) => pool.id === selectedPoolId)) {
        setSelectedPoolId(nextPools[0]?.id ?? null)
      }
    } catch (error) {
      setPoolsError(readLensApiErrorMessage(error, 'Unable to refresh Lens pools.'))
    }
  }

  const canGoBackward = Boolean(walletResult && walletResult.offset > 0)
  const canGoForward = Boolean(
    walletResult &&
      walletResult.offset + walletResult.wallets.length < walletResult.total
  )

  const summary = activePool?.summary
  const tierItems = summary
    ? sortDistributionEntries(summary.tierDistribution, 'count').map((item) => ({
        ...item,
        percentage:
          activePool.walletCount > 0 ? item.value / activePool.walletCount : 0,
      }))
    : []
  const segmentItems = summary
    ? summary.segmentBreakdown.map((item) => ({
        label: item.name,
        percentage:
          activePool && activePool.walletCount > 0
            ? item.count / activePool.walletCount
            : 0,
        value: item.count,
      }))
    : []
  const chainItems = summary
    ? sortDistributionEntries(summary.chainDistribution, 'share')
    : []

  return (
    <div className={styles.page}>
      <div className={styles.mainHeader}>
        <div>
          <h1 className={styles.mainTitle}>Gravii Lens</h1>
          <p className={styles.mainSubcopy}>
            Upload wallet cohorts, monitor batch progress, and drill into live X-Ray results.
          </p>
        </div>
        <button
          type="button"
          className="button-secondary"
          onClick={() => void handleRefreshPools()}
        >
          Refresh Pools
        </button>
      </div>

      <PartnerDataStatus surface="lens" />

      <div className={styles.topGrid}>
        <section className={styles.composerCard}>
          <div className={styles.cardHeader}>
            <div>
              <div className={styles.cardEyebrow}>Create Pool</div>
              <div className={styles.cardTitle}>Upload a Lens cohort</div>
            </div>
            <span className={styles.cardMeta}>Max 100 wallets</span>
          </div>

          <form className={styles.composerForm} onSubmit={handleCreatePool}>
            <label className={styles.fieldLabel}>
              Pool name
              <input
                className={styles.textInput}
                onChange={(event) => setComposeName(event.target.value)}
                placeholder="Pendle power users"
                value={composeName}
              />
            </label>

            <div className={styles.fieldGroup}>
              <div className={styles.fieldLabel}>Chains</div>
              <div className={styles.chainGrid}>
                {lensSupportedChains.map((chain) => (
                  <button
                    key={chain}
                    type="button"
                    className={`${styles.chainChip} ${
                      selectedChains.includes(chain) ? styles.chainChipActive : ''
                    }`}
                    onClick={() => handleChainToggle(chain)}
                  >
                    {chain}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.fileRow}>
              <label className={styles.fileButton}>
                <input
                  accept=".csv,text/csv"
                  className={styles.fileInput}
                  onChange={(event) => void handleCsvFile(event)}
                  type="file"
                />
                Load CSV
              </label>
              <span className={styles.fileHint}>
                {uploadedFileName ?? 'Header `address` optional. One wallet per row.'}
              </span>
            </div>

            <label className={styles.fieldLabel}>
              Wallet CSV or paste buffer
              <textarea
                className={styles.textArea}
                onChange={(event) => setCsvDraft(event.target.value)}
                placeholder={'address\n0x1234...\n0xabcd...'}
                value={csvDraft}
              />
            </label>

            <div className={styles.parseSummary}>
              <span>{parseResult.addresses.length} wallets ready</span>
              <span>{parseResult.duplicatesRemoved} duplicates removed</span>
              <span>{parseResult.skippedRows} rows skipped</span>
            </div>

            {composeError ? <p className={styles.errorCopy}>{composeError}</p> : null}
            {composeNotice ? <p className={styles.noticeCopy}>{composeNotice}</p> : null}

            <div className={styles.heroActionRow}>
              <button
                type="submit"
                className="button-primary"
                disabled={isCreating}
              >
                {isCreating ? 'Creating Pool…' : 'Create Lens Pool'}
              </button>
            </div>
          </form>
        </section>

        <section className={styles.poolListCard}>
          <div className={styles.cardHeader}>
            <div>
              <div className={styles.cardEyebrow}>Library</div>
              <div className={styles.cardTitle}>Recent Lens pools</div>
            </div>
            <span className={styles.cardMeta}>{pools.length} total</span>
          </div>

          {isBootstrapping ? <p className={styles.emptyCopy}>Loading Lens pools…</p> : null}
          {!isBootstrapping && poolsError ? (
            <p className={styles.errorCopy}>{poolsError}</p>
          ) : null}
          {!isBootstrapping && !poolsError && pools.length === 0 ? (
            <p className={styles.emptyCopy}>
              No Lens pools yet. Upload your first cohort to start background X-Ray analysis.
            </p>
          ) : null}

          {pools.length > 0 ? (
            <div className={styles.poolList}>
              {pools.map((pool) => {
                const poolProgress = Math.round(buildProgressFromPool(pool).percentage * 100)

                return (
                  <button
                    key={pool.id}
                    type="button"
                    className={`${styles.poolCard} ${
                      selectedPoolId === pool.id ? styles.poolCardActive : ''
                    }`}
                    onClick={() => setSelectedPoolId(pool.id)}
                  >
                    <div className={styles.poolCardHeader}>
                      <span className={styles.poolName}>{pool.name}</span>
                      <span className={styles.poolStatus}>{pool.status}</span>
                    </div>
                    <div className={styles.poolMeta}>
                      <span>{pool.walletCount} wallets</span>
                      <span>{poolProgress}% done</span>
                    </div>
                    <div className={styles.poolTimestamp}>
                      Updated {formatDateTime(pool.updatedAt)}
                    </div>
                  </button>
                )
              })}
            </div>
          ) : null}
        </section>
      </div>

      {selectedPoolId ? (
        <div className={styles.reportStack}>
          <section className={styles.reportCard}>
            <div className={styles.cardHeader}>
              <div>
                <div className={styles.cardEyebrow}>Active Pool</div>
                <div className={styles.cardTitle}>Lens analysis workspace</div>
              </div>
              <div className={styles.inlineActions}>
                <button
                  type="button"
                  className="button-secondary"
                  disabled={!activePool || isPoolLoading}
                  onClick={() => {
                    if (selectedPoolId) {
                      setWalletQuery((current) => ({ ...current }))
                    }
                  }}
                >
                  Refresh Active
                </button>
                <button
                  type="button"
                  className="button-secondary"
                  disabled={!activePool || isDeleting}
                  onClick={() => void handleDeletePool()}
                >
                  {isDeleting ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>

            {isPoolLoading && !activePool ? (
              <p className={styles.emptyCopy}>Loading the selected Lens pool…</p>
            ) : null}

            {activePool ? (
              <>
                <div className={styles.poolHeaderRow}>
                  <label className={styles.renameField}>
                    <span className={styles.fieldLabel}>Pool name</span>
                    <div className={styles.renameRow}>
                      <input
                        className={styles.textInput}
                        onChange={(event) => setRenameDraft(event.target.value)}
                        value={renameDraft}
                      />
                      <button
                        type="button"
                        className="button-secondary"
                        disabled={isRenaming || renameDraft.trim() === '' || renameDraft === activePool.name}
                        onClick={() => void handleRenamePool()}
                      >
                        {isRenaming ? 'Saving…' : 'Rename'}
                      </button>
                    </div>
                  </label>
                  <div className={styles.poolFacts}>
                    <span>Status: {activePool.status}</span>
                    <span>Created: {formatDateTime(activePool.createdAt)}</span>
                    <span>Last analyzed: {formatDateTime(activePool.lastAnalyzedAt)}</span>
                  </div>
                </div>

                {progress ? (
                  <div className={styles.progressCard}>
                    <div className={styles.progressHeader}>
                      <span>Pool progress</span>
                      <span>{progressPercent}%</span>
                    </div>
                    <div className={styles.progressTrack}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${Math.max(progressPercent, 4)}%` }}
                      />
                    </div>
                    <div className={styles.progressMeta}>
                      <span>{progress.analyzedCount} analyzed</span>
                      <span>{progress.failedCount} failed</span>
                      <span>{progress.walletCount} total</span>
                    </div>
                  </div>
                ) : null}

                {summary ? (
                  <>
                    <div className={styles.metricsGrid}>
                      <SummaryMetric
                        detail={`${activePool.walletCount} wallets in cohort`}
                        label="Aggregate value"
                        value={formatUsd(summary.totalValueUsd)}
                      />
                      <SummaryMetric
                        detail="Most common behavior in this pool"
                        label="Top segment"
                        value={
                          summary.topSegment
                            ? `${summary.topSegment.name} · ${formatPercent(summary.topSegment.percentage)}`
                            : '—'
                        }
                      />
                      <SummaryMetric
                        detail="Transactions in the last 90 days"
                        label="Active wallets"
                        value={formatCompactNumber(summary.activeWallets)}
                      />
                      <SummaryMetric
                        detail="No recent activity or still pending"
                        label="Inactive wallets"
                        value={formatCompactNumber(summary.inactiveWallets)}
                      />
                    </div>

                    <div className={styles.summaryGrid}>
                      <DistributionPanel
                        emptyCopy="Tier distribution will appear once wallets finish processing."
                        items={tierItems}
                        labelFormatter={(label) => label.toUpperCase()}
                        title="Tier distribution"
                      />
                      <DistributionPanel
                        emptyCopy="Persona breakdown will appear once wallets finish processing."
                        items={segmentItems}
                        title="Behavioral segments"
                      />
                      <DistributionPanel
                        emptyCopy="Chain distribution will appear once wallets finish processing."
                        items={chainItems}
                        title="Primary chains"
                        valueFormatter={(item) => formatPercent(item.percentage)}
                      />
                    </div>
                  </>
                ) : (
                  <p className={styles.emptyCopy}>
                    Summary metrics will appear here once the batch finishes and the backend
                    writes the aggregate snapshot.
                  </p>
                )}
              </>
            ) : null}
          </section>

          <section className={styles.walletsCard}>
            <div className={styles.cardHeader}>
              <div>
                <div className={styles.cardEyebrow}>Wallet Browser</div>
                <div className={styles.cardTitle}>Filtered wallet list</div>
              </div>
              <span className={styles.cardMeta}>
                {walletResult ? `${walletResult.total} matches` : 'Waiting for pool'}
              </span>
            </div>

            <form className={styles.filterGrid} onSubmit={handleApplyFilters}>
              <label className={styles.filterField}>
                Search
                <input
                  className={styles.textInput}
                  onChange={(event) =>
                    setWalletFilterDraft((current) => ({
                      ...current,
                      search: event.target.value,
                    }))
                  }
                  placeholder="0xabc…"
                  value={walletFilterDraft.search}
                />
              </label>

              <label className={styles.filterField}>
                Tier
                <input
                  className={styles.textInput}
                  onChange={(event) =>
                    setWalletFilterDraft((current) => ({
                      ...current,
                      tier: event.target.value,
                    }))
                  }
                  placeholder="gold,platinum"
                  value={walletFilterDraft.tier}
                />
              </label>

              <label className={styles.filterField}>
                Persona
                <input
                  className={styles.textInput}
                  onChange={(event) =>
                    setWalletFilterDraft((current) => ({
                      ...current,
                      persona: event.target.value,
                    }))
                  }
                  placeholder="Chain Hopper"
                  value={walletFilterDraft.persona}
                />
              </label>

              <label className={styles.filterField}>
                Chain
                <input
                  className={styles.textInput}
                  onChange={(event) =>
                    setWalletFilterDraft((current) => ({
                      ...current,
                      chain: event.target.value,
                    }))
                  }
                  placeholder="ethereum,base"
                  value={walletFilterDraft.chain}
                />
              </label>

              <label className={styles.filterField}>
                Status
                <input
                  className={styles.textInput}
                  onChange={(event) =>
                    setWalletFilterDraft((current) => ({
                      ...current,
                      status: event.target.value,
                    }))
                  }
                  placeholder="pending,analyzed"
                  value={walletFilterDraft.status}
                />
              </label>

              <label className={styles.filterField}>
                Min value
                <input
                  className={styles.textInput}
                  inputMode="decimal"
                  onChange={(event) =>
                    setWalletFilterDraft((current) => ({
                      ...current,
                      minValue: event.target.value,
                    }))
                  }
                  placeholder="1000"
                  value={walletFilterDraft.minValue}
                />
              </label>

              <label className={styles.filterField}>
                Max value
                <input
                  className={styles.textInput}
                  inputMode="decimal"
                  onChange={(event) =>
                    setWalletFilterDraft((current) => ({
                      ...current,
                      maxValue: event.target.value,
                    }))
                  }
                  placeholder="50000"
                  value={walletFilterDraft.maxValue}
                />
              </label>

              <label className={styles.filterField}>
                Sort
                <select
                  className={styles.selectInput}
                  onChange={(event) =>
                    setWalletFilterDraft((current) => ({
                      ...current,
                      sort: event.target.value as LensPoolWalletSort,
                    }))
                  }
                  value={walletFilterDraft.sort}
                >
                  <option value="net_worth_desc">Net worth ↓</option>
                  <option value="net_worth_asc">Net worth ↑</option>
                  <option value="added_desc">Recently added</option>
                  <option value="transactions_desc">Transactions ↓</option>
                  <option value="age_desc">Wallet age ↓</option>
                </select>
              </label>

              <label className={styles.filterField}>
                Page size
                <select
                  className={styles.selectInput}
                  onChange={(event) =>
                    setWalletFilterDraft((current) => ({
                      ...current,
                      limit: event.target.value,
                    }))
                  }
                  value={walletFilterDraft.limit}
                >
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </label>

              <div className={styles.filterActions}>
                <button type="submit" className="button-primary">
                  Apply Filters
                </button>
                <button
                  type="button"
                  className="button-secondary"
                  onClick={handleResetFilters}
                >
                  Reset
                </button>
              </div>
            </form>

            {walletsError ? <p className={styles.errorCopy}>{walletsError}</p> : null}

            <div className={styles.walletTableWrap}>
              <div className={styles.walletTableHead}>
                <span>Address</span>
                <span>Status</span>
                <span>Tier</span>
                <span>Persona</span>
                <span>Primary chain</span>
                <span>Net worth</span>
              </div>

              {isWalletsLoading ? (
                <p className={styles.emptyCopy}>Loading wallet rows…</p>
              ) : null}

              {!isWalletsLoading && walletResult && walletResult.wallets.length === 0 ? (
                <p className={styles.emptyCopy}>
                  No wallets match the current filters for this pool.
                </p>
              ) : null}

              {!isWalletsLoading && walletResult
                ? walletResult.wallets.map((wallet) => (
                    <button
                      key={wallet.address}
                      type="button"
                      className={`${styles.walletRow} ${
                        selectedWalletAddress === wallet.address ? styles.walletRowActive : ''
                      }`}
                      onClick={() => setSelectedWalletAddress(wallet.address)}
                    >
                      <span className={styles.walletAddress}>{shortenAddress(wallet.address)}</span>
                      <span>{wallet.status}</span>
                      <span>{wallet.tier ?? '—'}</span>
                      <span>{wallet.topPersona ?? '—'}</span>
                      <span>{wallet.primaryChain ?? '—'}</span>
                      <span>{formatUsd(wallet.netWorthUsd)}</span>
                    </button>
                  ))
                : null}
            </div>

            <div className={styles.paginationRow}>
              <span>
                {walletResult
                  ? `Showing ${walletResult.offset + 1}-${walletResult.offset + walletResult.wallets.length} of ${walletResult.total}`
                  : 'No wallet rows loaded yet.'}
              </span>
              <div className={styles.inlineActions}>
                <button
                  type="button"
                  className="button-secondary"
                  disabled={!canGoBackward}
                  onClick={() =>
                    setWalletQuery((current) => ({
                      ...current,
                      offset: Math.max(0, (current.offset ?? 0) - (current.limit ?? 25)),
                    }))
                  }
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="button-secondary"
                  disabled={!canGoForward}
                  onClick={() =>
                    setWalletQuery((current) => ({
                      ...current,
                      offset: (current.offset ?? 0) + (current.limit ?? 25),
                    }))
                  }
                >
                  Next
                </button>
              </div>
            </div>
          </section>

          <section className={styles.detailCard}>
            <div className={styles.cardHeader}>
              <div>
                <div className={styles.cardEyebrow}>Drill-down</div>
                <div className={styles.cardTitle}>Selected wallet</div>
              </div>
              {selectedWalletAddress ? (
                <span className={styles.cardMeta}>{shortenAddress(selectedWalletAddress)}</span>
              ) : null}
            </div>

            {walletDetailLoading ? (
              <WalletPreviewState copy="Loading the full X-Ray payload for this wallet…" />
            ) : null}

            {!walletDetailLoading && walletDetailError ? (
              <p className={styles.errorCopy}>{walletDetailError}</p>
            ) : null}

            {!walletDetailLoading && !walletDetail && !walletDetailError ? (
              <WalletPreviewState copy="Select a wallet row to inspect its full Lens drill-down." />
            ) : null}

            {walletDetail ? (
              <div className={styles.detailStack}>
                <div className={styles.detailHero}>
                  <div className={styles.detailAddress}>{walletDetail.address}</div>
                  <div className={styles.detailMeta}>
                    <span>{walletDetail.status}</span>
                    <span>{walletDetail.tier ?? '—'}</span>
                    <span>{walletDetail.primaryChain ?? '—'}</span>
                    <span>{formatUsd(walletDetail.netWorthUsd)}</span>
                  </div>
                </div>

                <div className={styles.detailMetrics}>
                  <SummaryMetric
                    detail="Top persona"
                    label="Persona"
                    value={walletDetail.topPersona ?? '—'}
                  />
                  <SummaryMetric
                    detail="Transactions in the last 90 days"
                    label="Transactions"
                    value={formatCompactNumber(walletDetail.transactions90d)}
                  />
                  <SummaryMetric
                    detail="Days since first on-chain activity"
                    label="Wallet age"
                    value={formatCompactNumber(walletDetail.walletAgeDays)}
                  />
                  <SummaryMetric
                    detail={`Analyzed ${formatDateTime(walletDetail.analyzedAt)}`}
                    label="Processed"
                    value={formatDateTime(walletDetail.processedAt)}
                  />
                </div>

                {walletDetail.error ? (
                  <p className={styles.errorCopy}>{walletDetail.error}</p>
                ) : null}

                <div className={styles.jsonCard}>
                  <div className={styles.sectionTitle}>Full X-Ray payload</div>
                  {walletDetail.xray ? (
                    <pre className={styles.jsonPre}>
                      {JSON.stringify(walletDetail.xray, null, 2)}
                    </pre>
                  ) : (
                    <p className={styles.emptyCopy}>
                      This wallet is still pending analysis, so the full payload has not been
                      written yet.
                    </p>
                  )}
                </div>
              </div>
            ) : null}
          </section>

          <section className={styles.reachBanner}>
            <div className={styles.reachBannerCopy}>
              Lens is now live for cohort analysis. Broader dashboard-grade analytics are still
              preview-backed, so open them with that expectation.
            </div>
            <div className={styles.bannerLinks}>
              <Link href="/dashboard" className={styles.bannerLink}>
                Open Dashboard →
              </Link>
              <Link href="/connect?module=xray-link" className={styles.reachLink}>
                Launch on Reach →
              </Link>
            </div>
          </section>
        </div>
      ) : (
        <section className={styles.emptyStateCard}>
          <div className={styles.cardTitle}>No pool selected</div>
          <p className={styles.emptyCopy}>
            Create a Lens cohort or choose an existing pool to open its progress, summary, and
            wallet browser.
          </p>
        </section>
      )}
    </div>
  )
}
