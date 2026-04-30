'use client'

import type { PartnerDataSurface } from '@/lib/partner-data-surfaces'
import { getPartnerDataSurfaceState } from '@/lib/partner-data-surfaces'

import styles from './partner-data-status.module.css'

interface PartnerDataStatusProps {
  className?: string
  surface: PartnerDataSurface
}

export function PartnerDataStatus({
  className,
  surface
}: PartnerDataStatusProps) {
  const state = getPartnerDataSurfaceState(surface)
  const rootClassName = className
    ? `${styles.status} ${className}`
    : styles.status

  return (
    <div className={rootClassName}>
      <span
        className={`${styles.pill} ${
          state.mode === 'live' ? styles.pillLive : styles.pillPreview
        }`}
      >
        {state.label}
      </span>
      <p className={styles.description}>{state.description}</p>
    </div>
  )
}
