"use client";

import PublicPageShell from "@/components/layouts/PublicPageShell";
import Introduction from "@/components/content/Introduction";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

const PAGE_HERO = {
  eyebrow: "शिक्षा महाकुंभ अभियान",
  title: (
    <>
      <span className="text-brand-blue">Introduction</span>
      <span className="mt-1 block text-2xl text-brand-saffron md:text-3xl">
        वैश्विक विमर्श निर्माण को समर्पित
      </span>
    </>
  ),
  subtitle:
    "A People's Movement for Global Educational Transformation — uniting education, policy, industry, civil society, and youth on one vibrant platform.",
  accent: "brand" as const,
  imageSrc: "/branding/shiksha-mahakumbh-brand-hero.png",
};

export default function IntroductionContent() {
  return (
    <PublicPageShell
      hero={PAGE_HERO}
      relatedPath="/introduction"
      containerClassName="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12"
    >
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Past Events", path: "/past-events" },
          { name: "Introduction", path: "/introduction" },
        ]}
      />
      <Introduction />
    </PublicPageShell>
  );
}
