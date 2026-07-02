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
      <p>Last updated: July 2026</p>
      <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        This policy is maintained by the Shiksha Mahakumbh organizing team. For
        legal queries or institutional review requests, contact{" "}
        <a href="mailto:academics@shikshamahakumbh.com">academics@shikshamahakumbh.com</a>.
      </p>

      <h2>Data controller</h2>
      <p>
        The Department of Holistic Education (Shiksha Mahakumbh Abhiyan) operates
        this website and determines how registration and contact data are processed
        for national education programmes.
      </p>

      <h2>Information we collect</h2>
      <p>
        When you register for Shiksha Mahakumbh events, contact us, subscribe to
        updates, or donate, we collect information you provide voluntarily,
        including name, contact details, institution, payment references, and
        documents required for your registration category.
      </p>

      <h2>How we use information</h2>
      <p>
        Data is used for event administration, communication, accommodation
        coordination, payment reconciliation, and academic programme management
        operated by the organizing team.
      </p>

      <h2>Legal basis (India)</h2>
      <p>
        Processing is based on your consent (analytics/marketing cookies,
        newsletter), contractual necessity (registration and payments), and
        legitimate interests (security, fraud prevention, and service improvement),
        consistent with the Digital Personal Data Protection Act, 2023 (DPDP) where
        applicable.
      </p>

      <h2>Data storage</h2>
      <p>
        Registration data is stored securely using industry-standard cloud
        infrastructure (Supabase PostgreSQL and object storage). Access is restricted
        to authorized administrators with audit logging.
      </p>

      <h2>Your rights</h2>
      <p>
        You may request access, correction, or deletion of your personal data by
        contacting{" "}
        <a href="mailto:academics@shikshamahakumbh.com">academics@shikshamahakumbh.com</a>.
        We respond within a reasonable period as required by applicable law.
      </p>

      <h2>Cookies</h2>
      <p>
        We use essential cookies for site functionality and analytics or advertising
        cookies only with your consent. See our{" "}
        <Link href="/cookie-policy">Cookie Policy</Link> for details and how to
        change preferences (including the cookie preferences control on the site).
      </p>

      <h2>Analytics and marketing</h2>
      <p>
        With your consent, we use first-party visitor analytics (page views and
        traffic sources stored in our database), Google Analytics, Google Tag
        Manager, Microsoft Clarity, and Meta Pixel when configured.
      </p>
      <p>
        Analytics data is retained for up to 12 months, then aggregated or deleted.
        Processors include Google (Analytics, reCAPTCHA), Microsoft (Clarity),
        Meta, Razorpay (payments), Supabase (hosting/database), and Vercel
        (hosting).
      </p>
      <p>
        You can withdraw analytics consent via the cookie banner, the cookie
        preferences panel, or by clearing site data in your browser. Newsletter
        subscribers can <Link href="/newsletter/unsubscribe">unsubscribe here</Link>.
      </p>

      <h2>Related policies</h2>
      <p>
        See also our <Link href="/terms-and-conditions">Terms &amp; Conditions</Link>{" "}
        and <Link href="/refund-policy">Refund Policy</Link>.
      </p>
    </LegalPageShell>
  );
}
