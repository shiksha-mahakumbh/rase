import { jsPDF } from "jspdf";
import { EVENT_NAME } from "@/types/registration";

export interface AcknowledgementData {
  registrationId: string;
  registrationType: string;
  fullName: string;
  institution: string;
  email: string;
  contactNumber: string;
  paymentStatus: string;
  submissionDate: string;
}

export function generateAcknowledgementPdf(data: AcknowledgementData): jsPDF {
  const doc = new jsPDF();
  const margin = 20;
  let y = margin;

  doc.setFontSize(18);
  doc.setTextColor(80, 42, 42);
  doc.text(EVENT_NAME, margin, y);
  y += 10;

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Registration Acknowledgement", margin, y);
  y += 15;

  doc.setFontSize(11);
  const lines: [string, string][] = [
    ["Registration ID", data.registrationId],
    ["Registration Type", data.registrationType],
    ["Participant Name", data.fullName],
    ["Institution", data.institution],
    ["Email", data.email],
    ["Contact Number", data.contactNumber],
    ["Payment Status", data.paymentStatus],
    ["Submission Date", data.submissionDate],
  ];

  lines.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(String(value), margin + 55, y);
    y += 8;
  });

  y += 10;
  doc.setFontSize(10);
  doc.text(
    "Please keep this acknowledgement for future reference.",
    margin,
    y
  );

  return doc;
}

export function downloadAcknowledgementPdf(data: AcknowledgementData) {
  const doc = generateAcknowledgementPdf(data);
  doc.save(`${data.registrationId}.pdf`);
}
