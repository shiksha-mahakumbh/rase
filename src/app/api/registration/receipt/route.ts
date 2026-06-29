import { NextRequest, NextResponse } from "next/server";
import { getClientIp, rateLimitAsync } from "@/lib/security/rateLimit";
import {
  REG_ID_RE,
  verifyRegistrationLookupToken,
} from "@/lib/security/registration-lookup";
import { prisma } from "@/server/db/prisma";
import { buildReceiptData } from "@/lib/receipt/receipt-data";
import { buildRegistrationReceiptHtml } from "@/lib/receipt/registration-receipt";
import {
  buildRegistrationArtifacts,
  generateReceiptPdfBuffer,
} from "@/server/services/receipt.service";
import { buildReceiptPayloadFromRegistration } from "@/server/services/admin/receipt-admin.service";
import { SITE_URL } from "@/config/site";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = await rateLimitAsync({
    key: `registration-receipt:${ip}`,
    limit: 60,
    windowMs: 60_000,
  });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } }
    );
  }

  const registrationId = request.nextUrl.searchParams.get("id")?.trim() ?? "";
  const token = request.nextUrl.searchParams.get("token")?.trim() ?? "";
  const format = request.nextUrl.searchParams.get("format");

  if (!REG_ID_RE.test(registrationId)) {
    return NextResponse.json({ error: "Invalid registration ID" }, { status: 400 });
  }
  if (!token) {
    return NextResponse.json({ error: "Confirmation token required" }, { status: 401 });
  }

  const verified = verifyRegistrationLookupToken(registrationId, token);
  if (!verified) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  const reg = await prisma.registration.findFirst({
    where: { registrationId, deletedAt: null },
    include: {
      paymentRecords: {
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });
  if (!reg) {
    return NextResponse.json({ error: "Registration not found" }, { status: 404 });
  }

  const payload = buildReceiptPayloadFromRegistration(reg);
  const { qrDataUrl } = await buildRegistrationArtifacts(payload, {
    registrationType: String(reg.registrationType),
  });
  const receiptData = buildReceiptData(payload);

  if (format === "html") {
    const html = buildRegistrationReceiptHtml(receiptData, SITE_URL, {
      autoPrint: true,
      embedLogos: true,
      qrDataUrl,
    });
    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const pdf = await generateReceiptPdfBuffer(
    payload,
    Buffer.from(qrDataUrl.split(",")[1] ?? "", "base64")
  );

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="receipt-${registrationId}.pdf"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
