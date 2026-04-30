import { cn } from '@/lib/cn'
import type { LandingDimension } from './landing-page'
import {
  engineProducts,
  flywheelSteps,
  gatePricingPlans,
  lensPricingRows,
  problemItems,
  reachCpaRows,
  reachPricingPlans,
  sectorLabels,
  solutionCards,
  type PricingPlan,
} from './landing-content'
import {
  accentClassMap,
  cardAccentClassMap,
  dashboardHref,
} from './landing-constants'
import { AuthHandoffLink } from './auth-handoff-link'
import { ProductTabs } from './landing-product-tabs'
import styles from './landing-page.module.css'

type PricingAccent = "blue" | "purple" | "teal" | "lav";

function PricingPlanGrid({
  accent,
  plans,
  fiveColumns = false,
}: {
  accent: Exclude<PricingAccent, "lav">;
  plans: readonly PricingPlan[];
  fiveColumns?: boolean;
}) {
  return (
    <div
      className={cn(
        fiveColumns ? styles.grid5 : styles.grid4,
        fiveColumns
          ? styles.pricingFiveGridSpacing
          : styles.pricingGridSpacingSmall,
      )}
    >
      {plans.map((plan) => (
        <article
          className={cn(
            styles.card,
            styles.plan,
            plan.featured && styles.planFeatured,
          )}
          key={plan.name}
        >
          {plan.badge ? <div className={styles.planBadge}>{plan.badge}</div> : null}
          <div className={styles.planName}>{plan.name}</div>
          <div className={styles.planQuota}>{plan.quota}</div>
          <div className={styles.planPrice}>
            {plan.price}
            {plan.cadence ? (
              <span className={styles.planCadence}>{plan.cadence}</span>
            ) : null}
          </div>
          {plan.features.map((feature) => (
            <div className={styles.planFeature} key={feature}>
              <span className={styles.planFeatureMark} data-accent={accent}>
                ✓
              </span>
              {feature}
            </div>
          ))}
          <a
            className={cn(
              styles.planButton,
              plan.featured
                ? styles.planButtonPrimary
                : styles.planButtonDefault,
            )}
            href="mailto:partners@gravii.io"
          >
            {plan.cta}
          </a>
        </article>
      ))}
    </div>
  );
}

export function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroBackdrop}>
        <div className={styles.heroGlowA} />
        <div className={styles.heroGlowB} />
        <div className={styles.heroGlowC} />
        <div className={styles.heroGlowD} />
      </div>

      <div className={styles.heroOverline}>Deterministic On-Chain Intelligence</div>

      <h1 className={styles.heroTitle}>
        <span className={styles.heroGlitch}>Stop guessing.</span>
        <br />
        <span className={styles.heroLineTwo}>
          Start <span className={styles.heroAccent}>growing.</span>
        </span>
      </h1>

      <p className={styles.heroSub}>
        Lower your costs, faster growth, less engineering.
        <br />
        <span className={styles.heroAccent}>One Gravii engine.</span>
      </p>

      <div className={styles.heroCta}>
        <AuthHandoffLink className={styles.btnPrimary} href={dashboardHref}>
          Get Started
        </AuthHandoffLink>
        <a className={styles.btnSecondary} href="mailto:partners@gravii.io">
          Book a Demo
        </a>
      </div>
    </section>
  );
}

export function ProblemsSection() {
  return (
    <section className={styles.sectionCompact}>
      <div
        className={cn(styles.sectionTag, styles.reveal)}
        data-accent="red"
        data-reveal=""
      >
        The Problem
      </div>
      <h2
        className={cn(
          styles.sectionTitle,
          styles.sectionTitleLarge,
          styles.reveal,
          styles.revealD1,
        )}
        data-reveal=""
      >
        Without Gravii,
        <br />
        every wallet is a black box.
      </h2>

      <div
        className={cn(styles.problemList, styles.reveal, styles.revealD2)}
        data-reveal=""
      >
        {problemItems.map((item, index) => (
          <div
            className={cn(
              styles.problemItem,
              index < problemItems.length - 1 && styles.problemItemBorder,
            )}
            key={item.title}
          >
            <div className={styles.problemBar} data-accent={item.accent} />
            <div>
              <div className={styles.problemTitle}>{item.title}</div>
              <div className={styles.problemDescription}>{item.description}</div>
            </div>
          </div>
        ))}
      </div>

      <div
        className={cn(styles.problemCallout, styles.reveal, styles.revealD3)}
        data-reveal=""
      >
        Services using Gravii identify high-value users instantly upon
        connection.{" "}
        <strong>
          Partners not using Gravii don&apos;t even realize they&apos;re losing
          them.
        </strong>
      </div>
    </section>
  );
}

export function EngineSection({ dimension }: { dimension: LandingDimension }) {
  return (
    <>
      <section className={styles.sectionWide}>
        <div
          className={cn(styles.sectionTag, styles.reveal)}
          data-accent="purple"
          data-reveal=""
        >
          Core Structure
        </div>
        <h2
          className={cn(
            styles.sectionTitle,
            styles.sectionTitleLarge,
            styles.reveal,
            styles.revealD1,
            styles.engineSectionTitle,
          )}
          data-reveal=""
        >
          One engine. <span className={styles.engineDimensionsAccent}>Two dimensions.</span>
        </h2>
        <p
          className={cn(styles.sectionBody, styles.reveal, styles.revealD2)}
          data-reveal=""
        >
          At the center is Gravii&apos;s deep on-chain analysis engine. Human
          wallets and autonomous agents — analyzed, classified, and rated
          through one unified platform. Three products for human wallets. One
          dedicated API for agents.
        </p>

        <div
          className={cn(styles.engineBadgeWrap, styles.reveal, styles.revealD3)}
          data-reveal=""
        >
          <div className={styles.engineBadge}>
            <div className={styles.engineBadgeTitle}>
              GRAVII ON-CHAIN ANALYSIS ENGINE
            </div>
            <div className={styles.engineBadgeCopy}>
              Deterministic identity from on-chain data. Healthier ecosystems.
              Smarter spending. Stronger protection.
            </div>
          </div>
          <div className={styles.engineArrow}>↓</div>
          <div className={styles.dimensionRow}>
            <div className={styles.dimensionCard}>
              <div className={styles.dimensionLabel} data-accent="blue">
                HUMAN INTELLIGENCE
              </div>
              <div className={styles.dimensionCopy}>Gate · Reach · Lens</div>
            </div>
            <div className={styles.dimensionCard}>
              <div className={styles.dimensionLabel} data-accent="amber">
                AGENT INTELLIGENCE
              </div>
              <div className={styles.dimensionCopy}>KYA</div>
            </div>
          </div>
        </div>

        <div className={cn(styles.engineMiniTag, styles.reveal, styles.revealD3)} data-reveal="">
          HUMAN INTELLIGENCE — THREE PRODUCTS
        </div>
        <div
          className={cn(styles.engineProductsGrid, styles.reveal, styles.revealD4)}
          data-reveal=""
        >
          {engineProducts.map((product) => (
            <article
              className={cn(
                styles.card,
                cardAccentClassMap[product.accent],
                product.animated && styles.pulseCard,
              )}
              key={product.name}
            >
              <div
                className={cn(
                  styles.productName,
                  accentClassMap[product.accent],
                )}
              >
                {product.name}
              </div>
              <div className={styles.productCardTitle}>{product.title}</div>
              <div className={styles.productCardCopy}>
                {product.description}{" "}
                {product.emphasis ? <strong>{product.emphasis}</strong> : null}{" "}
                {product.descriptionAfterEmphasis ?? ""}
              </div>
              <div className={styles.productWhere}>Where: {product.where}</div>
            </article>
          ))}
        </div>
      </section>

      {dimension === 'human' ? (
        <p className={cn(styles.bridge, styles.reveal)} data-reveal="">
          Start with any one product. Combine as you grow — Reach to target the
          right users, Gate for real-time intelligence on your platform, Lens to
          analyze before you commit. For agent wallets, switch to Agent
          Intelligence below.
        </p>
      ) : null}
    </>
  );
}

export function ProductSection({
  dimension,
  onDimensionChange,
}: {
  dimension: LandingDimension;
  onDimensionChange: (value: LandingDimension) => void;
}) {
  return (
    <section className={styles.section} id="product">
      <div
        className={cn(styles.sectionTag, styles.reveal)}
        data-accent="purple"
        data-reveal=""
      >
        Product
      </div>
      <h2
        className={cn(
          styles.sectionTitle,
          styles.sectionTitleMedium,
          styles.reveal,
          styles.revealD1,
        )}
        data-reveal=""
      >
        See it in action.
      </h2>
      <p
        className={cn(
          styles.sectionBody,
          styles.reveal,
          styles.revealD2,
          styles.productSectionBody,
        )}
        data-reveal=""
      >
        Explore each product — what partners see, what users see.
      </p>

      <div className={cn(styles.reveal, styles.revealD3)} data-reveal="">
        <ProductTabs dimension={dimension} onDimensionChange={onDimensionChange} />
      </div>
    </section>
  );
}

export function SolutionsSection({ dimension }: { dimension: LandingDimension }) {
  if (dimension === 'agent') {
    return null
  }

  return (
    <section className={styles.section} id="solutions">
      <div
        className={cn(styles.sectionTag, styles.reveal)}
        data-accent="purple"
        data-reveal=""
      >
        Who Uses Gravii
      </div>
      <h2
        className={cn(
          styles.sectionTitle,
          styles.sectionTitleMedium,
          styles.reveal,
          styles.revealD1,
        )}
        data-reveal=""
      >
        Every platform where users connect a wallet.
      </h2>
      <p className={cn(styles.reveal, styles.revealD2, styles.solutionsBody)} data-reveal="">
        If your users have wallets, Gravii gives you the intelligence to grow.
        Including, but not limited to:
      </p>

      <div
        className={cn(styles.sectorRow, styles.reveal, styles.revealD2)}
        data-reveal=""
      >
        {sectorLabels.map((label) => (
          <span className={styles.sectorPill} key={label}>
            {label}
          </span>
        ))}
        <span className={styles.sectorEtc}>...and beyond.</span>
      </div>

      <div className={cn(styles.solutionsGrid, styles.reveal, styles.revealD3)} data-reveal="">
        {solutionCards.map((card) => (
          <article
            className={cn(styles.card, cardAccentClassMap[card.accent])}
            key={card.title}
          >
            <div
              className={cn(
                styles.solutionProduct,
                accentClassMap[card.accent],
              )}
            >
              {card.product}
            </div>
            <div className={styles.solutionTitle}>{card.title}</div>
            <div className={styles.solutionDescription}>{card.description}</div>
            <div
              className={cn(
                styles.solutionExample,
                accentClassMap[card.accent],
              )}
            >
              {card.example}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function PricingSection({ dimension }: { dimension: LandingDimension }) {
  if (dimension === 'agent') {
    return null
  }

  return (
    <section className={styles.section} id="pricing">
      <div
        className={cn(styles.sectionTag, styles.reveal)}
        data-accent="purple"
        data-reveal=""
      >
        Pricing
      </div>
      <h2
        className={cn(
          styles.sectionTitle,
          styles.sectionTitleMedium,
          styles.reveal,
          styles.revealD1,
        )}
        data-reveal=""
      >
        Transparent pricing. Start with any product.
      </h2>
      <p
        className={cn(styles.sectionBody, styles.reveal, styles.revealD2)}
        data-reveal=""
      >
        Every product has clear pricing. No hidden fees. Scale as you grow.
      </p>

      <div
        className={cn(
          styles.pricingProductHeader,
          styles.reveal,
          styles.revealD3,
        )}
        data-reveal=""
      >
        <div className={styles.pricingProductTitle} data-accent="blue">
          GRAVII GATE
        </div>
        <div className={styles.pricingProductSubtitle}>API Pricing</div>
      </div>

      <div
        className={cn(
          styles.reveal,
          styles.revealD3,
        )}
        data-reveal=""
      >
        <PricingPlanGrid accent="blue" fiveColumns plans={gatePricingPlans} />
      </div>

      <div className={styles.pricingCenterBanner}>
        <div className={styles.pricingCenterBannerTitle}>
          Early adopter pricing —{" "}
          <span className={styles.pricingCenterBannerHighlight}>
            first 3 months discounted
          </span>
        </div>
        <div className={styles.pricingCenterBannerBody}>
          Starter{" "}
          <span className={styles.pricingCenterBannerValue}>$99</span>/mo · Pro{" "}
          <span className={styles.pricingCenterBannerValue}>$249</span>/mo ·
          Growth <span className={styles.pricingCenterBannerValue}>$499</span>/mo
          — <span className={styles.pricingCenterBannerLink}>Contact us →</span>
        </div>
      </div>

      <div className={cn(styles.pricingProductHeader, styles.reveal)} data-reveal="">
        <div className={styles.pricingProductTitle} data-accent="purple">
          GRAVII LENS
        </div>
        <div className={styles.pricingProductSubtitle}>Report Pricing</div>
      </div>
      <p className={styles.pricingLead}>
        Full report — all data included regardless of tier. Upload a wallet
        list, get the complete picture.
      </p>

      <div className={cn(styles.card, styles.pricingTableCard)}>
        <table className={styles.pricingTable}>
          <thead>
            <tr className={styles.pricingTableHeadRow} data-accent="purple">
              <th className={styles.pricingTableHeaderCell}>Tier</th>
              <th className={styles.pricingTableHeaderCell}>Wallets</th>
              <th className={styles.pricingTableHeaderCell}>Price</th>
              <th className={styles.pricingTableHeaderCell}>Reach Credit (50%)</th>
              <th className={styles.pricingTableHeaderCell}>Net After Credit</th>
            </tr>
          </thead>
          <tbody>
            {lensPricingRows.map((row, index) => (
              <tr
                className={cn(
                  styles.pricingTableRow,
                  index % 2 === 1 && styles.pricingTableRowAlt,
                )}
                key={row.tier}
              >
                <td className={cn(styles.pricingTableCell, styles.pricingTableMono)}>
                  {row.tier}
                </td>
                <td className={styles.pricingTableCell}>{row.wallets}</td>
                <td
                  className={cn(
                    styles.pricingTableCell,
                    styles.pricingTableMono,
                    styles.pricingTablePrice,
                  )}
                >
                  {row.price}
                </td>
                <td
                  className={cn(
                    styles.pricingTableCell,
                    styles.pricingTableMono,
                    styles.accentPurple,
                  )}
                >
                  {row.reachCredit}
                </td>
                <td
                  className={cn(
                    styles.pricingTableCell,
                    styles.pricingTableMono,
                    styles.pricingTableMutedValue,
                  )}
                >
                  {row.netAfterCredit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.pricingSplitBanner} data-accent="purple">
        <div className={styles.pricingSplitBannerPrimary}>
          100K+ wallets?{" "}
          <span className={styles.pricingSplitBannerLink} data-accent="purple">
            Contact us →
          </span>
        </div>
        <div className={styles.pricingSplitBannerSecondary}>
          Credit applied to first month of Reach subscription only. Excess
          credit is forfeited.
        </div>
      </div>

      <div className={cn(styles.pricingProductHeader, styles.reveal)} data-reveal="">
        <div className={styles.pricingProductTitle} data-accent="teal">
          GRAVII REACH
        </div>
        <div className={styles.pricingProductSubtitle}>Campaign Pricing</div>
      </div>
      <p className={styles.pricingLead}>
        Monthly subscription + CPA on new user acquisition. X-RAY user profiling
        included in all plans.
      </p>

      <div className={styles.pricingMiniLabel} data-accent="teal">
        SUBSCRIPTION
      </div>
      <PricingPlanGrid accent="teal" plans={reachPricingPlans} />

      <div className={styles.pricingMiniLabel} data-accent="teal">
        CPA — NEW USER ACQUISITION
      </div>
      <p className={styles.pricingCpaLead}>
        When users <strong className={styles.accentTeal}>from the Gravii pool</strong>{" "}
        opt in to your campaign, CPA is charged per opt-in based on the user&apos;s
        tier. Users already in your ecosystem are{" "}
        <strong className={styles.accentCream}>free — no CPA</strong>.
      </p>

      <div className={cn(styles.card, styles.pricingTableCard, styles.pricingTableGap)}>
        <table className={styles.pricingTable}>
          <thead>
            <tr className={styles.pricingTableHeadRow} data-accent="teal">
              <th className={styles.pricingTableHeaderCell}>User Tier</th>
              <th className={styles.pricingTableHeaderCell}>Standard CPA</th>
              <th className={styles.pricingTableHeaderCell}>Enterprise CPA (-20%)</th>
            </tr>
          </thead>
          <tbody>
            {reachCpaRows.map((row, index) => (
              <tr
                className={cn(
                  styles.pricingTableRow,
                  index % 2 === 1 && styles.pricingTableRowAlt,
                )}
                key={row.tier}
              >
                <td className={cn(styles.pricingTableCell, styles.pricingTableMono)}>
                  {row.tier}
                </td>
                <td
                  className={cn(
                    styles.pricingTableCell,
                    styles.pricingTableMono,
                    styles.pricingTablePrice,
                  )}
                >
                  {row.standardCpa}
                  <span className={styles.pricingTableUnit}> /opt-in</span>
                </td>
                <td
                  className={cn(
                    styles.pricingTableCell,
                    styles.pricingTableMono,
                    styles.accentTeal,
                  )}
                >
                  {row.enterpriseCpa}
                  <span className={styles.pricingTableUnit}> /opt-in</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.pricingSplitBanner} data-accent="teal">
        <div className={styles.pricingSplitBannerPrimary}>
          Enterprise CPA: 20% discount on all tiers.{" "}
          <span className={styles.pricingSplitBannerLink} data-accent="teal">
            Contact us →
          </span>
        </div>
        <div className={styles.pricingSplitBannerSecondary}>
          Budget cap available — campaign auto-pauses at your limit
        </div>
      </div>

      <div className={cn(styles.card, styles.pricingBundleCard)}>
        <div className={styles.pricingBundleEyebrow}>ENTERPRISE FULL BUNDLE</div>
        <div className={styles.pricingBundleTitle}>
          All products. One contract.
        </div>
        <div className={styles.pricingBundleDescription}>
          From <span className={styles.pricingBundleValue}>$5,000/mo</span> —
          Gate + Reach + Lens + KYA. 10% off module sum. Includes Lens S×2 free, CPA 20% discount.
        </div>
        <a className={styles.pricingBundleButton} href="mailto:partners@gravii.io">
          Contact Us
        </a>
      </div>
    </section>
  );
}

export function WhyNowSection() {
  return (
    <section className={styles.centerSection}>
      <div
        className={cn(styles.sectionTag, styles.reveal)}
        data-accent="purple"
        data-reveal=""
      >
        Why Now
      </div>
      <h2
        className={cn(
          styles.sectionTitle,
          styles.sectionTitleLarge,
          styles.reveal,
          styles.revealD1,
          styles.whyNowTitle,
        )}
        data-reveal=""
      >
        The flywheel is spinning.
      </h2>
      <p className={cn(styles.centerBody, styles.reveal, styles.revealD2)} data-reveal="">
        Every product feeds the same cycle. Regardless of where you start, your
        users join the Gravii pool — expanding value for all partners.
      </p>

      <div className={cn(styles.flywheel, styles.reveal, styles.revealD3)} data-reveal="">
        {flywheelSteps.map((step, index) => (
          <div className={styles.displayContents} key={step.label}>
            <div className={styles.flywheelStep}>
              <div className={styles.flywheelLabel} data-accent={step.accent}>
                {step.label}
              </div>
              <div className={styles.flywheelDescription}>{step.description}</div>
            </div>
            {index < flywheelSteps.length - 1 ? (
              <div className={styles.flywheelArrow}>→</div>
            ) : null}
          </div>
        ))}
      </div>

      <div className={styles.firstMover}>
        <div className={styles.firstMoverTitle}>First-mover advantage is real.</div>
        <div className={styles.firstMoverCopy}>
          Partners who join early and contribute to user pool growth capture
          more value than those who join after the pool has matured.
        </div>
      </div>
    </section>
  );
}

export function ClosingSection() {
  return (
    <>
      <section className={styles.ctaSection}>
        <h2 className={cn(styles.ctaTitle, styles.reveal)} data-reveal="">
          Start with any product. Scale from there.
        </h2>
        <p className={cn(styles.ctaCopy, styles.reveal, styles.revealD1)} data-reveal="">
          Ready to see what your users look like? Get started in minutes — or
          book a demo to see the full platform.
        </p>
        <div className={cn(styles.ctaActions, styles.reveal, styles.revealD2)} data-reveal="">
          <AuthHandoffLink className={styles.btnPrimary} href={dashboardHref}>
            Get Started
          </AuthHandoffLink>
          <a className={styles.btnSecondary} href="mailto:partners@gravii.io">
            Book a Demo
          </a>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerBrand}>Gravii</div>
        <div className={styles.footerLine}>Deterministic On-Chain Intelligence</div>
        <div className={styles.footerLineSmall}>
          On-chain behavioral intelligence for growth · Reach · Gate · Lens · KYA
        </div>
        <div className={styles.footerCopyright}>
          © 2026 Gravii. All rights reserved.
        </div>
      </footer>
    </>
  );
}
