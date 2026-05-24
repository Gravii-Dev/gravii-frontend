'use client'

import clsx from 'clsx'
import type { CSSProperties } from 'react'
import { MaskReveal } from '@/components/effects/mask-reveal'
import s from './eyebrow-label.module.css'

type EyebrowLabelProps = {
  text: string
  accent?: string
  className?: string
  reveal?: boolean
}

export function EyebrowLabel({
  text,
  accent,
  className,
  reveal = true,
}: EyebrowLabelProps) {
  const style = accent
    ? ({ '--eyebrow-accent': accent } as CSSProperties)
    : undefined

  const node = (
    <span
      className={clsx(s.label, accent && s.hasAccent, className)}
      style={style}
    >
      <span className={s.dot} aria-hidden="true" />
      {text}
    </span>
  )

  if (!reveal) return node

  return <MaskReveal>{node}</MaskReveal>
}
