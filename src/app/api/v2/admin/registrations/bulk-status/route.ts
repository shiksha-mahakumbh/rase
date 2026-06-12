import { NextRequest } from "next/server";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import {
  updateRegistrationsBulk,
  type BulkStatusField,
} from "@/server/services/registration.service";
import { ServiceError } from "@/server/lib/errors";

const ALLOWED_FIELDS: BulkStatusField[] = [
  "registrationStatus",
  "paymentStatus",
  "accommodationStatus",
];

export const POST = createApiHandler(
  async (request: NextRequest) => {
    const body = assertBody<{
      ids?: string[];
      field?: string;
      value?: string;
    }>(await request.json());

    if (!Array.isArray(body.ids) || !body.ids.length) {
      throw new ServiceError("ids array is required", 400, "INVALID_IDS");
    }
    if (!body.field || !ALLOWED_FIELDS.includes(body.field as BulkStatusField)) {
      throw new ServiceError("Invalid status field", 400, "INVALID_FIELD");
    }
    if (!body.value?.trim()) {
      throw new ServiceError("value is required", 400, "INVALID_VALUE");
    }

    return updateRegistrationsBulk(
      body.ids,
      body.field as BulkStatusField,
      body.value
    );
  },
  { requireAdmin: true, rateLimitKey: "v2-admin-registrations-bulk", limit: 30 }
);
