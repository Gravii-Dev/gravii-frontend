function unsupportedTempoFeature(): never {
  throw new Error('Tempo wallet features are not enabled in Gravii Launch App.')
}

export const Actions = {}

export function dangerous_secp256k1(): never {
  return unsupportedTempoFeature()
}

export function tempoWallet(): never {
  return unsupportedTempoFeature()
}

export function webAuthn(): never {
  return unsupportedTempoFeature()
}
