import type {
  BarDatum,
  Campaign,
  DashboardPageId,
  DashboardStat,
  ExplorerProfile,
  InsightKey,
  InsightSuggestion,
  NavigationGroup,
  Partner,
  TierSlice
} from "@/features/hq/types";

export const PAGE_TITLES: Record<DashboardPageId, string> = {
  overview: "Overview",
  "pool-composition": "Pool Composition",
  "pool-cohort": "Cohort Analysis",
  "pool-explorer": "User Explorer",
  "acq-source": "Source Breakdown",
  "acq-attribution": "Attribution",
  "acq-funnel": "Funnel",
  "partner-list": "Partner List",
  "partner-perf": "Partner Performance",
  "partner-detail": "Partner Detail",
  campaigns: "Campaigns",
  "risk-sybil": "Sybil Monitor",
  "risk-health": "Growth Health"
};

export const NAVIGATION: NavigationGroup[] = [
  {
    label: "User Pool",
    items: [
      {
        id: "overview",
        label: "Overview",
        description: "Executive snapshot across pool, partner, and revenue signals."
      },
      {
        id: "pool-composition",
        label: "Composition",
        description: "Tier, persona, chain, and value composition of the Gravii pool."
      },
      {
        id: "pool-cohort",
        label: "Cohort Analysis",
        description: "Retention and engagement quality across monthly user cohorts."
      },
      {
        id: "pool-explorer",
        label: "User Explorer",
        description: "Lookup-centric user intelligence with multi-touch context."
      }
    ]
  },
  {
    label: "Acquisition",
    items: [
      {
        id: "acq-source",
        label: "Source Breakdown",
        description: "Compare source quality, volume, and retention outcomes."
      },
      {
        id: "acq-attribution",
        label: "Attribution",
        description: "Hybrid first-touch and multi-touch attribution for partner fairness."
      },
      {
        id: "acq-funnel",
        label: "Funnel",
        description: "Top-of-funnel to retained-user conversion view."
      }
    ]
  },
  {
    label: "Partners",
    items: [
      {
        id: "partner-list",
        label: "Partner List",
        description: "Searchable operating view across account health and product mix."
      },
      {
        id: "partner-perf",
        label: "Performance",
        description: "Scorecard for revenue, quality, and acquisition contribution."
      },
      {
        id: "campaigns",
        label: "Campaigns",
        description: "Campaign performance and cost efficiency by scope and tier."
      }
    ]
  },
  {
    label: "Risk & Health",
    items: [
      {
        id: "risk-sybil",
        label: "Sybil Monitor",
        description: "Flagged clusters, partner risk, and chain exposure."
      },
      {
        id: "risk-health",
        label: "Growth Health",
        description: "Grade-based growth health model and flywheel contribution view."
      }
    ]
  }
];

export const PERIOD_OPTIONS = ["24h", "7d", "30d", "90d", "All"] as const;

export const OVERVIEW_STATS: DashboardStat[] = [
  {
    label: "Total Gravii IDs",
    value: "487,231",
    accent: "hq",
    supportingText: "3.2% vs previous period"
  },
  {
    label: "New IDs (7d)",
    value: "12,408",
    accent: "green",
    supportingText: "8.1% vs previous 7d"
  },
  {
    label: "Active Partners",
    value: "34",
    accent: "teal",
    supportingText: "2 new this month"
  },
  {
    label: "Total Pool Value",
    value: "$2.14B",
    accent: "blue",
    supportingText: "5.6% deployed + idle"
  },
  {
    label: "Active Campaigns",
    value: "18",
    accent: "amber",
    supportingText: "Across 12 partners"
  },
  {
    label: "Sybil Rate",
    value: "14.2%",
    accent: "red",
    supportingText: "Down 1.1%, improving"
  }
];

export const USER_GROWTH_SERIES = [
  42, 38, 45, 52, 48, 55, 60, 58, 63, 67, 62, 70, 75, 72, 78, 82, 80, 85, 88,
  84, 90, 95, 92, 98, 100, 96, 105, 110, 108, 115
];

export const TIER_DISTRIBUTION: TierSlice[] = [
  { label: "Classic", countLabel: "189.9K", percentage: 39, accent: "neutral" },
  { label: "Gold", countLabel: "121.8K", percentage: 25, accent: "hq" },
  { label: "Platinum", countLabel: "102.3K", percentage: 21, accent: "amber" },
  { label: "Black", countLabel: "73.1K", percentage: 15, accent: "purple" }
];

export const OVERVIEW_SOURCE_MIX: BarDatum[] = [
  { label: "Partner Drive", valueLabel: "42%", percentage: 42, accent: "teal" },
  { label: "Campaign (Reach)", valueLabel: "24%", percentage: 24, accent: "blue" },
  { label: "Organic", valueLabel: "18%", percentage: 18, accent: "purple" },
  { label: "Community Bot", valueLabel: "10%", percentage: 10, accent: "amber" },
  { label: "Referral", valueLabel: "4%", percentage: 4, accent: "hq" },
  { label: "Other / Unknown", valueLabel: "2%", percentage: 2, accent: "neutral" }
];

export const PERSONA_BREAKDOWN: BarDatum[] = [
  { label: "Diamond Hands", valueLabel: "14.2%", percentage: 71, accent: "purple" },
  { label: "Steady Earner", valueLabel: "12.8%", percentage: 64, accent: "teal" },
  { label: "Chain Believer", valueLabel: "10.1%", percentage: 50.5, accent: "blue" },
  { label: "Fast Mover", valueLabel: "8.6%", percentage: 43, accent: "amber" },
  { label: "Yield Explorer", valueLabel: "7.9%", percentage: 39.5, accent: "purple" },
  { label: "Pool Builder", valueLabel: "6.4%", percentage: 32, accent: "hq" },
  { label: "Rising Star", valueLabel: "5.8%", percentage: 29, accent: "green" },
  { label: "Fresh Start", valueLabel: "5.2%", percentage: 26, accent: "neutral" }
];

export const PRIMARY_CHAIN_DISTRIBUTION: BarDatum[] = [
  { label: "Ethereum", valueLabel: "38.4%", percentage: 76.8, accent: "blue" },
  { label: "Arbitrum", valueLabel: "18.2%", percentage: 36.4, accent: "teal" },
  { label: "Base", valueLabel: "14.7%", percentage: 29.4, accent: "purple" },
  { label: "Polygon", valueLabel: "11.3%", percentage: 22.6, accent: "hq" },
  { label: "Optimism", valueLabel: "8.1%", percentage: 16.2, accent: "red" },
  { label: "Others (12 chains)", valueLabel: "9.3%", percentage: 18.6, accent: "neutral" }
];

export const COMPOSITION_VALUE_STATS: DashboardStat[] = [
  {
    label: "Total Deployed Value",
    value: "$1.42B",
    accent: "teal",
    supportingText: "Stables + tokens in active use"
  },
  {
    label: "Total Available (Idle)",
    value: "$720M",
    accent: "amber",
    supportingText: "Partner opportunity pool"
  },
  {
    label: "Avg Value / User",
    value: "$4,392",
    accent: "hq",
    supportingText: "Deployed + idle combined"
  },
  {
    label: "Avg Value / Gold+ User",
    value: "$11,240",
    accent: "purple",
    supportingText: "2.56x pool average"
  }
];

export const COMPOSITION_SYBIL_STATUS: BarDatum[] = [
  { label: "Clean", valueLabel: "74.8% (364,449)", percentage: 74.8, accent: "green" },
  { label: "Suspect", valueLabel: "11.0% (53,595)", percentage: 11, accent: "amber" },
  { label: "Flagged (Sybil)", valueLabel: "14.2% (69,187)", percentage: 14.2, accent: "red" }
];

export const COHORT_SUMMARY: DashboardStat[] = [
  {
    label: "30d Retention (All)",
    value: "64.2%",
    accent: "green",
    supportingText: "Up 2.1% vs previous cohort"
  },
  {
    label: "30d Retention (Gold+)",
    value: "82.7%",
    accent: "teal",
    supportingText: "Up 1.4% vs previous cohort"
  },
  {
    label: "Avg Days Active (30d)",
    value: "12.4",
    accent: "amber",
    supportingText: "Stable"
  }
];

export const COHORT_ROWS = [
  ["Mar 2026", "48,200", "89%", "76%", "68%", "64%", "—", "—"],
  ["Feb 2026", "44,800", "87%", "73%", "65%", "61%", "52%", "—"],
  ["Jan 2026", "41,300", "85%", "71%", "62%", "58%", "48%", "41%"],
  ["Dec 2025", "38,600", "83%", "68%", "59%", "54%", "44%", "37%"],
  ["Nov 2025", "35,100", "81%", "66%", "56%", "51%", "42%", "35%"],
  ["Oct 2025", "32,400", "80%", "64%", "54%", "49%", "39%", "32%"]
] as const;

export const ACTIVITY_BY_TIER = [
  ["Black", "91.2%", "48.3", "22.1"],
  ["Platinum", "84.6%", "32.7", "16.8"],
  ["Gold", "72.1%", "18.4", "10.2"],
  ["Classic", "41.3%", "6.2", "3.8"]
] as const;

export const SAMPLE_EXPLORER_PROFILE: ExplorerProfile = {
  walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f3f8a",
  graviiId: "#28,401",
  tier: "Platinum",
  status: "Clean",
  personas: ["Diamond Hands", "Chain Believer"],
  facts: [
    { label: "Total Value", value: "$84,230", accent: "neutral", supportingText: "" },
    { label: "Deployed", value: "$61,400", accent: "teal", supportingText: "" },
    { label: "Available (Idle)", value: "$22,830", accent: "amber", supportingText: "" },
    { label: "Active Chains", value: "5", accent: "blue", supportingText: "" },
    { label: "Activity Grade", value: "A", accent: "green", supportingText: "" },
    { label: "Wallet Age", value: "847d", accent: "neutral", supportingText: "" }
  ],
  touchpoints: [
    {
      title: "Organic — Direct Visit",
      note: "Created Gravii ID via direct site visit",
      date: "2025-11-14",
      stepLabel: "1st Touch · Primary",
      accent: "hq"
    },
    {
      title: "Nexus Finance — Campaign",
      note: "Opted into ETH Stakers Welcome campaign",
      date: "2025-12-03",
      stepLabel: "2nd Touch",
      accent: "teal"
    },
    {
      title: "ChainVault — Partner Drive",
      note: "Driven via X-RAY Users link and auto-tagged to ChainVault pool",
      date: "2026-01-18",
      stepLabel: "3rd Touch",
      accent: "blue"
    },
    {
      title: "DeFi Pulse — Community Bot",
      note: "Connected wallet via Discord bot and auto-role assigned to Platinum",
      date: "2026-02-25",
      stepLabel: "4th Touch",
      accent: "purple"
    }
  ]
};

export const ACQUISITION_SOURCE_STATS: DashboardStat[] = [
  {
    label: "Partner Drive",
    value: "5,211",
    accent: "teal",
    supportingText: "42% of new IDs (7d)"
  },
  {
    label: "Campaign (Reach)",
    value: "2,978",
    accent: "blue",
    supportingText: "24% · up 12%"
  },
  {
    label: "Organic",
    value: "2,233",
    accent: "purple",
    supportingText: "18% · down 3%"
  },
  {
    label: "Community Bot",
    value: "1,241",
    accent: "amber",
    supportingText: "10% · up 22%"
  }
];

export const SOURCE_QUALITY_ROWS = [
  ["Partner Drive", "5,211", "58%", "6%", "71%", "$6,840", "Improving"],
  ["Campaign (Reach)", "2,978", "52%", "8%", "66%", "$5,210", "Improving"],
  ["Organic", "2,233", "44%", "5%", "68%", "$4,920", "Softening"],
  ["Community Bot", "1,241", "36%", "14%", "54%", "$3,180", "Improving"],
  ["Referral", "497", "62%", "3%", "78%", "$8,120", "Stable"],
  ["Other / Unknown", "248", "22%", "28%", "32%", "$1,040", "Declining"]
] as const;

export const SOURCE_TREND_WEEKS = [
  [34, 18, 22, 8, 3],
  [36, 19, 20, 9, 3],
  [38, 20, 19, 10, 3],
  [35, 22, 18, 10, 4],
  [37, 23, 18, 10, 3],
  [39, 21, 19, 9, 4],
  [40, 22, 18, 10, 3],
  [38, 24, 17, 10, 4],
  [40, 23, 18, 10, 3],
  [41, 24, 18, 10, 4],
  [42, 24, 17, 11, 4],
  [42, 24, 18, 10, 4]
] as const;

export const ATTRIBUTION_FIRST_TOUCH_ROWS = [
  ["Partner Drive", "198,420", "54%", "$5,840", "Up 3.2%"],
  ["Organic", "121,320", "46%", "$4,620", "Down 1.1%"],
  ["Campaign (Reach)", "97,200", "50%", "$4,980", "Up 5.8%"],
  ["Community Bot", "43,800", "34%", "$2,940", "Up 8.1%"],
  ["Referral", "18,240", "64%", "$8,420", "Up 1.2%"],
  ["Unknown / Other", "8,251", "21%", "$1,180", "Down 4.2%"]
] as const;

export const PARTNER_ATTRIBUTION_ROWS = [
  ["Nexus Finance", "42,100", "68,400", "1.62x", "Strong at both acquiring and engaging"],
  ["ChainVault", "31,800", "54,200", "1.70x", "High re-engagement through campaigns"],
  ["DeFi Pulse", "28,400", "39,100", "1.38x", "Mostly new-user acquisition focused"],
  ["MetaBridge", "22,600", "48,800", "2.16x", "Touches existing users more than it brings new"],
  ["Orbital Labs", "15,200", "21,300", "1.40x", "Balanced acquisition and engagement"]
] as const;

export const FUNNEL_STAGES = [
  {
    label: "Site Visits / Wallet Connections",
    note: "Unique wallets that touched Gravii",
    value: "186,400",
    percentage: "100%",
    accent: "hq"
  },
  {
    label: "Gravii ID Created",
    note: "Completed onboarding and ID generation",
    value: "48,200",
    percentage: "25.9% conversion",
    accent: "teal"
  },
  {
    label: "Campaign Participation",
    note: "Opted into at least one campaign",
    value: "18,640",
    percentage: "38.7% of IDs",
    accent: "blue"
  },
  {
    label: "30d Retained",
    note: "Active again within 30 days of ID creation",
    value: "30,940",
    percentage: "64.2% retention",
    accent: "purple"
  }
] as const;

export const FUNNEL_ROWS = [
  ["Partner Drive", "32.4%", "44.1%", "71.0%", "Retention"],
  ["Campaign", "28.8%", "62.3%", "66.0%", "Engagement"],
  ["Organic", "21.6%", "28.4%", "68.0%", "Retention"],
  ["Community Bot", "38.2%", "22.1%", "54.0%", "Top-Funnel"],
  ["Referral", "41.6%", "38.8%", "78.0%", "All Stages"]
] as const;

export const PARTNERS: Partner[] = [
  {
    name: "Nexus Finance",
    status: "Active",
    plan: "Enterprise",
    products: ["R", "G", "L"],
    totalUsers: 52840,
    users1st: 42100,
    usersAny: 68400,
    goldRate: 68,
    sybilRate: 4,
    apiQueries: 48200,
    campaigns: 6,
    liveCampaigns: 3,
    avgCpa: 0.31,
    revenue: 6800,
    revGate: 4200,
    revReach: 2100,
    revLens: 500,
    joined: "2025-06-14",
    lastActive: "2h ago",
    score: "A+",
    campaignList: [
      { name: "ETH Stakers Welcome", scope: "Both", engaged: 4280, newIds: 620, cost: 1019, cpa: 0.24, status: "Live" },
      { name: "Rising Star Program", scope: "Users", engaged: 1420, newIds: 0, cost: 546, cpa: 0.38, status: "Live" },
      { name: "Whale Onboarding", scope: "Gravii Pool", engaged: 3810, newIds: 2640, cost: 1003, cpa: 0.26, status: "Live" },
      { name: "DeFi Power Users", scope: "Both", engaged: 2940, newIds: 480, cost: 1014, cpa: 0.34, status: "Completed" },
      { name: "Early Adopter Rewards", scope: "Users", engaged: 1680, newIds: 0, cost: 764, cpa: 0.45, status: "Completed" },
      { name: "Chain Hopper Special", scope: "Both", engaged: 2120, newIds: 340, cost: 1178, cpa: 0.56, status: "Completed" }
    ],
    lensReports: [
      { name: "Q1 2026 Pool Analysis", wallets: 42100, date: "Mar 02", status: "Delivered" },
      { name: "Pre-Campaign Audit", wallets: 28400, date: "Jan 15", status: "Delivered" },
      { name: "Onboarding Report", wallets: 18200, date: "Jun 28, 2025", status: "Delivered" }
    ],
    tierDist: { black: 22, platinum: 26, gold: 20, classic: 32 },
    driveSources: { xray: 58, campaign: 28, bot: 10, agent: 4 },
    apiLatency: 118,
    apiErrorRate: 0.3,
    apiPlanLimit: "Negotiated (unlimited)",
    revenueHistory: [
      { month: "Mar 2026", gate: 4200, reach: 2100, lens: 500, total: 6800, change: "+14%" },
      { month: "Feb 2026", gate: 3800, reach: 1600, lens: 560, total: 5960, change: "+22%" },
      { month: "Jan 2026", gate: 3200, reach: 1200, lens: 480, total: 4880, change: "+18%" },
      { month: "Dec 2025", gate: 2800, reach: 800, lens: 520, total: 4120, change: "+8%" },
      { month: "Nov 2025", gate: 2600, reach: 600, lens: 600, total: 3800, change: "—" }
    ]
  },
  {
    name: "ChainVault",
    status: "Active",
    plan: "Growth",
    products: ["R", "G"],
    totalUsers: 38200,
    users1st: 31800,
    usersAny: 54200,
    goldRate: 52,
    sybilRate: 11,
    apiQueries: 22800,
    campaigns: 3,
    liveCampaigns: 2,
    avgCpa: 0.48,
    revenue: 3400,
    revGate: 2400,
    revReach: 1000,
    revLens: 0,
    joined: "2025-07-22",
    lastActive: "4h ago",
    score: "B+",
    campaignList: [
      { name: "Diamond Hands Bonus", scope: "Users", engaged: 2190, newIds: 0, cost: 1043, cpa: 0.48, status: "Live" },
      { name: "Stablecoin Savers", scope: "Both", engaged: 1840, newIds: 310, cost: 836, cpa: 0.45, status: "Live" },
      { name: "Vault Keeper Rewards", scope: "Users", engaged: 1260, newIds: 0, cost: 630, cpa: 0.5, status: "Completed" }
    ],
    lensReports: [],
    tierDist: { black: 14, platinum: 18, gold: 20, classic: 48 },
    driveSources: { xray: 62, campaign: 24, bot: 8, agent: 6 },
    apiLatency: 134,
    apiErrorRate: 0.8,
    apiPlanLimit: "50,000/mo",
    revenueHistory: [
      { month: "Mar 2026", gate: 2400, reach: 1000, lens: 0, total: 3400, change: "+12%" },
      { month: "Feb 2026", gate: 2100, reach: 940, lens: 0, total: 3040, change: "+8%" },
      { month: "Jan 2026", gate: 1900, reach: 920, lens: 0, total: 2820, change: "+15%" }
    ]
  },
  {
    name: "DeFi Pulse",
    status: "Active",
    plan: "Growth",
    products: ["G", "L"],
    totalUsers: 32400,
    users1st: 28400,
    usersAny: 39100,
    goldRate: 45,
    sybilRate: 7,
    apiQueries: 18600,
    campaigns: 2,
    liveCampaigns: 1,
    avgCpa: 0.53,
    revenue: 2800,
    revGate: 2200,
    revReach: 0,
    revLens: 600,
    joined: "2025-08-10",
    lastActive: "1d ago",
    score: "B",
    campaignList: [
      { name: "Yield Explorer Week", scope: "Both", engaged: 960, newIds: 180, cost: 505, cpa: 0.53, status: "Ending" },
      { name: "DeFi Newcomers", scope: "Gravii Pool", engaged: 1420, newIds: 980, cost: 746, cpa: 0.53, status: "Completed" }
    ],
    lensReports: [
      { name: "DeFi User Audit", wallets: 28400, date: "Feb 10", status: "Delivered" },
      { name: "Initial Pool Scan", wallets: 15200, date: "Aug 20, 2025", status: "Delivered" }
    ],
    tierDist: { black: 10, platinum: 15, gold: 20, classic: 55 },
    driveSources: { xray: 48, campaign: 18, bot: 28, agent: 6 },
    apiLatency: 142,
    apiErrorRate: 0.5,
    apiPlanLimit: "50,000/mo",
    revenueHistory: [
      { month: "Mar 2026", gate: 2200, reach: 0, lens: 600, total: 2800, change: "+10%" },
      { month: "Feb 2026", gate: 2000, reach: 0, lens: 540, total: 2540, change: "+6%" }
    ]
  },
  {
    name: "MetaBridge",
    status: "Review",
    plan: "Starter",
    products: ["R", "G"],
    totalUsers: 26800,
    users1st: 22600,
    usersAny: 48800,
    goldRate: 41,
    sybilRate: 15,
    apiQueries: 12400,
    campaigns: 2,
    liveCampaigns: 1,
    avgCpa: 0.71,
    revenue: 1800,
    revGate: 1200,
    revReach: 600,
    revLens: 0,
    joined: "2025-09-05",
    lastActive: "6h ago",
    score: "C+",
    campaignList: [
      { name: "New User Onboarding", scope: "Gravii Pool", engaged: 1820, newIds: 1420, cost: 1300, cpa: 0.71, status: "Live" },
      { name: "Bridge Users Welcome", scope: "Both", engaged: 1140, newIds: 280, cost: 814, cpa: 0.71, status: "Completed" }
    ],
    lensReports: [],
    tierDist: { black: 8, platinum: 13, gold: 20, classic: 59 },
    driveSources: { xray: 72, campaign: 18, bot: 6, agent: 4 },
    apiLatency: 156,
    apiErrorRate: 1.2,
    apiPlanLimit: "5,000/mo",
    revenueHistory: [
      { month: "Mar 2026", gate: 1200, reach: 600, lens: 0, total: 1800, change: "+20%" },
      { month: "Feb 2026", gate: 1000, reach: 500, lens: 0, total: 1500, change: "+12%" }
    ]
  },
  {
    name: "Orbital Labs",
    status: "Flagged",
    plan: "Starter",
    products: ["G"],
    totalUsers: 18400,
    users1st: 15200,
    usersAny: 21300,
    goldRate: 33,
    sybilRate: 22,
    apiQueries: 8200,
    campaigns: 0,
    liveCampaigns: 0,
    avgCpa: 0,
    revenue: 990,
    revGate: 990,
    revReach: 0,
    revLens: 0,
    joined: "2025-10-18",
    lastActive: "12h ago",
    score: "D",
    campaignList: [],
    lensReports: [],
    tierDist: { black: 4, platinum: 9, gold: 20, classic: 67 },
    driveSources: { xray: 100, campaign: 0, bot: 0, agent: 0 },
    apiLatency: 168,
    apiErrorRate: 2.4,
    apiPlanLimit: "5,000/mo",
    revenueHistory: [{ month: "Mar 2026", gate: 990, reach: 0, lens: 0, total: 990, change: "+2%" }]
  },
  {
    name: "ZenProtocol",
    status: "Active",
    plan: "Enterprise",
    products: ["R", "G", "L"],
    totalUsers: 46200,
    users1st: 38900,
    usersAny: 52100,
    goldRate: 61,
    sybilRate: 5,
    apiQueries: 52400,
    campaigns: 4,
    liveCampaigns: 2,
    avgCpa: 0.36,
    revenue: 8200,
    revGate: 5800,
    revReach: 1800,
    revLens: 600,
    joined: "2025-06-02",
    lastActive: "30m ago",
    score: "A",
    campaignList: [
      { name: "Chain Hopper Airdrop", scope: "Gravii Pool", engaged: 3840, newIds: 2810, cost: 1371, cpa: 0.36, status: "Live" },
      { name: "Governance Stakers", scope: "Users", engaged: 2200, newIds: 0, cost: 786, cpa: 0.36, status: "Live" },
      { name: "Protocol Explorers", scope: "Both", engaged: 1860, newIds: 420, cost: 664, cpa: 0.36, status: "Completed" },
      { name: "Early Bird ZEN", scope: "Users", engaged: 1400, newIds: 0, cost: 500, cpa: 0.36, status: "Completed" }
    ],
    lensReports: [
      { name: "Governance Pool Deep Dive", wallets: 38900, date: "Feb 18", status: "Delivered" },
      { name: "Pre-Launch Audit", wallets: 22000, date: "May 28, 2025", status: "Delivered" }
    ],
    tierDist: { black: 18, platinum: 23, gold: 20, classic: 39 },
    driveSources: { xray: 52, campaign: 30, bot: 12, agent: 6 },
    apiLatency: 112,
    apiErrorRate: 0.2,
    apiPlanLimit: "Negotiated (unlimited)",
    revenueHistory: [
      { month: "Mar 2026", gate: 5800, reach: 1800, lens: 600, total: 8200, change: "+16%" },
      { month: "Feb 2026", gate: 5200, reach: 1400, lens: 480, total: 7080, change: "+20%" },
      { month: "Jan 2026", gate: 4600, reach: 1000, lens: 300, total: 5900, change: "+14%" }
    ]
  },
  {
    name: "ArcLayer",
    status: "Active",
    plan: "Growth",
    products: ["L"],
    totalUsers: 0,
    users1st: 0,
    usersAny: 0,
    goldRate: 0,
    sybilRate: 0,
    apiQueries: 0,
    campaigns: 0,
    liveCampaigns: 0,
    avgCpa: 0,
    revenue: 480,
    revGate: 0,
    revReach: 0,
    revLens: 480,
    joined: "2026-02-01",
    lastActive: "3d ago",
    score: "—",
    campaignList: [],
    lensReports: [{ name: "Exploratory Analysis", wallets: 12000, date: "Feb 08", status: "Delivered" }],
    tierDist: { black: 0, platinum: 0, gold: 0, classic: 0 },
    driveSources: { xray: 0, campaign: 0, bot: 0, agent: 0 },
    apiLatency: 0,
    apiErrorRate: 0,
    apiPlanLimit: "—",
    revenueHistory: [{ month: "Mar 2026", gate: 0, reach: 0, lens: 480, total: 480, change: "New" }]
  },
  {
    name: "SwapHub",
    status: "Active",
    plan: "Free",
    products: ["G"],
    totalUsers: 9800,
    users1st: 8400,
    usersAny: 11200,
    goldRate: 38,
    sybilRate: 9,
    apiQueries: 4200,
    campaigns: 0,
    liveCampaigns: 0,
    avgCpa: 0,
    revenue: 0,
    revGate: 0,
    revReach: 0,
    revLens: 0,
    joined: "2025-11-12",
    lastActive: "2d ago",
    score: "C",
    campaignList: [],
    lensReports: [],
    tierDist: { black: 6, platinum: 12, gold: 20, classic: 62 },
    driveSources: { xray: 100, campaign: 0, bot: 0, agent: 0 },
    apiLatency: 148,
    apiErrorRate: 0.6,
    apiPlanLimit: "500/mo",
    revenueHistory: [{ month: "Mar 2026", gate: 0, reach: 0, lens: 0, total: 0, change: "Free plan" }]
  }
];

export const CAMPAIGNS: Campaign[] = PARTNERS.flatMap((partner) =>
  partner.campaignList.map((campaign) => ({
    ...campaign,
    partner: partner.name
  }))
);

export const PARTNER_FILTERS = {
  status: ["Active", "Review", "Flagged"] as const,
  plan: ["Free", "Starter", "Growth", "Enterprise"] as const,
  product: ["Reach", "Gate", "Lens"] as const
};

export const CAMPAIGN_FILTERS = {
  status: ["Live", "Ending", "Pending", "Completed"] as const,
  scope: ["Users", "Gravii Pool", "Both"] as const,
  partner: ["Nexus", "ChainVault", "ZenProtocol", "DeFi Pulse", "MetaBridge"] as const
};

export const PRODUCT_LABELS = {
  R: "Reach",
  G: "Gate",
  L: "Lens"
} as const;

export const RISK_SYBIL_STATS: DashboardStat[] = [
  {
    label: "Total Flagged",
    value: "69,187",
    accent: "red",
    supportingText: "14.2% of pool · down 1.1%"
  },
  {
    label: "Suspect (Watchlist)",
    value: "53,595",
    accent: "amber",
    supportingText: "11.0% of pool"
  },
  {
    label: "Critical Clusters",
    value: "8",
    accent: "red",
    supportingText: "Shared funding source detected"
  },
  {
    label: "Auto-Filtered (30d)",
    value: "3,420",
    accent: "green",
    supportingText: "Blocked from campaigns"
  }
];

export const RISK_SYBIL_PARTNERS = [
  ["Orbital Labs", "3,344", "22%"],
  ["MetaBridge", "3,390", "15%"],
  ["ChainVault", "3,498", "11%"],
  ["SwapHub", "756", "9%"],
  ["DeFi Pulse", "1,988", "7%"],
  ["Nexus Finance", "1,684", "4%"]
] as const;

export const RISK_CHAIN_DISTRIBUTION: BarDatum[] = [
  { label: "Ethereum", valueLabel: "42% of flagged", percentage: 42, accent: "red" },
  { label: "Arbitrum", valueLabel: "22%", percentage: 22, accent: "orange" },
  { label: "Base", valueLabel: "18%", percentage: 18, accent: "amber" },
  { label: "Polygon", valueLabel: "12%", percentage: 12, accent: "neutral" },
  { label: "Others", valueLabel: "6%", percentage: 6, accent: "neutral" }
];

export const GROWTH_HEALTH_STATS: DashboardStat[] = [
  {
    label: "Net ID Growth (30d)",
    value: "+46,360",
    accent: "green",
    supportingText: "48,200 new — 1,840 deleted"
  },
  {
    label: "Growth Rate (MoM)",
    value: "11.2%",
    accent: "green",
    supportingText: "Up 3.0% vs previous month"
  },
  {
    label: "Source Diversification",
    value: "0.74",
    accent: "teal",
    supportingText: "Healthy (max source: 42%)"
  },
  {
    label: "Gold+ Acquisition Rate",
    value: "52%",
    accent: "blue",
    supportingText: "Of new IDs in the last 30d"
  },
  {
    label: "Partner Contribution",
    value: "66%",
    accent: "hq",
    supportingText: "Of new IDs driven by partners"
  },
  {
    label: "Churn Rate (30d)",
    value: "0.38%",
    accent: "green",
    supportingText: "Down 0.04% · improving"
  }
];

export const GROWTH_GRADE_ROWS = [
  ["A", ">=10%", "Churn <1% and no single source >60%"],
  ["A-", ">=10%", "One or more conditions unmet"],
  ["B+", "7~10%", "Healthy but not exceptional"],
  ["B", "5~7%", "Moderate growth"],
  ["C", "1~5%", "Early traction or flattening"],
  ["D", "<1% or negative", "Pool is stagnant or shrinking"]
] as const;

export const GROWTH_TREND_ROWS = [
  ["Mar 10", "+12,408", "11.2%", "0.38%", "0.74", "52%", "A"],
  ["Mar 03", "+11,840", "10.8%", "0.40%", "0.72", "50%", "A"],
  ["Feb 24", "+10,200", "9.4%", "0.41%", "0.70", "48%", "B+"],
  ["Feb 17", "+9,600", "8.6%", "0.42%", "0.68", "46%", "B+"],
  ["Feb 10", "+8,400", "7.8%", "0.44%", "0.66", "44%", "B+"],
  ["Feb 03", "+7,200", "6.2%", "0.46%", "0.64", "42%", "B"],
  ["Jan 27", "+6,800", "5.8%", "0.48%", "0.62", "40%", "B"],
  ["Jan 20", "+6,100", "5.4%", "0.50%", "0.60", "38%", "B"]
] as const;

export const PRODUCT_CONTRIBUTIONS = [
  {
    label: "Reach",
    headline: "8,420",
    note: "New IDs via campaigns (30d)",
    accent: "teal",
    facts: [
      ["Active campaigns", "18"],
      ["Total engaged", "84,200"],
      ["Avg CPA", "$0.42"],
      ["Pool contribution", "17.5%"]
    ]
  },
  {
    label: "Gate",
    headline: "142K",
    note: "API queries (30d)",
    accent: "blue",
    facts: [
      ["Partners using Gate", "28"],
      ["IDs via Drive link", "24,800"],
      ["Avg latency", "127ms"],
      ["Pool contribution", "51.5%"]
    ]
  },
  {
    label: "Lens",
    headline: "12",
    note: "Reports delivered (30d)",
    accent: "purple",
    facts: [
      ["Partners using Lens", "22"],
      ["Converted to Gate/Reach", "6"],
      ["Wallets analyzed", "420K"],
      ["Entry point role", "Pipeline"]
    ]
  }
] as const;

export const NET_POOL_EFFECT: DashboardStat[] = [
  {
    label: "New IDs (All Sources)",
    value: "+48,200",
    accent: "green",
    supportingText: ""
  },
  {
    label: "Deleted IDs",
    value: "-1,840",
    accent: "red",
    supportingText: ""
  },
  {
    label: "Net Growth",
    value: "+46,360",
    accent: "hq",
    supportingText: ""
  },
  {
    label: "Pool Value Change",
    value: "+$184M",
    accent: "purple",
    supportingText: ""
  }
];

export const INSIGHTS_BY_PAGE: Record<DashboardPageId, string[]> = {
  overview: [
    "Sybil rate dropped 1.1% this period. Orbital Labs still contributes the highest flagged share at 22%.",
    "Pool growth is above the 10% threshold, which keeps Growth Health in A territory.",
    "Gate drives 66% of current MRR and remains the anchor monetization line."
  ],
  "pool-composition": [
    "Classic makes up 39% of the pool, but Gold+ users still carry most of the monetizable value."
  ],
  "pool-cohort": ["Newest cohorts are showing the strongest 30-day retention at 64% and climbing."],
  "pool-explorer": ["Use the explorer to connect a wallet or Gravii ID back to its multi-touch journey."],
  "acq-source": ["Referral is still the highest quality source even though its absolute volume remains small."],
  "acq-attribution": ["MetaBridge is over-indexing on re-engaging existing users rather than bringing in first-touch growth."],
  "acq-funnel": ["Referral leads at every funnel stage. Community Bot is strongest at top-funnel conversion only."],
  "partner-list": ["ArcLayer is a Lens-only upsell target. Orbital Labs needs immediate quality review."],
  "partner-perf": ["ZenProtocol and Nexus Finance together drive 44% of total revenue in the current mock set."],
  campaigns: ["Users scope produces the cheapest CPA at $0.32 while keeping sybil exposure lowest."],
  "risk-sybil": ["Eight critical clusters remain active. Orbital Labs is still the partner to watch most closely."],
  "risk-health": ["The health score is driven primarily by net growth rate, then adjusted by churn and concentration."],
  "partner-detail": ["Use partner detail to identify unused products and upsell opportunities."]
};

export const CHAT_SUGGESTIONS: InsightSuggestion[] = [
  { key: "summary", label: "Weekly summary" },
  { key: "sybil", label: "Sybil status" },
  { key: "revenue", label: "Revenue breakdown" },
  { key: "partners", label: "Partner health" },
  { key: "campaigns", label: "Campaign performance" },
  { key: "growth", label: "Growth health" }
];

export const CHAT_RESPONSES: Record<InsightKey, string> = {
  summary:
    "Current snapshot: 487,231 total IDs, 34 active partners, $33.8K MRR, Growth Health A, and a 14.2% sybil rate that is improving.",
  sybil:
    "Sybil overview: 69,187 flagged wallets, eight critical clusters, Orbital Labs at 22% risk, and Nexus Finance best among major partners at 4%.",
  revenue:
    "Revenue breakdown: Gate contributes $22.4K, Reach contributes $8.2K, and Lens contributes $3.2K. ZenProtocol is the top earning account.",
  partners:
    "Partner health: ArcLayer is the clearest Lens-to-Gate upsell target, while MetaBridge and Orbital Labs need closer quality review.",
  campaigns:
    "Campaigns view: average CPA is $0.42, Users-only scope is most efficient, and Gravii Pool scope trades higher reach for higher sybil exposure.",
  growth:
    "Growth Health remains A because net growth is above 10% MoM, churn is below 1%, and no single acquisition source dominates above 60%."
};
