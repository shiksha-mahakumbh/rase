import NavBar from "@/app/component/NavBar";
import Footer from "@/app/component/Footer";
import RegistrationHub from "./RegistrationHub";
import RegistrationTrustBar from "@/components/registration/RegistrationTrustBar";
import { createEventMetadata } from "@/lib/seo/metadataBuilders";
import RegistrationJsonLd from "@/components/seo/RegistrationJsonLd";

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
    <div className="min-h-screen bg-brand-surface">
      <RegistrationTrustBar />
      <NavBar />
      <RegistrationJsonLd />
      <main id="main-content">
        <RegistrationHub />
      </main>
      <Footer />
    </div>
  );
}
