'use client'

import ActionButton from '@/components/ui/action-button'
import GraviiLogo from '@/components/ui/gravii-logo'
import type { PanelId, SharedContentProps } from '@/features/launch-app/types'

import styles from './coming-soon-content.module.css'

type ReservedMetric = {
  label: string
  meta: string
  value: string
}

type ReservedStep = {
  label: string
  status: 'building' | 'queued' | 'ready'
}

interface ComingSoonContentProps extends SharedContentProps {
  copy: string
  eyebrow: string
  lockActionLabel?: string
  lockCopy?: string
  lockTitle?: string
  lockWhenDisconnected?: boolean
  metrics: ReservedMetric[]
  primaryActionLabel?: string
  primaryRoute?: PanelId
  secondaryActionLabel?: string
  secondaryRoute?: PanelId
  steps: ReservedStep[]
  title: string
}

function stepClass(status: ReservedStep['status']) {
  if (status === 'ready') {
    return styles.stepReady
  }

  if (status === 'building') {
    return styles.stepBuilding
  }

  return styles.stepQueued
}

export default function ComingSoonContent({
  connected,
  copy,
  dark,
  eyebrow,
  lockActionLabel = 'SIGN IN',
  lockCopy = 'Connect your wallet to reveal the personalized layer.',
  lockTitle = 'Session required',
  lockWhenDisconnected = false,
  metrics,
  onConnect,
  onNavigate,
  primaryActionLabel = 'Open Gravii ID',
  primaryRoute = 'profile',
  secondaryActionLabel = 'Open X-Ray',
  secondaryRoute = 'lookup',
  steps,
  title,
}: ComingSoonContentProps) {
  const sessionLabel = connected ? 'Session linked' : 'Session required'
  const isLocked = lockWhenDisconnected && !connected

  return (
    <div className={`${styles.root} ${dark ? styles.rootDark : styles.rootLight}`}>
      <div
        className={`${styles.contentLayer} ${isLocked ? styles.contentLayerLocked : ''}`}
        inert={isLocked ? true : undefined}
      >
        <div className={styles.card} data-liquid-glass="panel">
          <GraviiLogo decorative variant="symbol" className={styles.watermark} />

          <div className={styles.headerLine}>
            <span className={styles.eyebrow}>{eyebrow}</span>
            <span className={styles.statusPill} data-liquid-glass="soft">{sessionLabel}</span>
          </div>

          <h2 className={styles.title}>{title}</h2>
          <p className={styles.copy}>{copy}</p>

          <div className={styles.badges}>
            <span className={styles.badge} data-liquid-glass="soft">Surface reserved</span>
            <span className={styles.badgeMuted} data-liquid-glass="soft">Live route locked</span>
          </div>
        </div>

        <section className={styles.readinessPanel} data-liquid-glass="panel" aria-label={`${eyebrow} readiness`}>
          <div className={styles.metricGrid}>
            {metrics.map((metric) => (
              <div key={metric.label} className={styles.metricCard} data-liquid-glass="soft">
                <span className={styles.metricLabel}>{metric.label}</span>
                <strong className={styles.metricValue}>{metric.value}</strong>
                <span className={styles.metricMeta}>{metric.meta}</span>
              </div>
            ))}
          </div>

          <div className={styles.timeline} data-liquid-glass="soft">
            <span className={styles.timelineLabel}>Launch readiness</span>
            {steps.map((step) => (
              <div key={step.label} className={styles.timelineStep}>
                <span className={`${styles.stepDot} ${stepClass(step.status)}`} />
                <span className={styles.stepLabel}>{step.label}</span>
                <span className={styles.stepStatus}>{step.status}</span>
              </div>
            ))}
          </div>

          <div className={styles.actionDock}>
            <ActionButton
              size="panel"
              className={styles.primaryAction}
              onClick={() => {
                if (connected) {
                  onNavigate?.(primaryRoute)
                  return
                }

                onConnect()
              }}
            >
              {connected ? primaryActionLabel : 'Restore session'}
            </ActionButton>
            <ActionButton
              size="panel"
              className={styles.secondaryAction}
              onClick={() => onNavigate?.(secondaryRoute)}
            >
              {secondaryActionLabel}
            </ActionButton>
          </div>
        </section>
      </div>

      {isLocked ? (
        <div className={styles.lockOverlay} role="region" aria-label={`${eyebrow} sign-in gate`}>
          <div className={styles.lockCard} data-liquid-glass="panel">
            <span className={styles.lockEyebrow}>Wallet layer locked</span>
            <h3>{lockTitle}</h3>
            <p>{lockCopy}</p>
            <ActionButton size="panel" className={styles.lockAction} onClick={onConnect}>
              {lockActionLabel}
            </ActionButton>
          </div>
        </div>
      ) : null}
    </div>
  )
}
