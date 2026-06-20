import PublicPageShell from "@/components/layouts/PublicPageShell";
import PastEditionsShowcase from "@/components/past-editions/PastEditionsShowcase";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";

export default function PastEventsPage() {
  return (
    <PublicPageShell
      hero={{
        eyebrow: "शिक्षा महाकुंभ अभियान",
        title: (
          <>
            <span className="text-brand-blue">Past Editions</span>
            <span className="mt-1 block text-2xl text-brand-saffron md:text-3xl">
              1.0 से 5.0 — राष्ट्रीय यात्रा
            </span>
          </>
        ),
        subtitle:
          "Five completed national editions — from NIT Jalandhar (1.0) to NIPER Mohali (5.0) — advancing school education, academic entrepreneurship, and global Indian education dialogue.",
        accent: "brand",
        imageSrc: "/branding/shiksha-mahakumbh-brand-hero.png",
      }}
      relatedPath={CANONICAL_ROUTES.pastEvents}
      skipContainer
      showCta
    >
      <div className="mx-auto max-w-6xl px-4 pt-2 md:px-6">
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            { label: "Introduction", href: "/introduction" },
            { label: "Past Events" },
          ]}
          className="mb-2"
        />
      </div>
      <PastEditionsShowcase />
    </PublicPageShell>
  );
}
