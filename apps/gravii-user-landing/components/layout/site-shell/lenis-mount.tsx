'use client'

import dynamic from 'next/dynamic'

const LazyLenis = dynamic(
  () => import('@/components/layout/lenis').then((mod) => mod.Lenis),
  {
    ssr: false,
  }
)

export function LenisMount() {
  return (
    <LazyLenis
      root
      syncScrollTrigger
      options={{
        lerp: 0.05,
        wheelMultiplier: 0.5,
        touchMultiplier: 0.7,
      }}
    />
  )
}
