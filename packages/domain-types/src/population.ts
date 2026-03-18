export type PopulationStatus = 'idle' | 'uploading' | 'processing' | 'ready' | 'failed'

export interface PopulationSummary {
  id: string
  name: string
  walletCount: number
  status: PopulationStatus
  createdAt?: string
  updatedAt?: string
}
