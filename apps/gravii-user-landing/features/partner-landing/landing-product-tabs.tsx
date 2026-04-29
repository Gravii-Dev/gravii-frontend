'use client'

import { useRef, useState } from 'react'

import { cn } from '@/lib/cn'

import type { LandingDimension } from './landing-page'
import { AuthHandoffLink } from './auth-handoff-link'
import {
  integrationCards,
  kyaPlans,
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

type ProductTabId = 'engage' | 'verify' | 'analyze' | 'users'

type ProductTab = {
  id: ProductTabId
  label: string
  accent: 'teal' | 'blue' | 'purple'
}

const productTabs: readonly ProductTab[] = [
  { id: 'engage', label: 'Reach — Campaign', accent: 'teal' },
  { id: 'verify', label: 'Gate — API', accent: 'blue' },
  { id: 'analyze', label: 'Lens — Report', accent: 'purple' },
  { id: 'users', label: 'For Users — App', accent: 'purple' },
] as const

function DashboardPreview({
  accent,
  ctaHref,
  ctaLabel,
  note,
  noteLarge,
  previewId,
  tabs,
}: {
  accent: 'teal' | 'purple'
  ctaHref: string
  ctaLabel: string
  note: string
  noteLarge?: boolean
  previewId: string
  tabs: readonly PreviewTab[]
}) {
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id ?? '')

  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0]

  if (!activeTab) {
    return null
  }

  return (
    <>
      <div className={styles.previewTabs}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab.id

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
          )
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
        <AuthHandoffLink className={styles.noteLink} data-accent={accent} href={ctaHref}>
          {ctaLabel}
        </AuthHandoffLink>
      </div>
    </>
  )
}

function ReachPanel() {
  return (
    <>
      <p className={styles.tabIntro}>
        Launch precision campaigns from the Gravii Dashboard. Users discover
        your campaign in Discovery and My Space — a Pull structure where they
        come to you, not the other way around.
      </p>

      <div className={cn(styles.reachScenarioGrid, styles.featureGridSpacing)}>
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
  )
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
          {'\n\n'}
          {'{'}
          {'\n  '}
          <span className={styles.codeKey}>{'"activityGrade"'}</span>: <span className={styles.codeValue}>{'"A"'}</span>,
          {'\n  '}
          <span className={styles.codeKey}>{'"walletStatus"'}</span>: <span className={styles.codeValue}>{'"Active"'}</span>,
          {'\n  '}
          <span className={styles.codeKey}>{'"sybilStatus"'}</span>: <span className={styles.codeValue}>{'"Clean"'}</span>,
          {'\n  '}
          <span className={styles.codeKey}>{'"primaryPersona"'}</span>: <span className={styles.codeValue}>{'"Strategic Holder"'}</span>,
          {'\n  '}
          <span className={styles.codeKey}>{'"riskLevel"'}</span>: <span className={styles.codeValue}>{'"Clean"'}</span>,
          {'\n  '}
          <span className={styles.codeKey}>{'"primaryChain"'}</span>: <span className={styles.codeValue}>{'"Ethereum"'}</span>,
          {'\n  '}
          <span className={styles.codeKey}>{'"walletType"'}</span>: <span className={styles.codeValue}>{'"Multi-chain"'}</span>,
          {'\n  '}
          <span className={styles.codeKey}>{'"agentProbability"'}</span>: <span className={styles.codeValue}>0.08</span>,
          {'\n  '}
          <span className={styles.codeKey}>{'"availableValueTier"'}</span>: <span className={styles.codeValue}>{'"High"'}</span>,
          {'\n  '}
          <span className={styles.codeKey}>{'"holdingsRange"'}</span>: <span className={styles.codeValue}>{'"$10K-$100K"'}</span>,
          {'\n  '}
          <span className={styles.codeKey}>{'"defiActivity"'}</span>: <span className={styles.codeValue}>{'"High"'}</span>
          {'\n}'}
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
        <AuthHandoffLink className={styles.noteLink} data-accent="blue" href={dashboardHref}>
          Set up on Dashboard →
        </AuthHandoffLink>
      </div>
    </>
  )
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
          Ready to act on these insights? <strong>Lens cost is credited when you upgrade to Reach.</strong>
        </div>
        <AuthHandoffLink className={styles.noteLink} data-accent="teal" href={dashboardHref}>
          Launch on Reach →
        </AuthHandoffLink>
      </div>
    </>
  )
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
  )
}

function AgentPanel() {
  return (
    <div className={styles.agentSection}>
      <div className={styles.agentIntro}>
        <div className={styles.agentTitle}>GRAVII KYA</div>
        <p className={styles.agentDescription}>
          The first on-chain behavioral intelligence API for autonomous agents.
          Detect, classify, and rate every agent interacting with your protocol.
        </p>
      </div>

      <div className={styles.kyaGrid}>
        <article className={cn(styles.card, styles.cardAmber, styles.kyaCard)}>
          <div className={styles.kyaStepLabel}>DETECT</div>
          <div className={styles.kyaCardTitle}>Is this wallet an agent?</div>
          <div className={styles.featureDescription}>
            Agent probability scoring (0–1.0) using on-chain behavioral signals
            — transaction patterns, timing consistency, deployer analysis, and
            ERC-8004 registry checks.
          </div>
        </article>
        <article className={cn(styles.card, styles.cardAmber, styles.kyaCard)}>
          <div className={styles.kyaStepLabel}>CLASSIFY</div>
          <div className={styles.kyaCardTitle}>What kind of agent is it?</div>
          <div className={styles.featureDescription}>
            10 agent personas — Speed Trader, Vault Agent, Farm Runner, Yield
            Agent, LP Agent, and more. Primary + up to 2 secondary personas.
          </div>
        </article>
        <article className={cn(styles.card, styles.cardAmber, styles.kyaCard)}>
          <div className={styles.kyaStepLabel}>RATE</div>
          <div className={styles.kyaCardTitle}>How trustworthy is it?</div>
          <div className={styles.featureDescription}>
            Agent Rating from AAA to D — based on consistency, performance,
            longevity, risk profile, and ecosystem engagement.
          </div>
        </article>
      </div>

      <div className={styles.kyaDetailGrid}>
        <article className={styles.card}>
          <div className={styles.integrationLabel}>Sample Response</div>
          <pre className={cn(styles.codeBlock, styles.kyaCode)}>
            {'{'}
            {'\n  '}
            <span className={styles.kyaCodeKey}>{'"agentProbability"'}</span>: <span className={styles.kyaCodeValue}>0.94</span>,
            {'\n  '}
            <span className={styles.kyaCodeKey}>{'"agentClassification"'}</span>: <span className={styles.kyaCodeValue}>{'"likely_agent"'}</span>,
            {'\n  '}
            <span className={styles.kyaCodeKey}>{'"agentPersona"'}</span>: <span className={styles.kyaCodeValue}>{'"Yield Agent"'}</span>,
            {'\n  '}
            <span className={styles.kyaCodeKey}>{'"agentRating"'}</span>: <span className={styles.kyaCodeValue}>{'"AA"'}</span>,
            {'\n  '}
            <span className={styles.kyaCodeKey}>{'"riskLevel"'}</span>: <span className={styles.kyaCodeValue}>{'"Clean"'}</span>,
            {'\n  '}
            <span className={styles.kyaCodeKey}>{'"operatingChains"'}</span>: [<span className={styles.kyaCodeValue}>{'"Ethereum"'}</span>, <span className={styles.kyaCodeValue}>{'"Arbitrum"'}</span>]
            {'\n}'}
          </pre>
        </article>

        <div>
          <div className={styles.integrationLabel}>Who needs KYA?</div>
          <div className={styles.kyaUseCaseList}>
            {[
              'DeFi Lending — agent-specific risk parameters',
              'DEX & Liquidity — distinguish agent LP from human LP',
              'Agentic Wallet Infra — verify agents on your platform',
              'Agent Marketplaces — trust scoring for discovery',
              'DAO Treasury — assess operators before access',
              'M2M Payments — verify counterparty agents',
            ].map((item) => (
              <div className={styles.kyaUseCaseItem} key={item}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.pricingProductHeader}>
        <div className={styles.pricingProductTitle} data-accent="amber">
          KYA Pricing
        </div>
        <div className={styles.pricingProductSubtitle}>Same plan structure as Gate. Separate endpoint, separate quota.</div>
      </div>

      <div className={styles.grid5}>
        {kyaPlans.map((plan) => (
          <article className={cn(styles.card, styles.plan)} key={plan.name}>
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
                <span className={styles.planFeatureMark} data-accent="amber">
                  ✓
                </span>
                {feature}
              </div>
            ))}
            <a
              className={cn(styles.planButton, styles.planButtonDefault)}
              href="mailto:partners@gravii.io"
            >
              {plan.cta}
            </a>
          </article>
        ))}
      </div>

      <div className={styles.kyaPricingNote}>
        Enterprise KYA available as part of Gate Enterprise bundle. <a href="#pricing">See Enterprise pricing →</a>
      </div>
    </div>
  )
}

export function ProductTabs({
  dimension,
  onDimensionChange,
}: {
  dimension: LandingDimension
  onDimensionChange: (value: LandingDimension) => void
}) {
  const [activeTabId, setActiveTabId] = useState<ProductTabId>('engage')
  const [hasInteracted, setHasInteracted] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  function switchDimension(nextDimension: LandingDimension) {
    onDimensionChange(nextDimension)

    window.requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })
  }

  return (
    <div ref={sectionRef}>
      <div className={styles.dimensionToggle}>
        <button
          className={cn(
            styles.buttonReset,
            styles.dimensionToggleButton,
            dimension === 'human' && styles.dimensionToggleButtonActive,
          )}
          data-accent="blue"
          onClick={() => switchDimension('human')}
          type="button"
        >
          <div className={styles.dimensionToggleLabel}>HUMAN INTELLIGENCE</div>
          <div className={styles.dimensionToggleCopy}>Gate · Reach · Lens</div>
        </button>
        <button
          className={cn(
            styles.buttonReset,
            styles.dimensionToggleButton,
            dimension === 'agent' && styles.dimensionToggleButtonActive,
          )}
          data-accent="amber"
          onClick={() => switchDimension('agent')}
          type="button"
        >
          <div className={styles.dimensionToggleLabel}>AGENT INTELLIGENCE</div>
          <div className={styles.dimensionToggleCopy}>KYA</div>
        </button>
      </div>

      {dimension === 'human' ? (
        <>
          <div className={styles.pills}>
            {productTabs.map((tab) => {
              const isActive = tab.id === activeTabId
              const activeAccent =
                !hasInteracted && tab.id === 'engage' && isActive ? 'lav' : tab.accent

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
                    setHasInteracted(true)
                    setActiveTabId(tab.id)
                  }}
                  type="button"
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {activeTabId === 'engage' ? <ReachPanel /> : null}
          {activeTabId === 'verify' ? <VerifyPanel /> : null}
          {activeTabId === 'analyze' ? <AnalyzePanel /> : null}
          {activeTabId === 'users' ? <UsersPanel /> : null}
        </>
      ) : (
        <AgentPanel />
      )}
    </div>
  )
}
