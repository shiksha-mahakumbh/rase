import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { routing, type AppLocale } from "@/i18n/routing";
import { isRtl, type Locale } from "@/i18n/config";

const UNPUBLISHED_LOCALES = new Set(["fr", "es", "ar"]);

export function generateStaticParams() {
  return routing.locales
    .filter((locale) => !UNPUBLISHED_LOCALES.has(locale) && locale !== "hi")
    .map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (UNPUBLISHED_LOCALES.has(locale)) {
    return { robots: { index: false, follow: false } };
  }
  return {};
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as AppLocale)) {
    notFound();
  }

  if (UNPUBLISHED_LOCALES.has(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div
        dir={isRtl(locale as Locale) ? "rtl" : "ltr"}
        lang={locale === "hi" ? "hi-IN" : `${locale}-IN`}
      >
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
