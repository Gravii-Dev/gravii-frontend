'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { ComponentProps, MouseEvent } from 'react'

import type { PageId } from '@/lib/workspace-navigation'
import { ensureWorkspacePagesEnabled } from '@/lib/workspace-settings'

type LinkProps = ComponentProps<typeof Link>

interface WorkspaceHandoffLinkProps extends Omit<LinkProps, 'href'> {
  href: string
  requiredPages?: readonly Exclude<PageId, 'settings'>[]
}

function isModifiedEvent(event: MouseEvent<HTMLAnchorElement>): boolean {
  return (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  )
}

export function WorkspaceHandoffLink({
  href,
  onClick,
  requiredPages = [],
  ...props
}: WorkspaceHandoffLinkProps) {
  const router = useRouter()

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)

    if (event.defaultPrevented || isModifiedEvent(event) || requiredPages.length === 0) {
      return
    }

    event.preventDefault()
    ensureWorkspacePagesEnabled(requiredPages)
    router.push(href)
  }

  return <Link {...props} href={href} onClick={handleClick} />
}
