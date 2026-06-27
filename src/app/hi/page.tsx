import LocaleHomeServer from "@/components/home/LocaleHomeServer";
import { buildLocaleHomeMetadata } from "@/lib/home/locale-home-metadata";

export const revalidate = 3600;

export async function generateMetadata() {
  return buildLocaleHomeMetadata("hi");
}

export default async function HiHomePage() {
  return <LocaleHomeServer locale="hi" />;
}
