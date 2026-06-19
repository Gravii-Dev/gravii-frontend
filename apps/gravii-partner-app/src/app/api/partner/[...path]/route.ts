import { DEFAULT_PARTNER_API_BASE_URL } from '@gravii/api-clients'
import { NextResponse } from 'next/server'

type ProxyRouteContext = {
  params: Promise<{
    path?: string[]
  }>
}

const ignoredProxyHeaders = new Set([
  'accept-encoding',
  'connection',
  'content-encoding',
  'content-length',
  'host',
  'keep-alive',
  'origin',
  'referer',
  'transfer-encoding',
  'upgrade'
])

function resolvePartnerApiBaseUrl(): string {
  return (
    process.env.GRAVII_PARTNER_API_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_GRAVII_PARTNER_API_BASE_URL?.trim() ||
    DEFAULT_PARTNER_API_BASE_URL
  )
}

function buildTargetUrl(request: Request, pathSegments: string[] | undefined): URL {
  const upstreamPath = pathSegments?.map(encodeURIComponent).join('/') ?? ''
  const targetUrl = new URL(`/${upstreamPath}`, resolvePartnerApiBaseUrl())
  targetUrl.search = new URL(request.url).search

  return targetUrl
}

function buildProxyHeaders(requestHeaders: Headers): Headers {
  const headers = new Headers()

  requestHeaders.forEach((value, key) => {
    const normalizedKey = key.toLowerCase()

    if (ignoredProxyHeaders.has(normalizedKey) || normalizedKey.startsWith('sec-')) {
      return
    }

    headers.set(key, value)
  })

  return headers
}

async function proxyPartnerApiRequest(
  request: Request,
  context: ProxyRouteContext
): Promise<Response> {
  const { path } = await context.params
  const targetUrl = buildTargetUrl(request, path)
  const method = request.method.toUpperCase()
  const hasBody = method !== 'GET' && method !== 'HEAD'
  const body = hasBody ? await request.arrayBuffer() : undefined

  const upstreamResponse = await fetch(targetUrl, {
    body,
    cache: 'no-store',
    headers: buildProxyHeaders(request.headers),
    method,
    redirect: 'manual'
  })

  const responseHeaders = buildProxyHeaders(upstreamResponse.headers)

  return new NextResponse(upstreamResponse.body, {
    headers: responseHeaders,
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText
  })
}

export function GET(request: Request, context: ProxyRouteContext) {
  return proxyPartnerApiRequest(request, context)
}

export function POST(request: Request, context: ProxyRouteContext) {
  return proxyPartnerApiRequest(request, context)
}

export function PUT(request: Request, context: ProxyRouteContext) {
  return proxyPartnerApiRequest(request, context)
}

export function PATCH(request: Request, context: ProxyRouteContext) {
  return proxyPartnerApiRequest(request, context)
}

export function DELETE(request: Request, context: ProxyRouteContext) {
  return proxyPartnerApiRequest(request, context)
}
