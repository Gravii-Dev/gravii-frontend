'use client'

import { useRouter } from 'next/navigation'
import { startTransition, useState } from 'react'

import {
  getWorkspaceScenario,
  type WorkspaceScenarioId
} from '@/lib/workspace-scenarios'
import {
  createWorkspaceSettingsForScenario,
  writeWorkspaceSettings
} from '@/lib/workspace-settings'

import styles from './onboarding-page.module.css'

interface ScenarioCardProps {
  title: string
  description: string
  onSelect: () => void
  isPending: boolean
  tone: 'teal' | 'purple' | 'blue'
  centered?: boolean
  animationClassName?: string
}

function ScenarioCard({
  title,
  description,
  onSelect,
  isPending,
  tone,
  centered = false,
  animationClassName
}: ScenarioCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`${styles.glassCard} ${styles[`glass${tone}`]} ${centered ? styles.centeredCard : ''} ${animationClassName ?? ''}`}
      disabled={isPending}
    >
      <div className={styles.cardTitle}>{isPending ? 'Opening...' : title}</div>
      <div className={styles.cardDescription}>{description}</div>
    </button>
  )
}

export function OnboardingPage() {
  const router = useRouter()
  const [pendingScenario, setPendingScenario] = useState<WorkspaceScenarioId | null>(null)

  const openScenario = (scenarioId: WorkspaceScenarioId) => {
    const scenario = getWorkspaceScenario(scenarioId)

    if (!scenario) {
      return
    }

    writeWorkspaceSettings(createWorkspaceSettingsForScenario(scenarioId))
    setPendingScenario(scenarioId)

    startTransition(() => {
      router.push(scenario.destination)
    })
  }

  return (
    <div className={styles.page}>
      <div className={styles.cosmicGlow} aria-hidden="true" />

      <div className={styles.container}>
        <header className={styles.header}>
          <div className={`${styles.eyebrow} ${styles.fadeInOne}`}>Deterministic On-Chain Intelligence</div>
          <h1 className={`${styles.title} ${styles.bounceIn}`}>
            Welcome to <span>Gravii</span>
          </h1>
          <p className={`${styles.subtitle} ${styles.fadeInTwo}`}>How would you like to get started?</p>
        </header>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>GRAVII REACH</div>
            <div className={styles.panelSubtitle}>
              Grow your ecosystem efficiently with precision campaigns
            </div>
          </div>

          <div className={styles.reachGrid}>
            <ScenarioCard
              title="Your ecosystem only"
              description="Target and engage users already on your platform. No outside exposure — pure internal optimization."
              isPending={pendingScenario === 'engage-private'}
              onSelect={() => openScenario('engage-private')}
              tone="teal"
              animationClassName={styles.fadeInThree}
            />
            <ScenarioCard
              title="Expand with Gravii pool"
              description="Reach your existing users and tap into Gravii's verified network at once. You control the mix."
              isPending={pendingScenario === 'engage-grow'}
              onSelect={() => openScenario('engage-grow')}
              tone="teal"
              animationClassName={styles.fadeInThree}
            />
            <ScenarioCard
              title="Discover new users"
              description="Handpick verified users from the Gravii pool by tier, persona, and chain. Solve cold start instantly."
              isPending={pendingScenario === 'engage-acquire'}
              onSelect={() => openScenario('engage-acquire')}
              tone="teal"
              animationClassName={styles.fadeInThree}
            />
          </div>
        </section>

        <div className={styles.bottomGrid}>
          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <div className={styles.panelTitle}>GRAVII LENS</div>
              <div className={styles.panelSubtitle}>Diagnose your ecosystem health</div>
            </div>

            <ScenarioCard
              title="See your user pool"
              description="Just a wallet list is all we need — zero engineering cost"
              isPending={pendingScenario === 'analyze'}
              onSelect={() => openScenario('analyze')}
              tone="purple"
              animationClassName={styles.fadeInFour}
            />
          </section>

          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <div className={styles.panelTitle}>GRAVII GATE</div>
              <div className={styles.panelSubtitle}>Protect your platform and verify on first touch</div>
            </div>

            <div className={styles.gateGrid}>
              <ScenarioCard
                title="Web API"
                description="Real-time verification on your platform"
                isPending={pendingScenario === 'verify-api'}
                onSelect={() => openScenario('verify-api')}
                tone="blue"
                centered
                animationClassName={styles.fadeInFive}
              />
              <ScenarioCard
                title="Community Bot"
                description="Discord / Telegram — No code needed"
                isPending={pendingScenario === 'verify-bot'}
                onSelect={() => openScenario('verify-bot')}
                tone="blue"
                centered
                animationClassName={styles.fadeInFive}
              />
              <ScenarioCard
                title="Agent API"
                description="Let your AI agents verify users instantly"
                isPending={pendingScenario === 'verify-agent'}
                onSelect={() => openScenario('verify-agent')}
                tone="blue"
                centered
                animationClassName={styles.fadeInFive}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
