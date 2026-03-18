"use client";

import type { ReactNode } from "react";

import type { SharedContentProps } from "@/features/launch-app/types";
import InfiniteCanvas from "@/features/profile/components/infinite-canvas";
import { PERSONA_ITEMS } from "@/features/profile/persona-data";
import { PROFILE_SNAPSHOT } from "@/features/profile/profile-view-model";

import styles from "./profile-content.module.css";

type StatCardProps = {
  label: string;
  value: ReactNode;
  meta: ReactNode;
};

function joinClasses(...classNames: Array<string | false | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

function personaClass(index: number) {
  return styles[`persona${index}` as keyof typeof styles];
}

function StatCard({ label, value, meta }: StatCardProps) {
  return (
    <div className={joinClasses(styles.glassSurface, styles.glassStat, styles.statCard)}>
      <span className={styles.statLabel}>{label}</span>
      {value}
      <span className={styles.statMeta}>{meta}</span>
    </div>
  );
}

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={joinClasses(styles.glassSurface, styles.glassSkeleton, styles.skeletonBlock, className)} />;
}

export default function ProfileContent({ dark, connected, onConnect, onNavigate }: SharedContentProps) {
  const persona = PERSONA_ITEMS[PROFILE_SNAPSHOT.personaIndex];

  return (
    <div className={joinClasses(styles.root, dark ? styles.rootDark : styles.rootLight, personaClass(PROFILE_SNAPSHOT.personaIndex))}>
      <div className={styles.meshBackground} />

      <p className={styles.leadCopy}>Your digital identity, valid everywhere.</p>

      {connected ? (
        <div className={styles.connectedGrid}>
          <div className={joinClasses(styles.glassSurface, styles.glassHero, styles.heroCard)}>
            <div className={styles.heroCopy}>
              <span className={styles.heroEyebrow}>YOUR PERSONA</span>
              <h2 className={styles.heroTitle}>{persona.name}</h2>
              <p className={styles.heroQuote}>&ldquo;{persona.desc}&rdquo;</p>

              <div className={styles.tagList}>
                {PROFILE_SNAPSHOT.alsoIndexes.map((idx) => (
                  <span key={idx} className={styles.personaTag}>
                    {PERSONA_ITEMS[idx].name}
                  </span>
                ))}
              </div>

              <div className={styles.heroActions}>
                <span className={styles.tierBadge}>{PROFILE_SNAPSHOT.tier}</span>
                <button
                  type="button"
                  className={styles.inlineAction}
                  onClick={() => {
                    const text = encodeURIComponent(`I'm a ${persona.name} on @Gravii - ${PROFILE_SNAPSHOT.strength.pct} in ${PROFILE_SNAPSHOT.strength.cat}`);
                    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
                  }}
                >
                  SHARE ON 𝕏
                </button>
              </div>
            </div>

            <div className={styles.heroVisual}>
              <div className={styles.heroGlow} />
              <div className={styles.heroHalo} />
              <div className={styles.heroIndex}>{String(PROFILE_SNAPSHOT.personaIndex + 1).padStart(2, "0")}</div>
            </div>
          </div>

          <StatCard
            label="HOME CHAIN"
            value={<span className={`${styles.statValue} ${styles.statValueLarge}`}>{PROFILE_SNAPSHOT.homeChain}</span>}
            meta="ETH · BSC · Base · ARB"
          />

          <StatCard
            label="STANDOUT"
            value={<span className={`${styles.statValue} ${styles.statValueMedium}`}>{PROFILE_SNAPSHOT.strength.pct}</span>}
            meta={`in ${PROFILE_SNAPSHOT.strength.cat}`}
          />

          <StatCard
            label="TRANSACTIONS"
            value={<span className={`${styles.statValue} ${styles.statValueLarge}`}>{PROFILE_SNAPSHOT.transactionCount}</span>}
            meta="all-time"
          />

          <StatCard
            label="ACTIVE SINCE"
            value={<span className={`${styles.statValue} ${styles.statValueLarge}`}>{PROFILE_SNAPSHOT.activeSince}</span>}
            meta="on-chain"
          />

          <div className={styles.bottomRow}>
            <StatCard
              label="30D TREND"
              value={<span className={`${styles.statValue} ${styles.statValueHero} ${styles.accentValue}`}>{PROFILE_SNAPSHOT.trend}</span>}
              meta="portfolio"
            />

            <StatCard
              label="REPUTATION"
              value={<span className={`${styles.statValue} ${styles.statValueCompact}`}>{PROFILE_SNAPSHOT.reputation}</span>}
              meta={PROFILE_SNAPSHOT.flags}
            />

            <StatCard
              label="NFTs"
              value={<span className={`${styles.statValue} ${styles.statValueHero}`}>{PROFILE_SNAPSHOT.nftCount}</span>}
              meta="collected"
            />

            <button type="button" className={`${styles.navCard} ${styles.navCardMatched}`} onClick={() => onNavigate?.("myspace")}>
              <div className={styles.navCardInner}>
                <span className={styles.navCardLabel}>MATCHED</span>
                <span className={`${styles.statValue} ${styles.statValueHero}`}>{PROFILE_SNAPSHOT.matchedCampaigns}</span>
                <span className={styles.navCardMeta}>campaigns →</span>
              </div>
            </button>

            <button type="button" className={`${styles.navCard} ${styles.navCardXray}`} onClick={() => onNavigate?.("lookup")}>
              <div className={`${styles.navCardInner} ${styles.navCardInnerSpread}`}>
                <span className={styles.navCardLabel}>X-RAY</span>
                <p className={styles.navCardCopy}>Dig deeper into your profile</p>
                <span className={styles.navCardCta}>SEARCH →</span>
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.disconnectedState}>
          <div className={styles.disconnectedGrid}>
            <div className={joinClasses(styles.glassSurface, styles.glassSkeletonHero, styles.skeletonHero)} />
            <SkeletonBlock />
            <SkeletonBlock />
            <SkeletonBlock />
            <SkeletonBlock />
            <div className={styles.skeletonRow}>
              <SkeletonBlock className={styles.skeletonWide} />
              <SkeletonBlock className={styles.skeletonWide} />
              <SkeletonBlock className={styles.skeletonWide} />
              <SkeletonBlock className={styles.skeletonWide} />
              <SkeletonBlock className={styles.skeletonWide} />
            </div>
          </div>

          <button type="button" className={joinClasses(styles.glassSurface, styles.glassReveal, styles.signInReveal)} onClick={onConnect}>
            <div className={styles.revealMark}>?</div>
            <p className={styles.revealEyebrow}>SIGN IN TO REVEAL</p>
            <p className={styles.revealCopy}>
              Your persona, reputation, and
              <br />
              matched campaigns will appear here.
            </p>
          </button>
        </div>
      )}

      <div className={styles.canvasRegion}>
        <InfiniteCanvas dark={dark} connected={connected} activeIndex={connected ? PROFILE_SNAPSHOT.personaIndex : null} />
      </div>
    </div>
  );
}
