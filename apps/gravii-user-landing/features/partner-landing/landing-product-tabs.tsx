'use client'

import { useState } from 'react'
import { cn } from '@/lib/cn'
import {
  integrationCards,
  lensPreviewTabs,
  reachAudienceCards,
  reachPreviewTabs,
  reachSpotlightCard,
  userAppCards,
  type PreviewTab,
} from './landing-content'
import {
  cardAccentClassMap,
  dashboardHref,
} from './landing-constants'
import styles from './landing-page.module.css'

type ProductTabId = "engage" | "verify" | "analyze" | "users";

type ProductTab = {
  id: ProductTabId;
  label: string;
  accent: "teal" | "blue" | "purple";
};

const productTabs: readonly ProductTab[] = [
  { id: "engage", label: "Reach — Campaign", accent: "teal" },
  { id: "verify", label: "Gate — API", accent: "blue" },
  { id: "analyze", label: "Lens — Report", accent: "purple" },
  { id: "users", label: "For Users — App", accent: "purple" },
] as const;

function DashboardPreview({
  accent,
  ctaHref,
  ctaLabel,
  note,
  noteLarge,
  previewId,
  tabs,
}: {
  accent: "teal" | "purple";
  ctaHref: string;
  ctaLabel: string;
  note: string;
  noteLarge?: boolean;
  previewId: string;
  tabs: readonly PreviewTab[];
}) {
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id ?? "");

  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];

  if (!activeTab) {
    return null;
  }

  return (
    <>
      <div className={styles.previewTabs}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab.id;

          return (
            <button
              className={cn(
                styles.buttonReset,
                styles.previewTab,
                isActive && styles.previewTabActive,
              )}
              data-accent={accent}
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className={styles.previewPanel} id={previewId}>
        <div className={styles.metricGrid}>
          {activeTab.metrics.map((metric) => (
            <article className={styles.metricCard} key={metric.label}>
              <span className={styles.metricLabel}>{metric.label}</span>
              <strong className={styles.metricValue}>{metric.value}</strong>
              <span className={styles.metricCaption}>{metric.caption}</span>
            </article>
          ))}
        </div>
      </div>

      <div className={styles.noteBox} data-accent={accent}>
        <div
          className={cn(
            styles.noteText,
            noteLarge && styles.noteTextLarge,
          )}
        >
          {note}
        </div>
        <a className={styles.noteLink} data-accent={accent} href={ctaHref}>
          {ctaLabel}
        </a>
      </div>
    </>
  );
}

function ReachPanel() {
  return (
    <>
      <p className={styles.tabIntro}>
        Launch precision campaigns from the Gravii Dashboard. Users discover
        your campaign in Discovery and My Space — a Pull structure where they
        come to you, not the other way around.
      </p>

      <div className={cn(styles.grid3, styles.featureGridSpacing)}>
        {reachAudienceCards.map((card) => (
          <article
            className={cn(styles.card, styles.cardTeal, styles.featureCard)}
            key={card.title}
          >
            <span className={styles.featureEyebrow} data-accent="teal">
              {card.eyebrow}
            </span>
            <h3 className={styles.featureTitle}>{card.title}</h3>
            <p className={styles.featureDescription}>{card.description}</p>
          </article>
        ))}
      </div>

      <article
        className={cn(
          styles.card,
          styles.cardTeal,
          styles.featureCard,
          styles.featureSpotlight,
        )}
      >
        <span className={styles.featureEyebrow} data-accent="teal">
          {reachSpotlightCard.eyebrow}
        </span>
        <h3 className={styles.featureTitle}>{reachSpotlightCard.title}</h3>
        <p className={styles.featureDescription}>
          {reachSpotlightCard.description}
        </p>
      </article>

      <div className={styles.dashboardLabel}>Dashboard Preview</div>
      <div className={cn(styles.card, styles.previewShell)}>
        <DashboardPreview
          accent="teal"
          ctaHref={dashboardHref}
          ctaLabel="Get Started →"
          note="This is a snapshot — the full dashboard includes interactive charts, segment filters, campaign builder with AI assistant, sybil cluster detection, and more."
          previewId="dashPreview"
          tabs={reachPreviewTabs}
        />
      </div>
    </>
  );
}

function VerifyPanel() {
  return (
    <>
      <p className={cn(styles.tabIntro, styles.tabIntroTight)}>
        Multiple ways to verify users — from deep API integration to zero-code
        community bots. Choose the method that fits your team.
      </p>

      <article
        className={cn(styles.card, styles.cardBlue, styles.integrationCard)}
      >
        <div className={styles.integrationHeader}>
          <div>
            <div className={styles.productName}>
              <span className={styles.accentBlue}>WEB API</span>
            </div>
            <div className={styles.integrationHeaderTitle}>
              Real-time verification on your platform
            </div>
          </div>

          <div className={styles.responseStats}>
            <div className={styles.responseStat}>
              <strong>&lt;200ms</strong>
              <span>Response</span>
            </div>
            <div className={styles.responseStat}>
              <strong>5 min</strong>
              <span>First Call</span>
            </div>
          </div>
        </div>

        <pre className={styles.codeBlock}>
          GET /v1/lookup/0x742d...3f8a?level=growth
          {"\n\n"}
          {"{"}
          {"\n  "}
          <span className={styles.codeKey}>{'"activityGrade"'}</span>:{" "}
          <span className={styles.codeValue}>{'"A"'}</span>,
          {"\n  "}
          <span className={styles.codeKey}>{'"walletStatus"'}</span>:{" "}
          <span className={styles.codeValue}>{'"Active"'}</span>,
          {"\n  "}
          <span className={styles.codeKey}>{'"sybilStatus"'}</span>:{" "}
          <span className={styles.codeValue}>{'"Clean"'}</span>,
          {"\n  "}
          <span className={styles.codeKey}>{'"primaryPersona"'}</span>:{" "}
          <span className={styles.codeValue}>{'"Diamond Hands"'}</span>,
          {"\n  "}
          <span className={styles.codeKey}>{'"riskLevel"'}</span>:{" "}
          <span className={styles.codeValue}>{'"Clean"'}</span>,
          {"\n  "}
          <span className={styles.codeKey}>{'"tier"'}</span>:{" "}
          <span className={styles.codeValue}>{'"Platinum"'}</span>,
          {"\n  "}
          <span className={styles.codeKey}>{'"primaryChain"'}</span>:{" "}
          <span className={styles.codeValue}>{'"Ethereum"'}</span>,
          {"\n  "}
          <span className={styles.codeKey}>{'"availableValueTier"'}</span>:{" "}
          <span className={styles.codeValue}>{'"High"'}</span>,
          {"\n  "}
          <span className={styles.codeKey}>{'"holdingsRange"'}</span>:{" "}
          <span className={styles.codeValue}>{'"$10K-$100K"'}</span>,
          {"\n  "}
          <span className={styles.codeKey}>{'"defiActivity"'}</span>:{" "}
          <span className={styles.codeValue}>{'"High"'}</span>
          {"\n}"}
        </pre>
      </article>

      <div className={styles.integrationLabel}>More ways to connect</div>
      <div className={styles.grid2}>
        {integrationCards.map((card) => (
          <article
            className={cn(
              styles.card,
              cardAccentClassMap[card.accent],
              styles.featureCard,
            )}
            key={card.title}
          >
            <span className={styles.featureEyebrow} data-accent={card.accent}>
              {card.eyebrow}
            </span>
            <h3 className={styles.featureTitle}>{card.title}</h3>
            <p className={styles.featureDescription}>{card.description}</p>
            <div className={styles.tagRow}>
              {card.tags.map((tag) => (
                <span className={styles.tag} data-accent={card.accent} key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className={styles.integrationFooter}>
        <a className={styles.noteLink} data-accent="blue" href={dashboardHref}>
          Set up on Dashboard →
        </a>
      </div>
    </>
  );
}

function AnalyzePanel() {
  return (
    <>
      <p className={cn(styles.tabIntro, styles.tabIntroTight)}>
        Submit a wallet list — Gravii returns an aggregate report. Understand
        your user pool before committing. No Gravii ID needed. No engineering
        required.
      </p>

      <div className={styles.dashboardLabel}>Dashboard Preview</div>
      <div className={cn(styles.card, styles.previewShell)}>
        <DashboardPreview
          accent="purple"
          ctaHref={dashboardHref}
          ctaLabel="Upload Wallet List →"
          note="This is a snapshot — the full dashboard includes interactive charts, segment filters, sybil cluster detection, and more."
          previewId="lensDashPreview"
          tabs={lensPreviewTabs}
        />
      </div>

      <div
        className={cn(styles.noteBox, styles.noteBoxSpacing)}
        data-accent="teal"
      >
        <div className={cn(styles.noteText, styles.noteTextLarge)}>
          Ready to act on these insights?{" "}
          <strong>Lens cost is credited when you upgrade to Reach.</strong>
        </div>
        <a className={styles.noteLink} data-accent="teal" href={dashboardHref}>
          Launch on Reach →
        </a>
      </div>
    </>
  );
}

function UsersPanel() {
  return (
    <>
      <p className={cn(styles.tabIntro, styles.usersIntro)}>
        Users create a Gravii ID and unlock personalized experiences — campaigns
        on Discovery, rankings on Standing, benefits on My Space.
      </p>

      <div className={styles.usersGrid}>
        {userAppCards.map((card) => (
          <article className={styles.card} key={card.title}>
            <span className={styles.userEyebrow} data-accent={card.accent}>
              {card.eyebrow}
            </span>
            <h3 className={styles.featureTitle}>{card.title}</h3>
            <p className={styles.featureDescription}>{card.description}</p>
          </article>
        ))}
      </div>
    </>
  );
}

export function ProductTabs() {
  const [activeTabId, setActiveTabId] = useState<ProductTabId>("engage");
  const [hasInteracted, setHasInteracted] = useState(false);

  return (
    <>
      <div className={styles.pills}>
        {productTabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const activeAccent =
            !hasInteracted && tab.id === "engage" && isActive ? "lav" : tab.accent;

          return (
            <button
              className={cn(
                styles.buttonReset,
                styles.pill,
                isActive && styles.pillActive,
              )}
              data-accent={activeAccent}
              key={tab.id}
              onClick={() => {
                setHasInteracted(true);
                setActiveTabId(tab.id);
              }}
              type="button"
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTabId === "engage" ? <ReachPanel /> : null}
      {activeTabId === "verify" ? <VerifyPanel /> : null}
      {activeTabId === "analyze" ? <AnalyzePanel /> : null}
      {activeTabId === "users" ? <UsersPanel /> : null}
    </>
  );
}
