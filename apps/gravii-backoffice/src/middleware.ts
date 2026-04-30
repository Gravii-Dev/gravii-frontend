import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import {
  adminAuthRefreshCookieName,
  adminSignInPath,
  buildAdminSignInHref
} from '@/lib/auth/shared'

function isAdminPublicPath(pathname: string): boolean {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === adminSignInPath
  )
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  if (isAdminPublicPath(pathname)) {
    if (
      pathname === adminSignInPath &&
      request.cookies.get(adminAuthRefreshCookieName)?.value
    ) {
      const nextPath = request.nextUrl.searchParams.get('next') || '/'
      return NextResponse.redirect(new URL(nextPath, request.url))
    }

    return NextResponse.next()
  }

  if (request.cookies.get(adminAuthRefreshCookieName)?.value) {
    return NextResponse.next()
  }

  return NextResponse.redirect(
    new URL(buildAdminSignInHref(`${pathname}${search}`), request.url)
  )
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)']
}
