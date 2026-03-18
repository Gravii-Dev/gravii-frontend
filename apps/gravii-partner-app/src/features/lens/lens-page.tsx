'use client'

import { FileUp, MoveRight } from 'lucide-react'
import { useState } from 'react'

import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { WorkspaceHandoffLink } from '@/components/ui/workspace-handoff-link'
import { formatNumber } from '@/lib/format'

import { lensSnapshot } from './data'
import styles from './lens-page.module.css'

export function LensPage() {
  const [hasAnalyzed, setHasAnalyzed] = useState(false)

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow="Gravii Lens"
        title="Diagnose a wallet list before product and growth teams touch it."
        description="Lens is now represented as a focused route with a clear upload step, summary state, and handoff into other product workflows."
      />

      <Card accent="blue" className={styles.uploadCard}>
        <div className={styles.uploadBody}>
          <div className={styles.uploadIcon}>
            <FileUp size={22} />
          </div>
          <div>
            <h2>Analyze your wallet pool</h2>
            <p>
              Upload a CSV of wallets to generate a partner-ready snapshot covering tier mix,
              personas, chains, and sybil exposure.
            </p>
          </div>
          <button type="button" className="button-primary" onClick={() => setHasAnalyzed(true)}>
            Upload sample CSV
          </button>
        </div>
      </Card>

      {hasAnalyzed ? (
        <>
          <Card
            title={`Analysis report · ${lensSnapshot.fileName}`}
            eyebrow="Report ready"
            action={<span className="pill">{formatNumber(lensSnapshot.walletCount)} wallets</span>}
          >
            <div className="grid-auto-4">
              {lensSnapshot.reportCards.map((card) => (
                <article key={card.label} className={styles.reportCard}>
                  <p className="eyebrow-label">{card.label}</p>
                  <h3>{card.headline}</h3>
                  <p>{card.detail}</p>
                </article>
              ))}
            </div>
          </Card>

          <div className="grid-auto-2">
            <Card title="Recommended next moves" eyebrow="Product handoff">
              <div className={styles.noteList}>
                {lensSnapshot.activationNotes.map((note) => (
                  <article key={note} className={styles.noteRow}>
                    <span className={styles.noteBullet} aria-hidden="true" />
                    <p>{note}</p>
                  </article>
                ))}
              </div>
            </Card>

            <Card title="Operational handoff" eyebrow="Launch from the insight">
              <div className={styles.handoffCard}>
                <p>
                  This summary is intentionally compact. Open the dashboard for richer segmentation
                  or move into X-Ray Users to start the original Reach-side activation flow.
                </p>
                <div className={styles.handoffActions}>
                  <WorkspaceHandoffLink
                    href="/dashboard"
                    requiredPages={['overview']}
                    className="button-secondary"
                  >
                    Open dashboard
                  </WorkspaceHandoffLink>
                  <WorkspaceHandoffLink
                    href="/connect?module=xray-link"
                    requiredPages={['drive']}
                    className="button-primary"
                  >
                    Open X-Ray Users
                    <MoveRight size={16} />
                  </WorkspaceHandoffLink>
                </div>
              </div>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  )
}
