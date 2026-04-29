import type { LogoutResponse } from '@gravii/domain-types'
import { NextResponse } from 'next/server'

import {
  getAdminRefreshCookieName,
  getClearedAdminRefreshCookieOptions
} from '@/lib/auth/server-session'

export async function POST() {
  const response = NextResponse.json<LogoutResponse>({
    ok: true
  })

  response.cookies.set(
    getAdminRefreshCookieName(),
    '',
    getClearedAdminRefreshCookieOptions()
  )

  return response
}
