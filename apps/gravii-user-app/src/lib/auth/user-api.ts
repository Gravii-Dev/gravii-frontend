import { resolveApiBaseUrl } from '@gravii/api-clients'

export type UserAuthStatus = 'created' | 'existing'

export interface UserAuthUser {
  address: string
  createdAt: string
  lastLoginAt: string
  referralCode: string
  referredUsersCount: number
}

export interface UserAuthChallenge {
  expiresAt: string
  message: string
  nonce: string
}

export interface UserAuthVerifyResult {
  status: UserAuthStatus
  user: UserAuthUser
}

export interface GraviiIdentity {
  activeSince: string
  address: string
  adjacentPersonas: string[]
  analyzedAt: string
  defiProtocolsCount: number
  defiTvlUsd: number
  homeChain: string
  netWorthUsd: number
  nftsCollectedCount: number | null
  otherActiveChains: string[]
  portfolioTrend30d: number | null
  reputation: 'trusted' | 'neutral' | 'cautious' | 'flagged'
  reputationFlags: string[]
  matchedCampaignsCount: number | null
  standoutMetric: string | null
  standoutRank: number | null
  tier: string
  topPersona: string
  tradingVolume30d: number
  transactionsAllTime: number | null
  transactions90d: number
  walletAgeDays: number
}

export interface UserCreditsResponse {
  credits: number
}

export interface UserXrayLookupEntry {
  address: string
  analyzedAt: string
  tier: string
  topPersona: string
}

export interface UserXrayLookupListResponse {
  count: number
  lookups: UserXrayLookupEntry[]
}

export interface UserXrayLookupResult {
  address: string
  creditUsed: boolean
  creditsRemaining: number
  success: boolean
}

export interface UserXrayDetailResponse {
  xray: Record<string, unknown> | string | null
}

export type DiscoveryCampaignEligibility = true | false | null | 'ineligible'
export type DiscoveryPartnerStatus =
  | 'ELIGIBLE'
  | 'REACH TO UNLOCK'
  | 'COMING SOON'
  | 'INVITE ONLY'
  | 'INELIGIBLE'
export type DiscoveryCampaignTagType =
  | 'open'
  | 'requires'
  | 'targeting'
  | 'tier'
  | 'verified'

export interface DiscoveryCampaignTag {
  persona?: string
  tier?: string
  type: DiscoveryCampaignTagType
}

export interface DiscoveryCampaign {
  category: string
  chains: string[]
  desc: string
  eligible: DiscoveryCampaignEligibility
  name: string
  period: string
  qualifySteps?: string[]
  tags?: DiscoveryCampaignTag[]
  type: string
}

export interface DiscoveryPartner {
  campaigns: DiscoveryCampaign[]
  delay: string
  eligible: DiscoveryCampaignEligibility
  id: string
  name: string
  status: DiscoveryPartnerStatus
}

export interface DiscoveryCatalogResponse {
  partners: DiscoveryPartner[]
}

export type RankingCategoryId = 'activity' | 'g-rep' | 'nft' | 'streak' | 'trade'
export type RankingTier =
  | 'Base'
  | 'Black'
  | 'Classic'
  | 'Gold'
  | 'Obsidian'
  | 'Platinum'

export interface RankingRow {
  chain: string
  change: string
  name: string
  persona: string
  rank: string
  tier: RankingTier
  up: boolean | null
}

export interface RankingLeaderboardResponse {
  generatedAt: string | null
  rows: RankingRow[]
  seasonLabel: string | null
  updateLabel: string | null
}

export interface UserRankingSummary {
  categoryRanks: Partial<Record<RankingCategoryId, string>>
  connectedWalletLabel: string | null
  seasonBest: string | null
  seasonChange: string | null
  seasonRank: string | null
  totalRankedWallets: number | null
}

export type UserXrayCreditBundleId = 'xray_credits_10'

export interface UserXrayCheckoutSessionInput {
  bundleId: UserXrayCreditBundleId
  cancelUrl: string
  successUrl: string
}

export interface UserXrayCheckoutSession {
  checkoutUrl: string
  expiresAt: string | null
  sessionId: string | null
}

export class UserApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'UserApiError'
    this.status = status
  }
}

interface UserAuthUserWire {
  address: string
  created_at: string
  last_login_at: string
  referral_code: string
  referred_users_count: number
}

interface UserAuthChallengeWire {
  expires_at: string
  message: string
  nonce: string
}

interface UserAuthVerifyResultWire {
  status: UserAuthStatus
  token?: string
  user: UserAuthUserWire
}

interface UserSessionWire {
  user: UserAuthUserWire
}

interface GraviiIdentityWire {
  active_since: string
  address: string
  adjacent_personas: string[]
  analyzed_at: string
  defi_protocols_count: number
  defi_tvl_usd: number
  home_chain: string
  matched_campaigns_count?: number | null
  net_worth_usd: number
  nfts_collected_count?: number | null
  other_active_chains: string[]
  portfolio_trend_30d: number | null
  reputation: GraviiIdentity['reputation']
  reputation_flags: string[]
  standout_metric?: string | null
  standout_rank?: number | null
  tier: string
  top_persona: string
  trading_volume_30d: number
  transactions_all_time?: number | null
  transactions_90d: number
  wallet_age_days: number
}

interface GraviiIdentityResponseWire {
  gravii_id: GraviiIdentityWire
}

interface UserXrayLookupEntryWire {
  address: string
  analyzed_at: string
  tier: string
  top_persona: string
}

interface UserXrayLookupListResponseWire {
  count: number
  lookups: UserXrayLookupEntryWire[]
}

interface UserXrayLookupResultWire {
  address?: string
  credit_used?: boolean
  credits_remaining: number
  success: boolean
}

interface UserXrayCheckoutSessionWire {
  checkout_session?: {
    checkout_url?: string
    expires_at?: string | null
    id?: string
    session_id?: string
    url?: string
  }
  checkout_url?: string
  expires_at?: string | null
  id?: string
  session_id?: string
  url?: string
}

interface DiscoveryCampaignTagWire {
  persona?: string | null
  tier?: string | null
  type?: string
}

interface DiscoveryCampaignWire {
  category?: string
  chains?: string[]
  desc?: string
  description?: string
  eligible?: DiscoveryCampaignEligibility
  name?: string
  period?: string
  qualify_steps?: string[]
  tags?: DiscoveryCampaignTagWire[]
  type?: string
}

interface DiscoveryPartnerWire {
  campaigns?: DiscoveryCampaignWire[]
  delay?: string
  eligible?: DiscoveryCampaignEligibility
  id?: string
  name?: string
  status?: DiscoveryPartnerStatus
}

interface DiscoveryCatalogResponseWire {
  partners?: DiscoveryPartnerWire[]
}

interface RankingRowWire {
  chain?: string
  change?: string | number
  name?: string
  persona?: string
  rank?: string | number
  tier?: RankingTier
  up?: boolean | null
}

interface RankingLeaderboardResponseWire {
  generated_at?: string | null
  rows?: RankingRowWire[]
  season_label?: string | null
  update_label?: string | null
}

interface UserRankingSummaryWire {
  category_ranks?: Partial<Record<RankingCategoryId, string | number>>
  connected_wallet_label?: string | null
  season_best?: string | null
  season_change?: string | number | null
  season_rank?: string | number | null
  total_ranked_wallets?: number | null
}

const DEFAULT_USER_API_BASE_URL =
  'https://gravii-user-api-1077809741476.europe-west6.run.app'
const DEFAULT_BROWSER_USER_API_BASE_URL = '/api/user-api'
const legacyGraviiUserTokenKey = 'gravii_user_token'

export const graviiUserPendingXrayWalletKey = 'gravii_pending_xray_wallet'
export const graviiUserIdentityBootstrapKey = 'gravii_identity_bootstrap_pending'

function getUserApiBaseUrl() {
  if (typeof window !== 'undefined') {
    return resolveApiBaseUrl({
      override: undefined,
      envKeys: [],
      fallback: DEFAULT_BROWSER_USER_API_BASE_URL,
    })
  }

  return resolveApiBaseUrl({
    override: undefined,
    envKeys: ['NEXT_PUBLIC_USER_API_URL', 'NEXT_PUBLIC_GRAVII_USER_API_BASE_URL'],
    fallback: DEFAULT_USER_API_BASE_URL,
  })
}

function normalizeUserAuthUser(user: UserAuthUserWire): UserAuthUser {
  return {
    address: user.address,
    createdAt: user.created_at,
    lastLoginAt: user.last_login_at,
    referralCode: user.referral_code,
    referredUsersCount: user.referred_users_count,
  }
}

function normalizeIdentity(identity: GraviiIdentityWire): GraviiIdentity {
  return {
    activeSince: identity.active_since,
    address: identity.address,
    adjacentPersonas: identity.adjacent_personas,
    analyzedAt: identity.analyzed_at,
    defiProtocolsCount: identity.defi_protocols_count,
    defiTvlUsd: identity.defi_tvl_usd,
    homeChain: identity.home_chain,
    matchedCampaignsCount: identity.matched_campaigns_count ?? null,
    netWorthUsd: identity.net_worth_usd,
    nftsCollectedCount: identity.nfts_collected_count ?? null,
    otherActiveChains: identity.other_active_chains,
    portfolioTrend30d: identity.portfolio_trend_30d,
    reputation: identity.reputation,
    reputationFlags: identity.reputation_flags,
    standoutMetric: identity.standout_metric ?? null,
    standoutRank: identity.standout_rank ?? null,
    tier: identity.tier,
    topPersona: identity.top_persona,
    tradingVolume30d: identity.trading_volume_30d,
    transactionsAllTime: identity.transactions_all_time ?? null,
    transactions90d: identity.transactions_90d,
    walletAgeDays: identity.wallet_age_days,
  }
}

function normalizeLookupEntry(entry: UserXrayLookupEntryWire): UserXrayLookupEntry {
  return {
    address: entry.address,
    analyzedAt: entry.analyzed_at,
    tier: entry.tier,
    topPersona: entry.top_persona,
  }
}

function normalizeLookupResult(
  result: UserXrayLookupResultWire,
  fallbackAddress: string
): UserXrayLookupResult {
  return {
    address:
      typeof result.address === 'string' && result.address.trim().length > 0
        ? result.address
        : fallbackAddress,
    creditUsed: result.credit_used ?? false,
    creditsRemaining: result.credits_remaining,
    success: result.success,
  }
}

function normalizeCheckoutSession(
  session: UserXrayCheckoutSessionWire
): UserXrayCheckoutSession {
  const source = session.checkout_session ?? session
  const checkoutUrl = source.checkout_url ?? source.url

  if (typeof checkoutUrl !== 'string' || checkoutUrl.trim().length === 0) {
    throw new UserApiError('Checkout session did not include a redirect URL.', 502)
  }

  return {
    checkoutUrl,
    expiresAt: source.expires_at ?? null,
    sessionId: source.session_id ?? source.id ?? null,
  }
}

function normalizeDiscoveryTag(tag: DiscoveryCampaignTagWire): DiscoveryCampaignTag | null {
  const type = tag.type

  if (
    type !== 'open' &&
    type !== 'requires' &&
    type !== 'targeting' &&
    type !== 'tier' &&
    type !== 'verified'
  ) {
    return null
  }

  return {
    persona: tag.persona ?? undefined,
    tier: tag.tier ?? undefined,
    type,
  }
}

function normalizeDiscoveryCampaign(campaign: DiscoveryCampaignWire): DiscoveryCampaign {
  return {
    category: campaign.category ?? 'General',
    chains: campaign.chains && campaign.chains.length > 0 ? campaign.chains : ['All'],
    desc: campaign.desc ?? campaign.description ?? '',
    eligible: campaign.eligible ?? null,
    name: campaign.name ?? 'Untitled campaign',
    period: campaign.period ?? 'Timing pending',
    qualifySteps: campaign.qualify_steps,
    tags: campaign.tags?.map(normalizeDiscoveryTag).filter((tag): tag is DiscoveryCampaignTag => tag !== null),
    type: campaign.type ?? 'Campaign',
  }
}

function normalizeDiscoveryPartner(
  partner: DiscoveryPartnerWire,
  index: number
): DiscoveryPartner {
  return {
    campaigns: partner.campaigns?.map(normalizeDiscoveryCampaign) ?? [],
    delay: partner.delay ?? `${Math.min(index * 60, 420)}ms`,
    eligible: partner.eligible ?? null,
    id: partner.id ?? `partner-${index + 1}`,
    name: partner.name ?? `Partner ${index + 1}`,
    status: partner.status ?? 'COMING SOON',
  }
}

function normalizeRankingRow(row: RankingRowWire): RankingRow {
  return {
    chain: row.chain ?? 'All',
    change: row.change === undefined ? '0' : String(row.change),
    name: row.name ?? 'Wallet',
    persona: row.persona ?? 'Pending',
    rank: row.rank === undefined ? '-' : String(row.rank),
    tier: row.tier ?? 'Base',
    up: row.up ?? null,
  }
}

function normalizeRankingLeaderboard(
  payload: RankingLeaderboardResponseWire
): RankingLeaderboardResponse {
  return {
    generatedAt: payload.generated_at ?? null,
    rows: payload.rows?.map(normalizeRankingRow) ?? [],
    seasonLabel: payload.season_label ?? null,
    updateLabel: payload.update_label ?? null,
  }
}

function normalizeUserRankingSummary(
  payload: UserRankingSummaryWire
): UserRankingSummary {
  const categoryRanks: Partial<Record<RankingCategoryId, string>> = {}

  for (const [category, rank] of Object.entries(payload.category_ranks ?? {})) {
    if (
      category === 'activity' ||
      category === 'g-rep' ||
      category === 'nft' ||
      category === 'streak' ||
      category === 'trade'
    ) {
      categoryRanks[category] = String(rank)
    }
  }

  return {
    categoryRanks,
    connectedWalletLabel: payload.connected_wallet_label ?? null,
    seasonBest: payload.season_best ?? null,
    seasonChange: payload.season_change === undefined || payload.season_change === null
      ? null
      : String(payload.season_change),
    seasonRank: payload.season_rank === undefined || payload.season_rank === null
      ? null
      : String(payload.season_rank),
    totalRankedWallets: payload.total_ranked_wallets ?? null,
  }
}

async function parseError(response: Response): Promise<string> {
  const payload = (await response.json().catch(() => null)) as
    | { error?: string }
    | null

  if (typeof payload?.error === 'string' && payload.error.trim().length > 0) {
    return payload.error
  }

  return `Request failed with status ${response.status}.`
}

function clearLegacyUserToken() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(legacyGraviiUserTokenKey)
}

export async function clearUserSession() {
  clearLegacyUserToken()

  if (typeof window === 'undefined') {
    return
  }

  await fetch('/api/user-session/logout', {
    cache: 'no-store',
    method: 'POST',
  }).catch(() => undefined)
}

export function markUserIdentityBootstrapPending() {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.setItem(graviiUserIdentityBootstrapKey, 'true')
}

export function clearUserIdentityBootstrapPending() {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.removeItem(graviiUserIdentityBootstrapKey)
}

export function hasPendingUserIdentityBootstrap(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  return window.sessionStorage.getItem(graviiUserIdentityBootstrapKey) === 'true'
}

export function setPendingXrayWallet(address: string) {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.setItem(graviiUserPendingXrayWalletKey, address)
}

export function popPendingXrayWallet(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  const wallet = window.sessionStorage.getItem(graviiUserPendingXrayWalletKey)
  if (wallet) {
    window.sessionStorage.removeItem(graviiUserPendingXrayWalletKey)
  }

  return wallet
}

async function userApiFetch<TResponse>(
  path: string,
  options?: RequestInit & {
    timeoutMs?: number
  }
): Promise<TResponse> {
  const headers = new Headers(options?.headers)
  const timeoutMs = options?.timeoutMs
  const controller = timeoutMs ? new AbortController() : null
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  const requestSignal = controller?.signal ?? options?.signal

  if (controller && options?.signal) {
    if (options.signal.aborted) {
      controller.abort()
    } else {
      options.signal.addEventListener('abort', () => controller.abort(), {
        once: true,
      })
    }
  }

  if (controller && timeoutMs) {
    timeoutId = setTimeout(() => controller.abort(), timeoutMs)
  }

  if (!headers.has('content-type') && options?.body) {
    headers.set('content-type', 'application/json')
  }

  const response = await fetch(`${getUserApiBaseUrl()}${path}`, {
    ...options,
    headers,
    cache: 'no-store',
    signal: requestSignal,
  }).finally(() => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }
  })

  if (response.status === 401) {
    await clearUserSession()
  }

  if (!response.ok) {
    throw new UserApiError(await parseError(response), response.status)
  }

  return (await response.json()) as TResponse
}

export async function requestUserChallenge(
  address: string
): Promise<UserAuthChallenge> {
  const payload = await userApiFetch<UserAuthChallengeWire>(
    `/api/v1/auth/challenge?address=${encodeURIComponent(address)}`,
    {
      method: 'GET',
    }
  )

  return {
    expiresAt: payload.expires_at,
    message: payload.message,
    nonce: payload.nonce,
  }
}

export async function verifyUserWallet(input: {
  address: string
  message: string
  signature: string
  referralCode?: string
}): Promise<UserAuthVerifyResult> {
  const payload = await userApiFetch<UserAuthVerifyResultWire>(
    '/api/v1/auth/verify',
    {
      method: 'POST',
      body: JSON.stringify({
        address: input.address,
        message: input.message,
        signature: input.signature,
        ...(input.referralCode ? { referral_code: input.referralCode } : {}),
      }),
    }
  )

  return {
    status: payload.status,
    user: normalizeUserAuthUser(payload.user),
  }
}

export async function readUserSession(): Promise<UserAuthUser | null> {
  try {
    const payload = await userApiFetch<UserSessionWire>('/api/v1/auth/session', {
      method: 'GET',
      timeoutMs: 5000,
    })

    return normalizeUserAuthUser(payload.user)
  } catch {
    await clearUserSession()
    return null
  }
}

export async function readUserIdentity(): Promise<GraviiIdentity> {
  const payload = await userApiFetch<GraviiIdentityResponseWire>(
    '/api/v1/me/identity',
    {
      method: 'GET',
    }
  )

  return normalizeIdentity(payload.gravii_id)
}

export async function readUserCredits(): Promise<number> {
  const payload = await userApiFetch<UserCreditsResponse>('/api/v1/me/credits', {
    method: 'GET',
  })

  return payload.credits
}

export async function createUserXrayCheckoutSession(
  input: UserXrayCheckoutSessionInput
): Promise<UserXrayCheckoutSession> {
  const payload = await userApiFetch<UserXrayCheckoutSessionWire>(
    '/api/v1/me/xray/checkout-session',
    {
      method: 'POST',
      body: JSON.stringify({
        bundle_id: input.bundleId,
        cancel_url: input.cancelUrl,
        success_url: input.successUrl,
      }),
    }
  )

  return normalizeCheckoutSession(payload)
}

export async function readUserLookupList(): Promise<UserXrayLookupListResponse> {
  const payload = await userApiFetch<UserXrayLookupListResponseWire>(
    '/api/v1/me/xray/lookup-list',
    {
      method: 'GET',
    }
  )

  return {
    count: payload.count,
    lookups: payload.lookups.map(normalizeLookupEntry),
  }
}

export async function runUserXrayLookup(
  address: string
): Promise<UserXrayLookupResult> {
  const payload = await userApiFetch<UserXrayLookupResultWire>(
    '/api/v1/me/xray/lookup',
    {
      method: 'POST',
      body: JSON.stringify({ address }),
    }
  )

  return normalizeLookupResult(payload, address)
}

export async function readUserXrayDetail(
  address: string
): Promise<UserXrayDetailResponse> {
  return userApiFetch<UserXrayDetailResponse>(
    `/api/v1/me/xray/${encodeURIComponent(address)}`,
    {
      method: 'GET',
    }
  )
}

export async function readDiscoveryCatalog(options?: {
  signal?: AbortSignal
}): Promise<DiscoveryCatalogResponse> {
  const payload = await userApiFetch<DiscoveryCatalogResponseWire>(
    '/api/v1/discovery/partners',
    {
      method: 'GET',
      signal: options?.signal,
      timeoutMs: 7000,
    }
  )

  return {
    partners: payload.partners?.map(normalizeDiscoveryPartner) ?? [],
  }
}

export async function readRankingLeaderboard(
  category: RankingCategoryId,
  options?: {
    signal?: AbortSignal
  }
): Promise<RankingLeaderboardResponse> {
  const payload = await userApiFetch<RankingLeaderboardResponseWire>(
    `/api/v1/ranking/leaderboard?category=${encodeURIComponent(category)}`,
    {
      method: 'GET',
      signal: options?.signal,
      timeoutMs: 7000,
    }
  )

  return normalizeRankingLeaderboard(payload)
}

export async function readUserRankingSummary(options?: {
  signal?: AbortSignal
}): Promise<UserRankingSummary> {
  const payload = await userApiFetch<UserRankingSummaryWire>(
    '/api/v1/me/ranking/summary',
    {
      method: 'GET',
      signal: options?.signal,
      timeoutMs: 7000,
    }
  )

  return normalizeUserRankingSummary(payload)
}
