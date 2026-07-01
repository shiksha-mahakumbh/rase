import { NextRequest, NextResponse } from "next/server";
import { getClientIp, rateLimitAsync } from "@/lib/security/rateLimit";
import {
  REG_ID_RE,
  emailsMatch,
  verifyRegistrationLookupToken,
} from "@/lib/security/registration-lookup";
import { prisma } from "@/server/db/prisma";
import {
  generateReceiptPdfBuffer,
  buildRegistrationArtifacts,
} from "@/server/services/receipt.service";
import { generateBadgePdf } from "@/server/services/lifecycle/badge-certificate.service";
import { generateCertificatePdf } from "@/server/services/lifecycle/badge-certificate.service";
import { buildReceiptPayloadFromRegistration } from "@/server/services/admin/receipt-admin.service";
export { runtime, maxDuration } from "@/lib/server/pdf-api-route";

function isPaidStatus(status: string): boolean {
  return status === "Paid" || status === "Not_Required";
}

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = await rateLimitAsync({
    key: `participant-download:${ip}`,
    limit: 20,
    windowMs: 60_000,
  });
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const registrationId = String(searchParams.get("registrationId") ?? "").trim();
  const email = String(searchParams.get("email") ?? "").trim();
  const token = String(searchParams.get("token") ?? searchParams.get("lookupToken") ?? "").trim();
  const type = String(searchParams.get("type") ?? "receipt");

  if (!REG_ID_RE.test(registrationId) || !email || !token) {
    return NextResponse.json(
      { error: "Registration ID, email, and confirmation token are required" },
      { status: 400 }
    );
  }

  const verified = verifyRegistrationLookupToken(registrationId, token);
  if (!verified || !emailsMatch(verified.email, email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reg = await prisma.registration.findFirst({
    where: { registrationId, deletedAt: null },
  });
  if (!reg || !emailsMatch(reg.email, email)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    if (type === "badge") {
      if (!isPaidStatus(String(reg.paymentStatus))) {
        return NextResponse.json({ error: "Badge not available" }, { status: 403 });
      }
      const { pdf } = await generateBadgePdf(registrationId);
      return new NextResponse(pdf, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="badge-${registrationId}.pdf"`,
        },
      });
    }

    if (type === "certificate") {
      if (!isPaidStatus(String(reg.paymentStatus))) {
        return NextResponse.json(
          { error: "Certificate not available until payment is confirmed" },
          { status: 403 }
        );
      }
      const { pdf } = await generateCertificatePdf(registrationId);
      return new NextResponse(pdf, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="certificate-${registrationId}.pdf"`,
        },
      });
    }

    if (!isPaidStatus(String(reg.paymentStatus))) {
      return NextResponse.json(
        { error: "Receipt not available until payment is confirmed" },
        { status: 403 }
      );
    }

    const payload = buildReceiptPayloadFromRegistration(reg);
    const { qrPng } = await buildRegistrationArtifacts(payload, {
      registrationType: String(reg.registrationType),
    });
    const pdf = await generateReceiptPdfBuffer(payload, qrPng);

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="receipt-${registrationId}.pdf"`,
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Download failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
