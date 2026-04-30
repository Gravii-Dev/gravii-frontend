'use client'

import { useMemo, useState } from 'react'

import { PartnerDataStatus } from '@/components/ui/partner-data-status'
import { WorkspaceHandoffLink } from '@/components/ui/workspace-handoff-link'
import { usePartnerAuth } from '@/features/auth/auth-provider'
import { getPartnerWorkspaceName } from '@/lib/partner-profile'
import { useWorkspaceSettings } from '@/lib/workspace-settings'

import { getManagedCampaigns } from '@/features/reach/managed-campaigns'
import styles from './campaign-manager-page.module.css'

type CampaignFilter = 'all' | 'live' | 'ended'

interface CampaignManagerPageProps {
  initialLaunchStatus?: string | null
}

export function CampaignManagerPage({
  initialLaunchStatus = null
}: CampaignManagerPageProps) {
  const auth = usePartnerAuth()
  const [filter, setFilter] = useState<CampaignFilter>('all')
  const [openReports, setOpenReports] = useState<string[]>([])
  const workspaceSettings = useWorkspaceSettings()
  const partnerName = getPartnerWorkspaceName(auth.session)
  const managedCampaigns = useMemo(() => getManagedCampaigns(partnerName), [partnerName])

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
      <div className={styles.mainHeader}>
        <h1 className={styles.mainTitle}>Gravii Reach</h1>
      </div>
      <PartnerDataStatus surface="campaignManager" />

      <div className={styles.listHeader}>
        <span className={styles.listTitle}>Your Campaigns</span>
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
      </div>

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

      <div className={styles.list}>
        {visibleCampaigns.map((campaign) => {
          const reportOpen = openReports.includes(campaign.id)
          const sparklineMax = Math.max(...campaign.sparkline.map((point) => point.value), 1)

          return (
            <article key={campaign.id} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.titleGroup}>
                  <div className={styles.partner}>{campaign.partner}</div>
                  <div className={styles.name}>{campaign.name}</div>
                </div>
                <div className={styles.badges}>
                  <span className={styles.typeBadge}>{campaign.type}</span>
                  <span
                    className={`${styles.statusBadge} ${
                      campaign.status === 'live'
                        ? styles.statusBadgeLive
                        : campaign.status === 'ended'
                          ? styles.statusBadgeEnded
                          : styles.statusBadgeDraft
                    }`}
                  >
                    {campaign.status === 'live' ? 'Live' : campaign.status === 'ended' ? 'Ended' : 'Draft'}
                  </span>
                </div>
              </div>

              <div className={styles.campaignCard}>
                {campaign.progress ? (
                  <div className={styles.progressTrack}>
                    <span className={styles.progressFill} style={{ width: `${campaign.progress}%` }} />
                  </div>
                ) : null}

                <div className={styles.sparkline} aria-hidden="true">
                  {campaign.sparkline.map((point) => {
                    const relativeHeight = Math.round((point.value / sparklineMax) * 100)
                    const relativeOpacity = Math.min(0.9, 0.45 + point.value / sparklineMax / 2)

                    return (
                      <span
                        key={`${campaign.id}-${point.date}`}
                        className={styles.sparklineBar}
                        title={`${point.date} · ${point.value.toLocaleString()}`}
                        style={{
                          height: `${Math.max(24, relativeHeight)}%`,
                          opacity: relativeOpacity
                        }}
                      />
                    )
                  })}
                </div>

                <div className={styles.sparklineLabels}>
                  <span>14d ago</span>
                  <span>today</span>
                </div>

                <div className={styles.meta}>
                  <span>{campaign.engaged}</span>
                  <span>{campaign.period}</span>
                </div>

                <div className={styles.actions}>
                  {campaign.status !== 'ended' ? (
                    <WorkspaceHandoffLink
                      href={`/reach?campaign=${campaign.id}`}
                      requiredPages={['campaigns']}
                      className={styles.editLink}
                    >
                      Edit Campaign
                      <span aria-hidden="true">→</span>
                    </WorkspaceHandoffLink>
                  ) : null}
                </div>

                <div className={styles.reportToggleRow}>
                  <button
                    type="button"
                    className={styles.reportToggle}
                    onClick={() =>
                      setOpenReports((current) =>
                        current.includes(campaign.id)
                          ? current.filter((value) => value !== campaign.id)
                          : [...current, campaign.id]
                      )
                    }
                  >
                    {reportOpen ? '▲ Close Report' : '▼ View Report'}
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
            </article>
          )
        })}
      </div>
    </div>
  )
}
