'use client'

import { Shield, SlidersHorizontal, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useMemo } from 'react'

import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import {
  getRecommendedPagesForScenario,
  workspaceSurfaceOptions
} from '@/lib/workspace-navigation'
import { useWorkspaceSettings, writeWorkspaceSettings } from '@/lib/workspace-settings'

import {
  workspaceScenarios,
  type WorkspaceSettingsState
} from './data'
import styles from './settings-page.module.css'

export function SettingsPage() {
  const state = useWorkspaceSettings()

  const activeScenario = useMemo(
    () => workspaceScenarios.find((scenario) => scenario.id === state.scenario) ?? workspaceScenarios[0],
    [state.scenario]
  )

  const updateState = (updater: (current: WorkspaceSettingsState) => WorkspaceSettingsState) => {
    writeWorkspaceSettings(updater(state))
  }

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow="Settings"
        title="Workspace configuration now behaves like a real product preference surface."
        description="Instead of a one-off onboarding overlay, the chosen operating mode and enabled modules are now explicit, editable, and persisted locally for iterative product work."
      />

      <section className="grid-auto-4">
        <Card title="Partner account">
          <p className={styles.value}>Pendle Finance</p>
          <p className={styles.helper}>Engage plan · Sandbox environment</p>
        </Card>
        <Card title="Current scenario">
          <p className={styles.value}>{activeScenario.title}</p>
          <p className={styles.helper}>{activeScenario.description}</p>
        </Card>
        <Card title="Enabled pages">
          <p className={styles.value}>{state.enabledPages.length}</p>
          <p className={styles.helper}>Individual sidebar surfaces currently exposed in the workspace</p>
        </Card>
        <Card title="Risk review mode">
          <p className={styles.value}>{state.strictRiskReview ? 'Strict' : 'Balanced'}</p>
          <p className={styles.helper}>Applied before campaigns move from draft to live</p>
        </Card>
      </section>

      <div className="grid-auto-2">
        <Card title="Workspace scenarios" eyebrow="Recommended presets" accent="blue">
          <div className={styles.scenarioList}>
            {workspaceScenarios.map((scenario) => {
              const isActive = state.scenario === scenario.id

              return (
                <button
                  key={scenario.id}
                  type="button"
                  className={`${styles.scenarioCard} ${isActive ? styles.scenarioCardActive : ''}`}
                  onClick={() =>
                    updateState((current) => ({
                      ...current,
                      scenario: scenario.id,
                      enabledPages: getRecommendedPagesForScenario(scenario.id),
                      enabledModules: scenario.recommendedModules
                    }))
                  }
                >
                  <div className={styles.scenarioHeader}>
                    <div>
                      <h3>{scenario.title}</h3>
                      <p>{scenario.description}</p>
                    </div>
                    <Sparkles size={18} />
                  </div>
                  <div className={styles.scenarioTags}>
                    {getRecommendedPagesForScenario(scenario.id).map((pageId) => (
                      <span key={pageId} className="pill">
                        {workspaceSurfaceOptions.find((surface) => surface.pageId === pageId)?.label ?? pageId}
                      </span>
                    ))}
                  </div>
                </button>
              )
            })}
          </div>
        </Card>

        <Card title="Enabled pages" eyebrow="Navigation switches" accent="teal">
          <div className={styles.moduleList}>
            {workspaceSurfaceOptions.map((surface) => {
              const enabled = state.enabledPages.includes(surface.pageId)

              return (
                <div key={surface.pageId} className={styles.moduleRow}>
                  <div>
                    <h3>{surface.label}</h3>
                    <p>{surface.section} surface · {surface.href}</p>
                  </div>
                  <button
                    type="button"
                    className={`${styles.toggle} ${enabled ? styles.toggleActive : ''}`}
                    onClick={() =>
                      updateState((current) => ({
                        ...current,
                        enabledPages: enabled
                          ? current.enabledPages.filter((item) => item !== surface.pageId)
                          : [...current.enabledPages, surface.pageId]
                      }))
                    }
                    aria-pressed={enabled}
                  >
                    <span />
                  </button>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      <section className="grid-auto-2">
        <Card title="Operational preferences" eyebrow="Policy controls" accent="amber">
          <div className={styles.preferenceList}>
            <button
              type="button"
              className={styles.preferenceCard}
              onClick={() =>
                updateState((current) => ({
                  ...current,
                  strictRiskReview: !current.strictRiskReview
                }))
              }
            >
              <div className={styles.preferenceHeader}>
                <Shield size={18} />
                <div>
                  <h3>Strict risk review</h3>
                  <p>Require a risk sign-off before campaign launch.</p>
                </div>
              </div>
              <strong>{state.strictRiskReview ? 'Enabled' : 'Disabled'}</strong>
            </button>

            <button
              type="button"
              className={styles.preferenceCard}
              onClick={() =>
                updateState((current) => ({
                  ...current,
                  weeklyDigest: !current.weeklyDigest
                }))
              }
            >
              <div className={styles.preferenceHeader}>
                <SlidersHorizontal size={18} />
                <div>
                  <h3>Weekly operator digest</h3>
                  <p>Summarize growth, risk, and reach changes each week.</p>
                </div>
              </div>
              <strong>{state.weeklyDigest ? 'Enabled' : 'Disabled'}</strong>
            </button>
          </div>
        </Card>

        <Card title="Implementation note" eyebrow="Refactor outcome">
          <div className={styles.noteBlock}>
            <p>
              Settings is now a typed preference surface rather than a hard-coded overlay. This
              makes it much easier to persist real workspace settings from an API later.
            </p>
            <p>
              The selected scenario already drives recommended module composition, so wiring it into
              auth roles or feature flags later becomes straightforward.
            </p>
            <p>
              Need to change the whole workspace flow?{' '}
              <Link href="/" className={styles.setupLink}>
                Re-run onboarding -&gt;
              </Link>
            </p>
          </div>
        </Card>
      </section>
    </div>
  )
}
