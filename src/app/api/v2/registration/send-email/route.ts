import { NextRequest } from "next/server";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { sendRegistrationConfirmation } from "@/server/services/email.service";
import { ServiceError } from "@/server/lib/errors";

export const POST = createApiHandler(
  async (request: NextRequest) => {
    const body = assertBody<{
      registrationId?: string;
      fullName?: string;
      email?: string;
    }>(await request.json());

    if (!body.registrationId || !body.fullName || !body.email) {
      throw new ServiceError("Missing required fields", 400);
    }

    const log = await sendRegistrationConfirmation({
      registrationId: body.registrationId,
      fullName: body.fullName,
      email: body.email,
    });

    return { success: true, emailStatus: log?.status ?? "queued" };
  },
  { rateLimitKey: "v2-registration-email", limit: 10 }
);
