'use client'

import clsx from 'clsx'
import { useState } from 'react'
import s from './gravii-card.module.css'
import { type Persona, TIER_COLORS, TIER_INDEX, TIER_ORDER } from './personas'

type GraviiCardProps = {
  persona: Persona
  className?: string
  ariaHidden?: boolean
}

export function GraviiCard({
  persona,
  className,
  ariaHidden,
}: GraviiCardProps) {
  const tierIndex = TIER_INDEX[persona.tier]
  const tierColor = TIER_COLORS[persona.tier]
  const [illustrationLoaded, setIllustrationLoaded] = useState(false)

  return (
    <article
      className={clsx(s.card, className)}
      aria-hidden={ariaHidden}
      data-tier={persona.tier.toLowerCase()}
    >
      <header className={s.header}>
        <span className={s.brand}>GRAVII ID</span>
        <span className={s.headerIssue}>{persona.issuedAt}</span>
      </header>

      <div className={s.divider} />

      <div
        className={s.illustrationFrame}
        data-loaded={illustrationLoaded ? 'true' : undefined}
      >
        {/* biome-ignore lint/performance/noImgElement: persona illustration loaded from public/personas — next/image not needed for placeholder */}
        <img
          src={persona.illustration}
          alt=""
          className={s.illustrationImg}
          draggable={false}
          loading="lazy"
          onLoad={(e) => {
            // Confirm REAL image (not 404 HTML response) by checking pixels
            if (e.currentTarget.naturalWidth > 0) {
              setIllustrationLoaded(true)
            }
          }}
          onError={() => setIllustrationLoaded(false)}
        />
      </div>

      <div className={s.identity}>
        <h3 className={s.handle}>{persona.handle}</h3>
        <div className={s.tierStack}>
          <span className={s.tierName}>{persona.tier}</span>
          <div className={s.tierBar} aria-hidden="true">
            {TIER_ORDER.map((t, i) => (
              <span
                key={t}
                className={s.tierSegment}
                data-filled={i <= tierIndex ? 'true' : undefined}
                style={{
                  background: i <= tierIndex ? TIER_COLORS[t] : undefined,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={s.divider} />

      <footer className={s.footer}>
        <div className={s.personaRow}>
          <span className={s.personaLabel}>
            PERSONA <span className={s.personaDot}>·</span>{' '}
            <span className={s.personaName}>{persona.name}</span>
          </span>
          <span className={s.chainPill} style={{ borderColor: tierColor }}>
            {persona.chain}
          </span>
        </div>
        <div className={s.metaRow}>
          <span className={s.metaSince}>Since {persona.since}</span>
        </div>
      </footer>
    </article>
  )
}
