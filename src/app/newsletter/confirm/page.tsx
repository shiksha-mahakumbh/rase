import PublicPageShell from "@/components/layouts/PublicPageShell";
import { confirmNewsletterSubscription } from "@/server/services/newsletter.service";
import Link from "next/link";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Confirm Newsletter Subscription",
  description: "Confirm your Shiksha Mahakumbh email subscription.",
  path: "/newsletter/confirm",
  noIndex: true,
});

type Props = {
  searchParams: Promise<{ token?: string }>;
};

export default async function NewsletterConfirmPage({ searchParams }: Props) {
  const params = await searchParams;
  const token = params.token?.trim();

  let status: "missing" | "success" | "error" = "missing";
  let email: string | null = null;

  if (token) {
    try {
      const row = await confirmNewsletterSubscription(token);
      status = "success";
      email = row.email;
    } catch {
      status = "error";
    }
  }

  return (
    <PublicPageShell
      hero={{
        eyebrow: "Newsletter",
        title: "Confirm subscription",
        subtitle: "Verify your email to receive programme updates.",
        accent: "brand",
      }}
      showCta={false}
    >
      <div className="mx-auto max-w-lg px-4 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          {status === "success" ? (
            <>
              <p className="text-lg font-bold text-brand-navy">Subscription confirmed</p>
              <p className="mt-2 text-sm text-slate-600">
                {email ? `${email} is now subscribed to SMK updates.` : "You are subscribed to SMK updates."}
              </p>
            </>
          ) : status === "error" ? (
            <>
              <p className="text-lg font-bold text-brand-navy">Link expired or invalid</p>
              <p className="mt-2 text-sm text-slate-600">
                Request a new subscription from the site footer or contact support.
              </p>
            </>
          ) : (
            <>
              <p className="text-lg font-bold text-brand-navy">Missing confirmation link</p>
              <p className="mt-2 text-sm text-slate-600">
                Open the confirmation link from your email to complete subscription.
              </p>
            </>
          )}
          <Link
            href="/"
            className="mt-6 inline-flex min-h-[44px] items-center rounded-xl bg-brand-navy px-6 text-sm font-bold text-white"
          >
            Back to home
          </Link>
        </div>
      </div>
    </PublicPageShell>
  );
}
