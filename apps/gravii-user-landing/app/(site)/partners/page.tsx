import type { Metadata } from 'next'
import { LandingPage } from '@/features/partner-landing/landing-page'
import { SITE_BASE_URL } from '@/lib/config/site'

export const metadata: Metadata = {
  title: 'Partners',
  description:
    'Deterministic on-chain intelligence for partners building growth, verification, and user analytics with Gravii.',
  alternates: {
    canonical: '/partners',
  },
  openGraph: {
    url: `${SITE_BASE_URL}/partners`,
    title: 'Partners | Gravii',
    description:
      'Deterministic on-chain intelligence for partners building growth, verification, and user analytics with Gravii.',
  },
}

export default function PartnersPage() {
  return <LandingPage />
}
