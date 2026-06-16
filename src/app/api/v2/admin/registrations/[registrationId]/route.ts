import { NextRequest } from "next/server";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import {
  getRegistrationForAdminView,
  updateRegistrationByPublicId,
  type BulkStatusField,
} from "@/server/services/registration.service";
import { ServiceError } from "@/server/lib/errors";
import { REG_ID_RE } from "@/lib/security/registration-lookup";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const ALLOWED_FIELDS: BulkStatusField[] = [
  "registrationStatus",
  "paymentStatus",
  "accommodationStatus",
];

function resolvePublicIdForPatch(idParam: string, row: Record<string, unknown>): string {
  if (REG_ID_RE.test(idParam)) return idParam;
  const publicId = row.registrationId;
  if (typeof publicId === "string" && REG_ID_RE.test(publicId)) return publicId;
  throw new ServiceError("Invalid registration ID", 400, "INVALID_ID");
}

export const GET = createApiHandler(
  async (_request: NextRequest, context: { params: Promise<{ registrationId: string }> }) => {
    const { registrationId } = await context.params;
    console.info("ADMIN_VIEW_REQUEST", { registrationId });

    if (!REG_ID_RE.test(registrationId) && !UUID_RE.test(registrationId)) {
      console.error("ADMIN_VIEW_FAILED", {
        registrationId,
        error: "Invalid ID format",
      });
      throw new ServiceError("Invalid registration ID", 400, "INVALID_ID");
    }

    const row = await getRegistrationForAdminView(registrationId);
    if (!row) {
      console.error("ADMIN_VIEW_FAILED", {
        registrationId,
        error: "Registration not found",
      });
      throw new ServiceError("Registration not found", 404, "NOT_FOUND");
    }

    console.info("ADMIN_VIEW_SUCCESS", {
      registrationId: row.registrationId,
      uuid: row.id,
    });

    return { registration: row };
  },
  { requireAdmin: true, rateLimitKey: "v2-admin-registration-detail", limit: 120 }
);

export const PATCH = createApiHandler(
  async (request: NextRequest, context: { params: Promise<{ registrationId: string }> }) => {
    const { registrationId } = await context.params;

    if (!REG_ID_RE.test(registrationId) && !UUID_RE.test(registrationId)) {
      throw new ServiceError("Invalid registration ID", 400, "INVALID_ID");
    }

    const existing = await getRegistrationForAdminView(registrationId);
    if (!existing) {
      throw new ServiceError("Registration not found", 404, "NOT_FOUND");
    }

    const publicId = resolvePublicIdForPatch(registrationId, existing);

    const body = assertBody<{ field?: string; value?: string }>(await request.json());
    if (!body.field || !ALLOWED_FIELDS.includes(body.field as BulkStatusField)) {
      throw new ServiceError("Invalid status field", 400, "INVALID_FIELD");
    }
    if (!body.value?.trim()) {
      throw new ServiceError("value is required", 400, "INVALID_VALUE");
    }

    return updateRegistrationByPublicId(
      publicId,
      body.field as BulkStatusField,
      body.value
    );
  },
  { requireAdmin: true, rateLimitKey: "v2-admin-registration-patch", limit: 60 }
);
