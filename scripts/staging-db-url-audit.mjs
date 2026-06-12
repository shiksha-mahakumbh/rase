#!/usr/bin/env node
/** Audit DATABASE_URL host/port — never prints credentials. */
import fs from "node:fs";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const out = {};
  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    out[t.slice(0, i).trim()] = t.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
  return out;
}

function parseDbTarget(url) {
  if (!url) return { present: false };
  const hostPort = url.match(/@([^:/@]+):(\d+)/);
  const user = url.match(/postgresql:\/\/([^:@]+)/)?.[1] ?? null;
  return {
    present: true,
    host: hostPort?.[1] ?? "unparsed",
    port: hostPort?.[2] ?? "unparsed",
    user: user === "postgres" ? "postgres" : user?.startsWith("postgres.") ? "pooler-user" : "other",
    pgbouncer: url.includes("pgbouncer=true"),
    sslmode: url.includes("sslmode=") ? url.match(/sslmode=([^&]+)/)?.[1] : null,
    isLocal: /127\.0\.0\.1|localhost/.test(url),
    isSupabaseCloud: /\.supabase\.co/.test(url),
  };
}

const env = { ...loadEnvFile(".env"), ...loadEnvFile(".env.local") };
const report = {
  source: {
    dotenv: fs.existsSync(".env"),
    dotenvLocal: fs.existsSync(".env.local"),
    dotenvSupabaseExample: fs.existsSync(".env.supabase.example"),
  },
  DATABASE_URL: parseDbTarget(env.DATABASE_URL),
  DIRECT_URL: parseDbTarget(env.DIRECT_URL),
  supabaseLocalConfigPort: 54322,
  diagnosis:
    parseDbTarget(env.DATABASE_URL).isLocal && parseDbTarget(env.DATABASE_URL).port === "54322"
      ? "LOCAL_SUPABASE_CLI_NOT_RUNNING"
      : parseDbTarget(env.DATABASE_URL).isSupabaseCloud
        ? "REMOTE_SUPABASE_CONFIGURED"
        : "UNKNOWN_OR_MISCONFIGURED",
};

console.log(JSON.stringify(report, null, 2));
