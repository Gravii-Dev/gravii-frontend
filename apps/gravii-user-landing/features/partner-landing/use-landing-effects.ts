'use client'

import { useEffect, useState, type RefObject } from 'react'
import styles from './landing-page.module.css'

export function useLandingEffects(pageRef: RefObject<HTMLDivElement | null>) {
  const [isScrolled, setIsScrolled] = useState(false)
  const revealVisibleClass = styles.revealVisible ?? ''

  useEffect(() => {
    const root = pageRef.current
    if (!root) {
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && revealVisibleClass) {
            entry.target.classList.add(revealVisibleClass)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 },
    )

    root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
      observer.observe(element)
    })

    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 60)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [pageRef, revealVisibleClass])

  return { isScrolled }
}
