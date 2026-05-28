'use client'

import { ChapterPanel } from '@/components/effects/chapter-panel'
import { DisplayMoment } from '@/components/effects/display-moment'
import s from './inside.module.css'

const ACCENT = '#00bae2'

const PANELS = [
  {
    eyebrow: 'Discovery',
    title: 'What fits, finds you.',
    body: 'Stop searching. The deals, the drops, the chances that fit you arrive on their own. Nothing else.',
  },
  {
    eyebrow: 'Standing',
    title: 'Earned, not declared.',
    body: 'Five categories. Monthly seasons. Four reward what you’ve done, not what you hold. Anyone can climb.',
  },
  {
    eyebrow: 'X-Ray',
    title: 'Every wallet, an open book.',
    body: 'Look up any wallet. The trades, the holdings, the trail walked — laid out for you. Trust by data, not by promise.',
  },
] as const

export function Inside() {
  return (
    <ChapterPanel
      id="inside"
      distance={4.4}
      background="var(--gravii-paper)"
    >
      {(progress) => {
        // Intro 1 "Step inside." — declarative, sets stage
        // char-reveal 0-0.05, hold 0.05-0.10, fade-out 0.10-0.13
        const intro1In = Math.min(1, Math.max(0, progress / 0.05))
        const intro1Out = Math.min(1, Math.max(0, (progress - 0.1) / 0.03))
        const intro1Opacity = intro1In * (1 - intro1Out)
        const intro1CharProgress = Math.min(1, Math.max(0, progress / 0.05))

        // Intro 2 "Gravii recognizes where you've walked." — char-reveal 0.16-0.23, hold 0.23-0.27, fade-out 0.27-0.30
        const intro2In = Math.min(1, Math.max(0, (progress - 0.16) / 0.07))
        const intro2Out = Math.min(1, Math.max(0, (progress - 0.27) / 0.03))
        const intro2Opacity = intro2In * (1 - intro2Out)
        const intro2CharProgress = Math.min(
          1,
          Math.max(0, (progress - 0.16) / 0.07)
        )

        // Intro 3 "And lets the right things find you." — char-reveal 0.33-0.40, hold 0.40-0.44, fade-out 0.44-0.47
        const intro3In = Math.min(1, Math.max(0, (progress - 0.33) / 0.07))
        const intro3Out = Math.min(1, Math.max(0, (progress - 0.44) / 0.03))
        const intro3Opacity = intro3In * (1 - intro3Out)
        const intro3CharProgress = Math.min(
          1,
          Math.max(0, (progress - 0.33) / 0.07)
        )

        // Rail starts after intro 3 fully out (0.50+), range 0.50-0.84 (34%)
        const horizProgress = Math.min(1, Math.max(0, (progress - 0.5) / 0.34))
        // Rail fades in 0.48-0.52, fades OUT 0.80-0.84
        const railOpacity =
          Math.min(1, Math.max(0, (progress - 0.48) / 0.04)) *
          (1 - Math.min(1, Math.max(0, (progress - 0.8) / 0.04)))
        // Stepped rail — hold 24% × 3 + snap 14% × 2 = 100%.
        // Snap zones widened (5% → 14%) + easeInOutQuad applied for smooth slides.
        const easeInOutQuad = (t: number) =>
          t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2
        let railProgress: number
        if (horizProgress < 0.24) {
          railProgress = 0
        } else if (horizProgress < 0.38) {
          railProgress = easeInOutQuad((horizProgress - 0.24) / 0.14)
        } else if (horizProgress < 0.62) {
          railProgress = 1
        } else if (horizProgress < 0.76) {
          railProgress = 1 + easeInOutQuad((horizProgress - 0.62) / 0.14)
        } else {
          railProgress = 2
        }
        // Outro finale — fade in 0.86-0.94, hold 0.94-1.0
        const outroIn = Math.min(1, Math.max(0, (progress - 0.86) / 0.08))

        // Intro 1 iris-open: circle clip-path expands from center
        const intro1Iris = Math.min(100, Math.max(0, intro1In * 100))
        // Intro 2 scan-line sweep: horizontal mask moves L→R during reveal
        const intro2ScanPos = Math.min(100, Math.max(0, intro2In * 100))
        // Intro 3 letters-fly-in: container scale + translate magnet-in feel
        const intro3FlyScale = 0.7 + intro3In * 0.3

        return (
          <div className={s.stage}>
            <div
              className={s.intro}
              style={{
                opacity: intro1Opacity,
                transform: `translate3d(0, ${(1 - intro1Opacity) * 32}px, 0)`,
                clipPath: `circle(${intro1Iris}% at 50% 50%)`,
              }}
            >
              <DisplayMoment
                text="Step inside."
                size="heading-lg"
                align="center"
                accent={ACCENT}
                highlightWords={['inside']}
                progress={intro1CharProgress}
              />
            </div>

            <div
              className={s.intro}
              style={{
                opacity: intro2Opacity,
                transform: `translate3d(0, ${(1 - intro2Opacity) * 32}px, 0)`,
                WebkitMaskImage: `linear-gradient(90deg, #000 ${intro2ScanPos}%, transparent ${Math.min(100, intro2ScanPos + 12)}%)`,
                maskImage: `linear-gradient(90deg, #000 ${intro2ScanPos}%, transparent ${Math.min(100, intro2ScanPos + 12)}%)`,
              }}
            >
              <DisplayMoment
                text="Gravii recognizes where you've walked."
                size="heading-lg"
                align="center"
                accent={ACCENT}
                highlightWords={['Gravii']}
                progress={intro2CharProgress}
              />
            </div>

            <div
              className={s.intro}
              style={{
                opacity: intro3Opacity,
                transform: `translate3d(0, ${(1 - intro3Opacity) * 32}px, 0) scale(${intro3FlyScale})`,
                transformOrigin: 'center center',
                filter: intro3In < 1 ? `blur(${(1 - intro3In) * 6}px)` : undefined,
              }}
            >
              <DisplayMoment
                text="And lets the right things find you."
                size="heading-lg"
                align="center"
                accent={ACCENT}
                highlightWords={['find']}
                progress={intro3CharProgress}
              />
            </div>

            <div
              className={s.rail}
              aria-hidden={progress < 0.48 ? true : undefined}
              style={{ opacity: railOpacity }}
            >
              <div
                className={s.track}
                style={{
                  transform: `translate3d(${-railProgress * 100}vw, 0, 0)`,
                }}
              >
                {PANELS.map((panel, i) => {
                  const dist = Math.abs(railProgress - i)
                  const local = Math.max(0, 1 - dist)
                  return (
                    <article
                      key={panel.eyebrow}
                      className={s.panel}
                      style={{
                        opacity: 0.32 + local * 0.68,
                        transform: `scale(${0.94 + local * 0.06})`,
                      }}
                    >
                      <span className={s.panelIndex}>0{i + 1}</span>
                      <span className={s.panelEyebrow}>{panel.eyebrow}</span>
                      <h3 className={s.panelTitle}>{panel.title}</h3>
                      <p className={s.panelBody}>{panel.body}</p>
                    </article>
                  )
                })}
              </div>

              <div className={s.dots} aria-hidden="true">
                {PANELS.map((p, i) => (
                  <span
                    key={p.eyebrow}
                    className={s.dot}
                    style={{
                      background:
                        i <= railProgress + 0.4 ? ACCENT : 'transparent',
                      borderColor: ACCENT,
                    }}
                  />
                ))}
              </div>
            </div>

            <div
              className={s.outro}
              style={{
                opacity: outroIn,
                transform: `scale(${0.94 + outroIn * 0.06})`,
              }}
            >
              <p className={s.outroText}>
                Open the app, and what is relevant is already{' '}
                <span style={{ color: ACCENT }}>waiting</span>.
              </p>
            </div>
          </div>
        )
      }}
    </ChapterPanel>
  )
}
