import type { ReactNode } from "react";

import { WalletAppKitProvider } from "@/features/auth/wallet-appkit-provider";

type SignInLayoutProps = {
  children: ReactNode;
};

export default function SignInLayout({ children }: SignInLayoutProps) {
  return <WalletAppKitProvider>{children}</WalletAppKitProvider>;
}
