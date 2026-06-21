import type { Metadata } from "next";
import { loadDefaultOgImage, loadRouteSeo } from "@/lib/cms/server";
import DonationShowcase from "@/components/donation/DonationShowcase";
import DonationJsonLd from "@/components/donation/DonationJsonLd";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import { DONATION_HERO, DONATION_KEYWORDS } from "@/data/donation-hub";
import { createPageMetadata } from "@/lib/seo/metadata";
import { metadataFromCmsSeo } from "@/lib/seo/cms-metadata";
import { brandPageHero } from "@/lib/page-heroes";

export const revalidate = 300;

const FALLBACK_META = {
  title: "Donate & Sponsor — 80G Tax Benefit | Shiksha Mahakumbh",
  description:
    "Support Shiksha Mahakumbh Abhiyan with secure Razorpay payments. Instant 80G donation receipt by email — download or print. PAN mandatory. Open to national and international supporters.",
  path: "/donation",
  keywords: [...DONATION_KEYWORDS],
  locale: "en_IN" as const,
};

export async function generateMetadata(): Promise<Metadata> {
  const [seo, ogImage] = await Promise.all([loadRouteSeo("donation"), loadDefaultOgImage()]);

  if (seo) {
    return metadataFromCmsSeo(seo, { ...FALLBACK_META, ogImageUrl: ogImage });
  }

  return createPageMetadata({ ...FALLBACK_META, ogImageUrl: ogImage ?? undefined });
}

const BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Donation & Sponsorship", path: "/donation" },
];

export default function DonationPage() {
  return (
    <PublicPageShell
      hero={brandPageHero(
        DONATION_HERO.title,
        DONATION_HERO.subtitle,
        DONATION_HERO.eyebrow
      )}
      showCta={false}
      breadcrumbs={BREADCRUMBS}
      containerClassName="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14"
    >
      <DonationJsonLd />
      <DonationShowcase />
    </PublicPageShell>
  );
}
