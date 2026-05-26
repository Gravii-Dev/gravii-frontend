'use client'

import {
  useActionState,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  joinWaitlistAction,
  type WaitlistActionState,
} from '@/app/(site)/actions'
import {
  isValidWaitlistEmail,
  normalizeWaitlistEmail,
} from '@/lib/utils/waitlist'
import s from './cta-pill.module.css'

type State = 'collapsed' | 'expanded' | 'submitting' | 'success'

const MAGNETIC_RADIUS = 180
const MAGNETIC_STRENGTH = 0.12
const WAITLIST_CACHE_KEY = 'gravii_waitlist'

/**
 * Passport-stamp CTA — sharp rectangle, slight rotation, heavy ink.
 * Anti-AI-slop: no rounded pill, no arrow icon. Brand metaphor: real stamp aesthetic.
 * On click: rectangle uncurves to 0deg + expands to email form inline.
 */
export function CtaPill() {
  const [formState, formAction, isPending] = useActionState<
    WaitlistActionState | null,
    FormData
  >(joinWaitlistAction, null)
  const [state, setState] = useState<State>('collapsed')
  const [email, setEmail] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)
  const stampRef = useRef<HTMLDivElement | null>(null)
  const visualState: State = isPending ? 'submitting' : state

  useEffect(() => {
    if (state === 'expanded') {
      inputRef.current?.focus()
    }
  }, [state])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const value = new URLSearchParams(window.location.search)
      .get('ref')
      ?.trim()
      .toUpperCase()

    setReferralCode(value ?? '')
  }, [])

  useEffect(() => {
    if (!formState?.data || typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(
      WAITLIST_CACHE_KEY,
      JSON.stringify(formState.data)
    )
    setEmail(formState.data.email)
    setState('success')

    const timeoutId = window.setTimeout(() => {
      setState('collapsed')
      setEmail('')
    }, 2400)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [formState?.data])

  useEffect(() => {
    if (formState && formState.status >= 400) {
      setState('expanded')
    }
  }, [formState])

  // Magnetic cursor proximity — only when collapsed
  useEffect(() => {
    if (state !== 'collapsed') {
      if (stampRef.current) {
        stampRef.current.style.removeProperty('--magnet-x')
        stampRef.current.style.removeProperty('--magnet-y')
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
      const stamp = stampRef.current
      if (!stamp) return
      const rect = stamp.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = event.clientX - cx
      const dy = event.clientY - cy
      const dist = Math.hypot(dx, dy)
      if (dist > MAGNETIC_RADIUS) {
        stamp.style.removeProperty('--magnet-x')
        stamp.style.removeProperty('--magnet-y')
        return
      }
      const falloff = 1 - dist / MAGNETIC_RADIUS
      stamp.style.setProperty(
        '--magnet-x',
        `${dx * MAGNETIC_STRENGTH * falloff}px`
      )
      stamp.style.setProperty(
        '--magnet-y',
        `${dy * MAGNETIC_STRENGTH * falloff}px`
      )
    }
    window.addEventListener('mousemove', handleMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMove)
    }
  }, [state])

  const handleTriggerClick = () => {
    if (state === 'collapsed') setState('expanded')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const normalized = normalizeWaitlistEmail(email)
    if (!isValidWaitlistEmail(normalized)) {
      event.preventDefault()
      return
    }

    setEmail(normalized)
  }

  const isCollapsed = state === 'collapsed'
  const isSuccess = state === 'success'
  const showForm = state === 'expanded' || isPending
  const statusMessage = formState?.message

  return (
    <div ref={stampRef} className={s.stamp} data-state={visualState}>
      <span className={s.caption} aria-hidden="true">
        Approved for entry
        <span className={s.captionDot} aria-hidden="true" />
        2026
      </span>
      <div className={s.box}>
        <button
          type="button"
          className={s.label}
          onClick={handleTriggerClick}
          aria-label="Join Waitlist"
          aria-expanded={!isCollapsed}
          aria-hidden={!(isCollapsed || isSuccess)}
          tabIndex={isCollapsed || isSuccess ? 0 : -1}
        >
          {isSuccess ? (
            <span className={s.successLabel}>Joined ✓</span>
          ) : (
            'Join Waitlist'
          )}
        </button>

        <form
          action={formAction}
          className={s.form}
          aria-hidden={!showForm}
          onSubmit={handleSubmit}
        >
          <input
            ref={inputRef}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            spellCheck={false}
            aria-label="Email address"
            required
            className={s.input}
            placeholder={
              formState && formState.status >= 400 && statusMessage
                ? statusMessage
                : 'Enter your email…'
            }
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isPending || isSuccess}
            tabIndex={showForm ? 0 : -1}
          />
          <input type="hidden" name="referral_code" value={referralCode} />
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            className={s.honeypot}
            aria-hidden="true"
          />
          <button
            type="submit"
            className={s.submit}
            disabled={isPending || isSuccess}
            aria-label="Submit"
            tabIndex={showForm ? 0 : -1}
          >
            {isPending ? (
              <span className={s.spinner} aria-hidden="true" />
            ) : (
              '✓'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
