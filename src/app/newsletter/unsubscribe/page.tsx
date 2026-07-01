import PublicPageShell from "@/components/layouts/PublicPageShell";
import NewsletterUnsubscribeForm from "@/components/newsletter/NewsletterUnsubscribeForm";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Unsubscribe from Newsletter",
  description:
    "Opt out of Shiksha Mahakumbh programme and registration email updates.",
  path: "/newsletter/unsubscribe",
  noIndex: true,
});

type Props = {
  searchParams: Promise<{ email?: string; token?: string }>;
};

export default async function NewsletterUnsubscribePage({ searchParams }: Props) {
  const params = await searchParams;
  const initialEmail = params.email?.trim() ?? "";
  const initialToken = params.token?.trim() ?? "";

  return (
    <PublicPageShell
      hero={{
        eyebrow: "Newsletter",
        title: "Unsubscribe",
        subtitle: "Stop receiving programme and registration updates by email.",
        accent: "brand",
      }}
      showCta={false}
    >
      <div className="mx-auto max-w-lg px-4 py-10">
        <NewsletterUnsubscribeForm initialEmail={initialEmail} initialToken={initialToken} />
      </div>
    </PublicPageShell>
  );
}
