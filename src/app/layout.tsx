import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import ClientChrome from "./ClientChrome";
import SiteJsonLd from "@/components/seo/SiteJsonLd";
import { createPageMetadata } from "@/lib/seo/metadata";

const inter = Inter({
  subsets: ["latin"],
  display: "optional",
  variable: "--font-inter",
  adjustFontFallback: true,
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  display: "optional",
  variable: "--font-devanagari",
  weight: ["700", "800"],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Shiksha Mahakumbh Abhiyan — National Education Summit",
    description:
      "Department of Holistic Education (DHE) initiative — Shiksha Mahakumbh national education movement aligned with NEP 2020 and Bharat@2047.",
    path: "/",
    keywords: [
      "Shiksha Mahakumbh",
      "शिक्षा महाकुंभ",
      "NEP 2020",
      "education conference India",
    ],
  }),
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.shikshamahakumbh.com"
  ),
  icons: {
    icon: "/sLogo.png",
    apple: "/sLogo.png",
  },
  other: {
    "google-adsense-account": "ca-pub-4330032354977759",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${notoDevanagari.variable}`}>
      <body className={`${inter.className} overflow-x-hidden antialiased`}>
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
