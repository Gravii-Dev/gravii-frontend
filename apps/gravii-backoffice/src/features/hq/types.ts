export type AccentTone =
  | "hq"
  | "teal"
  | "blue"
  | "purple"
  | "amber"
  | "orange"
  | "red"
  | "green"
  | "neutral";

export type DashboardPageId =
  | "overview"
  | "pool-composition"
  | "pool-cohort"
  | "pool-explorer"
  | "acq-source"
  | "acq-attribution"
  | "acq-funnel"
  | "partner-list"
  | "partner-perf"
  | "partner-detail"
  | "campaigns"
  | "risk-sybil"
  | "risk-health";

export type ProductCode = "R" | "G" | "L";
export type PartnerStatus = "Active" | "Review" | "Flagged";
export type PartnerPlan = "Free" | "Starter" | "Growth" | "Enterprise";
export type CampaignScope = "Users" | "Gravii Pool" | "Both";
export type CampaignStatus = "Live" | "Ending" | "Completed" | "Pending";

export interface NavigationItem {
  id: DashboardPageId;
  label: string;
  description: string;
}

export interface NavigationGroup {
  label: string;
  items: NavigationItem[];
}

export interface DashboardStat {
  label: string;
  value: string;
  accent: AccentTone;
  supportingText: string;
}

export interface TierSlice {
  label: string;
  countLabel: string;
  percentage: number;
  accent: AccentTone;
}

export interface BarDatum {
  label: string;
  valueLabel: string;
  percentage: number;
  accent: AccentTone;
  note?: string;
}

export interface TimelineTouchpoint {
  title: string;
  note: string;
  date: string;
  stepLabel: string;
  accent: AccentTone;
}

export interface ExplorerProfile {
  walletAddress: string;
  graviiId: string;
  tier: string;
  status: string;
  personas: string[];
  facts: DashboardStat[];
  touchpoints: TimelineTouchpoint[];
}

export interface LensReport {
  name: string;
  wallets: number;
  date: string;
  status: string;
}

export interface RevenueHistoryPoint {
  month: string;
  gate: number;
  reach: number;
  lens: number;
  total: number;
  change: string;
}

export interface Campaign {
  name: string;
  partner: string;
  scope: CampaignScope;
  engaged: number;
  newIds: number;
  cost: number;
  cpa: number;
  status: CampaignStatus;
}

export interface Partner {
  name: string;
  status: PartnerStatus;
  plan: PartnerPlan;
  products: ProductCode[];
  totalUsers: number;
  users1st: number;
  usersAny: number;
  goldRate: number;
  sybilRate: number;
  apiQueries: number;
  campaigns: number;
  liveCampaigns: number;
  avgCpa: number;
  revenue: number;
  revGate: number;
  revReach: number;
  revLens: number;
  joined: string;
  lastActive: string;
  score: string;
  campaignList: Omit<Campaign, "partner">[];
  lensReports: LensReport[];
  tierDist: Record<"black" | "platinum" | "gold" | "classic", number>;
  driveSources: Record<"xray" | "campaign" | "bot" | "agent", number>;
  apiLatency: number;
  apiErrorRate: number;
  apiPlanLimit: string;
  revenueHistory: RevenueHistoryPoint[];
}

export interface InsightSuggestion {
  key: InsightKey;
  label: string;
}

export type InsightKey =
  | "summary"
  | "sybil"
  | "revenue"
  | "partners"
  | "campaigns"
  | "growth";
