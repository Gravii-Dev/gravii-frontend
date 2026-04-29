'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { startTransition, useDeferredValue, useEffect, useMemo, useState } from 'react'
import { PartnerDataStatus } from '@/components/ui/partner-data-status'
import { usePartnerAuth } from '@/features/auth/auth-provider'
import { formatNumber } from '@/lib/format'
import { getPartnerWorkspaceName } from '@/lib/partner-profile'
import { getWorkspaceScenario } from '@/lib/workspace-scenarios'
import { useWorkspaceSettings } from '@/lib/workspace-settings'
import {
  MultiPills,
  ScopePills,
  SinglePills
} from './campaign-builder-controls'
import {
  buildInitialForm,
  buildInitialNotice,
  readStoredDraft,
  toggleSelection,
  type CampaignBuilderProps,
  type CampaignFormState,
  type ChainId,
  type RegionId,
  type SegmentId,
  writeStoredDraft
} from './campaign-builder-model'
import {
  activityOptions,
  assetFilterOptions,
  campaignCategories,
  campaignTypes,
  chainOptions,
  ctaOptions,
  percentileOptions,
  regionOptions,
  scopeOptions,
  segmentOptions,
  sybilToleranceOptions,
  valueMetricOptions,
  valueThresholdOptions,
  getDraftCampaigns,
  type AccessType,
  type ActivityId,
  type AssetFilterId,
  type DraftCampaign,
  type PercentileId,
  type SybilToleranceId,
  type TargetMode,
  type ValueMetricId,
  type ValueThresholdId
} from './data'
import styles from './campaign-builder.module.css'

const CampaignBuilderDrafts = dynamic(
  () => import('./campaign-builder-drafts').then((module) => module.CampaignBuilderDrafts)
)
const CampaignBuilderPreview = dynamic(
  () => import('./campaign-builder-preview').then((module) => module.CampaignBuilderPreview)
)

export function CampaignBuilder({
  initialPrompt,
  initialCampaignId,
  initialDraftId
}: CampaignBuilderProps) {
  const auth = usePartnerAuth()
  const partnerName = getPartnerWorkspaceName(auth.session)
  const router = useRouter()
  const workspaceSettings = useWorkspaceSettings()
  const draftCampaigns = useMemo(() => getDraftCampaigns(partnerName), [partnerName])
  const [form, setForm] = useState<CampaignFormState>(() =>
    buildInitialForm({ initialPrompt, initialCampaignId, initialDraftId }, partnerName)
  )
  const [notice, setNotice] = useState<string | null>(() =>
    buildInitialNotice({ initialPrompt, initialCampaignId, initialDraftId })
  )
  const [hasSavedDraft, setHasSavedDraft] = useState(() => readStoredDraft(partnerName) !== null)
  const [accessControlEnabled, setAccessControlEnabled] = useState(true)
  const deferredForm = useDeferredValue(form)
  const activeScenario = useMemo(
    () => getWorkspaceScenario(workspaceSettings.scenario),
    [workspaceSettings.scenario]
  )

  useEffect(() => {
    const storedDraft = readStoredDraft(partnerName)

    setHasSavedDraft(storedDraft !== null)
    setForm((current) =>
      current.partnerName === partnerName
        ? current
        : {
            ...current,
            partnerName
          }
    )
  }, [partnerName])
  const lockedScope = activeScenario?.scopeDefault ?? null
  const effectiveScope = lockedScope ?? deferredForm.scope

  const selectedScope = scopeOptions.find((option) => option.id === effectiveScope) ?? scopeOptions[0]
  const selectedActivity =
    activityOptions.find((option) => option.id === deferredForm.activity) ?? activityOptions[0]
  const selectedSybil =
    sybilToleranceOptions.find((option) => option.id === deferredForm.sybilTolerance) ??
    sybilToleranceOptions[0]
  const selectedPercentile =
    percentileOptions.find((option) => option.id === deferredForm.percentile) ?? percentileOptions[0]
  const selectedValueThreshold =
    valueThresholdOptions.find((option) => option.id === deferredForm.valueThreshold) ??
    valueThresholdOptions[0]

  const activeBehaviorSegments = segmentOptions.filter((segment) =>
    deferredForm.selectedSegments.includes(segment.id)
  )
  const activeChains =
    deferredForm.targetMode === 'behavior'
      ? deferredForm.selectedBehaviorChains
      : deferredForm.selectedValueChains
  const activeChainLabels = chainOptions
    .filter((chain) => activeChains.includes(chain.id) && chain.id !== 'all')
    .map((chain) => chain.label)
  const activeRegions = regionOptions.filter(
    (region) => deferredForm.selectedRegions.includes(region.id) && region.id !== 'all'
  )

  const estimatedReach = useMemo(() => {
    const base = 301012 * selectedScope.multiplier
    const activityReach = base * selectedActivity.multiplier
    const regionWeight =
      activeRegions.length > 0
        ? activeRegions.reduce((sum, region) => sum + region.reachWeight, 0)
        : 1

    if (deferredForm.targetMode === 'behavior') {
      const segmentWeight =
        activeBehaviorSegments.length > 0
          ? activeBehaviorSegments.reduce((sum, segment) => sum + segment.reachWeight, 0)
          : 1
      const chainWeight =
        deferredForm.selectedBehaviorChains.length > 0
          ? chainOptions
              .filter((chain) => deferredForm.selectedBehaviorChains.includes(chain.id) && chain.id !== 'all')
              .reduce((sum, chain) => sum + chain.reachWeight, 0)
          : 1

      return Math.max(
        320,
        Math.round(activityReach * Math.min(segmentWeight, 1) * Math.min(chainWeight, 1) * regionWeight * selectedSybil.multiplier)
      )
    }

    const chainWeight =
      deferredForm.selectedValueChains.length > 0
        ? chainOptions
            .filter((chain) => deferredForm.selectedValueChains.includes(chain.id) && chain.id !== 'all')
            .reduce((sum, chain) => sum + chain.reachWeight, 0)
        : 1

    return Math.max(
      180,
      Math.round(
        activityReach *
          selectedPercentile.multiplier *
          selectedValueThreshold.multiplier *
          Math.min(chainWeight, 1) *
          regionWeight *
          selectedSybil.multiplier
      )
    )
  }, [
    activeBehaviorSegments,
    activeRegions,
    deferredForm.selectedBehaviorChains,
    deferredForm.selectedValueChains,
    deferredForm.targetMode,
    selectedActivity.multiplier,
    selectedPercentile.multiplier,
    selectedScope.multiplier,
    selectedSybil.multiplier,
    selectedValueThreshold.multiplier
  ])

  const previewTags = useMemo(() => {
    const tags: string[] = []

    if (deferredForm.targetMode === 'behavior') {
      tags.push(...activeBehaviorSegments.map((segment) => segment.persona))
    } else if (selectedPercentile.id !== 'all') {
      tags.push(`${selectedPercentile.label}+`)
    }

    if (activeChainLabels.length > 0) {
      tags.push(...activeChainLabels)
    }

    return tags.slice(0, 6)
  }, [activeBehaviorSegments, activeChainLabels, deferredForm.targetMode, selectedPercentile])

  const resolvedCampaignType =
    deferredForm.campaignType === 'Custom' && deferredForm.customCampaignType.trim().length > 0
      ? deferredForm.customCampaignType.trim()
      : deferredForm.campaignType

  const resolvedCtaLabel =
    deferredForm.ctaLabel === 'Custom' && deferredForm.customCtaLabel.trim().length > 0
      ? deferredForm.customCtaLabel.trim()
      : deferredForm.ctaLabel
  const launchButtonLabel = workspaceSettings.strictRiskReview ? 'Submit for Review' : 'Launch Campaign'
  const scopeHint = lockedScope
    ? {
        myusers: 'Locked to your platform users. Change in Settings → Re-run setup.',
        discoverNew: 'Locked to Gravii verified pool. Change in Settings → Re-run setup.',
        both: 'Locked to your platform + Gravii pool. Change in Settings → Re-run setup.'
      }[lockedScope]
    : selectedScope.description

  const accessPreview =
    deferredForm.accessType === 'invite'
      ? 'Users will see REQUEST ACCESS · You approve manually'
      : deferredForm.accessType === 'closed'
        ? 'Campaign is visible but marked as CLOSED · No new participants'
        : 'Users who meet criteria will see OPT IN · Others will see HOW TO QUALIFY'

  const eligibilitySummary = useMemo(() => {
    const parts = [
      deferredForm.targetMode === 'behavior'
        ? activeBehaviorSegments.length > 0
          ? activeBehaviorSegments.map((segment) => segment.label).join(', ')
          : null
        : selectedPercentile.id === 'all'
          ? null
          : selectedPercentile.label,
      selectedActivity.label === 'All' ? null : `Active ${selectedActivity.label}`,
      activeChainLabels.length > 0 ? activeChainLabels.join(', ') : null,
      activeRegions.length > 0 ? activeRegions.map((region) => region.label).join(', ') : null,
      deferredForm.accessType === 'invite'
        ? 'Invite only'
        : deferredForm.accessType === 'closed'
          ? 'Closed'
          : null,
      `${selectedSybil.label.split(' · ')[0]} Sybil`
    ].filter((part): part is string => Boolean(part))

    return parts.length > 0 ? parts.join(' · ') : 'No filters selected'
  }, [
    activeBehaviorSegments,
    activeChainLabels,
    activeRegions,
    deferredForm.accessType,
    deferredForm.targetMode,
    selectedActivity.label,
    selectedPercentile.id,
    selectedPercentile.label,
    selectedSybil.label
  ])

  const handleTargetModeChange = (next: TargetMode) => {
    startTransition(() => {
      setForm((current) => {
        if (current.targetMode === next) {
          return current
        }

        if (next === 'behavior') {
          return {
            ...current,
            targetMode: next,
            percentile: 'all',
            valueAssetFilter: 'all',
            valueThreshold: 'all',
            selectedValueChains: []
          }
        }

        return {
          ...current,
          targetMode: next,
          selectedSegments: [],
          selectedBehaviorChains: []
        }
      })
    })
  }

  const handleContinueEditing = (draft: DraftCampaign) => {
    const storedDraft = readStoredDraft(partnerName)

    if (storedDraft) {
      startTransition(() => {
        setForm(storedDraft)
        setNotice('Saved draft loaded')
      })
      return
    }

    startTransition(() => {
      setForm((current) => ({
        ...current,
        partnerName,
        campaignName: draft.campaignName,
        campaignType: draft.type,
        targetMode: 'behavior',
        selectedSegments: ['active-trader'],
        selectedBehaviorChains: ['eth']
      }))
      setNotice(`${draft.campaignName} loaded into the builder`)
    })
  }

  return (
    <div className={styles.page}>
      <div className={styles.mockPageHeader}>
        <h1 className={styles.mockPageTitle}>Gravii Reach</h1>
      </div>
      <PartnerDataStatus surface="reach" />

      {notice ? <div className={styles.notice}>{notice}</div> : null}

      <div className={styles.listHeader}>
        <span className={styles.listTitle}>Drafts</span>
      </div>
      <CampaignBuilderDrafts drafts={draftCampaigns} onContinueEditing={handleContinueEditing} />

      <div className={styles.listHeader}>
        <span className={styles.listTitle}>Create New Campaign</span>
      </div>

      <div className={styles.formWrapper}>
        <div className={styles.step}>
          <div className={styles.stepHeader}>
            <span className={styles.stepNum}>1</span>
            Basic Info
          </div>

          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span>Partner Name</span>
              <input
                value={form.partnerName}
                onChange={(event) => setForm((current) => ({ ...current, partnerName: event.target.value }))}
                placeholder="e.g. Your Protocol"
              />
            </label>
            <label className={styles.field}>
              <span>Partner Logo URL</span>
              <input
                value={form.partnerLogoUrl}
                onChange={(event) =>
                  setForm((current) => ({ ...current, partnerLogoUrl: event.target.value }))
                }
                placeholder="https://example.com/logo.png"
              />
              <small>Recommended: 128×128px, square, PNG or JPG</small>
            </label>
            <label className={styles.field}>
              <span>Campaign Name</span>
              <input
                value={form.campaignName}
                onChange={(event) =>
                  setForm((current) => ({ ...current, campaignName: event.target.value }))
                }
                placeholder="e.g. Yield Booster"
              />
            </label>
            <label className={styles.field}>
              <span>Campaign Type</span>
              <select
                value={form.campaignType}
                onChange={(event) =>
                  setForm((current) => ({ ...current, campaignType: event.target.value }))
                }
              >
                {campaignTypes.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.field}>
              <span>Benefit Category</span>
              <select
                value={form.category}
                onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
              >
                {campaignCategories.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            {form.campaignType === 'Custom' ? (
              <label className={styles.field}>
                <span>Custom Type Name</span>
                <input
                  value={form.customCampaignType}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, customCampaignType: event.target.value }))
                  }
                  placeholder="Enter custom type"
                />
              </label>
            ) : null}
          </div>

          <label className={`${styles.field} ${styles.fieldBlock}`}>
            <span>Description</span>
            <textarea
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              placeholder="Describe the campaign benefits for users..."
            />
          </label>

          <label className={`${styles.field} ${styles.fieldBlock}`}>
            <span>
              Qualification Guide <small>(optional)</small>
            </span>
            <textarea
              value={form.qualificationGuide}
              onChange={(event) =>
                setForm((current) => ({ ...current, qualificationGuide: event.target.value }))
              }
              placeholder={
                'Steps users can take to become eligible. e.g.\n1. Achieve the Smart Saver persona by staking stablecoins\n2. Reach Gold tier or above\n3. Maintain tier for at least 7 consecutive days'
              }
            />
          </label>
        </div>

        <div className={styles.step}>
          <div className={styles.stepHeader}>
            <span className={styles.stepNum}>2</span>
            Target Audience
          </div>

          <div className={`${styles.field} ${styles.fieldBlock}`}>
            <span>Target Scope</span>
            <ScopePills
              value={effectiveScope}
              onChange={(next) => setForm((current) => ({ ...current, scope: next }))}
              disabled={lockedScope !== null}
            />
            <div className={styles.scopeHintLive}>{scopeHint}</div>
          </div>

          <div className={styles.warningCopy}>
            ⚠ Narrowing targeting criteria on a live campaign will not remove users who have already engaged. Their participation is preserved.
          </div>

          <div className={styles.tabRow}>
            <SinglePills<TargetMode>
              value={form.targetMode}
              options={[
                { id: 'behavior', label: 'By Behavior' },
                { id: 'value', label: 'By Value' }
              ]}
              onChange={handleTargetModeChange}
            />
          </div>

          <div className={styles.groupNote}>Select one tab — By Behavior or By Value</div>

          {form.targetMode === 'behavior' ? (
            <div className={styles.behaviorPanel}>
              <div className={`${styles.field} ${styles.fieldBlock}`}>
                <span>Segments</span>
                <MultiPills<SegmentId>
                  value={form.selectedSegments}
                  options={segmentOptions.map((segment) => ({
                    id: segment.id,
                    label: segment.label
                  }))}
                  onToggle={(next) =>
                    setForm((current) => ({
                      ...current,
                      selectedSegments: toggleSelection(current.selectedSegments, next)
                    }))
                  }
                />
              </div>

              <div className={`${styles.field} ${styles.fieldBlock}`}>
                <span>Chains</span>
                <MultiPills<ChainId>
                  value={form.selectedBehaviorChains}
                  options={chainOptions.map((chain) => ({ id: chain.id as ChainId, label: chain.label }))}
                  onToggle={(next) =>
                    setForm((current) => ({
                      ...current,
                      selectedBehaviorChains: toggleSelection(current.selectedBehaviorChains, next)
                    }))
                  }
                />
              </div>
            </div>
          ) : (
            <div className={styles.valuePanel}>
              <div className={`${styles.field} ${styles.fieldBlock}`}>
                <span>Tier By</span>
                <SinglePills<ValueMetricId>
                  value={form.valueMetric}
                  options={valueMetricOptions.map((option) => ({
                    id: option.id,
                    label: option.label
                  }))}
                  onChange={(next) => setForm((current) => ({ ...current, valueMetric: next }))}
                />
              </div>

              <div className={`${styles.field} ${styles.fieldBlock}`}>
                <span>Asset Type</span>
                <SinglePills<AssetFilterId>
                  value={form.valueAssetFilter}
                  options={assetFilterOptions.map((option) => ({
                    id: option.id,
                    label: option.label
                  }))}
                  onChange={(next) => setForm((current) => ({ ...current, valueAssetFilter: next }))}
                />
              </div>

              <div className={`${styles.field} ${styles.fieldBlock}`}>
                <span>Tier Range</span>
                <SinglePills<PercentileId>
                  value={form.percentile}
                  options={percentileOptions.map((option) => ({
                    id: option.id,
                    label: option.label
                  }))}
                  onChange={(next) => setForm((current) => ({ ...current, percentile: next }))}
                />
              </div>

              <div className={`${styles.field} ${styles.fieldBlock}`}>
                <span>Available Value Filter</span>
                <SinglePills<ValueThresholdId>
                  value={form.valueThreshold}
                  options={valueThresholdOptions.map((option) => ({
                    id: option.id,
                    label: option.label
                  }))}
                  onChange={(next) => setForm((current) => ({ ...current, valueThreshold: next }))}
                />
              </div>

              <div className={`${styles.field} ${styles.fieldBlock}`}>
                <span>Chains</span>
                <MultiPills<ChainId>
                  value={form.selectedValueChains}
                  options={chainOptions.map((chain) => ({ id: chain.id as ChainId, label: chain.label }))}
                  onToggle={(next) =>
                    setForm((current) => ({
                      ...current,
                      selectedValueChains: toggleSelection(current.selectedValueChains, next)
                    }))
                  }
                />
              </div>
            </div>
          )}

          <div className={`${styles.field} ${styles.fieldBlock} ${styles.fieldTopSpace}`}>
            <span>Last Active</span>
            <SinglePills<ActivityId>
              value={form.activity}
              options={activityOptions.map((option) => ({ id: option.id, label: option.label }))}
              onChange={(next) => setForm((current) => ({ ...current, activity: next }))}
            />
          </div>

          <div className={`${styles.field} ${styles.fieldBlock} ${styles.fieldTopSpace}`}>
            <span>Target Regions</span>
            <MultiPills<RegionId>
              value={form.selectedRegions}
              options={regionOptions.map((region) => ({ id: region.id as RegionId, label: region.label }))}
              onToggle={(next) =>
                setForm((current) => ({
                  ...current,
                  selectedRegions: toggleSelection(current.selectedRegions, next)
                }))
              }
            />
          </div>

          <div className={`${styles.formGrid} ${styles.fieldTopSpace}`}>
            <label className={styles.field}>
              <span>Sybil Risk Tolerance</span>
              <select
                value={form.sybilTolerance}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    sybilTolerance: event.target.value as SybilToleranceId
                  }))
                }
              >
                {sybilToleranceOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              <small>{selectedSybil.helper}</small>
            </label>

            <div className={styles.field}>
              <span>Estimated Reach</span>
              <div className={styles.campReach}>~{formatNumber(estimatedReach)} users</div>
            </div>
          </div>
        </div>

        <div className={styles.step}>
          <div className={styles.stepHeader}>
            <span className={styles.stepNum}>3</span>
            Campaign Details
          </div>

          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span>Start Date</span>
              <input
                type="date"
                value={form.startDate}
                onChange={(event) => setForm((current) => ({ ...current, startDate: event.target.value }))}
              />
            </label>
            <label className={styles.field}>
              <span>End Date</span>
              <input
                type="date"
                value={form.endDate}
                onChange={(event) => setForm((current) => ({ ...current, endDate: event.target.value }))}
              />
            </label>
            <label className={styles.field}>
              <span>Access Type</span>
              <select
                value={form.accessType}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    accessType: event.target.value as AccessType
                  }))
                }
              >
                <option value="open">Open — Anyone who meets the criteria can join</option>
                <option value="invite">Invite Only — Eligible users must be approved by partner</option>
              </select>
              <small>{accessPreview}</small>
            </label>
            <label className={styles.field}>
              <span>Partner Link URL</span>
              <input
                value={form.partnerUrl}
                onChange={(event) => setForm((current) => ({ ...current, partnerUrl: event.target.value }))}
                placeholder="https://partner.com/campaign"
              />
            </label>
            <label className={styles.field}>
              <span>CTA Button Label</span>
              <select
                value={form.ctaLabel}
                onChange={(event) => setForm((current) => ({ ...current, ctaLabel: event.target.value }))}
              >
                {ctaOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            {form.ctaLabel === 'Custom' ? (
              <label className={styles.field}>
                <span>Custom CTA Text</span>
                <input
                  value={form.customCtaLabel}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, customCtaLabel: event.target.value }))
                  }
                  placeholder="Enter button text"
                />
              </label>
            ) : null}
          </div>

          <div className={`${styles.field} ${styles.fieldBlock} ${styles.fieldTopSpace}`}>
            <span>
              Eligibility Summary <small>(visible to partners only)</small>
            </span>
            <div className={styles.eligibilityBox}>{eligibilitySummary}</div>
          </div>

          <div className={`${styles.toggleRow} ${styles.fieldTopSpace}`}>
            <span className={styles.toggleLabel}>Access Control (API filtering)</span>
            <button
              type="button"
              aria-pressed={accessControlEnabled}
              className={`${styles.toggleButton} ${accessControlEnabled ? styles.toggleButtonActive : ''}`}
              onClick={() => setAccessControlEnabled((current) => !current)}
            >
              <span className={styles.toggleKnob} />
            </button>
          </div>

        <CampaignBuilderPreview
          eligibilitySummary={eligibilitySummary}
          form={deferredForm}
          previewTags={previewTags}
          resolvedCampaignType={resolvedCampaignType}
          resolvedCtaLabel={resolvedCtaLabel}
        />

          <div className={styles.actionRow}>
            <button
              type="button"
              className={styles.draftButton}
              onClick={() => {
                writeStoredDraft({ ...form, scope: effectiveScope })
                setHasSavedDraft(true)
                setNotice('Draft saved locally')
              }}
            >
              Save as Draft
            </button>
            <button
              type="button"
              className={styles.launchButton}
              onClick={() => {
                writeStoredDraft({ ...form, scope: effectiveScope })
                setHasSavedDraft(true)
                router.push(
                  workspaceSettings.strictRiskReview
                    ? '/campaign-manager?launch=review-pending'
                    : '/campaign-manager?launch=launched'
                )
              }}
            >
              {launchButtonLabel}
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}
