import type {
  LandingWaitlistRequest,
  LandingWaitlistResponse
} from '@gravii/domain-types'

import {
  createJsonApiClient,
  resolveApiBaseUrl,
  type ApiClientConfig
} from './base'

export const DEFAULT_LANDING_API_BASE_URL =
  'https://gravii-landing-api-1077809741476.europe-west6.run.app'

export interface LandingApiClientConfig extends Omit<ApiClientConfig, 'baseUrl'> {
  baseUrl?: string
}

function toLandingWaitlistPayload(input: LandingWaitlistRequest) {
  return {
    email: input.email,
    referral_code: input.referralCode
  }
}

export function createLandingApiClient(config: LandingApiClientConfig = {}) {
  const client = createJsonApiClient({
    ...config,
    baseUrl: resolveApiBaseUrl({
      override: config.baseUrl,
      envKeys: ['NEXT_PUBLIC_GRAVII_LANDING_API_BASE_URL', 'GRAVII_LANDING_API_BASE_URL'],
      fallback: DEFAULT_LANDING_API_BASE_URL
    })
  })

  return {
    joinWaitlist<TResponse = LandingWaitlistResponse>(
      input: LandingWaitlistRequest,
      signal?: AbortSignal
    ) {
      return client.request<TResponse, ReturnType<typeof toLandingWaitlistPayload>>({
        method: 'POST',
        path: '/api/v1/landing/waitlist',
        body: toLandingWaitlistPayload(input),
        signal
      })
    }
  }
}
