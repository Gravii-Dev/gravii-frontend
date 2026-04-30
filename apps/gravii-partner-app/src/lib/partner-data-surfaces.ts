export type PartnerDataSurface =
  | 'dashboard'
  | 'analytics'
  | 'labels'
  | 'risk'
  | 'reach'
  | 'campaignManager'
  | 'lens'

export interface PartnerDataSurfaceState {
  description: string
  label: string
  mode: 'live' | 'preview'
}

const sharedPreviewDetail =
  'Live partner auth and profile are connected. This route is still using the current Gravii preview dataset until the matching Partner API read endpoints are published.'

const reachPreviewDetail =
  'Partner auth and workspace state are live. Campaign drafts, targeting estimates, and report outputs are still using the current Gravii preview dataset until Reach read/write endpoints are published.'

const lensLiveDetail =
  'Partner auth, Lens pool CRUD, batch progress, summary metrics, wallet filters, and per-wallet drill-down are now live. Broader dashboard-grade analytics remain preview-backed until their Partner API read endpoints are published.'

const surfaceStateMap: Record<PartnerDataSurface, PartnerDataSurfaceState> = {
  analytics: {
    description: sharedPreviewDetail,
    label: 'Preview analytics data',
    mode: 'preview'
  },
  campaignManager: {
    description: reachPreviewDetail,
    label: 'Preview campaign data',
    mode: 'preview'
  },
  dashboard: {
    description: sharedPreviewDetail,
    label: 'Preview dashboard data',
    mode: 'preview'
  },
  labels: {
    description: sharedPreviewDetail,
    label: 'Preview segment data',
    mode: 'preview'
  },
  lens: {
    description: lensLiveDetail,
    label: 'Live Lens data',
    mode: 'live'
  },
  reach: {
    description: reachPreviewDetail,
    label: 'Preview campaign builder data',
    mode: 'preview'
  },
  risk: {
    description: sharedPreviewDetail,
    label: 'Preview risk data',
    mode: 'preview'
  }
}

export function getPartnerDataSurfaceState(
  surface: PartnerDataSurface
): PartnerDataSurfaceState {
  return surfaceStateMap[surface]
}
