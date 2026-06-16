import { NextRequest } from "next/server";
import { createApiHandler } from "@/server/lib/api-handler";
import { ServiceError } from "@/server/lib/errors";

/** Disabled — registration emails are sent only via submit → sendRegistrationCompleteEmail() */
export const POST = createApiHandler(
  async (_request: NextRequest) => {
    throw new ServiceError(
      "This endpoint is disabled. Registration emails are sent automatically on submit.",
      410,
      "EMAIL_PATH_DISABLED"
    );
  },
  { rateLimitKey: "v2-registration-email", limit: 10 }
);
