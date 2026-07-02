import { NextRequest } from "next/server";
import { createApiHandler } from "@/server/lib/api-handler";
import { getRequestContext } from "@/server/lib/request";
import { createRegistrationProofToken } from "@/lib/security/registration-proof";
import { createUploadToken } from "@/lib/security/upload-token";

/** First-party anti-abuse token — no third-party scripts (works with ad blockers). */
export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { assertSameOrigin } = await import("@/server/lib/same-origin");
    assertSameOrigin(request);

    const ctx = getRequestContext(request);
    return {
      proofToken: createRegistrationProofToken(ctx.ip ?? undefined),
      uploadToken: createUploadToken(),
      issuedAt: Date.now(),
    };
  },
  { rateLimitKey: "v2-registration-proof", limit: 40 }
);
