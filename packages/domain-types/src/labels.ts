export type GraviiTier = 'Black' | 'Platinum' | 'Gold' | 'Classic'

export interface PersonaLabel {
  id?: string
  label: string
  description?: string
}

export interface LabelDistributionRow {
  label: string
  value: number
  colorHex?: string
}
