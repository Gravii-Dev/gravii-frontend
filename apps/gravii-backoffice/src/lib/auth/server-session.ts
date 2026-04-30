import 'server-only'

import type {
  AdminMe,
  AdminSession,
  ProviderExchangeRequest
} from '@gravii/domain-types'
import { createHmac } from 'node:crypto'

import {
  adminAuthRefreshCookieName,
  adminWorkspaceDomain
} from '@/lib/auth/shared'

const adminAccessTokenLifetimeMs = 15 * 60 * 1000
const adminRefreshTokenLifetimeMs = 7 * 24 * 60 * 60 * 1000

interface AdminRefreshPayload {
  displayName: string
  email: string
  provider: ProviderExchangeRequest['provider']
  refreshTokenExpiresAt: string
  subject: string
  workspaceDomain: string
}

interface AdminAccessPayload extends AdminRefreshPayload {
  expiresAt: string
  issuedAt: string
}

function getAdminAuthSecret(): string {
  return process.env.GRAVII_ADMIN_AUTH_SECRET?.trim() || 'gravii-admin-dev-secret'
}

function signPayload(payload: object): string {
  const encodedPayload = Buffer.from(JSON.stringify(payload), 'utf8').toString(
    'base64url'
  )
  const signature = createHmac('sha256', getAdminAuthSecret())
    .update(encodedPayload)
    .digest('base64url')

  return `${encodedPayload}.${signature}`
}

function verifyPayload<T>(token: string): T | null {
  const [encodedPayload, signature] = token.split('.')

  if (!encodedPayload || !signature) {
    return null
  }

  const expectedSignature = createHmac('sha256', getAdminAuthSecret())
    .update(encodedPayload)
    .digest('base64url')

  if (signature !== expectedSignature) {
    return null
  }

  try {
    return JSON.parse(
      Buffer.from(encodedPayload, 'base64url').toString('utf8')
    ) as T
  } catch {
    return null
  }
}

function hasExpired(isoString: string): boolean {
  return Date.parse(isoString) <= Date.now()
}

function buildAdminAccessPayload(
  refreshPayload: AdminRefreshPayload
): AdminAccessPayload {
  return {
    ...refreshPayload,
    expiresAt: new Date(Date.now() + adminAccessTokenLifetimeMs).toISOString(),
    issuedAt: new Date().toISOString()
  }
}

function buildAdminSession(
  accessPayload: AdminAccessPayload,
  refreshPayload: AdminRefreshPayload
): AdminSession {
  return {
    accessToken: signPayload(accessPayload),
    audience: 'admin',
    expiresAt: accessPayload.expiresAt,
    identity: {
      audience: 'admin',
      displayName: refreshPayload.displayName,
      email: refreshPayload.email,
      provider: refreshPayload.provider,
      role: 'admin',
      subject: refreshPayload.subject,
      tenantDomain: refreshPayload.workspaceDomain
    },
    issuedAt: accessPayload.issuedAt,
    refreshTokenExpiresAt: refreshPayload.refreshTokenExpiresAt,
    workspaceDomain: refreshPayload.workspaceDomain
  }
}

export function issueAdminSession(input: ProviderExchangeRequest) {
  const email = input.email?.trim().toLowerCase() || `admin@${adminWorkspaceDomain}`
  const emailDomain = email.split('@')[1] ?? ''

  if (emailDomain !== adminWorkspaceDomain) {
    throw new Error(`Only ${adminWorkspaceDomain} accounts can access Gravii HQ.`)
  }

  const refreshPayload: AdminRefreshPayload = {
    displayName: input.displayName?.trim() || 'Gravii Admin',
    email,
    provider: input.provider,
    refreshTokenExpiresAt: new Date(
      Date.now() + adminRefreshTokenLifetimeMs
    ).toISOString(),
    subject: email,
    workspaceDomain: adminWorkspaceDomain
  }

  return {
    refreshToken: signPayload(refreshPayload),
    session: buildAdminSession(
      buildAdminAccessPayload(refreshPayload),
      refreshPayload
    )
  }
}

export function restoreAdminSession(
  refreshToken: string | undefined
): AdminSession | null {
  if (!refreshToken) {
    return null
  }

  const refreshPayload = verifyPayload<AdminRefreshPayload>(refreshToken)

  if (!refreshPayload || hasExpired(refreshPayload.refreshTokenExpiresAt)) {
    return null
  }

  return buildAdminSession(
    buildAdminAccessPayload(refreshPayload),
    refreshPayload
  )
}

export function getAdminRefreshCookieName(): string {
  return adminAuthRefreshCookieName
}

export function getAdminRefreshCookieOptions(expiresAt: string) {
  return {
    expires: new Date(expiresAt),
    httpOnly: true,
    path: '/',
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production'
  }
}

export function getClearedAdminRefreshCookieOptions() {
  return {
    expires: new Date(0),
    httpOnly: true,
    path: '/',
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production'
  }
}

export function getSeededAdminMe(session: AdminSession): AdminMe {
  return {
    displayName: session.identity.displayName || 'Gravii Admin',
    email: session.identity.email || `admin@${adminWorkspaceDomain}`,
    workspaceDomain: session.workspaceDomain
  }
}
