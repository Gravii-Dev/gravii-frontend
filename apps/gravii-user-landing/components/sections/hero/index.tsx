'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from '@/components/ui/link'
import s from './hero.module.css'
import { HeroBackground } from './hero-background'

const SPLASH_EXIT_DURATION_MS = 520
const SPLASH_MAX_WAIT_MS = 2400

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
        <p
          className={s.subtitle}
          data-glitch={'"WE\'VE BURNT THE OLD PLAYBOOK"'}
          suppressHydrationWarning
        >
          &quot;WE&apos;VE BURNT THE OLD PLAYBOOK&quot;
        </p>
        <Link href="#waitlist" className={s.ctaButton}>
          <span className={s.ctaButtonBody}>
            <span className={s.ctaButtonText}>JOIN WAITLIST</span>
          </span>
        </Link>
      </div>
    </section>
  )
}
