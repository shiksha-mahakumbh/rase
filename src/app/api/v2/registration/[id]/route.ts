import { NextRequest } from "next/server";
import { createApiHandler } from "@/server/lib/api-handler";
import { handlePublicRegistrationLookup } from "@/server/lib/registration-lookup-handler";

export const GET = createApiHandler(
  async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const registration = await handlePublicRegistrationLookup(request, id);
    return { success: true, registration };
  },
  { rateLimitKey: "v2-registration-lookup", limit: 10 }
);
