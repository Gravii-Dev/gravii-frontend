'use client'

import dynamic from 'next/dynamic'

const OrchestraTools = dynamic(
  () => import('@/dev').then((mod) => ({ default: mod.OrchestraTools })),
  { ssr: false }
)

export function DevTools() {
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return <OrchestraTools />
}
