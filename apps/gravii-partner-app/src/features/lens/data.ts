export interface LensReportCard {
  label: string
  headline: string
  detail: string
}

export const lensSnapshot = {
  walletCount: 48291,
  fileName: 'partner_wallets.csv',
  reportCards: [
    {
      label: 'Tier distribution',
      headline: '38% Gold+',
      detail: 'Classic 42% · Gold 24% · Platinum 11% · Black 3%'
    },
    {
      label: 'Behavioral segment',
      headline: 'Diamond Hands',
      detail: '22% of wallets · Yield Explorer follows at 18%'
    },
    {
      label: 'Active chains',
      headline: 'Ethereum 64%',
      detail: 'Base 14% · Arbitrum 11% · Polygon 6% · Other 5%'
    },
    {
      label: 'Sybil ratio',
      headline: '12%',
      detail: '5,795 flagged wallets · below platform average'
    }
  ] satisfies LensReportCard[],
  activationNotes: [
    'Push high-LTV wallets into Reach with pre-filled targeting criteria.',
    'Route suspicious clusters into stricter moderation before launch.',
    'Use Connect to enrich new wallets automatically after first touch.'
  ]
}
