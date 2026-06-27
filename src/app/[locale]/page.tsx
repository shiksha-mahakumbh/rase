import type { Metadata } from "next";
import LocaleHomeServer from "@/components/home/LocaleHomeServer";
import { buildLocaleHomeMetadata } from "@/lib/home/locale-home-metadata";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildLocaleHomeMetadata(locale);
}

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <LocaleHomeServer locale={locale} />;
}
