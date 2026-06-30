import { NextRequest } from "next/server";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import {
  listVolunteers,
  assignVolunteer,
  markVolunteerAttendance,
  generateVolunteerRoster,
} from "@/server/services/ops/volunteer-ops.service";
import { ServiceError } from "@/server/lib/errors";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    if (searchParams.get("roster") === "1") {
      return generateVolunteerRoster(searchParams.get("department") ?? undefined);
    }
    return listVolunteers({
      limit: Number(searchParams.get("limit") ?? 50),
      offset: Number(searchParams.get("offset") ?? 0),
      department: searchParams.get("department") ?? undefined,
    });
  },
  { requireAdmin: true, rateLimitKey: "admin-volunteers", limit: 60 }
);

export const POST = createApiHandler(
  async (request: NextRequest) => {
    const body = assertBody<{
      action?: string;
      registrationId?: string;
      department?: string;
      shiftStart?: string;
      shiftEnd?: string;
      supervisorName?: string;
      supervisorPhone?: string;
      notes?: string;
    }>(await request.json());

    if (body.action === "attendance" && body.registrationId) {
      return markVolunteerAttendance(body.registrationId);
    }

    if (!body.registrationId || !body.department) {
      throw new ServiceError("registrationId and department required", 400, "INVALID_BODY");
    }
    return assignVolunteer({
      registrationId: body.registrationId,
      department: body.department,
      shiftStart: body.shiftStart,
      shiftEnd: body.shiftEnd,
      supervisorName: body.supervisorName,
      supervisorPhone: body.supervisorPhone,
      notes: body.notes,
    });
  },
  { requireAdmin: true, rateLimitKey: "admin-volunteers-action", limit: 30 }
);
