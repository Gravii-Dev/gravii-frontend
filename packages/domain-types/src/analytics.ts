import type { RiskAlert } from './risk'

export interface MixSegment {
  label: string
  share: number
  colorHex?: string
}

export interface AssetMixCard {
  id: string
  title: string
  total: number
  helper: string
  segments: MixSegment[]
}

export type AnalyticsTone = 'blue' | 'amber' | 'teal'

export interface ChainBreakdownItem {
  network: string
  users: number
  share: number
  tone: AnalyticsTone
  segments: MixSegment[]
}

export interface RegionDistributionItem {
  code: string
  users: number
  share: number
  colorHex?: string
}

export interface MetricCard {
  label: string
  value: string
  helper: string
}

export interface CommercialInsights {
  topProtocols: string[]
  topFundingSources: string[]
  nftWorthUsd: number
  sybilRatePercent: number
}

export interface PartnerDashboardSnapshot {
  totalConnectedUsers: number
  snapshotLabel: string
  assetMixCards: AssetMixCard[]
  chainPanels: Array<{
    title: string
    cards: ChainBreakdownItem[]
  }>
  regionDistribution: RegionDistributionItem[]
  commercialKpis: MetricCard[]
  activationKpis: MetricCard[]
  insights: CommercialInsights
  riskAlerts: RiskAlert[]
}
