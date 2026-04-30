'use client'

import type {
  AdminSession,
  AuthSessionResponse,
  ProviderExchangeRequest
} from '@gravii/domain-types'
import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { hasAdminFirebaseConfig, signInAdminWithGoogle } from '@/lib/auth/firebase-client'
import {
  adminWorkspaceDomain,
  normalizeAdminNextPath
} from '@/lib/auth/shared'

import styles from './admin-sign-in-page.module.css'

async function exchangeAdminIdentity(input: ProviderExchangeRequest) {
  const response = await fetch('/api/auth/google/exchange', {
    body: JSON.stringify(input),
    headers: {
      'content-type': 'application/json'
    },
    method: 'POST'
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null
    throw new Error(payload?.error ?? 'Unable to establish the Gravii admin session.')
  }

  const payload = (await response.json()) as AuthSessionResponse<AdminSession>

  if (!payload.session) {
    throw new Error('The Gravii admin session was not returned.')
  }

  return payload.session
}

async function readExistingAdminSession() {
  const response = await fetch('/api/auth/session', {
    cache: 'no-store',
    credentials: 'include',
    method: 'GET'
  })

  if (!response.ok) {
    return null
  }

  const payload = (await response.json()) as AuthSessionResponse<AdminSession>
  return payload.session
}

export function AdminSignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState(`admin@${adminWorkspaceDomain}`)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isBootstrapping, setIsBootstrapping] = useState(true)
  const [isPending, setIsPending] = useState(false)

  const nextPath = useMemo(
    () => normalizeAdminNextPath(searchParams.get('next')),
    [searchParams]
  )

  const handleSuccess = () => {
    if (typeof window !== 'undefined') {
      window.location.replace(nextPath)
      return
    }

    router.replace(nextPath)
    router.refresh()
  }

  useEffect(() => {
    let cancelled = false

    const bootstrap = async () => {
      try {
        const session = await readExistingAdminSession()

        if (session && !cancelled) {
          handleSuccess()
          return
        }
      } catch {
        // keep sign-in available when the session probe fails
      }

      if (!cancelled) {
        setIsBootstrapping(false)
      }
    }

    void bootstrap()

    return () => {
      cancelled = true
    }
  }, [nextPath])

  const handleGoogle = async () => {
    setIsPending(true)
    setErrorMessage(null)

    try {
      if (!hasAdminFirebaseConfig()) {
        await exchangeAdminIdentity({
          email,
          provider: 'google_workspace'
        })
        handleSuccess()
        return
      }

      const credential = await signInAdminWithGoogle()

      if (!credential?.user.email) {
        throw new Error('Google Workspace sign-in did not return an email.')
      }

      await exchangeAdminIdentity({
        displayName: credential.user.displayName ?? undefined,
        email: credential.user.email,
        provider: 'google_workspace',
        providerToken: await credential.user.getIdToken()
      })

      handleSuccess()
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Admin sign-in failed.'
      )
    } finally {
      setIsPending(false)
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <div className={styles.eyebrow}>Gravii HQ</div>
        <h1 className={styles.title}>Sign in with your workspace account.</h1>
        <p className={styles.copy}>
          Only approved <strong>{adminWorkspaceDomain}</strong> Google Workspace
          accounts can enter the protected admin environment. Without Firebase
          config, this route falls back to seeded QA.
        </p>

        <label className={styles.field}>
          <span className={styles.label}>Workspace email</span>
          <input
            className={styles.input}
            disabled={isPending || isBootstrapping}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            value={email}
          />
        </label>

        <button
          className={styles.button}
          disabled={isPending || isBootstrapping}
          onClick={() => void handleGoogle()}
          type="button"
        >
          <span className={styles.buttonCopy}>
            <span className={styles.buttonTitle}>
              {isBootstrapping
                ? 'Checking session…'
                : isPending
                  ? 'Connecting workspace…'
                  : 'Continue with Google Workspace'}
            </span>
            <span className={styles.buttonHint}>
              The returned identity is exchanged for a Gravii admin session.
            </span>
          </span>
          <span aria-hidden="true">→</span>
        </button>

        <div className={styles.status} role="status">
          {errorMessage ?? (isBootstrapping ? 'Restoring your admin session…' : null)}
        </div>

        <footer className={styles.footer}>
          <span>Next destination</span>
          <span>{nextPath}</span>
        </footer>
      </section>
    </main>
  )
}
