'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import {
  clearUserIdentityBootstrapPending,
  markUserIdentityBootstrapPending,
  requestUserChallenge,
  readUserSession,
  storeUserToken,
  verifyUserWallet,
} from '@/lib/auth/user-api'
import { normalizeUserNextPath } from '@/lib/auth/shared'

import styles from './user-sign-in-page.module.css'

declare global {
  interface Window {
    ethereum?: {
      request: (args: {
        method: string
        params?: readonly unknown[]
      }) => Promise<unknown>
    }
  }
}

type PendingStage =
  | 'bootstrapping'
  | 'challenge'
  | 'signing'
  | 'verifying'
  | null

function readInjectedWalletAddress(accounts: unknown): string | null {
  if (!Array.isArray(accounts)) {
    return null
  }

  const [firstAccount] = accounts
  return typeof firstAccount === 'string' ? firstAccount : null
}

function readReferralCode(searchParams: URLSearchParams, nextPath: string): string | null {
  const directReferral = searchParams.get('ref')?.trim().toUpperCase()

  if (directReferral) {
    return directReferral
  }

  const nestedQuery = nextPath.split('?')[1]
  if (!nestedQuery) {
    return null
  }

  const nestedReferral = new URLSearchParams(nestedQuery).get('ref')
  return nestedReferral?.trim().toUpperCase() ?? null
}

function getStageTitle(stage: PendingStage) {
  if (stage === 'bootstrapping') {
    return 'Checking your Gravii session…'
  }

  if (stage === 'challenge') {
    return 'Preparing your sign-in challenge…'
  }

  if (stage === 'signing') {
    return 'Check your wallet to sign the challenge.'
  }

  if (stage === 'verifying') {
    return 'X-Raying your on-chain activity across 50+ chains…'
  }

  return 'Connect your wallet to enter Gravii.'
}

function getStageHint(stage: PendingStage) {
  if (stage === 'verifying') {
    return 'Building your Gravii ID and warming your X-Ray profile. New sign-ups can take around 10–30 seconds.'
  }

  if (stage === 'signing') {
    return 'MetaMask or another injected wallet should open a signing prompt.'
  }

  return 'We use a signed challenge and a 24 hour JWT. No server-side session cookies are required.'
}

export function UserSignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [pendingStage, setPendingStage] = useState<PendingStage>('bootstrapping')

  const nextPath = useMemo(
    () => normalizeUserNextPath(searchParams.get('next')),
    [searchParams]
  )
  const referralCode = useMemo(
    () => readReferralCode(searchParams, nextPath),
    [nextPath, searchParams]
  )

  const handleSessionReady = () => {
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
      const session = await readUserSession()

      if (session && !cancelled) {
        handleSessionReady()
        return
      }

      if (!cancelled) {
        setPendingStage(null)
      }
    }

    void bootstrap()

    return () => {
      cancelled = true
    }
  }, [nextPath, router])

  const handleInjectedWallet = async () => {
    setPendingStage('challenge')
    setErrorMessage(null)

    try {
      if (!window.ethereum) {
        throw new Error(
          'No injected wallet was detected. Install MetaMask or another EVM wallet to continue.'
        )
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      const walletAddress = readInjectedWalletAddress(accounts)

      if (!walletAddress) {
        throw new Error('No wallet account was returned by the provider.')
      }

      const challenge = await requestUserChallenge(walletAddress)

      setPendingStage('signing')
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [challenge.message, walletAddress],
      })

      if (typeof signature !== 'string') {
        throw new Error('The wallet provider did not return a valid signature.')
      }

      setPendingStage('verifying')
      const result = await verifyUserWallet({
        address: walletAddress,
        message: challenge.message,
        signature,
        ...(referralCode ? { referralCode } : {}),
      })

      if (result.status === 'created') {
        markUserIdentityBootstrapPending()
      } else {
        clearUserIdentityBootstrapPending()
      }

      storeUserToken(result.token)
      handleSessionReady()
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Wallet sign-in failed.'
      )
      setPendingStage(null)
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <div className={styles.eyebrow}>Gravii Launch App</div>
        <h1 className={styles.title}>Sign in with your wallet.</h1>
        <p className={styles.copy}>{getStageHint(pendingStage)}</p>

        {referralCode ? (
          <p className={styles.referralHint}>
            Referral detected: <span className={styles.mono}>{referralCode}</span>
          </p>
        ) : null}

        <div className={styles.stack}>
          <button
            className={`${styles.button} ${styles.buttonPrimary}`}
            disabled={pendingStage !== null}
            onClick={handleInjectedWallet}
            type="button"
          >
            <span className={styles.buttonLabel}>
              <span className={styles.buttonTitle}>
                {getStageTitle(pendingStage)}
              </span>
              <span className={styles.buttonHint}>
                Connect an injected EVM wallet to sign in and unlock your live Gravii ID and X-Ray surfaces.
              </span>
            </span>
            <span aria-hidden="true">→</span>
          </button>
        </div>

        <p className={styles.status} role={errorMessage ? 'alert' : 'status'}>
          {errorMessage}
        </p>

        <div className={styles.footer}>
          <span>JWT session restores on page refresh until the 24h token expires.</span>
          <span className={styles.mono}>{nextPath}</span>
        </div>
      </section>
    </main>
  )
}
