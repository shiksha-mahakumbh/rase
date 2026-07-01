import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import hiMessages from "@/i18n/messages/hi.json";
import TranslationInProgressBanner from "@/components/i18n/TranslationInProgressBanner";

export default function HiLayout({ children }: { children: React.ReactNode }) {
  setRequestLocale("hi");
  return (
    <NextIntlClientProvider locale="hi" messages={hiMessages}>
      <div dir="ltr" lang="hi-IN">
        <TranslationInProgressBanner
          message={hiMessages.home.translationBanner}
          englishHref="/"
          englishLabel={hiMessages.home.englishVersion}
        />
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
