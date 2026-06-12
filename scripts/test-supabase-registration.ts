/**
 * Run: npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/test-supabase-registration.ts
 * Or: node scripts/test-supabase-registration.mjs
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const counter = await prisma.registrationCounter.findUnique({ where: { prefix: "SMK2026" } });
  console.log(JSON.stringify({ counter, total: await prisma.registration.count() }, null, 2));
}

main().finally(() => prisma.$disconnect());
