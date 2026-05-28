'use client'

import clsx from 'clsx'
import { useEffect, useRef } from 'react'
import s from './display-moment.module.css'

type DisplayMomentProps = {
  text: string
  size?: 'pull' | 'heading' | 'heading-lg' | 'display'
  align?: 'left' | 'center' | 'right'
  accent?: string
  highlightWords?: string[]
  className?: string
  /** External char-reveal progress (0..1). When provided, overrides internal scroll-based calc.
   * Use when the element is inside a pinned/sticky container where bounds.top is fixed. */
  progress?: number
  /** External peel-out progress (0..1). Words fade L→R with stagger overlay on top of in-reveal. */
  peelOutProgress?: number
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value))
}

function setRevealState(node: HTMLElement, opacity: number, yPercent: number) {
  node.style.opacity = `${opacity}`
  node.style.transform = `translate3d(0, ${yPercent}%, 0)`
}

const SIZE_CLASS = {
  pull: s.sizePull,
  heading: s.sizeHeading,
  'heading-lg': s.sizeHeadingLg,
  display: s.sizeDisplay,
}

export function DisplayMoment({
  text,
  size = 'heading-lg',
  align = 'left',
  accent,
  highlightWords,
  className,
  progress: externalProgress,
  peelOutProgress,
}: DisplayMomentProps) {
  const rootRef = useRef<HTMLHeadingElement | null>(null)
  const charRefs = useRef<HTMLSpanElement[]>([])
  const wordRefs = useRef<HTMLSpanElement[]>([])
  const externalProgressRef = useRef(externalProgress)
  externalProgressRef.current = externalProgress

  const tokens = (() => {
    const seen: Record<string, number> = {}
    let motionIndex = 0
    let wordIndex = 0
    const highlightSet = new Set(
      (highlightWords ?? []).map((w) => w.toLowerCase())
    )

    return text
      .split(/(\n|\s+)/)
      .filter(Boolean)
      .map((part) => {
        if (part === '\n') {
          const next = (seen.break ?? 0) + 1
          seen.break = next
          return { type: 'break' as const, key: `break-${next}` }
        }
        if (/^\s+$/.test(part)) {
          const next = (seen.space ?? 0) + 1
          seen.space = next
          return { type: 'space' as const, key: `space-${next}` }
        }

        const cleanWord = part.replace(/[^A-Za-z]/g, '').toLowerCase()
        const isHighlighted = highlightSet.has(cleanWord)
        const chars = Array.from(part).map((char) => {
          const next = (seen[char] ?? 0) + 1
          seen[char] = next
          return {
            char,
            key: `${char}-${next}`,
            motionIndex: motionIndex++,
          }
        })
        const next = (seen.word ?? 0) + 1
        seen.word = next
        return {
          type: 'word' as const,
          key: `word-${next}`,
          chars,
          isHighlighted,
          wordIndex: wordIndex++,
        }
      })
  })()

  useEffect(() => {
    const root = rootRef.current
    const nodes = charRefs.current.filter(Boolean)
    if (!(root && nodes.length > 0)) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nodes.forEach((node) => {
        setRevealState(node, 1, 0)
      })
      return
    }

    let frameId = 0
    let lastVisibleCount = -1

    nodes.forEach((node) => {
      setRevealState(node, 0, 22)
    })

    if (typeof externalProgressRef.current === 'number') {
      return
    }

    const syncFromViewport = () => {
      const bounds = root.getBoundingClientRect()
      const viewportHeight = window.innerHeight

      if (bounds.top >= viewportHeight) {
        if (lastVisibleCount !== 0) {
          nodes.forEach((node) => {
            setRevealState(node, 0, 22)
          })
          lastVisibleCount = 0
        }
        return
      }

      const revealDistance = viewportHeight * 0.5
      const progress = clamp01(
        (viewportHeight * 0.86 - bounds.top) / Math.max(1, revealDistance)
      )
      const eased = clamp01(progress * 1.04)
      const visibleCount = Math.floor(eased * (nodes.length + 1))

      if (visibleCount !== lastVisibleCount) {
        nodes.forEach((node, index) => {
          const isVisible = index < visibleCount
          setRevealState(node, isVisible ? 1 : 0, isVisible ? 0 : 22)
        })
        lastVisibleCount = visibleCount
      }
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
  }, [])

  // External progress drives char reveal directly (e.g., from chapter progress)
  useEffect(() => {
    if (typeof externalProgress !== 'number') return
    const root = rootRef.current
    const nodes = charRefs.current.filter(Boolean)
    if (!(root && nodes.length > 0)) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nodes.forEach((node) => {
        setRevealState(node, 1, 0)
      })
      return
    }
    const eased = clamp01(externalProgress * 1.04)
    const visibleCount = Math.floor(eased * (nodes.length + 1))
    nodes.forEach((node, index) => {
      const isVisible = index < visibleCount
      setRevealState(node, isVisible ? 1 : 0, isVisible ? 0 : 22)
    })
  }, [externalProgress])

  // Word-by-word peel-out — words fade L→R with stagger overlay on word spans
  useEffect(() => {
    const words = wordRefs.current.filter(Boolean)
    if (words.length === 0) return
    if (typeof peelOutProgress !== 'number') {
      words.forEach((node) => {
        node.style.opacity = ''
        node.style.transform = ''
      })
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const N = words.length
    const stride = 0.7 / Math.max(1, N - 1)
    const win = 0.5
    words.forEach((node, i) => {
      const wordStart = i * stride
      const op = 1 - clamp01((peelOutProgress - wordStart) / win)
      node.style.opacity = `${op}`
      node.style.transform = `translate3d(0, ${(1 - op) * -16}px, 0)`
    })
  }, [peelOutProgress])

  const style = accent
    ? ({ '--display-accent': accent } as React.CSSProperties)
    : undefined

  return (
    <h2
      ref={rootRef}
      className={clsx(
        s.root,
        SIZE_CLASS[size],
        align === 'center' && s.alignCenter,
        align === 'right' && s.alignRight,
        className
      )}
      style={style}
    >
      {tokens.map((token) => {
        if (token.type === 'break') return <br key={token.key} />
        if (token.type === 'space') {
          return (
            <span key={token.key} className={s.space}>
              {' '}
            </span>
          )
        }
        return (
          <span
            key={token.key}
            className={clsx(s.word, token.isHighlighted && s.highlight)}
            ref={(node) => {
              if (!node) return
              wordRefs.current[token.wordIndex] = node
            }}
          >
            {token.chars.map((item) => (
              <span
                key={item.key}
                className={s.char}
                ref={(node) => {
                  if (!node) return
                  charRefs.current[item.motionIndex] = node
                }}
              >
                {item.char}
              </span>
            ))}
          </span>
        )
      })}
    </h2>
  )
}
