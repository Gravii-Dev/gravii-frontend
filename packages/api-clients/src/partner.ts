import { createJsonApiClient, type ApiClientConfig } from './base'

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

export function createPartnerApiClient(config: PartnerApiClientConfig = {}) {
  const client = createJsonApiClient({
    ...config,
    baseUrl: config.baseUrl ?? DEFAULT_PARTNER_API_BASE_URL
  })

  return {
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
    }
  }
}
