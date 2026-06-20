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
    <LegalPageShell title="Privacy Policy">
      <p>Last updated: May 2026</p>
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
        with your consent.
      </p>
    </LegalPageShell>
  );
}
