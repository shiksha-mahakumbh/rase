import { NextRequest } from "next/server";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import {
  getRegistrationByPublicId,
  updateRegistrationByPublicId,
  type BulkStatusField,
} from "@/server/services/registration.service";
import { ServiceError } from "@/server/lib/errors";
import { REG_ID_RE } from "@/lib/security/registration-lookup";

const ALLOWED_FIELDS: BulkStatusField[] = [
  "registrationStatus",
  "paymentStatus",
  "accommodationStatus",
];

export const GET = createApiHandler(
  async (_request: NextRequest, context: { params: Promise<{ registrationId: string }> }) => {
    const { registrationId } = await context.params;
    if (!REG_ID_RE.test(registrationId)) {
      throw new ServiceError("Invalid registration ID", 400, "INVALID_ID");
    }
    const row = await getRegistrationByPublicId(registrationId);
    if (!row) {
      throw new ServiceError("Registration not found", 404, "NOT_FOUND");
    }
    return { registration: row };
  },
  { requireAdmin: true, rateLimitKey: "v2-admin-registration-detail", limit: 120 }
);

export const PATCH = createApiHandler(
  async (request: NextRequest, context: { params: Promise<{ registrationId: string }> }) => {
    const { registrationId } = await context.params;
    if (!REG_ID_RE.test(registrationId)) {
      throw new ServiceError("Invalid registration ID", 400, "INVALID_ID");
    }

    const body = assertBody<{ field?: string; value?: string }>(await request.json());
    if (!body.field || !ALLOWED_FIELDS.includes(body.field as BulkStatusField)) {
      throw new ServiceError("Invalid status field", 400, "INVALID_FIELD");
    }
    if (!body.value?.trim()) {
      throw new ServiceError("value is required", 400, "INVALID_VALUE");
    }

    return updateRegistrationByPublicId(
      registrationId,
      body.field as BulkStatusField,
      body.value
    );
  },
  { requireAdmin: true, rateLimitKey: "v2-admin-registration-patch", limit: 60 }
);
