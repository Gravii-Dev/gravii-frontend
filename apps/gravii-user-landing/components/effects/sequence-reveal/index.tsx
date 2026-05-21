'use client'

import clsx from 'clsx'
import {
  Children,
  isValidElement,
  type ReactNode,
  useEffect,
  useRef,
} from 'react'
import s from './sequence-reveal.module.css'

type SequenceRevealProps = {
  children: ReactNode
  className?: string
  /** how much of viewport-height to span the reveal (default 0.5 = half-screen) */
  distance?: number
  /** stagger amount between children (0..1, default 0.18) */
  stagger?: number
  /** y translate in % when hidden (default 24) */
  yPercent?: number
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value))
}

function setRevealState(node: HTMLElement, opacity: number, yPercent: number) {
  node.style.opacity = `${opacity}`
  node.style.transform = `translate3d(0, ${yPercent}%, 0)`
}

export function SequenceReveal({
  children,
  className,
  distance = 0.5,
  stagger = 0.18,
  yPercent = 24,
}: SequenceRevealProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const itemRefs = useRef<HTMLDivElement[]>([])

  const items = Children.toArray(children).filter(isValidElement)

  useEffect(() => {
    const root = rootRef.current
    const nodes = itemRefs.current.filter(Boolean)
    if (!(root && nodes.length > 0)) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nodes.forEach((node) => {
        setRevealState(node, 1, 0)
      })
      return
    }

    let frameId = 0

    nodes.forEach((node) => {
      setRevealState(node, 0, yPercent)
    })

    const syncFromViewport = () => {
      const bounds = root.getBoundingClientRect()
      const viewportHeight = window.innerHeight

      if (bounds.top >= viewportHeight) {
        nodes.forEach((node) => {
          setRevealState(node, 0, yPercent)
        })
        return
      }

      const revealDistance = viewportHeight * distance
      const progress = clamp01(
        (viewportHeight * 0.86 - bounds.top) / Math.max(1, revealDistance)
      )

      nodes.forEach((node, index) => {
        const offset = stagger * index
        const local = clamp01((progress - offset) / Math.max(0.001, 1 - offset))
        const eased = local < 1 ? local * local * (3 - 2 * local) : 1
        setRevealState(node, eased, (1 - eased) * yPercent)
      })
    }

    const scheduleSync = () => {
      if (frameId !== 0) return
      frameId = window.requestAnimationFrame(() => {
        frameId = 0
        syncFromViewport()
      })
    }

    scheduleSync()
    window.addEventListener('scroll', scheduleSync, { passive: true })
    window.addEventListener('resize', scheduleSync)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', scheduleSync)
      window.removeEventListener('resize', scheduleSync)
    }
  }, [distance, stagger, yPercent])

  return (
    <div ref={rootRef} className={clsx(s.root, className)}>
      {items.map((child, index) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: order-stable list
          key={index}
          className={s.item}
          ref={(node) => {
            if (!node) return
            itemRefs.current[index] = node
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}
