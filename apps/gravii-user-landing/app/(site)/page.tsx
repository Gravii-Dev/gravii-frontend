import { SiteShell } from '@/components/layout/site-shell'
import { StickyHeader } from '@/components/layout/sticky-header'
import { Bridge } from '@/components/sections/bridge'
import { Hero } from '@/components/sections/hero'
import { Inside } from '@/components/sections/inside'
import { IntroOne } from '@/components/sections/intro-one'
import { IntroTwo } from '@/components/sections/intro-two'
import { Passport } from '@/components/sections/passport'
import { Recognition } from '@/components/sections/recognition'
import { Vision } from '@/components/sections/vision'
import { Waitlist } from '@/components/sections/waitlist'

export default function Home() {
  return (
    <SiteShell>
      <StickyHeader />
      <div>
        <Hero />
        <IntroOne />
        <IntroTwo />
        <Recognition />
        <Bridge />
        <Passport />
        <Inside />
        <Vision />
        <Waitlist />
      </div>
    </SiteShell>
  )
}
