import PublicPageShell from "@/components/layouts/PublicPageShell";
import BatonCeremony from "../component/Baton";

const PAGE_HERO = {
  eyebrow: "Events",
  title: "Baton Ceremony",
  subtitle: "Ceremonial launch of Shiksha Mahakumbh editions.",
  accent: "saffron",
} as const;

export default function BatonCeremonyPage() {
  return (
    <PublicPageShell hero={PAGE_HERO}>
      <BatonCeremony />
    </PublicPageShell>
  );
}
