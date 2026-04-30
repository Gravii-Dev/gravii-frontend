'use client'

import dynamic from 'next/dynamic'

import { usePartnerAuth } from '@/features/auth/auth-provider'

const OnboardingPage = dynamic(
  () =>
    import('@/features/onboarding/onboarding-page').then((module) => ({
      default: module.OnboardingPage
    })),
  {
    loading: () => null,
    ssr: false
  }
)

export default function HomePage() {
  const auth = usePartnerAuth()

  if (auth.status !== 'authenticated') {
    return null
  }

  return <OnboardingPage />
}
