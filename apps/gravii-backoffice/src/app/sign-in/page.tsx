import { Suspense } from 'react'

import { AdminSignInPage } from '@/features/auth/admin-sign-in-page'

export default function AdminSignInRoute() {
  return (
    <Suspense fallback={null}>
      <AdminSignInPage />
    </Suspense>
  )
}
