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
  sparkline: Array<{ date: string; value: number }>
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

const baseManagedCampaigns = [
  {
    id: 'yield-booster',
    name: 'Yield Booster',
    type: 'Yield Boost',
    typeIndex: 1,
    status: 'live',
    engaged: '8,420 engaged',
    period: '23 days left',
    progress: 56,
    sparkline: [
      { date: '2026 Feb 22', value: 412 },
      { date: '2026 Feb 23', value: 478 },
      { date: '2026 Feb 24', value: 561 },
      { date: '2026 Feb 25', value: 520 },
      { date: '2026 Feb 26', value: 634 },
      { date: '2026 Feb 27', value: 698 },
      { date: '2026 Feb 28', value: 602 },
      { date: '2026 Mar 1', value: 745 },
      { date: '2026 Mar 2', value: 812 },
      { date: '2026 Mar 3', value: 870 },
      { date: '2026 Mar 4', value: 790 },
      { date: '2026 Mar 5', value: 724 },
      { date: '2026 Mar 6', value: 848 },
      { date: '2026 Mar 7', value: 924 }
    ],
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
      segments: ['defi-stakers-stables', 'defi-stakers-others'],
      behaviorChains: ['eth', 'base']
    }
  },
  {
    id: 'lending-cashback',
    name: 'Lending Cashback',
    type: 'Cashback',
    typeIndex: 2,
    status: 'live',
    engaged: '14,330 engaged',
    period: '51 days left',
    progress: 34,
    sparkline: [
      { date: '2026 Feb 22', value: 711 },
      { date: '2026 Feb 23', value: 734 },
      { date: '2026 Feb 24', value: 768 },
      { date: '2026 Feb 25', value: 792 },
      { date: '2026 Feb 26', value: 826 },
      { date: '2026 Feb 27', value: 844 },
      { date: '2026 Feb 28', value: 872 },
      { date: '2026 Mar 1', value: 905 },
      { date: '2026 Mar 2', value: 951 },
      { date: '2026 Mar 3', value: 989 },
      { date: '2026 Mar 4', value: 1014 },
      { date: '2026 Mar 5', value: 1048 },
      { date: '2026 Mar 6', value: 1092 },
      { date: '2026 Mar 7', value: 1136 }
    ],
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
    name: 'Early Access V4',
    type: 'Early Access',
    typeIndex: 7,
    status: 'ended',
    engaged: '5,210 engaged',
    period: 'Ended 12 days ago',
    sparkline: [
      { date: '2026 Feb 22', value: 292 },
      { date: '2026 Feb 23', value: 316 },
      { date: '2026 Feb 24', value: 341 },
      { date: '2026 Feb 25', value: 367 },
      { date: '2026 Feb 26', value: 389 },
      { date: '2026 Feb 27', value: 411 },
      { date: '2026 Feb 28', value: 435 },
      { date: '2026 Mar 1', value: 418 },
      { date: '2026 Mar 2', value: 381 },
      { date: '2026 Mar 3', value: 342 },
      { date: '2026 Mar 4', value: 296 },
      { date: '2026 Mar 5', value: 241 },
      { date: '2026 Mar 6', value: 178 },
      { date: '2026 Mar 7', value: 119 }
    ],
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
      segments: ['dex-traders'],
      behaviorChains: ['eth']
    }
  }
] as const satisfies Omit<ManagedCampaign, 'partner'>[]

export const campaignDraftStorageKey = 'gravii-partner-campaign-draft'

export function getManagedCampaigns(partnerName: string): ManagedCampaign[] {
  return baseManagedCampaigns.map((campaign) => ({
    ...campaign,
    partner: partnerName
  }))
}

export function getManagedCampaignById(
  id: string | null | undefined,
  partnerName = 'Partner Workspace'
): ManagedCampaign | null {
  return getManagedCampaigns(partnerName).find((campaign) => campaign.id === id) ?? null
}
