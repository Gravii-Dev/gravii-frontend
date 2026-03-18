import type { CampaignSummary } from './campaign'

export type ProductCode = 'R' | 'G' | 'L'
export type PartnerAccountStatus = 'active' | 'review' | 'flagged'
export type PartnerPlan = 'free' | 'starter' | 'growth' | 'enterprise'

export interface RevenueHistoryPoint {
  month: string
  totalUsd: number
  gateUsd?: number
  reachUsd?: number
  lensUsd?: number
  changeLabel?: string
}

export interface LensReportSummary {
  name: string
  walletCount: number
  generatedAt: string
  status: string
}

export interface PartnerSummary {
  id?: string
  name: string
  status: PartnerAccountStatus
  plan?: PartnerPlan
  productCodes?: ProductCode[]
  totalUsers?: number
  usersFirstTouch?: number
  usersAnyTouch?: number
  goldRatePercent?: number
  sybilRatePercent?: number
  apiQueryCount?: number
  totalCampaignCount?: number
  liveCampaignCount?: number
  averageCpaUsd?: number
  revenueUsd?: number
  joinedAt?: string
  lastActiveAt?: string
  scoreLabel?: string
  campaigns?: CampaignSummary[]
  lensReports?: LensReportSummary[]
  apiLatencyMs?: number
  apiErrorRatePercent?: number
  apiPlanLimitLabel?: string
  revenueHistory?: RevenueHistoryPoint[]
}
