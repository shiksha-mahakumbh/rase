#!/usr/bin/env node
/**
 * Test Supabase registration service (requires DATABASE_URL).
 * Usage: node scripts/test-supabase-registration.mjs
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const counter = await prisma.registrationCounter.findUnique({ where: { prefix: "SMK2026" } });
  console.log("counter:", counter);

  const total = await prisma.registration.count();
  console.log("registrations:", total);

  const recent = await prisma.registration.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
    select: { registrationId: true, registrationType: true, fullName: true },
  });
  console.log("recent:", recent);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
