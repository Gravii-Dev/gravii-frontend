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
  token: string
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
  otherActiveChains: string[]
  portfolioTrend30d: number | null
  reputation: 'trusted' | 'neutral' | 'cautious' | 'flagged'
  reputationFlags: string[]
  tier: string
  topPersona: string
  tradingVolume30d: number
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
  token: string
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
  net_worth_usd: number
  other_active_chains: string[]
  portfolio_trend_30d: number | null
  reputation: GraviiIdentity['reputation']
  reputation_flags: string[]
  tier: string
  top_persona: string
  trading_volume_30d: number
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

const DEFAULT_USER_API_BASE_URL =
  'https://gravii-user-api-1077809741476.europe-west6.run.app'
const DEFAULT_BROWSER_USER_API_BASE_URL = ''

export const graviiUserPendingXrayWalletKey = 'gravii_pending_xray_wallet'
export const graviiUserTokenKey = 'gravii_user_token'
export const graviiUserIdentityBootstrapKey = 'gravii_identity_bootstrap_pending'

function getUserApiBaseUrl() {
  if (typeof window !== 'undefined') {
    return resolveApiBaseUrl({
      override: undefined,
      envKeys: ['NEXT_PUBLIC_USER_API_BROWSER_BASE_URL'],
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
    netWorthUsd: identity.net_worth_usd,
    otherActiveChains: identity.other_active_chains,
    portfolioTrend30d: identity.portfolio_trend_30d,
    reputation: identity.reputation,
    reputationFlags: identity.reputation_flags,
    tier: identity.tier,
    topPersona: identity.top_persona,
    tradingVolume30d: identity.trading_volume_30d,
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

async function parseError(response: Response): Promise<string> {
  const payload = (await response.json().catch(() => null)) as
    | { error?: string }
    | null

  if (typeof payload?.error === 'string' && payload.error.trim().length > 0) {
    return payload.error
  }

  return `Request failed with status ${response.status}.`
}

export function getStoredUserToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage.getItem(graviiUserTokenKey)
}

export function storeUserToken(token: string) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(graviiUserTokenKey, token)
}

export function clearUserToken() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(graviiUserTokenKey)
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
    authenticated?: boolean
  }
): Promise<TResponse> {
  const token = getStoredUserToken()
  const authenticated = options?.authenticated ?? true
  const headers = new Headers(options?.headers)

  if (!headers.has('content-type') && options?.body) {
    headers.set('content-type', 'application/json')
  }

  if (authenticated && token) {
    headers.set('authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${getUserApiBaseUrl()}${path}`, {
    ...options,
    headers,
    cache: 'no-store',
  })

  if (response.status === 401) {
    clearUserToken()
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
      authenticated: false,
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
      authenticated: false,
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
    token: payload.token,
    user: normalizeUserAuthUser(payload.user),
  }
}

export async function readUserSession(): Promise<UserAuthUser | null> {
  const token = getStoredUserToken()
  if (!token) {
    return null
  }

  try {
    const payload = await userApiFetch<UserSessionWire>('/api/v1/auth/session', {
      method: 'GET',
    })

    return normalizeUserAuthUser(payload.user)
  } catch {
    clearUserToken()
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
