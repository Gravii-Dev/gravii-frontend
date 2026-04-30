'use client'

import type { SharedContentProps } from '@/features/launch-app/types'
import ComingSoonContent from '@/features/coming-soon/coming-soon-content'

export default function DiscoveryContent(props: SharedContentProps) {
  return (
    <ComingSoonContent
      {...props}
      eyebrow="Discovery"
      title="Curated campaigns are being staged."
      copy="Discovery is reserved for verified partner drops that can be ranked by persona, eligibility, and wallet context. The surface is ready; campaign inventory and claim actions will attach as the backend contract stabilizes."
      metrics={[
        { label: 'Catalog', value: 'Partner-led', meta: 'Campaign inventory will resolve from verified partner surfaces.' },
        { label: 'Match', value: 'Persona', meta: 'Gravii ID should drive eligibility, ordering, and campaign fit.' },
        { label: 'Access', value: 'Gated', meta: 'Reserved for connected wallets with live identity context.' },
        { label: 'Action', value: 'Claim path', meta: 'Qualification and handoff flows need backend contracts first.' },
      ]}
      primaryActionLabel="Open Gravii ID"
      primaryRoute="profile"
      secondaryActionLabel="Run X-Ray"
      secondaryRoute="lookup"
      steps={[
        { label: 'Panel routing and reserved chrome', status: 'ready' },
        { label: 'Partner campaign workflow', status: 'building' },
        { label: 'Eligibility action backend', status: 'queued' },
      ]}
    />
  )
}
