export const adminAuthRefreshCookieName = 'gravii_admin_refresh'
export const adminDefaultRedirectPath = '/'
export const adminSignInPath = '/sign-in'
export const adminWorkspaceDomain =
  process.env.NEXT_PUBLIC_GRAVII_ADMIN_WORKSPACE_DOMAIN?.trim() ||
  process.env.GRAVII_ADMIN_WORKSPACE_DOMAIN?.trim() ||
  'gravii.io'

export function buildAdminSignInHref(nextPath: string): string {
  const params = new URLSearchParams({
    next: normalizeAdminNextPath(nextPath)
  })

  return `${adminSignInPath}?${params.toString()}`
}

export function normalizeAdminNextPath(nextPath: string | null | undefined): string {
  if (!nextPath || !nextPath.startsWith('/') || nextPath.startsWith('//')) {
    return adminDefaultRedirectPath
  }

  return nextPath
}
