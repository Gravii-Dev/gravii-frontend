function unsupportedTempoFeature(): never {
  throw new Error("Tempo wallet features are not enabled in Gravii Launch App.");
}

function unsupportedFactory(): never {
  return unsupportedTempoFeature();
}

const unsupportedActionGroup = new Proxy(
  {},
  {
    get() {
      return unsupportedFactory;
    },
  }
) as Record<string, () => never>;

export const Abis = { abis: [] };
export const Actions = {
  accessKey: unsupportedActionGroup,
  amm: unsupportedActionGroup,
  dex: unsupportedActionGroup,
  faucet: unsupportedActionGroup,
  fee: unsupportedActionGroup,
  nonce: unsupportedActionGroup,
  policy: unsupportedActionGroup,
  reward: unsupportedActionGroup,
  token: unsupportedActionGroup,
  validator: unsupportedActionGroup,
  wallet: unsupportedActionGroup,
  zone: unsupportedActionGroup,
};
export const Addresses = {};
export const Capabilities = {};
export const Bytes = {
  concat: unsupportedFactory,
  fromHex: unsupportedFactory,
  toHex: unsupportedFactory,
};
export const PublicKey = {
  fromBytes: unsupportedFactory,
  toBytes: unsupportedFactory,
};
export const Secp256k1 = {
  createKeyPair: unsupportedFactory,
  getSharedSecret: unsupportedFactory,
};
export const TokenId = {
  fromAddress: unsupportedFactory,
};
export const Transaction = {
  decode: unsupportedFactory,
  encode: unsupportedFactory,
};
export const VirtualAddress = {
  from: unsupportedFactory,
};
export const Account = {
  fromHeadlessWebAuthn: unsupportedFactory,
  fromP256: unsupportedFactory,
  fromSecp256k1: unsupportedFactory,
  fromWebAuthnP256: unsupportedFactory,
  fromWebCryptoP256: unsupportedFactory,
};
