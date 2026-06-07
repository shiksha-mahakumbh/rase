import { createPageMetadata } from "@/lib/seo/metadata";
import LegalPageShell from "@/components/layouts/LegalPageShell";

export const metadata = createPageMetadata({
  title: "Refund Policy",
  description: "Refund policy for Shiksha Mahakumbh registration and related fees.",
  path: "/refund-policy",
});

export default function RefundPolicyPage() {
  return (
    <LegalPageShell title="Refund Policy">
      <h2>Registration fees</h2>
      <p>
        Paid registrations are generally non-refundable once confirmed, except
        where the event is cancelled by the organizers or a category is withdrawn.
      </p>
      <h2>Duplicate payments</h2>
      <p>
        If you were charged twice, email{" "}
        <a href="mailto:academics@shikshamahakumbh.com">academics@shikshamahakumbh.com</a>{" "}
        with your Registration ID and payment receipt within 15 days.
      </p>
      <h2>Processing time</h2>
      <p>Approved refunds are processed within 21 working days to the original payment method where possible.</p>
    </LegalPageShell>
  );
}
