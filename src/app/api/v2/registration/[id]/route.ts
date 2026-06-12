import { NextRequest } from "next/server";
import { createApiHandler } from "@/server/lib/api-handler";
import { getPublicRegistrationSummary } from "@/server/services/registration.service";
import { ServiceError } from "@/server/lib/errors";
import {
  REG_ID_RE,
  verifyRegistrationLookupToken,
} from "@/lib/security/registration-lookup";

export const GET = createApiHandler(
  async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;

    if (!REG_ID_RE.test(id)) {
      throw new ServiceError("Invalid registration ID", 400, "INVALID_ID");
    }

    const token = request.nextUrl.searchParams.get("token")?.trim();
    const emailParam = request.nextUrl.searchParams.get("email")?.trim();

    let email: string | null = null;
    if (token) {
      const verified = verifyRegistrationLookupToken(id, token);
      email = verified?.email ?? null;
    } else if (emailParam) {
      email = emailParam;
    }

    if (!email) {
      throw new ServiceError(
        "Email or confirmation token required",
        401,
        "AUTH_REQUIRED"
      );
    }

    const summary = await getPublicRegistrationSummary(id, email);
    if (!summary) {
      throw new ServiceError("Registration not found", 404, "NOT_FOUND");
    }

    return { success: true, registration: summary };
  },
  { rateLimitKey: "v2-registration-lookup", limit: 10 }
);
