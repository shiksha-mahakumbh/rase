import { NextRequest } from "next/server";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { ServiceError } from "@/server/lib/errors";
import {
  listAccommodationRooms,
  createAccommodationRoom,
} from "@/server/services/lifecycle/accommodation-lifecycle.service";

export const GET = createApiHandler(
  async () => listAccommodationRooms(),
  { requireAdmin: true, adminResource: "registrations" }
);

export const POST = createApiHandler(
  async (request: NextRequest) => {
    const body = assertBody<{
      building?: string;
      roomNumber?: string;
      bedNumber?: string;
      bedType?: string;
      capacity?: number;
    }>(await request.json());
    if (!body.building || !body.roomNumber) throw new ServiceError("building and roomNumber required", 400, "INVALID_BODY");
    return createAccommodationRoom({
      building: body.building,
      roomNumber: body.roomNumber,
      bedNumber: body.bedNumber,
      bedType: body.bedType,
      capacity: body.capacity,
    });
  },
  { requireAdmin: true, adminResource: "registrations", rateLimitKey: "admin-accommodation-rooms", limit: 30 }
);
