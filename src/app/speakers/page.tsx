import type { Metadata } from "next";
import Link from "next/link";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import SpeakersHub from "@/components/speakers/SpeakersHub";
import { loadCmsSpeakers } from "@/lib/cms/organizational";
import { createPageMetadata } from "@/lib/seo/metadata";
import { brandPageHero } from "@/lib/page-heroes";

const FALLBACK = {
  title: "Speakers & Dignitaries",
  description:
    "National leaders, scholars, and reformers who have shaped the Shiksha Mahakumbh movement.",
  path: "/speakers",
};

export const metadata: Metadata = createPageMetadata(FALLBACK);

export default async function SpeakersPage() {
  const speakers = await loadCmsSpeakers();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Speakers", path: "/speakers" },
        ]}
      />
      <PublicPageShell
        hero={brandPageHero(
          <>
            <span className="text-brand-blue">Speakers &amp; Dignitaries</span>
            <span className="mt-1 block text-2xl text-brand-saffron md:text-3xl">
              वक्ता एवं गरिमामयी विभाग
            </span>
          </>,
          "National leaders, scholars, and reformers who have shaped the Shiksha Mahakumbh movement.",
          "Leadership"
        )}
        relatedPath="/speakers"
        showCta={false}
        containerClassName="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12"
      >
        <SpeakersHub speakers={speakers} />
        <p className="mt-10 text-center">
          <Link
            href="/speakers/directory"
            className="inline-flex items-center rounded-xl bg-brand-saffron px-6 py-3 text-sm font-bold text-brand-navy shadow-md transition hover:bg-brand-saffron-dark hover:text-white"
          >
            शिक्षा महाकुंभ 1.0–5.0 — पूर्ण वक्ता सूची →
          </Link>
        </p>
      </PublicPageShell>
    </>
  );
}
