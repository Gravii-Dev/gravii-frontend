'use client'

import { useAppKit } from '@reown/appkit/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Address } from 'viem'
import { useConnection, useDisconnect, useSignMessage } from 'wagmi'

import {
  clearUserIdentityBootstrapPending,
  markUserIdentityBootstrapPending,
  requestUserChallenge,
  readUserSession,
  storeUserToken,
  verifyUserWallet,
} from '@/lib/auth/user-api'
import { normalizeUserNextPath } from '@/lib/auth/shared'
import { isWalletConnectConfigured } from '@/lib/wallet/appkit-config'

import styles from './user-sign-in-page.module.css'

type InjectedWalletProvider = {
  request: (args: {
    method: string
    params?: readonly unknown[]
  }) => Promise<unknown>
}

type PendingStage =
  | 'bootstrapping'
  | 'selecting'
  | 'challenge'
  | 'signing'
  | 'verifying'
  | null

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

function isEvmAddress(value: unknown): value is Address {
  return typeof value === 'string' && /^0x[a-fA-F0-9]{40}$/.test(value)
}

function readWalletAddress(accounts: unknown): Address | null {
  if (!Array.isArray(accounts)) {
    return null
  }

  const [firstAccount] = accounts
  return isEvmAddress(firstAccount) ? firstAccount : null
}

function getInjectedWalletProvider(): InjectedWalletProvider | null {
  const provider = window.ethereum

  if (
    provider &&
    typeof provider === 'object' &&
    'request' in provider &&
    typeof provider.request === 'function'
  ) {
    return provider as InjectedWalletProvider
  }

  return null
}

function getStageTitle(stage: PendingStage) {
  if (stage === 'bootstrapping') {
    return 'Checking your Gravii session…'
  }

  if (stage === 'selecting') {
    return 'Choose a wallet in WalletConnect.'
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
  if (stage === 'selecting') {
    return 'WalletConnect lets you choose MetaMask, Coinbase Wallet, Rabby, Trust Wallet, and supported mobile wallets from one modal.'
  }

  if (stage === 'verifying') {
    return 'Building your Gravii ID and warming your X-Ray profile. New sign-ups can take around 10–30 seconds.'
  }

  if (stage === 'signing') {
    return 'Your selected wallet should open a signing prompt. The signature proves wallet ownership without sending a transaction.'
  }

  return 'We use WalletConnect or a browser wallet fallback plus a signed challenge and a 24 hour JWT.'
}

export function UserSignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const connection = useConnection()
  const { disconnectAsync } = useDisconnect()
  const { open } = useAppKit()
  const { signMessageAsync } = useSignMessage()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [pendingStage, setPendingStage] = useState<PendingStage>('bootstrapping')
  const [shouldAuthenticateWallet, setShouldAuthenticateWallet] = useState(false)

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
        setPendingStage(null)
      }
    }

    void bootstrap()

    return () => {
      cancelled = true
    }
  }, [handleSessionReady])

  const authenticateWallet = useCallback(async (walletAddress: Address) => {
    setPendingStage('challenge')
    setErrorMessage(null)

    try {
      const challenge = await requestUserChallenge(walletAddress)

      setPendingStage('signing')
      const signature = await signMessageAsync({
        account: walletAddress,
        message: challenge.message,
      })

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
      setShouldAuthenticateWallet(false)
      setErrorMessage(
        error instanceof Error ? error.message : 'Wallet sign-in failed.'
      )
      setPendingStage(null)
    }
  }, [handleSessionReady, referralCode, signMessageAsync])

  const authenticateInjectedWallet = useCallback(async () => {
    setPendingStage('challenge')
    setErrorMessage(null)

    try {
      const provider = getInjectedWalletProvider()

      if (!provider) {
        throw new Error(
          'No browser wallet was detected. Install MetaMask, Rabby, Coinbase Wallet, or configure WalletConnect.'
        )
      }

      const accounts = await provider.request({
        method: 'eth_requestAccounts',
      })
      const walletAddress = readWalletAddress(accounts)

      if (!walletAddress) {
        throw new Error('No EVM wallet account was returned by the provider.')
      }

      const challenge = await requestUserChallenge(walletAddress)

      setPendingStage('signing')
      const signature = await provider.request({
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
      setShouldAuthenticateWallet(false)
      setErrorMessage(
        error instanceof Error ? error.message : 'Wallet sign-in failed.'
      )
      setPendingStage(null)
    }
  }, [handleSessionReady, referralCode])

  useEffect(() => {
    if (!shouldAuthenticateWallet || !connection.isConnected || !connection.address) {
      return
    }

    const walletAddress = connection.address
    const timeoutId = window.setTimeout(() => {
      void authenticateWallet(walletAddress)
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [
    authenticateWallet,
    connection.address,
    connection.isConnected,
    shouldAuthenticateWallet,
  ])

  const handleWalletConnect = async () => {
    setErrorMessage(null)

    if (!isWalletConnectConfigured) {
      await authenticateInjectedWallet()
      return
    }

    try {
      if (connection.isConnected && connection.address) {
        await disconnectAsync()
      }

      setShouldAuthenticateWallet(true)
      setPendingStage('selecting')
      await open()
    } catch (error) {
      setShouldAuthenticateWallet(false)
      setPendingStage(null)
      setErrorMessage(
        error instanceof Error ? error.message : 'WalletConnect modal failed to open.'
      )
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.panel} data-liquid-glass="panel">
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
            data-liquid-glass="soft"
            disabled={pendingStage !== null}
            onClick={handleWalletConnect}
            type="button"
          >
            <span className={styles.buttonLabel}>
              <span className={styles.buttonTitle}>
                {getStageTitle(pendingStage)}
              </span>
              <span className={styles.buttonHint}>
                Pick your preferred EVM wallet through WalletConnect. If WalletConnect is not configured locally, Gravii falls back to your browser wallet.
              </span>
            </span>
            <span aria-hidden="true">→</span>
          </button>
        </div>

        <p className={styles.status} role={errorMessage ? 'alert' : 'status'}>
          {errorMessage}
        </p>

        <div className={styles.footer}>
          <span>WalletConnect session + Gravii JWT restore after refresh.</span>
          <span className={styles.mono}>{nextPath}</span>
        </div>
      </section>
    </main>
  )
}
