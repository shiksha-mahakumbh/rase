import type { Metadata } from "next";
import Link from "next/link";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import MahakumbhAbhiyanSpeakersDirectory from "@/components/speakers/MahakumbhAbhiyanSpeakersDirectory";
import { createPageMetadata } from "@/lib/seo/metadata";
import { brandPageHero } from "@/lib/page-heroes";
import { SITE_NAME_HINDI } from "@/config/site";

export const metadata: Metadata = createPageMetadata({
  title: "शिक्षा महाकुंभ अभियान — वक्ता सूची (1.0–5.0)",
  description:
    "संपूर्ण वक्ता सूची — शिक्षा महाकुंभ 1.0, 2.0, 3.0, 4.0 एवं 5.0 के गरिमामयी वक्ता, नेतृत्वकर्ता एवं विशेषज्ञ।",
  path: "/speakers/directory",
});

export default function SpeakersDirectoryPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Speakers", path: "/speakers" },
          { name: "वक्ता सूची", path: "/speakers/directory" },
        ]}
      />
      <PublicPageShell
        hero={brandPageHero(
          <>
            <span className="text-brand-blue">वक्ता सूची</span>
            <span className="mt-1 block text-2xl text-brand-saffron md:text-3xl">
              संस्करण 1.0 से 5.0
            </span>
          </>,
          "शिक्षा महाकुंभ अभियान — संस्करण 1.0 से 5.0 के सभी वक्ता एक सूची में",
          SITE_NAME_HINDI
        )}
        relatedPath="/speakers/directory"
        showCta={false}
        containerClassName="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10"
      >
        <MahakumbhAbhiyanSpeakersDirectory />
        <p className="mt-8 text-center text-sm text-slate-500 print:hidden">
          <Link href="/speakers" className="font-semibold text-brand-blue hover:text-brand-saffron">
            ← Featured speakers
          </Link>
          {" · "}
          <Link href="/past-events" className="font-semibold text-brand-blue hover:text-brand-saffron">
            Past editions
          </Link>
        </p>
      </PublicPageShell>
    </>
  );
}
