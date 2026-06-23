import { prisma } from "@/server/db/prisma";
import { getSupabaseAdmin } from "@/server/db/supabase";
import { ServiceError } from "@/server/lib/errors";
import type { AdminRole } from "@/types/registration";

const ADMIN_ROLE_NAMES: AdminRole[] = ["Super Admin", "Admin", "Data Entry"];

function getBootstrapEmails(): string[] {
  const raw = process.env.ADMIN_BOOTSTRAP_EMAILS ?? "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

function normalizeRoleName(name: string): AdminRole | null {
  if (ADMIN_ROLE_NAMES.includes(name as AdminRole)) {
    return name as AdminRole;
  }
  if (name === "Coordinator" || name === "Reviewer") {
    return "Data Entry";
  }
  return null;
}

export async function resolveAdminRoleForUser(
  authUserId: string,
  email: string
): Promise<AdminRole | null> {
  const normalizedEmail = email.toLowerCase();

  if (getBootstrapEmails().includes(normalizedEmail)) {
    await ensureBootstrapUser(authUserId, email, "Super Admin");
    return "Super Admin";
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ authUserId }, { email: normalizedEmail }],
      isActive: true,
      deletedAt: null,
    },
    include: {
      userRoles: {
        include: { role: true },
      },
    },
  });

  if (!user) return null;

  if (!user.authUserId) {
    await prisma.user.update({
      where: { id: user.id },
      data: { authUserId },
    });
  }

  for (const ur of user.userRoles) {
    const role = normalizeRoleName(ur.role.name);
    if (role) return role;
  }

  return null;
}

async function ensureBootstrapUser(
  authUserId: string,
  email: string,
  roleName: AdminRole
) {
  const role = await prisma.role.findFirst({
    where: { name: roleName },
  });
  if (!role) return;

  const user = await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    create: {
      email: email.toLowerCase(),
      authUserId,
      fullName: email.split("@")[0],
      isActive: true,
    },
    update: {
      authUserId,
      isActive: true,
      deletedAt: null,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: { userId: user.id, roleId: role.id },
    },
    create: { userId: user.id, roleId: role.id },
    update: {},
  });
}

export async function verifySupabaseAccessToken(accessToken: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user?.email) {
    throw new ServiceError("Invalid token", 401, "UNAUTHORIZED");
  }
  return {
    uid: data.user.id,
    email: data.user.email,
  };
}

export async function signInWithEmailPassword(email: string, password: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new ServiceError("Auth not configured", 503, "AUTH_NOT_CONFIGURED");
  }

  const { createClient } = await import("@supabase/supabase-js");
  const client = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await client.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error || !data.session?.access_token || !data.user?.email) {
    throw new ServiceError("Invalid credentials", 401, "INVALID_CREDENTIALS");
  }

  const role = await resolveAdminRoleForUser(data.user.id, data.user.email);
  if (!role) {
    throw new ServiceError("Forbidden", 403, "FORBIDDEN");
  }

  await prisma.user.updateMany({
    where: { authUserId: data.user.id },
    data: { lastLoginAt: new Date() },
  });

  return {
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    uid: data.user.id,
    email: data.user.email,
    role,
  };
}

export type AdminSessionPayload = {
  uid: string;
  email: string;
  role: AdminRole;
};
