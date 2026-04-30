import type { PartnerProfile } from '@gravii/domain-types'
import { useMemo } from 'react'

import { usePartnerAuth } from '@/features/auth/auth-provider'
import {
  getDefaultWorkspaceHref,
  getPagesFromModules,
  getVisiblePageIds,
  type PageId
} from '@/lib/workspace-navigation'
import {
  createWorkspaceSettingsForScenario,
  useWorkspaceSettings,
  type WorkspaceSettingsState
} from '@/lib/workspace-settings'
import {
  workspaceScenarios,
  type WorkspaceModuleId,
  type WorkspaceScenarioId
} from '@/lib/workspace-scenarios'

const planModuleAccessMap: Record<PartnerProfile['plan'], readonly WorkspaceModuleId[]> = {
  // The backend profile does not yet expose granular feature entitlements.
  // Until it does, every active partner plan unlocks the same workspace surface.
  enterprise: ['dashboard', 'lens', 'connect', 'reach', 'alerts'],
  free: ['dashboard', 'lens', 'connect', 'reach', 'alerts'],
  pro: ['dashboard', 'lens', 'connect', 'reach', 'alerts'],
  starter: ['dashboard', 'lens', 'connect', 'reach', 'alerts']
}

export interface WorkspaceAccessState {
  allowedModules: WorkspaceModuleId[]
  allowedScenarioIds: WorkspaceScenarioId[]
  canAccessWorkspace: boolean
  defaultHref: string
  enabledModules: WorkspaceModuleId[]
  enabledPages: Exclude<PageId, 'settings'>[]
  isSuspended: boolean
  visiblePages: Set<PageId>
}

function intersectModules(
  requestedModules: readonly WorkspaceModuleId[],
  allowedModules: readonly WorkspaceModuleId[]
): WorkspaceModuleId[] {
  const allowedSet = new Set(allowedModules)

  return requestedModules.filter((moduleId) => allowedSet.has(moduleId))
}

function intersectPages(
  requestedPages: readonly Exclude<PageId, 'settings'>[],
  allowedPages: readonly Exclude<PageId, 'settings'>[]
): Exclude<PageId, 'settings'>[] {
  const allowedSet = new Set<PageId>(allowedPages)

  return requestedPages.filter((pageId) => allowedSet.has(pageId))
}

function getAllowedScenarioIds(
  allowedModules: readonly WorkspaceModuleId[]
): WorkspaceScenarioId[] {
  if (allowedModules.length === 0) {
    return []
  }

  const allowedSet = new Set(allowedModules)

  return workspaceScenarios
    .filter((scenario) =>
      scenario.recommendedModules.every((moduleId) => allowedSet.has(moduleId))
    )
    .map((scenario) => scenario.id)
}

export function resolveWorkspaceAccess(
  partner: PartnerProfile | null,
  workspaceSettings: WorkspaceSettingsState
): WorkspaceAccessState {
  if (!partner) {
    return {
      allowedModules: [],
      allowedScenarioIds: [],
      canAccessWorkspace: false,
      defaultHref: '/settings',
      enabledModules: [],
      enabledPages: [],
      isSuspended: false,
      visiblePages: new Set<PageId>(['settings'])
    }
  }

  const isSuspended = partner.status !== 'active'

  if (isSuspended) {
    return {
      allowedModules: [],
      allowedScenarioIds: [],
      canAccessWorkspace: false,
      defaultHref: '/settings',
      enabledModules: [],
      enabledPages: [],
      isSuspended: true,
      visiblePages: new Set<PageId>(['settings'])
    }
  }

  const allowedModules = [...(planModuleAccessMap[partner.plan] ?? planModuleAccessMap.free)]
  const allowedPages = getPagesFromModules(allowedModules)
  const allowedScenarioIds = getAllowedScenarioIds(allowedModules)

  const scenarioFallback =
    allowedScenarioIds[0] ??
    workspaceSettings.scenario

  const fallbackSettings = createWorkspaceSettingsForScenario(scenarioFallback)

  const nextEnabledPages = intersectPages(
    workspaceSettings.enabledPages,
    allowedPages
  )

  const enabledPages =
    nextEnabledPages.length > 0
      ? nextEnabledPages
      : intersectPages(fallbackSettings.enabledPages, allowedPages)

  const enabledModules = intersectModules(
    workspaceSettings.enabledModules,
    allowedModules
  )

  return {
    allowedModules,
    allowedScenarioIds,
    canAccessWorkspace: true,
    defaultHref: getDefaultWorkspaceHref(enabledPages),
    enabledModules: enabledModules.length > 0 ? enabledModules : [...allowedModules],
    enabledPages,
    isSuspended: false,
    visiblePages: getVisiblePageIds(enabledPages)
  }
}

export function useWorkspaceAccess(): WorkspaceAccessState {
  const auth = usePartnerAuth()
  const workspaceSettings = useWorkspaceSettings()

  return useMemo(
    () => resolveWorkspaceAccess(auth.session, workspaceSettings),
    [auth.session, workspaceSettings]
  )
}
