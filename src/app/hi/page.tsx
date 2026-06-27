import LocaleHomeServer from "@/components/home/LocaleHomeServer";
import { createPageMetadata } from "@/lib/seo/metadata";
import { withHreflang } from "@/lib/seo/hreflang";
import hiMessages from "@/i18n/messages/hi.json";

export const revalidate = 3600;

const HI_HOME_META = {
  title: hiMessages.meta.homeTitle,
  description: hiMessages.meta.homeDescription,
  path: "/hi",
};

export async function generateMetadata() {
  return withHreflang(
    createPageMetadata({
      ...HI_HOME_META,
      locale: "hi_IN",
    }),
    "/"
  );
}

export default async function HiHomePage() {
  return <LocaleHomeServer locale="hi" />;
}
