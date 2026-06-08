import PublicPageShell from "@/components/layouts/PublicPageShell";
import ContactUs from "@/app/component/ContactUs";

const PAGE_HERO = {
  eyebrow: "Get in Touch",
  title: "Contact Us",
  subtitle:
    "Reach the organising team for registration support, partnerships, media enquiries, and programme information.",
  accent: "emerald" as const,
};

export default function ContactUsPage() {
  return (
    <PublicPageShell
      hero={PAGE_HERO}
      showHero={false}
      showCta={false}
      skipContainer
    >
      <ContactUs />
    </PublicPageShell>
  );
}
