import type { ReactNode } from 'react'
import { BackToTop } from '@/components/layout/back-to-top'
import { CursorTrail } from '@/components/layout/cursor-trail'
import { HaloOverlay } from '@/components/layout/halo-overlay'
import { LenisMount } from '@/components/layout/site-shell/lenis-mount'
import { TocRail } from '@/components/layout/toc-rail'
import s from '@/components/layout/wrapper/wrapper.module.css'

type SiteShellProps = {
  children: ReactNode
  className?: string
}

export function SiteShell({ children, className }: SiteShellProps) {
  const mainClassName = className ? `${s.root} ${className}` : s.root

  return (
    <>
      <HaloOverlay />
      <CursorTrail />
      <TocRail />
      <main id="main-content" className={mainClassName}>
        {children}
      </main>
      <BackToTop />
      <LenisMount />
    </>
  )
}
