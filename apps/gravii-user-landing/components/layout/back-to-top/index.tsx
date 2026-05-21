'use client'

import { useEffect, useRef, useState } from 'react'
import s from './back-to-top.module.css'

const MAGNETIC_RADIUS = 140
const MAGNETIC_STRENGTH = 0.22

/**
 * Floating "BACK TO TOP" pill — appears once user reaches Vision finale or below.
 * Magnetic cursor proximity for 2026 hip feel. Smooth-scrolls to top on click.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false)
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const vision = document.getElementById('vision')
    if (!vision) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // Show once Vision is at least 40% in view (finale region)
          if (entry.target.id === 'vision') {
            setVisible(entry.intersectionRatio >= 0.4)
          }
        }
      },
      { threshold: [0.4, 0.5, 0.6] }
    )
    observer.observe(vision)
    return () => observer.disconnect()
  }, [])

  // Magnetic cursor proximity
  useEffect(() => {
    if (!visible) {
      if (buttonRef.current) {
        buttonRef.current.style.setProperty('--magnet-x', '0px')
        buttonRef.current.style.setProperty('--magnet-y', '0px')
      }
      return undefined
    }
    if (
      typeof window === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(hover: none)').matches
    ) {
      return undefined
    }

    const handleMove = (event: MouseEvent) => {
      const btn = buttonRef.current
      if (!btn) return
      const rect = btn.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = event.clientX - cx
      const dy = event.clientY - cy
      const dist = Math.hypot(dx, dy)
      if (dist > MAGNETIC_RADIUS) {
        btn.style.transform = 'translate3d(0, 0, 0)'
        return
      }
      const falloff = 1 - dist / MAGNETIC_RADIUS
      const tx = dx * MAGNETIC_STRENGTH * falloff
      const ty = dy * MAGNETIC_STRENGTH * falloff
      btn.style.transform = `translate3d(${tx}px, ${ty}px, 0)`
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMove)
      if (buttonRef.current) {
        buttonRef.current.style.transform = 'translate3d(0, 0, 0)'
      }
    }
  }, [visible])

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      className={s.button}
      data-visible={visible ? 'true' : 'false'}
      onClick={handleClick}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
    >
      <span className={s.arrow} aria-hidden="true">
        ↑
      </span>
      <span>Top</span>
    </button>
  )
}
