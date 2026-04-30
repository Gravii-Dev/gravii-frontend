'use client'

import type { SharedContentProps } from '@/features/launch-app/types'
import ComingSoonContent from '@/features/coming-soon/coming-soon-content'

export default function StandingContent(props: SharedContentProps) {
  return (
    <ComingSoonContent
      {...props}
      eyebrow="Standing"
      title="Rank is being calibrated."
      copy="Standing is reserved for a quieter reputation layer, not a noisy leaderboard. Gravii ID already supplies the wallet graph; the next backend pass turns that graph into cohort rank, tier movement, and guarded reputation signals."
      metrics={[
        { label: 'Score model', value: 'Graph v2', meta: 'Rank inputs are being recalibrated from live identity reads.' },
        { label: 'Refresh', value: 'Daily', meta: 'Standing should feel current without rewarding noisy activity.' },
        { label: 'Scope', value: 'Tiered', meta: 'Global rank, peer rank, and persona cohorts are planned.' },
        { label: 'Integrity', value: 'Guarded', meta: 'Sybil filters and reputation flags need to land before launch.' },
      ]}
      primaryActionLabel="Review Gravii ID"
      primaryRoute="profile"
      secondaryActionLabel="Inspect X-Ray"
      secondaryRoute="lookup"
      steps={[
        { label: 'Live Gravii ID input', status: 'ready' },
        { label: 'Ranking computation job', status: 'building' },
        { label: 'User standing table', status: 'queued' },
      ]}
    />
  )
}
