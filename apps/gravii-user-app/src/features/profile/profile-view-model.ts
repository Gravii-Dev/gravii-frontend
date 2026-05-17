import type { GraviiIdentity } from '@/lib/auth/user-api'

import { PERSONA_ITEMS } from '@/features/profile/persona-data'

export interface ProfileSnapshot {
  activeSince: string
  alsoIndexes: number[]
  analyzedAt: string
  defiMeta: string
  homeChain: string
  homeChainMeta: string
  matchedLabel: string
  matchedCount: string
  nftsCollected: string
  personaIndex: number
  reputation: string
  reputationFlags: string
  standoutMeta: string
  standoutRank: string
  tier: string
  transactionCount: string
  transactionMeta: string
  trend: string
  trendMeta: string
}

function titleCase(input: string) {
  return input
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function compactChainLabel(input: string) {
  const normalized = input.trim().toLowerCase()
  const knownLabels: Record<string, string> = {
    arb: 'ARB',
    arbitrum: 'ARB',
    base: 'Base',
    bnb: 'BSC',
    bsc: 'BSC',
    eth: 'ETH',
    ethereum: 'ETH',
    optimism: 'OP',
    polygon: 'Polygon',
  }

  return knownLabels[normalized] ?? titleCase(input)
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    maximumFractionDigits: value >= 1000 ? 0 : 2,
    style: 'currency',
  }).format(value)
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value)
}

function formatOptionalCount(value: number | null) {
  return value === null ? '—' : formatNumber(value)
}

function formatPercent(value: number | null) {
  if (value === null) {
    return '—'
  }

  const formatted = Math.abs(value).toFixed(value >= 100 ? 0 : 1)
  return `${value >= 0 ? '+' : '-'}${formatted}%`
}

function formatMonthYear(input: string) {
  const date = new Date(input)

  if (Number.isNaN(date.getTime())) {
    return titleCase(input)
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function findPersonaIndex(name: string) {
  const normalizedName = name.trim().toLowerCase()

  const index = PERSONA_ITEMS.findIndex(
    (persona) => persona.name.trim().toLowerCase() === normalizedName
  )

  return index >= 0 ? index : 0
}

export function getProfileSnapshot(identity: GraviiIdentity): ProfileSnapshot {
  const activeChains = [
    identity.homeChain,
    ...identity.otherActiveChains,
  ]
    .filter(Boolean)
    .slice(0, 4)
    .map(compactChainLabel)

  return {
    activeSince: formatMonthYear(identity.activeSince),
    alsoIndexes: identity.adjacentPersonas.slice(0, 2).map(findPersonaIndex),
    analyzedAt: identity.analyzedAt,
    defiMeta: `${identity.defiProtocolsCount} protocol${
      identity.defiProtocolsCount === 1 ? '' : 's'
    }`,
    homeChain: titleCase(identity.homeChain),
    homeChainMeta:
      activeChains.length > 0
        ? activeChains.join(' · ')
        : 'Primary footprint',
    matchedLabel: 'DISCOVERY →',
    matchedCount: formatOptionalCount(identity.matchedCampaignsCount),
    nftsCollected: formatOptionalCount(identity.nftsCollectedCount),
    personaIndex: findPersonaIndex(identity.topPersona),
    reputation: titleCase(identity.reputation),
    reputationFlags:
      identity.reputationFlags.length > 0
        ? identity.reputationFlags.join(' · ')
        : 'No flags',
    standoutMeta: identity.standoutMetric
      ? `in ${titleCase(identity.standoutMetric)}`
      : 'rank pending',
    standoutRank:
      identity.standoutRank === null
        ? '—'
        : `#${formatNumber(identity.standoutRank)}`,
    tier: titleCase(identity.tier),
    transactionCount:
      identity.transactionsAllTime === null
        ? '—'
        : formatNumber(identity.transactionsAllTime),
    transactionMeta:
      identity.transactionsAllTime === null
        ? 'not returned yet'
        : 'all-time',
    trend: formatPercent(identity.portfolioTrend30d),
    trendMeta: formatCurrency(identity.tradingVolume30d),
  }
}

export function getProfileNetWorthLabel(identity: GraviiIdentity) {
  return formatCurrency(identity.netWorthUsd)
}

export function getProfileDefiValue(identity: GraviiIdentity) {
  return formatCurrency(identity.defiTvlUsd)
}
