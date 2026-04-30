import "@gravii/brand-tokens/css";
import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { Suspense } from "react";

import { UserAuthProvider } from "@/features/auth/auth-provider";

const geistSans = localFont({
  display: "swap",
  src: [
    {
      path: "./fonts/geist-latin.woff2",
      style: "normal",
      weight: "100 900",
    },
  ],
  variable: "--font-sans",
});

const cloth = localFont({
  display: "swap",
  src: [
    {
      path: "./fonts/cloth.woff2",
      style: "normal",
      weight: "400",
    },
    {
      path: "./fonts/cloth.woff",
      style: "normal",
      weight: "400",
    },
  ],
  variable: "--font-brand",
});

export const metadata: Metadata = {
  title: "Gravii Launch App",
  description: "Gravii Launch App for on-chain identity and wallet X-Ray.",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${cloth.variable}`}>
        <Suspense fallback={null}>
          <UserAuthProvider>{children}</UserAuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
