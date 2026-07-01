import { NextRequest } from "next/server";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { getAdminActorUid } from "@/server/lib/admin-rbac";
import { ServiceError } from "@/server/lib/errors";
import {
  lookupAttendeeForCheckIn,
  performCheckInAction,
  listRecentCheckIns,
} from "@/server/services/lifecycle/checkin.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    if (searchParams.get("recent") === "1") {
      return { items: await listRecentCheckIns() };
    }

    const id = searchParams.get("id");
    if (!id?.trim()) {
      throw new ServiceError("id query param required", 400, "MISSING_ID");
    }
    return lookupAttendeeForCheckIn(id);
  },
  { requireAdmin: true, adminResource: "registrations", rateLimitKey: "admin-checkin-lookup", limit: 180 }
);

export const POST = createApiHandler(
  async (request: NextRequest) => {
    const body = assertBody<{
      registrationId?: string;
      action?: "check_in" | "kit" | "certificate_eligible" | "session";
      sessionName?: string;
      location?: string;
    }>(await request.json());

    if (!body.registrationId?.trim() || !body.action) {
      throw new ServiceError("registrationId and action required", 400, "INVALID_BODY");
    }

    const actorUserId = getAdminActorUid(request);

    return performCheckInAction({
      registrationId: body.registrationId,
      action: body.action,
      sessionName: body.sessionName,
      location: body.location,
      actorUserId: actorUserId ?? undefined,
    });
  },
  { requireAdmin: true, adminResource: "registrations", mutationPermission: "registrations.update", rateLimitKey: "admin-checkin-action", limit: 120 }
);
