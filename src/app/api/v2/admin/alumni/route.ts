import { NextRequest } from "next/server";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { ServiceError } from "@/server/lib/errors";
import {
  listAlumni,
  convertAttendeesToAlumni,
  updateAlumni,
} from "@/server/services/ops/alumni.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    return listAlumni({
      limit: Number(searchParams.get("limit") ?? 50),
      offset: Number(searchParams.get("offset") ?? 0),
      state: searchParams.get("state") ?? undefined,
      eventEdition: searchParams.get("edition") ?? undefined,
      search: searchParams.get("search") ?? undefined,
    });
  },
  { requireAdmin: true, rateLimitKey: "admin-alumni", limit: 60 }
);

export const POST = createApiHandler(
  async (request: NextRequest) => {
    const body = assertBody<{
      action?: string;
      eventEdition?: string;
      registrationIds?: string[];
      id?: string;
      interests?: string[];
      researchAreas?: string[];
      state?: string;
    }>(await request.json());

    if (body.action === "convert") {
      return convertAttendeesToAlumni({
        eventEdition: body.eventEdition,
        registrationIds: body.registrationIds,
      });
    }

    if (body.action === "update" && body.id) {
      return updateAlumni(body.id, {
        interests: body.interests,
        researchAreas: body.researchAreas,
        state: body.state,
      });
    }

    throw new ServiceError("Unknown action", 400, "INVALID_ACTION");
  },
  { requireAdmin: true, rateLimitKey: "admin-alumni-action", limit: 10 }
);
