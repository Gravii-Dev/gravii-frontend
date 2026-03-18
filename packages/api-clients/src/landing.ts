import { createJsonApiClient, type ApiClientConfig } from './base'

export const DEFAULT_LANDING_API_BASE_URL =
  'https://gravii-landing-api-1077809741476.europe-west6.run.app'

export type LandingWalletType = 'evm' | 'solana'

export interface LandingWalletRegistrationRequest {
  address: string
  walletType: LandingWalletType
  signature: string
  referralCode?: string
}

export interface LandingEmailRegistrationRequest {
  email: string
  referralCode?: string
}

export interface LandingWalletEmailRegistrationRequest
  extends LandingWalletRegistrationRequest {
  email: string
}

export interface LandingWalletViewRequest {
  address: string
  walletType: LandingWalletType
  signature: string
}

export interface LandingLabelPreview {
  label: string
  confidence: number
}

export interface LandingWalletRegistrationResponse {
  status: string
  address?: string
  referralCode?: string
  labels?: LandingLabelPreview[]
}

export interface LandingEmailRegistrationResponse {
  status: string
  referralCode?: string
}

export interface LandingApiClientConfig extends Omit<ApiClientConfig, 'baseUrl'> {
  baseUrl?: string
}

function toLandingWalletPayload(input: LandingWalletRegistrationRequest) {
  return {
    address: input.address,
    wallet_type: input.walletType,
    signature: input.signature,
    referral_code: input.referralCode
  }
}

function toLandingEmailPayload(input: LandingEmailRegistrationRequest) {
  return {
    email: input.email,
    referral_code: input.referralCode
  }
}

export function createLandingApiClient(config: LandingApiClientConfig = {}) {
  const client = createJsonApiClient({
    ...config,
    baseUrl: config.baseUrl ?? DEFAULT_LANDING_API_BASE_URL
  })

  return {
    registerWallet<TResponse = LandingWalletRegistrationResponse>(
      input: LandingWalletRegistrationRequest,
      signal?: AbortSignal
    ) {
      return client.request<TResponse, ReturnType<typeof toLandingWalletPayload>>({
        method: 'POST',
        path: '/api/v1/landing/landing-wallet',
        body: toLandingWalletPayload(input),
        signal
      })
    },

    registerEmail<TResponse = LandingEmailRegistrationResponse>(
      input: LandingEmailRegistrationRequest,
      signal?: AbortSignal
    ) {
      return client.request<TResponse, ReturnType<typeof toLandingEmailPayload>>({
        method: 'POST',
        path: '/api/v1/landing/landing-email',
        body: toLandingEmailPayload(input),
        signal
      })
    },

    registerWalletEmail<TResponse = LandingWalletRegistrationResponse>(
      input: LandingWalletEmailRegistrationRequest,
      signal?: AbortSignal
    ) {
      return client.request<
        TResponse,
        ReturnType<typeof toLandingWalletPayload> & ReturnType<typeof toLandingEmailPayload>
      >({
        method: 'POST',
        path: '/api/v1/landing/landing-wallet-email',
        body: {
          ...toLandingWalletPayload(input),
          ...toLandingEmailPayload(input)
        },
        signal
      })
    },

    previewWalletLabels<TResponse = LandingWalletRegistrationResponse>(
      input: LandingWalletViewRequest,
      signal?: AbortSignal
    ) {
      return client.request<TResponse, ReturnType<typeof toLandingWalletPayload>>({
        method: 'POST',
        path: '/api/v1/landing/landing-wallet-view',
        body: toLandingWalletPayload(input),
        signal
      })
    }
  }
}
