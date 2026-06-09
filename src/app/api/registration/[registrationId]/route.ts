import { NextRequest, NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase-admin";
import { getClientIp, rateLimit } from "@/lib/security/rateLimit";

const REG_ID_RE = /^SMK2026-\d{6}$/;

type RouteContext = {
  params: Promise<{ registrationId: string }>;
};

function toIsoString(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object" && value !== null && "toDate" in value) {
    const maybeDate = (value as { toDate?: () => Date }).toDate?.();
    if (maybeDate instanceof Date) return maybeDate.toISOString();
  }
  return null;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { registrationId } = await context.params;

  const ip = getClientIp(request);
  const limited = rateLimit({
    key: `registration-lookup:${ip}`,
    limit: 60,
    windowMs: 60_000,
  });

  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } }
    );
  }

  if (!REG_ID_RE.test(registrationId)) {
    return NextResponse.json({ error: "Invalid registration ID" }, { status: 400 });
  }

  try {
    const db = getAdminFirestore();
    const snap = await db
      .collection("registrations")
      .where("registrationId", "==", registrationId)
      .limit(1)
      .get();

    if (snap.empty) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    const data = snap.docs[0]!.data();

    return NextResponse.json({
      registrationId: data.registrationId,
      registrationType: data.registrationType,
      fullName: data.fullName,
      institution: data.institution,
      email: data.email,
      contactNumber: data.contactNumber,
      paymentStatus: data.paymentStatus,
      accommodationRequired: data.accommodationRequired,
      accommodationStatus: data.accommodationStatus,
      createdAt: toIsoString(data.createdAt),
    });
  } catch (error) {
    console.error("registration lookup error:", error);
    return NextResponse.json(
      { error: "Unable to load registration" },
      { status: 500 }
    );
  }
}
