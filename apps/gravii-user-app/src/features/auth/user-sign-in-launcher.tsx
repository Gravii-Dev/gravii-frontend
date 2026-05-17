'use client'

import { useEffect, useMemo } from 'react'

import { WalletAppKitProvider } from './wallet-appkit-provider'
import {
  readReferralCodeFromPath,
  UserWalletSignInFlow,
} from './user-wallet-sign-in-flow'

type UserSignInLauncherProps = {
  nextPath: string
  onAuthenticated: () => Promise<unknown> | unknown
  onCancel: () => void
}

export function UserSignInLauncher({
  nextPath,
  onAuthenticated,
  onCancel,
}: UserSignInLauncherProps) {
  const referralCode = useMemo(() => readReferralCodeFromPath(nextPath), [nextPath])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onCancel])

  return (
    <WalletAppKitProvider>
      <UserWalletSignInFlow
        autoStart
        nextPath={nextPath}
        onAuthenticated={onAuthenticated}
        onCancel={onCancel}
        referralCode={referralCode}
        variant="launcher"
      />
    </WalletAppKitProvider>
  )
}
