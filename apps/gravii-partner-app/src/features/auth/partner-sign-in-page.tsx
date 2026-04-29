'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { getPartnerFirebaseAuth, signInPartnerWithGoogle } from '@/lib/auth/firebase-client'
import { createOrRestorePartnerAccount, readPartnerSessionProfile } from '@/lib/auth/partner-api'
import { normalizePartnerNextPath } from '@/lib/auth/shared'

import styles from './partner-sign-in-page.module.css'

const shouldPrefetchRoutes = process.env.NODE_ENV === 'production'

export function PartnerSignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isBootstrapping, setIsBootstrapping] = useState(true)
  const [isSigningIn, setIsSigningIn] = useState(false)

  const nextPath = useMemo(
    () => normalizePartnerNextPath(searchParams.get('next')),
    [searchParams]
  )

  const finishSignIn = () => {
    const destination = nextPath || '/'

    if (typeof window !== 'undefined') {
      window.location.replace(destination)
      return
    }

    router.replace(destination)
    router.refresh()
  }

  const handleGoogle = async () => {
    setIsSigningIn(true)
    setErrorMessage(null)

    try {
      const credential = await signInPartnerWithGoogle()

      if (!credential?.user) {
        throw new Error('Google sign-in did not complete successfully.')
      }

      await createOrRestorePartnerAccount()
      finishSignIn()
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Google sign-in failed.'
      )
      setIsSigningIn(false)
    }
  }

  useEffect(() => {
    let cancelled = false

    const bootstrap = async () => {
      try {
        const auth = getPartnerFirebaseAuth()
        const user = auth?.currentUser ?? null

        if (!user) {
          if (!cancelled) {
            setIsBootstrapping(false)
          }
          return
        }

        const partner = await readPartnerSessionProfile()

        if (!partner) {
          if (!cancelled) {
            setIsBootstrapping(false)
          }
          return
        }

        if (!cancelled) {
          finishSignIn()
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error ? error.message : 'Unable to restore the partner session.'
          )
          setIsBootstrapping(false)
        }
      }
    }

    void bootstrap()

    return () => {
      cancelled = true
    }
  }, [nextPath, router])

  useEffect(() => {
    if (!shouldPrefetchRoutes) {
      return
    }

    router.prefetch(nextPath || '/')
  }, [nextPath, router])

  const statusMessage =
    errorMessage ??
    (isBootstrapping ? 'Restoring your existing Gravii partner session…' : null)

  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <div className={styles.eyebrow}>Gravii Partner Workspace</div>
        <h1 className={styles.title}>Sign in with Google to access your partner area.</h1>
        <p className={styles.copy}>
          Partner authentication now follows the live product flow: Google OAuth in Firebase,
          then Bearer-token validation against the Gravii Partner API.
        </p>

        <div className={styles.stack}>
          <button
            className={styles.button}
            disabled={isBootstrapping || isSigningIn}
            onClick={() => void handleGoogle()}
            type="button"
          >
            <span className={styles.buttonLabel}>
              <span className={styles.buttonTitle}>
                {isBootstrapping
                  ? 'Checking session…'
                  : isSigningIn
                    ? 'Connecting Google…'
                    : 'Continue with Google'}
              </span>
              <span className={styles.buttonHint}>
                Your Firebase session is auto-restored and the backend validates it on app load.
              </span>
            </span>
            <span aria-hidden="true">→</span>
          </button>
        </div>

        <div className={styles.status} role="status">
          {statusMessage}
        </div>

        <footer className={styles.footer}>
          <span>Next destination</span>
          <span className={styles.mono}>{nextPath}</span>
        </footer>
      </section>
    </main>
  )
}
