'use client'

import clsx from 'clsx'
import { useActionState, useCallback, useEffect, useState } from 'react'

import {
  joinWaitlistAction,
  type WaitlistActionState,
  type WaitlistSubmission,
} from '@/app/(site)/actions'
import {
  isValidWaitlistEmail,
  normalizeWaitlistEmail,
} from '@/lib/utils/waitlist'

import s from './waitlist.module.css'

const DEFAULT_STATUS_MESSAGE =
  'Join the waitlist for launch access and early product updates.'
const WAITLIST_CACHE_KEY = 'gravii_waitlist'

export function WaitlistForm() {
  const [instanceKey, setInstanceKey] = useState(0)

  const handleReset = useCallback(() => {
    setInstanceKey((current) => current + 1)
  }, [])

  return <WaitlistFormInstance key={instanceKey} onReset={handleReset} />
}

function WaitlistFormInstance({ onReset }: { onReset: () => void }) {
  const [formState, formAction, isPending] = useActionState<
    WaitlistActionState | null,
    FormData
  >(joinWaitlistAction, null)
  const [cachedSubmission, setCachedSubmission] = useState<WaitlistSubmission | null>(
    null
  )
  const [email, setEmail] = useState('')
  const [hasTouched, setHasTouched] = useState(false)
  const [referralCode, setReferralCode] = useState('')
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)

  const normalizedEmail = normalizeWaitlistEmail(email)
  const isEmailValid =
    normalizedEmail.length > 0 && isValidWaitlistEmail(normalizedEmail)
  const hasStaleResponse =
    submittedEmail !== null && normalizedEmail !== submittedEmail
  const activeState = hasStaleResponse ? null : formState
  const successSubmission = activeState?.data ?? cachedSubmission
  const isSuccess = Boolean(successSubmission)
  const isError = (activeState?.status ?? 0) >= 400

  let clientError: string | null = null
  if (hasTouched) {
    if (normalizedEmail.length === 0) {
      clientError = 'Email is required.'
    } else if (!isEmailValid) {
      clientError = 'Enter a valid email address.'
    }
  }

  const serverError = activeState?.fieldErrors?.email
  const statusMessage =
    clientError ??
    serverError ??
    activeState?.message ??
    (cachedSubmission
      ? `You're already on the waitlist. Your referral code is ${cachedSubmission.referralCode}.`
      : DEFAULT_STATUS_MESSAGE)

  let buttonLabel = 'Join Waitlist'
  if (isPending) {
    buttonLabel = 'Joining...'
  } else if (isSuccess) {
    buttonLabel = 'Joined'
  } else if (isError) {
    buttonLabel = 'Try Again'
  }

  let statusClassName = s.statusHint
  if (clientError || serverError || isError) {
    statusClassName = s.statusError
  } else if (isSuccess) {
    statusClassName = s.statusSuccess
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
      return
    }

    const cachedValue = window.localStorage.getItem(WAITLIST_CACHE_KEY)
    if (!cachedValue) {
      return
    }

    try {
      const parsed = JSON.parse(cachedValue) as Partial<WaitlistSubmission>
      if (
        typeof parsed.email === 'string' &&
        typeof parsed.referralCode === 'string' &&
        typeof parsed.resultStatus === 'string' &&
        typeof parsed.uid === 'string'
      ) {
        setCachedSubmission({
          email: parsed.email,
          referralCode: parsed.referralCode,
          resultStatus:
            parsed.resultStatus === 'existing' ? 'existing' : 'created',
          uid: parsed.uid,
        })
        setEmail(parsed.email)
      }
    } catch {
      window.localStorage.removeItem(WAITLIST_CACHE_KEY)
    }
  }, [])

  useEffect(() => {
    if (!activeState?.data || typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(
      WAITLIST_CACHE_KEY,
      JSON.stringify(activeState.data)
    )
    setCachedSubmission(activeState.data)
  }, [activeState?.data])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setHasTouched(true)

    if (!isEmailValid) {
      event.preventDefault()
      return
    }

    setSubmittedEmail(normalizedEmail)
  }

  const handleResetSubmission = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(WAITLIST_CACHE_KEY)
    }

    setCachedSubmission(null)
    setEmail('')
    setHasTouched(false)
    setSubmittedEmail(null)
    onReset()
  }

  if (successSubmission) {
    const referralLink =
      typeof window !== 'undefined'
        ? `${window.location.origin}${window.location.pathname}?ref=${successSubmission.referralCode}`
        : `https://gravii.io?ref=${successSubmission.referralCode}`

    return (
      <div className={s.formStack}>
        <div className={s.returningCard}>
          <p className={s.returningEyebrow}>
            {successSubmission.resultStatus === 'created'
              ? 'You are on the waitlist'
              : 'Welcome back'}
          </p>
          <p className={s.returningTitle}>{successSubmission.email}</p>
          <p className={s.returningCopy}>
            Share your referral code to bring more people into the Gravii queue.
          </p>
          <div className={s.referralCodeBox}>{successSubmission.referralCode}</div>
          <div className={s.returningActions}>
            <button
              className={s.secondaryButton}
              onClick={() => {
                void navigator.clipboard.writeText(referralLink)
              }}
              type="button"
            >
              Copy Referral Link
            </button>
            <button
              className={s.secondaryButton}
              onClick={handleResetSubmission}
              type="button"
            >
              Use Another Email
            </button>
          </div>
        </div>

        <p
          id="waitlist-status"
          className={clsx(s.status, statusClassName)}
          role="status"
          aria-live="polite"
        >
          {statusMessage}
        </p>
      </div>
    )
  }

  return (
    <div className={s.formStack}>
      <form
        action={formAction}
        className={s.form}
        noValidate
        onSubmit={handleSubmit}
      >
        <label htmlFor="waitlist-email" className={s.srOnly}>
          Email address
        </label>
        <input
          id="waitlist-email"
          type="email"
          name="email"
          value={email}
          placeholder="Enter your email..."
          className={clsx(s.input, (clientError || serverError) && s.inputInvalid)}
          aria-describedby="waitlist-status"
          aria-invalid={clientError || serverError ? true : undefined}
          autoComplete="email"
          inputMode="email"
          enterKeyHint="send"
          onBlur={() => {
            setHasTouched(true)
          }}
          onChange={(event) => {
            setEmail(event.currentTarget.value)
          }}
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
          className={s.button}
          disabled={isPending || !isEmailValid}
        >
          {buttonLabel}
        </button>
      </form>

      <p
        id="waitlist-status"
        className={clsx(s.status, statusClassName)}
        role={clientError || serverError || isError ? 'alert' : 'status'}
        aria-live={clientError || serverError || isError ? 'assertive' : 'polite'}
      >
        {statusMessage}
      </p>
    </div>
  )
}
