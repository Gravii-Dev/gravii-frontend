'use client'

import clsx from 'clsx'
import { ChapterPanel } from '@/components/effects/chapter-panel'
import { DisplayMoment } from '@/components/effects/display-moment'
import s from './bridge.module.css'

const ACCENT_NOW = '#ff8709'
const ACCENT_BRAND = '#6b5dff'

export function Bridge() {
  return (
    <ChapterPanel
      id="bridge"
      distance={3.4}
      background="var(--gravii-paper)"
    >
      {(progress) => {
        // Phase A — Beat 1 enter (char-by-char via DisplayMoment), hold, scale-fade exit
        const beat1In = Math.min(1, Math.max(0, (progress - 0.02) / 0.18))
        const beat1Exit = Math.min(1, Math.max(0, (progress - 0.32) / 0.1))
        const beat1Opacity = beat1In * (1 - beat1Exit)
        const beat1Scale =
          1 + Math.min(1, Math.max(0, (progress - 0.18) / 0.24)) * 0.18

        // Pivot — hairline draws beneath Beat 2 only, retracts BEFORE Beat 3 enters.
        // Draw in 0.40-0.46, hold 0.46-0.60, retract 0.60-0.66 (gone by Beat 3 start)
        const hairlineDrawIn = Math.min(1, Math.max(0, (progress - 0.4) / 0.06))
        const hairlineRetract = Math.min(
          1,
          Math.max(0, (progress - 0.6) / 0.06)
        )
        const hairlineWidth = hairlineDrawIn * (1 - hairlineRetract)

        // Beat 2 "But the reset ends with Gravii." — SLAM-STOP: chars slam in fast (2%) then long hold
        // in 0.40-0.42 (slam), hold 0.42-0.60, out 0.60-0.66. Single brand-reveal anchor (violet).
        const beat2In = Math.min(1, Math.max(0, (progress - 0.4) / 0.02))
        const beat2Out = Math.min(1, Math.max(0, (progress - 0.6) / 0.06))
        const beat2Opacity = beat2In * (1 - beat2Out)

        // Phase C — Beat 3 reveal earlier, longer hold (in 0.66-0.80, hold 0.80-1.0)
        const beat3In = Math.min(1, Math.max(0, (progress - 0.66) / 0.14))

        // Gravitational pull — final 6% of progress, after a longer Beat 3 read.
        // Visual rhyme with "Gravii ≡ Gravity" brand identity
        const gravPull = Math.min(1, Math.max(0, (progress - 0.94) / 0.06))

        // External char-reveal — pinned chapters can't rely on DisplayMoment's
        // bounds-based auto progress (element stays fixed in viewport).
        const beat1CharProgress = Math.min(
          1,
          Math.max(0, (progress - 0.02) / 0.18)
        )
        // Beat 1 tail "Over and over." fades in after char-reveal of lines 1-2
        // completes (0.18-0.21). Larger + bold for emphasis.
        const beat1TailIn = Math.min(
          1,
          Math.max(0, (progress - 0.18) / 0.03)
        )
        const beat2CharProgress = Math.min(
          1,
          Math.max(0, (progress - 0.4) / 0.02)
        )
        const beat3CharProgress = Math.min(
          1,
          Math.max(0, (progress - 0.66) / 0.14)
        )

        return (
          <div className={s.stage}>
            <div
              className={s.beat1}
              style={{
                opacity: beat1Opacity,
                transform: `translate3d(0, ${(1 - beat1In) * 24}px, 0) scale(${beat1Scale})`,
              }}
            >
              <DisplayMoment
                text={'So the reset begins.\nYou start from zero.'}
                size="heading-lg"
                align="center"
                accent={ACCENT_NOW}
                highlightWords={['zero']}
                className={clsx(s.beat1Display)}
                progress={beat1CharProgress}
              />
              <p
                className={s.beat1Tail}
                style={{ opacity: beat1TailIn }}
              >
                Over and over.
              </p>
            </div>

            <div
              className={s.hairline}
              aria-hidden="true"
              style={{ transform: `scaleX(${hairlineWidth})` }}
            />

            <div className={s.beat2} style={{ opacity: beat2Opacity }}>
              <DisplayMoment
                text="But the reset ends with Gravii."
                size="heading-lg"
                align="center"
                accent={ACCENT_BRAND}
                highlightWords={['Gravii']}
                progress={beat2CharProgress}
              />
            </div>

            <div
              className={s.beat3}
              style={{
                opacity: beat3In * (1 - gravPull * 0.55),
                transform: `translate3d(0, calc(${(1 - beat3In) * 32}px - ${gravPull * 24}vh), 0) scale(${1 - gravPull * 0.3})`,
                filter: gravPull > 0 ? `blur(${gravPull * 8}px)` : undefined,
                willChange: 'transform, opacity, filter',
              }}
            >
              <DisplayMoment
                text={'Now the world follows\nyour reputation.'}
                size="heading-lg"
                align="center"
                accent={ACCENT_NOW}
                highlightWords={['follows']}
                progress={beat3CharProgress}
              />
            </div>
          </div>
        )
      }}
    </ChapterPanel>
  )
}
