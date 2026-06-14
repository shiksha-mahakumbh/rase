import { NextRequest } from "next/server";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import {
  listAccommodationWithRooms,
  allocateRoom,
  updateAccommodationRequestStatus,
} from "@/server/services/lifecycle/accommodation-lifecycle.service";
import type { AccommodationStatus } from "@prisma/client";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    return listAccommodationWithRooms({
      limit: Number(searchParams.get("limit") ?? 25),
      offset: Number(searchParams.get("offset") ?? 0),
      status: (searchParams.get("status") as AccommodationStatus) ?? undefined,
    });
  },
  { requireAdmin: true, rateLimitKey: "admin-accommodation", limit: 60 }
);

export const POST = createApiHandler(
  async (request: NextRequest) => {
    const body = assertBody<{
      action?: string;
      requestId?: string;
      roomId?: string;
      checkInDate?: string;
      checkOutDate?: string;
      status?: AccommodationStatus;
      notes?: string;
    }>(await request.json());

    if (body.action === "allocate") {
      if (!body.requestId || !body.roomId) throw new Error("requestId and roomId required");
      return allocateRoom({
        requestId: body.requestId,
        roomId: body.roomId,
        checkInDate: body.checkInDate,
        checkOutDate: body.checkOutDate,
        sendEmail: true,
      });
    }

    if (body.action === "update-status") {
      if (!body.requestId || !body.status) throw new Error("requestId and status required");
      return updateAccommodationRequestStatus(body.requestId, body.status, body.notes);
    }

    throw new Error("Unknown action");
  },
  { requireAdmin: true, rateLimitKey: "admin-accommodation-action", limit: 30 }
);
