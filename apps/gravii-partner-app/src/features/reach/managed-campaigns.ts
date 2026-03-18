export interface CampaignReport {
  mode: 'By Behavior' | 'By Value'
  criteria: string[]
  personaRows: Array<{ label: string; value: number; tone: string }>
  tierRows: Array<{ label: string; value: number; tone: string }>
  topRegions: Array<{ region: string; value: number }>
  sybilFiltered: number
}

export interface ManagedCampaign {
  id: string
  partner: string
  name: string
  type: string
  typeIndex: number
  status: 'live' | 'ended' | 'draft'
  engaged: string
  period: string
  progress?: number
  report: CampaignReport
  formPreset: {
    targetMode: 'behavior' | 'value'
    segments?: string[]
    behaviorChains?: string[]
    valueChains?: string[]
    percentile?: 'all' | '5' | '10' | '20' | '50'
    valueThreshold?: 'all' | '1k' | '10k' | '50k' | '100k'
  }
}

export const managedCampaigns = [
  {
    id: 'yield-booster',
    partner: 'Pendle Finance',
    name: 'Yield Booster',
    type: 'Yield Boost',
    typeIndex: 1,
    status: 'live',
    engaged: '8,420 engaged',
    period: '23 days left',
    progress: 56,
    report: {
      mode: 'By Behavior',
      criteria: ['Smart Saver · Profit Hunter', 'ETH · Base'],
      personaRows: [
        { label: 'Smart Saver', value: 38, tone: '#6eaeff' },
        { label: 'Profit Hunter', value: 26, tone: '#7c83ff' },
        { label: 'Active Trader', value: 21, tone: '#4fd6be' },
        { label: 'Others', value: 15, tone: 'rgba(255,255,255,0.18)' }
      ],
      tierRows: [
        { label: 'Black', value: 14, tone: '#a78bfa' },
        { label: 'Platinum', value: 31, tone: 'rgba(167,139,250,0.7)' },
        { label: 'Gold', value: 33, tone: 'rgba(167,139,250,0.45)' },
        { label: 'Classic', value: 22, tone: 'rgba(167,139,250,0.2)' }
      ],
      topRegions: [
        { region: 'US', value: 26 },
        { region: 'KR', value: 19 },
        { region: 'JP', value: 16 }
      ],
      sybilFiltered: 342
    },
    formPreset: {
      targetMode: 'behavior',
      segments: ['smart-saver', 'profit-hunter'],
      behaviorChains: ['eth', 'base']
    }
  },
  {
    id: 'lending-cashback',
    partner: 'Pendle Finance',
    name: 'Lending Cashback',
    type: 'Cashback',
    typeIndex: 2,
    status: 'live',
    engaged: '14,330 engaged',
    period: '51 days left',
    progress: 34,
    report: {
      mode: 'By Value',
      criteria: ['Gold+', 'Avail > $1K · All Chains'],
      personaRows: [
        { label: 'Cash Manager', value: 34, tone: '#f6c15d' },
        { label: 'Wealth Guard', value: 24, tone: '#ff8f57' },
        { label: 'Strategic Holder', value: 20, tone: '#6eaeff' },
        { label: 'Others', value: 22, tone: 'rgba(255,255,255,0.18)' }
      ],
      tierRows: [
        { label: 'Black', value: 8, tone: '#a78bfa' },
        { label: 'Platinum', value: 22, tone: 'rgba(167,139,250,0.7)' },
        { label: 'Gold', value: 42, tone: 'rgba(167,139,250,0.45)' },
        { label: 'Classic', value: 28, tone: 'rgba(167,139,250,0.2)' }
      ],
      topRegions: [
        { region: 'JP', value: 22 },
        { region: 'US', value: 20 },
        { region: 'TW', value: 14 }
      ],
      sybilFiltered: 518
    },
    formPreset: {
      targetMode: 'value',
      percentile: '20',
      valueThreshold: '1k'
    }
  },
  {
    id: 'early-access-v4',
    partner: 'Pendle Finance',
    name: 'Early Access V4',
    type: 'Early Access',
    typeIndex: 7,
    status: 'ended',
    engaged: '5,210 engaged',
    period: 'Ended 12 days ago',
    report: {
      mode: 'By Behavior',
      criteria: ['Active Trader', 'ETH'],
      personaRows: [
        { label: 'Active Trader', value: 41, tone: '#6eaeff' },
        { label: 'Profit Hunter', value: 23, tone: '#7c83ff' },
        { label: 'Market Provider', value: 17, tone: '#4fd6be' },
        { label: 'Others', value: 19, tone: 'rgba(255,255,255,0.18)' }
      ],
      tierRows: [
        { label: 'Black', value: 11, tone: '#a78bfa' },
        { label: 'Platinum', value: 27, tone: 'rgba(167,139,250,0.7)' },
        { label: 'Gold', value: 37, tone: 'rgba(167,139,250,0.45)' },
        { label: 'Classic', value: 25, tone: 'rgba(167,139,250,0.2)' }
      ],
      topRegions: [
        { region: 'SG', value: 18 },
        { region: 'US', value: 17 },
        { region: 'GB', value: 13 }
      ],
      sybilFiltered: 109
    },
    formPreset: {
      targetMode: 'behavior',
      segments: ['active-trader'],
      behaviorChains: ['eth']
    }
  }
] satisfies ManagedCampaign[]

export const campaignDraftStorageKey = 'gravii-partner-campaign-draft'

export function getManagedCampaignById(id: string | null | undefined): ManagedCampaign | null {
  return managedCampaigns.find((campaign) => campaign.id === id) ?? null
}
