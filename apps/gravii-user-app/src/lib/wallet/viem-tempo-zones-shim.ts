function unsupportedTempoZoneFeature(): never {
  throw new Error("Tempo zone features are not enabled in Gravii Launch App.");
}

export const Abis = {};

export function http(): never {
  return unsupportedTempoZoneFeature();
}

export function zone(): never {
  return unsupportedTempoZoneFeature();
}
