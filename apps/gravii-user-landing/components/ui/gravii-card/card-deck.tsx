'use client'

import clsx from 'clsx'
import s from './card-deck.module.css'
import { GraviiCard } from './index'
import type { Persona } from './personas'

type CardDeckProps = {
  personas: readonly Persona[]
  /** 0..1 progress through the deck (drives which card is front) */
  progress: number
  className?: string
}

/**
 * Stacked deck — front card visible, 2 (or N-1) others peek behind with offset/rotation.
 * As `progress` advances, the front card cycles through `personas`. CSS transitions
 * give the shuffle motion smooth and "card-like" feel.
 */
export function CardDeck({ personas, progress, className }: CardDeckProps) {
  const total = personas.length
  if (total === 0) return null

  const clampedProgress = Math.min(0.999, Math.max(0, progress))
  const frontIndex = Math.min(total - 1, Math.floor(clampedProgress * total))

  return (
    <div className={clsx(s.deck, className)}>
      <div className={s.stack}>
        {personas.map((persona, i) => {
          // Stack position: 0 = front, 1 = behind, 2 = back
          const stackPos = (i - frontIndex + total) % total
          const isFront = stackPos === 0
          // Linear opacity falloff: 0 → 1.0, 1 → 0.86, 2 → 0.72
          const stackOpacity = Math.max(0.2, 1 - stackPos * 0.14)

          return (
            <div
              key={persona.id}
              className={s.slot}
              data-stack-pos={stackPos}
              style={{
                transform: `translate3d(${stackPos * 12}px, ${
                  -stackPos * 14
                }px, 0) rotate(${stackPos * 2.4}deg)`,
                opacity: stackOpacity,
                zIndex: total - stackPos,
              }}
            >
              <GraviiCard persona={persona} ariaHidden={!isFront} />
            </div>
          )
        })}
      </div>

      <div className={s.dots} aria-hidden="true">
        {personas.map((p, i) => (
          <span
            key={p.id}
            className={s.dot}
            data-active={i === frontIndex ? 'true' : undefined}
          />
        ))}
      </div>
    </div>
  )
}
