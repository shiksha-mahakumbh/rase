/** Prisma 6+ config (Prisma 7-ready). Seed moved from package.json#prisma. */
export default {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node scripts/supabase/seed-rbac.mjs",
  },
};
