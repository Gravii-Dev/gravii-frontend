import type { PropsWithChildren, ReactNode } from 'react'

import { cn } from '@/lib/cn'

import styles from './card.module.css'

type CardAccent = 'none' | 'blue' | 'teal' | 'amber' | 'rose'

const accentClassMap: Record<CardAccent, string> = {
  none: '',
  blue: styles.accentBlue,
  teal: styles.accentTeal,
  amber: styles.accentAmber,
  rose: styles.accentRose
}

interface CardProps extends PropsWithChildren {
  title?: string
  eyebrow?: string
  action?: ReactNode
  accent?: CardAccent
  className?: string
}

export function Card({
  title,
  eyebrow,
  action,
  accent = 'none',
  className,
  children
}: CardProps) {
  return (
    <section className={cn(styles.card, accentClassMap[accent], className)}>
      {(title ?? eyebrow ?? action) ? (
        <header className={styles.header}>
          <div>
            {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
            {title ? <h2 className={styles.title}>{title}</h2> : null}
          </div>
          {action ? <div className={styles.action}>{action}</div> : null}
        </header>
      ) : null}
      <div>{children}</div>
    </section>
  )
}
