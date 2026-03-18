"use client";

import type { ReactNode } from "react";

import type { CampaignTag } from "@/features/launch-app/types";

import styles from "./launch-primitives.module.css";

type CardProps = {
  children: ReactNode;
  className?: string;
};

type MiniBarProps = {
  pct: number;
  tone?: "purple" | "green" | "amber";
};

function joinClasses(...classNames: Array<string | false | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

function sharedTagClass(tag: CampaignTag) {
  if (tag.type === "tier" || tag.type === "open") {
    return {
      tone: styles.tagChipTier,
      shape: styles.tagChipPill,
      icon: tag.type === "open" ? "" : "◆ ",
    };
  }

  if (tag.type === "verified") {
    return {
      tone: styles.tagChipVerified,
      shape: styles.tagChipSoft,
      icon: "✓ ",
    };
  }

  if (tag.type === "requires") {
    return {
      tone: styles.tagChipRequires,
      shape: styles.tagChipSoft,
      icon: "",
    };
  }

  return {
    tone: styles.tagChipMuted,
    shape: styles.tagChipSoft,
    icon: "",
  };
}

function miniBarToneClass(tone: MiniBarProps["tone"]) {
  if (tone === "green") return styles.miniBarSegmentGreen;
  if (tone === "amber") return styles.miniBarSegmentAmber;
  return styles.miniBarSegmentPurple;
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <span className={styles.sectionTitle}>{children}</span>;
}

export function Card({ children, className }: CardProps) {
  return <div className={joinClasses(styles.card, className)}>{children}</div>;
}

export function MiniBar({ pct, tone = "purple" }: MiniBarProps) {
  const activeCount = Math.max(0, Math.min(20, Math.round(pct / 5)));

  return (
    <div className={styles.miniBarTrack} aria-hidden="true">
      {Array.from({ length: 20 }, (_, index) => (
        <span
          key={index}
          className={joinClasses(
            styles.miniBarSegment,
            index < activeCount && styles.miniBarSegmentActive,
            index < activeCount && miniBarToneClass(tone),
          )}
        />
      ))}
    </div>
  );
}

export function SharedTagChip({ tag }: { tag: CampaignTag }) {
  const chipStyle = sharedTagClass(tag);
  const label = tag.persona || tag.tier;

  return (
    <span className={joinClasses(styles.tagChip, chipStyle.tone, chipStyle.shape)}>
      {chipStyle.icon}
      {label}
    </span>
  );
}
