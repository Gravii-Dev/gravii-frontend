'use client'

import { useEffect, useState } from 'react'
import s from './back-to-top.module.css'

export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const vision = document.getElementById('vision')
    if (!vision) return undefined

    let frameId = 0
    const syncVisibility = () => {
      const bounds = vision.getBoundingClientRect()
      const triggerLine = window.innerHeight * 0.6
      setVisible(bounds.top <= triggerLine)
    }
    const scheduleVisibility = () => {
      if (frameId !== 0) return
      frameId = window.requestAnimationFrame(() => {
        frameId = 0
        syncVisibility()
      })
    }

    syncVisibility()
    window.addEventListener('scroll', scheduleVisibility, { passive: true })
    window.addEventListener('resize', scheduleVisibility)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', scheduleVisibility)
      window.removeEventListener('resize', scheduleVisibility)
    }
  }, [])

  const handleClick = () => {
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? 'auto' : 'smooth',
    })
  }

  return (
    <button
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
