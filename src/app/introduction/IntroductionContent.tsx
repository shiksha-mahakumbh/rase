"use client";

import NavBar from "@/app/component/NavBar";
import Footer from "@/app/component/Footer";
import Introduction from "@/app/component/Introduction";
import { AuthoritySections } from "@/components/authority";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

export default function IntroductionContent() {
  return (
    <div className="min-h-screen bg-brand-surface">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "About", path: "/introduction" },
        ]}
      />
      <NavBar />
      <main id="main-content" className="mx-auto max-w-5xl px-4 py-8 md:py-12">
        <Introduction />
      </main>

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

      <Footer />
    </div>
  );
}
