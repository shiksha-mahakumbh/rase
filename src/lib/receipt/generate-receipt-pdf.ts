import { jsPDF } from "jspdf";
import {
  buildReceiptData,
  RECEIPT_ORG,
  type ReceiptData,
  type ReceiptPayload,
} from "@/lib/receipt/receipt-data";

function renderReceiptPdf(doc: jsPDF, data: ReceiptData) {
  const left = 40;
  let y = 40;
  const line = (text: string, bold = false, size = 10) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.text(text, left, y);
    y += size + 6;
  };

  line("DEPARTMENT OF HOLISTIC EDUCATION", true, 12);
  line(`A Unit of Vidya Bharti Institute of Training and Research Trust`, false, 8);
  line(RECEIPT_ORG.address, false, 8);
  line(`Web: ${RECEIPT_ORG.web} · E-mail: ${RECEIPT_ORG.email}`, false, 8);
  y += 4;
  line(`${RECEIPT_ORG.eventName} — Registration Fee Receipt`, true, 11);
  y += 4;
  line(`Regd. No. ${RECEIPT_ORG.regdNo}    PAN: ${RECEIPT_ORG.pan}`, false, 8);
  y += 6;
  line(`Receipt No.: ${data.receiptNumber}`);
  line(`Registration ID: ${data.registrationId}`);
  line(`Date: ${data.date}`);
  y += 6;
  line("Registrant Details", true);
  line(`Name: ${data.fullName}`);
  line(`Category: ${data.category}`);
  line(`Institution: ${data.institution}`);
  line(`Email: ${data.email}`);
  line(`Phone: ${data.contactNumber}`);
  y += 6;
  line("Payment Details", true);
  line(`Amount: ₹${data.amount.toLocaleString("en-IN")}`);
  line(`Payment ID: ${data.paymentId ?? "—"}`);
  line(`Order ID: ${data.orderId ?? "—"}`);
  line(`Mode: ${data.paymentMode}`);
  line(`Transaction Date: ${data.transactionDate}`);
  if (data.panNumber) line(`PAN: ${data.panNumber}`);
  y += 12;
  line("Department of Holistic Education", true);
}

export function generateReceiptPdfBufferFromData(data: ReceiptData): Buffer {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  renderReceiptPdf(doc, data);
  return Buffer.from(doc.output("arraybuffer"));
}

export function generateReceiptPdfBuffer(payload: ReceiptPayload): Buffer {
  return generateReceiptPdfBufferFromData(buildReceiptData(payload));
}

export type { ReceiptData, ReceiptPayload } from "@/lib/receipt/receipt-data";

export async function downloadReceiptPdfClient(data: ReceiptData): Promise<void> {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  renderReceiptPdf(doc, data);
  doc.save(`receipt-${data.registrationId}.pdf`);
}
