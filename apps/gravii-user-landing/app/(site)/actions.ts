'use server'

import { headers } from 'next/headers'

import { fetchWithTimeout } from '@/lib/utils/fetch'
import { rateLimit, rateLimiters } from '@/lib/utils/rate-limit'
import {
  getWaitlistRateLimitIdentifier,
  isValidWaitlistEmail,
  normalizeWaitlistEmail,
} from '@/lib/utils/waitlist'

type WaitlistResultStatus = 'created' | 'existing'

export interface WaitlistSubmission {
  email: string
  referralCode: string
  resultStatus: WaitlistResultStatus
  uid: string
}

type FormState<TData> = {
  status: number
  message?: string
  data?: TData
  fieldErrors?: Partial<Record<'email', string>>
}

export type WaitlistActionState = FormState<WaitlistSubmission>

interface LandingWaitlistResponse {
  email: string
  referral_code: string
  status: WaitlistResultStatus
  uid: string
}

const LANDING_API_BASE_URL =
  process.env.NEXT_PUBLIC_GRAVII_LANDING_API_BASE_URL?.trim() ||
  process.env.GRAVII_LANDING_API_BASE_URL?.trim() ||
  'https://gravii-landing-api-1077809741476.europe-west6.run.app'

const WAITLIST_EMAIL_ERROR = 'Enter a valid email address.'
const WAITLIST_UNAVAILABLE_MESSAGE =
  'Waitlist is temporarily unavailable. Please try again shortly.'

export async function joinWaitlistAction(
  _prevState: WaitlistActionState | null,
  formData: FormData
): Promise<WaitlistActionState> {
  const trapValue = formData.get('company')
  if (typeof trapValue === 'string' && trapValue.trim().length > 0) {
    return {
      status: 200,
      message: 'You are on the waitlist.',
    }
  }

  const rawEmail = formData.get('email')
  if (typeof rawEmail !== 'string') {
    return {
      status: 400,
      message: WAITLIST_EMAIL_ERROR,
      fieldErrors: {
        email: WAITLIST_EMAIL_ERROR,
      },
    }
  }

  const email = normalizeWaitlistEmail(rawEmail)
  if (!isValidWaitlistEmail(email)) {
    return {
      status: 400,
      message: WAITLIST_EMAIL_ERROR,
      fieldErrors: {
        email: WAITLIST_EMAIL_ERROR,
      },
    }
  }

  const referralCode = readReferralCode(formData.get('referral_code'))
  const requestHeaders = await headers()
  const identifier = getWaitlistRateLimitIdentifier(
    getClientIdentifier(requestHeaders)
  )
  const rateLimitResult = rateLimit(identifier, rateLimiters.strict)

  if (!rateLimitResult.success) {
    return {
      status: 429,
      message: `Too many attempts. Try again in ${rateLimitResult.resetIn}s.`,
    }
  }

  try {
    const response = await fetchWithTimeout(
      `${LANDING_API_BASE_URL}/api/v1/landing/waitlist`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          ...(referralCode ? { referral_code: referralCode } : {}),
        }),
        timeout: 10_000,
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null

      return {
        status: response.status,
        message: payload?.error ?? WAITLIST_UNAVAILABLE_MESSAGE,
      }
    }

    const payload = (await response.json()) as LandingWaitlistResponse

    return buildSuccessState({
      email: payload.email,
      referralCode: payload.referral_code,
      resultStatus: payload.status,
      uid: payload.uid,
    })
  } catch (error) {
    console.error('[Waitlist] landing api submission failed', error)

    return {
      status: 502,
      message: WAITLIST_UNAVAILABLE_MESSAGE,
    }
  }
}

function buildSuccessState(input: WaitlistSubmission): WaitlistActionState {
  const message =
    input.resultStatus === 'created'
      ? `You're on the waitlist. Your referral code is ${input.referralCode}.`
      : `You're already on the waitlist. Your referral code is ${input.referralCode}.`

  return {
    status: 200,
    message,
    data: input,
  }
}

function readReferralCode(rawValue: FormDataEntryValue | null): string | null {
  if (typeof rawValue !== 'string') {
    return null
  }

  const value = rawValue.trim().toUpperCase()
  return value.length > 0 ? value : null
}

function getClientIdentifier(requestHeaders: Headers) {
  const forwardedFor = requestHeaders.get('x-forwarded-for')
  if (forwardedFor) {
    const [ip] = forwardedFor.split(',')
    return ip?.trim() || 'unknown'
  }

  return (
    requestHeaders.get('cf-connecting-ip') ??
    requestHeaders.get('x-real-ip') ??
    'unknown'
  )
}
