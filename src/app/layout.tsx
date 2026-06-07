import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientChrome from "./ClientChrome";
import { createPageMetadata } from "@/lib/seo/metadata";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
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
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.rase.co.in"
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
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} overflow-x-hidden antialiased`}>
        {children}
        <ClientChrome />
      </body>
    </html>
  );
}
