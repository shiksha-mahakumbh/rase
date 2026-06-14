import { NextRequest } from "next/server";
import type { EventSessionType } from "@prisma/client";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import {
  listEventSessions,
  createEventSession,
  updateEventSession,
  recordSessionAttendance,
} from "@/server/services/ops/session-ops.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    return listEventSessions({ activeOnly: searchParams.get("all") !== "1" });
  },
  { requireAdmin: true, rateLimitKey: "admin-sessions", limit: 60 }
);

export const POST = createApiHandler(
  async (request: NextRequest) => {
    const body = assertBody<{
      action?: string;
      id?: string;
      title?: string;
      sessionType?: EventSessionType;
      description?: string;
      venue?: string;
      capacity?: number;
      startAt?: string;
      endAt?: string;
      speakerName?: string;
      registrationId?: string;
      sessionId?: string;
      qrToken?: string;
      isActive?: boolean;
    }>(await request.json());

    if (body.action === "attendance") {
      if (!body.registrationId) throw new Error("registrationId required");
      return recordSessionAttendance({
        registrationId: body.registrationId,
        sessionId: body.sessionId,
        qrToken: body.qrToken,
      });
    }

    if (body.action === "update" && body.id) {
      return updateEventSession(body.id, body);
    }

    if (!body.title || !body.startAt || !body.endAt) {
      throw new Error("title, startAt, endAt required");
    }
    return createEventSession({
      title: body.title,
      sessionType: body.sessionType,
      description: body.description,
      venue: body.venue,
      capacity: body.capacity,
      startAt: body.startAt,
      endAt: body.endAt,
      speakerName: body.speakerName,
    });
  },
  { requireAdmin: true, rateLimitKey: "admin-sessions-action", limit: 30 }
);
