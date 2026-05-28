const PRODUCTION_SITE_URL = 'https://www.gravii.io'
const LOCAL_SITE_URL = 'http://localhost:3000'

function trimTrailingSlash(url: string) {
  return url.replace(/\/+$/, '')
}

function resolveSiteBaseUrl() {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL
  }

  if (process.env.VERCEL_ENV === 'production') {
    return PRODUCTION_SITE_URL
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  return LOCAL_SITE_URL
}

export const SITE_BASE_URL = trimTrailingSlash(resolveSiteBaseUrl())
