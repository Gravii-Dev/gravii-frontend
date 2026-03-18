'use client'

import { ArrowUpRight, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'

import { connectHighlights, integrationModules } from './data'
import styles from './connect-page.module.css'

const toneClassMap = {
  blue: styles.toneBlue,
  teal: styles.toneTeal,
  amber: styles.toneAmber
} as const

interface ConnectPageProps {
  activeModuleId?: string
}

const inviteLink = 'https://gravii.io/ref/PARTNER_CODE'
const apiKey = 'grv_live_partner_4e72d0f8c2e1'
const docsUrl = 'https://docs.gravii.example.com/gate-api'
const agentExample = `POST /v1/agent/verify-condition
{
  "wallet": "0xabc...123",
  "condition": "is_gold_or_above"
}`

export function ConnectPage({ activeModuleId }: ConnectPageProps) {
  const [copiedInvite, setCopiedInvite] = useState(false)
  const [showReferralPreview, setShowReferralPreview] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [discordConnected, setDiscordConnected] = useState(false)
  const [telegramConnected, setTelegramConnected] = useState(false)
  const [showAgentExample, setShowAgentExample] = useState(false)
  const [creditsRequested, setCreditsRequested] = useState(false)

  const handlePrimaryAction = async (moduleId: string) => {
    if (moduleId === 'xray-link') {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(inviteLink)
        } catch {
          // Keep the prototype flow responsive even when clipboard permissions are blocked.
        }
      }

      setCopiedInvite(true)
      window.setTimeout(() => setCopiedInvite(false), 1800)
      return
    }

    if (moduleId === 'gate-api') {
      setShowApiKey((current) => !current)
      return
    }

    if (moduleId === 'community-bot') {
      setDiscordConnected((current) => !current)
      return
    }

    if (moduleId === 'agent-api') {
      setShowAgentExample((current) => !current)
    }
  }

  const handleSecondaryAction = (moduleId: string) => {
    if (moduleId === 'xray-link') {
      setShowReferralPreview((current) => !current)
      return
    }

    if (moduleId === 'community-bot') {
      setTelegramConnected((current) => !current)
      return
    }

    if (moduleId === 'agent-api') {
      setCreditsRequested(true)
    }
  }

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow="Connect"
        title="Choose the right activation surface for the scenario you selected at entry."
        description="This page now behaves like the original product flow: scenario selection can drop partners directly into the most relevant Connect module."
      />

      <section className="grid-auto-3">
        {connectHighlights.map((item) => (
          <Card key={item.label} title={item.label}>
            <p className={styles.highlightValue}>{item.value}</p>
            <p className={styles.highlightHelper}>{item.helper}</p>
          </Card>
        ))}
      </section>

      <section className="grid-auto-2">
        {integrationModules.map((module) => {
          const isActive = activeModuleId === module.id

          return (
            <Card
              key={module.id}
              eyebrow={module.category}
              title={module.title}
              accent={module.tone}
              className={`${styles.moduleCard} ${isActive ? styles.moduleCardActive : ''}`}
            >
              <div className={styles.moduleBody}>
                {isActive ? (
                  <span className={styles.activeBadge}>Recommended for your selected scenario</span>
                ) : null}
                <p className={styles.moduleDescription}>{module.description}</p>
                <div className={`${styles.detailBlock} ${toneClassMap[module.tone]}`}>
                  <CheckCircle2 size={16} />
                  <span>{module.detail}</span>
                </div>

                {module.id === 'xray-link' ? (
                  <div className={styles.feedbackBlock}>
                    <div className={styles.inlineLabelRow}>
                      <span className={styles.feedbackLabel}>Partner invite link</span>
                      {copiedInvite ? <span className={styles.statusPositive}>Copied</span> : null}
                    </div>
                    <code className={styles.codeInline}>{inviteLink}</code>
                    {showReferralPreview ? (
                      <div className={styles.previewPanel}>
                        <strong>Referral preview</strong>
                        <p>Wallet connects through Gravii, gets profiled, then lands in your partner campaign page.</p>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {module.id === 'gate-api' ? (
                  <div className={styles.feedbackBlock}>
                    <div className={styles.inlineLabelRow}>
                      <span className={styles.feedbackLabel}>API key</span>
                      <a href={docsUrl} className={styles.inlineLink} target="_blank" rel="noreferrer">
                        Open docs
                      </a>
                    </div>
                    <code className={styles.codeInline}>{showApiKey ? apiKey : '••••••••••••••••••••••••'}</code>
                  </div>
                ) : null}

                {module.id === 'community-bot' ? (
                  <div className={styles.feedbackBlock}>
                    <div className={styles.statusRow}>
                      <span className={styles.feedbackLabel}>Discord</span>
                      <span className={discordConnected ? styles.statusPositive : styles.statusMuted}>
                        {discordConnected ? 'Connected' : 'Not connected'}
                      </span>
                    </div>
                    <div className={styles.statusRow}>
                      <span className={styles.feedbackLabel}>Telegram</span>
                      <span className={telegramConnected ? styles.statusPositive : styles.statusMuted}>
                        {telegramConnected ? 'Connected' : 'Not connected'}
                      </span>
                    </div>
                  </div>
                ) : null}

                {module.id === 'agent-api' ? (
                  <div className={styles.feedbackBlock}>
                    {showAgentExample ? <pre className={styles.codeBlock}>{agentExample}</pre> : null}
                    {creditsRequested ? (
                      <p className={styles.statusPositive}>Credits request queued for partner review.</p>
                    ) : null}
                  </div>
                ) : null}

                <div className={styles.moduleActions}>
                  <button
                    type="button"
                    className="button-primary"
                    onClick={() => {
                      void handlePrimaryAction(module.id)
                    }}
                  >
                    {module.id === 'xray-link' && copiedInvite ? 'Copied link' : module.ctaLabel}
                    <ArrowUpRight size={16} />
                  </button>
                  {module.secondaryLabel ? (
                    module.id === 'gate-api' ? (
                      <a href={docsUrl} className="button-secondary" target="_blank" rel="noreferrer">
                        {module.secondaryLabel}
                      </a>
                    ) : (
                      <button
                        type="button"
                        className="button-secondary"
                        onClick={() => handleSecondaryAction(module.id)}
                      >
                        {module.secondaryLabel}
                      </button>
                    )
                  ) : null}
                </div>
              </div>
            </Card>
          )
        })}
      </section>

      <Card title="Why this refactor matters" eyebrow="Product architecture">
        <div className={styles.reasonGrid}>
          <article>
            <h3>Clear service boundaries</h3>
            <p>
              Each integration now lives in its own product module instead of being buried behind
              prototype navigation switches.
            </p>
          </article>
          <article>
            <h3>Ready for backend wiring</h3>
            <p>
              The UI is data-driven, so a real API key service, invite service, or docs link can be
              connected with minimal component churn.
            </p>
          </article>
          <article>
            <h3>Better partner comprehension</h3>
            <p>
              Partners can immediately see what each activation surface does, who owns it, and what
              action they should take next.
            </p>
          </article>
        </div>
      </Card>
    </div>
  )
}
