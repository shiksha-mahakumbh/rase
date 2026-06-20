import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import RegistrationHub from "./RegistrationHub";
import { createEventMetadata } from "@/lib/seo/metadataBuilders";
import RegistrationJsonLd from "@/components/seo/RegistrationJsonLd";
import ShowcaseHero from "@/components/showcase/ShowcaseHero";

export const metadata = createEventMetadata({
  title: "Register — Shiksha Mahakumbh 6.0",
  description:
    "Official registration for Shiksha Mahakumbh 6.0 at NIT Hamirpur, 9–11 October 2026. Delegate, conclave, olympiad, awards, exhibitions, research tracks, and accommodation.",
  path: "/registration",
  startDate: "2026-10-09",
  endDate: "2026-10-11",
  location: "NIT Hamirpur, Himachal Pradesh, India",
  keywords: [
    "Shiksha Mahakumbh registration",
    "SMK 2026 register",
    "NIT Hamirpur conference registration",
    "education summit India registration",
  ],
});

export default function RegistrationPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <RegistrationJsonLd />
      <ShowcaseHero
        eyebrow="Shiksha Mahakumbh 6.0 · NIT Hamirpur"
        title={
          <>
            <span className="text-brand-blue">Register</span>
            <span className="mt-1 block text-2xl text-brand-saffron md:text-3xl">
              आधिकारिक पंजीकरण
            </span>
          </>
        }
        subtitle="Official registration for delegates, conclaves, olympiad, awards, exhibitions, research tracks, and accommodation — 9–11 October 2026."
        accent="brand"
        imageSrc="/branding/shiksha-mahakumbh-brand-hero.png"
      />
      <main id="main-content">
        <RegistrationHub />
      </main>
      <Footer />
    </div>
  );
}
