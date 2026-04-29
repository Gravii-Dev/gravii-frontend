import type {
  AdminMe,
  AdminSession,
  AuthSessionResponse,
  LogoutResponse,
  ProviderExchangeRequest
} from '@gravii/domain-types'

import { createJsonApiClient, resolveApiBaseUrl, type ApiClientConfig } from './base'

export const DEFAULT_ADMIN_API_BASE_URL =
  'https://gravii-admin-api-1077809741476.europe-west6.run.app'

export interface AdminApiClientConfig extends Omit<ApiClientConfig, 'baseUrl'> {
  baseUrl?: string
}

export function createAdminApiClient(config: AdminApiClientConfig = {}) {
  const client = createJsonApiClient({
    ...config,
    baseUrl: resolveApiBaseUrl({
      override: config.baseUrl,
      envKeys: ['NEXT_PUBLIC_GRAVII_ADMIN_API_BASE_URL', 'GRAVII_ADMIN_API_BASE_URL'],
      fallback: DEFAULT_ADMIN_API_BASE_URL
    })
  })

  return {
    exchangeProviderSession<
      TResponse = AuthSessionResponse<AdminSession>,
      TBody extends ProviderExchangeRequest = ProviderExchangeRequest
    >(input: TBody, signal?: AbortSignal) {
      return client.request<TResponse, TBody>({
        method: 'POST',
        path: '/api/v1/auth/google/exchange',
        body: input,
        signal
      })
    },

    getAuthSession<TResponse = AuthSessionResponse<AdminSession>>(signal?: AbortSignal) {
      return client.request<TResponse>({
        method: 'GET',
        path: '/api/v1/auth/session',
        signal
      })
    },

    refreshAuthSession<TResponse = AuthSessionResponse<AdminSession>>(signal?: AbortSignal) {
      return client.request<TResponse>({
        method: 'POST',
        path: '/api/v1/auth/refresh',
        signal
      })
    },

    logoutAuthSession<TResponse = LogoutResponse>(signal?: AbortSignal) {
      return client.request<TResponse>({
        method: 'POST',
        path: '/api/v1/auth/logout',
        signal
      })
    },

    getMe<TResponse = AdminMe>(signal?: AbortSignal) {
      return client.request<TResponse>({
        method: 'GET',
        path: '/api/v1/me',
        signal
      })
    }
  }
}
