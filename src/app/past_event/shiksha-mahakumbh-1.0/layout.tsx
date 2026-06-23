import { createPastEditionPageMetadata } from "@/lib/seo/past-edition-metadata";
import { SMK_1_0_PATH } from "@/data/editions/shiksha-mahakumbh-1.0-hub";

export const metadata = createPastEditionPageMetadata(SMK_1_0_PATH);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
