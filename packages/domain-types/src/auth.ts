export type AuthAudience = 'user' | 'partner' | 'admin'

export type AuthProvider =
  | 'wallet'
  | 'google'
  | 'microsoft'
  | 'email_magic_link'
  | 'google_workspace'
  | 'demo'

export type WalletChainFamily = 'evm' | 'solana'

export interface AuthIdentity {
  audience: AuthAudience
  subject: string
  role: AuthAudience
  provider: AuthProvider
  email?: string
  displayName?: string
  walletAddress?: string
  walletChainFamily?: WalletChainFamily
  partnerId?: string
  partnerName?: string
  tenantDomain?: string
}

export interface AuthTokenMetadata {
  accessToken: string
  expiresAt: string
  refreshTokenExpiresAt: string
  issuedAt: string
}

export interface BaseSession extends AuthTokenMetadata {
  audience: AuthAudience
  identity: AuthIdentity
}

export interface UserSession extends BaseSession {
  audience: 'user'
  primaryWallet: string
  walletChainFamily: WalletChainFamily
}

export interface PartnerSession extends BaseSession {
  audience: 'partner'
  partnerId: string
  partnerName: string
  enabledModules: string[]
}

export type PartnerAuthPlan = 'free' | 'starter' | 'pro' | 'enterprise'
export type PartnerAuthAccountStatus = 'active' | 'suspended'

export interface PartnerProfile {
  id: string
  email: string
  displayName: string
  photoUrl: string | null
  organization: string | null
  plan: PartnerAuthPlan
  status: PartnerAuthAccountStatus
  createdAt: string
  lastLoginAt: string
}

export interface PartnerAuthResponse {
  status: 'created' | 'existing'
  partner: PartnerProfile
}

export interface PartnerProfileResponse {
  partner: PartnerProfile
}

export interface AdminSession extends BaseSession {
  audience: 'admin'
  workspaceDomain: string
}

export interface AuthSessionResponse<TSession extends BaseSession> {
  ok: boolean
  session: TSession | null
}

export interface LogoutResponse {
  ok: boolean
}

export interface WalletChallengeRequest {
  walletAddress: string
  walletChainFamily: WalletChainFamily
}

export interface WalletChallengeResponse {
  challengeId: string
  walletAddress: string
  walletChainFamily: WalletChainFamily
  nonce: string
  message: string
  issuedAt: string
  expiresAt: string
}

export interface WalletVerifyRequest {
  challengeId: string
  walletAddress: string
  walletChainFamily: WalletChainFamily
  signature: string
  displayName?: string
}

export interface ProviderExchangeRequest {
  provider: Exclude<AuthProvider, 'wallet'>
  providerToken?: string
  email?: string
  displayName?: string
  organizationSlug?: string
}

export interface UserMe {
  walletAddress: string
  walletChainFamily: WalletChainFamily
  profileStatus: 'seeded' | 'live'
  tier: string
  primaryLabel: string
}

export interface PartnerMe {
  partnerId: string
  partnerName: string
  email: string
  provider: AuthProvider
  enabledModules: string[]
}

export interface AdminMe {
  email: string
  displayName: string
  workspaceDomain: string
}
