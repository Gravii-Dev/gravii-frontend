"use client";

import { createAppKit } from "@reown/appkit/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { WagmiProvider, type Config } from "wagmi";

import {
  appKitNetworks,
  wagmiAdapter,
  wagmiConfig,
  walletConnectProjectId,
} from "@/lib/wallet/appkit-config";

const queryClient = new QueryClient();
let appKitInitialized = false;

function initializeAppKit() {
  if (appKitInitialized) {
    return;
  }

  createAppKit({
    adapters: [wagmiAdapter],
    defaultNetwork: mainnetNetwork(),
    features: {
      analytics: true,
    },
    metadata: {
      description: "Gravii Launch App for on-chain identity and wallet X-Ray.",
      icons: ["https://app.gravii.io/icon.png"],
      name: "Gravii",
      url: process.env.NEXT_PUBLIC_APP_URL ?? "https://app.gravii.io",
    },
    networks: appKitNetworks,
    projectId: walletConnectProjectId,
  });

  appKitInitialized = true;
}

function mainnetNetwork() {
  return appKitNetworks[0];
}

export function WalletAppKitProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  initializeAppKit();

  return (
    <WagmiProvider config={wagmiConfig as Config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
