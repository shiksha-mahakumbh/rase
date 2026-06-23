import { createPastEditionPageMetadata } from "@/lib/seo/past-edition-metadata";
import { SMK_4_0_PATH } from "@/data/editions/shiksha-mahakumbh-4.0-hub";

export const metadata = createPastEditionPageMetadata(SMK_4_0_PATH);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
