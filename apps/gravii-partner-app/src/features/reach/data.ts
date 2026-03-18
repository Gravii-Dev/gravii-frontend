export type ScopeId = 'myusers' | 'discoverNew' | 'both'
export type TargetMode = 'behavior' | 'value'
export type AccessType = 'open' | 'invite' | 'closed'
export type ActivityId = 'all' | '7d' | '30d' | '90d' | '90p'
export type SybilToleranceId = 'strict' | 'moderate' | 'relaxed'
export type ValueMetricId = 'portfolio' | 'trading' | 'txfreq' | 'age'
export type AssetFilterId = 'all' | 'stables' | 'native' | 'others'
export type PercentileId = 'all' | '5' | '10' | '20' | '50'
export type ValueThresholdId = 'all' | '1k' | '10k' | '50k' | '100k'

export interface DraftCampaign {
  partnerName: string
  campaignName: string
  type: string
  status: 'Draft'
  summary: string
}

export interface ScopeOption {
  id: ScopeId
  label: string
  description: string
  multiplier: number
}

export interface SegmentOption {
  id: string
  label: string
  persona: string
  reachWeight: number
}

export interface ChainOption {
  id: string
  label: string
  reachWeight: number
}

export interface RegionOption {
  id: string
  label: string
  reachWeight: number
}

export interface ActivityOption {
  id: ActivityId
  label: string
  multiplier: number
}

export interface SybilToleranceOption {
  id: SybilToleranceId
  label: string
  helper: string
  multiplier: number
}

export interface ValueMetricOption {
  id: ValueMetricId
  label: string
}

export interface AssetFilterOption {
  id: AssetFilterId
  label: string
}

export interface PercentileOption {
  id: PercentileId
  label: string
  multiplier: number
}

export interface ValueThresholdOption {
  id: ValueThresholdId
  label: string
  multiplier: number
}

export const campaignTypes = [
  'Airdrop',
  'Yield Boost',
  'Cashback',
  'Staking Reward',
  'Fee Discount',
  'Referral Bonus',
  'Loyalty Reward',
  'Early Access',
  'Custom'
] as const

export const campaignCategories = [
  'Wealth & Finance',
  'Lifestyle & Retail',
  'Exclusive Privileges',
  'Hidden Gems',
  'General'
] as const

export const ctaOptions = [
  'Join Campaign',
  'Learn More',
  'Claim Now',
  'Opt In',
  'Boost Now',
  'Get Started',
  'Apply Now',
  'Custom'
] as const

export const draftCampaigns = [
  {
    partnerName: 'Pendle Finance',
    campaignName: 'Fee Discount Program',
    type: 'Fee Discount',
    status: 'Draft',
    summary: 'Platinum tier yield seekers on Ethereum and Base'
  }
] satisfies DraftCampaign[]

export const scopeOptions = [
  {
    id: 'myusers',
    label: 'Your users only',
    description: 'Targeting users on your platform only. No CPA.',
    multiplier: 0.12
  },
  {
    id: 'discoverNew',
    label: 'Discover new users',
    description: 'Targeting new users from the Gravii verified pool. Solve cold start instantly.',
    multiplier: 1
  },
  {
    id: 'both',
    label: 'Both',
    description: 'Targeting your own users and new users from the Gravii pool. Maximum reach.',
    multiplier: 1.08
  }
] satisfies ScopeOption[]

export const segmentOptions = [
  { id: 'smart-saver', label: 'Smart Saver', persona: 'Yield-friendly stable users', reachWeight: 0.22 },
  { id: 'loyal-supporter', label: 'Loyal Supporter', persona: 'Long-term staking loyalists', reachWeight: 0.18 },
  { id: 'profit-hunter', label: 'Profit Hunter', persona: 'Fast-moving opportunity seekers', reachWeight: 0.16 },
  { id: 'active-trader', label: 'Active Trader', persona: 'High-frequency DEX activity', reachWeight: 0.2 },
  { id: 'market-provider', label: 'Market Provider', persona: 'Liquidity-first LP cohort', reachWeight: 0.14 },
  { id: 'strategic-holder', label: 'Strategic Holder', persona: 'Long-horizon conviction wallets', reachWeight: 0.1 }
] satisfies SegmentOption[]

export const chainOptions = [
  { id: 'eth', label: 'Ethereum', reachWeight: 0.42 },
  { id: 'base', label: 'Base', reachWeight: 0.22 },
  { id: 'arb', label: 'Arbitrum', reachWeight: 0.16 },
  { id: 'bsc', label: 'BSC', reachWeight: 0.11 },
  { id: 'poly', label: 'Polygon', reachWeight: 0.08 },
  { id: 'sol', label: 'Solana', reachWeight: 0.07 },
  { id: 'kaia', label: 'Kaia', reachWeight: 0.05 }
] satisfies ChainOption[]

export const regionOptions = [
  { id: 'US', label: 'US', reachWeight: 0.182 },
  { id: 'JP', label: 'JP', reachWeight: 0.145 },
  { id: 'KR', label: 'KR', reachWeight: 0.121 },
  { id: 'TW', label: 'TW', reachWeight: 0.098 },
  { id: 'TH', label: 'TH', reachWeight: 0.084 },
  { id: 'SG', label: 'SG', reachWeight: 0.072 },
  { id: 'DE', label: 'DE', reachWeight: 0.061 },
  { id: 'GB', label: 'GB', reachWeight: 0.053 }
] satisfies RegionOption[]

export const activityOptions = [
  { id: 'all', label: 'All', multiplier: 1 },
  { id: '7d', label: '≤ 7d', multiplier: 0.35 },
  { id: '30d', label: '≤ 30d', multiplier: 0.58 },
  { id: '90d', label: '≤ 90d', multiplier: 0.82 },
  { id: '90p', label: '90d+', multiplier: 0.18 }
] satisfies ActivityOption[]

export const sybilToleranceOptions = [
  {
    id: 'strict',
    label: 'Strict · Low risk only',
    helper: 'Maximum filtering, lowest acquisition tolerance.',
    multiplier: 0.68
  },
  {
    id: 'moderate',
    label: 'Moderate · Medium and below',
    helper: 'Balanced reach and risk profile for production launch.',
    multiplier: 0.82
  },
  {
    id: 'relaxed',
    label: 'Relaxed · High and below',
    helper: 'Use for broad testing when fraud cost is low.',
    multiplier: 0.94
  }
] satisfies SybilToleranceOption[]

export const valueMetricOptions = [
  { id: 'portfolio', label: 'Portfolio Value' },
  { id: 'trading', label: 'Trading Volume' },
  { id: 'txfreq', label: 'Tx Frequency' },
  { id: 'age', label: 'Wallet Age' }
] satisfies ValueMetricOption[]

export const assetFilterOptions = [
  { id: 'all', label: 'All' },
  { id: 'stables', label: 'Stables' },
  { id: 'native', label: 'Native' },
  { id: 'others', label: 'Others' }
] satisfies AssetFilterOption[]

export const percentileOptions = [
  { id: 'all', label: 'All users', multiplier: 1 },
  { id: '5', label: 'Black', multiplier: 0.05 },
  { id: '10', label: 'Platinum', multiplier: 0.1 },
  { id: '20', label: 'Gold', multiplier: 0.2 },
  { id: '50', label: 'Classic', multiplier: 0.5 }
] satisfies PercentileOption[]

export const valueThresholdOptions = [
  { id: 'all', label: 'All', multiplier: 1 },
  { id: '1k', label: 'Avail > $1K', multiplier: 0.6 },
  { id: '10k', label: 'Avail > $10K', multiplier: 0.35 },
  { id: '50k', label: 'Avail > $50K', multiplier: 0.15 },
  { id: '100k', label: 'Avail > $100K', multiplier: 0.06 }
] satisfies ValueThresholdOption[]
