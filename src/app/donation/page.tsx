import DonationQuickLinks from "@/components/donation/DonationQuickLinks";
import { DonationShowcase } from "@/lib/perf/deferred-showcases";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import { DONATION_BREADCRUMBS, DONATION_PATH } from "@/data/donation-hub";

export default function DonationPage() {
  return (
    <PublicPageShell
      showHero={false}
      showCta={false}
      breadcrumbs={[...DONATION_BREADCRUMBS]}
      relatedPath={DONATION_PATH}
      skipContainer
    >
      <DonationQuickLinks />
      <DonationShowcase />
    </PublicPageShell>
  );
}
