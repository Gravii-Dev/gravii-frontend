import type {
  WorkspaceModuleId,
  WorkspaceScenarioId
} from '@/lib/workspace-scenarios'

export type PageId =
  | 'analyze'
  | 'drive'
  | 'api'
  | 'bot'
  | 'agent'
  | 'overview'
  | 'analytics'
  | 'labels'
  | 'risk'
  | 'campaigns'
  | 'campmanager'
  | 'settings'

export type NavSection = 'LENS' | 'CONNECT' | 'DASHBOARD' | 'SETTINGS'

export interface AppShellNavItem {
  pageId: PageId
  label: string
  href: string
  section: NavSection
}

export interface WorkspaceSurfaceOption {
  pageId: Exclude<PageId, 'settings'>
  label: string
  href: string
  section: 'LENS' | 'CONNECT' | 'DASHBOARD' | 'REACH'
}

export const pageHrefMap: Record<PageId, string> = {
  analyze: '/lens',
  drive: '/connect?module=xray-link',
  api: '/connect?module=gate-api',
  bot: '/connect?module=community-bot',
  agent: '/connect?module=agent-api',
  overview: '/dashboard',
  analytics: '/analytics',
  labels: '/labels',
  risk: '/risk',
  campaigns: '/reach',
  campmanager: '/campaign-manager',
  settings: '/settings'
}

export const appShellNavItems: AppShellNavItem[] = [
  { pageId: 'analyze', label: 'Upload & Report', href: pageHrefMap.analyze, section: 'LENS' },
  { pageId: 'drive', label: 'X-Ray Users', href: pageHrefMap.drive, section: 'CONNECT' },
  { pageId: 'api', label: 'API Setup', href: pageHrefMap.api, section: 'CONNECT' },
  { pageId: 'bot', label: 'Community Bot', href: pageHrefMap.bot, section: 'CONNECT' },
  { pageId: 'agent', label: 'Agent API', href: pageHrefMap.agent, section: 'CONNECT' },
  { pageId: 'overview', label: 'Overview', href: pageHrefMap.overview, section: 'DASHBOARD' },
  { pageId: 'analytics', label: 'User Analytics', href: pageHrefMap.analytics, section: 'DASHBOARD' },
  { pageId: 'labels', label: 'User Segments', href: pageHrefMap.labels, section: 'DASHBOARD' },
  { pageId: 'risk', label: 'Risk & Sybil', href: pageHrefMap.risk, section: 'DASHBOARD' },
  { pageId: 'settings', label: 'Settings', href: pageHrefMap.settings, section: 'SETTINGS' }
]

export const modulePageMap: Record<WorkspaceModuleId, PageId[]> = {
  dashboard: ['overview', 'analytics', 'labels', 'risk'],
  lens: ['analyze'],
  connect: ['drive', 'api', 'bot', 'agent'],
  reach: ['campaigns', 'campmanager'],
  alerts: ['risk']
}

export const workspaceSurfaceOptions: WorkspaceSurfaceOption[] = [
  { pageId: 'analyze', label: 'Upload & Report', href: pageHrefMap.analyze, section: 'LENS' },
  { pageId: 'drive', label: 'X-Ray Users', href: pageHrefMap.drive, section: 'CONNECT' },
  { pageId: 'api', label: 'API Setup', href: pageHrefMap.api, section: 'CONNECT' },
  { pageId: 'bot', label: 'Community Bot', href: pageHrefMap.bot, section: 'CONNECT' },
  { pageId: 'agent', label: 'Agent API', href: pageHrefMap.agent, section: 'CONNECT' },
  { pageId: 'overview', label: 'Overview', href: pageHrefMap.overview, section: 'DASHBOARD' },
  { pageId: 'analytics', label: 'User Analytics', href: pageHrefMap.analytics, section: 'DASHBOARD' },
  { pageId: 'labels', label: 'User Segments', href: pageHrefMap.labels, section: 'DASHBOARD' },
  { pageId: 'risk', label: 'Risk & Sybil', href: pageHrefMap.risk, section: 'DASHBOARD' },
  { pageId: 'campaigns', label: 'Create Campaign', href: pageHrefMap.campaigns, section: 'REACH' },
  { pageId: 'campmanager', label: 'Manager', href: pageHrefMap.campmanager, section: 'REACH' }
]

export const scenarioPageMap: Record<WorkspaceScenarioId, Exclude<PageId, 'settings'>[]> = {
  analyze: ['analyze', 'overview', 'labels', 'risk'],
  'verify-api': ['api'],
  'verify-bot': ['bot'],
  'verify-agent': ['agent'],
  'engage-private': ['drive', 'overview', 'analytics', 'labels', 'risk', 'campaigns', 'campmanager'],
  'engage-grow': ['drive', 'overview', 'analytics', 'labels', 'risk', 'campaigns', 'campmanager'],
  'engage-acquire': ['campaigns', 'campmanager']
}

const workspaceFallbackOrder: PageId[] = [
  'analyze',
  'drive',
  'api',
  'bot',
  'agent',
  'overview',
  'analytics',
  'labels',
  'risk',
  'campaigns',
  'campmanager',
  'settings'
]

export const insightsHint =
  'Explore the dashboard, or type a question here.\n\n' +
  'e.g. "Which segment has the highest retention?"'

export const campaignHint =
  'Fill in the form yourself, or type here and we will set it up.\n\n' +
  'e.g. "Yield boost for Black tier stakers on Ethereum"'

export function isPageId(value: unknown): value is PageId {
  return typeof value === 'string' && workspaceFallbackOrder.includes(value as PageId)
}

export function getPageId(pathname: string, moduleId: string | null): PageId | null {
  if (pathname === '/lens') {
    return 'analyze'
  }

  if (pathname === '/connect') {
    if (moduleId === 'gate-api') {
      return 'api'
    }

    if (moduleId === 'community-bot') {
      return 'bot'
    }

    if (moduleId === 'agent-api') {
      return 'agent'
    }

    return 'drive'
  }

  if (pathname === '/dashboard') {
    return 'overview'
  }

  if (pathname === '/analytics') {
    return 'analytics'
  }

  if (pathname === '/labels') {
    return 'labels'
  }

  if (pathname === '/risk') {
    return 'risk'
  }

  if (pathname === '/reach') {
    return 'campaigns'
  }

  if (pathname === '/campaign-manager') {
    return 'campmanager'
  }

  if (pathname === '/settings') {
    return 'settings'
  }

  return null
}

export function getRecommendedPagesForScenario(
  scenarioId: WorkspaceScenarioId
): Exclude<PageId, 'settings'>[] {
  return [...(scenarioPageMap[scenarioId] ?? [])]
}

export function getModuleIdsFromPages(pageIds: readonly Exclude<PageId, 'settings'>[]): WorkspaceModuleId[] {
  const enabledPageSet = new Set(pageIds)
  const nextModules = Object.entries(modulePageMap).flatMap(([moduleId, mappedPages]) =>
    mappedPages.some((pageId) => enabledPageSet.has(pageId as Exclude<PageId, 'settings'>))
      ? [moduleId as WorkspaceModuleId]
      : []
  )

  return Array.from(new Set(nextModules))
}

export function getPagesFromModules(
  moduleIds: readonly WorkspaceModuleId[]
): Exclude<PageId, 'settings'>[] {
  const nextPages = moduleIds.flatMap((moduleId) => modulePageMap[moduleId] ?? [])

  return Array.from(
    new Set(nextPages.filter((pageId): pageId is Exclude<PageId, 'settings'> => pageId !== 'settings'))
  )
}

export function getVisiblePageIds(
  enabledPages: readonly Exclude<PageId, 'settings'>[]
): Set<PageId> {
  if (enabledPages.length === 0) {
    return new Set(['settings'])
  }

  return new Set([...enabledPages, 'settings'])
}

export function getDefaultWorkspaceHref(
  enabledPages: readonly Exclude<PageId, 'settings'>[]
): string {
  const visiblePages = getVisiblePageIds(enabledPages)

  for (const pageId of workspaceFallbackOrder) {
    if (visiblePages.has(pageId)) {
      return pageHrefMap[pageId]
    }
  }

  return pageHrefMap.settings
}
