import { queueEmail } from "@/server/services/email.service";
import { DONATION_80G } from "@/data/donation-hub";

export async function sendDonationReceiptEmail(options: {
  donationId: string;
  fullName: string;
  email: string;
  amount: number;
  donationKind: "Donation" | "Sponsorship";
  receiptUrl: string;
  receiptPdf: Buffer;
}) {
  const subject = `Shiksha Mahakumbh — ${options.donationKind} Receipt (80G)`;

  const html = `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#1e293b;max-width:560px">
    <p>Dear ${options.fullName},</p>
    <p>Thank you for your generous ${options.donationKind.toLowerCase()} to <strong>Shiksha Mahakumbh Abhiyan</strong>.</p>
    <table style="border-collapse:collapse;margin:16px 0;width:100%">
      <tr><td style="padding:6px 0;font-weight:600">Donation ID</td><td>${options.donationId}</td></tr>
      <tr><td style="padding:6px 0;font-weight:600">Amount</td><td>₹${options.amount.toLocaleString("en-IN")}</td></tr>
      <tr><td style="padding:6px 0;font-weight:600">80G Benefit</td><td>Eligible under Section ${DONATION_80G.section}</td></tr>
    </table>
    <p>Your official 80G donation receipt is attached as PDF. You can also download or print it online:</p>
    <p><a href="${options.receiptUrl}" style="display:inline-block;background:#e8750a;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:bold">Download Receipt</a></p>
    <p style="font-size:13px;color:#64748b;margin-top:20px">${DONATION_80G.note}</p>
    <p style="margin-top:24px">With gratitude,<br/><strong>Shiksha Mahakumbh Abhiyan Team</strong><br/>Department of Holistic Education</p>
  </div>`;

  return queueEmail({
    toEmail: options.email,
    subject,
    html,
    template: "contact_acknowledgement",
    publicRegistrationId: options.donationId,
    attachments: [
      {
        filename: `donation-receipt-${options.donationId}.pdf`,
        content: options.receiptPdf,
        contentType: "application/pdf",
        contentDisposition: "attachment",
      },
    ],
  });
}
