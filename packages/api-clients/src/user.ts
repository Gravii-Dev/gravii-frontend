import type {
  GraviiIdentityResponse,
  UserAuthChallenge,
  UserAuthSessionResponse,
  UserAuthVerifyRequest,
  UserAuthVerifyResponse,
  UserCreditsResponse,
  UserXrayDetailResponse,
  UserXrayLookupListResponse,
  UserXrayLookupRequest,
  UserXrayLookupResponse
} from '@gravii/domain-types'

import {
  createJsonApiClient,
  resolveApiBaseUrl,
  type ApiClientConfig
} from './base'

export const DEFAULT_USER_API_BASE_URL =
  'https://gravii-user-api-1077809741476.europe-west6.run.app'

export type UserWalletType = 'evm' | 'solana'

export interface WalletAnalysisRequest {
  address: string
  walletType: UserWalletType
  signature: string
  chains?: string[]
}

export interface WalletAnalysisEvmKaiaRequest {
  address: string
  walletType: 'evm'
  signature: string
}

export interface TelegramVerificationRequest {
  telegramId: string
  address: string
  signature: string
}

export interface UserApiClientConfig extends Omit<ApiClientConfig, 'baseUrl'> {
  baseUrl?: string
}

function toChallengeAddress(input: string | { address: string }) {
  return typeof input === 'string' ? input : input.address
}

function toWalletAnalysisPayload(input: WalletAnalysisRequest) {
  return {
    address: input.address,
    wallet_type: input.walletType,
    signature: input.signature,
    chains: input.chains
  }
}

export function createUserApiClient(config: UserApiClientConfig = {}) {
  const client = createJsonApiClient({
    ...config,
    baseUrl: resolveApiBaseUrl({
      override: config.baseUrl,
      envKeys: ['NEXT_PUBLIC_GRAVII_USER_API_BASE_URL', 'GRAVII_USER_API_BASE_URL'],
      fallback: DEFAULT_USER_API_BASE_URL
    })
  })

  return {
    getAuthChallenge<TResponse = UserAuthChallenge>(
      input: string | { address: string },
      signal?: AbortSignal
    ) {
      return client.request<TResponse>({
        method: 'GET',
        path: '/api/v1/auth/challenge',
        query: {
          address: toChallengeAddress(input)
        },
        signal
      })
    },

    verifyAuthSignature<
      TResponse = UserAuthVerifyResponse,
      TBody extends UserAuthVerifyRequest = UserAuthVerifyRequest
    >(input: TBody, signal?: AbortSignal) {
      const body: {
        address: string
        message: string
        referral_code?: string
        signature: string
      } = {
        address: input.address,
        message: input.message,
        signature: input.signature
      }

      if (input.referralCode) {
        body.referral_code = input.referralCode
      }

      return client.request<
        TResponse,
        {
          address: string
          message: string
          referral_code?: string
          signature: string
        }
      >({
        method: 'POST',
        path: '/api/v1/auth/verify',
        body,
        signal
      })
    },

    getAuthSession<TResponse = UserAuthSessionResponse>(signal?: AbortSignal) {
      return client.request<TResponse>({
        method: 'GET',
        path: '/api/v1/auth/session',
        signal
      })
    },

    getIdentity<TResponse = GraviiIdentityResponse>(signal?: AbortSignal) {
      return client.request<TResponse>({
        method: 'GET',
        path: '/api/v1/me/identity',
        signal
      })
    },

    getCredits<TResponse = UserCreditsResponse>(signal?: AbortSignal) {
      return client.request<TResponse>({
        method: 'GET',
        path: '/api/v1/me/credits',
        signal
      })
    },

    listXrayLookups<TResponse = UserXrayLookupListResponse>(signal?: AbortSignal) {
      return client.request<TResponse>({
        method: 'GET',
        path: '/api/v1/me/xray/lookup-list',
        signal
      })
    },

    lookupWalletXray<
      TResponse = UserXrayLookupResponse,
      TBody extends UserXrayLookupRequest = UserXrayLookupRequest
    >(input: TBody, signal?: AbortSignal) {
      return client.request<TResponse, TBody>({
        method: 'POST',
        path: '/api/v1/me/xray/lookup',
        body: input,
        signal
      })
    },

    getWalletXray<TResponse = UserXrayDetailResponse>(
      address: string,
      signal?: AbortSignal
    ) {
      return client.request<TResponse>({
        method: 'GET',
        path: `/api/v1/me/xray/${encodeURIComponent(address)}`,
        signal
      })
    },

    analyzeWallet<TResponse = unknown>(input: WalletAnalysisRequest, signal?: AbortSignal) {
      return client.request<TResponse, ReturnType<typeof toWalletAnalysisPayload>>({
        method: 'POST',
        path: '/api/v1/wallet/analyze',
        body: toWalletAnalysisPayload(input),
        signal
      })
    },

    analyzeEvmKaia<TResponse = unknown>(
      input: WalletAnalysisEvmKaiaRequest,
      signal?: AbortSignal
    ) {
      return client.request<TResponse, ReturnType<typeof toWalletAnalysisPayload>>({
        method: 'POST',
        path: '/api/v1/wallet/analyze-evm-kaia',
        body: toWalletAnalysisPayload(input),
        signal
      })
    },

    verifyTelegram<TResponse = unknown>(
      input: TelegramVerificationRequest,
      signal?: AbortSignal
    ) {
      return client.request<
        TResponse,
        {
          telegram_id: string
          address: string
          signature: string
        }
      >({
        method: 'POST',
        path: '/api/v1/verify/telegram',
        body: {
          telegram_id: input.telegramId,
          address: input.address,
          signature: input.signature
        },
        signal
      })
    }
  }
}
