'use client'

import type { CampaignFormState } from './campaign-builder-model'
import styles from './campaign-builder.module.css'

interface CampaignBuilderPreviewProps {
  eligibilitySummary: string
  form: CampaignFormState
  previewTags: string[]
  resolvedCampaignType: string
  resolvedCtaLabel: string
}

function buildAccessState(accessType: CampaignFormState['accessType'], ctaLabel: string) {
  if (accessType === 'invite') {
    return {
      badge: 'INVITE ONLY',
      buttonLabel: 'REQUEST ACCESS →',
      buttonClassName: `${styles.previewButton} ${styles.previewButtonInvite}`,
      toneClassName: styles.previewInviteTone
    }
  }

  if (accessType === 'closed') {
    return {
      badge: 'CLOSED',
      buttonLabel: 'CLOSED',
      buttonClassName: `${styles.previewButton} ${styles.previewButtonClosed}`,
      toneClassName: styles.previewClosedTone
    }
  }

  return {
    badge: 'ELIGIBLE',
    buttonLabel: `${ctaLabel.toUpperCase()} →`,
    buttonClassName: styles.previewButton,
    toneClassName: styles.previewEligibleTone
  }
}

export function CampaignBuilderPreview({
  eligibilitySummary,
  form,
  previewTags,
  resolvedCampaignType,
  resolvedCtaLabel
}: CampaignBuilderPreviewProps) {
  const accessState = buildAccessState(form.accessType, resolvedCtaLabel)
  const partnerInitial = (form.partnerName || 'Partner Name').slice(0, 1).toUpperCase()
  const periodText =
    form.startDate && form.endDate ? `${form.startDate} - ${form.endDate}` : 'Not scheduled'

  return (
    <div className={styles.previewStack}>
      <div className={`${styles.stepHeader} ${styles.previewStepHeader}`}>
        Preview — How users will see this campaign
      </div>

      <div className={styles.previewSectionLabel}>PARTNER CARD</div>
      <div className={styles.previewPartnerCard}>
        <div className={styles.previewPartnerTop}>
          <div className={styles.previewIdentity}>
            <div className={styles.previewLogo}>
              {form.partnerLogoUrl ? (
                <div
                  aria-hidden="true"
                  className={styles.previewLogoImage}
                  style={{ backgroundImage: `url(${form.partnerLogoUrl})` }}
                />
              ) : (
                <span>{partnerInitial}</span>
              )}
            </div>
            <span className={styles.previewPartnerName}>{form.partnerName || 'Partner Name'}</span>
          </div>
          <span className={`${styles.previewStatus} ${accessState.toneClassName}`}>{accessState.badge}</span>
        </div>
        <div className={styles.previewPartnerMeta}>1 campaign</div>
        <div className={styles.previewTagRow}>
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
      </div>

      <div className={styles.previewSectionLabel}>CAMPAIGN DETAIL</div>
      <div className={styles.previewDetailCard}>
        <div className={styles.previewDetailTop}>
          <span className={styles.previewCampaignName}>{form.campaignName || 'Campaign Name'}</span>
          <span className={`${styles.previewStatus} ${accessState.toneClassName}`}>{accessState.badge}</span>
        </div>

        <div className={styles.previewMetaRow}>
          <span className={styles.previewTypeBadge}>{resolvedCampaignType}</span>
          <span className={styles.previewCategory}>{form.category}</span>
        </div>

        <div className={styles.previewMetaRow}>
          <span className={styles.previewChainBadge}>
            {form.targetMode === 'behavior'
              ? form.selectedBehaviorChains
                  .filter((chain) => chain !== 'all')
                  .map((chain) => chain.toUpperCase())
                  .join(' · ') || 'All Chains'
              : form.selectedValueChains
                  .filter((chain) => chain !== 'all')
                  .map((chain) => chain.toUpperCase())
                  .join(' · ') || 'All Chains'}
          </span>
          <span className={styles.previewPeriod}>{periodText}</span>
        </div>

        <div className={styles.previewTagRow}>
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

        <p className={styles.previewDescription}>
          {form.description || 'Campaign description will appear here...'}
        </p>

        <div className={styles.previewEligibilityText}>{eligibilitySummary}</div>

        <button type="button" className={accessState.buttonClassName}>
          {accessState.buttonLabel}
        </button>
      </div>
    </div>
  )
}
