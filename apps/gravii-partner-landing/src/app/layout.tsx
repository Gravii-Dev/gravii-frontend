import type { Metadata, Viewport } from "next";
import {
  Archivo_Black,
  Inter,
  Outfit,
  Sora,
  Space_Mono,
} from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-archivo-black",
});

const inter = Inter({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-inter",
  weight: ["300", "400", "500"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["400", "500", "600", "700", "800"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Gravii — Building the identity standard for Web3",
  description:
    "Gravii turns wallet addresses into deterministic user intelligence for growth, verification, and ecosystem health.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Gravii | Building the identity standard for Web3",
    description:
      "Deterministic on-chain intelligence for growth, verification, and ecosystem health.",
    siteName: "Gravii",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gravii | Building the identity standard for Web3",
    description:
      "Deterministic on-chain intelligence for growth, verification, and ecosystem health.",
  },
};

export const viewport: Viewport = {
  themeColor: "#05070d",
  colorScheme: "dark",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html
      className={[
        archivoBlack.variable,
        inter.variable,
        outfit.variable,
        sora.variable,
        spaceMono.variable,
      ].join(" ")}
      lang="en"
    >
      <body>{children}</body>
    </html>
  );
}
