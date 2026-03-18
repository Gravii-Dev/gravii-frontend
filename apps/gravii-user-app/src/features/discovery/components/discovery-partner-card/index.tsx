"use client";

import { SharedTagChip } from "@/components/ui/launch-primitives";
import { getRepresentativeTags } from "@/features/discovery/discovery-view-model";
import type { Partner } from "@/features/launch-app/types";

import styles from "./discovery-partner-card.module.css";

type DiscoveryPartnerCardProps = {
  partner: Partner;
  onOpen: (partnerId: string) => void;
};

function statusClass(status: Partner["status"]) {
  if (status === "ELIGIBLE") return styles.statusEligible;
  if (status === "REACH TO UNLOCK") return styles.statusAlmostThere;
  if (status === "COMING SOON") return styles.statusUpcoming;
  if (status === "INVITE ONLY") return styles.statusInviteOnly;
  return styles.statusIneligible;
}

export default function DiscoveryPartnerCard({ partner, onOpen }: DiscoveryPartnerCardProps) {
  const representativeTags = getRepresentativeTags(partner);

  return (
    <button type="button" className={styles.card} aria-label={`Open ${partner.name}`} onClick={() => onOpen(partner.id)}>
      <div className={styles.header}>
        <div>
          <span className={styles.name}>{partner.name}</span>
          <span className={styles.subline}>
            {partner.campaigns.length} campaign{partner.campaigns.length > 1 ? "s" : ""}
          </span>
        </div>
        <span className={`${styles.status} ${statusClass(partner.status)}`}>{partner.status}</span>
      </div>

      <div className={styles.metaRow}>
        {partner.campaigns.slice(0, 3).map((campaign) => (
          <span key={`${partner.id}-${campaign.name}`} className={styles.metaChip}>
            {campaign.category}
          </span>
        ))}
      </div>

      <div className={styles.footer}>
        <div className={styles.tagRow}>
          {representativeTags.shown.map((tag, index) => (
            <SharedTagChip key={`${partner.id}-${index}`} tag={tag} />
          ))}
          {representativeTags.extra > 0 ? <span className={styles.count}>+{representativeTags.extra} more</span> : null}
        </div>

        <span className={styles.cta}>View details →</span>
      </div>
    </button>
  );
}
