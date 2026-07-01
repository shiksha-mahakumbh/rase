#!/usr/bin/env node
/** Block accidental `prisma db push` against production-like databases. */
const url = process.env.DATABASE_URL ?? process.env.DIRECT_URL ?? "";

if (!url) {
  console.error("[db:push] DATABASE_URL or DIRECT_URL is required.");
  process.exit(1);
}

const looksProduction =
  /\.supabase\.co/i.test(url) ||
  /pooler\.supabase\.com/i.test(url) ||
  /rase\.co\.in/i.test(url) ||
  /vercel-storage\.com/i.test(url);

if (looksProduction && process.env.ALLOW_DB_PUSH !== "1") {
  console.error(
    "[db:push] Refusing to run against a production-like database URL.\n" +
      "Use: npm run db:migrate:deploy\n" +
      "Override only for emergencies: ALLOW_DB_PUSH=1 npm run db:push"
  );
  process.exit(1);
}
