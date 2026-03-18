import {
  CAMPAIGNS,
  PARTNERS,
  PRODUCT_LABELS
} from "@/features/hq/data";
import type { Campaign, Partner, ProductCode } from "@/features/hq/types";

const PRODUCT_LABEL_TO_CODE: Record<string, ProductCode> = {
  Reach: "R",
  Gate: "G",
  Lens: "L"
};

export function getAllPartners(): Partner[] {
  return PARTNERS;
}

export function getAllCampaigns(): Campaign[] {
  return CAMPAIGNS;
}

export function filterPartners(options: {
  searchText: string;
  statuses: string[];
  plans: string[];
  products: string[];
}): Partner[] {
  const normalizedSearch = options.searchText.trim().toLowerCase();

  return PARTNERS.filter((partner) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      partner.name.toLowerCase().includes(normalizedSearch);
    const matchesStatus =
      options.statuses.length === 0 || options.statuses.includes(partner.status);
    const matchesPlan =
      options.plans.length === 0 || options.plans.includes(partner.plan);
    const matchesProduct =
      options.products.length === 0 ||
      options.products.some((label) => {
        const code = PRODUCT_LABEL_TO_CODE[label];
        return code ? partner.products.includes(code) : false;
      });

    return matchesSearch && matchesStatus && matchesPlan && matchesProduct;
  });
}

export function filterCampaigns(options: {
  statuses: string[];
  scopes: string[];
  partnerMatches: string[];
}): Campaign[] {
  return CAMPAIGNS.filter((campaign) => {
    const matchesStatus =
      options.statuses.length === 0 || options.statuses.includes(campaign.status);
    const matchesScope =
      options.scopes.length === 0 || options.scopes.includes(campaign.scope);
    const matchesPartner =
      options.partnerMatches.length === 0 ||
      options.partnerMatches.some((token) =>
        campaign.partner.toLowerCase().includes(token.toLowerCase())
      );

    return matchesStatus && matchesScope && matchesPartner;
  });
}

export function buildPartnerSummary(partners: Partner[]) {
  const total = partners.length;
  const active = partners.filter((partner) => partner.status === "Active").length;
  const flagged = partners.filter((partner) => partner.status === "Flagged").length;
  const multiProduct = partners.filter((partner) => partner.products.length >= 2).length;
  const totalRevenue = partners.reduce((sum, partner) => sum + partner.revenue, 0);

  return { total, active, flagged, multiProduct, totalRevenue };
}

export function buildCampaignSummary(campaigns: Campaign[]) {
  const live = campaigns.filter((campaign) => campaign.status === "Live").length;
  const totalEngaged = campaigns.reduce((sum, campaign) => sum + campaign.engaged, 0);
  const totalNewIds = campaigns.reduce((sum, campaign) => sum + campaign.newIds, 0);
  const totalCost = campaigns.reduce((sum, campaign) => sum + campaign.cost, 0);
  const avgCpa = totalEngaged > 0 ? totalCost / totalEngaged : 0;

  return { live, totalEngaged, totalNewIds, totalCost, avgCpa };
}

export function getOverviewTopPartners(): Partner[] {
  return [...PARTNERS]
    .sort((left, right) => right.users1st - left.users1st)
    .slice(0, 5);
}

export function getActiveCampaigns(): Campaign[] {
  return CAMPAIGNS.filter((campaign) => campaign.status === "Live").slice(0, 6);
}

export function getRevenueLeaders(): Partner[] {
  return [...PARTNERS]
    .filter((partner) => partner.revenue > 0)
    .sort((left, right) => right.revenue - left.revenue);
}

export function getPartnerByName(name: string): Partner | undefined {
  return PARTNERS.find((partner) => partner.name === name);
}

export function getProductBadges(products: ProductCode[]): string[] {
  return products.map((product) => PRODUCT_LABELS[product]);
}
