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
      <p>Last updated: July 2026</p>

      <h2>Acceptance</h2>
      <p>
        By accessing this website and submitting registrations, donations, or
        contact forms, you agree to these terms, our{" "}
        <Link href="/privacy-policy">Privacy Policy</Link>, and our{" "}
        <Link href="/cookie-policy">Cookie Policy</Link>, and confirm that
        information you provide is accurate.
      </p>

      <h2>Registrations</h2>
      <p>
        Registration fees, where applicable, are non-refundable unless stated
        otherwise in the <Link href="/refund-policy">Refund Policy</Link>. The
        organizing committee may verify documents and reject incomplete or
        fraudulent submissions.
      </p>

      <h2>Conduct</h2>
      <p>
        You must not misuse the site, attempt unauthorized access to admin systems,
        scrape personal data, or submit malware through uploads or forms.
      </p>

      <h2>Intellectual property</h2>
      <p>
        Content on this website is owned by the organizers and partners unless
        otherwise credited. Application source code is proprietary (see{" "}
        <Link href="/licenses">Open Source Licenses</Link>). You may not reproduce
        materials without permission.
      </p>

      <h2>Liability</h2>
      <p>
        The organizers are not liable for indirect damages arising from use of this
        site or participation in events, to the extent permitted by applicable law
        in India.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of India. Courts in Himachal Pradesh
        shall have exclusive jurisdiction, subject to mandatory consumer protections.
      </p>
    </LegalPageShell>
  );
}
