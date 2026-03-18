export type WorkspaceScenarioId =
  | 'engage-private'
  | 'engage-grow'
  | 'engage-acquire'
  | 'analyze'
  | 'verify-api'
  | 'verify-bot'
  | 'verify-agent'

export type WorkspaceModuleId = 'dashboard' | 'lens' | 'connect' | 'reach' | 'alerts'

export type ReachScopeDefault = 'myusers' | 'discoverNew' | 'both'

export interface WorkspaceScenario {
  id: WorkspaceScenarioId
  title: string
  description: string
  destination: string
  recommendedModules: WorkspaceModuleId[]
  scopeDefault?: ReachScopeDefault
  category: 'reach' | 'lens' | 'gate'
}

export interface WorkspaceModule {
  id: WorkspaceModuleId
  title: string
  description: string
}

export const activeScenarioStorageKey = 'gravii-partner-active-scenario'

export const workspaceScenarios = [
  {
    id: 'engage-private',
    title: 'Your ecosystem only',
    description: 'Target and engage users already on your platform with closed-loop activation.',
    destination: '/connect?module=xray-link',
    recommendedModules: ['connect', 'dashboard', 'reach', 'alerts'],
    scopeDefault: 'myusers',
    category: 'reach'
  },
  {
    id: 'engage-grow',
    title: 'Expand with Gravii pool',
    description: 'Reach your existing users and tap into Gravii’s verified network at once.',
    destination: '/connect?module=xray-link',
    recommendedModules: ['connect', 'dashboard', 'reach', 'alerts'],
    scopeDefault: 'both',
    category: 'reach'
  },
  {
    id: 'engage-acquire',
    title: 'Discover new users',
    description: 'Handpick verified users from the Gravii pool by tier, persona, and chain.',
    destination: '/reach',
    recommendedModules: ['reach', 'connect', 'alerts'],
    scopeDefault: 'discoverNew',
    category: 'reach'
  },
  {
    id: 'analyze',
    title: 'See your user pool',
    description: 'Upload a wallet list first, then inspect the cohort in detail.',
    destination: '/lens',
    recommendedModules: ['lens', 'dashboard'],
    category: 'lens'
  },
  {
    id: 'verify-api',
    title: 'Web API',
    description: 'Use Gate API for real-time verification on wallet connect.',
    destination: '/connect?module=gate-api',
    recommendedModules: ['connect', 'dashboard', 'alerts'],
    category: 'gate'
  },
  {
    id: 'verify-bot',
    title: 'Community Bot',
    description: 'Drive Discord or Telegram verification without product engineering.',
    destination: '/connect?module=community-bot',
    recommendedModules: ['connect'],
    category: 'gate'
  },
  {
    id: 'verify-agent',
    title: 'Agent API',
    description: 'Expose boolean verification checks for AI-native experiences.',
    destination: '/connect?module=agent-api',
    recommendedModules: ['connect'],
    category: 'gate'
  }
] satisfies WorkspaceScenario[]

export const workspaceModules = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Core partner intelligence, geo mix, risk blocks, and commercial KPIs.'
  },
  {
    id: 'lens',
    title: 'Lens',
    description: 'Upload wallet lists and generate a compact marketability snapshot.'
  },
  {
    id: 'connect',
    title: 'Connect',
    description: 'Drive, API, bot, and agent activation channels.'
  },
  {
    id: 'reach',
    title: 'Reach',
    description: 'Campaign builder, targeting rules, and live preview surfaces.'
  },
  {
    id: 'alerts',
    title: 'Risk alerts',
    description: 'Fraud-sensitive review queues and ops notifications for launch safety.'
  }
] satisfies WorkspaceModule[]

export function isWorkspaceScenarioId(value: unknown): value is WorkspaceScenarioId {
  return workspaceScenarios.some((scenario) => scenario.id === value)
}

export function isWorkspaceModuleId(value: unknown): value is WorkspaceModuleId {
  return workspaceModules.some((module) => module.id === value)
}

export function getWorkspaceScenario(id: WorkspaceScenarioId | null | undefined): WorkspaceScenario | null {
  return workspaceScenarios.find((scenario) => scenario.id === id) ?? null
}
