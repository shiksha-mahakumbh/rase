import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  REG_ID_RE,
  emailsMatch,
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

export async function handleRegistrationReceiptGet(request: NextRequest) {
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

  if (!emailsMatch(reg.email, verified.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
