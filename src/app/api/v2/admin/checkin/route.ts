import { NextRequest } from "next/server";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import {
  lookupAttendeeForCheckIn,
  performCheckInAction,
} from "@/server/services/lifecycle/checkin.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) throw new Error("id query param required");
    return lookupAttendeeForCheckIn(id);
  },
  { requireAdmin: true, rateLimitKey: "admin-checkin-lookup", limit: 180 }
);

export const POST = createApiHandler(
  async (request: NextRequest) => {
    const body = assertBody<{
      registrationId?: string;
      action?: "check_in" | "kit" | "certificate_eligible" | "session";
      sessionName?: string;
      location?: string;
    }>(await request.json());

    if (!body.registrationId || !body.action) {
      throw new Error("registrationId and action required");
    }

    return performCheckInAction({
      registrationId: body.registrationId,
      action: body.action,
      sessionName: body.sessionName,
      location: body.location,
    });
  },
  { requireAdmin: true, rateLimitKey: "admin-checkin-action", limit: 120 }
);
