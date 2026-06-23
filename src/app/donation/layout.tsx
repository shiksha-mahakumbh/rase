import type { Metadata } from "next";
import { loadDefaultOgImage, loadRouteSeo } from "@/lib/cms/server";
import DonationJsonLd from "@/components/donation/DonationJsonLd";
import {
  DONATION_KEYWORDS,
  DONATION_OG_IMAGE,
  DONATION_PAGE_HERO,
  DONATION_PATH,
  donationMetaDescription,
} from "@/data/donation-hub";
import { createPageMetadata } from "@/lib/seo/metadata";
import { metadataFromCmsSeo } from "@/lib/seo/cms-metadata";

export const revalidate = 300;

const FALLBACK_META = {
  title: "Donate & Sponsor — 80G Tax Benefit | Shiksha Mahakumbh",
  description: donationMetaDescription(),
  path: DONATION_PATH,
  keywords: [...DONATION_KEYWORDS],
  locale: "en_IN" as const,
  ogImageUrl: DONATION_OG_IMAGE,
};

export async function generateMetadata(): Promise<Metadata> {
  const [seo, ogImage] = await Promise.all([loadRouteSeo("donation"), loadDefaultOgImage()]);

  if (seo) {
    return metadataFromCmsSeo(seo, {
      ...FALLBACK_META,
      ogImageUrl: ogImage ?? DONATION_OG_IMAGE,
    });
  }

  return createPageMetadata({
    ...FALLBACK_META,
    ogImageUrl: ogImage ?? DONATION_OG_IMAGE,
  });
}

export default function DonationLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DonationJsonLd />
      {children}
    </>
  );
}
