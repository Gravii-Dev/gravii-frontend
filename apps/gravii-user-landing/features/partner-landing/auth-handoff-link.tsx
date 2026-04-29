'use client'

import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { useEffect, useState } from 'react'

const passthroughKeys = new Set([
  'campaign',
  'code',
  'ref',
  'referral',
  'utm_campaign',
  'utm_content',
  'utm_medium',
  'utm_source',
  'utm_term'
])

function buildHandoffHref(href: string, searchParams: URLSearchParams): string {
  const [hrefWithoutHash, hashFragment] = href.split('#', 2)
  const [path, queryString] = (hrefWithoutHash ?? href).split('?', 2)
  const nextSearchParams = new URLSearchParams(queryString ?? '')

  for (const [key, value] of searchParams.entries()) {
    if (passthroughKeys.has(key) && !nextSearchParams.has(key)) {
      nextSearchParams.set(key, value)
    }
  }

  const nextQueryString = nextSearchParams.toString()
  const nextHashFragment = hashFragment ? `#${hashFragment}` : ''

  if (!nextQueryString) {
    return `${path}${nextHashFragment}`
  }

  return `${path}?${nextQueryString}${nextHashFragment}`
}

interface AuthHandoffLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'href'> {
  children: ReactNode
  href: string
}

export function AuthHandoffLink({
  children,
  href,
  ...anchorProps
}: AuthHandoffLinkProps) {
  const [resolvedHref, setResolvedHref] = useState(href)

  useEffect(() => {
    setResolvedHref(buildHandoffHref(href, new URLSearchParams(window.location.search)))
  }, [href])

  return (
    <a {...anchorProps} href={resolvedHref}>
      {children}
    </a>
  )
}
