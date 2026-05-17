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
  clearUserSession,
  readUserSession,
  type UserAuthUser,
} from '@/lib/auth/user-api'
import { normalizeUserNextPath, userDefaultRedirectPath } from '@/lib/auth/shared'

type UserAuthStatus = 'loading' | 'authenticated' | 'anonymous'

interface UserAuthContextValue {
  beginSignIn: () => void
  cancelSignIn: () => void
  completeSignIn: () => Promise<UserAuthUser | null>
  isSignInModalOpen: boolean
  isAuthenticated: boolean
  refreshSession: () => Promise<UserAuthUser | null>
  signInNextPath: string
  signInRequestKey: number
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
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)
  const [signInNextPath, setSignInNextPath] = useState(userDefaultRedirectPath)
  const [signInRequestKey, setSignInRequestKey] = useState(0)

  const nextPath = useMemo(() => {
    const currentSearch = searchParams.toString()
    const currentPath = pathname || '/'

    return normalizeUserNextPath(
      currentSearch ? `${currentPath}?${currentSearch}` : currentPath
    )
  }, [pathname, searchParams])

  const beginSignIn = useCallback(() => {
    setSignInNextPath(nextPath)
    setSignInRequestKey((currentKey) => currentKey + 1)
    setIsSignInModalOpen(true)
  }, [nextPath])

  const bootstrapSession = useCallback(async () => {
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

  const cancelSignIn = useCallback(() => {
    setIsSignInModalOpen(false)
  }, [])

  const completeSignIn = useCallback(async () => {
    const nextUser = await refreshSession()
    setIsSignInModalOpen(false)

    return nextUser
  }, [refreshSession])

  const signOut = useCallback(async () => {
    await clearUserSession()
    setUser(null)
    setStatus('anonymous')
    router.replace('/')
  }, [router])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void bootstrapSession()
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [bootstrapSession])

  const value = useMemo<UserAuthContextValue>(
    () => ({
      beginSignIn,
      cancelSignIn,
      completeSignIn,
      isSignInModalOpen,
      isAuthenticated: status === 'authenticated' && user !== null,
      refreshSession,
      signInNextPath,
      signInRequestKey,
      signOut,
      status,
      user,
    }),
    [
      beginSignIn,
      cancelSignIn,
      completeSignIn,
      isSignInModalOpen,
      refreshSession,
      signInNextPath,
      signInRequestKey,
      signOut,
      status,
      user,
    ]
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
