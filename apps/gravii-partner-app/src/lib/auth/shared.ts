export const partnerDefaultRedirectPath = '/'
export const partnerSignInPath = '/sign-in'

export function buildPartnerSignInHref(nextPath: string): string {
  const params = new URLSearchParams({
    next: normalizePartnerNextPath(nextPath)
  })

  return `${partnerSignInPath}?${params.toString()}`
}

export function normalizePartnerNextPath(nextPath: string | null | undefined): string {
  if (!nextPath || !nextPath.startsWith('/') || nextPath.startsWith('//')) {
    return partnerDefaultRedirectPath
  }

  return nextPath
}
