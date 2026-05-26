export type PersonaTier =
  | 'BASE'
  | 'CLASSIC'
  | 'GOLD'
  | 'PLATINUM'
  | 'BLACK'
  | 'OBSIDIAN'

export type Persona = {
  id: string
  name: string
  illustration: string
  tier: PersonaTier
  handle: string
  chain: string
  since: string
  issuedAt: string
}

export const TIER_ORDER: PersonaTier[] = [
  'BASE',
  'CLASSIC',
  'GOLD',
  'PLATINUM',
  'BLACK',
  'OBSIDIAN',
]

export const TIER_INDEX: Record<PersonaTier, number> = {
  BASE: 0,
  CLASSIC: 1,
  GOLD: 2,
  PLATINUM: 3,
  BLACK: 4,
  OBSIDIAN: 5,
}

export const TIER_COLORS: Record<PersonaTier, string> = {
  BASE: '#abff84',
  CLASSIC: '#00bae2',
  GOLD: '#f4d23a',
  PLATINUM: '#c8c8d2',
  BLACK: '#42433d',
  OBSIDIAN: '#1a1418',
}

export const DEMO_PERSONAS: readonly Persona[] = [
  {
    id: 'diamond-hands',
    name: 'DIAMOND HANDS',
    illustration: '/personas/diamond-hands.svg',
    tier: 'PLATINUM',
    handle: '@vivienne.gv',
    chain: 'Base',
    since: '2022',
    issuedAt: '2026·05·03',
  },
  {
    id: 'active-trader',
    name: 'ACTIVE TRADER',
    illustration: '/personas/active-trader.svg',
    tier: 'GOLD',
    handle: '@kaito.gv',
    chain: 'Base',
    since: '2023',
    issuedAt: '2026·05·03',
  },
  {
    id: 'new-voyager',
    name: 'NEW VOYAGER',
    illustration: '/personas/new-voyager.svg',
    tier: 'BASE',
    handle: '@minji.gv',
    chain: 'Base',
    since: '2026',
    issuedAt: '2026·05·03',
  },
] as const
