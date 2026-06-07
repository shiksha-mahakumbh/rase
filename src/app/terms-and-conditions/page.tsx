import { createPageMetadata } from "@/lib/seo/metadata";
import LegalPageShell from "@/components/layouts/LegalPageShell";

export const metadata = createPageMetadata({
  title: "Terms and Conditions",
  description: "Terms and conditions for using the Shiksha Mahakumbh Abhiyan website and registration services.",
  path: "/terms-and-conditions",
});

export default function TermsPage() {
  return (
    <LegalPageShell title="Terms and Conditions">
      <p>Last updated: May 2026</p>
      <h2>Acceptance</h2>
      <p>
        By accessing this website and submitting registrations, you agree to these
        terms and to provide accurate information.
      </p>
      <h2>Registrations</h2>
      <p>
        Registration fees, where applicable, are non-refundable unless stated
        otherwise in the refund policy. The organizing committee may verify
        documents and reject incomplete or fraudulent submissions.
      </p>
      <h2>Intellectual property</h2>
      <p>
        Content on this website is owned by the organizers and partners unless
        otherwise credited. You may not reproduce materials without permission.
      </p>
      <h2>Liability</h2>
      <p>
        The website is provided as-is. The organizers are not liable for
        indirect damages arising from use of the site or third-party payment
        gateways.
      </p>
    </LegalPageShell>
  );
}
