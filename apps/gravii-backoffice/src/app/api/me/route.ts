import type { AdminMe } from '@gravii/domain-types'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { createAdminApiClient } from '@gravii/api-clients'

import {
  getAdminRefreshCookieName,
  getSeededAdminMe,
  restoreAdminSession
} from '@/lib/auth/server-session'

const shouldProxyAdminMe =
  process.env.GRAVII_ADMIN_ME_PROXY_ENABLED?.trim() === 'true'

export async function GET() {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get(getAdminRefreshCookieName())?.value
  const session = restoreAdminSession(refreshToken)

  if (!session) {
    return NextResponse.json(
      {
        error: 'Admin session not found.'
      },
      {
        status: 401
      }
    )
  }

  if (!shouldProxyAdminMe) {
    return NextResponse.json<AdminMe>(getSeededAdminMe(session))
  }

  try {
    const client = createAdminApiClient({
      getAccessToken: () => session.accessToken
    })
    const me = await client.getMe()

    return NextResponse.json<AdminMe>(me)
  } catch {
    return NextResponse.json(
      {
        error: 'Unable to read /api/v1/me from the admin API.'
      },
      {
        status: 502
      }
    )
  }
}
