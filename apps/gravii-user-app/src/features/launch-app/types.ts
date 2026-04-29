export type PanelId = "profile" | "discovery" | "leaderboard" | "lookup" | "myspace";

export type PanelConfig = {
  id: PanelId;
  num: string;
  tab: string;
  sub: string;
  editorCopy: string;
  dark: boolean;
  bg: string;
  bgHover: string;
  hoverDark?: boolean;
  xray?: boolean;
};

export type SharedContentProps = {
  dark: boolean;
  connected: boolean;
  onConnect: () => void;
  onNavigate?: (id: PanelId) => void;
};

export type CampaignEligibility = true | false | null | "ineligible";
export type PartnerStatus = "ELIGIBLE" | "REACH TO UNLOCK" | "COMING SOON" | "INVITE ONLY" | "INELIGIBLE";
export type CampaignTagType = "verified" | "requires" | "tier" | "open" | "targeting";
export type LeaderboardCategoryKey = 0 | 1 | 2 | 3 | 4 | 5;
export type VerifyState = null | "loading" | "failed";

export type CampaignTag = {
  type: CampaignTagType;
  persona?: string;
  tier?: string;
};

export type Campaign = {
  name: string;
  type: string;
  chains: string[];
  category: string;
  period: string;
  eligible: CampaignEligibility;
  desc: string;
  tags?: CampaignTag[];
  qualifySteps?: string[];
};

export type Partner = {
  id: string;
  name: string;
  status: PartnerStatus;
  eligible: true | false | null | "ineligible";
  delay: string;
  campaigns: Campaign[];
};

export type CampaignWithPartner = Campaign & {
  partner: string;
  partnerId: string;
  partnerStatus: PartnerStatus;
};

export type LeaderboardRow = {
  rank: string;
  tier: "Black" | "Platinum" | "Gold" | "Classic";
  name: string;
  id: string;
  change: string;
  up: boolean | null;
};
