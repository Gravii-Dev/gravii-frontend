'use client'

import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { integrationModules } from './data'
import styles from './connect-page.module.css'

type ConnectModuleId = (typeof integrationModules)[number]['id']

interface FocusStat {
  label: string
  meta?: string
  value: string
}

interface FocusViewConfig {
  pageTitle: string
  cardTitle: string
  description: string
  stats?: FocusStat[]
}

const docsUrl = 'https://gravii-partner-api-1077809741476.europe-west6.run.app/docs'
const inviteLink = 'https://gravii.io/ref/PARTNER_CODE'
const apiKeyMasked = 'gv_live_••••••••••••••••'
const apiKeyLive = 'gv_live_partner_4e72d0f8c2e1'
const apiExample = `GET /v1/lookup/{wallet_address}
Authorization: Bearer gv_live_...

Response: { tier, persona, valueRange, sybilStatus, ... }`
const agentExample = `POST /v1/agent/verify-condition

"Is this wallet >= Platinum AND a Yield Explorer?"
→ true / false`

const focusViewMap: Record<ConnectModuleId, FocusViewConfig> = {
  'xray-link': {
    cardTitle: 'X-Ray Your Users',
    description:
      "Share your unique link with your users. Gravii's deep analysis engine profiles their on-chain identity, tags them to your account, and they land on your User Dashboard automatically.",
    pageTitle: 'Gravii Reach'
  },
  'gate-api': {
    cardTitle: 'Gate — API Integration',
    description:
      'Integrate Gravii Gate API into your service. When users connect their wallet on your platform, instantly check their Gravii ID tier, behavioral profile, and value range.',
    pageTitle: 'Gate — API Setup',
    stats: [
      { label: 'Queries This Month', meta: '/ 500 (Free tier)', value: '—' },
      { label: 'Unique Users Queried', value: '—' },
      { label: 'Gravii ID Hit Rate', value: '—' },
      { label: 'Avg Response Time', value: '—' }
    ]
  },
  'community-bot': {
    cardTitle: 'Gate — Community Bot',
    description:
      "Invite Gravii's native bot to your Discord or Telegram server. Users verify their wallet in-app — the bot auto-assigns roles based on tier and persona. No code needed.",
    pageTitle: 'Gate — Community Bot',
    stats: [
      { label: 'Verified Users', value: '—' },
      { label: 'Servers Connected', value: '—' },
      { label: 'Roles Assigned', value: '—' },
      { label: 'Plan', meta: '500 active verified users/mo', value: 'Seed' }
    ]
  },
  'agent-api': {
    cardTitle: 'Gate — Agent API',
    description:
      'A Zero-Knowledge Boolean endpoint for AI agents. Returns only true/false — never user profiles. Data scraping is structurally impossible.',
    pageTitle: 'Gate — Agent API',
    stats: [
      { label: 'Credit Balance', value: '—' },
      { label: 'Calls This Month', value: '—' },
      { label: 'Unique Agents', value: '—' },
      { label: 'Avg Response', value: '—' }
    ]
  }
}

function isConnectModuleId(value: string | undefined): value is ConnectModuleId {
  return integrationModules.some((module) => module.id === value)
}

interface ConnectPageProps {
  activeModuleId?: string
}

export function ConnectPage({ activeModuleId }: ConnectPageProps) {
  const [copiedInvite, setCopiedInvite] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [discordConnected, setDiscordConnected] = useState(false)
  const [telegramConnected, setTelegramConnected] = useState(false)

  const resolvedModuleId: ConnectModuleId = isConnectModuleId(activeModuleId)
    ? activeModuleId
    : 'xray-link'

  const focusView = focusViewMap[resolvedModuleId]

  return (
    <div className={styles.page}>
      <div className={styles.mainHeader}>
        <h1 className={styles.mainTitle}>{focusView.pageTitle}</h1>
      </div>

      <section className={styles.heroCard}>
        <div className={styles.heroTitle}>{focusView.cardTitle}</div>
        <p className={styles.heroDescription}>{focusView.description}</p>

        {resolvedModuleId === 'xray-link' ? (
          <div className={styles.inlinePanel}>
            <div className={styles.inlinePanelLabel}>Your X-Ray Link</div>
            <div className={styles.inlineActionRow}>
              <input
                type="text"
                className={styles.inlineInput}
                readOnly
                value={inviteLink}
              />
              <button
                type="button"
                className="button-primary"
                onClick={async () => {
                  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
                    await navigator.clipboard.writeText(inviteLink)
                  }

                  setCopiedInvite(true)
                  window.setTimeout(() => setCopiedInvite(false), 1800)
                }}
              >
                {copiedInvite ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        ) : null}

        {resolvedModuleId === 'gate-api' ? (
          <>
            <div className={`${styles.inlinePanel} ${styles.inlinePanelSpacing}`}>
              <div className={styles.inlinePanelLabel}>Your API Key</div>
              <div className={styles.inlineActionRow}>
                <input
                  type="text"
                  className={styles.inlineInput}
                  readOnly
                  value={showApiKey ? apiKeyLive : apiKeyMasked}
                />
                <button
                  type="button"
                  className="button-primary"
                  onClick={() => setShowApiKey((current) => !current)}
                >
                  {showApiKey ? 'Hide' : 'Reveal'}
                </button>
              </div>
            </div>

            <div className={styles.codePanel}>
              <div className={styles.inlinePanelLabel}>Quick Start</div>
              <pre className={styles.codeBlock}>{apiExample}</pre>
            </div>
          </>
        ) : null}

        {resolvedModuleId === 'community-bot' ? (
          <>
            <div className={styles.buttonRow}>
              <button
                type="button"
                className="button-primary"
                onClick={() => setDiscordConnected((current) => !current)}
              >
                {discordConnected ? 'Discord Connected' : 'Connect Discord'}
              </button>
              <button
                type="button"
                className="button-secondary"
                onClick={() => setTelegramConnected((current) => !current)}
              >
                {telegramConnected ? 'Telegram Connected' : 'Connect Telegram'}
              </button>
            </div>
            <div className={styles.helperText}>
              Bot is operated by Gravii — data never reaches your servers.
            </div>
          </>
        ) : null}

        {resolvedModuleId === 'agent-api' ? (
          <>
            <div className={styles.codePanel}>
              <div className={styles.inlinePanelLabel}>Example</div>
              <pre className={styles.codeBlock}>{agentExample}</pre>
            </div>
            <div className={styles.helperText}>
              Billing: Pre-paid Credit (USDC) · Micro-transaction per call
            </div>
          </>
        ) : null}
      </section>

      {focusView.stats ? (
        <section className={styles.statsGrid}>
          {focusView.stats.map((stat) => (
            <article key={stat.label} className={styles.statCard}>
              <div className={styles.statLabel}>{stat.label}</div>
              <div className={styles.statValue}>{stat.value}</div>
              {stat.meta ? <div className={styles.statMeta}>{stat.meta}</div> : null}
            </article>
          ))}
        </section>
      ) : null}

      {resolvedModuleId === 'xray-link' ? (
        <div className={styles.footerLinkRow}>
          <Link href="/reach" className={styles.inlineLink}>
            Launch on Reach <ArrowUpRight size={14} />
          </Link>
        </div>
      ) : null}

      {resolvedModuleId === 'gate-api' ? (
        <div className={styles.footerLinkRow}>
          <a href={docsUrl} className={styles.inlineLink} target="_blank" rel="noreferrer">
            Full API Documentation (Swagger) <ArrowUpRight size={14} />
          </a>
        </div>
      ) : null}
    </div>
  )
}
