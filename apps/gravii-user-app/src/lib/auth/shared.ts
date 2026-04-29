export const userDefaultRedirectPath = '/'
export const userSignInPath = '/sign-in'

export function buildUserSignInHref(nextPath: string): string {
  const params = new URLSearchParams({
    next: normalizeUserNextPath(nextPath),
  })

  return `${userSignInPath}?${params.toString()}`
}

export function normalizeUserNextPath(nextPath: string | null | undefined): string {
  if (!nextPath || !nextPath.startsWith('/') || nextPath.startsWith('//')) {
    return userDefaultRedirectPath
  }

  return nextPath
}
