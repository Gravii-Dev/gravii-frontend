import { Suspense } from 'react'

import { PartnerSignInPage } from '@/features/auth/partner-sign-in-page'

export default function PartnerSignInRoute() {
  return (
    <Suspense fallback={null}>
      <PartnerSignInPage />
    </Suspense>
  )
}
