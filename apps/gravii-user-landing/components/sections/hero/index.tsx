'use client'

import {
  type MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Link } from '@/components/ui/link'
import { scrollToAnchorId } from '@/lib/utils/anchor-scroll'
import s from './hero.module.css'
import { HeroBackground } from './hero-background'

const SPLASH_EXIT_DURATION_MS = 520
const SPLASH_MAX_WAIT_MS = 2400
const HERO_SUBTITLE = '"WE\'VE BURNT THE OLD PLAYBOOK"'

export function Hero() {
  const [splashPhase, setSplashPhase] = useState<
    'visible' | 'leaving' | 'hidden'
  >('visible')
  const hasSettledRef = useRef(false)

  const beginSplashExit = useCallback(() => {
    setSplashPhase((current) => (current === 'visible' ? 'leaving' : current))
  }, [])

  const handleHeroSettled = useCallback(() => {
    if (hasSettledRef.current) {
      return
    }

    hasSettledRef.current = true
    beginSplashExit()
  }, [beginSplashExit])

  const handleWaitlistClick = useCallback(
    (event: ReactMouseEvent<HTMLElement>) => {
      event.preventDefault()
      scrollToAnchorId('waitlist', { behavior: 'auto', updateHash: true })
    },
    []
  )

  useEffect(() => {
    if (splashPhase !== 'visible') {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      beginSplashExit()
    }, SPLASH_MAX_WAIT_MS)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [beginSplashExit, splashPhase])

  useEffect(() => {
    if (splashPhase !== 'leaving') {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setSplashPhase('hidden')
    }, SPLASH_EXIT_DURATION_MS)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [splashPhase])

  useEffect(() => {
    if (splashPhase === 'hidden') {
      return
    }

    const htmlOverflow = document.documentElement.style.overflow
    const bodyOverflow = document.body.style.overflow

    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    return () => {
      document.documentElement.style.overflow = htmlOverflow
      document.body.style.overflow = bodyOverflow
    }
  }, [splashPhase])

  return (
    <section id="hero" className={s.section}>
      {splashPhase !== 'hidden' ? (
        <div
          className={`${s.splash} ${splashPhase === 'leaving' ? s.splashLeaving : ''}`}
        >
          <p className={s.splashTitle}>
            <span className={s.splashLine}>Welcome to</span>
            <span className={s.splashLine}>Gravii</span>
          </p>
        </div>
      ) : null}
      <HeroBackground onSettled={handleHeroSettled} />
      <div className={s.overlay}>
        <h1 className={s.label}>
          <span className={s.line}>Connect</span>
          <span className={`${s.line} ${s.lineOffset}`}>once,</span>
          <span className={s.line}>Live</span>
          <span className={`${s.line} ${s.lineOffset}`}>differently</span>
        </h1>
        <p className={s.subtitle} suppressHydrationWarning>
          <span className={s.subtitleText}>{HERO_SUBTITLE}</span>
        </p>
        <Link
          href="#waitlist"
          className={s.ctaButton}
          onClick={handleWaitlistClick}
          data-cursor-target="hero-cta"
          data-cursor-variant="pill"
          data-cursor-surface="child"
        >
          <span className={s.ctaButtonBody}>
            <span className={s.ctaButtonText}>JOIN WAITLIST</span>
          </span>
        </Link>
      </div>
    </section>
  )
}
