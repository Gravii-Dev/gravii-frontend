export type LandingWaitlistStatus = 'created' | 'existing'

export interface LandingWaitlistRequest {
  email: string
  referralCode?: string
}

export interface LandingWaitlistResponse {
  status: LandingWaitlistStatus
  uid: string
  email: string
  referralCode: string
}

export interface LandingApiError {
  success: false
  error: string
}
