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
      distance={5.6}
      background="var(--gravii-paper)"
    >
      {(progress) => {
        // Lead-in "This is the floor, not the ceiling." — chapter intro
        // char-reveal 0-0.06, hold 0.06-0.14, fade-out 0.14-0.20
        const leadInOpacity =
          Math.min(1, Math.max(0, progress / 0.06)) *
          (1 - Math.min(1, Math.max(0, (progress - 0.14) / 0.06)))
        const leadInCharProgress = Math.min(1, Math.max(0, progress / 0.06))

        // Steps occupy progress 0.20–0.46, then breathe before fading out.
        const stepsIn = Math.min(1, Math.max(0, (progress - 0.2) / 0.04))
        const stepsOut = Math.min(1, Math.max(0, (progress - 0.5) / 0.06))
        const stepsOpacity = stepsIn * (1 - stepsOut)

        // Active step index — cycle through 3 steps over 0.26-0.46.
        const stepCycleProgress = Math.min(
          1,
          Math.max(0, (progress - 0.26) / 0.2)
        )
        const activeStep = Math.min(
          STEPS.length - 1,
          Math.floor(stepCycleProgress * STEPS.length)
        )

        // Finale slot fade-in 0.48–0.52, leaving enough room for the final CTA
        // to be readable before the footer arrives.
        const finaleIn = Math.min(1, Math.max(0, (progress - 0.48) / 0.04))

        // Stage 1 "From wallet to way of life." — reveal, hold, peel.
        const stage1CharProgress = Math.min(
          1,
          Math.max(0, (progress - 0.5) / 0.06)
        )
        const stage1PeelProgress = Math.min(
          1,
          Math.max(0, (progress - 0.62) / 0.06)
        )
        const stage1Visible = progress < 0.68 ? 1 : 0

        // Stage 2 "Connect once. Live differently." — reveal earlier, hold longer.
        const stage2CharProgress = Math.min(
          1,
          Math.max(0, (progress - 0.66) / 0.06)
        )
        const stage2In = Math.min(1, Math.max(0, (progress - 0.66) / 0.06))
        const stage2Out = Math.min(1, Math.max(0, (progress - 0.78) / 0.04))
        const stage2Opacity = stage2In * (1 - stage2Out)

        // Stage 3 "we've burnt the old playbook." — reveal before CTA appears.
        const stage3CharProgress = Math.min(
          1,
          Math.max(0, (progress - 0.79) / 0.05)
        )
        const stage3Opacity = Math.min(1, Math.max(0, (progress - 0.79) / 0.05))

        // CTA pill fade-in 0.90-0.94, then hold before the footer.
        const ctaIn = Math.min(1, Math.max(0, (progress - 0.9) / 0.04))

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
