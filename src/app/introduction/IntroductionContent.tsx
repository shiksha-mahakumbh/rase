"use client";

import PublicPageShell from "@/components/layouts/PublicPageShell";
import Introduction from "@/app/component/Introduction";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

const PAGE_HERO = {
  eyebrow: "शिक्षा महाकुंभ अभियान",
  title: "Introduction",
  subtitle:
    "A People's Movement for Global Educational Transformation — uniting education, policy, industry, civil society, and youth.",
  accent: "navy" as const,
};

export default function IntroductionContent() {
  return (
    <PublicPageShell
      hero={PAGE_HERO}
      relatedPath="/introduction"
      containerClassName="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-12"
    >
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Abhiyan", path: "/abhiyan" },
          { name: "Introduction", path: "/introduction" },
        ]}
      />
      <Introduction />
    </PublicPageShell>
  );
}
