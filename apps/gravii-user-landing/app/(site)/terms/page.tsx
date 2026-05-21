import type { Metadata } from 'next'
import { Link } from '@/components/ui/link'
import styles from '../legal.module.css'

export const metadata: Metadata = {
  title: 'Terms',
  description: 'Gravii terms information and contact details.',
}

export default function TermsPage() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Legal</p>
        <h1 className={styles.title}>Terms</h1>
        <p className={styles.copy}>
          Gravii&apos;s public terms are being finalized. For terms or partner
          access questions, contact{' '}
          <Link className={styles.link} href="mailto:partners@gravii.io">
            partners@gravii.io
          </Link>
          .
        </p>
      </div>
    </main>
  )
}
