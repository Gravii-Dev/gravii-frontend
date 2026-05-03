'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import {
  clearUserToken,
  readUserSession,
  type UserAuthUser,
} from '@/lib/auth/user-api'
import {
  buildUserSignInHref,
  normalizeUserNextPath,
} from '@/lib/auth/shared'

type UserAuthStatus = 'loading' | 'authenticated' | 'anonymous'

interface UserAuthContextValue {
  beginSignIn: () => void
  isAuthenticated: boolean
  refreshSession: () => Promise<UserAuthUser | null>
  signOut: () => Promise<void>
  status: UserAuthStatus
  user: UserAuthUser | null
}

const UserAuthContext = createContext<UserAuthContextValue | null>(null)

export function UserAuthProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<UserAuthUser | null>(null)
  const [status, setStatus] = useState<UserAuthStatus>('loading')

  const nextPath = useMemo(() => {
    const currentSearch = searchParams.toString()
    const currentPath = pathname || '/'

    return normalizeUserNextPath(
      currentSearch ? `${currentPath}?${currentSearch}` : currentPath
    )
  }, [pathname, searchParams])

  const beginSignIn = useCallback(() => {
    router.push(buildUserSignInHref(nextPath))
  }, [nextPath, router])

  const bootstrapSession = useCallback(async () => {
    setStatus('loading')

    const nextUser = await readUserSession()

    if (nextUser) {
      setUser(nextUser)
      setStatus('authenticated')
      return nextUser
    }

    setUser(null)
    setStatus('anonymous')
    return null
  }, [])

  const refreshSession = useCallback(async () => {
    const nextUser = await readUserSession()

    if (nextUser) {
      setUser(nextUser)
      setStatus('authenticated')
      return nextUser
    }

    setUser(null)
    setStatus('anonymous')
    return null
  }, [])

  const signOut = useCallback(async () => {
    clearUserToken()
    setUser(null)
    setStatus('anonymous')
    router.replace('/')
  }, [router])

  useEffect(() => {
    void bootstrapSession()
  }, [bootstrapSession])

  const value = useMemo<UserAuthContextValue>(
    () => ({
      beginSignIn,
      isAuthenticated: status === 'authenticated' && user !== null,
      refreshSession,
      signOut,
      status,
      user,
    }),
    [beginSignIn, refreshSession, signOut, status, user]
  )

  return (
    <UserAuthContext.Provider value={value}>{children}</UserAuthContext.Provider>
  )
}

export function useUserAuth() {
  const context = useContext(UserAuthContext)

  if (!context) {
    throw new Error('useUserAuth must be used within UserAuthProvider')
  }

  return context
}
