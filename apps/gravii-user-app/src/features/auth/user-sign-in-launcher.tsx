'use client'

import { useEffect, useMemo } from 'react'

import { WalletAppKitProvider } from './wallet-appkit-provider'
import {
  readReferralCodeFromPath,
  UserWalletSignInFlow,
} from './user-wallet-sign-in-flow'

type UserSignInLauncherProps = {
  isOpen: boolean
  nextPath: string
  onAuthenticated: () => Promise<unknown> | unknown
  onCancel: () => void
  requestKey: number
}

export function UserSignInLauncher({
  isOpen,
  nextPath,
  onAuthenticated,
  onCancel,
  requestKey,
}: UserSignInLauncherProps) {
  const referralCode = useMemo(() => readReferralCodeFromPath(nextPath), [nextPath])

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onCancel])

  return (
    <WalletAppKitProvider>
      {isOpen ? (
        <UserWalletSignInFlow
          key={requestKey}
          autoStart
          nextPath={nextPath}
          onAuthenticated={onAuthenticated}
          onCancel={onCancel}
          referralCode={referralCode}
          variant="launcher"
        />
      ) : null}
    </WalletAppKitProvider>
  )
}
