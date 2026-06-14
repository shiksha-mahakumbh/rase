import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });

const prisma = new PrismaClient();

const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    authUserId: true,
    isActive: true,
    userRoles: { select: { role: { select: { name: true } } } },
  },
});
const roles = await prisma.role.findMany({ select: { id: true, name: true } });

const bootstrapConfigured = Boolean(
  (process.env.ADMIN_BOOTSTRAP_EMAILS ?? process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "").trim()
);

console.log(
  JSON.stringify(
    {
      bootstrapEnvConfigured: bootstrapConfigured,
      bootstrapEmailCount: (process.env.ADMIN_BOOTSTRAP_EMAILS ?? process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean).length,
      roles,
      users,
    },
    null,
    2
  )
);

await prisma.$disconnect();
