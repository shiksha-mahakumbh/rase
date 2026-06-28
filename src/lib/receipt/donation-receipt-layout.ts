import { DONATION_80G } from "@/data/donation-hub";
import { amountInWords } from "@/lib/receipt/amount-in-words";
import type { DonationReceiptData } from "@/lib/receipt/donation-receipt";
import { DONATION_RECEIPT_THEME } from "@/lib/receipt/donation-receipt-theme";
import {
  RECEIPT_DHE_LOGO_PATH,
  RECEIPT_EVENT_LOGO_PATH,
  receiptLogoSrc,
} from "@/lib/receipt/receipt-logos";

/** Header block — shared by HTML print and PDF renderer */
export const DONATION_RECEIPT_ORG = {
  regdNo: "6401",
  regdDate: "10-11-2023",
  pan: "AAETV1652K",
  campaignHi: "शिक्षा महाकुंभ अभियान",
  department: "DEPARTMENT OF HOLISTIC EDUCATION",
  unitLine: "A UNIT OF",
  trustName: "VIDYA BHARTI INSTITUTE OF TRAINING AND RESEARCH TRUST",
  addressLine1: "E-7, Orchid Towers, Sector 125, Sunny Enclave,",
  addressLine2: "SAS Nagar, Punjab-140301",
  web: "shikshamahakumbh.com",
  email: "info@shikshamahakumbh.com",
} as const;

export const DONATION_RECEIPT_THANKS = {
  heading: "हार्दिक धन्यवाद",
  lines: [
    "आपके उदार योगदान से शिक्षा महाकुंभ अभियान के अंतर्गत समग्र शिक्षा के पवित्र कार्यों को नई ऊर्जा और संसाधन मिलेंगे।",
    "आपका सहयोग युवाओं एवं शिक्षा जगत के लिए एक अमूल्य उपहार है — हम आपके प्रति सदैव कृतज्ञ रहेंगे।",
  ],
} as const;

export type DonationReceiptLogoAssets = {
  dheDataUrl?: string | null;
  eventDataUrl?: string | null;
};

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export { amountInWords };

export function formatReceiptDateTime(value?: string | Date): { date: string; time: string } {
  const d = value ? new Date(value) : new Date();
  return {
    date: d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    time: d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }),
  };
}

export type DonationReceiptRow = { label: string; value: string };

export function getDonationReceiptRows(data: DonationReceiptData): DonationReceiptRow[] {
  const rows: DonationReceiptRow[] = [
    { label: "Receipt No.", value: data.receiptNumber },
    { label: "Donation ID", value: data.donationId },
    { label: "Date", value: data.date },
    { label: "Transaction Time", value: data.transactionTime },
    { label: "Donor Name", value: data.fullName },
    { label: "PAN", value: data.panNumber },
    { label: "Email", value: data.email },
    { label: "Phone", value: data.phone },
    { label: "Type", value: data.donationKind },
  ];

  if (data.organization) rows.push({ label: "Organization", value: data.organization });
  if (data.address) rows.push({ label: "Address", value: data.address });

  rows.push(
    { label: "Amount", value: `₹ ${data.amount.toLocaleString("en-IN")}` },
    { label: "Amount in words", value: amountInWords(data.amount) },
    { label: "Payment Mode", value: data.paymentMode },
    { label: "Transaction Date", value: data.transactionDate }
  );

  if (data.paymentId) rows.push({ label: "Payment ID", value: data.paymentId });
  if (data.orderId) rows.push({ label: "Order ID", value: data.orderId });

  return rows;
}

export function buildDonationReceiptCertText(data: DonationReceiptData): string {
  return `This is to certify that a sum of ₹${data.amount.toLocaleString("en-IN")} has been received from ${data.fullName} (PAN: ${data.panNumber}) as ${data.donationKind.toLowerCase()} towards ${data.orgLegalName} in support of ${data.programmeName}. Unique Registration No. under Section 80G: ${data.registration80G}. Valid for ${DONATION_80G.approvalPeriod}. This receipt is valid for income tax deduction purposes subject to applicable laws.`;
}

export const DONATION_RECEIPT_CSS = `
  @page { size: A4 portrait; margin: 12mm; }
  * { box-sizing: border-box; }
  body {
    font-family: "Segoe UI", Arial, Helvetica, sans-serif;
    font-size: 13px;
    color: ${DONATION_RECEIPT_THEME.text};
    margin: 0;
    padding: 16px;
    background: ${DONATION_RECEIPT_THEME.surface};
  }
  .receipt {
    max-width: 720px;
    margin: 0 auto;
    background: #fff;
    border: 2px solid ${DONATION_RECEIPT_THEME.navyLight};
    border-top: 4px solid ${DONATION_RECEIPT_THEME.saffron};
    padding: 24px 28px;
    page-break-inside: avoid;
    box-shadow: 0 4px 24px rgba(11, 31, 59, 0.08);
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 14px;
    padding-bottom: 16px;
    border-bottom: 2px solid ${DONATION_RECEIPT_THEME.navyLight};
  }
  .header-left, .header-right {
    flex: 0 0 84px;
    min-height: 84px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .header-left img, .header-right img {
    display: block;
    width: 84px;
    height: 84px;
    object-fit: contain;
  }
  .header-center { flex: 1; text-align: center; line-height: 1.45; min-width: 0; }
  .header-meta {
    font-size: 10px;
    color: ${DONATION_RECEIPT_THEME.textMuted};
    margin-bottom: 6px;
    text-align: center;
  }
  .campaign-hi {
    font-size: 18px;
    font-weight: 700;
    color: ${DONATION_RECEIPT_THEME.saffronDark};
    margin: 2px 0;
    font-family: "Noto Sans Devanagari", "Mangal", "Nirmala UI", sans-serif;
  }
  .dept {
    font-size: 12px;
    font-weight: 700;
    color: ${DONATION_RECEIPT_THEME.navy};
    letter-spacing: 0.4px;
  }
  .unit { font-size: 9px; color: ${DONATION_RECEIPT_THEME.textMuted}; margin-top: 4px; letter-spacing: 0.5px; }
  .trust {
    font-size: 10px;
    font-weight: 700;
    color: ${DONATION_RECEIPT_THEME.navyLight};
    margin-top: 2px;
    line-height: 1.35;
  }
  .contact {
    font-size: 9.5px;
    color: ${DONATION_RECEIPT_THEME.textMuted};
    margin-top: 6px;
    line-height: 1.5;
  }
  .title-wrap {
    margin: 18px 0 14px;
    text-align: center;
    padding: 10px 12px;
    background: linear-gradient(135deg, ${DONATION_RECEIPT_THEME.navy} 0%, ${DONATION_RECEIPT_THEME.navyLight} 100%);
    border-radius: 8px;
  }
  .title {
    font-size: 17px;
    font-weight: 700;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    margin: 0;
  }
  .details { width: 100%; border-collapse: collapse; }
  .details tr { border-bottom: 1px dotted ${DONATION_RECEIPT_THEME.border}; }
  .details td { padding: 8px 8px; vertical-align: top; }
  .details td:first-child {
    width: 38%;
    font-weight: 600;
    color: ${DONATION_RECEIPT_THEME.navyLight};
    white-space: nowrap;
  }
  .details tr:nth-child(even) td { background: ${DONATION_RECEIPT_THEME.surfaceWarm}; }
  .thanks {
    margin: 20px 0 16px;
    padding: 16px 18px;
    border: 1px solid ${DONATION_RECEIPT_THEME.saffron};
    border-left: 4px solid ${DONATION_RECEIPT_THEME.saffronDark};
    border-radius: 8px;
    background: linear-gradient(135deg, ${DONATION_RECEIPT_THEME.surfaceWarm} 0%, #fff 100%);
    text-align: center;
    font-family: "Noto Sans Devanagari", "Mangal", "Nirmala UI", sans-serif;
  }
  .thanks h2 {
    margin: 0 0 8px;
    font-size: 16px;
    color: ${DONATION_RECEIPT_THEME.navy};
    font-weight: 700;
  }
  .thanks p {
    margin: 0 0 6px;
    font-size: 12.5px;
    line-height: 1.65;
    color: ${DONATION_RECEIPT_THEME.text};
  }
  .thanks p:last-child { margin-bottom: 0; }
  .cert {
    margin-top: 16px;
    padding: 14px 16px;
    border: 1px dashed ${DONATION_RECEIPT_THEME.border};
    border-radius: 8px;
    background: ${DONATION_RECEIPT_THEME.surface};
    font-size: 11.5px;
    line-height: 1.65;
    color: ${DONATION_RECEIPT_THEME.textMuted};
  }
  .cert-title {
    font-size: 12px;
    font-weight: 700;
    color: ${DONATION_RECEIPT_THEME.navy};
    margin-bottom: 8px;
  }
  .footer-note {
    margin-top: 18px;
    font-size: 10px;
    color: ${DONATION_RECEIPT_THEME.textMuted};
    text-align: center;
  }
`;

function logoImg(
  path: string,
  alt: string,
  assets: DonationReceiptLogoAssets,
  origin?: string
): string {
  const embedded =
    path === RECEIPT_DHE_LOGO_PATH
      ? assets.dheDataUrl
      : path === RECEIPT_EVENT_LOGO_PATH
        ? assets.eventDataUrl
        : null;
  const src = embedded ?? receiptLogoSrc(path, origin);
  return `<img src="${src}" alt="${escapeHtml(alt)}" width="84" height="84" style="width:84px;height:84px;object-fit:contain" />`;
}

export function buildDonationReceiptHeaderHtml(
  assets: DonationReceiptLogoAssets = {},
  origin?: string
): string {
  const org = DONATION_RECEIPT_ORG;
  return `<div class="header">
  <div class="header-left">${logoImg(RECEIPT_DHE_LOGO_PATH, "Department of Holistic Education", assets, origin)}</div>
  <div class="header-center">
    <div class="header-meta"><strong>Regd. No. ${org.regdNo}</strong> &nbsp;|&nbsp; Date: ${org.regdDate} &nbsp;|&nbsp; PAN: ${org.pan}</div>
    <div class="campaign-hi">${org.campaignHi}</div>
    <div class="dept">${org.department}</div>
    <div class="unit">${org.unitLine}</div>
    <div class="trust">${org.trustName}</div>
    <div class="contact">${org.addressLine1}<br/>${org.addressLine2}<br/>Web. ${org.web}, E-mail: ${org.email}</div>
  </div>
  <div class="header-right">${logoImg(RECEIPT_EVENT_LOGO_PATH, "Shiksha Mahakumbh", assets, origin)}</div>
</div>`;
}

export function buildDonationReceiptThanksHtml(): string {
  const thanks = DONATION_RECEIPT_THANKS;
  return `<div class="thanks">
  <h2>${thanks.heading}</h2>
  ${thanks.lines.map((line) => `<p>${line}</p>`).join("")}
</div>`;
}

export function buildDonationReceiptBodyHtml(
  data: DonationReceiptData,
  options: { origin?: string; logos?: DonationReceiptLogoAssets } = {}
): string {
  const rows = getDonationReceiptRows(data)
    .map(
      (row) =>
        `<tr><td>${escapeHtml(row.label)}</td><td>${escapeHtml(row.value)}</td></tr>`
    )
    .join("");

  return `${buildDonationReceiptHeaderHtml(options.logos, options.origin)}
<div class="title-wrap"><h1 class="title">Donation Receipt (80G)</h1></div>
<table class="details">${rows}</table>
${buildDonationReceiptThanksHtml()}
<div class="cert">
  <div class="cert-title">80G Tax Exemption — Section ${escapeHtml(data.section80G)} of ${escapeHtml(data.act80G)}</div>
  ${escapeHtml(buildDonationReceiptCertText(data))}
</div>
<p class="footer-note">This is a computer-generated receipt. No physical signature is required.</p>`;
}
