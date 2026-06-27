import { NextIntlClientProvider } from "next-intl";
import hiMessages from "@/i18n/messages/hi.json";

export default function HiLayout({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlClientProvider locale="hi" messages={hiMessages}>
      <div dir="ltr" lang="hi-IN">
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
