'use client'

import ActionButton from '@/components/ui/action-button'
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

  return (
    <div className={`${styles.root} ${dark ? styles.rootDark : styles.rootLight}`}>
      <div className={styles.card}>
        <div className={styles.headerLine}>
          <span className={styles.eyebrow}>{eyebrow}</span>
          <span className={styles.statusPill}>{sessionLabel}</span>
        </div>

        <h2 className={styles.title}>{title}</h2>
        <p className={styles.copy}>{copy}</p>

        <div className={styles.badges}>
          <span className={styles.badge}>Surface reserved</span>
          <span className={styles.badgeMuted}>Live route locked</span>
        </div>
      </div>

      <section className={styles.readinessPanel} aria-label={`${eyebrow} readiness`}>
        <div className={styles.metricGrid}>
          {metrics.map((metric) => (
            <div key={metric.label} className={styles.metricCard}>
              <span className={styles.metricLabel}>{metric.label}</span>
              <strong className={styles.metricValue}>{metric.value}</strong>
              <span className={styles.metricMeta}>{metric.meta}</span>
            </div>
          ))}
        </div>

        <div className={styles.timeline}>
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
  )
}
