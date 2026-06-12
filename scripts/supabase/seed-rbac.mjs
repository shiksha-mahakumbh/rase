#!/usr/bin/env node
/**
 * Seed RBAC roles, permissions, and registration counter via Prisma.
 * Usage: node scripts/supabase/seed-rbac.mjs
 * Requires: DATABASE_URL + DIRECT_URL in environment
 */
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const prisma = new PrismaClient();

const ROLES = [
  { id: "00000000-0000-4000-8000-000000000001", name: "Super Admin", slug: "super-admin", description: "Full platform access" },
  { id: "00000000-0000-4000-8000-000000000002", name: "Admin", slug: "admin", description: "Registration and content management" },
  { id: "00000000-0000-4000-8000-000000000003", name: "Data Entry", slug: "data-entry", description: "Registration status updates only" },
  { id: "00000000-0000-4000-8000-000000000004", name: "Coordinator", slug: "coordinator", description: "Read-only registrations and committees" },
];

const PERMISSIONS = [
  { resource: "registrations", action: "read", slug: "registrations.read" },
  { resource: "registrations", action: "create", slug: "registrations.create" },
  { resource: "registrations", action: "update", slug: "registrations.update" },
  { resource: "registrations", action: "delete", slug: "registrations.delete" },
  { resource: "registrations", action: "export", slug: "registrations.export" },
  { resource: "committees", action: "read", slug: "committees.read" },
  { resource: "committees", action: "manage", slug: "committees.manage" },
  { resource: "media", action: "read", slug: "media.read" },
  { resource: "media", action: "manage", slug: "media.manage" },
  { resource: "contact", action: "read", slug: "contact.read" },
  { resource: "contact", action: "manage", slug: "contact.manage" },
  { resource: "feedback", action: "read", slug: "feedback.read" },
  { resource: "feedback", action: "manage", slug: "feedback.manage" },
  { resource: "exports", action: "create", slug: "exports.create" },
  { resource: "payments", action: "read", slug: "payments.read" },
  { resource: "audit_logs", action: "read", slug: "audit_logs.read" },
  { resource: "users", action: "manage", slug: "users.manage" },
  { resource: "settings", action: "manage", slug: "settings.manage" },
];

const ROLE_PERMISSIONS = {
  "super-admin": PERMISSIONS.map((p) => p.slug),
  admin: [
    "registrations.read", "registrations.create", "registrations.update", "registrations.delete", "registrations.export",
    "committees.read", "committees.manage", "media.read", "media.manage",
    "contact.read", "contact.manage", "feedback.read", "feedback.manage",
    "exports.create", "payments.read", "audit_logs.read",
  ],
  "data-entry": ["registrations.read", "registrations.update"],
  coordinator: ["registrations.read", "committees.read"],
};

async function main() {
  for (const role of ROLES) {
    await prisma.role.upsert({
      where: { slug: role.slug },
      create: { ...role, isSystem: true },
      update: { name: role.name, description: role.description },
    });
  }

  const permissionBySlug = {};
  for (const perm of PERMISSIONS) {
    const row = await prisma.permission.upsert({
      where: { slug: perm.slug },
      create: perm,
      update: { resource: perm.resource, action: perm.action },
    });
    permissionBySlug[perm.slug] = row.id;
  }

  for (const [roleSlug, slugs] of Object.entries(ROLE_PERMISSIONS)) {
    const role = await prisma.role.findUniqueOrThrow({ where: { slug: roleSlug } });
    for (const slug of slugs) {
      const permissionId = permissionBySlug[slug];
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId } },
        create: { roleId: role.id, permissionId },
        update: {},
      });
    }
  }

  await prisma.registrationCounter.upsert({
    where: { prefix: "SMK2026" },
    create: { year: 2026, prefix: "SMK2026", lastNumber: 1 },
    update: { year: 2026 },
  });

  const settings = [
    { key: "registration.backend", value: "supabase", category: "registration" },
    { key: "registration.id_prefix", value: "SMK2026", category: "registration" },
    { key: "event.name", value: "Shiksha Mahakumbh 6.0", category: "event" },
  ];
  for (const s of settings) {
    await prisma.systemSetting.upsert({
      where: { key: s.key },
      create: { key: s.key, value: s.value, category: s.category },
      update: { value: s.value },
    });
  }

  console.log(JSON.stringify({ ok: true, roles: ROLES.length, permissions: PERMISSIONS.length }, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
