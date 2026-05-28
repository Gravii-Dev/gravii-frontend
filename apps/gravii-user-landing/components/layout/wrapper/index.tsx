/**
 * Main page wrapper providing theme, smooth scrolling, and footer layout.
 */
'use client'

import cn from 'clsx'
import type { LenisOptions } from 'lenis'
import dynamic from 'next/dynamic'
import { Footer } from '@/components/layout/footer'
import { Theme } from '@/components/layout/theme'
import type { ThemeName } from '@/styles/config'
import s from './wrapper.module.css'

const LazyLenis = dynamic(
  () => import('@/components/layout/lenis').then((mod) => mod.Lenis),
  {
    ssr: false,
  }
)

interface WrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Theme to apply ('dark' | 'light' | 'red'). Defaults to 'dark'. */
  theme?: ThemeName
  /** Enable smooth scrolling. Can be boolean or Lenis configuration object. Defaults to true. */
  lenis?: boolean | LenisOptions
}

export function Wrapper({
  children,
  theme = 'dark',
  className,
  lenis = true,
  ...props
}: WrapperProps) {
  const main = (
    <main
      id="main-content"
      className={cn(s.root, className)}
      {...props}
    >
      {children}
    </main>
  )

  return (
    <Theme theme={theme} global>
      {main}
      <Footer />
      {lenis && (
        <LazyLenis
          root
          syncScrollTrigger
          options={typeof lenis === 'object' ? lenis : {}}
        />
      )}
    </Theme>
  )
}
