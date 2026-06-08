import PublicPageShell from "@/components/layouts/PublicPageShell";
import AccomodationForm from "@/app/component/Registration/AccomodationReg";
import { PAGE_HEROES } from "@/lib/page-heroes";

export default function AccommodationPage() {
  return (
    <PublicPageShell
      hero={PAGE_HEROES.accommodation}
      containerClassName="mx-auto max-w-4xl px-4 py-12 md:px-8 md:py-16"
    >
      <AccomodationForm />
    </PublicPageShell>
  );
}
