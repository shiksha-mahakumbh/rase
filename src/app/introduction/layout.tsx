import { createPageMetadata } from "@/lib/seo/metadata";
import IntroductionJsonLd from "@/components/seo/IntroductionJsonLd";

export const metadata = createPageMetadata({
  title: "Introduction — Shiksha Mahakumbh Abhiyan",
  description:
    "Learn about the Shiksha Mahakumbh national education movement, its vision aligned with NEP 2020 and Bharat@2047, and multi-edition impact.",
  path: "/introduction",
  keywords: [
    "Shiksha Mahakumbh",
    "NEP 2020",
    "national education movement",
    "Bharat 2047 education",
  ],
});

export default function IntroductionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <IntroductionJsonLd />
      {children}
    </>
  );
}
