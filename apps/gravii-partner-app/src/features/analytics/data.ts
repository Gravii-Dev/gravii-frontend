export interface AnalyticsGroupData {
  users: number
  portfolio: string
  stbl: string
  native: string
  other: string
  ltVol: string
  vol30: string
  tradeSize: string
  swaps: number
  defiTvl: string
  rewards: string
  nftCount: string
  nftVal: string
  gasTotal: string
  gas30: string
  gasTx: string
  txIn: string
  txOut: string
  counterparts: number
  txWeek: string
  activeHr: string
  activeDay: string
  walletAge: string
  act7: number
  act30: number
  act90: number
  inact: number
  wFresh: number
  wKaia: number
  wEvm: number
  wMulti: number
  sWhale: number
  sHigh: number
  sMed: number
  sLow: number
  sInact: number
}

export const regionMultiplierMap: Record<string, number> = {
  US: 0.182,
  JP: 0.145,
  KR: 0.121,
  TW: 0.098,
  TH: 0.084,
  SG: 0.072,
  DE: 0.061,
  GB: 0.053,
  VN: 0.047,
  ID: 0.042,
  others: 0.095
}

export const analyticsGroupData: Record<'top5' | 'top20' | 'top50' | 'bottom50', AnalyticsGroupData> = {
  top5: { users: 15050, stbl: '$18,200', native: '$14,800', other: '$8,400', portfolio: '$142,300', ltVol: '$284,000', vol30: '$62,100', tradeSize: '$4,200', swaps: 42, defiTvl: '$68,200', rewards: '$4,120', nftCount: '12.4', nftVal: '$18,300', gasTotal: '$1,840', gas30: '$312', gasTx: '$4.80', txIn: '$86,400', txOut: '$71,200', counterparts: 47, txWeek: '24.6', activeHr: '14:00 UTC', activeDay: 'Tuesday', walletAge: '218 days', act7: 38, act30: 26, act90: 17, inact: 19, wFresh: 8, wKaia: 5, wEvm: 42, wMulti: 45, sWhale: 12, sHigh: 28, sMed: 35, sLow: 18, sInact: 7 },
  top20: { users: 45152, stbl: '$6,400', native: '$4,200', other: '$2,100', portfolio: '$38,200', ltVol: '$92,000', vol30: '$18,400', tradeSize: '$1,800', swaps: 28, defiTvl: '$22,400', rewards: '$1,840', nftCount: '5.8', nftVal: '$6,200', gasTotal: '$680', gas30: '$142', gasTx: '$3.20', txIn: '$34,200', txOut: '$28,800', counterparts: 31, txWeek: '14.2', activeHr: '15:00 UTC', activeDay: 'Wednesday', walletAge: '164 days', act7: 32, act30: 28, act90: 20, inact: 20, wFresh: 10, wKaia: 8, wEvm: 48, wMulti: 34, sWhale: 5, sHigh: 22, sMed: 42, sLow: 24, sInact: 7 },
  top50: { users: 90304, stbl: '$2,800', native: '$1,600', other: '$840', portfolio: '$8,430', ltVol: '$28,400', vol30: '$4,200', tradeSize: '$620', swaps: 14, defiTvl: '$4,800', rewards: '$420', nftCount: '2.1', nftVal: '$1,400', gasTotal: '$210', gas30: '$48', gasTx: '$2.40', txIn: '$8,200', txOut: '$6,800', counterparts: 18, txWeek: '6.8', activeHr: '16:00 UTC', activeDay: 'Thursday', walletAge: '112 days', act7: 24, act30: 26, act90: 24, inact: 26, wFresh: 14, wKaia: 12, wEvm: 52, wMulti: 22, sWhale: 1, sHigh: 8, sMed: 38, sLow: 40, sInact: 13 },
  bottom50: { users: 150506, stbl: '$480', native: '$320', other: '$180', portfolio: '$1,240', ltVol: '$3,200', vol30: '$480', tradeSize: '$120', swaps: 4, defiTvl: '$620', rewards: '$42', nftCount: '0.4', nftVal: '$180', gasTotal: '$38', gas30: '$8', gasTx: '$1.20', txIn: '$1,400', txOut: '$1,100', counterparts: 6, txWeek: '1.2', activeHr: '18:00 UTC', activeDay: 'Saturday', walletAge: '68 days', act7: 12, act30: 18, act90: 22, inact: 48, wFresh: 28, wKaia: 18, wEvm: 42, wMulti: 12, sWhale: 0, sHigh: 2, sMed: 14, sLow: 42, sInact: 42 }
}
