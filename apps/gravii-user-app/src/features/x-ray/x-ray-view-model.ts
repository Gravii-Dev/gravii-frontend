import type {
  UserXrayDetailResponse,
  UserXrayLookupEntry,
} from '@/lib/auth/user-api'

export const XRAY_SEARCH_STATS = [
  { label: 'COST', value: '1 CREDIT' },
  { label: 'IN-DEPTH', value: 'MULTI-CHAIN' },
  { label: 'SPEED', value: '10-30 SEC', sub: 'Varies by wallet activity' },
] as const

export interface XRayDetailViewModel {
  address: string
  activeSince: string
  activeChains: number
  adjacentPersonas: string[]
  assetMix: Array<{
    label: string
    percent: number
    total: string
    tokens: Array<{
      breakdown: Array<{ chain: string; value: string }>
      name: string
      percent: number
      total: string
    }>
  }>
  byChain: Array<{ chain: string; value: string }>
  chainDistribution: Array<{
    chain: string
    percent: number
    tokenCount: string
    value: string
  }>
  defiProtocolCount: number
  defiEngagement: Array<{
    label: string
    percent: number
    protocols: Array<{ name: string; percent: number | null }>
  }>
  defiTvl: string
  entropy: string
  flagsLabel: string
  fundingSources: Array<{ label: string; percent: number }>
  gasSpending: {
    avgPerTx: string
    topChains: string
    total: string
  }
  nftsHeld: string
  portfolioTrend30d: string
  portfolioTrend7d: string
  portfolioTrend90d: string
  portfolioHealth: Array<{ label: string; value: string }>
  primaryPersona: string
  recentActivity: Array<{
    action: string
    chain: string
    date: string
    platform: string
  }>
  reputation: string
  reputationFlags: string[]
  riskLevel: string
  sybilStatus: string
  tier: string
  topFundingSources: string
  totalValue: string
  transferPatterns: {
    incoming: number
    incomingValue: string
    outgoing: number
    outgoingValue: string
    topCounterparties: string
  }
  tradingVolume30d: string
  transactions90d: string
  unclaimedRewards: string
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

function readNullableNumber(source: Record<string, unknown>, key: string) {
  const value = source[key]
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function readNumericValue(source: Record<string, unknown>, key: string) {
  const value = source[key]
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value !== 'string') {
    return null
  }

  const normalized = Number.parseFloat(value.replace(/[^0-9.-]/g, ''))
  return Number.isFinite(normalized) ? normalized : null
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

function formatOptionalCurrency(value: number | null) {
  return value === null ? '—' : formatCurrency(value)
}

function formatOptionalNumber(value: number | null) {
  return value === null ? '—' : new Intl.NumberFormat('en-US').format(value)
}

function mapChainBreakdown(value: unknown): Array<{ chain: string; value: string }> {
  if (Array.isArray(value)) {
    return value
      .filter(isRecord)
      .slice(0, 6)
      .map((chain) => ({
        chain: titleCase(readString(chain, 'chain', readString(chain, 'name', 'Unknown'))),
        value: formatCurrency(
          readNumericValue(chain, 'value_usd') ??
            readNumericValue(chain, 'total_value_usd') ??
            readNumericValue(chain, 'value') ??
            0
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

function mapChainDistribution(value: unknown, totalValue: number) {
  if (Array.isArray(value)) {
    return value
      .filter(isRecord)
      .slice(0, 6)
      .map((chain) => {
        const valueUsd =
          readNumericValue(chain, 'value_usd') ??
          readNumericValue(chain, 'total_value_usd') ??
          readNumericValue(chain, 'value') ??
          0
        const percent =
          readNullableNumber(chain, 'pct') ??
          readNullableNumber(chain, 'percent') ??
          (totalValue > 0 ? (valueUsd / totalValue) * 100 : 0)

        return {
          chain: titleCase(readString(chain, 'chain', readString(chain, 'name', 'Unknown'))),
          percent,
          tokenCount: formatOptionalNumber(
            readNullableNumber(chain, 'token_count') ?? readNullableNumber(chain, 'tokens_count')
          ),
          value: formatCurrency(valueUsd),
        }
      })
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
      percent: totalValue > 0 ? (chainValue / totalValue) * 100 : 0,
      tokenCount: '—',
      value: formatCurrency(chainValue),
    }))
}

function formatPercent(value: number | null) {
  if (value === null) {
    return '—'
  }

  const absoluteValue = Math.abs(value)
  const formatted = absoluteValue.toFixed(absoluteValue >= 100 ? 0 : 1)
  return `${value >= 0 ? '+' : '-'}${formatted}%`
}

function formatUpperStatus(value: string) {
  return value === '—' ? value : titleCase(value).toUpperCase()
}

function readBreakdownList(value: unknown) {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .filter(isRecord)
    .slice(0, 5)
    .map((entry) => ({
      chain: readString(entry, 'chain', readString(entry, 'name', 'Unknown')),
      value:
        readString(entry, 'val', '') ||
        readString(entry, 'value', '') ||
        formatOptionalCurrency(
          readNullableNumber(entry, 'value_usd') ?? readNullableNumber(entry, 'total_value_usd')
        ),
    }))
}

function readTokenList(value: unknown, categoryTotalUsd: number | null) {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .filter(isRecord)
    .slice(0, 6)
    .map((token) => {
      const valueUsd =
        readNumericValue(token, 'value_usd') ??
        readNumericValue(token, 'total_value_usd') ??
        readNumericValue(token, 'total')
      const percent =
        readNullableNumber(token, 'pct') ??
        readNullableNumber(token, 'percent') ??
        (valueUsd !== null && categoryTotalUsd !== null && categoryTotalUsd > 0
          ? (valueUsd / categoryTotalUsd) * 100
          : 0)

      return {
        breakdown: readBreakdownList(token.breakdown),
        name: readString(token, 'name', readString(token, 'symbol', 'Unknown')),
        percent,
        total: formatOptionalCurrency(valueUsd),
      }
    })
}

function mapAssetMix(portfolio: Record<string, unknown>) {
  const assets = readNestedRecord(portfolio, 'assets')
  const categories = [
    {
      key: 'stables',
      label: 'Stablecoins',
      percentKey: 'stablecoins_percent',
      totalKey: 'stablecoins_usd',
    },
    {
      key: 'native',
      label: 'Native Tokens',
      percentKey: 'native_tokens_percent',
      totalKey: 'native_tokens_usd',
    },
    {
      key: 'others',
      label: 'Other Tokens',
      percentKey: 'other_tokens_percent',
      totalKey: 'other_tokens_usd',
    },
  ] as const

  return categories.map((category) => {
    const categoryRecord = readNestedRecord(assets, category.key)
    const categoryTotalUsd =
      readNullableNumber(categoryRecord, 'value_usd') ??
      readNullableNumber(categoryRecord, 'total_value_usd') ??
      readNullableNumber(categoryRecord, 'total_usd') ??
      readNumericValue(categoryRecord, 'total') ??
      readNullableNumber(portfolio, category.totalKey)

    return {
      label: category.label,
      percent:
        readNullableNumber(categoryRecord, 'pct') ??
        readNullableNumber(categoryRecord, 'percent') ??
        readNumber(portfolio, category.percentKey),
      total:
        readString(categoryRecord, 'total', '') ||
        formatOptionalCurrency(categoryTotalUsd),
      tokens: readTokenList(categoryRecord.tokens, categoryTotalUsd),
    }
  })
}

function mapPercentRows(
  source: Record<string, unknown>,
  rows: Array<{ fallbackLabel: string; key: string; label?: string }>
) {
  return rows.map((row) => ({
    label: row.label ?? row.fallbackLabel,
    percent: readNumericValue(source, row.key) ?? 0,
  }))
}

function readJoinedStringArray(source: Record<string, unknown>, key: string, fallback = '—') {
  const values = readStringArray(source, key)
  return values.length > 0 ? values.join(' · ') : fallback
}

function mapProtocolList(
  defi: Record<string, unknown>,
  nestedKey: string,
  directKey: string
) {
  const nested = readNestedRecord(defi, nestedKey)
  const nestedProtocols = nested.protocols

  if (Array.isArray(nestedProtocols)) {
    return nestedProtocols
      .filter(isRecord)
      .slice(0, 5)
      .map((protocol) => ({
        name: readString(protocol, 'name', readString(protocol, 'protocol', 'Unknown')),
        percent:
          readNumericValue(protocol, 'pct') ??
          readNumericValue(protocol, 'percent') ??
          null,
      }))
  }

  return readStringArray(defi, directKey)
    .slice(0, 5)
    .map((name) => ({
      name,
      percent: null,
    }))
}

function readNestedPercent(
  source: Record<string, unknown>,
  nestedKey: string,
  directKey: string
) {
  const nested = readNestedRecord(source, nestedKey)

  return (
    readNumericValue(nested, 'pct') ??
    readNumericValue(nested, 'percent') ??
    readNumericValue(source, directKey) ??
    0
  )
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
  const risk = readNestedRecord(xray, 'risk')
  const funding = readNestedRecord(xray, 'funding')
  const transfers = readNestedRecord(xray, 'transfer')
  const gas = readNestedRecord(xray, 'gas')
  const nfts = readNestedRecord(xray, 'nfts')
  const rewards = readNestedRecord(xray, 'rewards')
  const activeChains = readNumericValue(activity, 'chains_active') ?? 0
  const totalValueNumber =
    readNumericValue(portfolio, 'total_value_usd') ?? readNumericValue(portfolio, 'total') ?? 0
  const assetMix = mapAssetMix(portfolio)

  const byChain = mapChainBreakdown(portfolio.by_chain)
  const chainDistribution = mapChainDistribution(portfolio.by_chain, totalValueNumber)
  const stableAllocation = assetMix.find((asset) => asset.label === 'Stablecoins')?.percent ?? 0
  const defiTvlNumber = readNumericValue(defi, 'total_tvl_usd') ?? readNumericValue(defi, 'tvl') ?? 0
  const defiProtocolCount = readNumericValue(defi, 'protocols_count') ?? 0
  const defiUsage = defiTvlNumber > 0 || defiProtocolCount > 0

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
    activeChains,
    activeSince: readString(identity, 'first_active', 'Unknown'),
    address: readString(xray, 'address'),
    adjacentPersonas: readStringArray(personas, 'adjacent_personas').slice(0, 2),
    assetMix,
    byChain,
    chainDistribution,
    defiEngagement: [
      {
        label: 'Liquidity Providing',
        percent: readNestedPercent(defi, 'lp', 'lp_percent'),
        protocols: mapProtocolList(defi, 'lp', 'lp_protocols'),
      },
      {
        label: 'Lending',
        percent: readNestedPercent(defi, 'lending', 'lending_percent'),
        protocols: mapProtocolList(defi, 'lending', 'lending_protocols'),
      },
      {
        label: 'Staking',
        percent: readNestedPercent(defi, 'staking', 'staking_percent'),
        protocols: mapProtocolList(defi, 'staking', 'staking_protocols'),
      },
      {
        label: 'Vault',
        percent: readNestedPercent(defi, 'vault', 'vault_percent'),
        protocols: mapProtocolList(defi, 'vault', 'vault_protocols'),
      },
    ],
    defiProtocolCount,
    defiTvl: formatCurrency(defiTvlNumber),
    entropy: readString(risk, 'entropy', readString(identity, 'entropy', '—')),
    flagsLabel:
      readStringArray(identity, 'reputation_flags').length > 0
        ? readStringArray(identity, 'reputation_flags').join(' · ')
        : readString(risk, 'flags', 'NONE'),
    fundingSources: mapPercentRows(funding, [
      { fallbackLabel: 'CEX', key: 'cex_percent' },
      { fallbackLabel: 'Bridge', key: 'bridge_percent' },
      { fallbackLabel: 'Direct Wallet', key: 'wallet_percent' },
    ]),
    gasSpending: {
      avgPerTx: formatOptionalCurrency(readNumericValue(gas, 'avg_tx_usd')),
      topChains: readJoinedStringArray(gas, 'top_chains'),
      total: formatOptionalCurrency(readNumericValue(gas, 'total_usd')),
    },
    nftsHeld: formatOptionalNumber(
      readNumericValue(nfts, 'count') ?? readNumericValue(identity, 'nfts_count')
    ),
    portfolioTrend30d: formatPercent(readNumericValue(identity, 'portfolio_trend_30d')),
    portfolioTrend7d: formatPercent(readNumericValue(identity, 'portfolio_trend_7d')),
    portfolioTrend90d: formatPercent(readNumericValue(identity, 'portfolio_trend_90d')),
    portfolioHealth: [
      { label: 'Diversification', value: activeChains >= 4 ? 'High' : activeChains >= 2 ? 'Medium' : 'Low' },
      { label: 'Chain spread', value: `${activeChains} active` },
      { label: 'Stable ratio', value: `${Math.round(stableAllocation)}%` },
      { label: 'DeFi usage', value: defiUsage ? 'Strong' : 'Not returned' },
    ],
    primaryPersona: readString(personas, 'top_persona', 'Unknown Persona'),
    recentActivity,
    reputation: titleCase(readString(identity, 'reputation', 'neutral')),
    reputationFlags: readStringArray(identity, 'reputation_flags'),
    riskLevel: formatUpperStatus(readString(risk, 'level', readString(identity, 'risk_level', '—'))),
    sybilStatus: formatUpperStatus(readString(risk, 'sybil_status', readString(identity, 'sybil_status', '—'))),
    tier: titleCase(readString(identity, 'tier', 'base')),
    topFundingSources: readJoinedStringArray(funding, 'top_sources'),
    totalValue: formatCurrency(totalValueNumber),
    transferPatterns: {
      incoming: readNumericValue(transfers, 'incoming_percent') ?? 0,
      incomingValue: formatOptionalCurrency(readNumericValue(transfers, 'incoming_value_usd')),
      outgoing: readNumericValue(transfers, 'outgoing_percent') ?? 0,
      outgoingValue: formatOptionalCurrency(readNumericValue(transfers, 'outgoing_value_usd')),
      topCounterparties: readJoinedStringArray(transfers, 'top_counterparties'),
    },
    tradingVolume30d: formatCurrency(readNumericValue(trading, 'volume_30d_usd') ?? 0),
    transactions90d: new Intl.NumberFormat('en-US').format(
      readNumericValue(activity, 'total_transactions') ?? 0
    ),
    unclaimedRewards: formatOptionalCurrency(readNumericValue(rewards, 'unclaimed_usd')),
  }
}
