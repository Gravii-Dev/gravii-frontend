'use client'

import { ApiClientError } from '@gravii/api-clients'
import type {
  LensCreatePoolRequest,
  LensDeletePoolResponse,
  LensPool,
  LensPoolListResponse,
  LensPoolProgress,
  LensPoolSummary,
  LensPoolWalletDetail,
  LensPoolWalletListResponse,
  LensPoolWalletQuery,
  LensRenamePoolRequest,
  LensSegmentBreakdownRow,
  LensSupportedChain,
  LensTopSegment,
} from '@gravii/domain-types'

import { createAuthenticatedPartnerApiClient } from '@/lib/auth/partner-api'

interface LensTopSegmentWire {
  name: string
  percentage: number
}

interface LensSegmentBreakdownRowWire {
  count: number
  name: string
}

interface LensPoolSummaryWire {
  active_wallets: number
  chain_distribution: Record<string, number>
  computed_at: string
  inactive_wallets: number
  segment_breakdown: LensSegmentBreakdownRowWire[]
  sybil_count: number | null
  sybil_ratio: number | null
  tier_distribution: Record<string, number>
  top_segment: LensTopSegmentWire | null
  total_value_usd: number
}

interface LensPoolWire {
  analyzed_count: number
  chains: string[]
  created_at: string
  failed_count: number
  id: string
  last_analyzed_at: string | null
  name: string
  partner_id: string
  schedule: Record<string, unknown> | null
  status: LensPool['status']
  summary: LensPoolSummaryWire | null
  updated_at: string
  wallet_count: number
}

interface LensPoolListResponseWire {
  pools: LensPoolWire[]
}

interface LensPoolProgressWire {
  analyzed_count: number
  failed_count: number
  id: string
  percentage: number
  status: LensPool['status']
  wallet_count: number
}

interface LensPoolWalletWire {
  added_at: string
  address: string
  analyzed_at: string | null
  net_worth_usd: string | null
  primary_chain: string | null
  status: string
  tier: string | null
  top_persona: string | null
  transactions_90d: number | null
  wallet_age_days: number | null
}

interface LensPoolWalletListResponseWire {
  limit: number
  offset: number
  total: number
  wallets: LensPoolWalletWire[]
}

interface LensPoolWalletDetailWire extends LensPoolWalletWire {
  error: string | null
  processed_at: string | null
  xray: Record<string, unknown> | null
}

export const lensSupportedChains: readonly LensSupportedChain[] = [
  'ethereum',
  'base',
  'arbitrum',
  'polygon',
  'optimism',
  'bsc',
  'avalanche',
  'hyperliquid',
  'kaia',
  'solana',
] as const

function toNullableNumber(value: number | string | null | undefined): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }

  return null
}

function normalizeTopSegment(
  segment: LensTopSegmentWire | null
): LensTopSegment | null {
  if (!segment) {
    return null
  }

  return {
    name: segment.name,
    percentage: segment.percentage,
  }
}

function normalizeSegmentBreakdown(
  rows: LensSegmentBreakdownRowWire[]
): LensSegmentBreakdownRow[] {
  return rows.map((row) => ({
    count: row.count,
    name: row.name,
  }))
}

function normalizePoolSummary(summary: LensPoolSummaryWire | null): LensPoolSummary | null {
  if (!summary) {
    return null
  }

  return {
    activeWallets: summary.active_wallets,
    chainDistribution: summary.chain_distribution,
    computedAt: summary.computed_at,
    inactiveWallets: summary.inactive_wallets,
    segmentBreakdown: normalizeSegmentBreakdown(summary.segment_breakdown),
    sybilCount: summary.sybil_count,
    sybilRatio: summary.sybil_ratio,
    tierDistribution: summary.tier_distribution,
    topSegment: normalizeTopSegment(summary.top_segment),
    totalValueUsd: summary.total_value_usd,
  }
}

function normalizePool(pool: LensPoolWire): LensPool {
  return {
    analyzedCount: pool.analyzed_count,
    chains: pool.chains,
    createdAt: pool.created_at,
    failedCount: pool.failed_count,
    id: pool.id,
    lastAnalyzedAt: pool.last_analyzed_at,
    name: pool.name,
    partnerId: pool.partner_id,
    schedule: pool.schedule,
    status: pool.status,
    summary: normalizePoolSummary(pool.summary),
    updatedAt: pool.updated_at,
    walletCount: pool.wallet_count,
  }
}

function normalizeWallet(wallet: LensPoolWalletWire): LensPoolWalletDetail {
  return {
    addedAt: wallet.added_at,
    address: wallet.address,
    analyzedAt: wallet.analyzed_at,
    error: null,
    netWorthUsd: toNullableNumber(wallet.net_worth_usd),
    primaryChain: wallet.primary_chain,
    processedAt: null,
    status: wallet.status,
    tier: wallet.tier,
    topPersona: wallet.top_persona,
    transactions90d: wallet.transactions_90d,
    walletAgeDays: wallet.wallet_age_days,
    xray: null,
  }
}

function normalizeWalletDetail(wallet: LensPoolWalletDetailWire): LensPoolWalletDetail {
  return {
    ...normalizeWallet(wallet),
    error: wallet.error,
    processedAt: wallet.processed_at,
    xray: wallet.xray,
  }
}

function createClient() {
  return createAuthenticatedPartnerApiClient()
}

export function readLensApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiClientError) {
    const body = error.body as { error?: unknown } | null
    if (typeof body?.error === 'string' && body.error.trim().length > 0) {
      return body.error
    }

    return `${fallback} (${error.status})`
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message
  }

  return fallback
}

export async function readLensPools(): Promise<LensPool[]> {
  const client = createClient()
  const payload = await client.listLensPools<LensPoolListResponseWire>()
  return payload.pools.map(normalizePool)
}

export async function createLensPool(
  input: LensCreatePoolRequest
): Promise<LensPool> {
  const client = createClient()
  const payload = await client.createLensPool<LensPoolWire, LensCreatePoolRequest>(input)
  return normalizePool(payload)
}

export async function readLensPool(id: string): Promise<LensPool> {
  const client = createClient()
  const payload = await client.getLensPool<LensPoolWire>(id)
  return normalizePool(payload)
}

export async function renameLensPool(
  id: string,
  input: LensRenamePoolRequest
): Promise<LensPool> {
  const client = createClient()
  const payload = await client.renameLensPool<LensPoolWire, LensRenamePoolRequest>(id, input)
  return normalizePool(payload)
}

export async function deleteLensPool(id: string): Promise<LensDeletePoolResponse> {
  const client = createClient()
  return client.deleteLensPool<LensDeletePoolResponse>(id)
}

export async function readLensPoolProgress(id: string): Promise<LensPoolProgress> {
  const client = createClient()
  const payload = await client.getLensPoolProgress<LensPoolProgressWire>(id)
  return {
    analyzedCount: payload.analyzed_count,
    failedCount: payload.failed_count,
    id: payload.id,
    percentage: payload.percentage,
    status: payload.status,
    walletCount: payload.wallet_count,
  }
}

export async function readLensPoolWallets(
  id: string,
  query?: LensPoolWalletQuery
): Promise<LensPoolWalletListResponse> {
  const client = createClient()
  const payload = await client.listLensPoolWallets<LensPoolWalletListResponseWire>(id, query)

  return {
    limit: payload.limit,
    offset: payload.offset,
    total: payload.total,
    wallets: payload.wallets.map(normalizeWallet),
  }
}

export async function readLensPoolWalletDetail(
  id: string,
  address: string
): Promise<LensPoolWalletDetail> {
  const client = createClient()
  const payload = await client.getLensPoolWalletDetail<LensPoolWalletDetailWire>(
    id,
    address
  )

  return normalizeWalletDetail(payload)
}
