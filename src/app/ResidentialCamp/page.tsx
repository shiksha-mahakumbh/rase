import PublicPageShell from "@/components/layouts/PublicPageShell";
import ResidentialCamp from "../component/Residential_Camp";

const PAGE_HERO = {
  eyebrow: "Programmes",
  title: "Residential Camp",
  subtitle: "Residential training programmes at Shiksha Mahakumbh.",
  accent: "emerald",
} as const;

export default function ResidentialCampPage() {
  return (
    <PublicPageShell hero={PAGE_HERO}>
      <ResidentialCamp />
    </PublicPageShell>
  );
}
