"use client";

import { useEffect, useMemo, useState } from "react";

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
import {
  readDiscoveryCatalog,
  UserApiError,
} from "@/lib/auth/user-api";

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

type DiscoveryCatalogStatus = "error" | "loading" | "ready" | "unavailable";

type DiscoveryCatalogState = {
  message?: string;
  partners: Partner[];
  status: DiscoveryCatalogStatus;
};

const emptyCatalogState: DiscoveryCatalogState = {
  partners: [],
  status: "loading",
};

function getCatalogStatusCopy(state: DiscoveryCatalogState) {
  if (state.status === "loading") {
    return "Loading live campaign catalog";
  }

  if (state.status === "ready") {
    return `${state.partners.length} partners from live API`;
  }

  if (state.status === "error") {
    return "Campaign API request failed";
  }

  return "Campaign API contract ready";
}

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
  const [catalogState, setCatalogState] = useState<DiscoveryCatalogState>(emptyCatalogState);
  const partnersData = catalogState.partners;

  useEffect(() => {
    const controller = new AbortController();

    readDiscoveryCatalog({ signal: controller.signal })
      .then((catalog) => {
        setCatalogState({
          partners: catalog.partners,
          status: "ready",
        });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        if (error instanceof UserApiError && (error.status === 404 || error.status === 501)) {
          setCatalogState({
            message: "Partner and campaign cards will render here when the Discovery API is enabled.",
            partners: [],
            status: "unavailable",
          });
          return;
        }

        setCatalogState({
          message:
            error instanceof Error
              ? error.message
              : "Unable to load the Discovery catalog.",
          partners: [],
          status: "error",
        });
      });

    return () => {
      controller.abort();
    };
  }, []);

  const filteredPartners = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return partnersData.filter((partner) => {
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
  }, [activeCategory, activeStatus, partnersData, searchQuery]);

  const selectedPartner = useMemo(
    () => partnersData.find((partner) => partner.id === selectedPartnerId) ?? null,
    [partnersData, selectedPartnerId]
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
        <div>
          <span className={styles.eyebrow}>Campaign discovery</span>
          <h2>Discover the full spectrum of benefits.</h2>
          <p>
            Browse partner campaigns, claim available benefits, or see the exact
            identity requirements needed to unlock exclusive privileges.
          </p>
        </div>
        <span
          className={styles.apiStatus}
          data-state={catalogState.status}
        >
          {getCatalogStatusCopy(catalogState)}
        </span>
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
            placeholder="Search partners or campaigns…"
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
              {partnersData.reduce((total, partner) => total + partner.campaigns.length, 0)} campaigns indexed
            </span>
          </div>

          <div className={styles.resultsGrid}>
            {catalogState.status === "loading" ? (
              <div className={styles.emptyState} data-state="loading">
                <strong>Loading campaign catalog.</strong>
                <span>Discovery will populate partner cards from the live API.</span>
              </div>
            ) : null}

            {catalogState.status !== "loading" && filteredPartners.length === 0 ? (
              <div className={styles.emptyState}>
                <strong>
                  {catalogState.status === "error"
                    ? "Campaign catalog could not load."
                    : "Campaign catalog is ready for live data."}
                </strong>
                <span>
                  {catalogState.message ??
                    "Partner and campaign cards will render here when the backend catalog is connected."}
                </span>
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
