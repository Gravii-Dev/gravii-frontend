'use client'

import { ChevronRight } from 'lucide-react'

import { Card } from '@/components/ui/card'

import type { DraftCampaign } from './data'
import styles from './campaign-builder.module.css'

interface CampaignBuilderDraftsProps {
  drafts: DraftCampaign[]
  onContinueEditing: (draft: DraftCampaign) => void
}

export function CampaignBuilderDrafts({
  drafts,
  onContinueEditing
}: CampaignBuilderDraftsProps) {
  return (
    <section className={styles.draftRow}>
      {drafts.map((draft) => (
        <Card key={draft.campaignName} className={styles.mockDraftCard}>
          <div className={styles.draftCardBody}>
            <div className={styles.mockDraftTop}>
              <div>
                <div className={styles.mockDraftPartner}>{draft.partnerName}</div>
                <div className={styles.mockDraftName}>{draft.campaignName}</div>
              </div>
              <div className={styles.mockDraftBadges}>
                <span className={styles.mockDraftType}>{draft.type}</span>
                <span className={styles.mockDraftStatus}>{draft.status}</span>
              </div>
            </div>
            <div className={styles.mockDraftMeta}>Not scheduled</div>
            <button
              type="button"
              className={styles.mockDraftLink}
              onClick={() => onContinueEditing(draft)}
            >
              Continue Editing <ChevronRight size={14} />
            </button>
          </div>
        </Card>
      ))}
    </section>
  )
}
