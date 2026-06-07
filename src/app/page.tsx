import HomePage from "@/components/home/HomePage";
import HomeJsonLd from "@/components/home/HomeJsonLd";
import HomeEcosystemJsonLd from "@/components/home/HomeEcosystemJsonLd";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Shiksha Mahakumbh 6.0 — National Education Summit",
  description:
    "Join Shiksha Mahakumbh 6.0 at NIT Hamirpur, 9–11 October 2026. India's premier multidisciplinary education summit — research, conclaves, olympiads, innovation, and NEP 2020 alignment.",
  path: "/",
  keywords: [
    "Shiksha Mahakumbh 2026",
    "शिक्षा महाकुंभ",
    "NIT Hamirpur conference",
    "NEP 2020 education summit",
    "education conference India",
    "Bharat 2047",
    "Indian Knowledge Systems",
  ],
});

export default function Page() {
  return (
    <>
      <HomeJsonLd />
      <HomeEcosystemJsonLd />
      <HomePage />
    </>
  );
}
