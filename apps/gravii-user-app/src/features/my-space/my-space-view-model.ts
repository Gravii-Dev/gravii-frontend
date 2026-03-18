import { launchMockRepository } from "@/features/launch-app/mock-repository";
import type { Campaign, CampaignWithPartner, PartnerStatus } from "@/features/launch-app/types";

function attachPartnerDetails(campaigns: readonly Campaign[], partner: { id: string; name: string; status: PartnerStatus }) {
  return campaigns.map((campaign) => ({
    ...campaign,
    partner: partner.name,
    partnerId: partner.id,
    partnerStatus: partner.status,
  })) as CampaignWithPartner[];
}

export function getCampaignCardKey(campaign: CampaignWithPartner) {
  return `${campaign.name}${campaign.partner}`;
}

export function getMySpaceCampaignCollections(category = "All") {
  const partners = launchMockRepository.getPartners();

  const eligible = partners.flatMap((partner) =>
    attachPartnerDetails(
      partner.campaigns.filter((campaign) => campaign.eligible === true),
      partner,
    ),
  );

  const almostThere = partners.flatMap((partner) =>
    attachPartnerDetails(
      partner.campaigns.filter((campaign) => campaign.eligible === false && partner.status !== "INVITE ONLY"),
      partner,
    ),
  );

  const inviteOnly = partners.flatMap((partner) =>
    attachPartnerDetails(
      partner.campaigns.filter((campaign) => campaign.eligible === false && partner.status === "INVITE ONLY"),
      partner,
    ),
  );

  const filterByCategory = (campaigns: CampaignWithPartner[]) =>
    category === "All" ? campaigns : campaigns.filter((campaign) => campaign.category === category);

  return {
    eligible: filterByCategory(eligible),
    almostThere: filterByCategory(almostThere),
    inviteOnly: filterByCategory(inviteOnly),
  };
}
