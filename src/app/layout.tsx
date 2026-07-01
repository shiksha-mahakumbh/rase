import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import ClientChrome from "./ClientChrome";
import DocumentLangSync from "@/components/common/DocumentLangSync";
import SiteJsonLd from "@/components/seo/SiteJsonLd";

const inter = Inter({
  subsets: ["latin"],
  display: "optional",
  preload: true,
  variable: "--font-inter",
  adjustFontFallback: true,
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  display: "optional",
  preload: false,
  variable: "--font-devanagari",
  weight: ["800"],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.rase.co.in"
  ),
  title: {
    template: "%s | Shiksha Mahakumbh",
    default: "Shiksha Mahakumbh 6.0 — National Education Summit",
  },
  description:
    "Shiksha Mahakumbh 6.0 at NIT Hamirpur — India's premier multidisciplinary education summit aligned with NEP 2020.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/sLogo.png",
    apple: "/sLogo.png",
  },
  appleWebApp: {
    capable: true,
    title: "Shiksha Mahakumbh",
  },
  other: {
    "google-adsense-account": "ca-pub-4330032354977759",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1e3a5f",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${notoDevanagari.variable}`}>
      <body className={`${inter.className} overflow-x-hidden antialiased`}>
        <DocumentLangSync />
        <SiteJsonLd />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-lg focus:bg-brand-navy focus:px-4 focus:py-2 focus:text-white focus:outline-none focus:ring-2 focus:ring-brand-saffron"
        >
          Skip to main content
        </a>
        {children}
        <ClientChrome />
      </body>
    </html>
  );
}
