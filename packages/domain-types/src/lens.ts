export type LensSupportedChain =
  | 'ethereum'
  | 'base'
  | 'arbitrum'
  | 'polygon'
  | 'optimism'
  | 'bsc'
  | 'avalanche'
  | 'hyperliquid'
  | 'kaia'
  | 'solana'

export type LensPoolStatus = 'pending' | 'analyzing' | 'complete' | 'failed'
export type LensPoolWalletStatus = 'pending' | 'analyzed' | 'failed'
export type LensPoolWalletSort =
  | 'net_worth_desc'
  | 'net_worth_asc'
  | 'added_desc'
  | 'transactions_desc'
  | 'age_desc'

export interface LensTopSegment {
  name: string
  percentage: number
}

export interface LensSegmentBreakdownRow {
  name: string
  count: number
}

export interface LensPoolSummary {
  totalValueUsd: number
  tierDistribution: Record<string, number>
  topSegment: LensTopSegment | null
  segmentBreakdown: LensSegmentBreakdownRow[]
  chainDistribution: Record<string, number>
  activeWallets: number
  inactiveWallets: number
  sybilRatio: number | null
  sybilCount: number | null
  computedAt: string
}

export interface LensPool {
  id: string
  partnerId: string
  name: string
  status: LensPoolStatus
  chains: LensSupportedChain[] | string[]
  walletCount: number
  analyzedCount: number
  failedCount: number
  summary: LensPoolSummary | null
  schedule: Record<string, unknown> | null
  createdAt: string
  updatedAt: string
  lastAnalyzedAt: string | null
}

export interface LensPoolListResponse {
  pools: LensPool[]
}

export interface LensCreatePoolRequest {
  name: string
  chains: LensSupportedChain[] | string[]
  addresses: string[]
}

export interface LensRenamePoolRequest {
  name: string
}

export interface LensDeletePoolResponse {
  deleted: boolean
}

export interface LensPoolProgress {
  id: string
  status: LensPoolStatus
  walletCount: number
  analyzedCount: number
  failedCount: number
  percentage: number
}

export interface LensPoolWallet {
  address: string
  status: LensPoolWalletStatus | string
  tier: string | null
  netWorthUsd: number | null
  topPersona: string | null
  primaryChain: string | null
  transactions90d: number | null
  walletAgeDays: number | null
  analyzedAt: string | null
  addedAt: string
}

export interface LensPoolWalletListResponse {
  wallets: LensPoolWallet[]
  total: number
  limit: number
  offset: number
}

export interface LensPoolWalletQuery {
  chain?: string[]
  limit?: number
  maxValue?: number
  minValue?: number
  offset?: number
  persona?: string[]
  search?: string
  sort?: LensPoolWalletSort
  status?: string[]
  tier?: string[]
}

export interface LensPoolWalletDetail extends LensPoolWallet {
  processedAt: string | null
  error: string | null
  xray: Record<string, unknown> | null
}
