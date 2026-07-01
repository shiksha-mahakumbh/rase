import { NextRequest } from "next/server";
import type { HonorariumStatus } from "@prisma/client";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import {
  listSpeakerOperations,
  upsertSpeakerOperations,
  generateSpeakerSchedule,
} from "@/server/services/ops/speaker-ops.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    if (searchParams.get("schedule") === "1") return generateSpeakerSchedule();
    return listSpeakerOperations({
      limit: Number(searchParams.get("limit") ?? 50),
      offset: Number(searchParams.get("offset") ?? 0),
    });
  },
  { requireAdmin: true, adminResource: "media", rateLimitKey: "admin-speaker-ops", limit: 60 }
);

export const POST = createApiHandler(
  async (request: NextRequest) => {
    const body = assertBody<{
      registrationId?: string;
      speakerProfileId?: string;
      eventSessionId?: string;
      travelStatus?: string;
      accommodationStatus?: string;
      honorariumStatus?: HonorariumStatus;
      honorariumAmount?: number;
      scheduleNotes?: string;
    }>(await request.json());
    return upsertSpeakerOperations(body);
  },
  { requireAdmin: true, adminResource: "media", rateLimitKey: "admin-speaker-ops-action", limit: 30 }
);
