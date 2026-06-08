import PublicPageShell from "@/components/layouts/PublicPageShell";
import SchoolProjectForm from "../component/Registration/SchoolProjectForm";
import Marquees from "../component/Marquees";

const PAGE_HERO = {
  eyebrow: "Registration",
  title: "School Project Display",
  subtitle: "Submit school project displays for Shiksha Mahakumbh exhibition.",
  accent: "emerald",
} as const;

export default function SchoolProjectDisplayPage() {
  return (
    <PublicPageShell hero={PAGE_HERO} skipContainer showCta={false}>
      <Marquees />
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-8">
        <SchoolProjectForm />
      </div>
    </PublicPageShell>
  );
}
