import Link from "next/link";
import LegalPageShell from "@/components/layouts/LegalPageShell";
import {
  generateLegalPageMetadata,
  renderLegalPage,
} from "@/lib/cms/legal-page-loader";

export async function generateMetadata() {
  return generateLegalPageMetadata("terms-and-conditions", {
    title: "Terms and Conditions",
    description:
      "Terms and conditions for using the Shiksha Mahakumbh Abhiyan website and registration services.",
    path: "/terms-and-conditions",
  });
}

export default async function TermsPage() {
  return renderLegalPage(
    "terms-and-conditions",
    <LegalPageShell title="Terms and Conditions" path="/terms-and-conditions">
      <p>Last updated: May 2026</p>
      <h2>Acceptance</h2>
      <p>
        By accessing this website and submitting registrations, you agree to these
        terms and to provide accurate information.
      </p>
      <h2>Registrations</h2>
      <p>
        Registration fees, where applicable, are non-refundable unless stated
        otherwise in the <Link href="/refund-policy">refund policy</Link>. The organizing committee may verify
        documents and reject incomplete or fraudulent submissions.
      </p>
      <h2>Intellectual property</h2>
      <p>
        Content on this website is owned by the organizers and partners unless
        otherwise credited. You may not reproduce materials without permission.
      </p>
      <h2>Liability</h2>
      <p>
        The organizers are not liable for indirect damages arising from use of this
        site or participation in events, to the extent permitted by law.
      </p>
    </LegalPageShell>
  );
}
