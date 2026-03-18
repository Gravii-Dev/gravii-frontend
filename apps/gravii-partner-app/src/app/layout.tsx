import type { Metadata } from 'next'
import { DM_Sans, JetBrains_Mono, Outfit, Sora, Space_Grotesk } from 'next/font/google'
import { Suspense } from 'react'

import { AppShell } from '@/components/layout/app-shell'

import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-sans'
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display'
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono'
})

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora'
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm'
})

export const metadata: Metadata = {
  title: 'Gravii Partner Workspace',
  description:
    'Productized Gravii partner workspace for Lens, Connect, Reach, and partner intelligence operations.'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${sora.variable} ${dmSans.variable}`}
      >
        <Suspense fallback={children}>
          <AppShell>{children}</AppShell>
        </Suspense>
      </body>
    </html>
  )
}
