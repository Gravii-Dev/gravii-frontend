'use client'

import { ChevronRight } from 'lucide-react'
import { useState } from 'react'

import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { WorkspaceHandoffLink } from '@/components/ui/workspace-handoff-link'
import { useWorkspaceSettings } from '@/lib/workspace-settings'

import { managedCampaigns } from '@/features/reach/managed-campaigns'
import styles from './campaign-manager-page.module.css'

type CampaignFilter = 'all' | 'live' | 'ended'

interface CampaignManagerPageProps {
  initialLaunchStatus?: string | null
}

export function CampaignManagerPage({
  initialLaunchStatus = null
}: CampaignManagerPageProps) {
  const [filter, setFilter] = useState<CampaignFilter>('all')
  const [openReports, setOpenReports] = useState<string[]>([])
  const workspaceSettings = useWorkspaceSettings()

  const launchNotice =
    initialLaunchStatus === 'review-pending'
      ? 'Campaign saved and submitted for risk review before launch.'
      : initialLaunchStatus === 'launched'
        ? 'Campaign saved and moved into the live manager flow.'
        : null

  const visibleCampaigns = managedCampaigns.filter(
    (campaign) => filter === 'all' || campaign.status === filter
  )

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow="Gravii Reach"
        title="Campaign manager buttons now behave like the prototype again."
        description="Status filters, report toggles, and edit actions are all restored so the manager page drives back into the Reach form as expected."
      />

      {launchNotice ? (
        <div className={styles.notice}>
          <strong>{launchNotice}</strong>
          <span>
            {workspaceSettings.strictRiskReview
              ? 'Strict risk review is active for this workspace.'
              : 'Strict risk review is disabled, so launch stays immediate.'}
          </span>
          {workspaceSettings.weeklyDigest ? (
            <span>Weekly digest is enabled, so this update will also appear in the next operator summary.</span>
          ) : null}
        </div>
      ) : null}

      <div className={styles.filters}>
        {(['all', 'live', 'ended'] as const).map((value) => (
          <button
            key={value}
            type="button"
            className={`${styles.filterButton} ${filter === value ? styles.filterButtonActive : ''}`}
            onClick={() => setFilter(value)}
          >
            {value === 'all' ? 'All' : value === 'live' ? 'Live' : 'Ended'}
          </button>
        ))}
      </div>

      <div className={styles.list}>
        {visibleCampaigns.map((campaign) => {
          const reportOpen = openReports.includes(campaign.id)

          return (
            <Card key={campaign.id} title={campaign.name} eyebrow={`${campaign.partner} · ${campaign.status}`}>
              <div className={styles.campaignCard}>
                {campaign.progress ? (
                  <div className={styles.progressTrack}>
                    <span className={styles.progressFill} style={{ width: `${campaign.progress}%` }} />
                  </div>
                ) : null}

                <div className={styles.meta}>
                  <span>{campaign.engaged}</span>
                  <span>{campaign.period}</span>
                </div>

                <div className={styles.actions}>
                  {campaign.status !== 'ended' ? (
                    <WorkspaceHandoffLink
                      href={`/reach?campaign=${campaign.id}`}
                      requiredPages={['campaigns']}
                      className="button-secondary"
                    >
                      Edit Campaign
                      <ChevronRight size={16} />
                    </WorkspaceHandoffLink>
                  ) : null}
                  <button
                    type="button"
                    className="button-ghost"
                    onClick={() =>
                      setOpenReports((current) =>
                        current.includes(campaign.id)
                          ? current.filter((value) => value !== campaign.id)
                          : [...current, campaign.id]
                      )
                    }
                  >
                    {reportOpen ? 'Close Report' : 'View Report'}
                  </button>
                </div>

                {reportOpen ? (
                  <div className={styles.report}>
                    <div className={styles.criteria}>
                      <span className={styles.modeTag}>{campaign.report.mode}</span>
                      {campaign.report.criteria.map((criterion) => (
                        <span key={criterion} className={styles.criterion}>
                          {criterion}
                        </span>
                      ))}
                    </div>

                    <div className="grid-auto-2">
                      <div className={styles.reportBlock}>
                        <p className={styles.reportLabel}>Engaged by persona</p>
                        <div className={styles.stack}>
                          {campaign.report.personaRows.map((row) => (
                            <div key={row.label}>
                              <div className={styles.barHeader}>
                                <span>{row.label}</span>
                                <strong>{row.value}%</strong>
                              </div>
                              <div className={styles.barTrack}>
                                <span
                                  className={styles.barFill}
                                  style={{ width: `${row.value}%`, backgroundColor: row.tone }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className={styles.reportBlock}>
                        <p className={styles.reportLabel}>Engaged by tier</p>
                        <div className={styles.stack}>
                          {campaign.report.tierRows.map((row) => (
                            <div key={row.label}>
                              <div className={styles.barHeader}>
                                <span>{row.label}</span>
                                <strong>{row.value}%</strong>
                              </div>
                              <div className={styles.barTrack}>
                                <span
                                  className={styles.barFill}
                                  style={{ width: `${row.value}%`, backgroundColor: row.tone }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid-auto-2">
                      <div className={styles.reportBlock}>
                        <p className={styles.reportLabel}>Top regions</p>
                        <div className={styles.regionRow}>
                          {campaign.report.topRegions.map((region) => (
                            <div key={region.region} className={styles.regionCard}>
                              <strong>{region.value}%</strong>
                              <span>{region.region}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className={styles.reportBlock}>
                        <p className={styles.reportLabel}>Sybil filtered</p>
                        <p className={styles.sybilValue}>{campaign.report.sybilFiltered}</p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
