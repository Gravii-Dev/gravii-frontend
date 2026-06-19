'use client'

import {
  useActionState,
  type FormEvent,
  useEffect,
  useId,
  useState,
} from 'react'
import {
  joinWaitlistAction,
  type WaitlistActionState,
} from '@/app/(site)/actions'
import {
  isValidWaitlistEmail,
  normalizeWaitlistEmail,
  parseWaitlistSubmission,
  WAITLIST_CACHE_EVENT,
  WAITLIST_CACHE_KEY,
  type WaitlistSubmission,
} from '@/lib/utils/waitlist'
import s from './cta-pill.module.css'

type State = 'collapsed' | 'expanded' | 'submitting' | 'success'

/**
 * Passport-stamp CTA using the flat Gravii action control treatment.
 * On click: expands inline to the existing waitlist form flow.
 */
export function CtaPill() {
  const [formState, formAction, isPending] = useActionState<
    WaitlistActionState | null,
    FormData
  >(joinWaitlistAction, null)
  const [state, setState] = useState<State>('collapsed')
  const [email, setEmail] = useState('')
  const [clientError, setClientError] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [cachedSubmission, setCachedSubmission] =
    useState<WaitlistSubmission | null>(null)
  const statusId = useId()
  const successSubmission = formState?.data ?? cachedSubmission
  let visualState: State = state
  if (successSubmission) {
    visualState = 'success'
  }
  if (isPending) {
    visualState = 'submitting'
  }

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
    if (typeof window === 'undefined') {
      return undefined
    }

    const syncCachedSubmission = (value: string | null) => {
      const parsed = parseWaitlistSubmission(value)
      setCachedSubmission(parsed)
      if (parsed) {
        setEmail(parsed.email)
        setState('success')
      }
    }

    syncCachedSubmission(window.localStorage.getItem(WAITLIST_CACHE_KEY))

    const handleStorage = (event: StorageEvent) => {
      if (event.key === WAITLIST_CACHE_KEY) {
        syncCachedSubmission(event.newValue)
      }
    }

    const handleCacheEvent = (event: Event) => {
      const detail = (event as CustomEvent<WaitlistSubmission>).detail
      setCachedSubmission(detail)
      setEmail(detail.email)
      setState('success')
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener(WAITLIST_CACHE_EVENT, handleCacheEvent)

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener(WAITLIST_CACHE_EVENT, handleCacheEvent)
    }
  }, [])

  useEffect(() => {
    if (!formState?.data || typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(
      WAITLIST_CACHE_KEY,
      JSON.stringify(formState.data)
    )
    window.dispatchEvent(
      new CustomEvent(WAITLIST_CACHE_EVENT, {
        detail: formState.data,
      })
    )
    setCachedSubmission(formState.data)
    setEmail(formState.data.email)
    setState('success')
  }, [formState?.data])

  useEffect(() => {
    if (formState && formState.status >= 400) {
      setState('expanded')
    }
  }, [formState])

  const handleTriggerClick = () => {
    if (state === 'collapsed') {
      setClientError('')
      setState('expanded')
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const normalized = normalizeWaitlistEmail(email)
    if (!isValidWaitlistEmail(normalized)) {
      event.preventDefault()
      setClientError('Enter a valid email address.')
      return
    }

    setClientError('')
    setEmail(normalized)
  }

  const isCollapsed = state === 'collapsed'
  const isSuccess = Boolean(successSubmission) || state === 'success'
  const showForm = state === 'expanded' || isPending
  const statusMessage =
    clientError ||
    formState?.message ||
    (successSubmission
      ? `You're already on the waitlist. Your referral code is ${successSubmission.referralCode}.`
      : null)
  const isError = Boolean(clientError) || (formState?.status ?? 0) >= 400

  return (
    <div className={s.stamp} data-state={visualState}>
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
          aria-expanded={showForm}
          aria-hidden={!(isCollapsed || isSuccess)}
          tabIndex={isCollapsed || isSuccess ? 0 : -1}
          data-cursor-target="waitlist-trigger"
          data-cursor-variant="pill"
          data-cursor-surface="parent"
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
          noValidate
          onSubmit={handleSubmit}
        >
          <input
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
            onChange={(event) => {
              setEmail(event.target.value)
              if (clientError) setClientError('')
            }}
            aria-invalid={isError ? true : undefined}
            aria-describedby={statusMessage ? statusId : undefined}
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
            data-cursor-target="waitlist-submit"
            data-cursor-variant="pill"
          >
            {isPending ? (
              <span className={s.spinner} aria-hidden="true" />
            ) : (
              '✓'
            )}
          </button>
        </form>
      </div>
      {statusMessage ? (
        <p
          id={statusId}
          className={isError ? s.statusError : s.status}
          role={isError ? 'alert' : 'status'}
          aria-live={isError ? 'assertive' : 'polite'}
        >
          {statusMessage}
        </p>
      ) : null}
    </div>
  )
}
