export type CampaignLifecycleStatus =
  | 'draft'
  | 'live'
  | 'ending'
  | 'ended'
  | 'completed'
  | 'pending'

export type CampaignScope = 'users' | 'gravii_pool' | 'both'
export type CampaignTargetMode = 'behavior' | 'value'
export type CampaignAccessType = 'open' | 'invite' | 'closed'

export interface CampaignSummary {
  id: string
  name: string
  partnerId?: string
  partnerName?: string
  typeLabel?: string
  status: CampaignLifecycleStatus
  scope?: CampaignScope
  periodLabel?: string
  engagedUsers?: number
  newUserCount?: number
  costUsd?: number
  costPerAcquisitionUsd?: number
  progressPercent?: number
}

export interface CampaignReportDistributionRow {
  label: string
  value: number
  toneHex?: string
}

export interface CampaignReportRegionRow {
  regionCode: string
  value: number
}

export interface CampaignReport {
  mode: CampaignTargetMode
  criteria: string[]
  personaRows: CampaignReportDistributionRow[]
  tierRows: CampaignReportDistributionRow[]
  topRegions: CampaignReportRegionRow[]
  sybilFilteredWalletCount: number
}
