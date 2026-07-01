import { NextRequest } from "next/server";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { updateAdminUser } from "@/server/services/admin/users-admin.service";
import type { AdminRole } from "@/types/registration";
import { ServiceError } from "@/server/lib/errors";

export const PATCH = createApiHandler(
  async (
    request: NextRequest,
    context: { params: Promise<{ userId: string }> }
  ) => {
    const { userId } = await context.params;
    const body = assertBody<{
      isActive?: boolean;
      fullName?: string;
      roleNames?: AdminRole[];
    }>(await request.json());

    if (
      body.isActive === undefined &&
      body.fullName === undefined &&
      !body.roleNames?.length
    ) {
      throw new ServiceError("No fields to update", 400, "INVALID_BODY");
    }

    const user = await updateAdminUser(userId, body);
    return { success: true, user };
  },
  { requireAdmin: true, adminResource: "users", rateLimitKey: "admin-users-patch", limit: 30 }
);
