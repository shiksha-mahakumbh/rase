import PublicPageShell from "@/components/layouts/PublicPageShell";
import Donation from "@/components/content/donate";
import { brandPageHero } from "@/lib/page-heroes";

export default function DonationPage() {
  return (
    <PublicPageShell
      hero={brandPageHero(
        "Donation",
        "Support the Shiksha Mahakumbh national education movement.",
        "Support"
      )}
    >
      <Donation />
    </PublicPageShell>
  );
}
