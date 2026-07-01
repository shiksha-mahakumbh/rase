import { NextRequest } from "next/server";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { handlePublicRegistrationLookupPost } from "@/server/lib/registration-lookup-handler";

export const POST = createApiHandler(
  async (request: NextRequest) => {
    const body = assertBody<{
      registrationId?: string;
      email?: string;
      token?: string;
      lookupToken?: string;
      captchaToken?: string;
    }>(await request.json());

    const registration = await handlePublicRegistrationLookupPost(body);
    return { success: true, registration };
  },
  { rateLimitKey: "v2-registration-lookup-post", limit: 10 }
);
