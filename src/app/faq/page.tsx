import PublicPageShell from "@/components/layouts/PublicPageShell";
import HomeFaqSection from "@/components/home/HomeFaqSection";
import { createPageMetadata } from "@/lib/seo/metadata";
import { withHreflang } from "@/lib/seo/hreflang";
import { loadCmsPageData } from "@/lib/cms/server";
import { CmsProvider } from "@/lib/cms/context";

export async function generateMetadata() {
  return withHreflang(
    createPageMetadata({
      title: "Frequently Asked Questions",
      description:
        "Answers to common questions about Shiksha Mahakumbh 6.0 — dates, venue, registration, accommodation, and programme tracks.",
      path: "/faq",
      keywords: [
        "Shiksha Mahakumbh FAQ",
        "SMK 6.0 registration help",
        "NIT Hamirpur conference questions",
      ],
    }),
    "/faq"
  );
}

export default async function FaqPage() {
  const cmsData = await loadCmsPageData("en");

  return (
    <CmsProvider data={cmsData}>
      <PublicPageShell
        hero={{
          eyebrow: "Help",
          title: "Frequently Asked Questions",
          subtitle:
            "Registration, venue, accommodation, and programme information for Shiksha Mahakumbh 6.0.",
          accent: "brand",
        }}
        showCta={false}
        skipContainer
        mainClassName=""
      >
        <HomeFaqSection />
      </PublicPageShell>
    </CmsProvider>
  );
}
