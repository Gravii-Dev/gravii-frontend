export type Accent =
  | "teal"
  | "blue"
  | "purple"
  | "amber"
  | "orange"
  | "red"
  | "cream";

export type NavItem = {
  label: string;
  href?: string;
  sectionId?: "product" | "solutions" | "pricing";
  external?: boolean;
};

export type ProblemItem = {
  accent: Accent;
  title: string;
  description: string;
};

export type EngineProduct = {
  name: string;
  title: string;
  description: string;
  where: string;
  accent: Accent;
  animated?: boolean;
  emphasis?: string;
  descriptionAfterEmphasis?: string;
};

export type Metric = {
  label: string;
  value: string;
  caption: string;
};

export type PreviewTab = {
  id: string;
  label: string;
  metrics: readonly Metric[];
};

export type AudienceCard = {
  eyebrow: string;
  title: string;
  description: string;
};

export type IntegrationCard = {
  eyebrow: string;
  title: string;
  description: string;
  tags: readonly string[];
  accent: Accent;
};

export type UserAppCard = {
  eyebrow: string;
  title: string;
  description: string;
  accent: Accent;
};

export type SolutionCard = {
  product: string;
  title: string;
  description: string;
  example: string;
  accent: Accent;
};

export type PricingPlan = {
  name: string;
  price: string;
  cadence: string;
  quota: string;
  features: readonly string[];
  cta: string;
  featured?: boolean;
  badge?: string;
};

export type LensPricingRow = {
  tier: string;
  wallets: string;
  price: string;
  reachCredit: string;
  netAfterCredit: string;
};

export type ReachCpaRow = {
  tier: string;
  standardCpa: string;
  enterpriseCpa: string;
};

export const navItems: readonly NavItem[] = [
  { label: "Product", sectionId: "product" },
  { label: "Use Cases", sectionId: "solutions" },
  { label: "Pricing", sectionId: "pricing" },
  {
    label: "Docs",
    href: "https://docs.gravii.io",
    external: true,
  },
] as const;

export const problemItems: readonly ProblemItem[] = [
  {
    accent: "red",
    title: "Marketing waste",
    description:
      "You spend equally on all users. Zero targeting precision. CAC unnecessarily high.",
  },
  {
    accent: "orange",
    title: "Lost revenue",
    description:
      "Can't identify high-value users. Missed upsells. No data to prove user quality.",
  },
  {
    accent: "amber",
    title: "Sybil exposure",
    description:
      "Bots and sybils capture rewards meant for real users.",
  },
  {
    accent: "teal",
    title: "Blind to users",
    description:
      "You don't know what your users actually want. No behavioral context, no intent signals — just wallet addresses.",
  },
  {
    accent: "blue",
    title: "Generic UX",
    description:
      "Without behavioral profiles, every user gets the same one-size-fits-all experience.",
  },
  {
    accent: "purple",
    title: "Engineering overhead",
    description:
      "Building your own analysis pipeline costs significant time and engineering resources.",
  },
] as const;

export const engineProducts: readonly EngineProduct[] = [
  {
    name: "GRAVII REACH",
    title: "Reach the right users.",
    description:
      "Grow your ecosystem efficiently. Use X-Ray to gain deep insights into your users' on-chain behavior, then target them with precision campaigns — filter sybils, maximize every dollar.",
    emphasis: "Pull structure",
    descriptionAfterEmphasis:
      "— users discover your campaign, you don't chase them.",
    where: "Gravii App — Discovery & My Space",
    accent: "teal",
    animated: true,
  },
  {
    name: "GRAVII GATE",
    title: "Verify on first touch.",
    description:
      "Understand every user the moment they connect. Know their value, behavior, and risk — personalize experiences, nurture your community organically, and keep threats out automatically.",
    where: "Partner's own platform",
    accent: "blue",
  },
  {
    name: "GRAVII LENS",
    title: "See your user pool.",
    description:
      "Diagnose your ecosystem health before spending. Submit a wallet list — get value distribution, behavioral segments, sybil ratio, and chain activity. Zero engineering cost.",
    where: "Delivered via Dashboard & export",
    accent: "purple",
  },
] as const;

export const reachPreviewTabs: readonly PreviewTab[] = [
  {
    id: "campaign",
    label: "Campaign Builder",
    metrics: [
      {
        label: "Active Campaigns",
        value: "2",
        caption: "Live on Discovery",
      },
      {
        label: "Total Engaged",
        value: "22,750",
        caption: "Users opted in",
      },
      {
        label: "Sybil Filtered",
        value: "860",
        caption: "Auto-removed",
      },
      {
        label: "Estimated Reach",
        value: "~279K",
        caption: "Current targeting",
      },
    ],
  },
  {
    id: "overview",
    label: "Overview",
    metrics: [
      {
        label: "Connected Users",
        value: "301,012",
        caption: "Gravii ID holders",
      },
      {
        label: "Deployed Value",
        value: "$1.27B",
        caption: "Stables + Tokens",
      },
      {
        label: "Available Value",
        value: "$498M",
        caption: "Idle — your opportunity",
      },
      {
        label: "Sybil Rate",
        value: "19%",
        caption: "Flagged wallets",
      },
    ],
  },
  {
    id: "segments",
    label: "User Segments",
    metrics: [
      {
        label: "Behavioral Segments",
        value: "20",
        caption: "On-chain archetypes",
      },
      {
        label: "Top Segment",
        value: "Long-term Holders",
        caption: "22.3% of users",
      },
      {
        label: "Highest Retention",
        value: "High Frequency",
        caption: "91% 30d retention",
      },
      {
        label: "Highest Balance",
        value: "Native Whales",
        caption: "Avg $168K",
      },
    ],
  },
  {
    id: "risk",
    label: "Risk & Sybil",
    metrics: [
      {
        label: "Total Flagged",
        value: "2,340",
        caption: "All clusters",
      },
      {
        label: "Critical Clusters",
        value: "3",
        caption: "Shared funding",
      },
      {
        label: "Avg Entropy",
        value: "0.15",
        caption: "Lower = suspicious",
      },
      {
        label: "Top Flagged Chain",
        value: "Ethereum",
        caption: "42% of flagged",
      },
    ],
  },
] as const;

export const lensPreviewTabs: readonly PreviewTab[] = [
  {
    id: "overview",
    label: "Overview",
    metrics: reachPreviewTabs[1].metrics,
  },
  {
    id: "segments",
    label: "User Segments",
    metrics: reachPreviewTabs[2].metrics,
  },
  {
    id: "risk",
    label: "Risk & Sybil",
    metrics: reachPreviewTabs[3].metrics,
  },
] as const;

export const reachAudienceCards: readonly AudienceCard[] = [
  {
    eyebrow: "YOUR USERS ONLY",
    title: "Your ecosystem, fully optimized.",
    description:
      "Segment and engage only the users already on your platform. No outside exposure — pure internal growth.",
  },
  {
    eyebrow: "BOTH",
    title: "Expand with precision.",
    description:
      "Reach your existing users and tap into Gravii's verified pool at once. You control the mix.",
  },
  {
    eyebrow: "DISCOVER NEW USERS",
    title: "Acquire users that fit.",
    description:
      "Handpick verified users from the Gravii pool by tier, persona, and chain. Solve cold start with zero guesswork.",
  },
] as const;

export const reachSpotlightCard: AudienceCard = {
  eyebrow: "X-RAY USERS",
  title: "Unlock user insights",
  description:
    "Share your unique link — instantly gain insights into your users' on-chain behavior, automatically tagged to your dashboard. No code needed.",
};

export const integrationCards: readonly IntegrationCard[] = [
  {
    eyebrow: "COMMUNITY BOT",
    title: "Discord & Telegram",
    description:
      "Invite Gravii's bot to your server. Users verify their wallet in-app — auto role assignment by on-chain profile. Zero code.",
    tags: ["Zero code", "Discord", "Telegram"],
    accent: "purple",
  },
  {
    eyebrow: "AGENT API",
    title: "For AI Agents",
    description:
      'Zero-Knowledge Boolean endpoint. "Is this wallet ≥ Platinum AND Yield Explorer?" → true/false. No user data exposed.',
    tags: ["ZK Boolean", "AI agents", "Pre-paid credits"],
    accent: "amber",
  },
] as const;

export const userAppCards: readonly UserAppCard[] = [
  {
    eyebrow: "IDENTITY",
    title: "Gravii ID",
    description:
      "A single on-chain identity across all chains. One ID, one tier, universal recognition.",
    accent: "cream",
  },
  {
    eyebrow: "PERSONAL",
    title: "My Space",
    description:
      "Personalized concierge. Recommendations, partner benefits, campaign notifications.",
    accent: "purple",
  },
  {
    eyebrow: "CAMPAIGNS",
    title: "Discovery",
    description:
      "Campaign marketplace. Instant opt-in for qualified, guided missions for others.",
    accent: "teal",
  },
  {
    eyebrow: "RANKING",
    title: "Standing",
    description:
      "Behavioral leaderboard. 6 categories. Only connected wallets appear.",
    accent: "amber",
  },
] as const;

export const sectorLabels: readonly string[] = [
  "CeFi & Neobank",
  "Stablecoins & Payments",
  "DeFi & Trading",
  "Protocols",
  "L1/L2 & Infrastructure",
  "Consumer Apps",
  "Ecosystem & Governance",
  "Gaming",
] as const;

export const solutionCards: readonly SolutionCard[] = [
  {
    product: "GRAVII REACH",
    title: "Precision campaigns that drive real growth",
    description:
      "Grow your ecosystem efficiently — use X-Ray to gain deep insights into your users' on-chain behavior, then target by value, chain, and region. Auto-filter sybils so every dollar goes to real users. Pull structure means users discover your campaign organically. Measure real impact, not vanity metrics.",
    example:
      "Target 42K DEX Traders on Ethereum → 8,420 engaged in 14 days. Sybils auto-removed.",
    accent: "teal",
  },
  {
    product: "GRAVII GATE",
    title: "Know every user the moment they connect",
    description:
      "Gain instant on-chain insights the moment a wallet connects — value, behavior, risk. Personalize experiences, build a healthier community, and filter threats automatically. Also available as Community Bot (Discord/Telegram) and Agent API (AI agents).",
    example:
      "Platinum + Diamond Hands → VIP access. Sybil flagged → restricted. Rising Star → beginner onboarding.",
    accent: "blue",
  },
  {
    product: "GRAVII LENS",
    title: "Understand your users before you commit",
    description:
      "Diagnose your ecosystem health at zero cost. Submit a wallet list — get value distribution, behavioral segments, sybil ratio, chain activity. No Gravii ID needed. No integration. The lightest way to start — then expand to Reach or Gate when ready.",
    example:
      "50K wallets → 38% Gold+, 12% sybil, top segment: Diamond Hands. Decision: proceed to Reach.",
    accent: "purple",
  },
] as const;

export const gatePricingPlans: readonly PricingPlan[] = [
  {
    name: "Free",
    price: "$0",
    cadence: "/forever",
    quota: "50/mo",
    features: [
      "Activity Grade (A-F)",
      "Wallet Status",
      "Sybil Status",
      "Self-service API key",
    ],
    cta: "Get Free API Key",
  },
  {
    name: "Starter",
    price: "$149",
    cadence: "/mo",
    quota: "5,000/mo",
    features: [
      "Everything in Free",
      "Persona + Risk Level",
      "Wallet Age + Governance",
      "Overage: $0.05/query",
    ],
    cta: "Get Started",
  },
  {
    name: "Pro",
    price: "$349",
    cadence: "/mo",
    quota: "20,000/mo",
    features: [
      "Everything in Starter",
      "Tier (Classic~Black)",
      "Primary Chain + Wallet Type",
      "Tx Frequency Grade",
      "Overage: $0.05/query",
    ],
    cta: "Get Started",
  },
  {
    name: "Growth",
    price: "$799",
    cadence: "/mo",
    quota: "50,000/mo",
    features: [
      "Everything in Pro",
      "Available Value tier",
      "Holdings Range",
      "DeFi & NFT Activity",
      "Overage: $0.05/query",
    ],
    cta: "Get Started",
    featured: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    quota: "200K–1M/mo",
    features: [
      "Everything in Growth",
      "Secondary Personas",
      "Custom Scoring",
    ],
    cta: "Contact Us",
  },
] as const;

export const lensPricingRows: readonly LensPricingRow[] = [
  {
    tier: "S",
    wallets: "~5,000",
    price: "$590",
    reachCredit: "$295",
    netAfterCredit: "$295",
  },
  {
    tier: "M",
    wallets: "~20,000",
    price: "$1,990",
    reachCredit: "$995",
    netAfterCredit: "$995",
  },
  {
    tier: "L",
    wallets: "~50,000",
    price: "$4,990",
    reachCredit: "$2,495",
    netAfterCredit: "$2,495",
  },
  {
    tier: "XL",
    wallets: "~100,000",
    price: "$9,900",
    reachCredit: "$4,950",
    netAfterCredit: "$4,950",
  },
] as const;

export const reachPricingPlans: readonly PricingPlan[] = [
  {
    name: "Basic",
    price: "$349",
    cadence: "/mo",
    quota: "X-RAY 5K/mo",
    features: [
      "All scopes · Unlimited campaigns",
      "X-RAY user profiling",
      "Dashboard access",
      "Overage: $0.05/user",
    ],
    cta: "Get Started",
  },
  {
    name: "Growth",
    price: "$899",
    cadence: "/mo",
    quota: "X-RAY 20K/mo",
    features: [
      "Everything in Basic",
      "X-RAY limit: 20,000/mo",
    ],
    cta: "Get Started",
    featured: true,
    badge: "Most Popular",
  },
  {
    name: "Pro",
    price: "$1,799",
    cadence: "/mo",
    quota: "X-RAY 50K/mo",
    features: [
      "Everything in Basic",
      "X-RAY limit: 50,000/mo",
    ],
    cta: "Get Started",
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    quota: "Contact Us",
    features: [
      "Everything in Basic",
      "CPA 20% discount",
      "Custom X-RAY limit",
    ],
    cta: "Contact Us",
  },
] as const;

export const reachCpaRows: readonly ReachCpaRow[] = [
  {
    tier: "Classic",
    standardCpa: "$4.8",
    enterpriseCpa: "$3.84",
  },
  {
    tier: "Gold",
    standardCpa: "$12.8",
    enterpriseCpa: "$10.24",
  },
  {
    tier: "Platinum",
    standardCpa: "$28.8",
    enterpriseCpa: "$23.04",
  },
  {
    tier: "Black",
    standardCpa: "$56",
    enterpriseCpa: "$44.8",
  },
] as const;

export const flywheelSteps: readonly {
  label: string;
  description: string;
  accent: Accent;
}[] = [
  {
    label: "Reach",
    description: "Partner Growth Engine",
    accent: "teal",
  },
  {
    label: "Gate",
    description: "User Acquisition Engine",
    accent: "blue",
  },
  {
    label: "Lens",
    description: "Insight & Entry Point",
    accent: "purple",
  },
] as const;
