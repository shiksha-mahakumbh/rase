import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

/** Hindi locale shell (static /hi/* routes outside [locale] segment). */
export default async function HiLayout({ children }: { children: React.ReactNode }) {
  const messages = await getMessages({ locale: "hi" });

  return (
    <NextIntlClientProvider locale="hi" messages={messages}>
      <div dir="ltr" lang="hi-IN">
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
