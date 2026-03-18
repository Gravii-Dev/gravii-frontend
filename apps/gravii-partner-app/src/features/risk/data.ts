export interface RiskWallet {
  address: string
  risk: 'critical' | 'high' | 'medium'
  cluster: string
  flaggedHoursAgo: number
}

export const riskWallets = [
  { address: '0x742d...3f8a', risk: 'critical', cluster: 'Cluster #1', flaggedHoursAgo: 2 },
  { address: '0x8c91...5a2b', risk: 'critical', cluster: 'Cluster #1', flaggedHoursAgo: 3 },
  { address: '0x3e4f...7d9c', risk: 'high', cluster: 'Cluster #2', flaggedHoursAgo: 5 },
  { address: '0xa7b2...4e6f', risk: 'high', cluster: 'Cluster #2', flaggedHoursAgo: 8 },
  { address: '0x5d8c...2a1b', risk: 'medium', cluster: 'Cluster #3', flaggedHoursAgo: 12 }
] satisfies RiskWallet[]
