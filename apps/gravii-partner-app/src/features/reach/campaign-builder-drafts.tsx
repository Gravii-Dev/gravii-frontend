'use client'

import { ChevronRight } from 'lucide-react'

import { Card } from '@/components/ui/card'

import { draftCampaigns } from './data'
import styles from './campaign-builder.module.css'

type DraftCampaign = (typeof draftCampaigns)[number]

interface CampaignBuilderDraftsProps {
  onContinueEditing: (draft: DraftCampaign) => void
}

export function CampaignBuilderDrafts({
  onContinueEditing
}: CampaignBuilderDraftsProps) {
  return (
    <section className={styles.draftRow}>
      {draftCampaigns.map((draft) => (
        <Card key={draft.campaignName} title={draft.campaignName} eyebrow={`${draft.partnerName} · ${draft.status}`}>
          <div className={styles.draftCardBody}>
            <p>{draft.summary}</p>
            <button
              type="button"
              className="button-secondary"
              onClick={() => onContinueEditing(draft)}
            >
              Continue editing
              <ChevronRight size={16} />
            </button>
          </div>
        </Card>
      ))}
    </section>
  )
}
