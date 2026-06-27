import PublicPageShell from "@/components/layouts/PublicPageShell";
import CmtSubmitInterstitial from "@/components/research/CmtSubmitInterstitial";
import { createPageMetadata } from "@/lib/seo/metadata";
import { brandPageHero } from "@/lib/page-heroes";

export const metadata = createPageMetadata({
  title: "Paper Submission — Microsoft CMT",
  description:
    "Submit research papers and abstracts for Shiksha Mahakumbh 6.0 Multi Track Conference via the official Microsoft CMT portal.",
  path: "/research/submit",
  keywords: [
    "Shiksha Mahakumbh paper submission",
    "SMK 6.0 CMT",
    "Multi Track Conference",
  ],
});

export default function ResearchSubmitPage() {
  return (
    <PublicPageShell
      hero={brandPageHero(
        "Paper Submission",
        "Official Microsoft CMT portal for Shiksha Mahakumbh 6.0 research tracks.",
        "Research"
      )}
      skipContainer
    >
      <CmtSubmitInterstitial />
    </PublicPageShell>
  );
}
