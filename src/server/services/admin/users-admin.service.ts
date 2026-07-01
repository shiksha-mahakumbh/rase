import { prisma } from "@/server/db/prisma";
import { ServiceError } from "@/server/lib/errors";
import type { AdminRole } from "@/types/registration";
import { invalidatePermissionCache } from "@/server/services/permission.service";

const ASSIGNABLE_ROLES: AdminRole[] = [
  "Super Admin",
  "Admin",
  "Data Entry",
  "Coordinator",
];

export type AdminUserListItem = {
  id: string;
  email: string;
  fullName: string | null;
  isActive: boolean;
  roles: AdminRole[];
  lastLoginAt: string | null;
  createdAt: string;
};

export async function listAdminUsers(options: {
  limit?: number;
  offset?: number;
  search?: string;
}): Promise<{ users: AdminUserListItem[]; total: number }> {
  const limit = Math.min(options.limit ?? 25, 100);
  const offset = options.offset ?? 0;
  const search = options.search?.trim();

  const where = {
    deletedAt: null as Date | null,
    ...(search
      ? {
          OR: [
            { email: { contains: search, mode: "insensitive" as const } },
            { fullName: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [rows, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: { userRoles: { include: { role: true } } },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    total,
    users: rows.map((user) => ({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      isActive: user.isActive,
      roles: user.userRoles
        .map((ur) => ur.role.name as AdminRole)
        .filter((name) => ASSIGNABLE_ROLES.includes(name)),
      lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
      createdAt: user.createdAt.toISOString(),
    })),
  };
}

export async function updateAdminUser(
  userId: string,
  data: {
    isActive?: boolean;
    fullName?: string;
    roleNames?: AdminRole[];
  }
): Promise<AdminUserListItem> {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    include: { userRoles: { include: { role: true } } },
  });
  if (!user) {
    throw new ServiceError("User not found", 404, "NOT_FOUND");
  }

  if (data.isActive !== undefined || data.fullName !== undefined) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
        ...(data.fullName !== undefined ? { fullName: data.fullName } : {}),
      },
    });
  }

  if (data.roleNames?.length) {
    for (const name of data.roleNames) {
      if (!ASSIGNABLE_ROLES.includes(name)) {
        throw new ServiceError(`Invalid role: ${name}`, 400, "INVALID_ROLE");
      }
    }

    const roles = await prisma.role.findMany({
      where: { name: { in: data.roleNames }, deletedAt: null },
    });
    if (roles.length !== data.roleNames.length) {
      throw new ServiceError("One or more roles not found", 400, "INVALID_ROLE");
    }

    await prisma.$transaction([
      prisma.userRole.deleteMany({ where: { userId } }),
      prisma.userRole.createMany({
        data: roles.map((role) => ({ userId, roleId: role.id })),
      }),
    ]);
    invalidatePermissionCache();
  }

  const updated = await prisma.user.findFirstOrThrow({
    where: { id: userId },
    include: { userRoles: { include: { role: true } } },
  });

  return {
    id: updated.id,
    email: updated.email,
    fullName: updated.fullName,
    isActive: updated.isActive,
    roles: updated.userRoles
      .map((ur) => ur.role.name as AdminRole)
      .filter((name) => ASSIGNABLE_ROLES.includes(name)),
    lastLoginAt: updated.lastLoginAt?.toISOString() ?? null,
    createdAt: updated.createdAt.toISOString(),
  };
}

export async function provisionAdminUser(data: {
  email: string;
  fullName?: string;
  roleNames: AdminRole[];
}): Promise<AdminUserListItem> {
  const email = data.email.trim().toLowerCase();
  if (!email) {
    throw new ServiceError("email is required", 400, "INVALID_EMAIL");
  }
  if (!data.roleNames.length) {
    throw new ServiceError("At least one role is required", 400, "INVALID_ROLE");
  }

  for (const name of data.roleNames) {
    if (!ASSIGNABLE_ROLES.includes(name)) {
      throw new ServiceError(`Invalid role: ${name}`, 400, "INVALID_ROLE");
    }
  }

  const roles = await prisma.role.findMany({
    where: { name: { in: data.roleNames }, deletedAt: null },
  });
  if (roles.length !== data.roleNames.length) {
    throw new ServiceError("One or more roles not found", 400, "INVALID_ROLE");
  }

  const user = await prisma.user.upsert({
    where: { email },
    create: {
      email,
      fullName: data.fullName ?? email.split("@")[0],
      isActive: true,
    },
    update: {
      fullName: data.fullName ?? undefined,
      isActive: true,
      deletedAt: null,
    },
  });

  await prisma.$transaction([
    prisma.userRole.deleteMany({ where: { userId: user.id } }),
    prisma.userRole.createMany({
      data: roles.map((role) => ({ userId: user.id, roleId: role.id })),
    }),
  ]);
  invalidatePermissionCache();

  return updateAdminUser(user.id, {});
}
