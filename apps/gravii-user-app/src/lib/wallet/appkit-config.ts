import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import {
  arbitrum,
  base,
  bsc,
  mainnet,
  type AppKitNetwork,
} from "@reown/appkit/networks";

const fallbackProjectId = "00000000000000000000000000000000";

export const walletConnectProjectId =
  process.env.NEXT_PUBLIC_REOWN_PROJECT_ID ??
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ??
  fallbackProjectId;

export const isWalletConnectConfigured =
  walletConnectProjectId !== fallbackProjectId;

export const appKitNetworks = [
  mainnet,
  base,
  arbitrum,
  bsc,
] as [AppKitNetwork, ...AppKitNetwork[]];

export const wagmiAdapter = new WagmiAdapter({
  networks: appKitNetworks,
  projectId: walletConnectProjectId,
  ssr: true,
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;
