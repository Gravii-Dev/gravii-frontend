'use client'

import { ChapterPanel } from '@/components/effects/chapter-panel'
import { DisplayMoment } from '@/components/effects/display-moment'
import { CtaPill } from './cta-pill'
import s from './vision.module.css'

const ACCENT = '#d65b9c'

const STEPS = [
  {
    label: 'Phase 1',
    text: 'Online, in the Gravii app — your deals find you.',
  },
  {
    label: 'Phase 2',
    text: 'Then, in any service Gravii reaches — online or off.',
  },
  {
    label: 'Phase 3',
    text: 'Finally, a new Gravii — for the agents.',
  },
] as const

export function Vision() {
  return (
    <ChapterPanel
      id="vision"
      distance={3.6}
      overlap
      background="var(--gravii-paper)"
    >
      {(progress) => {
        // Lead-in "This is the floor, not the ceiling." — chapter intro
        // char-reveal 0-0.06, hold 0.06-0.12, fade-out 0.12-0.18
        const leadInOpacity =
          Math.min(1, Math.max(0, progress / 0.06)) *
          (1 - Math.min(1, Math.max(0, (progress - 0.12) / 0.06)))
        const leadInCharProgress = Math.min(1, Math.max(0, progress / 0.06))

        // Steps occupy progress 0.20–0.55 (stepping through Now/Next/After)
        // Steps fade-in 0.20-0.24, active stepping 0.24-0.55, fade-out 0.55-0.60
        const stepsIn = Math.min(1, Math.max(0, (progress - 0.2) / 0.04))
        const stepsOut = Math.min(1, Math.max(0, (progress - 0.55) / 0.05))
        const stepsOpacity = stepsIn * (1 - stepsOut)

        // Active step index — cycle through 3 steps over 0.24-0.55 (31%)
        const stepCycleProgress = Math.min(
          1,
          Math.max(0, (progress - 0.24) / 0.31)
        )
        const activeStep = Math.min(
          STEPS.length - 1,
          Math.floor(stepCycleProgress * STEPS.length)
        )

        // Finale slot fade-in 0.58–0.62 (wraps the 3 stages; mostly held at 1)
        const finaleIn = Math.min(1, Math.max(0, (progress - 0.58) / 0.04))

        // Stage 1 "From wallet to way of life." — char-reveal 0.60-0.66, hold 0.66-0.72, peel 0.72-0.78
        const stage1CharProgress = Math.min(
          1,
          Math.max(0, (progress - 0.6) / 0.06)
        )
        const stage1PeelProgress = Math.min(
          1,
          Math.max(0, (progress - 0.72) / 0.06)
        )
        const stage1Visible = progress < 0.78 ? 1 : 0

        // Stage 2 "Connect once. Live differently." — char-reveal 0.78-0.84, hold 0.84-0.88, fade-out 0.88-0.90
        const stage2CharProgress = Math.min(
          1,
          Math.max(0, (progress - 0.78) / 0.06)
        )
        const stage2In = Math.min(1, Math.max(0, (progress - 0.78) / 0.06))
        const stage2Out = Math.min(1, Math.max(0, (progress - 0.88) / 0.02))
        const stage2Opacity = stage2In * (1 - stage2Out)

        // Stage 3 "we've burnt the old playbook." — char-reveal 0.90-0.94, hold to end
        const stage3CharProgress = Math.min(
          1,
          Math.max(0, (progress - 0.9) / 0.04)
        )
        const stage3Opacity = Math.min(1, Math.max(0, (progress - 0.9) / 0.04))

        // CTA pill fade-in 0.96-1.00, below stage 3
        const ctaIn = Math.min(1, Math.max(0, (progress - 0.96) / 0.04))

        return (
          <div className={s.stage}>
            <div
              className={s.leadIn}
              style={{
                opacity: leadInOpacity,
                transform: `translate3d(0, ${(1 - leadInOpacity) * 32}px, 0)`,
              }}
            >
              <DisplayMoment
                text={'But this is just the floor,\nnot the ceiling.'}
                size="heading-lg"
                align="center"
                accent={ACCENT}
                highlightWords={['ceiling']}
                progress={leadInCharProgress}
              />
            </div>

            <div
              className={s.steps}
              style={{
                opacity: stepsOpacity,
                transform: `translate3d(0, ${(1 - stepsOpacity) * 8}vh, 0)`,
              }}
            >
              <ol className={s.stepList}>
                {STEPS.map((step, i) => {
                  const isActive = i === activeStep
                  const localFade = isActive ? 1 : 0.22
                  return (
                    <li
                      key={step.label}
                      className={s.stepItem}
                      data-active={isActive ? 'true' : undefined}
                      style={{ opacity: localFade }}
                    >
                      <span
                        className={s.stepLabel}
                        style={{ color: isActive ? ACCENT : undefined }}
                      >
                        {step.label}
                      </span>
                      <p className={s.stepText}>{step.text}</p>
                    </li>
                  )
                })}
              </ol>
            </div>

            <div
              className={s.finale}
              style={{
                opacity: finaleIn,
                transform: `translate3d(0, ${(1 - finaleIn) * 32}px, 0)`,
              }}
            >
              <div className={s.stageSlot}>
                <div
                  className={s.finaleStage}
                  style={{ opacity: stage1Visible }}
                >
                  <DisplayMoment
                    text="From wallet to way of life."
                    size="heading-lg"
                    align="center"
                    accent={ACCENT}
                    highlightWords={['life']}
                    progress={stage1CharProgress}
                    peelOutProgress={stage1PeelProgress}
                  />
                </div>
                <div
                  className={s.finaleStage}
                  data-bookend={
                    stage2Opacity > 0.5 && stage2Opacity < 0.99 ? 'true' : 'false'
                  }
                  style={{ opacity: stage2Opacity }}
                >
                  <DisplayMoment
                    text="Connect once. Live differently."
                    size="heading-lg"
                    align="center"
                    accent={ACCENT}
                    highlightWords={['differently']}
                    progress={stage2CharProgress}
                  />
                </div>
                <div
                  className={s.finaleStage}
                  style={{ opacity: stage3Opacity }}
                >
                  <DisplayMoment
                    text="we've burnt the old playbook."
                    size="heading-lg"
                    align="center"
                    accent={ACCENT}
                    highlightWords={['burnt']}
                    progress={stage3CharProgress}
                  />
                </div>
              </div>

              <div
                className={s.ctaSlot}
                style={{
                  opacity: ctaIn,
                  transform: `translate3d(0, ${(1 - ctaIn) * 12}px, 0)`,
                  pointerEvents: ctaIn > 0.5 ? 'auto' : 'none',
                }}
              >
                <CtaPill />
              </div>
            </div>

            <div
              className={s.wash}
              aria-hidden="true"
              style={{ opacity: finaleIn * 0.9 }}
            />
          </div>
        )
      }}
    </ChapterPanel>
  )
}
