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

export interface UserAuthVerifyRequest {
  address: string
  message: string
  signature: string
  referralCode?: string
}

export interface UserAuthVerifyResponse {
  status: UserAuthStatus
  token: string
  user: UserAuthUser
  graviiIdReady?: boolean
}

export interface UserAuthSessionResponse {
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

export interface GraviiIdentityResponse {
  graviiId: GraviiIdentity
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

export interface UserXrayLookupRequest {
  address: string
}

export interface UserXrayLookupResponse {
  address: string
  creditUsed: boolean
  creditsRemaining: number
  success: boolean
}

export interface UserXrayDetailResponse {
  xray: Record<string, unknown>
}
