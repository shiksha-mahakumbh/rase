import { NextRequest } from "next/server";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import {
  listAdminUsers,
  provisionAdminUser,
  updateAdminUser,
} from "@/server/services/admin/users-admin.service";
import type { AdminRole } from "@/types/registration";
import { ServiceError } from "@/server/lib/errors";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    return listAdminUsers({
      limit: Number(searchParams.get("limit") ?? 25),
      offset: Number(searchParams.get("offset") ?? 0),
      search: searchParams.get("search") ?? undefined,
    });
  },
  { requireAdmin: true, adminResource: "users", rateLimitKey: "admin-users-list", limit: 60 }
);

export const POST = createApiHandler(
  async (request: NextRequest) => {
    const body = assertBody<{
      email?: string;
      fullName?: string;
      roleNames?: AdminRole[];
    }>(await request.json());

    if (!body.email?.trim()) {
      throw new ServiceError("email is required", 400, "INVALID_EMAIL");
    }
    if (!Array.isArray(body.roleNames) || !body.roleNames.length) {
      throw new ServiceError("roleNames is required", 400, "INVALID_ROLE");
    }

    const user = await provisionAdminUser({
      email: body.email,
      fullName: body.fullName,
      roleNames: body.roleNames,
    });
    return { success: true, user };
  },
  { requireAdmin: true, adminResource: "users", rateLimitKey: "admin-users-create", limit: 20 }
);
