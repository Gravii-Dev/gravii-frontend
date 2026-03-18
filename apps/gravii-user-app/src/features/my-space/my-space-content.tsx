"use client";

import { useMemo } from "react";

import { launchMockRepository } from "@/features/launch-app/mock-repository";
import type { SharedContentProps } from "@/features/launch-app/types";
import CampaignCard from "@/features/my-space/components/campaign-card";
import { getCampaignCardKey, getMySpaceCampaignCollections } from "@/features/my-space/my-space-view-model";
import { type MySpaceSectionKey, useMySpaceState } from "@/features/my-space/use-my-space-state";

import styles from "./my-space-content.module.css";

const SECTION_TONE_CLASS: Record<MySpaceSectionKey, string> = {
  benefits: styles.sectionToneBenefits,
  almostThere: styles.sectionToneAlmostThere,
  inviteOnly: styles.sectionToneInviteOnly,
};

export default function MySpaceContent({ dark, connected, onConnect, onNavigate }: SharedContentProps) {
  const categories = launchMockRepository.getBenefitCategories();
  const mySpace = useMySpaceState();

  const collections = useMemo(() => getMySpaceCampaignCollections(mySpace.activeCategory), [mySpace.activeCategory]);

  const sections = [
    { key: "benefits" as const, label: "YOUR BENEFITS", count: collections.eligible.length, items: collections.eligible, empty: "No eligible benefits in this category." },
    { key: "almostThere" as const, label: "ALMOST THERE", count: collections.almostThere.length, items: collections.almostThere, empty: "No campaigns to unlock in this category." },
    { key: "inviteOnly" as const, label: "INVITE ONLY", count: collections.inviteOnly.length, items: collections.inviteOnly, empty: "No invite-only campaigns in this category." },
  ];

  return (
    <div className={`${styles.root} ${dark ? styles.rootDark : styles.rootLight}`}>
      <p className={styles.lead}>A curation service that finds you first.</p>
      <p className={styles.copy}>Gravii&apos;s engine analyzes your preferences to intuitively place only the most essential benefits here.</p>

      {connected ? (
        <p className={styles.summary}>
          <span className={styles.summaryEligible}>{collections.eligible.length}</span> benefits available ·{" "}
          <span className={styles.summaryAlmost}>{collections.almostThere.length}</span> almost there
          {collections.inviteOnly.length > 0 ? (
            <>
              {" "}
              · <span className={styles.summaryInviteOnly}>{collections.inviteOnly.length}</span> invite only
            </>
          ) : null}
        </p>
      ) : null}

      <div className={styles.categoryRow}>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`${styles.categoryChip} ${mySpace.activeCategory === category ? styles.categoryChipActive : ""}`}
            onClick={() => mySpace.setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className={styles.contentWindow}>
        <div className={`${styles.contentState} ${connected ? "" : styles.contentStateLocked}`.trim()}>
          {sections.map((section, sectionIndex) => (
            <section key={section.key} className={styles.section}>
              <button
                type="button"
                className={styles.sectionHeader}
                onClick={() => mySpace.toggleSection(section.key)}
              >
                <span className={`${styles.sectionTitle} ${SECTION_TONE_CLASS[section.key]}`}>
                  {section.label} ({section.count})
                </span>
                <span className={styles.sectionChevron}>{mySpace.openSections[section.key] ? "▲" : "▼"}</span>
              </button>

              {mySpace.openSections[section.key] ? (
                section.items.length === 0 ? (
                  <p className={styles.emptyState}>{section.empty}</p>
                ) : (
                  <div className={styles.sectionGrid}>
                    {section.items.map((campaign) => {
                      const cardKey = getCampaignCardKey(campaign);

                      return (
                      <CampaignCard
                        key={`${campaign.name}-${campaign.partner}`}
                        campaign={campaign}
                        dark={dark}
                        isExpanded={mySpace.expandedCardKey === cardKey}
                        isOptedIn={Boolean(mySpace.optedIn[cardKey])}
                        tone={section.key}
                        onToggle={() => mySpace.toggleCard(cardKey)}
                        onOptIn={() => mySpace.markOptedIn(cardKey)}
                        onNavigate={(id) => onNavigate?.(id)}
                      />
                      );
                    })}
                  </div>
                )
              ) : null}

              {sectionIndex < sections.length - 1 ? <div className={styles.sectionDivider} /> : null}
            </section>
          ))}

          {connected ? (
            <button type="button" className={styles.exploreButton} onClick={() => onNavigate?.("discovery")}>
              EXPLORE ALL CAMPAIGNS IN DISCOVERY →
            </button>
          ) : null}
        </div>

        {!connected ? (
          <div className={styles.lockedOverlay}>
            <div className={styles.lockedCard}>
              <p className={styles.lockedTitle}>GET YOUR GRAVII ID</p>
              <p className={styles.lockedCopy}>Unlock benefits curated just for you.</p>
              <p className={styles.lockedHint}>Complimentary — no strings.</p>
              <div className={styles.lockedActions}>
                <button type="button" className={styles.lockedPrimary} onClick={() => onNavigate?.("profile")}>
                  Reveal My Profile
                </button>
                <button type="button" className={styles.lockedSecondary} onClick={onConnect}>
                  Connect Wallet
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
