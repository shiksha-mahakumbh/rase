import NavBarShell from "@/components/layout/navbar/NavBarShell";
import { NAV_MENUS } from "@/constants/navigation";
import { ServerFooterWithCms } from "@/components/layout/ServerFooterWithCms";
import SuccessExperience from "@/components/registration/SuccessExperience";
import { createPageMetadata } from "@/lib/seo/metadata";
import ShowcaseHero from "@/components/showcase/ShowcaseHero";

export const metadata = createPageMetadata({
  title: "Registration Confirmed",
  description:
    "Your Shiksha Mahakumbh 6.0 registration is confirmed. Download your receipt, add the event to your calendar, and view next steps.",
  path: "/registration/success",
  noIndex: true,
});

export default function RegistrationSuccessPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavBarShell menus={NAV_MENUS} />
      <ShowcaseHero
        eyebrow="Shiksha Mahakumbh 6.0"
        title="Registration Confirmed"
        subtitle="Thank you for joining India's national education movement. Download your receipt and review next steps below."
        accent="brand"
        imageSrc="/branding/shiksha-mahakumbh-brand-hero.png"
      />
      <main id="main-content">
        <SuccessExperience />
      </main>
      <ServerFooterWithCms />
    </div>
  );
}
