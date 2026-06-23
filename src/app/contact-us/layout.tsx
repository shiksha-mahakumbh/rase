import { createPageMetadata } from "@/lib/seo/metadata";
import {
  CONTACT_KEYWORDS,
  CONTACT_OG_IMAGE,
  CONTACT_PATH,
  contactMetaDescription,
} from "@/data/contact-hub";

export const metadata = createPageMetadata({
  title: "Contact Us",
  description: contactMetaDescription(),
  path: CONTACT_PATH,
  keywords: [...CONTACT_KEYWORDS],
  locale: "en_IN",
  ogImageUrl: CONTACT_OG_IMAGE,
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
