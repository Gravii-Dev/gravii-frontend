"use client";

import ActionButton from "@/components/ui/action-button";
import { SharedTagChip } from "@/components/ui/launch-primitives";
import type { CampaignWithPartner } from "@/features/launch-app/types";

import styles from "./campaign-card.module.css";

type CampaignCardTone = "benefits" | "almostThere" | "inviteOnly";

type CampaignCardProps = {
  campaign: CampaignWithPartner;
  dark: boolean;
  isExpanded: boolean;
  isOptedIn: boolean;
  tone?: CampaignCardTone;
  onToggle: () => void;
  onOptIn: () => void;
  onNavigate?: (id: "discovery") => void;
};

function campaignStatusClass(item: CampaignWithPartner) {
  if (item.eligible === true) return styles.statusEligible;
  if (item.eligible === false) return styles.statusAlmostThere;
  if (item.eligible === "ineligible") return styles.statusIneligible;
  if (item.eligible === null) return styles.statusUpcoming;
  if (item.partnerStatus === "INVITE ONLY") return styles.statusInviteOnly;
  return styles.statusNeutral;
}

function campaignStatusLabel(item: CampaignWithPartner) {
  if (item.eligible === true) return "ELIGIBLE";
  if (item.eligible === "ineligible") return "INELIGIBLE";
  if (item.eligible === null) return "UPCOMING";
  if (item.partnerStatus === "INVITE ONLY") return "INVITE ONLY";
  return "REACH TO UNLOCK";
}

function toneClass(tone: CampaignCardTone) {
  if (tone === "inviteOnly") return styles.opacityInviteOnly;
  if (tone === "almostThere") return styles.opacityAlmostThere;
  return styles.opacityDefault;
}

export default function CampaignCard({
  campaign,
  dark,
  isExpanded,
  isOptedIn,
  tone = "benefits",
  onToggle,
  onOptIn,
  onNavigate,
}: CampaignCardProps) {
  return (
    <article className={`${styles.card} ${dark ? styles.cardDark : styles.cardLight} ${isExpanded ? styles.cardOpen : ""} ${toneClass(tone)}`}>
      <button type="button" className={styles.toggleButton} onClick={onToggle} aria-expanded={isExpanded}>
        <div className={styles.header}>
          <div>
            <span className={styles.title}>{campaign.name}</span>
            <span className={styles.partner}>{campaign.partner}</span>
          </div>
          <span className={`${styles.statusLabel} ${campaignStatusClass(campaign)}`}>{campaignStatusLabel(campaign)}</span>
        </div>

        <div className={styles.metaRow}>
          {campaign.type ? <span className={styles.typeBadge}>{campaign.type}</span> : null}
          <span className={styles.categoryMeta}>{campaign.category}</span>
        </div>

        <div className={styles.metaRow}>
          {campaign.chains?.[0] !== "All" ? <span className={styles.chainBadge}>{campaign.chains.join(" · ")}</span> : <span className={styles.chainBadgeAll}>All Chains</span>}
          <span className={styles.periodMeta}>{campaign.period}</span>
        </div>

        <div className={styles.tagsRow}>
          {(campaign.tags || []).map((tag, index) => (
            <SharedTagChip key={`${campaign.name}-${index}`} tag={tag} />
          ))}
        </div>

        <div className={styles.toggleRow}>
          <span className={`${styles.toggleLabel} ${isExpanded ? styles.toggleLabelOpen : ""}`}>{isExpanded ? "▲ Close" : "▼ View details →"}</span>
        </div>
      </button>

      {isExpanded ? (
        <div className={styles.expanded}>
          <p className={styles.description}>{campaign.desc}</p>

          <div className={styles.actionRow}>
            {campaign.eligible === true ? (
              <ActionButton
                size="panel"
                className={`${styles.actionButton} ${isOptedIn ? styles.actionOptedIn : styles.actionOptIn}`}
                onClick={onOptIn}
              >
                {isOptedIn ? "OPTED IN ✓" : "OPT IN →"}
              </ActionButton>
            ) : null}

            {campaign.eligible === false && campaign.partnerStatus === "INVITE ONLY" ? (
              <ActionButton size="panel" className={`${styles.actionButton} ${styles.actionInviteOnly}`}>
                INVITE ONLY — REQUEST ACCESS
              </ActionButton>
            ) : null}

            {campaign.eligible === false && campaign.partnerStatus !== "INVITE ONLY" ? (
              <ActionButton size="panel" className={`${styles.actionButton} ${styles.actionQualify}`} onClick={() => onNavigate?.("discovery")}>
                HOW TO QUALIFY →
              </ActionButton>
            ) : null}

            {campaign.eligible === null ? (
              <ActionButton size="panel" className={`${styles.actionButton} ${styles.actionNotify}`}>
                NOTIFY ME WHEN LIVE
              </ActionButton>
            ) : null}
          </div>
        </div>
      ) : null}
    </article>
  );
}
