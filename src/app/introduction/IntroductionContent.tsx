"use client";

import PublicPageShell from "@/components/layouts/PublicPageShell";
import Introduction from "@/app/component/Introduction";
import { AuthoritySections } from "@/components/authority";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

const PAGE_HERO = {
  eyebrow: "About the Movement",
  title: "Introduction to Shiksha Mahakumbh Abhiyan",
  subtitle:
    "India's national education movement aligning with NEP 2020 and Bharat@2047 — uniting institutions, educators, researchers, and youth.",
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
          { name: "About", path: "/introduction" },
        ]}
      />
      <Introduction />
      <AuthoritySections
        sections={[
          "impact",
          "editions",
          "speakers",
          "research",
          "institutions",
          "partners",
          "government",
          "stories",
        ]}
        impactVariant="compact"
      />
    </PublicPageShell>
  );
}
