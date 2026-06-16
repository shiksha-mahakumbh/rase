import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import { EVENT_NAME } from "@/types/registration";
import { SITE_URL } from "@/config/site";

export type ReceiptPayload = {
  registrationId: string;
  fullName: string;
  category: string;
  institution: string;
  email: string;
  contactNumber: string;
  amount: number;
  paymentId?: string;
  orderId?: string;
  panNumber?: string;
  transactionDate?: string;
};

function receiptNumber(publicId: string) {
  return publicId.replace(/^SMK/, "RCP");
}

function formatDate(value?: string | Date) {
  const d = value ? new Date(value) : new Date();
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export async function generateRegistrationQrBuffer(
  registrationId: string,
  options?: { fullName?: string; category?: string }
) {
  const payload = JSON.stringify({
    registrationId,
    fullName: options?.fullName ?? undefined,
    category: options?.category ?? undefined,
    event: EVENT_NAME,
    verifyUrl: `${SITE_URL}/registration/success?id=${encodeURIComponent(registrationId)}`,
  });
  return QRCode.toBuffer(payload, {
    type: "png",
    width: 280,
    margin: 2,
    errorCorrectionLevel: "M",
  });
}

export async function generateRegistrationQrDataUrl(
  registrationId: string,
  options?: { fullName?: string; category?: string }
) {
  const buffer = await generateRegistrationQrBuffer(registrationId, options);
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

export function generateReceiptPdfBuffer(data: ReceiptPayload): Buffer {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const left = 40;
  let y = 48;

  const line = (text: string, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.text(text, left, y);
    y += 18;
  };

  line("DEPARTMENT OF HOLISTIC EDUCATION", true);
  line(`${EVENT_NAME} — Registration Fee Receipt`, true);
  y += 8;
  line(`Receipt No.: ${receiptNumber(data.registrationId)}`);
  line(`Registration ID: ${data.registrationId}`);
  line(`Date: ${formatDate(data.transactionDate)}`);
  y += 8;
  line("Registrant", true);
  line(`Name: ${data.fullName}`);
  line(`Category: ${data.category}`);
  line(`Institution: ${data.institution}`);
  line(`Email: ${data.email}`);
  line(`Phone: ${data.contactNumber}`);
  y += 8;
  line("Payment", true);
  line(`Amount: ₹${data.amount.toLocaleString("en-IN")}`);
  line(`Payment ID: ${data.paymentId ?? "—"}`);
  line(`Order ID: ${data.orderId ?? "—"}`);
  line(`Mode: Online (Razorpay)`);
  line(`Transaction Date: ${formatDate(data.transactionDate)}`);
  if (data.panNumber) line(`PAN: ${data.panNumber}`);
  y += 16;
  line("Department of Holistic Education", true);

  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}

export function receiptDownloadUrl(registrationId: string, token?: string) {
  const params = new URLSearchParams({ id: registrationId });
  if (token) params.set("token", token);
  return `${SITE_URL}/registration/success?${params.toString()}`;
}

export function qrStoragePathFor(registrationId: string) {
  return `generated/qr/${registrationId}.png`;
}
