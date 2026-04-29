import { Suspense } from 'react'

import { UserSignInPage } from '@/features/auth/user-sign-in-page'

export default function UserSignInRoute() {
  return (
    <Suspense fallback={null}>
      <UserSignInPage />
    </Suspense>
  )
}
