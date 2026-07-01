import { prisma } from "@/server/db/prisma";
import type { AdminRole } from "@/types/registration";
import {
  FALLBACK_ROLE_PERMISSIONS,
  type PermissionSlug,
} from "@/lib/permissions";

const CACHE_TTL_MS = 5 * 60 * 1000;

let cache: { loadedAt: number; byRole: Map<string, Set<PermissionSlug>> } | null =
  null;

async function loadPermissionCache(): Promise<Map<string, Set<PermissionSlug>>> {
  const now = Date.now();
  if (cache && now - cache.loadedAt < CACHE_TTL_MS) {
    return cache.byRole;
  }

  try {
    const rows = await prisma.role.findMany({
      where: { deletedAt: null },
      select: {
        name: true,
        rolePermissions: {
          select: { permission: { select: { slug: true } } },
        },
      },
    });

    const byRole = new Map<string, Set<PermissionSlug>>();
    for (const row of rows) {
      const slugs = row.rolePermissions
        .map((rp) => rp.permission.slug as PermissionSlug)
        .filter(Boolean);
      byRole.set(row.name, new Set(slugs));
    }

    cache = { loadedAt: now, byRole };
    return byRole;
  } catch {
    const byRole = new Map<string, Set<PermissionSlug>>();
    for (const [roleName, slugs] of Object.entries(FALLBACK_ROLE_PERMISSIONS)) {
      byRole.set(roleName, new Set(slugs));
    }
    cache = { loadedAt: now, byRole };
    return byRole;
  }
}

export async function getPermissionsForRole(
  role: AdminRole
): Promise<Set<PermissionSlug>> {
  const byRole = await loadPermissionCache();
  const fromDb = byRole.get(role);
  if (fromDb?.size) return fromDb;

  const fallback = FALLBACK_ROLE_PERMISSIONS[role];
  return new Set(fallback ?? []);
}

export async function roleHasPermission(
  role: AdminRole,
  slug: PermissionSlug
): Promise<boolean> {
  const perms = await getPermissionsForRole(role);
  return perms.has(slug);
}

export function invalidatePermissionCache(): void {
  cache = null;
}
