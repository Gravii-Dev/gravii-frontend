'use client'

import { useEffect, useRef, useState } from 'react'
import s from './section-wipe.module.css'

const SECTION_IDS = [
  'about',
  'intro-two',
  'recognition',
  'bridge',
  'passport',
  'inside',
  'vision',
  'waitlist',
]

/**
 * Section transition wipe — a thin hairline sweeps across the viewport at section boundaries.
 * Triggered when the IntersectionObserver detects a new section entering.
 */
export function SectionWipe() {
  const [active, setActive] = useState(false)
  const lastSectionRef = useRef<string | null>(null)
  const timerRef = useRef<number>(0)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      return undefined

    const sections = SECTION_IDS.map((id) =>
      document.getElementById(id)
    ).filter((el): el is HTMLElement => el !== null)
    if (sections.length === 0) return undefined

    const trigger = () => {
      window.clearTimeout(timerRef.current)
      setActive(true)
      timerRef.current = window.setTimeout(() => setActive(false), 760)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.35) {
            const id = entry.target.id
            if (id && id !== lastSectionRef.current) {
              lastSectionRef.current = id
              trigger()
              break
            }
          }
        }
      },
      { threshold: [0.35, 0.5] }
    )

    for (const section of sections) observer.observe(section)

    return () => {
      window.clearTimeout(timerRef.current)
      observer.disconnect()
    }
  }, [])

  return (
    <div
      className={s.line}
      data-active={active ? 'true' : 'false'}
      aria-hidden="true"
    />
  )
}
