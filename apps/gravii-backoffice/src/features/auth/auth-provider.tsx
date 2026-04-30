'use client'

import type { AdminSession, AuthSessionResponse } from '@gravii/domain-types'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import {
  adminSignInPath,
  buildAdminSignInHref,
  normalizeAdminNextPath
} from '@/lib/auth/shared'

type AdminAuthStatus = 'loading' | 'authenticated' | 'anonymous'

interface AdminAuthContextValue {
  beginSignIn: () => void
  isAuthenticated: boolean
  refreshSession: () => Promise<AdminSession | null>
  session: AdminSession | null
  signOut: () => Promise<void>
  status: AdminAuthStatus
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)

async function readAdminSession(
  endpoint: '/api/auth/session' | '/api/auth/refresh'
) {
  const response = await fetch(endpoint, {
    cache: 'no-store',
    credentials: 'include',
    method: endpoint === '/api/auth/refresh' ? 'POST' : 'GET'
  })

  if (!response.ok) {
    return null
  }

  const payload = (await response.json()) as AuthSessionResponse<AdminSession>
  return payload.session
}

export function AdminAuthProvider({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [session, setSession] = useState<AdminSession | null>(null)
  const [status, setStatus] = useState<AdminAuthStatus>('loading')

  const nextPath = useMemo(() => {
    const currentSearch = searchParams.toString()
    const currentPath = pathname || '/'

    return normalizeAdminNextPath(
      currentSearch ? `${currentPath}?${currentSearch}` : currentPath
    )
  }, [pathname, searchParams])

  const beginSignIn = useCallback(() => {
    router.push(buildAdminSignInHref(nextPath))
  }, [nextPath, router])

  const bootstrapSession = useCallback(async () => {
    setStatus('loading')

    try {
      const nextSession = await readAdminSession('/api/auth/session')

      if (nextSession) {
        setSession(nextSession)
        setStatus('authenticated')
        return nextSession
      }
    } catch {
      // no-op
    }

    setSession(null)
    setStatus('anonymous')
    return null
  }, [])

  const refreshSession = useCallback(async () => {
    try {
      const nextSession = await readAdminSession('/api/auth/refresh')

      if (nextSession) {
        setSession(nextSession)
        setStatus('authenticated')
        return nextSession
      }
    } catch {
      // no-op
    }

    setSession(null)
    setStatus('anonymous')
    return null
  }, [])

  const signOut = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        credentials: 'include',
        method: 'POST'
      })
    } finally {
      setSession(null)
      setStatus('anonymous')
      router.replace(buildAdminSignInHref('/'))
    }
  }, [router])

  useEffect(() => {
    void bootstrapSession()
  }, [bootstrapSession])

  useEffect(() => {
    if (status === 'anonymous' && pathname !== adminSignInPath) {
      router.replace(buildAdminSignInHref(nextPath))
    }
  }, [nextPath, pathname, router, status])

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      beginSignIn,
      isAuthenticated: status === 'authenticated' && session !== null,
      refreshSession,
      session,
      signOut,
      status
    }),
    [beginSignIn, refreshSession, session, signOut, status]
  )

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)

  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider')
  }

  return context
}
