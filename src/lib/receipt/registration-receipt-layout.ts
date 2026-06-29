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


export const REGISTRATION_RECEIPT_THANKS = {
  heading: "हार्दिक धन्यवाद",
  lines: [
    "आपने शिक्षा महाकुंभ ६.० में पंजीकरण किया — हम आपके प्रति कृतज्ञ हैं।",
    "आपकी सहभागिता राष्ट्रीय शिक्षा आंदोलन को नई ऊर्जा देगी। कृपया कार्यक्रम स्थल पर अपना पंजीकरण संख्या एवं यह प्रमाण पत्र साथ लाएँ।",
  ],
} as const;

export const REGISTRATION_RECEIPT_CSS = `
  @page { size: A4 portrait; margin: 12mm; }
  * { box-sizing: border-box; }
  body {
    font-family: "Segoe UI", "Noto Sans Devanagari", Arial, Helvetica, sans-serif;
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
  .qr-wrap {
    margin: 18px 0;
    text-align: center;
    padding: 14px;
    border: 1px dashed ${DONATION_RECEIPT_THEME.border};
    border-radius: 8px;
    background: ${DONATION_RECEIPT_THEME.surface};
  }
  .qr-wrap img {
    width: 160px;
    height: 160px;
    object-fit: contain;
  }
  .qr-wrap p {
    margin: 8px 0 0;
    font-size: 11px;
    color: ${DONATION_RECEIPT_THEME.textMuted};
  }
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
  .footer-note {
    margin-top: 18px;
    font-size: 10px;
    color: ${DONATION_RECEIPT_THEME.textMuted};
    text-align: center;
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
  return `<img src="${src}" alt="${escapeHtml(alt)}" width="84" height="84" style="width:84px;height:84px;object-fit:contain" />`;
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

  const qrBlock = options.qrDataUrl
    ? `<div class="qr-wrap">
  <img src="${options.qrDataUrl}" alt="Registration QR code" width="160" height="160"/>
  <p>Scan at venue check-in · ${escapeHtml(data.registrationId)} · ${escapeHtml(EVENT_NAME)}</p>
</div>`
    : "";

  return `${buildRegistrationReceiptHeaderHtml(options.logos, options.origin)}
<div class="title-wrap"><h1 class="title">${escapeHtml(registrationReceiptTitle(data.amount))}</h1></div>
<table class="details">${rows}</table>
${qrBlock}
${buildRegistrationReceiptThanksHtml()}
<p class="footer-note">This is a computer-generated receipt for ${escapeHtml(EVENT_NAME)}. No physical signature is required.</p>`;
}
