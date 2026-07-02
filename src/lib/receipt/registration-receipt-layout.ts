import { EVENT_NAME } from "@/types/registration";
import type { ReceiptData } from "@/lib/receipt/receipt-data";
import {
  DONATION_RECEIPT_ORG,
  escapeHtml,
  type DonationReceiptLogoAssets,
} from "@/lib/receipt/donation-receipt-layout";
import { DONATION_RECEIPT_THEME } from "@/lib/receipt/donation-receipt-theme";
import {
  RECEIPT_DHE_LOGO_PATH,
  RECEIPT_EVENT_LOGO_PATH,
  receiptLogoSrc,
} from "@/lib/receipt/receipt-logos";

/** Latin-script header for jsPDF (Helvetica cannot render Devanagari). */
export const REGISTRATION_RECEIPT_ORG_PDF = {
  ...DONATION_RECEIPT_ORG,
  campaignHi: "Shiksha Mahakumbh Abhiyan",
} as const;

export const REGISTRATION_RECEIPT_THANKS = {
  heading: "हार्दिक धन्यवाद",
  lines: [
    "आपने शिक्षा महाकुंभ 6.0 में पंजीकरण किया — हम आपके प्रति कृतज्ञ हैं।",
    "आपकी सहभागिता राष्ट्रीय शिक्षा आंदोलन को नई ऊर्जा देगी। कृपया कार्यक्रम स्थल पर अपना पंजीकरण संख्या एवं यह प्रमाण पत्र साथ लाएँ।",
  ],
} as const;

/** jsPDF cannot render Devanagari — same message in Latin script for PDF download. */
export const REGISTRATION_RECEIPT_THANKS_PDF = {
  heading: "Heartfelt Thanks",
  lines: [
    "Thank you for registering for Shiksha Mahakumbh 6.0 — we are grateful for your participation.",
    "Your participation strengthens the national education movement. Please bring your registration ID and this receipt to the venue.",
  ],
} as const;

export const REGISTRATION_RECEIPT_CSS = `
  @page { size: A4 portrait; margin: 10mm; }
  * { box-sizing: border-box; }
  html, body {
    font-family: "Segoe UI", "Noto Sans Devanagari", Arial, Helvetica, sans-serif;
    font-size: 12px;
    color: ${DONATION_RECEIPT_THEME.text};
    margin: 0;
    padding: 0;
    background: #fff;
  }
  .receipt {
    max-width: 190mm;
    margin: 0 auto;
    background: #fff;
    border: 2px solid ${DONATION_RECEIPT_THEME.navyLight};
    border-top: 4px solid ${DONATION_RECEIPT_THEME.saffron};
    padding: 14px 18px 12px;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
    padding-bottom: 10px;
    border-bottom: 2px solid ${DONATION_RECEIPT_THEME.navyLight};
  }
  .header-left, .header-right {
    flex: 0 0 72px;
    min-height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .header-left img, .header-right img {
    display: block;
    width: 72px;
    height: 72px;
    object-fit: contain;
  }
  .header-center { flex: 1; text-align: center; line-height: 1.35; min-width: 0; }
  .header-meta {
    font-size: 9px;
    color: ${DONATION_RECEIPT_THEME.textMuted};
    margin-bottom: 4px;
  }
  .campaign-hi {
    font-size: 15px;
    font-weight: 700;
    color: ${DONATION_RECEIPT_THEME.saffronDark};
    margin: 1px 0;
    font-family: "Noto Sans Devanagari", "Mangal", "Nirmala UI", sans-serif;
  }
  .dept {
    font-size: 11px;
    font-weight: 700;
    color: ${DONATION_RECEIPT_THEME.navy};
    letter-spacing: 0.3px;
  }
  .unit { font-size: 8px; color: ${DONATION_RECEIPT_THEME.textMuted}; margin-top: 2px; letter-spacing: 0.4px; }
  .trust {
    font-size: 9px;
    font-weight: 700;
    color: ${DONATION_RECEIPT_THEME.navyLight};
    margin-top: 1px;
    line-height: 1.3;
  }
  .contact {
    font-size: 8.5px;
    color: ${DONATION_RECEIPT_THEME.textMuted};
    margin-top: 4px;
    line-height: 1.4;
  }
  .title-qr-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin: 10px 0 8px;
  }
  .title-wrap-inline {
    flex: 1;
    min-width: 0;
    text-align: left;
    padding: 8px 10px;
    background: linear-gradient(135deg, ${DONATION_RECEIPT_THEME.navy} 0%, ${DONATION_RECEIPT_THEME.navyLight} 100%);
    border-radius: 6px;
  }
  .title {
    font-size: 14px;
    font-weight: 700;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0;
    line-height: 1.3;
  }
  .qr-side {
    flex: 0 0 108px;
    text-align: right;
  }
  .qr-side img {
    width: 100px;
    height: 100px;
    object-fit: contain;
    display: inline-block;
  }
  .qr-caption {
    margin: 4px 0 0;
    font-size: 8.5px;
    line-height: 1.35;
    color: ${DONATION_RECEIPT_THEME.textMuted};
    text-align: right;
  }
  .details { width: 100%; border-collapse: collapse; font-size: 11px; }
  .details tr { border-bottom: 1px dotted ${DONATION_RECEIPT_THEME.border}; }
  .details td { padding: 4px 6px; vertical-align: top; line-height: 1.35; }
  .details td:first-child {
    width: 34%;
    font-weight: 600;
    color: ${DONATION_RECEIPT_THEME.navyLight};
    white-space: nowrap;
  }
  .details tr:nth-child(even) td { background: ${DONATION_RECEIPT_THEME.surfaceWarm}; }
  .thanks {
    margin: 10px 0 8px;
    padding: 10px 12px;
    border: 1px solid ${DONATION_RECEIPT_THEME.saffron};
    border-left: 4px solid ${DONATION_RECEIPT_THEME.saffronDark};
    border-radius: 6px;
    background: linear-gradient(135deg, ${DONATION_RECEIPT_THEME.surfaceWarm} 0%, #fff 100%);
    text-align: center;
    font-family: "Noto Sans Devanagari", "Mangal", "Nirmala UI", sans-serif;
  }
  .thanks h2 {
    margin: 0 0 4px;
    font-size: 13px;
    color: ${DONATION_RECEIPT_THEME.navy};
    font-weight: 700;
  }
  .thanks p {
    margin: 0 0 3px;
    font-size: 10.5px;
    line-height: 1.45;
    color: ${DONATION_RECEIPT_THEME.text};
  }
  .footer-note {
    margin-top: 8px;
    font-size: 9px;
    color: ${DONATION_RECEIPT_THEME.textMuted};
    text-align: center;
  }
  @media print {
    html, body { background: #fff; }
    .receipt {
      border: 1px solid #ccc;
      box-shadow: none;
      max-width: none;
      width: 100%;
      page-break-after: avoid;
      page-break-inside: avoid;
    }
  }
`;

export type RegistrationReceiptRow = { label: string; value: string };

export function getRegistrationReceiptRows(data: ReceiptData): RegistrationReceiptRow[] {
  const rows: RegistrationReceiptRow[] = [
    { label: "Receipt No.", value: data.receiptNumber },
    { label: "Registration ID", value: data.registrationId },
    { label: "Date", value: data.date },
    { label: "Name", value: data.fullName },
    { label: "Category", value: data.category },
    { label: "Institution", value: data.institution },
    { label: "Email", value: data.email },
    { label: "Phone", value: data.contactNumber },
    { label: "Amount", value: `₹ ${data.amount.toLocaleString("en-IN")}` },
    { label: "Payment Mode", value: data.paymentMode },
    { label: "Transaction Date", value: data.transactionDate },
  ];

  if (data.paymentId) rows.push({ label: "Payment ID", value: data.paymentId });
  if (data.orderId) rows.push({ label: "Order ID", value: data.orderId });
  if (data.panNumber) rows.push({ label: "PAN", value: data.panNumber });

  return rows;
}

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
  return `<img src="${src}" alt="${escapeHtml(alt)}" width="72" height="72" style="width:72px;height:72px;object-fit:contain" />`;
}

export function buildRegistrationReceiptHeaderHtml(
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

export function buildRegistrationReceiptThanksHtml(): string {
  const thanks = REGISTRATION_RECEIPT_THANKS;
  return `<div class="thanks">
  <h2>${thanks.heading}</h2>
  ${thanks.lines.map((line) => `<p>${line}</p>`).join("")}
</div>`;
}

export function registrationReceiptTitle(amount: number): string {
  return amount > 0 ? "Registration Fee Receipt" : "Registration Confirmation";
}

export function buildRegistrationReceiptTitleQrHtml(
  data: ReceiptData,
  qrDataUrl?: string | null
): string {
  const qr = qrDataUrl
    ? `<div class="qr-side">
  <img src="${qrDataUrl}" alt="Registration QR code" width="100" height="100"/>
  <p class="qr-caption">Venue check-in<br/>${escapeHtml(data.registrationId)}</p>
</div>`
    : "";

  return `<div class="title-qr-row">
  <div class="title-wrap-inline"><h1 class="title">${escapeHtml(registrationReceiptTitle(data.amount))}</h1></div>
  ${qr}
</div>`;
}

export function buildRegistrationReceiptBodyHtml(
  data: ReceiptData,
  options: {
    origin?: string;
    logos?: DonationReceiptLogoAssets;
    qrDataUrl?: string | null;
  } = {}
): string {
  const rows = getRegistrationReceiptRows(data)
    .map(
      (row) =>
        `<tr><td>${escapeHtml(row.label)}</td><td>${escapeHtml(row.value)}</td></tr>`
    )
    .join("");

  return `${buildRegistrationReceiptHeaderHtml(options.logos, options.origin)}
${buildRegistrationReceiptTitleQrHtml(data, options.qrDataUrl)}
<table class="details">${rows}</table>
${buildRegistrationReceiptThanksHtml()}
<p class="footer-note">This is a computer-generated receipt for ${escapeHtml(EVENT_NAME)}. No physical signature is required.</p>`;
}
