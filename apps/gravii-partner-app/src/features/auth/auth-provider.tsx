'use client'

import type { PartnerProfile } from '@gravii/domain-types'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { onIdTokenChanged, signOut as firebaseSignOut, type User } from 'firebase/auth'

import { getPartnerFirebaseAuth } from '@/lib/auth/firebase-client'
import { readPartnerSessionProfile } from '@/lib/auth/partner-api'
import {
  buildPartnerSignInHref,
  normalizePartnerNextPath,
  partnerSignInPath
} from '@/lib/auth/shared'
import { clearWorkspaceSettings } from '@/lib/workspace-settings'

type PartnerAuthStatus = 'loading' | 'authenticated' | 'anonymous'

interface PartnerAuthContextValue {
  beginSignIn: () => void
  isAuthenticated: boolean
  refreshSession: () => Promise<PartnerProfile | null>
  session: PartnerProfile | null
  signOut: () => Promise<void>
  status: PartnerAuthStatus
}

const PartnerAuthContext = createContext<PartnerAuthContextValue | null>(null)

export function PartnerAuthProvider({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [session, setSession] = useState<PartnerProfile | null>(null)
  const [status, setStatus] = useState<PartnerAuthStatus>('loading')
  const sessionRef = useRef<PartnerProfile | null>(null)
  const bootstrapPromiseRef = useRef<Promise<PartnerProfile | null> | null>(null)

  const nextPath = useMemo(() => {
    const currentSearch = searchParams.toString()
    const currentPath = pathname || '/'

    return normalizePartnerNextPath(
      currentSearch ? `${currentPath}?${currentSearch}` : currentPath
    )
  }, [pathname, searchParams])

  const signInNextPath = useMemo(
    () => normalizePartnerNextPath(searchParams.get('next')),
    [searchParams]
  )

  const beginSignIn = useCallback(() => {
    router.push(buildPartnerSignInHref(nextPath))
  }, [nextPath, router])

  useEffect(() => {
    sessionRef.current = session
  }, [session])

  const bootstrapSession = useCallback(async (
    user?: User | null,
    options?: {
      silent?: boolean
    }
  ) => {
    const auth = getPartnerFirebaseAuth()
    const activeUser = user ?? auth?.currentUser ?? null

    if (!activeUser) {
      bootstrapPromiseRef.current = null
      setSession(null)
      setStatus('anonymous')
      return null
    }

    if (!options?.silent || sessionRef.current === null) {
      setStatus('loading')
    }

    if (bootstrapPromiseRef.current) {
      return bootstrapPromiseRef.current
    }

    const bootstrapPromise = (async () => {
      try {
        const partner = await readPartnerSessionProfile()

        if (partner) {
          setSession(partner)
          setStatus('authenticated')
          return partner
        }
      } catch {
        // Let the redirect flow own recovery after sign-out below.
      }

      if (auth?.currentUser) {
        await firebaseSignOut(auth)
      }

      setSession(null)
      setStatus('anonymous')
      return null
    })()

    bootstrapPromiseRef.current = bootstrapPromise

    try {
      return await bootstrapPromise
    } finally {
      if (bootstrapPromiseRef.current === bootstrapPromise) {
        bootstrapPromiseRef.current = null
      }
    }
  }, [])

  const refreshSession = useCallback(async () => {
    const auth = getPartnerFirebaseAuth()
    const activeUser = auth?.currentUser ?? null

    if (!activeUser) {
      setSession(null)
      setStatus('anonymous')
      return null
    }

    await activeUser.getIdToken(true)
    return bootstrapSession(activeUser, { silent: true })
  }, [bootstrapSession])

  const signOut = useCallback(async () => {
    const auth = getPartnerFirebaseAuth()

    if (auth?.currentUser) {
      await firebaseSignOut(auth)
    }

    clearWorkspaceSettings()
    setSession(null)
    setStatus('anonymous')
    router.replace(buildPartnerSignInHref('/'))
  }, [router])

  useEffect(() => {
    const auth = getPartnerFirebaseAuth()

    if (!auth) {
      setSession(null)
      setStatus('anonymous')
      return () => undefined
    }

    const unsubscribe = onIdTokenChanged(auth, (user) => {
      void bootstrapSession(user, { silent: true })
    })

    return unsubscribe
  }, [bootstrapSession])

  useEffect(() => {
    if (status === 'anonymous' && pathname !== partnerSignInPath) {
      router.replace(buildPartnerSignInHref(nextPath))
    }
  }, [nextPath, pathname, router, status])

  useEffect(() => {
    if (status === 'authenticated' && pathname === partnerSignInPath) {
      router.replace(signInNextPath)
    }
  }, [pathname, router, signInNextPath, status])

  const value = useMemo<PartnerAuthContextValue>(
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
    <PartnerAuthContext.Provider value={value}>
      {children}
    </PartnerAuthContext.Provider>
  )
}

export function usePartnerAuth() {
  const context = useContext(PartnerAuthContext)

  if (!context) {
    throw new Error('usePartnerAuth must be used within PartnerAuthProvider')
  }

  return context
}
