import { NextRequest } from "next/server";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { ServiceError } from "@/server/lib/errors";
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
  { requireAdmin: true, adminResource: "registrations", rateLimitKey: "admin-accommodation", limit: 60 }
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
      if (!body.requestId || !body.roomId) throw new ServiceError("requestId and roomId required", 400, "INVALID_BODY");
      return allocateRoom({
        requestId: body.requestId,
        roomId: body.roomId,
        checkInDate: body.checkInDate,
        checkOutDate: body.checkOutDate,
        sendEmail: true,
      });
    }

    if (body.action === "update-status") {
      if (!body.requestId || !body.status) throw new ServiceError("requestId and status required", 400, "INVALID_BODY");
      return updateAccommodationRequestStatus(body.requestId, body.status, body.notes);
    }

    throw new ServiceError("Unknown action", 400, "INVALID_ACTION");
  },
  { requireAdmin: true, adminResource: "registrations", rateLimitKey: "admin-accommodation-action", limit: 30 }
);
