export interface MixSegment {
  label: string
  share: number
  color: string
}

export interface AssetMixCardData {
  id: string
  title: string
  total: number
  helper: string
  segments: MixSegment[]
}

export interface ChainBreakdownItem {
  network: string
  users: number
  share: number
  tone: 'blue' | 'amber' | 'teal'
  segments: MixSegment[]
}

export interface RegionDistributionItem {
  code: string
  users: number
  share: number
  color: string
}

export interface RiskAlert {
  cluster: string
  wallets: number
  severity: 'Critical' | 'High' | 'Medium'
  summary: string
}

export const dashboardSnapshot = {
  totalConnectedUsers: 301012,
  userGrowth: {
    daily: 847,
    weekly: 4231,
    monthly: 18492
  },
  snapshotLabel: 'Snapshot · 2026-03-14 00:00 UTC',
  assetMixCards: [
    {
      id: 'deployed-stables',
      title: 'Deployed · Stables',
      total: 847000000,
      helper: 'Users already earning yield or LP rewards',
      segments: [
        { label: 'USDC', share: 50, color: '#6eaeff' },
        { label: 'USDT', share: 30, color: '#7c83ff' },
        { label: 'DAI', share: 14, color: '#4fd6be' },
        { label: 'Other', share: 6, color: '#ec718d' }
      ]
    },
    {
      id: 'deployed-tokens',
      title: 'Deployed · Tokens',
      total: 423000000,
      helper: 'Yield-bearing native and ecosystem tokens',
      segments: [
        { label: 'ETH', share: 40, color: '#f6c15d' },
        { label: 'BNB', share: 30, color: '#ff8f57' },
        { label: 'LINK', share: 20, color: '#6eaeff' },
        { label: 'Other', share: 10, color: '#4fd6be' }
      ]
    },
    {
      id: 'available-stables',
      title: 'Available · Stables',
      total: 312000000,
      helper: 'Liquid stablecoin purchasing power still unused',
      segments: [
        { label: 'USDC', share: 45, color: '#7c83ff' },
        { label: 'USDT', share: 30, color: '#ec718d' },
        { label: 'DAI', share: 16, color: '#6eaeff' },
        { label: 'Other', share: 9, color: '#ff8f57' }
      ]
    },
    {
      id: 'available-tokens',
      title: 'Available · Tokens',
      total: 186000000,
      helper: 'Idle wallet balances available for activation',
      segments: [
        { label: 'ETH', share: 40, color: '#4fd6be' },
        { label: 'BNB', share: 25, color: '#f6c15d' },
        { label: 'MATIC', share: 20, color: '#7c83ff' },
        { label: 'Other', share: 15, color: '#ec718d' }
      ]
    }
  ] satisfies AssetMixCardData[],
  chainPanels: [
    {
      title: 'Deployed by chain',
      cards: [
        {
          network: 'Ethereum',
          users: 126425,
          share: 42,
          tone: 'blue',
          segments: [
            { label: 'Stables', share: 55, color: '#6eaeff' },
            { label: 'Native', share: 30, color: '#7c83ff' },
            { label: 'Other', share: 15, color: '#ff8f57' }
          ]
        },
        {
          network: 'BSC',
          users: 84283,
          share: 28,
          tone: 'amber',
          segments: [
            { label: 'Stables', share: 50, color: '#6eaeff' },
            { label: 'Native', share: 35, color: '#7c83ff' },
            { label: 'Other', share: 15, color: '#ff8f57' }
          ]
        },
        {
          network: 'Base',
          users: 66222,
          share: 22,
          tone: 'teal',
          segments: [
            { label: 'Stables', share: 45, color: '#6eaeff' },
            { label: 'Native', share: 35, color: '#7c83ff' },
            { label: 'Other', share: 20, color: '#ff8f57' }
          ]
        }
      ] satisfies ChainBreakdownItem[]
    },
    {
      title: 'Available by chain',
      cards: [
        {
          network: 'Ethereum',
          users: 114384,
          share: 38,
          tone: 'blue',
          segments: [
            { label: 'Stables', share: 50, color: '#4fd6be' },
            { label: 'Native', share: 30, color: '#f6c15d' },
            { label: 'Other', share: 20, color: '#ff8f57' }
          ]
        },
        {
          network: 'BSC',
          users: 75253,
          share: 25,
          tone: 'amber',
          segments: [
            { label: 'Stables', share: 48, color: '#4fd6be' },
            { label: 'Native', share: 32, color: '#f6c15d' },
            { label: 'Other', share: 20, color: '#ff8f57' }
          ]
        },
        {
          network: 'Base',
          users: 60202,
          share: 20,
          tone: 'teal',
          segments: [
            { label: 'Stables', share: 42, color: '#4fd6be' },
            { label: 'Native', share: 38, color: '#f6c15d' },
            { label: 'Other', share: 20, color: '#ff8f57' }
          ]
        }
      ] satisfies ChainBreakdownItem[]
    }
  ],
  regionDistribution: [
    { code: 'US', users: 54784, share: 18.2, color: '#6eaeff' },
    { code: 'JP', users: 43647, share: 14.5, color: '#7c83ff' },
    { code: 'KR', users: 36422, share: 12.1, color: '#4fd6be' },
    { code: 'TW', users: 29499, share: 9.8, color: '#ec718d' },
    { code: 'TH', users: 25285, share: 8.4, color: '#f6c15d' },
    { code: 'SG', users: 21673, share: 7.2, color: '#ff8f57' },
    { code: 'DE', users: 18362, share: 6.1, color: '#93c5fd' },
    { code: 'GB', users: 15954, share: 5.3, color: '#a5b4fc' }
  ] satisfies RegionDistributionItem[],
  commercialKpis: [
    { label: 'Avg. monthly trading volume', value: '$12,010', helper: 'Per connected wallet' },
    { label: 'Avg. monthly transaction count', value: '72', helper: 'Across all supported chains' },
    { label: 'Avg. monthly stablecoin payment', value: '$2,327', helper: 'Ready for targeted cashback' },
    { label: 'Monthly stablecoin tx count', value: '32', helper: 'Signals payment-native users' }
  ],
  activationKpis: [
    { label: 'Active wallets (7d)', value: '114,384', helper: 'Recently transacted' },
    { label: 'Active traders (7d)', value: '12,010', helper: 'High-signal trading cohort' },
    { label: 'Active protocol users', value: '8,001', helper: 'Users already interacting with DeFi' },
    { label: 'Cross-chain users', value: '1,777', helper: 'Most adaptable target segment' }
  ],
  insights: {
    topProtocols: ['Pendle Finance', 'Uniswap', 'Curve'],
    topFundingSources: ['Binance', 'OKX', 'Bybit'],
    nftWorth: 12772030,
    sybilRate: 19
  },
  riskAlerts: [
    {
      cluster: 'Hyperactive airdrop hunters',
      wallets: 1932,
      severity: 'Critical',
      summary: 'Repeated funding-source overlap and synchronized bridge timing.'
    },
    {
      cluster: 'Fresh-wallet cashback farmers',
      wallets: 1184,
      severity: 'High',
      summary: 'Low wallet age with rapid qualifying action loops across two chains.'
    },
    {
      cluster: 'Dormant reactivation pool',
      wallets: 4820,
      severity: 'Medium',
      summary: 'Low risk, high upside users ready for win-back incentives.'
    }
  ] satisfies RiskAlert[]
}
