export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
export type QueryPrimitive = string | number | boolean | null
export type QueryValue = QueryPrimitive | readonly QueryPrimitive[] | undefined
export type QueryParams = Record<string, QueryValue>

export interface ApiClientConfig {
  baseUrl: string
  fetch?: typeof fetch
  defaultHeaders?: HeadersInit | undefined
  getHeaders?: (() => HeadersInit | Promise<HeadersInit>) | undefined
  getAccessToken?:
    | (() => string | null | undefined | Promise<string | null | undefined>)
    | undefined
  onUnauthorized?:
    | ((error: ApiClientError) => string | null | undefined | Promise<string | null | undefined>)
    | undefined
}

export interface JsonRequestOptions<TBody> {
  method: HttpMethod
  path: string
  query?: QueryParams | undefined
  headers?: HeadersInit | undefined
  body?: TBody | undefined
  signal?: AbortSignal | undefined
}

export class ApiClientError extends Error {
  readonly status: number
  readonly url: string
  readonly body: unknown

  constructor(message: string, options: { status: number; url: string; body: unknown }) {
    super(message)
    this.name = 'ApiClientError'
    this.status = options.status
    this.url = options.url
    this.body = options.body
  }
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
}

function readRuntimeEnv(envKeys: readonly string[]): string | undefined {
  if (typeof process === 'undefined') {
    return undefined
  }

  for (const envKey of envKeys) {
    const value = process.env[envKey]

    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim()
    }
  }

  return undefined
}

function buildUrl(baseUrl: string, path: string, query?: QueryParams): URL {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const url = new URL(`${normalizeBaseUrl(baseUrl)}${normalizedPath}`)

  if (!query) {
    return url
  }

  for (const [key, rawValue] of Object.entries(query)) {
    if (rawValue === undefined) {
      continue
    }

    if (Array.isArray(rawValue)) {
      for (const value of rawValue) {
        if (value === null) {
          url.searchParams.append(key, '')
          continue
        }

        url.searchParams.append(key, String(value))
      }

      continue
    }

    url.searchParams.append(key, rawValue === null ? '' : String(rawValue))
  }

  return url
}

function mergeHeaders(...headerSets: Array<HeadersInit | undefined>): Headers {
  const merged = new Headers()

  for (const headerSet of headerSets) {
    if (!headerSet) {
      continue
    }

    const headers = new Headers(headerSet)

    headers.forEach((value, key) => {
      merged.set(key, value)
    })
  }

  return merged
}

async function parseResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    return (await response.json()) as unknown
  }

  const text = await response.text()
  return text.length > 0 ? text : null
}

export function createJsonApiClient(config: ApiClientConfig) {
  const fetchImpl = config.fetch ?? fetch

  return {
    async request<TResponse, TBody = undefined>(
      options: JsonRequestOptions<TBody>
    ): Promise<TResponse> {
      const url = buildUrl(config.baseUrl, options.path, options.query)
      const hasJsonBody = options.body !== undefined

      const requestOnce = async (accessToken?: string | null) => {
        const runtimeHeaders = config.getHeaders ? await config.getHeaders() : undefined
        const resolvedAccessToken =
          accessToken ?? (config.getAccessToken ? await config.getAccessToken() : undefined)
        const headers = mergeHeaders(
          hasJsonBody ? { 'content-type': 'application/json' } : undefined,
          config.defaultHeaders,
          runtimeHeaders,
          resolvedAccessToken ? { authorization: `Bearer ${resolvedAccessToken}` } : undefined,
          options.headers
        )

        const requestInit: RequestInit = {
          method: options.method,
          headers
        }

        if (hasJsonBody) {
          requestInit.body = JSON.stringify(options.body)
        }

        if (options.signal) {
          requestInit.signal = options.signal
        }

        return fetchImpl(url, requestInit)
      }

      let response = await requestOnce()
      let parsedBody = await parseResponseBody(response)

      if (!response.ok) {
        const error = new ApiClientError(`Request failed with status ${response.status}`, {
          status: response.status,
          url: url.toString(),
          body: parsedBody
        })

        if (response.status === 401 && config.onUnauthorized) {
          const refreshedAccessToken = await config.onUnauthorized(error)

          if (refreshedAccessToken) {
            response = await requestOnce(refreshedAccessToken)
            parsedBody = await parseResponseBody(response)
          }
        }

        if (!response.ok) {
          throw new ApiClientError(`Request failed with status ${response.status}`, {
            status: response.status,
            url: url.toString(),
            body: parsedBody
          })
        }
      }

      return parsedBody as TResponse
    }
  }
}

export function resolveApiBaseUrl(options: {
  override?: string | undefined
  envKeys: readonly string[]
  fallback: string
}): string {
  const override = options.override?.trim()

  if (override) {
    return override
  }

  return readRuntimeEnv(options.envKeys) ?? options.fallback
}
