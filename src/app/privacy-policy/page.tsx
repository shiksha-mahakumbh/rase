import Link from "next/link";
import LegalPageShell from "@/components/layouts/LegalPageShell";
import {
  generateLegalPageMetadata,
  renderLegalPage,
} from "@/lib/cms/legal-page-loader";

export async function generateMetadata() {
  return generateLegalPageMetadata("privacy-policy", {
    title: "Privacy Policy",
    description:
      "Privacy policy for Shiksha Mahakumbh Abhiyan — how we collect, use, and protect your personal information.",
    path: "/privacy-policy",
  });
}

export default async function PrivacyPolicyPage() {
  return renderLegalPage(
    "privacy-policy",
    <LegalPageShell title="Privacy Policy" path="/privacy-policy">
      <p>Last updated: May 2026</p>
      <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        This policy is maintained by the organizing team. For legal queries or
        institutional review requests, contact{" "}
        <a href="mailto:academics@shikshamahakumbh.com">academics@shikshamahakumbh.com</a>.
      </p>
      <h2>Information we collect</h2>
      <p>
        When you register for Shiksha Mahakumbh events, we collect information you
        provide voluntarily, including name, contact details, institution, and
        documents required for your registration category.
      </p>
      <h2>How we use information</h2>
      <p>
        Data is used for event administration, communication, accommodation
        coordination, and academic programme management operated by the organizing
        team.
      </p>
      <h2>Data storage</h2>
      <p>
        Registration data is stored securely using industry-standard cloud
        infrastructure (Supabase / PostgreSQL). Access is restricted to authorized
        administrators.
      </p>
      <h2>Your rights</h2>
      <p>
        You may request correction or deletion of your data by contacting{" "}
        <a href="mailto:academics@shikshamahakumbh.com">academics@shikshamahakumbh.com</a>.
      </p>
      <h2>Cookies</h2>
      <p>
        We use essential cookies for site functionality and analytics cookies only
        with your consent. See our{" "}
        <Link href="/cookie-policy">Cookie Policy</Link> for details.
      </p>
      <h2>Analytics and marketing</h2>
      <p>
        With your consent, we use first-party visitor analytics (page views and
        traffic sources stored in our database), Google Analytics, Google Tag Manager,
        Microsoft Clarity, and Meta Pixel to understand how visitors use the site.
        Google AdSense may serve ads when enabled and consented.
      </p>
      <p>
        Analytics data is retained for up to 12 months, then aggregated or deleted.
        Processors include Google (Analytics, Ads, reCAPTCHA), Microsoft (Clarity),
        Meta, Razorpay (payments), Supabase (hosting/database), and Vercel (hosting).
      </p>
      <p>
        You can withdraw analytics consent anytime via the cookie banner or by clearing
        site data in your browser. Newsletter subscribers can{" "}
        <Link href="/newsletter/unsubscribe">unsubscribe here</Link>.
      </p>
    </LegalPageShell>
  );
}
