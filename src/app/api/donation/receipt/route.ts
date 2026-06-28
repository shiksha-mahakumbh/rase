import { NextRequest, NextResponse } from "next/server";
import {
  donationReceiptPdfForRecord,
  getDonationByReceiptToken,
} from "@/server/services/donation.service";
import { buildDonationReceiptHtml, buildDonationReceiptData } from "@/lib/receipt/donation-receipt";
import { SITE_URL } from "@/config/site";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const format = request.nextUrl.searchParams.get("format");

  if (!token) {
    return NextResponse.json({ error: "Receipt token required" }, { status: 400 });
  }

  const record = await getDonationByReceiptToken(token);
  if (!record) {
    return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
  }

  const amount =
    typeof record.amount === "object" && record.amount !== null && "toNumber" in record.amount
      ? (record.amount as { toNumber: () => number }).toNumber()
      : Number(record.amount);

  if (format === "html") {
    const data = buildDonationReceiptData({
      donationId: record.donationId,
      fullName: record.fullName,
      email: record.email,
      phone: record.phone,
      panNumber: record.panNumber,
      organization: record.organization,
      address: record.address,
      donationKind: record.donationKind,
      amount,
      paymentId: record.razorpayPaymentId,
      orderId: record.razorpayOrderId,
      transactionDate: record.createdAt,
    });
    const html = buildDonationReceiptHtml(data, SITE_URL, { autoPrint: true, embedLogos: true });
    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const pdf = await donationReceiptPdfForRecord({
    ...record,
    amount,
  });

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="donation-receipt-${record.donationId}.pdf"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
