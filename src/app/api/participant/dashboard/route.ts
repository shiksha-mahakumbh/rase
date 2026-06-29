import { NextRequest, NextResponse } from "next/server";
import { getClientIp, rateLimitAsync } from "@/lib/security/rateLimit";
import { verifyParticipantCredentials } from "@/lib/security/participant-auth";
import {
  getParticipantDashboard,
  updateParticipantProfile,
} from "@/server/services/ops/alumni.service";
import { toErrorResponse } from "@/server/lib/errors";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = await rateLimitAsync({ key: `participant-dashboard:${ip}`, limit: 20, windowMs: 60_000 });
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const registrationId = String(body.registrationId ?? "").trim();
    const email = String(body.email ?? "").trim();
    const lookupToken = String(body.lookupToken ?? body.token ?? "").trim();

    const auth = await verifyParticipantCredentials(registrationId, email, lookupToken || undefined);
    if (!auth.ok) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dashboard = await getParticipantDashboard(registrationId, auth.email);
    if (!dashboard) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    return NextResponse.json(dashboard);
  } catch (error) {
    const mapped = toErrorResponse(error);
    return NextResponse.json({ error: mapped.error }, { status: mapped.status });
  }
}

export async function PATCH(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = await rateLimitAsync({ key: `participant-profile:${ip}`, limit: 10, windowMs: 60_000 });
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const registrationId = String(body.registrationId ?? "").trim();
    const email = String(body.email ?? "").trim();
    const lookupToken = String(body.lookupToken ?? body.token ?? "").trim();

    const auth = await verifyParticipantCredentials(registrationId, email, lookupToken || undefined);
    if (!auth.ok) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updated = await updateParticipantProfile(registrationId, auth.email, {
      contactNumber: body.contactNumber,
      whatsappNumber: body.whatsappNumber,
      address: body.address,
    });

    return NextResponse.json({ ok: true, contactNumber: updated.contactNumber });
  } catch (error) {
    const mapped = toErrorResponse(error);
    return NextResponse.json({ error: mapped.error }, { status: mapped.status });
  }
}
