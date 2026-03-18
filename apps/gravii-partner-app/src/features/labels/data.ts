export interface PersonaMapping {
  analyticsLabel: string
  userPersona: string
}

export interface LabelSegment {
  id: number
  name: string
  users: number
  threshold: string
  chains: Record<string, number>
  avgBal: number
  txFreq: number
  retention: number
}

export const personaMappings = [
  ['DeFi Stakers (Stables)', 'Smart Saver'],
  ['DeFi Stakers (Native)', 'Loyal Supporter'],
  ['DeFi Stakers (Others)', 'Profit Hunter'],
  ['DEX Traders', 'Active Trader'],
  ['Liquidity Providers', 'Market Provider'],
  ['Long-term Holders', 'Strategic Holder'],
  ['Stablecoin Spenders', 'Cash Manager'],
  ['Stablecoin Whales', 'Wealth Guard'],
  ['Native Token Whales', 'Major Investor'],
  ['NFT Whales', 'NFT Collector'],
  ['Paper Hands', 'Swing Trader'],
  ['Cherry Pickers', 'Target Buyer'],
  ['High Frequency Wallets', 'Power User'],
  ['Sybil', 'Unique Player'],
  ['Bridge Users', 'Chain Hopper'],
  ['Airdrop Hunters', 'Reward Seeker'],
  ['Dormant Wallets', 'Dormant Account'],
  ['New Wallets', 'New Voyager'],
  ['Governance Participants', 'Community Leader'],
  ['Rapid Growth Wallets', 'Rising Star']
].map(([analyticsLabel, userPersona]) => ({ analyticsLabel, userPersona })) satisfies PersonaMapping[]

export const chainColorMap: Record<string, string> = {
  eth: '#627eea',
  base: '#0052ff',
  arb: '#28a0f0',
  bsc: '#f0b90b',
  poly: '#8247e5',
  avax: '#e84142',
  hl: '#00d1b2',
  kaia: '#3fbb7a',
  sol: '#9945ff'
}

export const labelSegments = [
  { id: 1, name: 'DeFi Stakers (Stables)', users: 18420, threshold: '≥ $10,000 staked', chains: { eth: 40, base: 20, arb: 15, bsc: 10, poly: 5, avax: 4, hl: 2, kaia: 2, sol: 2 }, avgBal: 14200, txFreq: 22, retention: 78 },
  { id: 2, name: 'DeFi Stakers (Native)', users: 15330, threshold: '≥ $10,000 staked', chains: { eth: 45, base: 18, arb: 12, bsc: 10, poly: 5, avax: 4, hl: 2, kaia: 2, sol: 2 }, avgBal: 18400, txFreq: 19, retention: 74 },
  { id: 3, name: 'DeFi Stakers (Others)', users: 9210, threshold: '≥ $5,000 staked', chains: { eth: 35, base: 22, arb: 18, bsc: 8, poly: 7, avax: 4, hl: 2, kaia: 2, sol: 2 }, avgBal: 8300, txFreq: 15, retention: 68 },
  { id: 4, name: 'DEX Traders', users: 42150, threshold: '≥ 50 tx/month', chains: { eth: 30, base: 25, arb: 20, bsc: 8, poly: 5, avax: 3, hl: 5, kaia: 2, sol: 2 }, avgBal: 6200, txFreq: 72, retention: 85 },
  { id: 5, name: 'Liquidity Providers', users: 12080, threshold: '≥ $10,000 LP', chains: { eth: 42, base: 20, arb: 15, bsc: 10, poly: 5, avax: 3, hl: 2, kaia: 1, sol: 2 }, avgBal: 22100, txFreq: 18, retention: 71 },
  { id: 6, name: 'Long-term Holders', users: 67200, threshold: '≥ 30 days held', chains: { eth: 38, base: 15, arb: 12, bsc: 12, poly: 8, avax: 5, hl: 2, kaia: 4, sol: 4 }, avgBal: 5100, txFreq: 4, retention: 62 },
  { id: 7, name: 'Stablecoin Spenders', users: 38900, threshold: '≥ $1,000/month', chains: { eth: 35, base: 22, arb: 10, bsc: 12, poly: 8, avax: 3, hl: 2, kaia: 4, sol: 4 }, avgBal: 3800, txFreq: 34, retention: 79 },
  { id: 8, name: 'Stablecoin Whales', users: 4210, threshold: '≥ $50,000 balance', chains: { eth: 55, base: 12, arb: 8, bsc: 10, poly: 5, avax: 4, hl: 2, kaia: 2, sol: 2 }, avgBal: 142000, txFreq: 28, retention: 88 },
  { id: 9, name: 'Native Token Whales', users: 3890, threshold: '≥ $50,000 balance', chains: { eth: 50, base: 15, arb: 10, bsc: 8, poly: 5, avax: 5, hl: 3, kaia: 2, sol: 2 }, avgBal: 168000, txFreq: 22, retention: 82 },
  { id: 10, name: 'NFT Whales', users: 2150, threshold: '≥ $50,000 portfolio', chains: { eth: 60, base: 15, arb: 5, bsc: 5, poly: 5, avax: 2, hl: 1, kaia: 3, sol: 4 }, avgBal: 94000, txFreq: 12, retention: 76 },
  { id: 11, name: 'Paper Hands', users: 28700, threshold: '≤ 7 days avg hold', chains: { eth: 28, base: 25, arb: 18, bsc: 10, poly: 7, avax: 4, hl: 3, kaia: 3, sol: 2 }, avgBal: 1800, txFreq: 48, retention: 54 },
  { id: 12, name: 'Cherry Pickers', users: 8430, threshold: '≥ 80% sold within 24h', chains: { eth: 32, base: 28, arb: 20, bsc: 8, poly: 5, avax: 3, hl: 2, kaia: 1, sol: 1 }, avgBal: 2400, txFreq: 38, retention: 42 },
  { id: 13, name: 'High Frequency Wallets', users: 19800, threshold: '≥ 100 tx/month', chains: { eth: 30, base: 25, arb: 18, bsc: 10, poly: 5, avax: 3, hl: 5, kaia: 2, sol: 2 }, avgBal: 7800, txFreq: 142, retention: 91 },
  { id: 14, name: 'Sybil', users: 5620, threshold: 'Flagged by Risk module', chains: { eth: 35, base: 30, arb: 15, bsc: 8, poly: 5, avax: 3, hl: 1, kaia: 2, sol: 1 }, avgBal: 820, txFreq: 88, retention: 67 },
  { id: 15, name: 'Bridge Users', users: 34500, threshold: '≥ 1 bridge tx/30d', chains: { eth: 30, base: 25, arb: 20, bsc: 8, poly: 7, avax: 4, hl: 2, kaia: 2, sol: 2 }, avgBal: 5600, txFreq: 26, retention: 73 },
  { id: 16, name: 'Airdrop Hunters', users: 11200, threshold: '≥ 3 protocols/90d', chains: { eth: 28, base: 30, arb: 22, bsc: 5, poly: 5, avax: 4, hl: 3, kaia: 1, sol: 2 }, avgBal: 1200, txFreq: 52, retention: 58 },
  { id: 17, name: 'Dormant Wallets', users: 45100, threshold: '≥ 90 days inactive', chains: { eth: 40, base: 12, arb: 10, bsc: 15, poly: 8, avax: 5, hl: 1, kaia: 5, sol: 4 }, avgBal: 2200, txFreq: 0, retention: 0 },
  { id: 18, name: 'New Wallets', users: 22300, threshold: '≤ 30 days old', chains: { eth: 25, base: 30, arb: 18, bsc: 8, poly: 7, avax: 4, hl: 3, kaia: 3, sol: 2 }, avgBal: 980, txFreq: 14, retention: 64 },
  { id: 19, name: 'Governance Participants', users: 6700, threshold: '≥ 1 vote/90d', chains: { eth: 50, base: 15, arb: 15, bsc: 5, poly: 5, avax: 4, hl: 2, kaia: 2, sol: 2 }, avgBal: 18200, txFreq: 16, retention: 81 },
  { id: 20, name: 'Rapid Growth Wallets', users: 7800, threshold: '≥ 500% balance growth/30d (min $100)', chains: { eth: 30, base: 28, arb: 18, bsc: 8, poly: 5, avax: 4, hl: 3, kaia: 2, sol: 2 }, avgBal: 4100, txFreq: 32, retention: 72 }
] satisfies LabelSegment[]
