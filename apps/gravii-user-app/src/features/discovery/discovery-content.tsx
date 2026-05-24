"use client";

import { useMemo, useState } from "react";

import ActionButton from "@/components/ui/action-button";
import type {
  Campaign,
  CampaignEligibility,
  CampaignTag,
  PanelId,
  Partner,
  PartnerStatus,
  SharedContentProps,
  VerifyState,
} from "@/features/launch-app/types";

import styles from "./discovery-content.module.css";

const BENEFIT_CATEGORIES = [
  "All",
  "General",
  "Wealth & Finance",
  "Lifestyle & Retail",
  "Exclusive Privileges",
  "Hidden Gems",
] as const;

const STATUS_FILTERS = [
  "All",
  "Eligible",
  "Reach to Unlock",
  "Upcoming",
  "Invite Only",
] as const;

const PARTNERS_DATA: Partner[] = [
  {
    campaigns: [
      {
        category: "Wealth & Finance",
        chains: ["ETH", "Base"],
        desc: "Prestige rewards for verified value. Platinum profile holders can opt in with one action.",
        eligible: true,
        name: "Yield Booster",
        period: "Jan 30 - Mar 1, 2026",
        tags: [
          { persona: "Smart Saver", type: "verified" },
          { persona: "Profit Hunter", type: "verified" },
          { tier: "Platinum+", type: "tier" },
        ],
        type: "Yield Boost",
      },
      {
        category: "Exclusive Privileges",
        chains: ["ETH"],
        desc: "Exclusive allocation round for Black-tier members with long-term holder behavior.",
        eligible: false,
        name: "ICO Allocation",
        period: "Jan 30 - Mar 1, 2026",
        qualifySteps: [
          "Maintain core assets long enough to build the Strategic Holder signal.",
          "Reach the Black membership tier.",
          "Hold tier status for at least 7 consecutive days.",
        ],
        tags: [
          { persona: "Strategic Holder", type: "requires" },
          { tier: "Black", type: "tier" },
        ],
        type: "Early Access",
      },
    ],
    delay: "0.04s",
    eligible: true,
    id: "alpha",
    name: "Partner Alpha",
    status: "ELIGIBLE",
  },
  {
    campaigns: [
      {
        category: "Wealth & Finance",
        chains: ["ETH", "BSC", "Base"],
        desc: "Requires the Wealth Guard persona. Maintain meaningful stable reserves to qualify.",
        eligible: false,
        name: "Premium Lending Drop",
        period: "Feb 15 - Apr 30, 2026",
        qualifySteps: [
          "Maintain $50,000+ in stable reserves across supported chains.",
          "Hold stablecoins for 30+ consecutive days.",
          "Reach Gold tier or above on your Gravii ID.",
        ],
        tags: [
          { persona: "Wealth Guard", type: "requires" },
          { persona: "Cash Manager", type: "requires" },
          { tier: "Gold+", type: "tier" },
        ],
        type: "Cashback",
      },
    ],
    delay: "0.08s",
    eligible: false,
    id: "beta",
    name: "Partner Beta",
    status: "REACH TO UNLOCK",
  },
  {
    campaigns: [
      {
        category: "Lifestyle & Retail",
        chains: ["All"],
        desc: "Details will be revealed when the campaign goes live.",
        eligible: null,
        name: "Lifestyle Rewards",
        period: "Opens Mar 15, 2026",
        tags: [{ tier: "All Tiers", type: "open" }],
        type: "Loyalty Reward",
      },
    ],
    delay: "0.12s",
    eligible: null,
    id: "gamma",
    name: "Partner Gamma",
    status: "COMING SOON",
  },
  {
    campaigns: [
      {
        category: "Exclusive Privileges",
        chains: ["ETH"],
        desc: "Reserved for users with strong NFT Collector behavior. Invitations are issued from collection activity.",
        eligible: false,
        name: "Collector's Access",
        period: "Ongoing",
        qualifySteps: [
          "Build the NFT Collector persona through sustained collecting activity.",
          "Reach Gold tier or above.",
          "Maintain active collection behavior for 14+ days.",
        ],
        tags: [
          { persona: "NFT Collector", type: "targeting" },
          { tier: "Gold+", type: "tier" },
        ],
        type: "Early Access",
      },
      {
        category: "Hidden Gems",
        chains: ["ETH", "Base"],
        desc: "Priority minting access for upcoming partner drops.",
        eligible: false,
        name: "Early Mint Pass",
        period: "Apr 1 - Apr 30, 2026",
        qualifySteps: [
          "Achieve the NFT Collector persona.",
          "Any membership tier qualifies once the persona is verified.",
        ],
        tags: [
          { persona: "NFT Collector", type: "verified" },
          { tier: "All Tiers", type: "open" },
        ],
        type: "Airdrop",
      },
    ],
    delay: "0.16s",
    eligible: false,
    id: "delta",
    name: "Partner Delta",
    status: "INVITE ONLY",
  },
  {
    campaigns: [
      {
        category: "Wealth & Finance",
        chains: ["ETH", "BSC", "ARB"],
        desc: "Earn back a percentage of trading fees based on monthly volume. Active Traders get priority access.",
        eligible: true,
        name: "Trading Fee Rebate",
        period: "Feb 1 - May 31, 2026",
        tags: [
          { persona: "Active Trader", type: "verified" },
          { persona: "Swing Trader", type: "verified" },
          { tier: "Classic+", type: "tier" },
        ],
        type: "Fee Discount",
      },
      {
        category: "Exclusive Privileges",
        chains: ["All"],
        desc: "Direct access to a dedicated desk with premium execution and priority support.",
        eligible: true,
        name: "VIP Desk Access",
        period: "Ongoing",
        tags: [
          { persona: "Active Trader", type: "verified" },
          { tier: "Platinum+", type: "tier" },
        ],
        type: "Early Access",
      },
    ],
    delay: "0.2s",
    eligible: true,
    id: "epsilon",
    name: "Partner Epsilon",
    status: "ELIGIBLE",
  },
  {
    campaigns: [
      {
        category: "General",
        chains: ["All"],
        desc: "A token distribution for active Gravii members. No strings attached - just show up.",
        eligible: true,
        name: "Community Airdrop",
        period: "Mar 1 - Mar 31, 2026",
        tags: [{ tier: "All Tiers", type: "open" }],
        type: "Airdrop",
      },
    ],
    delay: "0.24s",
    eligible: true,
    id: "zeta",
    name: "Partner Zeta",
    status: "ELIGIBLE",
  },
  {
    campaigns: [
      {
        category: "Wealth & Finance",
        chains: ["ETH"],
        desc: "Early-stage allocation reserved for Major Investor and Wealth Guard signals.",
        eligible: false,
        name: "Private Round Access",
        period: "Apr 1 - Jun 30, 2026",
        qualifySteps: [
          "Commit capital to high-cap assets to build market trust.",
          "Maintain Wealth Guard-level stable reserves.",
          "Achieve Black membership tier.",
        ],
        tags: [
          { persona: "Major Investor", type: "requires" },
          { persona: "Wealth Guard", type: "requires" },
          { tier: "Black", type: "tier" },
        ],
        type: "Early Access",
      },
      {
        category: "Lifestyle & Retail",
        chains: ["All"],
        desc: "Premium hospitality experiences for members with investor-grade behavior.",
        eligible: false,
        name: "Luxury Travel Package",
        period: "May 1 - Jul 31, 2026",
        qualifySteps: [
          "Achieve the Major Investor persona.",
          "Reach Platinum tier or above.",
          "Maintain tier for at least 14 days.",
        ],
        tags: [
          { persona: "Major Investor", type: "requires" },
          { tier: "Platinum+", type: "tier" },
        ],
        type: "Loyalty Reward",
      },
    ],
    delay: "0.28s",
    eligible: false,
    id: "eta",
    name: "Partner Eta",
    status: "REACH TO UNLOCK",
  },
  {
    campaigns: [
      {
        category: "Hidden Gems",
        chains: ["ETH", "Base", "ARB"],
        desc: "Strictly limited to exact persona and tier requirements. No alternate path is available.",
        eligible: "ineligible",
        name: "Growth Accelerator",
        period: "Apr 15 - May 31, 2026",
        tags: [
          { persona: "Rising Star", type: "targeting" },
          { persona: "New Voyager", type: "targeting" },
          { tier: "Classic+", type: "tier" },
        ],
        type: "Referral Bonus",
      },
    ],
    delay: "0.32s",
    eligible: "ineligible",
    id: "theta",
    name: "Partner Theta",
    status: "INELIGIBLE",
  },
];

function statusLabel(eligible: CampaignEligibility, partnerStatus: PartnerStatus) {
  if (eligible === true) {
    return "ELIGIBLE";
  }

  if (eligible === false && partnerStatus === "INVITE ONLY") {
    return "INVITE ONLY";
  }

  if (eligible === false) {
    return "REACH TO UNLOCK";
  }

  if (eligible === "ineligible") {
    return "INELIGIBLE";
  }

  return "UPCOMING";
}

function statusClassName(status: PartnerStatus | ReturnType<typeof statusLabel>) {
  if (status === "ELIGIBLE") {
    return styles.statusEligible;
  }

  if (status === "REACH TO UNLOCK") {
    return styles.statusUnlock;
  }

  if (status === "INVITE ONLY") {
    return styles.statusInvite;
  }

  if (status === "INELIGIBLE") {
    return styles.statusIneligible;
  }

  return styles.statusUpcoming;
}

function tagClassName(tag: CampaignTag) {
  if (tag.type === "verified") {
    return styles.tagVerified;
  }

  if (tag.type === "requires") {
    return styles.tagRequires;
  }

  if (tag.type === "tier" || tag.type === "open") {
    return styles.tagTier;
  }

  return styles.tagTargeting;
}

function TagChip({ tag }: { tag: CampaignTag }) {
  const label = tag.persona ?? tag.tier ?? "Unknown";

  return (
    <span className={`${styles.tagChip} ${tagClassName(tag)}`}>
      {tag.type === "verified" ? "✓ " : null}
      {label}
    </span>
  );
}

function campaignMatchesStatus(campaign: Campaign, partnerStatus: PartnerStatus, status: string) {
  if (status === "All") {
    return true;
  }

  return statusLabel(campaign.eligible, partnerStatus) === status.toUpperCase();
}

function getRepresentativeTags(partner: Partner) {
  const allTags = partner.campaigns.flatMap((campaign) => campaign.tags ?? []);
  const personaTags = allTags.filter((tag) => tag.persona);
  const tierTag = allTags.find((tag) => tag.tier && tag.type !== "open");
  const unique: CampaignTag[] = [];
  const seen = new Set<string>();

  for (const tag of personaTags) {
    if (tag.persona && !seen.has(tag.persona)) {
      seen.add(tag.persona);
      unique.push(tag);
    }

    if (unique.length >= 2) {
      break;
    }
  }

  if (tierTag) {
    unique.push(tierTag);
  }

  return {
    extra: Math.max(0, seen.size - 2),
    shown: unique,
  };
}

function getPartnerInitial(partnerName: string) {
  return partnerName.replace("Partner ", "").charAt(0).toUpperCase();
}

export default function DiscoveryContent({
  connected,
  onConnect,
  onNavigate,
}: SharedContentProps) {
  const [activeCategory, setActiveCategory] = useState<(typeof BENEFIT_CATEGORIES)[number]>("All");
  const [activeStatus, setActiveStatus] = useState<(typeof STATUS_FILTERS)[number]>("All");
  const [expandedCampaign, setExpandedCampaign] = useState<number | null>(null);
  const [guideCampaign, setGuideCampaign] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [verifyState, setVerifyState] = useState<VerifyState>(null);

  const filteredPartners = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return PARTNERS_DATA.filter((partner) => {
      if (
        normalizedSearch &&
        !partner.name.toLowerCase().includes(normalizedSearch) &&
        !partner.campaigns.some((campaign) =>
          campaign.name.toLowerCase().includes(normalizedSearch)
        )
      ) {
        return false;
      }

      if (
        activeCategory !== "All" &&
        !partner.campaigns.some((campaign) => campaign.category === activeCategory)
      ) {
        return false;
      }

      if (
        activeStatus !== "All" &&
        !partner.campaigns.some((campaign) =>
          campaignMatchesStatus(campaign, partner.status, activeStatus)
        )
      ) {
        return false;
      }

      return true;
    });
  }, [activeCategory, activeStatus, searchQuery]);

  const selectedPartner = useMemo(
    () => PARTNERS_DATA.find((partner) => partner.id === selectedPartnerId) ?? null,
    [selectedPartnerId]
  );

  function resetCampaignState() {
    setExpandedCampaign(null);
    setGuideCampaign(null);
    setVerifyState(null);
  }

  function navigateToPartner(partnerId: string | null) {
    setSelectedPartnerId(partnerId);
    resetCampaignState();
  }

  function openRoute(route: PanelId) {
    onNavigate?.(route);
  }

  if (selectedPartner) {
    const selectedPartnerIndex = filteredPartners.findIndex(
      (partner) => partner.id === selectedPartner.id
    );
    const previousPartner = selectedPartnerIndex > 0 ? filteredPartners[selectedPartnerIndex - 1] : null;
    const nextPartner =
      selectedPartnerIndex >= 0 && selectedPartnerIndex < filteredPartners.length - 1
        ? filteredPartners[selectedPartnerIndex + 1]
        : null;

    return (
      <div className={styles.root}>
        <button
          className={styles.backButton}
          type="button"
          onClick={() => navigateToPartner(null)}
        >
          ← BACK TO DISCOVERY
        </button>

        <section className={styles.partnerHero}>
          <div>
            <span className={styles.eyebrow}>Partner detail</span>
            <h2>{selectedPartner.name}</h2>
          </div>
          <span className={`${styles.statusPill} ${statusClassName(selectedPartner.status)}`}>
            {selectedPartner.status}
          </span>
        </section>

        <div className={styles.campaignHeader}>
          <span>CAMPAIGNS ({selectedPartner.campaigns.length})</span>
          <span>{activeCategory} / {activeStatus}</span>
        </div>

        <div className={styles.campaignList}>
          {selectedPartner.campaigns.map((campaign, index) => {
            const isOpen = expandedCampaign === index;
            const isGuideOpen = guideCampaign === index;
            const campaignStatus = statusLabel(campaign.eligible, selectedPartner.status);

            return (
              <article className={styles.campaignCard} key={campaign.name} data-open={isOpen}>
                <button
                  type="button"
                  className={styles.campaignToggle}
                  onClick={() => {
                    setExpandedCampaign(isOpen ? null : index);
                    setGuideCampaign(null);
                    setVerifyState(null);
                  }}
                >
                  <span className={styles.campaignTitle}>{campaign.name}</span>
                  <span className={`${styles.statusText} ${statusClassName(campaignStatus)}`}>
                    {campaignStatus}
                  </span>
                </button>

                <div className={styles.campaignMeta}>
                  <span className={styles.typeChip}>{campaign.type}</span>
                  <span>{campaign.category}</span>
                  <span>{campaign.chains[0] === "All" ? "All chains" : campaign.chains.join(" · ")}</span>
                  <span>{campaign.period}</span>
                </div>

                <div className={styles.tagRow}>
                  {(campaign.tags ?? []).map((tag) => (
                    <TagChip key={`${campaign.name}-${tag.persona ?? tag.tier}`} tag={tag} />
                  ))}
                </div>

                <button
                  className={styles.detailsButton}
                  type="button"
                  onClick={() => {
                    setExpandedCampaign(isOpen ? null : index);
                    setGuideCampaign(null);
                    setVerifyState(null);
                  }}
                >
                  {isOpen ? "CLOSE ▲" : "VIEW DETAILS →"}
                </button>

                {isOpen ? (
                  <div className={styles.campaignExpanded}>
                    <p>{campaign.desc}</p>

                    {campaign.eligible === true ? (
                      <ActionButton size="panel" className={styles.successAction}>
                        OPT IN →
                      </ActionButton>
                    ) : null}

                    {campaign.eligible === false && selectedPartner.status === "INVITE ONLY" ? (
                      <ActionButton size="panel" className={styles.inviteAction}>
                        INVITE ONLY — REQUEST ACCESS
                      </ActionButton>
                    ) : null}

                    {campaign.eligible === false && selectedPartner.status !== "INVITE ONLY" ? (
                      <div className={styles.qualifyBlock}>
                        <ActionButton
                          size="panel"
                          className={styles.qualifyAction}
                          onClick={() => {
                            setGuideCampaign(isGuideOpen ? null : index);
                            setVerifyState(null);
                          }}
                        >
                          {isGuideOpen ? "CLOSE GUIDE ▲" : "HOW TO QUALIFY →"}
                        </ActionButton>

                        {isGuideOpen ? (
                          <div className={styles.guidePanel}>
                            <div className={styles.statusGrid}>
                              <div>
                                <span>Current Persona</span>
                                <strong>Smart Saver</strong>
                              </div>
                              <div>
                                <span>Current Tier</span>
                                <strong>Platinum</strong>
                              </div>
                            </div>

                            <span className={styles.guideLabel}>REQUIRED</span>
                            <div className={styles.tagRow}>
                              {(campaign.tags ?? []).map((tag) => (
                                <TagChip key={`required-${campaign.name}-${tag.persona ?? tag.tier}`} tag={tag} />
                              ))}
                            </div>

                            <span className={styles.guideLabel}>HOW TO GET THERE</span>
                            <ol className={styles.stepList}>
                              {(campaign.qualifySteps ?? ["Build the required persona signal.", "Return to verify eligibility."]).map(
                                (step) => (
                                  <li key={step}>{step}</li>
                                )
                              )}
                            </ol>

                            <ActionButton
                              size="panel"
                              className={styles.verifyAction}
                              onClick={() => {
                                if (verifyState === "loading") {
                                  return;
                                }

                                setVerifyState("loading");
                                window.setTimeout(() => setVerifyState("failed"), 900);
                              }}
                            >
                              {verifyState === "loading"
                                ? "VERIFYING..."
                                : verifyState === "failed"
                                  ? "NOT YET — KEEP GOING"
                                  : "VERIFY MY ELIGIBILITY"}
                            </ActionButton>

                            <div className={styles.crossActions}>
                              <button type="button" onClick={() => openRoute("profile")}>
                                VIEW YOUR GRAVII ID →
                              </button>
                              <button type="button" onClick={() => openRoute("leaderboard")}>
                                BOOST RANKING →
                              </button>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    {campaign.eligible === null ? (
                      <ActionButton size="panel" className={styles.mutedAction}>
                        NOTIFY ME WHEN LIVE
                      </ActionButton>
                    ) : null}

                    {campaign.eligible === "ineligible" ? (
                      <span className={styles.unavailableAction}>NOT AVAILABLE</span>
                    ) : null}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>

        <div className={styles.partnerNav}>
          {previousPartner ? (
            <button type="button" onClick={() => navigateToPartner(previousPartner.id)}>
              ← {previousPartner.name}
            </button>
          ) : (
            <span />
          )}
          <button type="button" onClick={() => navigateToPartner(null)}>
            ALL PARTNERS
          </button>
          {nextPartner ? (
            <button type="button" onClick={() => navigateToPartner(nextPartner.id)}>
              {nextPartner.name} →
            </button>
          ) : (
            <span />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <section className={styles.intro}>
        <span className={styles.eyebrow}>Campaign discovery</span>
        <h2>Discover the full spectrum of benefits.</h2>
        <p>
          Browse partner campaigns, claim available benefits, or see the exact
          identity requirements needed to unlock exclusive privileges.
        </p>
      </section>

      <section className={styles.filterBar} aria-label="Discovery filters">
        <div className={styles.filterGroup} aria-label="Category filters">
          {BENEFIT_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              className={category === activeCategory ? styles.filterActive : styles.filterButton}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className={styles.filterGroup} aria-label="Status filters">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              type="button"
              className={status === activeStatus ? styles.filterActive : styles.filterButton}
              onClick={() => setActiveStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>

        <label className={styles.searchBox}>
          <span>Search</span>
          <input
            placeholder="Search partners or campaigns..."
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </label>
      </section>

      <section className={styles.panelBody}>
        <div
          className={`${styles.resultsState} ${!connected ? styles.resultsStateLocked : ""}`}
          inert={!connected ? true : undefined}
        >
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>
              PARTNERS ({filteredPartners.length})
            </span>
            <span className={styles.summaryHint}>
              {PARTNERS_DATA.reduce((total, partner) => total + partner.campaigns.length, 0)} campaigns indexed
            </span>
          </div>

          <div className={styles.resultsGrid}>
            {filteredPartners.length === 0 ? (
              <div className={styles.emptyState}>
                <strong>No partners match your filters.</strong>
                <span>Try another category, status, or search term.</span>
              </div>
            ) : null}

            {filteredPartners.map((partner) => {
              const rep = getRepresentativeTags(partner);
              const eligibleCampaigns = partner.campaigns.filter(
                (campaign) => campaign.eligible === true
              ).length;

              return (
                <button
                  key={partner.id}
                  type="button"
                  className={styles.partnerCard}
                  style={{ animationDelay: partner.delay }}
                  onClick={() => {
                    if (connected) {
                      navigateToPartner(partner.id);
                    }
                  }}
                >
                  <span className={styles.partnerAvatar} aria-hidden="true">
                    {getPartnerInitial(partner.name)}
                  </span>
                  <span className={styles.partnerName}>{partner.name}</span>
                  <span className={`${styles.statusText} ${statusClassName(partner.status)}`}>
                    {partner.status}
                  </span>
                  <span className={styles.partnerMeta}>
                    {partner.campaigns.length} campaign{partner.campaigns.length > 1 ? "s" : ""}
                    {eligibleCampaigns > 0 && eligibleCampaigns < partner.campaigns.length
                      ? ` · ${eligibleCampaigns} eligible`
                      : ""}
                  </span>
                  <span className={styles.tagRow}>
                    {rep.shown.map((tag) => (
                      <TagChip key={`${partner.id}-${tag.persona ?? tag.tier}`} tag={tag} />
                    ))}
                    {rep.extra > 0 ? <span className={styles.extraTag}>+{rep.extra} more</span> : null}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {!connected ? (
          <div className={styles.lockedOverlay} role="region" aria-label="Discovery sign-in gate">
            <div className={styles.lockedCard}>
              <button type="button" className={styles.lockedTitle} onClick={() => openRoute("profile")}>
                GET YOUR GRAVII ID
              </button>
              <p className={styles.lockedCopy}>
                Unlock campaign matching, eligibility status, and claim context.
              </p>
              <p className={styles.lockedItalic}>Complimentary - no strings.</p>
              <ActionButton size="panel" className={styles.lockedAction} onClick={onConnect}>
                SIGN IN
              </ActionButton>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
