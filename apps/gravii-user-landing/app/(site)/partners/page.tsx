import type { Metadata } from 'next'
import { LandingPage } from '@/features/partner-landing/landing-page'

const APP_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000')

export const metadata: Metadata = {
  title: 'Partners',
  description:
    'Deterministic on-chain intelligence for partners building growth, verification, and user analytics with Gravii.',
  alternates: {
    canonical: '/partners',
  },
  openGraph: {
    url: `${APP_BASE_URL}/partners`,
    title: 'Partners | Gravii',
    description:
      'Deterministic on-chain intelligence for partners building growth, verification, and user analytics with Gravii.',
  },
}

export default function PartnersPage() {
  return <LandingPage />
}
