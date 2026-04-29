export interface IntegrationModule {
  id: string
  title: string
  category: string
  description: string
  ctaLabel: string
  secondaryLabel?: string
  tone: 'blue' | 'teal' | 'amber'
  detail: string
}

export const integrationModules = [
  {
    id: 'xray-link',
    title: 'X-Ray Users',
    category: 'No-code acquisition',
    description:
      "Share your unique link and let Gravii profile wallets before they ever touch your internal tooling.",
    ctaLabel: 'Copy link',
    secondaryLabel: 'Launch on Reach',
    tone: 'teal',
    detail: 'https://gravii.io/ref/PARTNER_CODE'
  },
  {
    id: 'gate-api',
    title: 'Web API',
    category: 'Developer integration',
    description:
      'Query tier, persona, value range, and risk posture at wallet connect with a single authenticated request.',
    ctaLabel: 'Reveal API key',
    secondaryLabel: 'Open docs',
    tone: 'blue',
    detail: 'GET /v1/lookup/{wallet_address} → { tier, persona, valueRange, sybilStatus }'
  },
  {
    id: 'community-bot',
    title: 'Community Bot',
    category: 'Community ops',
    description:
      'Auto-assign Discord or Telegram roles when members verify their wallet through Gravii.',
    ctaLabel: 'Connect Discord',
    secondaryLabel: 'Connect Telegram',
    tone: 'amber',
    detail: 'Operated by Gravii, so raw user data never needs to reach your servers.'
  },
  {
    id: 'agent-api',
    title: 'Agent API',
    category: 'AI-native access',
    description:
      'Expose boolean verification checks for agents without leaking rich user profiles or tier histories.',
    ctaLabel: 'View example',
    secondaryLabel: 'Request credits',
    tone: 'blue',
    detail: 'POST /v1/agent/verify-condition → true | false'
  }
] satisfies IntegrationModule[]

export const connectHighlights = [
  {
    label: 'Integration readiness',
    value: '4 / 4',
    helper: 'All major entry points represented with production boundaries'
  },
  {
    label: 'Security stance',
    value: 'Least privilege',
    helper: 'Partner workspace only exposes the data shape required for the job'
  },
  {
    label: 'Launch checklist',
    value: '2 blockers',
    helper: 'Need API secrets + community bot auth flow before real launch'
  }
]
