import { launchMockRepository } from "@/features/launch-app/mock-repository";
import type { CampaignTag, Partner } from "@/features/launch-app/types";

export const DISCOVERY_STATUS_OPTIONS = ["All", "Eligible", "Reach to Unlock", "Upcoming"] as const;

export type DiscoveryStatusFilter = (typeof DISCOVERY_STATUS_OPTIONS)[number];

type FilterDiscoveryPartnersInput = {
  searchQuery?: string;
  category?: string;
  status?: DiscoveryStatusFilter;
};

export function getRepresentativeTags(partner: Partner) {
  const allTags = partner.campaigns.flatMap((campaign) => campaign.tags || []);
  const personas = allTags.filter((tag) => tag.persona);
  const tiers = allTags.filter((tag) => tag.tier);
  const shown: CampaignTag[] = [];
  const seen = new Set<string>();

  for (const tag of personas) {
    if (tag.persona && !seen.has(tag.persona)) {
      seen.add(tag.persona);
      shown.push(tag);
    }

    if (shown.length >= 2) {
      break;
    }
  }

  if (tiers.length > 0 && tiers[0]?.type !== "open") {
    shown.push(tiers[0]);
  }

  return {
    shown,
    extra: Math.max(0, new Set(personas.map((tag) => tag.persona)).size - 2),
  };
}

export function filterDiscoveryPartners({
  searchQuery = "",
  category = "All",
  status = "All",
}: FilterDiscoveryPartnersInput) {
  const partners = launchMockRepository.getPartners();

  return partners.filter((partner) => {
    if (searchQuery && !partner.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    if (category !== "All" && !partner.campaigns.some((campaign) => campaign.category === category)) {
      return false;
    }

    if (status === "Eligible" && partner.status !== "ELIGIBLE") {
      return false;
    }

    if (status === "Reach to Unlock" && partner.status !== "REACH TO UNLOCK" && partner.status !== "INVITE ONLY") {
      return false;
    }

    if (status === "Upcoming" && partner.status !== "COMING SOON") {
      return false;
    }

    return true;
  });
}

export function getDiscoveryPartner(partnerId: string | null) {
  if (!partnerId) {
    return null;
  }

  return launchMockRepository.getPartners().find((partner) => partner.id === partnerId) ?? null;
}
