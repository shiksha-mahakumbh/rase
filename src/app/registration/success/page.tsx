import NavBar from "@/app/component/NavBar";
import Footer from "@/app/component/Footer";
import RegistrationTrustBar from "@/components/registration/RegistrationTrustBar";
import SuccessExperience from "@/components/registration/SuccessExperience";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Registration Confirmed",
  description:
    "Your Shiksha Mahakumbh 6.0 registration is confirmed. Download your receipt, add the event to your calendar, and view next steps.",
  path: "/registration/success",
  noIndex: true,
});

export default function RegistrationSuccessPage() {
  return (
    <div className="min-h-screen bg-brand-surface">
      <RegistrationTrustBar />
      <NavBar />
      <main id="main-content">
        <SuccessExperience />
      </main>
      <Footer />
    </div>
  );
}
