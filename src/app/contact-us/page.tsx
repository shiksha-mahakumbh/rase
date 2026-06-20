import PublicPageShell from "@/components/layouts/PublicPageShell";
import ContactUs from "@/components/content/ContactUs";
import { brandPageHero } from "@/lib/page-heroes";

export default function ContactUsPage() {
  return (
    <PublicPageShell
      hero={brandPageHero(
        "Contact Us",
        "Reach the organising team for registration support, partnerships, media enquiries, and programme information.",
        "Get in Touch"
      )}
      showCta={false}
      skipContainer
    >
      <ContactUs />
    </PublicPageShell>
  );
}
