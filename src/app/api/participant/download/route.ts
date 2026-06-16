import { NextRequest, NextResponse } from "next/server";
import { getClientIp, rateLimit } from "@/lib/security/rateLimit";
import { REG_ID_RE } from "@/lib/security/registration-lookup";
import { prisma } from "@/server/db/prisma";
import { generateReceiptPdfBuffer } from "@/server/services/receipt.service";
import { generateRegistrationQrBuffer } from "@/server/services/receipt.service";
import { generateBadgePdf } from "@/server/services/lifecycle/badge-certificate.service";
import { generateCertificatePdf } from "@/server/services/lifecycle/badge-certificate.service";
import { displayRegistrationType } from "@/server/services/admin/receipt-admin.service";

async function verifyParticipant(registrationId: string, email: string) {
  const reg = await prisma.registration.findFirst({
    where: { registrationId, deletedAt: null },
  });
  if (!reg || reg.email.toLowerCase() !== email.toLowerCase()) return null;
  return reg;
}

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = rateLimit({ key: `participant-download:${ip}`, limit: 20, windowMs: 60_000 });
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const registrationId = String(searchParams.get("registrationId") ?? "").trim();
  const email = String(searchParams.get("email") ?? "").trim();
  const type = String(searchParams.get("type") ?? "receipt");

  if (!REG_ID_RE.test(registrationId) || !email) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  const reg = await verifyParticipant(registrationId, email);
  if (!reg) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    if (type === "badge") {
      if (reg.paymentStatus !== "Paid" && reg.paymentStatus !== "Not_Required") {
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
      const { pdf } = await generateCertificatePdf(registrationId);
      return new NextResponse(pdf, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="certificate-${registrationId}.pdf"`,
        },
      });
    }

    if (reg.paymentStatus !== "Paid" && reg.paymentStatus !== "Not_Required") {
      return NextResponse.json({ error: "Receipt not available" }, { status: 403 });
    }

    const qrPng = await generateRegistrationQrBuffer(reg.registrationId);
    const pdf = generateReceiptPdfBuffer(
      {
        registrationId: reg.registrationId,
        fullName: reg.fullName,
        email: reg.email,
        institution: reg.institution,
        contactNumber: reg.contactNumber,
        category: displayRegistrationType(String(reg.registrationType)),
        amount: Number(reg.registrationFee ?? 0),
        paymentId: reg.razorpayPaymentId ?? reg.transactionId ?? undefined,
        transactionDate: reg.updatedAt.toISOString(),
      },
      qrPng
    );

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
