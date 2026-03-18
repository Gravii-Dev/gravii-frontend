import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Gravii HQ",
  description: "Productized internal intelligence dashboard for Gravii HQ."
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Sora:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800&family=Inter:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Space+Mono:wght@400;700&family=DM+Sans:ital,wght@0,400;0,500;1,300;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
