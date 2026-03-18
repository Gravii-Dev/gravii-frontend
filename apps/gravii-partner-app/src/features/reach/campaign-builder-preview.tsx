'use client'

import { Sparkles } from 'lucide-react'

import { Card } from '@/components/ui/card'

import type { CampaignFormState } from './campaign-builder-model'
import styles from './campaign-builder.module.css'

interface CampaignBuilderPreviewProps {
  eligibilitySummary: string
  estimatedReach: number
  form: CampaignFormState
  hasSavedDraft: boolean
  previewTags: string[]
  resolvedCampaignType: string
  resolvedCtaLabel: string
}

export function CampaignBuilderPreview({
  eligibilitySummary,
  estimatedReach,
  form,
  hasSavedDraft,
  previewTags,
  resolvedCampaignType,
  resolvedCtaLabel
}: CampaignBuilderPreviewProps) {
  const accessState =
    form.accessType === 'invite'
      ? {
          badge: 'INVITE ONLY',
          cta: 'REQUEST ACCESS',
          ctaVariant: styles.previewButtonInvite
        }
      : form.accessType === 'closed'
        ? {
            badge: 'CLOSED',
            cta: 'CLOSED',
            ctaVariant: styles.previewButtonClosed
          }
        : {
            badge: 'ELIGIBLE',
            cta: resolvedCtaLabel,
            ctaVariant: ''
          }

  return (
    <div className={styles.previewColumn}>
      <Card title="Live preview" eyebrow="User-facing output" accent="teal" className={styles.previewCard}>
        <div className={styles.previewStack}>
            <div className={styles.previewPartner}>
            <div className={styles.previewIdentity}>
              <div className={styles.previewLogo}>
                {form.partnerLogoUrl ? (
                  <div
                    aria-hidden="true"
                    className={styles.previewLogoImage}
                    style={{ backgroundImage: `url(${form.partnerLogoUrl})` }}
                  />
                ) : (
                  <span>{form.partnerName.slice(0, 1).toUpperCase()}</span>
                )}
              </div>
              <div>
                <p className={styles.previewPartnerName}>{form.partnerName || 'Partner name'}</p>
                <p className={styles.previewPartnerMeta}>{estimatedReach.toLocaleString()} eligible users</p>
              </div>
            </div>
            <span className={styles.previewEligibility}>{accessState.badge}</span>
          </div>

          <div className={styles.previewCampaign}>
            <div className={styles.previewCampaignHeader}>
              <div>
                <h3>{form.campaignName || 'Campaign name'}</h3>
                <p>{resolvedCampaignType}</p>
              </div>
              <span className={styles.previewCategory}>{form.category}</span>
            </div>

            <div className={styles.previewTags}>
              {previewTags.length > 0 ? (
                previewTags.map((tag) => (
                  <span key={tag} className={styles.previewTag}>
                    {tag}
                  </span>
                ))
              ) : (
                <span className={styles.previewTagPlaceholder}>No targeting tags selected</span>
              )}
            </div>

            <p className={styles.previewDescription}>{form.description}</p>

            <div className={styles.previewFoot}>
              <div>
                <span className="eyebrow-label">Qualification</span>
                <p>{eligibilitySummary}</p>
              </div>
              <button
                type="button"
                className={`${styles.previewButton} ${accessState.ctaVariant}`}
              >
                {accessState.cta}
              </button>
            </div>
          </div>

          <div className={styles.signalCard}>
            <div className={styles.signalHeader}>
              <Sparkles size={16} />
              <span>Launch signal</span>
            </div>
            <p>
              {estimatedReach > 30000
                ? 'Broad enough for acquisition. Consider stricter sybil settings only if payout cost is high.'
                : 'Focused segment. Great for premium access, cashback pilots, or invite-only launches.'}
            </p>
            {hasSavedDraft ? <span className={styles.signalMeta}>Saved draft available for reloading</span> : null}
          </div>
        </div>
      </Card>
    </div>
  )
}
