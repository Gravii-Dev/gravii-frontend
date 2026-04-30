import type {
  AdminSession,
  AuthSessionResponse,
  ProviderExchangeRequest
} from '@gravii/domain-types'
import { NextResponse } from 'next/server'

import {
  getAdminRefreshCookieName,
  getAdminRefreshCookieOptions,
  issueAdminSession
} from '@/lib/auth/server-session'

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ProviderExchangeRequest
    const { refreshToken, session } = issueAdminSession(payload)
    const response = NextResponse.json<AuthSessionResponse<AdminSession>>({
      ok: true,
      session
    })

    response.cookies.set(
      getAdminRefreshCookieName(),
      refreshToken,
      getAdminRefreshCookieOptions(session.refreshTokenExpiresAt)
    )

    return response
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Unable to exchange this Google Workspace identity.'

    return NextResponse.json(
      {
        error: message
      },
      {
        status: 403
      }
    )
  }
}
