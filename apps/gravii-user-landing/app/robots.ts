import type { MetadataRoute } from 'next'

import { SITE_BASE_URL } from '@/lib/config/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio/', '/api/draft-mode/'],
    },
    sitemap: `${SITE_BASE_URL}/sitemap.xml`,
  }
}
