'use client'

import type {
  PartnerAuthResponse,
  PartnerProfile
} from '@gravii/domain-types'
import { createPartnerApiClient } from '@gravii/api-clients'
import { signOut } from 'firebase/auth'

import { getPartnerFirebaseAuth } from '@/lib/auth/firebase-client'

interface PartnerProfileWire {
  id: string
  email: string
  display_name: string
  photo_url: string | null
  organization: string | null
  plan: PartnerProfile['plan']
  status: PartnerProfile['status']
  created_at: string
  last_login_at: string
}

interface PartnerAuthResponseWire {
  status: PartnerAuthResponse['status']
  partner: PartnerProfileWire
}

interface PartnerProfileResponseWire {
  partner: PartnerProfileWire
}

export function createAuthenticatedPartnerApiClient() {
  return createPartnerApiClient({
    getAccessToken: async () => {
      const auth = getPartnerFirebaseAuth()
      const user = auth?.currentUser

      if (!user) {
        return null
      }

      return user.getIdToken()
    },
    onUnauthorized: async () => {
      const auth = getPartnerFirebaseAuth()

      if (auth?.currentUser) {
        await signOut(auth)
      }

      return null
    }
  })
}

function normalizePartnerProfile(partner: PartnerProfileWire): PartnerProfile {
  return {
    id: partner.id,
    email: partner.email,
    displayName: partner.display_name,
    photoUrl: partner.photo_url,
    organization: partner.organization,
    plan: partner.plan,
    status: partner.status,
    createdAt: partner.created_at,
    lastLoginAt: partner.last_login_at
  }
}

export async function createOrRestorePartnerAccount(): Promise<PartnerAuthResponse> {
  const client = createAuthenticatedPartnerApiClient()
  const payload = await client.signInWithGoogle<PartnerAuthResponseWire>()

  return {
    status: payload.status,
    partner: normalizePartnerProfile(payload.partner)
  }
}

export async function readPartnerSessionProfile(): Promise<PartnerProfile | null> {
  const client = createAuthenticatedPartnerApiClient()
  const payload = await client.getAuthSession<PartnerProfileResponseWire>()
  return payload.partner ? normalizePartnerProfile(payload.partner) : null
}

export async function readPartnerProfile(): Promise<PartnerProfile | null> {
  const client = createAuthenticatedPartnerApiClient()
  const payload = await client.getAuthMe<PartnerProfileResponseWire>()
  return payload.partner ? normalizePartnerProfile(payload.partner) : null
}
