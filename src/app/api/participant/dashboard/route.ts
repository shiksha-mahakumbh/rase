import { NextRequest, NextResponse } from "next/server";
import { getClientIp, rateLimitAsync } from "@/lib/security/rateLimit";
import { verifyRecaptchaToken } from "@/lib/security/recaptcha";
import { verifyParticipantCredentials } from "@/lib/security/participant-auth";
import { createRegistrationLookupToken } from "@/lib/security/registration-lookup";
import {
  getParticipantDashboard,
  updateParticipantProfile,
} from "@/server/services/ops/alumni.service";
import { toErrorResponse } from "@/server/lib/errors";

async function authorizeParticipant(
  body: {
    registrationId?: string;
    email?: string;
    lookupToken?: string;
    token?: string;
    captchaToken?: string;
  },
  options?: { requireCaptchaWithoutToken?: boolean }
) {
  const registrationId = String(body.registrationId ?? "").trim();
  const email = String(body.email ?? "").trim();
  const lookupToken = String(body.lookupToken ?? body.token ?? "").trim();

  let captchaVerified = false;
  if (!lookupToken && options?.requireCaptchaWithoutToken) {
    const captcha = await verifyRecaptchaToken(body.captchaToken, "participant_dashboard");
    if (!captcha.ok) {
      return { ok: false as const, status: 403, error: captcha.error ?? "Captcha verification failed" };
    }
    captchaVerified = true;
  }

  const auth = await verifyParticipantCredentials(registrationId, email, {
    lookupToken: lookupToken || undefined,
    captchaVerified,
  });
  if (!auth.ok) {
    return { ok: false as const, status: 401, error: "Unauthorized" };
  }

  return {
    ok: true as const,
    registrationId,
    email: auth.email,
    captchaVerified,
    hadLookupToken: Boolean(lookupToken),
  };
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = await rateLimitAsync({
    key: `participant-dashboard:${ip}`,
    limit: 20,
    windowMs: 60_000,
  });
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const auth = await authorizeParticipant(body, { requireCaptchaWithoutToken: true });
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const dashboard = await getParticipantDashboard(auth.registrationId, auth.email);
    if (!dashboard) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    const lookupToken =
      !auth.hadLookupToken && auth.captchaVerified
        ? createRegistrationLookupToken(auth.registrationId, auth.email)
        : undefined;

    return NextResponse.json({ ...dashboard, ...(lookupToken ? { lookupToken } : {}) });
  } catch (error) {
    const mapped = toErrorResponse(error);
    return NextResponse.json({ error: mapped.error }, { status: mapped.status });
  }
}

export async function PATCH(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = await rateLimitAsync({
    key: `participant-profile:${ip}`,
    limit: 10,
    windowMs: 60_000,
  });
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const auth = await authorizeParticipant(body);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const updated = await updateParticipantProfile(auth.registrationId, auth.email, {
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
