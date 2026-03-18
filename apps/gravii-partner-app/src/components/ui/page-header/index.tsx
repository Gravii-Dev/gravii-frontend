import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

import styles from './page-header.module.css'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  description: string
  actions?: ReactNode
  className?: string
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className
}: PageHeaderProps) {
  return (
    <div className={cn(styles.header, className)}>
      <div className={styles.copy}>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
      </div>
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </div>
  )
}
