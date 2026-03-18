import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

type Accent = "teal" | "blue" | "purple";

type ActionCard = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  accent: Accent;
};

type ChecklistItem = {
  title: string;
  description: string;
};

const actionCards: readonly ActionCard[] = [
  {
    eyebrow: "GRAVII GATE",
    title: "Set up wallet intelligence on your product",
    description:
      "Start with API verification, user segmentation, and real-time eligibility checks for every wallet connection.",
    href: "https://docs.gravii.io",
    cta: "Open Gate docs",
    accent: "blue",
  },
  {
    eyebrow: "GRAVII LENS",
    title: "Upload a wallet list and inspect your ecosystem",
    description:
      "Analyze value distribution, sybil exposure, and behavioral segments before you commit budget or engineering time.",
    href: "https://docs.gravii.io",
    cta: "Review Lens guide",
    accent: "purple",
  },
  {
    eyebrow: "GRAVII REACH",
    title: "Launch campaigns against the right users",
    description:
      "Use Gravii intelligence to target your own users, the Gravii pool, or both with measurable acquisition quality.",
    href: "https://docs.gravii.io",
    cta: "Plan a Reach launch",
    accent: "teal",
  },
] as const;

const checklist: readonly ChecklistItem[] = [
  {
    title: "Pick your first product",
    description:
      "Choose Gate if you need instant verification, Lens if you want diagnosis first, or Reach if growth is the priority.",
  },
  {
    title: "Define your success metric",
    description:
      "Set the KPI you want Gravii to improve first: onboarding quality, conversion, CPA efficiency, or sybil reduction.",
  },
  {
    title: "Move into implementation",
    description:
      "Use the docs for self-serve setup, then align with Gravii on production launch, tracking, and follow-up optimization.",
  },
] as const;

export const metadata: Metadata = {
  title: "Gravii Partner Workspace",
  description:
    "Operational entry point for Gravii partners starting with Gate, Lens, or Reach.",
};

export default function DashboardPage() {
  return (
    <main className={styles.page}>
      <div className={styles.grain} />

      <header className={styles.header}>
        <Link className={styles.brand} href="/">
          Gravii
        </Link>
        <nav className={styles.nav}>
          <a className={styles.navLink} href="https://docs.gravii.io" rel="noreferrer" target="_blank">
            Docs
          </a>
          <a
            className={styles.navButton}
            href="mailto:partners@gravii.io?subject=Gravii%20Onboarding"
          >
            Request Onboarding
          </a>
        </nav>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Partner Workspace</p>
          <h1 className={styles.title}>Build with Gravii, without the reference HTML.</h1>
          <p className={styles.description}>
            This is now a real Next.js route. Use it as the operational starting
            point for Gate, Lens, and Reach instead of the old static
            placeholder flow.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primaryButton} href="https://docs.gravii.io" rel="noreferrer" target="_blank">
              Open Docs
            </a>
            <Link className={styles.secondaryButton} href="/">
              Back to Landing
            </Link>
          </div>
        </div>

        <aside className={styles.statusCard}>
          <div className={styles.statusHeader}>
            <span className={styles.statusLabel}>Workspace Status</span>
            <span className={styles.statusPill}>Ready</span>
          </div>
          <div className={styles.statusGrid}>
            <div className={styles.statusMetric}>
              <span className={styles.statusMetricLabel}>Products</span>
              <strong className={styles.statusMetricValue}>3</strong>
            </div>
            <div className={styles.statusMetric}>
              <span className={styles.statusMetricLabel}>Start Paths</span>
              <strong className={styles.statusMetricValue}>Self-serve + Guided</strong>
            </div>
            <div className={styles.statusMetric}>
              <span className={styles.statusMetricLabel}>Best First Step</span>
              <strong className={styles.statusMetricValue}>Choose one product and one KPI</strong>
            </div>
          </div>
        </aside>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionIntro}>
          <p className={styles.sectionTag}>Start Here</p>
          <h2 className={styles.sectionTitle}>Pick the Gravii workflow you want to launch first.</h2>
        </div>

        <div className={styles.cardGrid}>
          {actionCards.map((card) => (
            <article className={styles.actionCard} data-accent={card.accent} key={card.title}>
              <span className={styles.actionEyebrow} data-accent={card.accent}>
                {card.eyebrow}
              </span>
              <h3 className={styles.actionTitle}>{card.title}</h3>
              <p className={styles.actionDescription}>{card.description}</p>
              <a className={styles.cardLink} href={card.href} rel="noreferrer" target="_blank">
                {card.cta}
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionIntro}>
          <p className={styles.sectionTag}>Execution</p>
          <h2 className={styles.sectionTitle}>A cleaner handoff from landing to implementation.</h2>
        </div>

        <div className={styles.executionLayout}>
          <div className={styles.checklist}>
            {checklist.map((item, index) => (
              <article className={styles.checklistItem} key={item.title}>
                <span className={styles.checklistIndex}>{index + 1}</span>
                <div>
                  <h3 className={styles.checklistTitle}>{item.title}</h3>
                  <p className={styles.checklistDescription}>{item.description}</p>
                </div>
              </article>
            ))}
          </div>

          <aside className={styles.supportCard}>
            <p className={styles.supportLabel}>Recommended next move</p>
            <h3 className={styles.supportTitle}>Start with documentation, then request onboarding if needed.</h3>
            <p className={styles.supportDescription}>
              The route is production code now, but it still acts as an
              onboarding entry page until deeper product flows are built behind
              it.
            </p>
            <div className={styles.supportActions}>
              <a className={styles.primaryButton} href="https://docs.gravii.io" rel="noreferrer" target="_blank">
                Read Docs
              </a>
              <a
                className={styles.secondaryButton}
                href="mailto:partners@gravii.io?subject=Gravii%20Onboarding"
              >
                Contact Gravii
              </a>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
