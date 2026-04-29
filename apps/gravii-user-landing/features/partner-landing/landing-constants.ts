import type { Accent } from './landing-content'
import styles from './landing-page.module.css'

function resolvePartnerAppUrl() {
  const fallback =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3001'
      : 'https://partner.gravii.io'
  const candidate = process.env.NEXT_PUBLIC_PARTNER_APP_URL?.trim()

  if (!candidate) {
    return fallback
  }

  try {
    const url = new URL(candidate)

    if (
      url.hostname === 'partner.gravii.io' ||
      url.hostname === 'localhost' ||
      url.hostname === '127.0.0.1'
    ) {
      return candidate
    }
  } catch {
    return fallback
  }

  return fallback
}

export const dashboardHref = resolvePartnerAppUrl()

export type LandingSectionId = 'product' | 'solutions' | 'pricing'

export const accentClassMap: Record<Accent, string> = {
  teal: styles.accentTeal ?? '',
  blue: styles.accentBlue ?? '',
  purple: styles.accentPurple ?? '',
  amber: styles.accentAmber ?? '',
  orange: styles.accentOrange ?? '',
  red: '',
  cream: '',
}

export const cardAccentClassMap: Record<Accent, string> = {
  teal: styles.cardTeal ?? '',
  blue: styles.cardBlue ?? '',
  purple: styles.cardPurple ?? '',
  amber: styles.cardAmber ?? '',
  orange: styles.cardAmber ?? '',
  red: '',
  cream: '',
}

export function scrollToSection(sectionId: LandingSectionId): void {
  document.getElementById(sectionId)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}
