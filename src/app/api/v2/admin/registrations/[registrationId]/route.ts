import { NextRequest } from "next/server";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import {
  getRegistrationForAdminView,
  updateRegistrationByPublicId,
  type BulkStatusField,
} from "@/server/services/registration.service";
import { getAdminActorUid } from "@/server/lib/admin-rbac";
import { ServiceError } from "@/server/lib/errors";
import { REG_ID_RE } from "@/lib/security/registration-lookup";
import {
  ADMIN_REGISTRATION_PUBLIC_ID_RE,
  ADMIN_REGISTRATION_UUID_RE,
} from "@/lib/admin/registration-id";
import { writeAuditLog } from "@/server/services/audit.service";
import type { AdminRegistrationView } from "@/lib/admin/registration-detail-types";

const UUID_RE = ADMIN_REGISTRATION_UUID_RE;

const ALLOWED_FIELDS: BulkStatusField[] = [
  "registrationStatus",
  "paymentStatus",
  "accommodationStatus",
];

function resolvePublicIdForPatch(idParam: string, row: AdminRegistrationView): string {
  if (REG_ID_RE.test(idParam)) return idParam;
  const publicId = row.registrationId;
  if (typeof publicId === "string" && REG_ID_RE.test(publicId)) return publicId;
  throw new ServiceError("Invalid registration ID", 400, "INVALID_ID");
}

export const GET = createApiHandler(
  async (request: NextRequest, context: { params: Promise<{ registrationId: string }> }) => {
    const { registrationId } = await context.params;

    if (!REG_ID_RE.test(registrationId) && !UUID_RE.test(registrationId)) {
      throw new ServiceError("Invalid registration ID", 400, "INVALID_ID");
    }

    const row = await getRegistrationForAdminView(registrationId);
    if (!row) {
      throw new ServiceError("Registration not found", 404, "NOT_FOUND");
    }

    await writeAuditLog({
      action: "admin_action",
      entityType: "registrations",
      entityId: row.id,
      registrationId: row.id,
      actorUserId: getAdminActorUid(request),
      payload: { event: "registration_viewed", publicId: row.registrationId },
    });

    return { registration: row };
  },
  { requireAdmin: true, adminResource: "registrations", rateLimitKey: "v2-admin-registration-detail", limit: 120 }
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
      body.value,
      { actorUserId: getAdminActorUid(request) }
    );
  },
  { requireAdmin: true, adminResource: "registrations", rateLimitKey: "v2-admin-registration-patch", limit: 60 }
);
