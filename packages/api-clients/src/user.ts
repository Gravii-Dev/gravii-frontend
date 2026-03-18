import { createJsonApiClient, type ApiClientConfig } from './base'

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
    baseUrl: config.baseUrl ?? DEFAULT_USER_API_BASE_URL
  })

  return {
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
