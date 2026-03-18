import { getWorkspaceScenario } from '@/lib/workspace-scenarios'
import { readWorkspaceSettings } from '@/lib/workspace-settings'

import { campaignDraftStorageKey, getManagedCampaignById } from './managed-campaigns'
import {
  type AccessType,
  type ActivityId,
  type AssetFilterId,
  chainOptions,
  type PercentileId,
  regionOptions,
  type ScopeId,
  segmentOptions,
  type SybilToleranceId,
  type TargetMode,
  type ValueMetricId,
  type ValueThresholdId
} from './data'

export type SegmentId = (typeof segmentOptions)[number]['id']
export type ChainId = (typeof chainOptions)[number]['id']
export type RegionId = (typeof regionOptions)[number]['id']

export interface CampaignFormState {
  partnerName: string
  partnerLogoUrl: string
  campaignName: string
  campaignType: string
  customCampaignType: string
  category: string
  description: string
  qualificationGuide: string
  scope: ScopeId
  targetMode: TargetMode
  selectedSegments: SegmentId[]
  selectedBehaviorChains: ChainId[]
  valueMetric: ValueMetricId
  valueAssetFilter: AssetFilterId
  percentile: PercentileId
  valueThreshold: ValueThresholdId
  selectedValueChains: ChainId[]
  activity: ActivityId
  selectedRegions: RegionId[]
  sybilTolerance: SybilToleranceId
  startDate: string
  endDate: string
  accessType: AccessType
  partnerUrl: string
  ctaLabel: string
  customCtaLabel: string
}

interface StoredCampaignDraft {
  savedAt: string
  form: CampaignFormState
}

export interface CampaignBuilderProps {
  initialPrompt?: string | null
  initialCampaignId?: string | null
  initialDraftId?: string | null
}

function addDays(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().split('T')[0] ?? ''
}

function normalizeScopeId(scope: string): ScopeId {
  return scope === 'graviiall' ? 'discoverNew' : (scope as ScopeId)
}

function normalizeCampaignFormState(form: CampaignFormState): CampaignFormState {
  return {
    ...form,
    scope: normalizeScopeId(form.scope)
  }
}

export function createInitialState(): CampaignFormState {
  let scope: ScopeId = 'both'
  const scenario = getWorkspaceScenario(readWorkspaceSettings().scenario)

  if (scenario?.scopeDefault) {
    scope = scenario.scopeDefault
  }

  return {
    partnerName: 'Pendle Finance',
    partnerLogoUrl: '',
    campaignName: 'Yield Booster',
    campaignType: 'Airdrop',
    customCampaignType: '',
    category: 'Wealth & Finance',
    description:
      'Reward high-intent wallets with an early launch incentive and push them into your highest-converting funnel.',
    qualificationGuide:
      '1. Connect wallet\n2. Remain in the eligible segment until campaign start\n3. Claim through the partner landing page',
    scope,
    targetMode: 'behavior',
    selectedSegments: ['smart-saver', 'active-trader'],
    selectedBehaviorChains: ['eth', 'base'],
    valueMetric: 'portfolio',
    valueAssetFilter: 'all',
    percentile: '10',
    valueThreshold: '10k',
    selectedValueChains: ['eth'],
    activity: '30d',
    selectedRegions: ['US', 'JP', 'KR'],
    sybilTolerance: 'moderate',
    startDate: addDays(5),
    endDate: addDays(35),
    accessType: 'open',
    partnerUrl: 'https://partner.example.com/campaigns/yield-booster',
    ctaLabel: 'Join Campaign',
    customCtaLabel: ''
  }
}

export function toggleSelection<T extends string>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
}

function applyManagedCampaignPreset(
  base: CampaignFormState,
  campaignId: string | null | undefined
): CampaignFormState {
  const campaign = getManagedCampaignById(campaignId)

  if (!campaign) {
    return base
  }

  return {
    ...base,
    partnerName: campaign.partner,
    campaignName: campaign.name,
    campaignType: campaign.type,
    targetMode: campaign.formPreset.targetMode,
    selectedSegments:
      campaign.formPreset.targetMode === 'behavior'
        ? (campaign.formPreset.segments as SegmentId[] | undefined) ?? base.selectedSegments
        : [],
    selectedBehaviorChains: (campaign.formPreset.behaviorChains as ChainId[] | undefined) ?? [],
    percentile: campaign.formPreset.percentile ?? base.percentile,
    valueThreshold: campaign.formPreset.valueThreshold ?? base.valueThreshold,
    selectedValueChains: (campaign.formPreset.valueChains as ChainId[] | undefined) ?? []
  }
}

function applyPromptPreset(base: CampaignFormState, prompt: string): CampaignFormState {
  const next = { ...base }
  const lower = prompt.toLowerCase()

  next.partnerName = 'Pendle Finance'
  next.campaignName = 'Custom Campaign'
  next.description = `Auto-generated from: "${prompt}"`

  if (
    lower.includes('yield') ||
    lower.includes('boost') ||
    lower.includes('staker') ||
    lower.includes('staking')
  ) {
    next.campaignName = 'Yield Booster'
    next.campaignType = 'Yield Boost'
    next.targetMode = 'behavior'
    next.selectedSegments = ['smart-saver', 'market-provider']
  } else if (lower.includes('airdrop') || lower.includes('drop')) {
    next.campaignName = 'Token Airdrop'
    next.campaignType = 'Airdrop'
    next.targetMode = 'behavior'
    next.selectedSegments = ['profit-hunter', 'strategic-holder']
  } else if (
    lower.includes('cashback') ||
    lower.includes('spending') ||
    lower.includes('stable')
  ) {
    next.campaignName = 'Cashback Rewards'
    next.campaignType = 'Cashback'
    next.targetMode = 'value'
    next.valueAssetFilter = 'stables'
    next.percentile = '20'
    next.valueThreshold = '1k'
  } else if (
    lower.includes('fee') ||
    lower.includes('discount') ||
    lower.includes('trader') ||
    lower.includes('trad')
  ) {
    next.campaignName = 'Fee Discount Program'
    next.campaignType = 'Fee Discount'
    next.targetMode = 'behavior'
    next.selectedSegments = ['active-trader']
  } else if (lower.includes('referral') || lower.includes('invite')) {
    next.campaignName = 'Referral Bonus'
    next.campaignType = 'Referral Bonus'
    next.targetMode = 'behavior'
    next.selectedSegments = ['strategic-holder']
    next.accessType = 'invite'
  }

  const chainMatches: ChainId[] = []
  const chainMap: Record<string, ChainId> = {
    eth: 'eth',
    ethereum: 'eth',
    base: 'base',
    arbitrum: 'arb',
    arb: 'arb',
    bsc: 'bsc',
    polygon: 'poly',
    poly: 'poly',
    solana: 'sol',
    sol: 'sol',
    kaia: 'kaia'
  }

  for (const [keyword, chainId] of Object.entries(chainMap)) {
    if (lower.includes(keyword) && !chainMatches.includes(chainId)) {
      chainMatches.push(chainId)
    }
  }

  if (next.targetMode === 'behavior') {
    next.selectedBehaviorChains = chainMatches.length > 0 ? chainMatches : base.selectedBehaviorChains
    next.selectedValueChains = []
  } else {
    next.selectedValueChains = chainMatches.length > 0 ? chainMatches : base.selectedValueChains
    next.selectedBehaviorChains = []
  }

  if (lower.includes('black') || lower.includes('top 5%') || lower.includes('top5')) {
    next.targetMode = 'value'
    next.percentile = '5'
  } else if (lower.includes('platinum') || lower.includes('top 10%') || lower.includes('top10')) {
    next.targetMode = 'value'
    next.percentile = '10'
  } else if (lower.includes('gold') || lower.includes('top 20%') || lower.includes('top20')) {
    next.targetMode = 'value'
    next.percentile = '20'
  } else if (lower.includes('classic') || lower.includes('top 50%') || lower.includes('top50')) {
    next.targetMode = 'value'
    next.percentile = '50'
  }

  if (lower.includes('invite')) {
    next.accessType = 'invite'
  }

  if (next.targetMode === 'value') {
    next.selectedSegments = []
    next.selectedBehaviorChains = []
    next.selectedValueChains = chainMatches.length > 0 ? chainMatches : base.selectedValueChains
  } else {
    next.selectedValueChains = []
  }

  return next
}

export function readStoredDraft(): CampaignFormState | null {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = window.localStorage.getItem(campaignDraftStorageKey)

  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as StoredCampaignDraft | CampaignFormState

    if ('form' in parsed) {
      return normalizeCampaignFormState(parsed.form)
    }

    return normalizeCampaignFormState(parsed)
  } catch {
    return null
  }
}

export function writeStoredDraft(form: CampaignFormState): void {
  if (typeof window === 'undefined') {
    return
  }

  const payload: StoredCampaignDraft = {
    savedAt: new Date().toISOString(),
    form
  }

  window.localStorage.setItem(campaignDraftStorageKey, JSON.stringify(payload))
}

export function buildInitialForm({
  initialPrompt,
  initialCampaignId,
  initialDraftId
}: CampaignBuilderProps): CampaignFormState {
  let nextForm = createInitialState()

  if (initialCampaignId) {
    nextForm = applyManagedCampaignPreset(nextForm, initialCampaignId)
  }

  if (initialDraftId === 'local') {
    const storedDraft = readStoredDraft()

    if (storedDraft) {
      nextForm = storedDraft
    }
  }

  if (initialPrompt) {
    nextForm = applyPromptPreset(nextForm, initialPrompt)
  }

  return nextForm
}

export function buildInitialNotice({
  initialPrompt,
  initialCampaignId,
  initialDraftId
}: CampaignBuilderProps): string | null {
  if (initialPrompt) {
    return 'Launch Assistant updated the campaign form'
  }

  if (initialDraftId === 'local' && readStoredDraft()) {
    return 'Saved draft loaded'
  }

  if (initialCampaignId) {
    const campaign = getManagedCampaignById(initialCampaignId)
    return campaign ? `${campaign.name} preset loaded` : null
  }

  return null
}
