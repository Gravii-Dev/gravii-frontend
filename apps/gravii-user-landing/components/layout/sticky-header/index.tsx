'use client'

import type { MouseEvent as ReactMouseEvent } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { GraviiLogo3D } from '@gravii/brand-logo-3d'
import { Link } from '@/components/ui/link'
import s from './sticky-header.module.css'

const SCROLL_HIDE_THRESHOLD = 120
const SCROLL_DELTA_THRESHOLD = 6

const passthroughKeys = new Set([
  'campaign',
  'code',
  'ref',
  'referral',
  'utm_campaign',
  'utm_content',
  'utm_medium',
  'utm_source',
  'utm_term',
])

function resolveDestinationUrl(input: {
  allowedHostnames: string[]
  envValue: string | undefined
  fallback: string
}): string {
  const candidate = input.envValue?.trim()

  if (!candidate) {
    return input.fallback
  }

  try {
    const url = new URL(candidate)

    if (input.allowedHostnames.includes(url.hostname)) {
      return candidate
    }
  } catch {
    return input.fallback
  }

  return input.fallback
}

const userAppUrl = resolveDestinationUrl({
  allowedHostnames: ['app.gravii.io', 'localhost', '127.0.0.1'],
  envValue: process.env.NEXT_PUBLIC_USER_APP_URL,
  fallback: 'https://app.gravii.io',
})

type HeaderPillProps = {
  href: string
  label: string
  className: string
  onClick?: ((event: ReactMouseEvent<HTMLElement>) => void) | undefined
  ariaDisabled?: boolean | undefined
  target?: '_self' | '_blank' | undefined
  rel?: string | undefined
}

function HeaderPill({
  href,
  label,
  className,
  onClick,
  ariaDisabled = false,
  target,
  rel,
}: HeaderPillProps) {
  return (
    <Link
      href={href}
      className={className}
      aria-disabled={ariaDisabled || undefined}
      data-cursor-target="nav-pill"
      data-cursor-variant="pill"
      data-cursor-surface="child"
      {...(target ? { target } : {})}
      {...(rel ? { rel } : {})}
      {...(onClick ? { onClick } : {})}
    >
      <span className={s.pillBody}>
        <span className={s.pillText}>{label}</span>
      </span>
    </Link>
  )
}

export function StickyHeader() {
  const [isVisible, setIsVisible] = useState(true)
  const [launchAppHref, setLaunchAppHref] = useState(userAppUrl)
  const lastScrollYRef = useRef(0)
  const isVisibleRef = useRef(true)
  const resolvedLaunchAppHref = useMemo(() => launchAppHref, [launchAppHref])

  useEffect(() => {
    const targetUrl = new URL(userAppUrl, window.location.origin)
    const searchParams = new URLSearchParams(window.location.search)

    for (const [key, value] of searchParams.entries()) {
      if (passthroughKeys.has(key) && !targetUrl.searchParams.has(key)) {
        targetUrl.searchParams.set(key, value)
      }
    }

    setLaunchAppHref(targetUrl.toString())
  }, [])

  useEffect(() => {
    let frameId = 0

    const syncHeader = () => {
      const currentScrollY = window.scrollY
      const delta = currentScrollY - lastScrollYRef.current

      if (Math.abs(delta) < SCROLL_DELTA_THRESHOLD) {
        return
      }

      const nextVisible = currentScrollY <= SCROLL_HIDE_THRESHOLD || delta < 0

      if (isVisibleRef.current !== nextVisible) {
        isVisibleRef.current = nextVisible
        setIsVisible(nextVisible)
      }

      lastScrollYRef.current = currentScrollY
    }

    const handleScroll = () => {
      window.cancelAnimationFrame(frameId)
      frameId = window.requestAnimationFrame(syncHeader)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    syncHeader()

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return (
    <header className={`${s.root} ${!isVisible ? s.isHidden : ''}`.trim()}>
      {/* Left Area: Logo and Nav Menu */}
      <div className={s.leftGroup}>
        <Link href="#hero" className={s.logoLink} aria-label="Go to Gravii">
          <GraviiLogo3D animated={false} className={s.logoMark} variant="nav" />
        </Link>

        <nav className={s.nav}>
          <HeaderPill
            href="#about"
            label="ABOUT"
            className={`${s.pillLink} ${s.navLink}`}
          />
          <HeaderPill
            href="#waitlist"
            label="WAITLIST"
            className={`${s.pillLink} ${s.navLink}`}
          />
          <HeaderPill
            href="/partners"
            label="PARTNER"
            className={`${s.pillLink} ${s.navLink}`}
          />
        </nav>
      </div>

      {/* Right Area: Action Button */}
      <div>
        <HeaderPill
          href={resolvedLaunchAppHref}
          label="LAUNCH APP"
          className={`${s.pillLink} ${s.actionLink}`}
          target="_self"
        />
      </div>
    </header>
  )
}
