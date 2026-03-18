export type RiskSeverity = 'critical' | 'high' | 'medium' | 'low'

export interface RiskAlert {
  cluster: string
  walletCount: number
  severity: RiskSeverity
  summary: string
}

export interface RiskWallet {
  address: string
  severity: RiskSeverity
  cluster: string
  flaggedHoursAgo?: number
}

export interface SybilCluster {
  id?: string
  label: string
  walletCount: number
  severity: RiskSeverity
  summary?: string
}
