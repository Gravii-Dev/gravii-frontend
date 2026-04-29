'use client'

import type { CSSProperties, MouseEvent as ReactMouseEvent } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from '@/components/ui/link'
import s from './sticky-header.module.css'

const ORBIT_CURSORS = [
  ...Array.from({ length: 4 }, (_, index) => {
    const angle = (360 / 4) * index
    return {
      id: `outer-${angle}`,
      angle,
      radius: 82,
      delay: index * 22,
      rotation: angle + 22,
    }
  }),
  ...Array.from({ length: 5 }, (_, index) => {
    const angle = (360 / 5) * index + 18
    return {
      id: `inner-${angle}`,
      angle,
      radius: 108,
      delay: 54 + index * 20,
      rotation: angle + 22,
    }
  }),
] as const

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
  fallback:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3003'
      : 'https://app.gravii.io',
})

function MousePointerIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={s.cursorGlyph}>
      <path
        d="M4.5 3.5L10.4 17.8L12.7 12.7L17.8 10.4L4.5 3.5Z"
        fill="currentColor"
      />
      <path
        d="M12.1 12.1L19 19"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

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
      {...(target ? { target } : {})}
      {...(rel ? { rel } : {})}
      {...(onClick ? { onClick } : {})}
    >
      <span className={s.pillOrbit} aria-hidden="true">
        <span className={s.pillPulse} />
        <span className={s.cursorOrbit}>
          {ORBIT_CURSORS.map((cursor) => (
            <span
              key={cursor.id}
              className={s.cursorItem}
              style={
                {
                  '--cursor-angle': `${cursor.angle}deg`,
                  '--cursor-radius': `${cursor.radius}px`,
                  '--cursor-delay': `${cursor.delay}ms`,
                  '--cursor-rotation': `${cursor.rotation}deg`,
                } as CSSProperties
              }
            >
              <MousePointerIcon />
            </span>
          ))}
        </span>
      </span>
      <span className={s.pillBody}>
        <span className={s.pillSurface} aria-hidden="true" />
        <span className={s.pillText}>{label}</span>
      </span>
    </Link>
  )
}

export function StickyHeader() {
  const [isVisible, setIsVisible] = useState(true)
  const [launchAppHref, setLaunchAppHref] = useState(userAppUrl)
  const lastScrollYRef = useRef(0)
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

      if (currentScrollY > lastScrollYRef.current && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
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
        <Link href="#hero" className={s.logoLink}>
          GRAVII
        </Link>

        <nav className={s.nav}>
          <HeaderPill
            href="#about"
            label="ABOUT"
            className={`${s.pillLink} ${s.navLink}`}
          />
          <HeaderPill
            href="#team"
            label="DOCS"
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
