import { redirect } from "next/navigation";

/** Legacy PascalCase Hindi contact URL → kebab-case. */
export default async function LegacyLocaleContactRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/contact-us`);
}
