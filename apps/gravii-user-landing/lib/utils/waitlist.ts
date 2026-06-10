const WAITLIST_EMAIL_RE =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const WAITLIST_CACHE_KEY = 'gravii_waitlist'
export const WAITLIST_CACHE_EVENT = 'gravii:waitlist-cache'

export type WaitlistResultStatus = 'created' | 'existing'

export interface WaitlistSubmission {
  email: string
  referralCode: string
  resultStatus: WaitlistResultStatus
  uid: string
}

export function normalizeWaitlistEmail(email: string) {
  return email.trim().toLowerCase()
}

export function isValidWaitlistEmail(email: string) {
  return WAITLIST_EMAIL_RE.test(normalizeWaitlistEmail(email))
}

export function getWaitlistRateLimitIdentifier(clientIdentifier: string) {
  return `${clientIdentifier}:waitlist`
}

export function parseWaitlistSubmission(
  value: string | null
): WaitlistSubmission | null {
  if (!value) {
    return null
  }

  try {
    const parsed = JSON.parse(value) as Partial<WaitlistSubmission>
    if (
      typeof parsed.email === 'string' &&
      typeof parsed.referralCode === 'string' &&
      typeof parsed.resultStatus === 'string' &&
      typeof parsed.uid === 'string'
    ) {
      return {
        email: parsed.email,
        referralCode: parsed.referralCode,
        resultStatus:
          parsed.resultStatus === 'existing' ? 'existing' : 'created',
        uid: parsed.uid,
      }
    }
  } catch {
    return null
  }

  return null
}
