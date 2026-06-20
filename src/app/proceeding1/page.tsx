"use client";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import Proceeding1 from "@/components/proceedings/Proceeding1";
import { proceeding1Data } from "@/content/proceedings/proceeding1-data";
import { brandPageHero } from "@/lib/page-heroes";

export default function Proceeding1Page() {
  return (
    <PublicPageShell
      hero={brandPageHero(
        "Proceedings Volume I",
        "Research outcomes from Shiksha Mahakumbh editions.",
        "Publications"
      )}
      relatedPath="/proceedings"
    >
      <Proceeding1 data={proceeding1Data} />
    </PublicPageShell>
  );
}
