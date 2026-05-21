import type { Metadata } from 'next'
import { Link } from '@/components/ui/link'
import styles from '../legal.module.css'

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'Gravii privacy information and contact details.',
}

export default function PrivacyPage() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Legal</p>
        <h1 className={styles.title}>Privacy</h1>
        <p className={styles.copy}>
          Gravii&apos;s public privacy policy is being finalized. For privacy
          requests, contact{' '}
          <Link className={styles.link} href="mailto:partners@gravii.io">
            partners@gravii.io
          </Link>
          .
        </p>
      </div>
    </main>
  )
}
