'use client'

import clsx from 'clsx'
import { ChapterPanel } from '@/components/effects/chapter-panel'
import { DisplayMoment } from '@/components/effects/display-moment'
import { CardDeck } from '@/components/ui/gravii-card/card-deck'
import { DEMO_PERSONAS } from '@/components/ui/gravii-card/personas'
import s from './passport.module.css'

const ANALOGIES = [
  { lead: 'Credit scores', tail: 'travel between banks.' },
  { lead: 'Airline miles', tail: 'transfer between carriers.' },
  { lead: 'Hotel status', tail: 'carries between stays.' },
  { lead: 'An Amex Platinum', tail: 'opens every lounge.' },
  { lead: 'A Soho House card', tail: 'unlocks every chapter.' },
  { lead: 'Your Gravii ID', tail: 'your reputation passport.' },
] as const

export function Passport() {
  return (
    <ChapterPanel
      id="passport"
      distance={5.4}
      anchorProgress={0.16}
      background="var(--gravii-paper)"
    >
      {(progress) => {
        // Materialization — first 5% of progress, content emerges from focal point
        // Pairs with Bridge's gravitational pull exit
        const materialize = Math.min(1, Math.max(0, progress / 0.05))

        // Phase A — rows 0,1 reveal together. Row 2 delayed spotlight reveal
        // with larger scale pop + persistent violet color + extended hold.
        // The analogy list now gets a readable hold after the final row lands.
        const analogiesIn = Math.min(1, Math.max(0, progress / 0.14))
        const analogiesOut = Math.min(1, Math.max(0, (progress - 0.42) / 0.08))
        const analogiesOpacity = analogiesIn * (1 - analogiesOut)

        // Last row spotlight — delayed reveal, violet via .featured class.
        const lastRowIn = Math.min(1, Math.max(0, (progress - 0.22) / 0.1))

        // Phase B — Display "Gravii ID." + subline (0.52–0.60)
        const displayIn = Math.min(1, Math.max(0, (progress - 0.52) / 0.08))
        const displayCharProgress = Math.min(
          1,
          Math.max(0, (progress - 0.52) / 0.08)
        )

        // Phase C — Body text (0.62–0.70) — completes before cards enter.
        const bodyIn = Math.min(1, Math.max(0, (progress - 0.62) / 0.08))

        // Phase D — Card deck appears after body solo hold (0.76–0.80).
        const deckIn = Math.min(1, Math.max(0, (progress - 0.76) / 0.04))

        // Card shuffle: STEPPED with DEDICATED hold zones — Card 0 also gets
        // visible hold AFTER deck settles. Hold 30% × 3 + snap 5% × 2 = 100%.
        const deckInput = Math.min(0.999, Math.max(0, (progress - 0.8) / 0.2))
        let deckProgress: number
        if (deckInput < 0.3) {
          // Card 0 (Diamond) hold — output stays in bucket 0 (< 0.333)
          deckProgress = 0.15
        } else if (deckInput < 0.35) {
          // Snap 0→1 — output crosses 0.333 threshold
          deckProgress = 0.15 + ((deckInput - 0.3) / 0.05) * 0.35
        } else if (deckInput < 0.65) {
          // Card 1 (Trader) hold — output stays in bucket 1 (0.333-0.667)
          deckProgress = 0.5
        } else if (deckInput < 0.7) {
          // Snap 1→2 — output crosses 0.667 threshold
          deckProgress = 0.5 + ((deckInput - 0.65) / 0.05) * 0.35
        } else {
          // Card 2 (Voyager) hold — output stays in bucket 2 (≥ 0.667)
          deckProgress = 0.85
        }

        return (
          <div
            className={s.stage}
            style={{
              opacity: materialize,
              transform: `scale(${0.88 + materialize * 0.12})`,
              filter:
                materialize < 1
                  ? `blur(${(1 - materialize) * 8}px)`
                  : undefined,
              willChange: 'transform, opacity, filter',
            }}
          >
            {/* Phase A — Analogies (centered overlay) */}
            <ul
              className={s.analogies}
              style={{
                opacity: analogiesOpacity,
                transform: `translate3d(0, ${
                  analogiesOut > 0 ? -analogiesOut * 80 : 0
                }px, 0)`,
              }}
            >
              {ANALOGIES.map((row, i) => {
                // Rows 0..n-2 reveal sequentially. Last row gets delayed spotlight reveal + violet via .featured.
                const isLast = i === ANALOGIES.length - 1
                const baseReveal = Math.min(
                  1,
                  Math.max(0, (progress - 0.04 - i * 0.04) / 0.1)
                )
                const reveal = isLast ? lastRowIn : baseReveal
                return (
                  <li
                    key={row.lead}
                    className={clsx(s.analogyRow, isLast && s.featured)}
                    style={{
                      opacity: reveal,
                      transform: `translate3d(${(1 - reveal) * 24}px, 0, 0)`,
                    }}
                  >
                    <span className={s.analogyLead}>{row.lead}</span>
                    <span className={s.analogyDivider} aria-hidden="true" />
                    <span className={s.analogyTail}>{row.tail}</span>
                  </li>
                )
              })}
            </ul>

            {/* Phase B/C/D — Horizontal split: left text + right deck */}
            <div
              className={s.split}
              style={{
                opacity: displayIn,
                pointerEvents: displayIn > 0.6 ? 'auto' : 'none',
              }}
            >
              <div className={s.left}>
                <div
                  className={s.displaySlot}
                  style={{
                    transform: `translate3d(0, ${(1 - displayIn) * 24}px, 0) perspective(800px) rotateY(${(1 - displayIn) * -28}deg)`,
                    transformOrigin: 'left center',
                  }}
                >
                  <DisplayMoment
                    text="Gravii ID."
                    size="display"
                    align="left"
                    accent="#6b5dff"
                    highlightWords={['Gravii']}
                    progress={displayCharProgress}
                  />
                  <p className={s.subline}>
                    One credential, traveling with you.
                  </p>
                </div>

                <div
                  className={s.bodySlot}
                  style={{
                    opacity: bodyIn,
                    transform: `translate3d(0, ${(1 - bodyIn) * 16}px, 0)`,
                  }}
                >
                  <p className={s.bodyText}>
                    Your <span className="gravii-id-mark">Gravii ID</span> is
                    your reputation, made portable. Every door it touches sees
                    who you are the moment your wallet connects.
                  </p>
                </div>
              </div>

              <div className={s.right}>
                <div
                  className={s.deckSlot}
                  style={{
                    opacity: deckIn,
                    transform: `translate3d(0, ${(1 - deckIn) * 32}px, 0)`,
                  }}
                >
                  <CardDeck personas={DEMO_PERSONAS} progress={deckProgress} />
                </div>
              </div>
            </div>
          </div>
        )
      }}
    </ChapterPanel>
  )
}
