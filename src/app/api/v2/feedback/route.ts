import { NextRequest } from "next/server";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { getRequestContext } from "@/server/lib/request";
import { submitFeedback } from "@/server/services/feedback.service";
import { ServiceError } from "@/server/lib/errors";

export const POST = createApiHandler(
  async (request: NextRequest) => {
    const body = assertBody<{
      fullName?: string;
      email?: string;
      rating?: number;
      category?: string;
      message?: string;
    }>(await request.json());

    if (!body.message?.trim()) throw new ServiceError("Message is required", 400);

    const ctx = getRequestContext(request);
    const row = await submitFeedback({
      fullName: body.fullName,
      email: body.email,
      rating: body.rating,
      category: body.category,
      message: body.message,
      submittedIp: ctx.ip,
    });

    return { success: true, id: row.id };
  },
  { rateLimitKey: "v2-feedback", limit: 5 }
);
