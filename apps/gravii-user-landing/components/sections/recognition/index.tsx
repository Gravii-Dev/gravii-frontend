'use client'

import { ChapterPanel } from '@/components/effects/chapter-panel'
import { DisplayMoment } from '@/components/effects/display-moment'
import s from './recognition.module.css'

const ACCENT = '#ff8709'

const DIGITAL = [
  { lead: 'In some protocol,', tail: 'your trades carried weight.' },
  { lead: 'In some venue,', tail: 'your fees were waived.' },
  { lead: 'In some mint,', tail: 'your wallet got the allowlist.' },
  { lead: 'In some chat,', tail: 'your word was a signal.' },
  { lead: 'In some DAO,', tail: 'your vote held weight.' },
] as const

const PHYSICAL = [
  { lead: 'In some airline,', tail: 'your tier opened the lounge.' },
  { lead: 'In some hotel,', tail: 'your status booked the suite.' },
  { lead: 'In some restaurant,', tail: 'your name held the table.' },
  { lead: 'In some club,', tail: 'your card knew the door.' },
  { lead: 'In some card,', tail: 'your level called the concierge.' },
] as const

export function Recognition() {
  return (
    <ChapterPanel
      id="recognition"
      distance={4.8}
      anchorProgress={0.24}
      background="var(--gravii-paper)"
    >
      {(progress) => {
        // Distance 4.8 — gives the dense parallels and closer enough reading
        // time after they finish rendering, especially on phones.
        // Headline phase: char-reveal 0-0.25, hold 0-0.40, fade-out 0.40-0.48
        const scaleProgress = Math.min(1, Math.max(0, progress / 0.4))
        const introScale = 1 + scaleProgress * 0.4
        const introOpacity =
          progress < 0.4 ? 1 : Math.max(0, 1 - (progress - 0.4) / 0.08)
        const headlineCharProgress = Math.min(1, Math.max(0, progress / 0.25))

        // Parallels container: reveal earlier, then hold after all rows complete.
        // This avoids the previous pattern where the list finished and exited
        // within ~50px on mobile.
        const parallelsWrapperIn = Math.min(
          1,
          Math.max(0, (progress - 0.52) / 0.04)
        )
        const parallelsWrapperOut = Math.min(
          1,
          Math.max(0, (progress - 0.84) / 0.04)
        )
        const parallelsOpacity =
          progress < 0.52 ? 0 : parallelsWrapperIn * (1 - parallelsWrapperOut)

        // Vertical divider scaleY 0→1 (top-to-bottom draw)
        const dividerProgress = Math.min(
          1,
          Math.max(0, (progress - 0.53) / 0.06)
        )

        // Row pairs reveal sequentially and finish by 0.75, leaving a real
        // post-render hold before the closer takes over.

        // Closer: reveal 0.88-0.93, then hold to chapter end. ChapterPanel's
        // post-pin fade handles the handoff to the next section.
        const closerIn = Math.min(1, Math.max(0, (progress - 0.88) / 0.05))
        const closerOpacity = closerIn
        const closerScale = 0.94 + closerIn * 0.06

        return (
          <div className={s.stage}>
            <div
              className={s.headlineSlot}
              style={{
                opacity: introOpacity,
                transform: `scale(${introScale})`,
              }}
            >
              <DisplayMoment
                text="You have, somewhere, already been seen."
                size="heading-lg"
                align="left"
                accent={ACCENT}
                highlightWords={['seen']}
                progress={headlineCharProgress}
              />
            </div>

            <div
              className={s.parallels}
              style={{
                opacity: parallelsOpacity,
                transform: `translate3d(0, ${progress < 0.52 ? 30 : 0}px, 0)`,
              }}
              aria-hidden={progress < 0.52 ? true : undefined}
            >
              <div className={s.parallelsGrid}>
                <div className={s.column}>
                  <span className={s.columnHeader} style={{ color: ACCENT }}>
                    Digital
                  </span>
                  <ul className={s.rowList}>
                    {DIGITAL.map((line, i) => {
                      // Row i reveals at 0.55 + i*0.035 over 0.04 window.
                      const start = 0.55 + i * 0.035
                      const reveal = Math.min(
                        1,
                        Math.max(0, (progress - start) / 0.04)
                      )
                      // Polaroid develop: blur + saturate
                      const blurAmount = (1 - reveal) * 8
                      const saturate = 0.2 + reveal * 0.8
                      return (
                        <li
                          key={line.lead}
                          className={s.row}
                          style={{
                            opacity: reveal,
                            transform: `translate3d(${(1 - reveal) * 16}px, 0, 0)`,
                            filter:
                              reveal < 1
                                ? `blur(${blurAmount}px) saturate(${saturate})`
                                : undefined,
                          }}
                        >
                          <span className={s.rowIndex}>
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className={s.rowText}>
                            <span className={s.rowLead}>{line.lead}</span>
                            <span className={s.rowTail}>{line.tail}</span>
                          </span>
                        </li>
                      )
                    })}
                    <li
                      className={s.rowEtc}
                      style={{
                        opacity: Math.min(
                          1,
                          Math.max(0, (progress - 0.73) / 0.03)
                        ),
                      }}
                    >
                      <span className={s.rowIndex}>&nbsp;</span>
                      <span className={s.etcMark}>…</span>
                    </li>
                  </ul>
                </div>

                <div
                  className={s.divider}
                  aria-hidden="true"
                  style={{
                    transform: `scaleY(${dividerProgress})`,
                  }}
                />

                <div className={s.column}>
                  <span className={s.columnHeader} style={{ color: ACCENT }}>
                    Physical
                  </span>
                  <ul className={s.rowList}>
                    {PHYSICAL.map((line, i) => {
                      const start = 0.55 + i * 0.035
                      const reveal = Math.min(
                        1,
                        Math.max(0, (progress - start) / 0.04)
                      )
                      const blurAmount = (1 - reveal) * 8
                      const saturate = 0.2 + reveal * 0.8
                      return (
                        <li
                          key={line.lead}
                          className={s.row}
                          style={{
                            opacity: reveal,
                            transform: `translate3d(${(1 - reveal) * -16}px, 0, 0)`,
                            filter:
                              reveal < 1
                                ? `blur(${blurAmount}px) saturate(${saturate})`
                                : undefined,
                          }}
                        >
                          <span className={s.rowIndex}>
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className={s.rowText}>
                            <span className={s.rowLead}>{line.lead}</span>
                            <span className={s.rowTail}>{line.tail}</span>
                          </span>
                        </li>
                      )
                    })}
                    <li
                      className={s.rowEtc}
                      style={{
                        opacity: Math.min(
                          1,
                          Math.max(0, (progress - 0.73) / 0.03)
                        ),
                      }}
                    >
                      <span className={s.rowIndex}>&nbsp;</span>
                      <span className={s.etcMark}>…</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div
              className={s.closer}
              style={{
                opacity: closerOpacity,
                transform: `scale(${closerScale})`,
              }}
            >
              <p className={s.closerText}>
                But everywhere else, you start from{' '}
                <span style={{ color: ACCENT }}>zero</span>.
              </p>
            </div>
          </div>
        )
      }}
    </ChapterPanel>
  )
}
