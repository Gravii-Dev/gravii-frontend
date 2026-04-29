import type {
  UserXrayDetailResponse,
  UserXrayLookupEntry,
} from '@/lib/auth/user-api'

export const XRAY_SEARCH_STATS = [
  { label: 'COVERAGE', value: '50+ CHAINS' },
  { label: 'ACCESS', value: 'OWN WALLET FREE' },
  { label: 'SPEED', value: '10–30 SEC' },
] as const

export interface XRayDetailViewModel {
  address: string
  activeSince: string
  activeChains: number
  adjacentPersonas: string[]
  byChain: Array<{ chain: string; value: string }>
  defiProtocolCount: number
  defiTvl: string
  portfolioTrend30d: string
  primaryPersona: string
  recentActivity: Array<{
    action: string
    chain: string
    date: string
    platform: string
  }>
  reputation: string
  reputationFlags: string[]
  tier: string
  totalValue: string
  tradingVolume30d: string
  transactions90d: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function parseRecord(value: unknown): Record<string, unknown> | null {
  if (isRecord(value)) {
    return value
  }

  if (typeof value !== 'string') {
    return null
  }

  try {
    const parsed = JSON.parse(value) as unknown
    return isRecord(parsed) ? parsed : null
  } catch {
    return null
  }
}

const xrayPayloadKeys = [
  'address',
  'activity_90d',
  'defi',
  'identity',
  'nfts',
  'personas',
  'portfolio',
  'status',
  'trading',
] as const

function scoreXrayCandidate(candidate: Record<string, unknown>) {
  return xrayPayloadKeys.filter((key) => key in candidate).length
}

function collectRecordCandidates(value: unknown, depth = 0): Record<string, unknown>[] {
  const record = parseRecord(value)
  if (!record) {
    return []
  }

  const candidates = [record]
  if (depth >= 3) {
    return candidates
  }

  for (const nestedValue of Object.values(record)) {
    candidates.push(...collectRecordCandidates(nestedValue, depth + 1))
  }

  return candidates
}

function extractXrayPayload(response: UserXrayDetailResponse) {
  const candidates = collectRecordCandidates(response)
    .map((candidate) => ({
      candidate,
      score: scoreXrayCandidate(candidate),
    }))
    .sort((left, right) => right.score - left.score)

  return candidates[0]?.score ? candidates[0].candidate : {}
}

function readNestedRecord(
  source: Record<string, unknown>,
  key: string
): Record<string, unknown> {
  const value = source[key]
  return isRecord(value) ? value : {}
}

function readString(source: Record<string, unknown>, key: string, fallback = '—') {
  const value = source[key]
  return typeof value === 'string' && value.trim().length > 0 ? value : fallback
}

function readNumber(source: Record<string, unknown>, key: string, fallback = 0) {
  const value = source[key]
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function readStringArray(source: Record<string, unknown>, key: string) {
  const value = source[key]
  if (!Array.isArray(value)) {
    return [] as string[]
  }

  return value.filter((entry): entry is string => typeof entry === 'string')
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    maximumFractionDigits: value >= 1000 ? 0 : 2,
    style: 'currency',
  }).format(value)
}

function mapChainBreakdown(value: unknown): Array<{ chain: string; value: string }> {
  if (Array.isArray(value)) {
    return value
      .filter(isRecord)
      .slice(0, 6)
      .map((chain) => ({
        chain: titleCase(readString(chain, 'chain', readString(chain, 'name', 'Unknown'))),
        value: formatCurrency(
          readNumber(chain, 'value_usd', readNumber(chain, 'total_value_usd', 0))
        ),
      }))
  }

  if (!isRecord(value)) {
    return []
  }

  return Object.entries(value)
    .filter((entry): entry is [string, number] => {
      const [, chainValue] = entry
      return typeof chainValue === 'number' && Number.isFinite(chainValue)
    })
    .sort(([, valueA], [, valueB]) => valueB - valueA)
    .slice(0, 6)
    .map(([chain, chainValue]) => ({
      chain: titleCase(chain),
      value: formatCurrency(chainValue),
    }))
}

function formatPercent(value: number | null) {
  if (value === null) {
    return '—'
  }

  const formatted = Math.abs(value).toFixed(value >= 100 ? 0 : 1)
  return `${value >= 0 ? '+' : '-'}${formatted}%`
}

function titleCase(input: string) {
  return input
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function formatLookupDate(isoString: string) {
  const parsed = Date.parse(isoString)
  if (Number.isNaN(parsed)) {
    return isoString
  }

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(parsed)
}

export function formatWalletLabel(address: string) {
  if (address.length <= 12) {
    return address
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function paginateLookupEntries(
  lookups: UserXrayLookupEntry[],
  page: number,
  perPage = 5
) {
  const totalPages = Math.max(Math.ceil(lookups.length / perPage), 1)
  const currentPage = Math.min(Math.max(page, 0), totalPages - 1)

  return {
    currentPage,
    rows: lookups.slice(currentPage * perPage, (currentPage + 1) * perPage),
    totalPages,
  }
}

export function mapXrayDetailToViewModel(
  response: UserXrayDetailResponse
): XRayDetailViewModel {
  const xray = extractXrayPayload(response)
  const personas = readNestedRecord(xray, 'personas')
  const identity = readNestedRecord(xray, 'identity')
  const portfolio = readNestedRecord(xray, 'portfolio')
  const activity = readNestedRecord(xray, 'activity_90d')
  const trading = readNestedRecord(xray, 'trading')
  const defi = readNestedRecord(xray, 'defi')

  const byChain = mapChainBreakdown(portfolio.by_chain)

  const recentActivity = Array.isArray(activity.recent_transactions)
    ? activity.recent_transactions
        .filter(isRecord)
        .slice(0, 6)
        .map((transaction) => ({
          action: readString(transaction, 'action'),
          chain: readString(transaction, 'chain'),
          date: readString(transaction, 'date'),
          platform: readString(transaction, 'platform'),
        }))
    : []

  return {
    activeChains: readNumber(activity, 'chains_active'),
    activeSince: readString(identity, 'first_active', 'Unknown'),
    address: readString(xray, 'address'),
    adjacentPersonas: readStringArray(personas, 'adjacent_personas').slice(0, 2),
    byChain,
    defiProtocolCount: readNumber(defi, 'protocols_count'),
    defiTvl: formatCurrency(readNumber(defi, 'total_tvl_usd')),
    portfolioTrend30d: formatPercent(
      typeof identity.portfolio_trend_30d === 'number'
        ? identity.portfolio_trend_30d
        : null
    ),
    primaryPersona: readString(personas, 'top_persona', 'Unknown Persona'),
    recentActivity,
    reputation: titleCase(readString(identity, 'reputation', 'neutral')),
    reputationFlags: readStringArray(identity, 'reputation_flags'),
    tier: titleCase(readString(identity, 'tier', 'base')),
    totalValue: formatCurrency(readNumber(portfolio, 'total_value_usd')),
    tradingVolume30d: formatCurrency(readNumber(trading, 'volume_30d_usd')),
    transactions90d: new Intl.NumberFormat('en-US').format(
      readNumber(activity, 'total_transactions')
    ),
  }
}
