'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { readUserSession } from '@/lib/auth/user-api'
import { normalizeUserNextPath } from '@/lib/auth/shared'

import styles from './user-sign-in-page.module.css'
import {
  readReferralCodeFromPath,
  UserWalletSignInFlow,
} from './user-wallet-sign-in-flow'

function readReferralCode(searchParams: URLSearchParams, nextPath: string): string | null {
  const directReferral = searchParams.get('ref')?.trim().toUpperCase()

  if (directReferral) {
    return directReferral
  }

  return readReferralCodeFromPath(nextPath)
}

export function UserSignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isBootstrapping, setIsBootstrapping] = useState(true)

  const nextPath = useMemo(
    () => normalizeUserNextPath(searchParams.get('next')),
    [searchParams]
  )
  const referralCode = useMemo(
    () => readReferralCode(searchParams, nextPath),
    [nextPath, searchParams]
  )

  const handleSessionReady = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.location.replace(nextPath)
      return
    }

    router.replace(nextPath)
    router.refresh()
  }, [nextPath, router])

  useEffect(() => {
    let cancelled = false

    const bootstrap = async () => {
      const session = await readUserSession()

      if (session && !cancelled) {
        handleSessionReady()
        return
      }

      if (!cancelled) {
        setIsBootstrapping(false)
      }
    }

    void bootstrap()

    return () => {
      cancelled = true
    }
  }, [handleSessionReady])

  return (
    <main className={styles.page}>
      {isBootstrapping ? (
        <section className={styles.panel} data-liquid-glass="panel">
          <div className={styles.eyebrow}>Gravii Launch App</div>
          <h1 className={styles.title}>Checking your Gravii session...</h1>
          <p className={styles.copy}>Restoring a previous wallet-backed session if one exists.</p>
        </section>
      ) : (
        <UserWalletSignInFlow
          nextPath={nextPath}
          onAuthenticated={handleSessionReady}
          referralCode={referralCode}
          variant="page"
        />
      )}
    </main>
  )
}
