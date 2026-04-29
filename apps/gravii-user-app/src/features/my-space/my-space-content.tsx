'use client'

import type { SharedContentProps } from '@/features/launch-app/types'
import ComingSoonContent from '@/features/coming-soon/coming-soon-content'

export default function MySpaceContent(props: SharedContentProps) {
  return (
    <ComingSoonContent
      {...props}
      eyebrow="My Space"
      title="Your private feed is being composed."
      copy="My Space will become the personal room for matched benefits, saved claims, and concierge-style curation. The shell is ready now, while persistence and benefit matching move behind the scenes."
      metrics={[
        { label: 'Feed', value: 'Personal', meta: 'Reserved for matched campaigns, claims, and benefit history.' },
        { label: 'Source', value: 'Gravii ID', meta: 'Persona, tier, and reputation should drive the first feed.' },
        { label: 'Mode', value: 'Curated', meta: 'The surface should feel selected, not like a generic catalog.' },
        { label: 'Next', value: 'Opt-in', meta: 'Saved benefits and follow-up actions require persistence.' },
      ]}
      primaryActionLabel="Open Gravii ID"
      primaryRoute="profile"
      secondaryActionLabel="Inspect X-Ray"
      secondaryRoute="lookup"
      steps={[
        { label: 'Personalized panel slot', status: 'ready' },
        { label: 'Benefit matching model', status: 'building' },
        { label: 'Saved space persistence', status: 'queued' },
      ]}
    />
  )
}
