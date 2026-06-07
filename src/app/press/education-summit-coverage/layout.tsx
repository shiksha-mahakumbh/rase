import PressArticleJsonLd from "@/components/seo/PressArticleJsonLd";
import { pressArticleMeta } from "@/lib/seo/publicPages";

export const metadata = pressArticleMeta(6);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PressArticleJsonLd pressNumber={6} />
      {children}
    </>
  );
}
