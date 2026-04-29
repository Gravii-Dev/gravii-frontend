import type { AdminSession, AuthSessionResponse } from '@gravii/domain-types'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import {
  getAdminRefreshCookieName,
  getClearedAdminRefreshCookieOptions,
  restoreAdminSession
} from '@/lib/auth/server-session'

export async function GET() {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get(getAdminRefreshCookieName())?.value
  const session = restoreAdminSession(refreshToken)
  const response = NextResponse.json<AuthSessionResponse<AdminSession>>({
    ok: true,
    session
  })

  if (!session && refreshToken) {
    response.cookies.set(
      getAdminRefreshCookieName(),
      '',
      getClearedAdminRefreshCookieOptions()
    )
  }

  return response
}
