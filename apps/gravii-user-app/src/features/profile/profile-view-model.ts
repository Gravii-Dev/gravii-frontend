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
  personaIndex: number
  reputation: string
  reputationFlags: string
  tier: string
  transactionCount: string
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

function formatPercent(value: number | null) {
  if (value === null) {
    return '—'
  }

  const formatted = Math.abs(value).toFixed(value >= 100 ? 0 : 1)
  return `${value >= 0 ? '+' : '-'}${formatted}%`
}

function findPersonaIndex(name: string) {
  const normalizedName = name.trim().toLowerCase()

  const index = PERSONA_ITEMS.findIndex(
    (persona) => persona.name.trim().toLowerCase() === normalizedName
  )

  return index >= 0 ? index : 0
}

export function getProfileSnapshot(identity: GraviiIdentity): ProfileSnapshot {
  return {
    activeSince: identity.activeSince,
    alsoIndexes: identity.adjacentPersonas.slice(0, 2).map(findPersonaIndex),
    analyzedAt: identity.analyzedAt,
    defiMeta: `${identity.defiProtocolsCount} protocol${
      identity.defiProtocolsCount === 1 ? '' : 's'
    }`,
    homeChain: titleCase(identity.homeChain),
    homeChainMeta:
      identity.otherActiveChains.length > 0
        ? identity.otherActiveChains.slice(0, 4).map(titleCase).join(' · ')
        : 'Primary footprint',
    matchedLabel: 'MY SPACE →',
    personaIndex: findPersonaIndex(identity.topPersona),
    reputation: titleCase(identity.reputation),
    reputationFlags:
      identity.reputationFlags.length > 0
        ? identity.reputationFlags.join(' · ')
        : 'No flags',
    tier: titleCase(identity.tier),
    transactionCount: formatNumber(identity.transactions90d),
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
