import { useSyncExternalStore } from 'react'

import {
  activeScenarioStorageKey,
  getWorkspaceScenario,
  isWorkspaceModuleId,
  isWorkspaceScenarioId,
  type WorkspaceModuleId,
  type WorkspaceScenarioId
} from '@/lib/workspace-scenarios'
import {
  getModuleIdsFromPages,
  getPagesFromModules,
  getRecommendedPagesForScenario,
  isPageId,
  type PageId
} from '@/lib/workspace-navigation'

export interface WorkspaceSettingsState {
  scenario: WorkspaceScenarioId
  enabledPages: Exclude<PageId, 'settings'>[]
  enabledModules: WorkspaceModuleId[]
  strictRiskReview: boolean
  weeklyDigest: boolean
}

export const workspaceSettingsStorageKey = 'gravii-partner-workspace-settings'

const workspaceSettingsEventName = 'gravii-workspace-settings'

export const defaultWorkspaceSettingsState: WorkspaceSettingsState = {
  scenario: 'engage-grow',
  enabledPages: getRecommendedPagesForScenario('engage-grow'),
  enabledModules: ['dashboard', 'reach', 'connect', 'alerts'],
  strictRiskReview: true,
  weeklyDigest: true
}

let cachedWorkspaceSettingsSnapshot: WorkspaceSettingsState = defaultWorkspaceSettingsState

function normalizeEnabledModules(moduleIds: readonly WorkspaceModuleId[]): WorkspaceModuleId[] {
  return Array.from(new Set(moduleIds))
}

function normalizeEnabledPages(
  pageIds: readonly Exclude<PageId, 'settings'>[]
): Exclude<PageId, 'settings'>[] {
  return Array.from(new Set(pageIds))
}

function normalizeWorkspaceSettingsState(
  state: WorkspaceSettingsState
): WorkspaceSettingsState {
  const enabledPages = normalizeEnabledPages(state.enabledPages)

  return {
    ...state,
    enabledPages,
    enabledModules: normalizeEnabledModules(getModuleIdsFromPages(enabledPages))
  }
}

function areListsEqual<T extends string>(left: readonly T[], right: readonly T[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index])
}

function areWorkspaceSettingsEqual(
  left: WorkspaceSettingsState,
  right: WorkspaceSettingsState
): boolean {
  return (
    left.scenario === right.scenario &&
    left.strictRiskReview === right.strictRiskReview &&
    left.weeklyDigest === right.weeklyDigest &&
    areListsEqual(left.enabledPages, right.enabledPages) &&
    areListsEqual(left.enabledModules, right.enabledModules)
  )
}

function cacheWorkspaceSettingsSnapshot(
  nextState: WorkspaceSettingsState
): WorkspaceSettingsState {
  if (areWorkspaceSettingsEqual(cachedWorkspaceSettingsSnapshot, nextState)) {
    return cachedWorkspaceSettingsSnapshot
  }

  cachedWorkspaceSettingsSnapshot = nextState
  return cachedWorkspaceSettingsSnapshot
}

function parseWorkspaceSettingsState(value: unknown): WorkspaceSettingsState | null {
  if (typeof value !== 'object' || value === null) {
    return null
  }

  const candidate = value as Record<string, unknown>
  const hasValidScenario = isWorkspaceScenarioId(candidate.scenario)
  const hasValidFlags =
    typeof candidate.strictRiskReview === 'boolean' && typeof candidate.weeklyDigest === 'boolean'

  if (!hasValidScenario || !hasValidFlags) {
    return null
  }

  const scenario = candidate.scenario as WorkspaceScenarioId
  const strictRiskReview = candidate.strictRiskReview as boolean
  const weeklyDigest = candidate.weeklyDigest as boolean

  const enabledPages =
    Array.isArray(candidate.enabledPages) &&
    candidate.enabledPages.every((pageId) => isPageId(pageId) && pageId !== 'settings')
      ? normalizeEnabledPages(candidate.enabledPages as Exclude<PageId, 'settings'>[])
    : Array.isArray(candidate.enabledModules) &&
        candidate.enabledModules.every((moduleId) => isWorkspaceModuleId(moduleId))
      ? getPagesFromModules(candidate.enabledModules as WorkspaceModuleId[])
      : getRecommendedPagesForScenario(scenario)

  const enabledModules =
    Array.isArray(candidate.enabledModules) &&
    candidate.enabledModules.every((moduleId) => isWorkspaceModuleId(moduleId))
      ? normalizeEnabledModules(candidate.enabledModules as WorkspaceModuleId[])
      : getModuleIdsFromPages(enabledPages)

  return normalizeWorkspaceSettingsState({
    scenario,
    enabledPages,
    enabledModules,
    strictRiskReview,
    weeklyDigest
  })
}

export function createWorkspaceSettingsForScenario(
  scenarioId: WorkspaceScenarioId
): WorkspaceSettingsState {
  const scenario = getWorkspaceScenario(scenarioId)

  if (!scenario) {
    return defaultWorkspaceSettingsState
  }

  return {
    ...defaultWorkspaceSettingsState,
    scenario: scenario.id,
    enabledPages: getRecommendedPagesForScenario(scenario.id),
    enabledModules: normalizeEnabledModules(scenario.recommendedModules)
  }
}

export function readWorkspaceSettings(): WorkspaceSettingsState {
  if (typeof window === 'undefined') {
    return cachedWorkspaceSettingsSnapshot
  }

  const raw = window.localStorage.getItem(workspaceSettingsStorageKey)

  if (raw) {
    try {
      const parsed: unknown = JSON.parse(raw)

      const nextState = parseWorkspaceSettingsState(parsed)

      if (nextState) {
        return cacheWorkspaceSettingsSnapshot(nextState)
      }
    } catch {
      window.localStorage.removeItem(workspaceSettingsStorageKey)
    }
  }

  const activeScenario = window.localStorage.getItem(activeScenarioStorageKey)

  if (isWorkspaceScenarioId(activeScenario)) {
    return cacheWorkspaceSettingsSnapshot(createWorkspaceSettingsForScenario(activeScenario))
  }

  return cacheWorkspaceSettingsSnapshot(defaultWorkspaceSettingsState)
}

export function writeWorkspaceSettings(state: WorkspaceSettingsState): void {
  if (typeof window === 'undefined') {
    return
  }

  const normalizedState = normalizeWorkspaceSettingsState(state)
  cachedWorkspaceSettingsSnapshot = cacheWorkspaceSettingsSnapshot(normalizedState)

  window.localStorage.setItem(
    workspaceSettingsStorageKey,
    JSON.stringify(cachedWorkspaceSettingsSnapshot)
  )
  window.localStorage.setItem(activeScenarioStorageKey, cachedWorkspaceSettingsSnapshot.scenario)
  window.dispatchEvent(new Event(workspaceSettingsEventName))
}

export function ensureWorkspacePagesEnabled(
  pageIds: readonly Exclude<PageId, 'settings'>[]
): WorkspaceSettingsState {
  const currentState = readWorkspaceSettings()
  const nextEnabledPages = normalizeEnabledPages([...currentState.enabledPages, ...pageIds])

  if (areListsEqual(currentState.enabledPages, nextEnabledPages)) {
    return currentState
  }

  const nextState = normalizeWorkspaceSettingsState({
    ...currentState,
    enabledPages: nextEnabledPages
  })

  writeWorkspaceSettings(nextState)
  return nextState
}

export function subscribeWorkspaceSettings(callback: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => undefined
  }

  const handleStorage = (event: Event) => {
    if (event instanceof StorageEvent) {
      if (
        event.key !== workspaceSettingsStorageKey &&
        event.key !== activeScenarioStorageKey
      ) {
        return
      }
    }

    callback()
  }

  window.addEventListener(workspaceSettingsEventName, handleStorage)
  window.addEventListener('storage', handleStorage)

  return () => {
    window.removeEventListener(workspaceSettingsEventName, handleStorage)
    window.removeEventListener('storage', handleStorage)
  }
}

export function useWorkspaceSettings(): WorkspaceSettingsState {
  return useSyncExternalStore(
    subscribeWorkspaceSettings,
    readWorkspaceSettings,
    () => cachedWorkspaceSettingsSnapshot
  )
}
