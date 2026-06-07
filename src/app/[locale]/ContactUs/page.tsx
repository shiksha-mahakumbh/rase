import NavBar from "@/app/component/NavBar";
import Footer from "@/app/component/Footer";
import ContactUs from "@/app/component/ContactUs";
import { createPageMetadata } from "@/lib/seo/metadata";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return createPageMetadata({
    title: t("contactTitle"),
    description: t("contactDescription"),
    path: locale === "en" ? "/ContactUs" : `/${locale}/ContactUs`,
  });
}

export default function LocaleContactPage() {
  return (
    <div className="min-h-screen bg-brand-surface">
      <NavBar />
      <ContactUs />
      <Footer />
    </div>
  );
}
