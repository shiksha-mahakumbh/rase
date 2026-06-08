import PublicPageShell from "@/components/layouts/PublicPageShell";
import Donation from "../component/donate";

const PAGE_HERO = {
  eyebrow: "Support",
  title: "Donation",
  subtitle: "Support the Shiksha Mahakumbh national education movement.",
  accent: "emerald" as const,
};

export default function DonationPage() {
  return (
    <PublicPageShell hero={PAGE_HERO}>
      <Donation />
    </PublicPageShell>
  );
}
