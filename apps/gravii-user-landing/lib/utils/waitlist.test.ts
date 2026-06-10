import { describe, expect, it } from 'bun:test'
import {
  getWaitlistRateLimitIdentifier,
  isValidWaitlistEmail,
  normalizeWaitlistEmail,
  parseWaitlistSubmission,
} from './waitlist'

describe('normalizeWaitlistEmail', () => {
  it('trims whitespace and lowercases the email', () => {
    expect(normalizeWaitlistEmail('  HELLO@Example.COM ')).toBe(
      'hello@example.com'
    )
  })
})

describe('isValidWaitlistEmail', () => {
  it('accepts standard email addresses', () => {
    expect(isValidWaitlistEmail('founder@gravii.com')).toBe(true)
  })

  it('rejects malformed email addresses', () => {
    expect(isValidWaitlistEmail('not-an-email')).toBe(false)
    expect(isValidWaitlistEmail('hello@gravii')).toBe(false)
    expect(isValidWaitlistEmail('')).toBe(false)
  })
})

describe('getWaitlistRateLimitIdentifier', () => {
  it('limits waitlist submissions per client identifier instead of per email', () => {
    expect(getWaitlistRateLimitIdentifier('203.0.113.7')).toBe(
      '203.0.113.7:waitlist'
    )
  })
})

describe('parseWaitlistSubmission', () => {
  it('parses a valid cached waitlist submission', () => {
    expect(
      parseWaitlistSubmission(
        JSON.stringify({
          email: 'hello@gravii.io',
          referralCode: 'GRV-123',
          resultStatus: 'created',
          uid: 'user-1',
        })
      )
    ).toEqual({
      email: 'hello@gravii.io',
      referralCode: 'GRV-123',
      resultStatus: 'created',
      uid: 'user-1',
    })
  })

  it('normalizes unknown cached statuses to created', () => {
    expect(
      parseWaitlistSubmission(
        JSON.stringify({
          email: 'hello@gravii.io',
          referralCode: 'GRV-123',
          resultStatus: 'legacy',
          uid: 'user-1',
        })
      )?.resultStatus
    ).toBe('created')
  })

  it('rejects malformed cached waitlist submissions', () => {
    expect(parseWaitlistSubmission(null)).toBeNull()
    expect(parseWaitlistSubmission('not-json')).toBeNull()
    expect(parseWaitlistSubmission(JSON.stringify({ email: 'x' }))).toBeNull()
  })
})
