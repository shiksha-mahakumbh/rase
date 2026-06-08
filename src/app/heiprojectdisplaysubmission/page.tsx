import PublicPageShell from "@/components/layouts/PublicPageShell";
import HeiProjectForm from "../component/Registration/HeiProjectForm";
import Marquees from "../component/Marquees";

const PAGE_HERO = {
  eyebrow: "Registration",
  title: "HEI Project Display",
  subtitle: "Submit higher-education institution project displays.",
  accent: "emerald",
} as const;

export default function HeiProjectDisplayPage() {
  return (
    <PublicPageShell hero={PAGE_HERO} skipContainer showCta={false}>
      <Marquees />
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-8">
        <HeiProjectForm />
      </div>
    </PublicPageShell>
  );
}
