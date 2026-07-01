import { prisma } from "@/server/db/prisma";
import { getSupabaseAdmin } from "@/server/db/supabase";
import { ServiceError } from "@/server/lib/errors";
import type { AdminRole } from "@/types/registration";

const ADMIN_ROLE_NAMES: AdminRole[] = [
  "Super Admin",
  "Admin",
  "Data Entry",
  "Coordinator",
];

const ROLE_PRIORITY: Record<AdminRole, number> = {
  "Super Admin": 0,
  Admin: 1,
  "Data Entry": 2,
  Coordinator: 3,
};

function pickHighestAdminRole(roles: AdminRole[]): AdminRole | null {
  let best: AdminRole | null = null;
  let bestPriority = Infinity;
  for (const role of roles) {
    const priority = ROLE_PRIORITY[role];
    if (priority < bestPriority) {
      best = role;
      bestPriority = priority;
    }
  }
  return best;
}

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
  if (name === "Reviewer") {
    return "Coordinator";
  }
  return null;
}

export type AdminSessionContext = {
  uid: string;
  email: string;
  role: AdminRole;
  sessionVersion: number;
};

export async function bumpAdminSessionVersion(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { sessionVersion: { increment: 1 } },
  });
}

export async function resolveAdminSessionForUser(
  authUserId: string,
  email: string
): Promise<AdminSessionContext | null> {
  const normalizedEmail = email.toLowerCase();

  if (getBootstrapEmails().includes(normalizedEmail)) {
    await ensureBootstrapUser(authUserId, email, "Super Admin");
    console.warn(
      `[auth] Bootstrap Super Admin login: ${normalizedEmail} (ADMIN_BOOTSTRAP_EMAILS)`
    );
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

  const roles: AdminRole[] = [];
  for (const ur of user.userRoles) {
    const role = normalizeRoleName(ur.role.name);
    if (role) roles.push(role);
  }

  const role = pickHighestAdminRole(roles);
  if (!role) return null;

  return {
    uid: authUserId,
    email: user.email,
    role,
    sessionVersion: user.sessionVersion,
  };
}

export async function resolveAdminRoleForUser(
  authUserId: string,
  email: string
): Promise<AdminRole | null> {
  const session = await resolveAdminSessionForUser(authUserId, email);
  return session?.role ?? null;
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

  const session = await resolveAdminSessionForUser(data.user.id, data.user.email);
  if (!session) {
    throw new ServiceError("Forbidden", 403, "FORBIDDEN");
  }

  await prisma.user.updateMany({
    where: { authUserId: data.user.id },
    data: { lastLoginAt: new Date() },
  });

  return {
    uid: session.uid,
    email: session.email,
    role: session.role,
    sessionVersion: session.sessionVersion,
  };
}

export type AdminSessionPayload = {
  uid: string;
  email: string;
  role: AdminRole;
  sessionVersion: number;
};
