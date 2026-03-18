'use client'

import { ArrowUpRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { formatNumber } from '@/lib/format'
import { getWorkspaceScenario } from '@/lib/workspace-scenarios'
import { useWorkspaceSettings } from '@/lib/workspace-settings'
import { CampaignBuilderDrafts } from './campaign-builder-drafts'
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
  draftCampaigns,
  percentileOptions,
  regionOptions,
  scopeOptions,
  segmentOptions,
  sybilToleranceOptions,
  valueMetricOptions,
  valueThresholdOptions,
  type AccessType,
  type ActivityId,
  type AssetFilterId,
  type PercentileId,
  type SybilToleranceId,
  type TargetMode,
  type ValueMetricId,
  type ValueThresholdId
} from './data'
import { CampaignBuilderPreview } from './campaign-builder-preview'
import styles from './campaign-builder.module.css'

export function CampaignBuilder({
  initialPrompt,
  initialCampaignId,
  initialDraftId
}: CampaignBuilderProps) {
  const router = useRouter()
  const workspaceSettings = useWorkspaceSettings()
  const [form, setForm] = useState<CampaignFormState>(() =>
    buildInitialForm({ initialPrompt, initialCampaignId, initialDraftId })
  )
  const [notice, setNotice] = useState<string | null>(() =>
    buildInitialNotice({ initialPrompt, initialCampaignId, initialDraftId })
  )
  const [hasSavedDraft, setHasSavedDraft] = useState(() => readStoredDraft() !== null)
  const activeScenario = useMemo(
    () => getWorkspaceScenario(workspaceSettings.scenario),
    [workspaceSettings.scenario]
  )
  const lockedScope = activeScenario?.scopeDefault ?? null
  const effectiveScope = lockedScope ?? form.scope

  const selectedScope = scopeOptions.find((option) => option.id === effectiveScope) ?? scopeOptions[0]
  const selectedActivity =
    activityOptions.find((option) => option.id === form.activity) ?? activityOptions[0]
  const selectedSybil =
    sybilToleranceOptions.find((option) => option.id === form.sybilTolerance) ??
    sybilToleranceOptions[0]
  const selectedPercentile =
    percentileOptions.find((option) => option.id === form.percentile) ?? percentileOptions[0]
  const selectedValueThreshold =
    valueThresholdOptions.find((option) => option.id === form.valueThreshold) ??
    valueThresholdOptions[0]

  const activeBehaviorSegments = segmentOptions.filter((segment) =>
    form.selectedSegments.includes(segment.id)
  )
  const activeChains =
    form.targetMode === 'behavior' ? form.selectedBehaviorChains : form.selectedValueChains
  const activeChainLabels = chainOptions
    .filter((chain) => activeChains.includes(chain.id))
    .map((chain) => chain.label)
  const activeRegions = regionOptions.filter((region) => form.selectedRegions.includes(region.id))

  const estimatedReach = useMemo(() => {
    const base = 301012 * selectedScope.multiplier
    const activityReach = base * selectedActivity.multiplier
    const regionWeight =
      activeRegions.length > 0
        ? activeRegions.reduce((sum, region) => sum + region.reachWeight, 0)
        : 1

    if (form.targetMode === 'behavior') {
      const segmentWeight =
        activeBehaviorSegments.length > 0
          ? activeBehaviorSegments.reduce((sum, segment) => sum + segment.reachWeight, 0)
          : 1
      const chainWeight =
        form.selectedBehaviorChains.length > 0
          ? chainOptions
              .filter((chain) => form.selectedBehaviorChains.includes(chain.id))
              .reduce((sum, chain) => sum + chain.reachWeight, 0)
          : 1

      return Math.max(
        320,
        Math.round(activityReach * Math.min(segmentWeight, 1) * Math.min(chainWeight, 1) * regionWeight * selectedSybil.multiplier)
      )
    }

    const chainWeight =
      form.selectedValueChains.length > 0
        ? chainOptions
            .filter((chain) => form.selectedValueChains.includes(chain.id))
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
    form.selectedBehaviorChains,
    form.selectedValueChains,
    form.targetMode,
    selectedActivity.multiplier,
    selectedPercentile.multiplier,
    selectedScope.multiplier,
    selectedSybil.multiplier,
    selectedValueThreshold.multiplier
  ])

  const previewTags = useMemo(() => {
    const tags: string[] = []

    if (form.targetMode === 'behavior') {
      tags.push(...activeBehaviorSegments.map((segment) => segment.persona))
    } else if (selectedPercentile.id !== 'all') {
      tags.push(`${selectedPercentile.label}+`)
    }

    if (activeChainLabels.length > 0) {
      tags.push(...activeChainLabels)
    }

    return tags.slice(0, 6)
  }, [activeBehaviorSegments, activeChainLabels, form.targetMode, selectedPercentile])

  const resolvedCampaignType =
    form.campaignType === 'Custom' && form.customCampaignType.trim().length > 0
      ? form.customCampaignType.trim()
      : form.campaignType

  const resolvedCtaLabel =
    form.ctaLabel === 'Custom' && form.customCtaLabel.trim().length > 0
      ? form.customCtaLabel.trim()
      : form.ctaLabel
  const launchButtonLabel = workspaceSettings.strictRiskReview ? 'Submit for review' : 'Launch campaign'
  const scopeHint = lockedScope
    ? `Locked to ${selectedScope.label.toLowerCase()}. Change it from setup or switch scenarios in Settings.`
    : selectedScope.description

  const eligibilitySummary = useMemo(() => {
    const parts = [
      form.targetMode === 'behavior'
        ? activeBehaviorSegments.length > 0
          ? activeBehaviorSegments.map((segment) => segment.label).join(', ')
          : null
        : selectedPercentile.id === 'all'
          ? null
          : selectedPercentile.label,
      selectedActivity.label === 'All' ? null : `Active ${selectedActivity.label}`,
      activeChainLabels.length > 0 ? activeChainLabels.join(', ') : null,
      activeRegions.length > 0 ? activeRegions.map((region) => region.label).join(', ') : null,
      form.accessType === 'invite' ? 'Invite only' : form.accessType === 'closed' ? 'Closed' : null,
      `${selectedSybil.label.split(' · ')[0]} Sybil`
    ].filter((part): part is string => Boolean(part))

    return parts.length > 0 ? parts.join(' · ') : 'No filters selected'
  }, [
    activeBehaviorSegments,
    activeChainLabels,
    activeRegions,
    form.accessType,
    form.targetMode,
    selectedActivity.label,
    selectedPercentile.id,
    selectedPercentile.label,
    selectedSybil.label
  ])

  const handleTargetModeChange = (next: TargetMode) => {
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
  }

  const handleContinueEditing = (draft: (typeof draftCampaigns)[number]) => {
    const storedDraft = readStoredDraft()

    if (storedDraft) {
      setForm(storedDraft)
      setNotice('Saved draft loaded')
      return
    }

    setForm((current) => ({
      ...current,
      partnerName: draft.partnerName,
      campaignName: draft.campaignName,
      campaignType: draft.type,
      targetMode: 'behavior',
      selectedSegments: ['active-trader'],
      selectedBehaviorChains: ['eth']
    }))
    setNotice(`${draft.campaignName} loaded into the builder`)
  }

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow="Reach"
        title="Campaign studio with typed filters, live reach estimation, and a real preview surface."
        description="The old prototype mixed business rules and DOM mutations. This productized version moves targeting logic into typed state and derived selectors that are much easier to maintain."
      />

      {notice ? <div className={styles.notice}>{notice}</div> : null}

      <CampaignBuilderDrafts onContinueEditing={handleContinueEditing} />

      <div className={styles.layout}>
        <div className={styles.formColumn}>
          <Card title="Basic info" eyebrow="Step 1" accent="blue">
            <div className={styles.formGrid}>
              <label className={styles.field}>
                <span>Partner name</span>
                <input
                  value={form.partnerName}
                  onChange={(event) => setForm((current) => ({ ...current, partnerName: event.target.value }))}
                />
              </label>
              <label className={styles.field}>
                <span>Partner logo URL</span>
                <input
                  value={form.partnerLogoUrl}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, partnerLogoUrl: event.target.value }))
                  }
                  placeholder="https://example.com/logo.png"
                />
              </label>
              <label className={styles.field}>
                <span>Campaign name</span>
                <input
                  value={form.campaignName}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, campaignName: event.target.value }))
                  }
                />
              </label>
              <label className={styles.field}>
                <span>Campaign type</span>
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
              {form.campaignType === 'Custom' ? (
                <label className={styles.field}>
                  <span>Custom type name</span>
                  <input
                    value={form.customCampaignType}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, customCampaignType: event.target.value }))
                    }
                  />
                </label>
              ) : null}
              <label className={styles.field}>
                <span>Benefit category</span>
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
            </div>

            <label className={styles.field}>
              <span>Description</span>
              <textarea
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              />
            </label>

            <label className={styles.field}>
              <span>Qualification guide</span>
              <textarea
                value={form.qualificationGuide}
                onChange={(event) =>
                  setForm((current) => ({ ...current, qualificationGuide: event.target.value }))
                }
              />
            </label>
          </Card>

          <Card title="Target audience" eyebrow="Step 2" accent="teal">
            <div className={styles.sectionStack}>
              <div className={styles.group}>
                <div>
                  <p className={styles.groupLabel}>Target scope</p>
                  <p className={styles.groupHint}>{scopeHint}</p>
                </div>
                <ScopePills
                  value={effectiveScope}
                  onChange={(next) => setForm((current) => ({ ...current, scope: next }))}
                  disabled={lockedScope !== null}
                />
              </div>

              <div className={styles.group}>
                <div>
                  <p className={styles.groupLabel}>Audience model</p>
                  <p className={styles.groupHint}>Choose behavior-led or value-led targeting.</p>
                </div>
                <SinglePills<TargetMode>
                  value={form.targetMode}
                  options={[
                    { id: 'behavior', label: 'By behavior' },
                    { id: 'value', label: 'By value' }
                  ]}
                  onChange={handleTargetModeChange}
                />
              </div>

              {form.targetMode === 'behavior' ? (
                <>
                  <div className={styles.group}>
                    <div>
                      <p className={styles.groupLabel}>Segments</p>
                      <p className={styles.groupHint}>Persona tags shown to users are mapped from these filters.</p>
                    </div>
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
                    <div className={styles.personaList}>
                      {activeBehaviorSegments.map((segment) => (
                        <span key={segment.id} className={styles.personaTag}>
                          {segment.label} · {segment.persona}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className={styles.group}>
                    <p className={styles.groupLabel}>Chains</p>
                    <MultiPills<ChainId>
                      value={form.selectedBehaviorChains}
                      options={chainOptions.map((chain) => ({ id: chain.id, label: chain.label }))}
                      onToggle={(next) =>
                        setForm((current) => ({
                          ...current,
                          selectedBehaviorChains: toggleSelection(current.selectedBehaviorChains, next)
                        }))
                      }
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.formGrid}>
                    <label className={styles.field}>
                      <span>Tier by</span>
                      <select
                        value={form.valueMetric}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            valueMetric: event.target.value as ValueMetricId
                          }))
                        }
                      >
                        {valueMetricOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className={styles.field}>
                      <span>Asset type</span>
                      <select
                        value={form.valueAssetFilter}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            valueAssetFilter: event.target.value as AssetFilterId
                          }))
                        }
                      >
                        {assetFilterOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className={styles.group}>
                    <p className={styles.groupLabel}>Tier range</p>
                    <SinglePills<PercentileId>
                      value={form.percentile}
                      options={percentileOptions.map((option) => ({
                        id: option.id,
                        label: option.label
                      }))}
                      onChange={(next) => setForm((current) => ({ ...current, percentile: next }))}
                    />
                  </div>

                  <div className={styles.group}>
                    <p className={styles.groupLabel}>Available value filter</p>
                    <SinglePills<ValueThresholdId>
                      value={form.valueThreshold}
                      options={valueThresholdOptions.map((option) => ({
                        id: option.id,
                        label: option.label
                      }))}
                      onChange={(next) => setForm((current) => ({ ...current, valueThreshold: next }))}
                    />
                  </div>

                  <div className={styles.group}>
                    <p className={styles.groupLabel}>Chains</p>
                    <MultiPills<ChainId>
                      value={form.selectedValueChains}
                      options={chainOptions.map((chain) => ({ id: chain.id, label: chain.label }))}
                      onToggle={(next) =>
                        setForm((current) => ({
                          ...current,
                          selectedValueChains: toggleSelection(current.selectedValueChains, next)
                        }))
                      }
                    />
                  </div>
                </>
              )}

              <div className={styles.group}>
                <p className={styles.groupLabel}>Last active</p>
                <SinglePills<ActivityId>
                  value={form.activity}
                  options={activityOptions.map((option) => ({ id: option.id, label: option.label }))}
                  onChange={(next) => setForm((current) => ({ ...current, activity: next }))}
                />
              </div>

              <div className={styles.group}>
                <p className={styles.groupLabel}>Target regions</p>
                <MultiPills<RegionId>
                  value={form.selectedRegions}
                  options={regionOptions.map((region) => ({ id: region.id, label: region.label }))}
                  onToggle={(next) =>
                    setForm((current) => ({
                      ...current,
                      selectedRegions: toggleSelection(current.selectedRegions, next)
                    }))
                  }
                />
              </div>

              <div className={styles.formGrid}>
                <label className={styles.field}>
                  <span>Sybil risk tolerance</span>
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
                <div className={styles.estimateCard}>
                  <span className="eyebrow-label">Estimated reach</span>
                  <strong>{formatNumber(estimatedReach)} users</strong>
                  <p>Derived from scope, targeting depth, geography, activity recency, and sybil tolerance.</p>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Launch details" eyebrow="Step 3" accent="amber">
            <div className={styles.formGrid}>
              <label className={styles.field}>
                <span>Start date</span>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(event) => setForm((current) => ({ ...current, startDate: event.target.value }))}
                />
              </label>
              <label className={styles.field}>
                <span>End date</span>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(event) => setForm((current) => ({ ...current, endDate: event.target.value }))}
                />
              </label>
              <label className={styles.field}>
                <span>Access type</span>
                  <select
                    value={form.accessType}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                      accessType: event.target.value as AccessType
                    }))
                  }
                  >
                    <option value="open">Open · Anyone eligible can join</option>
                    <option value="invite">Invite only · Manual partner approval</option>
                    <option value="closed">Closed · Visible, but not accepting users</option>
                  </select>
                </label>
              <label className={styles.field}>
                <span>Partner link URL</span>
                <input
                  value={form.partnerUrl}
                  onChange={(event) => setForm((current) => ({ ...current, partnerUrl: event.target.value }))}
                />
              </label>
              <label className={styles.field}>
                <span>CTA label</span>
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
                  <span>Custom CTA text</span>
                  <input
                    value={form.customCtaLabel}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, customCtaLabel: event.target.value }))
                    }
                  />
                </label>
              ) : null}
            </div>

            <div className={styles.summaryBlock}>
              <span className="eyebrow-label">Eligibility summary</span>
              <p>{eligibilitySummary}</p>
            </div>

            <div className={styles.actionRow}>
              <button
                type="button"
                className="button-secondary"
                onClick={() => {
                  writeStoredDraft({ ...form, scope: effectiveScope })
                  setHasSavedDraft(true)
                  setNotice('Draft saved locally')
                }}
              >
                Save as draft
              </button>
              <button
                type="button"
                className="button-primary"
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
                <ArrowUpRight size={16} />
              </button>
            </div>
          </Card>
        </div>

        <CampaignBuilderPreview
          eligibilitySummary={eligibilitySummary}
          estimatedReach={estimatedReach}
          form={form}
          hasSavedDraft={hasSavedDraft}
          previewTags={previewTags}
          resolvedCampaignType={resolvedCampaignType}
          resolvedCtaLabel={resolvedCtaLabel}
        />
      </div>
    </div>
  )
}
