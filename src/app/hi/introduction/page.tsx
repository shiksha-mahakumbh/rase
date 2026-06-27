import HiIntroductionContent from "./HiIntroductionContent";
import { createPageMetadata } from "@/lib/seo/metadata";
import { withHreflang } from "@/lib/seo/hreflang";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations({ locale: "hi", namespace: "meta" });

  return withHreflang(
    createPageMetadata({
      title: t("aboutTitle"),
      description: t("aboutDescription"),
      path: "/hi/introduction",
      locale: "hi_IN",
    }),
    "/introduction"
  );
}

export default function HiIntroductionPage() {
  return <HiIntroductionContent />;
}
