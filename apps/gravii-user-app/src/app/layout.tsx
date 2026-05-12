import "@gravii/brand-tokens/css";
import "./globals.css";
import type { Metadata } from "next";
import { Roboto_Flex } from "next/font/google";
import type { ReactNode } from "react";
import { Suspense } from "react";

import { UserAuthProvider } from "@/features/auth/auth-provider";

const robotoFlex = Roboto_Flex({
  axes: ["opsz", "wdth", "GRAD"],
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
  preload: true,
  subsets: ["latin"],
  variable: "--font-roboto-flex",
  weight: "variable",
});

export const metadata: Metadata = {
  title: "Gravii Launch App",
  description: "Gravii Launch App for on-chain identity and wallet X-Ray.",
};

const solidMaterialRuntimeCss = `
[data-liquid-glass] {
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
}

[data-liquid-glass="panel"] {
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
}

[data-liquid-glass="soft"],
[data-liquid-glass="button"] {
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
}

body * {
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
}

[data-liquid-glass]::before,
[data-liquid-glass]::after {
  display: none !important;
  background: none !important;
  box-shadow: none !important;
  filter: none !important;
}

body *::before,
body *::after {
  filter: none !important;
}
`;

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={robotoFlex.variable}>
        <style dangerouslySetInnerHTML={{ __html: solidMaterialRuntimeCss }} />
        <Suspense fallback={null}>
          <UserAuthProvider>{children}</UserAuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
