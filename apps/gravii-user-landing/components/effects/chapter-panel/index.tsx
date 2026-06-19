'use client'

import clsx from 'clsx'
import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react'
import { getAnchorScrollTop } from '@/lib/utils/anchor-scroll'
import s from './chapter-panel.module.css'

type ChapterPanelProps = {
  /** Either render-prop fn taking progress (0..1) or static children */
  children: ReactNode | ((progress: number) => ReactNode)
  /** total scroll distance for the pinned region in viewports (default 2 = 200vh outer) */
  distance?: number
  /** Pull section up to overlap with previous chapter's post-pin scroll-out.
   * `true` = -50vh (default, leaves 50vh tail for closing content).
   * Number = exact vh amount to pull up.
   * Use only for intentional cross-fades where both chapters may be visible. */
  overlap?: boolean | number
  /** disable pinning — render children directly. Used as fallback for reduced motion or mobile */
  disablePin?: boolean
  className?: string
  innerClassName?: string
  /** background color/wash for the pinned panel */
  background?: string
  /** id for navigation anchors */
  id?: string
  /** scroll progress to land on when this pinned chapter is opened by an anchor */
  anchorProgress?: number
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value))
}

export function ChapterPanel({
  children,
  distance = 2,
  overlap = false,
  disablePin = false,
  className,
  innerClassName,
  background,
  id,
  anchorProgress = 0.16,
}: ChapterPanelProps) {
  const rootRef = useRef<HTMLElement | null>(null)
  const [progress, setProgress] = useState(0)
  const [exitProgress, setExitProgress] = useState(0)
  const [pinDisabled, setPinDisabled] = useState(disablePin)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (reduced) {
      setPinDisabled(true)
    }
  }, [])

  useEffect(() => {
    if (!id || pinDisabled) {
      return undefined
    }

    let frameId = 0

    const syncHashAnchor = () => {
      if (window.location.hash !== `#${id}`) {
        return
      }

      window.cancelAnimationFrame(frameId)
      frameId = window.requestAnimationFrame(() => {
        const root = rootRef.current
        if (!root) {
          return
        }

        window.scrollTo({
          top: getAnchorScrollTop(root),
          behavior: 'auto',
        })
      })
    }

    syncHashAnchor()
    window.addEventListener('hashchange', syncHashAnchor)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('hashchange', syncHashAnchor)
    }
  }, [id, pinDisabled])

  // Native scroll listener — single source of truth. Lenis runs in `root` mode
  // (LenisMount), so its programmatic `window.scrollTo` fires native scroll
  // events that this listener catches. Avoids the `useLenis(sync)` pattern
  // which puts the callback in useEffect deps → unstable identity from
  // useEffectEvent causes synchronous re-subscribe + immediate callback fire
  // every render → infinite setState loop (React 19 + Turbopack).
  useEffect(() => {
    if (pinDisabled) {
      setProgress(1)
      return
    }
    const sync = () => {
      const root = rootRef.current
      if (!root) return
      const bounds = root.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const totalScroll = bounds.height - viewportHeight
      if (totalScroll <= 0) {
        setProgress((prev) => (prev === 0 ? prev : 0))
        setExitProgress((prev) => (prev === 0 ? prev : 0))
        return
      }
      const scrolled = -bounds.top
      const next = clamp01(scrolled / totalScroll)
      setProgress((prev) => (prev === next ? prev : next))
      // Post-pin scroll-out: fade content fast over a 40vh window so the
      // closing chapter has a clean handoff before the next section arrives.
      const exit = clamp01(((scrolled - totalScroll) * 2.5) / viewportHeight)
      setExitProgress((prev) => (prev === exit ? prev : exit))
    }

    sync()
    let frameId = 0
    const schedule = () => {
      if (frameId !== 0) return
      frameId = window.requestAnimationFrame(() => {
        frameId = 0
        sync()
      })
    }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [pinDisabled])

  const renderProgress = pinDisabled ? 1 : progress
  const rendered =
    typeof children === 'function'
      ? (children as (p: number) => ReactNode)(renderProgress)
      : children

  let overlapVh = 0
  if (overlap === true) {
    overlapVh = 50
  } else if (typeof overlap === 'number') {
    overlapVh = overlap
  }
  const style: CSSProperties = {
    ['--chapter-distance' as string]: `${distance * 100}vh`,
    ['--chapter-distance-mobile' as string]: `${
      Math.max(3.4, distance) * 100
    }vh`,
    ...(background ? { background } : {}),
    ...(overlapVh > 0
      ? {
          marginTop: `calc(var(--chapter-overlap-scale, 1) * -${overlapVh}vh)`,
        }
      : {}),
  }

  if (pinDisabled) {
    return (
      <section
        id={id}
        data-anchor-progress={anchorProgress}
        ref={rootRef as React.RefObject<HTMLElement>}
        className={clsx(s.section, s.unpinned, className)}
        style={style}
      >
        <div className={clsx(s.unpinnedInner, innerClassName)}>{rendered}</div>
      </section>
    )
  }

  return (
    <section
      id={id}
      data-anchor-progress={anchorProgress}
      ref={rootRef as React.RefObject<HTMLElement>}
      className={clsx(s.section, className)}
      style={style}
    >
      <div className={s.sticky}>
        <div
          className={clsx(s.inner, innerClassName)}
          style={{ opacity: 1 - exitProgress }}
        >
          {rendered}
        </div>
      </div>
    </section>
  )
}
