import type {
  PartnerAuthAccountStatus,
  PartnerAuthPlan,
  PartnerProfile
} from '@gravii/domain-types'

export function getPartnerWorkspaceName(partner: PartnerProfile | null | undefined): string {
  const organization = partner?.organization?.trim()

  if (organization) {
    return organization
  }

  const displayName = partner?.displayName?.trim()

  if (displayName) {
    return displayName
  }

  return 'Partner Workspace'
}

export function formatPartnerPlanLabel(plan: PartnerAuthPlan | undefined): string {
  if (!plan || plan === 'free') {
    return 'Engage · Free Tier'
  }

  return `Engage · ${plan.charAt(0).toUpperCase()}${plan.slice(1)}`
}

export function formatPartnerStatusLabel(
  status: PartnerAuthAccountStatus | undefined
): string {
  if (!status) {
    return 'Unknown'
  }

  return status.charAt(0).toUpperCase() + status.slice(1)
}

export function formatPartnerLastLogin(lastLoginAt: string | undefined): string {
  if (!lastLoginAt) {
    return '—'
  }

  const parsedDate = new Date(lastLoginAt)

  if (Number.isNaN(parsedDate.getTime())) {
    return '—'
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(parsedDate)
}
