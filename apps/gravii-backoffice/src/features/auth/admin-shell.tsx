'use client'

import { usePathname } from 'next/navigation'

import { useAdminAuth } from '@/features/auth/auth-provider'
import { adminSignInPath } from '@/lib/auth/shared'

import styles from './admin-shell.module.css'

export function AdminShell({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const auth = useAdminAuth()

  if (pathname === adminSignInPath) {
    return <>{children}</>
  }

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <div className={styles.brandBlock}>
          <span className={styles.eyebrow}>Gravii HQ</span>
          <span className={styles.title}>Protected admin workspace</span>
        </div>

        {auth.session ? (
          <div className={styles.sessionBlock}>
            <div className={styles.sessionMeta}>
              <span className={styles.sessionName}>
                {auth.session.identity.displayName}
              </span>
              <span className={styles.sessionEmail}>
                {auth.session.identity.email}
              </span>
            </div>
            <button
              className={styles.signOutButton}
              onClick={() => void auth.signOut()}
              type="button"
            >
              Sign out
            </button>
          </div>
        ) : null}
      </header>

      <div className={styles.content}>{children}</div>
    </div>
  )
}
