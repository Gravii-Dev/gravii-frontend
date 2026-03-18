"use client";

import { useState } from "react";

import { SharedTagChip } from "@/components/ui/launch-primitives";
import type { Partner, SharedContentProps } from "@/features/launch-app/types";

import styles from "./discovery-partner-detail.module.css";

type DiscoveryPartnerDetailProps = Pick<SharedContentProps, "connected" | "onConnect" | "onNavigate"> & {
  partner: Partner;
  onBack: () => void;
};

function campaignStatusClass(status: Partner["status"], eligible: Partner["eligible"]) {
  if (eligible === true) return styles.statusEligible;
  if (eligible === "ineligible") return styles.statusIneligible;
  if (eligible === null) return styles.statusUpcoming;
  if (status === "INVITE ONLY") return styles.statusInviteOnly;
  return styles.statusAlmostThere;
}

function campaignStatusLabel(status: Partner["status"], eligible: Partner["eligible"]) {
  if (eligible === true) return "ELIGIBLE";
  if (eligible === "ineligible") return "INELIGIBLE";
  if (eligible === null) return "UPCOMING";
  if (status === "INVITE ONLY") return "INVITE ONLY";
  return "REACH TO UNLOCK";
}

export default function DiscoveryPartnerDetail({
  partner,
  connected,
  onConnect,
  onNavigate,
  onBack,
}: DiscoveryPartnerDetailProps) {
  const [openCampaign, setOpenCampaign] = useState<string | null>(partner.campaigns[0]?.name ?? null);
  const [qualifyGuide, setQualifyGuide] = useState<string | null>(null);

  return (
    <div className={styles.root}>
      <button type="button" className={styles.backButton} aria-label="Back to Discovery" onClick={onBack}>
        ← Back to Discovery
      </button>

      <span className={styles.eyebrow}>CAMPAIGNS ({partner.campaigns.length})</span>

      <h2 className={styles.title}>{partner.name}</h2>

      <div className={styles.campaignList}>
        {partner.campaigns.map((campaign) => {
          const isOpen = openCampaign === campaign.name;
          const statusLabel = campaignStatusLabel(partner.status, campaign.eligible);

          return (
            <article key={campaign.name} className={styles.campaignCard}>
              <button
                type="button"
                className={styles.campaignHeader}
                onClick={() => {
                  setOpenCampaign((current) => (current === campaign.name ? null : campaign.name));
                  setQualifyGuide(null);
                }}
              >
                <div>
                  <span className={styles.campaignName}>{campaign.name}</span>
                  <div className={styles.campaignMeta}>
                    <span className={styles.hint}>{campaign.type}</span>
                    <span className={styles.hint}>{campaign.category}</span>
                    <span className={styles.hint}>{campaign.period}</span>
                  </div>
                </div>

                <span className={`${styles.campaignStatus} ${campaignStatusClass(partner.status, campaign.eligible)}`}>{statusLabel}</span>
              </button>

              {isOpen ? (
                <div className={styles.campaignBody}>
                  <p className={styles.campaignDesc}>{campaign.desc}</p>

                  <div className={styles.tagRow}>
                    {(campaign.tags || []).map((tag, index) => (
                      <SharedTagChip key={`${campaign.name}-${index}`} tag={tag} />
                    ))}
                  </div>

                  <div className={styles.actionRow}>
                    {campaign.eligible === true ? (
                      <button type="button" className={`${styles.actionButton} ${styles.primaryAction}`}>
                        {connected ? "OPT IN →" : "CONNECT TO OPT IN"}
                      </button>
                    ) : null}

                    {campaign.eligible === false && partner.status !== "INVITE ONLY" ? (
                      <button
                        type="button"
                        className={`${styles.actionButton} ${styles.warningAction}`}
                        onClick={() => setQualifyGuide((current) => (current === campaign.name ? null : campaign.name))}
                      >
                        {qualifyGuide === campaign.name ? "HIDE GUIDE" : "HOW TO QUALIFY"}
                      </button>
                    ) : null}

                    {campaign.eligible === false && partner.status === "INVITE ONLY" ? (
                      <button type="button" className={styles.actionButton} onClick={() => onNavigate?.("leaderboard")}>
                        REQUEST ACCESS
                      </button>
                    ) : null}

                    {campaign.eligible === null ? (
                      <button type="button" className={styles.actionButton} onClick={onConnect}>
                        NOTIFY ME
                      </button>
                    ) : null}

                    {!connected ? (
                      <button type="button" className={styles.actionButton} onClick={onConnect}>
                        Connect Wallet
                      </button>
                    ) : null}
                  </div>

                  {qualifyGuide === campaign.name && campaign.qualifySteps ? (
                    <ol className={styles.qualifyList}>
                      {campaign.qualifySteps.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  ) : null}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
