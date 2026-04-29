'use client'

import { useRouter } from 'next/navigation'

import { usePartnerAuth } from '@/features/auth/auth-provider'
import {
  formatPartnerLastLogin,
  formatPartnerPlanLabel,
  formatPartnerStatusLabel,
  getPartnerWorkspaceName
} from '@/lib/partner-profile'
import styles from './settings-page.module.css'

export function SettingsPage() {
  const router = useRouter()
  const auth = usePartnerAuth()
  const partnerName = getPartnerWorkspaceName(auth.session)
  const planLabel = formatPartnerPlanLabel(auth.session?.plan)
  const statusLabel = formatPartnerStatusLabel(auth.session?.status)
  const lastLoginLabel = formatPartnerLastLogin(auth.session?.lastLoginAt)

  return (
    <div className={styles.page}>
      <div className={styles.mainHeader}>
        <h1 className={styles.mainTitle}>Settings</h1>
      </div>

      <section className={styles.card}>
        <div className={styles.cardTitle}>Setup</div>
        <div className={styles.cardCopy}>
          Want to change your dashboard setup?{' '}
          <button
            type="button"
            className={styles.inlineAction}
            onClick={() => router.push('/')}
          >
            Re-run onboarding →
          </button>
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.cardTitle}>Account</div>
        <div className={styles.accountGrid}>
          <div className={styles.accountItem}>
            <div className={styles.accountLabel}>Partner Name</div>
            <div className={styles.accountValue}>{partnerName}</div>
          </div>
          <div className={styles.accountItem}>
            <div className={styles.accountLabel}>Plan</div>
            <div className={`${styles.accountValue} ${styles.planValue}`}>{planLabel}</div>
          </div>
          <div className={styles.accountItem}>
            <div className={styles.accountLabel}>Email</div>
            <div className={styles.accountValue}>{auth.session?.email ?? '—'}</div>
          </div>
          <div className={styles.accountItem}>
            <div className={styles.accountLabel}>Account Status</div>
            <div className={styles.accountValue}>{statusLabel}</div>
          </div>
          <div className={styles.accountItem}>
            <div className={styles.accountLabel}>Last Login</div>
            <div className={styles.accountValue}>{lastLoginLabel}</div>
          </div>
        </div>
        <div className={styles.accountActions}>
          <button
            type="button"
            className={styles.signOutButton}
            onClick={() => void auth.signOut()}
          >
            Sign out of workspace
          </button>
        </div>
      </section>
    </div>
  )
}
