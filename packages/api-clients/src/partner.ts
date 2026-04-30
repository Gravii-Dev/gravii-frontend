import type {
  AuthSessionResponse,
  LensCreatePoolRequest,
  LensDeletePoolResponse,
  LensPool,
  LensPoolListResponse,
  LensPoolProgress,
  LensPoolWalletDetail,
  LensPoolWalletListResponse,
  LensPoolWalletQuery,
  LensRenamePoolRequest,
  LogoutResponse,
  PartnerMe,
  PartnerAuthResponse,
  PartnerProfileResponse,
  PartnerSession,
  ProviderExchangeRequest
} from '@gravii/domain-types'

import { createJsonApiClient, resolveApiBaseUrl, type ApiClientConfig } from './base'

export const DEFAULT_PARTNER_API_BASE_URL =
  'https://gravii-partner-api-1077809741476.europe-west6.run.app'

export interface PopulationScopedQuery {
  populationId?: string
}

export interface PaginationQuery {
  limit?: number
  offset?: number
}

export interface LabelFilterQuery extends PopulationScopedQuery, PaginationQuery {
  label?: string
}

export interface CreatePopulationRequest {
  name: string
  wallets: string[]
  metadata?: Record<string, unknown | null>
}

export interface PartnerApiClientConfig extends Omit<ApiClientConfig, 'baseUrl'> {
  baseUrl?: string
}

function toPopulationScopedQuery(query?: PopulationScopedQuery) {
  return query
    ? {
        population_id: query.populationId
      }
    : undefined
}

function toPaginationQuery(query?: PaginationQuery) {
  return query
    ? {
        limit: query.limit,
        offset: query.offset
      }
    : undefined
}

function toCsvQueryValue(values?: string[]) {
  return values && values.length > 0 ? values.join(',') : undefined
}

export function createPartnerApiClient(config: PartnerApiClientConfig = {}) {
  const client = createJsonApiClient({
    ...config,
    baseUrl: resolveApiBaseUrl({
      override: config.baseUrl,
      envKeys: ['NEXT_PUBLIC_GRAVII_PARTNER_API_BASE_URL', 'GRAVII_PARTNER_API_BASE_URL'],
      fallback: DEFAULT_PARTNER_API_BASE_URL
    })
  })

  return {
    signInWithGoogle<TResponse = PartnerAuthResponse>(signal?: AbortSignal) {
      return client.request<TResponse>({
        method: 'POST',
        path: '/api/v1/auth/google',
        signal
      })
    },

    exchangeProviderSession<
      TResponse = AuthSessionResponse<PartnerSession>,
      TBody extends ProviderExchangeRequest = ProviderExchangeRequest
    >(input: TBody, signal?: AbortSignal) {
      return client.request<TResponse, TBody>({
        method: 'POST',
        path: '/api/v1/auth/provider/exchange',
        body: input,
        signal
      })
    },

    getAuthSession<TResponse = PartnerProfileResponse>(signal?: AbortSignal) {
      return client.request<TResponse>({
        method: 'GET',
        path: '/api/v1/auth/session',
        signal
      })
    },

    getAuthMe<TResponse = PartnerProfileResponse>(signal?: AbortSignal) {
      return client.request<TResponse>({
        method: 'GET',
        path: '/api/v1/auth/me',
        signal
      })
    },

    refreshAuthSession<TResponse = AuthSessionResponse<PartnerSession>>(signal?: AbortSignal) {
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

    getMe<TResponse = PartnerMe>(signal?: AbortSignal) {
      return client.request<TResponse>({
        method: 'GET',
        path: '/api/v1/auth/me',
        signal
      })
    },

    getOverviewSummary<TResponse = unknown>(
      query?: PopulationScopedQuery,
      signal?: AbortSignal
    ) {
      return client.request<TResponse>({
        method: 'GET',
        path: '/api/v1/dashboard/overview/summary',
        query: {
          ...toPopulationScopedQuery(query)
        },
        signal
      })
    },

    getAnalyticsGroupStats<TResponse = unknown>(
      query?: PopulationScopedQuery & PaginationQuery,
      signal?: AbortSignal
    ) {
      return client.request<TResponse>({
        method: 'GET',
        path: '/api/v1/dashboard/analytics/group-stats',
        query: {
          ...toPopulationScopedQuery(query),
          ...toPaginationQuery(query)
        },
        signal
      })
    },

    getAnalyticsDexProtocols<TResponse = unknown>(
      query?: PopulationScopedQuery & PaginationQuery,
      signal?: AbortSignal
    ) {
      return client.request<TResponse>({
        method: 'GET',
        path: '/api/v1/dashboard/analytics/dex-protocols',
        query: {
          ...toPopulationScopedQuery(query),
          ...toPaginationQuery(query)
        },
        signal
      })
    },

    getDashboardLabels<TResponse = unknown>(
      query?: PopulationScopedQuery & PaginationQuery,
      signal?: AbortSignal
    ) {
      return client.request<TResponse>({
        method: 'GET',
        path: '/api/v1/dashboard/labels',
        query: {
          ...toPopulationScopedQuery(query),
          ...toPaginationQuery(query)
        },
        signal
      })
    },

    filterDashboardLabels<TResponse = unknown>(
      query?: LabelFilterQuery,
      signal?: AbortSignal
    ) {
      return client.request<TResponse>({
        method: 'GET',
        path: '/api/v1/dashboard/labels/filter',
        query: {
          label: query?.label,
          ...toPopulationScopedQuery(query),
          ...toPaginationQuery(query)
        },
        signal
      })
    },

    getRiskOverview<TResponse = unknown>(signal?: AbortSignal) {
      return client.request<TResponse>({
        method: 'GET',
        path: '/api/v1/dashboard/risk/overview',
        signal
      })
    },

    getRiskAlerts<TResponse = unknown>(
      query?: PopulationScopedQuery & PaginationQuery,
      signal?: AbortSignal
    ) {
      return client.request<TResponse>({
        method: 'GET',
        path: '/api/v1/dashboard/risk/alerts',
        query: {
          ...toPopulationScopedQuery(query),
          ...toPaginationQuery(query)
        },
        signal
      })
    },

    getSybilClusters<TResponse = unknown>(signal?: AbortSignal) {
      return client.request<TResponse>({
        method: 'GET',
        path: '/api/v1/dashboard/risk/sybil-clusters',
        signal
      })
    },

    listPopulations<TResponse = unknown>(signal?: AbortSignal) {
      return client.request<TResponse>({
        method: 'GET',
        path: '/api/v1/populations',
        signal
      })
    },

    createPopulation<TResponse = unknown>(
      input: CreatePopulationRequest,
      signal?: AbortSignal
    ) {
      return client.request<TResponse, CreatePopulationRequest>({
        method: 'POST',
        path: '/api/v1/populations',
        body: input,
        signal
      })
    },

    getPopulation<TResponse = unknown>(id: string, signal?: AbortSignal) {
      return client.request<TResponse>({
        method: 'GET',
        path: `/api/v1/populations/${encodeURIComponent(id)}`,
        signal
      })
    },

    enrichPopulation<TResponse = unknown>(id: string, signal?: AbortSignal) {
      return client.request<TResponse>({
        method: 'POST',
        path: `/api/v1/populations/${encodeURIComponent(id)}/enrich`,
        signal
      })
    },

    getPopulationStatus<TResponse = unknown>(id: string, signal?: AbortSignal) {
      return client.request<TResponse>({
        method: 'GET',
        path: `/api/v1/populations/${encodeURIComponent(id)}/status`,
        signal
      })
    },

    createLensPool<
      TResponse = LensPool,
      TBody extends LensCreatePoolRequest = LensCreatePoolRequest
    >(input: TBody, signal?: AbortSignal) {
      return client.request<TResponse, TBody>({
        method: 'POST',
        path: '/api/v1/lens/pools',
        body: input,
        signal
      })
    },

    listLensPools<TResponse = LensPoolListResponse>(signal?: AbortSignal) {
      return client.request<TResponse>({
        method: 'GET',
        path: '/api/v1/lens/pools',
        signal
      })
    },

    getLensPool<TResponse = LensPool>(id: string, signal?: AbortSignal) {
      return client.request<TResponse>({
        method: 'GET',
        path: `/api/v1/lens/pools/${encodeURIComponent(id)}`,
        signal
      })
    },

    renameLensPool<
      TResponse = LensPool,
      TBody extends LensRenamePoolRequest = LensRenamePoolRequest
    >(id: string, input: TBody, signal?: AbortSignal) {
      return client.request<TResponse, TBody>({
        method: 'PATCH',
        path: `/api/v1/lens/pools/${encodeURIComponent(id)}`,
        body: input,
        signal
      })
    },

    deleteLensPool<TResponse = LensDeletePoolResponse>(id: string, signal?: AbortSignal) {
      return client.request<TResponse>({
        method: 'DELETE',
        path: `/api/v1/lens/pools/${encodeURIComponent(id)}`,
        signal
      })
    },

    getLensPoolProgress<TResponse = LensPoolProgress>(id: string, signal?: AbortSignal) {
      return client.request<TResponse>({
        method: 'GET',
        path: `/api/v1/lens/pools/${encodeURIComponent(id)}/progress`,
        signal
      })
    },

    listLensPoolWallets<TResponse = LensPoolWalletListResponse>(
      id: string,
      query?: LensPoolWalletQuery,
      signal?: AbortSignal
    ) {
      return client.request<TResponse>({
        method: 'GET',
        path: `/api/v1/lens/pools/${encodeURIComponent(id)}/wallets`,
        query: {
          chain: toCsvQueryValue(query?.chain),
          limit: query?.limit,
          max_value: query?.maxValue,
          min_value: query?.minValue,
          offset: query?.offset,
          persona: toCsvQueryValue(query?.persona),
          search: query?.search,
          sort: query?.sort,
          status: toCsvQueryValue(query?.status),
          tier: toCsvQueryValue(query?.tier)
        },
        signal
      })
    },

    getLensPoolWalletDetail<TResponse = LensPoolWalletDetail>(
      id: string,
      address: string,
      signal?: AbortSignal
    ) {
      return client.request<TResponse>({
        method: 'GET',
        path: `/api/v1/lens/pools/${encodeURIComponent(id)}/wallets/${encodeURIComponent(address)}`,
        signal
      })
    }
  }
}
