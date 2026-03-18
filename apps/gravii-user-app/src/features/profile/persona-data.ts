export type PersonaItem = {
  name: string;
  desc: string;
  gradient: [string, string, string];
};

export const PERSONA_ITEMS: PersonaItem[] = [
  { name: "Smart Saver", desc: "Deposits stablecoins into low-risk yield protocols for steady returns", gradient: ["#4A6FA5", "#6B8FCC", "#89A8D9"] },
  { name: "Loyal Supporter", desc: "Stakes native tokens long-term to contribute to ecosystem security", gradient: ["#7A8B9E", "#9EAEC0", "#B8C8D8"] },
  { name: "Profit Hunter", desc: "Tracks yield spreads and new farming opportunities to move assets", gradient: ["#3DA5A0", "#5CC4BF", "#7EDDD8"] },
  { name: "Active Trader", desc: "Maintains high transaction frequency and asset turnover in DEXs", gradient: ["#D4875E", "#E8A87C", "#F0C4A0"] },
  { name: "Market Provider", desc: "Supplies liquidity to pools to reduce slippage and deepen markets", gradient: ["#7E6BAA", "#9D8AC4", "#BCA9DE"] },
  { name: "Strategic Holder", desc: "Maintains core assets long-term regardless of market volatility", gradient: ["#3B5998", "#5B79B8", "#7B99D8"] },
  { name: "Cash Manager", desc: "Utilizes the network for large stablecoin transfers and settlements", gradient: ["#C47A8A", "#D89AAA", "#ECBACA"] },
  { name: "Wealth Guard", desc: "Maintains massive assets to demonstrate network stability", gradient: ["#4A6FA5", "#5A80B6", "#7A9FCE"] },
  { name: "Major Investor", desc: "Commits significant capital to high-cap assets to build market trust", gradient: ["#8B6BAA", "#A88BC8", "#C5ABE6"] },
  { name: "NFT Collector", desc: "Trades and collects NFTs at scale", gradient: ["#C4727A", "#D8929A", "#ECB2BA"] },
  { name: "Swing Trader", desc: "Rotates positions based on on-chain cycles to maximize returns", gradient: ["#D4875E", "#E09070", "#F0A888"] },
  { name: "Target Buyer", desc: "Analyzes and buys assets at precise price points", gradient: ["#CC7A3E", "#E0944E", "#F0AE6E"] },
  { name: "Power User", desc: "Drives network activity through high gas consumption and transaction volume", gradient: ["#C06030", "#D47848", "#E89868"] },
  { name: "Unique Player", desc: "Exhibits unconventional smart contract interactions and patterns", gradient: ["#6E7A8A", "#8E9AAA", "#AEBACA"] },
  { name: "Chain Hopper", desc: "Uses bridge protocols to move assets across multiple chains", gradient: ["#3DAA7A", "#5DC49A", "#7DDEBA"] },
  { name: "Reward Seeker", desc: "Interacts with protocols specifically for incentive programs and airdrops", gradient: ["#8A8A9E", "#A0A0B6", "#BABACE"] },
  { name: "Dormant Account", desc: "Accounts that have been inactive for a prolonged period", gradient: ["#9A9AA8", "#B0B0BC", "#C8C8D4"] },
  { name: "New Voyager", desc: "Recently initiated on-chain activity with high onboarding potential", gradient: ["#A8B8C8", "#BCC8D8", "#D0D8E8"] },
  { name: "Community Leader", desc: "Participates in governance and voting to shape protocol direction", gradient: ["#7E6BAA", "#9480C0", "#AA96D6"] },
  { name: "Rising Star", desc: "Demonstrates rapid growth in asset value and activity velocity", gradient: ["#3DA58A", "#50C0A0", "#68DAB8"] },
];
