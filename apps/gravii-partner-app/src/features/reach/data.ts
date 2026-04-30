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

const baseDraftCampaigns = [
  {
    campaignName: 'Fee Discount Program',
    type: 'Fee Discount',
    status: 'Draft',
    summary: 'Platinum tier yield seekers on Ethereum and Base'
  }
] as const satisfies Omit<DraftCampaign, 'partnerName'>[]

export function getDraftCampaigns(partnerName: string): DraftCampaign[] {
  return baseDraftCampaigns.map((draft) => ({
    ...draft,
    partnerName
  }))
}

export const scopeOptions = [
  {
    id: 'myusers',
    label: 'Your Users Only',
    description: 'Targeting users connected to your service via Drive or Verify API.',
    multiplier: 0.12
  },
  {
    id: 'discoverNew',
    label: 'Discover New Users',
    description: 'Targeting new users from the Gravii verified pool.',
    multiplier: 1
  },
  {
    id: 'both',
    label: 'Both',
    description: 'Targeting both your connected users and the Gravii verified pool.',
    multiplier: 1.08
  }
] satisfies ScopeOption[]

export const segmentOptions = [
  { id: 'defi-stakers-stables', label: 'DeFi Stakers (Stables)', persona: 'Smart Saver', reachWeight: 0.18 },
  { id: 'defi-stakers-native', label: 'DeFi Stakers (Native)', persona: 'Loyal Supporter', reachWeight: 0.16 },
  { id: 'defi-stakers-others', label: 'DeFi Stakers (Others)', persona: 'Profit Hunter', reachWeight: 0.09 },
  { id: 'dex-traders', label: 'DEX Traders', persona: 'Active Trader', reachWeight: 0.13 },
  { id: 'liquidity-providers', label: 'Liquidity Providers', persona: 'Market Provider', reachWeight: 0.11 },
  { id: 'long-term-holders', label: 'Long-term Holders', persona: 'Strategic Holder', reachWeight: 0.1 },
  { id: 'stablecoin-spenders', label: 'Stablecoin Spenders', persona: 'Cash Manager', reachWeight: 0.2 },
  { id: 'stablecoin-whales', label: 'Stablecoin Whales', persona: 'Wealth Guard', reachWeight: 0.08 },
  { id: 'native-token-whales', label: 'Native Token Whales', persona: 'Major Investor', reachWeight: 0.07 },
  { id: 'nft-whales', label: 'NFT Whales', persona: 'NFT Collector', reachWeight: 0.05 },
  { id: 'paper-hands', label: 'Paper Hands', persona: 'Swing Trader', reachWeight: 0.04 },
  { id: 'cherry-pickers', label: 'Cherry Pickers', persona: 'Target Buyer', reachWeight: 0.04 },
  { id: 'high-frequency-wallets', label: 'High Frequency Wallets', persona: 'Power User', reachWeight: 0.05 },
  { id: 'sybil', label: 'Sybil', persona: 'Unique Player', reachWeight: 0.03 },
  { id: 'bridge-users', label: 'Bridge Users', persona: 'Chain Hopper', reachWeight: 0.06 },
  { id: 'airdrop-hunters', label: 'Airdrop Hunters', persona: 'Reward Seeker', reachWeight: 0.05 },
  { id: 'dormant-wallets', label: 'Dormant Wallets', persona: 'Dormant Account', reachWeight: 0.03 },
  { id: 'new-wallets', label: 'New Wallets', persona: 'New Voyager', reachWeight: 0.08 },
  { id: 'governance-participants', label: 'Governance Participants', persona: 'Community Leader', reachWeight: 0.05 },
  { id: 'rapid-growth-wallets', label: 'Rapid Growth Wallets', persona: 'Rising Star', reachWeight: 0.03 }
] satisfies SegmentOption[]

export const chainOptions = [
  { id: 'all', label: 'All', reachWeight: 1 },
  { id: 'eth', label: 'ETH', reachWeight: 0.42 },
  { id: 'base', label: 'Base', reachWeight: 0.22 },
  { id: 'arb', label: 'Arbitrum', reachWeight: 0.16 },
  { id: 'bsc', label: 'BSC', reachWeight: 0.11 },
  { id: 'poly', label: 'Polygon', reachWeight: 0.08 },
  { id: 'avax', label: 'Avalanche', reachWeight: 0.06 },
  { id: 'hl', label: 'Hyperliquid', reachWeight: 0.04 },
  { id: 'kaia', label: 'Kaia', reachWeight: 0.05 },
  { id: 'sol', label: 'Solana', reachWeight: 0.07 }
] satisfies ChainOption[]

export const regionOptions = [
  { id: 'all', label: 'All', reachWeight: 1 },
  { id: 'US', label: 'US', reachWeight: 0.182 },
  { id: 'JP', label: 'JP', reachWeight: 0.145 },
  { id: 'KR', label: 'KR', reachWeight: 0.121 },
  { id: 'TW', label: 'TW', reachWeight: 0.098 },
  { id: 'TH', label: 'TH', reachWeight: 0.084 },
  { id: 'SG', label: 'SG', reachWeight: 0.072 },
  { id: 'DE', label: 'DE', reachWeight: 0.061 },
  { id: 'GB', label: 'GB', reachWeight: 0.053 },
  { id: 'VN', label: 'VN', reachWeight: 0.047 },
  { id: 'ID', label: 'ID', reachWeight: 0.041 },
  { id: 'others', label: 'Others', reachWeight: 0.09 }
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
  { id: 'all', label: 'All Users', multiplier: 1 },
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
