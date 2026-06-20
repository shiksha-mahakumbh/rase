import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import ContactUs from "@/components/content/ContactUs";
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
    path: locale === "en" ? "/contact-us" : `/${locale}/ContactUs`,
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
