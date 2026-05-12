export type PersonaItem = {
  name: string;
  desc: string;
  gradient: [string, string, string];
};

export const PERSONA_ITEMS: PersonaItem[] = [
  { name: "Smart Saver", desc: "Deposits stablecoins into low-risk yield protocols for steady returns", gradient: ["#735caf", "#ad98ea", "#f5d7e1"] },
  { name: "Loyal Supporter", desc: "Stakes native tokens long-term to contribute to ecosystem security", gradient: ["#5f4a9c", "#735caf", "#e7e1f4"] },
  { name: "Profit Hunter", desc: "Tracks yield spreads and new farming opportunities to move assets", gradient: ["#ad98ea", "#cfc2f0", "#f8edf3"] },
  { name: "Active Trader", desc: "Maintains high transaction frequency and asset turnover in DEXs", gradient: ["#735caf", "#e7e1f4", "#f5d7e1"] },
  { name: "Market Provider", desc: "Supplies liquidity to pools to reduce slippage and deepen markets", gradient: ["#46356f", "#735caf", "#ad98ea"] },
  { name: "Strategic Holder", desc: "Maintains core assets long-term regardless of market volatility", gradient: ["#cfc2f0", "#f5d7e1", "#f8edf3"] },
  { name: "Cash Manager", desc: "Utilizes the network for large stablecoin transfers and settlements", gradient: ["#5f4a9c", "#ad98ea", "#f5d7e1"] },
  { name: "Wealth Guard", desc: "Maintains massive assets to demonstrate network stability", gradient: ["#46356f", "#cfc2f0", "#f8edf3"] },
  { name: "Major Investor", desc: "Commits significant capital to high-cap assets to build market trust", gradient: ["#735caf", "#ad98ea", "#f8edf3"] },
  { name: "NFT Collector", desc: "Trades and collects NFTs at scale", gradient: ["#ad98ea", "#735caf", "#f5d7e1"] },
  { name: "Swing Trader", desc: "Rotates positions based on on-chain cycles to maximize returns", gradient: ["#5f4a9c", "#735caf", "#e7e1f4"] },
  { name: "Target Buyer", desc: "Analyzes and buys assets at precise price points", gradient: ["#735caf", "#cfc2f0", "#f8edf3"] },
  { name: "Power User", desc: "Drives network activity through high gas consumption and transaction volume", gradient: ["#46356f", "#ad98ea", "#f5d7e1"] },
  { name: "Unique Player", desc: "Exhibits unconventional smart contract interactions and patterns", gradient: ["#cfc2f0", "#e7e1f4", "#f5d7e1"] },
  { name: "Chain Hopper", desc: "Uses bridge protocols to move assets across multiple chains", gradient: ["#735caf", "#ad98ea", "#f8edf3"] },
  { name: "Reward Seeker", desc: "Interacts with protocols specifically for incentive programs and airdrops", gradient: ["#5f4a9c", "#735caf", "#f5d7e1"] },
  { name: "Dormant Account", desc: "Accounts that have been inactive for a prolonged period", gradient: ["#735caf", "#cfc2f0", "#e7e1f4"] },
  { name: "New Voyager", desc: "Recently initiated on-chain activity with high onboarding potential", gradient: ["#ad98ea", "#cfc2f0", "#f8edf3"] },
  { name: "Community Leader", desc: "Participates in governance and voting to shape protocol direction", gradient: ["#5f4a9c", "#ad98ea", "#f5d7e1"] },
  { name: "Rising Star", desc: "Demonstrates rapid growth in asset value and activity velocity", gradient: ["#735caf", "#ad98ea", "#f8edf3"] },
];
