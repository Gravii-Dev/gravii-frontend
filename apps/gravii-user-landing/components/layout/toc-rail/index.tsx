'use client'

import { useEffect, useState } from 'react'
import s from './toc-rail.module.css'

const SECTIONS = [
  { id: 'hero', label: 'Promise' },
  { id: 'about', label: 'Fatigue' },
  { id: 'intro-two', label: 'Loop' },
  { id: 'recognition', label: 'Trace' },
  { id: 'bridge', label: 'Turn' },
  { id: 'passport', label: 'Passport' },
  { id: 'inside', label: 'Within' },
  { id: 'vision', label: 'Horizon' },
] as const

/**
 * Editorial right-side TOC rail.
 * Dots indicate sections, label slides out on hover or when active.
 * Click → smooth scroll to section. Hides under 900px viewport.
 */
export function TocRail() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const els = SECTIONS.map(({ id }) => document.getElementById(id))
    const valid = els
      .map((el, i) => (el ? { el, i } : null))
      .filter((v): v is { el: HTMLElement; i: number } => v !== null)
    if (valid.length === 0) return undefined

    // Track which section's center is closest to viewport center.
    let frameId = 0
    const compute = () => {
      const vCenter = window.innerHeight / 2
      let bestIdx = 0
      let bestDist = Number.POSITIVE_INFINITY
      for (const { el, i } of valid) {
        const r = el.getBoundingClientRect()
        const center = r.top + r.height / 2
        const dist = Math.abs(center - vCenter)
        if (dist < bestDist) {
          bestDist = dist
          bestIdx = i
        }
      }
      setActiveIndex(bestIdx)
    }

    const schedule = () => {
      if (frameId !== 0) return
      frameId = window.requestAnimationFrame(() => {
        frameId = 0
        compute()
      })
    }

    compute()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  const handleClick = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav className={s.rail} aria-label="Page sections">
      <span className={s.track} aria-hidden="true" />
      {SECTIONS.map((section, i) => (
        <button
          key={section.id}
          type="button"
          className={s.dot}
          data-active={i === activeIndex ? 'true' : 'false'}
          onClick={() => handleClick(section.id)}
          aria-label={`Go to ${section.label} section`}
          aria-current={i === activeIndex ? 'true' : undefined}
        >
          <span className={s.mark} aria-hidden="true" />
          <span className={s.label}>
            <span className={s.index}>{String(i + 1).padStart(2, '0')}</span>
          </span>
        </button>
      ))}
    </nav>
  )
}
